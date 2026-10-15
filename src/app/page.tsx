'use client';

import Link from 'next/link';
import { ArrowDownRight, ArrowRight, BadgeCheck, Box, Braces, ChevronRight, CircleDot, Database, Gauge, Layers3, Search, ShieldCheck, Truck, Wrench } from 'lucide-react';
import SearchBar from '@/components/search/SearchBar';
import ManufacturerCard from '@/components/catalog/ManufacturerCard';
import AdSlot from '@/components/ads/AdSlot';
import PartsIntelligence from '@/components/ai/PartsIntelligence';
import { TRUCK_MANUFACTURERS } from '@/types/catalog';
import { CATALOG_STATS } from '@/data/catalog';
import { useAppStore } from '@/store';
import { getTranslation } from '@/data/translations';

type TruckManufacturer = (typeof TRUCK_MANUFACTURERS)[number];

const popularSystems = [
  { label: 'Braking systems', code: 'BRK / 01', icon: Gauge },
  { label: 'Engine & injection', code: 'ENG / 02', icon: Wrench },
  { label: 'Filters & service', code: 'FLT / 03', icon: CircleDot },
  { label: 'Electrical', code: 'ELC / 04', icon: Braces },
  { label: 'Cooling', code: 'CLG / 05', icon: Layers3 },
  { label: 'Transmission', code: 'TRN / 06', icon: Box },
];

export default function Home() {
  const { language } = useAppStore();
  const t = (key: string) => getTranslation(key, language);

  return (
    <main className="nt-home">
      <section className="nt-hero" aria-labelledby="hero-heading">
        <div className="nt-hero-noise" aria-hidden="true" />
        <div className="nt-hero-inner">
          <div className="nt-hero-copy">
            <div className="nt-eyebrow"><span className="nt-status-dot" /> THE HEAVY-DUTY PARTS INDEX <span className="nt-eyebrow-line" /></div>
            <h1 id="hero-heading">Find the part.<br /><em>Keep the world</em><br />moving<span className="nt-orange-period">.</span></h1>
            <p className="nt-hero-description">A sharper way to source truck and bus parts. Search OEM numbers, compare cross-references, and trace catalogue evidence before you order.</p>
            <div className="nt-hero-search"><span className="nt-search-label">SEARCH THE INDEX <span>01 — 04</span></span><SearchBar placeholder={t('home.searchPlaceholder')} /></div>
            <div className="nt-hero-actions">
              <Link href="/search" className="nt-button-primary">Explore the catalogue <ArrowRight size={17} aria-hidden="true" /></Link>
              <Link href="/vin-decoder" className="nt-button-quiet">Decode a VIN <ArrowDownRight size={17} aria-hidden="true" /></Link>
            </div>
          </div>
          <div className="nt-hero-visual" aria-label="NTParts catalogue overview">
            <div className="nt-visual-top"><span>NT / FIELD GUIDE</span><span>REV. 2026</span></div>
            <div className="nt-visual-art">
              <div className="nt-art-ring nt-art-ring-one" /><div className="nt-art-ring nt-art-ring-two" />
              <div className="nt-art-crosshair nt-art-crosshair-a" /><div className="nt-art-crosshair nt-art-crosshair-b" />
              <div className="nt-part-number">NT<span>—</span>001</div>
              <div className="nt-art-core"><Truck size={116} strokeWidth={0.85} aria-hidden="true" /></div>
              <div className="nt-art-caption"><span>BUILT FOR THE ROAD</span><span>PARTS. PROVENANCE. PRECISION.</span></div>
            </div>
            <div className="nt-visual-bottom"><span><i /> SOURCE-AWARE SEARCH</span><span>PLATE 01 / 06</span></div>
            <div className="nt-floating-tag"><BadgeCheck size={15} /><span>Evidence-first<br /><b>catalogue data</b></span></div>
          </div>
        </div>
        <div className="nt-hero-footer"><span>TRUCKS / BUSES / OEM / AFTERMARKET</span><span>BUILT FOR PEOPLE WHO KEEP FLEETS MOVING <ArrowRight size={13} /></span></div>
      </section>

      <section className="nt-stat-strip" aria-label="Catalogue statistics">
        <div className="nt-stat-intro"><span className="nt-section-kicker">THE INDEX</span><strong>Parts intelligence,<br />without the guesswork.</strong></div>
        <Metric value={CATALOG_STATS.parts.toLocaleString()} label="Catalogue records" index="01" />
        <Metric value={CATALOG_STATS.manufacturers} label="Manufacturers" index="02" />
        <Metric value={CATALOG_STATS.models} label="Truck models" index="03" />
        <Metric value={CATALOG_STATS.verifiedOEMReferences} label="Verified OEM refs" index="04" />
      </section>

      <section className="nt-intelligence-wrap"><div className="nt-section-heading"><div><span className="nt-section-kicker">01 / SEARCH INTELLIGENCE</span><h2>Start with what<br /><em>you know.</em></h2></div><p>OEM number in hand? Vehicle details only? Begin with the reference you have and follow the evidence from there.</p></div><PartsIntelligence /></section>

      <section className="nt-manufacturers" aria-labelledby="manufacturers-heading">
        <div className="nt-section-heading"><div><span className="nt-section-kicker">02 / VEHICLE MAKERS</span><h2 id="manufacturers-heading">Know the badge.<br /><em>Find the fit.</em></h2></div><Link href="/trucks" className="nt-text-link">All manufacturers <ArrowRight size={16} /></Link></div>
        <div className="nt-manufacturer-grid">{TRUCK_MANUFACTURERS.slice(0, 8).map((m: TruckManufacturer) => <ManufacturerCard key={m.id} manufacturer={m} />)}</div>
      </section>

      <section className="nt-systems" aria-labelledby="systems-heading">
        <div className="nt-systems-head"><div><span className="nt-section-kicker">03 / PARTS BY SYSTEM</span><h2 id="systems-heading">Every component<br /><em>has a place.</em></h2></div><p>Browse by system when the reference is unknown. Always confirm fitment against your vehicle and the available source evidence.</p></div>
        <div className="nt-system-grid">{popularSystems.map(({ label, code, icon: Icon }) => <Link key={code} href="/parts" className="nt-system-tile"><span className="nt-system-code">{code}</span><span className="nt-system-icon"><Icon size={22} strokeWidth={1.6} /></span><strong>{label}</strong><span className="nt-system-arrow"><ArrowDownRight size={18} /></span></Link>)}</div>
      </section>

      <section className="nt-proof">
        <div className="nt-proof-mark"><ShieldCheck size={30} strokeWidth={1.3} /></div>
        <div className="nt-proof-copy"><span className="nt-section-kicker">BUILT ON TRACEABLE SOURCES</span><h2>Confidence comes<br />from <em>the evidence.</em></h2><p>Exact OEM matches, cross-references, and vehicle compatibility are not the same thing. NTParts helps you inspect the reference trail so you can make a better-informed parts decision.</p></div>
        <Link href="/about" className="nt-proof-link">How we verify data <ArrowRight size={17} /></Link>
      </section>

      <section className="nt-bottom-ad"><AdSlot placement="homepage-bottom" /></section>
      <footer className="nt-home-footer"><span>NTPARTS<span className="nt-orange-period">.</span></span><span>THE HEAVY-DUTY PARTS INDEX</span><Link href="/search">GO TO SEARCH <ChevronRight size={14} /></Link></footer>
    </main>
  );
}

function Metric({ value, label, index }: { value: number | string; label: string; index: string }) {
  return <div className="nt-metric"><span className="nt-metric-index">{index} / DATA</span><strong>{value}</strong><span className="nt-metric-label">{label}</span></div>;
}
