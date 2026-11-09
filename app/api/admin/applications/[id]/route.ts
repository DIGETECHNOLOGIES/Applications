import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/auth';
import { setApplicationStatus } from '@/lib/applications';
import { STATUSES, type Status } from '@/lib/constants';

export const runtime = 'nodejs';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Not authorised' }, { status: 401 });

  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isInteger(numericId) || numericId < 1) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }

  let status: unknown;
  try {
    status = ((await req.json()) as { status?: unknown }).status;
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
  if (typeof status !== 'string' || !(STATUSES as readonly string[]).includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  try {
    const ok = await setApplicationStatus(numericId, status as Status);
    return ok ? NextResponse.json({ ok: true }) : NextResponse.json({ error: 'Not found' }, { status: 404 });
  } catch (err) {
    console.error('Status update failed:', err);
    return NextResponse.json({ error: 'Could not update status.' }, { status: 500 });
  }
}
