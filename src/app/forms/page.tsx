import type { Metadata } from 'next';
import { AppShell } from '@/components/Shell';
import { MyForms } from '@/components/MyForms';

// Forms + responses live in localStorage (client-only), so don't prerender.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'My Forms — Supremus Angel',
};

export default function FormsPage() {
  return (
    <AppShell>
      <MyForms />
    </AppShell>
  );
}
