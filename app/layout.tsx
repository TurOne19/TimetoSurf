import type { Metadata, Viewport } from 'next'
import './globals.css'

export const viewport: Viewport = { width: 'device-width', initialScale: 1 }

export const metadata: Metadata = {
  metadataBase: new URL('https://camp.timetosurf.ee'),
  title: { default: 'Детский серфинг-лагерь Time to Surf | Таллин — Stroomi rand', template: '%s | Time to Surf' },
  description: 'Детский серфинг-лагерь на пляже Штромка, Таллин. Серфинг, кино, поход — 5 дней с профессиональными инструкторами. 265€ / 5 дней. Возраст 7–14 лет.',
  openGraph: { title: 'Детский серфинг-лагерь Time to Surf — Таллин, лето 2026', description: 'Серфинг, природа, кино. 5 дней на Штромке. 265€, возраст 7–14 лет.', url: 'https://camp.timetosurf.ee', type: 'website' },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap" rel="stylesheet" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org', '@type': 'SportsOrganization',
          name: 'Time to Surf', url: 'https://camp.timetosurf.ee',
          telephone: '+37255512872', email: 'info@timetosurf.ee',
          address: { '@type': 'PostalAddress', streetAddress: 'Stroomi rand', addressLocality: 'Tallinn', addressCountry: 'EE' },
          priceRange: '190€–265€',
        }) }} />
      </head>
      <body>{children}</body>
    </html>
  )
}
