-- Links table
-- Stores user's bio links
CREATE TABLE IF NOT EXISTS links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT,
  "order" INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_links_user_id ON links(user_id);
CREATE INDEX idx_links_user_order ON links(user_id, "order");

-- Enable RLS
ALTER TABLE links ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Anyone can read published links
CREATE POLICY "Links are readable by anyone" ON links
  FOR SELECT USING (active = true);

-- RLS Policy: Users can read their own links (active or not)
CREATE POLICY "Users can read own links" ON links
  FOR SELECT USING (auth.uid() = user_id);

-- RLS Policy: Users can manage their own links
CREATE POLICY "Users can manage own links" ON links
  FOR ALL USING (auth.uid() = user_id);
