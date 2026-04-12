'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useReactFlow } from '@xyflow/react';
import { useSearchParams, useParams } from 'next/navigation';
import { Search, X } from 'lucide-react';
import dataset from '@/data/dataset.json';

interface SearchResult {
  id: string;
  name: string;
  type: string;
  origin?: string;
  country?: string;
}

const allSearchable: SearchResult[] = dataset.nodes.map(n => ({
  id: n.id,
  name: n.name,
  type: n.type,
  origin: 'origin' in n ? (n.origin as string) : undefined,
  country: 'country' in n ? (n.country as string) : undefined,
}));

interface FlowInternalsProps {
  onNodeSelect: (data: any) => void;
}

export default function FlowInternals({ onNodeSelect }: FlowInternalsProps) {
  const { fitView } = useReactFlow();
  const searchParams = useSearchParams();
  const params = useParams();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const brandSlug = searchParams.get('brand') || params.slug;
    const resolvedSlug = Array.isArray(brandSlug) ? brandSlug[0] : brandSlug;
    if (resolvedSlug) {
      const match = dataset.nodes.find(n => n.seo_slug === resolvedSlug || n.name.toLowerCase() === resolvedSlug.toLowerCase());
      if (match) {
        fitView({ nodes: [{ id: match.id }], duration: 1500, padding: 1.8 });
        onNodeSelect(match as any);
      }
    }
  }, [searchParams, fitView, onNodeSelect]);

  useEffect(() => {
    if (query.trim().length < 1) {
      setResults([]);
      setOpen(false);
      return;
    }
    const q = query.toLowerCase();
    const filtered = allSearchable.filter(n => n.name.toLowerCase().includes(q)).slice(0, 8);
    setResults(filtered);
    setOpen(filtered.length > 0);
  }, [query]);

  const handleSelect = useCallback((result: SearchResult) => {
    setQuery(result.name);
    setOpen(false);

    fitView({
      nodes: [{ id: result.id }],
      duration: 900,
      padding: 1.8,
    });

    const nodeData = dataset.nodes.find((n) => n.id === result.id);
    if (nodeData) {
      onNodeSelect(nodeData);
    }
  }, [fitView, onNodeSelect]);

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div
      className="relative z-50 w-full"
      style={{ pointerEvents: 'all' }}
    >
      {/* Search input */}
      <div className="relative flex items-center bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden px-3 py-2 gap-2">
        <Search className="w-4 h-4 text-slate-400 shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="Szukaj marki lub koncernu…"
          className="flex-1 text-sm font-medium text-slate-700 placeholder:text-slate-400 bg-transparent outline-none min-w-0"
        />
        {query && (
          <button onClick={clearSearch} className="text-slate-400 hover:text-slate-600 transition-colors shrink-0">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <div className="mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden">
          {results.map(r => (
            <button
              key={r.id}
              onClick={() => handleSelect(r)}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0"
            >
              <div className="flex-1 min-w-0">
                <span className="text-sm font-bold text-slate-800 block truncate">{r.name}</span>
                <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                  {r.type === 'holding' ? 'Koncern' : 'Marka'} · {r.origin || r.country}
                </span>
              </div>
              <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full shrink-0 ${r.type === 'holding' ? 'bg-slate-800 text-white' : 'bg-blue-50 text-blue-700'}`}>
                {r.type === 'holding' ? 'Koncern' : 'Marka'}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
