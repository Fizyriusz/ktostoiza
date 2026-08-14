/*
 * Czyści pole `factories_pl` z twierdzeń o produkcji kontraktowej.
 *
 * Pole ma odpowiadać na jedno pytanie — czy marka ma fabrykę w Polsce —
 * a w 34 wpisach opisywało zamiast tego, kto dla niej produkuje i gdzie,
 * miejscami wymieniając producentów z nazwy ("m.in. Vestel, Midea",
 * "Whirlpool/Beko Europe", "Hoyer Handel"). To dokładnie te twierdzenia,
 * których nie da się udokumentować.
 *
 * Wpisy sprowadzamy do odpowiedzi na pytanie o Polskę. Jedyny, który
 * naprawdę mówił o produkcji w Polsce, zachowuje tę informację bez części
 * kontraktowej.
 *
 * Oryginały trafiają do src/data/oem-reserved.json.
 */

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const datasetFile = path.join(root, 'src/data/dataset.json');
const reservedFile = path.join(root, 'src/data/oem-reserved.json');

const dataset = JSON.parse(fs.readFileSync(datasetFile, 'utf8'));
const reserved = JSON.parse(fs.readFileSync(reservedFile, 'utf8'));

const SUSPICIOUS = /\bOEM\b|\bODM\b|kontraktow|na zlecenie|dostawc|importer/i;

/** Wpisy stwierdzające produkcję w Polsce — zachowują sens, tracą część OEM. */
const KEEP_POLISH = {
  'Częściowy montaż lub produkcja kontraktowa w Polsce.': 'Częściowy montaż w Polsce.',
};

const NEUTRAL = 'Brak fabryk w Polsce.';

const originals = {};
let changed = 0;

dataset.nodes.forEach(node => {
  if (!Array.isArray(node.factories_pl)) return;
  if (!node.factories_pl.some(entry => SUSPICIOUS.test(entry))) return;

  originals[node.id] = [...node.factories_pl];

  const cleaned = node.factories_pl.map(entry => {
    if (!SUSPICIOUS.test(entry)) return entry;
    if (KEEP_POLISH[entry]) return KEEP_POLISH[entry];
    return NEUTRAL;
  });

  // Po sprowadzeniu do jednego zdania mogą powstać duplikaty.
  node.factories_pl = [...new Set(cleaned)];
  changed++;
});

reserved.originalFactories = originals;
fs.writeFileSync(reservedFile, JSON.stringify(reserved, null, 2), 'utf8');

dataset.lastUpdate = new Date().toISOString();
fs.writeFileSync(datasetFile, JSON.stringify(dataset, null, 2), 'utf8');

// Kontrola końcowa na wszystkich polach, także tablicowych.
const leftovers = [];
dataset.nodes.forEach(n => {
  Object.entries(n).forEach(([field, value]) => {
    const texts = Array.isArray(value) ? value : typeof value === 'string' ? [value] : [];
    texts.forEach(t => {
      if (/\bOEM\b|\bODM\b|kontraktow|\bm-[a-z-]{3,}/i.test(t)) leftovers.push(`${n.id}.${field}: ${t}`);
    });
  });
});

console.log('marek z wyczyszczonym factories_pl:', changed);
console.log('pozostałe wzmianki w całym datasecie:', leftovers.length);
leftovers.forEach(l => console.log('  ' + l));
