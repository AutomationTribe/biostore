import Stripe from "stripe";
import { env } from "@/lib/env";

/**
 * Stripe SDK instance
 * Initialized with secret key for server-side operations
 * Returns null if STRIPE_SECRET_KEY is not configured
 */
export const stripe = env.STRIPE_SECRET_KEY
  ? new Stripe(env.STRIPE_SECRET_KEY, {
      apiVersion: "2023-10-16",
    })
  : null;
