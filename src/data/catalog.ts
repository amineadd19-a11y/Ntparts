import { Part, OEMReference, Source } from '@/types';

const now = '2026-08-13T00:00:00.000Z';

type SystemId =
  | 'brake-system' | 'engine-system' | 'suspension-system' | 'transmission-system'
  | 'electrical-system' | 'cooling-system' | 'exhaust-system' | 'steering-system'
  | 'cabin-system' | 'other-system';

type SourceDefinition = { id: string; name: string; url: string };
type PartTemplate = { slug: string; name: string; category: string; systemId: SystemId; tags: string[]; aftermarketBrands: string[] };
type ModelDefinition = { id: string; name: string };
type ManufacturerDefinition = { id: string; name: string; source: SourceDefinition; models: ModelDefinition[] };

const SOURCES: Record<string, SourceDefinition> = {
  'volvo-trucks': { id: 'source-volvo-trucks', name: 'Volvo Trucks', url: 'https://www.volvotrucks.com/' },
  'daf-trucks': { id: 'source-daf-trucks', name: 'DAF Trucks', url: 'https://www.daf.com/' },
  'mercedes-benz-trucks': { id: 'source-mercedes-benz-trucks', name: 'Mercedes-Benz Trucks', url: 'https://www.mercedes-benz-trucks.com/' },
  scania: { id: 'source-scania', name: 'Scania', url: 'https://www.scania.com/' },
  'man-truck-bus': { id: 'source-man-truck-bus', name: 'MAN Truck & Bus', url: 'https://www.man.eu/' },
  'renault-trucks': { id: 'source-renault-trucks', name: 'Renault Trucks', url: 'https://www.renault-trucks.com/' },
  iveco: { id: 'source-iveco', name: 'Iveco', url: 'https://www.iveco.com/' },
  kenworth: { id: 'source-kenworth', name: 'Kenworth', url: 'https://www.kenworth.com/' },
  peterbilt: { id: 'source-peterbilt', name: 'Peterbilt', url: 'https://www.peterbilt.com/' },
  freightliner: { id: 'source-freightliner', name: 'Freightliner', url: 'https://www.freightliner.com/' },
  mack: { id: 'source-mack', name: 'Mack Trucks', url: 'https://www.macktrucks.com/' },
  'western-star': { id: 'source-western-star', name: 'Western Star', url: 'https://www.westernstartrucks.com/' },
  hino: { id: 'source-hino', name: 'Hino Trucks', url: 'https://www.hino.com/' },
  isuzu: { id: 'source-isuzu', name: 'Isuzu Trucks', url: 'https://www.isuzucv.com/' },
};

const PART_TEMPLATES: PartTemplate[] = [
  ['brake-disc','Brake Disc','Brakes','brake-system',['brake','disc'],['BREMBO','TRW','FEBI','KNORR-BREMSE']],
  ['brake-pad','Brake Pad','Brakes','brake-system',['brake','pad'],['TRW','BREMBO','FEBI','TEXTAR']],
  ['brake-drum','Brake Drum','Brakes','brake-system',['brake','drum'],['BREMBO','FEBI','TRW']],
  ['brake-lining','Brake Lining','Brakes','brake-system',['brake','lining'],['TEXTAR','TRW','FEBI']],
  ['brake-caliper','Brake Caliper','Brakes','brake-system',['brake','caliper'],['TRW','BREMBO','FEBI']],
  ['brake-chamber','Brake Chamber','Brakes','brake-system',['brake','air','chamber'],['KNORR-BREMSE','WABCO','HALDEX']],
  ['brake-valve','Brake Valve','Brakes','brake-system',['brake','valve'],['KNORR-BREMSE','WABCO','HALDEX']],
  ['abs-sensor','ABS Sensor','Brakes','brake-system',['abs','sensor','brake'],['BOSCH','KNORR-BREMSE','WABCO']],
  ['air-dryer','Air Dryer','Brakes','brake-system',['air','dryer','brake'],['KNORR-BREMSE','WABCO','HALDEX']],
  ['compressor','Air Compressor','Engine','engine-system',['air','compressor'],['KNORR-BREMSE','WABCO']],
  ['oil-filter','Oil Filter','Filters','engine-system',['filter','oil'],['MANN-FILTER','MAHLE','HENGST','DONALDSON','UFI']],
  ['air-filter','Air Filter','Filters','engine-system',['filter','air'],['MANN-FILTER','MAHLE','HENGST','DONALDSON','UFI']],
  ['fuel-filter','Fuel Filter','Filters','engine-system',['filter','fuel'],['MANN-FILTER','MAHLE','HENGST','DONALDSON','UFI']],
  ['cabin-filter','Cabin Air Filter','Filters','cabin-system',['filter','cabin'],['MANN-FILTER','MAHLE','HENGST','UFI']],
  ['hydraulic-filter','Hydraulic Filter','Filters','other-system',['filter','hydraulic'],['DONALDSON','MAHLE','MANN-FILTER']],
  ['fuel-pump','Fuel Pump','Engine','engine-system',['fuel','pump'],['BOSCH','DENSO']],
  ['injector','Fuel Injector','Engine','engine-system',['fuel','injector'],['BOSCH','DENSO','DELPHI']],
  ['high-pressure-pump','High Pressure Fuel Pump','Engine','engine-system',['fuel','high pressure','pump'],['BOSCH','DENSO','DELPHI']],
  ['turbocharger','Turbocharger','Engine','engine-system',['turbo','charger'],['GARRETT','BORGWARNER']],
  ['turbo-actuator','Turbo Actuator','Engine','engine-system',['turbo','actuator'],['GARRETT','BORGWARNER']],
  ['egr-valve','EGR Valve','Engine','engine-system',['egr','valve'],['BOSCH','PIERBURG','FEBI']],
  ['oil-pump','Oil Pump','Engine','engine-system',['oil','pump'],['FEBI','MAHLE']],
  ['water-pump','Water Pump','Cooling System','cooling-system',['water','pump','cooling'],['MAHLE','GATES','DAYCO','SKF']],
  ['thermostat','Thermostat','Cooling System','cooling-system',['thermostat','cooling'],['MAHLE','GATES','FEBI']],
  ['radiator','Radiator','Cooling System','cooling-system',['radiator','cooling'],['MAHLE','NRF','BEHR']],
  ['intercooler','Intercooler','Cooling System','cooling-system',['intercooler','charge air'],['MAHLE','NRF']],
  ['fan-clutch','Fan Clutch','Cooling System','cooling-system',['fan','clutch','cooling'],['MAHLE','BEHR','BORGWARNER']],
  ['coolant-hose','Coolant Hose','Cooling System','cooling-system',['coolant','hose'],['GATES','DAYCO','FEBI']],
  ['drive-belt','Drive Belt','Engine','engine-system',['drive','belt'],['GATES','DAYCO','CONTITECH']],
  ['belt-tensioner','Belt Tensioner','Engine','engine-system',['belt','tensioner'],['INA','GATES','DAYCO']],
  ['timing-kit','Timing Belt/Chain Kit','Engine','engine-system',['timing','kit'],['CONTITECH','GATES','DAYCO','INA']],
  ['engine-mount','Engine Mount','Engine','engine-system',['engine','mount'],['FEBI','LEMFÖRDER']],
  ['clutch-kit','Clutch Kit','Transmission','transmission-system',['clutch','kit'],['SACHS','LuK','VALEO']],
  ['clutch-disc','Clutch Disc','Transmission','transmission-system',['clutch','disc'],['SACHS','LuK','VALEO']],
  ['clutch-cover','Clutch Cover','Transmission','transmission-system',['clutch','cover'],['SACHS','LuK','VALEO']],
  ['release-bearing','Release Bearing','Transmission','transmission-system',['clutch','bearing'],['SACHS','SKF','FAG']],
  ['clutch-slave-cylinder','Clutch Slave Cylinder','Transmission','transmission-system',['clutch','hydraulic'],['ZF','SACHS','TRW']],
  ['gearbox','Gearbox','Transmission','transmission-system',['gearbox','transmission'],['ZF']],
  ['gearbox-filter','Transmission Filter','Transmission','transmission-system',['gearbox','filter'],['ZF','MANN-FILTER']],
  ['propeller-shaft','Propeller Shaft','Transmission','transmission-system',['propeller','shaft'],['GKN','SPICER']],
  ['universal-joint','Universal Joint','Transmission','transmission-system',['universal','joint','driveshaft'],['SPICER','GKN']],
  ['shock-absorber','Shock Absorber','Suspension','suspension-system',['shock','absorber'],['SACHS','MONROE','ZF']],
  ['air-spring','Air Spring','Suspension','suspension-system',['air','spring'],['CONTINENTAL','FIRESTONE','GOODYEAR']],
  ['cab-air-spring','Cab Air Spring','Cabin','cabin-system',['cab','air','spring'],['CONTINENTAL','FIRESTONE']],
  ['control-arm','Control Arm','Suspension','suspension-system',['control','arm'],['LEMFÖRDER','TRW','FEBI']],
  ['stabilizer-link','Stabilizer Link','Suspension','suspension-system',['stabilizer','link'],['LEMFÖRDER','TRW','FEBI']],
  ['leaf-spring','Leaf Spring','Suspension','suspension-system',['leaf','spring'],['SACHS','FEBI']],
  ['steering-pump','Steering Pump','Steering','steering-system',['steering','pump'],['ZF','TRW']],
  ['steering-gear','Steering Gear','Steering','steering-system',['steering','gear'],['ZF','TRW']],
  ['tie-rod','Tie Rod','Steering','steering-system',['tie','rod'],['LEMFÖRDER','TRW','FEBI']],
  ['drag-link','Drag Link','Steering','steering-system',['drag','link'],['LEMFÖRDER','TRW','FEBI']],
  ['starter-motor','Starter Motor','Electrical','electrical-system',['starter','motor'],['BOSCH','HELLA','DENSO','VALEO']],
  ['alternator','Alternator','Electrical','electrical-system',['alternator'],['BOSCH','HELLA','DENSO','VALEO']],
  ['battery','Truck Battery','Electrical','electrical-system',['battery'],['VARTA','BOSCH','EXIDE']],
  ['glow-plug','Glow Plug','Electrical','electrical-system',['glow','plug'],['BOSCH','DENSO']],
  ['engine-sensor','Engine Sensor','Electrical','electrical-system',['sensor','engine'],['BOSCH','DENSO','HELLA']],
  ['headlamp','Headlamp','Electrical','electrical-system',['headlamp','lighting'],['HELLA','VALEO']],
  ['wiper-motor','Wiper Motor','Cabin','cabin-system',['wiper','motor'],['HELLA','VALEO']],
  ['mirror','Mirror Assembly','Cabin','cabin-system',['mirror','cabin'],['HELLA','MEKRA','FEBI']],
  ['door-lock','Door Lock','Cabin','cabin-system',['door','lock'],['FEBI','VALEO']],
  ['exhaust-pipe','Exhaust Pipe','Exhaust','exhaust-system',['exhaust','pipe'],['BOSAL','HJS','FEBI']],
  ['muffler','Muffler','Exhaust','exhaust-system',['exhaust','muffler'],['BOSAL','HJS']],
  ['dpf','Diesel Particulate Filter','Exhaust','exhaust-system',['dpf','exhaust'],['HJS','BOSAL']],
  ['scr-catalyst','SCR Catalyst','Exhaust','exhaust-system',['scr','catalyst','adblue'],['HJS','BOSAL']],
  ['adblue-pump','AdBlue Pump','Exhaust','exhaust-system',['adblue','pump'],['BOSCH','HELLA']],
].map(([slug,name,category,systemId,tags,brands]) => ({ slug, name, category, systemId, tags, aftermarketBrands: brands } as PartTemplate));

const MANUFACTURERS: ManufacturerDefinition[] = [
  { id:'volvo-trucks', name:'Volvo Trucks', source:SOURCES['volvo-trucks'], models:[{id:'volvo-fh',name:'FH'},{id:'volvo-fh16',name:'FH16'},{id:'volvo-fm',name:'FM'},{id:'volvo-fmx',name:'FMX'},{id:'volvo-fe',name:'FE'},{id:'volvo-fl',name:'FL'}] },
  { id:'daf-trucks', name:'DAF Trucks', source:SOURCES['daf-trucks'], models:[{id:'daf-xf',name:'XF'},{id:'daf-xg',name:'XG'},{id:'daf-xg-plus',name:'XG+'},{id:'daf-cf',name:'CF'},{id:'daf-lf',name:'LF'}] },
  { id:'mercedes-benz-trucks', name:'Mercedes-Benz Trucks', source:SOURCES['mercedes-benz-trucks'], models:[{id:'mercedes-actros',name:'Actros'},{id:'mercedes-arocs',name:'Arocs'},{id:'mercedes-atego',name:'Atego'},{id:'mercedes-axor',name:'Axor'}] },
  { id:'scania', name:'Scania', source:SOURCES.scania, models:[{id:'scania-r',name:'R-Series'},{id:'scania-s',name:'S-Series'},{id:'scania-p',name:'P-Series'},{id:'scania-g',name:'G-Series'}] },
  { id:'man-truck-bus', name:'MAN Truck & Bus', source:SOURCES['man-truck-bus'], models:[{id:'man-tgx',name:'TGX'},{id:'man-tgs',name:'TGS'},{id:'man-tgm',name:'TGM'},{id:'man-tgl',name:'TGL'}] },
  { id:'renault-trucks', name:'Renault Trucks', source:SOURCES['renault-trucks'], models:[{id:'renault-t',name:'T'},{id:'renault-c',name:'C'},{id:'renault-k',name:'K'},{id:'renault-d',name:'D'}] },
  { id:'iveco', name:'Iveco', source:SOURCES.iveco, models:[{id:'iveco-s-way',name:'S-Way'},{id:'iveco-x-way',name:'X-Way'},{id:'iveco-t-way',name:'T-Way'},{id:'iveco-eurocargo',name:'Eurocargo'}] },
  { id:'kenworth', name:'Kenworth', source:SOURCES.kenworth, models:[{id:'kenworth-t680',name:'T680'},{id:'kenworth-t880',name:'T880'},{id:'kenworth-w990',name:'W990'}] },
  { id:'peterbilt', name:'Peterbilt', source:SOURCES.peterbilt, models:[{id:'peterbilt-579',name:'579'},{id:'peterbilt-389',name:'389'},{id:'peterbilt-567',name:'567'}] },
  { id:'freightliner', name:'Freightliner', source:SOURCES.freightliner, models:[{id:'freightliner-cascadia',name:'Cascadia'},{id:'freightliner-m2-106',name:'M2 106'},{id:'freightliner-122sd',name:'122SD'}] },
  { id:'mack', name:'Mack Trucks', source:SOURCES.mack, models:[{id:'mack-anthem',name:'Anthem'},{id:'mack-pinnacle',name:'Pinnacle'},{id:'mack-granite',name:'Granite'}] },
  { id:'western-star', name:'Western Star', source:SOURCES['western-star'], models:[{id:'western-star-49x',name:'49X'},{id:'western-star-57x',name:'57X'},{id:'western-star-47x',name:'47X'}] },
  { id:'hino', name:'Hino Trucks', source:SOURCES.hino, models:[{id:'hino-xl',name:'XL Series'},{id:'hino-l',name:'L Series'}] },
  { id:'isuzu', name:'Isuzu Trucks', source:SOURCES.isuzu, models:[{id:'isuzu-n',name:'N Series'},{id:'isuzu-f',name:'F Series'},{id:'isuzu-g',name:'G Series'}] },
];

const VERIFIED_OEM_REFERENCES: Array<{manufacturerId:string;partTemplateSlug:string;referenceNumber:string;sourceUrl:string}> = [];

function unique(values:string[]):string[]{ return Array.from(new Set(values)); }
function slugify(value:string):string { return value.toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,''); }
function parseList(value:string|undefined):string[]{ return value ? value.split(',').map(v=>v.trim()).filter(Boolean) : []; }
function createSource(source:SourceDefinition,partId:string):Source { return {id:`${source.id}-${partId}`,partId,name:source.name,url:source.url,type:'official',reliability:'high'}; }
function createVerifiedOEMReferences(partId:string,manufacturerId:string,templateSlug:string):OEMReference[]{ return VERIFIED_OEM_REFERENCES.filter(i=>i.manufacturerId===manufacturerId&&i.partTemplateSlug===templateSlug).map((i,index)=>({id:`${partId}-oem-${index+1}`,partId,manufacturerId,referenceNumber:i.referenceNumber,verificationStatus:'verified' as const,source:i.sourceUrl})); }
function createPart(manufacturer:ManufacturerDefinition,model:ModelDefinition,template:PartTemplate):Part {
  const id=`${model.id}-${template.slug}`;
  const tags=unique([...template.tags,slugify(manufacturer.id),slugify(model.name)]);
  const aftermarketBrands=unique(template.aftermarketBrands);
  const oemReferences=createVerifiedOEMReferences(id,manufacturer.id,template.slug);
  return { id, systemId:template.systemId, name:template.name,
    description:`${template.name} catalog entry for ${manufacturer.name} ${model.name}. Exact OEM reference and vehicle fitment must be verified from authoritative manufacturer data before ordering.`,
    category:template.category,
    specifications:{type:template.name,vehicleType:'Truck',manufacturer:manufacturer.name,manufacturerId:manufacturer.id,model:model.name,tags:tags.join(', '),aftermarketBrands:aftermarketBrands.join(', '),oemStatus:oemReferences.length?'verified':'pending-exact-application-lookup',referencePolicy:'OEM numbers are added only after authoritative verification'},
    images:[],oemReferences,crossReferences:[],compatibility:[],sources:[createSource(manufacturer.source,id)],verificationStatus:oemReferences.length?'verified':'needs-verification',createdAt:now,updatedAt:now };
}

export const CATALOG_PARTS:Part[] = MANUFACTURERS.flatMap(m=>m.models.flatMap(model=>PART_TEMPLATES.map(t=>createPart(m,model,t))));
export const CATALOG_MANUFACTURERS=MANUFACTURERS.map(({id,name})=>({id,name}));
export const CATALOG_MODELS=MANUFACTURERS.flatMap(m=>m.models.map(model=>({id:model.id,manufacturerId:m.id,name:model.name})));
export const CATALOG_CATEGORIES=Array.from(new Set(CATALOG_PARTS.map(p=>p.category)));
export const CATALOG_SYSTEMS=Array.from(new Set(CATALOG_PARTS.map(p=>p.systemId)));
export const CATALOG_AFTERMARKET_BRANDS=Array.from(new Set(PART_TEMPLATES.flatMap(t=>t.aftermarketBrands))).sort();
export const CATALOG_STATS={manufacturers:MANUFACTURERS.length,models:CATALOG_MODELS.length,partTemplates:PART_TEMPLATES.length,parts:CATALOG_PARTS.length,categories:CATALOG_CATEGORIES.length,systems:CATALOG_SYSTEMS.length,aftermarketBrands:CATALOG_AFTERMARKET_BRANDS.length,verifiedOEMReferences:VERIFIED_OEM_REFERENCES.length};

export function searchCatalog(query:string):Part[]{ const normalized=query.trim().toLowerCase(); if(!normalized)return CATALOG_PARTS; return CATALOG_PARTS.filter(part=>[part.id,part.name,part.category,part.description??'',part.specifications?.manufacturer??'',part.specifications?.manufacturerId??'',part.specifications?.model??'',part.specifications?.oemStatus??'',...parseList(part.specifications?.tags),...parseList(part.specifications?.aftermarketBrands),...part.oemReferences.flatMap(o=>[o.referenceNumber,...(o.alternateNumbers??[])])].join(' ').toLowerCase().includes(normalized)); }
export function getPartsByManufacturer(manufacturerId:string):Part[]{ const n=manufacturerId.trim().toLowerCase(); return CATALOG_PARTS.filter(p=>p.specifications?.manufacturerId?.toLowerCase()===n); }
export function getPartsByModel(manufacturerId:string,model:string):Part[]{ const m=manufacturerId.trim().toLowerCase(),n=model.trim().toLowerCase(); return CATALOG_PARTS.filter(p=>p.specifications?.manufacturerId?.toLowerCase()===m&&p.specifications?.model?.toLowerCase()===n); }
export function getPartsByCategory(category:string):Part[]{ const n=category.trim().toLowerCase(); return CATALOG_PARTS.filter(p=>p.category.toLowerCase()===n); }
export function getPartsBySystem(systemId:string):Part[]{ return CATALOG_PARTS.filter(p=>p.systemId===systemId); }
export function getPartsByAftermarketBrand(brand:string):Part[]{ const n=brand.trim().toLowerCase(); return CATALOG_PARTS.filter(p=>parseList(p.specifications?.aftermarketBrands).some(x=>x.toLowerCase()===n)); }
export function getPartsByTag(tag:string):Part[]{ const n=tag.trim().toLowerCase(); return CATALOG_PARTS.filter(p=>parseList(p.specifications?.tags).some(x=>x.toLowerCase()===n)); }
export function getPartsByOEM(referenceNumber:string):Part[]{ const n=referenceNumber.trim().toLowerCase(); return CATALOG_PARTS.filter(p=>p.oemReferences.some(o=>o.referenceNumber.toLowerCase()===n||(o.alternateNumbers??[]).some(a=>a.toLowerCase()===n))); }
export function getPartById(id:string):Part|undefined{return CATALOG_PARTS.find(p=>p.id===id);}
export function getVerifiedOEMParts():Part[]{return CATALOG_PARTS.filter(p=>p.oemReferences.length>0);}
