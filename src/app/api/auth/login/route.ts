import { createServerClient } from "@/lib/supabase/server";
import { loginSchema } from "@/modules/auth/validators";
import { login } from "@/modules/auth/service";
import { isAppError } from "@/lib/errors";

/**
 * POST /api/auth/login
 * Authenticate user with email and password
 *
 * Request body:
 * - email: string
 * - password: string
 *
 * Response:
 * - user: User object
 * - session: access token
 */
export async function POST(
  request: Request
): Promise<Response> {
  try {
    const body = await request.json();

    // Validate input
    const input = loginSchema.parse(body);

    // Get Supabase client
    const supabase = await createServerClient();

    // Call service
    const result = await login(supabase, input);

    return Response.json({
      success: true,
      data: result,
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
