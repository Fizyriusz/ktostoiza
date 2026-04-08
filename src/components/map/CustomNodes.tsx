'use client';

import React, { useState } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { useFilter, nodeMatchesFilter } from '@/contexts/FilterContext';

function getFlagEmoji(countryStr: string) {
  if (!countryStr) return '🌍';
  const c = countryStr.toLowerCase();
  if (c.includes('polska') || c.includes('marka własna')) return '🇵🇱';
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
  if (c.includes('uk') || c.includes('anglia') || c.includes('wielka')) return '🇬🇧';
  if (c.includes('szwajcaria')) return '🇨🇭';
  if (c.includes('czechy')) return '🇨🇿';
  if (c.includes('globalnie') || c.includes('różne')) return '🌍';
  return '🌍';
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
  const { activeFilter } = useFilter();
  const matches = nodeMatchesFilter(data as Record<string, unknown>, activeFilter);
  const origin = data.country as string;
  const name = data.name as string;
  const flag = getFlagEmoji(origin);
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

      <span className="text-4xl leading-none mb-3">{flag}</span>
      <h3 className="text-slate-800 font-black text-xl tracking-tight leading-tight">{name}</h3>
      <p className="text-slate-400 text-[11px] font-medium mt-1.5 tracking-wide">{origin}</p>

      <InvisibleHandle type="source" position={Position.Bottom} />
    </div>
  );
};

// ─── Brand Node ─────────────────────────────────────────────────────────────

export const BrandNode = ({ data }: NodeProps) => {
  const [imgError, setImgError] = useState(false);
  const { activeFilter } = useFilter();
  const matches = nodeMatchesFilter(data as Record<string, unknown>, activeFilter);
  const brandName = data.name as string;
  const origin = data.origin as string;
  const accentColor = (data.accentColor as string) || '#64748b';
  const domain = getBrandDomain(brandName);
  const logoUrl = `https://logo.clearbit.com/${domain}`;
  const initial = brandName.charAt(0).toUpperCase();
  const flag = getFlagEmoji(origin);

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
        <span className="text-[10px] text-slate-400 font-medium leading-tight flex items-center justify-center gap-1 mt-0.5">
          {flag} {origin}
        </span>
      </div>
    </div>
  );
};
