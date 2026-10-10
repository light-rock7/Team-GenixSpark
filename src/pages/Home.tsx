import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Palette,
  FileText,
  Search,
  Eye,
  Layers,
  Cpu,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';

export const Home: React.FC = () => {
  const { user, isConfigured } = useAuth();

  return (
    <div className="flex flex-col">
      {/* Top Banner if Supabase is unconfigured */}
      {!isConfigured && (
        <div className="bg-amber-500/10 border-b border-amber-200 px-4 py-2.5 text-center text-xs text-amber-900 font-medium">
          <span className="font-bold">Developer Notice:</span> Supabase environment variables are missing. The landing page is running in preview mode. Set <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">VITE_SUPABASE_URL</code> and <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">VITE_SUPABASE_PUBLISHABLE_KEY</code> in <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">.env.local</code> to activate authentication.
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white pt-20 pb-28 sm:pt-28 sm:pb-36">
        {/* Subtle decorative glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-violet-600/20 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[350px] h-[250px] bg-indigo-500/15 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-semibold uppercase tracking-wider mb-8">
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <span>Stage 1 Frontend Foundation Active</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto text-balance leading-tight">
            The AI Content Creator <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-300 to-indigo-300">
              Marketplace
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Connect verified prompt engineers and generative AI artists with forward-thinking brands.
            Transparent workflows, verifiable AI asset licensing, and structured creative briefs.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            {user ? (
              <Link to="/dashboard">
                <Button
                  size="lg"
                  variant="primary"
                  className="bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-600/30"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/auth?mode=signup">
                  <Button
                    size="lg"
                    variant="primary"
                    className="bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-600/30"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Join as Creator or Brand
                  </Button>
                </Link>
                <Link to="/auth?mode=login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-slate-800/80 hover:bg-slate-800 text-white border-slate-700"
                  >
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Quick stats / Highlights */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-10 border-t border-slate-800/80 text-left">
            <div className="p-3">
              <div className="text-xs text-violet-400 font-semibold uppercase tracking-wider">Pillar 1</div>
              <div className="text-sm font-bold text-slate-100 mt-1">Creator Portfolios</div>
              <div className="text-xs text-slate-400 mt-0.5">Showcase generative styles &amp; LoRAs</div>
            </div>
            <div className="p-3">
              <div className="text-xs text-violet-400 font-semibold uppercase tracking-wider">Pillar 2</div>
              <div className="text-sm font-bold text-slate-100 mt-1">Creative Briefs</div>
              <div className="text-xs text-slate-400 mt-0.5">Structured brand production specs</div>
            </div>
            <div className="p-3">
              <div className="text-xs text-violet-400 font-semibold uppercase tracking-wider">Pillar 3</div>
              <div className="text-sm font-bold text-slate-100 mt-1">Creator Discovery</div>
              <div className="text-xs text-slate-400 mt-0.5">Filter by AI toolstack and domain</div>
            </div>
            <div className="p-3">
              <div className="text-xs text-violet-400 font-semibold uppercase tracking-wider">Pillar 4</div>
              <div className="text-sm font-bold text-slate-100 mt-1">Workflow Transparency</div>
              <div className="text-xs text-slate-400 mt-0.5">Verifiable prompt &amp; delivery logs</div>
            </div>
          </div>
        </div>
      </section>

      {/* Marketplace Pillars Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-violet-600 uppercase tracking-widest">
              Core Architecture
            </h2>
            <p className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Built for the Generative Media Economy
            </p>
            <p className="mt-4 text-slate-600 text-sm sm:text-base leading-relaxed">
              Traditional freelance sites fail to address generative AI nuances such as prompt reproducibility, model attribution, and commercial weights licensing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Feature 1: AI Creator Portfolios */}
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 hover:border-violet-300 transition-colors duration-200">
              <div className="w-12 h-12 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center mb-6">
                <Palette className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                1. AI Creator Portfolios
              </h3>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                Creators exhibit interactive galleries organized by AI toolchain (Flux, Stable Diffusion, Midjourney, ComfyUI pipelines). Each work showcases style consistency, negative prompting strategies, and custom fine-tunes without exposing proprietary secret sauce.
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-600">
                <span className="px-2.5 py-1 bg-white rounded-md border border-slate-200">Custom LoRAs</span>
                <span className="px-2.5 py-1 bg-white rounded-md border border-slate-200">Video Generation</span>
                <span className="px-2.5 py-1 bg-white rounded-md border border-slate-200">3D Neural Assets</span>
              </div>
            </div>

            {/* Feature 2: Brand Creative Briefs */}
            <div id="briefs" className="p-8 rounded-2xl bg-slate-50 border border-slate-200 hover:border-violet-300 transition-colors duration-200">
              <div className="w-12 h-12 rounded-xl bg-slate-900 text-violet-300 flex items-center justify-center mb-6">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                2. Brand Creative Briefs
              </h3>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                Brands publish targeted briefs specifying exact aspect ratios, commercial licensing criteria, target resolution, and model constraints. Clear milestones eliminate scope creep and set unambiguous deliverables for rapid turnaround.
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-600">
                <span className="px-2.5 py-1 bg-white rounded-md border border-slate-200">Commercial Usage Rights</span>
                <span className="px-2.5 py-1 bg-white rounded-md border border-slate-200">Structured Deliverables</span>
                <span className="px-2.5 py-1 bg-white rounded-md border border-slate-200">Escrow Milestones</span>
              </div>
            </div>

            {/* Feature 3: Creator Discovery */}
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 hover:border-violet-300 transition-colors duration-200">
              <div className="w-12 h-12 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center mb-6">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                3. Precision Creator Discovery
              </h3>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                Filter creator talent by specific models, render engines, domain niches (e.g. fashion editorial, sci-fi concept art, product mockup rendering), turnaround times, and verified customer evaluations.
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-600">
                <span className="px-2.5 py-1 bg-white rounded-md border border-slate-200">Toolstack Filtering</span>
                <span className="px-2.5 py-1 bg-white rounded-md border border-slate-200">Niche Specialization</span>
                <span className="px-2.5 py-1 bg-white rounded-md border border-slate-200">Verified Profiles</span>
              </div>
            </div>

            {/* Feature 4: Workflow Transparency */}
            <div id="workflows" className="p-8 rounded-2xl bg-slate-50 border border-slate-200 hover:border-violet-300 transition-colors duration-200">
              <div className="w-12 h-12 rounded-xl bg-slate-900 text-violet-300 flex items-center justify-center mb-6">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                4. Workflow Transparency &amp; Provenance
              </h3>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                End-to-end visibility throughout the creative cycle. Clients inspect seed reproducibility, pipeline revisions, and licensing certificates. Transparent audits protect both brand safety and creator intellectual integrity.
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-600">
                <span className="px-2.5 py-1 bg-white rounded-md border border-slate-200">Seed Logs</span>
                <span className="px-2.5 py-1 bg-white rounded-md border border-slate-200">Audit Trails</span>
                <span className="px-2.5 py-1 bg-white rounded-md border border-slate-200">IP Transfer Safe</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shared Architecture / Hackathon Stage 1 Integration Info */}
      <section className="py-16 bg-slate-900 text-white border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-mono mb-4 border border-slate-700">
              <Cpu className="w-3.5 h-3.5 text-violet-400" />
              <span>Multi-Developer Architecture Contract</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold">
              Clean Foundation for Parallel Feature Delivery
            </h2>
            <p className="mt-3 text-sm text-slate-400 leading-relaxed">
              Stage 1 defines the frontend foundation, routing contract, and Supabase authentication gateway. The module boundaries ensure our teammates can extend their features independently:
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="p-5 rounded-xl bg-slate-800/60 border border-slate-700/80">
              <div className="flex items-center gap-2 text-violet-400 font-semibold mb-2">
                <Layers className="w-4 h-4" />
                <span>Member 2 Modules</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Owns creator portfolio management, prompt showcases, and brief application submission flows inside <code className="text-violet-300 font-mono">DashboardCreator</code>.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-800/60 border border-slate-700/80">
              <div className="flex items-center gap-2 text-violet-400 font-semibold mb-2">
                <Layers className="w-4 h-4" />
                <span>Member 3 Modules</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Owns brand creative brief posting, creator discovery search filters, and application review inside <code className="text-violet-300 font-mono">DashboardBrand</code>.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-800/60 border border-slate-700/80">
              <div className="flex items-center gap-2 text-violet-400 font-semibold mb-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Member 4 Modules</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Owns Supabase schema provisioning, automated profile triggers on <code className="text-violet-300 font-mono">auth.users</code>, and Row Level Security policies on <code className="text-violet-300 font-mono">public.user_profiles</code>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action section */}
      <section className="py-20 bg-gradient-to-tr from-violet-900 via-indigo-900 to-slate-900 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to shape the future of AI creativity?
          </h2>
          <p className="mt-4 text-violet-200 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Create an account today as an AI Creator to showcase your generation capabilities, or as a Brand to commission top-tier generative assets.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/auth?mode=signup">
              <Button
                size="lg"
                variant="primary"
                className="bg-white text-slate-900 hover:bg-slate-100 shadow-xl"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Create an Account
              </Button>
            </Link>
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 text-xs text-violet-300">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-violet-400" />
              Supabase Auth Integrated
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-violet-400" />
              Role-Based Routing
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-violet-400" />
              SPA Fallback Ready
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};
