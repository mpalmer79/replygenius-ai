/**
 * Tests for src/lib/ai/response-generator.ts
 *
 * Verifies:
 * - Prompt construction (tone, length, negative handling, signatures, CTA)
 * - OpenAI call parameters (model, temperature, max_tokens)
 * - Response parsing and trimming
 * - Sentiment analysis JSON parsing
 * - Response improvement flow
 * - Edge cases (missing reviewer name, empty content)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockOpenAICreate, mockOpenAITextResponse, mockOpenAIJsonResponse } from '../__tests__/setup';
import type { BrandVoiceSettings } from '@/types';

// Must import AFTER mocks are registered in setup.ts
import {
  generateReviewResponse,
  analyzeSentiment,
  improveResponse,
} from '@/lib/ai/response-generator';

// ── Fixtures ───────────────────────────────────────────────────
const baseBrandVoice: BrandVoiceSettings = {
  id: 'bv-1',
  organization_id: 'org-1',
  tone: 'friendly',
  response_length: 'medium',
  include_owner_signature: false,
  always_apologize_negative: true,
  offer_resolution_negative: true,
  include_call_to_action: true,
  call_to_action_text: 'We hope to see you again!',
  created_at: '2025-01-01T00:00:00Z',
  updated_at: '2025-01-01T00:00:00Z',
};

const fiveStarParams = {
  reviewText: 'Amazing food and great service!',
  rating: 5,
  reviewerName: 'Sarah',
  platform: 'google' as const,
  businessName: 'Bella Italia',
  brandVoice: baseBrandVoice,
};

const oneStarParams = {
  reviewText: 'Terrible experience. Food was cold and staff was rude.',
  rating: 1,
  reviewerName: 'Mike',
  platform: 'yelp' as const,
  businessName: 'Bella Italia',
  brandVoice: baseBrandVoice,
};

const threeStarParams = {
  reviewText: 'Food was good but service was slow.',
  rating: 3,
  reviewerName: 'Emily',
  platform: 'facebook' as const,
  businessName: 'Bella Italia',
  brandVoice: baseBrandVoice,
};

// ════════════════════════════════════════════════════════════════
// generateReviewResponse
// ════════════════════════════════════════════════════════════════
describe('generateReviewResponse', () => {
  beforeEach(() => {
    mockOpenAICreate.mockReset();
    mockOpenAICreate.mockResolvedValue(
      mockOpenAITextResponse('Thank you Sarah for the wonderful review!', 120)
    );
  });

  // ── OpenAI call parameters ─────────────────────────────────
  it('calls OpenAI with gpt-4-turbo-preview', async () => {
    await generateReviewResponse(fiveStarParams);
    expect(mockOpenAICreate).toHaveBeenCalledTimes(1);
    expect(mockOpenAICreate.mock.calls[0][0].model).toBe('gpt-4-turbo-preview');
  });

  it('uses temperature 0.7', async () => {
    await generateReviewResponse(fiveStarParams);
    expect(mockOpenAICreate.mock.calls[0][0].temperature).toBe(0.7);
  });

  it('caps at 500 tokens', async () => {
    await generateReviewResponse(fiveStarParams);
    expect(mockOpenAICreate.mock.calls[0][0].max_tokens).toBe(500);
  });

  it('sends exactly 2 messages (system + user)', async () => {
    await generateReviewResponse(fiveStarParams);
    expect(mockOpenAICreate.mock.calls[0][0].messages).toHaveLength(2);
    expect(mockOpenAICreate.mock.calls[0][0].messages[0].role).toBe('system');
    expect(mockOpenAICreate.mock.calls[0][0].messages[1].role).toBe('user');
  });

  // ── System prompt content ──────────────────────────────────
  it('includes business name in system prompt', async () => {
    await generateReviewResponse(fiveStarParams);
    const sys = mockOpenAICreate.mock.calls[0][0].messages[0].content;
    expect(sys).toContain('Bella Italia');
  });

  it('includes friendly tone description', async () => {
    await generateReviewResponse(fiveStarParams);
    const sys = mockOpenAICreate.mock.calls[0][0].messages[0].content;
    expect(sys).toContain('warm, friendly, and personable');
  });

  it('includes professional tone when configured', async () => {
    const proVoice = { ...baseBrandVoice, tone: 'professional' as const };
    await generateReviewResponse({ ...fiveStarParams, brandVoice: proVoice });
    const sys = mockOpenAICreate.mock.calls[0][0].messages[0].content;
    expect(sys).toContain('professional, polished');
  });

  it('includes casual tone when configured', async () => {
    const casualVoice = { ...baseBrandVoice, tone: 'casual' as const };
    await generateReviewResponse({ ...fiveStarParams, brandVoice: casualVoice });
    const sys = mockOpenAICreate.mock.calls[0][0].messages[0].content;
    expect(sys).toContain('relaxed, casual');
  });

  it('includes formal tone when configured', async () => {
    const formalVoice = { ...baseBrandVoice, tone: 'formal' as const };
    await generateReviewResponse({ ...fiveStarParams, brandVoice: formalVoice });
    const sys = mockOpenAICreate.mock.calls[0][0].messages[0].content;
    expect(sys).toContain('formal, respectful');
  });

  // ── Length instructions ────────────────────────────────────
  it('includes medium length instructions by default', async () => {
    await generateReviewResponse(fiveStarParams);
    const sys = mockOpenAICreate.mock.calls[0][0].messages[0].content;
    expect(sys).toContain('3-5 sentences');
  });

  it('includes short length instructions', async () => {
    const shortVoice = { ...baseBrandVoice, response_length: 'short' as const };
    await generateReviewResponse({ ...fiveStarParams, brandVoice: shortVoice });
    const sys = mockOpenAICreate.mock.calls[0][0].messages[0].content;
    expect(sys).toContain('2-3 sentences');
  });

  it('includes detailed length instructions', async () => {
    const longVoice = { ...baseBrandVoice, response_length: 'detailed' as const };
    await generateReviewResponse({ ...fiveStarParams, brandVoice: longVoice });
    const sys = mockOpenAICreate.mock.calls[0][0].messages[0].content;
    expect(sys).toContain('5-7 sentences');
  });

  // ── User prompt content ────────────────────────────────────
  it('includes reviewer name in user prompt', async () => {
    await generateReviewResponse(fiveStarParams);
    const usr = mockOpenAICreate.mock.calls[0][0].messages[1].content;
    expect(usr).toContain('Sarah');
  });

  it('includes platform in user prompt', async () => {
    await generateReviewResponse(fiveStarParams);
    const usr = mockOpenAICreate.mock.calls[0][0].messages[1].content;
    expect(usr).toContain('google');
  });

  it('includes rating in user prompt', async () => {
    await generateReviewResponse(fiveStarParams);
    const usr = mockOpenAICreate.mock.calls[0][0].messages[1].content;
    expect(usr).toContain('5/5');
  });

  it('includes review text in user prompt', async () => {
    await generateReviewResponse(fiveStarParams);
    const usr = mockOpenAICreate.mock.calls[0][0].messages[1].content;
    expect(usr).toContain('Amazing food and great service!');
  });

  // ── Negative review handling ───────────────────────────────
  it('adds negative review warning for 1-star', async () => {
    await generateReviewResponse(oneStarParams);
    const usr = mockOpenAICreate.mock.calls[0][0].messages[1].content;
    expect(usr).toContain('negative review');
  });

  it('adds negative review warning for 2-star', async () => {
    await generateReviewResponse({ ...oneStarParams, rating: 2 });
    const usr = mockOpenAICreate.mock.calls[0][0].messages[1].content;
    expect(usr).toContain('negative review');
  });

  it('adds mixed review note for 3-star', async () => {
    await generateReviewResponse(threeStarParams);
    const usr = mockOpenAICreate.mock.calls[0][0].messages[1].content;
    expect(usr).toContain('mixed review');
  });

  it('does NOT add negative/mixed notes for 4+ stars', async () => {
    await generateReviewResponse({ ...fiveStarParams, rating: 4 });
    const usr = mockOpenAICreate.mock.calls[0][0].messages[1].content;
    expect(usr).not.toContain('negative review');
    expect(usr).not.toContain('mixed review');
  });

  it('includes apology instruction for negative + always_apologize', async () => {
    await generateReviewResponse(oneStarParams);
    const sys = mockOpenAICreate.mock.calls[0][0].messages[0].content;
    expect(sys).toContain('sincere apology');
  });

  it('includes resolution instruction for negative + offer_resolution', async () => {
    await generateReviewResponse(oneStarParams);
    const sys = mockOpenAICreate.mock.calls[0][0].messages[0].content;
    expect(sys).toContain('resolve the issue');
  });

  // ── CTA & Signature ────────────────────────────────────────
  it('includes CTA text when enabled', async () => {
    await generateReviewResponse(fiveStarParams);
    const sys = mockOpenAICreate.mock.calls[0][0].messages[0].content;
    expect(sys).toContain('We hope to see you again!');
  });

  it('excludes CTA when disabled', async () => {
    const noCta = { ...baseBrandVoice, include_call_to_action: false };
    await generateReviewResponse({ ...fiveStarParams, brandVoice: noCta });
    const sys = mockOpenAICreate.mock.calls[0][0].messages[0].content;
    expect(sys).not.toContain('We hope to see you again!');
  });

  it('includes owner signature when enabled', async () => {
    const withSig = {
      ...baseBrandVoice,
      include_owner_signature: true,
      owner_name: 'Marco',
      owner_title: 'Owner',
    };
    await generateReviewResponse({ ...fiveStarParams, brandVoice: withSig });
    const sys = mockOpenAICreate.mock.calls[0][0].messages[0].content;
    expect(sys).toContain('Marco');
    expect(sys).toContain('Owner');
  });

  // ── Custom instructions & personality ──────────────────────
  it('includes personality description when set', async () => {
    const withPers = { ...baseBrandVoice, personality_description: 'We are family-owned since 1985' };
    await generateReviewResponse({ ...fiveStarParams, brandVoice: withPers });
    const sys = mockOpenAICreate.mock.calls[0][0].messages[0].content;
    expect(sys).toContain('family-owned since 1985');
  });

  it('includes custom instructions when set', async () => {
    const withCustom = { ...baseBrandVoice, custom_instructions: 'Always mention our outdoor patio' };
    await generateReviewResponse({ ...fiveStarParams, brandVoice: withCustom });
    const sys = mockOpenAICreate.mock.calls[0][0].messages[0].content;
    expect(sys).toContain('outdoor patio');
  });

  // ── Response parsing ───────────────────────────────────────
  it('returns trimmed response text', async () => {
    mockOpenAICreate.mockResolvedValue(
      mockOpenAITextResponse('  Trimmed response!  ', 85)
    );
    const result = await generateReviewResponse(fiveStarParams);
    expect(result.response).toBe('Trimmed response!');
  });

  it('returns token count from usage', async () => {
    mockOpenAICreate.mockResolvedValue(
      mockOpenAITextResponse('Response', 200)
    );
    const result = await generateReviewResponse(fiveStarParams);
    expect(result.tokensUsed).toBe(200);
  });

  it('returns empty string when OpenAI returns no content', async () => {
    mockOpenAICreate.mockResolvedValue({
      choices: [{ message: { content: null } }],
      usage: { total_tokens: 0 },
    });
    const result = await generateReviewResponse(fiveStarParams);
    expect(result.response).toBe('');
  });

  it('returns 0 tokens when usage is missing', async () => {
    mockOpenAICreate.mockResolvedValue({
      choices: [{ message: { content: 'OK' } }],
      usage: null,
    });
    const result = await generateReviewResponse(fiveStarParams);
    expect(result.tokensUsed).toBe(0);
  });

  // ── Edge: no reviewer name ─────────────────────────────────
  it('works without reviewer name', async () => {
    const noName = { ...fiveStarParams, reviewerName: undefined };
    await generateReviewResponse(noName);
    const usr = mockOpenAICreate.mock.calls[0][0].messages[1].content;
    expect(usr).not.toContain('Reviewer:');
  });

  // ── Language detection instruction ─────────────────────────
  it('includes language detection instruction in system prompt', async () => {
    await generateReviewResponse(fiveStarParams);
    const sys = mockOpenAICreate.mock.calls[0][0].messages[0].content;
    expect(sys).toContain('Detect the language');
    expect(sys).toContain('SAME LANGUAGE');
  });
});

// ════════════════════════════════════════════════════════════════
// analyzeSentiment
// ════════════════════════════════════════════════════════════════
describe('analyzeSentiment', () => {
  beforeEach(() => {
    mockOpenAICreate.mockReset();
  });

  it('calls OpenAI with json_object response_format', async () => {
    mockOpenAICreate.mockResolvedValue(
      mockOpenAIJsonResponse({ score: 0.8, label: 'positive', keyTopics: ['food'] })
    );
    await analyzeSentiment('Great food!');
    expect(mockOpenAICreate.mock.calls[0][0].response_format).toEqual({ type: 'json_object' });
  });

  it('uses lower temperature (0.3) for consistency', async () => {
    mockOpenAICreate.mockResolvedValue(
      mockOpenAIJsonResponse({ score: 0.8, label: 'positive', keyTopics: ['food'] })
    );
    await analyzeSentiment('Great food!');
    expect(mockOpenAICreate.mock.calls[0][0].temperature).toBe(0.3);
  });

  it('uses 150 max_tokens for compact output', async () => {
    mockOpenAICreate.mockResolvedValue(
      mockOpenAIJsonResponse({ score: 0.8, label: 'positive', keyTopics: ['food'] })
    );
    await analyzeSentiment('Great food!');
    expect(mockOpenAICreate.mock.calls[0][0].max_tokens).toBe(150);
  });

  it('parses positive sentiment correctly', async () => {
    mockOpenAICreate.mockResolvedValue(
      mockOpenAIJsonResponse({
        score: 0.9,
        label: 'positive',
        keyTopics: ['food quality', 'service'],
      })
    );
    const result = await analyzeSentiment('Amazing food and wonderful service!');
    expect(result.score).toBe(0.9);
    expect(result.label).toBe('positive');
    expect(result.keyTopics).toEqual(['food quality', 'service']);
  });

  it('parses negative sentiment correctly', async () => {
    mockOpenAICreate.mockResolvedValue(
      mockOpenAIJsonResponse({
        score: -0.7,
        label: 'negative',
        keyTopics: ['wait time', 'cold food'],
      })
    );
    const result = await analyzeSentiment('Waited forever and food was cold.');
    expect(result.score).toBe(-0.7);
    expect(result.label).toBe('negative');
    expect(result.keyTopics).toContain('wait time');
  });

  it('defaults score to 0 when missing', async () => {
    mockOpenAICreate.mockResolvedValue(
      mockOpenAIJsonResponse({ label: 'neutral', keyTopics: [] })
    );
    const result = await analyzeSentiment('It was okay.');
    expect(result.score).toBe(0);
  });

  it('defaults label to "neutral" when missing', async () => {
    mockOpenAICreate.mockResolvedValue(
      mockOpenAIJsonResponse({ score: 0.1, keyTopics: [] })
    );
    const result = await analyzeSentiment('Meh.');
    expect(result.label).toBe('neutral');
  });

  it('defaults keyTopics to empty array when missing', async () => {
    mockOpenAICreate.mockResolvedValue(
      mockOpenAIJsonResponse({ score: 0.5, label: 'positive' })
    );
    const result = await analyzeSentiment('Good.');
    expect(result.keyTopics).toEqual([]);
  });

  it('handles empty JSON response from OpenAI', async () => {
    mockOpenAICreate.mockResolvedValue({
      choices: [{ message: { content: '{}' } }],
      usage: { total_tokens: 10 },
    });
    const result = await analyzeSentiment('Test');
    expect(result.score).toBe(0);
    expect(result.label).toBe('neutral');
    expect(result.keyTopics).toEqual([]);
  });
});

// ════════════════════════════════════════════════════════════════
// improveResponse
// ════════════════════════════════════════════════════════════════
describe('improveResponse', () => {
  beforeEach(() => {
    mockOpenAICreate.mockReset();
  });

  it('sends original response and feedback to OpenAI', async () => {
    mockOpenAICreate.mockResolvedValue(
      mockOpenAITextResponse('Improved version here', 180)
    );
    await improveResponse('Original draft', 'Make it warmer', baseBrandVoice);

    const usr = mockOpenAICreate.mock.calls[0][0].messages[1].content;
    expect(usr).toContain('Original draft');
    expect(usr).toContain('Make it warmer');
  });

  it('includes brand voice tone in system prompt', async () => {
    mockOpenAICreate.mockResolvedValue(
      mockOpenAITextResponse('Better version', 150)
    );
    await improveResponse('Draft', 'Fix tone', baseBrandVoice);

    const sys = mockOpenAICreate.mock.calls[0][0].messages[0].content;
    expect(sys).toContain('friendly');
    expect(sys).toContain('medium');
  });

  it('returns improved text and token count', async () => {
    mockOpenAICreate.mockResolvedValue(
      mockOpenAITextResponse('  Polished response  ', 175)
    );
    const result = await improveResponse('Draft', 'Polish it', baseBrandVoice);
    expect(result.response).toBe('Polished response');
    expect(result.tokensUsed).toBe(175);
  });

  it('falls back to original response when OpenAI returns empty', async () => {
    mockOpenAICreate.mockResolvedValue({
      choices: [{ message: { content: null } }],
      usage: { total_tokens: 50 },
    });
    const result = await improveResponse('Keep this original', 'Try again', baseBrandVoice);
    expect(result.response).toBe('Keep this original');
  });
});
