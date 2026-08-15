import PartsIntelligence from '@/components/ai/PartsIntelligence';

export const metadata = {
  title: 'NTParts AI — Global Truck Parts Intelligence',
  description: 'Global multi-source AI for OEM references, cross-references, fitment and truck-parts comparison.',
};

export default function AIPage() {
  return (
    <main className="min-h-screen bg-slate-100">
      <div className="border-b border-slate-800 bg-slate-950 px-4 py-10 text-center text-white sm:px-6">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-400">NTParts Intelligence Engine</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Global Truck Parts AI</h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-400">
          OEM research, cross-reference discovery, fitment analysis and technical comparison grounded in NTParts and current global web sources.
        </p>
      </div>
      <PartsIntelligence />
    </main>
  );
}
