-- ReplyGenius AI Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Organizations (Business accounts)
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  subscription_tier VARCHAR(20) DEFAULT 'starter' CHECK (subscription_tier IN ('starter', 'growth', 'enterprise')),
  subscription_status VARCHAR(20) DEFAULT 'trialing' CHECK (subscription_status IN ('trialing', 'active', 'past_due', 'canceled')),
  stripe_customer_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255),
  trial_ends_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '14 days'),
  monthly_review_limit INTEGER DEFAULT 50,
  reviews_used_this_month INTEGER DEFAULT 0,
  billing_cycle_start DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Locations (Multi-location support)
CREATE TABLE locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  address TEXT,
  phone VARCHAR(50),
  website VARCHAR(255),
  google_place_id VARCHAR(255),
  yelp_business_id VARCHAR(255),
  facebook_page_id VARCHAR(255),
  tripadvisor_id VARCHAR(255),
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Platform Connections
CREATE TABLE platform_connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL CHECK (platform IN ('google', 'yelp', 'facebook', 'tripadvisor')),
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,
  account_id VARCHAR(255),
  is_connected BOOLEAN DEFAULT false,
  last_sync_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(location_id, platform)
);

-- Brand Voice Settings
CREATE TABLE brand_voice_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE UNIQUE,
  tone VARCHAR(50) DEFAULT 'professional' CHECK (tone IN ('professional', 'friendly', 'casual', 'formal')),
  personality_description TEXT,
  response_length VARCHAR(20) DEFAULT 'medium' CHECK (response_length IN ('short', 'medium', 'detailed')),
  include_owner_signature BOOLEAN DEFAULT true,
  owner_name VARCHAR(255),
  owner_title VARCHAR(100),
  always_apologize_negative BOOLEAN DEFAULT true,
  offer_resolution_negative BOOLEAN DEFAULT true,
  include_call_to_action BOOLEAN DEFAULT true,
  call_to_action_text TEXT DEFAULT 'We hope to see you again soon!',
  custom_instructions TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL,
  platform_review_id VARCHAR(255),
  reviewer_name VARCHAR(255),
  reviewer_avatar_url TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  review_date TIMESTAMPTZ,
  sentiment_score DECIMAL(3,2),
  sentiment_label VARCHAR(20) CHECK (sentiment_label IN ('positive', 'neutral', 'negative')),
  key_topics TEXT[],
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'draft', 'approved', 'posted', 'failed')),
  is_urgent BOOLEAN DEFAULT false,
  platform_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(platform, platform_review_id)
);

-- Responses
CREATE TABLE responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  review_id UUID REFERENCES reviews(id) ON DELETE CASCADE,
  response_text TEXT NOT NULL,
  is_ai_generated BOOLEAN DEFAULT true,
  ai_model_used VARCHAR(50),
  tokens_used INTEGER,
  edited_by UUID REFERENCES users(id),
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMPTZ,
  posted_at TIMESTAMPTZ,
  post_error TEXT,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Response Templates
CREATE TABLE response_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(50),
  template_text TEXT NOT NULL,
  variables TEXT[],
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activity Log
CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50),
  entity_id UUID,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analytics (Daily aggregates)
CREATE TABLE analytics_daily (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  platform VARCHAR(50),
  total_reviews INTEGER DEFAULT 0,
  positive_reviews INTEGER DEFAULT 0,
  neutral_reviews INTEGER DEFAULT 0,
  negative_reviews INTEGER DEFAULT 0,
  responses_generated INTEGER DEFAULT 0,
  responses_posted INTEGER DEFAULT 0,
  avg_response_time_minutes INTEGER,
  avg_rating DECIMAL(2,1),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, location_id, date, platform)
);

-- Indexes
CREATE INDEX idx_reviews_location ON reviews(location_id);
CREATE INDEX idx_reviews_status ON reviews(status);
CREATE INDEX idx_reviews_platform ON reviews(platform);
CREATE INDEX idx_reviews_created ON reviews(created_at DESC);
CREATE INDEX idx_responses_review ON responses(review_id);
CREATE INDEX idx_activity_org ON activity_log(organization_id);
CREATE INDEX idx_analytics_org_date ON analytics_daily(organization_id, date);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_locations_updated_at BEFORE UPDATE ON locations FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_responses_updated_at BEFORE UPDATE ON responses FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_brand_voice_updated_at BEFORE UPDATE ON brand_voice_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Row Level Security
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_voice_settings ENABLE ROW LEVEL SECURITY;
