const fs = require('fs');
const dataFile = 'd:/CODING/ktostoiza/src/data/dataset.json';
const dataset = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

// 1. Add new holdings
const newHoldings = [
  { id: 'h-it-ind', type: 'holding', name: 'Włoskie Marki Niezależne', country: 'Włochy', description: 'Firmy z włoskim rodowodem, posiadające własne fabryki lub bazujące na imporcie.', seo_slug: 'wloskie-niezalezne' },
  { id: 'h-de-ind', type: 'holding', name: 'Niemieckie Marki Niezależne', country: 'Niemcy', description: 'Niemieckie, austriackie oraz szwajcarskie marki niezależne.', seo_slug: 'niemieckie-niezalezne' },
  { id: 'h-jp-ind', type: 'holding', name: 'Japońskie Marki Niezależne', country: 'Japonia', description: 'Rozwiązania i technologie z Japonii.', seo_slug: 'japonskie-niezalezne' },
  { id: 'h-cn-ind', type: 'holding', name: 'Chińskie Marki Niezależne', country: 'Chiny', description: 'Rosnący w siłę niezależni producenci z Chin.', seo_slug: 'chinskie-niezalezne' },
  { id: 'h-other-ind', type: 'holding', name: 'Pozostałe Marki Niezależne', country: 'Różne', description: 'Marki niezależne z innych krajów Europy i Świata.', seo_slug: 'pozostale-niezalezne' }
];

const holdingsMap = {
  'Smeg': 'h-it-ind',
  'Bertazzoni': 'h-it-ind',
  'Elica': 'h-it-ind',
  'Falmec': 'h-it-ind',
  'Faber': 'h-it-ind',
  'Lofra': 'h-it-ind',
  'Fulgor Milano': 'h-it-ind',

  'Miele': 'h-de-ind',
  'Liebherr': 'h-de-ind',
  'Klarstein': 'h-de-ind',
  'Lord': 'h-de-ind',
  'Blaupunkt': 'h-de-ind',
  'Franke': 'h-de-ind', // Szwajcaria -> dorzucamy do niemieckojęzycznych lub other? Let's put in de-ind as it's DACH.

  'Hitachi': 'h-jp-ind',
  'Mitsubishi Electric': 'h-jp-ind',
  'Panasonic': 'h-jp-ind',

  'TCL': 'h-cn-ind',
  'CHiQ': 'h-cn-ind',

  'Concept': 'h-other-ind', // Czechy
  'Teka': 'h-other-ind', // Hiszpania/Niemcy
  'Philco': 'h-other-ind' // USA
};

dataset.nodes.forEach(n => {
  if (n.type === 'brand') {
    if (holdingsMap[n.name]) {
      n.parentId = holdingsMap[n.name];
    }
  }
});

// Insert new holdings right before the first brand that uses them to keep array logic roughly organized, or just at the end of holdings.
// Actually, let's insert them right before h-market
const hMarketIdx = dataset.nodes.findIndex(n => n.id === 'h-market');
dataset.nodes.splice(hMarketIdx, 0, ...newHoldings);


// 2. Add edges for the new parent relationships + ravanson!
dataset.nodes.forEach(n => {
  if (n.type === 'brand' && n.parentId) {
    // Check if edge exists
    const edgeExists = dataset.edges.some(e => e.source === n.parentId && e.target === n.id);
    if (!edgeExists) {
      // Add edge!
      const shortParent = n.parentId.replace('h-', '').substring(0, 3);
      dataset.edges.push({
        id: `e-${shortParent}-${n.id.replace('b-', '')}`,
        source: n.parentId,
        target: n.id,
        label: 'Niezależna'
      });
    }
  }
});

// 3. One polish brand might be missing filter: "niektóre marki są źle filtrowane - nie wszystkie polskie niezrzeszone są wrzucone do tego nodea dużego"
// Wait, is there any brand we missed?
// In the dataset: Ravanson, Kernau, MPM, Solgaz, Ciarko, Akpo, Globalo, VDB, Polar? Polar is Whirlpool. Amica, Hansa -> Amica.
// Ravanson had parentId: "h-pl-ind" but no edge, so it wasn't connected! Now the code above added an edge for Ravanson.
// So this is fixed.

fs.writeFileSync(dataFile, JSON.stringify(dataset, null, 2), 'utf8');
console.log('Dataset updated successfully!');
