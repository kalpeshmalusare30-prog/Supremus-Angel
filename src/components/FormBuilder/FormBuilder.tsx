'use client';

import { useCallback, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Plus, RotateCcw, Send } from 'lucide-react';
import { useFormFields } from '@/hooks/useFormFields';
import { useFieldPersistence } from '@/hooks/useLocalStorage';
import { FieldRow } from '@/components/FieldRow';
import { LivePreview } from '@/components/LivePreview';
import { AppShell } from '@/components/Shell';
import { Button } from '@/components/ui';
import {
  Actions,
  EmptyHeading,
  EmptyIcon,
  EmptyText,
  FieldList,
  FormColumn,
  FormEmpty,
  FormHead,
  PageTitle,
  PreviewColumn,
  Split,
  Subtitle,
  TitleBlock,
} from './FormBuilder.styles';

/** Root client component. Owns the field list state and orchestrates the UI. */
export function FormBuilder() {
  const { fields, lastSubmittedAt, addField, removeField, updateField, submit, reset, hydrate } =
    useFormFields();
  const [autoFocusId, setAutoFocusId] = useState<string | null>(null);

  // Optional session persistence (no-ops silently if localStorage is blocked).
  useFieldPersistence(fields, hydrate);

  const handleAdd = useCallback(() => {
    setAutoFocusId(addField());
  }, [addField]);

  const hasFields = fields.length > 0;

  return (
    <AppShell onPublish={submit} canPublish={hasFields}>
      <Split>
        <FormColumn aria-label="Form builder">
          <FormHead>
            <TitleBlock>
              <PageTitle>Build your form</PageTitle>
              <Subtitle>Add fields on the fly and watch them render live.</Subtitle>
            </TitleBlock>
            <Button onClick={handleAdd}>
              <Plus size={20} aria-hidden />
              Add field
            </Button>
          </FormHead>

          {hasFields ? (
            <>
              <FieldList>
                <AnimatePresence initial={false}>
                  {fields.map((field) => (
                    <FieldRow
                      key={field.id}
                      field={field}
                      autoFocus={field.id === autoFocusId}
                      onChange={updateField}
                      onRemove={removeField}
                    />
                  ))}
                </AnimatePresence>
              </FieldList>

              <Actions>
                <Button onClick={submit}>
                  <Send size={16} aria-hidden />
                  Submit
                </Button>
                <Button variant="ghost" onClick={reset}>
                  <RotateCcw size={16} aria-hidden />
                  Reset
                </Button>
              </Actions>
            </>
          ) : (
            <FormEmpty>
              <EmptyIcon aria-hidden>
                <Plus size={28} />
              </EmptyIcon>
              <EmptyHeading>Start building</EmptyHeading>
              <EmptyText>
                Your form is looking a bit empty. Add your first field to begin.
              </EmptyText>
              <Button onClick={handleAdd}>
                <Plus size={20} aria-hidden />
                Add field
              </Button>
            </FormEmpty>
          )}
        </FormColumn>

        <PreviewColumn>
          <LivePreview fields={fields} lastSubmittedAt={lastSubmittedAt} />
        </PreviewColumn>
      </Split>
    </AppShell>
  );
}
