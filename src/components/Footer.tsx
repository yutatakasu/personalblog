"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/providers/LanguageProvider";

type FooterProps = {
  className?: string;
};

const translations = {
  en: {
    privacyPolicy: "Atlas privacy & policy",
    privacyPolicyTitle: "Privacy & Policy",
    heading:
      "We ensure complete transparency in data handling so you can use Atlas products with confidence.",
    point1:
      "Personal information is used solely for service provision and communication purposes, and will not be shared with third parties without appropriate consent.",
    point2:
      "Collected data is encrypted and stored with access permissions restricted to the minimum necessary.",
    point3:
      "Logs and analytics information are anonymized before use to help improve user experience.",
    point4: "If you have any questions, please contact us at",
    point4Suffix: "",
    close: "Close",
    scrollToTop: "Scroll to top",
    allRightsReserved: "All rights reserved.",
  },
  ja: {
    privacyPolicy: "Atlas privacy & policy",
    privacyPolicyTitle: "Privacy & Policy",
    heading:
      "私たちは、Atlas のプロダクトを安心して利用いただくために、データの取り扱いを徹底して透明化します。",
    point1:
      "個人情報は、サービス提供とコミュニケーションの目的のみに利用し、第三者へは適切な同意なく提供しません。",
    point2:
      "取得したデータは暗号化して保存し、アクセス権限を最小限に制限します。",
    point3:
      "ログや分析情報は匿名化した上で活用し、ユーザー体験の改善に役立てます。",
    point4: "ご不明点があれば",
    point4Suffix: " までお問い合わせください。",
    close: "閉じる",
    scrollToTop: "トップへスクロール",
    allRightsReserved: "All rights reserved.",
  },
} as const;

export function Footer({ className = "" }: FooterProps) {
  const { locale } = useLocale();
  const t = translations[locale];
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  useEffect(() => {
    if (!isPrivacyOpen) {
      return undefined;
    }

    if (typeof document === "undefined") {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isPrivacyOpen]);

  useEffect(() => {
    if (!isPrivacyOpen) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsPrivacyOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isPrivacyOpen]);

  const handleScrollTop = () => {
    if (typeof window === "undefined") {
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      className={`w-full z-120 pb-[calc(env(safe-area-inset-bottom,0px)+1rem)] ${className}`}
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col items-start gap-3 px-6 py-4 font-sans font-medium text-[11px] tracking-[0.12em] text-white/90 drop-shadow-[0_4px_12px_rgba(0,0,0,0.45)] sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={() => setIsPrivacyOpen(true)}
          className="group relative inline-flex items-center gap-2 text-xs md:text-sm transition-colors hover:text-white focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-white/60"
          aria-label="Atlas privacy and policy menu"
        >
          <span>{t.privacyPolicy}</span>
          <span
            aria-hidden
            className="translate-x-0 text-[0.7rem] text-white/70 transition-transform group-hover:translate-x-0.5 group-hover:text-white"
          >
            →
          </span>
          <span className="pointer-events-none absolute -bottom-1 left-0 h-px w-full scale-x-0 bg-white/75 transition-transform duration-200 group-hover:scale-x-100" />
        </button>
        <button
          type="button"
          onClick={handleScrollTop}
          className="group relative inline-flex items-center gap-2 text-xs md:text-sm transition-colors hover:text-white focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-white/60"
          aria-label={t.scrollToTop}
        >
          <span>{t.allRightsReserved}</span>
          <span
            aria-hidden
            className="translate-x-0 text-[0.7rem] text-white/70 transition-transform group-hover:-translate-x-0.5 group-hover:text-white"
          >
            ↑
          </span>
          <span className="pointer-events-none absolute -bottom-1 left-0 h-px w-full scale-x-0 bg-white/75 transition-transform duration-200 group-hover:scale-x-100" />
        </button>
      </div>

      {isPrivacyOpen && (
        <div className="fixed inset-0 z-130">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur"
            onClick={() => setIsPrivacyOpen(false)}
            aria-hidden="true"
          />

          <div className="relative mx-auto flex h-full max-w-3xl flex-col items-center justify-center gap-10 px-6 py-12 text-center text-white">
            <div className="relative w-full overflow-hidden rounded-3xl border border-white/15 bg-white/5 px-8 py-12 shadow-[0_30px_60px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
              <div
                className="absolute inset-x-24 -top-36 h-48 rounded-full bg-white/10 blur-3xl"
                aria-hidden
              />
              <p className="font-mono uppercase tracking-[0.4em] text-xs text-white/50">
                {t.privacyPolicyTitle}
              </p>
              <h2 className="mt-6 font-serif text-3xl md:text-4xl">
                {t.heading}
              </h2>
              <div className="mt-8 space-y-5 text-left font-sans text-sm leading-relaxed text-white/85 md:text-base">
                <p>- {t.point1}</p>
                <p>- {t.point2}</p>
                <p>- {t.point3}</p>
                <p>
                  - {t.point4}{" "}
                  <a
                    href="mailto:info@atlas-official.net"
                    className="underline decoration-white/40 underline-offset-4 hover:text-white"
                  >
                    info@atlas-official.net
                  </a>
                  {t.point4Suffix}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsPrivacyOpen(false)}
              className="px-6 py-3 font-sans text-sm uppercase tracking-[0.3em] text-white/70 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/40"
            >
              {t.close}
            </button>
          </div>
        </div>
      )}
    </footer>
  );
}
