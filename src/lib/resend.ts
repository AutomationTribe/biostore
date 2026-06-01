import { Resend } from "resend";
import { env } from "@/lib/env";

/**
 * Resend email service client
 * Used for transactional emails
 * Returns null if RESEND_API_KEY is not configured
 */
export const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;
