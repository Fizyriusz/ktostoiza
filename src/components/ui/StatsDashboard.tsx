import React, { useMemo, useState } from 'react';
import { FilterType } from '@/contexts/FilterContext';
import dataset from '@/data/dataset.json';
import { Briefcase, Building2, Factory, Globe2, Link as LinkIcon, Menu, X, Plane, Lightbulb, Newspaper, BellRing } from 'lucide-react';
import { GraphNodeData } from '@/data/types';

interface StatsDashboardProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  onQuickJump?: (node: GraphNodeData) => void;
  onTourToggle?: () => void;
  isTourActive?: boolean;
}

export default function StatsDashboard({ activeFilter, onFilterChange, onQuickJump, onTourToggle, isTourActive }: StatsDashboardProps) {
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

  const randomTrivia = useMemo(() => {
    const brandsWithHistory = dataset.nodes.filter(n => n.type === 'brand' && (n as any).history);
    if (brandsWithHistory.length === 0) return null;
    const randomBrand = brandsWithHistory[Math.floor(Math.random() * brandsWithHistory.length)] as any;
    return { name: randomBrand.name, text: randomBrand.history };
  }, []);

  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const [recentNews, setRecentNews] = useState<any[]>([]);

  React.useEffect(() => {
    fetch('/api/news')
      .then(res => res.json())
      .then(data => setRecentNews(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        onClick={() => setIsOpenMobile(!isOpenMobile)}
        className="xl:hidden absolute left-4 top-24 z-50 p-2.5 bg-white/90 backdrop-blur-md rounded-xl border border-slate-200 shadow-sm text-slate-600 pointer-events-auto hover:bg-white transition-all"
      >
        {isOpenMobile ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      <div className={`absolute left-4 top-36 xl:left-6 xl:top-32 z-40 flex flex-col gap-4 pointer-events-auto w-56 xl:w-64 transition-all duration-300 max-h-[calc(100vh-140px)] overflow-y-auto pb-4 pr-2 ${isOpenMobile ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none xl:opacity-100 xl:translate-y-0 xl:pointer-events-auto'}`} style={{ scrollbarWidth: 'thin' }}>
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

      {/* Szybki Skok & Tournee */}
      <div className="flex flex-col gap-1.5 bg-white/70 backdrop-blur-md rounded-2xl p-4 border border-white shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
        <h3 className="text-[10px] font-black tracking-widest text-slate-400 uppercase mb-1 ml-1 flex items-center gap-1.5">
          <LinkIcon className="w-3 h-3" /> Szybki Skok
        </h3>
        <p className="text-[9px] text-slate-400 font-medium mb-1 ml-1 leading-tight">
          Posortowane od największej ilości marek
        </p>

        <button
          onClick={onTourToggle}
          className={`flex items-center justify-center gap-2 w-full p-2.5 mb-2 rounded-xl transition-all font-bold text-xs border ${isTourActive ? 'bg-fuchsia-600 text-white border-fuchsia-600 shadow-md animate-pulse' : 'bg-white text-fuchsia-600 border-fuchsia-200 hover:bg-fuchsia-50'}`}
        >
          <Plane className="w-4 h-4" />
          {isTourActive ? 'Zatrzymaj Tournée' : 'Rozpocznij Tournée'}
        </button>

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

      {/* Ciekawostka */}
      {randomTrivia && (
        <div className="flex flex-col gap-2 bg-gradient-to-br from-blue-50 to-indigo-50/50 backdrop-blur-md rounded-2xl p-4 border border-blue-100/50 shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
           <h3 className="text-[10px] font-black tracking-widest text-blue-500 uppercase flex items-center gap-1.5 mb-1">
             <Lightbulb className="w-3 h-3" /> Ciekawostka
           </h3>
           <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
             <strong className="text-slate-800">{randomTrivia.name}</strong>: {randomTrivia.text}
           </p>
        </div>
      )}

      {/* News Ticker */}
      {recentNews.length > 0 && (
        <div className="flex flex-col gap-2 bg-white/70 backdrop-blur-md rounded-2xl p-4 border border-rose-100/50 shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
           <h3 className="text-[10px] font-black tracking-widest text-rose-500 uppercase flex items-center gap-1.5 mb-1">
             <Newspaper className="w-3 h-3" /> Newsroom
           </h3>
           <div className="flex flex-col gap-2.5">
             {recentNews.map(news => (
               <a key={news.slug} href={`/news`} className="group flex flex-col gap-0.5">
                 <span className="text-[9px] font-bold text-slate-400">{news.date}</span>
                 <p className="text-[11px] font-semibold text-slate-700 leading-tight group-hover:text-rose-600 transition-colors line-clamp-2">
                   {news.title}
                 </p>
               </a>
             ))}
           </div>
        </div>
      )}

      {/* Newsletter */}
      <button className="flex items-center justify-center gap-2 w-full p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white transition-all font-bold text-xs shadow-lg shadow-slate-800/20 mt-2">
        <BellRing className="w-4 h-4 text-rose-400" />
        Zapisz się na Alerty
      </button>
      </div>
    </>
  );
}
