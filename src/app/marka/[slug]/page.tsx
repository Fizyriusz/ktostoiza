import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import dataset from '@/data/dataset.json';

// ─── Static params pre-generation ───────────────────────────────────────────

export async function generateStaticParams() {
  return dataset.nodes
    .filter(n => n.type === 'brand')
    .map(n => ({ slug: n.seo_slug }))
    .filter(p => !!p.slug);
}

// ─── Dynamic SEO metadata ────────────────────────────────────────────────────

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const node = dataset.nodes.find(n => n.type === 'brand' && n.seo_slug === slug);

  if (!node || node.type !== 'brand') {
    return { title: 'Marka nie znaleziona – KtoStoiZa.pl' };
  }

  const brandNode = node as typeof dataset.nodes[number] & { origin?: string; history?: string };
  const parentHolding = dataset.nodes.find(h => h.id === ('parentId' in node ? node.parentId : ''));
  const parentName = parentHolding?.name ?? 'nieznanego koncernu';

  return {
    title: `Kto stoi za marką ${node.name}? – KtoStoiZa.pl`,
    description: `Dowiedz się, kto jest właścicielem marki ${node.name}. Należy do koncernu ${parentName}. ${brandNode.history ?? ''}`.slice(0, 155),
    keywords: [node.name, parentName, 'AGD', 'właściciel marki', 'kto produkuje', 'KtoStoiZa'],
    openGraph: {
      title: `${node.name} – właściciel i fabryki | KtoStoiZa.pl`,
      description: `Sprawdź, kto stoi za marką ${node.name} i gdzie są produkowane jej urządzenia.`,
      siteName: 'KtoStoiZa.pl',
      type: 'article',
      url: `https://ktostoiza.pl/marka/${slug}`,
    },
    alternates: {
      canonical: `https://ktostoiza.pl/marka/${slug}`,
    },
  };
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function BrandPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const node = dataset.nodes.find(n => n.type === 'brand' && n.seo_slug === slug);

  if (!node || node.type !== 'brand') notFound();

  const brandNode = node as typeof dataset.nodes[number] & {
    origin?: string;
    history?: string;
    factories_pl?: string[];
    segment?: string;
  };

  const parentHolding = dataset.nodes.find(h => h.id === ('parentId' in node ? node.parentId : ''));

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <Link href="/" className="text-blue-600 font-black text-xl tracking-tight hover:opacity-80 transition-opacity">
          <span>Kto</span><span className="text-slate-800">Stoi</span><span>Za</span>
          <span className="text-slate-400">.pl</span>
        </Link>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12">
        {/* Brand header */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 mb-6 text-center">
          {/* Logo */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://logo.clearbit.com/${node.name.toLowerCase().replace(/\s/g, '')}.com`}
            alt={`Logo ${node.name}`}
            className="w-20 h-20 object-contain mx-auto mb-4 rounded-2xl"
          />
          <h1 className="text-4xl font-black text-slate-900 mb-2">{node.name}</h1>
          <p className="text-slate-500 font-medium">
            {brandNode.origin} · Segment: {brandNode.segment ?? 'Standard'}
          </p>
        </div>

        {/* Ownership card */}
        {parentHolding && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-4">
            <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Właściciel</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xl font-black text-slate-900">{parentHolding.name}</p>
                <p className="text-sm text-slate-500 mt-0.5">{'country' in parentHolding ? parentHolding.country : ''}</p>
              </div>
              <Link
                href="/"
                className="px-5 py-2 bg-slate-800 text-white text-sm font-bold rounded-xl hover:bg-slate-700 transition-colors"
              >
                Zobacz na mapie →
              </Link>
            </div>
          </div>
        )}

        {/* History */}
        {brandNode.history && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-4">
            <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Historia i profil</h2>
            <p className="text-slate-700 leading-relaxed font-medium">{brandNode.history}</p>
          </div>
        )}

        {/* Factories */}
        {brandNode.factories_pl && brandNode.factories_pl.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-4">
            <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Produkcja w Polsce</h2>
            <div className="flex flex-wrap gap-2">
              {brandNode.factories_pl.map(city => (
                <span key={city} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg text-sm font-bold">
                  📍 {city}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="text-center mt-10">
          <Link href="/" className="text-blue-600 font-bold hover:underline">
            ← Wróć do interaktywnej mapy
          </Link>
        </div>
      </main>
    </div>
  );
}
