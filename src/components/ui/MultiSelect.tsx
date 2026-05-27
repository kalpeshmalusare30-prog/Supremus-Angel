'use client';

import React from 'react';
import { Check } from 'lucide-react';
import styled from 'styled-components';
import { parseList, serializeList } from '@/utils/list';

export interface MultiSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  id?: string;
  disabled?: boolean;
  'aria-describedby'?: string;
}

const Wrap = styled.div<{ $disabled: boolean }>`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
`;

const Chip = styled.button<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 36px;
  padding: ${({ theme }) => `0 ${theme.spacing.md}`};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: ${({ theme }) => theme.fontSizes.bodySm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme, $active }) => ($active ? theme.colors.onPrimary : theme.colors.textMuted)};
  background: ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.surface)};
  border: 1px solid ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.border)};
  border-radius: ${({ theme }) => theme.radii.full};
  cursor: pointer;
  transition:
    background ${({ theme }) => theme.transitions.fast},
    color ${({ theme }) => theme.transitions.fast},
    border-color ${({ theme }) => theme.transitions.fast};

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }

  svg {
    flex: none;
  }
`;

const Placeholder = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.bodySm};
  color: ${({ theme }) => theme.colors.textSubtle};
`;

/** A multi-select rendered as toggleable chips. Value is a JSON string array. */
export function MultiSelect({
  value,
  onChange,
  options,
  id,
  disabled = false,
  'aria-describedby': describedBy,
}: MultiSelectProps) {
  const selected = parseList(value);
  const toggle = (option: string) => {
    const next = selected.includes(option)
      ? selected.filter((o) => o !== option)
      : [...selected, option];
    onChange(serializeList(next));
  };

  if (options.length === 0) {
    return <Placeholder>Add options in the field settings.</Placeholder>;
  }

  return (
    <Wrap id={id} role="group" aria-describedby={describedBy} $disabled={disabled}>
      {options.map((option, index) => {
        const active = selected.includes(option);
        return (
          <Chip
            key={`${option}-${index}`}
            type="button"
            aria-pressed={active}
            $active={active}
            disabled={disabled}
            onClick={() => toggle(option)}
          >
            {active && <Check size={14} strokeWidth={3} aria-hidden />}
            {option}
          </Chip>
        );
      })}
    </Wrap>
  );
}
