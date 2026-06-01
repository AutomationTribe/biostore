/**
 * Payments module types
 */

export type PaymentProvider = "stripe" | "paystack";

export interface PaymentIntent {
  id: string;
  userId: string;
  productId: string;
  amount: number;
  currency: string;
  provider: PaymentProvider;
  clientSecret?: string;
  status: "pending" | "processing" | "succeeded" | "failed";
  metadata?: Record<string, unknown>;
  createdAt: Date;
  expiresAt: Date;
}

export interface WebhookPayload {
  provider: PaymentProvider;
  event: string;
  data: Record<string, unknown>;
  signature: string;
}

export interface CheckoutSession {
  id: string;
  provider: PaymentProvider;
  clientSecret?: string;
  publishableKey?: string;
  redirectUrl?: string;
}

export interface PaymentConfig {
  provider: PaymentProvider;
  country: string;
}
