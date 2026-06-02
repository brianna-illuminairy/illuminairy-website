# Supabase — Illuminairy CRM

**Project ref:** `agujbietvwcudihfgkef`

## Apply schema

With [Supabase CLI](https://supabase.com/docs/guides/cli) installed and logged in:

```bash
supabase login
supabase link --project-ref agujbietvwcudihfgkef
supabase db push
```

Or paste `migrations/20260518120000_crm_schema.sql` into the SQL editor in the Supabase Dashboard.

**Plan share table** (`plan_shares`, for reveal share links):

```bash
npm run crm:migrate:plan-shares
```

Requires `DATABASE_URL` or `SUPABASE_DB_PASSWORD` in `.env.local` (Dashboard → Project Settings → Database → password).  
Applied on prod **2026-06-01** via SQL Editor.

## Env (`.env.local`)

```bash
SUPABASE_URL=https://agujbietvwcudihfgkef.supabase.co
SUPABASE_SERVICE_ROLE_KEY=   # Dashboard → Settings → API → service_role
KLAVIYO_PRIVATE_API_KEY=
ADMIN_SECRET=                # random string for /admin login
```

Never commit real keys. Rotate any key pasted into chat.
