# GraniteReply AI

<div align="center">
  <img src="https://img.shields.io/badge/Version-1.1.0-orange?style=for-the-badge" alt="Version 1.1.0" />
  <img src="https://img.shields.io/badge/Next.js-14.0-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Supabase-Database-green?style=for-the-badge&logo=supabase" alt="Supabase" />
  <img src="https://img.shields.io/badge/OpenAI-GPT--4-412991?style=for-the-badge&logo=openai" alt="OpenAI" />
  <img src="https://img.shields.io/badge/Google-Business%20API-4285F4?style=for-the-badge&logo=google" alt="Google" />
  <img src="https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Vitest-Testing-6E9F18?style=for-the-badge&logo=vitest" alt="Vitest" />
</div>

<br />

<div align="center">
  <strong>AI-Powered Review Response Platform for Local Businesses</strong>
  <br />
  <br />
  <p>Stop spending hours crafting review responses. GraniteReply AI generates personalized, on-brand replies to your Google, Yelp, Facebook, and TripAdvisor reviews in seconds.</p>
</div>

---

## 🚀 Features

- **AI-Powered Responses** - Generate personalized, human-sounding responses using GPT-4
- **Google Business Profile Integration** - Connect and auto-respond to Google reviews
- **Multi-Platform Support** - Manage reviews from Google, Yelp, Facebook, and TripAdvisor in one dashboard
- **Custom Brand Voice** - Train the AI to match your unique tone, personality, and communication style
- **Sentiment Analysis** - Automatically detect negative reviews and prioritize urgent responses
- **Approval Workflow** - Review and edit AI responses before posting with one-click approval
- **Analytics & Reports** - Track response rates, sentiment trends, and review volume
- **Multi-Location Support** - Manage multiple business locations from a single account
- **Live Chat Assistant** - AI-powered chat widget for customer inquiries
- **Response Templates** - Create and save templates for common review scenarios
- **Secure Authentication** - Google OAuth and email/password login via Supabase Auth

---

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **Database** | Supabase (PostgreSQL) |
| **Authentication** | Supabase Auth (Google OAuth + Email) |
| **AI** | OpenAI GPT-4 |
| **Google Integration** | Google Business Profile API |
| **Testing** | Vitest + jsdom |
| **Deployment** | Vercel |
| **Payments** | Stripe (planned) |

---

## 📁 Project Structure

```
replygenius-ai/
├── vitest.config.ts                     # Test runner configuration
├── src/
│   ├── middleware.ts                     # Auth protection for routes
│   ├── __tests__/
│   │   └── setup.ts                     # Global test setup & mocks
│   ├── app/
│   │   ├── api/
│   │   │   ├── ai/
│   │   │   │   ├── generate/
│   │   │   │   │   └── route.ts         # AI response generation
│   │   │   │   └── __tests__/
│   │   │   │       └── generate.test.ts # AI generation API tests
│   │   │   ├── auth/
│   │   │   │   └── google/
│   │   │   │       ├── route.ts         # Google Business OAuth initiation
│   │   │   │       └── callback/
│   │   │   │           └── route.ts     # Google Business OAuth callback
│   │   │   ├── chat/
│   │   │   │   └── route.ts             # Chat widget API
│   │   │   ├── demo/
│   │   │   │   └── generate/
│   │   │   │       └── route.ts         # Demo response generation
│   │   │   ├── leads/
│   │   │   │   ├── submit/
│   │   │   │   │   └── route.ts         # Lead submission endpoint
│   │   │   │   └── __tests__/
│   │   │   │       └── submit.test.ts   # Lead submission API tests
│   │   │   └── reviews/
│   │   │       ├── sync/
│   │   │       │   └── route.ts         # Sync reviews from Google
│   │   │       └── respond/
│   │   │           └── route.ts         # Post responses to Google
│   │   ├── auth/
│   │   │   └── callback/
│   │   │       └── route.ts             # Supabase auth callback
│   │   ├── admin/
│   │   │   └── page.tsx                 # Admin dashboard
│   │   ├── assessment/
│   │   │   └── page.tsx                 # Sales qualification tool
│   │   ├── dashboard/
│   │   │   ├── layout.tsx               # Dashboard layout with sidebar
│   │   │   ├── page.tsx                 # Dashboard home
│   │   │   ├── analytics/
│   │   │   │   └── page.tsx             # Analytics page
│   │   │   ├── locations/
│   │   │   │   └── page.tsx             # Locations management
│   │   │   ├── reviews/
│   │   │   │   └── page.tsx             # Reviews management
│   │   │   └── settings/
│   │   │       └── page.tsx             # Settings & platform connections
│   │   ├── login/
│   │   │   └── page.tsx                 # Login page (Supabase Auth)
│   │   ├── signup/
│   │   │   └── page.tsx                 # Signup page (Supabase Auth)
│   │   ├── forgot-password/
│   │   │   └── page.tsx                 # Password reset request
│   │   ├── reset-password/
│   │   │   └── page.tsx                 # Password reset form
│   │   ├── not-found.tsx                # 404 page
│   │   ├── globals.css                  # Global styles & animations
│   │   ├── layout.tsx                   # Root layout with chat widget
│   │   └── page.tsx                     # Landing page
│   ├── components/
│   │   └── ChatWidget.tsx               # Floating chat assistant
│   ├── lib/
│   │   ├── ai/
│   │   │   ├── response-generator.ts    # OpenAI review responses
│   │   │   ├── chat-config.ts           # Chat assistant configuration
│   │   │   └── __tests__/
│   │   │       ├── response-generator.test.ts  # AI generator tests (50 cases)
│   │   │       └── chat-config.test.ts         # Chat config tests (28 cases)
│   │   ├── google/
│   │   │   ├── business-profile.ts      # Google Business Profile API
│   │   │   └── __tests__/
│   │   │       └── business-profile.test.ts    # Google API tests (30 cases)
│   │   ├── supabase/
│   │   │   ├── client.ts               # Supabase browser client
│   │   │   ├── server.ts               # Supabase server client + admin
│   │   │   └── middleware.ts            # Session management utilities
│   │   ├── utils.ts                     # Utility functions
│   │   └── __tests__/
│   │       └── utils.test.ts            # Utility tests (35 cases)
│   └── types/
│       ├── index.ts                     # TypeScript type definitions
│       └── __tests__/
│           └── pricing-plans.test.ts    # Pricing data contract tests (14 cases)
├── supabase/
│   └── schema.sql                       # Database schema with RLS
├── public/                              # Static assets and images
├── tailwind.config.ts                   # Tailwind configuration
├── next.config.js                       # Next.js configuration
├── tsconfig.json                        # TypeScript configuration
└── package.json                         # Dependencies & scripts
```

---

## ⚡ Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- OpenAI API key
- Google Cloud account (for Google Business Profile)

### 1. Clone the Repository

```bash
git clone https://github.com/mpalmer79/replygenius-ai.git
cd replygenius-ai
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# OpenAI
OPENAI_API_KEY=sk-your-openai-api-key

# Google Business Profile
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Set Up Database

1. Create a new project in [Supabase](https://supabase.com)
2. Go to SQL Editor
3. Run the contents of `supabase/schema.sql`
4. Go to Authentication → Policies and verify RLS policies are created

### 5. Set Up Supabase Auth

1. Go to Authentication → Sign In / Providers
2. Enable **Email** provider
3. Enable **Google** provider and add your OAuth credentials
4. Copy the Supabase callback URL and add it to Google Cloud Console

### 6. Set Up Google Cloud

See [Google Business Profile Setup](#-google-business-profile-setup) section below.

### 7. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 8. Run Tests

```bash
npm test
```

---

## 🧪 Testing

GraniteReply uses **Vitest** with **jsdom** for a comprehensive test suite. All external dependencies (OpenAI, Supabase, Google APIs) are mocked so tests run fast and offline.

### Running Tests

```bash
# Run all tests once
npm test

# Watch mode (re-runs on file changes)
npm run test:watch

# Run with coverage report
npm run test:coverage

# Open Vitest UI in browser
npm run test:ui
```

### Test Coverage

| Test File | Cases | What It Covers |
|-----------|-------|----------------|
| `utils.test.ts` | 35 | All 11 utility functions — time formatting, currency, platform maps, stars, slugs, email validation |
| `response-generator.test.ts` | 50 | Prompt construction (4 tones, 3 lengths, negative/mixed handling, CTA, signatures, language detection), OpenAI params, response parsing |
| `chat-config.test.ts` | 28 | System prompt accuracy (pricing must match PRICING_PLANS), guardrails, escalation triggers, blocked topics |
| `business-profile.test.ts` | 30 | Token refresh, account/location/review fetching, reply post/delete, pagination, sync with upsert & error counting |
| `pricing-plans.test.ts` | 14 | Data contract — tier ordering, exact prices, feature inheritance, popular flag |
| `submit.test.ts` | 8 | Lead form validation, Resend email integration, graceful degradation when email fails |
| `generate.test.ts` | 12 | Field validation, brand voice fetch with fallback, response saving, status updates, error paths |
| **Total** | **167** | |

### Test Architecture

Tests follow the **co-location pattern** — each `__tests__/` folder sits next to the source code it tests:

```
src/lib/ai/response-generator.ts        ← Source
src/lib/ai/__tests__/response-generator.test.ts  ← Tests
```

**Global mocks** are configured in `src/__tests__/setup.ts`:
- **OpenAI** — `mockOpenAICreate` function that tests can configure per-test
- **Supabase** — Chainable query builder mimicking Supabase's fluent API
- **Next.js** — `cookies()`, `useRouter()`, `usePathname()`, `useSearchParams()`
- **Environment variables** — Pre-set for all test runs

---

## 🔗 Google Business Profile Setup

To enable automatic Google review syncing and responding:

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project called "GraniteReply"

### 2. Enable APIs

Enable these APIs in your project:
- My Business Account Management API
- My Business Business Information API
- Business Profile Performance API

### 3. Configure OAuth Consent Screen

1. Go to **APIs & Services** → **OAuth consent screen**
2. Select **External** user type
3. Fill in app information:
   - App name: `GraniteReply`
   - User support email: Your email
   - Developer contact: Your email
4. Add scopes:
   - `https://www.googleapis.com/auth/business.manage`

### 4. Create OAuth Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. Select **Web application**
4. Add authorized JavaScript origins:
   - `https://your-app.vercel.app`
   - `http://localhost:3000`
5. Add authorized redirect URIs:
   - `https://your-app.vercel.app/api/auth/google/callback` (Google Business Profile)
   - `http://localhost:3000/api/auth/google/callback` (Local development)
   - `https://your-project-ref.supabase.co/auth/v1/callback` (Supabase Auth)
6. Copy **Client ID** and **Client Secret**

### 5. Add to Environment Variables

Add to Vercel environment variables:
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

---

## 🗄 Database Schema

The application uses the following main tables:

| Table | Description |
|-------|-------------|
| `organizations` | Business accounts and subscription info |
| `users` | User accounts linked to organizations |
| `locations` | Business locations for multi-location support |
| `platform_connections` | OAuth connections to review platforms |
| `brand_voice_settings` | AI personality and tone configuration |
| `reviews` | Imported reviews from all platforms |
| `responses` | AI-generated and posted responses |
| `response_templates` | Saved response templates |
| `activity_log` | Audit trail of all actions |
| `analytics_daily` | Daily aggregated metrics |

All tables include Row Level Security (RLS) policies for data protection. Users can only access data within their own organization.

---

## 🔌 API Routes

### AI Response Generation

**POST `/api/ai/generate`** - Generate an AI response for a review

```json
{
  "reviewText": "Great service! The staff was very helpful.",
  "rating": 5,
  "reviewerName": "John D.",
  "platform": "google",
  "businessName": "Acme Corp"
}
```

### Chat Assistant

**POST `/api/chat`** - Chat with AI assistant

```json
{
  "messages": [
    { "role": "user", "content": "What plans do you offer?" }
  ]
}
```

### Lead Submission

**POST `/api/leads/submit`** - Submit a sales lead from signup form

```json
{
  "fullName": "Sarah Chen",
  "email": "sarah@oceansidedental.com",
  "businessName": "Oceanside Dental",
  "plan": "growth"
}
```

### Google Integration

**GET `/api/auth/google`** - Initiate Google Business Profile OAuth flow

**GET `/api/auth/google/callback`** - Handle Google Business Profile OAuth callback

**POST `/api/reviews/sync`** - Sync reviews from Google Business Profile

**POST `/api/reviews/respond`** - Post AI response to a review

```json
{
  "reviewId": "uuid-of-review",
  "autoGenerate": true
}
```

### Authentication

**GET `/auth/callback`** - Supabase Auth callback (handles Google sign-in and email confirmation)

---

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the repository in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `OPENAI_API_KEY`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `NEXT_PUBLIC_APP_URL` (your Vercel domain)
4. Deploy

### Production Checklist

- [x] Set up Supabase production project
- [x] Configure RLS policies for all tables
- [x] Set up Supabase Auth with Google provider
- [x] Configure OpenAI API with billing
- [x] Set production environment variables
- [x] Enable Supabase email confirmations
- [x] Set up Google Cloud project
- [x] Configure Google OAuth credentials (all 3 redirect URIs)
- [x] Route protection middleware configured
- [ ] Configure custom domain
- [ ] Set up Stripe for payments
- [ ] Submit Google app for verification (for production)

---

## 💰 Pricing Tiers

| Plan | Monthly | Setup Fee | Locations | Reviews/Month |
|------|---------|-----------|-----------|---------------|
| **Starter** | $199 | $500 | 1 | 50 |
| **Growth** | $399 | $1,000 | 3 | 150 |
| **Enterprise** | $699 | $2,000 | 10 | 500 |

All plans include:
- 14-day free trial
- First month FREE
- AI-powered responses
- Multi-platform support
- Basic analytics
- Multi-language add-on available

---

## 🔧 Configuration

### Tailwind Theme

Custom colors are defined in `tailwind.config.ts`:

```typescript
colors: {
  primary: {
    50: '#f0f9ff',
    500: '#0ea5e9',  // Main brand color
    600: '#0284c7',
  },
  accent: {
    500: '#d946ef',  // Accent color
    600: '#c026d3',
  },
}
```

### OpenAI Model

The default model is `gpt-4-turbo-preview`. To change it, edit `src/lib/ai/response-generator.ts`:

```typescript
const completion = await openai.chat.completions.create({
  model: 'gpt-4o-mini', // More cost-effective option
  // ...
});
```

### Chat Assistant

Configure the chat assistant in `src/lib/ai/chat-config.ts`:
- System prompt and guardrails
- Pricing information
- Response style
- Escalation triggers

### Route Protection

Protected routes are configured in `src/lib/supabase/middleware.ts`:

```typescript
const protectedPaths = ['/dashboard', '/admin'];
const authPaths = ['/login', '/signup'];
```

---

## 📊 Analytics

The dashboard tracks:

- **Response Rate** - Percentage of reviews with responses
- **Average Response Time** - Time from review to response
- **Sentiment Breakdown** - Positive/Neutral/Negative distribution
- **Platform Distribution** - Reviews by platform
- **Rating Trends** - Average rating over time

---

## 🔒 Security

- **Row Level Security (RLS)** - All database tables protected with organization-scoped policies
- **Supabase Auth** - Secure authentication with JWT and session management
- **Route Protection** - Middleware prevents unauthorized access to dashboard
- **Environment Variables** - Secrets never exposed to client
- **OAuth 2.0** - Secure Google integration for both auth and Business Profile
- **Service Role Separation** - Admin operations use separate service role key

---

## 🛣 Roadmap

### Completed
- [x] Google Business Profile OAuth
- [x] Automated review syncing
- [x] AI-powered response generation
- [x] Live chat assistant
- [x] Supabase Auth integration (Google + Email)
- [x] Route protection middleware
- [x] Row Level Security policies
- [x] Multi-location database support
- [x] Test suite with 167 test cases (Vitest)

### In Progress
- [ ] Dashboard with real data (replacing mock data)
- [ ] User onboarding flow
- [ ] Logout functionality

### Planned
- [ ] Stripe payment integration
- [ ] Yelp API integration
- [ ] Facebook Graph API integration
- [ ] TripAdvisor Content API
- [ ] Email notifications
- [ ] Team collaboration features
- [ ] White-label options
- [ ] Mobile app

---

## 📝 License

MIT License - see [LICENSE](LICENSE) for details.

---

## 🤝 Support

For questions or support, contact:
- Email: support@granitereply.com

---

<div align="center">
  <br />
  <strong>Built with ❤️ for local businesses</strong>
  <br />
  <br />
  <a href="https://replygenius-ai.vercel.app">View Demo</a>
  ·
  <a href="https://github.com/mpalmer79/replygenius-ai/issues">Report Bug</a>
  ·
  <a href="https://github.com/mpalmer79/replygenius-ai/issues">Request Feature</a>
</div>
