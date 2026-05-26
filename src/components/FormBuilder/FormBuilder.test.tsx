import { describe, expect, it } from 'vitest';
import { render, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/styles/theme';
import { FormBuilder } from './FormBuilder';

/** Renders the app and returns queries scoped to this render's container,
 *  so tests stay isolated regardless of global cleanup behaviour. */
function renderApp() {
  // Isolate session persistence between tests.
  window.localStorage.clear();
  const { container } = render(
    <ThemeProvider theme={theme}>
      <FormBuilder />
    </ThemeProvider>,
  );
  return within(container);
}

describe('FormBuilder', () => {
  it('shows empty states on first load', () => {
    const screen = renderApp();
    expect(screen.getByText('Start building')).toBeInTheDocument();
    expect(screen.getByText(/your data will appear here/i)).toBeInTheDocument();
  });

  it('adds a field and reflects typed data live in the preview', async () => {
    const user = userEvent.setup();
    const screen = renderApp();

    await user.click(screen.getAllByRole('button', { name: /add field/i })[0]);
    await user.type(screen.getByPlaceholderText('e.g. Full name'), 'Name');
    await user.type(screen.getByPlaceholderText('Enter a value'), 'Aarav');

    const preview = screen.getByRole('region', { name: /live preview/i });
    expect(within(preview).getByText('Name')).toBeInTheDocument();
    expect(within(preview).getByText('Aarav')).toBeInTheDocument();
  });

  it('removes a field and returns to the empty state', async () => {
    const user = userEvent.setup();
    const screen = renderApp();

    await user.click(screen.getAllByRole('button', { name: /add field/i })[0]);
    expect(screen.getByPlaceholderText('e.g. Full name')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /remove field/i }));
    expect(screen.getByText('Start building')).toBeInTheDocument();
  });

  it('flags an empty label on submit without blocking', async () => {
    const user = userEvent.setup();
    const screen = renderApp();

    await user.click(screen.getAllByRole('button', { name: /add field/i })[0]);
    await user.type(screen.getByPlaceholderText('Enter a value'), 'orphan');
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(screen.getByRole('alert')).toHaveTextContent(/label is required/i);
  });
});
