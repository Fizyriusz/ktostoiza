'use client';

import React from 'react';
import { Factory, MapPin } from 'lucide-react';
import { FilterType } from '@/contexts/FilterContext';
import { SHOW_OEM } from '@/config/features';

export const FILTERS: { key: FilterType; label: string }[] = [
  { key: 'all',              label: 'Wszystkie'        },
  { key: 'polski-kapital',   label: 'Polski Kapitał'   },
  { key: 'produkcja-pl',     label: 'Produkcja w PL'   },
  { key: 'premium',          label: 'Segment Premium'  },
  { key: 'budzetowe',        label: 'Segment Budżetowy'},
  { key: 'globalne',         label: 'Marki Globalne'   },
  { key: 'regionalne',       label: 'Marki Regionalne' },
  { key: 'polskie-globalne', label: 'Polskie Globalne' },
];

export interface FilterControlsProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  showOEM: boolean;
  onToggleOEM: () => void;
  onOpenPolandMap: () => void;
  showUnavailableInPL: boolean;
  onToggleUnavailable: () => void;
  /** Wywoływane po wyborze zamykającym — arkusz na mobilce chowa się sam. */
  onPicked?: () => void;
  /** 'sheet' układa przyciski w pełnej szerokości, 'bar' zawija je na środku. */
  layout?: 'bar' | 'sheet';
}

export default function FilterControls({
  activeFilter,
  onFilterChange,
  showOEM,
  onToggleOEM,
  onOpenPolandMap,
  showUnavailableInPL,
  onToggleUnavailable,
  onPicked,
  layout = 'bar',
}: FilterControlsProps) {
  const isSheet = layout === 'sheet';

  return (
    <>
      <div
        className={
          isSheet
            ? 'grid grid-cols-2 gap-2'
            : 'flex items-center justify-center gap-2 flex-wrap'
        }
      >
        {FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => {
              onFilterChange(f.key);
              onPicked?.();
            }}
            className={`
              px-4 py-1.5 rounded-md text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all
              ${isSheet ? 'py-3 text-center' : ''}
              ${activeFilter === f.key
                ? 'border-2 border-slate-800 bg-slate-800 text-white shadow-md'
                : 'border border-slate-300 bg-white/80 backdrop-blur-sm text-slate-600 hover:border-slate-500 hover:bg-white shadow-sm'
              }
            `}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div
        className={
          isSheet
            ? 'flex flex-col gap-2 border-t border-slate-200 pt-4 mt-4'
            : 'flex items-center justify-center gap-3 flex-wrap border-t border-slate-200/50 pt-3 w-full'
        }
      >
        {SHOW_OEM && (
        <button
          onClick={onToggleOEM}
          className={`
            px-4 py-1.5 rounded-md text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5
            ${isSheet ? 'py-3 justify-center' : ''}
            ${showOEM
              ? 'border-2 border-fuchsia-600 bg-fuchsia-600 text-white shadow-md'
              : 'border border-slate-300 bg-white/80 backdrop-blur-sm text-slate-600 hover:border-fuchsia-500 hover:bg-white shadow-sm'
            }
          `}
        >
          <Factory className="w-3 h-3" />
          Tryb OEM
        </button>
        )}

        <button
          onClick={() => {
            onOpenPolandMap();
            onPicked?.();
          }}
          className={`px-4 py-1.5 rounded-md text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 border border-slate-300 bg-white/80 backdrop-blur-sm text-slate-600 hover:border-red-500 hover:bg-white shadow-sm group ${isSheet ? 'py-3 justify-center' : ''}`}
        >
          <MapPin className="w-3 h-3 text-slate-400 group-hover:text-red-500 transition-colors" />
          Fabryki PL
        </button>

        <button
          onClick={onToggleUnavailable}
          className={`px-4 py-1.5 rounded-md text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 border ${isSheet ? 'py-3 justify-center' : 'ml-2'} ${showUnavailableInPL ? 'border-red-500 bg-red-50 text-red-600' : 'border-slate-300 bg-white/80 text-slate-600 hover:border-red-400'}`}
          title="Pokaż marki niedostępne w Polsce"
        >
          {showUnavailableInPL ? 'Ukryj niedostępne' : 'Pokaż niedostępne w PL'}
        </button>
      </div>
    </>
  );
}
