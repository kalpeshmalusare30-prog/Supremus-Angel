import { describe, expect, it } from 'vitest';
import { buildCsv } from './csv';
import { createField } from './schema';
import type { SavedForm, Submission } from './store';

function form(): SavedForm {
  return {
    id: 'form1',
    title: 'My, Form',
    fields: [
      { ...createField('text', []), id: 'f1', label: 'Full name' },
      { ...createField('boolean', ['full_name']), id: 'f2', label: 'Subscribed' },
      { ...createField('text', []), id: 'f3', label: 'Secret', hidden: true },
    ],
    createdAt: 0,
    updatedAt: 0,
  };
}

describe('buildCsv', () => {
  it('builds a header from visible fields and excludes hidden ones', () => {
    const header = buildCsv(form(), []).split('\r\n')[0];
    expect(header).toBe('Submitted at,Full name,Subscribed');
    expect(header).not.toContain('Secret');
  });

  it('maps booleans to Yes/No and escapes commas per RFC 4180', () => {
    const subs: Submission[] = [
      { id: 's1', submittedAt: 0, answers: { f1: 'Doe, John', f2: 'true' } },
    ];
    const row = buildCsv(form(), subs).split('\r\n')[1];
    expect(row).toContain('"Doe, John"');
    expect(row).toContain('Yes');
  });
});
