import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { sendContactEmail } from "@/lib/email/send-contact-email";
import { notifySlackContactMessage } from "@/lib/notifications/slack-contact";
import {
  evaluateContactRateLimit,
  getContactRateLimitIdentifier,
} from "@/lib/security/contact-rate-limit";
import { supabase } from "@/lib/supabase/server";
import {
  buildContactSubject,
  CONTACT_ENTRIES,
  CONTACT_ENTRY_IDS,
  type ContactContext,
  type ContactEntryId,
} from "@/models/contact";
import { getNewsItemById } from "@/models/news";
import { getPositionById } from "@/models/positions";

const ContactRequestSchema = z.object({
  entryId: z.enum(CONTACT_ENTRY_IDS),
  context: z
    .object({
      newsId: z.string().max(128).optional(),
      positionId: z.string().max(128).optional(),
      titleForSubject: z.string().max(256).optional(),
    })
    .partial()
    .optional(),
  name: z
    .string()
    .min(1, "お名前は必須です")
    .max(100, "お名前は100文字以内で入力してください")
    .transform((value) => value.trim()),
  email: z
    .string()
    .min(1, "メールアドレスは必須です")
    .email("メールアドレスの形式が正しくありません")
    .max(256, "メールアドレスは256文字以内で入力してください")
    .transform((value) => value.trim()),
  message: z
    .string()
    .min(1, "お問い合わせ内容は必須です")
    .max(2000, "お問い合わせ内容は2000文字以内で入力してください")
    .transform((value) => value.trim()),
  userSubject: z
    .string()
    .max(120, "件名は120文字以内で入力してください")
    .optional()
    .transform((value) => (typeof value === "string" ? value.trim() : value)),
});

type ContactRequest = z.infer<typeof ContactRequestSchema>;

async function resolveContactTarget(
  entryId: ContactEntryId,
  context: ContactContext | undefined,
  userSubject: string | undefined,
) {
  const config = CONTACT_ENTRIES[entryId];

  if (!config) {
    throw new Error(`Unknown contact entryId: ${entryId}`);
  }

  if (config.kind === "generic") {
    if (!config.defaultTo) {
      throw new Error(`Contact config for ${entryId} has no defaultTo`);
    }

    return {
      to: config.defaultTo,
      subject:
        config.subjectEditable && userSubject && userSubject.length > 0
          ? userSubject
          : buildContactSubject(config.subjectTemplate),
    };
  }

  if (config.kind === "news") {
    const newsId = context?.newsId;
    if (!newsId) {
      throw new Error("newsId is required for news-article contact");
    }

    const item = await getNewsItemById(newsId);
    if (!item) {
      throw new Error(`News item not found for id: ${newsId}`);
    }

    const to = item.contactEmail ?? config.defaultTo;
    if (!to) {
      throw new Error(
        `News item ${newsId} does not have contactEmail and no defaultTo is configured`,
      );
    }

    return {
      to,
      subject: buildContactSubject(config.subjectTemplate, item.title),
    };
  }

  if (config.kind === "position") {
    const positionId = context?.positionId;
    if (!positionId) {
      throw new Error("positionId is required for position-apply contact");
    }

    const position = await getPositionById(positionId);
    if (!position) {
      throw new Error(`Position not found for id: ${positionId}`);
    }

    const to = position.applyEmail ?? config.defaultTo;
    if (!to) {
      throw new Error(
        `Position ${positionId} does not have applyEmail and no defaultTo is configured`,
      );
    }

    return {
      to,
      subject: buildContactSubject(config.subjectTemplate, position.title),
    };
  }

  throw new Error(
    `Unsupported contact entry kind: ${config.kind satisfies never}`,
  );
}

export async function POST(request: NextRequest) {
  const identifier = getContactRateLimitIdentifier(request);
  const rateLimitEvaluation = evaluateContactRateLimit(identifier);

  if (!rateLimitEvaluation.allowed) {
    const retryAfterSeconds = Math.max(
      1,
      Math.floor((rateLimitEvaluation.blockedUntil - Date.now()) / 1000),
    );

    return NextResponse.json(
      {
        ok: false,
        error:
          "短時間に多数の送信が行われたため、一時的にお問い合わせ送信を制限しています。しばらく時間をおいてから再度お試しください。",
      },
      {
        status: 429,
        headers: {
          "Retry-After": retryAfterSeconds.toString(),
        },
      },
    );
  }

  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "不正なリクエストです。",
      },
      { status: 400 },
    );
  }

  const parsed = ContactRequestSchema.safeParse(rawBody);

  if (!parsed.success) {
    // クライアントには具体的なバリデーション内容を返さず、汎用的なメッセージにする
    return NextResponse.json(
      {
        ok: false,
        error: "入力内容に誤りがあります。各項目を確認して再度お試しください。",
      },
      { status: 400 },
    );
  }

  const body: ContactRequest = parsed.data;

  try {
    const target = await resolveContactTarget(
      body.entryId,
      body.context,
      body.userSubject,
    );

    const lines = [
      `【お問い合わせ種別】${CONTACT_ENTRIES[body.entryId]?.label ?? body.entryId}`,
      "",
      `【お名前】${body.name}`,
      `【メールアドレス】${body.email}`,
      "",
      "【お問い合わせ内容】",
      body.message,
      "",
      "---",
      "送信元コンテキスト（閲覧中のページなど）",
    ];

    if (body.context?.newsId) {
      lines.push(`- newsId: ${body.context.newsId}`);
    }

    if (body.context?.positionId) {
      lines.push(`- positionId: ${body.context.positionId}`);
    }

    const [insertResult] = await Promise.all([
      supabase.from("contact_messages").insert({
        entry_id: body.entryId,
        subject: target.subject,
        user_subject: body.userSubject ?? null,
        name: body.name,
        email: body.email,
        message: body.message,
        context: body.context ?? null,
        user_agent: request.headers.get("user-agent") ?? null,
        remote_addr:
          request.headers.get("x-forwarded-for") ??
          request.headers.get("x-real-ip") ??
          request.headers.get("cf-connecting-ip") ??
          null,
      }),
      sendContactEmail({
        to: target.to,
        subject: target.subject,
        text: lines.join("\n"),
      }),
      notifySlackContactMessage({
        entryId: body.entryId,
        subject: target.subject,
        name: body.name,
        email: body.email,
        message: body.message,
      }),
    ]);

    if (insertResult.error) {
      console.error(
        "Failed to insert contact message into Supabase:",
        insertResult.error,
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to handle contact request:", error);
    return NextResponse.json(
      {
        ok: false,
        error:
          "お問い合わせの送信中にエラーが発生しました。お手数ですが、時間をおいてから再度お試しください。",
      },
      { status: 500 },
    );
  }
}
