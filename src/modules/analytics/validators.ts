import { z } from "zod";

/**
 * Page view tracking schema
 */
export const pageViewSchema = z.object({
  path: z.string().min(1),
  referrer: z.string().optional(),
  userAgent: z.string().optional(),
  ipAddress: z.string().optional(),
});

export type PageViewInput = z.infer<typeof pageViewSchema>;

/**
 * Click event tracking schema
 */
export const clickEventSchema = z.object({
  linkId: z.string().min(1),
  referrer: z.string().optional(),
  userAgent: z.string().optional(),
  ipAddress: z.string().optional(),
});

export type ClickEventInput = z.infer<typeof clickEventSchema>;
