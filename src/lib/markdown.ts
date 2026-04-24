import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const newsDirectory = path.join(process.cwd(), 'src/data/news');
const blogDirectory = path.join(process.cwd(), 'src/data/blog');

export interface MarkdownPost {
  slug: string;
  title: string;
  date: string;
  content: string;
  relatedBrands?: string[];
  category?: string;
}

export function getPosts(dir: string): MarkdownPost[] {
  if (!fs.existsSync(dir)) return [];
  
  const fileNames = fs.readdirSync(dir);
  const allPosts = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(dir, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const matterResult = matter(fileContents);

      return {
        slug,
        title: matterResult.data.title,
        date: matterResult.data.date,
        content: matterResult.content,
        relatedBrands: matterResult.data.relatedBrands || [],
        category: matterResult.data.category,
      };
    });

  return allPosts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getNews() {
  return getPosts(newsDirectory);
}

export function getBlogPosts() {
  return getPosts(blogDirectory);
}

export function getPostBySlug(dir: string, slug: string): MarkdownPost | null {
  const fullPath = path.join(dir, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);

  return {
    slug,
    title: matterResult.data.title,
    date: matterResult.data.date,
    content: matterResult.content,
    relatedBrands: matterResult.data.relatedBrands || [],
    category: matterResult.data.category,
  };
}
