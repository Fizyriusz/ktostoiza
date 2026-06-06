'use client';

import { createContext, useContext } from 'react';

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
  const origin = ((data.origin as string) || '').toLowerCase();
  const country = ((data.country as string) || '').toLowerCase();
  const segment = ((data.segment as string) || '').toLowerCase();
  const factories = (data.factories_pl as string[]) || [];
  const scope = data.scope as string;
  const availableInPL = data.availableInPL as boolean | undefined;

  // Global availability toggle (hide unavailable unless explicitly shown)
  if (type === 'brand' && !showUnavailableInPL && availableInPL === false) {
    return false;
  }

  if (filter === 'all') return true;

  if (type === 'holding') {
    switch (filter) {
      case 'polski-kapital': return country.includes('polska');
      case 'produkcja-pl':   return true;
      case 'premium':        return true;
      case 'budzetowe':      return true;
      case 'globalne':       return true;
      case 'regionalne':     return true;
      case 'polskie-globalne': return true;
    }
  }

  switch (filter) {
    case 'polski-kapital': return origin.includes('polska');
    case 'produkcja-pl': return factories.length > 0;
    case 'premium': return segment.includes('premium') || segment.includes('luksus');
    case 'budzetowe': return segment.includes('budżet');
    case 'globalne': return scope === 'global';
    case 'regionalne': return scope === 'regional';
    case 'polskie-globalne': return scope === 'global' && origin.includes('polska');
    default: return true;
  }
}
