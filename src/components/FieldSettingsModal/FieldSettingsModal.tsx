'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { FormField } from '@/types/field';
import { getFieldType, isDisplayType } from '@/lib/fieldTypes';
import { isValidName } from '@/lib/schema';
import { validateLabel } from '@/lib/validators';
import { Button, Checkbox, IconButton, Input, Label, Modal, Textarea } from '@/components/ui';
import { FieldInput } from '@/components/FormRenderer/FieldInput';
import {
  AddOption,
  CheckGrid,
  ErrorText,
  FieldBlock,
  Form,
  Helper,
  OptionList,
  OptionRow,
  Options,
  SectionLabel,
} from './FieldSettingsModal.styles';

/** The boolean setting keys, in display order. */
type FlagKey = 'required' | 'hidden' | 'fullWidth' | 'block' | 'disabled' | 'useDisplayValue';

const FLAGS: { key: FlagKey; label: string; description: string }[] = [
  { key: 'required', label: 'Required', description: 'Must be filled before submitting.' },
  { key: 'hidden', label: 'Hidden', description: 'Excluded from the rendered form.' },
  { key: 'fullWidth', label: 'Full Width', description: 'Spans the whole row.' },
  { key: 'block', label: 'Block', description: 'Its own row, label on top.' },
  { key: 'disabled', label: 'Disabled', description: 'Shown but not editable.' },
  { key: 'useDisplayValue', label: 'Use Display Value', description: 'Show the formatted value.' },
];

// Types whose value comes from a picker/choice — a placeholder makes no sense.
const NO_PLACEHOLDER = new Set([
  'date',
  'time',
  'datetime',
  'month',
  'week',
  'boolean',
  'radio',
  'range',
  'stepper',
  'checkboxes',
  'multiselect',
  'likert',
  'otp',
  'year',
  'daterange',
  'file',
  'image',
]);

export interface FieldSettingsModalProps {
  /** Field being created/edited; null when the modal is closed. */
  field: FormField | null;
  mode: 'create' | 'edit';
  /** Names of the OTHER fields, for uniqueness validation. */
  existingNames: string[];
  onClose: () => void;
  onSave: (field: FormField) => void;
}

/** Configure a field's settings (name, label, value, and behaviour flags). */
export function FieldSettingsModal({
  field,
  mode,
  existingNames,
  onClose,
  onSave,
}: FieldSettingsModalProps) {
  const [draft, setDraft] = useState<FormField | null>(field);

  // Reset the working copy whenever a different field opens.
  useEffect(() => {
    setDraft(field);
  }, [field]);

  const def = draft ? getFieldType(draft.type) : null;

  const labelError = draft ? validateLabel(draft.label) : undefined;
  const nameError = useMemo(() => {
    if (!draft) return undefined;
    const n = draft.name.trim();
    if (n === '') return 'Name is required.';
    if (!isValidName(n)) return 'Use letters, numbers and underscores; can’t start with a number.';
    if (existingNames.includes(n)) return 'That name is already used by another field.';
    return undefined;
  }, [draft, existingNames]);

  const valid = !labelError && !nameError;

  const set = (patch: Partial<FormField>) => setDraft((d) => (d ? { ...d, ...patch } : d));

  const handleSave = () => {
    if (draft && valid) {
      onSave({ ...draft, name: draft.name.trim(), label: draft.label.trim() });
    }
  };

  const isDisplay = Boolean(draft && isDisplayType(draft.type));
  const isHeadingText =
    draft?.type === 'heading' || draft?.type === 'subheading' || draft?.type === 'sectionheader';
  const showPlaceholder = Boolean(
    draft && def && def.control !== 'toggle' && !isDisplay && !NO_PLACEHOLDER.has(draft.type),
  );
  const usesOptions =
    def?.control === 'select' ||
    def?.control === 'radio' ||
    def?.control === 'segmented' ||
    def?.control === 'checkboxes' ||
    def?.control === 'multiselect';
  const options = draft?.options ?? [];

  const setOption = (index: number, value: string) =>
    set({ options: options.map((o, i) => (i === index ? value : o)) });
  const addOptionItem = () => set({ options: [...options, `Option ${options.length + 1}`] });
  const removeOption = (index: number) => set({ options: options.filter((_, i) => i !== index) });

  return (
    <Modal
      open={draft != null}
      onClose={onClose}
      title={mode === 'create' ? `Configure ${def?.label ?? 'field'}` : 'Edit field'}
      description="Set how this field behaves in the published form."
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!valid}>
            {mode === 'create' ? 'Add field' : 'Save changes'}
          </Button>
        </>
      }
    >
      {draft && def && isDisplay && (
        <Form>
          <FieldBlock>
            <Label htmlFor="fs-label">{isHeadingText ? 'Text' : 'Label'}</Label>
            <Input
              id="fs-label"
              value={draft.label}
              placeholder={isHeadingText ? 'Displayed text' : 'Internal label'}
              hasError={Boolean(labelError)}
              onChange={(e) => set({ label: e.target.value })}
            />
            {labelError && <ErrorText role="alert">{labelError}</ErrorText>}
          </FieldBlock>

          {(draft.type === 'description' || draft.type === 'html') && (
            <FieldBlock>
              <Label htmlFor="fs-content">{draft.type === 'html' ? 'HTML' : 'Text'}</Label>
              <Textarea
                id="fs-content"
                rows={4}
                value={draft.defaultValue}
                placeholder={draft.type === 'html' ? '<p>…</p>' : 'Helpful text for respondents…'}
                onChange={(e) => set({ defaultValue: e.target.value })}
              />
            </FieldBlock>
          )}

          {(draft.type === 'imageblock' || draft.type === 'video') && (
            <FieldBlock>
              <Label htmlFor="fs-content">{draft.type === 'video' ? 'Video URL' : 'Image URL'}</Label>
              <Input
                id="fs-content"
                type="url"
                value={draft.defaultValue}
                placeholder="https://…"
                onChange={(e) => set({ defaultValue: e.target.value })}
              />
            </FieldBlock>
          )}

          {draft.type === 'progress' && (
            <FieldBlock>
              <Label htmlFor="fs-content">Percent (0–100)</Label>
              <Input
                id="fs-content"
                inputMode="numeric"
                value={draft.defaultValue}
                placeholder="50"
                onChange={(e) => set({ defaultValue: e.target.value })}
              />
            </FieldBlock>
          )}

          <Options>
            <SectionLabel>Options</SectionLabel>
            <CheckGrid>
              <Checkbox
                label="Hidden"
                description="Excluded from the rendered form."
                checked={draft.hidden}
                onCheckedChange={(c) => set({ hidden: c })}
              />
            </CheckGrid>
          </Options>
        </Form>
      )}

      {draft && def && !isDisplay && (
        <Form>
          <FieldBlock>
            <Label htmlFor="fs-label">Label</Label>
            <Input
              id="fs-label"
              value={draft.label}
              placeholder="e.g. Full name"
              hasError={Boolean(labelError)}
              onChange={(e) => set({ label: e.target.value })}
            />
            {labelError && <ErrorText role="alert">{labelError}</ErrorText>}
          </FieldBlock>

          <FieldBlock>
            <Label htmlFor="fs-name">Name</Label>
            <Input
              id="fs-name"
              value={draft.name}
              placeholder="full_name"
              hasError={Boolean(nameError)}
              onChange={(e) => set({ name: e.target.value })}
            />
            {nameError ? (
              <ErrorText role="alert">{nameError}</ErrorText>
            ) : (
              <Helper>Unique variable name used as the backend data key.</Helper>
            )}
          </FieldBlock>

          {showPlaceholder && (
            <FieldBlock>
              <Label htmlFor="fs-placeholder">Placeholder</Label>
              <Input
                id="fs-placeholder"
                value={draft.placeholder}
                placeholder="Shown when the field is empty"
                onChange={(e) => set({ placeholder: e.target.value })}
              />
            </FieldBlock>
          )}

          {usesOptions && (
            <FieldBlock>
              <Label>Options</Label>
              <OptionList>
                {options.map((option, index) => (
                  <OptionRow key={index}>
                    <Input
                      value={option}
                      placeholder={`Option ${index + 1}`}
                      aria-label={`Option ${index + 1}`}
                      onChange={(e) => setOption(index, e.target.value)}
                    />
                    <IconButton
                      aria-label={`Remove option ${index + 1}`}
                      danger
                      onClick={() => removeOption(index)}
                    >
                      <Trash2 size={18} aria-hidden />
                    </IconButton>
                  </OptionRow>
                ))}
              </OptionList>
              <AddOption>
                <Button size="sm" variant="secondary" onClick={addOptionItem}>
                  <Plus size={16} aria-hidden />
                  Add option
                </Button>
              </AddOption>
            </FieldBlock>
          )}

          <FieldBlock>
            <Label htmlFor="fs-value">{usesOptions ? 'Default value' : 'Value'}</Label>
            <FieldInput
              id="fs-value"
              field={draft}
              value={draft.defaultValue}
              onChange={(v) => set({ defaultValue: v })}
            />
            <Helper>Default value pre-filled for respondents.</Helper>
          </FieldBlock>

          <Options>
            <SectionLabel>Options</SectionLabel>
            <CheckGrid>
              {FLAGS.map((flag) => (
                <Checkbox
                  key={flag.key}
                  label={flag.label}
                  description={flag.description}
                  checked={draft[flag.key]}
                  onCheckedChange={(c) => set({ [flag.key]: c } as Partial<FormField>)}
                />
              ))}
            </CheckGrid>
          </Options>
        </Form>
      )}
    </Modal>
  );
}
