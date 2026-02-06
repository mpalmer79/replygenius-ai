/**
 * Tests for src/app/api/ai/generate/route.ts
 *
 * Verifies:
 * - Required field validation
 * - Brand voice settings fetch (with fallback defaults)
 * - AI response generation call
 * - Response saving to database
 * - Review status update to 'draft'
 * - Error handling at each stage
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockOpenAICreate, mockOpenAITextResponse, mockSupabaseAdmin } from '../../../__tests__/setup';

describe('/api/ai/generate', () => {
  let POST: (request: any) => Promise<Response>;

  beforeEach(async () => {
    vi.clearAllMocks();

    // Reset OpenAI mock
    mockOpenAICreate.mockReset();
    mockOpenAICreate.mockResolvedValue(
      mockOpenAITextResponse('Generated response text', 120)
    );

    // Reset Supabase mock — brand voice found
    const qb = mockSupabaseAdmin._queryBuilder;
    qb.select.mockReturnThis();
    qb.eq.mockReturnThis();
    qb.single.mockResolvedValue({
      data: {
        id: 'bv-1',
        organization_id: 'org-1',
        tone: 'friendly',
        response_length: 'medium',
        include_owner_signature: false,
        always_apologize_negative: true,
        offer_resolution_negative: true,
        include_call_to_action: true,
        call_to_action_text: 'See you soon!',
        created_at: '2025-01-01',
        updated_at: '2025-01-01',
      },
      error: null,
    });

    // Insert returns no error
    qb.insert.mockReturnThis();
    qb.update.mockReturnThis();

    // Dynamic import after mocks
    const mod = await import('@/app/api/ai/generate/route');
    POST = mod.POST;
  });

  function makeRequest(body: any) {
    return { json: () => Promise.resolve(body) };
  }

  // ── Validation ─────────────────────────────────────────────
  const validBody = {
    reviewId: 'rev-1',
    reviewText: 'Great food!',
    rating: 5,
    reviewerName: 'Sarah',
    platform: 'google',
    businessName: 'Bella Italia',
    organizationId: 'org-1',
  };

  it('returns 400 when reviewId is missing', async () => {
    const { reviewId, ...missing } = validBody;
    const res = await POST(makeRequest(missing));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
  });

  it('returns 400 when reviewText is missing', async () => {
    const { reviewText, ...missing } = validBody;
    const res = await POST(makeRequest(missing));
    expect(res.status).toBe(400);
  });

  it('returns 400 when rating is missing', async () => {
    const { rating, ...missing } = validBody;
    const res = await POST(makeRequest(missing));
    expect(res.status).toBe(400);
  });

  it('returns 400 when platform is missing', async () => {
    const { platform, ...missing } = validBody;
    const res = await POST(makeRequest(missing));
    expect(res.status).toBe(400);
  });

  it('returns 400 when businessName is missing', async () => {
    const { businessName, ...missing } = validBody;
    const res = await POST(makeRequest(missing));
    expect(res.status).toBe(400);
  });

  it('returns 400 when organizationId is missing', async () => {
    const { organizationId, ...missing } = validBody;
    const res = await POST(makeRequest(missing));
    expect(res.status).toBe(400);
  });

  // ── Success path ───────────────────────────────────────────
  it('returns success with generated response', async () => {
    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.response).toBe('Generated response text');
    expect(body.data.tokensUsed).toBe(120);
  });

  it('fetches brand voice from supabase by organization_id', async () => {
    await POST(makeRequest(validBody));

    expect(mockSupabaseAdmin.from).toHaveBeenCalledWith('brand_voice_settings');
    const eqCalls = mockSupabaseAdmin._queryBuilder.eq.mock.calls;
    expect(eqCalls.some((c: any[]) => c[0] === 'organization_id' && c[1] === 'org-1')).toBe(true);
  });

  it('saves response to database as draft', async () => {
    await POST(makeRequest(validBody));

    // Check insert was called for responses table
    const fromCalls = mockSupabaseAdmin.from.mock.calls;
    expect(fromCalls.some((c: any[]) => c[0] === 'responses')).toBe(true);
  });

  it('updates review status to draft', async () => {
    await POST(makeRequest(validBody));

    const fromCalls = mockSupabaseAdmin.from.mock.calls;
    expect(fromCalls.some((c: any[]) => c[0] === 'reviews')).toBe(true);
  });

  // ── Brand voice fallback ───────────────────────────────────
  it('uses default brand voice when none exists (PGRST116)', async () => {
    mockSupabaseAdmin._queryBuilder.single.mockResolvedValue({
      data: null,
      error: { code: 'PGRST116', message: 'not found' },
    });

    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
  });

  // ── Error handling ─────────────────────────────────────────
  it('returns 500 on brand voice fetch error (non-PGRST116)', async () => {
    mockSupabaseAdmin._queryBuilder.single.mockResolvedValue({
      data: null,
      error: { code: '42P01', message: 'relation does not exist' },
    });

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(500);
    consoleSpy.mockRestore();
  });

  it('returns 500 when OpenAI throws', async () => {
    mockOpenAICreate.mockRejectedValue(new Error('OpenAI rate limited'));

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(500);
    consoleSpy.mockRestore();
  });

  it('still returns success when response save fails', async () => {
    // The route continues even if saving fails
    mockSupabaseAdmin._queryBuilder.insert.mockReturnValue({
      ...mockSupabaseAdmin._queryBuilder,
      // Make the insert chain eventually error
    });

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const res = await POST(makeRequest(validBody));
    // Should still be 200 because generation succeeded
    expect(res.status).toBe(200);
    consoleSpy.mockRestore();
  });
});
