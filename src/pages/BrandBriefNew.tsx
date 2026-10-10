import React, { useMemo, useState } from 'react';
import { AlertCircle, ArrowLeft, CalendarDays, CheckCircle2, IndianRupee, Sparkles, WandSparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { TagInput } from '../components/creator/TagInput';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useBrandBriefs } from '../hooks/useBrandBriefs';
import { calculateBriefReadiness } from '../services/briefService';
import type { CreativeBriefCreate } from '../types/brief';

const AI_TOOL_SUGGESTIONS = ['Midjourney', 'Stable Diffusion', 'Flux', 'ComfyUI', 'Runway', 'ChatGPT', 'DALL·E', 'Adobe Firefly'];
const SKILL_SUGGESTIONS = ['Prompt Engineering', 'Art Direction', 'Image Generation', 'Video Generation', 'LoRA Training', 'Retouching', 'Storyboarding', 'Concept Design'];
const CATEGORIES = ['Advertising', 'Product Visuals', 'Fashion', 'Beauty', 'Social Content', 'Concept Art', 'Architecture', 'Motion', 'Editorial', 'Other'];
const ASPECT_RATIOS = ['1:1', '4:5', '9:16', '16:9', '3:2', '2:3', 'Flexible'];

const emptyBrief: CreativeBriefCreate = {
  title: '',
  description: '',
  category: null,
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

export const BrandBriefNew: React.FC = () => {
  const navigate = useNavigate();
  const { create, saving } = useBrandBriefs();
  const [form, setForm] = useState<CreativeBriefCreate>(emptyBrief);
  const [error, setError] = useState<string | null>(null);

  const readiness = useMemo(() => calculateBriefReadiness(form), [form]);
  const setField = <K extends keyof CreativeBriefCreate>(key: K, value: CreativeBriefCreate[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
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
          <p className="mt-2 text-sm leading-6 text-slate-500">Define outcomes, production constraints and AI capability requirements. These same signals power creator discovery and later explainable matching.</p>
        </div>

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
