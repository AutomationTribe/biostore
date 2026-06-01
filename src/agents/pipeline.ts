import { profileAgent } from "@/agents/profileAgent";
import { bioAgent } from "@/agents/bioAgent";
import { themeAgent } from "@/agents/themeAgent";
import { suggestionAgent } from "@/agents/suggestionAgent";
import { outputAgent } from "@/agents/outputAgent";
import {
  OnboardingResult,
  AgentExecutionError,
} from "@/agents/types";

/**
 * Onboarding pipeline orchestrator
 * Executes all agents in sequence, passing outputs as inputs to next agent
 * If any agent fails, the entire pipeline stops and returns an error
 *
 * Pipeline flow:
 * 1. profileAgent: fetch user profile from DB → context object
 * 2. bioAgent: context → call Claude → generated bio
 * 3. themeAgent: context + bio → recommend theme
 * 4. suggestionAgent: context → suggest links
 * 5. outputAgent: assemble all outputs → final result
 */
export async function runOnboardingPipeline(
  userId: string
): Promise<OnboardingResult> {
  try {
    // Step 1: Load user profile
    const profileResult = await profileAgent({ userId });

    // Step 2: Generate bio with Claude
    const bioResult = await bioAgent({ context: profileResult.context });

    // Step 3: Recommend theme based on category and bio
    const themeResult = await themeAgent({
      context: profileResult.context,
      bio: bioResult.bio,
    });

    // Step 4: Suggest links based on category
    const suggestionResult = await suggestionAgent({
      context: profileResult.context,
    });

    // Step 5: Assemble final result
    const result = await outputAgent({
      context: profileResult.context,
      bioResult,
      themeResult,
      suggestions: suggestionResult,
    });

    return result;
  } catch (error) {
    if (error instanceof AgentExecutionError) {
      throw error;
    }

    throw new AgentExecutionError(
      "Pipeline",
      "Onboarding pipeline failed",
      error
    );
  }
}
