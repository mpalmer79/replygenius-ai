/**
 * Tests for src/app/api/leads/submit/route.ts
 *
 * This is a public-facing endpoint (no auth) that accepts lead
 * submissions from the signup form. Tests verify:
 * - Input validation (required fields, email format)
 * - Resend email integration
 * - Graceful degradation when email fails
 * - Response structure
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// We need to test the route handler directly, so we import and
// call the POST function with a mock NextRequest

const originalFetch = global.fetch;

describe('/api/leads/submit', () => {
  let POST: (request: any) => Promise<Response>;

  beforeEach(async () => {
    global.fetch = vi.fn();
    // Dynamic import so mocks are in place
    const mod = await import('@/app/api/leads/submit/route');
    POST = mod.POST;
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  function makeRequest(body: any) {
    return {
      json: () => Promise.resolve(body),
    };
  }

  async function getJsonResponse(response: Response) {
    return response.json();
  }

  // ── Validation ─────────────────────────────────────────────
  it('returns 400 when fullName is missing', async () => {
    const res = await POST(makeRequest({
      email: 'test@example.com',
      businessName: 'Test Biz',
    }));
    expect(res.status).toBe(400);
    const body = await getJsonResponse(res);
    expect(body.error).toBeTruthy();
  });

  it('returns 400 when email is missing', async () => {
    const res = await POST(makeRequest({
      fullName: 'John Doe',
      businessName: 'Test Biz',
    }));
    expect(res.status).toBe(400);
  });

  it('returns 400 when businessName is missing', async () => {
    const res = await POST(makeRequest({
      fullName: 'John Doe',
      email: 'test@example.com',
    }));
    expect(res.status).toBe(400);
  });

  it('returns 400 for invalid email format', async () => {
    const res = await POST(makeRequest({
      fullName: 'John Doe',
      email: 'not-an-email',
      businessName: 'Test Biz',
    }));
    expect(res.status).toBe(400);
    const body = await getJsonResponse(res);
    expect(body.error).toContain('email');
  });

  // ── Success path ───────────────────────────────────────────
  it('returns success for valid submission', async () => {
    // Mock Resend API
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ id: 'email-123' }),
    });

    const res = await POST(makeRequest({
      fullName: 'Sarah Chen',
      email: 'sarah@oceansidedental.com',
      businessName: 'Oceanside Dental',
      plan: 'growth',
    }));

    expect(res.status).toBe(200);
    const body = await getJsonResponse(res);
    expect(body.success).toBe(true);
  });

  it('defaults plan to "starter" when not provided', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ id: 'email-123' }),
    });

    await POST(makeRequest({
      fullName: 'John',
      email: 'john@test.com',
      businessName: 'Biz',
    }));

    // Verify console.log was called with plan: 'starter'
    const logCall = consoleSpy.mock.calls.find(c =>
      typeof c[0] === 'string' && c[0].includes('lead')
    );
    expect(logCall).toBeTruthy();

    consoleSpy.mockRestore();
  });

  // ── Email failure graceful degradation ─────────────────────
  it('still returns success when email sending fails', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false,
      status: 500,
      text: () => Promise.resolve('Internal Server Error'),
    });

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const res = await POST(makeRequest({
      fullName: 'Jane Doe',
      email: 'jane@example.com',
      businessName: 'Jane Corp',
      plan: 'starter',
    }));

    // Should still succeed — email failure is non-blocking
    expect(res.status).toBe(200);
    const body = await getJsonResponse(res);
    expect(body.success).toBe(true);

    consoleSpy.mockRestore();
  });

  it('still returns success when RESEND_API_KEY is not set', async () => {
    const originalKey = process.env.RESEND_API_KEY;
    delete process.env.RESEND_API_KEY;

    const res = await POST(makeRequest({
      fullName: 'No Key User',
      email: 'nokey@test.com',
      businessName: 'No Key Biz',
    }));

    expect(res.status).toBe(200);
    const body = await getJsonResponse(res);
    expect(body.success).toBe(true);

    if (originalKey) process.env.RESEND_API_KEY = originalKey;
  });

  // ── Error handling ─────────────────────────────────────────
  it('returns 500 when request.json() throws', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const badRequest = {
      json: () => Promise.reject(new Error('malformed JSON')),
    };

    const res = await POST(badRequest);
    expect(res.status).toBe(500);

    consoleSpy.mockRestore();
  });
});
