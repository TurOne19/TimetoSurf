import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Time to Surf - laste surfilaager Tallinnas',
    short_name: 'Time to Surf',
    description: 'Laste surfilaager Stroomi rannas Tallinnas.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0B3D6B',
    lang: 'et',
    icons: [{ src: '/favicon.png', sizes: '512x512', type: 'image/png', purpose: 'any' }],
  }
}
