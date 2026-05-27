'use client';

import React, { useMemo, useState } from 'react';
import { ArrowLeft, Check, Copy, Download, ExternalLink, Inbox } from 'lucide-react';
import type { FormField } from '@/types/field';
import { encodeSchema } from '@/lib/schema';
import { downloadCsv } from '@/lib/csv';
import { summarizeField, type FieldSummary } from '@/lib/stats';
import { useFormWithResponses } from '@/hooks/useStore';
import { formatDisplayValue, linkHref } from '@/utils/format';
import { parseList } from '@/utils/list';
import { Button } from '@/components/ui';
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
  Muted,
  NumericRow,
  Sample,
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
              “{s}”
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

  const visible = useMemo(() => form?.fields.filter((f) => !f.hidden) ?? [], [form]);
  // Newest first.
  const rows = useMemo(() => [...responses].reverse(), [responses]);

  if (!loaded) return null;

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
          <Button
            size="sm"
            variant="secondary"
            onClick={() => window.open(shareUrl(form), '_blank', 'noopener,noreferrer')}
          >
            <ExternalLink size={16} aria-hidden />
            Open
          </Button>
          <Button size="sm" onClick={() => downloadCsv(form, responses)} disabled={responses.length === 0}>
            <Download size={16} aria-hidden />
            Export CSV
          </Button>
        </HeadActions>
      </Head>

      {responses.length === 0 ? (
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
          <Tabs role="tablist">
            <Tab role="tab" aria-selected={view === 'table'} $active={view === 'table'} onClick={() => setView('table')}>
              Responses
            </Tab>
            <Tab role="tab" aria-selected={view === 'summary'} $active={view === 'summary'} onClick={() => setView('summary')}>
              Summary
            </Tab>
          </Tabs>

          {view === 'table' ? (
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
          )}
        </>
      )}
    </>
  );
}
