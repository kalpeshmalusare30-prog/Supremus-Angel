'use client';

import { useMemo, useState } from 'react';
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
import { Button, Input, Modal } from '@/components/ui';
import {
  Action,
  Actions,
  Card,
  CardTop,
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
  SearchWrap,
  Subtitle,
  TitleBlock,
  Toolbar,
} from './MyForms.styles';

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
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SavedForm | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? forms.filter((f) => f.title.toLowerCase().includes(q)) : forms;
  }, [forms, query]);

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

  const confirmDelete = () => {
    if (deleteTarget) deleteForm(deleteTarget.id);
    setDeleteTarget(null);
  };

  return (
    <>
      <Head>
        <TitleBlock>
          <PageTitle>My forms</PageTitle>
          <Subtitle>Every form you’ve published, with responses collected on this device.</Subtitle>
        </TitleBlock>
        <Button onClick={() => router.push('/')}>
          <Plus size={20} aria-hidden />
          New form
        </Button>
      </Head>

      {forms.length > 0 && (
        <Toolbar>
          <SearchWrap>
            <Search size={16} aria-hidden />
            <Input
              value={query}
              placeholder="Search forms…"
              aria-label="Search forms"
              onChange={(e) => setQuery(e.target.value)}
            />
          </SearchWrap>
        </Toolbar>
      )}

      {forms.length === 0 ? (
        <Empty>
          <EmptyIcon aria-hidden>
            <ClipboardList size={28} />
          </EmptyIcon>
          <EmptyHeading>No forms yet</EmptyHeading>
          <Subtitle>Build a form and hit “Publish” — it’ll show up here with its responses.</Subtitle>
          <Button onClick={() => router.push('/')}>
            <Plus size={20} aria-hidden />
            Create your first form
          </Button>
        </Empty>
      ) : filtered.length === 0 ? (
        <Empty>
          <EmptyHeading>No forms match “{query}”.</EmptyHeading>
        </Empty>
      ) : (
        <Grid>
          <AnimatePresence initial={false}>
            {filtered.map((form) => {
              const count = responseCount(form.id);
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
                      <span title={new Date(form.createdAt).toLocaleString()}>
                        {new Date(form.createdAt).toLocaleString()}
                      </span>
                      <Dot>·</Dot>
                      {/* Short code disambiguates same-named forms (BUG-010). */}
                      <Code title={`Form id: ${form.id}`}>#{form.id.slice(0, 6)}</Code>
                      <Dot>·</Dot>
                      <span>
                        {form.fields.length} field{form.fields.length === 1 ? '' : 's'}
                      </span>
                      <Dot>·</Dot>
                      <Count>
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
                    <Action
                      onClick={() => downloadCsv(form, getResponses(form.id))}
                      title={count === 0 ? 'No responses yet — exports headers only' : 'Download responses as CSV'}
                    >
                      <Download size={14} aria-hidden />
                      Export
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
          “{deleteTarget?.title}” and its{' '}
          {deleteTarget ? responseCount(deleteTarget.id) : 0} response(s) will be permanently
          removed from this browser. This action cannot be undone.
        </ConfirmText>
      </Modal>
    </>
  );
}
