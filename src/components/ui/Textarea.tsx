'use client';

import React, { forwardRef } from 'react';
import styled from 'styled-components';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean;
}

const StyledTextarea = styled.textarea<{ $hasError: boolean }>`
  width: 100%;
  min-height: 44px; /* matches the single-line tap target (UI/UX Brief §8.2) */
  padding: 10px 12px;
  resize: vertical;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: ${({ theme }) => theme.fontSizes.bodySm};
  line-height: ${({ theme }) => theme.lineHeights.bodySm};
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
`;

/** Themed multi-line input (paragraph / address fields). */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { hasError = false, rows = 3, ...rest },
  ref,
) {
  return <StyledTextarea ref={ref} rows={rows} $hasError={hasError} aria-invalid={hasError} {...rest} />;
});
