'use client';

import React from 'react';
import { Minus, Plus } from 'lucide-react';
import styled from 'styled-components';

export interface StepperProps {
  value: string;
  onChange: (value: string) => void;
  min?: number;
  max?: number;
  step?: number;
  id?: string;
  disabled?: boolean;
  'aria-describedby'?: string;
}

const Wrap = styled.div`
  display: flex;
  align-items: stretch;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Btn = styled.button`
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  color: ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  cursor: pointer;
  transition:
    background ${({ theme }) => theme.transitions.fast},
    border-color ${({ theme }) => theme.transitions.fast};

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.primarySoft};
  }

  &:active:not(:disabled) {
    transform: scale(0.96);
  }

  &:focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const Num = styled.input`
  flex: 1 1 auto;
  min-width: 0;
  height: 44px;
  padding: 0 12px;
  text-align: center;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.bodySm};
  font-variant-numeric: tabular-nums;
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.surfaceMuted};
    cursor: not-allowed;
  }
`;

/** A number input flanked by decrement / increment buttons. */
export function Stepper({
  value,
  onChange,
  min = -Infinity,
  max = Infinity,
  step = 1,
  id,
  disabled = false,
  'aria-describedby': describedBy,
}: StepperProps) {
  const current = value === '' || Number.isNaN(Number(value)) ? 0 : Number(value);
  const clamp = (n: number) => Math.min(max, Math.max(min, n));
  const bump = (delta: number) => onChange(String(clamp(current + delta)));

  return (
    <Wrap>
      <Btn
        type="button"
        aria-label="Decrease"
        disabled={disabled || current <= min}
        onClick={() => bump(-step)}
      >
        <Minus size={18} aria-hidden />
      </Btn>
      <Num
        id={id}
        type="text"
        inputMode="numeric"
        value={value}
        disabled={disabled}
        aria-describedby={describedBy}
        onChange={(e) => onChange(e.target.value)}
      />
      <Btn
        type="button"
        aria-label="Increase"
        disabled={disabled || current >= max}
        onClick={() => bump(step)}
      >
        <Plus size={18} aria-hidden />
      </Btn>
    </Wrap>
  );
}
