import { SupabaseClient } from "@supabase/supabase-js";
import { Profile, Link } from "@/modules/profile/types";

/**
 * Get user profile
 */
export async function getProfile(
  supabase: SupabaseClient,
  userId: string
): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("user_id, bio, theme, avatar, cover_image, created_at, updated_at")
    .eq("user_id", userId)
    .single();

  if (error || !data) return null;

  return {
    userId: data.user_id,
    bio: data.bio,
    theme: data.theme,
    avatar: data.avatar,
    coverImage: data.cover_image,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  };
}

/**
 * Update user profile
 */
export async function updateProfile(
  supabase: SupabaseClient,
  userId: string,
  updates: Partial<Omit<Profile, "userId" | "createdAt">>
): Promise<Profile> {
  const { error, data } = await supabase
    .from("profiles")
    .update({
      bio: updates.bio,
      theme: updates.theme,
      avatar: updates.avatar,
      cover_image: updates.coverImage,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId)
    .select()
    .single();

  if (error || !data) throw error;

  return {
    userId: data.user_id,
    bio: data.bio,
    theme: data.theme,
    avatar: data.avatar,
    coverImage: data.cover_image,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  };
}

/**
 * Get all links for user
 */
export async function getLinks(
  supabase: SupabaseClient,
  userId: string
): Promise<Link[]> {
  const { data, error } = await supabase
    .from("links")
    .select("id, user_id, title, url, icon, order, active, created_at")
    .eq("user_id", userId)
    .order("order", { ascending: true });

  if (error || !data) return [];

  return data.map((link) => ({
    id: link.id,
    userId: link.user_id,
    title: link.title,
    url: link.url,
    icon: link.icon,
    order: link.order,
    active: link.active,
    createdAt: new Date(link.created_at),
  }));
}

/**
 * Create or update link
 */
export async function upsertLink(
  supabase: SupabaseClient,
  userId: string,
  linkId: string | null,
  data: { title: string; url: string; icon?: string; order: number; active: boolean }
): Promise<Link> {
  if (linkId) {
    const { error, data: updated } = await supabase
      .from("links")
      .update(data)
      .eq("id", linkId)
      .eq("user_id", userId)
      .select()
      .single();

    if (error || !updated) throw error;

    return {
      id: updated.id,
      userId: updated.user_id,
      title: updated.title,
      url: updated.url,
      icon: updated.icon,
      order: updated.order,
      active: updated.active,
      createdAt: new Date(updated.created_at),
    };
  } else {
    const { error, data: created } = await supabase
      .from("links")
      .insert([{ user_id: userId, ...data }])
      .select()
      .single();

    if (error || !created) throw error;

    return {
      id: created.id,
      userId: created.user_id,
      title: created.title,
      url: created.url,
      icon: created.icon,
      order: created.order,
      active: created.active,
      createdAt: new Date(created.created_at),
    };
  }
}

/**
 * Delete link
 */
export async function deleteLink(
  supabase: SupabaseClient,
  userId: string,
  linkId: string
): Promise<void> {
  const { error } = await supabase
    .from("links")
    .delete()
    .eq("id", linkId)
    .eq("user_id", userId);

  if (error) throw error;
}
