/**
 * Tests for src/lib/ai/chat-config.ts
 *
 * Verifies the chat system prompt, configuration constants,
 * escalation triggers, and blocked topics are correctly defined.
 * These are critical because the chat widget represents the product
 * to potential customers — wrong info = lost trust.
 */

import { describe, it, expect } from 'vitest';
import {
  CHAT_SYSTEM_PROMPT,
  CHAT_CONFIG,
  ESCALATION_TRIGGERS,
  BLOCKED_TOPICS,
} from '@/lib/ai/chat-config';

// ════════════════════════════════════════════════════════════════
// CHAT_SYSTEM_PROMPT — content accuracy
// ════════════════════════════════════════════════════════════════
describe('CHAT_SYSTEM_PROMPT', () => {
  it('identifies as GraniteReply AI Assistant', () => {
    expect(CHAT_SYSTEM_PROMPT).toContain('GraniteReply AI Assistant');
  });

  it('mentions all four supported platforms', () => {
    expect(CHAT_SYSTEM_PROMPT).toContain('Google');
    expect(CHAT_SYSTEM_PROMPT).toContain('Yelp');
    expect(CHAT_SYSTEM_PROMPT).toContain('Facebook');
    expect(CHAT_SYSTEM_PROMPT).toContain('TripAdvisor');
  });

  // ── Pricing accuracy (must match PRICING_PLANS in types) ──
  it('lists Starter at $199/month', () => {
    expect(CHAT_SYSTEM_PROMPT).toContain('$199/month');
  });

  it('lists Growth at $399/month', () => {
    expect(CHAT_SYSTEM_PROMPT).toContain('$399/month');
  });

  it('lists Enterprise at $699/month', () => {
    expect(CHAT_SYSTEM_PROMPT).toContain('$699/month');
  });

  it('mentions 14-day free trial', () => {
    expect(CHAT_SYSTEM_PROMPT).toContain('14-day free trial');
  });

  it('mentions first month free', () => {
    expect(CHAT_SYSTEM_PROMPT).toContain('FIRST MONTH FREE');
  });

  it('includes setup fees', () => {
    expect(CHAT_SYSTEM_PROMPT).toContain('$500');
    expect(CHAT_SYSTEM_PROMPT).toContain('$1,000');
    expect(CHAT_SYSTEM_PROMPT).toContain('$2,000');
  });

  it('mentions multi-language add-on pricing', () => {
    expect(CHAT_SYSTEM_PROMPT).toContain('+$49/mo');
    expect(CHAT_SYSTEM_PROMPT).toContain('+$99/mo');
    expect(CHAT_SYSTEM_PROMPT).toContain('+$299/mo');
  });

  // ── Honesty guardrails ─────────────────────────────────────
  it('includes honesty principles', () => {
    expect(CHAT_SYSTEM_PROMPT).toContain('HONESTY ABOVE ALL');
    expect(CHAT_SYSTEM_PROMPT).toContain('Never make up features');
  });

  it('includes the support email', () => {
    expect(CHAT_SYSTEM_PROMPT).toContain('support@granitereply.com');
  });

  it('instructs not to discuss competitors negatively', () => {
    expect(CHAT_SYSTEM_PROMPT).toContain('Discuss competitors negatively');
  });

  it('instructs not to make guarantees', () => {
    expect(CHAT_SYSTEM_PROMPT).toContain('guarantee');
  });

  // ── Key features mentioned ─────────────────────────────────
  it('mentions sentiment analysis', () => {
    expect(CHAT_SYSTEM_PROMPT).toContain('sentiment analysis');
  });

  it('mentions approval workflow', () => {
    expect(CHAT_SYSTEM_PROMPT).toContain('approval workflow');
  });

  it('mentions brand voice matching', () => {
    expect(CHAT_SYSTEM_PROMPT).toContain('brand voice') || expect(CHAT_SYSTEM_PROMPT).toContain('voice and tone');
  });

  it('mentions multi-location support', () => {
    expect(CHAT_SYSTEM_PROMPT).toContain('multiple business locations');
  });
});

// ════════════════════════════════════════════════════════════════
// CHAT_CONFIG — operational parameters
// ════════════════════════════════════════════════════════════════
describe('CHAT_CONFIG', () => {
  it('uses gpt-4o-mini for cost efficiency', () => {
    expect(CHAT_CONFIG.model).toBe('gpt-4o-mini');
  });

  it('has temperature between 0.5 and 1.0', () => {
    expect(CHAT_CONFIG.temperature).toBeGreaterThanOrEqual(0.5);
    expect(CHAT_CONFIG.temperature).toBeLessThanOrEqual(1.0);
  });

  it('has max tokens ≤ 500 to keep responses concise', () => {
    expect(CHAT_CONFIG.maxTokens).toBeLessThanOrEqual(500);
  });

  it('limits context to 10 messages', () => {
    expect(CHAT_CONFIG.contextMessageLimit).toBe(10);
  });

  it('has a support email', () => {
    expect(CHAT_CONFIG.supportEmail).toContain('@');
  });

  it('has a fallback response', () => {
    expect(CHAT_CONFIG.fallbackResponse).toBeTruthy();
    expect(CHAT_CONFIG.fallbackResponse.length).toBeGreaterThan(20);
  });
});

// ════════════════════════════════════════════════════════════════
// ESCALATION_TRIGGERS
// ════════════════════════════════════════════════════════════════
describe('ESCALATION_TRIGGERS', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(ESCALATION_TRIGGERS)).toBe(true);
    expect(ESCALATION_TRIGGERS.length).toBeGreaterThan(0);
  });

  it('includes common escalation phrases', () => {
    const triggers = ESCALATION_TRIGGERS.map(t => t.toLowerCase());
    expect(triggers).toContain('refund');
    expect(triggers).toContain('cancel');
    expect(triggers).toContain('complaint');
    expect(triggers).toContain('not working');
  });

  it('includes human agent requests', () => {
    const triggers = ESCALATION_TRIGGERS.map(t => t.toLowerCase());
    expect(triggers).toContain('speak to a human');
    expect(triggers).toContain('real person');
  });

  it('all entries are lowercase strings', () => {
    ESCALATION_TRIGGERS.forEach(t => {
      expect(typeof t).toBe('string');
      expect(t).toBe(t.toLowerCase());
    });
  });
});

// ════════════════════════════════════════════════════════════════
// BLOCKED_TOPICS
// ════════════════════════════════════════════════════════════════
describe('BLOCKED_TOPICS', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(BLOCKED_TOPICS)).toBe(true);
    expect(BLOCKED_TOPICS.length).toBeGreaterThan(0);
  });

  it('blocks political and religious topics', () => {
    const topics = BLOCKED_TOPICS.map(t => t.toLowerCase());
    expect(topics).toContain('political');
    expect(topics).toContain('religious');
  });

  it('blocks professional advice topics', () => {
    const topics = BLOCKED_TOPICS.map(t => t.toLowerCase());
    expect(topics.some(t => t.includes('legal'))).toBe(true);
    expect(topics.some(t => t.includes('financial'))).toBe(true);
    expect(topics.some(t => t.includes('medical'))).toBe(true);
  });
});
