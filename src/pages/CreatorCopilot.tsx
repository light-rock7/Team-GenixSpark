import React, { useMemo, useState } from 'react';
import { AlertTriangle, ArrowUp, CheckCircle2, FileText, ShieldCheck, Sparkles, UserRound, WandSparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CreatorWorkspaceNav } from '../components/creator/CreatorWorkspaceNav';
import { Button } from '../components/ui/Button';
import { LoadingState } from '../components/ui/LoadingState';
import { useCreatorPortfolio } from '../hooks/useCreatorPortfolio';
import { useCreatorProfile } from '../hooks/useCreatorProfile';
import { askCreatorCopilot } from '../services/copilotService';
import type { CopilotHistoryMessage, CopilotSurface, CreatorCopilotResponse } from '../types/copilot';
import type { CreatorProfileUpdate } from '../types/creator';

const PROFILE_PROMPTS = [
  'Audit my profile and tell me the three biggest credibility gaps.',
  'Rewrite my headline to be more specific without exaggerating my experience.',
  'Which skills should I add or remove based only on my current toolchain and portfolio proof?',
  'Does my portfolio actually prove the AI tools I claim on my profile?',
  'What should I improve before a brand evaluates this profile?',
];

const PORTFOLIO_PROMPTS = [
  'How can I explain my workflow without revealing proprietary prompts?',
  'Which portfolio case study should I strengthen first and why?',
  'What proof is missing from my portfolio for the capabilities I claim?',
  'How should I describe AI workflow evidence so a brand can trust the process?',
  'Check my portfolio context for prompt-IP or confidential information risks.',
];

const mergeUnique = (current: string[], suggested?: string[]) => {
  if (!suggested) return current;
  const seen = new Set<string>();
  return [...current, ...suggested]
    .map((item) => item.trim())
    .filter((item) => item && !seen.has(item.toLowerCase()) && seen.add(item.toLowerCase()))
    .slice(0, 12);
};

export const CreatorCopilot: React.FC = () => {
  const { profile, completion, loading: profileLoading, saving, error: profileError, save } = useCreatorProfile();
  const { items, loading: portfolioLoading, error: portfolioError } = useCreatorPortfolio();
  const [surface, setSurface] = useState<CopilotSurface>('profile');
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<CopilotHistoryMessage[]>([
    {
      role: 'assistant',
      content: 'I use your current GenixSpark profile and portfolio proof as context. Ask me what to improve, what is unsupported, or how to explain your workflow without exposing proprietary prompts.',
    },
  ]);
  const [lastResponse, setLastResponse] = useState<CreatorCopilotResponse | null>(null);
  const [sending, setSending] = useState(false);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const publishedItems = useMemo(() => items.filter((item) => item.is_published), [items]);
  const proofedTools = useMemo(() => new Set(
    publishedItems.flatMap((item) => item.ai_tools).map((item) => item.toLowerCase())
  ), [publishedItems]);
  const claimedWithoutProof = useMemo(() => (
    (profile?.ai_tools || []).filter((tool) => !proofedTools.has(tool.toLowerCase()))
  ), [profile?.ai_tools, proofedTools]);

  const context = useMemo(() => ({
    profile: profile ? {
      display_name: profile.display_name,
      headline: profile.headline,
      bio: profile.bio,
      location: profile.location,
      availability: profile.availability,
      years_experience: profile.years_experience,
      hourly_rate: profile.hourly_rate,
      skills: profile.skills,
      ai_tools: profile.ai_tools,
      specializations: profile.specializations,
    } : null,
    portfolio: items.slice(0, 8).map((item) => ({
      title: item.title,
      description: item.description,
      category: item.category,
      ai_tools: item.ai_tools,
      skills: item.skills,
      prompt_summary: item.prompt_summary,
      workflow_summary: item.workflow_summary,
      commercial_rights: item.commercial_rights,
      is_published: item.is_published,
    })),
    profile_completion: completion.percent,
    missing_profile_signals: completion.missing,
    claimed_tools_without_portfolio_proof: claimedWithoutProof,
  }), [profile, items, completion.percent, completion.missing, claimedWithoutProof]);

  const ask = async (suggestedPrompt?: string) => {
    const question = (suggestedPrompt ?? prompt).trim();
    if (!question || sending) return;

    setError(null);
    setNotice(null);
    setSending(true);
    setPrompt('');
    const history = messages.slice(-6);
    setMessages((current) => [...current, { role: 'user', content: question }]);

    try {
      const response = await askCreatorCopilot({ surface, message: question, history, context });
      setLastResponse(response);
      setMessages((current) => [...current, { role: 'assistant', content: response.answer }]);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Creator Copilot could not answer this request.');
    } finally {
      setSending(false);
    }
  };

  const applyProfilePatch = async () => {
    if (!profile || !lastResponse?.apply) return;
    setApplying(true);
    setError(null);
    setNotice(null);

    const patch = lastResponse.apply;
    const update: CreatorProfileUpdate = {
      display_name: profile.display_name,
      headline: patch.headline ?? profile.headline,
      bio: patch.bio ?? profile.bio,
      location: profile.location,
      availability: profile.availability,
      years_experience: profile.years_experience,
      hourly_rate: profile.hourly_rate,
      skills: mergeUnique(profile.skills, patch.skills),
      ai_tools: mergeUnique(profile.ai_tools, patch.ai_tools),
      specializations: mergeUnique(profile.specializations, patch.specializations),
      website_url: profile.website_url,
      social_url: profile.social_url,
    };

    try {
      await save(update);
      setNotice('Copilot suggestions applied to your creator profile. Review the profile before treating the copy as final.');
      setLastResponse((current) => current ? { ...current, apply: undefined } : current);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to apply Copilot suggestions.');
    } finally {
      setApplying(false);
    }
  };

  if (profileLoading || portfolioLoading) {
    return (
      <>
        <CreatorWorkspaceNav />
        <LoadingState message="Preparing Creator Copilot" description="Reading your profile signals and workflow-backed portfolio proof." />
      </>
    );
  }

  const quickPrompts = surface === 'profile' ? PROFILE_PROMPTS : PORTFOLIO_PROMPTS;
  const dataError = profileError || portfolioError;

  return (
    <div className="min-h-full bg-[#f7f8fb]">
      <CreatorWorkspaceNav />

      <section className="border-b border-slate-800 bg-[#0b1020] text-white">
        <div className="page-shell py-11 sm:py-14">
          <div className="grid gap-8 lg:grid-cols-[1fr_340px] lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-300/15 bg-violet-300/[0.06] px-3 py-1.5 text-[10px] font-semibold text-violet-200">
                <WandSparkles className="h-3.5 w-3.5" /> Context-aware creator guidance
              </div>
              <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">Turn raw AI experience into credible marketplace signals.</h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                Copilot reasons over your actual profile and portfolio metadata. It can improve positioning, expose proof gaps and help explain process without asking you to publish proprietary prompts.
              </p>
            </div>

            <div className="rounded-[20px] border border-white/10 bg-white/[0.04] p-5">
              <div className="grid grid-cols-3 gap-3">
                <div><p className="text-2xl font-semibold">{completion.percent}%</p><p className="mt-1 text-[9px] uppercase tracking-[0.12em] text-slate-500">Profile</p></div>
                <div><p className="text-2xl font-semibold">{publishedItems.length}</p><p className="mt-1 text-[9px] uppercase tracking-[0.12em] text-slate-500">Proofs</p></div>
                <div><p className="text-2xl font-semibold">{claimedWithoutProof.length}</p><p className="mt-1 text-[9px] uppercase tracking-[0.12em] text-slate-500">Proof gaps</p></div>
              </div>
              <div className="mt-4 border-t border-white/10 pt-4 text-[11px] leading-5 text-slate-400">AI suggestions are editable guidance, never verified facts. You remain in control of every profile change.</div>
            </div>
          </div>
        </div>
      </section>

      <div className="page-shell py-8 sm:py-10">
        {(error || notice || dataError) && (
          <div className={`mb-6 rounded-xl border px-4 py-3 text-xs font-semibold ${error || dataError ? 'border-rose-200 bg-rose-50 text-rose-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}`}>
            {error || dataError || notice}
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_330px]">
          <main className="space-y-5">
            <section className="surface-card overflow-hidden rounded-[24px]">
              <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-700"><Sparkles className="h-4.5 w-4.5" /></div>
                  <div><p className="text-sm font-extrabold text-slate-950">Creator Copilot</p><p className="mt-0.5 text-[10px] text-slate-400">Grounded in your GenixSpark context</p></div>
                </div>
                <div className="inline-flex rounded-xl bg-slate-100 p-1">
                  <button type="button" onClick={() => setSurface('profile')} className={`rounded-lg px-3 py-2 text-[11px] font-bold ${surface === 'profile' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500'}`}>Profile</button>
                  <button type="button" onClick={() => setSurface('portfolio')} className={`rounded-lg px-3 py-2 text-[11px] font-bold ${surface === 'portfolio' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500'}`}>Portfolio</button>
                </div>
              </div>

              <div className="max-h-[540px] min-h-[360px] space-y-4 overflow-y-auto bg-slate-50/50 px-5 py-6 sm:px-6">
                {messages.map((message, index) => (
                  <div key={`${message.role}-${index}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-[12px] leading-6 ${message.role === 'user' ? 'bg-slate-950 text-white' : 'border border-slate-200 bg-white text-slate-700 shadow-sm'}`}>
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                ))}
                {sending && (
                  <div className="flex justify-start"><div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-[11px] text-slate-400 shadow-sm">Reviewing your current signals…</div></div>
                )}
              </div>

              <div className="border-t border-slate-100 bg-white p-4 sm:p-5">
                <div className="mb-3 flex flex-wrap gap-2">
                  {quickPrompts.slice(0, 3).map((item) => (
                    <button key={item} type="button" onClick={() => void ask(item)} disabled={sending} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-semibold text-slate-600 transition-colors hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 disabled:opacity-50">
                      {item.length > 55 ? `${item.slice(0, 55)}…` : item}
                    </button>
                  ))}
                </div>
                <div className="flex items-end gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm focus-within:border-violet-400 focus-within:ring-4 focus-within:ring-violet-50">
                  <textarea
                    value={prompt}
                    onChange={(event) => setPrompt(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' && !event.shiftKey) {
                        event.preventDefault();
                        void ask();
                      }
                    }}
                    rows={2}
                    maxLength={1200}
                    placeholder={surface === 'profile' ? 'Ask about your headline, bio, capabilities or profile gaps…' : 'Ask about workflow proof, case-study quality or prompt privacy…'}
                    className="min-h-[52px] flex-1 resize-none bg-transparent px-2 py-2 text-sm leading-5 text-slate-900 outline-none placeholder:text-slate-400"
                  />
                  <button type="button" onClick={() => void ask()} disabled={!prompt.trim() || sending} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white shadow-sm transition-colors hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-40" aria-label="Ask Creator Copilot">
                    <ArrowUp className="h-4 w-4" />
                  </button>
                </div>
                <p className="mt-2 text-[9px] leading-4 text-slate-400">Do not paste confidential client assets, API keys or proprietary full prompts into chat.</p>
              </div>
            </section>

            {lastResponse && (lastResponse.recommendations.length > 0 || lastResponse.privacyWarnings.length > 0 || lastResponse.apply) && (
              <section className="grid gap-4 lg:grid-cols-2">
                <div className="surface-card rounded-[20px] p-5">
                  <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600" /><p className="text-xs font-extrabold text-slate-950">Recommended next moves</p></div>
                  <div className="mt-4 space-y-2.5">
                    {lastResponse.recommendations.length > 0 ? lastResponse.recommendations.map((item) => <p key={item} className="text-[11px] leading-5 text-slate-600">• {item}</p>) : <p className="text-[11px] text-slate-400">No additional actions suggested.</p>}
                  </div>
                </div>

                <div className="surface-card rounded-[20px] p-5">
                  <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-violet-600" /><p className="text-xs font-extrabold text-slate-950">Prompt & privacy guard</p></div>
                  <div className="mt-4 space-y-2.5">
                    {lastResponse.privacyWarnings.length > 0 ? lastResponse.privacyWarnings.map((item) => <p key={item} className="text-[11px] leading-5 text-amber-700">• {item}</p>) : <p className="text-[11px] leading-5 text-slate-500">No specific privacy issue was flagged in this response.</p>}
                  </div>
                </div>

                {lastResponse.apply && (
                  <div className="surface-card rounded-[20px] p-5 lg:col-span-2">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-xs font-extrabold text-slate-950">Reviewable profile patch</p>
                        <p className="mt-1 text-[10px] leading-5 text-slate-500">Copilot never writes silently. Review these suggestions, then apply them to your editable creator profile.</p>
                      </div>
                      <Button type="button" size="sm" isLoading={applying || saving} onClick={() => void applyProfilePatch()} leftIcon={<WandSparkles className="h-3.5 w-3.5" />}>Apply suggestions</Button>
                    </div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {lastResponse.apply.headline && <div className="rounded-xl bg-slate-50 p-3"><p className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">Headline</p><p className="mt-2 text-[11px] leading-5 text-slate-700">{lastResponse.apply.headline}</p></div>}
                      {lastResponse.apply.bio && <div className="rounded-xl bg-slate-50 p-3"><p className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">Bio</p><p className="mt-2 text-[11px] leading-5 text-slate-700">{lastResponse.apply.bio}</p></div>}
                      {lastResponse.apply.skills && <div className="rounded-xl bg-slate-50 p-3"><p className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">Suggested skills</p><p className="mt-2 text-[11px] leading-5 text-slate-700">{lastResponse.apply.skills.join(' · ')}</p></div>}
                      {lastResponse.apply.specializations && <div className="rounded-xl bg-slate-50 p-3"><p className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">Specializations</p><p className="mt-2 text-[11px] leading-5 text-slate-700">{lastResponse.apply.specializations.join(' · ')}</p></div>}
                    </div>
                  </div>
                )}
              </section>
            )}
          </main>

          <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
            <div className="surface-card rounded-[20px] p-5">
              <div className="flex items-center justify-between"><p className="text-xs font-extrabold text-slate-950">Context Copilot can see</p><UserRound className="h-4 w-4 text-slate-300" /></div>
              <div className="mt-4 space-y-3 text-[11px]">
                <div className="flex items-center justify-between"><span className="text-slate-500">Creator profile</span><span className="font-bold text-slate-900">{profile ? 'Connected' : 'Missing'}</span></div>
                <div className="flex items-center justify-between"><span className="text-slate-500">Portfolio items</span><span className="font-bold text-slate-900">{items.length}</span></div>
                <div className="flex items-center justify-between"><span className="text-slate-500">Published proofs</span><span className="font-bold text-slate-900">{publishedItems.length}</span></div>
              </div>
              <div className="mt-4 border-t border-slate-100 pt-4">
                <Link to="/creator/profile" className="text-[10px] font-bold text-violet-700 hover:text-violet-800">Open profile editor →</Link>
              </div>
            </div>

            <div className={`rounded-[20px] border p-5 ${claimedWithoutProof.length > 0 ? 'border-amber-200 bg-amber-50' : 'border-emerald-200 bg-emerald-50'}`}>
              <div className="flex items-start gap-3">
                {claimedWithoutProof.length > 0 ? <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" /> : <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />}
                <div>
                  <p className={`text-xs font-extrabold ${claimedWithoutProof.length > 0 ? 'text-amber-900' : 'text-emerald-900'}`}>Capability proof check</p>
                  {claimedWithoutProof.length > 0 ? (
                    <><p className="mt-2 text-[10px] leading-5 text-amber-800">These claimed tools do not appear in a published case study:</p><div className="mt-2 flex flex-wrap gap-1.5">{claimedWithoutProof.map((tool) => <span key={tool} className="rounded-full bg-white/70 px-2 py-1 text-[9px] font-semibold text-amber-800">{tool}</span>)}</div></>
                  ) : (
                    <p className="mt-2 text-[10px] leading-5 text-emerald-800">Every claimed AI tool currently has at least one published portfolio proof.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="surface-card rounded-[20px] p-5">
              <div className="flex items-center gap-2"><FileText className="h-4 w-4 text-violet-600" /><p className="text-xs font-extrabold text-slate-950">Ask a focused question</p></div>
              <div className="mt-3 space-y-2">
                {quickPrompts.slice(3).map((item) => (
                  <button key={item} type="button" onClick={() => void ask(item)} disabled={sending} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-left text-[10px] font-semibold leading-4 text-slate-600 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 disabled:opacity-50">{item}</button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
