'use client';

import React, { memo } from 'react';
import { ChevronDown, ChevronUp, Pencil, Trash2 } from 'lucide-react';
import type { FormField } from '@/types/field';
import { getFieldType } from '@/lib/fieldTypes';
import { IconButton } from '@/components/ui';
import {
  Actions,
  Body,
  Card,
  CardLabel,
  Chip,
  Chips,
  IconWrap,
  NameText,
  TopLine,
  TypeChip,
} from './FieldCard.styles';

export interface FieldCardProps {
  field: FormField;
  onEdit: (id: string) => void;
  onRemove: (id: string) => void;
  /** Reorder the field up/down; omitted when reordering isn't available. */
  onMove?: (id: string, direction: 'up' | 'down') => void;
  isFirst?: boolean;
  isLast?: boolean;
}

/** The enabled boolean settings, shown as chips. */
const FLAG_LABELS: { key: keyof FormField; label: string }[] = [
  { key: 'required', label: 'Required' },
  { key: 'hidden', label: 'Hidden' },
  { key: 'fullWidth', label: 'Full width' },
  { key: 'block', label: 'Block' },
  { key: 'disabled', label: 'Disabled' },
  { key: 'useDisplayValue', label: 'Display value' },
];

function FieldCardComponent({
  field,
  onEdit,
  onRemove,
  onMove,
  isFirst = false,
  isLast = false,
}: FieldCardProps) {
  const def = getFieldType(field.type);
  const Icon = def.icon;
  const labelEmpty = field.label.trim() === '';
  const activeFlags = FLAG_LABELS.filter((f) => field[f.key]);
  const fieldName = field.label ? `: ${field.label}` : '';

  return (
    <Card>
      <IconWrap>
        <Icon size={20} aria-hidden />
      </IconWrap>

      <Body>
        <TopLine>
          <CardLabel $muted={labelEmpty}>{labelEmpty ? 'Untitled field' : field.label}</CardLabel>
          <TypeChip>{def.label}</TypeChip>
        </TopLine>
        <NameText>{field.name}</NameText>
        {activeFlags.length > 0 && (
          <Chips>
            {activeFlags.map((f) => (
              <Chip key={f.key as string}>{f.label}</Chip>
            ))}
          </Chips>
        )}
      </Body>

      <Actions>
        {onMove && (
          <>
            <IconButton
              aria-label={`Move field up${fieldName}`}
              disabled={isFirst}
              onClick={() => onMove(field.id, 'up')}
            >
              <ChevronUp size={18} aria-hidden />
            </IconButton>
            <IconButton
              aria-label={`Move field down${fieldName}`}
              disabled={isLast}
              onClick={() => onMove(field.id, 'down')}
            >
              <ChevronDown size={18} aria-hidden />
            </IconButton>
          </>
        )}
        <IconButton aria-label={`Edit field${fieldName}`} onClick={() => onEdit(field.id)}>
          <Pencil size={18} aria-hidden />
        </IconButton>
        <IconButton aria-label={`Remove field${fieldName}`} danger onClick={() => onRemove(field.id)}>
          <Trash2 size={18} aria-hidden />
        </IconButton>
      </Actions>
    </Card>
  );
}

/** Only re-renders when its own field reference changes (TRD §11). */
export const FieldCard = memo(FieldCardComponent);
