import {
  SuggestionAgentInput,
  SuggestionAgentOutput,
  SuggestedLink,
  AgentExecutionError,
} from "@/agents/types";

/**
 * Fourth agent: suggests links for creator to add to their profile
 * Recommends common link types based on creator category
 */
export async function suggestionAgent(
  input: SuggestionAgentInput
): Promise<SuggestionAgentOutput> {
  try {
    const { context } = input;

    let suggestedLinks: SuggestedLink[] = [];

    const category = (context.creatorCategory || "").toLowerCase();

    // Base suggestions for all creators
    suggestedLinks = [
      {
        title: "Instagram",
        url: "https://instagram.com",
        icon: "instagram",
        category: "social",
      },
      {
        title: "Twitter",
        url: "https://twitter.com",
        icon: "twitter",
        category: "social",
      },
    ];

    // Category-specific suggestions
    if (category.includes("music") || category.includes("artist")) {
      suggestedLinks.push(
        {
          title: "Spotify",
          url: "https://spotify.com",
          icon: "spotify",
          category: "music",
        },
        {
          title: "SoundCloud",
          url: "https://soundcloud.com",
          icon: "soundcloud",
          category: "music",
        }
      );
    } else if (
      category.includes("developer") ||
      category.includes("tech") ||
      category.includes("design")
    ) {
      suggestedLinks.push(
        {
          title: "GitHub",
          url: "https://github.com",
          icon: "github",
          category: "development",
        },
        {
          title: "Portfolio",
          url: "https://example.com",
          icon: "globe",
          category: "development",
        }
      );
    } else if (
      category.includes("business") ||
      category.includes("coach") ||
      category.includes("consultant")
    ) {
      suggestedLinks.push(
        {
          title: "LinkedIn",
          url: "https://linkedin.com",
          icon: "linkedin",
          category: "professional",
        },
        {
          title: "Email Newsletter",
          url: "https://substack.com",
          icon: "mail",
          category: "professional",
        }
      );
    }

    return {
      suggestedLinks,
    };
  } catch (error) {
    throw new AgentExecutionError(
      "SuggestionAgent",
      "Failed to generate link suggestions",
      error
    );
  }
}
