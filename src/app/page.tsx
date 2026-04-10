'use client';

import { Suspense } from 'react';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Shield, Globe2, Info } from 'lucide-react';
import { ReactFlowProvider } from '@xyflow/react';
import { motion, AnimatePresence } from 'framer-motion';
import GraphMap from '@/components/map/GraphMap';
import { FilterType } from '@/contexts/FilterContext';
import FlowInternals from '@/components/map/FlowInternals';
import DetailsPanel from '@/components/map/DetailsPanel';
import { GraphNodeData } from '@/data/types';
import NetworkLogo from '@/components/ui/NetworkLogo';

const FILTERS: { key: FilterType; label: string }[] = [
  { key: 'all',            label: 'Wszystkie'       },
  { key: 'polski-kapital', label: 'Polski Kapitał'  },
  { key: 'produkcja-pl',   label: 'Produkcja w PL'  },
  { key: 'premium',        label: 'Segment Premium'  },
  { key: 'budzetowe',      label: 'Segment Budżetowy'},
];

export default function Home() {
  return (
    <Suspense fallback={<div className="bg-[#f8fafc] w-full h-screen" />}>
      <HomeContent />
    </Suspense>
  );
}

function HomeContent() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [selectedNodes, setSelectedNodes] = useState<GraphNodeData[]>([]);
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    const hasSeen = localStorage.getItem('ktostoiza_intro_seen');
    if (!hasSeen) {
      setShowIntro(true);
    }
  }, []);

  const closeIntro = () => {
    localStorage.setItem('ktostoiza_intro_seen', 'true');
    setShowIntro(false);
  };

  return (
    <ReactFlowProvider>
      <div className="relative w-full h-screen overflow-hidden flex flex-col bg-[#f8fafc]">

        {/* Header - Z-30 provides UI stacking context above the Map */}
        <header className="absolute top-0 left-0 right-0 z-30 pointer-events-none flex flex-col sm:flex-row sm:justify-center items-center pt-2 sm:pt-4 gap-3 sm:gap-0">
          
          {/* Logo + Title (Top Center on Mobile, Top Left on Desktop) */}
          <div className="sm:absolute sm:top-5 sm:left-6 pointer-events-auto text-left transition-opacity flex items-center justify-center sm:justify-start gap-2.5 sm:gap-3 w-full sm:w-auto px-4 sm:px-0">
            <div className="bg-white/90 sm:bg-white/70 backdrop-blur-md rounded-xl p-1.5 shadow-sm sm:shadow-none sm:bg-transparent sm:backdrop-blur-none sm:p-0">
              <NetworkLogo className="w-8 h-8 sm:w-9 sm:h-9" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight leading-none bg-white/90 sm:bg-white/70 backdrop-blur-md px-3 py-1.5 -ml-2 sm:-ml-3 rounded-xl inline-block shadow-sm sm:shadow-none sm:bg-transparent sm:backdrop-blur-none sm:p-0 sm:m-0">
                <span className="text-blue-600">Kto</span>
                <span className="text-slate-800">Stoi</span>
                <span className="text-blue-600">Za</span>
                <span className="text-slate-400">.pl</span>
              </h1>
              <p className="text-slate-400 text-[10px] sm:text-xs font-medium mt-0.5 sm:mt-1 uppercase tracking-widest hidden sm:block">
                Interaktywna Mapa Powiązań
              </p>
            </div>
          </div>

          {/* Center Column: Search Bar then Filters */}
          <div className="pointer-events-auto w-[90%] max-w-[320px] sm:w-80 relative z-50">
            <FlowInternals 
              onNodeSelect={(node) => setSelectedNodes([node])} 
            />
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
          <GraphMap 
            activeFilter={activeFilter} 
            onNodeSelect={(node, multi) => {
              setSelectedNodes(prev => {
                // Toggle if already selected
                if (prev.some(n => n.id === node.id)) {
                  return prev.filter(n => n.id !== node.id);
                }
                // If multi (shift pressed) and we have < 2, add it
                if (multi) {
                  return prev.length < 2 ? [...prev, node] : [prev[0], node];
                }
                return [node];
              });
            }} 
          />
        </main>

        <DetailsPanel nodes={selectedNodes} onClose={(idToClose) => {
          if (!idToClose) setSelectedNodes([]);
          else setSelectedNodes(prev => prev.filter(n => n.id !== idToClose));
        }} />

        {/* Intro Modal */}
        <AnimatePresence>
          {showIntro && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm pointer-events-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
              >
                <div className="bg-blue-600 px-6 py-8 text-center relative overflow-hidden">
                  <div className="absolute -top-4 -right-4 p-4 opacity-10">
                    <Globe2 className="w-32 h-32 text-white" />
                  </div>
                  <h2 className="text-3xl font-black text-white tracking-tight relative z-10 mb-2">
                    Witaj na KtoStoiZa.pl!
                  </h2>
                  <p className="text-blue-100 font-medium text-sm relative z-10">
                    Odkryj prawdziwe powiązania w świecie AGD
                  </p>
                </div>
                
                <div className="p-6 space-y-6 text-slate-600 text-[13px] font-medium bg-white">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 shrink-0 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                        <Info className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 mb-1 text-sm">O co tu chodzi?</h4>
                      <p>Sprawdź struktury. Przeciągaj główny koncern myszką na mapie, aby zobaczyć wszystkie podlegające mu marki.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-10 h-10 shrink-0 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shadow-sm">
                        <Globe2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 mb-1 text-sm">Kraj pochodzenia vs Produkcja</h4>
                      <p>Flagi widoczne na mapie określają <b>kolebkę</b> (państwo, z którego pochodzi projekt) oraz reprezentują historyczne <b>korzenie</b> marki. Czerwone znaczniki 📍 w opisie określają natomiast miasto z jej fabryką.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-10 h-10 shrink-0 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center shadow-sm">
                        <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 mb-1 text-sm">Przejęcia i Produkcja</h4>
                      <p>Kliknij w dowolną markę, aby rozwinąć panel informacyjny tłumaczący jakie kategorie produktów dany producent oferuje i do kogo należy.</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-5 bg-slate-50 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={closeIntro}
                    className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-md hover:shadow-lg active:scale-95"
                  >
                    Gotowe, pokaż mapę!
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

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
