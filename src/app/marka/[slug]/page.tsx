import type { Metadata } from 'next';
import { Suspense } from 'react';
import dataset from '@/data/dataset.json';
import { HomeContent } from '@/app/page';

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
      <Suspense fallback={<div className="bg-[#f8fafc] w-full h-screen" />}>
        <HomeContent />
      </Suspense>
    </>
  );
}
