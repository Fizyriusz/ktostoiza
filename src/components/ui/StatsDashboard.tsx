import React, { useMemo } from 'react';
import { FilterType } from '@/contexts/FilterContext';
import dataset from '@/data/dataset.json';
import { Briefcase, Building2, Factory, Globe2, Link as LinkIcon } from 'lucide-react';
import { GraphNodeData } from '@/data/types';

interface StatsDashboardProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  onQuickJump?: (node: GraphNodeData) => void;
}

export default function StatsDashboard({ activeFilter, onFilterChange, onQuickJump }: StatsDashboardProps) {
  const { stats, topHoldings } = useMemo(() => {
    let brandsCount = 0;
    let holdingsCount = 0;
    let factoriesCount = 0;
    let polishBrandsCount = 0;

    const holdingChildrenCount = new Map<string, number>();

    dataset.nodes.forEach(node => {
      if (node.type === 'brand') {
        brandsCount++;
        const origin = (node as any).origin;
        if (origin && origin.includes('Polska')) {
          polishBrandsCount++;
        }
        const factories = (node as any).factories_pl as string[];
        if (factories && Array.isArray(factories)) {
          const valid = factories.filter(f => !f.toLowerCase().includes('brak'));
          factoriesCount += valid.length;
        }

        if ('parentId' in node && node.parentId) {
          holdingChildrenCount.set(node.parentId, (holdingChildrenCount.get(node.parentId) || 0) + 1);
        }
      } else if (node.type === 'holding') {
        holdingsCount++;
      }
    });

    const holdings = dataset.nodes.filter(n => n.type === 'holding');
    const sortedHoldings = holdings.sort((a, b) => {
      const aCount = holdingChildrenCount.get(a.id) || 0;
      const bCount = holdingChildrenCount.get(b.id) || 0;
      return bCount - aCount;
    });

    return {
      stats: {
        brandsCount,
        holdingsCount,
        factoriesCount,
        polishBrandsCount
      },
      topHoldings: sortedHoldings.slice(0, 6)
    };
  }, []);

  return (
    <div className="absolute left-6 top-32 z-40 hidden xl:flex flex-col gap-4 pointer-events-auto w-64">
      {/* Statystyki Bazy */}
      <div className="flex flex-col gap-2 bg-white/70 backdrop-blur-md rounded-2xl p-4 border border-white shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
        <h3 className="text-[10px] font-black tracking-widest text-slate-400 uppercase mb-1 ml-1">
          Statystyki Bazy
        </h3>

        <button 
          onClick={() => onFilterChange('all')}
          className={`flex items-center gap-3 p-2 rounded-xl transition-all text-left ${activeFilter === 'all' ? 'bg-white shadow-sm ring-1 ring-slate-200' : 'hover:bg-white/60'}`}
        >
           <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 shadow-sm border border-blue-100/50">
             <Briefcase className="w-4 h-4" />
           </div>
           <div>
             <p className="text-xl font-black text-slate-800 leading-none">{stats.brandsCount}</p>
             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mt-1">Liczba Marek</p>
           </div>
        </button>

        <button 
          onClick={() => onFilterChange('all')}
          className="flex items-center gap-3 p-2 rounded-xl transition-all text-left hover:bg-white/60"
        >
           <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 shadow-sm border border-indigo-100/50">
             <Building2 className="w-4 h-4" />
           </div>
           <div>
             <p className="text-xl font-black text-slate-800 leading-none">{stats.holdingsCount}</p>
             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mt-1">Koncerny</p>
           </div>
        </button>

        <button 
          onClick={() => onFilterChange('produkcja-pl')}
          className={`flex items-center gap-3 p-2 rounded-xl transition-all text-left ${activeFilter === 'produkcja-pl' ? 'bg-white shadow-sm ring-1 ring-slate-200' : 'hover:bg-white/60'}`}
        >
           <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 shadow-sm border border-emerald-100/50">
             <Factory className="w-4 h-4" />
           </div>
           <div>
             <p className="text-xl font-black text-slate-800 leading-none">{stats.factoriesCount}</p>
             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mt-1">Fabryki Lokalnie</p>
           </div>
        </button>

        <button 
          onClick={() => onFilterChange('polski-kapital')}
          className={`flex items-center gap-3 p-2 rounded-xl transition-all text-left group ${activeFilter === 'polski-kapital' ? 'bg-white shadow-sm ring-1 ring-slate-200' : 'hover:bg-white/60'} cursor-pointer`}
        >
           <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 shadow-sm border border-rose-100/50">
             <Globe2 className="w-4 h-4" />
           </div>
           <div>
             <p className="text-xl font-black text-slate-800 leading-none">
               {stats.polishBrandsCount}
             </p>
             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mt-1.5">Polskie Marki</p>
           </div>
        </button>
      </div>

      {/* Szybki Skok */}
      <div className="flex flex-col gap-1.5 bg-white/70 backdrop-blur-md rounded-2xl p-4 border border-white shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
        <h3 className="text-[10px] font-black tracking-widest text-slate-400 uppercase mb-1 ml-1 flex items-center gap-1.5">
          <LinkIcon className="w-3 h-3" /> Szybki Skok
        </h3>
        {topHoldings.map(holding => (
          <button
            key={holding.id}
            onClick={() => onQuickJump?.(holding as any)}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-white transition-colors text-left group border border-transparent hover:border-slate-200 hover:shadow-sm"
          >
            <span className="text-xs font-bold text-slate-700 group-hover:text-blue-600 transition-colors truncate pr-2">
              {holding.name}
            </span>
            <span className="text-[9px] font-black uppercase text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors shrink-0">
              Skocz
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
