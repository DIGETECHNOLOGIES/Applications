import { ensureSchema, getSql } from './db';
import type { Status } from './constants';

export type ApplicationRow = {
  id: number;
  createdAt: string; // ISO string
  fullName: string;
  email: string;
  whatsapp: string;
  school: string;
  department: string;
  yearOfStudy: 1 | 2;
  knowsAboutKash: string;
  improvements: string;
  contribution: string;
  learning: string;
  status: Status;
};

export type NewApplication = Omit<ApplicationRow, 'id' | 'createdAt' | 'status'>;

/* eslint-disable @typescript-eslint/no-explicit-any */
function toRow(r: any): ApplicationRow {
  return {
    id: Number(r.id),
    createdAt: new Date(r.created_at).toISOString(),
    fullName: r.full_name,
    email: r.email,
    whatsapp: r.whatsapp,
    school: r.school,
    department: r.department,
    yearOfStudy: Number(r.year_of_study) as 1 | 2,
    knowsAboutKash: r.knows_about_kash,
    improvements: r.kash_improvements,
    contribution: r.contribution,
    learning: r.learning_goals,
    status: r.status,
  };
}

export async function insertApplication(a: NewApplication): Promise<number> {
  await ensureSchema();
  const sql = getSql();
  const rows = (await sql`
    insert into applications
      (full_name, email, whatsapp, school, department, year_of_study,
       knows_about_kash, kash_improvements, contribution, learning_goals)
    values
      (${a.fullName}, ${a.email}, ${a.whatsapp}, ${a.school}, ${a.department}, ${a.yearOfStudy},
       ${a.knowsAboutKash}, ${a.improvements}, ${a.contribution}, ${a.learning})
    returning id`) as any[];
  return Number(rows[0].id);
}

export async function listApplications(): Promise<ApplicationRow[]> {
  await ensureSchema();
  const sql = getSql();
  const rows = (await sql`select * from applications order by created_at desc, id desc`) as any[];
  return rows.map(toRow);
}

export async function setApplicationStatus(id: number, status: Status): Promise<boolean> {
  await ensureSchema();
  const sql = getSql();
  const rows = (await sql`update applications set status = ${status} where id = ${id} returning id`) as any[];
  return rows.length > 0;
}
