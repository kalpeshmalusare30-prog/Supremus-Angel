import { describe, expect, it } from 'vitest';
import {
  createField,
  decodeSchema,
  encodeSchema,
  isValidName,
  slugify,
  uniqueName,
} from './schema';

describe('slugify', () => {
  it('snake_cases labels and fixes leading digits', () => {
    expect(slugify('Full Name')).toBe('full_name');
    expect(slugify('  Phone #1 ')).toBe('phone_1');
    expect(slugify('123')).toBe('field_123');
    expect(slugify('!!!')).toBe('field');
  });
});

describe('uniqueName', () => {
  it('appends suffixes on collision', () => {
    expect(uniqueName('email', [])).toBe('email');
    expect(uniqueName('email', ['email'])).toBe('email_2');
    expect(uniqueName('email', ['email', 'email_2'])).toBe('email_3');
  });
});

describe('isValidName', () => {
  it('accepts identifiers and rejects the rest', () => {
    expect(isValidName('full_name')).toBe(true);
    expect(isValidName('_x1')).toBe(true);
    expect(isValidName('1abc')).toBe(false);
    expect(isValidName('has space')).toBe(false);
  });
});

describe('encode / decode', () => {
  it('round-trips a schema', () => {
    const schema = { title: 'Survey', fields: [] };
    expect(decodeSchema(encodeSchema(schema))).toEqual(schema);
  });

  it('round-trips unicode safely', () => {
    const schema = { title: 'Café ☕ — feedback', fields: [] };
    expect(decodeSchema(encodeSchema(schema))?.title).toBe('Café ☕ — feedback');
  });

  it('returns null for malformed input', () => {
    expect(decodeSchema('@@@not-valid@@@')).toBeNull();
  });
});

describe('createField', () => {
  it('builds a field with a unique name and type defaults', () => {
    const f = createField('email', ['email']);
    expect(f.type).toBe('email');
    expect(f.name).toBe('email_2');
    expect(f.required).toBe(false);
    expect(f.hidden).toBe(false);
  });

  it('seeds boolean fields with a "false" default value', () => {
    expect(createField('boolean', []).defaultValue).toBe('false');
  });
});
