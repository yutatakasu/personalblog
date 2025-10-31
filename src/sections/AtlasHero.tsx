"use client";

import { useEffect, useState } from "react";

type TypewriterProps = {
  text: string;
  startDelay?: number;
  className?: string;
};

function Typewriter({ text, startDelay = 0, className }: TypewriterProps) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | null = null;
    setDisplayed("");
    const timeoutId = setTimeout(() => {
      let index = 0;
      const characters = Array.from(text);
      intervalId = setInterval(() => {
        setDisplayed(characters.slice(0, index + 1).join(""));
        index += 1;
        if (index >= characters.length && intervalId) {
          clearInterval(intervalId);
        }
      }, 120);
    }, startDelay);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [text, startDelay]);

  return <span className={className}>{displayed}</span>;
}

export function AtlasHero() {
  return (
    <section
      id="atlas"
      className="min-h-screen snap-start flex flex-col items-center justify-center px-6 py-24 text-center scroll-mt-[72px]"
    >
      <div className="flex flex-col items-center gap-2 text-sm md:text-base font-mono text-black/70">
        <span className="uppercase tracking-[0.3em] text-xs md:text-sm text-black/40">
          We are Atlas
        </span>
        <Typewriter text="人類のためになる" />
        <Typewriter
          text="For the benefit of humanity"
          startDelay={1800}
          className="tracking-[0.2em]"
        />
      </div>
      <p className="font-mono uppercase tracking-[0.3em] text-xs md:text-sm text-black/40">
        Atlas Corporation
      </p>
      <h1 className="mt-6 font-serif text-3xl md:text-5xl lg:text-6xl leading-snug text-black max-w-2xl">
        We craft intelligent systems that elevate human capability.
      </h1>
    </section>
  );
}
