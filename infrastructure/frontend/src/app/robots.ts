import type { MetadataRoute } from 'next'

import { publicUrl } from '../../utils/tools'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${publicUrl}/sitemap.xml`,
  }
}
