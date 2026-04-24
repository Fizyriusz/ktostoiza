import { NextResponse } from 'next/server';
import { getNews, getBlogPosts } from '@/lib/markdown';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const brandId = searchParams.get('brandId');
  
  if (!brandId) return NextResponse.json({ news: [], blogs: [] });

  const allNews = getNews();
  const allBlogs = getBlogPosts();

  const relatedNews = allNews.filter(n => n.relatedBrands?.includes(brandId));
  const relatedBlogs = allBlogs.filter(b => 
    b.relatedBrands?.includes(brandId) || b.slug.includes(brandId.replace('b-', '').replace('h-', ''))
  );

  return NextResponse.json({ news: relatedNews, blogs: relatedBlogs });
}
