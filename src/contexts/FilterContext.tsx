'use client';

import { createContext, useContext } from 'react';
import dataset from '@/data/dataset.json';

export type FilterType = 'all' | 'polski-kapital' | 'produkcja-pl' | 'premium' | 'budzetowe' | 'globalne' | 'regionalne' | 'polskie-globalne';

export type ViewMode = 'classic' | 'logocards';

interface FilterContextValue {
  activeFilter: FilterType;
  viewMode: ViewMode;
  focusedOEMNodeId?: string | null;
  showUnavailableInPL?: boolean;
}

export const FilterContext = createContext<FilterContextValue>({ activeFilter: 'all', viewMode: 'classic', focusedOEMNodeId: null, showUnavailableInPL: false });
export const useFilter = () => useContext(FilterContext);

// ─── Filter matching logic ───────────────────────────────────────────────────

type Row = Record<string, unknown>;

// Marki pogrupowane po rodzicu i po producencie — koncern i fabryka są oceniane
// przez to, co pod nie podlega.
const brandsByParent = new Map<string, Row[]>();
const brandsByProducer = new Map<string, Row[]>();

function push(map: Map<string, Row[]>, key: string, value: Row) {
  const list = map.get(key);
  if (list) list.push(value);
  else map.set(key, [value]);
}

dataset.nodes.forEach(node => {
  if (node.type !== 'brand') return;
  const brand = node as unknown as Row;
  const parentId = brand.parentId as string | undefined;
  if (parentId) push(brandsByParent, parentId, brand);
  ((brand.producedBy as string[] | undefined) ?? []).forEach(producerId =>
    push(brandsByProducer, producerId, brand)
  );
});

// Wynik dla koncernu/fabryki zależy wyłącznie od datasetu, filtra i przełącznika
// dostępności — a funkcja leci przy każdym renderze każdego węzła, więc skanowanie
// dzieci liczymy raz.
const aggregateCache = new Map<string, boolean>();

function brandMatchesFilter(data: Row, filter: FilterType, showUnavailableInPL: boolean): boolean {
  const origin = ((data.origin as string) || '').toLowerCase();
  const segment = ((data.segment as string) || '').toLowerCase();
  const factories = (data.factories_pl as string[]) || [];
  const scope = data.scope as string;
  const availableInPL = data.availableInPL as boolean | undefined;

  // Global availability toggle (hide unavailable unless explicitly shown)
  if (!showUnavailableInPL && availableInPL === false) return false;

  if (filter === 'all') return true;

  switch (filter) {
    case 'polski-kapital': return origin.includes('polska');
    // Część marek ma factories_pl w rodzaju ["Brak fabryk w Polsce"], więc
    // samo sprawdzenie długości tablicy przepuszczało je przez filtr.
    case 'produkcja-pl': return factories.some(f => !f.toLowerCase().includes('brak'));
    case 'premium': return segment.includes('premium') || segment.includes('luksus');
    case 'budzetowe': return segment.includes('budżet');
    case 'globalne': return scope === 'global';
    case 'regionalne': return scope === 'regional';
    case 'polskie-globalne': return scope === 'global' && origin.includes('polska');
    default: return true;
  }
}

export function nodeMatchesFilter(data: Record<string, unknown>, filter: FilterType, focusedOEMNodeId?: string | null, showUnavailableInPL: boolean = false): boolean {
  if (focusedOEMNodeId) {
    if (data.id === focusedOEMNodeId) return true;
    if (data.type === 'brand') {
      const producedBy = data.producedBy as string[] | undefined;
      if (producedBy && producedBy.includes(focusedOEMNodeId)) return true;
    }
    return false;
  }

  const type = data.type as string;

  if (type === 'brand') return brandMatchesFilter(data, filter, showUnavailableInPL);

  if (filter === 'all') return true;

  // Koncerny i fabryki nie mają segmentu, zasięgu ani fabryk w PL, więc każdy
  // filtr poza "polski kapitał" przepuszczał je bezwarunkowo. Dopóki żaden
  // koncern nie był rozwinięty, na mapie widać było wyłącznie je — i zmiana
  // filtra nie robiła absolutnie nic. Teraz węzeł nadrzędny dziedziczy
  // trafienie po tym, co pod nim wisi.
  const id = data.id as string;
  const cacheKey = `${id}|${filter}|${showUnavailableInPL}`;
  const cached = aggregateCache.get(cacheKey);
  if (cached !== undefined) return cached;

  const country = ((data.country as string) || '').toLowerCase();
  const owned = brandsByParent.get(id) ?? [];
  const produced = brandsByProducer.get(id) ?? [];

  const result =
    (filter === 'polski-kapital' && country.includes('polska')) ||
    owned.some(b => brandMatchesFilter(b, filter, showUnavailableInPL)) ||
    produced.some(b => brandMatchesFilter(b, filter, showUnavailableInPL));

  aggregateCache.set(cacheKey, result);
  return result;
}
