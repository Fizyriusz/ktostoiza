import React from 'react';
import Link from 'next/link';
import { getBlogPosts } from '@/lib/markdown';
import { ChevronRight, Calendar, Newspaper } from 'lucide-react';
import NetworkLogo from '@/components/ui/NetworkLogo';

export const metadata = {
  title: 'Blog | KtoStoiZa.pl',
  description: 'Zbiór artykułów, analiz rynkowych i historii marek z branży AGD/RTV.',
};

export default function BlogIndex() {
  const posts = getBlogPosts();

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans">
      <header className="bg-white border-b border-slate-200 py-6 px-6 sm:px-12 flex items-center justify-between sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="bg-slate-50 rounded-xl p-2 group-hover:bg-blue-50 transition-colors">
            <NetworkLogo className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black tracking-tight leading-none">
            <span className="text-blue-600">Kto</span>
            <span className="text-slate-800">Stoi</span>
            <span className="text-blue-600">Za</span>
            <span className="text-slate-400">.pl</span>
          </h1>
        </Link>
        <div className="flex gap-4 items-center">
          <Link href="/news" className="text-sm font-bold text-slate-500 hover:text-rose-600 transition-colors flex items-center gap-1.5">
            <Newspaper className="w-4 h-4" /> Newsroom
          </Link>
          <Link href="/" className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-bold hover:bg-slate-700 transition-colors">
            Powrót do Mapy
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-12 px-6">
        <h2 className="text-4xl font-black text-slate-800 mb-8 tracking-tight">Najnowsze Artykuły</h2>
        
        <div className="grid gap-6">
          {posts.map(post => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
              <article className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-wider rounded-md">
                    {post.category || 'Artykuł'}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    {post.date}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors mb-2">
                  {post.title}
                </h3>
                <div className="flex items-center gap-1.5 text-sm font-bold text-blue-500 mt-4">
                  Czytaj dalej <ChevronRight className="w-4 h-4" />
                </div>
              </article>
            </Link>
          ))}
          {posts.length === 0 && (
             <div className="text-center py-12 text-slate-400">
               Jeszcze nie ma artykułów.
             </div>
          )}
        </div>
      </main>
    </div>
  );
}
