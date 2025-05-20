export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/dice/', '/test/', '/auth/'],
    },
    sitemap: 'https://rollingsagas.com/sitemap.xml',
  }
}
