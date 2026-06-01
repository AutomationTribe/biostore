import { createServerClient } from "@/lib/supabase/server";
import { env } from "@/lib/env";
import { constructStripeWebhookEvent } from "@/modules/payments/providers/stripe";
import {
  verifyPaystackWebhookSignature,
  parsePaystackWebhookPayload,
} from "@/modules/payments/providers/paystack";
import { handleWebhook } from "@/modules/payments/service";

/**
 * POST /api/payments/webhooks
 * Handle payment webhooks from Stripe and Paystack
 *
 * Headers:
 * - stripe-signature: Stripe webhook signature
 * - x-paystack-signature: Paystack webhook signature
 * - x-paystack-provider: "paystack" (for Paystack webhooks)
 */
export async function POST(
  request: Request
): Promise<Response> {
  try {
    const supabase = await createServerClient();
    const signature = request.headers.get("stripe-signature");
    const paystackProvider = request.headers.get("x-paystack-provider");

    const body = await request.text();

    if (paystackProvider === "paystack") {
      // Handle Paystack webhook
      const paystackSignature = request.headers.get("x-paystack-signature");

      if (!paystackSignature) {
        return Response.json(
          { error: "Missing signature" },
          { status: 401 }
        );
      }

      if (!env.PAYSTACK_WEBHOOK_SECRET) {
        return Response.json(
          { error: "Paystack webhook secret not configured" },
          { status: 503 }
        );
      }

      if (
        !verifyPaystackWebhookSignature(body, paystackSignature)
      ) {
        return Response.json(
          { error: "Invalid signature" },
          { status: 401 }
        );
      }

      const payload = parsePaystackWebhookPayload(body);

      await handleWebhook(supabase, "paystack", payload.event, payload.data);

      return Response.json({ received: true });
    } else {
      // Handle Stripe webhook
      if (!signature) {
        return Response.json(
          { error: "Missing signature" },
          { status: 401 }
        );
      }

      if (!env.STRIPE_WEBHOOK_SECRET) {
        return Response.json(
          { error: "Stripe webhook secret not configured" },
          { status: 503 }
        );
      }

      const event = await constructStripeWebhookEvent(
        body,
        signature,
        env.STRIPE_WEBHOOK_SECRET
      );

      await handleWebhook(
        supabase,
        "stripe",
        event.type,
        event.data.object as Record<string, unknown>
      );

      return Response.json({ received: true });
    }
  } catch (error) {
    console.error("Webhook error:", error);
    return Response.json(
      { error: "Webhook processing failed" },
      { status: 400 }
    );
  }
}
