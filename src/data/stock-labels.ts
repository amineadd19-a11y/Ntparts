/** Stock UI labels (EN / FR / AR) — used when translation keys are present */
export const STOCK_LABELS = {
  en: {
    nav: 'Available Stock',
    title: 'Available Stock',
    subtitle: 'Parts currently in stock',
    description: 'Discover the parts currently available in stock.',
    view: 'View stock',
    references: 'References',
    quantity: 'Total quantity',
  },
  fr: {
    nav: 'Stock disponible',
    title: 'Stock disponible',
    subtitle: 'Pièces actuellement en stock',
    description: 'Découvrez les pièces actuellement disponibles en stock.',
    view: 'Voir le stock',
    references: 'Références',
    quantity: 'Quantité totale',
  },
  ar: {
    nav: 'السلع المتوفرة',
    title: 'السلع المتوفرة',
    subtitle: 'القطع المتوفرة حالياً في المخزون',
    description: 'اكتشف القطع المتوفرة حالياً في المخزون.',
    view: 'عرض المخزون',
    references: 'المراجع',
    quantity: 'الكمية الإجمالية',
  },
} as const;

export type StockLang = keyof typeof STOCK_LABELS;

export function stockLabel(lang: string, key: keyof typeof STOCK_LABELS.en): string {
  const L = (lang in STOCK_LABELS ? lang : 'en') as StockLang;
  return STOCK_LABELS[L][key];
}
