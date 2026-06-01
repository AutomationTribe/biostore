import Anthropic from "@anthropic-ai/sdk";
import { env } from "@/lib/env";

/**
 * Anthropic SDK client for Claude API calls
 * Used by agent pipeline for AI-powered features
 */
export const anthropic = new Anthropic({
  apiKey: env.ANTHROPIC_API_KEY,
});
