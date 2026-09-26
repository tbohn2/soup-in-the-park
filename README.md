# Soup in the Park

A web application to help organize the yearly soup in the park party. Next.js on Vercel, with Neon Postgres (Prisma) for sign-ups and Vercel Blob for gallery photos.

## Local setup

```sh
pnpm install
vercel link          # once, then:
vercel env pull .env.local
pnpm dev
```

## Common tasks

- `pnpm db:migrate`: create/apply a migration after editing `prisma/schema.prisma`
- `pnpm photos:upload`: resize the photos in `src/assets` and upload them to Blob (safe to re-run)
- `pnpm signups:import`: copy the current Google Sheet sign-ups into Neon (`-- --replace` to overwrite)

## Yearly updates

- Bump the event key in `src/lib/events.ts` to start a fresh sign-up sheet.
- Update the date and details text in `src/components/SoupSignUp.tsx` / `ChristmasSignUp.tsx`.
- The Christmas layout swaps in automatically Oct 30 through Dec 31 (`src/lib/season.ts`); preview it any time at `/christmas`.

## Admin

`/admin` (password in the `ADMIN_PASSWORD` env var): approve submitted photos and download sign-ups as CSV.
