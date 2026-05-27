'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, useReducedMotion } from 'framer-motion';
import { EyeOff, LayoutList } from 'lucide-react';
import type { FormField } from '@/types/field';
import { isDisplayType } from '@/lib/fieldTypes';
import { FieldInput } from './FieldInput';
import { DisplayBlock } from './DisplayBlock';
import {
  Empty,
  FieldError,
  FieldHeader,
  FieldLabel,
  Grid,
  HiddenTag,
  Item,
  Req,
} from './FormRenderer.styles';

export interface FormRendererProps {
  fields: FormField[];
  /** `preview` self-manages values; `fill` is controlled by the caller. */
  mode: 'preview' | 'fill';
  values?: Record<string, string>;
  errors?: Record<string, string>;
  onChange?: (id: string, value: string) => void;
}

function seedDefaults(fields: FormField[]): Record<string, string> {
  return Object.fromEntries(fields.map((f) => [f.id, f.defaultValue]));
}

/**
 * Renders a form schema as a real, interactive form. In `preview` it keeps
 * its own ephemeral values (reseeded when the schema changes); in `fill` it
 * is fully controlled and surfaces validation errors.
 */
export function FormRenderer({ fields, mode, values, errors, onChange }: FormRendererProps) {
  const reduceMotion = useReducedMotion();
  const controlled = mode === 'fill';

  // Preview-only ephemeral state, reseeded whenever ids/types/defaults change.
  const signature = useMemo(
    () => fields.map((f) => `${f.id}:${f.type}:${f.defaultValue}`).join('|'),
    [fields],
  );
  const [internal, setInternal] = useState<Record<string, string>>(() => seedDefaults(fields));
  const lastSignature = useRef(signature);
  useEffect(() => {
    if (!controlled && lastSignature.current !== signature) {
      lastSignature.current = signature;
      setInternal(seedDefaults(fields));
    }
  }, [signature, fields, controlled]);

  const currentValues = controlled ? (values ?? {}) : internal;
  const handleChange = (id: string, value: string) => {
    if (controlled) onChange?.(id, value);
    else setInternal((s) => ({ ...s, [id]: value }));
  };

  // Fill hides hidden fields; preview shows them dimmed so the builder sees them.
  const visible = controlled ? fields.filter((f) => !f.hidden) : fields;

  if (visible.length === 0) {
    return (
      <Empty>
        <LayoutList size={36} aria-hidden />
        <p>
          {mode === 'fill'
            ? 'This form has no fields.'
            : 'Add a field to see your form take shape here.'}
        </p>
      </Empty>
    );
  }

  return (
    <Grid>
      <AnimatePresence initial={false}>
        {visible.map((field) => {
          const error = errors?.[field.id];
          const errorId = error ? `fr-${field.id}-error` : undefined;
          const dimmed = !controlled && field.hidden;
          const display = isDisplayType(field.type);
          return (
            <Item
              key={field.id}
              $full={display || field.fullWidth || field.block}
              $dim={dimmed}
              layout={!reduceMotion}
              initial={reduceMotion ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: dimmed ? 0.55 : 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
              transition={{ duration: reduceMotion ? 0 : 0.2, ease: 'easeOut' }}
            >
              {display ? (
                <DisplayBlock field={field} />
              ) : (
                <>
                  <FieldHeader>
                    <FieldLabel htmlFor={`fr-${field.id}`}>
                      {field.label || 'Untitled field'}
                      {field.required && <Req aria-hidden> *</Req>}
                    </FieldLabel>
                    {dimmed && (
                      <HiddenTag>
                        <EyeOff size={11} aria-hidden />
                        Hidden
                      </HiddenTag>
                    )}
                  </FieldHeader>

                  <FieldInput
                    id={`fr-${field.id}`}
                    field={field}
                    value={currentValues[field.id] ?? ''}
                    onChange={(v) => handleChange(field.id, v)}
                    disabled={field.disabled}
                    hasError={Boolean(error)}
                    ariaDescribedBy={errorId}
                  />

                  {error && (
                    <FieldError id={errorId} role="alert">
                      {error}
                    </FieldError>
                  )}
                </>
              )}
            </Item>
          );
        })}
      </AnimatePresence>
    </Grid>
  );
}
