// Organization & User Types
export interface Organization {
  id: string;
  name: string;
  slug: string;
  subscription_tier: 'starter' | 'growth' | 'enterprise';
  subscription_status: 'trialing' | 'active' | 'past_due' | 'canceled';
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  trial_ends_at?: string;
  monthly_review_limit: number;
  reviews_used_this_month: number;
  billing_cycle_start: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  organization_id: string;
  email: string;
  full_name?: string;
  role: 'owner' | 'admin' | 'member';
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

// Location Types
export interface Location {
  id: string;
  organization_id: string;
  name: string;
  address?: string;
  phone?: string;
  website?: string;
  google_place_id?: string;
  yelp_business_id?: string;
  facebook_page_id?: string;
  tripadvisor_id?: string;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

// Platform Types
export type Platform = 'google' | 'yelp' | 'facebook' | 'tripadvisor';

export interface PlatformConnection {
  id: string;
  location_id: string;
  platform: Platform;
  access_token?: string;
  refresh_token?: string;
  token_expires_at?: string;
  account_id?: string;
  is_connected: boolean;
  last_sync_at?: string;
  created_at: string;
  updated_at: string;
}

// Review Types
export type ReviewStatus = 'pending' | 'draft' | 'approved' | 'posted' | 'failed';
export type SentimentLabel = 'positive' | 'neutral' | 'negative';

export interface Review {
  id: string;
  location_id: string;
  platform: Platform;
  platform_review_id?: string;
  reviewer_name?: string;
  reviewer_avatar_url?: string;
  rating: number;
  review_text?: string;
  review_date?: string;
  sentiment_score?: number;
  sentiment_label?: SentimentLabel;
  key_topics?: string[];
  status: ReviewStatus;
  is_urgent: boolean;
  platform_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Response {
  id: string;
  review_id: string;
  response_text: string;
  is_ai_generated: boolean;
  ai_model_used?: string;
  tokens_used?: number;
  edited_by?: string;
  approved_by?: string;
  approved_at?: string;
  posted_at?: string;
  post_error?: string;
  version: number;
  created_at: string;
  updated_at: string;
}

// Brand Voice Types
export type ToneType = 'professional' | 'friendly' | 'casual' | 'formal';
export type ResponseLength = 'short' | 'medium' | 'detailed';

export interface BrandVoiceSettings {
  id: string;
  organization_id: string;
  tone: ToneType;
  personality_description?: string;
  response_length: ResponseLength;
  include_owner_signature: boolean;
  owner_name?: string;
  owner_title?: string;
  always_apologize_negative: boolean;
  offer_resolution_negative: boolean;
  include_call_to_action: boolean;
  call_to_action_text?: string;
  custom_instructions?: string;
  created_at: string;
  updated_at: string;
}

// Template Types
export interface ResponseTemplate {
  id: string;
  organization_id: string;
  name: string;
  category?: string;
  template_text: string;
  variables?: string[];
  usage_count: number;
  created_at: string;
  updated_at: string;
}

// Analytics Types
export interface AnalyticsDaily {
  id: string;
  organization_id: string;
  location_id: string;
  date: string;
  platform?: Platform;
  total_reviews: number;
  positive_reviews: number;
  neutral_reviews: number;
  negative_reviews: number;
  responses_generated: number;
  responses_posted: number;
  avg_response_time_minutes?: number;
  avg_rating?: number;
  created_at: string;
}

// Activity Log
export interface ActivityLog {
  id: string;
  organization_id: string;
  user_id?: string;
  action: string;
  entity_type?: string;
  entity_id?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

// Pricing Plans
export interface PricingPlan {
  id: string;
  name: string;
  monthlyPrice: number;
  setupDeposit: number;
  reviewsPerMonth: number;
  locations: number;
  features: string[];
  popular?: boolean;
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    monthlyPrice: 199,
    setupDeposit: 500,
    reviewsPerMonth: 50,
    locations: 1,
    features: [
      'AI-powered responses',
      'Google & Yelp integration',
      'Basic analytics',
      'Email support',
      '14-day free trial',
    ],
  },
  {
    id: 'growth',
    name: 'Growth',
    monthlyPrice: 399,
    setupDeposit: 1000,
    reviewsPerMonth: 150,
    locations: 3,
    popular: true,
    features: [
      'All Starter features',
      'All platforms (Google, Yelp, Facebook, TripAdvisor)',
      'Advanced analytics & reporting',
      'Custom brand voice',
      'Response templates',
      'Priority support',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    monthlyPrice: 699,
    setupDeposit: 2000,
    reviewsPerMonth: 500,
    locations: 10,
    features: [
      'All Growth features',
      'Unlimited locations available',
      'Full analytics suite',
      'Dedicated account manager',
      'API access',
      'White-label options',
      'Custom integrations',
    ],
  },
];

// API Types
export interface GenerateResponseRequest {
  reviewId: string;
  reviewText: string;
  rating: number;
  reviewerName?: string;
  platform: Platform;
  businessName: string;
  organizationId: string;
}

export interface GenerateResponseResult {
  response: string;
  tokensUsed: number;
}

export interface SentimentAnalysis {
  score: number;
  label: SentimentLabel;
  keyTopics: string[];
}
