import { describe, expect, it } from 'vitest';
import { FALLBACK_TITLE, normalizeTitle, resolveTitle } from './title';

describe('resolveTitle', () => {
  it('returns the trimmed title as real content', () => {
    expect(resolveTitle('  My survey  ')).toEqual({ text: 'My survey', isFallback: false });
  });

  it('flags an empty or whitespace title as the fallback placeholder', () => {
    expect(resolveTitle('')).toEqual({ text: FALLBACK_TITLE, isFallback: true });
    expect(resolveTitle('   ')).toEqual({ text: FALLBACK_TITLE, isFallback: true });
  });
});

describe('normalizeTitle', () => {
  it('keeps a real title (trimmed)', () => {
    expect(normalizeTitle('  Hello ')).toBe('Hello');
  });

  it('applies the default for a blank title', () => {
    expect(normalizeTitle('')).toBe(FALLBACK_TITLE);
    expect(normalizeTitle('   ')).toBe(FALLBACK_TITLE);
  });
});
