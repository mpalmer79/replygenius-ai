# ReplyGenius AI

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-14.0-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Supabase-Database-green?style=for-the-badge&logo=supabase" alt="Supabase" />
  <img src="https://img.shields.io/badge/OpenAI-GPT--4-412991?style=for-the-badge&logo=openai" alt="OpenAI" />
  <img src="https://img.shields.io/badge/Google-Business%20API-4285F4?style=for-the-badge&logo=google" alt="Google" />
  <img src="https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind" />
</div>

<br />

<div align="center">
  <strong>AI-Powered Review Response Platform for Local Businesses</strong>
  <br />
  <br />
  <p>Stop spending hours crafting review responses. ReplyGenius AI generates personalized, on-brand replies to your Google, Yelp, Facebook, and TripAdvisor reviews in seconds.</p>
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

---

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **Database** | Supabase (PostgreSQL) |
| **Authentication** | Supabase Auth |
| **AI** | OpenAI GPT-4 |
| **Google Integration** | Google Business Profile API |
| **Deployment** | Vercel |
| **Payments** | Stripe (planned) |

---

## 📁 Project Structure

```
replygenius-ai/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── ai/
│   │   │   │   └── generate/
│   │   │   │       └── route.ts          # AI response generation
│   │   │   ├── auth/
│   │   │   │   └── google/
│   │   │   │       ├── route.ts          # Google OAuth initiation
│   │   │   │       └── callback/
│   │   │   │           └── route.ts      # Google OAuth callback
│   │   │   ├── chat/
│   │   │   │   └── route.ts              # Chat widget API
│   │   │   └── reviews/
│   │   │       ├── sync/
│   │   │       │   └── route.ts          # Sync reviews from Google
│   │   │       └── respond/
│   │   │           └── route.ts          # Post responses to Google
│   │   ├── assessment/
│   │   │   └── page.tsx                  # Sales qualification tool
│   │   ├── dashboard/
│   │   │   ├── layout.tsx                # Dashboard layout
│   │   │   ├── page.tsx                  # Dashboard home
│   │   │   ├── reviews/
│   │   │   │   └── page.tsx              # Reviews management
│   │   │   └── settings/
│   │   │       └── page.tsx              # Settings & platform connections
│   │   ├── login/
│   │   │   └── page.tsx                  # Login page
│   │   ├── signup/
│   │   │   └── page.tsx                  # Signup page
│   │   ├── globals.css                   # Global styles & animations
│   │   ├── layout.tsx                    # Root layout with chat widget
│   │   └── page.tsx                      # Landing page
│   ├── components/
│   │   └── ChatWidget.tsx                # Floating chat assistant
│   ├── lib/
│   │   ├── ai/
│   │   │   ├── response-generator.ts     # OpenAI review responses
│   │   │   └── chat-config.ts            # Chat assistant configuration
│   │   ├── google/
│   │   │   └── business-profile.ts       # Google Business Profile API
│   │   ├── supabase/
│   │   │   ├── client.ts                 # Supabase browser client
│   │   │   └── server.ts                 # Supabase server client
│   │   └── utils.ts                      # Utility functions
│   └── types/
│       └── index.ts                      # TypeScript type definitions
├── supabase/
│   └── schema.sql                        # Database schema
├── tailwind.config.ts                    # Tailwind configuration
├── next.config.js                        # Next.js configuration
├── tsconfig.json                         # TypeScript configuration
└── package.json                          # Dependencies
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

### 5. Set Up Google Cloud (Optional)

See [Google Business Profile Setup](#-google-business-profile-setup) section below.

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔗 Google Business Profile Setup

To enable automatic Google review syncing and responding:

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project called "ReplyGenius"

### 2. Enable APIs

Enable these APIs in your project:
- My Business Account Management API
- My Business Business Information API
- Business Profile Performance API

### 3. Configure OAuth Consent Screen

1. Go to **APIs & Services** → **OAuth consent screen**
2. Select **External** user type
3. Fill in app information:
   - App name: `ReplyGenius`
   - User support email: Your email
   - Developer contact: Your email

### 4. Create OAuth Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. Select **Web application**
4. Add authorized JavaScript origins:
   - `https://replygenius-ai.vercel.app`
   - `http://localhost:3000`
5. Add authorized redirect URIs:
   - `https://replygenius-ai.vercel.app/api/auth/google/callback`
   - `http://localhost:3000/api/auth/google/callback`
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

All tables include Row Level Security (RLS) policies for data protection.

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

### Google Integration

**GET `/api/auth/google`** - Initiate Google OAuth flow

**GET `/api/auth/google/callback`** - Handle OAuth callback

**POST `/api/reviews/sync`** - Sync reviews from Google Business Profile

**POST `/api/reviews/respond`** - Post AI response to a review

```json
{
  "reviewId": "uuid-of-review",
  "autoGenerate": true
}
```

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
4. Deploy

### Production Checklist

- [x] Set up Supabase production project
- [x] Configure OpenAI API with billing
- [x] Set production environment variables
- [x] Enable Supabase email confirmations
- [x] Configure custom domain
- [x] Set up Google Cloud project
- [x] Configure Google OAuth credentials
- [ ] Set up Stripe for payments (optional)
- [ ] Submit Google app for verification (for production)

---

## 💰 Pricing Tiers

| Plan | Monthly | Locations | Reviews/Month |
|------|---------|-----------|---------------|
| **Starter** | $200 | 1 | 50 |
| **Growth** | $400 | 3 | 150 |
| **Enterprise** | $800 | 10 | 500 |

All plans include:
- 14-day free trial
- AI-powered responses
- Multi-platform support
- Basic analytics

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

- **Row Level Security (RLS)** - All database tables protected
- **Environment Variables** - Secrets never exposed to client
- **Supabase Auth** - Secure authentication with JWT
- **OAuth 2.0** - Secure Google integration
- **API Key Rotation** - Service role key separate from anon key

---

## 🛣 Roadmap

- [x] Google Business Profile OAuth
- [x] Automated review syncing
- [x] AI-powered response posting
- [x] Live chat assistant
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
- Email: support@replygenius.ai
- Documentation: [docs.replygenius.ai](https://docs.replygenius.ai)

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
