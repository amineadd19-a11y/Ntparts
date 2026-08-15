'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Bot, ExternalLink, Loader2, Send, ShieldCheck, Sparkles } from 'lucide-react';
import type { AIAnalysisResponse } from '@/lib/ai/types';

const suggestions = [
  'Find OEM and cross references for K059965K50',
  'Compare 0004211010 with K059965K50',
  'Does this brake pad fit Mercedes Actros MP4?',
  'Find verified applications for a Volvo truck oil filter',
];

export default function PartMindPage() {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; text: string; result?: AIAnalysisResponse }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submit(event?: FormEvent) {
    event?.preventDefault();
    const value = question.trim();
    if (!value || loading) return;
    setQuestion('');
    setError('');
    setMessages((current) => [...current, { role: 'user', text: value }]);
    setLoading(true);
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: value }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'PartMind is temporarily unavailable.');
      setMessages((current) => [...current, { role: 'assistant', text: data.answer || 'No verified answer was returned.', result: data }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'PartMind is temporarily unavailable.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="sticky top-0 z-20 border-b border-slate-800/90 bg-slate-950/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-300 hover:text-white">
            <ArrowLeft size={16} /> NTParts
          </Link>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/15 text-sky-400"><Bot size={18} /></div>
            <div><div className="text-sm font-black">PartMind</div><div className="text-[10px] font-semibold text-emerald-400">Parts Intelligence</div></div>
          </div>
          <div className="hidden items-center gap-1.5 text-[10px] font-bold text-slate-500 sm:flex"><ShieldCheck size={13} /> Evidence-aware</div>
        </div>
      </header>

      <div className="mx-auto flex min-h-[calc(100vh-61px)] max-w-5xl flex-col px-4 sm:px-6">
        <div className="flex-1 py-8 sm:py-10">
          {messages.length === 0 ? (
            <div className="mx-auto flex max-w-3xl flex-col items-center pt-10 text-center sm:pt-16">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-sky-400/20 bg-sky-400/10 text-sky-300 shadow-xl shadow-sky-500/10"><Sparkles size={28} /></div>
              <h1 className="text-3xl font-black tracking-tight sm:text-5xl">Ask PartMind</h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">Research truck parts, OEM references, cross-references, fitment and technical differences using NTParts and verified global evidence.</p>
              <div className="mt-8 grid w-full gap-2 sm:grid-cols-2">
                {suggestions.map((item) => <button key={item} onClick={() => setQuestion(item)} className="rounded-xl border border-slate-800 bg-slate-900/70 p-3 text-left text-xs font-semibold text-slate-300 transition hover:border-sky-500/40 hover:text-white">{item}</button>)}
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-3xl space-y-6">
              {messages.map((message, index) => <div key={`${message.role}-${index}`} className={message.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                <div className={message.role === 'user' ? 'max-w-[85%] rounded-2xl rounded-br-md bg-sky-500 px-4 py-3 text-sm font-medium text-slate-950' : 'w-full rounded-2xl rounded-bl-md border border-slate-800 bg-slate-900/80 p-5'}>
                  {message.role === 'assistant' ? <div className="mb-2 flex items-center gap-2 text-xs font-black text-sky-300"><Bot size={14} /> PartMind</div> : null}
                  <div className="whitespace-pre-wrap text-sm leading-7 text-slate-200">{message.text}</div>
                  {message.result?.sources?.length ? <div className="mt-5 border-t border-slate-800 pt-4"><div className="mb-2 text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">Sources</div><div className="grid gap-2 sm:grid-cols-2">{message.result.sources.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer" className="flex items-center justify-between gap-2 rounded-lg border border-slate-800 bg-slate-950 p-3 text-xs hover:border-sky-500/40"><span className="min-w-0 truncate font-semibold text-slate-300">{source.title}</span><ExternalLink size={13} className="shrink-0 text-slate-600" /></a>)}</div></div> : null}
                  {message.result ? <div className="mt-4 text-right text-[10px] font-bold text-slate-500">Confidence: {message.result.confidence}%</div> : null}
                </div>
              </div>)}
              {loading && <div className="flex items-center gap-2 text-xs font-semibold text-slate-500"><Loader2 size={15} className="animate-spin" /> PartMind is researching...</div>}
            </div>
          )}
        </div>

        <div className="sticky bottom-0 pb-5 pt-3 sm:pb-7">
          {error && <div className="mx-auto mb-2 max-w-3xl rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">{error}</div>}
          <form onSubmit={submit} className="mx-auto max-w-3xl rounded-2xl border border-slate-700 bg-slate-900 p-2 shadow-2xl shadow-black/30">
            <div className="flex items-end gap-2">
              <textarea value={question} onChange={(e) => setQuestion(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); } }} rows={1} maxLength={1500} placeholder="Ask about an OEM, part number, truck, fitment or comparison..." className="min-h-12 flex-1 resize-none bg-transparent px-3 py-3 text-sm text-white outline-none placeholder:text-slate-600" />
              <button type="submit" disabled={loading || !question.trim()} className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-500 text-slate-950 transition hover:bg-sky-400 disabled:opacity-40"><Send size={17} /></button>
            </div>
          </form>
          <p className="mx-auto mt-2 max-w-3xl text-center text-[10px] text-slate-600">PartMind does not invent references. Unverified information is marked accordingly.</p>
        </div>
      </div>
    </main>
  );
}
