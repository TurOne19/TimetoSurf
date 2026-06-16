import type { Metadata, Viewport } from 'next'
import './globals.css'

const siteUrl = 'https://camp.timetosurf.ee'
const regUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSf-HIXlcSpWy0v0MfJ7HpFNcn_fGDd2Hns2JeHe4kZkNVtqDA/viewform'

export const viewport: Viewport = { width: 'device-width', initialScale: 1 }

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Детский лагерь в Таллине у моря | Time to Surf - Stroomi rand 2026',
    template: '%s | Time to Surf',
  },
  description:
    'Time to Surf - детский летний серфинг лагерь в Таллине на Stroomi rand. Возраст 7-14 лет, малые группы 12-16 детей, жилеты, гидрокостюмы, питание и инструкторы включены. Kids summer camp Tallinn, surfilaager lastele, suvelaager Tallinn.',
  keywords: [
    'детский лагерь Таллин',
    'летний лагерь Таллин',
    'серфинг лагерь для детей',
    'детский спортивный лагерь',
    'лагерь у моря Таллин',
    'lastelaager Tallinn',
    'surfilaager lastele',
    'suvelaager Tallinn',
    'spordilaager Tallinn',
    'Stroomi lastelaager',
    'kids summer camp Tallinn',
    'surf camp Tallinn',
    'Stroomi rand',
    'Time to Surf',
  ],
  alternates: { canonical: siteUrl },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    title: 'Time to Surf - детский лагерь у моря в Таллине',
    description:
      'Летний серфинг лагерь для детей 7-14 лет на Stroomi rand. Малые группы, инструкторы, жилеты, гидрокостюмы и питание включены.',
    url: siteUrl,
    type: 'website',
    locale: 'ru_RU',
    siteName: 'Time to Surf',
    images: [
      {
        url: '/optimized/dsc02825.webp',
        width: 1000,
        height: 667,
        alt: 'Детский серфинг лагерь Time to Surf на Stroomi rand в Таллине',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Time to Surf - kids summer camp Tallinn',
    description:
      'Surf camp Tallinn for children 7-14 at Stroomi Beach. Small groups, instructors, wetsuits, life jackets and meals included.',
    images: ['/optimized/dsc02825.webp'],
  },
  category: 'sports camp',
  other: {
    'geo.region': 'EE-37',
    'geo.placename': 'Tallinn, Stroomi rand',
    'geo.position': '59.4316;24.6836',
    ICBM: '59.4316, 24.6836',
    'og:locality': 'Tallinn',
    'og:country-name': 'Estonia',
  },
}

const schemaOrg = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['LocalBusiness', 'SportsActivityLocation'],
      '@id': `${siteUrl}/#organization`,
      name: 'Time to Surf',
      url: siteUrl,
      image: `${siteUrl}/optimized/dsc02825.webp`,
      logo: `${siteUrl}/logo.jpeg`,
      telephone: '+37255512872',
      email: 'info@timetosurf.ee',
      priceRange: '190-265 EUR',
      description:
        'Детский летний серфинг лагерь Time to Surf на пляже Stroomi rand в Таллине. Kids summer camp Tallinn, surfilaager lastele, suvelaager Tallinn.',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Stroomi rand',
        addressLocality: 'Tallinn',
        addressCountry: 'EE',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 59.4316,
        longitude: 24.6836,
      },
      areaServed: ['Tallinn', 'Estonia', 'Stroomi rand', 'Põhja-Tallinn'],
      sameAs: [
        'https://timetosurf.ee',
        'https://www.instagram.com/timetosurf.ee',
        'https://www.facebook.com/timetosurf.ee',
      ],
    },
    {
      '@type': 'Event',
      '@id': `${siteUrl}/#summer-camp-2026`,
      name: 'Time to Surf детский летний лагерь 2026',
      description:
        'Серфинг лагерь для детей 7-14 лет в Таллине на Stroomi rand. Малые группы, инструкторы, жилеты, гидрокостюмы и питание включены.',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      eventStatus: 'https://schema.org/EventScheduled',
      startDate: '2026-06-15',
      endDate: '2026-08-21',
      image: [`${siteUrl}/optimized/dsc02825.webp`],
      location: {
        '@type': 'Place',
        name: 'Stroomi rand',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Tallinn',
          addressCountry: 'EE',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 59.4316,
          longitude: 24.6836,
        },
      },
      organizer: { '@id': `${siteUrl}/#organization` },
      offers: {
        '@type': 'Offer',
        url: regUrl,
        price: '265',
        priceCurrency: 'EUR',
        availability: 'https://schema.org/LimitedAvailability',
        validFrom: '2026-01-01',
      },
      audience: {
        '@type': 'PeopleAudience',
        suggestedMinAge: 7,
        suggestedMaxAge: 14,
      },
    },
    {
      '@type': 'FAQPage',
      '@id': `${siteUrl}/#faq`,
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Нужен ли опыт серфинга?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Нет. Лагерь подходит новичкам. Инструкторы объясняют правила и помогают детям спокойно зайти в воду.',
          },
        },
        {
          '@type': 'Question',
          name: 'Какой возраст подходит?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Основной возраст - 7-14 лет. Группы маленькие, 12-16 детей.',
          },
        },
        {
          '@type': 'Question',
          name: 'Что входит в цену?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Программа, питание, гидрокостюм, спасательный жилет, оборудование и работа инструкторов.',
          },
        },
        {
          '@type': 'Question',
          name: 'Где проходит лагерь?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Лагерь проходит на Stroomi rand в Таллине, Эстония.',
          },
        },
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: siteUrl,
      name: 'Time to Surf',
      inLanguage: ['ru', 'et', 'en'],
      publisher: { '@id': `${siteUrl}/#organization` },
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <link rel="canonical" href={siteUrl} />
        <link rel="preload" as="image" href="/optimized/dsc02825.webp" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
