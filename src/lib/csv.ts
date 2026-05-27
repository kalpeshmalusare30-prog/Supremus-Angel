// Builds an Excel-friendly CSV from a form's responses and triggers a download.
// No dependency — CSV opens directly in Excel/Sheets. A UTF-8 BOM is prepended
// so symbols (₹, ★, accents) render correctly in Excel.

import type { FormField } from '@/types/field';
import type { SavedForm, Submission } from '@/lib/store';
import { slugify } from '@/lib/schema';
import { stripHtml } from '@/utils/format';

/** RFC 4180 cell escaping: quote when the value has a comma, quote or newline. */
function escapeCell(value: string): string {
  return /[",\n\r]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

/** Human, sheet-safe rendering of one answer (masks secrets, elides blobs). */
function cellValue(field: FormField, raw: string): string {
  if (!raw) return '';
  switch (field.type) {
    case 'boolean':
      return raw === 'true' ? 'Yes' : 'No';
    case 'password':
      return '••••••••';
    case 'image':
    case 'file':
      return '[attachment]';
    case 'richtext':
      return stripHtml(raw);
    case 'captcha':
      return raw === 'verified' ? 'Verified' : '';
    default:
      return raw;
  }
}

/** Columns are the form's visible fields (the ones respondents actually fill). */
function exportFields(form: SavedForm): FormField[] {
  return form.fields.filter((f) => !f.hidden);
}

/** Serialises responses to a CSV string (header + one row per submission). */
export function buildCsv(form: SavedForm, responses: Submission[]): string {
  const cols = exportFields(form);
  const header = ['Submitted at', ...cols.map((f) => f.label || f.name)];
  const rows = responses.map((sub) => [
    new Date(sub.submittedAt).toLocaleString(),
    ...cols.map((f) => cellValue(f, sub.answers[f.id] ?? '')),
  ]);
  return [header, ...rows].map((row) => row.map(escapeCell).join(',')).join('\r\n');
}

/** Triggers a client-side download of `csv` as `<form-title>-responses.csv`. */
export function downloadCsv(form: SavedForm, responses: Submission[]): void {
  const csv = buildCsv(form, responses);
  // Prepend a UTF-8 BOM (U+FEFF) so Excel renders ₹, ★, accents correctly.
  const bom = String.fromCharCode(0xfeff);
  const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${slugify(form.title) || 'form'}-responses.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
