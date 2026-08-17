import PartsIntelligence from '@/components/ai/PartsIntelligence';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PartMind AI — Truck parts intelligence',
  description:
    'OEM research, cross-references, fitment analysis and technical comparison. Unverified data is explicitly marked NOT VERIFIED.',
};

export default function AIPage() {
  return (
    <main className="min-h-screen bg-slate-100">
      <div className="border-b border-slate-800 bg-navy-950 px-4 py-12 text-center text-white sm:px-6">
        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-violet-400">PartMind</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Truck parts intelligence</h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-400">
          OEM research, cross-reference discovery, fitment analysis and technical comparison — grounded in the NTParts
          catalogue and ranked external sources. Uncertain information is marked <strong className="text-amber-300">NOT VERIFIED</strong>.
        </p>
        <div className="mx-auto mt-6 flex flex-wrap justify-center gap-2 text-xs font-bold">
          {['OEM', 'Cross-ref', 'Fitment', 'Compare'].map((tag) => (
            <span key={tag} className="rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-violet-200">
              {tag}
            </span>
          ))}
        </div>
      </div>
      <PartsIntelligence />
    </main>
  );
}
