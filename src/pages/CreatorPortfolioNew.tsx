import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  FileVideo2,
  ImageIcon,
  Link2,
  LockKeyhole,
  Sparkles,
  UploadCloud,
  WandSparkles,
} from 'lucide-react';
import { CreatorWorkspaceNav } from '../components/creator/CreatorWorkspaceNav';
import { TagInput } from '../components/creator/TagInput';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useCreatorPortfolio } from '../hooks/useCreatorPortfolio';
import type { PortfolioItemCreate, PortfolioMediaType } from '../types/creator';

const AI_TOOL_SUGGESTIONS = [
  'Midjourney', 'Stable Diffusion', 'Flux', 'ComfyUI', 'Runway', 'ChatGPT', 'DALL·E', 'Adobe Firefly',
];
const SKILL_SUGGESTIONS = [
  'Prompt Engineering', 'Art Direction', 'Image Generation', 'Video Generation', 'LoRA Training', 'Retouching', 'Storyboarding', 'Concept Design',
];
const CATEGORIES = [
  'Advertising', 'Product Visuals', 'Fashion', 'Beauty', 'Social Content', 'Concept Art', 'Architecture', 'Motion', 'Editorial', 'Other',
];

export const CreatorPortfolioNew: React.FC = () => {
  const navigate = useNavigate();
  const { create, uploadMedia, saving } = useCreatorPortfolio();
  const [mediaMode, setMediaMode] = useState<'upload' | 'link'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [externalUrl, setExternalUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Advertising');
  const [aiTools, setAiTools] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [promptSummary, setPromptSummary] = useState('');
  const [workflowSummary, setWorkflowSummary] = useState('');
  const [commercialRights, setCommercialRights] = useState('Rights negotiable');
  const [isPublished, setIsPublished] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const selectFile = (selected: File | undefined) => {
    if (!selected) return;
    setError(null);
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm'];
    if (!allowed.includes(selected.type)) {
      setError('Use JPG, PNG, WebP, MP4, or WebM media.');
      return;
    }
    if (selected.size > 25 * 1024 * 1024) {
      setError('Portfolio media must be smaller than 25 MB.');
      return;
    }
    setFile(selected);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Give this portfolio piece a title.');
      return;
    }
    if (title.trim().length > 120) {
      setError('Portfolio title must be 120 characters or fewer.');
      return;
    }
    if (mediaMode === 'upload' && !file) {
      setError('Upload an image or video for this portfolio item.');
      return;
    }
    if (mediaMode === 'link' && !externalUrl.trim()) {
      setError('Paste the public URL for your external showcase.');
      return;
    }

    try {
      setUploading(true);
      let mediaUrl = externalUrl.trim();
      let mediaType: PortfolioMediaType = 'link';

      if (mediaMode === 'upload' && file) {
        const uploaded = await uploadMedia(file);
        mediaUrl = uploaded.url;
        mediaType = uploaded.mediaType;
      }

      const payload: PortfolioItemCreate = {
        title: title.trim(),
        description,
        media_url: mediaUrl,
        media_type: mediaType,
        category,
        ai_tools: aiTools,
        skills,
        prompt_summary: promptSummary,
        workflow_summary: workflowSummary,
        commercial_rights: commercialRights,
        is_published: isPublished,
      };

      await create(payload);
      navigate('/creator/portfolio', { replace: true });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to publish portfolio item.');
    } finally {
      setUploading(false);
    }
  };

  const mediaIsVideo = file?.type.startsWith('video/');

  return (
    <div className="min-h-full bg-[radial-gradient(circle_at_top_left,_rgba(139,92,246,0.09),_transparent_30%),linear-gradient(to_bottom,#f8fafc,#f8fafc)]">
      <CreatorWorkspaceNav />

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        <button
          type="button"
          onClick={() => navigate('/creator/portfolio')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-violet-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to portfolio
        </button>

        <div className="mt-5 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-violet-700">
              <Sparkles className="h-3.5 w-3.5" />
              New case study
            </div>
            <h1 className="mt-4 text-3xl sm:text-4xl font-black tracking-[-0.035em] text-slate-950">Add work with proof of process.</h1>
            <p className="mt-2 max-w-2xl text-sm sm:text-base leading-relaxed text-slate-500">
              Great AI portfolios show more than an output. Give brands enough workflow context to understand your taste, tool fluency, and repeatability.
            </p>
          </div>
        </div>

        {error && (
          <div className="mt-6 flex items-start gap-2.5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3.5 text-sm font-medium text-rose-800">
            <AlertCircle className="h-4.5 w-4.5 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] gap-7">
          <div className="space-y-6">
            <section className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-7 shadow-sm">
              <div className="mb-6">
                <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-violet-600">01 · Creative asset</p>
                <h2 className="mt-1 text-xl font-extrabold tracking-tight text-slate-950">Upload the work</h2>
              </div>

              <div className="mb-4 inline-flex rounded-xl border border-slate-200 bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() => setMediaMode('upload')}
                  className={`rounded-lg px-3.5 py-2 text-xs font-bold transition-all ${mediaMode === 'upload' ? 'bg-white text-violet-700 shadow-sm' : 'text-slate-500'}`}
                >
                  <span className="inline-flex items-center gap-1.5"><UploadCloud className="h-3.5 w-3.5" /> Upload media</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMediaMode('link')}
                  className={`rounded-lg px-3.5 py-2 text-xs font-bold transition-all ${mediaMode === 'link' ? 'bg-white text-violet-700 shadow-sm' : 'text-slate-500'}`}
                >
                  <span className="inline-flex items-center gap-1.5"><Link2 className="h-3.5 w-3.5" /> External link</span>
                </button>
              </div>

              {mediaMode === 'upload' ? (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
                    className="hidden"
                    onChange={(event) => selectFile(event.target.files?.[0])}
                  />

                  {!file ? (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={(event) => event.preventDefault()}
                      onDrop={(event) => {
                        event.preventDefault();
                        selectFile(event.dataTransfer.files?.[0]);
                      }}
                      className="group flex min-h-[320px] w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/70 p-8 text-center hover:border-violet-400 hover:bg-violet-50/50 transition-all"
                    >
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-violet-600 shadow-sm ring-1 ring-slate-200 group-hover:scale-105 transition-transform">
                        <UploadCloud className="h-7 w-7" />
                      </div>
                      <p className="mt-5 text-sm font-extrabold text-slate-900">Drop your hero image or video here</p>
                      <p className="mt-1.5 text-xs leading-relaxed text-slate-500">or click to browse · JPG, PNG, WebP, MP4, WebM · max 25 MB</p>
                    </button>
                  ) : (
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-950">
                      <div className="relative aspect-[16/9]">
                        {mediaIsVideo ? (
                          <video src={previewUrl || undefined} controls className="h-full w-full object-contain" />
                        ) : (
                          <img src={previewUrl || undefined} alt="Portfolio preview" className="h-full w-full object-contain" />
                        )}
                        <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-slate-950/70 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur">
                          {mediaIsVideo ? <FileVideo2 className="h-3 w-3" /> : <ImageIcon className="h-3 w-3" />}
                          {mediaIsVideo ? 'Video' : 'Image'} preview
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-3 border-t border-white/10 px-4 py-3 text-white">
                        <div className="min-w-0">
                          <p className="truncate text-xs font-semibold">{file.name}</p>
                          <p className="text-[10px] text-slate-400">{(file.size / (1024 * 1024)).toFixed(1)} MB</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="rounded-lg border border-white/15 px-3 py-1.5 text-xs font-semibold text-white/80 hover:bg-white/10"
                        >
                          Replace
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <Input
                    label="Public showcase URL"
                    type="url"
                    value={externalUrl}
                    onChange={(event) => setExternalUrl(event.target.value)}
                    placeholder="https://behance.net/... or https://your-site.com/project"
                    leftIcon={<Link2 className="h-4 w-4" />}
                    helperText="Use this for interactive work, hosted case studies, or assets already published elsewhere."
                  />
                </div>
              )}
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-7 shadow-sm">
              <div className="mb-6">
                <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-violet-600">02 · Context</p>
                <h2 className="mt-1 text-xl font-extrabold tracking-tight text-slate-950">Tell the project story</h2>
              </div>

              <div className="space-y-5">
                <Input
                  label="Project title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Luxury skincare campaign · synthetic studio set"
                  maxLength={120}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">Category</label>
                    <select
                      value={category}
                      onChange={(event) => setCategory(event.target.value)}
                      className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                    >
                      {CATEGORIES.map((item) => <option key={item}>{item}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">Commercial rights</label>
                    <select
                      value={commercialRights}
                      onChange={(event) => setCommercialRights(event.target.value)}
                      className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                    >
                      <option>Rights negotiable</option>
                      <option>Commercial use permitted</option>
                      <option>Client-specific rights</option>
                      <option>Portfolio display only</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">Description</label>
                  <textarea
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    rows={4}
                    placeholder="What was the creative objective? What did you design, iterate, or solve?"
                    className="block w-full resize-y rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-sm leading-relaxed text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                  />
                </div>

                <TagInput
                  label="AI tools used"
                  value={aiTools}
                  onChange={setAiTools}
                  suggestions={AI_TOOL_SUGGESTIONS}
                  placeholder="Add Flux, ComfyUI, Midjourney..."
                />
                <TagInput
                  label="Skills demonstrated"
                  value={skills}
                  onChange={setSkills}
                  suggestions={SKILL_SUGGESTIONS}
                  placeholder="Add art direction, prompt engineering..."
                />
              </div>
            </section>

            <section className="rounded-3xl border border-violet-200 bg-white p-5 sm:p-7 shadow-sm ring-4 ring-violet-50/70">
              <div className="mb-6 flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                  <WandSparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-violet-600">03 · GenixSpark differentiator</p>
                  <h2 className="mt-1 text-xl font-extrabold tracking-tight text-slate-950">Make the AI workflow understandable</h2>
                  <p className="mt-1 text-sm leading-relaxed text-slate-500">You do not need to reveal proprietary prompts. Share enough process for a brand to trust how you work.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">Prompt / direction summary</label>
                  <textarea
                    value={promptSummary}
                    onChange={(event) => setPromptSummary(event.target.value)}
                    rows={6}
                    placeholder="Example: Built a structured art-direction prompt around translucent glass, warm rim lighting, macro lens behavior, then iterated composition and material consistency across a fixed seed family."
                    className="block w-full resize-y rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-sm leading-relaxed text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">Workflow summary</label>
                  <textarea
                    value={workflowSummary}
                    onChange={(event) => setWorkflowSummary(event.target.value)}
                    rows={6}
                    placeholder="Example: Flux generation → ComfyUI control pass → inpainting for product label fidelity → Photoshop cleanup → upscale/export variants for paid social."
                    className="block w-full resize-y rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-sm leading-relaxed text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                  />
                </div>
              </div>
            </section>
          </div>

          <aside className="space-y-5 xl:sticky xl:top-24 xl:self-start">
            <div className="rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white shadow-xl shadow-slate-200/60">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet-300">Publish settings</p>

              <button
                type="button"
                onClick={() => setIsPublished((current) => !current)}
                className="mt-5 flex w-full items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-left hover:bg-white/8 transition-colors"
              >
                <div>
                  <p className="text-sm font-bold">{isPublished ? 'Public on profile' : 'Save as private draft'}</p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-400">
                    {isPublished ? 'Brands can discover this work immediately.' : 'Only you can see this until you publish it.'}
                  </p>
                </div>
                <span className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${isPublished ? 'bg-violet-500' : 'bg-slate-700'}`}>
                  <span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${isPublished ? 'translate-x-6' : 'translate-x-1'}`} />
                </span>
              </button>

              <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="flex items-center gap-2 text-xs font-bold text-slate-200">
                  <LockKeyhole className="h-4 w-4 text-violet-300" />
                  Workflow transparency, not prompt leakage
                </p>
                <p className="mt-2 text-xs leading-relaxed text-slate-400">
                  Summarize the creative system and decisions. Keep proprietary prompt tokens, client secrets, and private model assets out of public descriptions.
                </p>
              </div>

              <div className="mt-5 space-y-2 text-xs text-slate-400">
                <p className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Media + metadata</p>
                <p className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> AI tools and skills</p>
                <p className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Process provenance</p>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              fullWidth
              isLoading={uploading || saving}
              leftIcon={<Sparkles className="h-4.5 w-4.5" />}
              className="rounded-xl shadow-lg shadow-violet-200"
            >
              {isPublished ? 'Publish portfolio item' : 'Save private draft'}
            </Button>
            <p className="text-center text-[11px] leading-relaxed text-slate-400">
              By publishing, you confirm you have the right to display this creative work.
            </p>
          </aside>
        </form>
      </div>
    </div>
  );
};
