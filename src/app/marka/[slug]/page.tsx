import type { Metadata } from 'next';
import { Suspense } from 'react';
import dataset from '@/data/dataset.json';
import { HomeContent } from '@/app/page';
import NodeArticle, { type NodeLike } from '@/components/seo/NodeArticle';

export function generateStaticParams() {
  return dataset.nodes
    .filter((node: any) => node.seo_slug && typeof node.seo_slug === 'string')
    .map(node => ({ slug: node.seo_slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const node = dataset.nodes.find(n => n.seo_slug === slug);
  
  if (!node) {
    return { title: 'Nie znaleziono marki | KtoStoiZa.pl' };
  }

  const name = node.name;
  const isHolding = node.type === 'holding';
  const typeText = isHolding ? 'koncernem' : 'marką';
  
  // Safe extraction of text for description
  const nAny = node as any;
  const historyText = isHolding ? nAny.description : nAny.history;
  const descPreview = historyText ? historyText.substring(0, 100) + '...' : '';

  return {
    title: `Kto stoi za ${typeText} ${name}? Historia, produkcja, opinie | KtoStoiZa.pl`,
    description: `Sprawdź kto jest właścicielem ${name}, gdzie znajduje się produkcja oraz poznaj powiązania kapitałowe. ${descPreview}`,
    alternates: {
      canonical: `https://ktostoiza.pl/marka/${slug}`,
    }
  };
}

export default async function BrandPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const node = dataset.nodes.find(n => n.seo_slug === slug);
  
  if (!node) {
    return <HomeContent />;
  }

  const isHolding = node.type === 'holding';
  const nAny = node as any;

  let parentOrg;
  if (!isHolding && nAny.parentId) {
    parentOrg = dataset.nodes.find(n => n.id === nAny.parentId);
  }

  const jsonLd: any = {
    '@context': 'https://schema.org',
    '@type': isHolding ? 'Corporation' : 'Brand',
    name: node.name,
    description: isHolding ? nAny.description : nAny.history,
  };

  const location = isHolding ? nAny.country : nAny.origin;
  if (location) {
    jsonLd.foundingLocation = {
      '@type': 'Place',
      name: location
    };
  }

  if (nAny.founded_year) {
    jsonLd.foundingDate = nAny.founded_year.toString();
  }

  if (parentOrg) {
    jsonLd.parentOrganization = {
      '@type': 'Corporation',
      name: parentOrg.name
    };
  }
  
  // Logo tylko jeśli faktycznie mamy plik u siebie — schema.org nie znosi martwych URL-i.
  if (nAny.localLogo) {
    jsonLd.logo = `https://ktostoiza.pl${nAny.localLogo}`;
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense fallback={<div className="bg-[#f8fafc] w-full h-[100svh]" />}>
        <HomeContent />
      </Suspense>

      {/* Mapa przechwytuje zdarzenia kółka (zoom), więc sekcja pod nią jest
          nieosiągalna scrollem — stąd zakotwiczony skrót. */}
      <a
        href="#o-marce"
        className="fixed bottom-14 left-3 sm:bottom-4 sm:left-4 z-[130] flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 bg-slate-900/90 backdrop-blur-md text-white rounded-full text-xs font-bold shadow-lg hover:bg-slate-800 transition-colors"
      >
        <span className="sm:hidden">Szczegóły</span>
        <span className="hidden sm:inline">Szczegóły: {node.name}</span>
        <span aria-hidden="true">↓</span>
      </a>

      <NodeArticle node={node as NodeLike} />
    </>
  );
}
