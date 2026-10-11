import React from 'react';

import { Link } from 'react-router-dom';

import {

  Sparkles,

  ArrowRight,

  Palette,

  FileText,

  Search,

  Eye,

  Sliders,

  CheckCircle2,

  Workflow,

} from 'lucide-react';

import { useAuth } from '../hooks/useAuth';

import { getButtonClassName } from '../components/ui/Button';



export const Home: React.FC = () => {

  const { user, isConfigured } = useAuth();



  return (

    <div className="flex flex-col">

      {/* Top Banner: shown only in development if Supabase credentials are missing */}

      {!isConfigured && import.meta.env.DEV && (

        <div className="bg-amber-500/10 border-b border-amber-200 px-4 py-2.5 text-center text-xs text-amber-900 font-medium">

          <span className="font-bold">[Dev Environment]:</span> Supabase credentials not found in <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">.env.local</code>. Authentication is running in preview mode.

        </div>

      )}



      {/* Hero Section */}

      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white pt-20 pb-28 sm:pt-28 sm:pb-36">

        {/* Subtle decorative glow */}

        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-violet-600/20 blur-[130px] rounded-full pointer-events-none" />

        <div className="absolute top-1/3 right-1/4 w-[350px] h-[250px] bg-indigo-500/15 blur-[100px] rounded-full pointer-events-none" />



        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-semibold uppercase tracking-wider mb-8">

            <Sparkles className="w-3.5 h-3.5 text-violet-400" />

            <span>AI Content Creator Marketplace</span>

          </div>



          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto text-balance leading-tight">

            Connect AI Creators with <br />

            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-300 to-indigo-300">

              Creative Production Briefs

            </span>

          </h1>



          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">

            A collaborative workspace connecting prompt engineers and generative artists with brands.

            Explore creator portfolios, publish structured creative briefs, and collaborate with transparent workflow logs.

          </p>



          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">

            {user ? (

              <Link

                to="/dashboard"

                className={getButtonClassName({

                  variant: 'primary',

                  size: 'lg',

                  className: 'bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-600/30',

                })}

              >

                <span className="flex items-center gap-2">

                  Go to Dashboard

                  <ArrowRight className="w-4 h-4" />

                </span>

              </Link>

            ) : (

              <>

                <Link
                  to="/auth?mode=signup&role=creator"
                  className={getButtonClassName({
                    variant: 'primary',
                    size: 'lg',
                    className: 'bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-600/30',
                  })}
                >
                  <span className="flex items-center gap-2">
                    Join as Creator
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
                <Link
                  to="/auth?mode=signup&role=brand"
                  className={getButtonClassName({
                    variant: 'secondary-dark',
                    size: 'lg',
                  })}
                >
                  <span className="flex items-center gap-2">
                    Join as Brand
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
</>

            )}

          </div>



          {/* Quick Pillars */}

          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-10 border-t border-slate-800/80 text-left">

            <div className="p-3">

              <div className="text-xs text-violet-400 font-semibold uppercase tracking-wider">Pillar 1</div>

              <div className="text-sm font-bold text-slate-100 mt-1">Creator Portfolios</div>

              <div className="text-xs text-slate-400 mt-0.5">Showcase generative styles &amp; sample runs</div>

            </div>

            <div className="p-3">

              <div className="text-xs text-violet-400 font-semibold uppercase tracking-wider">Pillar 2</div>

              <div className="text-sm font-bold text-slate-100 mt-1">Creative Briefs</div>

              <div className="text-xs text-slate-400 mt-0.5">Structured production requirements</div>

            </div>

            <div className="p-3">

              <div className="text-xs text-violet-400 font-semibold uppercase tracking-wider">Pillar 3</div>

              <div className="text-sm font-bold text-slate-100 mt-1">Creator Discovery</div>

              <div className="text-xs text-slate-400 mt-0.5">Filter by AI toolchain and domains</div>

            </div>

            <div className="p-3">

              <div className="text-xs text-violet-400 font-semibold uppercase tracking-wider">Pillar 4</div>

              <div className="text-sm font-bold text-slate-100 mt-1">Workflow Transparency</div>

              <div className="text-xs text-slate-400 mt-0.5">Inspect prompt logs and revisions</div>

            </div>

          </div>

        </div>

      </section>



      {/* Marketplace Features Section */}

      <section id="features" className="py-20 bg-white">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-3xl mx-auto mb-16">

            <h2 className="text-xs font-bold text-violet-600 uppercase tracking-widest">

              Core Capabilities

            </h2>

            <p className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">

              Purpose-Built for Generative Media Collaboration

            </p>

            <p className="mt-4 text-slate-600 text-sm sm:text-base leading-relaxed">

              Streamline the lifecycle of generative content from initial prompt experimentation to final asset delivery.

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

                Creators build interactive showcases featuring prompt recipes, model specializations (Flux, Stable Diffusion, Midjourney, ComfyUI), and high-resolution output galleries with documented iteration parameters.

              </p>

              <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-600">

                <span className="px-2.5 py-1 bg-white rounded-md border border-slate-200">Style Consistency</span>

                <span className="px-2.5 py-1 bg-white rounded-md border border-slate-200">Prompt Workflows</span>

                <span className="px-2.5 py-1 bg-white rounded-md border border-slate-200">Visual Galleries</span>

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

                Brands publish targeted production briefs specifying deliverable dimensions, target resolutions, aesthetic references, and project milestones, giving creators clear requirements upfront.

              </p>

              <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-600">

                <span className="px-2.5 py-1 bg-white rounded-md border border-slate-200">Dimension Specs</span>

                <span className="px-2.5 py-1 bg-white rounded-md border border-slate-200">Asset Guidelines</span>

                <span className="px-2.5 py-1 bg-white rounded-md border border-slate-200">Delivery Milestones</span>

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

                Explore creator profiles filtered by specific generative tools, aesthetic categories (product design, fantasy art, editorial, 3D concepting), and delivery bandwidth.

              </p>

              <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-600">

                <span className="px-2.5 py-1 bg-white rounded-md border border-slate-200">Tool Filtering</span>

                <span className="px-2.5 py-1 bg-white rounded-md border border-slate-200">Category Tagging</span>

                <span className="px-2.5 py-1 bg-white rounded-md border border-slate-200">Direct Brief Invites</span>

              </div>

            </div>



            {/* Feature 4: Workflow Transparency */}

            <div id="workflows" className="p-8 rounded-2xl bg-slate-50 border border-slate-200 hover:border-violet-300 transition-colors duration-200">

              <div className="w-12 h-12 rounded-xl bg-slate-900 text-violet-300 flex items-center justify-center mb-6">

                <Eye className="w-6 h-6" />

              </div>

              <h3 className="text-xl font-bold text-slate-900">

                4. Workflow Transparency

              </h3>

              <p className="mt-3 text-sm text-slate-600 leading-relaxed">

                Collaborate with clear visibility into revision histories, generation logs, and prompt evolution so both parties have full clarity throughout creative iterations.

              </p>

              <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-600">

                <span className="px-2.5 py-1 bg-white rounded-md border border-slate-200">Revision Logs</span>

                <span className="px-2.5 py-1 bg-white rounded-md border border-slate-200">Prompt History</span>

                <span className="px-2.5 py-1 bg-white rounded-md border border-slate-200">Milestone Reviews</span>

              </div>

            </div>

          </div>

        </div>

      </section>



      {/* How It Works Section */}

      <section className="py-16 bg-slate-900 text-white border-t border-slate-800">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="max-w-3xl mx-auto text-center">

            <h2 className="text-2xl sm:text-3xl font-bold">

              How the Platform Works

            </h2>

            <p className="mt-3 text-sm text-slate-400 leading-relaxed">

              Designed to make commissioning generative media straightforward for both sides of the creative engagement.

            </p>

          </div>



          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">

            <div className="p-6 rounded-xl bg-slate-800/60 border border-slate-700/80">

              <div className="w-10 h-10 rounded-lg bg-violet-600/20 text-violet-400 flex items-center justify-center mb-4">

                <Palette className="w-5 h-5" />

              </div>

              <h3 className="text-base font-semibold text-slate-100 mb-2">

                1. Portfolios &amp; Showcases

              </h3>

              <p className="text-xs text-slate-300 leading-relaxed">

                Creators curate portfolios detailing the models, prompt frameworks, and techniques used to generate each set of visual assets.

              </p>

            </div>



            <div className="p-6 rounded-xl bg-slate-800/60 border border-slate-700/80">

              <div className="w-10 h-10 rounded-lg bg-violet-600/20 text-violet-400 flex items-center justify-center mb-4">

                <Sliders className="w-5 h-5" />

              </div>

              <h3 className="text-base font-semibold text-slate-100 mb-2">

                2. Briefs &amp; Proposals

              </h3>

              <p className="text-xs text-slate-300 leading-relaxed">

                Brands publish clear project briefs with format specifications. Creators submit targeted proposals with relevant sample styles.

              </p>

            </div>



            <div className="p-6 rounded-xl bg-slate-800/60 border border-slate-700/80">

              <div className="w-10 h-10 rounded-lg bg-violet-600/20 text-violet-400 flex items-center justify-center mb-4">

                <Workflow className="w-5 h-5" />

              </div>

              <h3 className="text-base font-semibold text-slate-100 mb-2">

                3. Deliveries &amp; Reviews

              </h3>

              <p className="text-xs text-slate-300 leading-relaxed">

                Deliverables are uploaded alongside workflow notes. Revisions are tracked until final asset handoff.

              </p>

            </div>

          </div>

        </div>

      </section>



      {/* Call to action section */}

      <section className="py-20 bg-gradient-to-tr from-violet-900 via-indigo-900 to-slate-900 text-white text-center">

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">

            Ready to explore AI creative collaboration?

          </h2>

          <p className="mt-4 text-violet-200 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">

            Create an account today as an AI Creator to build your portfolio, or as a Brand to publish creative briefs.

          </p>



          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">

            <Link

              to="/auth?mode=signup&role=creator"

              className={getButtonClassName({

                variant: 'primary',

                size: 'lg',

                className: 'bg-violet-600 text-white hover:bg-violet-700 shadow-xl',
              })}

            >

              <span className="flex items-center gap-2">

                Create an Account

                <ArrowRight className="w-4 h-4" />

              </span>

            </Link>

          </div>



          <div className="mt-8 flex items-center justify-center gap-6 text-xs text-violet-300">

            <span className="flex items-center gap-1.5">

              <CheckCircle2 className="w-3.5 h-3.5 text-violet-400" />

              Role-Based Dashboards

            </span>

            <span className="flex items-center gap-1.5">

              <CheckCircle2 className="w-3.5 h-3.5 text-violet-400" />

              Structured Creative Briefs

            </span>

            <span className="flex items-center gap-1.5">

              <CheckCircle2 className="w-3.5 h-3.5 text-violet-400" />

              Transparent Asset Reviews

            </span>

          </div>

        </div>

      </section>

    </div>

  );

};
