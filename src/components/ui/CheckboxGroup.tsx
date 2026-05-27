'use client';

import React from 'react';
import { Check } from 'lucide-react';
import styled from 'styled-components';
import { parseList, serializeList } from '@/utils/list';

export interface CheckboxGroupProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  id?: string;
  disabled?: boolean;
  'aria-describedby'?: string;
}

const Group = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Option = styled.label<{ $checked: boolean; $disabled: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  min-height: 40px;
  padding: ${({ theme }) => `0 ${theme.spacing.md}`};
  background: ${({ theme, $checked }) =>
    $checked ? theme.colors.surfaceContainer : theme.colors.surface};
  border: 1px solid
    ${({ theme, $checked }) => ($checked ? theme.colors.primary : theme.colors.border)};
  border-radius: ${({ theme }) => theme.radii.md};
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
  transition:
    border-color ${({ theme }) => theme.transitions.fast},
    background ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: ${({ theme, $disabled }) =>
      $disabled ? theme.colors.border : theme.colors.borderStrong};
  }

  &:focus-within {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }
`;

const Native = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
`;

const Box = styled.span<{ $checked: boolean }>`
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  color: ${({ theme }) => theme.colors.onPrimary};
  background: ${({ theme, $checked }) => ($checked ? theme.colors.primary : theme.colors.surface)};
  border: 1px solid
    ${({ theme, $checked }) => ($checked ? theme.colors.primary : theme.colors.borderStrong)};
  border-radius: ${({ theme }) => theme.radii.xs};

  svg {
    opacity: ${({ $checked }) => ($checked ? 1 : 0)};
  }
`;

const OptionText = styled.span`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: ${({ theme }) => theme.fontSizes.bodySm};
  color: ${({ theme }) => theme.colors.text};
`;

const Placeholder = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.bodySm};
  color: ${({ theme }) => theme.colors.textSubtle};
`;

/** A multi-select checkbox list. Value is a JSON string array. */
export function CheckboxGroup({
  value,
  onChange,
  options,
  id,
  disabled = false,
  'aria-describedby': describedBy,
}: CheckboxGroupProps) {
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
    <Group id={id} role="group" aria-describedby={describedBy}>
      {options.map((option, index) => {
        const checked = selected.includes(option);
        return (
          <Option key={`${option}-${index}`} $checked={checked} $disabled={disabled}>
            <Native
              type="checkbox"
              checked={checked}
              disabled={disabled}
              onChange={() => toggle(option)}
            />
            <Box $checked={checked} aria-hidden>
              <Check size={14} strokeWidth={3} />
            </Box>
            <OptionText>{option}</OptionText>
          </Option>
        );
      })}
    </Group>
  );
}
