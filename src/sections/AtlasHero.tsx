"use client";

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
      className="snap-start snap-always flex min-h-svh items-center justify-center text-center"
    >
      <div className="flex flex-col items-center gap-4 px-6 py-16 font-mono text-black sm:py-20 lg:py-24">
        <h2 className="text-2xl uppercase tracking-[0.3em] text-black/50 sm:text-3xl md:text-5xl md:tracking-[0.4em]">
          We are Atlas
        </h2>
        <div className="mt-20 flex flex-col items-center gap-5 sm:mt-28 md:mt-40">
          <Typewriter
            text="人類のためになる"
            className="text-xl tracking-wide sm:text-2xl md:text-4xl"
            delayProfile="uniform"
          />
          <Typewriter
            text="For the benefit of humanity"
            startDelay={1800}
            className="text-base tracking-[0.2em] text-black/80 sm:text-lg sm:tracking-[0.25em] md:text-3xl"
            delayProfile="uniform"
          />
        </div>
      </div>
    </section>
  );
}
