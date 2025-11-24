import type { MetadataRoute } from "next";

import { getNewsItems } from "@/models/news";

const BASE_URL = (
  process.env.NEXT_PUBLIC_BASE_URL ?? "https://atlas-hp-dev.vercel.app"
).replace(/\/+$/u, "");

const STATIC_PATHS = ["/", "/news", "/positions"];

const createCanonicalUrl = (path: string) => `${BASE_URL}${path}`;

const toIsoDateString = (value: string, fallback: string): string => {
  const normalized = value
    .replace(/[./]/gu, "-")
    .replace(/年|月/gu, "-")
    .replace(/日/gu, "")
    .replace(/--+/gu, "-")
    .replace(/^-+/u, "")
    .trim();

  if (!normalized) {
    return fallback;
  }

  const timestamp = Date.parse(normalized);
  if (!Number.isNaN(timestamp)) {
    return new Date(timestamp).toISOString();
  }

  return fallback;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const defaultLastModified = new Date().toISOString();
  const newsItems = await getNewsItems();

  const newsEntries = newsItems.map((item) => ({
    url: createCanonicalUrl(item.link),
    lastModified: toIsoDateString(item.date, defaultLastModified),
  }));

  const staticEntries = STATIC_PATHS.map((path) => ({
    url: createCanonicalUrl(path),
    lastModified: defaultLastModified,
  }));

  return [...staticEntries, ...newsEntries];
}
