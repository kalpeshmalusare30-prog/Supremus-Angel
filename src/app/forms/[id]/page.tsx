import { AppShell } from '@/components/Shell';
import { FormResponses } from '@/components/FormResponses';

// Responses live in localStorage (client-only), so don't prerender.
export const dynamic = 'force-dynamic';

export default function FormResponsesPage({ params }: { params: { id: string } }) {
  return (
    <AppShell>
      <FormResponses id={params.id} />
    </AppShell>
  );
}
