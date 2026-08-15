import { Part } from '@/types';
import * as CORE from '@/data/catalog-core';
import { CATALOG_EXPANSION } from '@/data/catalog-expansion';

const coreParts: Part[] = CORE.CATALOG_PARTS.map(p => ({ ...p, images: (p.images ?? []).filter(i => i.source?.includes('MANN-FILTER')) }));
export const CATALOG_PARTS: Part[] = [...coreParts, ...CATALOG_EXPANSION];
export const CATALOG_MANUFACTURERS = CORE.CATALOG_MANUFACTURERS;
export const CATALOG_MODELS = CORE.CATALOG_MODELS;
export const CATALOG_CATEGORIES = Array.from(new Set(CATALOG_PARTS.map(p => p.category)));
export const CATALOG_SYSTEMS = Array.from(new Set(CATALOG_PARTS.map(p => p.systemId)));
export const CATALOG_AFTERMARKET_BRANDS = Array.from(new Set(CATALOG_PARTS.flatMap(p => (p.specifications?.aftermarketBrands ?? '').split(',').map(x => x.trim()).filter(Boolean)))).sort();
export const CATALOG_STATS = { manufacturers: CATALOG_MANUFACTURERS.length, models: CATALOG_MODELS.length, partTemplates: CORE.CATALOG_STATS.partTemplates + CATALOG_EXPANSION.length / Math.max(CATALOG_MODELS.length, 1), parts: CATALOG_PARTS.length, categories: CATALOG_CATEGORIES.length, systems: CATALOG_SYSTEMS.length, aftermarketBrands: CATALOG_AFTERMARKET_BRANDS.length, verifiedOEMReferences: CORE.CATALOG_STATS.verifiedOEMReferences };
const list=(v?:string)=>v?v.split(',').map(x=>x.trim()).filter(Boolean):[];
const norm=(v:string)=>v.toLowerCase().replace(/[\s\-\/.]/g,'');
export function searchCatalog(query:string):Part[]{const q=query.trim().toLowerCase();if(!q)return CATALOG_PARTS;const c=norm(query);return CATALOG_PARTS.filter(p=>{const refs=p.oemReferences.flatMap(o=>[o.referenceNumber,...(o.alternateNumbers??[])]);if(refs.some(r=>r.toLowerCase().includes(q)||norm(r).includes(c)))return true;return[p.id,p.name,p.category,p.description??'',p.specifications?.manufacturer??'',p.specifications?.model??'',p.specifications?.crossReferences??'',...list(p.specifications?.tags),...list(p.specifications?.aftermarketBrands)].join(' ').toLowerCase().includes(q)})}
export function getPartsByManufacturer(id:string){const n=id.trim().toLowerCase();return CATALOG_PARTS.filter(p=>p.specifications?.manufacturerId?.toLowerCase()===n)}
export function getPartsByModel(id:string,model:string){const a=id.trim().toLowerCase(),b=model.trim().toLowerCase();return CATALOG_PARTS.filter(p=>p.specifications?.manufacturerId?.toLowerCase()===a&&p.specifications?.model?.toLowerCase()===b)}
export function getPartsByCategory(category:string){const n=category.trim().toLowerCase();return CATALOG_PARTS.filter(p=>p.category.toLowerCase()===n)}
export function getPartsBySystem(systemId:string){return CATALOG_PARTS.filter(p=>p.systemId===systemId)}
export function getPartsByAftermarketBrand(brand:string){const n=brand.trim().toLowerCase();return CATALOG_PARTS.filter(p=>list(p.specifications?.aftermarketBrands).some(b=>b.toLowerCase()===n))}
export function getPartsByTag(tag:string){const n=tag.trim().toLowerCase();return CATALOG_PARTS.filter(p=>list(p.specifications?.tags).some(t=>t.toLowerCase()===n))}
export function getPartsByOEM(referenceNumber:string){const n=referenceNumber.trim().toLowerCase(),c=norm(referenceNumber);return CATALOG_PARTS.filter(p=>p.oemReferences.some(o=>[o.referenceNumber,...(o.alternateNumbers??[])].some(r=>r.toLowerCase()===n||norm(r)===c||norm(r).includes(c))))}
export function getPartById(id:string){return CATALOG_PARTS.find(p=>p.id===id)}
export function getVerifiedOEMParts(){return CATALOG_PARTS.filter(p=>p.oemReferences.length>0)}
export { CATALOG_EXPANSION };
