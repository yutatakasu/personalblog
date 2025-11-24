"use client";

import {
  ChevronLeft,
  ChevronRight,
  Mail,
  MessageSquare,
  User,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { getAdminSupabaseClient } from "@/lib/supabase/admin";

type ContactMessage = {
  id: string;
  entryId: string;
  subject: string;
  userSubject?: string | null;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  context: Record<string, unknown> | null;
};

const ENTRY_LABELS: Record<string, string> = {
  "news-article": "News",
  "position-apply": "Positions",
  "careers-general": "Careers",
  "company-general": "Contact",
  "privacy-inquiry": "Privacy",
};

function formatDateTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const PAGE_SIZE = 50;

export default function ContactMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState<number | null>(null);

  const totalPages = useMemo(() => {
    if (totalCount === null) {
      return null;
    }
    return Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  }, [totalCount]);

  useEffect(() => {
    const loadMessages = async () => {
      setLoading(true);
      setError(null);

      try {
        const supabase = getAdminSupabaseClient();
        const from = (page - 1) * PAGE_SIZE;
        const to = from + PAGE_SIZE - 1;

        const {
          data,
          error: supabaseError,
          count,
        } = await supabase
          .from("contact_messages")
          .select("*", { count: "exact" })
          .order("created_at", { ascending: false })
          .range(from, to);

        if (supabaseError) {
          console.error("Failed to fetch contact messages:", supabaseError);
          setError(
            "お問い合わせ履歴の取得に失敗しました。時間をおいて再度お試しください。",
          );
          setMessages([]);
          setLoading(false);
          return;
        }

        const normalized: ContactMessage[] =
          data?.map((item) => ({
            id: item.id,
            entryId: item.entry_id,
            subject: item.subject,
            userSubject: item.user_subject ?? null,
            name: item.name,
            email: item.email,
            message: item.message,
            createdAt: item.created_at,
            context: (item.context as Record<string, unknown> | null) ?? null,
          })) ?? [];

        setMessages(normalized);
        setTotalCount(count ?? 0);
      } catch (err) {
        console.error("Unexpected error while fetching contact messages:", err);
        setError("お問い合わせ履歴の取得中にエラーが発生しました。");
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    void loadMessages();
  }, [page]);

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-neutral-400">
          Atlas Admin
        </p>
        <h1 className="text-3xl font-semibold text-neutral-900">
          お問い合わせ履歴
        </h1>
        <p className="max-w-2xl text-sm text-neutral-600">
          会社サイトのフォームから送信されたお問い合わせを一覧表示します。最新順に
          1 ページあたり {PAGE_SIZE} 件を表示します。
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      <div className="rounded-xl border border-neutral-200 bg-white/80 shadow-sm">
        <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-neutral-500" />
            <p className="text-sm font-semibold text-neutral-800">
              受信メッセージ
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs text-neutral-500">
            <p>
              件数:{" "}
              <span className="font-semibold">
                {loading ? "…" : (totalCount ?? 0)}
              </span>
            </p>
            {totalPages && totalPages > 1 && (
              <p>
                ページ:{" "}
                <span className="font-semibold">
                  {page} / {totalPages}
                </span>
              </p>
            )}
          </div>
        </div>

        <div className="divide-y divide-neutral-100">
          {loading ? (
            <div className="px-4 py-10 text-center text-sm text-neutral-500 sm:px-6">
              読み込み中です…
            </div>
          ) : messages.length === 0 ? (
            <div className="px-4 py-10 text-center text-sm text-neutral-500 sm:px-6">
              まだお問い合わせはありません。
            </div>
          ) : (
            messages.map((message) => {
              const label = ENTRY_LABELS[message.entryId] ?? message.entryId;
              const createdAt = formatDateTime(message.createdAt);
              const contextBadges: string[] = [];

              if (message.context && typeof message.context === "object") {
                const { newsId, positionId, titleForSubject } =
                  message.context as {
                    newsId?: string;
                    positionId?: string;
                    titleForSubject?: string;
                  };
                if (newsId) {
                  contextBadges.push(`newsId: ${newsId}`);
                }
                if (positionId) {
                  contextBadges.push(`positionId: ${positionId}`);
                }
                if (titleForSubject) {
                  contextBadges.push(`title: ${titleForSubject}`);
                }
              }

              return (
                <article
                  key={message.id}
                  className="flex flex-col gap-3 px-4 py-4 sm:px-6 sm:py-5"
                >
                  <header className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center rounded-full bg-neutral-900 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
                          {label}
                        </span>
                        <span className="text-xs text-neutral-500">
                          {createdAt}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-neutral-900">
                        {message.subject}
                      </p>
                      {message.userSubject &&
                      message.userSubject !== message.subject ? (
                        <p className="text-xs text-neutral-500">
                          ユーザー入力件名: {message.userSubject}
                        </p>
                      ) : null}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-600">
                      <span className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-neutral-50 px-2 py-1">
                        <User className="h-3 w-3" />
                        <span>{message.name}</span>
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-neutral-50 px-2 py-1">
                        <Mail className="h-3 w-3" />
                        <span className="truncate max-w-[180px]">
                          {message.email}
                        </span>
                      </span>
                      {contextBadges.length > 0 && (
                        <span className="inline-flex flex-wrap items-center gap-1 rounded-full border border-neutral-200 bg-neutral-50 px-2 py-1">
                          <MessageSquare className="h-3 w-3" />
                          <span className="truncate max-w-[220px]">
                            {contextBadges.join(" / ")}
                          </span>
                        </span>
                      )}
                    </div>
                  </header>
                  <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-3 text-sm leading-relaxed text-neutral-800">
                    {message.message.split("\n").map((line, index) => (
                      <p key={`${message.id}-line-${index}`}>
                        {line || <>&nbsp;</>}
                      </p>
                    ))}
                  </div>
                </article>
              );
            })
          )}
        </div>
      </div>

      {totalPages && totalPages > 1 ? (
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page === 1 || loading}
            className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs text-neutral-600 transition hover:border-neutral-900 hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="h-3 w-3" />
            前へ
          </button>
          {Array.from({ length: totalPages }).map((_, index) => {
            const pageNumber = index + 1;
            const isActive = pageNumber === page;
            return (
              <button
                key={pageNumber}
                type="button"
                onClick={() => setPage(pageNumber)}
                disabled={loading}
                className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition ${
                  isActive
                    ? "bg-neutral-900 text-white"
                    : "border border-neutral-200 bg-white text-neutral-700 hover:border-neutral-900 hover:text-neutral-900"
                }`}
              >
                {pageNumber}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() =>
              setPage((prev) =>
                totalPages ? Math.min(totalPages, prev + 1) : prev,
              )
            }
            disabled={totalPages ? page === totalPages || loading : true}
            className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs text-neutral-600 transition hover:border-neutral-900 hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-40"
          >
            次へ
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
