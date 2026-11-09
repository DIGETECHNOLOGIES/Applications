# apply.digetech.org

Volunteer application site for the DIGETECH team (Next.js full stack, Neon Postgres, Vercel).

- `/` public application form (Year 1 / Year 2 students)
- `/admin` password-protected dashboard: view answers, search, filter, set status, export CSV

## 1. Create the Neon database

1. Go to https://console.neon.tech and create a project (pick the region closest to your Vercel region).
2. Click **Connect** and copy the connection string. It looks like
   `postgresql://user:password@ep-xxxx.region.aws.neon.tech/neondb?sslmode=require`
3. Nothing else to do. The `applications` table is created automatically on the first request.
   (`schema.sql` is there if you prefer to run it yourself in the Neon SQL Editor.)

## 2. Deploy on Vercel

1. Put this folder in a GitHub repository (do not commit `.env` files, `.gitignore` already blocks them).
2. In Vercel: **Add New > Project**, import the repository. Framework is detected as Next.js.
3. Before deploying, add these **Environment Variables**:

| Name | Value |
| --- | --- |
| `DATABASE_URL` | the Neon connection string from step 1 |
| `ADMIN_PASSWORD` | the password you will use to log in to `/admin` |
| `ADMIN_SESSION_SECRET` | a long random string, e.g. run `openssl rand -hex 32` |
| `APPLICATIONS_OPEN` | `true` (set to `false` to close applications) |

4. Click **Deploy**.

## 3. Connect apply.digetech.org

1. In the Vercel project: **Settings > Domains > Add** `apply.digetech.org`.
2. Vercel shows the DNS record to create. For a subdomain it is a **CNAME** record:
   name `apply`, value as shown by Vercel (usually `cname.vercel-dns.com`).
3. Add that record where `digetech.org` DNS is managed, then wait for Vercel to show the domain as valid
   (HTTPS is issued automatically).

## 4. Check that it works

1. Open https://apply.digetech.org and submit a test application.
2. Open https://apply.digetech.org/admin, sign in with `ADMIN_PASSWORD`, and confirm the test row appears.
3. Delete the test row in the Neon SQL Editor: `delete from applications where email = 'your-test-email';`

## Everyday use

- Change an applicant's status (new, shortlisted, selected, rejected) from the dropdown on each card.
- **Export CSV** downloads what you are currently looking at (filters and search are respected). It opens in Excel and Google Sheets.
- To stop receiving applications, set `APPLICATIONS_OPEN=false` in Vercel and redeploy. The form is replaced by a "closed" message.
- Each person can apply once per email address.

## Run locally

```bash
npm install
cp .env.example .env.local   # fill in the values
npm run dev                  # http://localhost:3000
```
