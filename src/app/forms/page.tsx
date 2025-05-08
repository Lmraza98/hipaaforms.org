export const metadata = { title: 'Form Library – HIPAAForms.org' };
import FormsLibrary from './FormsLibrary.client';
import { mockForms } from '@/lib/forms';

export default async function FormsPage() {
  const forms = mockForms;
  return <FormsLibrary initialForms={forms} />;
} 