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

const AI_TOOL_SUGGESTIONS = [
  'Midjourney', 'Stable Diffusion', 'Flux', 'ComfyUI', 'Runway', 'ChatGPT', 'DALL·E', 'Adobe Firefly',
];
const SKILL_SUGGESTIONS = [
  'Prompt Engineering', 'Art Direction', 'Image Generation', 'Video Generation', 'LoRA Training', 'Retouching', 'Storyboarding', 'Concept Design',
];
const SPECIALIZATION_SUGGESTIONS = [
  'Product Visuals', 'Fashion', 'Advertising', 'Social Content', 'Concept Art', 'Architecture', 'Beauty', 'Motion Design',
];

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
      setNotice('Profile photo updated successfully.');
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
    if (form.display_name.trim().length > 80) {
      setLocalError('Display name must be 80 characters or fewer.');
      return;
    }

    try {
      await save(form);
      setNotice('Creator profile saved. Your public profile is now up to date.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: unknown) {
      setLocalError(err instanceof Error ? err.message : 'Unable to save profile.');
    }
  };

  if (loading) {
    return (
      <>
        <CreatorWorkspaceNav />
        <LoadingState message="Loading creator profile" description="Preparing your professional AI creator workspace." />
      </>
    );
  }

  return (
    <div className="min-h-full bg-[radial-gradient(circle_at_top_left,_rgba(124,58,237,0.08),_transparent_34%),linear-gradient(to_bottom,#f8fafc,#f8fafc)]">
      <CreatorWorkspaceNav />

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-violet-700">
              <Sparkles className="h-3.5 w-3.5" />
              Creator identity
            </div>
            <h1 className="mt-4 text-3xl sm:text-4xl font-black tracking-[-0.035em] text-slate-950">
              Build a profile brands remember.
            </h1>
            <p className="mt-2 max-w-2xl text-sm sm:text-base leading-relaxed text-slate-500">
              Show the tools, craft, workflow depth, and availability behind your generative work. These fields power discovery and matching across GenixSpark.
            </p>
          </div>

          {profile?.user_id && (
            <a
              href={`/creators/${profile.user_id}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:border-violet-300 hover:text-violet-700 transition-colors"
            >
              Preview public profile
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>

        {(notice || localError || error) && (
          <div className={`mb-6 rounded-2xl border px-4 py-3.5 text-sm font-medium flex items-start gap-2.5 ${
            localError || error
              ? 'border-rose-200 bg-rose-50 text-rose-800'
              : 'border-emerald-200 bg-emerald-50 text-emerald-800'
          }`}>
            {localError || error ? <ShieldCheck className="h-4.5 w-4.5 mt-0.5 shrink-0" /> : <CheckCircle2 className="h-4.5 w-4.5 mt-0.5 shrink-0" />}
            <span>{localError || error || notice}</span>
          </div>
        )}

        <form onSubmit={handleSave}>
          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_340px] gap-7">
            <div className="space-y-6">
              <section className="rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-7 shadow-sm">
                <div className="flex items-start justify-between gap-5 mb-7">
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-violet-600">01 · Identity</p>
                    <h2 className="mt-1 text-xl font-extrabold tracking-tight text-slate-950">Profile essentials</h2>
                    <p className="mt-1 text-sm text-slate-500">The first impression shown on creator cards and public profile pages.</p>
                  </div>
                  <UserRound className="h-5 w-5 text-slate-300" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[150px_minmax(0,1fr)] gap-6 md:items-start">
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleAvatar}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingAvatar}
                      className="group relative h-36 w-36 overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-100 to-violet-100 shadow-inner focus:outline-none focus:ring-4 focus:ring-violet-100 disabled:opacity-60"
                    >
                      {profile?.avatar_url ? (
                        <img src={profile.avatar_url} alt={form.display_name || 'Creator'} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-4xl font-black text-violet-400">
                          {(form.display_name || 'C').charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-950/55 text-white opacity-0 transition-opacity group-hover:opacity-100">
                        <div className="text-center">
                          <Camera className="mx-auto h-5 w-5" />
                          <span className="mt-1 block text-[10px] font-bold uppercase tracking-wider">Change photo</span>
                        </div>
                      </div>
                    </button>
                    <p className="mt-2 text-[11px] leading-relaxed text-slate-400">JPG, PNG or WebP · max 5 MB</p>
                  </div>

                  <div className="space-y-5">
                    <Input
                      label="Display name"
                      value={form.display_name}
                      onChange={(event) => setField('display_name', event.target.value)}
                      placeholder="e.g. Aria Visuals"
                      maxLength={80}
                    />
                    <Input
                      label="Professional headline"
                      value={form.headline || ''}
                      onChange={(event) => setField('headline', event.target.value)}
                      placeholder="AI Fashion Artist · Flux & ComfyUI Specialist"
                      maxLength={140}
                      helperText="A sharp one-line value proposition works best."
                    />
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">Creator bio</label>
                      <textarea
                        value={form.bio || ''}
                        onChange={(event) => setField('bio', event.target.value)}
                        rows={5}
                        maxLength={1200}
                        placeholder="Describe your creative point of view, the kind of brands you work with, and how your AI workflow creates reliable outcomes."
                        className="block w-full resize-y rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-sm leading-relaxed text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                      />
                      <div className="mt-1.5 flex justify-between text-[11px] text-slate-400">
                        <span>Write for brand decision-makers, not just other creators.</span>
                        <span>{(form.bio || '').length}/1200</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-7 shadow-sm">
                <div className="mb-7">
                  <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-violet-600">02 · Positioning</p>
                  <h2 className="mt-1 text-xl font-extrabold tracking-tight text-slate-950">Tools, skills & specializations</h2>
                  <p className="mt-1 text-sm text-slate-500">These tags make your profile filterable and explain why you match a creative brief.</p>
                </div>

                <div className="space-y-7">
                  <TagInput
                    label="AI tools"
                    value={form.ai_tools}
                    onChange={(value) => setField('ai_tools', value)}
                    suggestions={AI_TOOL_SUGGESTIONS}
                    placeholder="Add Midjourney, Flux, ComfyUI..."
                    helperText="List the generation tools and model ecosystems you can confidently deliver with."
                  />
                  <TagInput
                    label="Skills"
                    value={form.skills}
                    onChange={(value) => setField('skills', value)}
                    suggestions={SKILL_SUGGESTIONS}
                    placeholder="Add prompt engineering, art direction..."
                    helperText="Combine creative and technical skills that brands can evaluate."
                  />
                  <TagInput
                    label="Specializations"
                    value={form.specializations}
                    onChange={(value) => setField('specializations', value)}
                    suggestions={SPECIALIZATION_SUGGESTIONS}
                    placeholder="Add product visuals, fashion, advertising..."
                    helperText="Choose the kinds of commercial work where your portfolio is strongest."
                  />
                </div>
              </section>

              <section className="rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-7 shadow-sm">
                <div className="mb-7">
                  <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-violet-600">03 · Working details</p>
                  <h2 className="mt-1 text-xl font-extrabold tracking-tight text-slate-950">Availability & business info</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Input
                    label="Location"
                    value={form.location || ''}
                    onChange={(event) => setField('location', event.target.value)}
                    placeholder="Hyderabad, India · Remote"
                    leftIcon={<MapPin className="h-4 w-4" />}
                  />
                  <Input
                    label="Years of experience"
                    type="number"
                    min={0}
                    max={80}
                    value={form.years_experience}
                    onChange={(event) => setField('years_experience', Number(event.target.value))}
                  />
                  <Input
                    label="Indicative hourly rate (INR)"
                    type="number"
                    min={0}
                    value={form.hourly_rate ?? ''}
                    onChange={(event) => setField('hourly_rate', event.target.value === '' ? null : Number(event.target.value))}
                    placeholder="Optional"
                    helperText="Used as guidance only; brief proposals can be project-priced."
                  />
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">Availability</label>
                    <div className="grid grid-cols-3 gap-2">
                      {([
                        ['available', 'Available'],
                        ['busy', 'Busy'],
                        ['unavailable', 'Away'],
                      ] as [CreatorAvailability, string][]).map(([value, label]) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setField('availability', value)}
                          className={`rounded-xl border px-2.5 py-3 text-xs font-bold transition-all ${
                            form.availability === value
                              ? 'border-violet-500 bg-violet-50 text-violet-700 ring-2 ring-violet-100'
                              : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <Input
                    label="Website / portfolio link"
                    type="url"
                    value={form.website_url || ''}
                    onChange={(event) => setField('website_url', event.target.value)}
                    placeholder="https://yourstudio.com"
                    leftIcon={<Globe2 className="h-4 w-4" />}
                  />
                  <Input
                    label="Social / professional link"
                    type="url"
                    value={form.social_url || ''}
                    onChange={(event) => setField('social_url', event.target.value)}
                    placeholder="https://instagram.com/yourhandle"
                    leftIcon={<Link2 className="h-4 w-4" />}
                  />
                </div>
              </section>
            </div>

            <aside className="space-y-5 xl:sticky xl:top-24 xl:self-start">
              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 text-white shadow-xl shadow-slate-200/60">
                <div className="relative p-6 bg-[radial-gradient(circle_at_top_right,_rgba(139,92,246,0.45),_transparent_40%),linear-gradient(145deg,#0f172a,#111827)]">
                  <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:24px_24px]" />
                  <div className="relative">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet-300">Live profile preview</p>
                    <div className="mt-5 flex items-center gap-3">
                      <div className="h-14 w-14 overflow-hidden rounded-2xl border border-white/15 bg-violet-500/20 flex items-center justify-center text-lg font-black">
                        {profile?.avatar_url ? (
                          <img src={profile.avatar_url} alt="" className="h-full w-full object-cover" />
                        ) : (
                          (form.display_name || 'C').charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="truncate text-base font-extrabold">{form.display_name || 'Your creator name'}</h3>
                        <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-slate-300">
                          {form.headline || 'Your professional AI creator headline will appear here.'}
                        </p>
                      </div>
                    </div>
                    <div className="mt-5 flex flex-wrap gap-1.5">
                      {form.ai_tools.slice(0, 4).map((tool) => (
                        <span key={tool} className="rounded-full border border-violet-400/20 bg-violet-400/10 px-2.5 py-1 text-[10px] font-semibold text-violet-100">
                          {tool}
                        </span>
                      ))}
                      {form.ai_tools.length === 0 && <span className="text-[11px] text-slate-500">Add tools to strengthen discovery.</span>}
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/10 p-6">
                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold text-slate-300">Profile strength</p>
                      <p className="mt-1 text-3xl font-black tracking-tight">{draftCompletion.percent}%</p>
                    </div>
                    <ShieldCheck className="h-8 w-8 text-violet-300" />
                  </div>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-400 to-cyan-300 transition-all duration-500"
                      style={{ width: `${draftCompletion.percent}%` }}
                    />
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-slate-400">
                    {draftCompletion.percent >= 90
                      ? 'Excellent — your profile is ready for high-confidence discovery.'
                      : `Complete ${draftCompletion.missing.slice(0, 2).join(' and ')} to improve your marketplace presence.`}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-violet-100 bg-violet-50/70 p-5">
                <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-violet-700">Why this matters</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  GenixSpark is AI-workflow specific. Brands should understand not only what you make, but the tools and process behind repeatable results.
                </p>
              </div>

              <Button
                type="submit"
                size="lg"
                fullWidth
                isLoading={saving}
                leftIcon={<Save className="h-4.5 w-4.5" />}
                className="rounded-xl shadow-lg shadow-violet-200"
              >
                Save creator profile
              </Button>
            </aside>
          </div>
        </form>
      </div>
    </div>
  );
};
