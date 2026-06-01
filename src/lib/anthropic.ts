import Anthropic from "@anthropic-ai/sdk";
import { env } from "@/lib/env";

/**
 * Anthropic SDK client for Claude API calls
 * Used by agent pipeline for AI-powered features
 * Returns null if ANTHROPIC_API_KEY is not configured
 */
export const anthropic = env.ANTHROPIC_API_KEY
  ? new Anthropic({
      apiKey: env.ANTHROPIC_API_KEY,
    })
  : null;
