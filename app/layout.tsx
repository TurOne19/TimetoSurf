import type { Metadata, Viewport } from 'next'
import './globals.css'

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'https://timetosurf.ee').replace(/\/$/, '')
const regUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSf-HIXlcSpWy0v0MfJ7HpFNcn_fGDd2Hns2JeHe4kZkNVtqDA/viewform'

export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#0B3D6B' }

const defaultMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Laste surfilaager Tallinnas 2026 | Time to Surf Stroomi',
    template: '%s | Time to Surf',
  },
  description: 'Time to Surf on laste surfilaager Stroomi rannas Tallinnas. Suvelaager 7-14-aastastele: väikesed grupid, professionaalsed juhendajad, päästevestid, märgülikonnad ja toitlustus. Suvi 2026, alates 190 €.',
  applicationName: 'Time to Surf',
  authors: [{ name: 'Time to Surf', url: siteUrl }],
  creator: 'Time to Surf',
  publisher: 'Time to Surf',
  keywords: [
    'lastelaager Tallinn', 'surfilaager lastele', 'suvelaager Tallinn', 'spordilaager Tallinn',
    'Stroomi lastelaager', 'laste surfilaager Tallinn', 'laste suvelaager mere ääres',
    'детский лагерь Таллин', 'летний лагерь Таллин', 'серфинг лагерь для детей',
    'kids summer camp Tallinn', 'surf camp Tallinn', 'Stroomi rand', 'Time to Surf',
  ],
  alternates: { canonical: '/' },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  },
  openGraph: {
    title: 'Laste surfilaager Tallinnas - Time to Surf',
    description: 'Turvaline ja aktiivne suvelaager Stroomi rannas 7-14-aastastele. Surf, meri, sõbrad ja professionaalsed juhendajad. Suvi 2026.',
    url: '/',
    type: 'website',
    locale: 'et_EE',
    alternateLocale: ['ru_RU', 'en_GB'],
    siteName: 'Time to Surf',
    images: [{ url: '/og-hero.jpg', width: 1200, height: 630, alt: 'Time to Surf laste surfilaager Stroomi rannas Tallinnas' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Laste surfilaager Tallinnas - Time to Surf',
    description: 'Suvelaager Stroomi rannas 7-14-aastastele. Surf, meri, sõbrad ja turvaline keskkond.',
    images: ['/og-hero.jpg'],
  },
  category: 'laste spordilaager',
  manifest: '/manifest.webmanifest',
  icons: { icon: '/favicon.png', shortcut: '/favicon.png', apple: '/favicon.png' },
  other: {
    'content-language': 'et-EE',
    'geo.region': 'EE-37',
    'geo.placename': 'Time to Surf Stroomi, Tallinn',
    'geo.position': '59.4363311;24.6806022',
    ICBM: '59.4363311, 24.6806022',
  },
}

async function getSeoSettings() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key) return {}
    const names = 'seo_title_et,seo_description_et,og_title_et,og_description_et,registration_url,phone'
    const res = await fetch(`${url}/rest/v1/site_settings?select=key,value&key=in.(${names})`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      next: { revalidate: 300 },
    })
    if (!res.ok) return {}
    const rows = await res.json()
    const out: Record<string, string> = {}
    if (Array.isArray(rows)) rows.forEach((row) => { if (row?.key) out[row.key] = row.value || '' })
    return out
  } catch { return {} }
}

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoSettings()
  const title = seo.seo_title_et || defaultMetadata.title
  const description = seo.seo_description_et || defaultMetadata.description
  return {
    ...defaultMetadata,
    title,
    description,
    openGraph: {
      ...defaultMetadata.openGraph,
      title: seo.og_title_et || seo.seo_title_et || defaultMetadata.openGraph?.title,
      description: seo.og_description_et || seo.seo_description_et || defaultMetadata.openGraph?.description,
    },
    twitter: {
      ...defaultMetadata.twitter,
      title: seo.og_title_et || seo.seo_title_et || defaultMetadata.twitter?.title,
      description: seo.og_description_et || seo.seo_description_et || defaultMetadata.twitter?.description,
    },
  }
}

const schemaOrg = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['LocalBusiness', 'SportsActivityLocation'],
      '@id': `${siteUrl}/#organization`,
      name: 'Time to Surf Stroomi',
      alternateName: ['Time to Surf', 'Time to Surf lastelaager'],
      url: siteUrl,
      logo: `${siteUrl}/favicon.png`,
      image: [`${siteUrl}/og-hero.jpg`, `${siteUrl}/optimized/dsc02825.webp`],
      telephone: '+37255512872',
      email: 'info@timetosurf.ee',
      priceRange: '190-265 EUR',
      description: 'Laste surfilaager ja suvelaager Stroomi rannas Tallinnas. Turvaline veesport, väikesed grupid ja professionaalsed juhendajad.',
      address: { '@type': 'PostalAddress', streetAddress: 'Stroomi rand', addressLocality: 'Tallinn', addressRegion: 'Harjumaa', addressCountry: 'EE' },
      geo: { '@type': 'GeoCoordinates', latitude: 59.4363311, longitude: 24.6806022 },
      hasMap: 'https://www.google.com/maps/place/Time+to+Surf+Stroomi/@59.4363311,24.6806022,15z',
      areaServed: [{ '@type': 'City', name: 'Tallinn' }, { '@type': 'AdministrativeArea', name: 'Harjumaa' }],
      knowsLanguage: ['et', 'ru', 'en'],
      sameAs: ['https://timetosurf.ee', 'https://www.instagram.com/timetosurf.ee', 'https://www.facebook.com/timetosurf.ee'],
    },
    {
      '@type': 'Event',
      '@id': `${siteUrl}/#summer-camp-2026`,
      name: 'Time to Surf laste surfilaager Tallinnas 2026',
      description: 'Laste surfilaager 7-14-aastastele Stroomi rannas. Surf, veesport, ohutus, toitlustus ja juhendajad.',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      eventStatus: 'https://schema.org/EventScheduled',
      startDate: '2026-06-15',
      endDate: '2026-08-21',
      image: [`${siteUrl}/og-hero.jpg`],
      location: {
        '@type': 'Place', name: 'Time to Surf Stroomi',
        address: { '@type': 'PostalAddress', streetAddress: 'Stroomi rand', addressLocality: 'Tallinn', addressCountry: 'EE' },
        geo: { '@type': 'GeoCoordinates', latitude: 59.4363311, longitude: 24.6806022 },
      },
      organizer: { '@id': `${siteUrl}/#organization` },
      offers: {
        '@type': 'AggregateOffer', url: regUrl, lowPrice: '190', highPrice: '265', priceCurrency: 'EUR',
        availability: 'https://schema.org/LimitedAvailability', offerCount: '3',
      },
      audience: { '@type': 'PeopleAudience', suggestedMinAge: 7, suggestedMaxAge: 14 },
      inLanguage: ['et', 'ru', 'en'],
    },
    {
      '@type': 'FAQPage', '@id': `${siteUrl}/#faq`, inLanguage: 'et',
      mainEntity: [
        { '@type': 'Question', name: 'Kas surfikogemus on vajalik?', acceptedAnswer: { '@type': 'Answer', text: 'Ei. Laager sobib algajatele ja juhendajad õpetavad kõike samm-sammult.' } },
        { '@type': 'Question', name: 'Millisele vanusele laager sobib?', acceptedAnswer: { '@type': 'Answer', text: 'Laager sobib 7-14-aastastele lastele. Grupid on väikesed, tavaliselt 12-16 last.' } },
        { '@type': 'Question', name: 'Mis on hinna sees?', acceptedAnswer: { '@type': 'Answer', text: 'Programm, toitlustus, märgülikond, päästevest, varustus ja juhendajate töö.' } },
        { '@type': 'Question', name: 'Kus laager toimub?', acceptedAnswer: { '@type': 'Answer', text: 'Laager toimub Time to Surf surfijaamas Stroomi rannas Tallinnas.' } },
      ],
    },
    {
      '@type': 'WebSite', '@id': `${siteUrl}/#website`, url: siteUrl, name: 'Time to Surf',
      inLanguage: ['et', 'ru', 'en'], publisher: { '@id': `${siteUrl}/#organization` },
    },
    {
      '@type': 'WebPage', '@id': `${siteUrl}/#webpage`, url: siteUrl,
      name: 'Laste surfilaager Tallinnas 2026 | Time to Surf Stroomi', inLanguage: ['et', 'ru', 'en'],
      isPartOf: { '@id': `${siteUrl}/#website` }, about: { '@id': `${siteUrl}/#organization` },
      primaryImageOfPage: { '@type': 'ImageObject', url: `${siteUrl}/og-hero.jpg`, width: 1200, height: 630 },
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="et">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }} />
      </head>
      <body>{children}</body>
    </html>
  )
}
