# GenixSpark — AI Content Creator Marketplace

**Live application:** https://genixspark.vercel.app  
**Submission repository:** https://github.com/light-rock7/Team-GenixSpark  
**Final implementation branch:** `feature/stage7-final-polish`

GenixSpark is a two-sided marketplace built specifically for **generative-AI creators and brands/agencies**. It helps brands evaluate creators using real capability signals — portfolio evidence, AI tools, workflow context, specializations, structured brief requirements, and explainable fit reasons — instead of treating AI creative work like generic freelancing.

The completed MVP supports the full marketplace journey:

**Creator profile → AI portfolio → creator discovery → structured brand brief → explainable matching → application → brand review → shortlist/reject → award → creator application tracking**

It also includes an **AI Creator Copilot** that audits creator positioning and suggests reviewable profile improvements without inventing skills, clients, results, or experience.

---

## Why GenixSpark exists

Traditional freelance marketplaces usually show a profile, price, and final portfolio output. That is not enough for generative-AI work.

A brand may need to know:

- Which AI tools does this creator actually use?
- Can they work with Midjourney, Stable Diffusion, Flux, ComfyUI, Runway, ChatGPT, or a specific workflow?
- Does their portfolio prove the required capability?
- How was the work produced?
- Does the creator match this brief because of explicit requirements, or because of an unexplained ranking score?

GenixSpark makes those signals part of the marketplace itself.

### Key differentiation

GenixSpark is **not a generic freelancer directory with an AI label**.

Its differentiation is:

1. **AI-workflow transparency** — profiles and case studies expose tools, skills, workflow summaries, prompt direction, and rights context.
2. **Portfolio-backed capability proof** — brands can inspect evidence instead of relying only on self-declared tags.
3. **Structured creative briefs** — brands define requirements in a format that can be matched consistently.
4. **Explainable discovery** — fit is based on explicit criteria with human-readable reasons rather than an opaque AI score.
5. **Safe AI assistance** — Creator Copilot recommends improvements but does not invent claims or silently modify creator data.

---

# Evaluation guide

The project was designed around the hackathon evaluation areas below so an evaluator can quickly map product behavior to implemented functionality.

## 1. Creator Profiles & AI Portfolios

Creators can build an AI-specific professional identity instead of a generic freelancer profile.

Implemented capabilities include:

- professional headline and bio
- skills
- AI tools
- specializations
- availability and rate information
- links and avatar upload
- public creator profile
- portfolio case studies
- case-study media
- AI tool and skill metadata
- prompt-direction summary
- workflow summary
- commercial-rights context
- draft / publish controls

Portfolio items are designed to show **how the creator works**, not only the final visual output.

Relevant routes:

- `/dashboard/creator`
- `/creator/profile`
- `/creator/portfolio`
- `/creator/portfolio/new`
- `/creators/:id`

---

## 2. Discovery & Filtering

Brands can discover creators using signals that matter for generative-AI work.

Implemented discovery includes:

- creator search
- AI-tool filters
- skill filters
- specialization filters
- sorting
- portfolio-backed creator cards
- deterministic fit logic
- human-readable fit reasons

### Explainable matching

GenixSpark intentionally avoids fake or opaque AI ranking claims.

Matching is derived from explicit creator and brief data such as:

- required AI tools
- required skills
- creator specializations
- portfolio evidence
- brief criteria

If no meaningful criteria exist, the product does not manufacture an artificial match score.

Relevant route:

- `/marketplace`

---

## 3. Brief Definition

Brands can create structured creative briefs instead of posting an unstructured text request.

Briefs support:

- campaign/project information
- deliverables
- required skills
- preferred / required AI tools
- specializations
- budget/context
- deadline information
- rights expectations
- readiness feedback
- draft / open / closed / awarded lifecycle

This structured data becomes the basis for creator discovery and explainable fit.

Relevant routes:

- `/dashboard/brand`
- `/brand/briefs/new`
- `/briefs/:id`

---

## 4. Applications & Award Workflow

The marketplace supports the workflow after discovery, not just browsing.

Creators can:

- browse open opportunities
- evaluate brief fit
- submit a proposal
- track application status
- see shortlist / rejection / acceptance states

Brands can:

- review applicants
- inspect creator profiles and portfolios
- shortlist candidates
- reject candidates
- accept a creator
- award the brief

Relevant routes:

- `/opportunities`
- `/creator/applications`
- `/briefs/:id/applications`

---

## 5. AI Creator Copilot

GenixSpark includes a server-side AI assistant for creators.

The Copilot reads the creator's existing profile and portfolio context and can:

- identify profile gaps
- identify portfolio-proof gaps
- suggest stronger positioning
- recommend clearer skills / tools / specialization presentation
- propose reviewable profile patches

### Safety and trust behavior

The Copilot is intentionally constrained:

- it must not invent skills
- it must not invent clients
- it must not invent project outcomes
- it must not invent awards, metrics, or experience
- it warns against exposing proprietary prompts or confidential material
- suggestions are reviewable before application
- creator data changes only after explicit approval

The AI call runs through a **Supabase Edge Function**, keeping the Groq API key server-side.

Relevant route:

- `/creator/copilot`

---

# End-to-end demo flow

A reviewer can evaluate the completed MVP using this sequence:

1. Open the landing page and marketplace.
2. Inspect a public creator profile and AI portfolio case studies.
3. Sign in as a Brand.
4. Create or open a structured creative brief.
5. Open creator discovery with relevant brief criteria.
6. Inspect explainable fit reasons rather than an opaque ranking score.
7. Sign in as a Creator.
8. Open Creator Copilot and review profile/portfolio recommendations.
9. Browse open opportunities and submit an application.
10. Return as the Brand and review the applicant.
11. Shortlist, reject, or accept the creator.
12. Award the brief.
13. Return as the Creator and verify the accepted application state.

A timed hackathon script is available in `docs/demo-runbook.md`.

---

# Product capabilities

- **Authentication & roles** — Supabase email/password authentication, Creator/Brand role provisioning, protected routing, intended-route return after login.
- **Creator profiles** — AI-focused identity, skills, tools, specializations, availability, rates, links, avatar, public profile.
- **AI portfolios** — workflow-aware case studies with media, tool/skill metadata, prompt summary, workflow summary, rights context, publish controls.
- **Creator discovery** — search, filters, sorting, deterministic fit, explainable match reasons.
- **Creative briefs** — structured requirements and draft/open/closed/awarded lifecycle.
- **Creator Copilot** — AI-assisted profile and portfolio guidance with review-before-apply behavior and non-invention rules.
- **Applications pipeline** — proposals, tracking, applicant review, shortlist/reject/accept, award state.
- **UX resilience** — responsive layouts, loading/empty/error states, route-level error recovery, 404 recovery, SPA refresh support.
- **Security** — Supabase RLS, role-aware access, publishable browser key only, server-side AI secret handling.

---

# Architecture

```text
Browser / React + TypeScript + Vite
            |
            | Supabase JS client
            v
Supabase Auth + PostgreSQL + RLS + Storage
            |
            | authenticated Edge Function call
            v
Creator Copilot Edge Function
            |
            v
Groq model API
```

### Frontend

- React 19
- TypeScript
- Vite 8
- Tailwind CSS 4
- React Router 7
- Lucide React

### Backend / platform

- Supabase Auth
- PostgreSQL
- Row Level Security
- Supabase Storage
- Supabase Edge Functions
- Groq API for Creator Copilot

### Deployment / quality

- Vercel
- npm with committed `package-lock.json`
- GitHub Actions CI
- `npm run check` = lint + production build

---

# Main routes

| Route | Purpose |
| --- | --- |
| `/` | Marketplace landing page |
| `/auth` | Sign in / create account |
| `/marketplace` | Creator discovery |
| `/dashboard/creator` | Creator studio overview |
| `/creator/profile` | Edit creator profile |
| `/creator/copilot` | AI Creator Copilot |
| `/creator/portfolio` | Manage portfolio |
| `/creator/portfolio/new` | Add case study |
| `/creators/:id` | Public creator profile |
| `/opportunities` | Open brief opportunities for creators |
| `/creator/applications` | Creator application tracking |
| `/dashboard/brand` | Brand workspace |
| `/brand/briefs/new` | Create brief |
| `/briefs/:id` | Brief detail |
| `/briefs/:id/applications` | Application / applicant review workflow |

---

# Data model

The MVP uses these core application tables:

- `user_profiles`
- `creator_profiles`
- `brand_profiles`
- `portfolio_items`
- `creative_briefs`
- `applications`

Database changes are versioned in `supabase/migrations/`, currently through:

```text
010_application_brief_visibility.sql
```

Row Level Security remains enabled and is the primary authorization boundary for user-owned marketplace data.

---

# Local setup

## 1. Install dependencies

```bash
npm ci
```

## 2. Configure frontend environment

Copy `.env.example` to `.env.local` and provide browser-safe Supabase credentials only:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

Never expose a Supabase service-role/secret key, database password, Groq key, or access token through a `VITE_*` variable.

## 3. Apply database migrations

Apply migrations from `supabase/migrations/` in order.

## 4. Configure Creator Copilot

Keep AI credentials server-side:

```bash
npx supabase@latest link --project-ref YOUR_PROJECT_REF
npx supabase@latest secrets set GROQ_API_KEY="YOUR_GROQ_API_KEY"
npx supabase@latest secrets set GROQ_MODEL="openai/gpt-oss-120b"
npx supabase@latest functions deploy creator-copilot --no-verify-jwt
```

The Edge Function performs authenticated-user and Creator-role checks internally.

See `STAGE5_COPILOT_SETUP.md` for detailed setup notes.

## 5. Run locally

```bash
npm run dev
```

## 6. Quality checks

```bash
npm run check
```

Equivalent to:

```bash
npm run lint
npm run build
```

---

# Production deployment

Production application:

https://genixspark.vercel.app

Vercel environment variables:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
```

`GROQ_API_KEY` must **not** be added to Vercel because it belongs in Supabase Edge Function secrets.

The repository includes `vercel.json` so React Router nested paths resolve to `index.html` when refreshed directly.

## Supabase Auth URLs

For production, configure Supabase Authentication URL settings with the deployed frontend domain, including:

```text
Site URL:
https://genixspark.vercel.app

Redirect URL:
https://genixspark.vercel.app/auth/callback
```

---

# Security & trust model

- Only Supabase publishable credentials are used in browser code.
- Backend secrets remain server-side.
- RLS protects user-owned marketplace records.
- Protected routes enforce role-aware application access.
- Creator Copilot authenticates the caller before processing profile context.
- AI output is treated as a suggestion, not trusted source-of-truth data.
- AI suggestions are not silently written to creator profiles.
- Proprietary prompts, confidential client information, and secret keys should never be entered into the Copilot.
- `.env.local` and production secrets must not be committed.

---

# Known MVP boundary

The current application-award flow is implemented as a client-side multi-step operation suitable for the hackathon MVP. A production version should move the complete award transition into a transactional database RPC or server-side function so all related writes succeed or fail atomically.

---

# Documentation

- `docs/backend-setup.md` — backend setup notes
- `STAGE5_COPILOT_SETUP.md` — Creator Copilot deployment
- `docs/demo-runbook.md` — timed demo script and final release checks
- `docs/submission-checklist.md` — submission readiness checklist

---

## One-sentence evaluator summary

**GenixSpark is an end-to-end generative-AI creator marketplace that combines workflow-aware creator portfolios, structured brand briefs, deterministic explainable matching, a complete application/award pipeline, and a safety-constrained AI Creator Copilot on top of Supabase-backed role security.**
