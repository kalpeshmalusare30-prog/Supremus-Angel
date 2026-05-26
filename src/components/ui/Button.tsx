'use client';

import React, { forwardRef } from 'react';
import styled, { css } from 'styled-components';
import { media } from '@/styles/breakpoints';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}

const sizeStyles: Record<Size, ReturnType<typeof css>> = {
  sm: css`
    height: 32px;
    padding: 0 ${({ theme }) => theme.spacing.md};
    font-size: ${({ theme }) => theme.fontSizes.bodySm};
  `,
  md: css`
    height: 40px;
    padding: 0 ${({ theme }) => theme.spacing.md};
    font-size: ${({ theme }) => theme.fontSizes.bodySm};
  `,
  lg: css`
    height: 48px;
    padding: 0 ${({ theme }) => theme.spacing.lg};
    font-size: ${({ theme }) => theme.fontSizes.body};
  `,
};

const variantStyles: Record<Variant, ReturnType<typeof css>> = {
  primary: css`
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.onPrimary};
    border: 1px solid transparent;
    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.primaryHover};
    }
    &:active:not(:disabled) {
      background: ${({ theme }) => theme.colors.primaryActive};
    }
  `,
  secondary: css`
    background: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.primary};
    border: 1px solid ${({ theme }) => theme.colors.border};
    &:hover:not(:disabled) {
      border-color: ${({ theme }) => theme.colors.primary};
      background: ${({ theme }) => theme.colors.primarySoft};
    }
  `,
  ghost: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.textMuted};
    border: 1px solid transparent;
    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.surfaceContainer};
      color: ${({ theme }) => theme.colors.text};
    }
  `,
};

const StyledButton = styled.button<{
  $variant: Variant;
  $size: Size;
  $fullWidth: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
  font-family: ${({ theme }) => theme.fonts.body};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  letter-spacing: ${({ theme }) => theme.letterSpacings.tight};
  line-height: 1;
  white-space: nowrap;
  border-radius: ${({ theme }) => theme.radii.md};
  cursor: pointer;
  user-select: none;
  transition:
    background ${({ theme }) => theme.transitions.fast},
    border-color ${({ theme }) => theme.transitions.fast},
    transform ${({ theme }) => theme.transitions.fast};

  ${({ $size }) => sizeStyles[$size]}
  ${({ $variant }) => variantStyles[$variant]}

  /* Soft press confirmation (UI/UX Brief §10.2 — refined in motion pass). */
  &:active:not(:disabled) {
    transform: scale(0.98);
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

  /* Comfortable thumb target on touch devices (UI/UX Brief §5.1). */
  ${media.mobile} {
    min-height: 44px;
  }
`;

/** Themed button with three variants and three sizes (UI/UX Brief §8.1). */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', fullWidth = false, type = 'button', ...rest },
  ref,
) {
  return (
    <StyledButton
      ref={ref}
      type={type}
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      {...rest}
    />
  );
});
