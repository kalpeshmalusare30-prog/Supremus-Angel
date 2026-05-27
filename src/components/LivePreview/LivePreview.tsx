'use client';

import React from 'react';
import type { FormField } from '@/types/field';
import { resolveTitle } from '@/utils/title';
import { FormRenderer } from '@/components/FormRenderer';
import { Dot, FormFrame, FormTitle, HeaderRow, Section, Title } from './LivePreview.styles';

export interface LivePreviewProps {
  title: string;
  fields: FormField[];
}

/** Live, realistic render of the form being built (how respondents will see it). */
export function LivePreview({ title, fields }: LivePreviewProps) {
  // Reflect the actual title; an empty one shows a muted placeholder, never
  // the placeholder text dressed up as real content (BUG-001).
  const { text, isFallback } = resolveTitle(title);
  return (
    <Section aria-label="Live preview">
      <HeaderRow>
        <Dot aria-hidden />
        <Title>Live preview</Title>
      </HeaderRow>

      <FormFrame>
        <FormTitle $placeholder={isFallback}>{text}</FormTitle>
        <FormRenderer fields={fields} mode="preview" />
      </FormFrame>
    </Section>
  );
}
