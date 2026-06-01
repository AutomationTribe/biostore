import { createServerClient } from "@/lib/supabase/server";
import { pageViewSchema, clickEventSchema } from "@/modules/analytics/validators";
import {
  trackPageView,
  trackLinkClick,
  getDashboardStats,
} from "@/modules/analytics/service";
import { isAppError } from "@/lib/errors";
import { z } from "zod";

/**
 * GET /api/analytics
 * Get dashboard statistics for authenticated user
 */
export async function GET(): Promise<Response> {
  try {
    // In production: extract userId from session
    const userId = "user_id_placeholder";
    const supabase = await createServerClient();

    const stats = await getDashboardStats(supabase, userId);

    return Response.json({
      success: true,
      data: { stats },
    });
  } catch (error) {
    if (isAppError(error)) {
      return Response.json(error.toJSON(), {
        status: error.status,
      });
    }

    return Response.json(
      {
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred",
        },
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/analytics
 * Track a page view or click event
 *
 * Request body (one of):
 * - type: "pageview", path, referrer?, userAgent?, ipAddress?
 * - type: "click", linkId, referrer?, userAgent?, ipAddress?
 */
export async function POST(
  request: Request
): Promise<Response> {
  try {
    const body = await request.json();
    const eventSchema = z.union([
      z.object({
        type: z.literal("pageview"),
      }).merge(pageViewSchema),
      z.object({
        type: z.literal("click"),
      }).merge(clickEventSchema),
    ]);

    const event = eventSchema.parse(body);

    // In production: extract userId from session
    const userId = "user_id_placeholder";
    const supabase = await createServerClient();

    if (event.type === "pageview") {
      await trackPageView(supabase, userId, {
        path: event.path,
        referrer: event.referrer,
        userAgent: event.userAgent,
        ipAddress: event.ipAddress,
      });
    } else {
      await trackLinkClick(supabase, userId, {
        linkId: event.linkId,
        referrer: event.referrer,
        userAgent: event.userAgent,
        ipAddress: event.ipAddress,
      });
    }

    return Response.json({
      success: true,
    });
  } catch (error) {
    if (isAppError(error)) {
      return Response.json(error.toJSON(), {
        status: error.status,
      });
    }

    return Response.json(
      {
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred",
        },
      },
      { status: 500 }
    );
  }
}
