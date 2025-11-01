"use client";

import { useLayoutEffect } from "react";

export function ScrollToAtlas() {
  useLayoutEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    const { hash, pathname, search } = window.location;
    if (hash && hash !== "#atlas") {
      window.history.replaceState(
        window.history.state,
        "",
        `${pathname}${search}#atlas`
      );
    }

    const main = document.querySelector("main");
    if (main instanceof HTMLElement) {
      main.scrollTo({ top: 0, behavior: "auto" });
    }

    const atlasSection = document.getElementById("atlas");
    if (atlasSection instanceof HTMLElement) {
      atlasSection.scrollIntoView({ behavior: "auto", block: "start" });
    }

    return () => {
      window.history.scrollRestoration = previousRestoration || "auto";
    };
  }, []);

  return null;
}
