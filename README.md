# GenixSpark — AI Content Creator Marketplace

GenixSpark is a workflow-aware marketplace for generative-AI creators and brands. Instead of treating AI creative work like generic freelancing, the product surfaces the signals brands actually need to evaluate: portfolio evidence, AI tool fluency, workflow context, structured brief requirements, explainable fit, and proposal status.

## Product story

**Creator experience**

1. Create an AI-specific professional profile.
2. Publish case studies with tools, skills, workflow summaries, prompt direction, and rights context.
3. Use Creator Copilot to audit positioning without inventing capabilities or exposing proprietary prompts.
4. Browse live briefs ranked by explicit profile-to-brief criteria.
5. Submit and track proposals through shortlist, acceptance, rejection, or withdrawal.

**Brand experience**

1. Define a structured creative brief with required AI tools, skills, deliverables, rights, budget, and deadline.
2. Discover creators using transparent capability filters and fit reasons.
3. Review creator profiles, portfolios, and workflow proof.
4. Review applications, shortlist candidates, and award a brief.

## What is implemented

- **Authentication & roles** — Supabase email/password auth, creator/brand role provisioning, protected routing, RLS-backed profile access.
- **Creator profiles** — professional headline, bio, skills, AI tools, specializations, availability, rates, links, avatar upload, public profile.
- **AI portfolios** — case studies with media, tool/skill metadata, prompt summary, workflow summary, commercial rights, draft/publish controls.
- **Creator discovery** — search, filtering, sorting, deterministic fit, and human-readable fit reasons.
- **Creative briefs** — structured brand briefs with draft/open/closed/awarded lifecycle.
- **Creator Copilot** — Groq-backed profile/portfolio guidance with non-invention rules, privacy safeguards, and explicit review-before-apply behavior.
- **Applications pipeline** — creator proposals, creator tracking, brand applicant review, shortlist/reject/accept, and awarded brief state.
- **Production polish** — responsive layouts, loading/empty/error states, route recovery, SPA refresh support, intended-route return after login, and demo/deployment documentation.

## Stack

- React 19 + TypeScript
- Vite 8
- Tailwind CSS 4
- React Router 7
- Supabase Auth, Postgres, RLS, Storage, Edge Functions
- Groq API for Creator Copilot
- Lucide React
- npm with committed `package-lock.json`
- Vercel-ready SPA configuration

## Main routes

| Route | Purpose |
| --- | --- |
| `/` | Marketplace landing page |
| `/auth` | Sign in / create account |
| `/dashboard/creator` | Creator studio overview |
| `/creator/profile` | Edit creator profile |
| `/creator/copilot` | AI Creator Copilot |
| `/creator/portfolio` | Manage portfolio |
| `/creator/portfolio/new` | Add case study |
| `/creators/:id` | Public creator profile |
| `/marketplace` | Creator discovery |
| `/opportunities` | Creator brief opportunities |
| `/creator/applications` | Creator application tracking |
| `/dashboard/brand` | Brand workspace |
| `/brand/briefs/new` | Create brief |
| `/briefs/:id` | Brief detail |
| `/briefs/:id/applications` | Apply to / review applications for a brief |

## Local setup

### 1. Install

```bash
npm ci
```

### 2. Frontend environment

Copy `.env.example` to `.env.local` and provide only browser-safe Supabase credentials:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

Never put a Supabase secret/service-role key, database password, Groq key, or access token in a `VITE_*` variable.

### 3. Database

Apply the SQL migrations in `supabase/migrations/` in order. The current MVP includes migrations through:

```text
010_application_brief_visibility.sql
```

The schema covers:

- `user_profiles`
- `creator_profiles`
- `brand_profiles`
- `portfolio_items`
- `creative_briefs`
- `applications`

Row Level Security remains enabled and API grants are scoped through the migration set.

### 4. Creator Copilot

Link the Supabase project, keep the Groq key server-side, and deploy the Edge Function:

```bash
npx supabase@latest link --project-ref YOUR_PROJECT_REF
npx supabase@latest secrets set GROQ_API_KEY="YOUR_GROQ_API_KEY"
npx supabase@latest secrets set GROQ_MODEL="openai/gpt-oss-120b"
npx supabase@latest functions deploy creator-copilot --no-verify-jwt
```

The function still performs its own authenticated-user and creator-role checks. See `STAGE5_COPILOT_SETUP.md` for details.

### 5. Run

```bash
npm run dev
```

### 6. Quality checks

```bash
npm run lint
npm run build
```

## Supabase Auth redirect configuration

In **Authentication → URL Configuration**, add the URLs you actually use, for example:

```text
http://localhost:5173/auth/callback
http://localhost:5174/auth/callback
http://localhost:5175/auth/callback
https://YOUR_DEPLOYMENT.vercel.app/auth/callback
```

Set the production Site URL to the deployed frontend domain before the final demo.

## Vercel deployment

The repository includes `vercel.json` so React Router paths resolve to `index.html` on refresh.

Configure these Vercel environment variables:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
```

Do **not** configure `GROQ_API_KEY` in Vercel; it belongs in Supabase Edge Function secrets.

Recommended production verification after deploy:

```text
/
/auth
/marketplace
/dashboard/creator
/creator/copilot
/dashboard/brand
```

Refresh at least one nested protected route to confirm SPA fallback behavior.

## Demo path

For the cleanest hackathon demo, use two real accounts: one creator and one brand. Prepare enough real sample data to avoid empty screens.

Suggested sequence:

1. Creator public profile + workflow-backed portfolio case study.
2. Brand creates/publishes a structured brief.
3. Brand opens marketplace with brief criteria and explains deterministic fit reasons.
4. Creator uses Copilot for a safe profile audit.
5. Creator opens a live brief and submits a proposal.
6. Brand reviews the applicant, shortlists, and accepts the creator.
7. Creator shows the accepted application status.

A timed script and final pre-demo checks are in `docs/demo-runbook.md`.

## Marketplace principles

GenixSpark intentionally avoids fake or opaque AI ranking claims.

- Fit is based on explicit tools, skills, specialization, and brief criteria.
- No criteria means no artificial match score.
- Copilot must not invent skills, clients, outcomes, awards, metrics, or experience.
- Proprietary prompts, keys, confidential client material, and unreleased assets should not be requested or exposed.
- AI suggestions are reviewable; profile changes happen only after explicit creator approval.

## Security notes

- Use only publishable Supabase keys in the browser.
- Keep Groq and backend secrets server-side.
- RLS is the authorization boundary for user-owned marketplace data.
- Do not disable RLS to make a demo work.
- Do not commit `.env.local` or copied production secrets.

## Useful documentation

- `docs/backend-setup.md` — backend setup notes
- `STAGE5_COPILOT_SETUP.md` — Creator Copilot deployment
- `docs/demo-runbook.md` — final demo script and release checklist
