import Link from 'next/link';
import { redirect } from 'next/navigation';
import { AlertCircle, Download, MessageCircle, Search, Mail } from 'lucide-react';
import { isAdmin } from '@/lib/auth';
import { listApplications, type ApplicationRow } from '@/lib/applications';
import { applyFilters, type Filters } from '@/lib/filters';
import { STATUSES, TOTAL_SPOTS } from '@/lib/constants';
import { StatusSelect } from '@/components/StatusSelect';
import { LogoutButton } from '@/components/LogoutButton';
import { cn } from '@/lib/utils';

export const dynamic = 'force-dynamic';

const fmt = new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Africa/Douala' });

function href(f: Filters, patch: Partial<Filters>) {
  const next = { ...f, ...patch };
  const p = new URLSearchParams();
  if (next.year) p.set('year', next.year);
  if (next.status) p.set('status', next.status);
  if (next.q) p.set('q', next.q);
  const s = p.toString();
  return s ? `/admin?${s}` : '/admin';
}

function Pill({ active, to, children }: { active: boolean; to: string; children: React.ReactNode }) {
  return (
    <Link
      href={to}
      className={cn(
        'rounded-full border px-4 py-1.5 text-xs font-bold capitalize transition-all',
        active ? 'border-primary bg-primary text-white' : 'border-border bg-surface hover:border-primary/40',
      )}
    >
      {children}
    </Link>
  );
}

function Qa({ q, a }: { q: string; a: string }) {
  return (
    <div>
      <p className="text-[11px] font-black uppercase tracking-widest text-primary-dark">{q}</p>
      <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed">{a}</p>
    </div>
  );
}

export default async function AdminPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  if (!(await isAdmin())) redirect('/admin/login');

  const sp = await searchParams;
  const filters: Filters = { year: sp.year, status: sp.status, q: sp.q };

  let all: ApplicationRow[] = [];
  let loadError: string | null = null;
  try {
    all = await listApplications();
  } catch (err) {
    console.error('Could not load applications:', err);
    loadError =
      err instanceof Error && err.message.includes('DATABASE_URL')
        ? 'The database is not connected yet. Add DATABASE_URL in your Vercel environment variables and redeploy.'
        : 'Could not load applications from the database. Please refresh in a moment.';
  }

  const rows = applyFilters(all, filters);
  const count = (fn: (r: ApplicationRow) => boolean) => all.filter(fn).length;
  const stats = [
    { label: 'Total applications', value: all.length },
    { label: 'Year 1', value: count((r) => r.yearOfStudy === 1) },
    { label: 'Year 2', value: count((r) => r.yearOfStudy === 2) },
    { label: `Selected (of ${TOTAL_SPOTS})`, value: count((r) => r.status === 'selected') },
  ];
  const exportParams = new URLSearchParams();
  if (filters.year) exportParams.set('year', filters.year);
  if (filters.status) exportParams.set('status', filters.status);
  if (filters.q) exportParams.set('q', filters.q);

  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 pt-6 sm:px-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="" className="h-9 w-9 object-contain" />
          <div className="leading-tight">
            <p className="text-xl font-black italic tracking-tighter text-primary">DIGETECH</p>
            <p className="text-[11px] font-bold uppercase tracking-widest text-text-secondary">Volunteer applications</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={`/api/admin/export${exportParams.toString() ? `?${exportParams}` : ''}`}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-white shadow-md transition-all hover:bg-primary-dark active:scale-95"
          >
            <Download className="h-4 w-4" /> Export CSV
          </a>
          <LogoutButton />
        </div>
      </header>

      {loadError && (
        <div className="mt-6 flex items-start gap-2 rounded-2xl border border-error/20 bg-error/10 p-4 text-sm text-error">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {loadError}
        </div>
      )}

      <section className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-surface p-4">
            <p className="text-3xl font-extrabold text-primary-dark">{s.value}</p>
            <p className="mt-1 text-xs font-medium text-text-secondary">{s.label}</p>
          </div>
        ))}
      </section>

      <section className="mt-6 space-y-3">
        <form action="/admin" className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
          {filters.year && <input type="hidden" name="year" value={filters.year} />}
          {filters.status && <input type="hidden" name="status" value={filters.status} />}
          <input
            name="q"
            defaultValue={filters.q}
            placeholder="Search name, email, school, department..."
            className="field h-11 pl-11"
          />
        </form>
        <div className="flex flex-wrap items-center gap-2">
          <Pill active={!filters.year} to={href(filters, { year: undefined })}>All years</Pill>
          <Pill active={filters.year === '1'} to={href(filters, { year: '1' })}>Year 1</Pill>
          <Pill active={filters.year === '2'} to={href(filters, { year: '2' })}>Year 2</Pill>
          <span className="mx-1 h-5 w-px bg-border" />
          <Pill active={!filters.status} to={href(filters, { status: undefined })}>Any status</Pill>
          {STATUSES.map((s) => (
            <Pill key={s} active={filters.status === s} to={href(filters, { status: s })}>{s}</Pill>
          ))}
        </div>
        <p className="text-xs text-text-secondary">
          Showing {rows.length} of {all.length} application{all.length === 1 ? '' : 's'}
        </p>
      </section>

      <section className="mt-4 space-y-3">
        {rows.length === 0 && !loadError && (
          <div className="rounded-2xl border border-dashed border-border bg-surface p-10 text-center text-sm text-text-secondary">
            {all.length === 0 ? 'No applications yet. They will appear here as soon as someone applies.' : 'No applications match these filters.'}
          </div>
        )}

        {rows.map((r) => (
          <article key={r.id} className="rounded-2xl border border-border bg-surface p-4 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-extrabold leading-tight">{r.fullName}</h2>
                <p className="mt-0.5 text-xs text-text-secondary">
                  {r.school} · {r.department} · <span className="font-bold text-text">Year {r.yearOfStudy}</span>
                </p>
                <p className="mt-0.5 text-[11px] text-text-secondary">Applied {fmt.format(new Date(r.createdAt))}</p>
              </div>
              <StatusSelect id={r.id} status={r.status} />
            </div>

            <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium">
              <a href={`https://wa.me/${r.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-primary-dark hover:bg-primary/20">
                <MessageCircle className="h-3.5 w-3.5" /> {r.whatsapp}
              </a>
              <a href={`mailto:${r.email}`} className="inline-flex items-center gap-1.5 rounded-full bg-background px-3 py-1.5 hover:bg-border/50">
                <Mail className="h-3.5 w-3.5" /> {r.email}
              </a>
            </div>

            <details className="group mt-3">
              <summary className="cursor-pointer text-sm font-bold text-primary-dark marker:text-primary">Read answers</summary>
              <div className="mt-3 space-y-4 rounded-xl bg-background p-4">
                <Qa q="What they know about KASH" a={r.knowsAboutKash} />
                <Qa q="What can be improved" a={r.improvements} />
                <Qa q="How they intend to contribute" a={r.contribution} />
                <Qa q="What they hope to learn" a={r.learning} />
              </div>
            </details>
          </article>
        ))}
      </section>
    </div>
  );
}
