'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Check, Copy, Download, ExternalLink, Eye, Inbox } from 'lucide-react';
import type { FormField } from '@/types/field';
import { encodeSchema } from '@/lib/schema';
import { downloadCsv } from '@/lib/csv';
import { summarizeField, type FieldSummary } from '@/lib/stats';
import { useFormWithResponses } from '@/hooks/useStore';
import { formatDisplayValue, linkHref } from '@/utils/format';
import { parseList } from '@/utils/list';
import { Button, Modal } from '@/components/ui';
import { FormRenderer } from '@/components/FormRenderer';
import type { SavedForm } from '@/lib/store';
import {
  Back,
  BarCount,
  BarFill,
  BarLabel,
  BarRow,
  BarTrack,
  Empty,
  EmptyHeading,
  EmptyIcon,
  Head,
  HeadActions,
  Meta,
  MobileCard,
  MobileField,
  MobileLabel,
  MobileTime,
  MobileValue,
  Muted,
  NumericRow,
  Sample,
  SkeletonCard,
  SkeletonLine,
  StatCard,
  StatHead,
  StatLabel,
  SummaryGrid,
  Tab,
  Table,
  Tabs,
  TableWrap,
  Td,
  Th,
  TimeCell,
  Title,
  TitleBlock,
  TypeBadge,
} from './FormResponses.styles';

const MULTI = new Set<FormField['type']>(['checkboxes', 'multiselect', 'tags']);

function shareUrl(form: SavedForm): string {
  const encoded = encodeSchema({ id: form.id, title: form.title, fields: form.fields });
  return `${window.location.origin}/form#${encoded}`;
}

/** One answer rendered for the responses table. */
function cellNode(field: FormField, raw: string): React.ReactNode {
  if (!raw || !raw.trim()) return '—';
  if (field.type === 'image' || field.type === 'file') return '[attachment]';
  if (MULTI.has(field.type)) {
    const items = parseList(raw);
    return items.length ? items.join(', ') : '—';
  }
  const text = formatDisplayValue(field.type, raw);
  const href = linkHref(field.type, raw);
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {text}
    </a>
  ) : (
    text
  );
}

const round = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(2));

function Summary({ summary }: { summary: FieldSummary }) {
  switch (summary.kind) {
    case 'numeric':
      return (
        <>
          <NumericRow>
            <span>
              avg <b>{round(summary.avg)}</b>
            </span>
            <span>min {round(summary.min)}</span>
            <span>max {round(summary.max)}</span>
          </NumericRow>
          <Muted>
            {summary.count} of {summary.total} answered
          </Muted>
        </>
      );
    case 'distribution': {
      const max = Math.max(...summary.items.map((i) => i.count), 1);
      return (
        <>
          {summary.items.map((item) => (
            <BarRow key={item.label}>
              <BarLabel title={item.label}>{item.label}</BarLabel>
              <BarTrack>
                <BarFill $pct={Math.round((item.count / max) * 100)} />
              </BarTrack>
              <BarCount>{item.count}</BarCount>
            </BarRow>
          ))}
          <Muted>
            {summary.count} of {summary.total} answered
          </Muted>
        </>
      );
    }
    case 'text':
      return (
        <>
          <Muted>
            {summary.count} of {summary.total} answered
          </Muted>
          {summary.samples.map((s, i) => (
            <Sample key={i} title={s}>
              &ldquo;{s}&rdquo;
            </Sample>
          ))}
        </>
      );
    case 'empty':
    default:
      return <Muted>No responses yet.</Muted>;
  }
}

/** Per-form detail: responses table + per-field summary stats, with export. */
export function FormResponses({ id }: { id: string }) {
  const { form, responses, loaded } = useFormWithResponses(id);
  const [view, setView] = useState<'table' | 'summary'>('table');
  const [copied, setCopied] = useState(false);
  const [exported, setExported] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const visible = useMemo(() => form?.fields.filter((f) => !f.hidden) ?? [], [form]);
  // Newest first.
  const rows = useMemo(() => [...responses].reverse(), [responses]);

  // IMP-005: Dynamic page title based on form name.
  useEffect(() => {
    if (!form) return;
    document.title = `${form.title} — Responses — Supremus Angel`;
    return () => {
      document.title = 'Supremus Angel — Dynamic Form Builder';
    };
  }, [form]);

  // IMP-004: Skeleton while loading from localStorage.
  if (!loaded) {
    return (
      <>
        <SkeletonCard>
          <SkeletonLine $w="40%" $h="28px" />
          <SkeletonLine $w="25%" />
        </SkeletonCard>
        <SkeletonCard style={{ marginTop: '16px' }}>
          {[1, 2, 3].map((i) => (
            <SkeletonLine key={i} $w={`${80 - i * 10}%`} />
          ))}
        </SkeletonCard>
      </>
    );
  }

  if (!form) {
    return (
      <Empty>
        <EmptyIcon aria-hidden>
          <Inbox size={28} />
        </EmptyIcon>
        <EmptyHeading>Form not found</EmptyHeading>
        <Muted>It may have been deleted from this browser.</Muted>
        <Button onClick={() => window.location.assign('/forms')}>Back to My forms</Button>
      </Empty>
    );
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl(form));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked — Open still works.
    }
  };

  // IMP-024: Export with brief confirmation feedback.
  const handleExport = () => {
    downloadCsv(form, responses);
    setExported(true);
    window.setTimeout(() => setExported(false), 2000);
  };

  return (
    <>
      <Back href="/forms">
        <ArrowLeft size={16} aria-hidden />
        My forms
      </Back>

      <Head>
        <TitleBlock>
          <Title>{form.title}</Title>
          <Meta>
            <span>{responses.length} response{responses.length === 1 ? '' : 's'}</span>
            <span>·</span>
            <span>
              {visible.length} field{visible.length === 1 ? '' : 's'}
            </span>
            <span>·</span>
            <span>created {new Date(form.createdAt).toLocaleDateString()}</span>
          </Meta>
        </TitleBlock>
        <HeadActions>
          <Button size="sm" variant="secondary" onClick={copyLink}>
            {copied ? <Check size={16} aria-hidden /> : <Copy size={16} aria-hidden />}
            {copied ? 'Copied' : 'Copy link'}
          </Button>
          {/* IMP-015: Preview form in a modal. */}
          <Button size="sm" variant="secondary" onClick={() => setPreviewOpen(true)}>
            <Eye size={16} aria-hidden />
            Preview
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => window.open(shareUrl(form), '_blank', 'noopener,noreferrer')}
          >
            <ExternalLink size={16} aria-hidden />
            Open
          </Button>
          {/* IMP-024: Download CSV with "Downloaded" confirmation. */}
          <Button size="sm" onClick={handleExport} disabled={responses.length === 0}>
            {exported ? <Check size={16} aria-hidden /> : <Download size={16} aria-hidden />}
            {exported ? 'Downloaded' : 'Export CSV'}
          </Button>
        </HeadActions>
      </Head>

      {/* IMP-021: Always show tabs; move 0-response empty state inside the table panel. */}
      <Tabs role="tablist">
        <Tab role="tab" aria-selected={view === 'table'} $active={view === 'table'} onClick={() => setView('table')}>
          Responses
        </Tab>
        <Tab role="tab" aria-selected={view === 'summary'} $active={view === 'summary'} onClick={() => setView('summary')}>
          Summary
        </Tab>
      </Tabs>

      {view === 'table' ? (
        responses.length === 0 ? (
          <Empty>
            <EmptyIcon aria-hidden>
              <Inbox size={28} />
            </EmptyIcon>
            <EmptyHeading>No responses yet</EmptyHeading>
            <Muted>Share the link and responses filled on this browser will appear here.</Muted>
            <Button onClick={copyLink}>
              {copied ? <Check size={16} aria-hidden /> : <Copy size={16} aria-hidden />}
              {copied ? 'Link copied' : 'Copy share link'}
            </Button>
          </Empty>
        ) : (
          <>
            {/* Desktop table */}
            <TableWrap>
              <Table>
                <thead>
                  <tr>
                    <Th>Submitted</Th>
                    {visible.map((f) => (
                      <Th key={f.id}>{f.label || f.name}</Th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((sub) => (
                    <tr key={sub.id}>
                      <TimeCell>{new Date(sub.submittedAt).toLocaleString()}</TimeCell>
                      {visible.map((f) => (
                        <Td key={f.id}>{cellNode(f, sub.answers[f.id] ?? '')}</Td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </Table>
            </TableWrap>

            {/* IMP-012: Mobile card layout — one card per response. */}
            {rows.map((sub) => (
              <MobileCard key={sub.id}>
                <MobileTime>{new Date(sub.submittedAt).toLocaleString()}</MobileTime>
                {visible.map((f) => (
                  <MobileField key={f.id}>
                    <MobileLabel>{f.label || f.name}</MobileLabel>
                    <MobileValue>{cellNode(f, sub.answers[f.id] ?? '')}</MobileValue>
                  </MobileField>
                ))}
              </MobileCard>
            ))}
          </>
        )
      ) : (
        // Summary tab
        responses.length === 0 ? (
          <Empty>
            <EmptyIcon aria-hidden>
              <Inbox size={28} />
            </EmptyIcon>
            <EmptyHeading>No responses yet</EmptyHeading>
            <Muted>Share your form link to start collecting data. Summary stats will appear here.</Muted>
            <Button onClick={copyLink}>
              {copied ? <Check size={16} aria-hidden /> : <Copy size={16} aria-hidden />}
              {copied ? 'Link copied' : 'Copy share link'}
            </Button>
          </Empty>
        ) : (
          <SummaryGrid>
            {visible.map((f) => (
              <StatCard key={f.id}>
                <StatHead>
                  <StatLabel title={f.label || f.name}>{f.label || f.name}</StatLabel>
                  <TypeBadge>{f.type}</TypeBadge>
                </StatHead>
                <Summary summary={summarizeField(f, responses)} />
              </StatCard>
            ))}
          </SummaryGrid>
        )
      )}

      {/* IMP-015: Form preview modal. */}
      <Modal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title={`Preview: ${form.title}`}
        size="lg"
      >
        <FormRenderer
          fields={form.fields}
          mode="preview"
          values={{}}
          errors={{}}
          onChange={() => {}}
        />
      </Modal>
    </>
  );
}
