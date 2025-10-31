"use client";

import { useEffect, useState } from "react";

type TypewriterProps = {
  text: string;
  startDelay?: number;
  className?: string;
};

function Typewriter({ text, startDelay = 0, className }: TypewriterProps) {
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
      const base = 55 + Math.random() * 65;
      if (",。,.!?".includes(char)) {
        return base + 220;
      }
      if (char === " ") {
        return base + 140;
      }
      if (/[A-Z]/.test(char)) {
        return base + 40;
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
  }, [text, startDelay]);

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
      className="min-h-screen snap-start snap-always flex flex-col items-center justify-center px-6 py-24 text-center"
    >
      <div className="flex flex-col items-center gap-4 font-mono text-black">
        <span className="uppercase tracking-[0.4em] text-sm md:text-base text-black/50">
          We are Atlas
        </span>
        <Typewriter
          text="人類のためになる"
          className="text-2xl md:text-4xl tracking-wide"
        />
        <Typewriter
          text="For the benefit of humanity"
          startDelay={1800}
          className="text-xl md:text-3xl tracking-[0.25em] text-black/80"
        />
      </div>
    </section>
  );
}
