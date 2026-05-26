'use client';

import React, { forwardRef } from 'react';
import styled from 'styled-components';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Always required — icon-only buttons need an accessible name. */
  'aria-label': string;
  /** Turns hover state red, for destructive actions like remove. */
  danger?: boolean;
}

const StyledIconButton = styled.button<{ $danger: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  /* ≥44px tap target on mobile, tighter on pointer devices. */
  width: 44px;
  height: 44px;
  flex: none;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.textSubtle};
  border-radius: ${({ theme }) => theme.radii.md};
  cursor: pointer;
  transition:
    background ${({ theme }) => theme.transitions.fast},
    color ${({ theme }) => theme.transitions.fast},
    transform ${({ theme }) => theme.transitions.fast};

  &:hover:not(:disabled) {
    background: ${({ theme, $danger }) =>
      $danger ? theme.colors.dangerSoft : theme.colors.surfaceContainer};
    color: ${({ theme, $danger }) => ($danger ? theme.colors.danger : theme.colors.text)};
  }

  &:active:not(:disabled) {
    transform: scale(0.94);
  }

  &:focus-visible {
    outline: none;
    box-shadow:
      0 0 0 2px ${({ theme }) => theme.colors.background},
      0 0 0 4px ${({ theme }) => theme.colors.primary};
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

/** Square, icon-only button (e.g. remove a field, nav actions). */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { danger = false, type = 'button', ...rest },
  ref,
) {
  return <StyledIconButton ref={ref} type={type} $danger={danger} {...rest} />;
});
