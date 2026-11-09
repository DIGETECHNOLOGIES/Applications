import type { ApplicationRow } from './applications';

const HEADERS = [
  'ID', 'Submitted (Cameroon time)', 'Full name', 'Email', 'WhatsApp', 'School', 'Department',
  'Year of study', 'What they know about KASH', 'What can be improved', 'How they will contribute',
  'What they hope to learn', 'Status',
];

/** Escapes a cell and neutralises spreadsheet formulas (=, +, -, @). */
function cell(value: string | number): string {
  let s = String(value ?? '');
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}

/** Validated phone numbers (+ and digits only) are written as text so Excel keeps the "+". */
function phoneCell(value: string): string {
  return /^\+\d{10,15}$/.test(value) ? `"=""${value}"""` : cell(value);
}

export function toCsv(rows: ApplicationRow[]): string {
  const fmt = new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Africa/Douala' });
  const lines = [HEADERS.map(cell).join(',')];
  for (const r of rows) {
    lines.push(
      [
        cell(r.id),
        cell(fmt.format(new Date(r.createdAt))),
        cell(r.fullName),
        cell(r.email),
        phoneCell(r.whatsapp),
        cell(r.school),
        cell(r.department),
        cell(`Year ${r.yearOfStudy}`),
        cell(r.knowsAboutKash),
        cell(r.improvements),
        cell(r.contribution),
        cell(r.learning),
        cell(r.status),
      ].join(','),
    );
  }
  // BOM so Excel opens accents correctly
  return '\uFEFF' + lines.join('\r\n');
}
