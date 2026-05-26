import { describe, expect, it } from 'vitest';
import type { FormField } from '@/types/field';
import { formatDisplayValue, hasContent, isNumeric, metaSummary, timeAgo } from './format';

const field = (over: Partial<FormField> = {}): FormField => ({
  id: 'x',
  label: 'Score',
  value: '',
  type: 'text',
  updatedAt: 0,
  ...over,
});

describe('isNumeric', () => {
  it('is true only for numeric-typed parseable values', () => {
    expect(isNumeric(field({ type: 'number', value: '42' }))).toBe(true);
    expect(isNumeric(field({ type: 'number', value: 'abc' }))).toBe(false);
    expect(isNumeric(field({ type: 'text', value: '42' }))).toBe(false);
    expect(isNumeric(field({ type: 'number', value: '' }))).toBe(false);
  });
});

describe('hasContent', () => {
  it('is true when a label or value is present', () => {
    expect(hasContent(field({ label: '', value: '' }))).toBe(false);
    expect(hasContent(field({ label: 'L', value: '' }))).toBe(true);
    expect(hasContent(field({ label: '', value: 'V' }))).toBe(true);
  });
});

describe('formatDisplayValue', () => {
  it('groups numbers and dashes empties', () => {
    expect(formatDisplayValue(field({ type: 'number', value: '1000000' }))).toBe('1,000,000');
    expect(formatDisplayValue(field({ value: '' }))).toBe('—');
    expect(formatDisplayValue(field({ value: 'hello' }))).toBe('hello');
  });
});

describe('timeAgo', () => {
  const now = 1_000_000_000_000;
  it('renders compact relative time', () => {
    expect(timeAgo(now, now)).toBe('just now');
    expect(timeAgo(now - 30_000, now)).toBe('30s ago');
    expect(timeAgo(now - 5 * 60_000, now)).toBe('5m ago');
    expect(timeAgo(now - 3 * 3_600_000, now)).toBe('3h ago');
  });
});

describe('metaSummary', () => {
  it('summarises type, detail, and recency', () => {
    const summary = metaSummary(field({ type: 'number', value: '42', updatedAt: 0 }), 0);
    expect(summary).toContain('Type: number');
    expect(summary).toContain('value 42');
    expect(summary).toContain('Last edited');
  });
});
