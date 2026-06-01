-- Purchases table
-- Records product purchases and transactions
CREATE TABLE IF NOT EXISTS purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  buyer_email TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'NGN',
  status TEXT DEFAULT 'pending', -- pending, completed, failed, refunded
  payment_provider TEXT NOT NULL, -- stripe, paystack
  payment_id TEXT NOT NULL UNIQUE,
  download_count INTEGER DEFAULT 0,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_purchases_product_id ON purchases(product_id);
CREATE INDEX idx_purchases_payment_id ON purchases(payment_id);
CREATE INDEX idx_purchases_buyer_email ON purchases(buyer_email);
CREATE INDEX idx_purchases_status ON purchases(status);

-- Enable RLS
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Anyone can insert purchases
CREATE POLICY "Anyone can create purchases" ON purchases
  FOR INSERT WITH CHECK (true);

-- RLS Policy: Buyers can read their own purchases
CREATE POLICY "Buyers can read own purchases" ON purchases
  FOR SELECT USING (auth.jwt()->>'email' = buyer_email);

-- RLS Policy: Sellers can read purchases of their products (through join)
CREATE POLICY "Sellers can read purchases of own products" ON purchases
  FOR SELECT USING (
    product_id IN (
      SELECT id FROM products WHERE user_id = auth.uid()
    )
  );
