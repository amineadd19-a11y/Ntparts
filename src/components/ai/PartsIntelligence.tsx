'use client';

import { FormEvent, memo, useCallback, useMemo, useRef, useState } from 'react';
import { Bot, ExternalLink, Loader2, Maximize2, Minimize2, Search, ShieldCheck, Sparkles, X } from 'lucide-react';
import type { AIAnalysisResponse } from '@/lib/ai/types';

const examples = [
  'K059965K50',
  'Compare 0004211010 with K059965K50',
  'Does this brake pad fit Mercedes Actros MP4?',
  'Find OEM and cross references for a Volvo truck oil filter',
];

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  result?: AIAnalysisResponse;
  error?: string;
  timestamp: number;
}

function StatusBadge({ status }: { status: AIAnalysisResponse['status'] }) {
  const color =
    status === 'verified'
      ? 'bg-emerald-400'
      : status === 'conflict'
        ? 'bg-rose-400'
        : status === 'probable'
          ? 'bg-amber-400'
          : 'bg-slate-400';
  return (
    <div className="flex items-center gap-2 text-sm font-bold">
      <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
      {status.replace('-', ' ').toUpperCase()}
    </div>
  );
}

const ResultView = memo(function ResultView({ result }: { result: AIAnalysisResponse }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <StatusBadge status={result.status} />
        <div className="text-xs font-bold text-slate-400">
          Confidence: <span className="text-white">{result.confidence}%</span>
        </div>
      </div>

      <div className="whitespace-pre-wrap text-sm leading-7 text-slate-200">{result.answer}</div>

      {result.sourceConflicts.length > 0 && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs leading-5 text-rose-200">
          {result.sourceConflicts.join(' ')}
        </div>
      )}

      {result.catalogMatches.length > 0 && (
        <div>
          <div className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-slate-500">
            Catalogue matches
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {result.catalogMatches.slice(0, 6).map((match) => (
              <div
                key={match.id}
                className="rounded-lg border border-slate-800 bg-slate-950 p-3 text-xs"
              >
                <div className="font-bold text-slate-200">{match.name}</div>
                <div className="mt-1 text-slate-500">
                  {[match.manufacturer, match.model, match.category].filter(Boolean).join(' · ')}
                </div>
                {match.references.length > 0 && (
                  <div className="mt-1.5 font-mono text-[11px] text-sky-400/90">
                    {match.references.slice(0, 3).join(' · ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {result.sources.length > 0 && (
        <div>
          <div className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-500">
            Grounded sources
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {result.sources.map((source) => (
              <a
                key={source.url}
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="group rounded-lg border border-slate-800 bg-slate-950 p-3 transition hover:border-sky-500/40"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="truncate text-xs font-bold text-slate-200">{source.title}</div>
                    <div className="mt-1 truncate text-[11px] text-slate-500">{source.domain}</div>
                  </div>
                  <ExternalLink size={13} className="shrink-0 text-slate-600 group-hover:text-sky-400" />
                </div>
                <div className="mt-2 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                  {source.evidence} · {source.confidence}%
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

export default function PartsIntelligence() {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const canSubmit = useMemo(() => question.trim().length >= 2 && !loading, [question, loading]);

  const submit = useCallback(
    async (event?: FormEvent) => {
      event?.preventDefault();
      const value = question.trim();
      if (!value || loading) return;

      const userMessage: Message = {
        id: `u-${Date.now()}`,
        role: 'user',
        content: value,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setQuestion('');
      setLoading(true);

      try {
        const response = await fetch('/api/ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question: value }),
        });
        const data = await response.json();

        if (!response.ok) {
          setMessages((prev) => [
            ...prev,
            {
              id: `a-${Date.now()}`,
              role: 'assistant',
              content: '',
              error: data.error || 'AI service unavailable.',
              timestamp: Date.now(),
            },
          ]);
        } else {
          const result = data as AIAnalysisResponse;
          setMessages((prev) => [
            ...prev,
            {
              id: `a-${Date.now()}`,
              role: 'assistant',
              content: result.answer,
              result,
              timestamp: Date.now(),
            },
          ]);
        }
      } catch (err) {
        setMessages((prev) => [
          ...prev,
          {
            id: `a-${Date.now()}`,
            role: 'assistant',
            content: '',
            error: err instanceof Error ? err.message : 'AI service unavailable.',
            timestamp: Date.now(),
          },
        ]);
      } finally {
        setLoading(false);
        // Keep focus on input for fast successive queries
        requestAnimationFrame(() => inputRef.current?.focus());
      }
    },
    [question, loading],
  );

  const onExample = useCallback((example: string) => {
    setQuestion(example);
    inputRef.current?.focus();
  }, []);

  const toggleExpanded = useCallback(() => {
    setExpanded((v) => !v);
  }, []);

  const clearHistory = useCallback(() => {
    setMessages([]);
  }, []);

  return (
    <section
      className={`border-y border-slate-800 bg-slate-950 text-white transition-all ${expanded ? 'py-6' : 'py-16'}`}
      aria-labelledby="ai-heading"
    >
      <div className={`mx-auto px-4 sm:px-6 lg:px-8 ${expanded ? 'max-w-6xl' : 'max-w-7xl'}`}>
        <div className={`grid gap-8 ${expanded ? 'lg:grid-cols-1' : 'lg:grid-cols-[0.85fr_1.15fr] lg:items-start'}`}>
          {!expanded && (
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1.5 text-xs font-bold text-sky-300">
                <Sparkles size={14} /> Global Parts Intelligence
              </div>
              <h2 id="ai-heading" className="text-3xl font-black tracking-tight sm:text-4xl">
                Ask NTParts AI.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-6 text-slate-400">
                Search the NTParts catalogue and current global web evidence together. Identify OEMs,
                cross-references, applications and differences without treating unverified data as fact.
              </p>
              <div className="mt-6 grid gap-2 sm:grid-cols-2">
                {['OEM identification', 'Cross-reference research', 'Fitment analysis', 'Part comparison'].map(
                  (item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-2.5 text-xs font-semibold text-slate-300"
                    >
                      <ShieldCheck size={14} className="text-emerald-400" /> {item}
                    </div>
                  ),
                )}
              </div>
            </div>
          )}

          <div
            className={`rounded-2xl border border-slate-700/80 bg-slate-900/80 shadow-2xl shadow-black/20 ${expanded ? 'p-4 sm:p-5 min-h-[70vh]' : 'p-4 sm:p-6'}`}
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                <Bot size={14} className="text-sky-400" />
                {expanded ? 'NTParts AI — Expanded' : 'Reference or question'}
              </div>
              <div className="flex items-center gap-1.5">
                {messages.length > 0 && (
                  <button
                    type="button"
                    onClick={clearHistory}
                    className="rounded-lg border border-slate-700 px-2.5 py-1.5 text-[11px] font-semibold text-slate-400 hover:border-slate-500 hover:text-slate-200"
                  >
                    Clear
                  </button>
                )}
                <button
                  type="button"
                  onClick={toggleExpanded}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 text-slate-300 transition hover:border-sky-500/50 hover:text-sky-300"
                  aria-label={expanded ? 'Collapse AI panel' : 'Expand AI panel'}
                >
                  {expanded ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
                </button>
              </div>
            </div>

            {messages.length > 0 && (
              <div
                ref={listRef}
                className={`mb-4 space-y-4 overflow-y-auto rounded-xl border border-slate-800 bg-slate-950/60 p-3 ${expanded ? 'max-h-[50vh]' : 'max-h-72'}`}
                role="log"
                aria-live="polite"
              >
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`rounded-xl p-3 text-sm ${msg.role === 'user' ? 'ml-6 border border-sky-500/20 bg-sky-500/10 text-sky-100' : 'mr-2 border border-slate-800 bg-slate-900 text-slate-200'}`}
                  >
                    {msg.role === 'user' ? (
                      <div className="font-medium">{msg.content}</div>
                    ) : msg.error ? (
                      <div className="text-rose-300">{msg.error}</div>
                    ) : msg.result ? (
                      <ResultView result={msg.result} />
                    ) : (
                      <div className="whitespace-pre-wrap leading-7">{msg.content}</div>
                    )}
                  </div>
                ))}
                {loading && (
                  <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 p-3 text-sm text-slate-400">
                    <Loader2 size={16} className="animate-spin text-sky-400" />
                    Analyzing with catalogue + web evidence…
                  </div>
                )}
              </div>
            )}

            <form onSubmit={submit}>
              <label htmlFor="parts-ai-query" className="sr-only">
                Part reference or question
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    ref={inputRef}
                    id="parts-ai-query"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    maxLength={1500}
                    placeholder="OEM, part number, truck model, VIN or comparison..."
                    autoComplete="off"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-11 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!canSubmit}
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
                  onClick={() => onExample(example)}
                  className="rounded-md border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-[11px] font-semibold text-slate-400 hover:border-slate-600 hover:text-slate-200"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
