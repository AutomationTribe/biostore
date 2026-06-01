import { anthropic } from "@/lib/anthropic";
import {
  BioAgentInput,
  BioAgentOutput,
  AgentExecutionError,
} from "@/agents/types";

/**
 * Second agent: generates bio using Claude API
 * Takes user context and generates a creative bio for their link-in-bio page
 */
export async function bioAgent(
  input: BioAgentInput
): Promise<BioAgentOutput> {
  try {
    if (!anthropic) {
      throw new Error("Anthropic API key not configured");
    }

    const { context } = input;

    const prompt = `You are a creative writer helping African creators craft compelling bios for their link-in-bio pages.

Generate a short, engaging bio (max 150 characters) for a creator with these details:
- Username: ${context.username}
- Full Name: ${context.fullName}
- Creator Category: ${context.creatorCategory || "General Creator"}

The bio should be:
- Authentic and personal
- Highlight their unique value
- Include relevant emoji if appropriate
- Encourage clicks to their links

Return ONLY the bio text, no quotes or explanation.`;

    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 100,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const bioText =
      message.content[0].type === "text" ? message.content[0].text : "";

    return {
      bio: bioText.trim(),
      bioConfidence: message.stop_reason === "end_turn" ? 0.95 : 0.7,
    };
  } catch (error) {
    throw new AgentExecutionError(
      "BioAgent",
      "Failed to generate bio with Claude",
      error
    );
  }
}
