import { stripe } from "@/lib/stripe";
import { CheckoutSession } from "@/modules/payments/types";

/**
 * Create Stripe checkout session
 */
export async function createStripeCheckout(input: {
  productId: string;
  productName: string;
  amount: number;
  currency: string;
  buyerEmail: string;
  successUrl: string;
  cancelUrl: string;
}): Promise<CheckoutSession> {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: input.currency.toLowerCase(),
          product_data: {
            name: input.productName,
          },
          unit_amount: Math.round(input.amount * 100), // Convert to cents
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: input.successUrl,
    cancel_url: input.cancelUrl,
    customer_email: input.buyerEmail,
    metadata: {
      productId: input.productId,
    },
  });

  return {
    id: session.id,
    provider: "stripe",
    clientSecret: session.client_secret || undefined,
    redirectUrl: session.url || undefined,
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  };
}

/**
 * Retrieve Stripe session
 */
export async function getStripeSession(sessionId: string) {
  return stripe.checkout.sessions.retrieve(sessionId);
}

/**
 * Construct Stripe webhook event
 */
export async function constructStripeWebhookEvent(
  body: string,
  signature: string,
  secret: string
) {
  return stripe.webhooks.constructEvent(body, signature, secret);
}
