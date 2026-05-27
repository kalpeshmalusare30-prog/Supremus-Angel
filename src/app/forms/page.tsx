import { AppShell } from '@/components/Shell';
import { MyForms } from '@/components/MyForms';

// Forms + responses live in localStorage (client-only), so don't prerender.
export const dynamic = 'force-dynamic';

export default function FormsPage() {
  return (
    <AppShell>
      <MyForms />
    </AppShell>
  );
}
