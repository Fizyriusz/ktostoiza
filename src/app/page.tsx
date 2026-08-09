'use client';

import { Suspense } from 'react';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Shield, Globe2, Info, HelpCircle, SlidersHorizontal, X } from 'lucide-react';
import { ReactFlowProvider } from '@xyflow/react';
import { motion, AnimatePresence } from 'framer-motion';
import GraphMap from '@/components/map/GraphMap';
import { FilterType, ViewMode, FilterContext } from '@/contexts/FilterContext';
import FlowInternals from '@/components/map/FlowInternals';
import DetailsPanel from '@/components/map/DetailsPanel';
import { GraphNodeData } from '@/data/types';
import NetworkLogo from '@/components/ui/NetworkLogo';
import StatsDashboard from '@/components/ui/StatsDashboard';
import PolandMap from '@/components/ui/PolandMap';
import FilterControls, { FILTERS } from '@/components/ui/FilterControls';
import dataset from '@/data/dataset.json';

export default function Home() {
  return (
    <Suspense fallback={<div className="bg-[#f8fafc] w-full h-[100svh]" />}>
      <HomeContent />
    </Suspense>
  );
}

export function HomeContent() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [showOEM, setShowOEM] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('classic');
  const [selectedNodes, setSelectedNodes] = useState<GraphNodeData[]>([]);
  const [compareQueue, setCompareQueue] = useState<GraphNodeData | null>(null);
  const [showIntro, setShowIntro] = useState(false);
  const [isTourActive, setIsTourActive] = useState(false);
  const [showPolandMap, setShowPolandMap] = useState(false);
  const [showUnavailableInPL, setShowUnavailableInPL] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Mobilny przycisk musi pokazywać stan bez otwierania arkusza.
  const activeFiltersCount =
    (activeFilter !== 'all' ? 1 : 0) + (showOEM ? 1 : 0) + (showUnavailableInPL ? 1 : 0);
  const activeFilterLabel =
    activeFilter === 'all'
      ? 'Filtry'
      : FILTERS.find(f => f.key === activeFilter)?.label ?? 'Filtry';

  let focusedOEMNodeId: string | null = null;
  if (selectedNodes.length === 1) {
    const n = selectedNodes[0];
    if (n.type === 'manufacturer') {
      focusedOEMNodeId = n.id;
    } else if (n.type === 'holding' && showOEM && 'isOEM' in n && n.isOEM) {
      focusedOEMNodeId = n.id;
    }
  }

  useEffect(() => {
    const hasSeen = localStorage.getItem('ktostoiza_intro_seen');
    if (!hasSeen) {
      setShowIntro(true);
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTourActive) {
      const holdingChildrenCount = new Map<string, number>();
      dataset.nodes.forEach(node => {
        if (node.type === 'brand' && 'parentId' in node && node.parentId) {
          holdingChildrenCount.set(node.parentId, (holdingChildrenCount.get(node.parentId) || 0) + 1);
        }
      });
      const holdings = dataset.nodes.filter(n => n.type === 'holding');
      const sortedHoldings = holdings.sort((a, b) => (holdingChildrenCount.get(b.id) || 0) - (holdingChildrenCount.get(a.id) || 0));
      
      let index = 0;
      setSelectedNodes([sortedHoldings[index] as any]);

      interval = setInterval(() => {
        index = (index + 1) % sortedHoldings.length;
        setSelectedNodes([sortedHoldings[index] as any]);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isTourActive]);

  const closeIntro = () => {
    localStorage.setItem('ktostoiza_intro_seen', 'true');
    setShowIntro(false);
  };

  return (
    <FilterContext.Provider value={{ activeFilter, viewMode, focusedOEMNodeId, showUnavailableInPL }}>
      <ReactFlowProvider>
        {/* 100svh, nie 100vh — na mobilce vh liczy się razem z paskiem adresu,
            więc dolny pasek UI lądował pod chrome przeglądarki i trzeba było
            wymuszać pełny ekran gestem, żeby go zobaczyć. */}
        <div className="relative w-full h-[100svh] overflow-hidden flex flex-col bg-[#f8fafc]">

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

          {/* Desktop: filtry rozłożone w nagłówku. Na mobilce ta sama siatka
              zawijała się w siedem rzędów i zasłaniała pół mapy — tam siedzi
              teraz pod przyciskiem poniżej. */}
          <div className="hidden sm:flex pointer-events-auto flex-col items-center gap-3 px-4 max-w-2xl mt-4 relative z-10 transition-all">
            <FilterControls
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
              showOEM={showOEM}
              onToggleOEM={() => setShowOEM(!showOEM)}
              onOpenPolandMap={() => setShowPolandMap(true)}
              showUnavailableInPL={showUnavailableInPL}
              onToggleUnavailable={() => setShowUnavailableInPL(!showUnavailableInPL)}
            />
          </div>

          {/* Mobile: jeden przycisk otwierający arkusz z filtrami */}
          <div className="sm:hidden pointer-events-auto mt-2 px-4 w-full flex justify-center">
            <button
              onClick={() => setShowFilters(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-md backdrop-blur-md transition-all border ${
                activeFiltersCount > 0
                  ? 'bg-slate-800 border-slate-800 text-white'
                  : 'bg-white/90 border-slate-300 text-slate-600'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              {activeFilterLabel}
              {activeFiltersCount > 0 && (
                <span className="ml-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-white text-slate-800 text-[10px] font-black flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>

          {/* Corner link */}
          <div className="absolute top-5 right-6 pointer-events-auto hidden sm:flex items-center gap-4">
            <Link
              href="/news"
              className="group flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700 rounded-lg shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
            >
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </div>
              <span className="text-[11px] font-black uppercase tracking-widest text-white">Content Hub</span>
            </Link>
            <button
              onClick={() => setShowIntro(true)}
              className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-blue-600 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              Jak to działa?
            </button>
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
        {/* Bez własnego z-index: `relative z-10` tworzyło kontekst nakładania,
            w którym panel statystyk (z-40) nie mógł przebić nagłówka (z-30) —
            filtry rysowały się na sidebarze. */}
        <main className="flex-1 w-full h-full relative">
          <StatsDashboard 
            activeFilter={activeFilter} 
            onFilterChange={setActiveFilter} 
            onQuickJump={(node) => setSelectedNodes([node])}
            onTourToggle={() => setIsTourActive(!isTourActive)}
            isTourActive={isTourActive}
          />
          <GraphMap 
            activeFilter={activeFilter} 
            showOEM={showOEM}
            selectedNodes={selectedNodes}
            onNodeSelect={(node, multi) => {
              setSelectedNodes(prev => {
                if (compareQueue) {
                  if (compareQueue.id === node.id) {
                    setCompareQueue(null);
                    return [node];
                  }
                  setCompareQueue(null);
                  return [compareQueue, node];
                }

                if (prev.some(n => n.id === node.id)) {
                  return prev.filter(n => n.id !== node.id);
                }
                if (multi) {
                  return prev.length < 2 ? [...prev, node] : [prev[0], node];
                }
                return [node];
              });
            }} 
          />
        </main>
        
        <AnimatePresence>
          {compareQueue && (
            <motion.div
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              className="absolute top-6 left-1/2 -translate-x-1/2 z-[100] pointer-events-auto flex items-center gap-4 bg-slate-900 border border-slate-700 text-white rounded-full px-5 py-3 shadow-[0_10px_40px_rgba(0,0,0,0.2)]"
            >
              <span className="text-sm font-semibold tracking-wide">
                Wybierz drugą markę by porównać z <b className="text-blue-400">{compareQueue.name}</b>...
              </span>
              <button 
                onClick={() => setCompareQueue(null)}
                className="text-[10px] uppercase font-bold tracking-widest text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-full transition-all"
              >
                Anuluj
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <DetailsPanel 
          nodes={selectedNodes} 
          onClose={(idToClose) => {
            if (!idToClose) setSelectedNodes([]);
            else setSelectedNodes(prev => prev.filter(n => n.id !== idToClose));
          }}
          onRequestCompare={(node) => {
            setCompareQueue(node);
            setSelectedNodes([]);
          }}
        />

        <PolandMap isOpen={showPolandMap} onClose={() => setShowPolandMap(false)} />

        {/* Arkusz z filtrami — tylko mobilka. Kontener jest motion.div, bo
            animację wyjścia dostaje wyłącznie bezpośrednie dziecko
            AnimatePresence — inaczej arkusz znikałby skokowo. */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="sm:hidden fixed inset-0 z-[110] flex items-end pointer-events-auto"
            >
              <div
                className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
                onClick={() => setShowFilters(false)}
              />
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 260 }}
                className="relative w-full bg-white rounded-t-3xl shadow-2xl max-h-[75svh] flex flex-col"
              >
                <div className="flex items-center justify-between px-5 pt-5 pb-3 shrink-0">
                  <h2 className="text-sm font-black uppercase tracking-widest text-slate-800">
                    Filtry
                  </h2>
                  <div className="flex items-center gap-2">
                    {activeFiltersCount > 0 && (
                      <button
                        onClick={() => {
                          setActiveFilter('all');
                          setShowOEM(false);
                          setShowUnavailableInPL(false);
                        }}
                        className="text-[11px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-700 transition-colors"
                      >
                        Wyczyść
                      </button>
                    )}
                    <button
                      onClick={() => setShowFilters(false)}
                      className="p-2 -mr-2 bg-slate-50 rounded-full hover:bg-slate-200 transition-colors text-slate-500"
                      aria-label="Zamknij filtry"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="px-5 pb-8 overflow-y-auto">
                  <FilterControls
                    layout="sheet"
                    activeFilter={activeFilter}
                    onFilterChange={setActiveFilter}
                    showOEM={showOEM}
                    onToggleOEM={() => setShowOEM(!showOEM)}
                    onOpenPolandMap={() => setShowPolandMap(true)}
                    showUnavailableInPL={showUnavailableInPL}
                    onToggleUnavailable={() => setShowUnavailableInPL(!showUnavailableInPL)}
                    onPicked={() => setShowFilters(false)}
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

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
                      <h4 className="font-bold text-slate-800 mb-1 text-sm">Przejęcia i Porównania</h4>
                      <p>Kliknij w dowolną markę, aby rozwinąć panel informacyjny tłumaczący do kogo należy. <b>Wskazówka:</b> Na komputerze przytrzymaj <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded-md text-[10px] font-mono text-slate-600">Shift</kbd> by zaznaczyć dwie marki i porównać je do siebie łeb w łeb.</p>
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
        <footer className="absolute bottom-3 right-5 sm:right-6 z-20 pointer-events-none flex flex-col sm:flex-row items-end sm:items-center gap-1.5 sm:gap-4">
          <div className="pointer-events-auto sm:hidden flex items-center gap-4">
            <button
              onClick={() => setShowIntro(true)}
              className="flex items-center gap-1.5 text-[10px] sm:text-xs font-medium text-slate-400 hover:text-blue-600 transition-colors"
            >
              <HelpCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              Jak to działa?
            </button>
            <Link
              href="/polityka-prywatnosci"
              className="flex items-center gap-1.5 text-[10px] sm:text-xs font-medium text-slate-400 hover:text-blue-600 transition-colors"
            >
              <Shield className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              Polityka Prywatności
            </Link>
          </div>
          <p className="text-[10px] text-slate-400 font-medium text-right">
            Aktualizacja: 2026-04-08
          </p>
        </footer>
      </div>
    </ReactFlowProvider>
    </FilterContext.Provider>
  );
}
