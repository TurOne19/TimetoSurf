import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL('https://camp.timetosurf.ee'),
  title: {
    default: 'Детский серфинг-лагерь Time to Surf | Таллин — Stroomi rand',
    template: '%s | Time to Surf Laager',
  },
  description:
    'Детский серфинг-лагерь на пляже Штромка, Таллин. Серфинг, кино, поход — 5 дней с профессиональными инструкторами. 265€ / 5 дней. Возраст 7–14 лет. Питание включено.',
  keywords: [
    'детский лагерь Таллин',
    'серфинг лагерь Эстония',
    'lastelaager Tallinn',
    'surf camp Tallinn',
    'Time to Surf laager',
    'детский серфинг Таллин',
    'laste surfilaager',
    'Stroomi rand laager',
    'summer camp Estonia',
    'детский спортивный лагерь',
    'лагерь Штромка',
  ],
  openGraph: {
    title: 'Детский серфинг-лагерь Time to Surf — Таллин, лето 2026',
    description:
      'Серфинг, природа, кино и приключения. 5 дней на пляже Штромка с профессиональными инструкторами. 265€, возраст 7–14 лет.',
    url: 'https://camp.timetosurf.ee',
    siteName: 'Time to Surf Laager',
    locale: 'ru_RU',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Детский серфинг-лагерь Time to Surf | Таллин',
    description:
      'Серфинг, кино, поход — 5 дней лагерь на Штромке. 265€. Возраст 7–14 лет.',
  },
  alternates: {
    canonical: 'https://camp.timetosurf.ee',
    languages: {
      ru: 'https://camp.timetosurf.ee',
      en: 'https://camp.timetosurf.ee',
      et: 'https://camp.timetosurf.ee',
      'x-default': 'https://camp.timetosurf.ee',
    },
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="shortcut icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <link rel="dns-prefetch" href="https://maps.googleapis.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />

        {/* Structured data — Local Business */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SportsOrganization',
              name: 'Time to Surf — Детский лагерь',
              url: 'https://camp.timetosurf.ee',
              telephone: '+37255512872',
              email: 'info@timetosurf.ee',
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'Stroomi rand',
                addressLocality: 'Tallinn',
                addressCountry: 'EE',
              },
              geo: {
                '@type': 'GeoCoordinates',
                latitude: 59.4438,
                longitude: 24.6718,
              },
              openingHoursSpecification: {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                opens: '09:00',
                closes: '17:00',
              },
              sameAs: [
                'https://www.instagram.com/timetosurf.ee',
                'https://www.facebook.com/timetosurf.ee',
                'https://timetosurf.ee',
              ],
              priceRange: '190€–265€',
              description:
                'Детский серфинг-лагерь на пляже Штромка в Таллине. Серфинг, кино, поход. Возраст 7–14 лет.',
            }),
          }}
        />
      </head>
      <body className={inter.variable}>{children}</body>
    </html>
  )
}
