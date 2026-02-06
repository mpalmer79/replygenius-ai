/**
 * Global test setup
 *
 * Mocks external dependencies so tests run fast and offline.
 * Supabase, OpenAI, Next.js server modules are all stubbed here.
 */

import { vi } from 'vitest';

// ── Next.js mocks ──────────────────────────────────────────────
vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({
    getAll: vi.fn(() => []),
    set: vi.fn(),
  })),
}));

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
  })),
  usePathname: vi.fn(() => '/dashboard'),
  useSearchParams: vi.fn(() => ({
    get: vi.fn(() => null),
  })),
}));

// ── Supabase mock builder ──────────────────────────────────────
export function createMockQueryBuilder(defaultData: any = null, defaultError: any = null) {
  const builder: any = {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    upsert: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    neq: vi.fn().mockReturnThis(),
    gt: vi.fn().mockReturnThis(),
    lt: vi.fn().mockReturnThis(),
    in: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    range: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: defaultData, error: defaultError }),
    maybeSingle: vi.fn().mockResolvedValue({ data: defaultData, error: defaultError }),
  };
  return builder;
}

export function createMockSupabaseClient() {
  const queryBuilder = createMockQueryBuilder();
  return {
    from: vi.fn(() => queryBuilder),
    auth: {
      signInWithPassword: vi.fn(),
      signInWithOAuth: vi.fn(),
      signOut: vi.fn(),
      exchangeCodeForSession: vi.fn(),
      getUser: vi.fn(),
      getSession: vi.fn(),
    },
    _queryBuilder: queryBuilder,
  };
}

// ── OpenAI mock ────────────────────────────────────────────────
export const mockOpenAICreate = vi.fn();

vi.mock('openai', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: mockOpenAICreate,
        },
      },
    })),
  };
});

// ── Supabase server mock ───────────────────────────────────────
const mockSupabaseAdmin = createMockSupabaseClient();

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => Promise.resolve(mockSupabaseAdmin)),
  supabaseAdmin: mockSupabaseAdmin,
}));

vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(() => mockSupabaseAdmin),
}));

export { mockSupabaseAdmin };

// ── Environment variables ──────────────────────────────────────
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key';
process.env.OPENAI_API_KEY = 'sk-test-key-1234567890';
process.env.GOOGLE_CLIENT_ID = 'test-google-client-id';
process.env.GOOGLE_CLIENT_SECRET = 'test-google-client-secret';
process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';

// ── Helpers ────────────────────────────────────────────────────
export function mockFetchResponse(body: any, ok = true, status = 200) {
  return vi.fn().mockResolvedValue({
    ok,
    status,
    json: () => Promise.resolve(body),
    text: () => Promise.resolve(JSON.stringify(body)),
  });
}

export const mockOpenAITextResponse = (content: string, tokens = 150) => ({
  choices: [{ message: { content }, finish_reason: 'stop' }],
  usage: { total_tokens: tokens, prompt_tokens: 50, completion_tokens: 100 },
});

export const mockOpenAIJsonResponse = (json: object, tokens = 100) =>
  mockOpenAITextResponse(JSON.stringify(json), tokens);
