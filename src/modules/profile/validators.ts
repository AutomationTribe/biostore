import { z } from "zod";

/**
 * Profile update schema
 */
export const profileSchema = z.object({
  bio: z.string().max(500, "Bio must be at most 500 characters"),
  theme: z.string().min(1),
  avatar: z.string().url().optional(),
  coverImage: z.string().url().optional(),
});

export type ProfileInput = z.infer<typeof profileSchema>;

/**
 * Link creation/update schema
 */
export const linkSchema = z.object({
  title: z.string().min(1).max(100),
  url: z.string().url("Must be a valid URL"),
  icon: z.string().optional(),
  order: z.number().int().nonnegative().optional(),
  active: z.boolean().optional(),
});

export type LinkInput = z.infer<typeof linkSchema>;
