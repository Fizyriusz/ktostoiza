import React from 'react';
import Link from 'next/link';
import dataset from '@/data/dataset.json';
import { SHOW_OEM } from '@/config/features';

/**
 * Treść podstrony /marka/[slug] renderowana po stronie serwera.
 *
 * Sama mapa jest komponentem klienckim, więc dokument HTML nie zawierał nic
 * poza tytułem i JSON-LD — wszystko, co wiemy o marce, siedziało w datasecie
 * i nigdy nie trafiało do crawlera. Ta sekcja wystawia te dane jako zwykły
 * tekst i przy okazji linkuje węzły między sobą.
 */

export interface NodeLike {
  id: string;
  type: string;
  name: string;
  seo_slug?: string;
  country?: string;
  origin?: string;
  description?: string;
  history?: string;
  segment?: string;
  parentId?: string;
  factories_pl?: string[];
  founded_year?: number;
  business_structure?: string;
  acquisition_history?: string;
  product_range?: string;
  product_categories?: string[];
  producedBy?: string[];
  availableInPL?: boolean;
  scope?: string;
  isOEM?: boolean;
}

const nodes = dataset.nodes as NodeLike[];
const byId = new Map(nodes.map(n => [n.id, n]));

const TYPE_LABEL: Record<string, string> = {
  brand: 'Marka',
  holding: 'Koncern',
  manufacturer: 'Fabryka (OEM)',
};

function hasRealFactories(list?: string[]) {
  return Array.isArray(list) && list.some(f => !f.toLowerCase().includes('brak'));
}

function NodeLink({ node }: { node: NodeLike }) {
  if (!node.seo_slug) return <span className="font-bold text-slate-800">{node.name}</span>;
  return (
    <Link
      href={`/marka/${node.seo_slug}`}
      className="font-bold text-blue-600 hover:text-blue-700 underline decoration-blue-200 underline-offset-2"
    >
      {node.name}
    </Link>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-sm">
      <h2 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-4 pb-3 border-b border-slate-100">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="py-2.5 border-b border-slate-100 last:border-0 sm:grid sm:grid-cols-[minmax(0,11rem)_1fr] sm:gap-4">
      <dt className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1 sm:mb-0">
        {label}
      </dt>
      <dd className="text-slate-700 font-medium text-[15px] leading-relaxed">{children}</dd>
    </div>
  );
}

export default function NodeArticle({ node }: { node: NodeLike }) {
  const isBrand = node.type === 'brand';
  const isHolding = node.type === 'holding';
  const origin = isBrand ? node.origin : node.country;
  const parent = node.parentId ? byId.get(node.parentId) : undefined;

  // Marki należące do tego węzła — dla koncernu portfolio, dla fabryki zlecenia.
  const children = isHolding ? nodes.filter(n => n.parentId === node.id) : [];
  const producedHere = nodes.filter(n => n.producedBy?.includes(node.id));

  // Rodzeństwo marki pod tym samym koncernem — czysty zysk w linkowaniu wewnętrznym.
  const siblings = isBrand && parent ? nodes.filter(n => n.parentId === parent.id && n.id !== node.id) : [];

  const producers = (node.producedBy ?? [])
    .map(id => byId.get(id))
    .filter((n): n is NodeLike => Boolean(n));

  const heading = isBrand
    ? `Kto stoi za marką ${node.name}?`
    : isHolding
      ? `${node.name} — jakie marki należą do koncernu?`
      : `${node.name} — dla kogo produkuje ta fabryka?`;

  return (
    <article
      id="o-marce"
      className="relative z-20 bg-[#f8fafc] border-t border-slate-200 scroll-mt-4"
    >
      <div className="max-w-3xl mx-auto px-6 py-12 sm:py-16">
        <header className="mb-8">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-600 mb-3">
            {TYPE_LABEL[node.type] ?? 'Wpis'}
          </p>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-4">
            {heading}
          </h1>
          <p className="text-slate-600 text-lg font-medium leading-relaxed">
            {isBrand ? (
              parent ? (
                <>
                  {node.name} to marka o rodowodzie {origin ? <>z kraju: {origin}</> : 'nieustalonym'},
                  która w naszej bazie przypisana jest do <NodeLink node={parent} />.
                </>
              ) : (
                <>
                  {node.name} to marka o rodowodzie {origin ? <>z kraju: {origin}</> : 'nieustalonym'}.
                </>
              )
            ) : (
              <>
                {node.name} — {TYPE_LABEL[node.type]?.toLowerCase()} z kraju: {origin || 'nieustalony'}.
              </>
            )}
          </p>
        </header>

        <div className="flex flex-col gap-5">
          <Section title="Kluczowe fakty">
            <dl>
              <Fact label="Typ wpisu">{TYPE_LABEL[node.type] ?? node.type}</Fact>
              {origin && <Fact label={isBrand ? 'Pochodzenie' : 'Kraj'}>{origin}</Fact>}
              {parent && (
                <Fact label="Właściciel / grupa">
                  <NodeLink node={parent} />
                </Fact>
              )}
              {node.segment && <Fact label="Segment">{node.segment}</Fact>}
              {node.founded_year && <Fact label="Rok założenia">{node.founded_year}</Fact>}
              {node.business_structure && <Fact label="Struktura">{node.business_structure}</Fact>}
              {node.product_range && <Fact label="Zakres produktów">{node.product_range}</Fact>}
              {node.scope && (
                <Fact label="Zasięg">{node.scope === 'global' ? 'Globalny' : 'Regionalny'}</Fact>
              )}
              {isBrand && (
                <Fact label="Dostępność w Polsce">
                  {node.availableInPL === false ? 'Niedostępna w Polsce' : 'Dostępna w Polsce'}
                </Fact>
              )}
              {SHOW_OEM && isHolding && node.isOEM && (
                <Fact label="Produkcja kontraktowa">Koncern świadczy usługi OEM dla marek zewnętrznych</Fact>
              )}
            </dl>
          </Section>

          {(node.history || node.description) && (
            <Section title="Historia i profil">
              <p className="text-slate-600 text-[15px] leading-relaxed font-medium">
                {node.history || node.description}
              </p>
              {node.acquisition_history && (
                <div className="mt-5 pt-5 border-t border-slate-100">
                  <h3 className="text-[11px] font-black uppercase text-slate-400 mb-2 tracking-wider">
                    Historia przejęć
                  </h3>
                  <p className="text-slate-600 text-[15px] leading-relaxed font-medium">
                    {node.acquisition_history}
                  </p>
                </div>
              )}
            </Section>
          )}

          {isBrand && (
            <Section title="Produkcja w Polsce">
              {hasRealFactories(node.factories_pl) ? (
                <ul className="flex flex-col gap-2">
                  {node.factories_pl!.map(city => (
                    <li
                      key={city}
                      className="text-slate-700 font-semibold text-[15px] bg-emerald-50 border border-emerald-100 rounded-lg px-4 py-2.5"
                    >
                      {city}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-500 font-medium text-[15px]">
                  Marka {node.name} nie posiada zakładów produkcyjnych na terenie Polski.
                </p>
              )}
            </Section>
          )}

          {SHOW_OEM && producers.length > 0 && (
            <Section title="Realna produkcja (OEM)">
              <p className="text-slate-600 font-medium text-[15px] mb-4 leading-relaxed">
                Sprzęt sygnowany logo {node.name} powstaje z wykorzystaniem zaplecza
                następujących podmiotów:
              </p>
              <ul className="flex flex-col gap-2">
                {producers.map(p => (
                  <li key={p.id} className="text-[15px] bg-slate-50 border border-slate-100 rounded-lg px-4 py-2.5">
                    <NodeLink node={p} />
                    {p.country && <span className="text-slate-400 font-medium"> — {p.country}</span>}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {node.product_categories && node.product_categories.length > 0 && (
            <Section title="Kategorie produktowe">
              <ul className="flex flex-wrap gap-2">
                {node.product_categories.map(cat => (
                  <li
                    key={cat}
                    className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 text-[13px] font-bold"
                  >
                    {cat}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {children.length > 0 && (
            <Section title={`Marki w portfolio (${children.length})`}>
              <ul className="flex flex-wrap gap-x-4 gap-y-2">
                {children.map(c => (
                  <li key={c.id} className="text-[15px]">
                    <NodeLink node={c} />
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {SHOW_OEM && !isHolding && producedHere.length > 0 && (
            <Section title={`Marki korzystające z tego zaplecza (${producedHere.length})`}>
              <ul className="flex flex-wrap gap-x-4 gap-y-2">
                {producedHere.map(c => (
                  <li key={c.id} className="text-[15px]">
                    <NodeLink node={c} />
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {siblings.length > 0 && (
            <Section title={`Pozostałe marki grupy ${parent!.name} (${siblings.length})`}>
              <ul className="flex flex-wrap gap-x-4 gap-y-2">
                {siblings.map(s => (
                  <li key={s.id} className="text-[15px]">
                    <NodeLink node={s} />
                  </li>
                ))}
              </ul>
            </Section>
          )}
        </div>

        <footer className="mt-10 pt-8 border-t border-slate-200 flex flex-wrap items-center gap-4">
          <Link
            href="/"
            className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors"
          >
            Zobacz pełną mapę powiązań
          </Link>
          <Link href="/blog" className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">
            Blog
          </Link>
          <Link href="/news" className="text-sm font-bold text-slate-500 hover:text-rose-600 transition-colors">
            Newsroom
          </Link>
        </footer>
      </div>
    </article>
  );
}
