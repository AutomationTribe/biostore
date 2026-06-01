// Public API of analytics module

export type {
  PageView,
  ClickEvent,
  RevenueStats,
  DashboardStats,
} from "@/modules/analytics/types";
export {
  trackPageView,
  trackLinkClick,
  getDashboardStats,
  getAnalyticsForPeriod,
} from "@/modules/analytics/service";
export { pageViewSchema, clickEventSchema } from "@/modules/analytics/validators";
export type {
  PageViewInput,
  ClickEventInput,
} from "@/modules/analytics/validators";
