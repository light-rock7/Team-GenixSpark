# Stage 5 — Creator Copilot setup

The Creator Copilot frontend calls the authenticated Supabase Edge Function at `supabase/functions/creator-copilot/index.ts`. The OpenAI API key stays server-side and must **never** be added to a Vite `VITE_*` environment variable.

## 1. Keep the existing frontend environment

`.env.local` still contains only the Supabase browser credentials:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
```

## 2. Configure Edge Function secrets

Using the Supabase CLI after linking the project:

```bash
supabase secrets set OPENAI_API_KEY=YOUR_OPENAI_API_KEY
supabase secrets set OPENAI_MODEL=gpt-6-luna
```

`OPENAI_MODEL` is optional; the function defaults to `gpt-6-luna`.

## 3. Deploy the function

```bash
supabase functions deploy creator-copilot
```

The function verifies the signed-in Supabase user and only serves accounts whose `user_profiles.role` is `creator`.

## 4. Verify

1. Sign in with a creator account.
2. Open `/creator/copilot` or choose **AI Copilot** in Creator Studio.
3. Ask: `Audit my profile and tell me the three biggest credibility gaps.`
4. Confirm the answer references only current profile / portfolio signals.
5. Ask for a headline rewrite and verify a reviewable profile patch appears.
6. Apply the patch and confirm the creator profile updates only after explicit approval.
7. Ask how to describe workflow proof without exposing the full prompt and verify the privacy guidance avoids requesting proprietary prompt details.

## Security notes

- Never commit `OPENAI_API_KEY`.
- Never expose an OpenAI key in `.env.local` under a `VITE_*` variable.
- Copilot suggestions are not automatically treated as verified facts.
- The function is instructed not to invent clients, results, tools, skills, awards, years of experience, or portfolio evidence.
