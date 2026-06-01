import {
  OutputAgentInput,
  OnboardingResult,
  AgentExecutionError,
} from "@/agents/types";

/**
 * Final agent: assembles all previous agent outputs into final onboarding result
 * This is the orchestration step that formats everything for persistence
 */
export async function outputAgent(
  input: OutputAgentInput
): Promise<OnboardingResult> {
  try {
    const { context, bioResult, themeResult, suggestions } = input;

    return {
      userId: context.userId,
      username: context.username,
      generatedBio: bioResult.bio,
      selectedTheme: {
        id: themeResult.themeId,
        name: themeResult.themeName,
        colors: themeResult.colors,
      },
      suggestedLinks: suggestions.suggestedLinks,
      completedAt: new Date(),
    };
  } catch (error) {
    throw new AgentExecutionError(
      "OutputAgent",
      "Failed to assemble onboarding result",
      error
    );
  }
}
