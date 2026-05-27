import { describe, expect, it, vi } from 'vitest';
import { render, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/styles/theme';
import { FormBuilder } from './FormBuilder';

function renderApp() {
  window.localStorage.clear();
  const { container } = render(
    <ThemeProvider theme={theme}>
      <FormBuilder />
    </ThemeProvider>,
  );
  return within(container);
}

/** Add a field end-to-end: pick a type, then save the settings modal. */
async function addField(
  user: ReturnType<typeof userEvent.setup>,
  screen: ReturnType<typeof renderApp>,
  tile: RegExp = /short text/i,
  label?: string,
) {
  await user.click(screen.getAllByRole('button', { name: /add field/i })[0]);
  await user.click(await screen.findByRole('button', { name: tile }));
  const dialog = await screen.findByRole('dialog', { name: /configure/i });
  if (label) {
    const input = within(dialog).getByLabelText('Label');
    await user.clear(input);
    await user.type(input, label);
  }
  await user.click(within(dialog).getByRole('button', { name: 'Add field' }));
}

describe('FormBuilder', () => {
  it('shows the empty builder and an empty preview', () => {
    const screen = renderApp();
    expect(screen.getByText('Start building')).toBeInTheDocument();
    expect(screen.getByText(/add a field to see your form take shape/i)).toBeInTheDocument();
  });

  it('opens the picker then the settings modal for the chosen type', async () => {
    const user = userEvent.setup();
    const screen = renderApp();

    await user.click(screen.getAllByRole('button', { name: /add field/i })[0]);
    expect(screen.getByRole('dialog', { name: /add a field/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /phone number/i }));
    expect(screen.getByRole('dialog', { name: /configure phone number/i })).toBeInTheDocument();
  });

  it('adds a configured field and reflects it in the live preview', async () => {
    const user = userEvent.setup();
    const screen = renderApp();

    await addField(user, screen, /short text/i, 'First name');

    expect(
      screen.getByRole('button', { name: /remove field: first name/i }),
    ).toBeInTheDocument();
    const preview = screen.getByRole('region', { name: /live preview/i });
    expect(within(preview).getByText('First name')).toBeInTheDocument();
  });

  it('confirms before removing a field, then returns to the empty state', async () => {
    const user = userEvent.setup();
    const screen = renderApp();

    await addField(user, screen);
    // Clicking remove opens a confirmation (BUG-006) — the field stays for now.
    await user.click(screen.getByRole('button', { name: /remove field/i }));
    const dialog = await screen.findByRole('dialog', { name: /remove this field/i });
    expect(screen.queryByText('Start building')).not.toBeInTheDocument();

    await user.click(within(dialog).getByRole('button', { name: /remove field/i }));
    expect(screen.getByText('Start building')).toBeInTheDocument();
  });

  it('keeps the field when the remove confirmation is cancelled', async () => {
    const user = userEvent.setup();
    const screen = renderApp();

    await addField(user, screen, /short text/i, 'Keep me');
    await user.click(screen.getByRole('button', { name: /remove field: keep me/i }));
    const dialog = await screen.findByRole('dialog', { name: /remove this field/i });
    await user.click(within(dialog).getByRole('button', { name: /cancel/i }));

    expect(screen.getByRole('button', { name: /remove field: keep me/i })).toBeInTheDocument();
  });

  it('publishes to a /form URL and opens it in a new tab', async () => {
    const user = userEvent.setup();
    const openSpy = vi.spyOn(window, 'open').mockReturnValue(null);
    const screen = renderApp();

    await addField(user, screen);
    await user.click(screen.getAllByRole('button', { name: /publish form/i })[0]);

    expect(openSpy).toHaveBeenCalledTimes(1);
    expect(openSpy.mock.calls[0][0]).toMatch(/\/form#/);
    expect(screen.getByText(/form published/i)).toBeInTheDocument();
    openSpy.mockRestore();
  });
});
