'use client';

import { FormEvent, useState } from 'react';
import { Bot, ExternalLink, Loader2, Search, ShieldCheck, Sparkles } from 'lucide-react';
import type { AIAnalysisResponse } from '@/lib/ai/types';

const examples = [
  'K059965K50',
  'Compare 0004211010 with K059965K50',
  'Does this brake pad fit Mercedes Actros MP4?',
  'Find OEM and cross references for a Volvo truck oil filter',
];

export default function PartsIntelligence() {
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState<AIAnalysisResponse | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    const value = question.trim();
    if (!value || loading) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: value }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'AI service unavailable.');
      setResult(data as AIAnalysisResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'AI service unavailable.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="border-y border-slate-800 bg-slate-950 py-16 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1.5 text-xs font-bold text-sky-300">
              <Sparkles size={14} /> Global Parts Intelligence
            </div>
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">Ask NTParts AI.</h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-400">
              Search the NTParts catalogue and current global web evidence together. Identify OEMs,
              cross-references, applications and differences without treating unverified data as fact.
            </p>
            <div className="mt-6 grid gap-2 sm:grid-cols-2">
              {['OEM identification', 'Cross-reference research', 'Fitment analysis', 'Part comparison'].map((item) => (
                <div key={item} className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-2.5 text-xs font-semibold text-slate-300">
                  <ShieldCheck size={14} className="text-emerald-400" /> {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-700/80 bg-slate-900/80 p-4 shadow-2xl shadow-black/20 sm:p-6">
            <form onSubmit={submit}>
              <label htmlFor="parts-ai-query" className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                Reference or question
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    id="parts-ai-query"
                    value={question}
                    onChange={(event) => setQuestion(event.target.value)}
                    maxLength={1500}
                    placeholder="OEM, part number, truck model, VIN or comparison..."
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-11 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || !question.trim()}
                  className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-sky-500 px-4 py-3 font-bold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? <Loader2 size={17} className="animate-spin" /> : <Bot size={17} />}
                  <span className="hidden sm:inline">Analyze</span>
                </button>
              </div>
            </form>

            <div className="mt-3 flex flex-wrap gap-2">
              {examples.map((example) => (
                <button
                  key={example}
                  type="button"
                  onClick={() => setQuestion(example)}
                  className="rounded-md border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-[11px] font-semibold text-slate-400 hover:border-slate-600 hover:text-slate-200"
                >
                  {example}
                </button>
              ))}
            </div>

            {error && <div className="mt-5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">{error}</div>}

            {result && (
              <div className="mt-6 space-y-5 border-t border-slate-800 pt-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-sm font-bold">
                    <span className={`h-2.5 w-2.5 rounded-full ${result.status === 'verified' ? 'bg-emerald-400' : result.status === 'conflict' ? 'bg-rose-400' : 'bg-amber-400'}`} />
                    {result.status.replace('-', ' ').toUpperCase()}
                  </div>
                  <div className="text-xs font-bold text-slate-400">Confidence: <span className="text-white">{result.confidence}%</span></div>
                </div>

                <div className="whitespace-pre-wrap text-sm leading-7 text-slate-200">{result.answer}</div>

                {result.sourceConflicts.length > 0 && (
                  <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs leading-5 text-rose-200">
                    {result.sourceConflicts.join(' ')}
                  </div>
                )}

                {result.sources.length > 0 && (
                  <div>
                    <div className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-500">Grounded sources</div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {result.sources.map((source) => (
                        <a key={source.url} href={source.url} target="_blank" rel="noreferrer" className="group rounded-lg border border-slate-800 bg-slate-950 p-3 transition hover:border-sky-500/40">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <div className="truncate text-xs font-bold text-slate-200">{source.title}</div>
                              <div className="mt-1 truncate text-[11px] text-slate-500">{source.domain}</div>
                            </div>
                            <ExternalLink size={13} className="shrink-0 text-slate-600 group-hover:text-sky-400" />
                          </div>
                          <div className="mt-2 text-[10px] font-bold uppercase tracking-wide text-slate-500">{source.evidence} · {source.confidence}%</div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
