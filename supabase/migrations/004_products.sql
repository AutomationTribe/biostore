-- Products table
-- Stores digital products users are selling
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'NGN',
  download_url TEXT,
  thumbnail TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_products_user_id ON products(user_id);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Anyone can read published products
CREATE POLICY "Products are readable by anyone" ON products
  FOR SELECT USING (true);

-- RLS Policy: Users can manage their own products
CREATE POLICY "Users can manage own products" ON products
  FOR ALL USING (auth.uid() = user_id);
