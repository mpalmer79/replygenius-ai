/**
 * Tests for src/lib/utils.ts
 *
 * Every function in utils is pure — no side effects, no I/O.
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  formatRelativeTime,
  formatCurrency,
  getPlatformColor,
  getPlatformName,
  getSentimentColor,
  getStatusColor,
  renderStars,
  truncateText,
  generateSlug,
  validateEmail,
  classNames,
} from '@/lib/utils';

// ════════════════════════════════════════════════════════════════
// formatRelativeTime
// ════════════════════════════════════════════════════════════════
describe('formatRelativeTime', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-06-15T12:00:00Z'));
  });

  afterEach(() => vi.useRealTimers());

  it('returns "just now" for < 1 minute', () => {
    const d = new Date('2025-06-15T11:59:35Z').toISOString();
    expect(formatRelativeTime(d)).toBe('just now');
  });

  it('returns minutes for < 1 hour', () => {
    const d = new Date('2025-06-15T11:50:00Z').toISOString();
    expect(formatRelativeTime(d)).toBe('10m ago');
  });

  it('returns hours for < 1 day', () => {
    const d = new Date('2025-06-15T07:00:00Z').toISOString();
    expect(formatRelativeTime(d)).toBe('5h ago');
  });

  it('returns days for < 1 week', () => {
    const d = new Date('2025-06-12T12:00:00Z').toISOString();
    expect(formatRelativeTime(d)).toBe('3d ago');
  });

  it('returns weeks for < 1 month', () => {
    const d = new Date('2025-06-01T12:00:00Z').toISOString();
    expect(formatRelativeTime(d)).toBe('2w ago');
  });

  it('returns locale date for > 1 month', () => {
    const d = new Date('2025-04-01T12:00:00Z').toISOString();
    const result = formatRelativeTime(d);
    expect(result).not.toContain('ago');
    expect(result).toMatch(/\d/);
  });

  it('accepts Date objects', () => {
    const d = new Date('2025-06-15T11:30:00Z');
    expect(formatRelativeTime(d)).toBe('30m ago');
  });
});

// ════════════════════════════════════════════════════════════════
// formatCurrency
// ════════════════════════════════════════════════════════════════
describe('formatCurrency', () => {
  it('formats whole dollars without decimals', () => {
    expect(formatCurrency(199)).toBe('$199');
  });

  it('formats large numbers with commas', () => {
    expect(formatCurrency(18400)).toBe('$18,400');
  });

  it('formats zero', () => {
    expect(formatCurrency(0)).toBe('$0');
  });
});

// ════════════════════════════════════════════════════════════════
// getPlatformColor / getPlatformName
// ════════════════════════════════════════════════════════════════
describe('getPlatformColor', () => {
  it('google → blue', () => expect(getPlatformColor('google')).toContain('blue'));
  it('yelp → red', () => expect(getPlatformColor('yelp')).toContain('red'));
  it('facebook → indigo', () => expect(getPlatformColor('facebook')).toContain('indigo'));
  it('tripadvisor → green', () => expect(getPlatformColor('tripadvisor')).toContain('green'));
  // @ts-expect-error testing invalid input
  it('unknown → gray fallback', () => expect(getPlatformColor('x')).toContain('gray'));
});

describe('getPlatformName', () => {
  it('maps all four platforms', () => {
    expect(getPlatformName('google')).toBe('Google');
    expect(getPlatformName('yelp')).toBe('Yelp');
    expect(getPlatformName('facebook')).toBe('Facebook');
    expect(getPlatformName('tripadvisor')).toBe('TripAdvisor');
  });

  // @ts-expect-error testing invalid input
  it('returns raw value for unknown', () => expect(getPlatformName('x')).toBe('x'));
});

// ════════════════════════════════════════════════════════════════
// getSentimentColor / getStatusColor
// ════════════════════════════════════════════════════════════════
describe('getSentimentColor', () => {
  it('positive → green', () => expect(getSentimentColor('positive')).toContain('green'));
  it('neutral → yellow', () => expect(getSentimentColor('neutral')).toContain('yellow'));
  it('negative → red', () => expect(getSentimentColor('negative')).toContain('red'));
});

describe('getStatusColor', () => {
  it('pending → yellow', () => expect(getStatusColor('pending')).toContain('yellow'));
  it('draft → blue', () => expect(getStatusColor('draft')).toContain('blue'));
  it('approved → purple', () => expect(getStatusColor('approved')).toContain('purple'));
  it('posted → green', () => expect(getStatusColor('posted')).toContain('green'));
  it('failed → red', () => expect(getStatusColor('failed')).toContain('red'));
});

// ════════════════════════════════════════════════════════════════
// renderStars
// ════════════════════════════════════════════════════════════════
describe('renderStars', () => {
  it('5 stars = all filled', () => expect(renderStars(5)).toBe('★★★★★'));
  it('1 star = 1 filled 4 empty', () => expect(renderStars(1)).toBe('★☆☆☆☆'));
  it('3 stars = 3 filled 2 empty', () => expect(renderStars(3)).toBe('★★★☆☆'));
  it('always 5 chars', () => {
    for (let i = 0; i <= 5; i++) expect(renderStars(i)).toHaveLength(5);
  });
});

// ════════════════════════════════════════════════════════════════
// truncateText
// ════════════════════════════════════════════════════════════════
describe('truncateText', () => {
  it('returns original if shorter', () => expect(truncateText('hi', 10)).toBe('hi'));
  it('returns original if equal', () => expect(truncateText('hello', 5)).toBe('hello'));
  it('truncates with ellipsis', () => {
    const r = truncateText('This is a long sentence', 10);
    expect(r.endsWith('...')).toBe(true);
  });
});

// ════════════════════════════════════════════════════════════════
// generateSlug
// ════════════════════════════════════════════════════════════════
describe('generateSlug', () => {
  it('lowercases and hyphenates', () => expect(generateSlug('My Biz')).toBe('my-biz'));
  it('strips special chars', () => expect(generateSlug("Tony's!")).toBe('tony-s'));
  it('trims leading/trailing hyphens', () => expect(generateSlug('--x--')).toBe('x'));
  it('collapses multiple hyphens', () => expect(generateSlug('a   b')).toBe('a-b'));
  it('handles empty', () => expect(generateSlug('')).toBe(''));
});

// ════════════════════════════════════════════════════════════════
// validateEmail
// ════════════════════════════════════════════════════════════════
describe('validateEmail', () => {
  it.each([
    ['test@example.com', true],
    ['user.name@domain.co.uk', true],
    ['user+tag@gmail.com', true],
    ['', false],
    ['not-an-email', false],
    ['@domain.com', false],
    ['user@', false],
    ['user @domain.com', false],
  ])('validateEmail("%s") → %s', (input, expected) => {
    expect(validateEmail(input)).toBe(expected);
  });
});

// ════════════════════════════════════════════════════════════════
// classNames
// ════════════════════════════════════════════════════════════════
describe('classNames', () => {
  it('joins strings', () => expect(classNames('a', 'b')).toBe('a b'));
  it('filters falsy values', () => expect(classNames('a', false, undefined, 'b')).toBe('a b'));
  it('returns empty when all falsy', () => expect(classNames(false, undefined)).toBe(''));
  it('supports conditionals', () => {
    expect(classNames('btn', true && 'active', false && 'disabled')).toBe('btn active');
  });
});
