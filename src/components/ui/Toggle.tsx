'use client';

import React, { forwardRef } from 'react';
import styled from 'styled-components';

export interface ToggleProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  id?: string;
  /** Accessible name when there is no visible text label. */
  'aria-label'?: string;
  'aria-describedby'?: string;
  disabled?: boolean;
}

const Track = styled.button<{ $on: boolean }>`
  position: relative;
  flex: none;
  width: 52px;
  height: 32px; /* whole control stays a comfortable tap target */
  padding: 0;
  border: 1px solid
    ${({ theme, $on }) => ($on ? theme.colors.primary : theme.colors.borderStrong)};
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ theme, $on }) => ($on ? theme.colors.primary : theme.colors.surfaceMuted)};
  cursor: pointer;
  transition:
    background ${({ theme }) => theme.transitions.fast},
    border-color ${({ theme }) => theme.transitions.fast};

  &:focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const Knob = styled.span<{ $on: boolean }>`
  position: absolute;
  top: 50%;
  left: ${({ $on }) => ($on ? '23px' : '3px')};
  width: 24px;
  height: 24px;
  transform: translateY(-50%);
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition: left ${({ theme }) => theme.transitions.fast};
`;

const Wrap = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  height: 44px;
`;

const StateText = styled.span<{ $on: boolean }>`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: ${({ theme }) => theme.fontSizes.bodySm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme, $on }) => ($on ? theme.colors.primary : theme.colors.textMuted)};
`;

/** A true/false switch. Renders a labelled on/off state beside the track. */
export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(function Toggle(
  { checked, onCheckedChange, disabled = false, ...aria },
  ref,
) {
  return (
    <Wrap>
      <Track
        ref={ref}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        $on={checked}
        onClick={() => onCheckedChange(!checked)}
        {...aria}
      >
        <Knob $on={checked} aria-hidden />
      </Track>
      <StateText $on={checked} aria-hidden>
        {checked ? 'Yes' : 'No'}
      </StateText>
    </Wrap>
  );
});
