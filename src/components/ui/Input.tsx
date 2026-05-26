'use client';

import React, { forwardRef } from 'react';
import styled from 'styled-components';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

const StyledInput = styled.input<{ $hasError: boolean }>`
  width: 100%;
  height: 44px; /* matches mobile tap target (UI/UX Brief §8.2) */
  padding: 0 12px;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: ${({ theme }) => theme.fontSizes.bodySm};
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid
    ${({ theme, $hasError }) => ($hasError ? theme.colors.danger : theme.colors.border)};
  border-radius: ${({ theme }) => theme.radii.md};
  transition:
    border-color ${({ theme }) => theme.transitions.fast},
    box-shadow ${({ theme }) => theme.transitions.fast};

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSubtle};
  }

  &:hover:not(:disabled):not(:focus) {
    border-color: ${({ theme, $hasError }) =>
      $hasError ? theme.colors.danger : theme.colors.borderStrong};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme, $hasError }) =>
      $hasError ? theme.colors.danger : theme.colors.primary};
    box-shadow: ${({ theme, $hasError }) =>
      $hasError ? `0 0 0 3px ${theme.colors.dangerSoft}` : theme.shadows.focus};
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.surfaceMuted};
    color: ${({ theme }) => theme.colors.textMuted};
    cursor: not-allowed;
  }
`;

/** Themed text input with hover / focus / error / disabled states. */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { hasError = false, ...rest },
  ref,
) {
  return <StyledInput ref={ref} $hasError={hasError} aria-invalid={hasError} {...rest} />;
});
