import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPostBySlug, getBlogPosts } from '@/lib/markdown';
import ReactMarkdown from 'react-markdown';
import { ChevronLeft, Calendar } from 'lucide-react';
import NetworkLogo from '@/components/ui/NetworkLogo';
import Head from 'next/head';

export async function generateStaticParams() {
  const posts = getBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = getPostBySlug('src/data/blog', params.slug);
  if (!post) {
    return { title: 'Nie znaleziono artykułu | KtoStoiZa' };
  }
  return {
    title: `${post.title} | Blog KtoStoiZa`,
    description: post.content.substring(0, 150) + '...',
  };
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = getPostBySlug('src/data/blog', params.slug);

  if (!post) {
    notFound();
  }

  // Schema.org Breadcrumbs
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [{
      "@type": "ListItem",
      "position": 1,
      "name": "KtoStoiZa",
      "item": "https://ktostoiza.pl"
    },{
      "@type": "ListItem",
      "position": 2,
      "name": "Blog",
      "item": "https://ktostoiza.pl/blog"
    },{
      "@type": "ListItem",
      "position": 3,
      "name": post.title
    }]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans">
        <header className="bg-white border-b border-slate-200 py-6 px-6 sm:px-12 flex items-center justify-between sticky top-0 z-50">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-slate-50 rounded-xl p-2 group-hover:bg-blue-50 transition-colors">
              <NetworkLogo className="w-8 h-8" />
            </div>
            <h1 className="text-xl font-black tracking-tight leading-none hidden sm:block">
              <span className="text-blue-600">Kto</span>
              <span className="text-slate-800">Stoi</span>
              <span className="text-blue-600">Za</span>
            </h1>
          </Link>
          <div className="flex gap-4 items-center">
            <Link href="/blog" className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-200 transition-colors flex items-center gap-1.5">
              <ChevronLeft className="w-4 h-4" /> Powrót do Bloga
            </Link>
          </div>
        </header>

        <main className="max-w-3xl mx-auto py-12 px-6">
          <article className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm">
            <header className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-wider rounded-md">
                  {post.category || 'Artykuł'}
                </span>
                <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                  {post.date}
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-black text-slate-800 tracking-tight leading-tight">
                {post.title}
              </h1>
            </header>

            <div className="prose prose-slate prose-lg max-w-none prose-headings:font-bold prose-a:text-blue-600 hover:prose-a:text-blue-500">
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>
          </article>
        </main>
      </div>
    </>
  );
}
