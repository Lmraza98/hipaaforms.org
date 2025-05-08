import { NextResponse } from 'next/server';
import { mockForms } from '../../../lib/forms';

// Set runtime for Vercel serverless functions
export const runtime = 'nodejs';

export async function GET() {
  let res;
  if (process.env.NODE_ENV === 'production') {
    res = NextResponse.json(mockForms);
    res.headers.set('Cache-Control', 'public, max-age=0, s-maxage=60'); 
  }
  else{
    res = NextResponse.json(mockForms);
    res.headers.set('Cache-Control', 'public, max-age=0, s-maxage=60'); 
  }
  return res;
}

// ─── AWS S3 implementation (commented out) ────────────────────────────────

// import { GetObjectCommand } from '@aws-sdk/client-s3';
// import { s3, BUCKET } from '@/lib/s3';

/*
export async function GET() {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET,
      Key: 'forms.json',
    });

    const response = await s3.send(command);
    const stream = response.Body;

    if (!stream) {
      return NextResponse.json({ error: 'Failed to fetch forms' }, { status: 500 });
    }

    // Convert stream to string (Node.js 18+)
    const bodyContents = await stream.transformToString();
    const forms = JSON.parse(bodyContents);

    const res = NextResponse.json(forms);
    res.headers.set('Cache-Control', 'public, s-maxage=3600'); // 1-hour cache
    return res;

  } catch (error) {
    console.error('Error fetching forms from S3:', error);
    return NextResponse.json({ error: 'Failed to fetch forms' }, { status: 500 });
  }
}
*/
