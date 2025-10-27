import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'PhilHealth Transparency Portal',
    short_name: 'PhilHealth',
    description: 'Official transparency and accountability portal for PhilHealth - Providing public access to financial records, claims data, and governance information.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#009a3d',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
