'use client';

import React, { useRef } from 'react';
import styled from 'styled-components';

export interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  id?: string;
  disabled?: boolean;
  'aria-describedby'?: string;
}

const Row = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Cell = styled.input`
  width: 44px;
  height: 48px;
  text-align: center;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.h2};
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

/** A segmented one-time-code / PIN input. Value is the joined digit string. */
export function OtpInput({
  value,
  onChange,
  length = 6,
  id,
  disabled = false,
  'aria-describedby': describedBy,
}: OtpInputProps) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = Array.from({ length }, (_, i) => value[i] ?? '');

  const setDigit = (index: number, raw: string) => {
    const digit = raw.replace(/\D/g, '').slice(-1);
    const next = digits.slice();
    next[index] = digit;
    onChange(next.join('').slice(0, length));
    if (digit && index < length - 1) refs.current[index + 1]?.focus();
  };

  const onKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) refs.current[index - 1]?.focus();
  };

  return (
    <Row role="group" aria-describedby={describedBy} id={id}>
      {digits.map((digit, index) => (
        <Cell
          key={index}
          ref={(el) => {
            refs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          disabled={disabled}
          aria-label={`Digit ${index + 1}`}
          onChange={(e) => setDigit(index, e.target.value)}
          onKeyDown={(e) => onKeyDown(index, e)}
        />
      ))}
    </Row>
  );
}
