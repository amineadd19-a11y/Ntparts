'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { AlertCircle, CheckCircle2, Loader2, Search, ShieldAlert, Truck } from 'lucide-react';
import { useAppStore } from '@/store';

type DecodeResponse = {
  vin?: string;
  vehicle?: Record<string, string | number>;
  source?: string;
  sourceUrl?: string;
  fitmentVerified?: boolean;
  note?: string;
  error?: string;
  code?: string;
};

const LABELS: Record<string, { en: string; fr: string; ar: string }> = {
  make: { en: 'Make', fr: 'Constructeur', ar: 'الشركة المصنعة' },
  model: { en: 'Model', fr: 'Modèle', ar: 'الموديل' },
  modelYear: { en: 'Model year', fr: 'Année modèle', ar: 'سنة الموديل' },
  manufacturer: { en: 'Manufacturer', fr: 'Fabricant', ar: 'المُصنّع' },
  series: { en: 'Series', fr: 'Série', ar: 'الفئة' },
  trim: { en: 'Trim', fr: 'Finition', ar: 'التجهيز' },
  vehicleType: { en: 'Vehicle type', fr: 'Type de véhicule', ar: 'نوع المركبة' },
  bodyClass: { en: 'Body class', fr: 'Carrosserie', ar: 'نوع الهيكل' },
  engine: { en: 'Engine', fr: 'Moteur', ar: 'المحرك' },
  displacementL: { en: 'Displacement (L)', fr: 'Cylindrée (L)', ar: 'سعة المحرك (لتر)' },
  fuelType: { en: 'Fuel type', fr: 'Carburant', ar: 'نوع الوقود' },
  driveType: { en: 'Drive type', fr: 'Transmission', ar: 'نظام الدفع' },
  plantCountry: { en: 'Plant country', fr: 'Pays de fabrication', ar: 'بلد التصنيع' },
};

export default function VinDecoderPage() {
  const { language } = useAppStore();
  const lang = language === 'ar' ? 'ar' : language === 'fr' ? 'fr' : 'en';
  const isArabic = lang === 'ar';
  const [vin, setVin] = useState('');
  const [result, setResult] = useState<DecodeResponse | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const copy = {
    eyebrow: isArabic ? 'تحديد المركبة' : lang === 'fr' ? 'IDENTIFICATION DU VÉHICULE' : 'VEHICLE IDENTIFICATION',
    title: isArabic ? 'فك رقم الهيكل VIN' : lang === 'fr' ? 'Décodeur VIN' : 'VIN decoder',
    intro: isArabic
      ? 'أدخل رقم VIN المكوّن من 17 حرفاً ورقماً لمحاولة استخراج معلومات المركبة من قاعدة البيانات الرسمية.'
      : lang === 'fr'
        ? 'Saisissez un VIN de 17 caractères pour rechercher les informations du véhicule dans la base officielle.'
        : 'Enter a 17-character VIN to look up available vehicle details from the official database.',
    placeholder: isArabic ? 'مثال: 1HGCM82633A004352' : 'e.g. 1HGCM82633A004352',
    submit: isArabic ? 'تحليل رقم الهيكل' : lang === 'fr' ? 'Décoder le VIN' : 'Decode VIN',
    loading: isArabic ? 'جاري البحث...' : lang === 'fr' ? 'Recherche en cours...' : 'Looking up VIN...',
    source: isArabic ? 'المصدر' : lang === 'fr' ? 'Source' : 'Source',
    searchCatalog: isArabic ? 'قلب فكتالوج القطع حسب المركبة' : lang === 'fr' ? 'Rechercher dans le catalogue' : 'Search the parts catalogue',
    catalogNote: isArabic ? 'هاد البحث مجاني وكيستعمل غير المراجع الموجودة فعلاً فـ NTParts. النتائج المحتملة ماشي تأكيد للتوافق مع رقم الهيكل؛ خاص التحقق من OEM والمحرك والمحور قبل الطلب.' : lang === 'fr' ? 'Cette recherche gratuite utilise uniquement les références déjà présentes dans NTParts. Les résultats ne confirment pas la compatibilité VIN; vérifiez l’OEM, le moteur et l’essieu avant commande.' : 'This free search uses only references already present in NTParts. Results do not confirm VIN fitment; verify the OEM, engine and axle before ordering.',
    decoded: isArabic ? 'المعلومات المتوفرة عن المركبة' : lang === 'fr' ? 'Informations disponibles sur le véhicule' : 'Available vehicle details',
    warningTitle: isArabic ? 'مهم: فك VIN لا يؤكد توافق قطع الغيار' : lang === 'fr' ? 'Important : le décodage VIN ne confirme pas la compatibilité des pièces' : 'Important: VIN decoding does not confirm parts fitment',
    warning: isArabic
      ? 'البيانات قد تكون ناقصة، خصوصاً للمركبات الموجهة للأسواق الأوروبية أو المغربية. قبل الطلب، خاص التأكد من رقم الهيكل والمحرك والمحور ومرجع OEM عبر كتالوج موثوق. ما كاين حتى توافق لقطعة غيار مؤكد آلياً.'
      : lang === 'fr'
        ? 'Les données peuvent être incomplètes, notamment pour les véhicules destinés aux marchés européens ou marocains. Vérifiez le VIN, le moteur, l’essieu et la référence OEM dans un catalogue fiable. Aucune compatibilité de pièce n’est confirmée automatiquement.'
        : 'Data may be incomplete, especially for vehicles intended for European or Moroccan markets. Confirm the VIN, engine, axle and OEM reference in an authoritative parts catalogue. No spare-part compatibility is automatically confirmed.',
    invalid: isArabic
      ? 'خاص رقم VIN يكون 17 حرفاً ورقماً، والحروف I وO وQ غير مسموح بها. بعض أرقام الشاسي القصيرة ما كتدعمش.'
      : lang === 'fr'
        ? 'Le VIN doit contenir 17 caractères. Les lettres I, O et Q ne sont pas autorisées. Certains numéros de châssis plus courts ne sont pas pris en charge.'
        : 'VIN must contain 17 characters. Letters I, O and Q are not allowed. Some shorter chassis numbers are not supported.',
    noData: isArabic ? 'ما قدرناش نحددو المركبة من قاعدة البيانات. هاد الشي ما كيعنيش بالضرورة أن الرقم غير صحيح.' : lang === 'fr' ? 'La base de données n’a pas permis d’identifier le véhicule. Cela ne signifie pas nécessairement que le numéro est incorrect.' : 'The database could not identify this vehicle. This does not necessarily mean the number is invalid.',
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch(`/api/vin-decode?vin=${encodeURIComponent(vin.trim().toUpperCase())}`, {
        headers: { Accept: 'application/json' },
      });
      const data = (await response.json()) as DecodeResponse;
      if (!response.ok) {
        setError(data.code === 'INVALID_VIN' ? copy.invalid : data.error || copy.noData);
      } else {
        setResult(data);
      }
    } catch {
      setError(isArabic ? 'تعذر الاتصال بالخدمة. حاول مرة أخرى.' : lang === 'fr' ? 'Impossible de contacter le service. Réessayez.' : 'Could not reach the service. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-[70vh] bg-slate-50" dir={isArabic ? 'rtl' : 'ltr'}>
      <section className="border-b border-slate-800 bg-slate-950 px-4 py-12 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-400">{copy.eyebrow}</p>
          <h1 className="mt-3 flex items-center gap-3 text-3xl font-black tracking-tight sm:text-4xl"><Truck className="text-sky-400" aria-hidden />{copy.title}</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">{copy.intro}</p>
          <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-3 sm:flex-row">
            <label htmlFor="vin" className="sr-only">VIN</label>
            <input
              id="vin"
              name="vin"
              autoComplete="off"
              spellCheck={false}
              maxLength={17}
              value={vin}
              onChange={(event) => setVin(event.target.value.toUpperCase().replace(/\s+/g, ''))}
              placeholder={copy.placeholder}
              aria-describedby="vin-help"
              className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3.5 font-mono text-base tracking-wider text-white outline-none placeholder:text-slate-500 focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20"
            />
            <button type="submit" disabled={loading || !vin.trim()} className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-500 px-6 py-3.5 text-sm font-black text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-50">
              {loading ? <Loader2 size={17} className="animate-spin" aria-hidden /> : <Search size={17} aria-hidden />}
              {loading ? copy.loading : copy.submit}
            </button>
          </form>
          <p id="vin-help" className="mt-3 text-xs leading-5 text-slate-400">{copy.invalid}</p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {error && <div role="alert" className="mb-5 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800"><AlertCircle size={19} className="mt-0.5 shrink-0" aria-hidden /><p>{error}</p></div>}

        {result?.vehicle && (
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="flex items-start gap-3">
              <CheckCircle2 size={22} className="mt-0.5 shrink-0 text-emerald-600" aria-hidden />
              <div>
                <h2 className="text-xl font-black text-slate-950">{copy.decoded}</h2>
                <p className="mt-1 break-all font-mono text-sm text-slate-500">{result.vin}</p>
              </div>
            </div>
            <dl className="mt-6 grid gap-3 sm:grid-cols-2">
              {Object.entries(result.vehicle).map(([key, value]) => {
                const label = LABELS[key]?.[lang] ?? key;
                return <div key={key} className="rounded-xl border border-slate-100 bg-slate-50 p-4"><dt className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</dt><dd className="mt-1 break-words text-base font-bold text-slate-900">{String(value)}</dd></div>;
              })}
            </dl>
            <p className="mt-5 text-xs text-slate-500">{copy.source}: {result.source}</p>
            {(result.vehicle.make || result.vehicle.model || result.vehicle.manufacturer) && (
              <div className="mt-5 rounded-xl border border-sky-200 bg-sky-50 p-4">
                <p className="text-sm leading-6 text-sky-950">{copy.catalogNote}</p>
                <Link
                  href={`/parts?q=${encodeURIComponent([result.vehicle.make, result.vehicle.model, result.vehicle.manufacturer].filter(Boolean).join(' '))}`}
                  className="mt-3 inline-flex items-center justify-center gap-2 rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-sky-700"
                >
                  <Search size={16} aria-hidden />{copy.searchCatalog}
                </Link>
              </div>
            )}
          </div>
        )}

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <ShieldAlert size={22} className="mt-0.5 shrink-0 text-amber-700" aria-hidden />
            <div>
              <h2 className="font-black text-amber-950">{copy.warningTitle}</h2>
              <p className="mt-2 text-sm leading-7 text-amber-900">{copy.warning}</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
