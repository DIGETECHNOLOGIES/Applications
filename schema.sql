-- Optional: the app creates this automatically on the first request.
-- You can also run it yourself in the Neon SQL Editor.
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
);

create unique index if not exists applications_email_unique on applications (lower(email));
