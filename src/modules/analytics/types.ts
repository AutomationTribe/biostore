/**
 * Analytics module types
 */

export interface PageView {
  id: string;
  userId: string;
  path: string;
  referrer?: string;
  userAgent?: string;
  ipAddress?: string;
  viewedAt: Date;
}

export interface ClickEvent {
  id: string;
  userId: string;
  linkId: string;
  referrer?: string;
  userAgent?: string;
  ipAddress?: string;
  clickedAt: Date;
}

export interface RevenueStats {
  totalRevenue: number;
  totalSales: number;
  averageOrderValue: number;
  topProducts: Array<{
    productId: string;
    productName: string;
    sales: number;
    revenue: number;
  }>;
}

export interface DashboardStats {
  profileViews: number;
  totalClicks: number;
  revenue: RevenueStats;
  topLinks: Array<{
    linkId: string;
    title: string;
    clicks: number;
  }>;
}
