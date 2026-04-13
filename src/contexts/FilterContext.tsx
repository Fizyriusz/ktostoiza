'use client';

import { createContext, useContext } from 'react';

export type FilterType = 'all' | 'polski-kapital' | 'produkcja-pl' | 'premium' | 'budzetowe';

export type ViewMode = 'classic' | 'logocards';

interface FilterContextValue {
  activeFilter: FilterType;
  viewMode: ViewMode;
}

export const FilterContext = createContext<FilterContextValue>({ activeFilter: 'all', viewMode: 'classic' });
export const useFilter = () => useContext(FilterContext);

// ─── Filter matching logic ───────────────────────────────────────────────────

export function nodeMatchesFilter(data: Record<string, unknown>, filter: FilterType): boolean {
  if (filter === 'all') return true;

  const type = data.type as string;
  const origin = ((data.origin as string) || '').toLowerCase();
  const country = ((data.country as string) || '').toLowerCase();
  const segment = ((data.segment as string) || '').toLowerCase();
  const factories = (data.factories_pl as string[]) || [];

  if (type === 'holding') {
    // Holdings: match based on country
    switch (filter) {
      case 'polski-kapital': return country.includes('polska');
      case 'produkcja-pl':   return true;  // holdings always visible when filtering by production
      case 'premium':        return true;
      case 'budzetowe':      return true;
    }
  }

  // Brand filtering
  switch (filter) {
    case 'polski-kapital':
      return origin.includes('polska');
    case 'produkcja-pl':
      return factories.length > 0;
    case 'premium':
      return segment.includes('premium') || segment.includes('luksus');
    case 'budzetowe':
      return segment.includes('budżet');
    default:
      return true;
  }
}
