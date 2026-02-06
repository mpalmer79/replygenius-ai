/**
 * Tests for src/lib/google/business-profile.ts
 *
 * Verifies:
 * - Token refresh flow
 * - Account & location fetching
 * - Review fetching with pagination
 * - Reply posting and deletion
 * - Star rating conversion
 * - Sync logic (upsert, error counting)
 * - Error handling for all API calls
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  refreshAccessToken,
  getAccounts,
  getLocations,
  getReviews,
  replyToReview,
  deleteReply,
  starRatingToNumber,
  syncReviewsToDatabase,
} from '@/lib/google/business-profile';

// ── Global fetch mock ──────────────────────────────────────────
const originalFetch = global.fetch;

beforeEach(() => {
  global.fetch = vi.fn();
});

afterEach(() => {
  global.fetch = originalFetch;
});

function mockFetch(body: any, ok = true, status = 200) {
  (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
    ok,
    status,
    json: () => Promise.resolve(body),
    text: () => Promise.resolve(JSON.stringify(body)),
  });
}

function mockFetchSequence(responses: Array<{ body: any; ok?: boolean }>) {
  const fn = global.fetch as ReturnType<typeof vi.fn>;
  responses.forEach((r, i) => {
    fn.mockResolvedValueOnce({
      ok: r.ok ?? true,
      status: r.ok === false ? 400 : 200,
      json: () => Promise.resolve(r.body),
      text: () => Promise.resolve(JSON.stringify(r.body)),
    });
  });
}

// ════════════════════════════════════════════════════════════════
// starRatingToNumber (pure function, no mocks needed)
// ════════════════════════════════════════════════════════════════
describe('starRatingToNumber', () => {
  it('converts ONE → 1', () => expect(starRatingToNumber('ONE')).toBe(1));
  it('converts TWO → 2', () => expect(starRatingToNumber('TWO')).toBe(2));
  it('converts THREE → 3', () => expect(starRatingToNumber('THREE')).toBe(3));
  it('converts FOUR → 4', () => expect(starRatingToNumber('FOUR')).toBe(4));
  it('converts FIVE → 5', () => expect(starRatingToNumber('FIVE')).toBe(5));
  // @ts-expect-error testing invalid input
  it('returns 0 for unknown rating', () => expect(starRatingToNumber('SIX')).toBe(0));
});

// ════════════════════════════════════════════════════════════════
// refreshAccessToken
// ════════════════════════════════════════════════════════════════
describe('refreshAccessToken', () => {
  it('returns new tokens on success', async () => {
    mockFetch({
      access_token: 'new-access-token',
      expires_in: 3600,
    });

    const result = await refreshAccessToken('refresh-token-123');
    expect(result).not.toBeNull();
    expect(result!.access_token).toBe('new-access-token');
    expect(result!.refresh_token).toBe('refresh-token-123'); // preserved
    expect(result!.token_expires_at).toBeDefined();
  });

  it('calculates token_expires_at from expires_in', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-06-15T12:00:00Z'));

    mockFetch({ access_token: 'tok', expires_in: 3600 });
    const result = await refreshAccessToken('rt');

    const expiresAt = new Date(result!.token_expires_at!);
    expect(expiresAt.getTime()).toBe(new Date('2025-06-15T13:00:00Z').getTime());

    vi.useRealTimers();
  });

  it('sends correct form-urlencoded body', async () => {
    mockFetch({ access_token: 'tok', expires_in: 3600 });
    await refreshAccessToken('my-refresh-token');

    const callArgs = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(callArgs[0]).toBe('https://oauth2.googleapis.com/token');
    expect(callArgs[1].method).toBe('POST');
    expect(callArgs[1].headers['Content-Type']).toBe('application/x-www-form-urlencoded');
  });

  it('returns null on API failure', async () => {
    mockFetch({ error: 'invalid_grant' }, false, 400);
    const result = await refreshAccessToken('bad-token');
    expect(result).toBeNull();
  });

  it('returns null on network error', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Network down'));
    const result = await refreshAccessToken('token');
    expect(result).toBeNull();
  });
});

// ════════════════════════════════════════════════════════════════
// getAccounts
// ════════════════════════════════════════════════════════════════
describe('getAccounts', () => {
  it('returns accounts array on success', async () => {
    mockFetch({
      accounts: [
        { name: 'accounts/123', accountName: 'My Biz', type: 'PERSONAL', role: 'OWNER', state: { status: 'VERIFIED' } },
      ],
    });
    const accounts = await getAccounts('access-token');
    expect(accounts).toHaveLength(1);
    expect(accounts[0].name).toBe('accounts/123');
  });

  it('sends Bearer token header', async () => {
    mockFetch({ accounts: [] });
    await getAccounts('my-token');
    const headers = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0][1].headers;
    expect(headers.Authorization).toBe('Bearer my-token');
  });

  it('returns empty array on API failure', async () => {
    mockFetch({ error: 'unauthorized' }, false, 401);
    const accounts = await getAccounts('bad-token');
    expect(accounts).toEqual([]);
  });

  it('returns empty array on network error', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('timeout'));
    const accounts = await getAccounts('token');
    expect(accounts).toEqual([]);
  });

  it('returns empty array when response has no accounts field', async () => {
    mockFetch({});
    const accounts = await getAccounts('token');
    expect(accounts).toEqual([]);
  });
});

// ════════════════════════════════════════════════════════════════
// getLocations
// ════════════════════════════════════════════════════════════════
describe('getLocations', () => {
  it('returns locations on success', async () => {
    mockFetch({
      locations: [{ name: 'locations/456', title: 'Downtown Store' }],
    });
    const locations = await getLocations('token', 'accounts/123');
    expect(locations).toHaveLength(1);
    expect(locations[0].title).toBe('Downtown Store');
  });

  it('includes readMask in URL', async () => {
    mockFetch({ locations: [] });
    await getLocations('token', 'accounts/123');
    const url = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(url).toContain('readMask=name,title,storefrontAddress');
  });

  it('returns empty array on failure', async () => {
    mockFetch({}, false, 500);
    const locations = await getLocations('token', 'accounts/123');
    expect(locations).toEqual([]);
  });
});

// ════════════════════════════════════════════════════════════════
// getReviews
// ════════════════════════════════════════════════════════════════
describe('getReviews', () => {
  it('returns reviews and nextPageToken', async () => {
    mockFetch({
      reviews: [
        { name: 'reviews/1', reviewId: 'r1', reviewer: { displayName: 'Ann' }, starRating: 'FIVE', comment: 'Great!', createTime: '2025-01-01', updateTime: '2025-01-01' },
      ],
      nextPageToken: 'page2token',
    });

    const result = await getReviews('token', 'accounts/1', 'locations/1');
    expect(result.reviews).toHaveLength(1);
    expect(result.nextPageToken).toBe('page2token');
  });

  it('uses pageSize parameter in URL', async () => {
    mockFetch({ reviews: [] });
    await getReviews('token', 'accounts/1', 'locations/1', 25);
    const url = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(url).toContain('pageSize=25');
  });

  it('includes pageToken when provided', async () => {
    mockFetch({ reviews: [] });
    await getReviews('token', 'accounts/1', 'locations/1', 50, 'abc123');
    const url = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(url).toContain('pageToken=abc123');
  });

  it('returns empty reviews on failure', async () => {
    mockFetch({}, false, 403);
    const result = await getReviews('token', 'a/1', 'l/1');
    expect(result.reviews).toEqual([]);
    expect(result.nextPageToken).toBeUndefined();
  });
});

// ════════════════════════════════════════════════════════════════
// replyToReview
// ════════════════════════════════════════════════════════════════
describe('replyToReview', () => {
  it('returns success on 200', async () => {
    mockFetch({});
    const result = await replyToReview('token', 'accounts/1/locations/1/reviews/1', 'Thanks!');
    expect(result.success).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('sends PUT with JSON body', async () => {
    mockFetch({});
    await replyToReview('token', 'reviews/1', 'Reply text');
    const call = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(call[1].method).toBe('PUT');
    expect(JSON.parse(call[1].body)).toEqual({ comment: 'Reply text' });
  });

  it('returns error on API failure', async () => {
    mockFetch({ error: 'not found' }, false, 404);
    const result = await replyToReview('token', 'reviews/1', 'Reply');
    expect(result.success).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it('returns error on network failure', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('timeout'));
    const result = await replyToReview('token', 'reviews/1', 'Reply');
    expect(result.success).toBe(false);
    expect(result.error).toContain('timeout');
  });
});

// ════════════════════════════════════════════════════════════════
// deleteReply
// ════════════════════════════════════════════════════════════════
describe('deleteReply', () => {
  it('returns success on 200', async () => {
    mockFetch({});
    const result = await deleteReply('token', 'reviews/1');
    expect(result.success).toBe(true);
  });

  it('sends DELETE method', async () => {
    mockFetch({});
    await deleteReply('token', 'reviews/1');
    expect((global.fetch as ReturnType<typeof vi.fn>).mock.calls[0][1].method).toBe('DELETE');
  });

  it('returns error on failure', async () => {
    mockFetch({}, false, 500);
    const result = await deleteReply('token', 'reviews/1');
    expect(result.success).toBe(false);
  });
});

// ════════════════════════════════════════════════════════════════
// syncReviewsToDatabase
// ════════════════════════════════════════════════════════════════
describe('syncReviewsToDatabase', () => {
  function createMockSupabase(upsertError: any = null) {
    const qb = {
      upsert: vi.fn().mockResolvedValue({ error: upsertError }),
    };
    return { from: vi.fn(() => qb), _qb: qb };
  }

  it('syncs reviews and returns count', async () => {
    // Single page, 2 reviews, no nextPageToken
    mockFetch({
      reviews: [
        { name: 'r/1', reviewId: 'r1', reviewer: { displayName: 'A' }, starRating: 'FIVE', comment: 'Great', createTime: '2025-01-01', updateTime: '2025-01-01' },
        { name: 'r/2', reviewId: 'r2', reviewer: { displayName: 'B' }, starRating: 'THREE', comment: 'OK', createTime: '2025-01-02', updateTime: '2025-01-02' },
      ],
    });

    const supabase = createMockSupabase();
    const result = await syncReviewsToDatabase('token', 'accounts/1', 'locations/1', supabase, 'loc-db-id');

    expect(result.synced).toBe(2);
    expect(result.errors).toBe(0);
    expect(supabase._qb.upsert).toHaveBeenCalledTimes(2);
  });

  it('counts upsert errors', async () => {
    mockFetch({
      reviews: [
        { name: 'r/1', reviewId: 'r1', reviewer: { displayName: 'A' }, starRating: 'FIVE', comment: 'G', createTime: '2025-01-01', updateTime: '2025-01-01' },
      ],
    });

    const supabase = createMockSupabase({ message: 'duplicate key' });
    const result = await syncReviewsToDatabase('token', 'a/1', 'l/1', supabase, 'loc-1');

    expect(result.synced).toBe(0);
    expect(result.errors).toBe(1);
  });

  it('handles pagination across multiple pages', async () => {
    const fn = global.fetch as ReturnType<typeof vi.fn>;

    // Page 1: 1 review + nextPageToken
    fn.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        reviews: [{ name: 'r/1', reviewId: 'r1', reviewer: { displayName: 'A' }, starRating: 'FOUR', comment: 'Nice', createTime: '2025-01-01', updateTime: '2025-01-01' }],
        nextPageToken: 'page2',
      }),
      text: () => Promise.resolve(''),
    });

    // Page 2: 1 review, no nextPageToken
    fn.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        reviews: [{ name: 'r/2', reviewId: 'r2', reviewer: { displayName: 'B' }, starRating: 'TWO', comment: 'Meh', createTime: '2025-01-02', updateTime: '2025-01-02' }],
      }),
      text: () => Promise.resolve(''),
    });

    const supabase = createMockSupabase();
    const result = await syncReviewsToDatabase('token', 'a/1', 'l/1', supabase, 'loc-1');

    expect(result.synced).toBe(2);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('upserts with correct conflict key', async () => {
    mockFetch({
      reviews: [
        { name: 'r/1', reviewId: 'r1', reviewer: { displayName: 'A' }, starRating: 'FIVE', comment: 'G', createTime: '2025-01-01', updateTime: '2025-01-01' },
      ],
    });

    const supabase = createMockSupabase();
    await syncReviewsToDatabase('token', 'a/1', 'l/1', supabase, 'loc-1');

    const upsertCall = supabase._qb.upsert.mock.calls[0];
    expect(upsertCall[1]).toEqual({ onConflict: 'platform,platform_review_id' });
  });

  it('sets correct location_id and platform on upserted data', async () => {
    mockFetch({
      reviews: [
        { name: 'r/1', reviewId: 'r1', reviewer: { displayName: 'A', profilePhotoUrl: 'http://photo.jpg' }, starRating: 'FOUR', comment: 'Nice', createTime: '2025-06-01T10:00:00Z', updateTime: '2025-06-01T10:00:00Z' },
      ],
    });

    const supabase = createMockSupabase();
    await syncReviewsToDatabase('token', 'a/1', 'l/1', supabase, 'my-loc-uuid');

    const data = supabase._qb.upsert.mock.calls[0][0];
    expect(data.location_id).toBe('my-loc-uuid');
    expect(data.platform).toBe('google');
    expect(data.platform_review_id).toBe('r1');
    expect(data.reviewer_name).toBe('A');
    expect(data.rating).toBe(4);
    expect(data.review_text).toBe('Nice');
  });

  it('returns 0 synced when API returns no reviews', async () => {
    mockFetch({ reviews: [] });
    const supabase = createMockSupabase();
    const result = await syncReviewsToDatabase('token', 'a/1', 'l/1', supabase, 'loc-1');
    expect(result.synced).toBe(0);
    expect(result.errors).toBe(0);
  });
});
