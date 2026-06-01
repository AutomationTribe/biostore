import { SupabaseClient } from "@supabase/supabase-js";
import { User } from "@/modules/auth/types";

/**
 * Find user by email
 */
export async function findByEmail(
  supabase: SupabaseClient,
  email: string
): Promise<User | null> {
  const { data, error } = await supabase
    .from("users")
    .select("id, email, username, full_name, created_at")
    .eq("email", email)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    email: data.email,
    username: data.username,
    fullName: data.full_name,
    createdAt: new Date(data.created_at),
  };
}

/**
 * Find user by username
 */
export async function findByUsername(
  supabase: SupabaseClient,
  username: string
): Promise<User | null> {
  const { data, error } = await supabase
    .from("users")
    .select("id, email, username, full_name, created_at")
    .eq("username", username)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    email: data.email,
    username: data.username,
    fullName: data.full_name,
    createdAt: new Date(data.created_at),
  };
}

/**
 * Create new user
 */
export async function createUser(
  supabase: SupabaseClient,
  data: {
    id: string;
    email: string;
    username: string;
    fullName: string;
    creatorCategory?: string;
  }
): Promise<User> {
  const { error } = await supabase.from("users").insert([
    {
      id: data.id,
      email: data.email,
      username: data.username,
      full_name: data.fullName,
      creator_category: data.creatorCategory,
    },
  ]);

  if (error) throw error;

  return {
    id: data.id,
    email: data.email,
    username: data.username,
    fullName: data.fullName,
    createdAt: new Date(),
  };
}

/**
 * Delete user by ID
 */
export async function deleteUser(
  supabase: SupabaseClient,
  userId: string
): Promise<void> {
  const { error } = await supabase.from("users").delete().eq("id", userId);

  if (error) throw error;
}
