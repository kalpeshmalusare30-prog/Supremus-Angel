import { describe, expect, it } from 'vitest';
import { formatDisplayValue, isNumericValue, linkHref, numericValue, timeAgo } from './format';

describe('isNumericValue', () => {
  it('is true only for numeric-typed parseable values', () => {
    expect(isNumericValue('number', '42')).toBe(true);
    expect(isNumericValue('currency', '$1,200')).toBe(true);
    expect(isNumericValue('number', 'abc')).toBe(false);
    expect(isNumericValue('text', '42')).toBe(false);
    expect(isNumericValue('number', '')).toBe(false);
  });
});

describe('numericValue', () => {
  it('strips currency symbols before parsing', () => {
    expect(numericValue('currency', '$1,200.50')).toBe(1200.5);
    expect(numericValue('number', '42')).toBe(42);
  });
});

describe('formatDisplayValue', () => {
  it('groups numbers and dashes empties', () => {
    expect(formatDisplayValue('number', '1000000')).toBe('1,000,000');
    expect(formatDisplayValue('text', '')).toBe('—');
    expect(formatDisplayValue('text', 'hello')).toBe('hello');
  });

  it('renders booleans, currency, and ratings', () => {
    expect(formatDisplayValue('boolean', 'true')).toBe('Yes');
    expect(formatDisplayValue('boolean', 'false')).toBe('No');
    expect(formatDisplayValue('currency', '1200.5')).toBe('$1,200.50');
    expect(formatDisplayValue('rating', '4')).toBe('★★★★☆');
  });
});

describe('linkHref', () => {
  it('builds hrefs for link-style types', () => {
    expect(linkHref('email', 'a@b.com')).toBe('mailto:a@b.com');
    expect(linkHref('url', 'example.com')).toBe('https://example.com');
    expect(linkHref('phone', '+1 (555) 000')).toBe('tel:+1555000');
    expect(linkHref('text', 'nope')).toBeNull();
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
