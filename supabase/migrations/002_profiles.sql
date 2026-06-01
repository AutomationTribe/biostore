-- Profiles table
-- Stores user profile customization (bio, theme, avatar, etc.)
CREATE TABLE IF NOT EXISTS profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  bio TEXT DEFAULT '',
  theme TEXT DEFAULT 'professional',
  avatar TEXT,
  cover_image TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Anyone can read profiles
CREATE POLICY "Profiles are readable by anyone" ON profiles
  FOR SELECT USING (true);

-- RLS Policy: Users can only update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policy: Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);
