'use client'

import { useEffect, useMemo, useState } from 'react'
import { Lang, getList, getText, parseContent, publicPhotos } from '@/lib/siteContent'

const DEFAULT_REG =
  'https://docs.google.com/forms/d/e/1FAIpQLSf-HIXlcSpWy0v0MfJ7HpFNcn_fGDd2Hns2JeHe4kZkNVtqDA/viewform'

type Review = { id: number; name: string; text: string; program?: string; rating: number }
type Session = {
  id?: number
  dates: string
  type_ru: string
  type_en?: string
  type_et?: string
  color: string
  leaders: string
  hot: boolean
  detail: string
  sort_order?: number
  spots_left?: number | null
  capacity?: number | null
}
type GalleryPhoto = { id?: number; url: string; section: string; sort_order?: number }

const fallbackSessions: Session[] = [
  { dates: '15.06 - 19.06.2026', type_ru: 'Серфинг + кино', type_en: 'Surf + cinema', type_et: 'Surf + kino', color: '#0b5f86', leaders: 'Наташа К. + Даша', hot: true, detail: 'kino', spots_left: 4, capacity: 16 },
  { dates: '29.06 - 03.07.2026', type_ru: 'Серфинг + кино', type_en: 'Surf + cinema', type_et: 'Surf + kino', color: '#0b5f86', leaders: 'Наташа К. + Даша', hot: false, detail: 'kino', spots_left: 8, capacity: 16 },
  { dates: '06.07 - 10.07.2026', type_ru: 'Серфинг лагерь', type_en: 'Surf camp', type_et: 'Surfilaager', color: '#0e7490', leaders: 'Надежда + Григорий', hot: false, detail: 'surf', spots_left: 6, capacity: 16 },
  { dates: '13.07 - 17.07.2026', type_ru: 'Серфинг + поход', type_en: 'Surf + hike', type_et: 'Surf + matk', color: '#16856f', leaders: 'Виталий + Григорий', hot: false, detail: 'hike', spots_left: 7, capacity: 16 },
  { dates: '20.07 - 24.07.2026', type_ru: 'Серфинг лагерь', type_en: 'Surf camp', type_et: 'Surfilaager', color: '#0e7490', leaders: 'Надежда + Ксения', hot: false, detail: 'surf', spots_left: 9, capacity: 16 },
  { dates: '27.07 - 30.07.2026', type_ru: 'Серфинг 4 дня', type_en: 'Surf 4 days', type_et: 'Surf 4 päeva', color: '#0e7490', leaders: 'Команда Time to Surf', hot: false, detail: 'surf', spots_left: 5, capacity: 16 },
  { dates: '03.08 - 07.08.2026', type_ru: 'Серфинг лагерь', type_en: 'Surf camp', type_et: 'Surfilaager', color: '#0e7490', leaders: 'Даша + команда', hot: false, detail: 'surf', spots_left: 10, capacity: 16 },
  { dates: '10.08 - 14.08.2026', type_ru: 'Серфинг лагерь', type_en: 'Surf camp', type_et: 'Surfilaager', color: '#0e7490', leaders: 'Надежда + команда', hot: false, detail: 'surf', spots_left: 10, capacity: 16 },
  { dates: '17.08 - 21.08.2026', type_ru: 'Серфинг + поход', type_en: 'Surf + hike', type_et: 'Surf + matk', color: '#16856f', leaders: 'Виталий + команда', hot: false, detail: 'hike', spots_left: 8, capacity: 16 },
]

const fallbackReviews: Review[] = [
  {
    id: 1,
    name: 'Мария, мама Артёма',
    text: 'Сын впервые так ждал утро. После смены стал смелее на воде и почти не вспоминал про телефон.',
    program: 'Серфинг лагерь',
    rating: 5,
  },
  {
    id: 2,
    name: 'Анна',
    text: 'Понравилось, что всё спокойно и по делу: жилеты, инструкторы рядом, ребёнок уставший и счастливый.',
    program: 'Серфинг + кино',
    rating: 5,
  },
  {
    id: 3,
    name: 'Елена',
    text: 'Очень тёплая команда. Видно, что детям дают свободу, но не отпускают из внимания.',
    program: 'Серфинг + поход',
    rating: 5,
  },
]

function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(entry => entry.isIntersecting && entry.target.classList.add('is-visible')),
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' },
    )
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

export default function Home() {
  const [lang, setLang] = useState<Lang>('ru')
  const [menuOpen, setMenuOpen] = useState(false)
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [sessions, setSessions] = useState<Session[]>(fallbackSessions)
  const [reviews, setReviews] = useState<Review[]>(fallbackReviews)
  const [gallery, setGallery] = useState<GalleryPhoto[]>([])
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [openFaq, setOpenFaq] = useState(0)
  const [reviewForm, setReviewForm] = useState({ name: '', text: '', program: '', rating: 5 })
  const [reviewSent, setReviewSent] = useState(false)

  const content = useMemo(() => parseContent(settings.content_json), [settings.content_json])
  const t = (value: Parameters<typeof getText>[0]) => getText(value, lang)
  const list = (value: Parameters<typeof getList>[0]) => getList(value, lang)
  const regLink = settings.cta_link || DEFAULT_REG

  useReveal()

  useEffect(() => {
    const saved = localStorage.getItem('tts-lang') as Lang | null
    if (saved && ['ru', 'en', 'et'].includes(saved)) setLang(saved)
  }, [])

  useEffect(() => {
    localStorage.setItem('tts-lang', lang)
  }, [lang])

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(d => d && typeof d === 'object' && setSettings(d)).catch(() => {})
    fetch('/api/sessions').then(r => r.json()).then(d => Array.isArray(d) && d.length > 0 && setSessions(d)).catch(() => {})
    fetch('/api/reviews').then(r => r.json()).then(d => Array.isArray(d) && d.length > 0 && setReviews(d)).catch(() => {})
    fetch('/api/gallery').then(r => r.json()).then(d => Array.isArray(d) && d.length > 0 && setGallery(d)).catch(() => {})
  }, [])

  const photos = useMemo(() => {
    const fromAdmin = gallery.map(item => item.url).filter(Boolean)
    return fromAdmin.length ? fromAdmin : publicPhotos
  }, [gallery])

  useEffect(() => {
    document.body.style.overflow = menuOpen || lightboxIndex !== null ? 'hidden' : ''
  }, [menuOpen, lightboxIndex])

  useEffect(() => {
    if (lightboxIndex === null) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setLightboxIndex(null)
      if (event.key === 'ArrowRight') setLightboxIndex(i => (i === null ? i : (i + 1) % photos.length))
      if (event.key === 'ArrowLeft') setLightboxIndex(i => (i === null ? i : (i - 1 + photos.length) % photos.length))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightboxIndex, photos.length])

  const go = (id: string) => {
    setMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const sessionName = (session: Session) => {
    if (lang === 'en') return session.type_en || session.type_ru
    if (lang === 'et') return session.type_et || session.type_ru
    return session.type_ru
  }

  const spotsLabel = (session: Session) => {
    if (typeof session.spots_left === 'number') return formatSpots(session.spots_left, lang, t(content.sessions.spotsWord))
    return session.hot ? t(content.sessions.lowSpots) : t(content.sessions.spotsAvailable)
  }

  const submitReview = async () => {
    if (!reviewForm.name.trim() || !reviewForm.text.trim()) return
    try {
      await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewForm),
      })
      setReviewSent(true)
    } catch {}
  }

  return (
    <>
      <header className="site-nav">
        <a className="brand" href="#top" aria-label="Time to Surf">
          <img src="/logo.jpeg" alt="" />
          <span>Time to Surf</span>
        </a>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Open menu">
          <span />
          <span />
        </button>
        <nav className={menuOpen ? 'open' : ''}>
          {[
            ['about', content.nav.about],
            ['safety', content.nav.safety],
            ['programs', content.nav.programs],
            ['day', content.nav.day],
            ['sessions', content.nav.sessions],
            ['prices', content.nav.prices],
            ['gallery', content.nav.gallery],
            ['faq', content.nav.faq],
          ].map(([id, label]) => (
            <button key={id as string} onClick={() => go(id as string)}>
              {t(label as Parameters<typeof getText>[0])}
            </button>
          ))}
          <div className="lang-switch">
            {(['ru', 'en', 'et'] as Lang[]).map(item => (
              <button key={item} className={lang === item ? 'active' : ''} onClick={() => setLang(item)}>
                {item.toUpperCase()}
              </button>
            ))}
          </div>
          <a className="nav-cta" href={regLink} target="_blank">
            {t(content.nav.cta)}
          </a>
        </nav>
      </header>

      <main id="top">
        <section className="hero section-hero">
          <div className="hero-media">
            <img src={photos[0]} alt="Time to Surf camp" />
          </div>
          <div className="hero-shade" />
          <div className="hero-content reveal">
            <p className="eyebrow">{t(content.hero.eyebrow)}</p>
            <h1>{t(content.hero.title)}</h1>
            <p className="hero-lead">{t(content.hero.text)}</p>
            <div className="hero-actions">
              <a className="btn btn-sun" href={regLink} target="_blank">
                {t(content.hero.primary)}
              </a>
              <button className="btn btn-glass" onClick={() => go('programs')}>
                {t(content.hero.secondary)}
              </button>
            </div>
            <div className="hero-facts">
              <span>{list(content.hero.facts)[0]}</span>
              <span>{list(content.hero.facts)[1]}</span>
              <span>
                {settings.group_size || '12-16'} {list(content.hero.facts)[2]}
              </span>
            </div>
          </div>
          <div className="hero-strip">
            {photos.slice(1, 5).map((photo, index) => (
              <button key={photo} onClick={() => setLightboxIndex(index + 1)}>
                <img src={photo} alt="" />
              </button>
            ))}
          </div>
        </section>

        <section className="section about" id="about">
          <div className="wrap two-col">
            <div className="reveal">
              <p className="eyebrow dark">{t(content.about.eyebrow)}</p>
              <h2>{t(content.about.title)}</h2>
            </div>
            <div className="about-copy reveal">
              <p>{t(content.about.text)}</p>
              <div className="mini-grid">
                {list(content.about.points).map(point => (
                  <span key={point}>{point}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section safety-soft" id="safety">
          <div className="wrap">
            <div className="section-head reveal">
              <p className="eyebrow dark">{t(content.safety.eyebrow)}</p>
              <h2>{t(content.safety.title)}</h2>
            </div>
            <div className="trust-grid reveal">
              {list(content.safety.points).map((point, index) => (
                <article key={point} className="trust-card">
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <p>{point}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section programs" id="programs">
          <div className="wrap">
            <div className="section-head reveal">
              <p className="eyebrow dark">{t(content.programs.eyebrow)}</p>
              <h2>{t(content.programs.title)}</h2>
            </div>
            <div className="program-grid">
              {content.programs.items.map(program => (
                <article className="program-card reveal" key={program.key}>
                  <img src={program.photo} alt="" />
                  <div>
                    <p>{t(program.kicker)}</p>
                    <h3>{t(program.title)}</h3>
                    <span>{t(program.text)}</span>
                    <ul>
                      {list(program.bullets).map(item => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section day" id="day">
          <div className="wrap day-layout">
            <div className="day-sticky reveal">
              <p className="eyebrow dark">{t(content.day.eyebrow)}</p>
              <h2>{t(content.day.title)}</h2>
              <p>{t(content.day.text)}</p>
            </div>
            <div className="timeline reveal">
              {content.day.items.map(item => (
                <article key={item.time}>
                  <time>{item.time}</time>
                  <div>
                    <h3>{t(item.title)}</h3>
                    <p>{t(item.text)}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section sessions" id="sessions">
          <div className="wrap">
            <div className="section-head reveal">
              <p className="eyebrow dark">{t(content.sessions.eyebrow)}</p>
              <h2>{t(content.sessions.title)}</h2>
            </div>
            <div className="session-list reveal">
              {sessions.map((session, index) => (
                <article key={`${session.dates}-${index}`} className="session-row">
                  <i style={{ background: session.color || '#0e7490' }} />
                  <strong>{session.dates}</strong>
                  <span>{sessionName(session)}</span>
                  <small>{session.leaders}</small>
                  <b>{spotsLabel(session)}</b>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section prices" id="prices">
          <div className="wrap">
            <div className="section-head reveal">
              <p className="eyebrow dark">{t(content.prices.eyebrow)}</p>
              <h2>{t(content.prices.title)}</h2>
            </div>
            <div className="price-grid reveal">
              {content.prices.cards.map((card, index) => (
                <article key={card.priceKey} className={index === 2 ? 'price-card main' : 'price-card'}>
                  <h3>{t(card.label)}</h3>
                  <strong>{settings[card.priceKey] || (card.priceKey === 'price_3day' ? '190€' : card.priceKey === 'price_4day' ? '235€' : '265€')}</strong>
                  <p>{t(card.text)}</p>
                </article>
              ))}
            </div>
            <p className="included reveal">{t(content.prices.included)}</p>
          </div>
        </section>

        <section className="section gallery-section" id="gallery">
          <div className="wrap gallery-wrap">
            <div className="gallery-copy reveal">
              <p className="eyebrow light">{t(content.gallery.eyebrow)}</p>
              <h2>{t(content.gallery.title)}</h2>
              <p>{t(content.gallery.text)}</p>
              <button className="btn btn-sun" onClick={() => setLightboxIndex(0)}>
                {t(content.gallery.button)}
              </button>
            </div>
            <div className="gallery-mosaic reveal">
              {photos.slice(0, 7).map((photo, index) => (
                <button key={`${photo}-${index}`} onClick={() => setLightboxIndex(index)}>
                  <img src={photo} alt="" loading="lazy" />
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="section reviews" id="reviews">
          <div className="wrap">
            <div className="section-head reveal">
              <p className="eyebrow dark">{t(content.reviews.eyebrow)}</p>
              <h2>{t(content.reviews.title)}</h2>
            </div>
            <div className="review-grid reveal">
              {reviews.map(review => (
                <article key={review.id} className="review-card">
                  <div>
                    {Array.from({ length: Math.max(0, Math.min(5, review.rating)) }).map((_, index) => (
                      <span key={index}>★</span>
                    ))}
                  </div>
                  <p>“{review.text}”</p>
                  <strong>{review.name}</strong>
                  {review.program && <span>{review.program}</span>}
                </article>
              ))}
            </div>
            <div className="review-form reveal">
              {reviewSent ? (
                <p className="sent">{t(content.reviews.sent)}</p>
              ) : (
                <>
                  <h3>{t(content.reviews.formTitle)}</h3>
                  <input value={reviewForm.name} onChange={e => setReviewForm({ ...reviewForm, name: e.target.value })} placeholder={t(content.reviews.namePlaceholder)} />
                  <input value={reviewForm.program} onChange={e => setReviewForm({ ...reviewForm, program: e.target.value })} placeholder={t(content.reviews.programPlaceholder)} />
                  <textarea value={reviewForm.text} onChange={e => setReviewForm({ ...reviewForm, text: e.target.value })} placeholder={t(content.reviews.textPlaceholder)} rows={4} />
                  <button className="btn btn-ocean" onClick={submitReview}>
                    {t(content.reviews.submit)}
                  </button>
                </>
              )}
            </div>
          </div>
        </section>

        <section className="section faq" id="faq">
          <div className="wrap faq-layout">
            <div className="reveal">
              <p className="eyebrow dark">{t(content.faq.eyebrow)}</p>
              <h2>{t(content.faq.title)}</h2>
            </div>
            <div className="faq-list reveal">
              {content.faq.items.map((faq, index) => (
                <article className={openFaq === index ? 'open' : ''} key={`${index}-${t(faq.q)}`}>
                  <button onClick={() => setOpenFaq(openFaq === index ? -1 : index)}>
                    <span>{t(faq.q)}</span>
                    <b>+</b>
                  </button>
                  <p>{t(faq.a)}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section location" id="location">
          <div className="wrap location-grid">
            <div className="reveal">
              <p className="eyebrow dark">{t(content.location.eyebrow)}</p>
              <h2>{t(content.location.title)}</h2>
              <p>{t(content.location.text)}</p>
              <a className="btn btn-ocean" href="https://www.google.com/maps/search/?api=1&query=Stroomi+rand+Tallinn" target="_blank">
                {t(content.location.button)}
              </a>
            </div>
            <iframe title="Stroomi rand map" src="https://www.google.com/maps?q=Stroomi+rand+Tallinn&z=15&output=embed" loading="lazy" />
          </div>
        </section>

        <section className="section final-cta">
          <div className="wrap reveal">
            <p className="eyebrow light">{t(content.cta.eyebrow)}</p>
            <h2>{t(content.cta.title)}</h2>
            <p>{t(content.cta.text)}</p>
            <div className="hero-actions center">
              <a className="btn btn-sun" href={regLink} target="_blank">
                {t(content.cta.primary)}
              </a>
              <a className="btn btn-glass" href={settings.telegram_link || 'https://t.me/Andrei_Time_to_Surf'} target="_blank">
                {t(content.cta.secondary)}
              </a>
            </div>
            <small>
              {settings.phone || '+372 55512872'} · {settings.email || 'info@timetosurf.ee'}
            </small>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="wrap footer-grid">
          <div>
            <img src="/logo.jpeg" alt="Time to Surf" />
            <p>{t(content.footer.text)}</p>
          </div>
          <div>
            <strong>{t(content.footer.contacts)}</strong>
            <a href={`tel:${(settings.phone || '+37255512872').replace(/\s/g, '')}`}>{settings.phone || '+372 55512872'}</a>
            <a href={`mailto:${settings.email || 'info@timetosurf.ee'}`}>{settings.email || 'info@timetosurf.ee'}</a>
            <a href={settings.telegram_link || 'https://t.me/Andrei_Time_to_Surf'} target="_blank">
              Telegram
            </a>
          </div>
          <div>
            <strong>{t(content.footer.links)}</strong>
            <a href={settings.site_link || 'https://timetosurf.ee'} target="_blank">
              timetosurf.ee
            </a>
            <a href={settings.instagram_link || 'https://www.instagram.com/timetosurf.ee'} target="_blank">
              Instagram
            </a>
            <a href={settings.facebook_link || 'https://www.facebook.com/timetosurf.ee'} target="_blank">
              Facebook
            </a>
          </div>
        </div>
        <a className="northpixel" href="https://www.northpixel.ee/" target="_blank">
          {t(content.footer.credit)}
        </a>
      </footer>

      {lightboxIndex !== null && (
        <div className="lightbox" role="dialog" aria-modal="true">
          <button className="lb-close" onClick={() => setLightboxIndex(null)}>
            {lang === 'en' ? 'Close' : lang === 'et' ? 'Sulge' : 'Закрыть'}
          </button>
          <button className="lb-arrow left" onClick={() => setLightboxIndex((lightboxIndex - 1 + photos.length) % photos.length)} aria-label="Previous photo">
            ‹
          </button>
          <img className="lb-main" src={photos[lightboxIndex]} alt="" />
          <button className="lb-arrow right" onClick={() => setLightboxIndex((lightboxIndex + 1) % photos.length)} aria-label="Next photo">
            ›
          </button>
          <div className="lb-counter">
            {lightboxIndex + 1} / {photos.length}
          </div>
          <div className="lb-thumbs">
            {photos.map((photo, index) => (
              <button className={index === lightboxIndex ? 'active' : ''} key={`${photo}-thumb-${index}`} onClick={() => setLightboxIndex(index)}>
                <img src={photo} alt="" />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

function formatSpots(value: number, lang: Lang, fallbackWord: string) {
  if (lang === 'ru') {
    const last = Math.abs(value) % 10
    const lastTwo = Math.abs(value) % 100
    if (last === 1 && lastTwo !== 11) return `${value} место`
    if (last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14)) return `${value} места`
    return `${value} мест`
  }
  if (lang === 'en') return `${value} ${value === 1 ? 'spot' : 'spots'}`
  if (lang === 'et') return `${value} kohta`
  return `${value} ${fallbackWord}`
}
