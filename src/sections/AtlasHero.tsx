"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type TypewriterProps = {
  text: string;
  startDelay?: number;
  className?: string;
  delayProfile?: "natural" | "uniform";
};

function Typewriter({
  text,
  startDelay = 0,
  className,
  delayProfile = "natural",
}: TypewriterProps) {
  const [displayed, setDisplayed] = useState("");
  const [isCursorVisible, setIsCursorVisible] = useState(true);

  useEffect(() => {
    setDisplayed("");
    setIsCursorVisible(true);

    const characters = Array.from(text);
    let index = 0;
    let typingTimeout: ReturnType<typeof setTimeout> | null = null;
    let blinkInterval: ReturnType<typeof setInterval> | null = null;

    const getDelay = (char: string) => {
      const base = 110 + Math.random() * 120;
      if (delayProfile === "uniform") {
        return base;
      }
      if (",。,.!?".includes(char)) {
        return base + 260;
      }
      if (char === " ") {
        return base + 180;
      }
      if (/[A-Z]/.test(char)) {
        return base + 80;
      }
      return base;
    };

    const startBlinking = () => {
      if (blinkInterval) return;
      blinkInterval = setInterval(() => {
        setIsCursorVisible((prev) => !prev);
      }, 500);
    };

    const typeNext = () => {
      if (index < characters.length) {
        index += 1;
        setDisplayed(characters.slice(0, index).join(""));
        const lastChar = characters[index - 1] ?? "";
        typingTimeout = setTimeout(typeNext, getDelay(lastChar));
        return;
      }

      startBlinking();
    };

    const startTimeout = setTimeout(() => {
      typeNext();
    }, startDelay);

    return () => {
      clearTimeout(startTimeout);
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
      if (blinkInterval) {
        clearInterval(blinkInterval);
      }
    };
  }, [delayProfile, startDelay, text]);

  return (
    <span className={`inline-flex items-center ${className ?? ""}`}>
      <span>{displayed}</span>
      <span
        aria-hidden
        className={`ml-1 inline-block h-[1.1em] w-[2px] bg-current transition-opacity duration-150 ${
          isCursorVisible ? "opacity-100" : "opacity-0"
        }`}
      />
    </span>
  );
}

export function AtlasHero() {
  return (
    <section
      id="atlas"
      className="relative snap-start snap-always flex min-h-screen justify-center text-center"
    >
      <div className="flex w-full max-w-4xl flex-col px-4 pb-8 pt-24 font-mono text-black sm:px-6 sm:pb-12 sm:pt-28 md:px-8 md:pb-16 md:pt-32 lg:px-10 lg:pb-20 lg:pt-36 xl:pb-28 xl:pt-40 2xl:pb-32 2xl:pt-44">
        <div className="shrink-0">
          <h2 className="text-xl uppercase tracking-[0.25em] text-black/50 sm:text-2xl sm:tracking-[0.3em] md:text-4xl md:tracking-[0.4em] lg:text-5xl">
            We are Atlas
          </h2>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-4 sm:gap-5 md:gap-6">
            <Typewriter
              text="人類のためになる"
              className="text-lg tracking-wide sm:text-xl md:text-2xl lg:text-4xl"
              delayProfile="uniform"
            />
            <div className="relative inline-block">
              <Typewriter
                text="For the benefit of humanity"
                startDelay={1800}
                className="text-sm tracking-[0.15em] text-black/80 sm:text-base sm:tracking-[0.2em] md:text-lg md:tracking-[0.25em] lg:text-3xl"
                delayProfile="uniform"
              />
              <Link
                href="/positions#open-roles"
                className="mt-10 flex items-center justify-center gap-2 whitespace-nowrap font-serif text-sm text-[#2a2a2a]/70 transition hover:text-[#2a2a2a] sm:text-base md:absolute md:bottom-0 md:right-0 md:ml-24 md:mt-32 md:translate-x-full md:translate-y-full md:justify-start md:text-xl lg:text-2xl lg:ml-32 lg:mt-48 xl:ml-40 xl:mt-64"
              >
                Join our team
                <span aria-hidden className="text-[#2a2a2a]/50">
                  →
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
