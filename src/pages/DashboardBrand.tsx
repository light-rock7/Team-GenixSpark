import React, { useMemo, useState } from 'react';

import {

  AlertCircle,

  ArrowLeft,

  ArrowRight,

  CalendarDays,

  Check,

  CheckCircle2,

  CircleDollarSign,

  Compass,

  Eye,

  FileCheck2,

  FilePlus2,

  Filter,

  Image,

  Lightbulb,

  Plus,

  Search,

  Sparkles,

  Users,

  X,

} from 'lucide-react';

import { Link } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';

import { Button } from '../components/ui/Button';

import { Input } from '../components/ui/Input';



type BriefStatus = 'Draft' | 'Open' | 'In Progress' | 'Completed';

type ContentType = 'Product photography' | 'Short-form video' | 'Social media graphics' | 'UGC / testimonial' | 'Brand campaign';

type VisualStyle = 'Clean & minimal' | 'Bold & energetic' | 'Natural & authentic' | 'Luxury & premium' | 'Playful & colorful' | 'Editorial & cinematic';

type AspectRatio = '9:16 Vertical' | '1:1 Square' | '4:5 Portrait' | '16:9 Landscape';

type Tab = 'briefs' | 'discover' | 'proposals' | 'deliverables';



interface CreativeBrief {

  id: string;

  title: string;

  objective: string;

  contentType: ContentType;

  audience: string;

  description: string;

  style: VisualStyle;

  aspectRatio: AspectRatio;

  deliverables: string;

  mustHaves: string;

  avoid: string;

  budget: number;

  deadline: string;

  status: BriefStatus;

  createdAt: string;

}



interface Creator {

  id: string;

  name: string;

  category: string;

  location: string;

  style: string;

  price: number;

  platforms: string;

  bio: string;

  initials: string;

  color: string;

  portfolio: string[];

}



const visualStyles: { name: VisualStyle; detail: string; swatches: string[] }[] = [

  { name: 'Clean & minimal', detail: 'Simple layouts, whitespace, clear product focus', swatches: ['#f8fafc', '#cbd5e1', '#64748b'] },

  { name: 'Bold & energetic', detail: 'High contrast, confident colors, attention-grabbing', swatches: ['#fee2e2', '#f97316', '#7f1d1d'] },

  { name: 'Natural & authentic', detail: 'Real-life moments, warm light, relatable storytelling', swatches: ['#ecfccb', '#a3a380', '#57534e'] },

  { name: 'Luxury & premium', detail: 'Elegant composition, refined details, premium feel', swatches: ['#f5f5f4', '#c4a46c', '#292524'] },

  { name: 'Playful & colorful', detail: 'Bright colors, expressive shapes, upbeat mood', swatches: ['#fef08a', '#f472b6', '#818cf8'] },

  { name: 'Editorial & cinematic', detail: 'Story-led frames, dramatic lighting, film-like mood', swatches: ['#d6d3d1', '#78716c', '#1c1917'] },

];



const demoCreators: Creator[] = [

  { id: 'c1', name: 'Studio Mango', category: 'Product photography', location: 'Hyderabad', style: 'Clean & minimal', price: 8000, platforms: 'Instagram · Website', bio: 'Product visuals for emerging consumer brands, with careful lighting and clean compositions.', initials: 'SM', color: 'bg-amber-100 text-amber-800', portfolio: ['Product stills', 'Lifestyle set', 'Packaging'] },

  { id: 'c2', name: 'Aarav Creates', category: 'Short-form video', location: 'Bengaluru', style: 'Bold & energetic', price: 12000, platforms: 'Instagram · YouTube', bio: 'Fast-paced reels, launch videos, and creator-led storytelling for growing brands.', initials: 'AC', color: 'bg-violet-100 text-violet-800', portfolio: ['Launch reel', 'UGC ad', 'Behind the scenes'] },

  { id: 'c3', name: 'Earthtone Collective', category: 'UGC / testimonial', location: 'Chennai', style: 'Natural & authentic', price: 6500, platforms: 'Instagram · TikTok', bio: 'Relatable UGC and warm lifestyle content that feels natural rather than over-produced.', initials: 'EC', color: 'bg-emerald-100 text-emerald-800', portfolio: ['Routine video', 'Testimonial', 'Lifestyle'] },

  { id: 'c4', name: 'Frame & Form', category: 'Brand campaign', location: 'Mumbai', style: 'Luxury & premium', price: 18000, platforms: 'Instagram · Website', bio: 'Premium campaign concepts, refined product photography, and art direction.', initials: 'FF', color: 'bg-slate-200 text-slate-800', portfolio: ['Campaign hero', 'Editorial set', 'Brand story'] },

  { id: 'c5', name: 'ColorPop Design', category: 'Social media graphics', location: 'Vijayawada', style: 'Playful & colorful', price: 5000, platforms: 'Instagram · Facebook', bio: 'Bright, accessible social graphics and campaign kits for small businesses.', initials: 'CP', color: 'bg-pink-100 text-pink-800', portfolio: ['Carousel', 'Promo set', 'Story pack'] },

  { id: 'c6', name: 'Motion House', category: 'Short-form video', location: 'Hyderabad', style: 'Editorial & cinematic', price: 15000, platforms: 'Instagram · YouTube', bio: 'Cinematic short-form films, product motion, and story-driven launch content.', initials: 'MH', color: 'bg-blue-100 text-blue-800', portfolio: ['Brand film', 'Product motion', 'Cinematic reel'] },

];



const initialForm = {

  title: '', objective: 'Increase brand awareness', contentType: 'Short-form video' as ContentType,

  audience: '', description: '', style: 'Natural & authentic' as VisualStyle,

  aspectRatio: '9:16 Vertical' as AspectRatio, deliverables: '3 short videos',

  mustHaves: '', avoid: '', budget: '', deadline: '',

};



export const DashboardBrand: React.FC = () => {

  const { user, profile } = useAuth();

  const [activeTab, setActiveTab] = useState<Tab>('briefs');

  const [briefs, setBriefs] = useState<CreativeBrief[]>([]);

  const [showBuilder, setShowBuilder] = useState(false);

  const [step, setStep] = useState(0);

  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState(initialForm);

  const [error, setError] = useState('');

  const [submittedTitle, setSubmittedTitle] = useState('');

  const [search, setSearch] = useState('');

  const [creatorCategory, setCreatorCategory] = useState('All');

  const [creatorStyle, setCreatorStyle] = useState('All');

  const [maxBudget, setMaxBudget] = useState('25000');

  const [shortlisted, setShortlisted] = useState<string[]>([]);



  const update = <K extends keyof typeof initialForm>(key: K, value: typeof initialForm[K]) => {

    setForm(current => ({ ...current, [key]: value }));

    setError('');

  };



  const openCreate = () => {

    setForm({ ...initialForm, deadline: '' });

    setEditingId(null);

    setStep(0);

    setError('');

    setSubmittedTitle('');

    setShowBuilder(true);

    setActiveTab('briefs');

  };



  const openEdit = (brief: CreativeBrief) => {

    setForm({

      title: brief.title, objective: brief.objective, contentType: brief.contentType,

      audience: brief.audience, description: brief.description, style: brief.style,

      aspectRatio: brief.aspectRatio, deliverables: brief.deliverables, mustHaves: brief.mustHaves,

      avoid: brief.avoid, budget: String(brief.budget), deadline: brief.deadline,

    });

    setEditingId(brief.id);

    setStep(0);

    setError('');

    setShowBuilder(true);

  };



  const resetBuilder = () => {

    setShowBuilder(false);

    setStep(0);

    setError('');

    setEditingId(null);

  };



  const validateStep = () => {

    if (step === 0 && (!form.title.trim() || !form.description.trim() || !form.audience.trim())) {

      setError('Add a campaign name, a short description, and your target audience.');

      return false;

    }

    if (step === 2 && (!form.budget || Number(form.budget) <= 0 || !form.deadline)) {

      setError('Enter a budget greater than zero and choose a deadline.');

      return false;

    }

    setError('');

    return true;

  };



  const submitBrief = (status: BriefStatus) => {

    if (!validateStep()) return;

    const brief: CreativeBrief = {

      id: editingId ?? (typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : String(Date.now())),

      title: form.title.trim(), objective: form.objective, contentType: form.contentType,

      audience: form.audience.trim(), description: form.description.trim(), style: form.style,

      aspectRatio: form.aspectRatio, deliverables: form.deliverables.trim(),

      mustHaves: form.mustHaves.trim(), avoid: form.avoid.trim(), budget: Number(form.budget),

      deadline: form.deadline, status, createdAt: new Date().toISOString(),

    };

    setBriefs(current => editingId ? current.map(item => item.id === editingId ? brief : item) : [brief, ...current]);

    setSubmittedTitle(brief.title);

    setShowBuilder(false);

    setStep(0);

    setEditingId(null);

    setActiveTab('briefs');

  };



  const deleteBrief = (id: string) => {

    if (window.confirm('Delete this brief?')) setBriefs(current => current.filter(brief => brief.id !== id));

  };



  const filteredCreators = useMemo(() => {
    const query = search.trim().toLowerCase();
    const budgetLimit = Number(maxBudget || 0);
    const scoreCreator = (creator: Creator) => {
      let score = 0;
      if (creator.category === creatorCategory) score += 4;
      if (creator.style === creatorStyle) score += 3;
      if (query && `${creator.name} ${creator.category} ${creator.location} ${creator.style} ${creator.bio}`.toLowerCase().includes(query)) score += 5;
      if (creator.price <= budgetLimit) score += 2;
      return score;
    };

    const strictMatches = demoCreators.filter(creator => {
      const matchesSearch = !query || `${creator.name} ${creator.category} ${creator.location} ${creator.style} ${creator.bio}`.toLowerCase().includes(query);
      const matchesCategory = creatorCategory === 'All' || creator.category === creatorCategory;
      const matchesStyle = creatorStyle === 'All' || creator.style === creatorStyle;
      const matchesBudget = creator.price <= budgetLimit;
      return matchesSearch && matchesCategory && matchesStyle && matchesBudget;
    });

    if (strictMatches.length > 0) {
      return strictMatches.sort((a, b) => scoreCreator(b) - scoreCreator(a) || a.price - b.price);
    }

    // No exact matches? Show closest options instead of an empty result.
    // Prioritize requested category/style and prefer creators within budget.
    const affordable = demoCreators.filter(creator => creator.price <= budgetLimit);
    const candidates = affordable.length > 0 ? affordable : demoCreators;
    return candidates
      .map(creator => ({ creator, score: scoreCreator(creator) }))
      .sort((a, b) => b.score - a.score || a.creator.price - b.creator.price)
      .map(item => item.creator);
  }, [search, creatorCategory, creatorStyle, maxBudget]);



  const statusClass: Record<BriefStatus, string> = {

    Draft: 'bg-slate-100 text-slate-700',

    Open: 'bg-emerald-100 text-emerald-700',

    'In Progress': 'bg-blue-100 text-blue-700',

    Completed: 'bg-violet-100 text-violet-700',

  };



  const tabs: { id: Tab; label: string; icon: React.ReactNode; count?: number }[] = [

    { id: 'briefs', label: 'My briefs', icon: <FilePlus2 className="h-4 w-4" />, count: briefs.length },

    { id: 'discover', label: 'Discover creators', icon: <Compass className="h-4 w-4" /> },

    { id: 'proposals', label: 'Proposals', icon: <Users className="h-4 w-4" /> },

    { id: 'deliverables', label: 'Deliverables', icon: <FileCheck2 className="h-4 w-4" /> },

  ];



  return (

    <main className="mx-auto w-full max-w-7xl px-4 py-7 sm:px-6 lg:px-8">

      <section className="mb-7 overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-violet-950 to-indigo-900 p-6 text-white sm:p-8">

        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold">

              <Sparkles className="h-3.5 w-3.5 text-violet-300" /> BRAND CAMPAIGN WORKSPACE

            </span>

            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Make your next campaign happen.</h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">

              Turn your idea into a clear creative brief, then find creators who can bring it to life.

            </p>

            <p className="mt-3 text-sm text-slate-300">

              Welcome, <span className="font-semibold text-white">{profile?.display_name || 'Brand Partner'}</span>

              {user?.email ? ` · ${user.email}` : ''}

            </p>

          </div>

          <div className="flex flex-wrap gap-3">

            <Button onClick={openCreate} leftIcon={<Plus className="h-4 w-4" />}>Create a brief</Button>

            <Link to="/dashboard/brand/profile" className="inline-flex items-center rounded-lg border border-white/30 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10">

              Edit brand profile

            </Link>

          </div>

        </div>

        <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">

          {[

            { label: 'Creative briefs', value: briefs.length, icon: <FilePlus2 className="h-4 w-4" /> },

            { label: 'Open campaigns', value: briefs.filter(b => b.status === 'Open').length, icon: <Eye className="h-4 w-4" /> },

            { label: 'Shortlisted creators', value: shortlisted.length, icon: <Users className="h-4 w-4" /> },

            { label: 'Creator options', value: demoCreators.length, icon: <Compass className="h-4 w-4" /> },

          ].map(item => (

            <div key={item.label} className="rounded-2xl border border-white/10 bg-white/10 p-4">

              <div className="flex items-center gap-2 text-xs text-slate-300">{item.icon}{item.label}</div>

              <p className="mt-2 text-2xl font-bold">{item.value}</p>

            </div>

          ))}

        </div>

      </section>



      <nav className="mb-6 flex gap-2 overflow-x-auto border-b border-slate-200 pb-px" aria-label="Brand workspace tabs">

        {tabs.map(tab => (

          <button key={tab.id} type="button" onClick={() => { setActiveTab(tab.id); setShowBuilder(false); }}

            className={`inline-flex shrink-0 items-center gap-2 border-b-2 px-3 py-3 text-sm font-semibold transition ${activeTab === tab.id ? 'border-violet-600 text-violet-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>

            {tab.icon}{tab.label}

            {tab.count !== undefined && <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs">{tab.count}</span>}

          </button>

        ))}

      </nav>



      {submittedTitle && !showBuilder && (

        <div className="mb-5 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">

          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />

          <div className="flex-1 text-sm"><p className="font-bold">Brief saved in this demo</p><p className="mt-1">“{submittedTitle}” is now in your briefs. Next, discover creators that match your direction.</p></div>

          <button aria-label="Dismiss message" onClick={() => setSubmittedTitle('')} className="rounded-lg p-1 hover:bg-emerald-100"><X className="h-4 w-4" /></button>

        </div>

      )}



      {activeTab === 'briefs' && !showBuilder && (

        <section>

          <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">

            <div><h2 className="text-xl font-bold text-slate-900">Your creative briefs</h2><p className="mt-1 text-sm text-slate-500">Keep your campaign requirements clear and ready for creators.</p></div>

            <Button onClick={openCreate} leftIcon={<Plus className="h-4 w-4" />}>Build a brief</Button>

          </div>

          {briefs.length === 0 ? (

            <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-700"><Lightbulb className="h-7 w-7" /></div>

              <h3 className="mt-4 text-lg font-bold text-slate-900">Start with your idea, not a blank template.</h3>

              <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">Tell us what you want to achieve. We’ll help you organize the content, style, deliverables, and budget into a brief creators can understand.</p>

              <Button onClick={openCreate} className="mt-5" leftIcon={<Sparkles className="h-4 w-4" />}>Create my first brief</Button>

            </div>

          ) : (

            <div className="grid gap-4 lg:grid-cols-2">

              {briefs.map(brief => (

                <article key={brief.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">

                  <div className="flex items-start justify-between gap-3">

                    <div><p className="text-xs font-semibold uppercase tracking-wide text-violet-700">{brief.objective}</p><h3 className="mt-1 text-lg font-bold text-slate-900">{brief.title}</h3></div>

                    <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${statusClass[brief.status]}`}>{brief.status}</span>

                  </div>

                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{brief.description}</p>

                  <div className="mt-4 flex flex-wrap gap-2 text-xs">

                    <span className="rounded-full bg-slate-100 px-3 py-1.5 text-slate-700">{brief.contentType}</span>

                    <span className="rounded-full bg-violet-50 px-3 py-1.5 text-violet-700">{brief.style}</span>

                    <span className="rounded-full bg-slate-100 px-3 py-1.5 text-slate-700">{brief.aspectRatio}</span>

                  </div>

                  <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-600">

                    <span className="inline-flex items-center gap-1.5"><CircleDollarSign className="h-4 w-4" />?{brief.budget.toLocaleString('en-IN')}</span>

                    <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-4 w-4" />{brief.deadline}</span>

                  </div>

                  <div className="mt-5 flex flex-wrap justify-between gap-2 border-t border-slate-100 pt-4">



<Button

  variant="outline"

  size="sm"

  onClick={() => {

    setActiveTab('discover');

    setSearch('');

    setCreatorCategory(brief.contentType);

    setCreatorStyle(brief.style);

    setMaxBudget(String(brief.budget));

  }}

>

  Find matching creators

</Button>

                    <div className="flex gap-2"><Button variant="ghost" size="sm" onClick={() => openEdit(brief)}>Edit</Button><Button variant="danger" size="sm" onClick={() => deleteBrief(brief.id)}>Delete</Button></div>

                  </div>

                </article>

              ))}

            </div>

          )}

        </section>

      )}



      {activeTab === 'briefs' && showBuilder && (

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-200 bg-slate-50 px-5 py-5 sm:px-8">

            <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-widest text-violet-700">Guided brief builder</p><h2 className="mt-1 text-2xl font-extrabold text-slate-900">{editingId ? 'Edit your campaign' : 'Let’s shape your campaign idea'}</h2><p className="mt-1 text-sm text-slate-500">Four short steps. You can review everything before saving.</p></div><button onClick={resetBuilder} aria-label="Close brief builder" className="rounded-xl p-2 text-slate-500 hover:bg-slate-200"><X className="h-5 w-5" /></button></div>

            <div className="mt-5 grid grid-cols-4 gap-2">

              {['Campaign idea', 'Visual direction', 'Budget & timing', 'Review'].map((label, index) => <button key={label} type="button" onClick={() => { if (index < step) { setStep(index); setError(''); } }} className="text-left"><div className={`mb-2 h-1.5 rounded-full ${step >= index ? 'bg-violet-600' : 'bg-slate-200'}`} /><span className={`text-xs font-semibold ${step === index ? 'text-violet-700' : 'text-slate-500'}`}>{index + 1}. {label}</span></button>)}

            </div>

          </div>

          <div className="px-5 py-6 sm:px-8 sm:py-8">

            {step === 0 && <div className="space-y-5">

              <div><h3 className="text-lg font-bold text-slate-900">Tell us what you want to achieve</h3><p className="mt-1 text-sm text-slate-500">Plain language is perfect. You don't need to know marketing jargon.</p></div>

              <Input label="Campaign name" placeholder="e.g. Launch our new organic face wash" value={form.title} onChange={e => update('title', e.target.value)} required maxLength={120} />

              <div><label className="mb-1.5 block text-sm font-semibold text-slate-700">What is your main goal?</label><div className="grid gap-2 sm:grid-cols-2">{['Increase brand awareness', 'Launch a product', 'Drive sales or sign-ups', 'Build trust and community'].map(goal => <button type="button" key={goal} onClick={() => update('objective', goal)} className={`rounded-xl border p-3 text-left text-sm font-semibold ${form.objective === goal ? 'border-violet-500 bg-violet-50 text-violet-800 ring-1 ring-violet-200' : 'border-slate-200 hover:border-slate-300'}`}>{goal}</button>)}</div></div>

              <div><label className="mb-1.5 block text-sm font-semibold text-slate-700">What kind of content do you need?</label><div className="grid gap-2 sm:grid-cols-2">{(['Product photography', 'Short-form video', 'Social media graphics', 'UGC / testimonial', 'Brand campaign'] as ContentType[]).map(type => <button key={type} type="button" onClick={() => update('contentType', type)} className={`rounded-xl border p-3 text-left text-sm font-semibold ${form.contentType === type ? 'border-violet-500 bg-violet-50 text-violet-800 ring-1 ring-violet-200' : 'border-slate-200 hover:border-slate-300'}`}>{type}</button>)}</div></div>

              <Input label="Who do you want to reach?" placeholder="e.g. College students aged 18–24 who care about skincare" value={form.audience} onChange={e => update('audience', e.target.value)} required />

              <div><label className="mb-1.5 block text-sm font-semibold text-slate-700">Describe your idea</label><textarea rows={4} value={form.description} onChange={e => update('description', e.target.value)} placeholder="What are you promoting? What should people understand, feel, or do after seeing the content?" className="w-full rounded-xl border border-slate-300 px-3.5 py-3 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100" required /></div>

            </div>}

            {step === 1 && <div className="space-y-6">

              <div><h3 className="text-lg font-bold text-slate-900">Show creators the feeling you want</h3><p className="mt-1 text-sm text-slate-500">Choose a direction based on the look and feel you like.</p></div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{visualStyles.map(style => <button key={style.name} type="button" onClick={() => update('style', style.name)} className={`rounded-2xl border p-4 text-left transition ${form.style === style.name ? 'border-violet-500 bg-violet-50 ring-2 ring-violet-100' : 'border-slate-200 hover:border-slate-300'}`}><div className="mb-4 flex h-12 overflow-hidden rounded-xl">{style.swatches.map(color => <span key={color} className="flex-1" style={{ backgroundColor: color }} />)}</div><p className="font-bold text-slate-900">{style.name}</p><p className="mt-1 text-xs leading-5 text-slate-500">{style.detail}</p>{form.style === style.name && <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-violet-700"><Check className="h-3.5 w-3.5" /> Selected</span>}</button>)}</div>

              <div><label className="mb-1.5 block text-sm font-semibold text-slate-700">Preferred content format</label><div className="grid gap-2 sm:grid-cols-2">{(['9:16 Vertical', '1:1 Square', '4:5 Portrait', '16:9 Landscape'] as AspectRatio[]).map(ratio => <button key={ratio} type="button" onClick={() => update('aspectRatio', ratio)} className={`flex items-center gap-3 rounded-xl border p-3 text-sm font-semibold ${form.aspectRatio === ratio ? 'border-violet-500 bg-violet-50 text-violet-800' : 'border-slate-200'}`}><Image className="h-4 w-4" />{ratio}{form.aspectRatio === ratio && <Check className="ml-auto h-4 w-4" />}</button>)}</div></div>

              <Input label="What should the creator deliver?" placeholder="e.g. 3 reels, 5 product photos, 1 story set" value={form.deliverables} onChange={e => update('deliverables', e.target.value)} />

              <div className="grid gap-5 sm:grid-cols-2"><div><label className="mb-1.5 block text-sm font-semibold text-slate-700">Must-have requirements</label><textarea rows={3} value={form.mustHaves} onChange={e => update('mustHaves', e.target.value)} placeholder="e.g. Show the product label clearly; use our logo" className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-100" /></div><div><label className="mb-1.5 block text-sm font-semibold text-slate-700">Things to avoid</label><textarea rows={3} value={form.avoid} onChange={e => update('avoid', e.target.value)} placeholder="e.g. No exaggerated claims; avoid dark backgrounds" className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-100" /></div></div>

            </div>}

            {step === 2 && <div className="space-y-5">

              <div><h3 className="text-lg font-bold text-slate-900">Set a realistic budget and deadline</h3><p className="mt-1 text-sm text-slate-500">These details help creators decide whether the project is a fit.</p></div>

              <div className="grid gap-5 sm:grid-cols-2"><Input label="Total budget (? INR)" type="number" min="1" step="1" placeholder="e.g. 10000" value={form.budget} onChange={e => update('budget', e.target.value)} leftIcon={<CircleDollarSign className="h-4 w-4" />} required /><Input label="Target delivery date" type="date" min={new Date().toISOString().slice(0, 10)} value={form.deadline} onChange={e => update('deadline', e.target.value)} leftIcon={<CalendarDays className="h-4 w-4" />} required /></div>

              <div className="rounded-2xl bg-violet-50 p-4"><p className="text-sm font-bold text-violet-900">Helpful tip</p><p className="mt-1 text-sm leading-6 text-violet-800">Be clear about the number of assets and the deadline. If you need paid-ad usage or several revision rounds, mention that in your must-have requirements.</p></div>

            </div>}

            {step === 3 && <div className="space-y-5">

              <div><h3 className="text-lg font-bold text-slate-900">Review your creative brief</h3><p className="mt-1 text-sm text-slate-500">Check the details before making it available in this demo workspace.</p></div>

              <div className="rounded-2xl border border-slate-200 p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wide text-violet-700">{form.objective}</p><h4 className="mt-1 text-xl font-extrabold text-slate-900">{form.title || 'Untitled campaign'}</h4></div><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">Ready to review</span></div><p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-600">{form.description || 'Add a description in step 1.'}</p>

                <div className="mt-5 grid gap-4 border-t border-slate-100 pt-4 sm:grid-cols-2"><div><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Audience</p><p className="mt-1 text-sm font-medium text-slate-800">{form.audience || 'Not provided'}</p></div><div><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Content type</p><p className="mt-1 text-sm font-medium text-slate-800">{form.contentType}</p></div><div><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Visual direction</p><p className="mt-1 text-sm font-medium text-slate-800">{form.style}</p></div><div><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Format & deliverables</p><p className="mt-1 text-sm font-medium text-slate-800">{form.aspectRatio} · {form.deliverables || 'Not specified'}</p></div><div><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Budget</p><p className="mt-1 text-sm font-medium text-slate-800">{form.budget ? `?${Number(form.budget).toLocaleString('en-IN')}` : 'Not provided'}</p></div><div><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Deadline</p><p className="mt-1 text-sm font-medium text-slate-800">{form.deadline || 'Not provided'}</p></div></div>

                {(form.mustHaves || form.avoid) && <div className="mt-4 grid gap-4 border-t border-slate-100 pt-4 sm:grid-cols-2">{form.mustHaves && <div><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Must-have</p><p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">{form.mustHaves}</p></div>}{form.avoid && <div><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Avoid</p><p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">{form.avoid}</p></div>}</div>}

              </div>

              <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /><p>Demo briefs are saved in this browser on this device. They are not yet synced to the shared backend.</p></div>

            </div>}

            {error && <p role="alert" className="mt-5 flex items-center gap-2 text-sm font-medium text-rose-600"><AlertCircle className="h-4 w-4" />{error}</p>}

            <div className="mt-8 flex flex-wrap justify-between gap-3 border-t border-slate-100 pt-5">

              <div>{step > 0 ? <Button variant="outline" onClick={() => { setStep(current => current - 1); setError(''); }} leftIcon={<ArrowLeft className="h-4 w-4" />}>Back</Button> : <Button variant="ghost" onClick={resetBuilder}>Cancel</Button>}</div>

              {step < 3 ? <Button onClick={() => { if (validateStep()) setStep(current => current + 1); }} rightIcon={<ArrowRight className="h-4 w-4" />}>Continue</Button> : <div className="flex flex-wrap gap-2"><Button variant="outline" onClick={() => submitBrief('Draft')}>Save draft</Button><Button onClick={() => submitBrief('Open')} leftIcon={<CheckCircle2 className="h-4 w-4" />}>{editingId ? 'Save changes' : 'Submit brief'}</Button></div>}

            </div>

          </div>

        </section>

      )}



      {activeTab === 'discover' && (

        <section>

          <div className="mb-5"><h2 className="text-xl font-bold text-slate-900">Find your creative match</h2><p className="mt-1 text-sm text-slate-500">Explore demo creator profiles and shortlist people to review later.</p></div>

          <div className="mb-5 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-4">

            <div className="relative"><Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" /><input aria-label="Search creators" value={search} onChange={e => setSearch(e.target.value)} placeholder="Name, location, skill..." className="w-full rounded-xl border border-slate-300 py-2.5 pl-9 pr-3 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-100" /></div>

            <select aria-label="Filter by content type" value={creatorCategory} onChange={e => setCreatorCategory(e.target.value)} className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm"><option>All</option>{(['Product photography', 'Short-form video', 'Social media graphics', 'UGC / testimonial', 'Brand campaign'] as ContentType[]).map(item => <option key={item}>{item}</option>)}</select>

            <select aria-label="Filter by visual style" value={creatorStyle} onChange={e => setCreatorStyle(e.target.value)} className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm"><option>All</option>{visualStyles.map(item => <option key={item.name}>{item.name}</option>)}</select>

            <div><label className="mb-1 block text-xs font-semibold text-slate-500">Maximum project budget (?)</label><input type="number" min="0" value={maxBudget} onChange={e => setMaxBudget(e.target.value)} className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-100" /></div>

          </div>

          <div className="mb-4 flex items-center justify-between text-sm text-slate-500"><span className="inline-flex items-center gap-2"><Filter className="h-4 w-4" />{filteredCreators.length} creator options</span><span>{shortlisted.length} shortlisted</span></div>

          {filteredCreators.length === 0 ? <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center"><Search className="mx-auto h-8 w-8 text-slate-400" /><p className="mt-3 font-semibold text-slate-800">No creators match those filters.</p><button className="mt-2 text-sm font-semibold text-violet-700" onClick={() => { setSearch(''); setCreatorCategory('All'); setCreatorStyle('All'); setMaxBudget('25000'); }}>Clear filters</button></div> : <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{filteredCreators.map(creator => {

            const relatedBrief = briefs.find(brief => brief.contentType === creator.category || brief.style === creator.style);

            const isShortlisted = shortlisted.includes(creator.id);

            return <article key={creator.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

              <div className="flex items-start gap-3 p-5"><div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-sm font-extrabold ${creator.color}`}>{creator.initials}</div><div className="min-w-0 flex-1"><h3 className="font-bold text-slate-900">{creator.name}</h3><p className="mt-0.5 text-xs text-slate-500">{creator.location} · {creator.category}</p><span className="mt-2 inline-flex rounded-full bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-700">{creator.style}</span></div><span className="whitespace-nowrap text-sm font-extrabold text-slate-900">?{creator.price.toLocaleString('en-IN')}</span></div>

              <div className="px-5 pb-4"><p className="text-sm leading-6 text-slate-600">{creator.bio}</p><p className="mt-3 text-xs text-slate-500">{creator.platforms}</p>

                <div className="mt-4 rounded-xl bg-slate-50 p-3"><p className="text-xs font-bold uppercase tracking-wide text-slate-500">Portfolio samples</p><div className="mt-2 flex flex-wrap gap-1.5">{creator.portfolio.map(sample => <span key={sample} className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600">{sample}</span>)}</div></div>

                {relatedBrief && <p className="mt-3 flex items-start gap-2 text-xs leading-5 text-emerald-700"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" />Possible fit: aligns with “{relatedBrief.title}” by content type or visual style.</p>}

              </div>

              <div className="border-t border-slate-100 p-4"><Button fullWidth variant={isShortlisted ? 'secondary' : 'outline'} onClick={() => setShortlisted(current => isShortlisted ? current.filter(id => id !== creator.id) : [...current, creator.id])}>{isShortlisted ? <><Check className="mr-2 h-4 w-4" />Shortlisted</> : <><Plus className="mr-2 h-4 w-4" />Add to shortlist</>}</Button></div>

            </article>;

          })}</div>}

          <p className="mt-5 text-xs text-slate-400">Creator profiles and prices are sample demo data, not live marketplace listings.</p>

        </section>

      )}



      {activeTab === 'proposals' && <section className="rounded-3xl border border-slate-200 bg-white px-6 py-14 text-center"><Users className="mx-auto h-10 w-10 text-violet-600" /><h2 className="mt-4 text-xl font-bold text-slate-900">Creator proposals</h2><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">Proposal data will appear here after the marketplace backend is connected. For now, discover and shortlist sample creators.</p><Button className="mt-5" onClick={() => setActiveTab('discover')}>Discover creators</Button></section>}

      {activeTab === 'deliverables' && <section className="rounded-3xl border border-slate-200 bg-white px-6 py-14 text-center"><FileCheck2 className="mx-auto h-10 w-10 text-violet-600" /><h2 className="mt-4 text-xl font-bold text-slate-900">Active deliverables</h2><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">Approved contracts and deliverable tracking will be connected when the backend workflow is ready.</p></section>}



      {import.meta.env.DEV && <p className="mt-8 text-xs text-slate-400">Prototype mode · {user?.id ? 'Authenticated session detected' : 'No user session detected'} · Demo briefs and shortlists are saved locally in this browser.</p>}

    </main>

  );

};


