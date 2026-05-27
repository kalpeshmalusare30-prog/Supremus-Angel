'use client';

import React, { useId } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import styled from 'styled-components';

export interface SegmentedProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  id?: string;
  disabled?: boolean;
  'aria-describedby'?: string;
}

const Bar = styled.div<{ $disabled: boolean }>`
  display: inline-flex;
  flex-wrap: wrap;
  gap: 2px;
  max-width: 100%;
  padding: 3px;
  background: ${({ theme }) => theme.colors.surfaceMuted};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  opacity: ${({ $disabled }) => ($disabled ? 0.55 : 1)};
`;

const Seg = styled.button<{ $active: boolean }>`
  position: relative;
  flex: 0 0 auto;
  min-width: 60px;
  min-height: 38px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => `0 ${theme.spacing.md}`};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: ${({ theme }) => theme.fontSizes.bodySm};
  font-weight: ${({ theme, $active }) =>
    $active ? theme.fontWeights.semibold : theme.fontWeights.medium};
  color: ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.textMuted)};
  background: transparent;
  border: none;
  border-radius: ${({ theme }) => theme.radii.sm};
  cursor: pointer;
  white-space: nowrap;
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover:not(:disabled) {
    color: ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.text)};
  }

  &:focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

/** The elevated "thumb" that slides to the active segment. */
const Thumb = styled(motion.span)`
  position: absolute;
  inset: 0;
  z-index: 0;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.sm};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const SegLabel = styled.span`
  position: relative;
  z-index: 1;
`;

const Placeholder = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.bodySm};
  color: ${({ theme }) => theme.colors.textSubtle};
`;

/** A single-select control rendered as a sliding-thumb segmented bar. */
export function Segmented({
  value,
  onChange,
  options,
  id,
  disabled = false,
  'aria-describedby': describedBy,
}: SegmentedProps) {
  const reduceMotion = useReducedMotion();
  const reactId = useId();
  // Namespaced so multiple Segmented controls on a page don't share a thumb.
  const thumbId = `seg-thumb-${id ?? reactId}`;

  if (options.length === 0) {
    return <Placeholder>Add options in the field settings.</Placeholder>;
  }

  return (
    <Bar id={id} role="radiogroup" aria-describedby={describedBy} $disabled={disabled}>
      {options.map((option, index) => {
        const active = value === option;
        return (
          <Seg
            key={`${option}-${index}`}
            type="button"
            role="radio"
            aria-checked={active}
            $active={active}
            disabled={disabled}
            onClick={() => onChange(option)}
          >
            {active && (
              <Thumb
                layoutId={thumbId}
                aria-hidden
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : { type: 'spring', stiffness: 520, damping: 40 }
                }
              />
            )}
            <SegLabel>{option}</SegLabel>
          </Seg>
        );
      })}
    </Bar>
  );
}
