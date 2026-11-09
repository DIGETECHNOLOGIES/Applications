import type { ApplicationRow } from './applications';
import { STATUSES } from './constants';

export type Filters = { year?: string; status?: string; q?: string };

export function applyFilters(rows: ApplicationRow[], f: Filters): ApplicationRow[] {
  const q = f.q?.trim().toLowerCase();
  return rows.filter((r) => {
    if (f.year === '1' || f.year === '2') {
      if (r.yearOfStudy !== Number(f.year)) return false;
    }
    if (f.status && (STATUSES as readonly string[]).includes(f.status) && r.status !== f.status) return false;
    if (q) {
      const hay = `${r.fullName} ${r.email} ${r.school} ${r.department} ${r.whatsapp}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}
