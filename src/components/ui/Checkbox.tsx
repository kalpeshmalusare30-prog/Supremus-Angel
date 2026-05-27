'use client';

import React, { useId } from 'react';
import { Check } from 'lucide-react';
import styled from 'styled-components';

export interface CheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
  description?: string;
  id?: string;
  disabled?: boolean;
}

const Row = styled.label<{ $disabled: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
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

const NativeInput = styled.input`
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
  width: 20px;
  height: 20px;
  margin-top: 1px;
  color: ${({ theme }) => theme.colors.onPrimary};
  background: ${({ theme, $checked }) => ($checked ? theme.colors.primary : theme.colors.surface)};
  border: 1px solid
    ${({ theme, $checked }) => ($checked ? theme.colors.primary : theme.colors.borderStrong)};
  border-radius: ${({ theme }) => theme.radii.xs};
  transition:
    background ${({ theme }) => theme.transitions.fast},
    border-color ${({ theme }) => theme.transitions.fast};

  svg {
    opacity: ${({ $checked }) => ($checked ? 1 : 0)};
    transform: scale(${({ $checked }) => ($checked ? 1 : 0.6)});
    transition: ${({ theme }) => `opacity ${theme.transitions.fast}, transform ${theme.transitions.fast}`};
  }
`;

const Text = styled.span`
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
`;

const LabelText = styled.span`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: ${({ theme }) => theme.fontSizes.bodySm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text};
`;

const DescText = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.caption};
  line-height: ${({ theme }) => theme.lineHeights.caption};
  color: ${({ theme }) => theme.colors.textMuted};
`;

/** Labelled checkbox with optional description, used for field settings. */
export function Checkbox({
  checked,
  onCheckedChange,
  label,
  description,
  id,
  disabled = false,
}: CheckboxProps) {
  const reactId = useId();
  const inputId = id ?? reactId;
  return (
    <Row htmlFor={inputId} $disabled={disabled}>
      <NativeInput
        id={inputId}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onCheckedChange(e.target.checked)}
      />
      <Box $checked={checked} aria-hidden>
        <Check size={14} strokeWidth={3} />
      </Box>
      <Text>
        <LabelText>{label}</LabelText>
        {description && <DescText>{description}</DescText>}
      </Text>
    </Row>
  );
}
