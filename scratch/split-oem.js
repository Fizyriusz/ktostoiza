/*
 * Wyjmuje z datasetu wszystko, co dotyczy produkcji kontraktowej (OEM),
 * do osobnego pliku, którego nie importuje żaden moduł aplikacji.
 *
 * Powód jest prawny, nie techniczny: twierdzenia o tym, kto dla kogo
 * produkuje, opierały się na wiedzy branżowej bez możliwych do wskazania
 * źródeł. Samo ukrycie w UI by nie wystarczyło — dataset.json ląduje
 * w bundlu JS, więc dane byłyby do odczytania w narzędziach deweloperskich
 * i w plikach .rsc obok prerenderowanego HTML-a.
 *
 * Wyjmowane są:
 *   - węzły typu `manufacturer` (i ich podstrony /marka/...)
 *   - pole `producedBy` z marek
 *   - flaga `isOEM` z koncernów
 *
 *   node scratch/split-oem.js            # wyjmij
 *   node scratch/split-oem.js --restore  # wstaw z powrotem
 */

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const datasetFile = path.join(root, 'src/data/dataset.json');
const reservedFile = path.join(root, 'src/data/oem-reserved.json');

const restore = process.argv.includes('--restore');
const dataset = JSON.parse(fs.readFileSync(datasetFile, 'utf8'));

if (restore) {
  if (!fs.existsSync(reservedFile)) {
    console.error('Brak src/data/oem-reserved.json — nie ma czego przywracać.');
    process.exit(1);
  }
  const reserved = JSON.parse(fs.readFileSync(reservedFile, 'utf8'));

  const byId = new Map(dataset.nodes.map(n => [n.id, n]));
  Object.entries(reserved.producedBy).forEach(([id, producers]) => {
    const node = byId.get(id);
    if (node) node.producedBy = producers;
  });
  reserved.isOEM.forEach(id => {
    const node = byId.get(id);
    if (node) node.isOEM = true;
  });
  dataset.nodes.push(...reserved.manufacturers);

  dataset.lastUpdate = new Date().toISOString();
  fs.writeFileSync(datasetFile, JSON.stringify(dataset, null, 2), 'utf8');
  fs.rmSync(reservedFile);

  console.log('Przywrócono:');
  console.log('  fabryk           :', reserved.manufacturers.length);
  console.log('  marek z producedBy:', Object.keys(reserved.producedBy).length);
  console.log('  koncernów z isOEM :', reserved.isOEM.length);
  console.log('\nPamiętaj o ustawieniu SHOW_OEM = true w src/config/features.ts');
  process.exit(0);
}

const manufacturers = dataset.nodes.filter(n => n.type === 'manufacturer');
const producedBy = {};
const isOEM = [];

dataset.nodes.forEach(node => {
  if (Array.isArray(node.producedBy) && node.producedBy.length) {
    producedBy[node.id] = node.producedBy;
    delete node.producedBy;
  }
  if (node.isOEM) {
    isOEM.push(node.id);
    delete node.isOEM;
  }
});

dataset.nodes = dataset.nodes.filter(n => n.type !== 'manufacturer');

// Krawędzi do fabryk w danych nie ma (tryb OEM budował je w locie), ale
// sprawdzamy, żeby ewentualna przyszła zmiana nie przemknęła niezauważona.
const strayEdges = dataset.edges.filter(
  e => e.source.startsWith('m-') || e.target.startsWith('m-')
);
if (strayEdges.length) {
  console.warn('Uwaga: krawędzie wskazujące na fabryki zostają w danych:', strayEdges.map(e => e.id));
}

fs.writeFileSync(
  reservedFile,
  JSON.stringify({ manufacturers, producedBy, isOEM }, null, 2),
  'utf8'
);

dataset.lastUpdate = new Date().toISOString();
fs.writeFileSync(datasetFile, JSON.stringify(dataset, null, 2), 'utf8');

console.log('Wyjęto do src/data/oem-reserved.json:');
console.log('  fabryk            :', manufacturers.length);
console.log('  marek z producedBy:', Object.keys(producedBy).length);
console.log('  koncernów z isOEM :', isOEM.length);
console.log('\nW datasecie zostaje:', dataset.nodes.length, 'węzłów');
