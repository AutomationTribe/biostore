import { Resend } from "resend";
import { env } from "@/lib/env";

/**
 * Resend email service client
 * Used for transactional emails
 */
export const resend = new Resend(env.RESEND_API_KEY);
