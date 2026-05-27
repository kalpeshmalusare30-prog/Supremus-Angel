import { describe, expect, it, beforeEach } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/styles/theme';
import { createField, encodeSchema } from '@/lib/schema';
import type { FormSchema } from '@/types/field';
import { FillForm } from './FillForm';

function publish(schema: FormSchema) {
  window.location.hash = `#${encodeSchema(schema)}`;
}

function renderFill() {
  return render(
    <ThemeProvider theme={theme}>
      <FillForm />
    </ThemeProvider>,
  );
}

describe('FillForm', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.location.hash = '';
  });

  it('shows an inline error AND a submit-level message for an invalid email (BUG-003)', () => {
    const email = { ...createField('email', []), label: 'Email', required: true };
    publish({ id: 'f1', title: 'Test', fields: [email] });
    renderFill();

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'notanemail' } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(screen.getByText(/valid email/i)).toBeInTheDocument();
    expect(screen.getByText(/please fix 1 highlighted field before submitting/i)).toBeInTheDocument();
  });

  it('shows an inline error for an invalid url (BUG-004)', () => {
    const url = { ...createField('url', []), label: 'Website', required: true };
    publish({ id: 'f2', title: 'Test', fields: [url] });
    renderFill();

    fireEvent.change(screen.getByLabelText(/website/i), { target: { value: 'notawebsite' } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(screen.getByText(/valid url/i)).toBeInTheDocument();
  });

  it('clears the submit-level message once the invalid field is fixed', () => {
    const email = { ...createField('email', []), label: 'Email', required: true };
    publish({ id: 'f3', title: 'Test', fields: [email] });
    renderFill();

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'nope' } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    expect(screen.getByText(/please fix/i)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'a@b.com' } });
    expect(screen.queryByText(/please fix/i)).not.toBeInTheDocument();
  });

  it('records the response and shows the success summary when valid', () => {
    const email = { ...createField('email', []), label: 'Email', required: true };
    publish({ id: 'f4', title: 'Survey', fields: [email] });
    renderFill();

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'a@b.com' } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(screen.getByText(/response recorded/i)).toBeInTheDocument();
  });

  it('renders an empty title as the "Untitled form" placeholder (BUG-002)', () => {
    const field = { ...createField('text', []), label: 'Name' };
    publish({ id: 'f5', title: '', fields: [field] });
    renderFill();

    expect(screen.getByRole('heading', { name: /untitled form/i })).toBeInTheDocument();
  });
});
