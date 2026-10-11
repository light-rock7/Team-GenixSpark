import React, { useMemo, useState } from 'react';
import { AlertCircle, ArrowLeft, Bot, CalendarDays, CheckCircle2, IndianRupee, Sparkles, WandSparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { TagInput } from '../components/creator/TagInput';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useBrandBriefs } from '../hooks/useBrandBriefs';
import { buildBrandBrief } from '../services/briefBuilderService';
import { calculateBriefReadiness } from '../services/briefService';
import type { BriefBuilderSuggestion, CreativeBriefCreate } from '../types/brief';

const AI_TOOL_SUGGESTIONS = ['Midjourney', 'Stable Diffusion', 'Flux', 'ComfyUI', 'Runway', 'ChatGPT', 'DALL·E', 'Adobe Firefly'];
const SKILL_SUGGESTIONS = ['Prompt Engineering', 'Art Direction', 'Image Generation', 'Video Generation', 'LoRA Training', 'Retouching', 'Storyboarding', 'Concept Design'];
const CATEGORIES = ['Advertising', 'Product Visuals', 'Fashion', 'Beauty', 'Social Content', 'Concept Art', 'Architecture', 'Motion', 'Editorial', 'Other'];
const CONTENT_TYPES = ['Image', 'Video', 'Animation', 'Graphics', 'Product Visuals', 'Social Content', 'Concept Art', 'Mixed Media', 'Other'];
const ASPECT_RATIOS = ['1:1', '4:5', '9:16', '16:9', '3:2', '2:3', 'Flexible'];

const emptyBrief: CreativeBriefCreate = {
  title: '',
  description: '',
  category: null,
  content_type: null,
  style: null,
  required_tools: [],
  required_skills: [],
  deliverables: '',
  aspect_ratio: null,
  usage_rights: '',
  budget_min: null,
  budget_max: null,
  currency: 'INR',
  deadline: null,
  reference_notes: '',
  status: 'open',
};

const preferExisting = (current: string | null | undefined, suggestion: string | null | undefined) => {
  const currentValue = current?.trim();
  return currentValue ? current : (suggestion || current || null);
};

export const BrandBriefNew: React.FC = () => {
  const navigate = useNavigate();
  const { create, saving } = useBrandBriefs();
  const [form, setForm] = useState<CreativeBriefCreate>(emptyBrief);
  const [error, setError] = useState<string | null>(null);
  const [roughIdea, setRoughIdea] = useState('');
  const [builderSuggestion, setBuilderSuggestion] = useState<BriefBuilderSuggestion | null>(null);
  const [builderAssumptions, setBuilderAssumptions] = useState<string[]>([]);
  const [builderError, setBuilderError] = useState<string | null>(null);
  const [building, setBuilding] = useState(false);
  const [builderApplied, setBuilderApplied] = useState(false);

  const readiness = useMemo(() => calculateBriefReadiness(form), [form]);
  const setField = <K extends keyof CreativeBriefCreate>(key: K, value: CreativeBriefCreate[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    setError(null);
  };

  const handleBuildBrief = async () => {
    setBuilderError(null);
    setBuilderApplied(false);
    setBuilding(true);
    try {
      const response = await buildBrandBrief(roughIdea);
      setBuilderSuggestion(response.suggestion);
      setBuilderAssumptions(response.assumptions);
    } catch (err: unknown) {
      setBuilderSuggestion(null);
      setBuilderAssumptions([]);
      setBuilderError(err instanceof Error ? err.message : 'Unable to generate a structured brief.');
    } finally {
      setBuilding(false);
    }
  };

  const applyBuilderSuggestion = () => {
    if (!builderSuggestion) return;
    setForm((current) => ({
      ...current,
      title: current.title.trim() ? current.title : builderSuggestion.title,
      description: current.description.trim() ? current.description : builderSuggestion.description,
      category: preferExisting(current.category, builderSuggestion.category),
      content_type: preferExisting(current.content_type, builderSuggestion.content_type),
      style: preferExisting(current.style, builderSuggestion.style),
      required_tools: current.required_tools.length ? current.required_tools : builderSuggestion.required_tools,
      required_skills: current.required_skills.length ? current.required_skills : builderSuggestion.required_skills,
      deliverables: preferExisting(current.deliverables, builderSuggestion.deliverables),
      aspect_ratio: preferExisting(current.aspect_ratio, builderSuggestion.aspect_ratio),
      usage_rights: preferExisting(current.usage_rights, builderSuggestion.usage_rights),
      reference_notes: preferExisting(current.reference_notes, builderSuggestion.reference_notes),
    }));
    setBuilderApplied(true);
    setError(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    if (!form.title.trim()) return setError('Add a clear title for the brief.');
    if (!form.description.trim()) return setError('Describe the creative problem and desired outcome.');
    if (form.budget_min != null && form.budget_max != null && form.budget_max < form.budget_min) {
      return setError('Maximum budget must be greater than or equal to minimum budget.');
    }

    try {
      const created = await create(form);
      navigate(`/briefs/${created.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to create creative brief.');
    }
  };

  return (
    <div className="min-h-full bg-[#f7f8fb]">
      <div className="page-shell py-8 sm:py-10">
        <Link to="/dashboard/brand" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-950">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to brand workspace
        </Link>

        <div className="mt-5 max-w-3xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-violet-600">Structured creative brief</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-950">Turn a creative need into matchable requirements.</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">Define content type, style, production constraints and AI capability requirements. These same signals power creator discovery and explainable matching.</p>
        </div>

        <section className="mt-7 overflow-hidden rounded-[24px] border border-violet-200 bg-gradient-to-br from-violet-50 via-white to-white shadow-sm">
          <div className="grid gap-0 lg:grid-cols-[1.2fr_.8fr]">
            <div className="p-5 sm:p-7">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white"><Bot className="h-5 w-5" /></div>
                <div>
                  <p className="text-sm font-semibold text-slate-950">AI-Assisted Brief Builder</p>
                  <p className="mt-1 text-[11px] leading-5 text-slate-500">Start with a rough idea. GenixSpark proposes a structured brief you can review before applying it to the form.</p>
                </div>
              </div>

              <textarea
                value={roughIdea}
                onChange={(event) => {
                  setRoughIdea(event.target.value);
                  setBuilderError(null);
                  setBuilderApplied(false);
                }}
                rows={5}
                placeholder="Example: We are launching a premium skincare serum and need cinematic AI visuals for Instagram Reels and paid social. Clean, glossy, futuristic but still human. We want a short hero video plus cutdowns."
                className="mt-5 w-full resize-y rounded-2xl border border-violet-200 bg-white px-4 py-3 text-sm leading-6 text-slate-950 outline-none placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
              />

              {builderError && <p className="mt-3 text-xs font-semibold text-rose-600">{builderError}</p>}
              {builderApplied && <p className="mt-3 text-xs font-semibold text-emerald-700">AI suggestion applied to empty fields. Review every field before publishing.</p>}

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Button type="button" size="sm" isLoading={building} onClick={() => void handleBuildBrief()} leftIcon={<Sparkles className="h-4 w-4" />}>
                  Generate structured brief
                </Button>
                <p className="text-[10px] leading-4 text-slate-400">AI does not set budget or deadline and leaves unsupported commercial terms for you to confirm.</p>
              </div>
            </div>

            <div className="border-t border-violet-100 bg-white/70 p-5 sm:p-7 lg:border-l lg:border-t-0">
              {builderSuggestion ? (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-violet-600">AI draft ready</p>
                  <h2 className="mt-2 text-lg font-semibold tracking-[-0.025em] text-slate-950">{builderSuggestion.title}</h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {builderSuggestion.content_type && <span className="rounded-full bg-violet-50 px-2.5 py-1 text-[10px] font-semibold text-violet-700">{builderSuggestion.content_type}</span>}
                    {builderSuggestion.aspect_ratio && <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-600">{builderSuggestion.aspect_ratio}</span>}
                    {builderSuggestion.required_tools.slice(0, 3).map((tool) => <span key={tool} className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-semibold text-slate-600">{tool}</span>)}
                  </div>
                  {builderSuggestion.style && <p className="mt-4 text-xs leading-5 text-slate-600"><span className="font-semibold text-slate-800">Style:</span> {builderSuggestion.style}</p>}
                  {builderAssumptions.length > 0 && (
                    <div className="mt-4 rounded-xl bg-amber-50 px-3.5 py-3">
                      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-amber-700">Review assumptions</p>
                      <ul className="mt-2 space-y-1 text-[10px] leading-4 text-amber-800">
                        {builderAssumptions.slice(0, 3).map((item) => <li key={item}>• {item}</li>)}
                      </ul>
                    </div>
                  )}
                  <Button type="button" variant="outline" size="sm" fullWidth className="mt-5" onClick={applyBuilderSuggestion}>
                    Apply suggestion to empty fields
                  </Button>
                </div>
              ) : (
                <div className="flex min-h-[220px] items-center justify-center text-center">
                  <div>
                    <WandSparkles className="mx-auto h-6 w-6 text-violet-300" />
                    <p className="mt-3 text-xs font-semibold text-slate-700">Your structured suggestion will appear here.</p>
                    <p className="mt-1 text-[10px] leading-4 text-slate-400">Nothing is written to the brief until you choose to apply it.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {error && (
          <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-700">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-7 grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-5">
            <section className="surface-card rounded-[22px] p-5 sm:p-7">
              <p className="text-sm font-semibold text-slate-950">Project context</p>
              <p className="mt-1 text-[11px] leading-5 text-slate-500">Give creators enough context to understand the commercial problem before they think about tools.</p>
              <div className="mt-6 space-y-4">
                <Input label="Brief title" value={form.title} onChange={(event) => setField('title', event.target.value)} placeholder="e.g. Luxury skincare launch visual system" maxLength={140} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-[13px] font-semibold text-slate-800">Content type</label>
                    <select value={form.content_type || ''} onChange={(event) => setField('content_type', event.target.value || null)} className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-950 outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-50">
                      <option value="">Select content type</option>
                      {CONTENT_TYPES.map((item) => <option key={item} value={item}>{item}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-[13px] font-semibold text-slate-800">Category</label>
                    <select value={form.category || ''} onChange={(event) => setField('category', event.target.value || null)} className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-950 outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-50">
                      <option value="">Select category</option>
                      {CATEGORIES.map((item) => <option key={item} value={item}>{item}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-[13px] font-semibold text-slate-800">Primary aspect ratio</label>
                    <select value={form.aspect_ratio || ''} onChange={(event) => setField('aspect_ratio', event.target.value || null)} className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-950 outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-50">
                      <option value="">Select format</option>
                      {ASPECT_RATIOS.map((item) => <option key={item} value={item}>{item}</option>)}
                    </select>
                  </div>
                  <Input label="Creative style / mood" value={form.style || ''} onChange={(event) => setField('style', event.target.value || null)} placeholder="e.g. Glossy editorial, surreal, cinematic" />
                </div>
                <div>
                  <label className="mb-2 block text-[13px] font-semibold text-slate-800">Project description</label>
                  <textarea value={form.description} onChange={(event) => setField('description', event.target.value)} rows={6} placeholder="Explain the campaign goal, audience, creative direction, desired mood and what success looks like." className="w-full resize-y rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm leading-6 text-slate-950 outline-none placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-50" />
                </div>
                <div>
                  <label className="mb-2 block text-[13px] font-semibold text-slate-800">Deliverables</label>
                  <textarea value={form.deliverables || ''} onChange={(event) => setField('deliverables', event.target.value)} rows={4} placeholder="Example: 6 hero product visuals, 12 social crops, layered finals, one revision round." className="w-full resize-y rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm leading-6 text-slate-950 outline-none placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-50" />
                </div>
              </div>
            </section>

            <section className="surface-card rounded-[22px] p-5 sm:p-7">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700"><WandSparkles className="h-4 w-4" /></div>
                <div><p className="text-sm font-semibold text-slate-950">Capability requirements</p><p className="mt-1 text-[11px] leading-5 text-slate-500">Use the same vocabulary creators use in their profiles, making the brief directly matchable.</p></div>
              </div>
              <div className="mt-6 space-y-6">
                <TagInput label="Required AI tools" value={form.required_tools} onChange={(value) => setField('required_tools', value)} suggestions={AI_TOOL_SUGGESTIONS} placeholder="Add Flux, ComfyUI, Runway..." helperText="Only include tools that materially matter to the delivery." />
                <TagInput label="Required skills" value={form.required_skills} onChange={(value) => setField('required_skills', value)} suggestions={SKILL_SUGGESTIONS} placeholder="Add art direction, image generation..." helperText="Describe capabilities, not vague personality traits." />
              </div>
            </section>

            <section className="surface-card rounded-[22px] p-5 sm:p-7">
              <p className="text-sm font-semibold text-slate-950">Commercial terms</p>
              <p className="mt-1 text-[11px] leading-5 text-slate-500">Set practical constraints early so creators can self-qualify before applying.</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Input label="Minimum budget (INR)" type="number" min={0} value={form.budget_min ?? ''} onChange={(event) => setField('budget_min', event.target.value === '' ? null : Number(event.target.value))} leftIcon={<IndianRupee className="h-4 w-4" />} />
                <Input label="Maximum budget (INR)" type="number" min={0} value={form.budget_max ?? ''} onChange={(event) => setField('budget_max', event.target.value === '' ? null : Number(event.target.value))} leftIcon={<IndianRupee className="h-4 w-4" />} />
                <Input label="Deadline" type="date" value={form.deadline || ''} onChange={(event) => setField('deadline', event.target.value || null)} leftIcon={<CalendarDays className="h-4 w-4" />} />
                <div>
                  <label className="mb-2 block text-[13px] font-semibold text-slate-800">Usage rights</label>
                  <input value={form.usage_rights || ''} onChange={(event) => setField('usage_rights', event.target.value)} placeholder="e.g. Paid social + web · 6 months" className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-950 outline-none placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-50" />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-[13px] font-semibold text-slate-800">References / production notes</label>
                  <textarea value={form.reference_notes || ''} onChange={(event) => setField('reference_notes', event.target.value)} rows={4} placeholder="Add reference links, brand guardrails, negative examples or asset notes. Keep sensitive information out of public briefs." className="w-full resize-y rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm leading-6 text-slate-950 outline-none placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-50" />
                </div>
              </div>
            </section>
          </div>

          <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
            <div className="rounded-[22px] bg-[#0b1020] p-6 text-white shadow-[0_18px_45px_rgba(15,23,42,.12)]">
              <div className="flex items-center justify-between"><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-violet-300">Brief readiness</p><Sparkles className="h-4 w-4 text-violet-300" /></div>
              <p className="mt-5 text-4xl font-semibold tracking-[-0.05em]">{readiness.percent}%</p>
              <p className="mt-1 text-[10px] text-slate-500">{readiness.completed} of {readiness.total} matching signals defined</p>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-violet-400 transition-all" style={{ width: `${readiness.percent}%` }} /></div>
              <div className="mt-5 space-y-2 text-[10px] text-slate-300">
                {readiness.missing.slice(0, 4).map((item) => <p key={item} className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-slate-600" /> Add {item.toLowerCase()}</p>)}
                {readiness.missing.length === 0 && <p className="text-emerald-300">Ready for high-confidence creator discovery.</p>}
              </div>
            </div>

            <div className="surface-card rounded-[20px] p-5">
              <p className="text-xs font-semibold text-slate-950">Visibility</p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <button type="button" onClick={() => setField('status', 'open')} className={`rounded-xl border px-3 py-3 text-[11px] font-semibold ${form.status === 'open' ? 'border-emerald-300 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-white text-slate-500'}`}>Publish</button>
                <button type="button" onClick={() => setField('status', 'draft')} className={`rounded-xl border px-3 py-3 text-[11px] font-semibold ${form.status === 'draft' ? 'border-amber-300 bg-amber-50 text-amber-700' : 'border-slate-200 bg-white text-slate-500'}`}>Save draft</button>
              </div>
              <p className="mt-3 text-[10px] leading-4 text-slate-500">Published briefs are readable by creators. Drafts stay visible only to your brand account.</p>
            </div>

            <Button type="submit" size="lg" fullWidth isLoading={saving} leftIcon={<Sparkles className="h-4 w-4" />}>
              {form.status === 'open' ? 'Publish creative brief' : 'Save brief draft'}
            </Button>
          </aside>
        </form>
      </div>
    </div>
  );
};
