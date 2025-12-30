import type { MetadataRoute } from 'next'

import { publicUrl } from '../../utils/tools'

const buildUrl = (path: string) => `${publicUrl}${path}`

const createRoute = (path: string): MetadataRoute.Sitemap[0] => ({
  url: buildUrl(path),
  lastModified: new Date(),
  alternates: {
    languages: {
      fr: buildUrl(`/fr${path}`),
      en: buildUrl(`/en${path}`),
    },
  },
})

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    // Public
    createRoute('/'),
    createRoute('/confirm'),
    createRoute('/forbidden'),
    createRoute('/unauthorized'),

    // Base client
    createRoute('/home'),
    createRoute('/news'),
    createRoute('/accounts'),
    createRoute('/investments'),
    createRoute('/investments/owned'),
    createRoute('/investments/stocks'),
    createRoute('/transfers'),

    // Advisor
    createRoute('/clients'),
    createRoute('/credits'),

    // Director
    createRoute('/actions'),
    createRoute('/settings'),
    createRoute('/users'),
  ]
}
