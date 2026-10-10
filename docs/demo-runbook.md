# GenixSpark Demo Runbook

Use this for the final hackathon walkthrough. The goal is to demonstrate the product story, not every field in every form.

## Before the demo

Prepare two real Supabase accounts:

- **Creator account** — complete profile, 3+ AI tools, 3+ skills, at least 1 published portfolio case study.
- **Brand account** — profile created, at least 1 open brief with tools, skills, budget, deadline, deliverables, and usage rights.

Do not put account passwords or API keys in this file.

### Final technical checks

Run:

```bash
npm ci
npm run lint
npm run build
```

Then verify:

- Supabase migrations are applied through `010_application_brief_visibility.sql`.
- `GROQ_API_KEY` exists in Supabase Edge Function secrets.
- `GROQ_MODEL` is `openai/gpt-oss-120b`.
- `creator-copilot` is deployed with `--no-verify-jwt`.
- Production Supabase Auth Site URL and callback URL match the deployed frontend domain.
- Vercel has `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` only.
- A direct refresh on `/marketplace`, `/creator/copilot`, and `/dashboard/brand` does not return a platform 404.

## 4-minute judge flow

### 0:00–0:30 — Problem and differentiator

Open `/`.

Say:

> GenixSpark is an AI-native creator marketplace. Generic freelancer platforms show profiles and finished outputs. We add the missing production signals: AI tool fluency, workflow proof, structured creative requirements, and explainable matching.

Point out the creator portfolio + structured brief story on the landing page.

### 0:30–1:10 — Creator proof

Open a strong public creator profile.

Show:

- professional positioning
- AI tools
- skills / specializations
- published case study
- workflow summary
- prompt direction without revealing the exact proprietary prompt
- commercial-rights context

Say:

> Brands are not asked to trust a generic “AI expert” label. They can inspect the work and the production evidence behind it.

### 1:10–1:50 — Structured brief and discovery

Switch to the Brand account.

Open an existing structured brief or create one quickly.

Show:

- required AI tools
- required skills
- deliverables
- usage rights
- budget
- deadline

Click **Find matching creators**.

On `/marketplace`, explain that fit is deterministic and criteria-based.

Say:

> This is not an opaque AI ranking. We compare explicit brief requirements with explicit creator capability signals and show why the creator fits.

### 1:50–2:35 — Creator Copilot

Switch to the Creator account and open `/creator/copilot`.

Use one of these prompts:

```text
Audit my profile and tell me the three biggest credibility gaps. Do not invent any skills or experience.
```

```text
Rewrite my headline without adding any skills I don't already have.
```

```text
How can I explain my workflow without revealing my exact prompt?
```

Point out:

- real profile/portfolio context
- no invented capabilities
- privacy / prompt-IP guidance
- suggested edits are reviewable
- nothing changes until the creator explicitly applies it

### 2:35–3:35 — Marketplace transaction loop

From Creator Studio open **Briefs** / `/opportunities`.

Open the prepared live brief and submit a short proposal.

Switch to the Brand account:

- open the brief
- click **Review applicants**
- shortlist the creator
- accept the creator

Switch back to Creator account → **Applications**.

Show the `accepted` status.

Say:

> The full loop is connected: structured requirement → explainable discovery → creator proof → proposal → shortlist → award.

### 3:35–4:00 — Close

Say:

> GenixSpark turns AI creative work from a black box into professional marketplace evidence. Creators protect their IP while showing enough process to build trust, and brands can make decisions from real capability signals instead of generic profiles.

## Rubric mapping

| Rubric area | What to show |
| --- | --- |
| Creator Profiles & AI Portfolios | Public profile, AI tools, case study, workflow/prompt context |
| Discovery & Filtering | Marketplace filters, deterministic criteria fit, visible fit reasons |
| Brief Definition | Tool/skill requirements, deliverables, rights, budget, deadline |
| UX | Role-based workspaces, empty/loading/error states, responsive navigation, connected flows |
| Presentation & Demo | End-to-end creator → brand → award story, concise explanation of differentiation |

## Demo recovery plan

If Copilot fails:

1. Confirm the user is signed in as a creator.
2. Check Supabase Edge Function deployment and logs.
3. Confirm `GROQ_API_KEY` secret exists.
4. Confirm model secret is `openai/gpt-oss-120b`.
5. Do not expose the Groq key while debugging.

If login fails:

1. Confirm `.env.local` / production env uses an `sb_publishable_...` key, not `sb_secret_...`.
2. Confirm the Supabase project URL is correct.
3. Confirm Auth redirect URLs contain the current local or deployed callback URL.

If a database action fails:

1. Confirm migrations through `010` were applied.
2. Keep RLS enabled.
3. Use the browser error plus Supabase logs to identify the exact failing policy/query instead of bypassing security.

## Final browser QA

Test at desktop and a narrow mobile viewport:

- Landing page
- Auth sign in / signup toggle
- Creator dashboard
- Profile editor
- Portfolio list + new case study
- Public creator profile
- Creator Copilot
- Marketplace filters
- Brand dashboard
- Brief create + detail
- Creator opportunities
- Application submit
- Brand applicant review
- Creator application tracking
- Sign out and sign back in

Also test keyboard focus on primary buttons and forms, long text wrapping, empty states, and a hard refresh on nested routes.
