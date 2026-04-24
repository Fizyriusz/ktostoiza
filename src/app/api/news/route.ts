import { NextResponse } from 'next/server';
import { getNews } from '@/lib/markdown';

export async function GET() {
  const news = getNews();
  return NextResponse.json(news.slice(0, 3));
}
