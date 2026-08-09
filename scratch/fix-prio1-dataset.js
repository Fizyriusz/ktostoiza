/*
 * Migracja danych — priorytet 1, punkty 2 i 3.
 *
 *  (2) 80 marek bez `parentId` i bez krawędzi nie trafiało na mapę.
 *      - marki, których realny właściciel jest już koncernem w bazie -> pod ten koncern
 *      - marki własne sieci handlowych -> h-market
 *      - reszta -> kubełek wg pola `origin` (istniejące h-*-ind + nowe ES/FR/GB)
 *
 *  (3) 58 identyfikatorów w `producedBy` nie miało odpowiednika w `nodes[]`.
 *      - duplikaty istniejących węzłów -> kanonizacja aliasów
 *      - reszta -> wygenerowane węzły `manufacturer`
 *
 * Kraj producenta ustawiamy tylko tam, gdzie jest pewny; inaczej 'Nieznany'
 * (UI pokazuje wtedy globus zamiast zmyślonej flagi).
 */

const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, '..', 'src', 'data', 'dataset.json');
const dataset = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

const byId = new Map(dataset.nodes.map(n => [n.id, n]));
const log = [];

// ─── (2a) Nowe kubełki wg pochodzenia ───────────────────────────────────────
// Nazwy neutralne: grupują wg rodowodu, nie twierdzą nic o niezależności.

const NEW_BUCKETS = [
  {
    id: 'h-es-ind', type: 'holding', name: 'Marki hiszpańskie', country: 'Hiszpania',
    description: 'Marki o rodowodzie hiszpańskim, którym nie przypisano w bazie koncernu-właściciela.',
    seo_slug: 'marki-hiszpanskie',
  },
  {
    id: 'h-fr-ind', type: 'holding', name: 'Marki francuskie', country: 'Francja',
    description: 'Marki o rodowodzie francuskim, którym nie przypisano w bazie koncernu-właściciela.',
    seo_slug: 'marki-francuskie',
  },
  {
    id: 'h-gb-ind', type: 'holding', name: 'Marki brytyjskie', country: 'Wielka Brytania',
    description: 'Marki o rodowodzie brytyjskim, którym nie przypisano w bazie koncernu-właściciela.',
    seo_slug: 'marki-brytyjskie',
  },
];

const hMarketIdx = dataset.nodes.findIndex(n => n.id === 'h-market');
NEW_BUCKETS.forEach(b => {
  if (byId.has(b.id)) return;
  dataset.nodes.splice(hMarketIdx, 0, b);
  byId.set(b.id, b);
  log.push(`+ koncern ${b.id} (${b.name})`);
});

// ─── (2b) Marki o znanym właścicielu obecnym już w bazie ────────────────────

const REAL_OWNER = {
  'b-balay': 'h-bsh',        // Balay — marka BSH
  'b-mora': 'h-hisense',     // Mora — marka Gorenje, Gorenje należy do Hisense
  'b-comfee': 'h-midea',     // Comfee — marka Midea
  'b-kitchenaid': 'h-beko',  // KitchenAid — europejskie operacje Whirlpoola przejęło Beko Europe
};

// Marki własne sieci handlowych i platform sprzedażowych.
const RETAIL_OWN = [
  'b-silvercrest',  // Lidl (Schwarz Gruppe)
  'b-cooke-lewis',  // Kingfisher / Castorama
  'b-goodhome',     // Kingfisher / Castorama
  'b-obi',          // OBI
  'b-vidaxl',       // vidaXL
  'b-hanseatic',    // Otto Group
  'b-ikea',         // IKEA
];

// ─── (2c) Kubełki wg pola `origin` ──────────────────────────────────────────

const ORIGIN_BUCKET = [
  [/^polska/i, 'h-pl-ind'],
  [/^hiszpania/i, 'h-es-ind'],
  [/^francja/i, 'h-fr-ind'],
  [/^wielka brytania/i, 'h-gb-ind'],
  [/^niemcy/i, 'h-de-ind'],
  [/^włochy/i, 'h-it-ind'],
  [/^chiny/i, 'h-cn-ind'],
  [/^japonia/i, 'h-jp-ind'],
  [/^słowenia/i, 'h-si-ind'],
];

function bucketFor(origin) {
  const hit = ORIGIN_BUCKET.find(([re]) => re.test(origin || ''));
  return hit ? hit[1] : 'h-other-ind';
}

// Marki bez rodzica: ani `parentId`, ani żadnej krawędzi wchodzącej.
const hasIncomingEdge = new Set(dataset.edges.map(e => e.target));
const orphans = dataset.nodes.filter(
  n => n.type === 'brand' && !n.parentId && !hasIncomingEdge.has(n.id)
);

orphans.forEach(brand => {
  let parentId;
  let label;

  if (REAL_OWNER[brand.id]) {
    parentId = REAL_OWNER[brand.id];
    label = 'Właściciel';
  } else if (RETAIL_OWN.includes(brand.id)) {
    parentId = 'h-market';
    label = 'Marka własna';
  } else {
    parentId = bucketFor(brand.origin);
    label = 'Pochodzenie';
  }

  brand.parentId = parentId;
  dataset.edges.push({
    id: `e-${parentId.replace(/^h-/, '')}-${brand.id.replace(/^b-/, '')}`,
    source: parentId,
    target: brand.id,
    label,
  });
  log.push(`  ${brand.name} -> ${parentId} (${label})`);
});

// ─── (3a) Kanonizacja aliasów w producedBy ──────────────────────────────────
// Te identyfikatory opisują podmioty, które już są w bazie pod innym ID.

const PRODUCER_ALIAS = {
  'm-midea-group': 'm-midea',
  'm-bsh-group': 'm-bsh-factory',
  'm-beko-europe': 'h-beko',
  'm-vestel': 'h-vestel',
  'm-gorenje-hisense': 'h-hisense',
};

// ─── (3b) Brakujące węzły producentów ───────────────────────────────────────
// country tylko tam, gdzie jest pewny; 'Nieznany' -> UI pokazuje globus.

const PRODUCER_COUNTRY = {
  'm-bora-holding': 'Austria',
  'm-braukmann-gmbh': 'Niemcy',
  'm-canbolat-vertriebs': 'Niemcy',
  'm-cdiscount-group': 'Francja',
  'm-cecotec-innovaciones': 'Hiszpania',
  'm-ciarko-sanok': 'Polska',
  'm-ciarra-appliances': 'Chiny',
  'm-clatronic-group': 'Niemcy',
  'm-cna-group': 'Hiszpania',
  'm-delta-france': 'Francja',
  'm-dometic-group': 'Szwecja',
  'm-dunavox-europe': 'Węgry',
  'm-electrolux': 'Szwecja',
  'm-elica-group': 'Włochy',
  'm-focus-agd': 'Polska',
  'm-franke-group': 'Szwajcaria',
  'm-frio-group': 'Francja',
  'm-galvamet-italy': 'Włochy',
  'm-hendi-group': 'Holandia',
  'm-jp-industries': 'Włochy',
  'm-kingfisher-plc': 'Wielka Brytania',
  'm-klima-classic': 'Czechy',
  'm-kuchinox-polska': 'Polska',
  'm-lacor-menaje': 'Hiszpania',
  'm-m-san-grupa': 'Chorwacja',
  'm-melchioni-spa': 'Włochy',
  'm-middleby-corp': 'USA',
  'm-novoterm-szczecin': 'Polska',
  'm-nortek-global': 'USA',
  'm-obi-group': 'Niemcy',
  'm-olan-haushaltsgerate': 'Niemcy',
  'm-otto-group': 'Niemcy',
  'm-pkm-gmbh': 'Niemcy',
  'm-pyramis-metallourgia': 'Grecja',
  'm-schwarz-gruppe': 'Niemcy',
  'm-silva-schneider': 'Austria',
  'm-simfer-as': 'Turcja',
  'm-taurus-group': 'Hiszpania',
  'm-teka-group': 'Hiszpania',
  'm-thetford-corp': 'USA',
  'm-tognana-spa': 'Włochy',
  'm-vevor-group': 'Chiny',
  'm-vitrokitchen-spain': 'Hiszpania',
  'm-whirlpool-usa': 'USA',
  'm-winia-electronics': 'Korea Południowa',
  // Zbiorcze zastępniki obecne w danych źródłowych.
  'm-oem-china': 'Chiny',
  'm-oem-turkey': 'Turcja',
  'm-oem-various': 'Różne',
};

// Nazwy, których nie da się poprawnie odtworzyć z identyfikatora.
const PRODUCER_NAME = {
  'm-oem-china': 'Producenci kontraktowi (Chiny)',
  'm-oem-turkey': 'Producenci kontraktowi (Turcja)',
  'm-oem-various': 'Producenci kontraktowi (różni)',
  'm-id-unknown': 'Producent nieustalony',
  'm-pkm-gmbh': 'PKM GmbH',
  'm-ers-group': 'ERS Group',
  'm-ls-group': 'LS Group',
  'm-neg-novex': 'NEG / Novex',
  'm-m-san-grupa': 'M SAN Grupa',
  'm-cna-group': 'CNA Group',
  'm-jp-industries': 'JP Industries',
  'm-obi-group': 'OBI Group',
  'm-simfer-as': 'Simfer A.Ş.',
  'm-melchioni-spa': 'Melchioni S.p.A.',
  'm-tognana-spa': 'Tognana S.p.A.',
  'm-kingfisher-plc': 'Kingfisher plc',
  'm-whirlpool-usa': 'Whirlpool Corporation (USA)',
  'm-ciarko-sanok': 'Ciarko (Sanok)',
  'm-novoterm-szczecin': 'Novoterm (Szczecin)',
  'm-olan-haushaltsgerate': 'Olan Haushaltsgeräte',
  'm-silva-schneider': 'Silva-Schneider',
  'm-canbolat-vertriebs': 'Canbolat Vertriebs',
  'm-vitrokitchen-spain': 'Vitrokitchen (Hiszpania)',
  'm-galvamet-italy': 'Galvamet (Włochy)',
  'm-delta-france': 'Delta France',
  'm-cecotec-innovaciones': 'Cecotec Innovaciones',
  'm-lacor-menaje': 'Lacor Menaje Profesional',
  'm-pyramis-metallourgia': 'Pyramis Metallourgia',
};

function titleFromId(id) {
  if (PRODUCER_NAME[id]) return PRODUCER_NAME[id];
  return id
    .replace(/^m-/, '')
    .split('-')
    .map(w => (w.length <= 3 ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(' ');
}

// Najpierw podmieniamy aliasy, potem zbieramy to, czego nadal brakuje.
dataset.nodes.forEach(n => {
  if (!Array.isArray(n.producedBy) || n.producedBy.length === 0) return;
  const mapped = n.producedBy.map(p => PRODUCER_ALIAS[p] || p);
  n.producedBy = [...new Set(mapped)];
});

const brandsOf = new Map();
dataset.nodes.forEach(n => {
  (n.producedBy || []).forEach(p => {
    if (!brandsOf.has(p)) brandsOf.set(p, []);
    brandsOf.get(p).push(n.name);
  });
});

const unknownCountry = [];
[...brandsOf.keys()]
  .filter(id => !byId.has(id))
  .sort()
  .forEach(id => {
    const brands = brandsOf.get(id);
    const country = PRODUCER_COUNTRY[id] || 'Nieznany';
    if (!PRODUCER_COUNTRY[id]) unknownCountry.push(id);

    const node = {
      id,
      type: 'manufacturer',
      name: titleFromId(id),
      country,
      description: `Podmiot produkcyjny wskazany w danych jako zaplecze marek: ${brands
        .slice(0, 6)
        .join(', ')}${brands.length > 6 ? ` i ${brands.length - 6} innych` : ''}.`,
      // Sufiks -oem zgodnie z istniejącą konwencją (midea-oem, bsh-factory-oem)
      // i żeby nie kolidować ze slugiem marki o tej samej nazwie.
      seo_slug: `${id.replace(/^m-/, '')}-oem`,
    };
    dataset.nodes.push(node);
    byId.set(id, node);
    log.push(`+ producent ${id} (${node.name}, ${country}) — ${brands.length} marek`);
  });

dataset.lastUpdate = new Date().toISOString();

fs.writeFileSync(dataFile, JSON.stringify(dataset, null, 2), 'utf8');

console.log(log.join('\n'));
console.log('\n─────────────────────────────────');
console.log('marek podpiętych:', orphans.length);
console.log('producentów dogenerowanych:', log.filter(l => l.startsWith('+ producent')).length);
console.log('producenci bez pewnego kraju:', unknownCountry.join(', ') || '—');
