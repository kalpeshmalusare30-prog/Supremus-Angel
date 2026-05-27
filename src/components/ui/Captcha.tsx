'use client';

import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import { CheckCircle2, RefreshCw } from 'lucide-react';

export interface CaptchaProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  'aria-describedby'?: string;
}

/** The stored value once the challenge is solved. */
export const CAPTCHA_VERIFIED = 'verified';

const Wrap = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
  padding: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.surfaceMuted};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
`;

const Prompt = styled.span`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.bodySm};
  color: ${({ theme }) => theme.colors.text};
`;

const Answer = styled.input`
  width: 72px;
  height: 36px;
  padding: 0 10px;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: ${({ theme }) => theme.fontSizes.bodySm};
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.sm};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const Refresh = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  color: ${({ theme }) => theme.colors.textMuted};
  background: none;
  border: none;
  border-radius: ${({ theme }) => theme.radii.sm};
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
  &:focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }
`;

const Verified = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: ${({ theme }) => theme.fontSizes.bodySm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.success};
`;

const randomOperand = () => Math.floor(Math.random() * 9) + 1;

/**
 * Demonstration-only human check: a small arithmetic challenge. Solving it
 * stores `verified`; an incorrect/blank answer clears the value. Not bot-proof
 * (no server) — a stand-in for reCAPTCHA/hCaptcha which need a paid key.
 */
export function Captcha({ id, value, onChange, disabled = false, ...rest }: CaptchaProps) {
  const ariaDescribedBy = rest['aria-describedby'];
  const [a, setA] = useState(randomOperand);
  const [b, setB] = useState(randomOperand);
  const [entry, setEntry] = useState('');

  const verified = value === CAPTCHA_VERIFIED;

  const regenerate = useCallback(() => {
    setA(randomOperand());
    setB(randomOperand());
    setEntry('');
    onChange('');
  }, [onChange]);

  const handleEntry = (next: string) => {
    setEntry(next);
    onChange(Number(next) === a + b ? CAPTCHA_VERIFIED : '');
  };

  if (verified) {
    return (
      <Wrap>
        <Verified>
          <CheckCircle2 size={18} aria-hidden />
          Verified — you’re human
        </Verified>
      </Wrap>
    );
  }

  return (
    <Wrap>
      <Prompt>
        What is {a} + {b}?
      </Prompt>
      <Answer
        id={id}
        type="text"
        inputMode="numeric"
        value={entry}
        disabled={disabled}
        aria-label={`What is ${a} plus ${b}?`}
        aria-describedby={ariaDescribedBy}
        onChange={(e) => handleEntry(e.target.value)}
      />
      <Refresh type="button" aria-label="New challenge" onClick={regenerate} disabled={disabled}>
        <RefreshCw size={16} aria-hidden />
      </Refresh>
    </Wrap>
  );
}
