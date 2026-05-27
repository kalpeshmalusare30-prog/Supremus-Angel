import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/styles/theme';
import { Segmented } from './Segmented';

function wrap(ui: React.ReactElement) {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
}

describe('Segmented', () => {
  it('renders each option as a radio and marks the active one', () => {
    wrap(<Segmented value="Weekly" options={['Daily', 'Weekly', 'Monthly']} onChange={() => {}} />);
    expect(screen.getAllByRole('radio')).toHaveLength(3);
    expect(screen.getByRole('radio', { name: 'Weekly' })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('radio', { name: 'Daily' })).toHaveAttribute('aria-checked', 'false');
  });

  it('calls onChange with the clicked option', () => {
    const onChange = vi.fn();
    wrap(<Segmented value="Daily" options={['Daily', 'Weekly']} onChange={onChange} />);
    fireEvent.click(screen.getByRole('radio', { name: 'Weekly' }));
    expect(onChange).toHaveBeenCalledWith('Weekly');
  });

  it('shows a hint when there are no options', () => {
    wrap(<Segmented value="" options={[]} onChange={() => {}} />);
    expect(screen.getByText(/add options in the field settings/i)).toBeInTheDocument();
  });
});
