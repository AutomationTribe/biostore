import { createServerClient } from "@/lib/supabase/server";
import { signupSchema } from "@/modules/auth/validators";
import { signup } from "@/modules/auth/service";
import { runOnboardingPipeline } from "@/agents/pipeline";
import { isAppError } from "@/lib/errors";

/**
 * POST /api/auth/signup
 * Create new user account and trigger onboarding pipeline
 *
 * Request body:
 * - email: string
 * - password: string
 * - username: string
 * - fullName: string
 * - creatorCategory?: string
 *
 * Response:
 * - user: User object
 * - onboarding: OnboardingResult from agent pipeline
 */
export async function POST(
  request: Request
): Promise<Response> {
  try {
    const body = await request.json();

    // Validate input
    const input = signupSchema.parse(body);

    // Get Supabase client
    const supabase = await createServerClient();

    // Create user account
    const user = await signup(supabase, input);

    // Trigger onboarding pipeline asynchronously
    // In production, this would be moved to a background job
    runOnboardingPipeline(user.id).catch((error) => {
      console.error("Onboarding pipeline error:", error);
    });

    return Response.json({
      success: true,
      data: { user },
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
