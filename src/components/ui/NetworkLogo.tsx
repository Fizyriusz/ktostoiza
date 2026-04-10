import React from 'react';

export default function NetworkLogo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* ─── EDGES ────────────────────────────────────────────────────────── */}
      
      {/* Grey Links */}
      <path d="M 20 40 L 40 20" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="text-slate-400"/>
      <path d="M 40 20 L 75 25" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="text-slate-400"/>
      <path d="M 40 20 L 50 50" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="text-slate-400"/>
      <path d="M 75 25 L 50 50" stroke="#2563eb" strokeWidth="4" strokeLinecap="round" />
      <path d="M 20 40 L 35 75" stroke="#2563eb" strokeWidth="4" strokeLinecap="round" />
      
      {/* Blue Links */}
      <path d="M 50 50 L 35 75" stroke="#2563eb" strokeWidth="4" strokeLinecap="round" />
      <path d="M 50 50 L 80 85" stroke="#2563eb" strokeWidth="4" strokeLinecap="round" />
      <path d="M 35 75 L 80 85" stroke="#2563eb" strokeWidth="4" strokeLinecap="round" />

      {/* ─── NODES ────────────────────────────────────────────────────────── */}
      
      {/* Grey Nodes */}
      <circle cx="20" cy="40" r="7" fill="currentColor" className="text-slate-500" />
      <circle cx="40" cy="20" r="7" fill="currentColor" className="text-slate-500" />
      <circle cx="75" cy="25" r="7" fill="currentColor" className="text-slate-500" />

      {/* Blue Nodes */}
      <circle cx="50" cy="50" r="7" fill="#2563eb" />
      <circle cx="35" cy="75" r="7" fill="#2563eb" />
      <circle cx="80" cy="85" r="7" fill="#2563eb" />
    </svg>
  );
}
