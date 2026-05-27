import { describe, expect, it } from 'vitest';
import { validateAnswer, validateLabel, validateValue } from './validators';

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

  it('validates URLs (scheme optional)', () => {
    expect(validateValue('url', 'example.com')).toBeUndefined();
    expect(validateValue('url', 'https://example.com/path')).toBeUndefined();
    expect(validateValue('url', 'not a url')).toBeDefined();
  });

  it('validates phone numbers by shape and digit count', () => {
    expect(validateValue('phone', '+1 (555) 123-4567')).toBeUndefined();
    expect(validateValue('phone', '12345')).toBeDefined();
    expect(validateValue('phone', 'call me')).toBeDefined();
  });

  it('validates currency, ignoring symbols and separators', () => {
    expect(validateValue('currency', '$1,200.50')).toBeUndefined();
    expect(validateValue('currency', 'lots')).toBeDefined();
  });

  it('validates ratings as whole numbers 1–5', () => {
    expect(validateValue('rating', '4')).toBeUndefined();
    expect(validateValue('rating', '0')).toBeDefined();
    expect(validateValue('rating', '6')).toBeDefined();
    expect(validateValue('rating', '3.5')).toBeDefined();
  });

  it('does not validate free-form or native-picker types', () => {
    expect(validateValue('textarea', 'a\nb')).toBeUndefined();
    expect(validateValue('address', '1 Main St')).toBeUndefined();
    expect(validateValue('date', '2026-05-27')).toBeUndefined();
    expect(validateValue('boolean', 'true')).toBeUndefined();
  });
});

describe('validateLabel', () => {
  it('requires a non-empty label', () => {
    expect(validateLabel('')).toBeDefined();
    expect(validateLabel('   ')).toBeDefined();
    expect(validateLabel('Name')).toBeUndefined();
  });
});

describe('validateAnswer', () => {
  it('flags an empty value only when the field is required', () => {
    expect(validateAnswer('text', '', true)).toBe('This field is required.');
    expect(validateAnswer('text', '', false)).toBeUndefined();
  });

  it('still type-checks a non-empty required value', () => {
    expect(validateAnswer('email', 'nope', true)).toMatch(/email/i);
    expect(validateAnswer('email', 'a@b.com', true)).toBeUndefined();
  });
});
