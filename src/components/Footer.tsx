"use client";

import { useEffect, useState } from "react";

type FooterProps = {
  className?: string;
};

export function Footer({ className = "" }: FooterProps) {
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
    <footer className={`w-full z-120 ${className}`}>
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4 font-sans font-medium text-[11px] tracking-[0.12em] text-white/90 drop-shadow-[0_4px_12px_rgba(0,0,0,0.45)]">
        <button
          type="button"
          onClick={() => setIsPrivacyOpen(true)}
          className="group relative inline-flex items-center gap-2 text-xs md:text-sm transition-colors hover:text-white focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-white/60"
          aria-label="Atlas privacy and policy menu"
        >
          <span>Atlas privacy &amp; policy</span>
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
          aria-label="Scroll to top"
        >
          <span>All rights reserved.</span>
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

          <div className="relative mx-auto flex h-full max-w-xl flex-col items-center justify-center gap-10 px-6 py-12 text-center text-white">
            <div className="relative w-full min-h-128 overflow-hidden rounded-3xl border border-white/15 bg-white/5 px-8 py-14 shadow-[0_30px_60px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
              <div
                className="absolute inset-x-24 -top-36 h-48 rounded-full bg-white/10 blur-3xl"
                aria-hidden
              />
              <p className="font-mono uppercase tracking-[0.4em] text-xs text-white/50">
                Privacy &amp; Policy
              </p>
              <h2 className="mt-6 font-serif text-3xl md:text-4xl">
                We keep our data practices transparent so you can trust every
                Atlas product you choose.
              </h2>
              <div className="mt-10 space-y-6 text-left font-sans text-sm leading-relaxed text-white/85 md:text-base">
                <p>
                  - We use personal information solely to deliver our services
                  and communications, and never share it with third parties
                  without explicit consent.
                </p>
                <p>
                  - Collected data is encrypted at rest and access is limited to
                  the minimum necessary personnel.
                </p>
                <p>
                  - Logs and analytics are anonymized before use so we can
                  improve the experience without identifying individual users.
                </p>
                <p>
                  - If you have any questions, contact us at{" "}
                  <a
                    href="mailto:privacy@atlas.inc"
                    className="underline decoration-white/40 underline-offset-4 hover:text-white"
                  >
                    privacy@atlas.inc
                  </a>{" "}
                  までお問い合わせください。
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsPrivacyOpen(false)}
              className="px-6 py-3 font-sans text-sm uppercase tracking-[0.3em] text-white/70 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/40"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </footer>
  );
}
