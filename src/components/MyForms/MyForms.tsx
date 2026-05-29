'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import {
  BarChart3,
  Check,
  ClipboardList,
  Copy,
  Download,
  ExternalLink,
  Files,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { encodeSchema } from '@/lib/schema';
import {
  deleteForm,
  duplicateForm,
  getResponses,
  responseCount,
  writeDraft,
  type SavedForm,
} from '@/lib/store';
import { downloadCsv } from '@/lib/csv';
import { useForms } from '@/hooks/useStore';
import { timeAgo } from '@/utils/time';
import { Button, Input, Modal } from '@/components/ui';
import {
  Action,
  Actions,
  Card,
  CardTop,
  ClearBtn,
  Code,
  ConfirmText,
  Count,
  Dot,
  Empty,
  EmptyHeading,
  EmptyIcon,
  FormName,
  Grid,
  Head,
  Meta,
  PageTitle,
  ResultCount,
  SearchWrap,
  SortSelect,
  Subtitle,
  TitleBlock,
  Toolbar,
} from './MyForms.styles';

type SortKey = 'newest' | 'oldest' | 'alpha' | 'responses';

function formUrl(form: SavedForm): string {
  const encoded = encodeSchema({ id: form.id, title: form.title, fields: form.fields });
  return `${window.location.origin}/form#${encoded}`;
}

/** "My Forms" dashboard: every form the user has published, with live response
 *  counts and per-form actions (edit, share, responses, export, duplicate, delete). */
export function MyForms() {
  const router = useRouter();
  const forms = useForms();
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortKey>('newest');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [exportedId, setExportedId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SavedForm | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // IMP-020: Keyboard shortcuts — N=new form, /=focus search, Escape=clear search.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const inInput =
        e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement;
      if (inInput) {
        if (e.key === 'Escape') {
          setQuery('');
          (e.target as HTMLElement).blur();
        }
        return;
      }
      if (e.key === 'n' || e.key === 'N') {
        router.push('/');
      } else if (e.key === '/') {
        e.preventDefault();
        searchRef.current?.focus();
      } else if (e.key === 'Escape') {
        setQuery('');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [router]);

  // IMP-010 + IMP-011: Filter by query, sort by chosen key.
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    let result = q ? forms.filter((f) => f.title.toLowerCase().includes(q)) : [...forms];
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => b.updatedAt - a.updatedAt);
        break;
      case 'oldest':
        result.sort((a, b) => a.updatedAt - b.updatedAt);
        break;
      case 'alpha':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'responses':
        result.sort((a, b) => responseCount(b.id) - responseCount(a.id));
        break;
    }
    return result;
  }, [forms, query, sortBy]);

  const handleEdit = (form: SavedForm) => {
    writeDraft({ id: form.id, title: form.title, fields: form.fields });
    router.push('/');
  };

  const handleCopy = async (form: SavedForm) => {
    try {
      await navigator.clipboard.writeText(formUrl(form));
      setCopiedId(form.id);
      window.setTimeout(() => setCopiedId((id) => (id === form.id ? null : id)), 2000);
    } catch {
      // Clipboard blocked — user can still open + copy from the address bar.
    }
  };

  // IMP-022: Copy the full form ID to clipboard.
  const handleCopyCode = useCallback(async (form: SavedForm) => {
    try {
      await navigator.clipboard.writeText(form.id);
      setCopiedCode(form.id);
      window.setTimeout(() => setCopiedCode((id) => (id === form.id ? null : id)), 2000);
    } catch {}
  }, []);

  // IMP-024: Show brief "Downloaded" confirmation after export.
  const handleExport = useCallback((form: SavedForm) => {
    downloadCsv(form, getResponses(form.id));
    setExportedId(form.id);
    window.setTimeout(() => setExportedId((id) => (id === form.id ? null : id)), 2000);
  }, []);

  const confirmDelete = () => {
    if (deleteTarget) deleteForm(deleteTarget.id);
    setDeleteTarget(null);
  };

  return (
    <>
      <Head>
        <TitleBlock>
          <PageTitle>My forms</PageTitle>
          <Subtitle>Every form you've published, with responses collected on this device.</Subtitle>
        </TitleBlock>
        <Button onClick={() => router.push('/')} title="New form (N)">
          <Plus size={20} aria-hidden />
          New form
        </Button>
      </Head>

      {forms.length > 0 && (
        <Toolbar>
          {/* IMP-010: Search with clear button and result count. */}
          <SearchWrap>
            <Search size={16} aria-hidden />
            <Input
              ref={searchRef}
              value={query}
              placeholder="Search forms… (press /)"
              aria-label="Search forms"
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') setQuery('');
              }}
            />
            {query && (
              <ClearBtn
                onClick={() => {
                  setQuery('');
                  searchRef.current?.focus();
                }}
                aria-label="Clear search"
              >
                <X size={14} aria-hidden />
              </ClearBtn>
            )}
          </SearchWrap>

          {/* IMP-010: Result count display. */}
          <ResultCount aria-live="polite">
            {query
              ? `${visible.length} of ${forms.length} forms`
              : `${forms.length} form${forms.length === 1 ? '' : 's'}`}
          </ResultCount>

          {/* IMP-011: Sort selector. */}
          <SortSelect
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortKey)}
            aria-label="Sort forms"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="alpha">A → Z</option>
            <option value="responses">Most responses</option>
          </SortSelect>
        </Toolbar>
      )}

      {forms.length === 0 ? (
        <Empty>
          <EmptyIcon aria-hidden>
            <ClipboardList size={28} />
          </EmptyIcon>
          <EmptyHeading>No forms yet</EmptyHeading>
          <Subtitle>Build a form and hit "Publish" — it'll show up here with its responses.</Subtitle>
          <Button onClick={() => router.push('/')}>
            <Plus size={20} aria-hidden />
            Create your first form
          </Button>
        </Empty>
      ) : visible.length === 0 ? (
        <Empty>
          <EmptyHeading>No forms match "{query}".</EmptyHeading>
        </Empty>
      ) : (
        <Grid>
          <AnimatePresence initial={false}>
            {visible.map((form) => {
              const count = responseCount(form.id);
              const isModified = form.updatedAt !== form.createdAt;
              return (
                <Card
                  key={form.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                >
                  <CardTop>
                    <FormName onClick={() => router.push(`/forms/${form.id}`)} title={form.title}>
                      {form.title}
                    </FormName>
                    <Meta>
                      {/* IMP-023: Relative time with absolute timestamp on hover. */}
                      <span title={new Date(form.createdAt).toLocaleString()}>
                        {timeAgo(form.createdAt)}
                      </span>
                      {isModified && (
                        <>
                          <Dot>·</Dot>
                          {/* IMP-013: Show last-modified relative time. */}
                          <span title={`Updated: ${new Date(form.updatedAt).toLocaleString()}`}>
                            edited {timeAgo(form.updatedAt)}
                          </span>
                        </>
                      )}
                      <Dot>·</Dot>
                      {/* IMP-022: Click form ID badge to copy full ID. */}
                      <Code
                        as="button"
                        onClick={() => handleCopyCode(form)}
                        title={
                          copiedCode === form.id
                            ? 'Copied!'
                            : `Form ID: ${form.id} — click to copy`
                        }
                        aria-label={`Copy form ID ${form.id}`}
                      >
                        {copiedCode === form.id ? '✓ copied' : `#${form.id.slice(0, 6)}`}
                      </Code>
                      <Dot>·</Dot>
                      <span>
                        {form.fields.length} field{form.fields.length === 1 ? '' : 's'}
                      </span>
                      <Dot>·</Dot>
                      {/* IMP-019: Response count navigates to responses page. */}
                      <Count
                        as="button"
                        onClick={() => router.push(`/forms/${form.id}`)}
                        title="View responses"
                        aria-label={`${count} response${count === 1 ? '' : 's'} — view details`}
                      >
                        <BarChart3 size={12} aria-hidden />
                        {count} response{count === 1 ? '' : 's'}
                      </Count>
                    </Meta>
                  </CardTop>

                  <Actions>
                    <Action onClick={() => handleEdit(form)}>
                      <Pencil size={14} aria-hidden />
                      Edit
                    </Action>
                    <Action onClick={() => router.push(`/forms/${form.id}`)}>
                      <BarChart3 size={14} aria-hidden />
                      Responses
                    </Action>
                    <Action onClick={() => handleCopy(form)}>
                      {copiedId === form.id ? <Check size={14} aria-hidden /> : <Copy size={14} aria-hidden />}
                      {copiedId === form.id ? 'Copied' : 'Copy link'}
                    </Action>
                    <Action onClick={() => window.open(formUrl(form), '_blank', 'noopener,noreferrer')}>
                      <ExternalLink size={14} aria-hidden />
                      Open
                    </Action>
                    {/* IMP-024: Show "Downloaded" feedback after export. */}
                    <Action
                      onClick={() => handleExport(form)}
                      title={count === 0 ? 'No responses yet — exports headers only' : 'Download responses as CSV'}
                    >
                      {exportedId === form.id ? <Check size={14} aria-hidden /> : <Download size={14} aria-hidden />}
                      {exportedId === form.id ? 'Downloaded' : 'Export'}
                    </Action>
                    <Action onClick={() => duplicateForm(form.id)}>
                      <Files size={14} aria-hidden />
                      Duplicate
                    </Action>
                    <Action $danger onClick={() => setDeleteTarget(form)}>
                      <Trash2 size={14} aria-hidden />
                      Delete
                    </Action>
                  </Actions>
                </Card>
              );
            })}
          </AnimatePresence>
        </Grid>
      )}

      <Modal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Delete this form?"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={confirmDelete}>
              <Trash2 size={16} aria-hidden />
              Delete form
            </Button>
          </>
        }
      >
        <ConfirmText>
          "{deleteTarget?.title}" and its{' '}
          {deleteTarget ? responseCount(deleteTarget.id) : 0} response(s) will be permanently
          removed from this browser. This action cannot be undone.
        </ConfirmText>
      </Modal>
    </>
  );
}
