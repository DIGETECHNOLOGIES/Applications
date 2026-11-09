import { NextResponse } from 'next/server';
import { ValidationError } from 'yup';
import { applicationSchema } from '@/lib/validation';
import { normalizeWhatsApp } from '@/lib/phone';
import { insertApplication } from '@/lib/applications';

export const runtime = 'nodejs';

// Best-effort limiter (per server instance): 8 submissions per IP per 10 minutes.
const hits = new Map<string, number[]>();
function tooMany(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60 * 1000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 8;
}

export async function POST(req: Request) {
  if (process.env.APPLICATIONS_OPEN === 'false') {
    return NextResponse.json({ error: 'Applications are now closed.' }, { status: 403 });
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (tooMany(ip)) {
    return NextResponse.json({ error: 'Too many attempts. Please wait a few minutes and try again.' }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  // Honeypot: bots fill hidden fields. Pretend success and store nothing.
  if (typeof (body as { website?: unknown })?.website === 'string' && (body as { website: string }).website.trim() !== '') {
    return NextResponse.json({ ok: true });
  }

  let data;
  try {
    data = await applicationSchema.validate(body, { abortEarly: false, stripUnknown: true });
  } catch (err) {
    if (err instanceof ValidationError) {
      const errors: Record<string, string> = {};
      for (const inner of err.inner) {
        if (inner.path && !errors[inner.path]) errors[inner.path] = inner.message;
      }
      return NextResponse.json({ error: 'Please check the highlighted fields.', errors }, { status: 422 });
    }
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const whatsapp = normalizeWhatsApp(data.whatsapp)!;

  try {
    await insertApplication({
      fullName: data.fullName,
      email: data.email.toLowerCase(),
      whatsapp,
      school: data.school,
      department: data.department,
      yearOfStudy: data.yearOfStudy === '1' ? 1 : 2,
      knowsAboutKash: data.knowsAboutKash,
      improvements: data.improvements,
      contribution: data.contribution,
      learning: data.learning,
    });
    return NextResponse.json({ ok: true, whatsapp });
  } catch (err) {
    const e = err as { code?: string; message?: string };
    if (e?.code === '23505') {
      return NextResponse.json({ error: 'An application with this email has already been submitted.' }, { status: 409 });
    }
    if (e?.message?.includes('DATABASE_URL')) {
      console.error('Application form is not configured:', e.message);
      return NextResponse.json({ error: 'The application form is not available yet. Please try again later.' }, { status: 503 });
    }
    console.error('Failed to save application:', err);
    return NextResponse.json({ error: 'Something went wrong while saving your application. Please try again.' }, { status: 500 });
  }
}
