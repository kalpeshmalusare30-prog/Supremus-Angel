import React, { useState } from 'react';
import { describe, expect, it, vi, afterEach } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/styles/theme';
import { RichTextEditor } from './RichTextEditor';
import { Captcha } from './Captcha';
import { AddressAutocomplete } from './AddressAutocomplete';

function wrap(ui: React.ReactElement) {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
}

describe('RichTextEditor', () => {
  it('renders formatting controls', () => {
    wrap(<RichTextEditor value="" onChange={() => {}} />);
    expect(screen.getByRole('button', { name: /bold/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /bulleted list/i })).toBeInTheDocument();
  });

  it('emits the HTML on input, and an empty string when blank', () => {
    const onChange = vi.fn();
    wrap(<RichTextEditor value="" onChange={onChange} />);
    const box = screen.getByRole('textbox');

    box.innerHTML = '<b>Hi</b>';
    fireEvent.input(box);
    expect(onChange).toHaveBeenLastCalledWith('<b>Hi</b>');

    box.innerHTML = '<br>';
    fireEvent.input(box);
    expect(onChange).toHaveBeenLastCalledWith('');
  });
});

describe('Captcha', () => {
  it('verifies when the arithmetic answer is correct, clears when wrong', () => {
    const onChange = vi.fn();
    wrap(<Captcha value="" onChange={onChange} />);

    const prompt = screen.getByText(/what is \d+ \+ \d+\?/i).textContent ?? '';
    const [, a, b] = /what is (\d+) \+ (\d+)\?/i.exec(prompt)!;
    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: String(Number(a) + Number(b)) } });
    expect(onChange).toHaveBeenLastCalledWith('verified');

    fireEvent.change(input, { target: { value: '0' } });
    expect(onChange).toHaveBeenLastCalledWith('');
  });

  it('shows the verified state for a solved value', () => {
    wrap(<Captcha value="verified" onChange={() => {}} />);
    expect(screen.getByText(/verified/i)).toBeInTheDocument();
  });
});

describe('AddressAutocomplete', () => {
  afterEach(() => vi.unstubAllGlobals());

  function Harness() {
    const [v, setV] = useState('');
    return <AddressAutocomplete value={v} onChange={setV} />;
  }

  it('queries OSM and fills the field from a chosen suggestion', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [{ place_id: 1, display_name: '10 Downing St, London, UK' }],
      }),
    );
    wrap(<Harness />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '10 downing' } });

    const option = await screen.findByRole('option', { name: /10 downing st/i });
    fireEvent.click(option);

    await waitFor(() =>
      expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe(
        '10 Downing St, London, UK',
      ),
    );
  });
});
