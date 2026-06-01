import { createAdminClient } from "@/lib/supabase/server";
import {
  ProfileAgentInput,
  ProfileAgentOutput,
  AgentExecutionError,
} from "@/agents/types";

/**
 * First agent in the pipeline: reads user profile from Supabase
 * Extracts user metadata and builds initial context object
 */
export async function profileAgent(
  input: ProfileAgentInput
): Promise<ProfileAgentOutput> {
  try {
    const supabase = createAdminClient();

    // Fetch user record
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, email, username, full_name, creator_category")
      .eq("id", input.userId)
      .single();

    if (userError || !user) {
      throw new Error(`User not found: ${input.userId}`);
    }

    return {
      context: {
        userId: user.id,
        email: user.email,
        username: user.username,
        fullName: user.full_name,
        creatorCategory: user.creator_category,
      },
    };
  } catch (error) {
    throw new AgentExecutionError(
      "ProfileAgent",
      "Failed to fetch user profile",
      error
    );
  }
}
