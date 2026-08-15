'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Bot, ExternalLink, Loader2, Send, ShieldCheck, X } from 'lucide-react';
import type { AIAnalysisResponse } from '@/lib/ai/types';

const suggestions = [
  'Find OEM and cross references for K059965K50',
  'Compare 0004211010 with K059965K50',
  'Does this brake pad fit Mercedes Actros MP4?',
  'Find verified applications for a Volvo truck oil filter',
];

function detectLanguage(text: string): 'darija' | 'ar' | 'fr' | 'en' {
  if (/[\u0600-\u06FF]/.test(text)) return 'ar';
  if (/\b(je|vous|avec|pour|pi[eè]ce|camion|r[eé]f[eé]rence|bonjour|cherche)\b/i.test(text)) return 'fr';
  if (/\b(bghit|wach|fin|chno|kifach|m3a|3lach|kayen|l9it|sift|shnu)\b/i.test(text)) return 'darija';
  return 'en';
}

const placeholders = {
  darija: 'كتب سؤالك على قطعة، OEM، شاحنة أو compatibilité...',
  ar: 'اكتب سؤالك عن قطعة أو رقم OEM أو شاحنة...',
  fr: 'Écrivez votre question sur une pièce, un OEM ou un camion...',
  en: 'Ask about an OEM, part number, truck or fitment...',
};

export default function PartMindPage() {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; text: string; result?: AIAnalysisResponse }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const language = detectLanguage(question);

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
    <>
      <Link href="/" className="fixed bottom-4 left-4 z-40 inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white">
        <ArrowLeft size={14} /> NTParts
      </Link>

      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open PartMind"
          className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-sky-300/30 bg-sky-500 text-slate-950 shadow-2xl shadow-sky-500/30 transition hover:scale-105 hover:bg-sky-400"
        >
          <Bot size={25} />
          <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-slate-950 bg-emerald-400" />
        </button>
      )}

      {open && (
        <section className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 p-0 backdrop-blur-[2px] sm:items-end sm:justify-end sm:bg-transparent sm:p-5">
          <div className="flex h-[100dvh] w-full flex-col overflow-hidden border border-slate-700 bg-slate-950 text-white shadow-2xl sm:h-[min(720px,calc(100vh-40px))] sm:w-[430px] sm:rounded-3xl">
            <header className="flex items-center justify-between border-b border-slate-800 bg-slate-950/95 px-4 py-3 backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/15 text-sky-400"><Bot size={19} /></div>
                <div><div className="text-sm font-black">PartMind</div><div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400"><ShieldCheck size={11} /> Research assistant</div></div>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close PartMind" className="rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white"><X size={18} /></button>
            </header>

            <div className="flex-1 overflow-y-auto p-4">
              {messages.length === 0 ? (
                <div className="flex min-h-full flex-col justify-center">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-300"><Bot size={22} /></div>
                  <h2 className="text-2xl font-black">Ask PartMind</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-400">سولني على OEM، référence، compatibilité أو أي قطعة ديال camion. يمكن تهضر بالدارجة، العربية، الفرنسية أو English.</p>
                  <div className="mt-5 space-y-2">
                    {suggestions.slice(0, 3).map((item) => <button key={item} type="button" onClick={() => setQuestion(item)} className="w-full rounded-xl border border-slate-800 bg-slate-900/70 p-3 text-left text-xs font-semibold text-slate-300 hover:border-sky-500/40 hover:text-white">{item}</button>)}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div key={`${message.role}-${index}`} className={message.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                      <div className={message.role === 'user' ? 'max-w-[88%] rounded-2xl rounded-br-md bg-sky-500 px-3.5 py-2.5 text-sm font-medium text-slate-950' : 'max-w-[95%] rounded-2xl rounded-bl-md border border-slate-800 bg-slate-900 p-3.5'}>
                        {message.role === 'assistant' && <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-black text-sky-300"><Bot size={12} /> PartMind</div>}
                        <div className="whitespace-pre-wrap text-sm leading-6">{message.text}</div>
                        {message.result?.sources?.length ? <div className="mt-3 border-t border-slate-800 pt-3"><div className="mb-2 text-[9px] font-black uppercase tracking-widest text-slate-500">Sources</div>{message.result.sources.slice(0, 4).map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer" className="mb-1 flex items-center justify-between gap-2 rounded-lg bg-slate-950 p-2 text-[10px] hover:bg-slate-800"><span className="truncate text-slate-300">{source.title}</span><ExternalLink size={11} className="shrink-0 text-slate-500" /></a>)}</div> : null}
                      </div>
                    </div>
                  ))}
                  {loading && <div className="flex items-center gap-2 text-xs font-semibold text-slate-500"><Loader2 size={14} className="animate-spin" /> PartMind is researching...</div>}
                </div>
              )}
            </div>

            <div className="border-t border-slate-800 bg-slate-950 p-3">
              {error && <div className="mb-2 rounded-lg border border-rose-500/30 bg-rose-500/10 p-2 text-[10px] text-rose-300">{error}</div>}
              <form onSubmit={submit} className="rounded-2xl border border-slate-700 bg-slate-900 p-1.5">
                <div className="flex items-end gap-1.5">
                  <textarea value={question} onChange={(e) => setQuestion(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); } }} rows={1} maxLength={1500} placeholder={placeholders[language]} className="min-h-11 flex-1 resize-none bg-transparent px-2.5 py-2.5 text-sm text-white outline-none placeholder:text-slate-600" />
                  <button type="submit" disabled={loading || !question.trim()} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-500 text-slate-950 hover:bg-sky-400 disabled:opacity-40"><Send size={16} /></button>
                </div>
              </form>
              <p className="mt-1.5 text-center text-[9px] text-slate-600">PartMind verifies evidence before presenting OEM information.</p>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
