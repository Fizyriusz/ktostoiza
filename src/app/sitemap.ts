import { MetadataRoute } from 'next';
import dataset from '@/data/dataset.json';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://ktostoiza.pl';

  // Dynamiczne podstrony /marka/[slug] dla każdej marki z datasetu.
  // Filtr musi odpowiadać temu z generateStaticParams — bez niego węzły bez
  // seo_slug trafiały do sitemapy jako /marka/undefined.
  const brandUrls = dataset.nodes
    .filter((node) => typeof node.seo_slug === 'string' && node.seo_slug.length > 0)
    .map((node) => ({
      url: `${baseUrl}/marka/${node.seo_slug}`,
      lastModified: new Date(dataset.lastUpdate || new Date()),
      changeFrequency: 'weekly' as const,
      // Koncerny są odrobinę ważniejsze dla SEO głównego struktury
      priority: node.type === 'holding' ? 0.9 : 0.8,
    }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(dataset.lastUpdate || new Date()),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/polityka-prywatnosci`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...brandUrls,
  ];
}
