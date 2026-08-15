import type { AISource, EvidenceLevel } from './types';

type WebResult = {
  title: string;
  url: string;
  snippet: string;
};

const SEARCH_TIMEOUT_MS = 8_000;
const MAX_RESULTS = 8;

function evidenceForDomain(domain: string): EvidenceLevel {
  const d = domain.toLowerCase();
  if (/volvotrucks|daf\.com|mercedes-benz-trucks|scania|man\.eu|renault-trucks|iveco|kenworth|peterbilt|freightliner|macktrucks|hino|isuzucv/.test(d)) return 'OFFICIAL';
  if (/zf\.com|knorr-bremse|haldex|bosch|mahle|mann-filter|hengst|textar|cojali|sampa|elring|reinz|ajusa|garrett|borgwarner/.test(d)) return 'MANUFACTURER';
  if (/autodoc|intercars|trucktec|winkler|dieseltechnic/.test(d)) return 'AUTHORIZED_DISTRIBUTOR';
  if (/tecdoc|partslink24|spareto|plenty\.parts/.test(d)) return 'PROFESSIONAL_CATALOG';
  return 'SECONDARY';
}

function decode(value: string): string {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseDuckDuckGo(html: string): WebResult[] {
  const results: WebResult[] = [];
  const seen = new Set<string>();
  const pattern = /<a[^>]+class=["'][^"']*result__a[^"']*["'][^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(html)) && results.length < MAX_RESULTS) {
    const rawUrl = decode(match[1]);
    const title = decode(match[2]);
    let url: URL;
    try {
      url = new URL(rawUrl, 'https://duckduckgo.com');
    } catch {
      continue;
    }
    const target = url.searchParams.get('uddg');
    if (target) {
      try { url = new URL(target); } catch { continue; }
    }
    if (url.protocol !== 'https:' || seen.has(url.href)) continue;
    if (/duckduckgo\.com$/i.test(url.hostname)) continue;
    seen.add(url.href);
    const block = html.slice(match.index, match.index + 2500);
    const snippetMatch = block.match(/result__snippet[^>]*>([\s\S]*?)<\/a>|result__snippet[^>]*>([\s\S]*?)<\//i);
    results.push({ title, url: url.href, snippet: snippetMatch ? decode(snippetMatch[1] || snippetMatch[2]) : '' });
  }
  return results;
}

async function searchWeb(query: string): Promise<WebResult[]> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), SEARCH_TIMEOUT_MS);
  try {
    const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
    const response = await fetch(url, {
      headers: { 'User-Agent': 'NTParts-ResearchBot/1.0 (+https://ntparts.vercel.app)' },
      cache: 'no-store',
      signal: controller.signal,
    });
    if (!response.ok) return [];
    return parseDuckDuckGo(await response.text());
  } catch {
    return [];
  } finally {
    clearTimeout(timer);
  }
}

export async function researchWeb(question: string): Promise<{ answer: string; sources: AISource[] }> {
  const queries = [
    `${question} truck parts OEM reference compatibility`,
    `${question} official manufacturer parts catalogue`,
  ];
  const found = new Map<string, WebResult>();
  for (const query of queries) {
    for (const result of await searchWeb(query)) found.set(result.url, result);
    if (found.size >= MAX_RESULTS) break;
  }

  const results = Array.from(found.values()).slice(0, MAX_RESULTS);
  const sources: AISource[] = results.map((result) => {
    const parsed = new URL(result.url);
    const domain = parsed.hostname.replace(/^www\./, '');
    const evidence = evidenceForDomain(domain);
    const confidence = evidence === 'OFFICIAL' ? 90 : evidence === 'MANUFACTURER' ? 85 : evidence === 'AUTHORIZED_DISTRIBUTOR' ? 78 : evidence === 'PROFESSIONAL_CATALOG' ? 72 : 55;
    return { title: result.title || domain, url: result.url, domain, evidence, confidence, retrievedAt: new Date().toISOString() };
  });

  const lines = results.map((result, index) => {
    const snippet = result.snippet || 'No snippet available; open the source for verification.';
    return `${index + 1}. ${result.title}\n   ${snippet}\n   SOURCE: ${result.url}`;
  });

  const answer = lines.length
    ? `PARTMIND WEB RESEARCH\n\nI searched the live web independently of Gemini. The results below are evidence to verify, not invented OEM data.\n\n${lines.join('\n')}`
    : 'NOT VERIFIED: the independent web-search layer returned no usable results. Try a more specific OEM/reference, model or VIN/chassis query.';

  return { answer, sources };
}
