import React from 'react';
import Link from 'next/link';
import { getNews } from '@/lib/markdown';
import { ChevronRight, Calendar, BookOpen } from 'lucide-react';
import NetworkLogo from '@/components/ui/NetworkLogo';
import ReactMarkdown from 'react-markdown';

export const metadata = {
  title: 'Newsroom | KtoStoiZa.pl',
  description: 'Najnowsze wydarzenia, fuzje i przejęcia na rynku AGD/RTV.',
  openGraph: {
    title: 'Newsroom KtoStoiZa',
    description: 'Najnowsze wydarzenia z branży AGD.',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }]
  }
};

export default function NewsroomIndex() {
  const news = getNews();

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans">
      <header className="bg-slate-900 border-b border-slate-800 py-6 px-6 sm:px-12 flex items-center justify-between sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="bg-slate-800 rounded-xl p-2 group-hover:bg-slate-700 transition-colors">
            <NetworkLogo className="w-8 h-8 text-fuchsia-400" />
          </div>
          <h1 className="text-2xl font-black tracking-tight leading-none text-white">
            Newsroom
          </h1>
        </Link>
        <div className="flex gap-4 items-center">
          <Link href="/blog" className="text-sm font-bold text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" /> Blog
          </Link>
          <Link href="/" className="px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-bold hover:bg-rose-500 transition-colors">
            Powrót do Mapy
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto py-12 px-6">
        <div className="mb-10 text-center">
           <h2 className="text-4xl font-black text-slate-800 mb-3 tracking-tight">Ostatnie Wydarzenia</h2>
           <p className="text-slate-500 font-medium">Bądź na bieżąco z najważniejszymi zmianami właścicielskimi.</p>
        </div>
        
        <div className="flex flex-col gap-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
          {news.map((item, index) => (
            <article key={item.slug} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-100 group-hover:bg-rose-100 text-slate-500 group-hover:text-rose-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-colors">
                 <Calendar className="w-4 h-4" />
              </div>
              
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-black text-[10px] text-rose-500 uppercase tracking-wider">{item.date}</span>
                </div>
                <h3 className="font-bold text-lg text-slate-800 mb-2 leading-tight">
                  {item.title}
                </h3>
                <div className="prose prose-sm prose-slate line-clamp-3 text-slate-500">
                  <ReactMarkdown>{item.content}</ReactMarkdown>
                </div>
              </div>
            </article>
          ))}
          {news.length === 0 && (
             <div className="text-center py-12 text-slate-400 relative z-10">
               Jeszcze nie ma wydarzeń w Newsroomie.
             </div>
          )}
        </div>
      </main>
    </div>
  );
}
