import crypto from "crypto";
import { paystackRequest, paystackConfig } from "@/lib/paystack";
import { CheckoutSession } from "@/modules/payments/types";

/**
 * Create Paystack payment authorization
 */
export async function createPaystackCheckout(input: {
  productId: string;
  productName: string;
  amount: number;
  currency: string;
  buyerEmail: string;
  successUrl: string;
  cancelUrl: string;
}): Promise<CheckoutSession> {
  if (!paystackConfig.secretKey) {
    throw new Error("Paystack API key not configured");
  }

  // Amount is in kobo (smallest unit), so multiply by 100
  const response = (await paystackRequest("/transaction/initialize", {
    method: "POST",
    body: JSON.stringify({
      email: input.buyerEmail,
      amount: Math.round(input.amount * 100),
      currency: input.currency,
      metadata: {
        productId: input.productId,
        productName: input.productName,
      },
      callback_url: input.successUrl,
    }),
  })) as Record<string, unknown>;

  const data = response.data as Record<string, unknown>;

  return {
    id: (data.reference as string) || "",
    provider: "paystack",
    redirectUrl: (data.authorization_url as string) || undefined,
    publishableKey: paystackConfig.publicKey,
  };
}

/**
 * Verify Paystack payment
 */
export async function verifyPaystackPayment(reference: string) {
  if (!paystackConfig.secretKey) {
    throw new Error("Paystack API key not configured");
  }

  return paystackRequest(`/transaction/verify/${reference}`, {
    method: "GET",
  });
}

/**
 * Verify Paystack webhook signature
 */
export function verifyPaystackWebhookSignature(
  body: string,
  signature: string
): boolean {
  if (!paystackConfig.webhookSecret) {
    return false;
  }

  const hash = crypto
    .createHmac("sha512", paystackConfig.webhookSecret)
    .update(body)
    .digest("hex");

  return hash === signature;
}

/**
 * Parse Paystack webhook payload
 */
export function parsePaystackWebhookPayload(body: string) {
  return JSON.parse(body);
}
