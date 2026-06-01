import { SupabaseClient } from "@supabase/supabase-js";
import { Product, Purchase } from "@/modules/store/types";

/**
 * Create a new product
 */
export async function createProduct(
  supabase: SupabaseClient,
  userId: string,
  data: Omit<Product, "id" | "createdAt" | "updatedAt">
): Promise<Product> {
  const { error, data: product } = await supabase
    .from("products")
    .insert([
      {
        user_id: userId,
        name: data.name,
        description: data.description,
        price: data.price,
        currency: data.currency,
        download_url: data.downloadUrl,
        thumbnail: data.thumbnail,
      },
    ])
    .select()
    .single();

  if (error || !product) throw error;

  return {
    id: product.id,
    userId: product.user_id,
    name: product.name,
    description: product.description,
    price: product.price,
    currency: product.currency,
    downloadUrl: product.download_url,
    thumbnail: product.thumbnail,
    createdAt: new Date(product.created_at),
    updatedAt: new Date(product.updated_at),
  };
}

/**
 * Get product by ID
 */
export async function getProduct(
  supabase: SupabaseClient,
  productId: string
): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select()
    .eq("id", productId)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    userId: data.user_id,
    name: data.name,
    description: data.description,
    price: data.price,
    currency: data.currency,
    downloadUrl: data.download_url,
    thumbnail: data.thumbnail,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  };
}

/**
 * Get all products by user
 */
export async function getUserProducts(
  supabase: SupabaseClient,
  userId: string
): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select()
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map((product) => ({
    id: product.id,
    userId: product.user_id,
    name: product.name,
    description: product.description,
    price: product.price,
    currency: product.currency,
    downloadUrl: product.download_url,
    thumbnail: product.thumbnail,
    createdAt: new Date(product.created_at),
    updatedAt: new Date(product.updated_at),
  }));
}

/**
 * Record a purchase
 */
export async function recordPurchase(
  supabase: SupabaseClient,
  data: Omit<Purchase, "id" | "createdAt" | "downloadCount">
): Promise<Purchase> {
  const { error, data: purchase } = await supabase
    .from("purchases")
    .insert([
      {
        product_id: data.productId,
        buyer_email: data.buyerEmail,
        amount: data.amount,
        currency: data.currency,
        status: data.status,
        payment_provider: data.paymentProvider,
        payment_id: data.paymentId,
        expires_at: data.expiresAt,
      },
    ])
    .select()
    .single();

  if (error || !purchase) throw error;

  return {
    id: purchase.id,
    productId: purchase.product_id,
    buyerEmail: purchase.buyer_email,
    amount: purchase.amount,
    currency: purchase.currency,
    status: purchase.status,
    paymentProvider: purchase.payment_provider,
    paymentId: purchase.payment_id,
    downloadCount: purchase.download_count,
    expiresAt: new Date(purchase.expires_at),
    createdAt: new Date(purchase.created_at),
  };
}

/**
 * Get purchase by ID
 */
export async function getPurchase(
  supabase: SupabaseClient,
  purchaseId: string
): Promise<Purchase | null> {
  const { data, error } = await supabase
    .from("purchases")
    .select()
    .eq("id", purchaseId)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    productId: data.product_id,
    buyerEmail: data.buyer_email,
    amount: data.amount,
    currency: data.currency,
    status: data.status,
    paymentProvider: data.payment_provider,
    paymentId: data.payment_id,
    downloadCount: data.download_count,
    expiresAt: new Date(data.expires_at),
    createdAt: new Date(data.created_at),
  };
}
