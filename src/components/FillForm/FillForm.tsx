'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { AlertCircle, BarChart3, CheckCircle2, FileWarning, Send } from 'lucide-react';
import type { FormField, FormSchema } from '@/types/field';
import { decodeSchema } from '@/lib/schema';
import { isDisplayType } from '@/lib/fieldTypes';
import { addResponse } from '@/lib/store';
import { validateFieldAnswer } from '@/lib/validators';
import { formatDisplayValue, linkHref } from '@/utils/format';
import { resolveTitle } from '@/utils/title';
import { FormRenderer } from '@/components/FormRenderer';
import { Button } from '@/components/ui';
import {
  Attribution,
  Brand,
  BrandMark,
  BrandName,
  Card,
  Centered,
  Heading,
  Intro,
  Page,
  RequiredHint,
  SkeletonCard,
  SkeletonLine,
  SubmitError,
  SubmitRow,
  SuccessHead,
  SummaryImage,
  SummaryKey,
  SummaryList,
  SummaryRow,
  SummaryVal,
} from './FillForm.styles';

type ValueMap = Record<string, string>;

/** Answerable (non-hidden, non-display) fields. */
function answerable(fields: FormField[]): FormField[] {
  return fields.filter((f) => !f.hidden && !isDisplayType(f.type));
}

function seedVisible(fields: FormField[]): ValueMap {
  return Object.fromEntries(answerable(fields).map((f) => [f.id, f.defaultValue]));
}

// Types with no sensible "raw" form — always show the formatted value.
const ALWAYS_FORMAT = new Set([
  'boolean',
  'checkboxes',
  'multiselect',
  'tags',
  'richtext',
  'map',
  'captcha',
]);

/** How a submitted answer is shown in the summary. */
function summaryValue(field: FormField, value: string): React.ReactNode {
  if (field.type === 'image') {
    return value.startsWith('data:image') ? <SummaryImage src={value} alt="Upload" /> : '—';
  }

  const formatted = formatDisplayValue(field.type, value);
  if (formatted === '—') return '—';
  if (field.type === 'password') return '••••••••';

  const text = field.useDisplayValue || ALWAYS_FORMAT.has(field.type) ? formatted : value;
  const href = linkHref(field.type, value);
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {text}
      </a>
    );
  }
  return text;
}

/** Renders a published form (decoded from the URL hash) for a respondent to fill. */
export function FillForm() {
  const reduceMotion = useReducedMotion();
  const [loaded, setLoaded] = useState(false);
  const [schema, setSchema] = useState<FormSchema | null>(null);
  const [values, setValues] = useState<ValueMap>({});
  const [errors, setErrors] = useState<ValueMap>({});
  const [submitted, setSubmitted] = useState<ValueMap | null>(null);

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, '');
    const decoded = hash ? decodeSchema(decodeURIComponent(hash)) : null;
    setSchema(decoded);
    if (decoded) setValues(seedVisible(decoded.fields));
    setLoaded(true);
  }, []);

  // IMP-005: Dynamic page title based on form name.
  useEffect(() => {
    if (!schema) return;
    const title = resolveTitle(schema.title).text;
    document.title = `${title} — Supremus Angel`;
    return () => {
      document.title = 'Supremus Angel — Dynamic Form Builder';
    };
  }, [schema]);

  const handleChange = useCallback((id: string, value: string) => {
    setValues((v) => ({ ...v, [id]: value }));
    setErrors((e) => {
      if (!e[id]) return e;
      const next = { ...e };
      delete next[id];
      return next;
    });
  }, []);

  const handleSubmit = useCallback(() => {
    if (!schema) return;
    const fieldsInOrder = answerable(schema.fields);
    const nextErrors: ValueMap = {};
    fieldsInOrder.forEach((f) => {
      const err = validateFieldAnswer(f, values[f.id] ?? '');
      if (err) nextErrors[f.id] = err;
    });
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      // Move focus to the first invalid field so the failure is never silent,
      // even when the offending field is scrolled off-screen (BUG-003/004).
      const firstInvalid = fieldsInOrder.find((f) => nextErrors[f.id]);
      if (firstInvalid) {
        requestAnimationFrame(() => {
          const el = document.getElementById(`fr-${firstInvalid.id}`);
          el?.focus();
          el?.scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
        });
      }
      return;
    }
    setErrors({});
    // Record the response locally (no backend — same-browser counts only).
    addResponse(schema.id, { ...values });
    setSubmitted({ ...values });
  }, [schema, values, reduceMotion]);

  const handleReset = useCallback(() => {
    if (!schema) return;
    setSubmitted(null);
    setValues(seedVisible(schema.fields));
    setErrors({});
  }, [schema]);

  // IMP-004: Loading skeleton while the URL hash is being parsed.
  if (!loaded) {
    return (
      <Page>
        <SkeletonCard>
          <SkeletonLine $w="55%" $h="28px" />
          <SkeletonLine $w="100%" />
          <SkeletonLine $w="100%" />
          <SkeletonLine $w="70%" />
          <SkeletonLine $w="38%" $h="40px" />
        </SkeletonCard>
      </Page>
    );
  }

  const cardMotion = {
    initial: reduceMotion ? false : { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduceMotion ? 0 : 0.25, ease: 'easeOut' as const },
  };

  const errorCount = Object.keys(errors).length;
  const titleText = schema ? resolveTitle(schema.title) : { text: '', isFallback: false };

  // IMP-006: Only show required-field hint when at least one field is required.
  const hasRequired = schema ? answerable(schema.fields).some((f) => f.required) : false;

  return (
    <Page>
      <Brand>
        <BrandMark aria-hidden>
          <BarChart3 size={16} />
        </BrandMark>
        <BrandName>Supremus Angel</BrandName>
      </Brand>

      {!schema ? (
        <Card {...cardMotion}>
          <Centered>
            <FileWarning size={40} aria-hidden />
            <Heading>Form unavailable</Heading>
            <p>This form link looks broken or empty. Ask the form owner for a fresh link.</p>
            <Button onClick={() => window.location.assign('/')}>Go to the builder</Button>
          </Centered>
        </Card>
      ) : submitted ? (
        <Card {...cardMotion}>
          <SuccessHead>
            <CheckCircle2 size={24} aria-hidden />
            Response recorded
          </SuccessHead>
          <Intro>Thanks for filling out &ldquo;{titleText.text}&rdquo;.</Intro>
          <SummaryList>
            {answerable(schema.fields).map((f) => (
              <SummaryRow key={f.id}>
                <SummaryKey>{f.label || f.name}</SummaryKey>
                <SummaryVal>{summaryValue(f, submitted[f.id] ?? '')}</SummaryVal>
              </SummaryRow>
            ))}
          </SummaryList>
          <SubmitRow>
            {/* IMP-008: Primary style for the submit-again button. */}
            <Button onClick={handleReset}>
              Submit another response
            </Button>
          </SubmitRow>
          {/* IMP-008: Attribution link. */}
          <Attribution>
            <a href="/">Powered by Supremus Angel</a>
          </Attribution>
        </Card>
      ) : (
        <Card {...cardMotion}>
          <Heading $placeholder={titleText.isFallback}>{titleText.text}</Heading>
          <FormRenderer
            fields={schema.fields}
            mode="fill"
            values={values}
            errors={errors}
            onChange={handleChange}
          />
          {errorCount > 0 && (
            <SubmitError role="alert" aria-live="assertive">
              <AlertCircle size={16} aria-hidden />
              Please fix {errorCount} highlighted field{errorCount === 1 ? '' : 's'} before
              submitting.
            </SubmitError>
          )}
          <SubmitRow>
            <Button onClick={handleSubmit}>
              <Send size={16} aria-hidden />
              Submit
            </Button>
            {/* IMP-006: Conditionally shown based on whether any fields are required. */}
            {hasRequired && <RequiredHint>* indicates a required field</RequiredHint>}
          </SubmitRow>
        </Card>
      )}
    </Page>
  );
}
