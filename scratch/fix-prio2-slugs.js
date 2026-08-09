/*
 * Migracja danych — priorytet 2, punkt 6.
 *
 * 82 węzły nie miały `seo_slug`. `generateStaticParams` je pomijało, ale
 * `sitemap.ts` mapowało wszystkie węzły bez filtra, więc do Google trafiały
 * adresy /marka/undefined. Po prio 1 te marki są już widoczne na mapie i
 * klikalne, więc należy im się własna podstrona zamiast wycięcia z sitemapy.
 *
 * Slug budujemy z nazwy (bez polskich znaków i interpunkcji); przy kolizji
 * albo pustym wyniku spadamy na identyfikator węzła, który jest unikalny.
 */

const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, '..', 'src', 'data', 'dataset.json');
const dataset = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

const PL = { ą: 'a', ć: 'c', ę: 'e', ł: 'l', ń: 'n', ó: 'o', ś: 's', ź: 'z', ż: 'z' };

function slugify(input) {
  return input
    .toLowerCase()
    .replace(/[ąćęłńóśźż]/g, ch => PL[ch])
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // pozostałe znaki diakrytyczne
    .replace(/&/g, ' ')
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const taken = new Set(dataset.nodes.filter(n => n.seo_slug).map(n => n.seo_slug));
const added = [];

dataset.nodes.forEach(node => {
  if (node.seo_slug) return;

  const fromName = slugify(node.name);
  const fromId = node.id.replace(/^[bhm]-/, '');

  let slug = fromName;
  if (!slug || taken.has(slug)) slug = fromId;
  if (taken.has(slug)) {
    // Ostateczność — identyfikatory są unikalne, więc to się nie zapętli.
    let i = 2;
    while (taken.has(`${slug}-${i}`)) i++;
    slug = `${slug}-${i}`;
  }

  node.seo_slug = slug;
  taken.add(slug);
  added.push(`${node.id.padEnd(24)} -> ${slug}`);
});

dataset.lastUpdate = new Date().toISOString();
fs.writeFileSync(dataFile, JSON.stringify(dataset, null, 2), 'utf8');

console.log(added.join('\n'));
console.log('\n─────────────────────────────────');
console.log('slugów dodanych:', added.length);
console.log('węzłów bez seo_slug:', dataset.nodes.filter(n => !n.seo_slug).length);
