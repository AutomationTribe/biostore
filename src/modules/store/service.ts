import { SupabaseClient } from "@supabase/supabase-js";
import { AppError, ErrorCode } from "@/lib/errors";
import {
  createProduct,
  getProduct,
  getUserProducts,
  recordPurchase,
  getPurchase,
} from "@/modules/store/repository";
import { ProductInput, PurchaseInput } from "@/modules/store/validators";
import { Product, Purchase } from "@/modules/store/types";

/**
 * Create a new product
 */
export async function createNewProduct(
  supabase: SupabaseClient,
  userId: string,
  input: ProductInput
): Promise<Product> {
  return createProduct(supabase, userId, {
    userId,
    name: input.name,
    description: input.description,
    price: input.price,
    currency: input.currency,
    downloadUrl: input.downloadUrl,
    thumbnail: input.thumbnail,
  });
}

/**
 * Get all products for a user
 */
export async function getCreatorProducts(
  supabase: SupabaseClient,
  userId: string
): Promise<Product[]> {
  return getUserProducts(supabase, userId);
}

/**
 * Get product details
 */
export async function getProductDetails(
  supabase: SupabaseClient,
  productId: string
): Promise<Product> {
  const product = await getProduct(supabase, productId);

  if (!product) {
    throw new AppError(
      ErrorCode.PRODUCT_NOT_FOUND,
      "Product not found",
      404
    );
  }

  return product;
}

/**
 * Record a purchase
 */
export async function recordNewPurchase(
  supabase: SupabaseClient,
  input: PurchaseInput
): Promise<Purchase> {
  // Verify product exists
  const product = await getProduct(supabase, input.productId);
  if (!product) {
    throw new AppError(
      ErrorCode.PRODUCT_NOT_FOUND,
      "Product not found",
      404
    );
  }

  return recordPurchase(supabase, {
    productId: input.productId,
    buyerEmail: input.buyerEmail,
    amount: input.amount,
    currency: input.currency,
    status: "completed",
    paymentProvider: input.paymentProvider,
    paymentId: input.paymentId,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
  });
}

/**
 * Get purchase details
 */
export async function getPurchaseDetails(
  supabase: SupabaseClient,
  purchaseId: string
): Promise<Purchase> {
  const purchase = await getPurchase(supabase, purchaseId);

  if (!purchase) {
    throw new AppError(
      ErrorCode.PURCHASE_NOT_FOUND,
      "Purchase not found",
      404
    );
  }

  return purchase;
}

/**
 * Generate download URL for a purchase (time-limited)
 */
export async function generateDownloadUrl(
  supabase: SupabaseClient,
  purchaseId: string
): Promise<string> {
  const purchase = await getPurchaseDetails(supabase, purchaseId);
  const product = await getProductDetails(supabase, purchase.productId);

  if (!product.downloadUrl) {
    throw new AppError(
      ErrorCode.INTERNAL_SERVER_ERROR,
      "Product download URL not available",
      500
    );
  }

  // Generate signed URL (implementation depends on storage provider)
  return product.downloadUrl;
}
