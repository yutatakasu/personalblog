"use client";

import { useLayoutEffect } from "react";

import type { AtlasScrollRestorationState } from "@/lib/atlasScrollRestoration";
import {
  clearAtlasRestoration,
  getSavedAtlasRestoration,
  saveAtlasRestoration,
} from "@/lib/atlasScrollRestoration";

export function ScrollToAtlas() {
  useLayoutEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    const navigationType =
      typeof performance !== "undefined"
        ? ((
            performance.getEntriesByType("navigation")[0] as
              | PerformanceNavigationTiming
              | undefined
          )?.type ?? "navigate")
        : "navigate";

    const main = document.querySelector("main");
    const savedRestoration = getSavedAtlasRestoration();

    const restoreScrollPosition = (state: AtlasScrollRestorationState) => {
      const hash = state.hash?.trim();
      const normalizedHash = hash?.startsWith("#") ? hash : `#${hash}`;

      if (hash) {
        const targetId = normalizedHash.slice(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement instanceof HTMLElement) {
          targetElement.scrollIntoView({ behavior: "auto", block: "start" });
        } else if (main instanceof HTMLElement) {
          main.scrollTo({ top: state.scrollTop, behavior: "auto" });
        }
      } else if (main instanceof HTMLElement) {
        main.scrollTo({ top: state.scrollTop, behavior: "auto" });
      }

      if (hash && window.location.hash !== normalizedHash) {
        window.history.replaceState(window.history.state, "", normalizedHash);
      }
    };

    const shouldRestore =
      savedRestoration !== null && navigationType !== "reload";
    if (shouldRestore && savedRestoration) {
      restoreScrollPosition(savedRestoration);
      clearAtlasRestoration();
    } else {
      const { hash, pathname, search } = window.location;
      if (hash && hash !== "#atlas") {
        window.history.replaceState(
          window.history.state,
          "",
          `${pathname}${search}#atlas`,
        );
      }

      if (main instanceof HTMLElement) {
        main.scrollTo({ top: 0, behavior: "auto" });
      }

      const atlasSection = document.getElementById("atlas");
      if (atlasSection instanceof HTMLElement) {
        atlasSection.scrollIntoView({ behavior: "auto", block: "start" });
      }
    }

    const persistScrollState = () => {
      const currentMain = document.querySelector("main");
      if (!(currentMain instanceof HTMLElement)) {
        return;
      }
      saveAtlasRestoration({
        scrollTop: currentMain.scrollTop,
        hash: window.location.hash || "",
      });
    };

    window.addEventListener("beforeunload", persistScrollState);
    window.addEventListener("pagehide", persistScrollState);

    return () => {
      persistScrollState();
      window.removeEventListener("beforeunload", persistScrollState);
      window.removeEventListener("pagehide", persistScrollState);
      window.history.scrollRestoration = previousRestoration || "auto";
    };
  }, []);

  return null;
}
