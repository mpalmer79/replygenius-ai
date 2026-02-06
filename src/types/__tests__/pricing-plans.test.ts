/**
 * Tests for src/types/index.ts
 *
 * The PRICING_PLANS constant is used across the landing page,
 * signup flow, chat config, and admin dashboard. Any inconsistency
 * between these values = customer confusion and lost revenue.
 * These tests act as a contract to prevent regressions.
 */

import { describe, it, expect } from 'vitest';
import { PRICING_PLANS } from '@/types';

describe('PRICING_PLANS', () => {
  it('has exactly 3 plans', () => {
    expect(PRICING_PLANS).toHaveLength(3);
  });

  it('plan IDs are starter, growth, enterprise', () => {
    const ids = PRICING_PLANS.map(p => p.id);
    expect(ids).toEqual(['starter', 'growth', 'enterprise']);
  });

  it('all plans have required fields', () => {
    PRICING_PLANS.forEach(plan => {
      expect(plan.id).toBeTruthy();
      expect(plan.name).toBeTruthy();
      expect(plan.monthlyPrice).toBeGreaterThan(0);
      expect(plan.setupDeposit).toBeGreaterThan(0);
      expect(plan.reviewsPerMonth).toBeGreaterThan(0);
      expect(plan.locations).toBeGreaterThan(0);
      expect(plan.features.length).toBeGreaterThan(0);
    });
  });

  it('prices increase with tier', () => {
    const [starter, growth, enterprise] = PRICING_PLANS;
    expect(starter.monthlyPrice).toBeLessThan(growth.monthlyPrice);
    expect(growth.monthlyPrice).toBeLessThan(enterprise.monthlyPrice);
  });

  it('setup deposits increase with tier', () => {
    const [starter, growth, enterprise] = PRICING_PLANS;
    expect(starter.setupDeposit).toBeLessThan(growth.setupDeposit);
    expect(growth.setupDeposit).toBeLessThan(enterprise.setupDeposit);
  });

  it('review limits increase with tier', () => {
    const [starter, growth, enterprise] = PRICING_PLANS;
    expect(starter.reviewsPerMonth).toBeLessThan(growth.reviewsPerMonth);
    expect(growth.reviewsPerMonth).toBeLessThan(enterprise.reviewsPerMonth);
  });

  it('location limits increase with tier', () => {
    const [starter, growth, enterprise] = PRICING_PLANS;
    expect(starter.locations).toBeLessThan(growth.locations);
    expect(growth.locations).toBeLessThan(enterprise.locations);
  });

  it('only growth plan is marked popular', () => {
    const popular = PRICING_PLANS.filter(p => p.popular);
    expect(popular).toHaveLength(1);
    expect(popular[0].id).toBe('growth');
  });

  // ── Specific price assertions (contract with chat-config) ──
  it('starter = $199/month, $500 setup, 50 reviews, 1 location', () => {
    const starter = PRICING_PLANS.find(p => p.id === 'starter')!;
    expect(starter.monthlyPrice).toBe(199);
    expect(starter.setupDeposit).toBe(500);
    expect(starter.reviewsPerMonth).toBe(50);
    expect(starter.locations).toBe(1);
  });

  it('growth = $399/month, $1000 setup, 150 reviews, 3 locations', () => {
    const growth = PRICING_PLANS.find(p => p.id === 'growth')!;
    expect(growth.monthlyPrice).toBe(399);
    expect(growth.setupDeposit).toBe(1000);
    expect(growth.reviewsPerMonth).toBe(150);
    expect(growth.locations).toBe(3);
  });

  it('enterprise = $699/month, $2000 setup, 500 reviews, 10 locations', () => {
    const ent = PRICING_PLANS.find(p => p.id === 'enterprise')!;
    expect(ent.monthlyPrice).toBe(699);
    expect(ent.setupDeposit).toBe(2000);
    expect(ent.reviewsPerMonth).toBe(500);
    expect(ent.locations).toBe(10);
  });

  // ── Feature list sanity ────────────────────────────────────
  it('higher tiers reference lower tier features', () => {
    const growth = PRICING_PLANS.find(p => p.id === 'growth')!;
    const ent = PRICING_PLANS.find(p => p.id === 'enterprise')!;
    expect(growth.features.some(f => f.includes('Starter'))).toBe(true);
    expect(ent.features.some(f => f.includes('Growth'))).toBe(true);
  });

  it('starter includes free trial feature', () => {
    const starter = PRICING_PLANS.find(p => p.id === 'starter')!;
    expect(starter.features.some(f => f.toLowerCase().includes('trial'))).toBe(true);
  });

  it('enterprise includes API access', () => {
    const ent = PRICING_PLANS.find(p => p.id === 'enterprise')!;
    expect(ent.features.some(f => f.toLowerCase().includes('api'))).toBe(true);
  });
});
