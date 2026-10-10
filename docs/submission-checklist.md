# GenixSpark — Final Submission Checklist

Use this checklist before submitting the hackathon build.

## 1. Production deployment

- Deploy branch: `feature/stage7-final-polish`
- Build command: `npm run build`
- Install command: `npm ci`
- Framework: Vite
- SPA fallback is provided by `vercel.json`.
- Production environment variables:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_PUBLISHABLE_KEY`
- Never expose service-role keys, database passwords, `GROQ_API_KEY`, or Supabase access tokens in Vercel frontend variables.

## 2. Supabase production checks

- Migrations 001–010 applied.
- Storage buckets and RLS are configured.
- `creator-copilot` Edge Function is deployed with its current implementation.
- Edge Function secrets include:
  - `GROQ_API_KEY`
  - `GROQ_MODEL=openai/gpt-oss-120b`
- Supabase Authentication URL Configuration includes the production callback URL:
  - `https://<production-domain>/auth/callback`
- Site URL is updated to the production domain before final judging if production auth is used.

## 3. Live smoke test

Verify these routes on the production URL, including direct refreshes on nested routes:

- `/`
- `/auth`
- `/marketplace`
- `/dashboard/creator`
- `/creator/profile`
- `/creator/portfolio`
- `/creator/copilot`
- `/opportunities`
- `/creator/applications`
- `/dashboard/brand`
- `/brand/briefs/new`
- `/briefs/<known-brief-id>`

Also verify one invalid route renders the recovery/404 experience instead of a blank screen.

## 4. Authentication and role checks

- Creator sign-in routes to creator workspace.
- Brand sign-in routes to brand workspace.
- Creator cannot access brand-only pages.
- Brand cannot access creator-only pages.
- Logged-out access to a protected page redirects to sign-in.
- After sign-in, the originally requested protected route is restored.
- Sign-out clears the active session.

## 5. Creator workflow

- Profile fields persist.
- AI tools, skills, and specializations persist.
- Avatar upload works.
- Portfolio case study creation works.
- Publish/unpublish behavior works.
- Public creator profile displays real saved data.
- Creator Copilot loads creator context and returns a response.
- Copilot does not invent capabilities or silently mutate profile data.
- Any suggested profile patch requires explicit user apply action.

## 6. Discovery and matching

- Marketplace search works.
- Tool, skill, and specialization filters work.
- Matching remains deterministic and explainable.
- No fabricated score is shown when the query/brief has no matching criteria.
- Public creator profile links open correctly.

## 7. Brand and brief workflow

- Brand creates a draft brief.
- Brand publishes a brief.
- Brief detail displays structured requirements.
- “Find matching creators” seeds discovery criteria correctly.
- Brand can close/reopen a brief where permitted.

## 8. Application pipeline

- Creator can browse live briefs.
- Creator can submit one proposal per brief.
- Proposal includes note, optional price, and optional delivery days.
- Brand can review applicants.
- Brand can shortlist and reject.
- Brand can accept one creator.
- Awarding the brief updates the brief to `awarded`.
- Remaining active applications close as designed.
- Creator applications page reflects the final status.

## 9. Demo data

Before judging, keep at least:

- 1 polished Creator demo account with:
  - professional display name/headline/bio
  - 4+ AI tools
  - 4+ relevant skills
  - 2+ specializations
  - 2–3 published portfolio case studies
  - workflow summaries and safe prompt-direction context
- 1 Brand demo account with:
  - 1 open, polished brief
  - realistic tool and skill requirements
  - budget and deadline
- 1 application flow ready to show.

Avoid fake client names, fake campaign results, or fabricated creator experience.

## 10. 4-minute judging flow

Follow `docs/demo-runbook.md`.

Recommended sequence:

1. Landing page — explain the problem and differentiation.
2. Creator public profile — show AI tools + workflow proof.
3. Creator Copilot — show structured, privacy-aware profile guidance.
4. Brand brief — show explicit production requirements.
5. Marketplace — show explainable matching.
6. Creator application — show concise proposal.
7. Brand applicant review — shortlist/award.
8. Close with the full loop: workflow proof → discovery → brief → application → award.

## 11. Final repository checks

Run:

```bash
npm ci
npm run check
```

Expected: lint and production build both pass.

Confirm:

- `.env.local` is not tracked.
- No frontend file contains secrets.
- README reflects the complete MVP rather than Stage 1 only.
- `docs/demo-runbook.md` is present.
- CI on `feature/stage7-final-polish` is green.

## 12. Submission package

Prepare these items for the hackathon portal:

- Product name: **GenixSpark**
- One-line pitch: **AI-native creator marketplace where brands evaluate generative creators by both portfolio quality and transparent workflow evidence.**
- GitHub repository URL
- Production demo URL
- Demo video, if required
- 3–5 screenshots:
  - creator profile / portfolio
  - Creator Copilot
  - marketplace matching
  - structured brand brief
  - applicant/award pipeline
- Short architecture summary: React + TypeScript + Vite + Tailwind + Supabase + Groq-powered Edge Function.

## Final gate

Do not submit until all three are true:

1. Production URL loads and nested-route refreshes work.
2. Creator and Brand demo accounts both sign in successfully.
3. The complete brief-to-award flow can be demonstrated without editing production data during the pitch unless intentionally shown.
