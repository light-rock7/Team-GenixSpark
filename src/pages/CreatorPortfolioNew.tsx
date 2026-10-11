import React, { useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  FileVideo2,
  ImageIcon,
  Link2,
  Sparkles,
  UploadCloud,
  WandSparkles,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { CreatorWorkspaceNav } from '../components/creator/CreatorWorkspaceNav';
import { TagInput } from '../components/creator/TagInput';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useCreatorPortfolio } from '../hooks/useCreatorPortfolio';
import type { PortfolioItemCreate, PortfolioMediaType } from '../types/creator';

const AI_TOOL_SUGGESTIONS = ['Midjourney', 'Stable Diffusion', 'Flux', 'ComfyUI', 'Runway', 'ChatGPT', 'DALL·E', 'Adobe Firefly'];
const SKILL_SUGGESTIONS = ['Prompt Engineering', 'Art Direction', 'Image Generation', 'Video Generation', 'LoRA Training', 'Retouching', 'Storyboarding', 'Concept Design'];
const CATEGORIES = ['Advertising', 'Product Visuals', 'Fashion', 'Beauty', 'Social Content', 'Concept Art', 'Architecture', 'Motion', 'Editorial', 'Other'];
const CONTENT_TYPES = ['Image', 'Video', 'Animation', 'Graphics', 'Product Visuals', 'Social Content', 'Concept Art', 'Mixed Media', 'Other'];

export const CreatorPortfolioNew: React.FC = () => {
  const navigate = useNavigate();
  const { create, uploadMedia, saving } = useCreatorPortfolio();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mediaMode, setMediaMode] = useState<'upload' | 'link'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [externalUrl, setExternalUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Advertising');
  const [contentType, setContentType] = useState('Image');
  const [aiTools, setAiTools] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [promptSummary, setPromptSummary] = useState('');
  const [workflowSummary, setWorkflowSummary] = useState('');
  const [commercialRights, setCommercialRights] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const readiness = useMemo(() => {
    const checks = [
      Boolean(title.trim()),
      mediaMode === 'upload' ? Boolean(file) : Boolean(externalUrl.trim()),
      Boolean(contentType),
      aiTools.length > 0,
      Boolean(workflowSummary.trim()),
      Boolean(description.trim()),
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [title, mediaMode, file, externalUrl, contentType, aiTools, workflowSummary, description]);

  const previewUrl = file && file.type.startsWith('image/') ? URL.createObjectURL(file) : null;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Add a title for this case study.');
      return;
    }

    try {
      let mediaUrl = externalUrl.trim();
      let mediaType: PortfolioMediaType = 'link';

      if (mediaMode === 'upload') {
        if (!file) throw new Error('Choose an image or video to upload.');
        const uploaded = await uploadMedia(file);
        mediaUrl = uploaded.url;
        mediaType = uploaded.mediaType;
      } else if (!mediaUrl) {
        throw new Error('Add a valid project URL.');
      }

      const payload: PortfolioItemCreate = {
        title: title.trim(),
        description: description.trim() || null,
        media_url: mediaUrl,
        thumbnail_url: null,
        media_type: mediaType,
        category: category || null,
        content_type: contentType || null,
        ai_tools: aiTools,
        skills,
        prompt_summary: promptSummary.trim() || null,
        workflow_summary: workflowSummary.trim() || null,
        commercial_rights: commercialRights.trim() || null,
        is_published: isPublished,
      };

      await create(payload);
      navigate('/creator/portfolio');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to create portfolio case study.');
    }
  };

  return (
    <div className="min-h-full bg-[#f7f8fb]">
      <CreatorWorkspaceNav />

      <div className="page-shell py-8 sm:py-10">
        <Link to="/creator/portfolio" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-950">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to portfolio
        </Link>

        <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-violet-600">New portfolio case study</p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-[-0.045em] text-slate-950">Document the work and the workflow.</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Strong case studies are concise: show the output, name the content type and tools, explain the production path, and clarify commercial context.</p>
          </div>
        </div>

        {error && (
          <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-700">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-7 grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-5">
            <section className="surface-card rounded-[22px] p-5 sm:p-7">
              <div>
                <p className="text-xs font-extrabold text-slate-950">Project media</p>
                <p className="mt-1 text-[11px] leading-5 text-slate-500">Lead with the strongest visual proof.</p>
              </div>

              <div className="mt-5 inline-flex rounded-xl bg-slate-100 p-1">
                <button type="button" onClick={() => setMediaMode('upload')} className={`rounded-lg px-3 py-2 text-[11px] font-bold transition-all ${mediaMode === 'upload' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500'}`}>Upload media</button>
                <button type="button" onClick={() => setMediaMode('link')} className={`rounded-lg px-3 py-2 text-[11px] font-bold transition-all ${mediaMode === 'link' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500'}`}>External link</button>
              </div>

              {mediaMode === 'upload' ? (
                <div className="mt-5">
                  <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,video/mp4,video/webm" onChange={(event) => setFile(event.target.files?.[0] || null)} className="hidden" />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="group flex min-h-[260px] w-full items-center justify-center overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-center transition-colors hover:border-violet-300 hover:bg-violet-50/40"
                  >
                    {previewUrl ? (
                      <img src={previewUrl} alt="Preview" className="max-h-[360px] w-full object-cover" />
                    ) : file?.type.startsWith('video/') ? (
                      <div><FileVideo2 className="mx-auto h-8 w-8 text-violet-600" /><p className="mt-3 text-sm font-bold text-slate-800">{file.name}</p><p className="mt-1 text-xs text-slate-400">Video selected</p></div>
                    ) : (
                      <div className="px-5">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-violet-700 shadow-sm"><UploadCloud className="h-5 w-5" /></div>
                        <p className="mt-4 text-sm font-extrabold text-slate-900">Choose an image or video</p>
                        <p className="mt-1 text-xs text-slate-400">JPG, PNG, WebP, MP4 or WebM · max 25 MB</p>
                      </div>
                    )}
                  </button>
                </div>
              ) : (
                <div className="mt-5"><Input label="Project URL" type="url" value={externalUrl} onChange={(event) => setExternalUrl(event.target.value)} placeholder="https://..." leftIcon={<Link2 className="h-4 w-4" />} /></div>
              )}
            </section>

            <section className="surface-card rounded-[22px] p-5 sm:p-7">
              <div>
                <p className="text-xs font-extrabold text-slate-950">Case study details</p>
                <p className="mt-1 text-[11px] leading-5 text-slate-500">Make the project easy to scan and easy to trust.</p>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2"><Input label="Project title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. Luxury skincare launch visual system" maxLength={120} /></div>
                <div>
                  <label className="mb-2 block text-[13px] font-semibold text-slate-800">Content type</label>
                  <select value={contentType} onChange={(event) => setContentType(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-950 outline-none hover:border-slate-300 focus:border-violet-400 focus:ring-4 focus:ring-violet-50">
                    {CONTENT_TYPES.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-[13px] font-semibold text-slate-800">Category</label>
                  <select value={category} onChange={(event) => setCategory(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-950 outline-none hover:border-slate-300 focus:border-violet-400 focus:ring-4 focus:ring-violet-50">
                    {CATEGORIES.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                </div>
                <Input label="Commercial rights" value={commercialRights} onChange={(event) => setCommercialRights(event.target.value)} placeholder="e.g. Paid social · 6 months" />
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-[13px] font-semibold text-slate-800">Project description</label>
                  <textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={4} placeholder="What was the creative problem, what did you produce, and what made the work effective?" className="w-full resize-y rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm leading-6 text-slate-950 outline-none placeholder:text-slate-400 hover:border-slate-300 focus:border-violet-400 focus:ring-4 focus:ring-violet-50" />
                </div>
              </div>
            </section>

            <section className="surface-card rounded-[22px] p-5 sm:p-7">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700"><WandSparkles className="h-4 w-4" /></div>
                <div><p className="text-xs font-extrabold text-slate-950">AI workflow evidence</p><p className="mt-1 text-[11px] leading-5 text-slate-500">Enough detail to demonstrate craft and repeatability without exposing sensitive IP.</p></div>
              </div>

              <div className="mt-6 space-y-6">
                <TagInput label="AI tools" value={aiTools} onChange={setAiTools} suggestions={AI_TOOL_SUGGESTIONS} placeholder="Add the tools used..." helperText="List the models and tools that materially shaped the result." />
                <TagInput label="Skills demonstrated" value={skills} onChange={setSkills} suggestions={SKILL_SUGGESTIONS} placeholder="Add the skills demonstrated..." helperText="Highlight the creative and technical skills visible in this project." />
                <div>
                  <label className="mb-2 block text-[13px] font-semibold text-slate-800">Prompt / direction summary</label>
                  <textarea value={promptSummary} onChange={(event) => setPromptSummary(event.target.value)} rows={3} placeholder="Summarize the creative direction or prompt strategy at a high level." className="w-full resize-y rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm leading-6 text-slate-950 outline-none placeholder:text-slate-400 hover:border-slate-300 focus:border-violet-400 focus:ring-4 focus:ring-violet-50" />
                </div>
                <div>
                  <label className="mb-2 block text-[13px] font-semibold text-slate-800">Workflow summary</label>
                  <textarea value={workflowSummary} onChange={(event) => setWorkflowSummary(event.target.value)} rows={4} placeholder="Example: Flux generation → ComfyUI control workflow → selective retouching → final delivery prep." className="w-full resize-y rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm leading-6 text-slate-950 outline-none placeholder:text-slate-400 hover:border-slate-300 focus:border-violet-400 focus:ring-4 focus:ring-violet-50" />
                </div>
              </div>
            </section>
          </div>

          <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
            <div className="rounded-[22px] bg-[#0b1020] p-6 text-white shadow-[0_18px_45px_rgba(15,23,42,.12)]">
              <div className="flex items-center justify-between"><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-violet-300">Case study readiness</p><Sparkles className="h-4 w-4 text-violet-300" /></div>
              <p className="mt-5 text-4xl font-extrabold tracking-[-0.055em]">{readiness}%</p>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-violet-400 transition-all duration-500" style={{ width: `${readiness}%` }} /></div>
              <div className="mt-5 space-y-2.5 text-[11px] text-slate-300">
                <p className="flex items-center gap-2"><CheckCircle2 className={`h-3.5 w-3.5 ${title.trim() ? 'text-emerald-300' : 'text-slate-600'}`} /> Clear project title</p>
                <p className="flex items-center gap-2"><CheckCircle2 className={`h-3.5 w-3.5 ${(mediaMode === 'upload' ? file : externalUrl.trim()) ? 'text-emerald-300' : 'text-slate-600'}`} /> Strong visual proof</p>
                <p className="flex items-center gap-2"><CheckCircle2 className={`h-3.5 w-3.5 ${contentType ? 'text-emerald-300' : 'text-slate-600'}`} /> Content type selected</p>
                <p className="flex items-center gap-2"><CheckCircle2 className={`h-3.5 w-3.5 ${aiTools.length > 0 ? 'text-emerald-300' : 'text-slate-600'}`} /> Toolchain listed</p>
                <p className="flex items-center gap-2"><CheckCircle2 className={`h-3.5 w-3.5 ${workflowSummary.trim() ? 'text-emerald-300' : 'text-slate-600'}`} /> Workflow summarized</p>
              </div>
            </div>

            <label className="flex cursor-pointer items-start gap-3 rounded-[18px] border border-slate-200 bg-white p-4 shadow-sm">
              <input type="checkbox" checked={isPublished} onChange={(event) => setIsPublished(event.target.checked)} className="mt-0.5 h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500" />
              <span><span className="block text-xs font-extrabold text-slate-950">Publish immediately</span><span className="mt-1 block text-[10px] leading-4 text-slate-500">Turn this off to save the case study as a private draft.</span></span>
            </label>

            <Button type="submit" size="lg" fullWidth isLoading={saving} leftIcon={mediaMode === 'upload' ? <ImageIcon className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}>
              {isPublished ? 'Publish case study' : 'Save draft'}
            </Button>
          </aside>
        </form>
      </div>
    </div>
  );
};
