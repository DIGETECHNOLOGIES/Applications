'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { STATUSES, type Status } from '@/lib/constants';
import { cn } from '@/lib/utils';

const STYLES: Record<Status, string> = {
  new: 'border-info/30 bg-info/10 text-info',
  shortlisted: 'border-warning/40 bg-warning/10 text-amber-700',
  selected: 'border-primary/40 bg-primary/10 text-primary-dark',
  rejected: 'border-error/30 bg-error/10 text-error',
};

export function StatusSelect({ id, status }: { id: number; status: Status }) {
  const router = useRouter();
  const [value, setValue] = useState<Status>(status);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  async function change(next: Status) {
    const previous = value;
    setValue(next);
    setBusy(true);
    setFailed(false);
    try {
      const res = await fetch(`/api/admin/applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) throw new Error('failed');
      router.refresh();
    } catch {
      setValue(previous);
      setFailed(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={value}
        disabled={busy}
        onChange={(e) => change(e.target.value as Status)}
        aria-label="Application status"
        className={cn('h-8 cursor-pointer rounded-full border px-3 text-xs font-bold capitalize focus:outline-none', STYLES[value])}
      >
        {STATUSES.map((s) => (
          <option key={s} value={s} className="capitalize">
            {s}
          </option>
        ))}
      </select>
      {failed && <span className="text-xs text-error">Failed, try again</span>}
    </div>
  );
}
