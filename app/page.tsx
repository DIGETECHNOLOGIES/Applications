import { AlertTriangle, Lock } from 'lucide-react';
import { ApplicationForm } from '@/components/ApplicationForm';
import { TOTAL_SPOTS } from '@/lib/constants';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const open = process.env.APPLICATIONS_OPEN !== 'false';

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* soft green glows, same idea as the KASH sign-up page */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-[420px] w-[420px] rounded-full bg-primary opacity-20 blur-[120px]" />
      <div className="pointer-events-none absolute top-[40%] -left-40 h-[360px] w-[360px] rounded-full bg-primary-light opacity-20 blur-[120px]" />

      <header className="relative z-10 mx-auto flex max-w-3xl items-center gap-3 px-5 pt-6">
        <img src="/logo.png" alt="" className="h-9 w-9 object-contain" />
        <div className="leading-tight">
          <p className="text-xl font-black italic tracking-tighter text-primary">KASH</p>
          <p className="text-[11px] font-bold uppercase tracking-widest text-text-secondary">Volunteer programme</p>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-3xl px-5 pb-16 pt-10">
        <section>
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary-dark">
            <span className={`h-2 w-2 rounded-full ${open ? 'animate-pulse bg-primary' : 'bg-text-secondary'}`} />
            {open ? `Applications open · ${TOTAL_SPOTS} spots` : 'Applications closed'}
          </span>

          <h1 className="mt-5 text-3xl font-extrabold leading-tight sm:text-5xl">
            The DIGETECH team is opening its doors to{' '}
            <span className="text-primary">{TOTAL_SPOTS} year one and two students</span> who would like to gain real
            world experience on project development and work with real projects like{' '}
            <span className="italic text-primary">KASH</span>.
          </h1>

          <p className="mt-5 text-lg text-text-secondary">
            If you would like to be selected, kindly fill in the application form below.
          </p>

          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-warning/30 bg-warning/10 p-4">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
            <p className="text-sm font-extrabold uppercase tracking-wide">
              NB. This is strictly a volunteering activity.
            </p>
          </div>
        </section>

        <section className="mt-10">
          {open ? (
            <ApplicationForm />
          ) : (
            <div className="glass rounded-[2rem] p-8 text-center">
              <Lock className="mx-auto h-10 w-10 text-text-secondary" />
              <h2 className="mt-4 text-2xl font-extrabold">Applications are now closed</h2>
              <p className="mt-2 text-text-secondary">
                Thank you for your interest. Follow DIGETECH for the next opportunity.
              </p>
            </div>
          )}
        </section>
      </main>

      <footer className="relative z-10 border-t border-border py-6 text-center text-xs text-text-secondary">
        © {new Date().getFullYear()} DIGETECH (Digital Generation Technologies) ·{' '}
        <a className="font-semibold text-primary-dark hover:underline" href="https://kash.digetech.org">
          kash.digetech.org
        </a>
      </footer>
    </div>
  );
}
