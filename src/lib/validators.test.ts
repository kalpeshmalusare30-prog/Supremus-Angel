import { describe, expect, it } from 'vitest';
import type { FormField } from '@/types/field';
import { validateField, validateLabel, validateValue } from './validators';

const field = (over: Partial<FormField> = {}): FormField => ({
  id: 'x',
  label: 'Label',
  value: '',
  type: 'text',
  updatedAt: 0,
  ...over,
});

describe('validateValue', () => {
  it('treats an empty value as valid (light validation)', () => {
    expect(validateValue('email', '')).toBeUndefined();
    expect(validateValue('number', '   ')).toBeUndefined();
  });

  it('validates email shape', () => {
    expect(validateValue('email', 'a@b.com')).toBeUndefined();
    expect(validateValue('email', 'not-an-email')).toBeDefined();
  });

  it('validates numbers', () => {
    expect(validateValue('number', '42')).toBeUndefined();
    expect(validateValue('number', '-3.14')).toBeUndefined();
    expect(validateValue('number', 'hello')).toBeDefined();
  });

  it('accepts any text', () => {
    expect(validateValue('text', 'whatever')).toBeUndefined();
  });
});

describe('validateLabel', () => {
  it('requires a non-empty label', () => {
    expect(validateLabel('')).toBeDefined();
    expect(validateLabel('   ')).toBeDefined();
    expect(validateLabel('Name')).toBeUndefined();
  });
});

describe('validateField', () => {
  it('prioritises a missing label over a value error', () => {
    const result = validateField(field({ label: '', type: 'email', value: 'bad' }));
    expect(result).toBe('Label is required.');
  });

  it('falls through to value validation when the label is fine', () => {
    expect(validateField(field({ type: 'email', value: 'bad' }))).toMatch(/email/i);
    expect(validateField(field({ type: 'number', value: '10' }))).toBeUndefined();
  });
});
