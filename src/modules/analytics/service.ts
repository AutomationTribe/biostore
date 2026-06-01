import { SupabaseClient } from "@supabase/supabase-js";
import {
  recordPageView,
  recordClickEvent,
  getPageViewsCount,
  getClickCountsByLink,
  getTotalClicks,
} from "@/modules/analytics/repository";
import {
  PageViewInput,
  ClickEventInput,
} from "@/modules/analytics/validators";
import {
  DashboardStats,
  RevenueStats,
} from "@/modules/analytics/types";

/**
 * Track page view
 */
export async function trackPageView(
  supabase: SupabaseClient,
  userId: string,
  input: PageViewInput
): Promise<void> {
  await recordPageView(supabase, userId, input);
}

/**
 * Track link click
 */
export async function trackLinkClick(
  supabase: SupabaseClient,
  userId: string,
  input: ClickEventInput
): Promise<void> {
  await recordClickEvent(supabase, userId, input);
}

/**
 * Get dashboard statistics for creator
 */
export async function getDashboardStats(
  supabase: SupabaseClient,
  userId: string
): Promise<DashboardStats> {
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Last 30 days

  // Get page views
  const profileViews = await getPageViewsCount(supabase, userId, since);

  // Get clicks
  const totalClicks = await getTotalClicks(supabase, userId, since);

  // Get clicks by link
  const clicksByLink = await getClickCountsByLink(supabase, userId, since);

  // Get top links
  const topLinks = Array.from(clicksByLink.entries())
    .map(([linkId, clicks]) => ({
      linkId,
      title: `Link ${linkId}`, // This would be fetched in a real implementation
      clicks,
    }))
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 5);

  // Get revenue stats (stub - would need transaction data)
  const revenueStats: RevenueStats = {
    totalRevenue: 0,
    totalSales: 0,
    averageOrderValue: 0,
    topProducts: [],
  };

  return {
    profileViews,
    totalClicks,
    revenue: revenueStats,
    topLinks,
  };
}

/**
 * Get analytics for a specific time period
 */
export async function getAnalyticsForPeriod(
  supabase: SupabaseClient,
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<{ views: number; clicks: number }> {
  // Count views in period
  const { count: viewCount } = await supabase
    .from("page_views")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("viewed_at", startDate.toISOString())
    .lte("viewed_at", endDate.toISOString());

  // Count clicks in period
  const { count: clickCount } = await supabase
    .from("click_events")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("clicked_at", startDate.toISOString())
    .lte("clicked_at", endDate.toISOString());

  return {
    views: viewCount || 0,
    clicks: clickCount || 0,
  };
}
