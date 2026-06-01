import { runOnboardingPipeline } from "@/agents/pipeline";
import { AgentExecutionError } from "@/agents/types";

/**
 * POST /api/agents/onboarding
 * Manually trigger the onboarding pipeline
 *
 * Request body:
 * - userId: string
 *
 * Response:
 * - onboardingResult: generated bio, theme, links
 */
export async function POST(
  request: Request
): Promise<Response> {
  try {
    const { userId } = await request.json();

    if (!userId || typeof userId !== "string") {
      return Response.json(
        { error: "Missing or invalid userId" },
        { status: 400 }
      );
    }

    const result = await runOnboardingPipeline(userId);

    return Response.json({
      success: true,
      data: { onboarding: result },
    });
  } catch (error) {
    if (error instanceof AgentExecutionError) {
      return Response.json(
        {
          error: {
            agent: error.agentName,
            message: error.message,
          },
        },
        { status: 500 }
      );
    }

    return Response.json(
      {
        error: {
          message: error instanceof Error ? error.message : "Pipeline failed",
        },
      },
      { status: 500 }
    );
  }
}
