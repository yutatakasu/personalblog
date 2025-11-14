import { normalizeSupporters } from "@/lib/supporters/normalize";
import type { InvestorGroup, NewsItem, Position, TeamMember } from "@/models";
import { normalizeNewsContent } from "@/models/news";
import { supabase } from "./server";

/**
 * News 関連のクエリ関数
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
      contactEmail: item.contact_email ?? undefined,
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
    console.log(`[getNewsById] Successfully fetched news item: ${id}, content blocks: ${normalizedContent.length}`);
    
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
      contactEmail: data.contact_email ?? undefined,
    };
  } catch (normalizeError) {
    console.error(`[getNewsById] Error normalizing content for ${id}:`, normalizeError);
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
      contactEmail: data.contact_email ?? undefined,
    };
  }
}

/**
 * Positions 関連のクエリ関数
 */
export async function getAllPositions(): Promise<Position[]> {
  const { data, error } = await supabase
    .from("positions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching positions:", error);
    throw error;
  }

  return (
    data?.map((item) => ({
      id: item.id,
      title: item.title,
      department: item.department,
      location: item.location,
      workStyle: item.work_style as "Onsite" | "Hybrid" | "Remote",
      teaser: item.teaser,
      summary: item.summary,
      responsibilities: item.responsibilities as string[],
      requirements: item.requirements as string[],
      applyEmail: item.apply_email ?? undefined,
    })) ?? []
  );
}

export async function getPositionById(id: string): Promise<Position | null> {
  const { data, error } = await supabase
    .from("positions")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // Not found
      return null;
    }
    console.error("Error fetching position:", error);
    throw error;
  }

  if (!data) {
    return null;
  }

  return {
    id: data.id,
    title: data.title,
    department: data.department,
    location: data.location,
    workStyle: data.work_style as "Onsite" | "Hybrid" | "Remote",
    teaser: data.teaser,
    summary: data.summary,
    responsibilities: data.responsibilities as string[],
    requirements: data.requirements as string[],
    applyEmail: data.apply_email ?? undefined,
  };
}

/**
 * Team Members 関連のクエリ関数
 */
export async function getAllTeamMembers(): Promise<TeamMember[]> {
  const { data, error } = await supabase
    .from("team_members")
    .select("*")
    .order("position_row", { ascending: true })
    .order("position_column", { ascending: true });

  if (error) {
    console.error("Error fetching team members:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
      error,
    });
    return [];
  }

  console.info("[queries/getAllTeamMembers] raw response:", data);

  return (
    data?.map((item) => ({
      id: item.id,
      name: item.name,
      title: item.title,
      focus: item.focus,
      imageSrc: item.image_src,
      imageAlt: item.image_alt ?? undefined,
      position: {
        row: item.position_row,
        column: item.position_column,
        offsetY: item.position_offset_y ?? undefined,
      },
    })) ?? []
  );
}

/**
 * Investor Groups 関連のクエリ関数
 */
export async function getAllInvestorGroups(): Promise<InvestorGroup[]> {
  const { data, error } = await supabase
    .from("investor_groups")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.error("Error fetching investor groups:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
      error,
    });
    return [];
  }

  return (
    data?.map((item) => ({
      category: item.category,
      supporters: normalizeSupporters(item.supporters).map((supporter) => ({
        name: supporter.name,
        title: supporter.title ?? undefined,
        focus: supporter.focus ?? undefined,
        imageSrc: supporter.image_src ?? undefined,
      })),
    })) ?? []
  );
}
