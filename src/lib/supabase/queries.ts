import type { NewsItem } from "@/models";
import { normalizeNewsContent } from "@/models/news";
import { supabase } from "./server";

/**
 * News/Blog 関連のクエリ関数
 */
export async function getAllNews(): Promise<NewsItem[]> {
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching news:", error);
    throw error;
  }

  return (
    data?.map((item) => ({
      id: item.id,
      title: item.title,
      subtitle: item.subtitle ?? undefined,
      date: item.date,
      thumbnailSrc: item.thumbnail_src ?? undefined,
      thumbnailAlt: item.thumbnail_alt,
      link: item.link,
      content: normalizeNewsContent(item.content),
      summary: item.summary ?? undefined,
      contactPerson: item.contact_person ?? undefined,
      contactEmail: item.contact_email ?? undefined,
      category: item.category ?? undefined,
      status: item.status ?? "draft",
    })) ?? []
  );
}

export async function getNewsById(id: string): Promise<NewsItem | null> {
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // Not found
      console.log(`[getNewsById] News item not found: ${id}`);
      return null;
    }
    console.error(`[getNewsById] Error fetching news item ${id}:`, error);
    throw error;
  }

  if (!data) {
    console.log(`[getNewsById] No data returned for id: ${id}`);
    return null;
  }

  try {
    const normalizedContent = normalizeNewsContent(data.content);
    console.log(
      `[getNewsById] Successfully fetched news item: ${id}, content blocks: ${normalizedContent.length}`,
    );

    return {
      id: data.id,
      title: data.title,
      subtitle: data.subtitle ?? undefined,
      date: data.date,
      thumbnailSrc: data.thumbnail_src ?? undefined,
      thumbnailAlt: data.thumbnail_alt,
      link: data.link,
      content: normalizedContent,
      summary: data.summary ?? undefined,
      contactPerson: data.contact_person ?? undefined,
      contactEmail: data.contact_email ?? undefined,
      category: data.category ?? undefined,
      status: data.status ?? "draft",
    };
  } catch (normalizeError) {
    console.error(
      `[getNewsById] Error normalizing content for ${id}:`,
      normalizeError,
    );
    // エラーが発生しても、contentを空配列にして返す
    return {
      id: data.id,
      title: data.title,
      subtitle: data.subtitle ?? undefined,
      date: data.date,
      thumbnailSrc: data.thumbnail_src ?? undefined,
      thumbnailAlt: data.thumbnail_alt,
      link: data.link,
      content: [],
      summary: data.summary ?? undefined,
      contactPerson: data.contact_person ?? undefined,
      contactEmail: data.contact_email ?? undefined,
      category: data.category ?? undefined,
      status: data.status ?? "draft",
    };
  }
}
