'use client';

import React, { memo, useEffect, useId, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import type { FieldType, FormField } from '@/types/field';
import { validateValue } from '@/lib/validators';
import { IconButton, Input, Label, Select } from '@/components/ui';
import { Cell, ErrorText, RemoveWrap, Row } from './FieldRow.styles';

export interface FieldRowProps {
  field: FormField;
  /** Focus the label input on mount (newly added field). */
  autoFocus?: boolean;
  onChange: (id: string, patch: Partial<FormField>) => void;
  onRemove: (id: string) => void;
}

const TYPE_OPTIONS = [
  { value: 'text', label: 'Text' },
  { value: 'number', label: 'Number' },
  { value: 'email', label: 'Email' },
];

/** Maps a field type to the underlying input attributes. */
function inputAttrs(type: FieldType): React.InputHTMLAttributes<HTMLInputElement> {
  switch (type) {
    case 'email':
      return { type: 'email', inputMode: 'email', autoComplete: 'off' };
    case 'number':
      // Kept as text so invalid entries can be flagged rather than silently dropped.
      return { type: 'text', inputMode: 'decimal' };
    case 'text':
    default:
      return { type: 'text' };
  }
}

function FieldRowComponent({ field, autoFocus = false, onChange, onRemove }: FieldRowProps) {
  const reduceMotion = useReducedMotion();
  const labelRef = useRef<HTMLInputElement>(null);
  const reactId = useId();
  const labelId = `${reactId}-label`;
  const typeId = `${reactId}-type`;
  const valueId = `${reactId}-value`;
  const errorId = `${reactId}-error`;

  useEffect(() => {
    if (autoFocus) labelRef.current?.focus();
  }, [autoFocus]);

  const handleLabel = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(field.id, { label: e.target.value, error: undefined });
  };

  const handleValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(field.id, { value: e.target.value, error: undefined });
  };

  const handleValueBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    onChange(field.id, { error: validateValue(field.type, e.target.value) });
  };

  const handleType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextType = e.target.value as FieldType;
    // Preserve the value, re-validate it against the new type (App Flow §3.3).
    onChange(field.id, { type: nextType, error: validateValue(nextType, field.value) });
  };

  return (
    <Row
      layout={!reduceMotion}
      initial={reduceMotion ? false : { opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0, marginTop: 0, padding: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.22, ease: 'easeOut' }}
    >
      <Cell $grow={2}>
        <Label htmlFor={labelId}>Label</Label>
        <Input
          ref={labelRef}
          id={labelId}
          value={field.label}
          placeholder="e.g. Full name"
          hasError={Boolean(field.error)}
          aria-describedby={field.error ? errorId : undefined}
          onChange={handleLabel}
        />
      </Cell>

      <Cell $basis="120px">
        <Label htmlFor={typeId}>Type</Label>
        <Select id={typeId} value={field.type} options={TYPE_OPTIONS} onChange={handleType} />
      </Cell>

      <Cell $grow={2}>
        <Label htmlFor={valueId}>Value</Label>
        <Input
          id={valueId}
          value={field.value}
          placeholder={field.type === 'email' ? 'name@domain.com' : 'Enter a value'}
          hasError={Boolean(field.error)}
          aria-describedby={field.error ? errorId : undefined}
          onChange={handleValue}
          onBlur={handleValueBlur}
          {...inputAttrs(field.type)}
        />
      </Cell>

      <RemoveWrap>
        <IconButton
          aria-label={`Remove field${field.label ? `: ${field.label}` : ''}`}
          danger
          onClick={() => onRemove(field.id)}
        >
          <Trash2 size={20} aria-hidden />
        </IconButton>
      </RemoveWrap>

      {field.error && (
        <ErrorText id={errorId} role="alert">
          {field.error}
        </ErrorText>
      )}
    </Row>
  );
}

/** Only re-renders when its own field reference or autoFocus changes (TRD §11). */
export const FieldRow = memo(FieldRowComponent);
