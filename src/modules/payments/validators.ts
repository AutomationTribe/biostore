import { z } from "zod";

/**
 * Checkout creation schema
 */
export const checkoutSchema = z.object({
  productId: z.string().uuid(),
  amount: z.number().positive(),
  currency: z.string().length(3),
  buyerEmail: z.string().email(),
  provider: z.enum(["stripe", "paystack"]),
  successUrl: z.string().url(),
  cancelUrl: z.string().url(),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

/**
 * Webhook schema for payment events
 */
export const webhookSchema = z.object({
  provider: z.enum(["stripe", "paystack"]),
  event: z.string(),
  signature: z.string(),
  data: z.record(z.unknown()),
});

export type WebhookInput = z.infer<typeof webhookSchema>;
