# Tenth Project

**AI product development coach** for non-technical creators using Cursor, Lovable, Gemini, Claude, and ChatGPT.

Plan your build, track UAT, fix bugs, and get copy-paste prompts for your next sprint.

## Features

- **Project wizard** — Describe your idea, upload context, get an AI-generated roadmap
- **Phase roadmap & tasks** — Structured plan from idea to launch
- **UAT workflow** — Checklists with status, remarks, evidence, and re-test flow
- **Bug tracking** — Linked bugs with fix prompts
- **Prompt export** — Tool-specific prompts for Cursor, Lovable, Gemini, Claude, ChatGPT
- **Website checks** — Playwright-powered screenshots and basic validation
- **Activity history** — Audit trail of status changes and AI runs

## Tech Stack

- Next.js 16 (App Router) + TypeScript + Tailwind CSS + shadcn/ui
- Supabase (Postgres, Auth, Storage) — with local JSON fallback for dev
- Playwright for website checks
- OpenAI / AIML API for AI analysis
- Vercel for deployment

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment variables (optional for local demo)
cp .env.example .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and click **Get started** → sign in with demo auth.

## Demo Auth

MVP uses demo authentication — click Sign in on the login page to enter the app instantly. Full Supabase Auth can be enabled when you configure Supabase.

## Supabase Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run the migration in `supabase/migrations/001_initial_schema.sql`
3. Add env vars to `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

Without Supabase, the app stores data locally in `.data/store.json`.

## AI Setup

Add one of these to `.env.local`:

```bash
OPENAI_API_KEY=sk-...
# OR
AIML_API_KEY=your-key
AIML_BASE_URL=https://api.aimlapi.com/v1
```

Without an API key, the app uses built-in smart fallback analysis.

## Deploy to Vercel

1. Push this repo to GitHub (separate from other projects)
2. Import in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy

**Note:** Playwright website checks require Vercel serverless with sufficient memory/timeout. For production, consider a dedicated worker or Edge Function.

## Project Structure

```
src/
  app/           # Pages and API routes
  components/    # UI components
  lib/           # Auth, DB, AI, Playwright
  types/         # TypeScript types
supabase/
  migrations/    # Database schema
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## License

Private — Tenth Project MVP
