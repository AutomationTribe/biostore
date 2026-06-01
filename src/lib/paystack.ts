import { env } from "@/lib/env";

/**
 * Paystack API client
 * Configuration for Paystack payment provider
 * All values may be undefined if not configured
 */
export const paystackConfig = {
  secretKey: env.PAYSTACK_SECRET_KEY,
  publicKey: env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
  baseUrl: "https://api.paystack.co",
  webhookSecret: env.PAYSTACK_WEBHOOK_SECRET,
};

/**
 * Make authenticated request to Paystack API
 */
export async function paystackRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<unknown> {
  const response = await fetch(
    `${paystackConfig.baseUrl}${endpoint}`,
    {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${paystackConfig.secretKey}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Paystack API error: ${response.statusText}`);
  }

  return response.json();
}
