import { SupabaseClient } from "@supabase/supabase-js";
import { AppError, ErrorCode } from "@/lib/errors";
import {
  createPaymentIntent,
  getPaymentIntent,
  updatePaymentIntentStatus,
  createTransaction,
  updateTransactionStatus,
} from "@/modules/payments/repository";
import { CheckoutInput } from "@/modules/payments/validators";
import { CheckoutSession, PaymentProvider } from "@/modules/payments/types";
import { createStripeCheckout } from "@/modules/payments/providers/stripe";
import {
  createPaystackCheckout,
  verifyPaystackPayment,
} from "@/modules/payments/providers/paystack";

/**
 * Get appropriate payment provider based on user country
 * This is a factory pattern that selects Stripe or Paystack based on context
 */
function getProvider(
  userCountry?: string
): PaymentProvider {
  // Default to Paystack for African creators, Stripe as fallback
  // This can be extended with more sophisticated logic based on user region
  if (userCountry?.toLowerCase().startsWith("ng")) {
    return "paystack";
  }
  return "stripe";
}

/**
 * Create checkout session
 */
export async function createCheckout(
  supabase: SupabaseClient,
  userId: string,
  input: CheckoutInput & { productName: string }
): Promise<CheckoutSession> {
  // Determine which provider to use
  const provider = input.provider === "paystack" ? "paystack" : "stripe";

  try {
    let session: CheckoutSession;

    if (provider === "paystack") {
      session = await createPaystackCheckout({
        productId: input.productId,
        productName: input.productName,
        amount: input.amount,
        currency: input.currency,
        buyerEmail: input.buyerEmail,
        successUrl: input.successUrl,
        cancelUrl: input.cancelUrl,
      });
    } else {
      session = await createStripeCheckout({
        productId: input.productId,
        productName: input.productName,
        amount: input.amount,
        currency: input.currency,
        buyerEmail: input.buyerEmail,
        successUrl: input.successUrl,
        cancelUrl: input.cancelUrl,
      });
    }

    // Record payment intent
    await createPaymentIntent(supabase, {
      userId,
      productId: input.productId,
      amount: input.amount,
      currency: input.currency,
      provider,
      clientSecret: session.clientSecret,
      status: "pending",
      metadata: {
        sessionId: session.id,
        email: input.buyerEmail,
      },
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    });

    return session;
  } catch (error) {
    throw new AppError(
      ErrorCode.PAYMENT_FAILED,
      "Failed to create checkout session",
      500,
      { error: error instanceof Error ? error.message : "Unknown error" }
    );
  }
}

/**
 * Handle payment webhook
 */
export async function handleWebhook(
  supabase: SupabaseClient,
  provider: PaymentProvider,
  event: string,
  data: Record<string, unknown>
): Promise<void> {
  try {
    if (provider === "paystack") {
      if (event === "charge.success") {
        const reference = (data.reference as string) || "";
        const payment = await verifyPaystackPayment(reference);
        const paymentData = (payment as Record<string, unknown>).data as Record<
          string,
          unknown
        >;

        if (paymentData.status === "success") {
          await updateTransactionStatus(supabase, reference, "completed");
        }
      }
    } else if (provider === "stripe") {
      if (event === "charge.succeeded") {
        const chargeId = (data.id as string) || "";
        await updateTransactionStatus(supabase, chargeId, "completed");
      }
    }
  } catch (error) {
    throw new AppError(
      ErrorCode.INTERNAL_SERVER_ERROR,
      "Failed to process webhook",
      500,
      { error: error instanceof Error ? error.message : "Unknown error" }
    );
  }
}

/**
 * Get payout details for a creator
 */
export async function getPayout(
  supabase: SupabaseClient,
  userId: string
): Promise<{ totalEarnings: number; pendingEarnings: number }> {
  // Query completed transactions for this user
  const { data, error } = await supabase
    .from("transactions")
    .select("amount, status")
    .eq("user_id", userId);

  if (error) {
    throw new AppError(
      ErrorCode.INTERNAL_SERVER_ERROR,
      "Failed to fetch payout info",
      500
    );
  }

  let totalEarnings = 0;
  let pendingEarnings = 0;

  (data || []).forEach((transaction: Record<string, unknown>) => {
    const amount = (transaction.amount as number) || 0;
    if (transaction.status === "completed") {
      totalEarnings += amount;
    } else if (transaction.status === "pending") {
      pendingEarnings += amount;
    }
  });

  return { totalEarnings, pendingEarnings };
}
