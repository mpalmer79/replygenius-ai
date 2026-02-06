# GraniteReply AI

<div align="center">
  <img src="https://img.shields.io/badge/v1.1.0-orange?style=for-the-badge&label=Version" alt="Version 1.1.0" />
  <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Supabase-PostgreSQL-green?style=for-the-badge&logo=supabase" alt="Supabase" />
  <img src="https://img.shields.io/badge/OpenAI-GPT--4-412991?style=for-the-badge&logo=openai" alt="OpenAI" />
  <img src="https://img.shields.io/badge/Vitest-167%20Tests-6E9F18?style=for-the-badge&logo=vitest" alt="Vitest" />
</div>

<br />

<div align="center">
  <strong>AI-powered SaaS platform that generates personalized, on-brand review responses for local businesses across Google, Yelp, Facebook, and TripAdvisor.</strong>
  <br /><br />
  <a href="https://replygenius-ai.vercel.app">🔗 Live Demo</a> · <a href="#architecture">Architecture</a> · <a href="#engineering-highlights">Engineering Highlights</a> · <a href="docs/SETUP.md">Setup Guide</a>
</div>

---

## What It Does

GraniteReply connects to a business's Google Business Profile via OAuth, syncs their reviews into a unified dashboard, and uses GPT-4 to generate responses that match the business's configured brand voice. Owners review, edit, and post responses with one click. Sentiment analysis auto-prioritizes negative reviews.

**7,320 lines of TypeScript** across **34 source files** — built solo, end-to-end.

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Next.js 14 App Router                │
│  ┌──────────┐  ┌──────────────┐  ┌───────────────────┐ │
│  │ Landing   │  │  Dashboard   │  │   Admin Panel     │ │
│  │ + Chat    │  │  + Reviews   │  │   + Leads CRM     │ │
│  │   Widget  │  │  + Analytics │  │   + Tickets       │ │
│  └──────────┘  └──────────────┘  └───────────────────┘ │
├─────────────────────────────────────────────────────────┤
│                      API Layer                          │
│  /api/ai/generate    /api/reviews/sync    /api/chat     │
│  /api/reviews/respond /api/leads/submit   /api/demo     │
├──────────┬──────────────────┬───────────────────────────┤
│  OpenAI  │    Supabase      │  Google Business Profile  │
│  GPT-4   │  PostgreSQL+Auth │  OAuth + Reviews API      │
│          │  Row Level Sec.  │  Paginated Sync + Reply   │
└──────────┴──────────────────┴───────────────────────────┘
```

---

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Framework** | Next.js 14 (App Router) | Server components, API routes, middleware in one codebase |
| **Language** | TypeScript (strict) | End-to-end type safety from DB schema to UI |
| **Database** | Supabase (PostgreSQL) | RLS policies, real-time subscriptions, built-in auth |
| **AI** | OpenAI GPT-4 | Dynamic prompt engineering with brand voice injection |
| **Auth** | Supabase Auth + Google OAuth | Dual auth: user login (Supabase) + API access (Google Business) |
| **Testing** | Vitest + jsdom | 167 test cases, all external deps mocked |
| **Styling** | Tailwind CSS | Utility-first, custom design system |
| **Deployment** | Vercel | Edge-optimized, zero-config Next.js hosting |

---

## Engineering Highlights

### AI Prompt Engineering
The response generator dynamically constructs system prompts based on configurable brand voice settings — tone (friendly/professional/casual/formal), response length (short/medium/detailed), CTA text, owner signatures, and custom instructions. Negative reviews trigger specialized handling with apology and resolution prompts. Language detection ensures responses match the reviewer's language.

### Google Business Profile Integration
Full OAuth 2.0 flow with automatic token refresh. Paginated review fetching with `nextPageToken` handling. Upsert pattern with `onConflict: 'platform,platform_review_id'` prevents duplicates during sync. Reply posting and deletion via the My Business API.

### Multi-Tenant Database Design
10-table normalized schema with organization-scoped RLS. Composite indexes on `reviews(location_id, status, platform, created_at)` for dashboard query performance. `updated_at` triggers on all tables. Supports multi-location businesses with per-location review isolation.

### Chat Assistant with Guardrails
Customer-facing AI chat with a 130-line system prompt that enforces honesty principles, accurate pricing, escalation triggers for frustrated users, and blocked topic filters. Uses `gpt-4o-mini` for cost efficiency with 10-message context window.

### Test Architecture
167 tests across 7 test files using co-located `__tests__/` folders. Global mock layer stubs OpenAI (configurable per-test), Supabase (chainable query builder), and Next.js internals. Pricing plan tests act as a **data contract** — if chat config pricing drifts from `PRICING_PLANS`, tests catch it.

```
npm test          # Run all 167 tests
npm run test:coverage  # Coverage report
npm run test:watch     # Watch mode
```

---

## Key Files

| File | Lines | What It Does |
|------|-------|-------------|
| `src/lib/ai/response-generator.ts` | 142 | Prompt builder + OpenAI integration for review responses |
| `src/lib/google/business-profile.ts` | 330 | Full Google Business Profile API client (OAuth, sync, reply) |
| `src/lib/ai/chat-config.ts` | 184 | Chat assistant system prompt, guardrails, escalation rules |
| `src/types/index.ts` | 253 | TypeScript interfaces for all domain entities + pricing plans |
| `supabase/schema.sql` | 203 | Multi-tenant database schema with RLS and indexes |
| `src/app/page.tsx` | 843 | Landing page with 20 live review demo examples |

---

## Running Locally

```bash
git clone https://github.com/mpalmer79/replygenius-ai.git
cd replygenius-ai
npm install
npm run dev       # http://localhost:3000
npm test          # 167 tests
```

Full environment setup, database configuration, and Google Cloud OAuth instructions are in **[docs/SETUP.md](docs/SETUP.md)**.

---

<div align="center">
  <a href="https://replygenius-ai.vercel.app">View Demo</a> · <a href="https://github.com/mpalmer79/replygenius-ai/issues">Report Bug</a> · <a href="https://github.com/mpalmer79/replygenius-ai/issues">Request Feature</a>
  <br /><br />
  Built by <a href="https://github.com/mpalmer79">Michael Palmer</a>
</div>
