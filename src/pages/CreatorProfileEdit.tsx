import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Camera,
  CheckCircle2,
  ExternalLink,
  Globe2,
  Link2,
  MapPin,
  Save,
  ShieldCheck,
  Sparkles,
  UserRound,
} from 'lucide-react';
import { CreatorWorkspaceNav } from '../components/creator/CreatorWorkspaceNav';
import { TagInput } from '../components/creator/TagInput';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { LoadingState } from '../components/ui/LoadingState';
import { useCreatorProfile } from '../hooks/useCreatorProfile';
import { calculateProfileCompletion } from '../services/creatorService';
import type { CreatorAvailability, CreatorProfileUpdate } from '../types/creator';

const AI_TOOL_SUGGESTIONS = ['Midjourney', 'Stable Diffusion', 'Flux', 'ComfyUI', 'Runway', 'ChatGPT', 'DALL·E', 'Adobe Firefly'];
const SKILL_SUGGESTIONS = ['Prompt Engineering', 'Art Direction', 'Image Generation', 'Video Generation', 'LoRA Training', 'Retouching', 'Storyboarding', 'Concept Design'];
const SPECIALIZATION_SUGGESTIONS = ['Product Visuals', 'Fashion', 'Advertising', 'Social Content', 'Concept Art', 'Architecture', 'Beauty', 'Motion Design'];

const emptyForm: CreatorProfileUpdate = {
  display_name: '',
  headline: '',
  bio: '',
  location: '',
  availability: 'available',
  years_experience: 0,
  hourly_rate: null,
  skills: [],
  ai_tools: [],
  specializations: [],
  website_url: '',
  social_url: '',
};

export const CreatorProfileEdit: React.FC = () => {
  const { profile, loading, saving, uploadingAvatar, error, save, uploadAvatar } = useCreatorProfile();
  const [form, setForm] = useState<CreatorProfileUpdate>(emptyForm);
  const [notice, setNotice] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!profile) return;
    setForm({
      display_name: profile.display_name,
      headline: profile.headline || '',
      bio: profile.bio || '',
      location: profile.location || '',
      availability: profile.availability,
      years_experience: profile.years_experience,
      hourly_rate: profile.hourly_rate,
      skills: profile.skills,
      ai_tools: profile.ai_tools,
      specializations: profile.specializations,
      website_url: profile.website_url || '',
      social_url: profile.social_url || '',
    });
  }, [profile]);

  const draftCompletion = useMemo(() => {
    if (!profile) return calculateProfileCompletion(null);
    return calculateProfileCompletion({
      ...profile,
      ...form,
      headline: form.headline,
      bio: form.bio,
      location: form.location,
      website_url: form.website_url,
      social_url: form.social_url,
    });
  }, [profile, form]);

  const setField = <K extends keyof CreatorProfileUpdate>(key: K, value: CreatorProfileUpdate[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    setNotice(null);
  };

  const handleAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setLocalError(null);
    setNotice(null);
    try {
      await uploadAvatar(file);
      setNotice('Profile photo updated.');
    } catch (err: unknown) {
      setLocalError(err instanceof Error ? err.message : 'Unable to upload profile photo.');
    } finally {
      event.target.value = '';
    }
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setLocalError(null);
    setNotice(null);

    if (!form.display_name.trim()) {
      setLocalError('Display name is required.');
      return;
    }

    try {
      await save(form);
      setNotice('Creator profile saved.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: unknown) {
      setLocalError(err instanceof Error ? err.message : 'Unable to save profile.');
    }
  };

  if (loading) {
    return (
      <>
        <CreatorWorkspaceNav />
        <LoadingState message="Loading creator profile" description="Preparing your creator identity and marketplace signals." />
      </>
    );
  }

  return (
    <div className="min-h-full bg-[#f7f8fb]">
      <CreatorWorkspaceNav />

      <div className="page-shell py-8 sm:py-10">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-violet-600">Professional identity</p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-[-0.045em] text-slate-950">Make your expertise easy to evaluate.</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Keep the profile concise, specific, and commercial. The strongest signals are what you make, which AI tools you can deliver with, and where your work is strongest.</p>
          </div>
          {profile?.user_id && (
            <a href={`/creators/${profile.user_id}`} className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-violet-700">
              Preview public profile <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>

        {(notice || localError || error) && (
          <div className={`mt-6 flex items-start gap-2.5 rounded-xl border px-4 py-3 text-xs font-semibold ${localError || error ? 'border-rose-200 bg-rose-50 text-rose-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}`}>
            {localError || error ? <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" /> : <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />}
            <span>{localError || error || notice}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="mt-7 grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-5">
            <section className="surface-card rounded-[22px] p-5 sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-extrabold tracking-[-0.02em] text-slate-950">Identity</p>
                  <p className="mt-1 text-[11px] leading-5 text-slate-500">Your name, photo and positioning statement.</p>
                </div>
                <UserRound className="h-4.5 w-4.5 text-slate-300" />
              </div>

              <div className="mt-6 grid gap-6 md:grid-cols-[128px_minmax(0,1fr)]">
                <div>
                  <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleAvatar} className="hidden" />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingAvatar}
                    className="group relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-violet-100 to-slate-100 text-3xl font-extrabold text-violet-500 shadow-sm outline-none focus:ring-4 focus:ring-violet-100 disabled:opacity-60"
                  >
                    {profile?.avatar_url ? <img src={profile.avatar_url} alt={form.display_name || 'Creator'} className="h-full w-full object-cover" /> : (form.display_name || 'C').charAt(0).toUpperCase()}
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-950/60 opacity-0 transition-opacity group-hover:opacity-100">
                      <Camera className="h-5 w-5 text-white" />
                    </div>
                  </button>
                  <p className="mt-2 text-[10px] leading-4 text-slate-400">JPG, PNG or WebP · max 5 MB</p>
                </div>

                <div className="space-y-4">
                  <Input label="Display name" value={form.display_name} onChange={(event) => setField('display_name', event.target.value)} placeholder="e.g. Aria Visuals" maxLength={80} />
                  <Input label="Professional headline" value={form.headline || ''} onChange={(event) => setField('headline', event.target.value)} placeholder="AI product artist · Flux & ComfyUI" maxLength={140} />
                  <div>
                    <div className="mb-2 flex items-center justify-between"><label className="text-[13px] font-semibold text-slate-800">Bio</label><span className="text-[10px] text-slate-400">{(form.bio || '').length}/1200</span></div>
                    <textarea
                      value={form.bio || ''}
                      onChange={(event) => setField('bio', event.target.value)}
                      rows={5}
                      maxLength={1200}
                      placeholder="Describe your creative point of view, the brands you work best with, and the kind of outcomes your AI workflow is built to deliver."
                      className="block w-full resize-y rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm leading-6 text-slate-950 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-violet-400 focus:ring-4 focus:ring-violet-50"
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className="surface-card rounded-[22px] p-5 sm:p-7">
              <div>
                <p className="text-xs font-extrabold tracking-[-0.02em] text-slate-950">Capability signals</p>
                <p className="mt-1 text-[11px] leading-5 text-slate-500">These fields drive discovery and explain why you match a brief.</p>
              </div>
              <div className="mt-6 space-y-6">
                <TagInput label="AI tools" value={form.ai_tools} onChange={(value) => setField('ai_tools', value)} suggestions={AI_TOOL_SUGGESTIONS} placeholder="Add Midjourney, Flux, ComfyUI..." helperText="List tools you can confidently deliver commercial work with." />
                <TagInput label="Skills" value={form.skills} onChange={(value) => setField('skills', value)} suggestions={SKILL_SUGGESTIONS} placeholder="Add prompt engineering, art direction..." helperText="Mix creative direction and technical production skills." />
                <TagInput label="Specializations" value={form.specializations} onChange={(value) => setField('specializations', value)} suggestions={SPECIALIZATION_SUGGESTIONS} placeholder="Add product visuals, fashion, advertising..." helperText="Focus on the categories where your portfolio is strongest." />
              </div>
            </section>

            <section className="surface-card rounded-[22px] p-5 sm:p-7">
              <div>
                <p className="text-xs font-extrabold tracking-[-0.02em] text-slate-950">Working details</p>
                <p className="mt-1 text-[11px] leading-5 text-slate-500">Practical context for brands reviewing your profile.</p>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Input label="Location" value={form.location || ''} onChange={(event) => setField('location', event.target.value)} placeholder="Hyderabad, India · Remote" leftIcon={<MapPin className="h-4 w-4" />} />
                <Input label="Years of experience" type="number" min={0} max={80} value={form.years_experience} onChange={(event) => setField('years_experience', Number(event.target.value))} />
                <Input label="Indicative hourly rate (INR)" type="number" min={0} value={form.hourly_rate ?? ''} onChange={(event) => setField('hourly_rate', event.target.value === '' ? null : Number(event.target.value))} placeholder="Optional" />
                <div>
                  <label className="mb-2 block text-[13px] font-semibold text-slate-800">Availability</label>
                  <div className="grid grid-cols-3 gap-2">
                    {([['available', 'Available'], ['busy', 'Busy'], ['unavailable', 'Away']] as [CreatorAvailability, string][]).map(([value, label]) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setField('availability', value)}
                        className={`rounded-xl border px-2 py-3 text-[11px] font-bold transition-all ${form.availability === value ? 'border-violet-300 bg-violet-50 text-violet-700 ring-2 ring-violet-50' : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'}`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                <Input label="Website / portfolio link" type="url" value={form.website_url || ''} onChange={(event) => setField('website_url', event.target.value)} placeholder="https://yourstudio.com" leftIcon={<Globe2 className="h-4 w-4" />} />
                <Input label="Social / professional link" type="url" value={form.social_url || ''} onChange={(event) => setField('social_url', event.target.value)} placeholder="https://..." leftIcon={<Link2 className="h-4 w-4" />} />
              </div>
            </section>
          </div>

          <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
            <div className="rounded-[22px] bg-[#0b1020] p-6 text-white shadow-[0_18px_45px_rgba(15,23,42,.12)]">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-violet-300">Profile readiness</p>
              <div className="mt-5 flex items-end justify-between gap-4">
                <div>
                  <p className="text-4xl font-extrabold tracking-[-0.055em]">{draftCompletion.percent}%</p>
                  <p className="mt-1 text-[11px] text-slate-400">{draftCompletion.completed} of {draftCompletion.total} signals</p>
                </div>
                <ShieldCheck className="h-7 w-7 text-violet-300" />
              </div>
              <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-violet-400 transition-all duration-500" style={{ width: `${draftCompletion.percent}%` }} />
              </div>
              <p className="mt-4 text-[11px] leading-5 text-slate-400">
                {draftCompletion.percent >= 90 ? 'Strong profile. Keep availability and portfolio proof current.' : `Next: ${draftCompletion.missing.slice(0, 2).join(' · ')}`}
              </p>
            </div>

            <div className="surface-card rounded-[20px] p-5">
              <p className="text-xs font-extrabold text-slate-950">Live profile signal</p>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-violet-50 text-sm font-extrabold text-violet-600">
                  {profile?.avatar_url ? <img src={profile.avatar_url} alt="" className="h-full w-full object-cover" /> : (form.display_name || 'C').charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-extrabold text-slate-950">{form.display_name || 'Your creator name'}</p>
                  <p className="mt-0.5 line-clamp-2 text-[10px] leading-4 text-slate-500">{form.headline || 'Your professional headline will appear here.'}</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {form.ai_tools.slice(0, 4).map((tool) => <span key={tool} className="rounded-full bg-violet-50 px-2.5 py-1 text-[9px] font-semibold text-violet-700">{tool}</span>)}
                {form.ai_tools.length === 0 && <span className="text-[10px] text-slate-400">Add tools to strengthen discovery.</span>}
              </div>
            </div>

            <Button type="submit" size="lg" fullWidth isLoading={saving} leftIcon={<Save className="h-4 w-4" />}>
              Save creator profile
            </Button>

            <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-[10px] leading-5 text-slate-500">
              <span className="font-bold text-slate-700">Tip:</span> human reviewers scan for specificity. Tool names + clear specialization + workflow-backed portfolio proof reads as professional.
            </div>
          </aside>
        </form>
      </div>
    </div>
  );
};