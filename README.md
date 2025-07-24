# LANZATE APP

This is the main repository for the LANZATE app. A customizable app for your home business.

## Stack

- Next.js
- Tailwind CSS
- TypeScript
- Supabase
- Prisma
- Next-Intl & Next-International
- React Hook Form
- ShadCN UI
- Yup
- Resend
- Featured directory architecture
- Lucide Icons


## Supabase Access Grant

These are the grants that are needed to be able to use the database back again after a prisma reset

```sql
grant usage on schema "public" to anon;
grant usage on schema "public" to authenticated;

GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA "public" TO authenticated;
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA "public" TO anon;
```

