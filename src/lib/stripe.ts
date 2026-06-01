import Stripe from "stripe";
import { env } from "@/lib/env";

/**
 * Stripe SDK instance
 * Initialized with secret key for server-side operations
 */
export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});
