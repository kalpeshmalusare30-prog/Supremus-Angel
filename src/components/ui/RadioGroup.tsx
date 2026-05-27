'use client';

import React, { useId } from 'react';
import styled from 'styled-components';

export interface RadioGroupProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  /** Shared input name; defaults to a generated id. */
  name?: string;
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

const NativeRadio = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
`;

const Dot = styled.span<{ $checked: boolean }>`
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: ${({ theme }) => theme.radii.full};
  border: 2px solid
    ${({ theme, $checked }) => ($checked ? theme.colors.primary : theme.colors.borderStrong)};
  transition: border-color ${({ theme }) => theme.transitions.fast};

  &::after {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: ${({ theme }) => theme.radii.full};
    background: ${({ theme }) => theme.colors.primary};
    transform: scale(${({ $checked }) => ($checked ? 1 : 0)});
    transition: transform ${({ theme }) => theme.transitions.fast};
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

/** A single-select radio group rendered from a list of option strings. */
export function RadioGroup({
  value,
  onChange,
  options,
  name,
  id,
  disabled = false,
  'aria-describedby': describedBy,
}: RadioGroupProps) {
  const reactId = useId();
  const groupName = name ?? reactId;

  if (options.length === 0) {
    return <Placeholder>Add options in the field settings.</Placeholder>;
  }

  return (
    <Group role="radiogroup" id={id} aria-describedby={describedBy}>
      {options.map((option, index) => {
        const checked = value === option;
        return (
          <Option key={`${option}-${index}`} $checked={checked} $disabled={disabled}>
            <NativeRadio
              type="radio"
              name={groupName}
              value={option}
              checked={checked}
              disabled={disabled}
              onChange={() => onChange(option)}
            />
            <Dot $checked={checked} aria-hidden />
            <OptionText>{option}</OptionText>
          </Option>
        );
      })}
    </Group>
  );
}
