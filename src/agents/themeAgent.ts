import {
  ThemeAgentInput,
  ThemeAgentOutput,
  AgentExecutionError,
} from "@/agents/types";

// Available themes
const THEMES = {
  minimal: {
    id: "minimal",
    name: "Minimal",
    colors: {
      primary: "#000000",
      secondary: "#ffffff",
      accent: "#cccccc",
    },
  },
  vibrant: {
    id: "vibrant",
    name: "Vibrant",
    colors: {
      primary: "#ff6b6b",
      secondary: "#4ecdc4",
      accent: "#ffe66d",
    },
  },
  professional: {
    id: "professional",
    name: "Professional",
    colors: {
      primary: "#2c3e50",
      secondary: "#3498db",
      accent: "#ecf0f1",
    },
  },
  sunset: {
    id: "sunset",
    name: "Sunset",
    colors: {
      primary: "#ff6b35",
      secondary: "#f7931e",
      accent: "#fdb833",
    },
  },
  ocean: {
    id: "ocean",
    name: "Ocean",
    colors: {
      primary: "#0077be",
      secondary: "#00b4d8",
      accent: "#caf0f8",
    },
  },
};

/**
 * Third agent: recommends a theme based on user category and generated bio
 * Selects from predefined themes that complement the creator's vibe
 */
export async function themeAgent(
  input: ThemeAgentInput
): Promise<ThemeAgentOutput> {
  try {
    const { context, bio } = input;

    // Simple heuristic for theme selection based on creator category
    let selectedTheme = THEMES.professional;

    if (context.creatorCategory) {
      const category = context.creatorCategory.toLowerCase();

      if (
        category.includes("music") ||
        category.includes("artist") ||
        category.includes("creator")
      ) {
        selectedTheme = THEMES.vibrant;
      } else if (
        category.includes("tech") ||
        category.includes("developer") ||
        category.includes("design")
      ) {
        selectedTheme = THEMES.minimal;
      } else if (
        category.includes("travel") ||
        category.includes("lifestyle") ||
        category.includes("wellness")
      ) {
        selectedTheme = THEMES.sunset;
      } else if (
        category.includes("business") ||
        category.includes("coach") ||
        category.includes("consultant")
      ) {
        selectedTheme = THEMES.professional;
      }
    }

    return {
      themeId: selectedTheme.id,
      themeName: selectedTheme.name,
      colors: selectedTheme.colors,
    };
  } catch (error) {
    throw new AgentExecutionError(
      "ThemeAgent",
      "Failed to select theme",
      error
    );
  }
}
