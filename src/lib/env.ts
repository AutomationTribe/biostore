import { z } from "zod";

const envSchema = z.object({
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),

  // Stripe
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1),
  STRIPE_SECRET_KEY: z.string().min(1),
  STRIPE_WEBHOOK_SECRET: z.string().min(1),

  // Paystack
  NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY: z.string().min(1),
  PAYSTACK_SECRET_KEY: z.string().min(1),
  PAYSTACK_WEBHOOK_SECRET: z.string().min(1),

  // Resend
  RESEND_API_KEY: z.string().min(1),

  // Anthropic
  ANTHROPIC_API_KEY: z.string().min(1),

  // App
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NODE_ENV: z.enum(["development", "production", "test"]),
});

type Env = z.infer<typeof envSchema>;

let cachedEnv: Env | null = null;

/**
 * Get validated environment variables.
 * Throws if any required variable is missing or invalid.
 */
export function getEnv(): Env {
  if (cachedEnv) return cachedEnv;

  const raw = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
    PAYSTACK_SECRET_KEY: process.env.PAYSTACK_SECRET_KEY,
    PAYSTACK_WEBHOOK_SECRET: process.env.PAYSTACK_WEBHOOK_SECRET,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NODE_ENV: process.env.NODE_ENV || "development",
  };

  try {
    cachedEnv = envSchema.parse(raw);
    return cachedEnv;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missing = error.errors
        .map((e) => `${e.path.join(".")}: ${e.message}`)
        .join("\n");
      throw new Error(
        `Invalid environment variables:\n${missing}\n\nSee .env.local.example for required variables.`
      );
    }
    throw error;
  }
}
