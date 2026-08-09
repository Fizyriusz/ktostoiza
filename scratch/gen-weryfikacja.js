/*
 * Generator listy kontrolnej do weryfikacji datasetu.
 *
 * Buduje docs/weryfikacja-danych.md wyłącznie z tego, co jest w dataset.json —
 * dzięki temu liczby się zgadzają i można go przegenerować po każdej partii
 * poprawek. Kolejność sekcji odpowiada temu, jak bardzo dany wpis jest
 * "zmyślony": najpierw jawne zastępniki, potem wartości wyprowadzone
 * automatycznie, na końcu kosmetyka.
 */

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const dataset = JSON.parse(fs.readFileSync(path.join(root, 'src/data/dataset.json'), 'utf8'));

const nodes = dataset.nodes;
const byId = new Map(nodes.map(n => [n.id, n]));
const brands = nodes.filter(n => n.type === 'brand');
const producers = nodes.filter(n => n.type === 'manufacturer');

const edgeLabel = new Map();
dataset.edges.forEach(e => edgeLabel.set(`${e.source}->${e.target}`, e.label));

const brandsOfProducer = new Map();
brands.forEach(b => (b.producedBy || []).forEach(p => {
  if (!brandsOfProducer.has(p)) brandsOfProducer.set(p, []);
  brandsOfProducer.get(p).push(b);
}));

const PLACEHOLDERS = ['m-oem-china', 'm-oem-various', 'm-oem-turkey', 'm-id-unknown'];
const UNKNOWN_COUNTRY = producers.filter(p => p.country === 'Nieznany').map(p => p.id);

const out = [];
const w = (s = '') => out.push(s);

// Sekcje zbieramy do spisu treści wraz z liczbą pozycji.
const toc = [];
function section(anchor, title, why, items) {
  toc.push({ anchor, title, count: items.length });
  w(`## ${title}`);
  w();
  w(`> ${why}`);
  w();
  w(`**Pozycji: ${items.length}**`);
  w();
  items.forEach(line => w(`- [ ] ${line}`));
  w();
}

w('# Weryfikacja datasetu');
w();
w('Lista kontrolna wygenerowana ze zbioru — nie pisana ręcznie, więc liczby się zgadzają.');
w('Przegenerujesz ją w każdej chwili:');
w();
w('```bash');
w('node scratch/gen-weryfikacja.js');
w('```');
w();
w('**Jak z tego korzystać:** idź sekcjami od góry. Sekcje 1–3 to rzeczy, które');
w('wstawiła migracja automatycznie albo zostawiła jawnie nieuzupełnione — tam');
w('ryzyko błędu jest największe. Sekcje 4–6 to kosmetyka, którą można robić');
w('kiedykolwiek. Odhaczaj `[x]` w miarę sprawdzania; plik jest w repo, więc');
w('historia zmian sama się zapisze.');
w();
w('Każda pozycja ma w nawiasie identyfikator węzła — po nim znajdziesz wpis');
w('w `src/data/dataset.json`.');
w();
w('---');
w();
w('<!--TOC-->');
w();
w('---');
w();

// ── 1. Zastępniki ───────────────────────────────────────────────────────────

const placeholderItems = [];
PLACEHOLDERS.forEach(pid => {
  const producer = byId.get(pid);
  if (!producer) return;
  const kids = brandsOfProducer.get(pid) || [];
  placeholderItems.push(
    `**${producer.name}** (\`${pid}\`) — ${kids.length} marek: ${kids.map(k => k.name).join(', ')}` +
    `\n      <br>Ustal realnego producenta dla każdej z nich albo potwierdź, że zostaje zbiorczo.`
  );
});
UNKNOWN_COUNTRY.forEach(pid => {
  const producer = byId.get(pid);
  const kids = brandsOfProducer.get(pid) || [];
  placeholderItems.push(
    `**${producer.name}** (\`${pid}\`) — kraj \`Nieznany\`, produkuje dla: ${kids.map(k => k.name).join(', ')}` +
    `\n      <br>Ustal kraj (teraz UI pokazuje globus zamiast flagi).`
  );
});

const bora = byId.get('b-bora');
const boraProducer = byId.get('m-bora-holding');
if (bora && boraProducer && bora.origin !== boraProducer.country) {
  placeholderItems.push(
    `**Sprzeczność BORA** — marka \`b-bora\` ma \`origin: "${bora.origin}"\`, producent ` +
    `\`m-bora-holding\` ma \`country: "${boraProducer.country}"\`` +
    `\n      <br>Jedno z dwóch jest błędne. Rozstrzygnij i wyrównaj.`
  );
}

section(
  'zastepniki',
  '1. Jawne zastępniki i niewiadome',
  'Wpisy, przy których migracja **wprost przyznała, że nie wie**. Najkrótsza lista i najwyższy zwrot — po jej domknięciu nic w bazie nie udaje wiedzy, której nie ma.',
  placeholderItems
);

// ── 2. Wygenerowani producenci ──────────────────────────────────────────────

const generated = producers
  .filter(p => !['m-midea', 'm-bsh-factory', 'm-amica-factory'].includes(p.id))
  .filter(p => !PLACEHOLDERS.includes(p.id) && p.country !== 'Nieznany')
  .sort((a, b) => (brandsOfProducer.get(b.id) || []).length - (brandsOfProducer.get(a.id) || []).length);

const chunk = (arr, size) =>
  arr.reduce((acc, x, i) => (i % size ? acc[acc.length - 1].push(x) : acc.push([x]), acc), []);

chunk(generated, 16).forEach((group, i) => {
  section(
    `producenci-${i + 1}`,
    `2.${i + 1} Wygenerowani producenci — partia ${i + 1}`,
    i === 0
      ? 'Nazwy odtworzone z identyfikatorów w `producedBy`, kraje uzupełnione tam, gdzie były pewne. Sprawdź, czy podmiot **naprawdę tak się nazywa** i czy faktycznie jest producentem, a nie tylko dystrybutorem albo właścicielem marki.'
      : 'Ciąg dalszy poprzedniej partii — ten sam rodzaj sprawdzenia.',
    group.map(p => {
      const kids = brandsOfProducer.get(p.id) || [];
      return `**${p.name}** (\`${p.id}\`) — ${p.country} — dla: ${kids.map(k => k.name).join(', ')}`;
    })
  );
});

// ── 3. Marki przypisane po pochodzeniu ──────────────────────────────────────

const byOrigin = brands.filter(b => edgeLabel.get(`${b.parentId}->${b.id}`) === 'Pochodzenie');
const grouped = new Map();
byOrigin.forEach(b => {
  if (!grouped.has(b.parentId)) grouped.set(b.parentId, []);
  grouped.get(b.parentId).push(b);
});

[...grouped.entries()]
  .sort((a, b) => b[1].length - a[1].length)
  .forEach(([parentId, list], i) => {
    const parent = byId.get(parentId);
    section(
      `pochodzenie-${i + 1}`,
      `3.${i + 1} Przypisane do „${parent.name}” po pochodzeniu`,
      'Te marki nie miały w bazie żadnego właściciela, więc migracja wrzuciła je do kubełka **wyłącznie na podstawie pola `origin`**. To zgadywanie: jeśli marka ma realnego właściciela, przepnij ją pod niego.',
      list.map(b => {
        const producedBy = (b.producedBy || []).map(p => byId.get(p)?.name || p).join(', ');
        return `**${b.name}** (\`${b.id}\`) — origin: ${b.origin}` +
          (producedBy ? ` — produkuje: ${producedBy}` : '');
      })
    );
  });

// ── 4. Marki własne sieci ───────────────────────────────────────────────────

const retail = brands.filter(b => edgeLabel.get(`${b.parentId}->${b.id}`) === 'Marka własna');
section(
  'marki-wlasne',
  '4. Marki własne sieci handlowych',
  'Przypisane do „Marki Marketowe (OEM)” z dużą pewnością, ale warto potwierdzić właściciela sieci.',
  retail.map(b => `**${b.name}** (\`${b.id}\`) — origin: ${b.origin}`)
);

// ── 5. Martwe logotypy ──────────────────────────────────────────────────────

const deadLogos = brands.filter(
  b => b.localLogo && !fs.existsSync(path.join(root, 'public', b.localLogo))
);
section(
  'logotypy',
  '5. Brakujące pliki logotypów',
  'Pole `localLogo` wskazuje na plik, którego nie ma w `public/`. Marka pokazuje inicjał zamiast logo — nic się nie psuje, ale wygląda ubogo. Albo dorzuć plik pod tę ścieżkę, albo usuń pole.',
  deadLogos.map(b => `**${b.name}** (\`${b.id}\`) — brak pliku \`${b.localLogo}\``)
);

// ── 6. Drobiazgi ────────────────────────────────────────────────────────────

const misc = [];
brands
  .filter(b => b.history && b.history.length < 40)
  .forEach(b => misc.push(`**${b.name}** (\`${b.id}\`) — opis ma tylko ${b.history.length} znaków: „${b.history}”`));
brands
  .filter(b => !b.product_categories || !b.product_categories.length)
  .forEach(b => misc.push(`**${b.name}** (\`${b.id}\`) — brak \`product_categories\` (nie wyjdzie w wyszukiwarce po kategorii)`));

const brakCount = brands.filter(b => (b.factories_pl || []).some(f => f.toLowerCase().includes('brak'))).length;
const noneCount = brands.filter(b => !b.factories_pl).length;
misc.push(
  `**Ujednolicić zapis braku fabryk** — ${brakCount} marek ma \`factories_pl\` z tekstem „Brak…”, ` +
  `a ${noneCount} nie ma pola w ogóle. Oba znaczą to samo; warto zostawić jedną konwencję.`
);

section(
  'drobiazgi',
  '6. Drobiazgi',
  'Nic z tego nic nie psuje. Do zrobienia, kiedy wyżej będzie już odhaczone.',
  misc
);

// ── Spis treści ─────────────────────────────────────────────────────────────

const total = toc.reduce((s, t) => s + t.count, 0);
const tocLines = [
  `**Łącznie do sprawdzenia: ${total} pozycji**`,
  '',
  '| Sekcja | Pozycji |',
  '| --- | ---: |',
  ...toc.map(t => `| [${t.title}](#${t.anchor}) | ${t.count} |`),
];

const md = out
  .join('\n')
  .replace('<!--TOC-->', tocLines.join('\n'))
  // Kotwice nagłówków muszą pasować do linków w tabeli.
  .replace(/^## (\d[\d.]*) (.+)$/gm, (line, num, title) => {
    const entry = toc.find(t => `${num} ${title}` === t.title);
    return entry ? `<a id="${entry.anchor}"></a>\n\n## ${num} ${title}` : line;
  });

fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
fs.writeFileSync(path.join(root, 'docs/weryfikacja-danych.md'), md, 'utf8');

console.log('docs/weryfikacja-danych.md zapisany');
toc.forEach(t => console.log(String(t.count).padStart(4), t.title));
console.log('---');
console.log(String(total).padStart(4), 'RAZEM');
