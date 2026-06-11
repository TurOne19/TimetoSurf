import type { Metadata, Viewport } from 'next'
import { supabase } from '@/lib/supabase'
import './globals.css'

const fallbackTitle = 'Детский серфинг-лагерь Time to Surf в Таллине | Лето 2026'
const fallbackDescription =
  'Time to Surf: детский серфинг-лагерь у моря в Таллине. Водные виды спорта, безопасность, инструкторы, питание и активное лето для детей 7-14 лет.'

export const viewport: Viewport = { width: 'device-width', initialScale: 1 }

async function getSettings() {
  try {
    const { data } = await supabase.from('site_settings').select('*')
    const settings: Record<string, string> = {}
    data?.forEach((row: { key: string; value: string }) => {
      settings[row.key] = row.value
    })
    return settings
  } catch {
    return {}
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  const title = settings.seo_title || fallbackTitle
  const description = settings.seo_description || fallbackDescription

  return {
    metadataBase: new URL('https://camp.timetosurf.ee'),
    title,
    description,
    keywords: [
      'детский лагерь Таллин',
      'серфинг лагерь дети',
      'летний лагерь Таллин',
      'Stroomi rand',
      'Time to Surf',
      'surf camp Tallinn',
      'lastelaager Tallinn',
    ],
    openGraph: {
      title,
      description,
      url: 'https://camp.timetosurf.ee',
      type: 'website',
      locale: 'ru_RU',
      siteName: 'Time to Surf Camp',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: { index: true, follow: true },
    alternates: { canonical: 'https://camp.timetosurf.ee' },
  }
}

const schemaOrg = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SportsOrganization',
      '@id': 'https://camp.timetosurf.ee/#organization',
      name: 'Time to Surf',
      url: 'https://camp.timetosurf.ee',
      telephone: '+37255512872',
      email: 'info@timetosurf.ee',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Stroomi rand',
        addressLocality: 'Tallinn',
        addressCountry: 'EE',
      },
      priceRange: '190€-265€',
      sameAs: [
        'https://www.instagram.com/timetosurf.ee',
        'https://www.facebook.com/timetosurf.ee',
        'https://timetosurf.ee',
      ],
    },
    {
      '@type': 'Event',
      name: 'Детский серфинг-лагерь Time to Surf, лето 2026',
      startDate: '2026-06-15',
      endDate: '2026-08-21',
      location: {
        '@type': 'Place',
        name: 'Stroomi rand',
        address: { '@type': 'PostalAddress', addressLocality: 'Tallinn', addressCountry: 'EE' },
      },
      organizer: { '@id': 'https://camp.timetosurf.ee/#organization' },
      offers: {
        '@type': 'Offer',
        price: '265',
        priceCurrency: 'EUR',
        availability: 'https://schema.org/LimitedAvailability',
      },
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }} />
      </head>
      <body>{children}</body>
    </html>
  )
}
