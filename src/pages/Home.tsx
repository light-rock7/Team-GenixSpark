import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  FileText,
  Palette,
  Search,
  Sparkles,
  Workflow,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { getButtonClassName } from '../components/ui/Button';

const tools = ['Midjourney', 'Flux', 'ComfyUI', 'Runway', 'Stable Diffusion'];

export const Home: React.FC = () => {
  const { user, isConfigured } = useAuth();

  return (
    <div>
      {!isConfigured && import.meta.env.DEV && (
        <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-[11px] font-medium text-amber-800">
          Development mode — add Supabase credentials in <code className="rounded bg-amber-100 px-1 py-0.5">.env.local</code> to enable live authentication.
        </div>
      )}

      <section className="relative overflow-hidden border-b border-slate-200/80 bg-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(109,74,255,.10),transparent_26rem),radial-gradient(circle_at_85%_30%,rgba(15,23,42,.04),transparent_24rem)]" />
        <div className="page-shell relative grid gap-14 py-16 sm:py-20 lg:grid-cols-[1.02fr_.98fr] lg:items-center lg:py-24">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-violet-700">
              <Sparkles className="h-3.5 w-3.5" />
              Built for AI-native creative production
            </div>

            <h1 className="mt-6 text-balance text-[44px] font-extrabold leading-[1.02] tracking-[-0.055em] text-slate-950 sm:text-6xl lg:text-[68px]">
              Hire AI creators by the work <span className="text-[#6d4aff]">and the workflow.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-[17px]">
              GenixSpark helps brands discover generative creators through portfolio quality, tool fluency, and transparent production workflows — not generic freelancer profiles.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {user ? (
                <Link to="/dashboard" className={getButtonClassName({ variant: 'primary', size: 'lg' })}>
                  Open workspace <ArrowRight className="h-4 w-4" />
                </Link>
              ) : (
                <>
                  <Link to="/auth?mode=signup" className={getButtonClassName({ variant: 'primary', size: 'lg' })}>
                    Join as creator or brand <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link to="/auth?mode=login" className={getButtonClassName({ variant: 'outline', size: 'lg' })}>
                    Sign in
                  </Link>
                </>
              )}
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-semibold text-slate-500">
              {['AI-specific portfolios', 'Workflow transparency', 'Structured briefs'].map((item) => (
                <span key={item} className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> {item}
                </span>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[590px] lg:mx-0 lg:ml-auto">
            <div className="absolute -inset-8 rounded-[44px] bg-violet-100/60 blur-3xl" />
            <div className="relative rounded-[30px] border border-slate-200 bg-[#0d1324] p-3 shadow-[0_32px_80px_rgba(15,23,42,.20)]">
              <div className="soft-grid overflow-hidden rounded-[23px] border border-white/10 bg-[radial-gradient(circle_at_20%_0%,rgba(109,74,255,.34),transparent_34%),linear-gradient(145deg,#11182c,#0b1020_58%,#16143a)] p-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-violet-300">Creator signal</p>
                    <p className="mt-1 text-sm font-bold text-white">AI product visualization</p>
                  </div>
                  <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-2.5 py-1 text-[9px] font-bold text-emerald-200">Available</span>
                </div>

                <div className="mt-8 grid grid-cols-[72px_1fr] gap-4">
                  <div className="h-[72px] rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_30%_20%,#bda8ff,transparent_35%),linear-gradient(135deg,#6d4aff,#151833)] shadow-inner" />
                  <div>
                    <p className="text-lg font-extrabold tracking-[-0.03em] text-white">Aria Vale</p>
                    <p className="mt-1 text-xs leading-5 text-slate-300">Commercial AI artist · product worlds & campaign systems</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {tools.slice(0, 3).map((tool) => (
                        <span key={tool} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[9px] font-semibold text-slate-200">{tool}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-2">
                  <div className="rounded-xl border border-white/10 bg-white/[.055] p-3">
                    <p className="text-[9px] uppercase tracking-[0.13em] text-slate-400">Portfolio</p>
                    <p className="mt-1 text-base font-extrabold text-white">18</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/[.055] p-3">
                    <p className="text-[9px] uppercase tracking-[0.13em] text-slate-400">Tool depth</p>
                    <p className="mt-1 text-base font-extrabold text-white">7</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/[.055] p-3">
                    <p className="text-[9px] uppercase tracking-[0.13em] text-slate-400">Match</p>
                    <p className="mt-1 text-base font-extrabold text-white">92%</p>
                  </div>
                </div>

                <div className="mt-3 rounded-2xl border border-violet-300/15 bg-violet-300/[.07] p-4">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-violet-200">
                    <Workflow className="h-3.5 w-3.5" /> Workflow proof
                  </div>
                  <p className="mt-2 text-xs leading-5 text-slate-300">Flux base generation → ComfyUI control workflow → selective retouching → brand-safe delivery package.</p>
                </div>
              </div>
            </div>

            <div className="relative -mt-5 ml-auto w-[88%] rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_20px_50px_rgba(15,23,42,.13)] sm:w-[78%]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-violet-600">Open creative brief</p>
                  <p className="mt-1 text-sm font-extrabold tracking-[-0.02em] text-slate-950">Launch visuals for a premium skincare line</p>
                </div>
                <span className="whitespace-nowrap rounded-full bg-slate-950 px-2.5 py-1 text-[9px] font-bold text-white">₹45k–₹70k</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5 text-[9px] font-semibold text-slate-500">
                <span className="rounded-full bg-slate-100 px-2.5 py-1">Flux</span>
                <span className="rounded-full bg-slate-100 px-2.5 py-1">Product visuals</span>
                <span className="rounded-full bg-slate-100 px-2.5 py-1">Commercial rights</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="creators" className="bg-[#f7f8fb] py-20 sm:py-24">
        <div className="page-shell">
          <div className="grid gap-10 lg:grid-cols-[.75fr_1.25fr] lg:items-end">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet-600">For AI creators</p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.04em] text-slate-950 sm:text-4xl">Your portfolio should explain why your process is valuable.</h2>
            </div>
            <p className="max-w-2xl text-sm leading-6 text-slate-600 lg:ml-auto">
              Show finished work alongside tools, prompt direction, workflow decisions, and commercial readiness. Brands get evidence; creators get discovered for the right reasons.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              { icon: Palette, title: 'Portfolio with provenance', text: 'Pair visual work with the AI tools, skills, and workflow behind it.' },
              { icon: Search, title: 'Discovery by capability', text: 'Become searchable by toolchain, specialization, availability, and commercial fit.' },
              { icon: Eye, title: 'Trust through transparency', text: 'Give brands enough process detail to evaluate repeatability and production confidence.' },
            ].map(({ icon: Icon, title, text }) => (
              <article key={title} className="surface-card rounded-2xl p-6 sm:p-7">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-700"><Icon className="h-5 w-5" /></div>
                <h3 className="mt-5 text-base font-extrabold tracking-[-0.02em] text-slate-950">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="brands" className="border-y border-slate-200/80 bg-white py-20 sm:py-24">
        <div className="page-shell grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="rounded-[28px] border border-slate-200 bg-slate-950 p-6 text-white shadow-[0_24px_60px_rgba(15,23,42,.14)] sm:p-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet-300">A better creative brief</p>
            <h3 className="mt-3 text-2xl font-extrabold tracking-[-0.035em]">Define the production problem, not just the aesthetic.</h3>
            <div className="mt-7 space-y-3">
              {[
                ['Required toolchain', 'Flux · ComfyUI · Photoshop'],
                ['Deliverables', '8 campaign images · 4:5 and 9:16'],
                ['Usage rights', 'Paid social · 6 months'],
                ['Workflow expectation', 'Prompt/process summary included'],
              ].map(([label, value]) => (
                <div key={label} className="flex items-start justify-between gap-6 rounded-xl border border-white/10 bg-white/[.055] px-4 py-3">
                  <span className="text-xs text-slate-400">{label}</span>
                  <span className="text-right text-xs font-semibold text-slate-100">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="max-w-xl lg:pl-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet-600">For brands & agencies</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.04em] text-slate-950 sm:text-4xl">Find creators who can actually execute the brief.</h2>
            <p className="mt-5 text-sm leading-7 text-slate-600">Structure requirements around AI tools, deliverables, usage rights, budget, and timeline. Then evaluate creators against evidence in their profiles and portfolios.</p>
            <div className="mt-7 space-y-3">
              {['Fewer ambiguous proposals', 'More relevant creator discovery', 'Clearer workflow expectations'].map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" /> {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="workflow" className="bg-[#0b1020] py-20 text-white sm:py-24">
        <div className="page-shell">
          <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet-300">GenixSpark differentiator</p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.04em] sm:text-4xl">Workflow transparency turns AI output into professional evidence.</h2>
              <p className="mt-5 max-w-xl text-sm leading-7 text-slate-400">The platform surfaces how creators work — the toolchain, prompt direction, production steps, and rights context that help brands judge reliability.</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { icon: Workflow, title: 'Process summaries', text: 'Explain the major generation and refinement stages.' },
                { icon: FileText, title: 'Prompt direction', text: 'Share enough creative logic without exposing sensitive IP.' },
                { icon: Search, title: 'Explainable matching', text: 'Connect brief requirements to creator skills and tool fluency.' },
                { icon: Eye, title: 'Commercial context', text: 'Make publication status and usage-rights context visible.' },
              ].map(({ icon: Icon, title, text }) => (
                <div key={title} className="rounded-2xl border border-white/10 bg-white/[.045] p-5">
                  <Icon className="h-5 w-5 text-violet-300" />
                  <h3 className="mt-4 text-sm font-bold text-white">{title}</h3>
                  <p className="mt-1.5 text-xs leading-5 text-slate-400">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="page-shell">
          <div className="overflow-hidden rounded-[30px] border border-violet-200 bg-[radial-gradient(circle_at_80%_20%,rgba(109,74,255,.16),transparent_24rem),#f7f5ff] px-6 py-12 sm:px-10 lg:flex lg:items-center lg:justify-between lg:px-14">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet-700">Ready to build credibility?</p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.04em] text-slate-950">Create a profile brands can evaluate with confidence.</h2>
            </div>
            <Link to={user ? '/dashboard' : '/auth?mode=signup'} className={`${getButtonClassName({ variant: 'primary', size: 'lg' })} mt-6 lg:mt-0`}>
              {user ? 'Open workspace' : 'Join GenixSpark'} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};