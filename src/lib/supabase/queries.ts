import { supabase } from "./server";
import type {
  NewsItem,
  Position,
  TeamMember,
  InvestorGroup,
} from "@/models";

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
      date: item.date,
      thumbnailSrc: item.thumbnail_src,
      thumbnailAlt: item.thumbnail_alt,
      link: item.link,
      summary: item.summary ?? undefined,
      tag: item.tag ?? undefined,
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
      return null;
    }
    console.error("Error fetching news item:", error);
    throw error;
  }

  if (!data) {
    return null;
  }

  return {
    id: data.id,
    title: data.title,
    date: data.date,
    thumbnailSrc: data.thumbnail_src,
    thumbnailAlt: data.thumbnail_alt,
    link: data.link,
    summary: data.summary ?? undefined,
    tag: data.tag ?? undefined,
  };
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
      supporters: item.supporters as string[],
    })) ?? []
  );
}

