type AtlasScrollRestorationState = {
  scrollTop: number;
  hash: string;
};

const STORAGE_KEY = "atlas-scroll-restoration";

const isClient = () => typeof window !== "undefined";

export function getSavedAtlasRestoration(): AtlasScrollRestorationState | null {
  if (!isClient()) {
    return null;
  }

  const serialized = sessionStorage.getItem(STORAGE_KEY);
  if (!serialized) {
    return null;
  }

  try {
    const parsed = JSON.parse(serialized);
    if (
      typeof parsed.scrollTop !== "number" ||
      typeof parsed.hash !== "string"
    ) {
      return null;
    }

    return {
      scrollTop: parsed.scrollTop,
      hash: parsed.hash,
    };
  } catch {
    return null;
  }
}

export function saveAtlasRestoration(state: AtlasScrollRestorationState) {
  if (!isClient()) {
    return;
  }

  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function clearAtlasRestoration() {
  if (!isClient()) {
    return;
  }

  sessionStorage.removeItem(STORAGE_KEY);
}

export type { AtlasScrollRestorationState };
