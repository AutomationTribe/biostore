import { SupabaseClient } from "@supabase/supabase-js";
import { PageView, ClickEvent } from "@/modules/analytics/types";

/**
 * Record page view
 */
export async function recordPageView(
  supabase: SupabaseClient,
  userId: string,
  data: {
    path: string;
    referrer?: string;
    userAgent?: string;
    ipAddress?: string;
  }
): Promise<PageView> {
  const { error, data: view } = await supabase
    .from("page_views")
    .insert([
      {
        user_id: userId,
        path: data.path,
        referrer: data.referrer,
        user_agent: data.userAgent,
        ip_address: data.ipAddress,
      },
    ])
    .select()
    .single();

  if (error || !view) throw error;

  return {
    id: view.id,
    userId: view.user_id,
    path: view.path,
    referrer: view.referrer,
    userAgent: view.user_agent,
    ipAddress: view.ip_address,
    viewedAt: new Date(view.viewed_at),
  };
}

/**
 * Record click event
 */
export async function recordClickEvent(
  supabase: SupabaseClient,
  userId: string,
  data: {
    linkId: string;
    referrer?: string;
    userAgent?: string;
    ipAddress?: string;
  }
): Promise<ClickEvent> {
  const { error, data: click } = await supabase
    .from("click_events")
    .insert([
      {
        user_id: userId,
        link_id: data.linkId,
        referrer: data.referrer,
        user_agent: data.userAgent,
        ip_address: data.ipAddress,
      },
    ])
    .select()
    .single();

  if (error || !click) throw error;

  return {
    id: click.id,
    userId: click.user_id,
    linkId: click.link_id,
    referrer: click.referrer,
    userAgent: click.user_agent,
    ipAddress: click.ip_address,
    clickedAt: new Date(click.clicked_at),
  };
}

/**
 * Get page views count for user
 */
export async function getPageViewsCount(
  supabase: SupabaseClient,
  userId: string,
  since?: Date
): Promise<number> {
  let query = supabase
    .from("page_views")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);

  if (since) {
    query = query.gte("viewed_at", since.toISOString());
  }

  const { count } = await query;
  return count || 0;
}

/**
 * Get click events count by link
 */
export async function getClickCountsByLink(
  supabase: SupabaseClient,
  userId: string,
  since?: Date
): Promise<Map<string, number>> {
  let query = supabase
    .from("click_events")
    .select("link_id")
    .eq("user_id", userId);

  if (since) {
    query = query.gte("clicked_at", since.toISOString());
  }

  const { data, error } = await query;

  if (error || !data) return new Map();

  const counts = new Map<string, number>();
  data.forEach((event: Record<string, unknown>) => {
    const linkId = event.link_id as string;
    counts.set(linkId, (counts.get(linkId) || 0) + 1);
  });

  return counts;
}

/**
 * Get total clicks for user
 */
export async function getTotalClicks(
  supabase: SupabaseClient,
  userId: string,
  since?: Date
): Promise<number> {
  let query = supabase
    .from("click_events")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);

  if (since) {
    query = query.gte("clicked_at", since.toISOString());
  }

  const { count } = await query;
  return count || 0;
}
