"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  buildContactSubject,
  CONTACT_ENTRIES,
  CONTACT_ENTRY_IDS,
  type ContactContext,
  type ContactEntryId,
} from "@/models/contact";
import { useLocale } from "@/providers/LanguageProvider";

const ContactFormSchema = z.object({
  name: z
    .string()
    .min(1, "お名前は必須です")
    .max(100, "お名前は100文字以内で入力してください"),
  email: z
    .string()
    .min(1, "メールアドレスは必須です")
    .email("メールアドレスの形式が正しくありません")
    .max(256, "メールアドレスは256文字以内で入力してください"),
  message: z
    .string()
    .min(1, "お問い合わせ内容は必須です")
    .max(2000, "お問い合わせ内容は2000文字以内で入力してください"),
  subject: z
    .string()
    .max(120, "件名は120文字以内で入力してください")
    .optional(),
});

type ContactFormValues = z.infer<typeof ContactFormSchema>;

type ContactModalProps = {
  isOpen: boolean;
  entryId: ContactEntryId | null;
  context?: ContactContext;
  onClose: () => void;
};

export function ContactModal({
  isOpen,
  entryId,
  context,
  onClose,
}: ContactModalProps) {
  const { locale } = useLocale();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(ContactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const activeEntry =
    entryId && CONTACT_ENTRY_IDS.includes(entryId)
      ? CONTACT_ENTRIES[entryId]
      : null;

  const isSubjectEditable = Boolean(activeEntry?.subjectEditable);
  const autoSubject =
    activeEntry && !activeEntry.subjectEditable
      ? buildContactSubject(
          activeEntry.subjectTemplate,
          context?.titleForSubject,
        )
      : "";

  const handleClose = () => {
    if (isSubmitting) {
      return;
    }
    setSubmitError(null);
    setSubmitSuccess(false);
    form.reset();
    onClose();
  };

  const onSubmit = async (values: ContactFormValues) => {
    if (!entryId) {
      setSubmitError("お問い合わせ種別が特定できませんでした。");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    if (isSubjectEditable) {
      const trimmedSubject = values.subject?.trim() ?? "";
      if (!trimmedSubject) {
        setSubmitError("件名を入力してください。");
        setIsSubmitting(false);
        return;
      }
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          entryId,
          context,
          userSubject: isSubjectEditable
            ? (values.subject?.trim() ?? "")
            : undefined,
          name: values.name.trim(),
          email: values.email.trim(),
          message: values.message.trim(),
        }),
      });

      const data = (await response.json()) as {
        ok?: boolean;
        error?: string;
      };

      if (!response.ok || !data.ok) {
        setSubmitError(
          data.error ??
            "お問い合わせの送信に失敗しました。時間をおいてから再度お試しください。",
        );
        return;
      }

      setSubmitSuccess(true);
      form.reset();
    } catch (_error) {
      setSubmitError(
        "お問い合わせの送信に失敗しました。時間をおいてから再度お試しください。",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  const heading =
    locale === "ja"
      ? (activeEntry?.label ?? "お問い合わせ")
      : (activeEntry?.label ?? "Contact Atlas");

  return (
    <div className="fixed inset-0 z-140 animate-in fade-in duration-300">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity"
        onClick={handleClose}
        aria-hidden="true"
      />
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-6">
          <div
            className="relative w-full max-w-xl transform overflow-hidden rounded-[2rem] border border-white/10 bg-[#111]/90 px-6 py-8 text-left shadow-[0_0_80px_rgba(0,0,0,0.5)] backdrop-blur-xl transition-all animate-in zoom-in-95 duration-300 sm:px-10 sm:py-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="absolute inset-x-20 -top-40 h-60 rounded-full bg-white/[0.03] blur-3xl"
              aria-hidden="true"
            />
            <div className="relative space-y-8">
              <div className="space-y-2 text-center sm:text-left">
                <h2 className="font-serif text-2xl md:text-3xl tracking-wide text-white">
                  {heading}
                </h2>
                <p className="text-xs leading-relaxed text-white/60 sm:text-sm font-light">
                  {locale === "ja"
                    ? "以下のフォームに必要事項をご記入のうえ送信してください。内容を確認のうえ、担当者よりご連絡いたします。"
                    : "Please fill in the form below and we will get back to you shortly."}
                </p>
              </div>

              {submitError && (
                <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs text-red-200 sm:text-sm">
                  {submitError}
                </div>
              )}
              {submitSuccess && (
                <div className="rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-xs text-white sm:text-sm">
                  {locale === "ja"
                    ? "お問い合わせを送信しました。内容を確認のうえ、担当者からご連絡いたします。"
                    : "Your message has been sent. We will review it and get back to you."}
                </div>
              )}

              {!submitSuccess ? (
                <form
                  className="space-y-5 sm:space-y-6"
                  onSubmit={form.handleSubmit(onSubmit)}
                >
                  <div className="space-y-2">
                    {isSubjectEditable ? (
                      <>
                        <label
                          htmlFor="contact-subject"
                          className="block text-xs font-medium tracking-wider text-white/70 uppercase"
                        >
                          {locale === "ja" ? "件名" : "Subject"}
                          <span className="ml-1 text-red-400">*</span>
                        </label>
                        <input
                          id="contact-subject"
                          type="text"
                          {...form.register("subject")}
                          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-white/40 focus:bg-white/10 focus:outline-none focus:ring-0 transition-colors"
                          placeholder={
                            locale === "ja"
                              ? "例）PoC のご相談について"
                              : "e.g. Inquiry about PoC"
                          }
                        />
                        {form.formState.errors.subject && (
                          <p className="text-[11px] text-red-400 font-medium">
                            {form.formState.errors.subject.message}
                          </p>
                        )}
                      </>
                    ) : (
                      <>
                        <p className="block text-xs font-medium tracking-wider text-white/50 uppercase">
                          {locale === "ja" ? "件名" : "Subject"}
                        </p>
                        <p className="rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3 text-sm text-white/60">
                          {autoSubject}
                        </p>
                      </>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="contact-name"
                      className="block text-xs font-medium tracking-wider text-white/70 uppercase"
                    >
                      {locale === "ja" ? "お名前" : "Name"}
                      <span className="ml-1 text-red-400">*</span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      autoComplete="name"
                      {...form.register("name")}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-white/40 focus:bg-white/10 focus:outline-none focus:ring-0 transition-colors"
                    />
                    {form.formState.errors.name && (
                      <p className="text-[11px] text-red-400 font-medium">
                        {form.formState.errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="contact-email"
                      className="block text-xs font-medium tracking-wider text-white/70 uppercase"
                    >
                      {locale === "ja" ? "メールアドレス" : "Email"}
                      <span className="ml-1 text-red-400">*</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      autoComplete="email"
                      {...form.register("email")}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-white/40 focus:bg-white/10 focus:outline-none focus:ring-0 transition-colors"
                    />
                    {form.formState.errors.email && (
                      <p className="text-[11px] text-red-400 font-medium">
                        {form.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="contact-message"
                      className="block text-xs font-medium tracking-wider text-white/70 uppercase"
                    >
                      {locale === "ja" ? "お問い合わせ内容" : "Message"}
                      <span className="ml-1 text-red-400">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      rows={8}
                      {...form.register("message")}
                      className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-white/40 focus:bg-white/10 focus:outline-none focus:ring-0 transition-colors scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
                    />
                    {form.formState.errors.message && (
                      <p className="text-[11px] text-red-400 font-medium">
                        {form.formState.errors.message.message}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-8">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="text-xs tracking-wider text-white/40 hover:text-white transition-colors uppercase"
                    >
                      {locale === "ja" ? "キャンセル" : "Cancel"}
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-xs font-bold tracking-[0.2em] text-black transition-all hover:bg-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 disabled:cursor-not-allowed disabled:opacity-50 uppercase"
                    >
                      {isSubmitting
                        ? locale === "ja"
                          ? "送信中..."
                          : "Sending..."
                        : locale === "ja"
                          ? "送信する"
                          : "Send"}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex justify-end pt-6">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="inline-flex items-center justify-center rounded-full border border-white/40 px-6 py-2 text-xs font-semibold tracking-[0.18em] text-white/80 transition hover:border-white hover:text-white uppercase"
                  >
                    {locale === "ja" ? "閉じる" : "Close"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
