import type { Metadata, Viewport } from 'next'
import './globals.css'

export const viewport: Viewport = { width: 'device-width', initialScale: 1 }

export const metadata: Metadata = {
  metadataBase: new URL('https://camp.timetosurf.ee'),
  title: {
    default: 'Детский серфинг-лагерь Time to Surf | Таллин — Stroomi rand · Лето 2026',
    template: '%s | Time to Surf Camp Tallinn',
  },
  description: 'Детский серфинг-лагерь на пляже Штромка, Таллин. 3 программы: серфинг + кино, серфинг + поход, серфинг-лагерь. 265€ / 5 дней. Возраст 7–14 лет. Гидрокостюмы, жилеты, питание — всё включено. Laste surfilaager Tallinnas. Kids surf camp Tallinn.',
  keywords: [
    'детский лагерь Таллин', 'летний лагерь Таллин', 'серфинг лагерь для детей',
    'детский спортивный лагерь', 'лагерь у моря Таллин', 'серфинг школа дети Таллин',
    'lastelaager Tallinn', 'surfilaager lastele', 'suvelaager Tallinn',
    'spordilaager Tallinn', 'Stroomi lastelaager', 'surfikool lapsed',
    'kids summer camp Tallinn', 'surf camp Tallinn', 'children surf school Estonia',
    'Time to Surf', 'Stroomi rand laager', 'детский лагерь Штромка',
  ],
  openGraph: {
    title: 'Детский серфинг-лагерь Time to Surf — Таллин, лето 2026',
    description: 'Серфинг, кино, поход. 5 дней на Штромке. 265€, возраст 7–14 лет. Жилеты, гидрокостюмы, питание — всё включено.',
    url: 'https://camp.timetosurf.ee',
    type: 'website',
    locale: 'ru_RU',
    siteName: 'Time to Surf Camp',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Детский серфинг-лагерь Time to Surf — Таллин 2026',
    description: 'Серфинг, кино, поход. 5 дней на Штромке. 265€, возраст 7–14 лет.',
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  alternates: { canonical: 'https://camp.timetosurf.ee' },
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
      description: 'Детский серфинг-лагерь на пляже Штромка в Таллине. Работаем с 2017 года.',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Stroomi rand',
        addressLocality: 'Tallinn',
        addressCountry: 'EE',
      },
      priceRange: '190€–265€',
      sameAs: [
        'https://www.instagram.com/timetosurf.ee',
        'https://www.facebook.com/timetosurf.ee',
        'https://timetosurf.ee',
      ],
    },
    {
      '@type': 'Event',
      name: 'Детский серфинг-лагерь Time to Surf — Лето 2026',
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
        url: 'https://docs.google.com/forms/d/e/1FAIpQLSf-HIXlcSpWy0v0MfJ7HpFNcn_fGDd2Hns2JeHe4kZkNVtqDA/viewform',
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Нужен ли опыт серфинга для участия в лагере?',
          acceptedAnswer: { '@type': 'Answer', text: 'Нет. Лагерь подходит полным новичкам — учим с нуля. Дети с опытом тоже найдут задачу по уровню.' },
        },
        {
          '@type': 'Question',
          name: 'Какой возраст подходит для лагеря?',
          acceptedAnswer: { '@type': 'Answer', text: 'Основная программа для детей 7–12 лет. Максимальный возраст — 14 лет.' },
        },
        {
          '@type': 'Question',
          name: 'Что входит в стоимость?',
          acceptedAnswer: { '@type': 'Answer', text: 'Вся программа, питание от Tark Catering (обед + полдник), гидрокостюмы, спасательные жилеты, всё оборудование, работа инструкторов и сертификат участника.' },
        },
        {
          '@type': 'Question',
          name: 'Как обеспечивается безопасность на воде?',
          acceptedAnswer: { '@type': 'Answer', text: 'Все дети в воде — только в жилете и гидрокостюме. Группы 12–16 человек, постоянный контроль инструкторов, обязательная теория безопасности перед каждым заходом.' },
        },
      ],
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:ital,wght@0,400;0,600;0,700;0,800;1,700;1,800&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
