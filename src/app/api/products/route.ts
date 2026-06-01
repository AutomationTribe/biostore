import { createServerClient } from "@/lib/supabase/server";
import { productSchema } from "@/modules/store/validators";
import {
  createNewProduct,
  getCreatorProducts,
} from "@/modules/store/service";
import { isAppError } from "@/lib/errors";

/**
 * GET /api/products
 * Get all products for authenticated user
 */
export async function GET(): Promise<Response> {
  try {
    // In production: extract userId from session
    const userId = "user_id_placeholder";
    const supabase = await createServerClient();

    const products = await getCreatorProducts(supabase, userId);

    return Response.json({
      success: true,
      data: { products },
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

/**
 * POST /api/products
 * Create a new product
 *
 * Request body:
 * - name: string
 * - description: string
 * - price: number
 * - currency: string
 * - downloadUrl?: string
 * - thumbnail?: string
 */
export async function POST(
  request: Request
): Promise<Response> {
  try {
    const body = await request.json();
    const input = productSchema.parse(body);

    // In production: extract userId from session
    const userId = "user_id_placeholder";
    const supabase = await createServerClient();

    const product = await createNewProduct(supabase, userId, input);

    return Response.json({
      success: true,
      data: { product },
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
