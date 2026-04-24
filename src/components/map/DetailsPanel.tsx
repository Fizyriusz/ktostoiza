'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Factory, Globe2, BookOpen, Link2, Info, ShoppingCart, Newspaper } from 'lucide-react';
import { GraphNodeData } from '@/data/types';

function getCountryCode(countryStr: string) {
  if (!countryStr) return 'un';
  const c = countryStr.toLowerCase();
  if (c.includes('polska') || c.includes('marka własna')) return 'pl';
  if (c.includes('niemcy')) return 'de';
  if (c.includes('szwecja')) return 'se';
  if (c.includes('włochy')) return 'it';
  if (c.includes('turcja')) return 'tr';
  if (c.includes('usa')) return 'us';
  if (c.includes('japonia')) return 'jp';
  if (c.includes('chiny')) return 'cn';
  if (c.includes('korea')) return 'kr';
  if (c.includes('słowenia')) return 'si';
  if (c.includes('dania')) return 'dk';
  if (c.includes('hiszpania')) return 'es';
  if (c.includes('uk') || c.includes('anglia') || c.includes('wielka')) return 'gb';
  if (c.includes('szwajcaria')) return 'ch';
  if (c.includes('czechy')) return 'cz';
  if (c.includes('globalnie') || c.includes('różne')) return 'un';
  return 'un';
}

function getFlagUrl(countryStr: string) {
  const code = getCountryCode(countryStr);
  return code === 'un' 
    ? 'https://upload.wikimedia.org/wikipedia/commons/e/ef/International_Flag_of_Planet_Earth.svg' 
    : `https://flagcdn.com/w20/${code}.png`;
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
  nodes: GraphNodeData[];
  onClose: (id?: string) => void;
  onRequestCompare?: (node: GraphNodeData) => void;
}

import dataset from '@/data/dataset.json';

function SingleNodeDetails({ node, onClose, onCompare, isSideBySide }: { node: GraphNodeData, onClose: () => void, onCompare?: () => void, isSideBySide: boolean }) {
  const [imgError, setImgError] = useState(false);
  const [content, setContent] = React.useState<{ news: any[], blogs: any[] }>({ news: [], blogs: [] });

  React.useEffect(() => {
    fetch(`/api/content?brandId=${node.id}`)
      .then(res => res.json())
      .then(data => setContent(data))
      .catch(console.error);
  }, [node.id]);
  const origin = (node.type === 'holding' || node.type === 'manufacturer') ? node.country : node.origin;
  const flagUrl = getFlagUrl(origin);
  const brandLogo = node.type === 'brand' ? `https://logo.clearbit.com/${getBrandDomain(node.name)}` : null;

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Top Bar with Close Button */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex justify-between items-center z-10">
        <div className="flex flex-wrap gap-2">
          {node.type === 'holding' && (
            <span className="bg-slate-800 text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-md">Koncern</span>
          )}
          {node.type === 'holding' && 'isOEM' in node && node.isOEM && (
            <span className="bg-fuchsia-900 text-fuchsia-100 text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-md flex items-center gap-1.5"><Factory className="w-3 h-3 text-fuchsia-300" /> OEM</span>
          )}
          {node.type === 'manufacturer' && (
            <span className="bg-slate-900 text-slate-300 border border-slate-700 text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-md flex items-center gap-1.5"><Factory className="w-3 h-3" /> Fabryka (OEM)</span>
          )}
          {node.type === 'brand' && (
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

      <div className="p-6 flex flex-col items-center border-b border-slate-50 bg-gradient-to-b from-slate-50/50 to-white">
        {node.type === 'brand' && brandLogo && !imgError && (
          <div className="mb-6 w-24 h-24 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center p-3">
            <img
              src={brandLogo}
              alt={`Logo ${node.name}`}
              className="w-full h-full object-contain"
              onError={() => setImgError(true)}
            />
          </div>
        )}
        
        <div className="text-center">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-tight mb-2">
            {node.name}
          </h2>
          <div className="flex items-center justify-center gap-2 text-slate-500 text-sm font-medium bg-slate-100 px-3 py-1 rounded-full w-min mx-auto whitespace-nowrap">
            <img src={flagUrl} alt={origin} className="w-5 h-3.5 object-cover rounded-[2px]" /> 
            {origin}
          </div>

          {node.type === 'brand' && (node.founded_year || node.business_structure) && (
            <div className="flex flex-wrap justify-center gap-1.5 mt-3">
              {node.founded_year && (
                <div className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-500 text-[11px] font-bold shadow-sm">
                  Założona: {node.founded_year}
                </div>
              )}
              {node.business_structure && (
                <div className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-500 text-[11px] font-bold shadow-sm">
                  {node.business_structure}
                </div>
              )}
            </div>
          )}
        </div>
        
        {node.type === 'brand' && node.segment && (
          <div className="mt-5 px-4 py-2 bg-blue-50 border border-blue-100 rounded-xl text-blue-700 text-sm font-semibold text-center w-full">
            Grupa: {node.segment}
          </div>
        )}

        {!isSideBySide && onCompare && (
          <button 
            onClick={onCompare} 
            className="mt-3 px-4 py-2 pb-[10px] bg-slate-900 border border-slate-700 rounded-xl text-white text-sm font-semibold w-full transition-colors hover:bg-slate-800 shadow-sm flex items-center justify-center gap-2 group relative overflow-hidden"
          >
            <span className="relative z-10">Zestaw z inną marką</span>
            <span className="relative z-10 ml-1 text-[9px] bg-slate-700/80 text-white px-1.5 py-0.5 rounded opacity-90 group-hover:bg-slate-600 transition-colors uppercase tracking-widest font-black">VS</span>
          </button>
        )}

        {node.type === 'brand' && node.product_range && (
          <div className={`mt-2 group relative w-full ${isSideBySide ? 'hover:z-50' : ''}`}>
            <div className="cursor-help px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm font-semibold text-center w-full transition-colors hover:bg-slate-700 shadow-sm">
              Zakres: {node.product_range}
            </div>
            {node.product_categories && node.product_categories.length > 0 && (
              <div className="absolute left-1/2 -translate-x-1/2 bottom-[110%] mb-1 w-max max-w-[320px] bg-slate-900 text-white rounded-xl p-3 shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all z-50 scale-95 group-hover:scale-100 origin-bottom">
                <div className="font-bold text-slate-400 mb-1.5 uppercase tracking-widest text-[9px] text-center">
                  Kategorie produktowe
                </div>
                <div className="flex flex-wrap justify-center gap-1.5">
                  {node.product_categories.map(cat => (
                    <span key={cat} className="bg-slate-800 border border-slate-700 text-[10px] font-medium px-2 py-0.5 rounded-md whitespace-nowrap">
                      {cat}
                    </span>
                  ))}
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-3 h-3 bg-slate-900 rotate-45 border-r border-b border-transparent"></div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="px-6 py-4 space-y-6 flex-1 bg-slate-50/30">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
          <h4 className="flex items-center gap-2 text-xs font-black text-slate-800 uppercase tracking-widest mb-3 border-b border-slate-100 pb-2">
            <BookOpen className="w-4 h-4 text-blue-500" /> Historia i profil
          </h4>
          <p className="text-slate-600 text-[14px] leading-relaxed font-medium">
            {node.type === 'holding' || node.type === 'manufacturer' ? node.description : node.history}
          </p>
          {node.type === 'brand' && node.acquisition_history && (
            <div className="mt-4 pt-4 border-t border-slate-100">
              <h5 className="text-[10px] font-black uppercase text-slate-400 mb-1.5 tracking-wider">Historia przejęć</h5>
              <p className="text-slate-500 text-xs font-semibold leading-relaxed">
                {node.acquisition_history}
              </p>
            </div>
          )}
        </div>

        {node.type === 'brand' && (
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
            <h4 className="flex items-center gap-2 text-xs font-black text-slate-800 uppercase tracking-widest mb-3 border-b border-slate-100 pb-2">
              <Factory className="w-4 h-4 text-emerald-500" /> Produkcja w Polsce
            </h4>
            <div className="flex flex-wrap gap-2">
              {(!node.factories_pl || node.factories_pl.length === 0) ? (
                <span className="text-slate-500 text-sm font-semibold">Brak fabryk na terenie Polski.</span>
              ) : (node.factories_pl.length === 1 && node.factories_pl[0].includes('Brak')) ? (
                <span className="text-slate-500 text-sm font-semibold">{node.factories_pl[0]}</span>
              ) : (
                node.factories_pl.map(city => (
                  <span key={city} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg text-xs font-bold shadow-sm">
                    📍 {city}
                  </span>
                ))
              )}
            </div>
          </div>
        )}

        {node.type === 'brand' && node.parentId && (
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
            <h4 className="flex items-center gap-2 text-xs font-black text-slate-800 uppercase tracking-widest mb-3 border-b border-slate-100 pb-2">
              <Link2 className="w-4 h-4 text-purple-500" /> Przynależność
            </h4>
            <p className="text-slate-500 font-medium text-sm">
              Marka podlegająca oficjalnie pod: <span className="font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded inline-block ml-1">{node.parentId.replace('h-', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
            </p>
          </div>
        )}

        {node.type === 'brand' && node.producedBy && node.producedBy.length > 0 && (
          <div className="bg-fuchsia-50/50 p-5 rounded-2xl shadow-sm border border-fuchsia-100">
            <h4 className="flex items-center gap-2 text-xs font-black text-fuchsia-800 uppercase tracking-widest mb-3 border-b border-fuchsia-100 pb-2">
              <Factory className="w-4 h-4 text-fuchsia-500" /> Realna Produkcja (OEM)
            </h4>
            <p className="text-fuchsia-900/80 font-medium text-sm leading-relaxed">
              Ten model/marka korzysta z zaplecza technologicznego fabryk zewnętrznych:
            </p>
            <div className="flex flex-col gap-1.5 mt-3">
              {node.producedBy.map(producerId => {
                const producerInfo = dataset.nodes.find(n => n.id === producerId);
                return (
                  <div key={producerId} className="bg-white border border-fuchsia-200 text-fuchsia-900 px-3 py-2 rounded-lg font-bold text-sm shadow-sm flex justify-between items-center">
                    <span>{producerInfo ? producerInfo.name : producerId}</span>
                    <span className="text-[9px] uppercase tracking-widest text-fuchsia-500">{(producerInfo && 'country' in producerInfo) ? producerInfo.country : 'Zakład'}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      {content.blogs.length > 0 && (
          <div className="bg-blue-50/50 p-5 rounded-2xl shadow-sm border border-blue-100">
            <h4 className="flex items-center gap-2 text-xs font-black text-blue-800 uppercase tracking-widest mb-3 border-b border-blue-100 pb-2">
              <BookOpen className="w-4 h-4 text-blue-500" /> Więcej na naszym Blogu
            </h4>
            <div className="flex flex-col gap-2">
              {content.blogs.map(blog => (
                <a key={blog.slug} href={`/blog/${blog.slug}`} className="text-sm font-bold text-blue-600 hover:text-blue-500 transition-colors">
                  {blog.title}
                </a>
              ))}
            </div>
          </div>
        )}

        {content.news.length > 0 && (
          <div className="bg-rose-50/50 p-5 rounded-2xl shadow-sm border border-rose-100">
            <h4 className="flex items-center gap-2 text-xs font-black text-rose-800 uppercase tracking-widest mb-3 border-b border-rose-100 pb-2">
              <Newspaper className="w-4 h-4 text-rose-500" /> Ostatnie Wydarzenia
            </h4>
            <div className="flex flex-col gap-3">
              {content.news.map(n => (
                <a key={n.slug} href="/news" className="group text-sm font-bold text-rose-600 hover:text-rose-500 transition-colors leading-tight">
                  <span className="text-[10px] text-rose-400 block mb-0.5">{n.date}</span>
                  {n.title}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {node.type === 'brand' && node.monetization && Object.keys(node.monetization).length > 0 && (
        <div className="p-6 bg-white border-t border-slate-100 mt-auto shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
          <h4 className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] mb-4">
            <ShoppingCart className="w-4 h-4" /> Gdzie najlepiej kupić?
          </h4>
          <div className="flex flex-col gap-2.5">
            {node.monetization.media_expert && (
              <a href={node.monetization.media_expert} target="_blank" rel="sponsored noopener noreferrer"
                className="group relative flex justify-between items-center w-full px-5 py-3.5 bg-gradient-to-r from-[#fcffdb] to-white border border-[#eebd00]/30 text-slate-800 font-bold text-sm rounded-xl hover:border-[#eebd00] transition-all shadow-sm overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">Media Expert <span className="text-[10px] bg-black text-[#eebd00] px-1.5 py-0.5 rounded uppercase font-black tracking-widest">PROMO</span></span>
                <ExternalLink className="w-4 h-4 text-[#bf9c08] relative z-10 group-hover:scale-110 group-hover:text-black transition-all" />
              </a>
            )}
            {node.monetization.rtv_euro && (
              <a href={node.monetization.rtv_euro} target="_blank" rel="sponsored noopener noreferrer"
                className="group relative flex justify-between items-center w-full px-5 py-3.5 bg-gradient-to-r from-[#fff0f1] to-white border border-[#e3000f]/20 text-slate-800 font-bold text-sm rounded-xl hover:border-[#e3000f] transition-all shadow-sm overflow-hidden"
              >
                <span className="relative z-10 text-slate-800">RTV Euro AGD</span>
                <ExternalLink className="w-4 h-4 text-[#e3000f] relative z-10 group-hover:scale-110 transition-all" />
              </a>
            )}
            {node.monetization.ceneo && (
              <a href={node.monetization.ceneo} target="_blank" rel="sponsored noopener noreferrer"
                className="group relative flex justify-between items-center w-full px-5 py-3.5 bg-gradient-to-r from-[#fff5eb] to-white border border-[#ff6600]/20 text-slate-800 font-bold text-sm rounded-xl hover:border-[#ff6600] transition-all shadow-sm overflow-hidden"
              >
                <span className="relative z-10 text-slate-800">Ceneo</span>
                <ExternalLink className="w-4 h-4 text-[#ff6600] relative z-10 group-hover:scale-110 transition-all" />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function DetailsPanel({ nodes, onClose, onRequestCompare }: DetailsPanelProps) {
  if (!nodes || nodes.length === 0) return null;

  const isMulti = nodes.length > 1;

  return (
    <AnimatePresence>
      <motion.div
        key={nodes.map(n => n.id).join('-')}
        initial={{ opacity: 0, y: '100%', x: 0 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        exit={{ opacity: 0, y: '100%', x: 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 220 }}
        className={`
          absolute z-50 flex flex-col sm:flex-row overflow-hidden
          bg-white sm:bg-transparent
          /* Mobile: full-width bottom sheet (stacked vertically if 2) */
          bottom-0 left-0 right-0 max-h-[85vh] rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)]
          /* Desktop */
          sm:bottom-4 sm:top-4 sm:left-auto sm:right-4 sm:max-h-none sm:rounded-3xl sm:shadow-none
          ${isMulti ? 'sm:w-[700px]' : 'sm:w-[400px]'}
        `}
      >
        <div className={`flex flex-col sm:flex-row w-full h-full overflow-y-auto sm:overflow-hidden rounded-t-3xl sm:rounded-3xl shadow-2xl divide-y sm:divide-y-0 sm:divide-x divide-slate-200 border border-slate-200 ${isMulti ? 'bg-slate-100' : 'bg-white'}`}>
          {nodes.map(node => (
            <div key={node.id} className="flex-1 sm:overflow-y-auto min-w-[300px]">
              <SingleNodeDetails 
                node={node} 
                onClose={() => onClose(node.id)} 
                isSideBySide={isMulti} 
                onCompare={onRequestCompare ? () => onRequestCompare(node) : undefined}
              />
            </div>
          ))}
        </div>
        
        {/* Render a sticky "vs" badge if multi-select and desktop */}
        {isMulti && (
          <div className="hidden sm:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-slate-900 text-white rounded-full items-center justify-center font-black tracking-widest text-xs shadow-xl border-4 border-white pointer-events-none z-50">
            VS
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
