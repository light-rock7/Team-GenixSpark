# GenixSpark Stage 1 — Supabase Backend Setup

## Goal
Provide the secure backend contract required by the React frontend and the next marketplace stages.

## Tables
- `public.user_profiles`
- `public.creator_profiles`
- `public.brand_profiles`
- `public.portfolio_items`
- `public.creative_briefs`
- `public.applications`

## Auth contract
The existing React signup sends:

- `display_name`
- `role` (`creator` or `brand`)

The `handle_new_user()` trigger creates `user_profiles` and the correct role-specific profile automatically.

## Run migrations
Run files in numeric order in the Supabase SQL editor, or use the Supabase CLI if configured.

## Frontend environment
Create `.env.local` locally:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_OR_ANON_KEY
```

Never expose service-role keys, database passwords, or private API keys in browser code or GitHub.

## Storage path convention
Upload into a user-owned first-level folder:

- `avatars/<user-id>/avatar.webp`
- `portfolio/<creator-user-id>/<uuid>.webp`
- `brand-assets/<brand-user-id>/<uuid>.webp`

The storage policies depend on this convention.

## Supabase Auth URL Configuration
Development:
- Site URL: `http://localhost:5173`
- Redirect URL: `http://localhost:5173/auth/callback`

Production:
- Site URL: your Vercel production URL
- Redirect URL: `https://YOUR_DOMAIN/auth/callback`

## Validation checklist
1. Create a Creator account.
2. Confirm a row appears in `user_profiles` with role `creator`.
3. Confirm a matching row appears in `creator_profiles`.
4. Create a Brand account.
5. Confirm `user_profiles.role = brand`.
6. Confirm a matching row appears in `brand_profiles`.
7. Creator can update only own creator profile.
8. Brand cannot update creator profile.
9. Brand can create/update/delete own briefs.
10. Creator cannot create a brief.
11. Creator can create portfolio items only for self.
12. Creator can apply once to an open brief.
13. Brand can see applications only for own briefs.
14. Anonymous users can read public marketplace profiles, published portfolio items and open briefs.
15. Storage upload paths work and cross-user modifications are denied.

## Stage 1 Definition of Done
- signup trigger works for both roles
- RLS is enabled and verified
- storage buckets and policies work
- auth redirect URLs are configured
- frontend environment variables point to the Supabase project
- basic creator/brand test accounts can sign in successfully
