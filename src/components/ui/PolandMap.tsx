import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Building2 } from 'lucide-react';
import dataset from '@/data/dataset.json';

interface PolandMapProps {
  isOpen: boolean;
  onClose: () => void;
}

const CITY_COORDS = [
  { name: 'Wrocław', x: '28%', y: '70%' },
  { name: 'Łódź', x: '52%', y: '55%' },
  { name: 'Radomsko', x: '55%', y: '63%' },
  { name: 'Wronki', x: '35%', y: '38%' },
  { name: 'Pruszków', x: '62%', y: '46%' },
  { name: 'Warszawa', x: '65%', y: '45%' },
  { name: 'Świdnica', x: '26%', y: '72%' },
  { name: 'Żarów', x: '28%', y: '70%' },
  { name: 'Popowo', x: '33%', y: '36%' },
  { name: 'Siewierz', x: '55%', y: '75%' },
  { name: 'Sanok', x: '80%', y: '85%' },
  { name: 'Sońsk', x: '63%', y: '35%' },
  { name: 'Rzeszów', x: '75%', y: '80%' },
  { name: 'Chrzanów', x: '52%', y: '81%' },
  { name: 'Mława', x: '63%', y: '30%' },
  { name: 'Radom', x: '68%', y: '58%' },
  { name: 'Jelcz-Laskowice', x: '36%', y: '65%' }
];

export default function PolandMap({ isOpen, onClose }: PolandMapProps) {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  const cityData = useMemo(() => {
    const data = new Map<string, { brand: any; desc: string }[]>();
    
    CITY_COORDS.forEach(c => data.set(c.name, []));

    dataset.nodes.forEach(node => {
      if (node.type === 'brand') {
        const factories = (node as any).factories_pl;
        if (Array.isArray(factories)) {
          factories.forEach(f => {
            if (!f.toLowerCase().includes('brak')) {
              // Match city
              CITY_COORDS.forEach(c => {
                if (f.includes(c.name)) {
                  data.get(c.name)?.push({ brand: node, desc: f });
                }
              });
            }
          });
        }
      }
    });

    return data;
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex justify-end bg-slate-900/40 backdrop-blur-sm pointer-events-auto">
          {/* Ciemne tło by zamknąć */}
          <div className="absolute inset-0 cursor-pointer" onClick={onClose} />

          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-[90%] max-w-4xl h-full bg-[#f8fafc] shadow-2xl flex flex-col md:flex-row overflow-hidden border-l border-slate-200"
          >
            {/* Header / Zamknij na mobilkach */}
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 z-50 p-2 bg-white rounded-full shadow-sm text-slate-500 hover:text-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Kolumna Mapy */}
            <div className="flex-1 relative bg-blue-50/50 p-8 flex items-center justify-center border-b md:border-b-0 md:border-r border-slate-200">
              <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
                backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)',
                backgroundSize: '24px 24px'
              }} />
              
              <div className="relative w-full max-w-lg aspect-[1/1] rounded-3xl bg-white shadow-xl border border-slate-100 overflow-hidden flex items-center justify-center">
                {/* Abstraction of Poland - Background shape */}
                <div 
                  className="absolute inset-0 w-full h-full opacity-90 pointer-events-none bg-no-repeat bg-center bg-contain p-4"
                  style={{ backgroundImage: "url('/polska.png')" }}
                />
                
                {CITY_COORDS.map(city => {
                  const brandsCount = cityData.get(city.name)?.length || 0;
                  if (brandsCount === 0) return null; // Only show cities with factories
                  
                  const isSelected = selectedCity === city.name;
                  
                  return (
                    <div 
                      key={city.name}
                      className="absolute group"
                      style={{ left: city.x, top: city.y, transform: 'translate(-50%, -50%)' }}
                    >
                      {/* Pulsing dot background */}
                      {(isSelected || !selectedCity) && (
                        <div className={`absolute inset-0 rounded-full opacity-40 animate-ping ${isSelected ? 'bg-fuchsia-500' : 'bg-blue-500'}`} style={{ transform: 'scale(2.5)' }} />
                      )}
                      
                      <button 
                        onClick={() => setSelectedCity(city.name)}
                        className={`relative z-10 w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center transition-all shadow-md ${isSelected ? 'bg-fuchsia-600 ring-4 ring-fuchsia-200' : 'bg-blue-600 hover:bg-blue-500'}`}
                      >
                        <MapPin className="w-2.5 h-2.5 md:w-3 md:h-3 text-white" />
                      </button>

                      <div className={`absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-1 bg-slate-800 text-white text-[10px] rounded-md pointer-events-none transition-all ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                        {city.name}
                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 border-x-4 border-b-4 border-x-transparent border-b-slate-800" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Kolumna Info */}
            <div className="w-full md:w-80 lg:w-96 bg-white overflow-y-auto relative p-6">
              {!selectedCity ? (
                <div className="h-full flex flex-col p-2">
                  <div className="flex flex-col items-center justify-center text-center text-slate-400 mb-8 mt-4">
                    <MapPin className="w-12 h-12 mb-4 opacity-20" />
                    <h3 className="text-lg font-bold text-slate-700 mb-2">Wybierz miasto</h3>
                    <p className="text-sm">Kliknij punkt na mapie lub z listy poniżej, aby sprawdzić fabryki.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {CITY_COORDS.filter(city => (cityData.get(city.name)?.length || 0) > 0).map(city => (
                      <button 
                        key={city.name}
                        onClick={() => setSelectedCity(city.name)}
                        className="px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-sm font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors text-left flex items-center gap-2"
                      >
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span className="truncate">{city.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                  <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-3 border-b pb-4 mt-2">
                    <MapPin className="w-6 h-6 text-fuchsia-600" />
                    {selectedCity}
                  </h2>
                  <button onClick={() => setSelectedCity(null)} className="absolute top-6 right-6 text-xs font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest flex items-center gap-1">
                    Wróć <X className="w-3 h-3" />
                  </button>
                  
                  <div className="flex flex-col gap-4">
                    {cityData.get(selectedCity)?.map((item, idx) => (
                      <div key={idx} className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                        <h4 className="font-bold text-slate-800 flex items-center gap-2 mb-2">
                          <Building2 className="w-4 h-4 text-blue-500" />
                          {item.brand.name}
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
