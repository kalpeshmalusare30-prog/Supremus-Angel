import { FillForm } from '@/components/FillForm';

// The schema travels in the URL hash, which is only available client-side,
// so this route renders nothing meaningful to prerender.
export const dynamic = 'force-dynamic';

export default function FormFillPage() {
  return <FillForm />;
}
