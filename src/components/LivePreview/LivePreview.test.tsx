import { describe, expect, it } from 'vitest';
import { render, within } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import type { FormField } from '@/types/field';
import { theme } from '@/styles/theme';
import { LivePreview } from './LivePreview';

let counter = 0;
function field(over: Partial<FormField>): FormField {
  counter += 1;
  return { id: `f${counter}`, label: '', value: '', type: 'text', updatedAt: 0, ...over };
}

function renderPreview(fields: FormField[], lastSubmittedAt: number | null = null) {
  const { container } = render(
    <ThemeProvider theme={theme}>
      <LivePreview fields={fields} lastSubmittedAt={lastSubmittedAt} />
    </ThemeProvider>,
  );
  return within(container);
}

describe('LivePreview', () => {
  it('shows the empty state when there is no content', () => {
    const screen = renderPreview([]);
    expect(screen.getByText(/your data will appear here/i)).toBeInTheDocument();
  });

  it('renders the entered data as a card', () => {
    const screen = renderPreview([field({ label: 'Name', value: 'Aarav', type: 'text' })]);
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Aarav')).toBeInTheDocument();
  });

  it('shows the numeric chart once two numeric fields exist', () => {
    const screen = renderPreview([
      field({ label: 'Q1', value: '42', type: 'number' }),
      field({ label: 'Q2', value: '100', type: 'number' }),
    ]);
    expect(screen.getByText(/numeric distribution/i)).toBeInTheDocument();
  });

  it('hides the chart with only one numeric field', () => {
    const screen = renderPreview([field({ label: 'Q1', value: '42', type: 'number' })]);
    expect(screen.queryByText(/numeric distribution/i)).not.toBeInTheDocument();
  });

  it('shows the submitted note after a submit', () => {
    const screen = renderPreview([field({ label: 'Name', value: 'A' })], Date.now());
    expect(screen.getByText(/submitted — preview updated below/i)).toBeInTheDocument();
  });
});
