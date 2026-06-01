/**
 * Agent pipeline types and interfaces
 * Defines the contract for all agents in the onboarding pipeline
 */

export interface PipelineContext {
  userId: string;
  email: string;
  username: string;
  fullName: string;
  creatorCategory?: string;
  bio?: string;
  selectedThemeId?: string;
  suggestedLinks?: SuggestedLink[];
  generatedBio?: string;
}

export interface SuggestedLink {
  title: string;
  url: string;
  icon: string;
  category: string;
}

export interface ProfileAgentInput {
  userId: string;
}

export interface ProfileAgentOutput {
  context: PipelineContext;
}

export interface BioAgentInput {
  context: PipelineContext;
}

export interface BioAgentOutput {
  bio: string;
  bioConfidence: number;
}

export interface ThemeAgentInput {
  context: PipelineContext;
  bio: string;
}

export interface ThemeAgentOutput {
  themeId: string;
  themeName: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export interface SuggestionAgentInput {
  context: PipelineContext;
}

export interface SuggestionAgentOutput {
  suggestedLinks: SuggestedLink[];
}

export interface OutputAgentInput {
  context: PipelineContext;
  bioResult: BioAgentOutput;
  themeResult: ThemeAgentOutput;
  suggestions: SuggestionAgentOutput;
}

export interface OnboardingResult {
  userId: string;
  username: string;
  generatedBio: string;
  selectedTheme: {
    id: string;
    name: string;
    colors: Record<string, string>;
  };
  suggestedLinks: SuggestedLink[];
  completedAt: Date;
}

export class AgentExecutionError extends Error {
  constructor(
    readonly agentName: string,
    message: string,
    readonly _originalError?: unknown
  ) {
    super(`[${agentName}] ${message}`);
    Object.setPrototypeOf(this, AgentExecutionError.prototype);
  }
}
