'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { applicationSchema, type ApplicationInput } from '@/lib/validation';
import { cn } from '@/lib/utils';

const MAX = 1200;

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-bold">{label}</label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-text-secondary">{hint}</p>}
      {error && <p className="mt-1 text-xs font-medium text-error">{error}</p>}
    </div>
  );
}

export function ApplicationForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [done, setDone] = useState<{ name: string; whatsapp?: string } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ApplicationInput>({
    resolver: yupResolver(applicationSchema),
    defaultValues: { website: '' },
  });

  const onSubmit = async (values: ApplicationInput) => {
    setServerError(null);
    try {
      const res = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setDone({ name: values.fullName.trim().split(/\s+/)[0], whatsapp: data.whatsapp });
        reset();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      if (res.status === 422 && data.errors) {
        for (const [field, message] of Object.entries(data.errors)) {
          setError(field as keyof ApplicationInput, { message: String(message) });
        }
        return;
      }
      if (res.status === 409) {
        setError('email', { message: data.error });
        return;
      }
      setServerError(data.error ?? 'Something went wrong. Please try again.');
    } catch {
      setServerError('Network problem. Please check your connection and try again.');
    }
  };

  if (done) {
    return (
      <div className="glass rounded-[2rem] p-8 text-center sm:p-12">
        <CheckCircle2 className="mx-auto h-14 w-14 text-primary" />
        <h2 className="mt-4 text-3xl font-extrabold">Thank you, {done.name}!</h2>
        <p className="mx-auto mt-3 max-w-md text-text-secondary">
          Your application has been received. If you are selected, the DIGETECH team will contact you on WhatsApp
          {done.whatsapp ? <span className="font-semibold text-text"> ({done.whatsapp})</span> : null}.
        </p>
        <p className="mt-6 text-xs font-bold uppercase tracking-widest text-text-secondary">
          This is a volunteering activity
        </p>
      </div>
    );
  }

  const counter = (name: 'knowsAboutKash' | 'improvements' | 'contribution' | 'learning') => (
    <span className="mt-1 block text-right text-[11px] text-text-secondary">{(watch(name) ?? '').length}/{MAX}</span>
  );

  const input = (hasError?: boolean) => cn('field h-11', hasError && 'border-error focus:border-error focus:ring-error/20');
  const area = (hasError?: boolean) => cn('field min-h-32 py-3 leading-relaxed', hasError && 'border-error focus:border-error focus:ring-error/20');

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="glass rounded-[2rem] p-6 sm:p-10">
      <h2 className="text-2xl font-extrabold">Application form</h2>
      <p className="mt-1 text-sm text-text-secondary">All fields are required. It takes about 5 minutes.</p>

      {/* Honeypot, hidden from people */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input type="text" tabIndex={-1} autoComplete="off" {...register('website')} />
        </label>
      </div>

      <div className="mt-8 space-y-5">
        <p className="text-xs font-black uppercase tracking-widest text-primary-dark">About you</p>

        <Field label="Full name" error={errors.fullName?.message}>
          <input {...register('fullName')} autoComplete="name" placeholder="e.g. Harrison Benyela" className={input(!!errors.fullName)} />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Email" error={errors.email?.message}>
            <input {...register('email')} type="email" autoComplete="email" placeholder="you@example.com" className={input(!!errors.email)} />
          </Field>
          <Field label="Phone number (WhatsApp)" hint="We will contact you here if you are selected." error={errors.whatsapp?.message}>
            <input {...register('whatsapp')} type="tel" autoComplete="tel" placeholder="6XX XXX XXX" className={input(!!errors.whatsapp)} />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="School" error={errors.school?.message}>
            <input {...register('school')} placeholder="e.g. NAHPI" className={input(!!errors.school)} />
          </Field>
          <Field label="Department" error={errors.department?.message}>
            <input {...register('department')} placeholder="e.g. Computer Engineering" className={input(!!errors.department)} />
          </Field>
        </div>

        <Field label="Year of study" error={errors.yearOfStudy?.message}>
          <div className="grid grid-cols-2 gap-3">
            {(['1', '2'] as const).map((y) => (
              <label
                key={y}
                className="flex h-12 cursor-pointer items-center justify-center rounded-xl border border-border bg-background text-sm font-bold transition-all has-checked:border-primary has-checked:bg-primary/10 has-checked:text-primary-dark"
              >
                <input type="radio" value={y} className="sr-only" {...register('yearOfStudy')} />
                Year {y}
              </label>
            ))}
          </div>
        </Field>

        <p className="pt-4 text-xs font-black uppercase tracking-widest text-primary-dark">Tell us more</p>

        <Field label="What do you know about KASH?" error={errors.knowsAboutKash?.message}>
          <textarea {...register('knowsAboutKash')} maxLength={MAX} placeholder="In your own words, what is KASH and what problem does it solve?" className={area(!!errors.knowsAboutKash)} />
          {counter('knowsAboutKash')}
        </Field>

        <Field label="What do you think can be improved about KASH?" error={errors.improvements?.message}>
          <textarea {...register('improvements')} maxLength={MAX} placeholder="Features, design, speed, how people find it... be honest and specific." className={area(!!errors.improvements)} />
          {counter('improvements')}
        </Field>

        <Field label="How do you intend to contribute?" hint="For example: tech stack, public speaking, advertising, social media, design, writing." error={errors.contribution?.message}>
          <textarea {...register('contribution')} maxLength={MAX} placeholder="Tell us your skills and how you would use them on the team." className={area(!!errors.contribution)} />
          {counter('contribution')}
        </Field>

        <Field label="What do you hope to learn through this experience?" error={errors.learning?.message}>
          <textarea {...register('learning')} maxLength={MAX} placeholder="What do you want to be able to do after this experience?" className={area(!!errors.learning)} />
          {counter('learning')}
        </Field>
      </div>

      {serverError && (
        <div role="alert" className="mt-6 flex items-start gap-2 rounded-xl border border-error/20 bg-error/10 p-3 text-sm text-error">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {serverError}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-8 inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-primary px-10 text-base font-semibold text-white shadow-md shadow-primary/20 transition-all hover:bg-primary-dark active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:pointer-events-none disabled:opacity-60"
      >
        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
        {isSubmitting ? 'Submitting...' : 'Submit application'}
      </button>
      <p className="mt-3 text-center text-xs text-text-secondary">
        Strictly a volunteering activity. Your details are only used for this selection.
      </p>
    </form>
  );
}
