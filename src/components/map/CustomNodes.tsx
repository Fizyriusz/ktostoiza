'use client';

import React, { useState } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Factory } from 'lucide-react';
import { useFilter, nodeMatchesFilter } from '@/contexts/FilterContext';

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

function getHoldingAccent(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('beko')) return '#0d9488';
  if (n.includes('bsh')) return '#3b82f6';
  if (n.includes('haier')) return '#ef4444';
  if (n.includes('electrolux')) return '#6366f1';
  if (n.includes('hisense')) return '#22c55e';
  if (n.includes('amica')) return '#16a34a';
  if (n.includes('vestel')) return '#f59e0b';
  if (n.includes('samsung')) return '#1d4ed8';
  if (n.includes('lg')) return '#dc2626';
  if (n.includes('polsk')) return '#b91c1c';
  if (n.includes('market')) return '#64748b';
  return '#6b7280';
}

function getBrandDomain(brandName: string) {
  const name = brandName.split('/')[0].trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  const domainMap: Record<string, string> = {
    hotpointariston: 'hotpoint.com', bosch: 'bosch-home.com',
    siemens: 'siemens-home.bsh-group.com', candy: 'candy-home.com',
    geappliances: 'geappliances.com', amica: 'amica.pl',
    samsung: 'samsung.com', lg: 'lg.com', miele: 'miele.com',
    smeg: 'smeg.com', liebherr: 'liebherr.com', electrolux: 'electrolux.com',
    whirlpool: 'whirlpool.com', sharp: 'sharp.com', grundig: 'grundig.com',
    beko: 'beko.com', haier: 'haier.com', hisense: 'hisense.com',
    gorenje: 'gorenje.com', neff: 'neff-home.com', gaggenau: 'gaggenau.com',
    teka: 'teka.com', hitachi: 'hitachi.com', zanussi: 'zanussi.com',
    indesit: 'indesit.com', aeg: 'aeg.com', hoover: 'hoover.com',
    polar: 'polar.eu', toshiba: 'toshiba.com', tcl: 'tcl.com',
    panasonic: 'panasonic.com', franke: 'franke.com', hansa: 'hansa.com',
    gorenje2: 'gorenje.com',
  };
  return domainMap[name] || `${name}.com`;
}

// Accent color → light gradient background for brand fallback
function accentToGradient(accent: string): string {
  // Map accent hex to a very light version for the gradient background
  const lightMap: Record<string, string> = {
    '#0d9488': 'from-teal-50 to-teal-100',       // beko
    '#3b82f6': 'from-blue-50 to-blue-100',         // bsh
    '#ef4444': 'from-red-50 to-red-100',            // haier
    '#6366f1': 'from-indigo-50 to-indigo-100',      // electrolux
    '#22c55e': 'from-green-50 to-green-100',        // hisense
    '#16a34a': 'from-emerald-50 to-emerald-100',    // amica
    '#f59e0b': 'from-amber-50 to-amber-100',        // vestel
    '#1d4ed8': 'from-blue-50 to-blue-100',          // samsung
    '#dc2626': 'from-red-50 to-red-100',            // lg
    '#b91c1c': 'from-rose-50 to-rose-100',          // pl-ind
    '#64748b': 'from-slate-50 to-slate-100',        // market/fallback
  };
  return lightMap[accent] ?? 'from-slate-50 to-slate-100';
}

function accentToTextColor(accent: string): string {
  const textMap: Record<string, string> = {
    '#0d9488': 'text-teal-600',
    '#3b82f6': 'text-blue-600',
    '#ef4444': 'text-red-600',
    '#6366f1': 'text-indigo-600',
    '#22c55e': 'text-green-600',
    '#16a34a': 'text-emerald-700',
    '#f59e0b': 'text-amber-600',
    '#1d4ed8': 'text-blue-700',
    '#dc2626': 'text-red-600',
    '#b91c1c': 'text-rose-700',
    '#64748b': 'text-slate-500',
  };
  return textMap[accent] ?? 'text-slate-500';
}

// Invisible handle placed at the center of the node
const InvisibleHandle = ({ type, position }: { type: 'source' | 'target'; position: Position }) => (
  <Handle
    type={type}
    position={position}
    className="!w-0 !h-0 !min-w-0 !min-h-0 !border-0 !bg-transparent !opacity-0"
    style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
  />
);

// ─── Holding Node ───────────────────────────────────────────────────────────

export const HoldingNode = ({ data }: NodeProps) => {
  const { activeFilter, viewMode, focusedOEMNodeId } = useFilter();
  const matches = nodeMatchesFilter(data as Record<string, unknown>, activeFilter, focusedOEMNodeId);
  const origin = data.country as string;
  const name = data.name as string;
  const flagUrl = getFlagUrl(origin);
  const accent = getHoldingAccent(name);

  return (
    <div
      className="bg-white rounded-[2rem] px-8 py-6 min-w-[200px] flex flex-col justify-center items-center text-center cursor-grab active:cursor-grabbing relative"
      style={{
        border: `3px solid ${accent}`,
        boxShadow: `0 8px 32px ${accent}1a, 0 2px 8px rgba(0,0,0,0.07)`,
        opacity: matches ? 1 : 0.1,
        filter: matches ? 'none' : 'grayscale(100%)',
        transition: 'opacity 0.35s ease, filter 0.35s ease',
      }}
    >
      <InvisibleHandle type="target" position={Position.Top} />

      {viewMode === 'logocards' && data.localLogo ? (
        <div className="w-full h-12 mb-3 flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={data.localLogo as string} alt={name} className="w-full h-full object-contain grayscale hover:grayscale-0 transition-all opacity-90 hover:opacity-100" />
        </div>
      ) : (
        <div className="mb-3 w-8 h-8 rounded-full overflow-hidden border border-slate-200 shadow-sm flex items-center justify-center bg-slate-50 mx-auto">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={flagUrl} alt={origin} className="w-full h-full object-cover" />
        </div>
      )}
      <h3 className={`text-slate-800 font-black tracking-tight leading-tight ${viewMode === 'logocards' && data.localLogo ? 'text-xs hidden' : 'text-xl'}`}>{name}</h3>
      <p className="text-slate-400 text-[11px] font-medium mt-1.5 tracking-wide">{origin}</p>

      <InvisibleHandle type="source" position={Position.Bottom} />
    </div>
  );
};

// ─── Brand Node ─────────────────────────────────────────────────────────────

export const BrandNode = ({ data }: NodeProps) => {
  const [imgError, setImgError] = useState(false);
  const { activeFilter, viewMode, focusedOEMNodeId } = useFilter();
  const matches = nodeMatchesFilter(data as Record<string, unknown>, activeFilter, focusedOEMNodeId);
  const brandName = data.name as string;
  const origin = data.origin as string;
  const accentColor = (data.accentColor as string) || '#64748b';
  const domain = getBrandDomain(brandName);
  const logoUrl = `https://logo.clearbit.com/${domain}`;
  const initial = brandName.charAt(0).toUpperCase();
  const flagUrl = getFlagUrl(origin);

  const fallbackGrad = accentToGradient(accentColor);
  const fallbackText = accentToTextColor(accentColor);

  return (
    <div
      className="flex flex-col items-center justify-center relative z-10 group cursor-grab active:cursor-grabbing"
      style={{
        opacity: matches ? 1 : 0.1,
        filter: matches ? 'none' : 'grayscale(100%)',
        transition: 'opacity 0.35s ease, filter 0.35s ease',
      }}
    >

      {viewMode === 'logocards' ? (
        <>
          <div
            className={`w-[130px] h-[64px] rounded-2xl flex items-center justify-center overflow-hidden bg-white shadow-sm ring-1 ring-slate-200/60 p-3 group-hover:ring-2 group-hover:shadow-md transition-all`}
            style={{ borderColor: accentColor }}
          >
            <InvisibleHandle type="target" position={Position.Top} />
            
            {data.localLogo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={data.localLogo as string}
                alt={`Logo ${brandName}`}
                className={`max-w-full max-h-full object-contain transition-all duration-300 ${matches ? 'grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100' : 'grayscale opacity-20'}`}
              />
            ) : (
              <span className={`text-[12px] text-center font-black select-none ${fallbackText} leading-tight`}>
                {brandName}
              </span>
            )}

            <InvisibleHandle type="source" position={Position.Bottom} />
          </div>
          <div className="mt-2 text-center opacity-0 group-hover:opacity-100 transition-opacity absolute top-full pointer-events-none">
            <span className="text-[9px] uppercase tracking-[0.2em] font-black text-slate-500 bg-white/90 px-2.5 py-1 rounded-lg shadow-sm border border-slate-100/50">{origin}</span>
          </div>
        </>
      ) : (
        <>
          {/* Circle */}
          <div
            className={`w-[82px] h-[82px] rounded-full flex items-center justify-center overflow-hidden ring-1 ring-slate-200/60 bg-white
              ${imgError ? `bg-gradient-to-br ${fallbackGrad}` : ''}`}
            style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.09), 0 1px 4px rgba(0,0,0,0.06)' }}
          >
            <InvisibleHandle type="target" position={Position.Top} />

            {!imgError ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoUrl}
                alt={`Logo ${brandName}`}
                className="w-12 h-12 object-contain"
                onError={() => setImgError(true)}
              />
            ) : (
              <span className={`text-[28px] font-black select-none ${fallbackText}`}>
                {initial}
              </span>
            )}

            <InvisibleHandle type="source" position={Position.Bottom} />
          </div>

          {/* Label always visible */}
          <div className="mt-2.5 text-center max-w-[110px]">
            <span className="text-[12px] font-bold text-slate-700 leading-tight block">{brandName}</span>
            <span className="text-[10px] text-slate-400 font-medium leading-tight flex items-center justify-center gap-1.5 mt-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={flagUrl} alt={origin} className="w-4 h-3 object-cover rounded-[2px]" /> 
              {origin}
            </span>
          </div>
        </>
      )}
    </div>
  );
};

// ─── Manufacturer Node (OEM) ────────────────────────────────────────────────
export const ManufacturerNode = ({ data }: NodeProps) => {
  const { activeFilter, focusedOEMNodeId } = useFilter();
  const matches = nodeMatchesFilter(data as Record<string, unknown>, activeFilter, focusedOEMNodeId);
  const name = data.name as string;
  const origin = data.country as string;
  const flagUrl = getFlagUrl(origin);

  return (
    <div
      className="bg-slate-900 rounded-lg px-6 py-4 min-w-[190px] flex flex-col justify-center items-center text-center cursor-grab active:cursor-grabbing relative"
      style={{
        border: `2px solid #334155`,
        boxShadow: `0 8px 32px rgba(0,0,0,0.3), inset 0 2px 0 rgba(255,255,255,0.05)`,
        opacity: matches ? 1 : 0.1,
        filter: matches ? 'none' : 'grayscale(100%)',
        transition: 'opacity 0.35s ease, filter 0.35s ease',
      }}
    >
      <InvisibleHandle type="target" position={Position.Left} />
      <InvisibleHandle type="target" position={Position.Right} />
      <InvisibleHandle type="target" position={Position.Top} />
      <InvisibleHandle type="source" position={Position.Bottom} />

      <div className="mb-2 w-8 h-8 rounded bg-slate-800 border border-slate-700 shadow-inner flex items-center justify-center mx-auto text-slate-400">
        <Factory className="w-4 h-4" />
      </div>
      <h3 className="text-white font-black tracking-tight leading-tight text-base mb-1">{name}</h3>
      
      <div className="flex items-center justify-center gap-1.5 mt-1.5">
        <img src={flagUrl} alt={origin} className="w-3.5 h-2.5 object-cover rounded-sm opacity-80" /> 
        <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest leading-none">{origin}</p>
      </div>
    </div>
  );
};
