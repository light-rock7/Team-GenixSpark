# GenixSpark — AI Content Creator Marketplace

**Live application:** https://genixspark.vercel.app  
**Submission repository:** https://github.com/light-rock7/Team-GenixSpark  
**Submission branch:** `main`

GenixSpark is an AI-native marketplace connecting **generative-AI creators** with **brands and creative agencies**. It is built around the signals traditional freelance marketplaces usually miss: AI tools/models, content types, skills, specializations, workflow evidence, commercial-use context, structured creative briefs, and explainable creator-to-brief fit.

The MVP supports the full marketplace journey:

**Creator profile → AI portfolio → creator discovery → AI-assisted structured brief → explainable matching → application → brand review → shortlist/reject → award → application tracking**

It also includes two review-before-apply AI experiences:

- **AI Creator Copilot** — helps creators improve profile and portfolio positioning without inventing claims.
- **AI-Assisted Brief Builder** — converts a brand's rough creative idea into a structured draft covering content type, style, format, deliverables, tools, skills and other brief signals for human review.

---

# Challenge fit / evaluation guide

## 1. Creator Profiles & AI Portfolios — 30%

Creators build AI-specific profiles rather than generic freelancer profiles.

Implemented profile signals include:

- professional headline and bio
- AI tools/models
- skills
- specializations
- availability
- years of experience
- rates
- links
- avatar upload
- public creator profile

AI portfolio case studies include:

- image, video or external work
- **explicit content type**
- project category
- tools/models used
- skills demonstrated
- prompt / creative-direction summary
- workflow summary
- commercial-rights context
- draft / published state

This lets a brand evaluate both the output and **how the creator produced it**.

### Trust / verification signals

GenixSpark uses visible evidence-based trust signals rather than claiming unsupported certification:

- published portfolio proof
- toolchain metadata tied to case studies
- workflow summaries
- skills demonstrated in work
- content-type evidence
- commercial-rights context

These are **verification signals for evaluation**, not a claim that GenixSpark independently certifies every tool or project.

Relevant routes:

- `/dashboard/creator`
- `/creator/profile`
- `/creator/portfolio`
- `/creator/portfolio/new`
- `/creators/:id`

---

## 2. Brief Definition — 20%

Brands can create complete, structured creative briefs with explicit fields matching the challenge requirements.

Briefs capture:

- campaign / project context
- **content type**
- **creative style / mood**
- category
- deliverables
- format / aspect ratio
- required AI tools
- required skills
- budget range
- deadline
- commercial / usage-rights requirements
- references and production notes
- draft / open / closed / awarded lifecycle
- brief-readiness feedback

### Bonus: AI-Assisted Brief Builder

The brand brief page includes an AI builder that accepts a rough idea and proposes a structured brief containing:

- title and description
- content type
- creative style
- category
- likely tools and skills
- deliverables
- aspect ratio
- usage-rights information only when supported by the brand's input
- production / reference notes
- assumptions the brand should verify

The generated draft is **previewed first**. It only fills empty fields after the brand explicitly chooses to apply it. It does not silently set budget, deadline or unsupported legal/commercial terms.

Relevant routes:

- `/dashboard/brand`
- `/brand/briefs/new`
- `/briefs/:id`

---

## 3. Discovery & Filtering — 25%

Brands can search and filter creators using AI-native capability signals.

Implemented discovery includes:

- free-text creator search
- **content-type filter backed by published portfolio evidence**
- AI-tool filter
- skills filter
- specialization filter
- availability filter
- minimum-experience filter
- best-fit / experience / newest sorting
- responsive desktop/mobile filter UI
- dedicated empty-results state with reset guidance

### Explainable matching

GenixSpark intentionally avoids an opaque or fabricated "AI score".

When criteria are active, fit is calculated deterministically from explicit signals such as:

- selected content type
- required tools
- required skills
- specializations
- availability
- experience
- search relevance

The UI shows human-readable reasons such as matched content type, tools, skills or experience. If no meaningful criteria exist, GenixSpark does **not** manufacture a match percentage.

A brief can pass its content type, required tools, skills and category directly into creator discovery.

Relevant route:

- `/marketplace`

---

## 4. User Experience — 15%

The MVP has separate creator and brand workflows with protected routing and role-aware navigation.

Creator flow:

**Sign up / sign in → profile → portfolio → Copilot → opportunities → proposal → application tracking**

Brand flow:

**Sign up / sign in → AI-assisted brief → publish brief → matching discovery → applicant review → shortlist/reject/accept → award**

UX resilience includes:

- responsive layouts
- loading states
- empty states
- recoverable error states
- route-level error boundary
- useful 404 page
- protected-route return after login
- nested-route refresh support on Vercel

---

## 5. Presentation & Demo — 10%

Production URL:

https://genixspark.vercel.app

Recommended evaluator journey:

1. Open the marketplace and inspect search/filter behavior.
2. Open a creator profile and portfolio to inspect AI tools, content type, workflow and rights evidence.
3. Sign in as a Brand and open `/brand/briefs/new`.
4. Enter a rough campaign idea into **AI-Assisted Brief Builder**.
5. Review the generated assumptions and apply the suggestion to empty fields.
6. Confirm content type, style, format/aspect ratio and commercial-use fields.
7. Publish the brief and open **Find matching creators**.
8. Inspect the content-type filter and explainable fit reasons.
9. Sign in as a Creator and use Creator Copilot.
10. Apply to an opportunity and track the application.
11. Return as the Brand to review, shortlist/reject/accept and award.

A timed demo script is available in `docs/demo-runbook.md`.

---

# Additional marketplace workflow

Beyond the minimum challenge scope, GenixSpark supports the engagement funnel after discovery.

Creators can:

- browse open briefs
- evaluate fit
- submit proposals
- track pending / shortlisted / rejected / accepted states

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

# AI Creator Copilot

Creator Copilot reads the creator's real profile and portfolio context and can:

- identify profile gaps
- identify missing portfolio proof
- improve positioning
- recommend clearer tool / skill / specialization presentation
- propose reviewable profile patches

Safety constraints include:

- no invented skills
- no invented clients
- no invented project outcomes
- no invented awards or metrics
- warnings around proprietary prompts and confidential material
- explicit review before profile changes are applied

The Groq API key stays inside Supabase Edge Function secrets and is never exposed to the browser.

Relevant route:

- `/creator/copilot`

---

# Architecture

```text
React + TypeScript + Vite browser app
            |
            | Supabase JS client
            v
Supabase Auth + PostgreSQL + RLS + Storage
            |
            +--> creator-copilot Edge Function ------> Groq model API
            |
            +--> brand-brief-builder Edge Function -> Groq model API
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
- Groq API for the two AI-assistance workflows

### Deployment / quality

- Vercel
- npm with committed `package-lock.json`
- GitHub Actions CI
- `npm run check` = lint + TypeScript production build + Vite build

---

# Data model note

Core tables:

- `user_profiles`
- `creator_profiles`
- `brand_profiles`
- `portfolio_items`
- `creative_briefs`
- `applications`

Key AI-native fields include:

### Creator / portfolio

- `skills[]`
- `ai_tools[]`
- `specializations[]`
- `portfolio_items.content_type`
- `portfolio_items.category`
- `portfolio_items.prompt_summary`
- `portfolio_items.workflow_summary`
- `portfolio_items.commercial_rights`

### Brief

- `creative_briefs.content_type`
- `creative_briefs.style`
- `creative_briefs.aspect_ratio`
- `creative_briefs.required_tools[]`
- `creative_briefs.required_skills[]`
- `creative_briefs.deliverables`
- `creative_briefs.usage_rights`
- budget / deadline / reference fields

Database changes are versioned in `supabase/migrations/` through:

```text
012_portfolio_content_type.sql
```

Row Level Security is the primary authorization boundary for marketplace data.

---

# Main routes

| Route | Purpose |
| --- | --- |
| `/` | Landing page |
| `/auth` | Sign in / create account |
| `/marketplace` | Creator discovery and filtering |
| `/dashboard/creator` | Creator studio |
| `/creator/profile` | Edit creator profile |
| `/creator/copilot` | AI Creator Copilot |
| `/creator/portfolio` | Manage AI portfolio |
| `/creator/portfolio/new` | Add workflow-backed case study |
| `/creators/:id` | Public creator profile |
| `/opportunities` | Open briefs for creators |
| `/creator/applications` | Creator application tracking |
| `/dashboard/brand` | Brand workspace |
| `/brand/briefs/new` | Structured brief + AI Brief Builder |
| `/briefs/:id` | Brief detail and matching launch |
| `/briefs/:id/applications` | Applicant review workflow |

---

# Local setup

## 1. Install dependencies

```bash
npm ci
```

## 2. Frontend environment

Copy `.env.example` to `.env.local` and use browser-safe Supabase credentials only:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

Never expose a Supabase service-role/secret key, database password, Groq key or access token through a `VITE_*` variable.

## 3. Apply migrations

```bash
npx supabase@latest link --project-ref YOUR_PROJECT_REF
npx supabase@latest db push
```

## 4. Configure AI Edge Functions

Keep AI credentials server-side:

```bash
npx supabase@latest secrets set GROQ_API_KEY="YOUR_GROQ_API_KEY"
npx supabase@latest secrets set GROQ_MODEL="openai/gpt-oss-120b"
```

Deploy both AI workflows:

```bash
npx supabase@latest functions deploy creator-copilot --no-verify-jwt
npx supabase@latest functions deploy brand-brief-builder --no-verify-jwt
```

Both functions perform their own authenticated-user and role checks internally.

## 5. Run locally

```bash
npm run dev
```

## 6. Quality checks

```bash
npm run check
```

---

# Production deployment

Production application:

https://genixspark.vercel.app

Vercel browser environment variables:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
```

`GROQ_API_KEY` belongs in Supabase Edge Function secrets, **not** Vercel frontend environment variables.

The repository includes `vercel.json` so React Router nested paths resolve correctly when refreshed directly.

Supabase Auth production configuration should include:

```text
Site URL:
https://genixspark.vercel.app

Redirect URL:
https://genixspark.vercel.app/auth/callback
```

---

# Security & AI trust model

- Only Supabase publishable credentials are used in browser code.
- Backend AI secrets remain server-side.
- Supabase RLS protects user-owned marketplace records.
- Protected routes enforce Creator / Brand role access.
- Both AI Edge Functions authenticate the caller and enforce the expected role.
- AI output is treated as a suggestion, not ground truth.
- AI suggestions are shown for human review before being applied.
- The Creator Copilot is constrained against inventing capabilities or results.
- The Brief Builder does not invent budgets, deadlines or unsupported commercial/legal terms.
- Proprietary prompts, confidential client information and secrets should not be entered into AI assistants.

---

# Known MVP boundary

The application-award transition is currently a client-side multi-step flow suitable for a hackathon prototype. A production version should move the complete award transition into a transactional database RPC or server-side function so related writes succeed or fail atomically.

---

# Documentation

- `docs/backend-setup.md` — backend setup notes
- `STAGE5_COPILOT_SETUP.md` — Creator Copilot setup
- `docs/demo-runbook.md` — timed demo and release checks
- `docs/submission-checklist.md` — submission readiness checklist

---

## One-sentence evaluator summary

**GenixSpark is an end-to-end AI creator marketplace combining AI-workflow-aware portfolios, explicit content-type discovery, structured briefs with style/format/commercial-use fields, deterministic explainable matching, an AI-Assisted Brief Builder, a safety-constrained Creator Copilot, and a complete application/award workflow on Supabase-backed role security.**
