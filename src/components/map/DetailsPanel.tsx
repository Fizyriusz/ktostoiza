'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Factory, Globe2, BookOpen, Link2, Info, ShoppingCart } from 'lucide-react';
import { GraphNodeData } from '@/data/types';

function getFlagEmoji(countryStr: string) {
  if (!countryStr) return '🌍';
  const c = countryStr.toLowerCase();
  if (c.includes('polska')) return '🇵🇱';
  if (c.includes('niemcy')) return '🇩🇪';
  if (c.includes('szwecja')) return '🇸🇪';
  if (c.includes('włochy')) return '🇮🇹';
  if (c.includes('turcja')) return '🇹🇷';
  if (c.includes('usa')) return '🇺🇸';
  if (c.includes('japonia')) return '🇯🇵';
  if (c.includes('chiny')) return '🇨🇳';
  if (c.includes('korea')) return '🇰🇷';
  if (c.includes('słowenia')) return '🇸🇮';
  if (c.includes('dania')) return '🇩🇰';
  if (c.includes('hiszpania')) return '🇪🇸';
  if (c.includes('uk') || c.includes('anglia')) return '🇬🇧';
  if (c.includes('szwajcaria')) return '🇨🇭';
  if (c.includes('globalnie') || c.includes('różne')) return '🌍';
  return '🌍';
}

function getBrandDomain(brandName: string) {
  let name = brandName.split('/')[0].trim().toLowerCase().replace(/\s+/g, '');
  name = name.replace(/[^a-z0-9]/g, '');
  if (name === 'bosch') return 'bosch-home.com';
  if (name === 'siemens') return 'siemens-home.bsh-group.com';
  if (name === 'candy') return 'candy-home.com';
  if (name === 'amica') return 'amica.pl';
  if (name === 'samsung') return 'samsung.com';
  if (name === 'lg') return 'lg.com';
  if (name === 'miele') return 'miele.com';
  if (name === 'electrolux') return 'electrolux.com';
  if (name === 'whirlpool') return 'whirlpool.com';
  if (name === 'beko') return 'beko.com';
  if (name === 'haier') return 'haier.com';
  if (name === 'hisense') return 'hisense.com';
  return `${name}.com`;
}

interface DetailsPanelProps {
  node: GraphNodeData | null;
  onClose: () => void;
}

export default function DetailsPanel({ node, onClose }: DetailsPanelProps) {
  const [imgError, setImgError] = useState(false);

  if (!node) return null;

  const origin = node.type === 'holding' ? node.country : node.origin;
  const flag = getFlagEmoji(origin);
  const brandLogo = node.type === 'brand' ? `https://logo.clearbit.com/${getBrandDomain(node.name)}` : null;

  return (
    <AnimatePresence>
      {node && (
        <motion.div
          key={node.id}
          // Mobile: bottom sheet sliding up from bottom
          // Desktop (sm+): side panel sliding in from right
          initial={{ opacity: 0, y: '100%', x: 0 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: '100%', x: 0 }}
          // On sm+ screens override to right panel animation via inline style isn't easy,
          // so we use a className workaround: same anim direction but works on both
          transition={{ type: 'spring', damping: 28, stiffness: 220 }}
          className="
            absolute z-50 flex flex-col font-sans overflow-y-auto
            bg-white border border-slate-200 shadow-2xl
            /* Mobile: full-width bottom sheet */
            bottom-0 left-0 right-0 max-h-[85vh] rounded-t-3xl
            /* Desktop: right side panel */
            sm:bottom-4 sm:top-4 sm:left-auto sm:right-4 sm:w-[400px] sm:max-h-none sm:rounded-3xl
          "
        >
          {/* Top Bar with Close Button */}
          <div className="sticky top-0 bg-white/80 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex justify-between items-center z-10 transition-colors">
            
            <div className="flex gap-2">
              {node.type === 'holding' ? (
                <span className="bg-slate-800 text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-md">Koncern</span>
              ) : (
                <span className="bg-emerald-100 text-emerald-800 text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-md">Marka</span>
              )}
            </div>

            <button 
              onClick={onClose}
              className="p-2 -mr-2 bg-slate-50 rounded-full hover:bg-slate-200 transition-colors text-slate-500"
              aria-label="Zamknij"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Main Informational Header */}
          <div className="p-8 pb-6 flex flex-col items-center border-b border-slate-50 bg-gradient-to-b from-slate-50/50 to-white">
            
            {node.type === 'brand' && brandLogo && !imgError && (
              <div className="mb-6 w-24 h-24 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={brandLogo}
                  alt={`Logo ${node.name}`}
                  className="w-full h-full object-contain"
                  onError={() => setImgError(true)}
                />
              </div>
            )}
            
            <div className="text-center">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight mb-2">
                {node.name}
              </h2>
              <div className="flex items-center justify-center gap-2 text-slate-500 text-sm font-medium bg-slate-100 px-3 py-1 rounded-full w-min mx-auto whitespace-nowrap">
                <span>{flag}</span> {origin}
              </div>
            </div>
            
            {node.type === 'brand' && node.segment && (
              <div className="mt-4 px-4 py-2 bg-blue-50 border border-blue-100 rounded-xl text-blue-700 text-sm font-semibold text-center w-full">
                Grupa: {node.segment}
              </div>
            )}
          </div>

          {/* Structured Content Sections */}
          <div className="px-6 py-4 space-y-6 flex-1 bg-slate-50/30">

            {/* History / Description */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
              <h4 className="flex items-center gap-2 text-xs font-black text-slate-800 uppercase tracking-widest mb-3 border-b border-slate-100 pb-2">
                <BookOpen className="w-4 h-4 text-blue-500" /> Historia i profil
              </h4>
              <p className="text-slate-600 text-[14px] leading-relaxed font-medium">
                {node.type === 'holding' ? node.description : node.history}
              </p>
            </div>

            {/* Factories */}
            {node.type === 'brand' && node.factories_pl && node.factories_pl.length > 0 && (
               <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                <h4 className="flex items-center gap-2 text-xs font-black text-slate-800 uppercase tracking-widest mb-3 border-b border-slate-100 pb-2">
                  <Factory className="w-4 h-4 text-emerald-500" /> Produkcja w Polsce
                </h4>
                <div className="flex flex-wrap gap-2">
                  {node.factories_pl.map(city => (
                    <span key={city} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg text-xs font-bold shadow-sm">
                      📍 {city}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Powiązania / Grupa */}
            {node.type === 'brand' && node.parentId && (
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                <h4 className="flex items-center gap-2 text-xs font-black text-slate-800 uppercase tracking-widest mb-3 border-b border-slate-100 pb-2">
                  <Link2 className="w-4 h-4 text-purple-500" /> Przynależność
                </h4>
                <p className="text-slate-500 font-medium text-sm">
                  Marka należy do: <span className="font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded inline-block ml-1">{node.parentId.replace('h-', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                </p>
              </div>
            )}
            
            {node.type === 'holding' && (
               <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                <h4 className="flex items-center gap-2 text-xs font-black text-slate-800 uppercase tracking-widest mb-3 border-b border-slate-100 pb-2">
                  <Info className="w-4 h-4 text-blue-500" /> Charakterystyka
                </h4>
                <p className="text-slate-500 font-medium text-sm">
                  Koncern zarządza portfelem marek na prawach własności lub licencji, organizując dla nich globalny lub regionalny łańcuch dostaw.
                </p>
              </div>
            )}
          </div>

          {/* Action / Monetization Footer */}
          {node.type === 'brand' && node.monetization && Object.keys(node.monetization).length > 0 && (
            <div className="p-6 bg-white border-t border-slate-100 mt-auto shadow-[0_-10px_30px_rgba(0,0,0,0.03)] rounded-b-3xl">
              <h4 className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] mb-4">
                <ShoppingCart className="w-4 h-4" /> Gdzie najlepiej kupić?
              </h4>
              <div className="flex flex-col gap-2.5">
                {node.monetization.media_expert && (
                  <a 
                    href={node.monetization.media_expert}
                    target="_blank" rel="sponsored noopener noreferrer"
                    className="group relative flex justify-between items-center w-full px-5 py-3.5 bg-gradient-to-r from-[#fcffdb] to-white border border-[#eebd00]/30 text-slate-800 font-bold text-sm rounded-xl hover:border-[#eebd00] transition-all shadow-sm overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center gap-2">Media Expert <span className="text-xs bg-black text-[#eebd00] px-1.5 rounded uppercase font-black tracking-widest">PROMO</span></span>
                    <ExternalLink className="w-4 h-4 text-[#bf9c08] relative z-10 group-hover:scale-110 group-hover:text-black transition-all" />
                  </a>
                )}
                {node.monetization.rtv_euro && (
                  <a 
                    href={node.monetization.rtv_euro}
                    target="_blank" rel="sponsored noopener noreferrer"
                    className="group relative flex justify-between items-center w-full px-5 py-3.5 bg-gradient-to-r from-[#fff0f1] to-white border border-[#e3000f]/20 text-slate-800 font-bold text-sm rounded-xl hover:border-[#e3000f] transition-all shadow-sm overflow-hidden"
                  >
                    <span className="relative z-10 text-slate-800">RTV Euro AGD</span>
                    <ExternalLink className="w-4 h-4 text-[#e3000f] relative z-10 group-hover:scale-110 transition-all" />
                  </a>
                )}
                {node.monetization.ceneo && (
                  <a 
                    href={node.monetization.ceneo}
                    target="_blank" rel="sponsored noopener noreferrer"
                    className="group relative flex justify-between items-center w-full px-5 py-3.5 bg-gradient-to-r from-[#fff5eb] to-white border border-[#ff6600]/20 text-slate-800 font-bold text-sm rounded-xl hover:border-[#ff6600] transition-all shadow-sm overflow-hidden"
                  >
                    <span className="relative z-10 text-slate-800">Ceneo</span>
                    <ExternalLink className="w-4 h-4 text-[#ff6600] relative z-10 group-hover:scale-110 transition-all" />
                  </a>
                )}
              </div>
            </div>
          )}

        </motion.div>
      )}
    </AnimatePresence>
  );
}
