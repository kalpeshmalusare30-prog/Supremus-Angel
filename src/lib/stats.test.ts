import { describe, expect, it } from 'vitest';
import { createField } from '@/lib/schema';
import type { Submission } from '@/lib/store';
import { summarizeField } from './stats';

function sub(answers: Record<string, string>): Submission {
  return { id: Math.random().toString(36).slice(2), submittedAt: Date.now(), answers };
}

describe('summarizeField', () => {
  it('returns "empty" only when there are no submissions at all', () => {
    const field = createField('text', []);
    expect(summarizeField(field, [])).toEqual({ kind: 'empty' });
  });

  it('counts a blank-value submission instead of reporting no data (BUG-005)', () => {
    const field = createField('text', []);
    const summary = summarizeField(field, [sub({ [field.id]: '' })]);

    expect(summary.kind).toBe('text');
    if (summary.kind === 'text') {
      expect(summary.total).toBe(1); // one submission exists
      expect(summary.count).toBe(0); // none answered this field
    }
  });

  it('reports answered-of-total for partially filled text fields', () => {
    const field = createField('text', []);
    const summary = summarizeField(field, [
      sub({ [field.id]: 'hello' }),
      sub({ [field.id]: '' }),
      sub({ [field.id]: 'world' }),
    ]);

    expect(summary.kind).toBe('text');
    if (summary.kind === 'text') {
      expect(summary.total).toBe(3);
      expect(summary.count).toBe(2);
    }
  });

  it('aggregates numeric fields with a total', () => {
    const field = createField('number', []);
    const summary = summarizeField(field, [
      sub({ [field.id]: '10' }),
      sub({ [field.id]: '20' }),
      sub({ [field.id]: '' }),
    ]);

    expect(summary.kind).toBe('numeric');
    if (summary.kind === 'numeric') {
      expect(summary.total).toBe(3);
      expect(summary.count).toBe(2);
      expect(summary.avg).toBe(15);
    }
  });
});
