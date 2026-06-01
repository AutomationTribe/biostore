import { SupabaseClient } from "@supabase/supabase-js";
import { AppError, ErrorCode } from "@/lib/errors";
import {
  getProfile,
  updateProfile,
  getLinks,
  upsertLink,
  deleteLink,
} from "@/modules/profile/repository";
import { ProfileInput, LinkInput } from "@/modules/profile/validators";
import { Profile, Link } from "@/modules/profile/types";

/**
 * Update user profile
 */
export async function updateUserProfile(
  supabase: SupabaseClient,
  userId: string,
  input: ProfileInput
): Promise<Profile> {
  const profile = await updateProfile(supabase, userId, {
    bio: input.bio,
    theme: input.theme,
    avatar: input.avatar,
    coverImage: input.coverImage,
  });

  return profile;
}

/**
 * Get user's profile
 */
export async function getUserProfile(
  supabase: SupabaseClient,
  userId: string
): Promise<Profile> {
  const profile = await getProfile(supabase, userId);

  if (!profile) {
    throw new AppError(
      ErrorCode.PROFILE_NOT_FOUND,
      "Profile not found",
      404
    );
  }

  return profile;
}

/**
 * Get user's links
 */
export async function getUserLinks(
  supabase: SupabaseClient,
  userId: string
): Promise<Link[]> {
  return getLinks(supabase, userId);
}

/**
 * Add or update a link
 */
export async function saveLink(
  supabase: SupabaseClient,
  userId: string,
  input: LinkInput,
  linkId?: string
): Promise<Link> {
  const links = await getLinks(supabase, userId);
  const order = input.order ?? links.length;

  return upsertLink(supabase, userId, linkId || null, {
    title: input.title,
    url: input.url,
    icon: input.icon,
    order,
    active: input.active ?? true,
  });
}

/**
 * Reorder links
 */
export async function reorderLinks(
  supabase: SupabaseClient,
  userId: string,
  linkIds: string[]
): Promise<void> {
  for (let i = 0; i < linkIds.length; i++) {
    const { error } = await supabase
      .from("links")
      .update({ order: i })
      .eq("id", linkIds[i])
      .eq("user_id", userId);

    if (error) throw error;
  }
}

/**
 * Toggle link active state
 */
export async function toggleLink(
  supabase: SupabaseClient,
  userId: string,
  linkId: string,
  active: boolean
): Promise<Link> {
  const { error, data } = await supabase
    .from("links")
    .update({ active })
    .eq("id", linkId)
    .eq("user_id", userId)
    .select()
    .single();

  if (error || !data) throw error;

  return {
    id: data.id,
    userId: data.user_id,
    title: data.title,
    url: data.url,
    icon: data.icon,
    order: data.order,
    active: data.active,
    createdAt: new Date(data.created_at),
  };
}

/**
 * Remove a link
 */
export async function removeLink(
  supabase: SupabaseClient,
  userId: string,
  linkId: string
): Promise<void> {
  await deleteLink(supabase, userId, linkId);
}
