import ifetch from '@/utils/ifetch';

export const runtime = 'edge';

export default async function sitemap() {
  const now = new Date();
  const baseUrl = 'https://rollingsagas.com';
  const siteMap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1,
    },
  ];
  const [error, res] = await ifetch('/s/_/public?take=100&skip=0');
  if (!error) {
    res.stories?.forEach((s) =>
      siteMap.push({
        url: `${baseUrl}/st/${s.id}`,
        lastModified: now,
        changeFrequency: 'daily',
        priority: 0.7,
      })
    );
  }
  return siteMap;
}
