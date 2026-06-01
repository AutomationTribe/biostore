import { createServerClient } from "@/lib/supabase/server";
import { checkoutSchema } from "@/modules/payments/validators";
import { createCheckout } from "@/modules/payments/service";
import { getProductDetails } from "@/modules/store/service";
import { isAppError } from "@/lib/errors";

/**
 * POST /api/payments/checkout
 * Create a checkout session (Stripe or Paystack)
 *
 * Request body:
 * - productId: string (UUID)
 * - amount: number
 * - currency: string (ISO 4217)
 * - buyerEmail: string
 * - provider: "stripe" | "paystack"
 * - successUrl: string
 * - cancelUrl: string
 */
export async function POST(
  request: Request
): Promise<Response> {
  try {
    const body = await request.json();
    const input = checkoutSchema.parse(body);

    // In production: extract userId from session
    const userId = "user_id_placeholder";
    const supabase = await createServerClient();

    // Get product to include name
    const product = await getProductDetails(supabase, input.productId);

    // Create checkout session
    const session = await createCheckout(supabase, userId, {
      ...input,
      productName: product.name,
    });

    return Response.json({
      success: true,
      data: { session },
    });
  } catch (error) {
    if (isAppError(error)) {
      return Response.json(error.toJSON(), {
        status: error.status,
      });
    }

    return Response.json(
      {
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred",
        },
      },
      { status: 500 }
    );
  }
}
