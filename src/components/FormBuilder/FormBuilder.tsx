'use client';

import { useCallback, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { AlertTriangle, Check, Copy, ExternalLink, Plus, RotateCcw, Send, Trash2 } from 'lucide-react';
import type { FieldType, FormField } from '@/types/field';
import { useFormFields } from '@/hooks/useFormFields';
import { useSchemaPersistence } from '@/hooks/useLocalStorage';
import { createField, encodeSchema } from '@/lib/schema';
import { saveForm } from '@/lib/store';
import { createId } from '@/utils/id';
import { normalizeTitle } from '@/utils/title';
import { FieldCard } from '@/components/FieldCard';
import { FieldTypePicker } from '@/components/FieldTypePicker';
import { FieldSettingsModal } from '@/components/FieldSettingsModal';
import { LivePreview } from '@/components/LivePreview';
import { AppShell } from '@/components/Shell';
import { Button, Input, Label, Modal } from '@/components/ui';
import {
  Actions,
  BannerActions,
  ConfirmText,
  EmptyHeading,
  EmptyIcon,
  EmptyText,
  FieldList,
  FormColumn,
  FormEmpty,
  FormHead,
  PageTitle,
  PreviewColumn,
  Published,
  PublishedHead,
  Split,
  Subtitle,
  TitleBlock,
  TitleField,
  UrlRow,
  UrlText,
  UrlWarn,
} from './FormBuilder.styles';

// Conservative ceiling: most browsers/servers handle URLs well past this, but
// past ~8k a shared link starts to risk truncation (BUG-009 mitigation).
const URL_WARN_LENGTH = 8000;

interface EditorState {
  mode: 'create' | 'edit';
  field: FormField;
}

/** Root client component. Owns the form schema and orchestrates the UI. */
export function FormBuilder() {
  const { title, fields, addField, updateField, removeField, moveField, setTitle, reset, hydrate } =
    useFormFields();
  const reduceMotion = useReducedMotion();

  // Stable id for this form, assigned on first publish so edits re-publish to
  // the same entry rather than creating duplicates. Recovered from the draft.
  const [formId, setFormId] = useState<string | null>(null);

  const schema = useMemo(
    () => ({ id: formId ?? undefined, title, fields }),
    [formId, title, fields],
  );
  // Optional session persistence (no-ops silently if localStorage is blocked).
  useSchemaPersistence(schema, (s) => {
    hydrate(s);
    setFormId(s.id ?? null);
  });

  const [pickerOpen, setPickerOpen] = useState(false);
  const [editor, setEditor] = useState<EditorState | null>(null);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<FormField | null>(null);
  // IMP-003: Reset confirmation state.
  const [resetConfirm, setResetConfirm] = useState(false);

  const hasFields = fields.length > 0;

  const handleAddClick = useCallback(() => setPickerOpen(true), []);

  const handlePickType = useCallback(
    (type: FieldType) => {
      setPickerOpen(false);
      setEditor({ mode: 'create', field: createField(type, fields.map((f) => f.name)) });
    },
    [fields],
  );

  const handleEdit = useCallback(
    (id: string) => {
      const field = fields.find((f) => f.id === id);
      if (field) setEditor({ mode: 'edit', field });
    },
    [fields],
  );

  const handleEditorSave = useCallback(
    (field: FormField) => {
      if (editor?.mode === 'edit') updateField(field.id, field);
      else addField(field);
      setEditor(null);
    },
    [editor, addField, updateField],
  );

  const handlePublish = useCallback(() => {
    if (fields.length === 0) return;
    // A blank title isn't blocked — we auto-apply a default so the saved form
    // and shared link carry a real, identifiable title (BUG-007).
    const finalTitle = normalizeTitle(title);
    if (finalTitle !== title) setTitle(finalTitle);
    // Ensure a stable id, save to "My Forms", then open the shareable link.
    const id = formId ?? createId();
    if (id !== formId) setFormId(id);
    const published = { id, title: finalTitle, fields };
    saveForm(published);
    const url = `${window.location.origin}/form#${encodeSchema(published)}`;
    setPublishedUrl(url);
    setCopied(false);
    window.open(url, '_blank', 'noopener,noreferrer');
  }, [formId, title, fields, setTitle]);

  const confirmRemove = useCallback(() => {
    if (removeTarget) removeField(removeTarget.id);
    setRemoveTarget(null);
  }, [removeTarget, removeField]);

  // Field removal goes through a confirmation step (BUG-006) — parity with the
  // form-delete dialog on My Forms. Stable so memoized cards don't re-render.
  const handleRemoveRequest = useCallback(
    (id: string) => setRemoveTarget(fields.find((f) => f.id === id) ?? null),
    [fields],
  );

  const handleCopy = useCallback(async () => {
    if (!publishedUrl) return;
    try {
      await navigator.clipboard.writeText(publishedUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked — the URL is still visible to copy manually.
    }
  }, [publishedUrl]);

  // IMP-003: Reset goes through a confirmation modal before executing.
  const handleResetRequest = useCallback(() => setResetConfirm(true), []);
  const confirmReset = useCallback(() => {
    reset();
    setFormId(null);
    setPublishedUrl(null);
    setResetConfirm(false);
  }, [reset]);

  // Other fields' names, so the editor can enforce uniqueness (excludes self on edit).
  const existingNames = editor
    ? fields.filter((f) => f.id !== editor.field.id).map((f) => f.name)
    : [];

  return (
    <AppShell onPublish={handlePublish} canPublish={hasFields}>
      <Split>
        <FormColumn aria-label="Form builder">
          <FormHead>
            <TitleBlock>
              <PageTitle>Build your form</PageTitle>
              <Subtitle>Add fields, configure each one, then publish a shareable link.</Subtitle>
            </TitleBlock>
            <Button onClick={handleAddClick}>
              <Plus size={20} aria-hidden />
              Add field
            </Button>
          </FormHead>

          <TitleField>
            <Label htmlFor="form-title">Form title</Label>
            <Input
              id="form-title"
              value={title}
              placeholder="Untitled form"
              onChange={(e) => setTitle(e.target.value)}
            />
          </TitleField>

          {hasFields ? (
            <>
              <FieldList>
                <AnimatePresence initial={false}>
                  {fields.map((field, index) => (
                    <motion.div
                      key={field.id}
                      layout={!reduceMotion}
                      initial={reduceMotion ? false : { opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
                      transition={{ duration: reduceMotion ? 0 : 0.2, ease: 'easeOut' }}
                    >
                      <FieldCard
                        field={field}
                        onEdit={handleEdit}
                        onRemove={handleRemoveRequest}
                        onMove={moveField}
                        isFirst={index === 0}
                        isLast={index === fields.length - 1}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </FieldList>

              <Actions>
                <Button onClick={handlePublish}>
                  <Send size={16} aria-hidden />
                  Publish form
                </Button>
                <Button variant="ghost" onClick={handleResetRequest}>
                  <RotateCcw size={16} aria-hidden />
                  Reset
                </Button>
              </Actions>

              <AnimatePresence>
                {publishedUrl && (
                  <Published
                    initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: reduceMotion ? 0 : 0.2 }}
                  >
                    <PublishedHead>
                      <Check size={16} aria-hidden />
                      Form published — opened in a new tab.
                    </PublishedHead>
                    {publishedUrl.length > URL_WARN_LENGTH && (
                      <UrlWarn>
                        <AlertTriangle size={14} aria-hidden />
                        This form is large, so the share link is long and may be truncated by some
                        apps. Keep forms compact, or share the link via a tool that preserves long
                        URLs.
                      </UrlWarn>
                    )}
                    <UrlRow>
                      <UrlText title={publishedUrl}>{publishedUrl}</UrlText>
                      <BannerActions>
                        <Button size="sm" variant="secondary" onClick={handleCopy}>
                          {copied ? <Check size={16} aria-hidden /> : <Copy size={16} aria-hidden />}
                          {copied ? 'Copied' : 'Copy'}
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => window.open(publishedUrl, '_blank', 'noopener,noreferrer')}
                        >
                          <ExternalLink size={16} aria-hidden />
                          Open
                        </Button>
                      </BannerActions>
                    </UrlRow>
                  </Published>
                )}
              </AnimatePresence>
            </>
          ) : (
            <FormEmpty>
              <EmptyIcon aria-hidden>
                <Plus size={28} />
              </EmptyIcon>
              <EmptyHeading>Start building</EmptyHeading>
              <EmptyText>Your form is empty. Add your first field to begin.</EmptyText>
              <Button onClick={handleAddClick}>
                <Plus size={20} aria-hidden />
                Add field
              </Button>
            </FormEmpty>
          )}
        </FormColumn>

        <PreviewColumn>
          <LivePreview title={title} fields={fields} />
        </PreviewColumn>
      </Split>

      <FieldTypePicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={handlePickType}
      />
      <FieldSettingsModal
        field={editor?.field ?? null}
        mode={editor?.mode ?? 'create'}
        existingNames={existingNames}
        onClose={() => setEditor(null)}
        onSave={handleEditorSave}
      />

      <Modal
        open={Boolean(removeTarget)}
        onClose={() => setRemoveTarget(null)}
        title="Remove this field?"
        footer={
          <>
            <Button variant="ghost" onClick={() => setRemoveTarget(null)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={confirmRemove}>
              <Trash2 size={16} aria-hidden />
              Remove field
            </Button>
          </>
        }
      >
        <ConfirmText>
          <strong>{removeTarget?.label?.trim() || 'This field'}</strong> will be removed from the
          form. This action cannot be undone.
        </ConfirmText>
      </Modal>

      {/* IMP-003: Reset confirmation dialog. */}
      <Modal
        open={resetConfirm}
        onClose={() => setResetConfirm(false)}
        title="Reset the form?"
        footer={
          <>
            <Button variant="ghost" onClick={() => setResetConfirm(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={confirmReset}>
              <RotateCcw size={16} aria-hidden />
              Reset form
            </Button>
          </>
        }
      >
        <ConfirmText>
          This will clear all fields and the form title. This action cannot be undone.
        </ConfirmText>
      </Modal>
    </AppShell>
  );
}
