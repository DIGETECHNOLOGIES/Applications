import { neon } from '@neondatabase/serverless';

type Sql = ReturnType<typeof neon>;

let client: Sql | null = null;

/** Returns the Neon SQL client. Throws if DATABASE_URL is not configured. */
export function getSql(): Sql {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL is not set');
  if (!client) client = neon(url);
  return client;
}

let schemaReady: Promise<void> | null = null;

/** Creates the table the first time it is needed (safe to call on every request). */
export function ensureSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = (async () => {
      const sql = getSql();
      await sql`
        create table if not exists applications (
          id bigserial primary key,
          created_at timestamptz not null default now(),
          full_name text not null,
          email text not null,
          whatsapp text not null,
          school text not null,
          department text not null,
          year_of_study smallint not null check (year_of_study in (1, 2)),
          knows_about_kash text not null,
          kash_improvements text not null,
          contribution text not null,
          learning_goals text not null,
          status text not null default 'new' check (status in ('new', 'shortlisted', 'selected', 'rejected'))
        )`;
      await sql`create unique index if not exists applications_email_unique on applications (lower(email))`;
    })().catch((err) => {
      schemaReady = null; // try again on the next request
      throw err;
    });
  }
  return schemaReady;
}
