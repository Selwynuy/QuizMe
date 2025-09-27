# AI Flashcard Study App

Stack: Next.js App Router, Tailwind v4, Supabase (Auth/Postgres/Storage), OpenAI.

Features

- Password + Google auth (Supabase block)
- Decks and cards CRUD with RLS
- PDF upload to Supabase Storage
- AI flashcard generation (OpenAI)
- Spaced repetition reviews (SM-2–like)
- Progress dashboard (7d reviews, accuracy, streak)

Quickstart

1. Install deps

```bash
npm install
```

2. Env vars (.env.local)

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY=your_anon_key
OPENAI_API_KEY=your_openai_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

3. Supabase setup

- Auth → URL Configuration → Site URL: http://localhost:3000
- Auth → Providers → Google: enable and set Client ID/Secret
  - Google Console → Credentials → OAuth Client (Web)
  - Authorized redirect URIs:
    https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
- Storage: create bucket "uploads" (public not required)
- Database: run `database/schema.sql` (Supabase SQL editor)

4. Dev

```bash
npm run dev
```

Visit http://localhost:3000

Routes

- / → Landing
- /auth/login, /auth/sign-up, /auth/forgot-password
- /dashboard (auth)
- /decks/new (create)
- /decks/[id] (manage + share)
- /study/[id] (reviews)
- /profile (settings)

Notes

- Google OAuth redirects to Supabase callback; app lands on /dashboard.
- For AI gen, paste notes in New Deck and click Generate with AI.

Scripts

- npm run dev
- npm run build
- npm start
