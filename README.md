# GenixSpark — AI Content Creator Marketplace
> **Stage 1: Frontend Foundation & Authentication Gateway**

GenixSpark is an AI Content Creator Marketplace engineered to connect prompt engineers and generative AI artists with forward-thinking brands. This repository contains the frontend foundation, role-based routing architecture, and Supabase authentication gateway delivered in Stage 1.

---

## 🚀 Stage 1 Highlights & Capabilities

- **Modern Tech Stack**: React 19, TypeScript, Vite, Tailwind CSS v4, and `@supabase/supabase-js`.
- **Role-Based Client Routing**: Dedicated shells for **AI Creators** (`/dashboard` / `/dashboard/creator`) and **Brands** (`/dashboard` / `/dashboard/brand`).
- **Resilient Environment Fallback**: The landing page and platform shells render gracefully without crashing even if Supabase environment variables are missing, presenting clear setup notices instead of fake sessions.
- **Contract-Strict Architecture**: User roles are verified strictly against `public.user_profiles`, never trusting editable client metadata for authorization.
- **SPA Fallback Ready**: Complete `vercel.json` SPA rewrite configuration ensuring seamless page refreshes on nested routes.

---

## 📂 Project Architecture

```text
src/
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx             # Responsive navigation with session & role display
│   │   └── AppLayout.tsx          # Shared marketplace shell with header and footer
│   ├── ui/
│   │   ├── Button.tsx             # Accessible button with states, sizes & loading spinners
│   │   ├── Input.tsx              # Form input with icon support, error & helper states
│   │   └── LoadingState.tsx       # Reusable full-page and inline loading indicator
│   └── auth/
│       ├── LoginForm.tsx          # Email/password login with credential error handling
│       ├── SignupForm.tsx         # Signup with display name, role picker & email confirm alert
│       └── ProtectedRoute.tsx     # Route guard with session verification & schema retry UI
├── context/
│   └── AuthContext.tsx            # Supabase auth session, profile loading & state lifecycle
├── hooks/
│   └── useAuth.ts                 # React hook for consuming authentication state
├── lib/
│   └── supabase.ts                # Safe client initialization with environment variable check
├── pages/
│   ├── Home.tsx                   # Landing page detailing the 4 marketplace pillars
│   ├── Auth.tsx                   # Unified sign-in and registration portal
│   ├── AuthCallback.tsx           # PKCE and token callback exchange handler
│   ├── DashboardCreator.tsx       # Creator dashboard shell with honest empty states
│   ├── DashboardBrand.tsx         # Brand dashboard shell with honest empty states
│   └── NotFound.tsx               # Informative 404 page with route directory
├── styles/
│   └── index.css                  # Tailwind CSS v4 setup and typography variables
├── router.tsx                     # React Router configuration with protected dashboard entry
├── App.tsx                        # Root application component
└── main.tsx                       # React DOM entrypoint
```

---

## 🛠️ Local Development Setup

### 1. Prerequisites
- **Node.js**: v18+ or v20+ (recommended v22+)
- **npm**: v9+ (tested with v11)

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Populate `.env.local` with your Supabase project API credentials:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key-here
```

> **Security Note:** Never include service-role keys, database passwords, or AI API secret keys in frontend browser code or `.env.local`. Only use the publishable / anon client key.

### 4. Configure Supabase Redirect URLs
In your **Supabase Dashboard** > **Authentication** > **URL Configuration**:
- **Site URL**: `http://localhost:5173`
- **Redirect URLs (Allowed Callback URLs)**:
  - `http://localhost:5173/auth/callback`
  - `https://your-production-domain.vercel.app/auth/callback`

### 5. Run Development Server
```bash
npm run dev
```
Open your browser to `http://localhost:5173`.

---

## 📜 Available NPM Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Vite development server with Hot Module Replacement (HMR) |
| `npm run build` | Runs TypeScript compilation check (`tsc -b`) and generates production bundle in `dist/` |
| `npm run lint` | Runs code quality and lint analysis |
| `npm run preview` | Serves the generated production build locally for verification |

---

## 🤝 Multi-Developer Module Boundaries

The project architecture has been specifically prepared so that team members can extend their features in parallel without merge conflicts:

| Member | Feature Domain | Integration Entry Point |
| :--- | :--- | :--- |
| **Member 1** *(You)* | Frontend Foundation & Auth Integration | `src/` core structure, `AuthContext`, `router.tsx` |
| **Member 2** | Creator Portfolios, Models & Applications | `src/pages/DashboardCreator.tsx` & portfolio components |
| **Member 3** | Brand Creative Briefs & Creator Discovery | `src/pages/DashboardBrand.tsx` & brief/search components |
| **Member 4** | Supabase Schema, Automated Triggers & RLS | `public.user_profiles` schema and DB functions |

---

## 🔒 Exact Backend Contract Needed from Member 4

The frontend code strictly respects the agreed database contract. Member 4 is responsible for creating and securing the following in Supabase:

### 1. Table Schema: `public.user_profiles`
```sql
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('creator', 'brand')),
  display_name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);
```

### 2. Automated Profile Provisioning Trigger
When a user signs up via `supabase.auth.signUp()`, the frontend passes `display_name` and `role` inside `options.data`. Member 4 should attach a database trigger to `auth.users` to provision the profile automatically:

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, role, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'role', 'creator'),
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 3. Row Level Security (RLS) Policies
```sql
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view profiles
CREATE POLICY "Allow authenticated read of user profiles"
  ON public.user_profiles
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow users to update their own profile
CREATE POLICY "Allow users to update own profile"
  ON public.user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);
```

> If `public.user_profiles` is not yet provisioned, the frontend gracefully detects this and displays a clear diagnostic card with a **"Retry Profile Check"** button and sign-out option.

---

## 🌐 Production SPA Deployment
A `vercel.json` file is included in the project root:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```
This ensures nested paths like `/dashboard`, `/auth`, `/dashboard/creator`, and `/auth/callback` will not return 404 when refreshed in production.
