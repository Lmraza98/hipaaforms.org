import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const mockForms = [
  { slug: 'patient-intake', name: 'Patient Intake', type: 'Intake', specialty: 'General', price: 'free' },
  { slug: 'telehealth-consent', name: 'Telehealth Consent', type: 'Consent', specialty: 'Telehealth', price: 'pro' },
  { slug: 'hipaa-authorization', name: 'HIPAA Authorization', type: 'Authorization', specialty: 'General', price: 'free' },
  { slug: 'medical-records-release', name: 'Medical Records Release', type: 'Release', specialty: 'General', price: 'pro' },
  { slug: 'mental-health-assessment', name: 'Mental Health Assessment', type: 'Assessment', specialty: 'Mental Health', price: 'pro' },
];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const form = mockForms.find(form => form.slug === slug);

    if (!form) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 });
    }

    const res = NextResponse.json({
      message: 'Development mode - download simulation',
      form,
      downloadUrl: `/mock-downloads/${slug}.pdf`,
    });

    res.headers.set('Cache-Control', 'public, max-age=0, s-maxage=60');

    return res;

  } catch (error) {
    console.error(`Error handling request for form ${params ? JSON.stringify(await params) : ''}:`, error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
