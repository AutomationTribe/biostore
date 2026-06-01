/**
 * Store module types
 */

export interface Product {
  id: string;
  userId: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  downloadUrl?: string;
  thumbnail?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Purchase {
  id: string;
  productId: string;
  buyerEmail: string;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed" | "refunded";
  paymentProvider: "stripe" | "paystack";
  paymentId: string;
  downloadCount: number;
  expiresAt: Date;
  createdAt: Date;
}
