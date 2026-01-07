# ReplyGenius AI

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-14.0-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Supabase-Database-green?style=for-the-badge&logo=supabase" alt="Supabase" />
  <img src="https://img.shields.io/badge/OpenAI-GPT--4-412991?style=for-the-badge&logo=openai" alt="OpenAI" />
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
- **Multi-Platform Support** - Manage reviews from Google, Yelp, Facebook, and TripAdvisor in one dashboard
- **Custom Brand Voice** - Train the AI to match your unique tone, personality, and communication style
- **Sentiment Analysis** - Automatically detect negative reviews and prioritize urgent responses
- **Approval Workflow** - Review and edit AI responses before posting with one-click approval
- **Analytics & Reports** - Track response rates, sentiment trends, and review volume
- **Multi-Location Support** - Manage multiple business locations from a single account
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
| **Deployment** | Vercel |
| **Payments** | Stripe (planned) |

---

## 📁 Project Structure

```
replygenius-ai/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── ai/
│   │   │       └── generate/
│   │   │           └── route.ts      # AI response generation endpoint
│   │   ├── assessment/
│   │   │   └── page.tsx              # Sales qualification assessment
│   │   ├── dashboard/
│   │   │   ├── layout.tsx            # Dashboard layout with sidebar
│   │   │   ├── page.tsx              # Dashboard home
│   │   │   ├── reviews/
│   │   │   │   └── page.tsx          # Reviews management
│   │   │   └── settings/
│   │   │       └── page.tsx          # Account settings
│   │   ├── login/
│   │   │   └── page.tsx              # Login page
│   │   ├── signup/
│   │   │   └── page.tsx              # Signup page
│   │   ├── globals.css               # Global styles & animations
│   │   ├── layout.tsx                # Root layout
│   │   └── page.tsx                  # Landing page
│   ├── lib/
│   │   ├── ai/
│   │   │   └── response-generator.ts # OpenAI integration
│   │   ├── supabase/
│   │   │   ├── client.ts             # Supabase browser client
│   │   │   └── server.ts             # Supabase server client
│   │   └── utils.ts                  # Utility functions
│   └── types/
│       └── index.ts                  # TypeScript type definitions
├── supabase/
│   └── schema.sql                    # Database schema
├── tailwind.config.ts                # Tailwind configuration
├── next.config.js                    # Next.js configuration
├── tsconfig.json                     # TypeScript configuration
└── package.json                      # Dependencies
```

---

## ⚡ Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- OpenAI API key

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/replygenius-ai.git
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

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Set Up Database

1. Create a new project in [Supabase](https://supabase.com)
2. Go to SQL Editor
3. Run the contents of `supabase/schema.sql`

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

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

### POST `/api/ai/generate`

Generate an AI response for a review.

**Request Body:**
```json
{
  "reviewText": "Great service! The staff was very helpful.",
  "rating": 5,
  "reviewerName": "John D.",
  "platform": "google",
  "businessName": "Acme Corp",
  "brandVoice": {
    "tone": "friendly",
    "response_length": "medium",
    "include_call_to_action": true
  }
}
```

**Response:**
```json
{
  "response": "Thank you so much, John! We're thrilled...",
  "tokensUsed": 127
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
4. Deploy

### Production Checklist

- [ ] Set up Supabase production project
- [ ] Configure OpenAI API with billing
- [ ] Set production environment variables
- [ ] Enable Supabase email confirmations
- [ ] Configure custom domain
- [ ] Set up Stripe for payments (optional)

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
- **API Key Rotation** - Service role key separate from anon key

---

## 🛣 Roadmap

- [ ] Stripe payment integration
- [ ] Google Business Profile OAuth
- [ ] Yelp API integration
- [ ] Facebook Graph API integration
- [ ] TripAdvisor Content API
- [ ] Automated response posting
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
