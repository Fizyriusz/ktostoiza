/*
 * Usuwa twierdzenia o produkcji kontraktowej z wolnego tekstu.
 *
 * Wyjęcie pól `producedBy` i węzłów `manufacturer` nie wystarczyło — te same
 * twierdzenia siedziały w opisach i historiach, a opis h-midea wyciekał wprost
 * wewnętrzny identyfikator fabryki ("Operator fabryki OEM m-midea").
 *
 * Zdania są usuwane albo skracane, nie zastępowane nowymi twierdzeniami —
 * celem jest nie mówić więcej, niż da się udokumentować.
 *
 * Oryginały lądują w src/data/oem-reserved.json obok reszty danych OEM.
 */

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const datasetFile = path.join(root, 'src/data/dataset.json');
const reservedFile = path.join(root, 'src/data/oem-reserved.json');

const dataset = JSON.parse(fs.readFileSync(datasetFile, 'utf8'));
const reserved = fs.existsSync(reservedFile)
  ? JSON.parse(fs.readFileSync(reservedFile, 'utf8'))
  : {};

const EDITS = [
  ['h-vestel', 'description', 'Turecka grupa przemysłowa działająca w elektronice użytkowej i AGD.'],
  ['h-midea', 'description', 'Jeden z największych producentów AGD na świecie. Właściciel marek Toshiba (AGD), Teka i Küppersbusch.'],
  ['h-market', 'name', 'Marki Marketowe'],
  [
    'b-toshiba',
    'history',
    'Japońska ikona. Od 2016 roku marka AGD Toshiba (w skrócie: Toshiba Home Appliances) jest własnością chińskiego Midea Group.',
  ],
  ['b-franke', 'history', 'Lider rynku zlewozmywaków, obecny także w kategorii dużego AGD.'],
  ['b-midea', 'history', 'Jeden z największych producentów AGD na świecie, z własnym zapleczem produkcyjnym.'],
  ['b-de-noble-foster', 'acquisition_history', 'Marka operująca w ramach partnerstw dystrybucyjnych.'],
  ['b-ikea', 'acquisition_history', 'Nie dotyczy – rozwój poprzez partnerstwa strategiczne.'],
  ['b-bright', 'acquisition_history', 'Marka rozwijana przez międzynarodowych dystrybutorów.'],
  [
    'b-pkm',
    'acquisition_history',
    'Należy do PKM GmbH & Co. KG, specjalizującej się w imporcie i certyfikacji sprzętu AGD.',
  ],
];

const byId = new Map(dataset.nodes.map(n => [n.id, n]));
const originals = {};
let changed = 0;

EDITS.forEach(([id, field, replacement]) => {
  const node = byId.get(id);
  if (!node) {
    console.warn('brak węzła', id);
    return;
  }
  if (node[field] === replacement) return;
  originals[`${id}.${field}`] = node[field];
  node[field] = replacement;
  changed++;
});

reserved.originalText = { ...(reserved.originalText || {}), ...originals };
fs.writeFileSync(reservedFile, JSON.stringify(reserved, null, 2), 'utf8');

dataset.lastUpdate = new Date().toISOString();
fs.writeFileSync(datasetFile, JSON.stringify(dataset, null, 2), 'utf8');

// Kontrola: czy w wolnym tekście zostało cokolwiek o produkcji kontraktowej.
const suspicious = /\bOEM\b|ODM|kontraktow|\bm-[a-z-]{3,}|produkuj\w* dla|na zlecenie|podwykonaw/i;
const left = [];
dataset.nodes.forEach(n => {
  ['name', 'description', 'history', 'acquisition_history', 'segment', 'business_structure', 'product_range'].forEach(f => {
    if (typeof n[f] === 'string' && suspicious.test(n[f])) left.push(`${n.id}.${f}: ${n[f]}`);
  });
});

console.log('zmienionych pól:', changed);
console.log('pozostałe wzmianki:', left.length);
left.forEach(l => console.log('  ' + l));
