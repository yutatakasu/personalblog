export type RawSupporterEntry =
  | string
  | {
      name?: unknown;
      title?: unknown;
      focus?: unknown;
      description?: unknown;
      image_src?: unknown;
      imageSrc?: unknown;
    };

export type NormalizedSupporter = {
  name: string;
  title?: string;
  focus?: string;
  image_src?: string;
};

function toOptionalString(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function normalizeSupporterEntry(
  entry: RawSupporterEntry,
): NormalizedSupporter | null {
  if (typeof entry === "string") {
    const name = entry.trim();
    return name.length > 0
      ? {
          name,
        }
      : null;
  }

  if (typeof entry === "object" && entry !== null) {
    const record = entry as Record<string, unknown>;
    const name =
      toOptionalString(record.name) ?? toOptionalString(record.title);

    if (!name) {
      return null;
    }

    return {
      name,
      title: toOptionalString(record.title),
      focus:
        toOptionalString(record.focus) ?? toOptionalString(record.description),
      image_src:
        toOptionalString(record.image_src) ?? toOptionalString(record.imageSrc),
    };
  }

  return null;
}

export function normalizeSupporters(raw: unknown): NormalizedSupporter[] {
  if (!Array.isArray(raw)) {
    return [];
  }

  return raw
    .map((entry) => normalizeSupporterEntry(entry as RawSupporterEntry))
    .filter(
      (supporter): supporter is NormalizedSupporter => supporter !== null,
    );
}


