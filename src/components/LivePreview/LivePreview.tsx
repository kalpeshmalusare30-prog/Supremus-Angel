'use client';

import { useMemo } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { CheckCircle2, EyeOff } from 'lucide-react';
import type { FormField } from '@/types/field';
import { hasContent, isNumeric } from '@/utils/format';
import { DataCard } from './DataCard';
import { DataChart } from './DataChart';
import {
  ChartCard,
  ChartTitle,
  Dot,
  EmptyState,
  Grid,
  HeaderRow,
  Section,
  SubmittedNote,
  Title,
} from './LivePreview.styles';

export interface LivePreviewProps {
  fields: FormField[];
  lastSubmittedAt: number | null;
}

/** Read-only render of the current form data (TRD §7.3). */
export function LivePreview({ fields, lastSubmittedAt }: LivePreviewProps) {
  const reduceMotion = useReducedMotion();
  const visible = useMemo(() => fields.filter(hasContent), [fields]);
  const numericCount = useMemo(() => fields.filter(isNumeric).length, [fields]);
  const submitted = lastSubmittedAt != null;

  return (
    <Section aria-live="polite" aria-label="Live preview">
      <HeaderRow>
        <Dot aria-hidden />
        <Title>Live preview</Title>
      </HeaderRow>

      {submitted && (
        <SubmittedNote role="status">
          <CheckCircle2 size={16} aria-hidden />
          Submitted — preview updated below.
        </SubmittedNote>
      )}

      {visible.length === 0 ? (
        <EmptyState>
          <EyeOff size={40} aria-hidden />
          <p>Your data will appear here as you type.</p>
        </EmptyState>
      ) : (
        <>
          <Grid>
            <AnimatePresence initial={false}>
              {visible.map((field) => (
                <motion.div
                  key={field.id}
                  layout={!reduceMotion}
                  initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
                  transition={{ duration: reduceMotion ? 0 : 0.2, ease: 'easeOut' }}
                >
                  <DataCard field={field} submitted={submitted} />
                </motion.div>
              ))}
            </AnimatePresence>
          </Grid>

          {numericCount >= 2 && (
            <ChartCard>
              <ChartTitle>Numeric distribution</ChartTitle>
              <DataChart fields={fields} />
            </ChartCard>
          )}
        </>
      )}
    </Section>
  );
}
