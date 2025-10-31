"use client";

import { useEffect } from "react";

export function ScrollToAtlas() {
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    requestAnimationFrame(() => {
      const main = document.querySelector("main");
      if (main instanceof HTMLElement) {
        main.scrollTo({ top: 0, behavior: "auto" });
      }

      const atlasSection = document.getElementById("atlas");
      if (atlasSection) {
        atlasSection.scrollIntoView({ behavior: "auto", block: "start" });
      }
    });

    return () => {
      window.history.scrollRestoration = previousRestoration || "auto";
    };
  }, []);

  return null;
}

