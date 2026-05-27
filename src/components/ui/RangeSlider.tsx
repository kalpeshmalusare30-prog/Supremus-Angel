'use client';

import React from 'react';
import styled from 'styled-components';

export interface RangeSliderProps {
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
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  height: 44px;
`;

const Track = styled.input`
  flex: 1 1 auto;
  min-width: 0;
  height: 6px;
  accent-color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &:focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadows.focus};
    border-radius: ${({ theme }) => theme.radii.full};
  }
`;

const Bubble = styled.span`
  flex: none;
  min-width: 3ch;
  text-align: right;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.bodySm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text};
  font-variant-numeric: tabular-nums;
`;

/** A themed range slider with a live value bubble. */
export function RangeSlider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  id,
  disabled = false,
  'aria-describedby': describedBy,
}: RangeSliderProps) {
  const numeric = value === '' || Number.isNaN(Number(value)) ? min : Number(value);
  return (
    <Wrap>
      <Track
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={numeric}
        disabled={disabled}
        aria-describedby={describedBy}
        onChange={(e) => onChange(e.target.value)}
      />
      <Bubble aria-hidden>{numeric}</Bubble>
    </Wrap>
  );
}
