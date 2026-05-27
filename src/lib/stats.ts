// Per-field summaries computed from a form's collected responses, for the
// dashboard's "Summary stats" view: numeric aggregates, choice distributions,
// or a few text samples.

import type { FormField } from '@/types/field';
import type { Submission } from '@/lib/store';
import { numericValue } from '@/utils/format';
import { parseList } from '@/utils/list';

const NUMERIC = new Set<FormField['type']>([
  'number',
  'currency',
  'percentage',
  'rating',
  'range',
  'stepper',
]);
const SINGLE_CHOICE = new Set<FormField['type']>(['dropdown', 'radio', 'likert']);
const MULTI_CHOICE = new Set<FormField['type']>(['checkboxes', 'multiselect', 'tags']);

export interface NumericSummary {
  kind: 'numeric';
  /** How many submissions had a usable value for this field. */
  count: number;
  /** Total submissions to the form (answered or not). */
  total: number;
  avg: number;
  min: number;
  max: number;
}
export interface DistributionSummary {
  kind: 'distribution';
  /** Submissions that picked at least one option. */
  count: number;
  /** Total submissions to the form. */
  total: number;
  items: { label: string; count: number }[];
}
export interface TextSummary {
  kind: 'text';
  /** Submissions with a non-empty value. */
  count: number;
  /** Total submissions to the form. */
  total: number;
  samples: string[];
}
export interface EmptySummary {
  kind: 'empty';
}

export type FieldSummary = NumericSummary | DistributionSummary | TextSummary | EmptySummary;

/**
 * Summarises one field across all submissions. A blank answer still counts as
 * a submission — the summary reports "answered out of total" rather than
 * pretending the field has no data (BUG-005). `empty` means truly no
 * submissions to the form at all.
 */
export function summarizeField(field: FormField, responses: Submission[]): FieldSummary {
  const total = responses.length;
  if (total === 0) return { kind: 'empty' };

  const values = responses
    .map((r) => r.answers[field.id] ?? '')
    .filter((v) => v.trim() !== '');

  if (NUMERIC.has(field.type)) {
    const nums = values.map((v) => numericValue(field.type, v)).filter((n) => Number.isFinite(n));
    if (nums.length > 0) {
      const sum = nums.reduce((a, b) => a + b, 0);
      return {
        kind: 'numeric',
        count: nums.length,
        total,
        avg: sum / nums.length,
        min: Math.min(...nums),
        max: Math.max(...nums),
      };
    }
  } else if (field.type === 'boolean') {
    if (values.length > 0) {
      const yes = values.filter((v) => v === 'true').length;
      return {
        kind: 'distribution',
        count: values.length,
        total,
        items: [
          { label: 'Yes', count: yes },
          { label: 'No', count: values.length - yes },
        ],
      };
    }
  } else if (SINGLE_CHOICE.has(field.type) || MULTI_CHOICE.has(field.type)) {
    if (values.length > 0) {
      const counts = new Map<string, number>();
      values.forEach((v) => {
        const parts = MULTI_CHOICE.has(field.type) ? parseList(v) : [v];
        parts.forEach((p) => {
          const key = p.trim();
          if (key) counts.set(key, (counts.get(key) ?? 0) + 1);
        });
      });
      const items = Array.from(counts.entries(), ([label, count]) => ({ label, count })).sort(
        (a, b) => b.count - a.count,
      );
      return { kind: 'distribution', count: values.length, total, items };
    }
  }

  // Free-text, or any field above that has submissions but no usable value yet.
  return { kind: 'text', count: values.length, total, samples: values.slice(0, 3) };
}
