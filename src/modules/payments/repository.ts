import { SupabaseClient } from "@supabase/supabase-js";
import { PaymentIntent } from "@/modules/payments/types";

/**
 * Create payment intent
 */
export async function createPaymentIntent(
  supabase: SupabaseClient,
  data: Omit<PaymentIntent, "id" | "createdAt">
): Promise<PaymentIntent> {
  const { error, data: intent } = await supabase
    .from("payment_intents")
    .insert([
      {
        user_id: data.userId,
        product_id: data.productId,
        amount: data.amount,
        currency: data.currency,
        provider: data.provider,
        client_secret: data.clientSecret,
        status: data.status,
        metadata: data.metadata,
        expires_at: data.expiresAt,
      },
    ])
    .select()
    .single();

  if (error || !intent) throw error;

  return {
    id: intent.id,
    userId: intent.user_id,
    productId: intent.product_id,
    amount: intent.amount,
    currency: intent.currency,
    provider: intent.provider,
    clientSecret: intent.client_secret,
    status: intent.status,
    metadata: intent.metadata,
    createdAt: new Date(intent.created_at),
    expiresAt: new Date(intent.expires_at),
  };
}

/**
 * Get payment intent
 */
export async function getPaymentIntent(
  supabase: SupabaseClient,
  intentId: string
): Promise<PaymentIntent | null> {
  const { data, error } = await supabase
    .from("payment_intents")
    .select()
    .eq("id", intentId)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    userId: data.user_id,
    productId: data.product_id,
    amount: data.amount,
    currency: data.currency,
    provider: data.provider,
    clientSecret: data.client_secret,
    status: data.status,
    metadata: data.metadata,
    createdAt: new Date(data.created_at),
    expiresAt: new Date(data.expires_at),
  };
}

/**
 * Update payment intent status
 */
export async function updatePaymentIntentStatus(
  supabase: SupabaseClient,
  intentId: string,
  status: PaymentIntent["status"]
): Promise<PaymentIntent> {
  const { error, data } = await supabase
    .from("payment_intents")
    .update({ status })
    .eq("id", intentId)
    .select()
    .single();

  if (error || !data) throw error;

  return {
    id: data.id,
    userId: data.user_id,
    productId: data.product_id,
    amount: data.amount,
    currency: data.currency,
    provider: data.provider,
    clientSecret: data.client_secret,
    status: data.status,
    metadata: data.metadata,
    createdAt: new Date(data.created_at),
    expiresAt: new Date(data.expires_at),
  };
}

/**
 * Create transaction record
 */
export async function createTransaction(
  supabase: SupabaseClient,
  data: {
    userId: string;
    productId: string;
    provider: string;
    transactionId: string;
    amount: number;
    currency: string;
    status: string;
  }
): Promise<void> {
  const { error } = await supabase.from("transactions").insert([data]);

  if (error) throw error;
}

/**
 * Update transaction status
 */
export async function updateTransactionStatus(
  supabase: SupabaseClient,
  transactionId: string,
  status: string
): Promise<void> {
  const { error } = await supabase
    .from("transactions")
    .update({ status })
    .eq("id", transactionId);

  if (error) throw error;
}
