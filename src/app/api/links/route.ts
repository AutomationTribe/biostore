import { createServerClient } from "@/lib/supabase/server";
import { linkSchema } from "@/modules/profile/validators";
import { saveLink, getUserLinks } from "@/modules/profile/service";
import { isAppError } from "@/lib/errors";

/**
 * GET /api/links
 * Retrieve all links for authenticated user
 */
export async function GET(): Promise<Response> {
  try {
    // In production: extract userId from session
    const userId = "user_id_placeholder";
    const supabase = await createServerClient();

    const links = await getUserLinks(supabase, userId);

    return Response.json({
      success: true,
      data: { links },
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
 * POST /api/links
 * Create a new link
 *
 * Request body:
 * - title: string
 * - url: string
 * - icon?: string
 * - order?: number
 * - active?: boolean
 */
export async function POST(
  request: Request
): Promise<Response> {
  try {
    const body = await request.json();
    const input = linkSchema.parse(body);

    // In production: extract userId from session
    const userId = "user_id_placeholder";
    const supabase = await createServerClient();

    const link = await saveLink(supabase, userId, input);

    return Response.json({
      success: true,
      data: { link },
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
