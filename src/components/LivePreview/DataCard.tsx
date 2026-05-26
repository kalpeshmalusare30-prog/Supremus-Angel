'use client';

import React, { memo, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import styled, { css, keyframes } from 'styled-components';
import type { FormField } from '@/types/field';
import { formatDisplayValue, isNumeric, metaSummary } from '@/utils/format';
import { Tooltip } from '@/components/ui';

export interface DataCardProps extends React.HTMLAttributes<HTMLDivElement> {
  field: FormField;
  /** Subtle border highlight after a submit (App Flow §3.5). */
  submitted?: boolean;
}

const flashKf = keyframes`
  from { background: #e1e0ff; }
  to { background: #ffffff; }
`;

const Card = styled.div<{ $flash: boolean; $submitted: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid
    ${({ theme, $submitted }) => ($submitted ? theme.colors.primary : theme.colors.border)};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  cursor: default;
  transition:
    transform ${({ theme }) => theme.transitions.base},
    box-shadow ${({ theme }) => theme.transitions.base},
    border-color ${({ theme }) => theme.transitions.base};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }

  &:focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }

  ${({ $flash }) =>
    $flash &&
    css`
      animation: ${flashKf} 420ms ease-out;
    `}
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const FieldName = styled.span<{ $muted: boolean }>`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.caption};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  letter-spacing: ${({ theme }) => theme.letterSpacings.label};
  text-transform: uppercase;
  color: ${({ theme, $muted }) => ($muted ? theme.colors.textSubtle : theme.colors.primary)};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Value = styled.span<{ $numeric: boolean }>`
  font-family: ${({ theme, $numeric }) => ($numeric ? theme.fonts.mono : theme.fonts.heading)};
  font-size: ${({ theme }) => theme.fontSizes.h2};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text};
  text-align: ${({ $numeric }) => ($numeric ? 'right' : 'left')};
  font-variant-numeric: tabular-nums;
  word-break: break-word;
  overflow-wrap: anywhere;
`;

const Badge = styled.span`
  flex: none;
  padding: 2px 8px;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 10px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
  background: ${({ theme }) => theme.colors.surfaceMuted};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.full};
`;

const Warn = styled(AlertCircle)`
  flex: none;
  color: ${({ theme }) => theme.colors.danger};
`;

function DataCardComponent({ field, submitted = false, ...rest }: DataCardProps) {
  const reduceMotion = useReducedMotion();
  const [flash, setFlash] = useState(false);
  const firstRender = useRef(true);

  // Flash-highlight the card when its data changes (UI/UX Brief §10.2).
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (reduceMotion) return;
    setFlash(true);
    const timer = window.setTimeout(() => setFlash(false), 420);
    return () => window.clearTimeout(timer);
  }, [field.value, field.label, field.type, reduceMotion]);

  const numeric = isNumeric(field);
  const labelEmpty = field.label.trim() === '';

  return (
    <Tooltip content={metaSummary(field)}>
      <Card $flash={flash} $submitted={submitted} onAnimationEnd={() => setFlash(false)} {...rest}>
        <Header>
          <FieldName $muted={labelEmpty}>{labelEmpty ? 'Untitled field' : field.label}</FieldName>
          <Badge>{field.type}</Badge>
        </Header>
        <Header>
          <Value $numeric={numeric}>{formatDisplayValue(field)}</Value>
          {field.error && <Warn size={16} aria-label={field.error} />}
        </Header>
      </Card>
    </Tooltip>
  );
}

export const DataCard = memo(DataCardComponent);
