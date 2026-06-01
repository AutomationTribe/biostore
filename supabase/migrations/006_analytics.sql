-- Page views table
-- Tracks visits to user's profile page
CREATE TABLE IF NOT EXISTS page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  path TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  ip_address TEXT,
  viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_page_views_user_id ON page_views(user_id);
CREATE INDEX idx_page_views_user_date ON page_views(user_id, viewed_at);

-- Click events table
-- Tracks clicks on user's links
CREATE TABLE IF NOT EXISTS click_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  link_id UUID NOT NULL REFERENCES links(id) ON DELETE CASCADE,
  referrer TEXT,
  user_agent TEXT,
  ip_address TEXT,
  clicked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_click_events_user_id ON click_events(user_id);
CREATE INDEX idx_click_events_link_id ON click_events(link_id);
CREATE INDEX idx_click_events_user_date ON click_events(user_id, clicked_at);

-- Payment intents table
-- Stores payment processing state
CREATE TABLE IF NOT EXISTS payment_intents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'NGN',
  provider TEXT NOT NULL, -- stripe, paystack
  client_secret TEXT,
  status TEXT DEFAULT 'pending', -- pending, processing, succeeded, failed
  metadata JSONB,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_payment_intents_user_id ON payment_intents(user_id);
CREATE INDEX idx_payment_intents_status ON payment_intents(status);
CREATE INDEX idx_payment_intents_created ON payment_intents(created_at);

-- Transactions table
-- Final transaction records
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  provider TEXT NOT NULL,
  transaction_id TEXT NOT NULL UNIQUE,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'NGN',
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_product_id ON transactions(product_id);
CREATE INDEX idx_transactions_status ON transactions(status);

-- Enable RLS on analytics tables
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE click_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_intents ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can read their own analytics
CREATE POLICY "Users can read own analytics" ON page_views
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can read own click events" ON click_events
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can read own payment intents" ON payment_intents
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can read own transactions" ON transactions
  FOR SELECT USING (auth.uid() = user_id);
