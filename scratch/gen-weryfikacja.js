/*
 * Generator arkuszy weryfikacyjnych — docs/weryfikacja/.
 *
 * Wypisuje KAŻDĄ markę z kompletem tego, co siedzi w dataset.json, plus listę
 * pól, których brakuje, plus ostrzeżenia przy wartościach wstawionych przez
 * migrację automatycznie. Jeden plik na koncern, żeby dało się to przechodzić
 * partiami; README zbiera postęp.
 *
 * Uruchomienie: node scratch/gen-weryfikacja.js
 */

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const outDir = path.join(root, 'docs/weryfikacja');
const dataset = JSON.parse(fs.readFileSync(path.join(root, 'src/data/dataset.json'), 'utf8'));

const byId = new Map(dataset.nodes.map(n => [n.id, n]));
const brands = dataset.nodes.filter(n => n.type === 'brand');
const holdings = dataset.nodes.filter(n => n.type === 'holding');
const manufacturers = dataset.nodes.filter(n => n.type === 'manufacturer');

const edgeLabel = new Map();
dataset.edges.forEach(e => edgeLabel.set(`${e.source}->${e.target}`, e.label));

const PLACEHOLDER_PRODUCERS = new Set([
  'm-oem-china', 'm-oem-various', 'm-oem-turkey', 'm-id-unknown',
]);

const slugify = s =>
  s.toLowerCase()
    .replace(/[ąćęłńóśźż]/g, ch => ({ ą: 'a', ć: 'c', ę: 'e', ł: 'l', ń: 'n', ó: 'o', ś: 's', ź: 'z', ż: 'z' }[ch]))
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const logoExists = p => Boolean(p) && fs.existsSync(path.join(root, 'public', p));
const hasFactories = list => Array.isArray(list) && list.some(f => !f.toLowerCase().includes('brak'));

/** Pola, których nieobecność realnie coś znaczy. monetization pomijamy — brakuje
 *  go u 162 z 175 marek, więc na każdej pozycji byłby tylko szumem. */
const EXPECTED = [
  ['origin', 'kraj pochodzenia'],
  ['segment', 'segment'],
  ['scope', 'zasięg (globalny/regionalny)'],
  ['history', 'opis'],
  ['founded_year', 'rok założenia'],
  ['business_structure', 'struktura'],
  ['product_range', 'zakres produktów'],
  ['product_categories', 'kategorie produktowe'],
  ['acquisition_history', 'historia przejęć'],
  ['factories_pl', 'informacja o fabrykach w PL'],
  ['producedBy', 'producent (OEM)'],
  ['localLogo', 'logo'],
];

function missingFields(brand) {
  const missing = [];
  EXPECTED.forEach(([key, label]) => {
    const v = brand[key];
    const empty = v === undefined || v === null || v === '' || (Array.isArray(v) && v.length === 0);
    if (empty) missing.push(label);
    else if (key === 'localLogo' && !logoExists(v)) missing.push(`${label} (plik \`${v}\` nie istnieje)`);
  });
  return missing;
}

function sourceLinks(brand) {
  const q = encodeURIComponent(brand.name);
  return [
    `[Wikipedia](https://pl.wikipedia.org/w/index.php?search=${q})`,
    `[Ceneo](https://www.ceneo.pl/Sprzet_AGD;szukaj-${encodeURIComponent(slugify(brand.name))})`,
    `[Szukaj](https://duckduckgo.com/?q=${q}+AGD+producent)`,
  ].join(' · ');
}

function renderBrand(brand, index) {
  const L = [];
  const parent = brand.parentId ? byId.get(brand.parentId) : null;
  const basis = parent ? edgeLabel.get(`${parent.id}->${brand.id}`) : null;
  const missing = missingFields(brand);

  L.push(`### ${index}. ${brand.name}`);
  L.push('');
  L.push(`- [ ] **sprawdzone** — \`${brand.id}\``);
  L.push('');
  L.push(`${sourceLinks(brand)}`);
  L.push('');

  L.push(`| pole | wartość w bazie |`);
  L.push(`| --- | --- |`);
  const row = (k, v) => L.push(`| ${k} | ${v} |`);

  row('kraj pochodzenia', brand.origin || '— **brak**');
  if (parent) {
    row('właściciel / grupa', `${parent.name} \`${parent.id}\`${basis ? ` — podstawa: _${basis}_` : ''}`);
  } else {
    row('właściciel / grupa', '— **brak**');
  }
  row('segment', brand.segment || '— **brak**');
  row('zasięg', brand.scope === 'global' ? 'globalny' : brand.scope === 'regional' ? 'regionalny' : '— **brak**');
  row('dostępna w PL', brand.availableInPL === false ? 'nie' : brand.availableInPL === true ? 'tak' : '— **brak**');
  row('rok założenia', brand.founded_year || '— **brak**');
  row('struktura', brand.business_structure || '— **brak**');
  row('zakres produktów', brand.product_range || '— **brak**');
  row('kategorie', (brand.product_categories || []).join(', ') || '— **brak**');

  const fac = brand.factories_pl;
  row(
    'fabryki w PL',
    !fac ? '— **brak informacji**' : hasFactories(fac) ? fac.join('<br>') : `_${fac.join(', ')}_`
  );

  const prod = (brand.producedBy || []).map(id => {
    const p = byId.get(id);
    const warn = PLACEHOLDER_PRODUCERS.has(id) ? ' ⚠️ zastępnik' : p && p.country === 'Nieznany' ? ' ⚠️ kraj nieznany' : '';
    return `${p ? p.name : id} \`${id}\`${warn}`;
  });
  row('producent (OEM)', prod.join('<br>') || '— **brak**');

  row('logo', brand.localLogo ? (logoExists(brand.localLogo) ? `\`${brand.localLogo}\`` : `\`${brand.localLogo}\` ❌ **plik nie istnieje**`) : '— **brak**');
  row('adres strony', `\`/marka/${brand.seo_slug}\``);

  const mon = brand.monetization || {};
  const monList = Object.entries(mon).map(([k, v]) => `${k}: ${v}`);
  row('linki zakupowe', monList.join('<br>') || '—');

  L.push('');
  if (brand.history) {
    L.push(`**Opis:** ${brand.history}`);
    L.push('');
  }
  if (brand.acquisition_history) {
    L.push(`**Historia przejęć:** ${brand.acquisition_history}`);
    L.push('');
  }

  if (missing.length) {
    L.push(`**Brakuje:** ${missing.join(' · ')}`);
    L.push('');
  }

  const warnings = [];
  if (basis === 'Pochodzenie') {
    warnings.push(
      'Przypisanie do grupy jest **zgadywane po kraju pochodzenia** — marka nie miała w bazie żadnego właściciela. Jeśli ma realnego, przepnij ją.'
    );
  }
  if (basis === 'Marka własna') {
    warnings.push('Oznaczona jako marka własna sieci handlowej — potwierdź właściciela sieci.');
  }
  if ((brand.producedBy || []).some(id => PLACEHOLDER_PRODUCERS.has(id))) {
    warnings.push('Producent to zbiorczy zastępnik, nie konkretny zakład — do ustalenia.');
  }
  if (warnings.length) {
    warnings.forEach(x => L.push(`> ⚠️ ${x}`));
    L.push('');
  }

  L.push('---');
  L.push('');
  return L.join('\n');
}

// ── Pliki per koncern ───────────────────────────────────────────────────────

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

const groups = holdings
  .map(h => ({ holding: h, list: brands.filter(b => b.parentId === h.id) }))
  .filter(g => g.list.length > 0)
  .sort((a, b) => b.list.length - a.list.length);

const index = [];

groups.forEach((g, i) => {
  const num = String(i + 1).padStart(2, '0');
  const file = `${num}-${slugify(g.holding.name)}.md`;
  const L = [];

  L.push(`# ${g.holding.name}`);
  L.push('');
  L.push(`\`${g.holding.id}\` · ${g.holding.country} · **${g.list.length} marek**`);
  L.push('');
  if (g.holding.description) {
    L.push(`> ${g.holding.description}`);
    L.push('');
  }
  L.push(`[← spis wszystkich grup](README.md)`);
  L.push('');
  L.push('---');
  L.push('');

  g.list
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name, 'pl'))
    .forEach((brand, j) => L.push(renderBrand(brand, j + 1)));

  fs.writeFileSync(path.join(outDir, file), L.join('\n'), 'utf8');

  const flagged = g.list.filter(b => {
    const basis = edgeLabel.get(`${b.parentId}->${b.id}`);
    return basis === 'Pochodzenie' || basis === 'Marka własna'
      || (b.producedBy || []).some(id => PLACEHOLDER_PRODUCERS.has(id))
      || (b.localLogo && !logoExists(b.localLogo));
  }).length;

  index.push({ file, name: g.holding.name, count: g.list.length, flagged });
});

// ── Producenci OEM ──────────────────────────────────────────────────────────

const prodFile = '99-producenci-oem.md';
{
  const L = [];
  L.push('# Producenci OEM');
  L.push('');
  L.push(`**${manufacturers.length} zakładów.** Większość z nich powstała automatycznie —`);
  L.push('nazwa została odtworzona z identyfikatora używanego w polu `producedBy`,');
  L.push('a kraj uzupełniony tylko tam, gdzie był pewny. Sprawdź, czy podmiot');
  L.push('naprawdę tak się nazywa i czy faktycznie **produkuje**, a nie tylko');
  L.push('dystrybuuje albo posiada markę.');
  L.push('');
  L.push('[← spis wszystkich grup](README.md)');
  L.push('');
  L.push('---');
  L.push('');

  manufacturers
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name, 'pl'))
    .forEach((m, i) => {
      const kids = brands.filter(b => (b.producedBy || []).includes(m.id));
      L.push(`### ${i + 1}. ${m.name}`);
      L.push('');
      L.push(`- [ ] **sprawdzone** — \`${m.id}\``);
      L.push('');
      L.push(`| pole | wartość w bazie |`);
      L.push(`| --- | --- |`);
      L.push(`| kraj | ${m.country === 'Nieznany' ? '⚠️ **Nieznany**' : m.country} |`);
      L.push(`| produkuje dla | ${kids.map(k => k.name).join(', ') || '— **dla nikogo**'} |`);
      L.push(`| adres strony | \`/marka/${m.seo_slug}\` |`);
      L.push('');
      if (m.description) {
        L.push(`**Opis:** ${m.description}`);
        L.push('');
      }
      if (PLACEHOLDER_PRODUCERS.has(m.id)) {
        L.push('> ⚠️ To zbiorczy zastępnik, nie konkretny zakład. Docelowo rozbić na realnych producentów.');
        L.push('');
      }
      L.push('---');
      L.push('');
    });

  fs.writeFileSync(path.join(outDir, prodFile), L.join('\n'), 'utf8');
}

// ── README ──────────────────────────────────────────────────────────────────

const totalBrands = brands.length;
const totalFlagged = index.reduce((s, r) => s + r.flagged, 0);

const readme = [
  '# Weryfikacja datasetu',
  '',
  `**${totalBrands} marek** i **${manufacturers.length} producentów** do przejścia.`,
  'Każda pozycja ma wypisany komplet tego, co jest w bazie, listę brakujących pól',
  'i gotowe linki do Wikipedii, Ceneo i wyszukiwarki.',
  '',
  'Pliki są pogrupowane po koncernach — w obrębie grupy źródła zwykle się pokrywają,',
  'więc najszybciej idzie jedna grupa za jednym posiedzeniem. Odhaczaj `- [ ]`',
  'w miarę sprawdzania.',
  '',
  '⚠️ oznacza wartość, którą wstawiła migracja automatycznie i której **nikt jeszcze',
  'nie potwierdził** — tam zaczynaj, jeśli chcesz szybkiego zwrotu.',
  '',
  'Przegenerowanie po poprawkach (nadpisze pliki, więc najpierw scommituj odhaczenia):',
  '',
  '```bash',
  'node scratch/gen-weryfikacja.js',
  '```',
  '',
  '---',
  '',
  '| # | Grupa | Marek | Do potwierdzenia |',
  '| --- | --- | ---: | ---: |',
  ...index.map((r, i) => `| ${i + 1} | [${r.name}](${r.file}) | ${r.count} | ${r.flagged || '—'} |`),
  `| — | [Producenci OEM](${prodFile}) | ${manufacturers.length} | ${manufacturers.filter(m => m.country === 'Nieznany' || PLACEHOLDER_PRODUCERS.has(m.id)).length} |`,
  '',
  `**Razem: ${totalBrands} marek, z czego ${totalFlagged} z niepotwierdzoną wartością.**`,
  '',
  '---',
  '',
  '## Czego świadomie nie wypisuję',
  '',
  '`monetization` (linki zakupowe) brakuje u 162 z 175 marek, więc na każdej',
  'pozycji byłby tylko szumem. To decyzja biznesowa, nie brak danych — uzupełniaj',
  'wtedy, kiedy będziesz podpinać afiliację.',
  '',
].join('\n');

fs.writeFileSync(path.join(outDir, 'README.md'), readme, 'utf8');

// Stary, skrótowy arkusz przestaje mieć sens.
fs.rmSync(path.join(root, 'docs/weryfikacja-danych.md'), { force: true });

console.log(`docs/weryfikacja/ — ${index.length + 2} plików`);
index.forEach((r, i) => console.log(String(i + 1).padStart(3), r.name.padEnd(34), String(r.count).padStart(3), 'marek |', r.flagged, 'do potwierdzenia'));
console.log('    ', 'Producenci OEM'.padEnd(34), String(manufacturers.length).padStart(3), 'zakladow');
console.log('RAZEM', totalBrands, 'marek |', totalFlagged, 'do potwierdzenia');
