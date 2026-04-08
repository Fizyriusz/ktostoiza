'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Shield } from 'lucide-react';
import { ReactFlowProvider } from '@xyflow/react';
import GraphMap from '@/components/map/GraphMap';
import { FilterType } from '@/contexts/FilterContext';
import FlowInternals from '@/components/map/FlowInternals';
import DetailsPanel from '@/components/map/DetailsPanel';
import { GraphNodeData } from '@/data/types';

const FILTERS: { key: FilterType; label: string }[] = [
  { key: 'all',            label: 'Wszystkie'       },
  { key: 'polski-kapital', label: 'Polski Kapitał'  },
  { key: 'produkcja-pl',   label: 'Produkcja w PL'  },
  { key: 'premium',        label: 'Segment Premium'  },
  { key: 'budzetowe',      label: 'Segment Budżetowy'},
];

export default function Home() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [selectedNode, setSelectedNode] = useState<GraphNodeData | null>(null);

  return (
    <ReactFlowProvider>
      <div className="relative w-full h-screen overflow-hidden flex flex-col bg-[#f8fafc]">

        {/* Header - Z-30 provides UI stacking context above the Map */}
        <header className="absolute top-0 left-0 right-0 z-30 pointer-events-none flex flex-col items-center pt-4">
          
          {/* Logo + Title (Top Left) */}
          <div className="absolute top-5 left-6 pointer-events-auto text-left transition-opacity">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-none bg-white/70 backdrop-blur-md px-3 py-1.5 -ml-3 rounded-xl inline-block shadow-sm sm:shadow-none sm:bg-transparent sm:backdrop-blur-none sm:p-0 sm:m-0">
              <span className="text-blue-600">Kto</span>
              <span className="text-slate-800">Stoi</span>
              <span className="text-blue-600">Za</span>
              <span className="text-slate-400">.pl</span>
            </h1>
            <p className="text-slate-400 text-[10px] sm:text-xs font-medium mt-1 uppercase tracking-widest hidden sm:block">
              Interaktywna Mapa Powiązań AGD
            </p>
          </div>

          {/* Center Column: Search Bar then Filters */}
          <div className="pointer-events-auto w-72 sm:w-80 relative z-50">
            <FlowInternals onNodeSelect={setSelectedNode} />
          </div>

          <div className="pointer-events-auto flex items-center gap-2 flex-wrap justify-center px-4 max-w-2xl mt-4 relative z-10 transition-all">
            {FILTERS.map(f => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                className={`
                  px-4 py-1.5 rounded-md text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all
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

          {/* Corner link */}
          <div className="absolute top-5 right-6 pointer-events-auto">
            <Link
              href="/polityka-prywatnosci"
              className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-blue-600 transition-colors"
            >
              <Shield className="w-3.5 h-3.5" />
              Polityka Prywatności
            </Link>
          </div>
        </header>

        {/* Map */}
        <main className="flex-1 w-full h-full z-10 relative">
          <GraphMap activeFilter={activeFilter} onNodeSelect={setSelectedNode} />
        </main>

        <DetailsPanel node={selectedNode} onClose={() => setSelectedNode(null)} />

        {/* Footer */}
        <footer className="absolute bottom-3 right-6 z-20 pointer-events-none">
          <p className="text-[10px] text-slate-400 font-medium">
            Aktualizacja: 2026-04-08
          </p>
        </footer>
      </div>
    </ReactFlowProvider>
  );
}
