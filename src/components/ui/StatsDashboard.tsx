import React, { useMemo } from 'react';
import { FilterType } from '@/contexts/FilterContext';
import dataset from '@/data/dataset.json';
import { Briefcase, Building2, Factory, Globe2 } from 'lucide-react';

interface StatsDashboardProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export default function StatsDashboard({ activeFilter, onFilterChange }: StatsDashboardProps) {
  const stats = useMemo(() => {
    let brandsCount = 0;
    let holdingsCount = 0;
    let factoriesCount = 0;
    let polishBrandsCount = 0;

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
      } else if (node.type === 'holding') {
        holdingsCount++;
      }
    });

    return {
      brandsCount,
      holdingsCount,
      factoriesCount,
      polishBrandsCount
    };
  }, []);

  return (
    <div className="absolute left-6 top-32 z-40 hidden xl:flex flex-col gap-2 bg-white/70 backdrop-blur-md rounded-2xl p-4 border border-white shadow-[0_8px_32px_rgba(0,0,0,0.06)] pointer-events-auto">
      <h3 className="text-[10px] font-black tracking-widest text-slate-400 uppercase mb-2 ml-1">
        Statystyki Bazy
      </h3>

      {/* Liczba Marek -> all */}
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

      {/* Koncerny -> Reset (all) */}
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

      {/* Fabryki w PL -> produkcja-pl */}
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

      {/* Polskie Marki -> polski-kapital */}
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
  );
}
