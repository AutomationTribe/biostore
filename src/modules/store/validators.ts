import { z } from "zod";

/**
 * Product creation/update schema
 */
export const productSchema = z.object({
  name: z.string().min(1).max(200, "Product name must be at most 200 characters"),
  description: z.string().max(2000, "Description must be at most 2000 characters"),
  price: z.number().positive("Price must be positive"),
  currency: z.string().length(3, "Currency must be ISO 4217 code"),
  downloadUrl: z.string().url().optional(),
  thumbnail: z.string().url().optional(),
});

export type ProductInput = z.infer<typeof productSchema>;

/**
 * Purchase schema
 */
export const purchaseSchema = z.object({
  productId: z.string().uuid(),
  buyerEmail: z.string().email(),
  amount: z.number().positive(),
  currency: z.string().length(3),
  paymentProvider: z.enum(["stripe", "paystack"]),
  paymentId: z.string().min(1),
});

export type PurchaseInput = z.infer<typeof purchaseSchema>;
