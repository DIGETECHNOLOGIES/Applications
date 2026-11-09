import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/auth';
import { listApplications } from '@/lib/applications';
import { applyFilters } from '@/lib/filters';
import { toCsv } from '@/lib/csv';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Not authorised' }, { status: 401 });

  const url = new URL(req.url);
  try {
    const rows = applyFilters(await listApplications(), {
      year: url.searchParams.get('year') ?? undefined,
      status: url.searchParams.get('status') ?? undefined,
      q: url.searchParams.get('q') ?? undefined,
    });
    const stamp = new Date().toISOString().slice(0, 10);
    return new NextResponse(toCsv(rows), {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="digetech-applications-${stamp}.csv"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    console.error('Export failed:', err);
    return NextResponse.json({ error: 'Could not load applications.' }, { status: 500 });
  }
}
