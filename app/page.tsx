'use client'
import { useState, useEffect } from 'react'

type Lang = 'ru' | 'en' | 'et'

const REGISTER_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSf-HIXlcSpWy0v0MfJ7HpFNcn_fGDd2Hns2JeHe4kZkNVtqDA/viewform'

// ─── Gallery placeholder icons ────────────────────────────────────────────────
const GALLERY_ITEMS = [
  { icon: '🏄', label: { ru: 'SUP-серфинг', en: 'SUP Surfing', et: 'SUP surfamine' }, color: '#0077BE' },
  { icon: '⛵', label: { ru: 'Виндсерфинг', en: 'Windsurfing', et: 'Purjelaud' }, color: '#00B4D8' },
  { icon: '🎬', label: { ru: 'Кино-смена', en: 'Cinema Camp', et: 'Kinolaager' }, color: '#FF6F61' },
  { icon: '🧭', label: { ru: 'Поход', en: 'Hiking', et: 'Matkamine' }, color: '#4CAF50' },
  { icon: '🤝', label: { ru: 'Командные игры', en: 'Team Games', et: 'Meeskonnmängud' }, color: '#9C27B0' },
  { icon: '🦺', label: { ru: 'Безопасность', en: 'Water Safety', et: 'Veeohutus' }, color: '#FF9800' },
  { icon: '🍽️', label: { ru: 'Питание', en: 'Meals', et: 'Toitlustus' }, color: '#009688' },
  { icon: '🌿', label: { ru: 'Природа', en: 'Nature', et: 'Loodus' }, color: '#4CAF50' },
  { icon: '🎨', label: { ru: 'Мастер-классы', en: 'Workshops', et: 'Töötoad' }, color: '#E91E63' },
  { icon: '🏖️', label: { ru: 'Пляж Штромка', en: 'Stroomi Beach', et: 'Stroomi rand' }, color: '#0077BE' },
  { icon: '🥽', label: { ru: 'Гидрокостюмы', en: 'Wetsuits', et: 'Märjaksüidid' }, color: '#607D8B' },
  { icon: '🌬️', label: { ru: 'Ветер и погода', en: 'Wind & Weather', et: 'Tuul ja ilm' }, color: '#00B4D8' },
]

export default function Home() {
  const [lang, setLang] = useState<Lang>('ru')
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [lightbox, setLightbox] = useState<number | null>(null)
  const [activeCamp, setActiveCamp] = useState<'cinema' | 'hike' | 'surf'>('cinema')

  const c = (ru: string, en: string, et: string) =>
    lang === 'ru' ? ru : lang === 'en' ? en : et

  useEffect(() => {
    const saved = localStorage.getItem('tts-lang') as Lang | null
    if (saved && ['ru', 'en', 'et'].includes(saved)) {
      setLang(saved)
    } else {
      const bl = (navigator.languages?.[0] || navigator.language || 'ru').toLowerCase()
      if (bl.startsWith('et')) setLang('et')
      else if (bl.startsWith('en')) setLang('en')
      else setLang('ru')
    }
  }, [])

  const changeLang = (l: Lang) => {
    setLang(l)
    localStorage.setItem('tts-lang', l)
    setMenuOpen(false)
  }

  useEffect(() => {
    document.documentElement.lang = lang
    const titles: Record<Lang, string> = {
      ru: 'Детский серфинг-лагерь — Time to Surf | Таллин',
      en: 'Children Surf Camp — Time to Surf | Tallinn',
      et: 'Laste surfilaager — Time to Surf | Tallinn',
    }
    document.title = titles[lang]
  }, [lang])

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    document.body.style.overflow = (menuOpen || lightbox !== null) ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen, lightbox])

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null)
      if (lightbox !== null) {
        if (e.key === 'ArrowLeft') setLightbox(i => i !== null && i > 0 ? i - 1 : i)
        if (e.key === 'ArrowRight') setLightbox(i => i !== null && i < GALLERY_ITEMS.length - 1 ? i + 1 : i)
      }
    }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [lightbox])

  const scrollTo = (id: string) => {
    setMenuOpen(false)
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80)
  }

  const navItems = [
    { label: c('Лагеря', 'Camps', 'Laagrid'), id: 'camps' },
    { label: c('Программа', 'Programme', 'Programm'), id: 'program' },
    { label: c('Галерея', 'Gallery', 'Galerii'), id: 'gallery' },
    { label: c('Цены', 'Prices', 'Hinnad'), id: 'pricing' },
    { label: c('Место', 'Location', 'Asukoht'), id: 'location' },
  ]

  const DATES = [
    { dates: '15.06 – 19.06.2026', type: c('СЕРФИНГ + КИНО', 'SURF + CINEMA', 'SURF + KINO'), leaders: 'Наташа К. + Даша', tag: 'cinema', spots: c('Мест мало!', 'Few spots!', 'Kohti vähe!'), hot: true },
    { dates: '29.06 – 03.07.2026', type: c('СЕРФИНГ + КИНО', 'SURF + CINEMA', 'SURF + KINO'), leaders: 'Наташа К. + Даша', tag: 'cinema', spots: '', hot: false },
    { dates: '06.07 – 10.07.2026', type: c('СЕРФИНГ лагерь', 'SURF Camp', 'SURF laager'), leaders: 'Надежда + Григорий', tag: 'surf', spots: '', hot: false },
    { dates: '13.07 – 17.07.2026', type: c('СЕРФИНГ + ПОХОД', 'SURF + HIKE', 'SURF + MATK'), leaders: 'Виталий + Григорий', tag: 'hike', spots: '', hot: false },
    { dates: '20.07 – 24.07.2026', type: c('СЕРФИНГ лагерь', 'SURF Camp', 'SURF laager'), leaders: 'Надежда + Ксения', tag: 'surf', spots: '', hot: false },
    { dates: '27.07 – 30.07.2026', type: c('СЕРФИНГ лагерь (4 дня)', 'SURF Camp (4 days)', 'SURF laager (4 päeva)'), leaders: '...', tag: 'surf', spots: '', hot: false },
    { dates: '03.08 – 07.08.2026', type: c('СЕРФИНГ лагерь', 'SURF Camp', 'SURF laager'), leaders: 'Даша + ...', tag: 'surf', spots: '', hot: false },
    { dates: '10.08 – 14.08.2026', type: c('СЕРФИНГ лагерь', 'SURF Camp', 'SURF laager'), leaders: 'Надежда + ...', tag: 'surf', spots: '', hot: false },
    { dates: '17.08 – 21.08.2026', type: c('СЕРФИНГ + ПОХОД', 'SURF + HIKE', 'SURF + MATK'), leaders: 'Виталий + ...', tag: 'hike', spots: '', hot: false },
  ]

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .hero-title { font-size: clamp(36px, 9vw, 60px) !important; }
          .two-col { grid-template-columns: 1fr !important; }
          .stats-row { flex-direction: column; gap: 16px !important; }
          .camp-tabs { flex-wrap: wrap; }
          .dates-grid { grid-template-columns: 1fr !important; }
          .gallery-grid-inner { grid-template-columns: repeat(2, 1fr) !important; }
          .pricing-grid { grid-template-columns: 1fr !important; }
          .contact-grid-inner { grid-template-columns: 1fr !important; }
        }
        .preview-hint { opacity: 0 !important; transition: opacity 0.2s; }
        .gallery-item:hover .preview-hint { opacity: 1 !important; }
      `}</style>

      {/* ── NAVBAR ── */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        transition: 'all 0.3s',
        background: scrolled ? 'rgba(0,80,140,0.97)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.1)' : 'none',
      }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img src="/time-to-surf-logo.png" alt="Time to Surf" style={{ width: 42, height: 42, borderRadius: '50%', objectFit: 'cover', background: 'white', padding: 2 }} />
            <div>
              <div style={{ color: 'white', fontWeight: 800, fontSize: 16, letterSpacing: '-0.02em', lineHeight: 1.1 }}>Time to Surf</div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{c('Детские лагеря', 'Kids Camps', 'Laste laagrid')}</div>
            </div>
          </div>

          <nav className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
            {navItems.map(item => (
              <button key={item.id} className="nav-link" onClick={() => scrollTo(item.id)}>{item.label}</button>
            ))}
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ display: 'flex', gap: 2, background: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: 3 }}>
              {(['ru', 'en', 'et'] as Lang[]).map(l => (
                <button key={l} onClick={() => changeLang(l)} style={{
                  background: lang === l ? 'white' : 'transparent',
                  color: lang === l ? '#0077BE' : 'rgba(255,255,255,0.7)',
                  border: 'none', cursor: 'pointer', padding: '4px 9px', borderRadius: 6,
                  fontSize: 11, fontWeight: 700,
                  textTransform: 'uppercase', transition: 'all 0.2s', letterSpacing: '0.05em',
                }}>{l}</button>
              ))}
            </div>
            <a href={REGISTER_URL} target="_blank" rel="noopener noreferrer" className="btn-primary hide-mobile" style={{ padding: '8px 18px', fontSize: 13 }}>
              {c('Записаться', 'Register', 'Registreeru')}
            </a>
            <button onClick={() => setMenuOpen(!menuOpen)} className="show-mobile"
              aria-label="Menu"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white', padding: 4 }}>
              {menuOpen
                ? <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mobile-menu">
          <button onClick={() => setMenuOpen(false)} style={{ position: 'absolute', top: 18, right: 22, background: 'none', border: 'none', cursor: 'pointer', color: 'white' }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
          {navItems.map(item => (
            <button key={item.id} onClick={() => scrollTo(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-inter)', fontSize: 26, fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>
              {item.label}
            </button>
          ))}
          <a href={REGISTER_URL} target="_blank" rel="noopener noreferrer" className="btn-white" style={{ marginTop: 8 }}>
            {c('Записаться в лагерь', 'Register for Camp', 'Registreeru laagrisse')}
          </a>
          <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
            {(['ru', 'en', 'et'] as Lang[]).map(l => (
              <button key={l} onClick={() => changeLang(l)} style={{ background: lang === l ? 'white' : 'rgba(255,255,255,0.15)', color: lang === l ? '#0077BE' : 'white', border: 'none', cursor: 'pointer', padding: '7px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700, textTransform: 'uppercase' }}>{l}</button>
            ))}
          </div>
        </div>
      )}

      {/* ── GALLERY LIGHTBOX ── */}
      {lightbox !== null && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,20,50,0.97)', backdropFilter: 'blur(20px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 16, animation: 'fadeIn 0.2s ease',
          }}
        >
          <style>{`@keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }`}</style>
          <div onClick={e => e.stopPropagation()} style={{
            position: 'relative', width: '100%', maxWidth: 800,
            background: 'linear-gradient(135deg, #0077BE, #00B4D8)',
            borderRadius: 24, overflow: 'hidden',
            border: '2px solid rgba(255,255,255,0.2)',
            boxShadow: '0 40px 120px rgba(0,0,0,0.6)',
            aspectRatio: '4/3',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          }}>
            {lightbox > 0 && (
              <button onClick={() => setLightbox(i => i !== null ? i - 1 : null)} style={{
                position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%',
                width: 44, height: 44, cursor: 'pointer', color: 'white', fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>‹</button>
            )}
            {lightbox < GALLERY_ITEMS.length - 1 && (
              <button onClick={() => setLightbox(i => i !== null ? i + 1 : null)} style={{
                position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%',
                width: 44, height: 44, cursor: 'pointer', color: 'white', fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>›</button>
            )}
            <button onClick={() => setLightbox(null)} style={{
              position: 'absolute', top: 16, right: 16,
              background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%',
              width: 36, height: 36, cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
            <img src="/time-to-surf-logo.png" alt="Time to Surf" style={{ width: 132, height: 132, borderRadius: '50%', objectFit: 'cover', background: 'white', padding: 6, marginBottom: 24, boxShadow: '0 18px 44px rgba(0,0,0,0.18)' }} />
            <div style={{ fontSize: 22, fontWeight: 800, color: 'white', letterSpacing: '-0.02em', marginBottom: 8 }}>
              {GALLERY_ITEMS[lightbox].label[lang]}
            </div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>
              {c('Фото появятся скоро', 'Photos coming soon', 'Fotod tulevad peagi')}
            </div>
            <div style={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6 }}>
              {GALLERY_ITEMS.map((_, i) => (
                <div key={i} onClick={() => setLightbox(i)} style={{
                  width: i === lightbox ? 20 : 6, height: 6,
                  borderRadius: 3, background: i === lightbox ? 'white' : 'rgba(255,255,255,0.4)',
                  cursor: 'pointer', transition: 'all 0.2s',
                }} />
              ))}
            </div>
          </div>
        </div>
      )}

      <main>

        {/* ── HERO ── */}
        <section style={{
          position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center',
          overflow: 'hidden', paddingTop: 80,
          background: 'linear-gradient(160deg, #0077BE 0%, #004a8f 40%, #003366 100%)',
        }}>
          <div className="orb orb-1"/><div className="orb orb-2"/><div className="orb orb-3"/>

          <div style={{
            position: 'absolute', bottom: -2, left: 0, right: 0,
            height: 120, zIndex: 1,
          }}>
            <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }} preserveAspectRatio="none">
              <path d="M0,60 C240,120 480,0 720,60 C960,120 1200,0 1440,60 L1440,120 L0,120 Z" fill="#f0f9ff"/>
            </svg>
          </div>

          <div style={{ maxWidth: 1160, margin: '0 auto', padding: '80px 24px 140px', width: '100%', position: 'relative', zIndex: 2 }}>
            <div className="two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
              <div>
                <div style={{ marginBottom: 24 }}>
                  <span className="section-label-white" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#FF6F61', display: 'inline-block', flexShrink: 0 }}/>
                    {c('Таллин · Пляж Штромка · Лето 2026', 'Tallinn · Stroomi Beach · Summer 2026', 'Tallinn · Stroomi rand · Suvi 2026')}
                  </span>
                </div>

                <h1 className="hero-title" style={{
                  fontSize: 'clamp(40px, 5.5vw, 72px)', fontWeight: 900, color: 'white',
                  lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: 24,
                }}>
                  {lang === 'ru' && <>Детский<br/><span style={{ color: '#CAF0F8' }}>серфинг-лагерь</span><br/>на море </>}
                  {lang === 'en' && <>Kids<br/><span style={{ color: '#CAF0F8' }}>Surf Camp</span><br/>by the Sea </>}
                  {lang === 'et' && <>Laste<br/><span style={{ color: '#CAF0F8' }}>surfilaager</span><br/>mere ääres </>}
                </h1>

                <p style={{ fontSize: 'clamp(15px, 1.6vw, 18px)', color: 'rgba(255,255,255,0.85)', lineHeight: 1.75, maxWidth: 500, marginBottom: 20 }}>
                  {c(
                    'Серфинг, природа, команда и настоящие эмоции — 5 дней, которые ребёнок запомнит на всю жизнь.',
                    'Surfing, nature, teamwork and real emotions — 5 days your child will never forget.',
                    'Surfamine, loodus, meeskonnatöö ja päris emotsioonid — 5 päeva, mida laps igavesti mäletab.'
                  )}
                </p>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', marginBottom: 36 }}>
                  {c('Возраст 7–14 лет · 265€ / 5 дней · Питание включено', 'Age 7–14 · €265 / 5 days · Meals included', 'Vanus 7–14 · 265€ / 5 päeva · Toitlustus sees')}
                </p>

                <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 32 }}>
                  <a href={REGISTER_URL} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ padding: '15px 32px', fontSize: 16 }}>
                    {c('Записаться в лагерь', 'Register for Camp', 'Registreeru laagrisse')}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </a>
                  <button className="btn-white" onClick={() => scrollTo('camps')} style={{ padding: '15px 32px', fontSize: 16 }}>
                    {c('Узнать больше', 'Learn More', 'Loe lähemalt')}
                  </button>
                </div>

                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {[
                    c('Серфинг-инструктора', 'Surf Instructors', 'Surfiinstruktorid'),
                    c('Питание включено', 'Meals Included', 'Toitlustus sees'),
                    c('Группы 12–16 чел.', 'Groups 12–16 kids', 'Grupid 12–16 last'),
                  ].map((p, i) => <span key={i} className="trust-pill">{p}</span>)}
                </div>
              </div>

              {/* Hero right */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{
                  background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.15)', borderRadius: 20,
                  padding: 28,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                    <img src="/time-to-surf-logo.png" alt="Time to Surf" style={{ width: 76, height: 76, borderRadius: '50%', objectFit: 'cover', background: 'white', padding: 4, boxShadow: '0 18px 38px rgba(0,0,0,0.18)' }} />
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    {c('Форматы лагерей', 'Camp Formats', 'Laagri formaadid')}
                    </div>
                  </div>
                  {[
                    { emoji: '', name: c('Серфинг + Кино', 'Surf + Cinema', 'Surf + Kino'), desc: c('Снимаем настоящий короткий метр', 'We shoot a real short film', 'Filmime päris lühifilmi'), color: '#FF6F61' },
                    { emoji: '', name: c('Серфинг + Поход', 'Surf + Hike', 'Surf + Matk'), desc: c('Серфинг и настоящие приключения', 'Surfing and real adventures', 'Surfamine ja päris seiklused'), color: '#00B4D8' },
                    { emoji: '', name: c('Серфинг лагерь', 'Surf Camp', 'Surfilaager'), desc: c('Классическая программа серфинга', 'Classic surfing programme', 'Klassikaline surfi programm'), color: '#CAF0F8' },
                  ].map((f, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: 14,
                      padding: '12px 0',
                      borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.08)' : 'none',
                    }}>
                      
                      <div>
                        <div style={{ fontWeight: 700, color: 'white', fontSize: 15 }}>{f.name}</div>
                        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 2 }}>{f.desc}</div>
                      </div>
                      <div style={{ marginLeft: 'auto', width: 8, height: 8, borderRadius: '50%', background: f.color, flexShrink: 0 }} />
                    </div>
                  ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                  {[
                    { num: '7+', label: c('лет опыта', 'years exp.', 'aastat kogemust') },
                    { num: '265€', label: c('5 дней', '5 days', '5 päeva') },
                    { num: '12–16', label: c('детей в группе', 'kids per group', 'last grupis') },
                  ].map((s, i) => (
                    <div key={i} style={{
                      background: 'rgba(255,255,255,0.1)', borderRadius: 14,
                      border: '1px solid rgba(255,255,255,0.15)',
                      padding: '16px 12px', textAlign: 'center',
                    }}>
                      <div className="stat-num" style={{ fontSize: 28 }}>{s.num}</div>
                      <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 11, marginTop: 4 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── WHY SURFING ── */}
        <section style={{ padding: '96px 24px', background: 'var(--bg)' }}>
          <div style={{ maxWidth: 1160, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <span className="section-label" style={{ marginBottom: 20, display: 'inline-flex' }}>
                {c('Почему серфинг?', 'Why surfing?', 'Miks surfamine?')}
              </span>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, marginBottom: 16, letterSpacing: '-0.02em', color: 'var(--text)' }}>
                {c('Серфинг — это больше, чем спорт', 'Surfing is more than a sport', 'Surfamine on rohkem kui sport')}
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: 17, maxWidth: 560, margin: '0 auto' }}>
                {c(
                  'Это стиль мышления и образ жизни, который остаётся с ребёнком навсегда.',
                  'It\'s a mindset and lifestyle that stays with the child forever.',
                  'See on mõtteviis ja eluviis, mis jääb lapsega igaveseks.'
                )}
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
              {[
                { icon: '', title: c('Здоровье и сила', 'Health & Strength', 'Tervis ja tugevus'), desc: c('Свежий воздух, море, движение — перезагрузка тела и духа.', 'Sea air, movement and energy — a full recharge.', 'Mereõhk, liikumine ja energia — täielik taastumine.') },
                { icon: '', title: c('Умение быть здесь и сейчас', 'Living in the moment', 'Olevikus elamine'), desc: c('На волне невозможно думать о лишнем. Только здесь и сейчас.', 'On the wave, only the present moment matters.', 'Lainel on ainult praegune hetk oluline.') },
                { icon: '', title: c('Чувство природы', 'Connection with nature', 'Ühendus loodusega'), desc: c('Ребёнок учится читать ветер, воду и погоду.', 'Children learn to read wind, water and weather.', 'Lapsed õpivad lugema tuult, vett ja ilma.') },
                { icon: '', title: c('Уравновешенность', 'Inner balance', 'Sisemine tasakaal'), desc: c('Вода учит спокойствию и контролю эмоций.', 'Water teaches calmness and emotional control.', 'Vesi õpetab rahulikust ja emotsioonikontrolli.') },
                { icon: '', title: c('Командный дух', 'Team spirit', 'Meeskonnavaim'), desc: c('Через игры дети учатся поддерживать друг друга.', 'Through games, children learn to support each other.', 'Mängude kaudu õpivad lapsed üksteist toetama.') },
                { icon: '', title: c('Уверенность в себе', 'Self-confidence', 'Enesekindlus'), desc: c('Встать на доску — это победа, которую ребёнок помнит всегда.', 'Standing up on a board is a victory kids always remember.', 'Lauale seismine on võit, mida lapsed alati mäletavad.') },
              ].map((item, i) => (
                <div key={i} className="check-item" style={{ padding: '20px', borderRadius: 14, gap: 14 }}>
                  <div className="mini-mark large" aria-hidden="true">{i + 1}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6, color: 'var(--text)' }}>{item.title}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: 13, lineHeight: 1.6 }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CAMP FORMATS ── */}
        <section id="camps" style={{ padding: '96px 24px', background: 'var(--bg-light)' }}>
          <div style={{ maxWidth: 1160, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <span className="section-label" style={{ marginBottom: 20, display: 'inline-flex' }}>
                {c('Форматы лагерей', 'Camp Formats', 'Laagri formaadid')}
              </span>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, marginBottom: 14, letterSpacing: '-0.02em', color: 'var(--text)' }}>
                {c('Три уникальных программы', 'Three unique programmes', 'Kolm ainulaadset programmi')}
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: 17, maxWidth: 500, margin: '0 auto' }}>
                {c('Выберите формат, который подходит вашему ребёнку.', 'Choose the format that suits your child.', 'Valige oma lapsele sobiv formaat.')}
              </p>
            </div>

            {/* Tabs */}
            <div className="camp-tabs" style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 32, flexWrap: 'wrap' }}>
              {[
                { key: 'cinema' as const, label: c('Серфинг + Кино', 'Surf + Cinema', 'Surf + Kino'), color: '#FF6F61' },
                { key: 'hike' as const, label: c('Серфинг + Поход', 'Surf + Hike', 'Surf + Matk'), color: '#00B4D8' },
                { key: 'surf' as const, label: c('Серфинг лагерь', 'Surf Camp', 'Surfilaager'), color: '#0077BE' },
              ].map(tab => (
                <button key={tab.key} onClick={() => setActiveCamp(tab.key)} style={{
                  padding: '10px 22px', borderRadius: 50, fontSize: 14, fontWeight: 700, cursor: 'pointer',
                  border: `2px solid ${activeCamp === tab.key ? tab.color : 'var(--border)'}`,
                  background: activeCamp === tab.key ? tab.color : 'white',
                  color: activeCamp === tab.key ? 'white' : 'var(--text-muted)',
                  transition: 'all 0.2s',
                  fontFamily: 'var(--font-inter)',
                }}>{tab.label}</button>
              ))}
            </div>

            {/* Cinema Camp */}
            {activeCamp === 'cinema' && (
              <div className="two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, animation: 'fadeIn 0.3s ease' }}>
                <div>
                  <div style={{ background: 'linear-gradient(135deg, #FF6F61, #ff9f97)', borderRadius: 20, padding: 32, color: 'white', marginBottom: 20 }}>
                    
                    <h3 style={{ fontSize: 26, fontWeight: 800, marginBottom: 10, letterSpacing: '-0.02em' }}>
                      {c('Серфинг + Кино', 'Surf + Cinema', 'Surf + Kino')}
                    </h3>
                    <p style={{ fontSize: 15, opacity: 0.9, lineHeight: 1.7, marginBottom: 16 }}>
                      {c(
                        'Уникальная программа: утром — серфинг на волнах, после обеда — настоящая киностудия. Дети снимают фильм, который остаётся на память.',
                        'Unique programme: morning surfing on waves, afternoon real film studio. Children create a film to keep forever.',
                        'Ainulaadne programm: hommikul surfamine, pärastlõunal päris filmistuudio. Lapsed loovad filmi, mis jääb mälestuseks igaveks.'
                      )}
                    </p>
                    <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 12, padding: '10px 16px', display: 'inline-block' }}>
                      <div style={{ fontWeight: 800, fontSize: 18 }}>265€ / {c('5 дней', '5 days', '5 päeva')}</div>
                    </div>
                  </div>
                  <div style={{ background: 'rgba(255,111,97,0.06)', border: '1px solid rgba(255,111,97,0.15)', borderRadius: 14, padding: 20 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)', marginBottom: 12 }}>
                      {c('Ведущий кино-блока:', 'Cinema programme lead:', 'Kinoosa juht:')}
                    </div>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                      <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, #FF6F61, #ff9f97)', display: 'none' }} />
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: 15 }}>Наталья Карасёва</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: 13, lineHeight: 1.6 }}>
                          {c('Тележурналист с 20-летним стажем, автор подкаста «Cozy with Tasha», создатель документальных проектов.', 'TV journalist with 20 years experience, podcast author, documentary filmmaker.', 'Teleajakirjanik 20-aastase kogemusega, taskuhäälingu autor, dokumentaalfilmide looja.')}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: 16, color: 'var(--text)', marginBottom: 16 }}>
                    {c('Что делают дети:', 'What children do:', 'Mida lapsed teevad:')}
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                    {[
                      { icon: '', text: c('Серфинг на воде каждый день', 'Surfing on water every day', 'Surfamine vees iga päev') },
                      { icon: '', text: c('Ведущие снимают репортажи', 'Hosts film reports', 'Saatejuhid filmivad reportaaže') },
                      { icon: '', text: c('Операторы учатся видеть кадры', 'Camera crew learns to frame shots', 'Operaatorid õpivad kaadrit nägema') },
                      { icon: '', text: c('Монтажёры собирают видео', 'Editors assemble the video', 'Monteerijad koondavad video') },
                      { icon: '', text: c('Все вместе создают короткий метр', 'Together they create a short film', 'Koos loovad nad lühifilmi') },
                      { icon: '', text: c('Безопасность на воде — основа', 'Water safety is a priority', 'Veeohutus on prioriteet') },
                    ].map((item, i) => (
                      <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '10px 14px', background: 'white', border: '1px solid var(--border)', borderRadius: 10 }}>
                        <span className="mini-mark" aria-hidden="true">{i + 1}</span>
                        <span style={{ color: 'var(--text-soft)', fontSize: 14 }}>{item.text}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ background: 'rgba(0,119,190,0.05)', border: '1px solid var(--border)', borderRadius: 14, padding: 16 }}>
                    <div style={{ fontWeight: 700, color: 'var(--accent)', fontSize: 14, marginBottom: 8 }}>{c('Даты смены:', 'Session dates:', 'Vahetuse kuupäevad:')}</div>
                    <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: 15, marginBottom: 4 }}>15.06 – 19.06.2026</div>
                    <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: 15 }}>29.06 – 03.07.2026</div>
                  </div>
                </div>
              </div>
            )}

            {/* Hike Camp */}
            {activeCamp === 'hike' && (
              <div className="two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, animation: 'fadeIn 0.3s ease' }}>
                <div>
                  <div style={{ background: 'linear-gradient(135deg, #00B4D8, #0077BE)', borderRadius: 20, padding: 32, color: 'white', marginBottom: 20 }}>
                    
                    <h3 style={{ fontSize: 26, fontWeight: 800, marginBottom: 10, letterSpacing: '-0.02em' }}>
                      {c('Серфинг + Поход', 'Surf + Hike', 'Surf + Matk')}
                    </h3>
                    <p style={{ fontSize: 15, opacity: 0.9, lineHeight: 1.7, marginBottom: 16 }}>
                      {c(
                        'Серфинг на воде плюс настоящие приключения в природе: ориентирование, разведение костра, установка палатки и финальный мини-поход.',
                        'Surfing on water plus real nature adventures: navigation, fire, tent and a final mini-hike.',
                        'Surfamine vees pluss päris loodusseiklused: navigeerimine, lõkke tegemine, telk ja lõpumatk.'
                      )}
                    </p>
                    <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 12, padding: '10px 16px', display: 'inline-block' }}>
                      <div style={{ fontWeight: 800, fontSize: 18 }}>265€ / {c('5 дней', '5 days', '5 päeva')}</div>
                    </div>
                  </div>
                  <div style={{ background: 'rgba(0,180,216,0.06)', border: '1px solid rgba(0,180,216,0.15)', borderRadius: 14, padding: 20 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)', marginBottom: 12 }}>
                      {c('Ведущий походной программы:', 'Hiking programme lead:', 'Matkaprogrammi juht:')}
                    </div>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                      <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, #00B4D8, #0077BE)', display: 'none' }} />
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: 15 }}>Виталий Холстинин</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: 13, lineHeight: 1.6 }}>
                          {c('Предприниматель, хайкер, создатель сообщества Join The Hike. Прошёл маршруты Höga Kusten (140 км) и Land of Giants (120 км).', 'Entrepreneur, hiker, founder of Join The Hike community. Completed Höga Kusten (140 km) and Land of Giants (120 km) trails.', 'Ettevõtja, matkaja, Join The Hike kogukonna asutaja. Läbinud Höga Kusten (140 km) ja Land of Giants (120 km) rajad.')}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: 16, color: 'var(--text)', marginBottom: 16 }}>
                    {c('Программа включает:', 'Programme includes:', 'Programm sisaldab:')}
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                    {[
                      { icon: '', text: c('Серфинг и SUP каждый день', 'Surfing and SUP every day', 'Surfamine ja SUP iga päev') },
                      { icon: '', text: c('Ориентирование по карте и компасу', 'Map and compass navigation', 'Kaardi ja kompassi navigeerimine') },
                      { icon: '', text: c('Разведение костра', 'Fire starting', 'Lõkke tegemine') },
                      { icon: '', text: c('Установка палатки', 'Setting up a tent', 'Telgi püstitamine') },
                      { icon: '', text: c('Навыки выживания в лесу', 'Forest survival skills', 'Metsa ellujäämisoskused') },
                      { icon: '', text: c('Финальный мини-поход', 'Final mini-hike', 'Lõpumatk') },
                    ].map((item, i) => (
                      <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '10px 14px', background: 'white', border: '1px solid var(--border)', borderRadius: 10 }}>
                        <span className="mini-mark" aria-hidden="true">{i + 1}</span>
                        <span style={{ color: 'var(--text-soft)', fontSize: 14 }}>{item.text}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ background: 'rgba(0,119,190,0.05)', border: '1px solid var(--border)', borderRadius: 14, padding: 16 }}>
                    <div style={{ fontWeight: 700, color: 'var(--accent)', fontSize: 14, marginBottom: 8 }}>{c('Даты смены:', 'Session dates:', 'Vahetuse kuupäevad:')}</div>
                    <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: 15, marginBottom: 4 }}>13.07 – 17.07.2026</div>
                    <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: 15 }}>17.08 – 21.08.2026</div>
                    <div style={{ marginTop: 12, padding: '8px 12px', background: 'rgba(0,180,216,0.08)', borderRadius: 8, fontSize: 13, color: 'var(--text-muted)' }}>
                      {c('Каждый участник получает нашивку походника Time to Surf', 'Every participant gets the Time to Surf hiker badge', 'Iga osaleja saab Time to Surf matkaja märgi')}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Surf Camp */}
            {activeCamp === 'surf' && (
              <div className="two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, animation: 'fadeIn 0.3s ease' }}>
                <div>
                  <div style={{ background: 'linear-gradient(135deg, #0077BE, #004a8f)', borderRadius: 20, padding: 32, color: 'white', marginBottom: 20 }}>
                    
                    <h3 style={{ fontSize: 26, fontWeight: 800, marginBottom: 10, letterSpacing: '-0.02em' }}>
                      {c('Серфинг лагерь', 'Surf Camp', 'Surfilaager')}
                    </h3>
                    <p style={{ fontSize: 15, opacity: 0.9, lineHeight: 1.7, marginBottom: 16 }}>
                      {c(
                        'Классическая программа: разные виды серфинга, безопасность на воде, командные игры и мастер-классы. Идеально для знакомства с миром серфинга.',
                        'Classic programme: various surf types, water safety, team games and workshops. Perfect for discovering the surf world.',
                        'Klassikaline programm: erinevad surfi liigid, veeohutus, meeskonnmängud ja töötoad. Ideaalne surfi maailmaga tutvumiseks.'
                      )}
                    </p>
                    <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 12, padding: '10px 16px', display: 'inline-block' }}>
                      <div style={{ fontWeight: 800, fontSize: 18 }}>265€ / {c('5 дней', '5 days', '5 päeva')}</div>
                    </div>
                  </div>
                  <div style={{ background: 'rgba(0,119,190,0.05)', border: '1px solid var(--border)', borderRadius: 14, padding: 16 }}>
                    <div style={{ fontWeight: 700, color: 'var(--accent)', fontSize: 13, marginBottom: 8 }}>
                      {c('Виды серфинга в программе:', 'Surf types in the programme:', 'Surfi liigid programmis:')}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {[
                        { name: 'SUP-серфинг' },
                        { name: c('Виндсерфинг', 'Windsurfing', 'Purjelaud') },
                        { name: c('Кайтсерфинг', 'Kitesurfing', 'Kaitesurfing') },
                        { name: 'Бодиборд' },
                        { name: 'Вингфоилинг' },
                      ].map((s, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: 'rgba(0,119,190,0.08)', borderRadius: 100, fontSize: 13, fontWeight: 600, color: 'var(--accent)' }}>
                          {s.name}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: 16, color: 'var(--text)', marginBottom: 16 }}>
                    {c('Чему учится ребёнок:', 'What the child learns:', 'Mida laps õpib:')}
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                    {[
                      { icon: '', text: c('Разные виды серфинга', 'Different types of surfing', 'Erinevad surfi liigid') },
                      { icon: '', text: c('Как надевать гидрокостюм', 'How to put on a wetsuit', 'Kuidas märjaksüiti selga panna') },
                      { icon: '', text: c('Безопасность и правила на воде', 'Water safety and rules', 'Veeohutus ja reeglid') },
                      { icon: '', text: c('Читать ветер и погоду', 'Read wind and weather', 'Lugeda tuult ja ilma') },
                      { icon: '', text: c('Работа в команде', 'Teamwork', 'Meeskonnatöö') },
                      { icon: '', text: c('Творческие мастер-классы', 'Creative workshops', 'Loomingulised töötoad') },
                    ].map((item, i) => (
                      <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '10px 14px', background: 'white', border: '1px solid var(--border)', borderRadius: 10 }}>
                        <span className="mini-mark" aria-hidden="true">{i + 1}</span>
                        <span style={{ color: 'var(--text-soft)', fontSize: 14 }}>{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div style={{ textAlign: 'center', marginTop: 40 }}>
              <a href={REGISTER_URL} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ padding: '16px 40px', fontSize: 16 }}>
                {c('Записаться в лагерь', 'Register for Camp', 'Registreeru laagrisse')} →
              </a>
            </div>
          </div>
        </section>

        {/* ── DAILY PROGRAMME ── */}
        <section id="program" style={{ padding: '96px 24px', background: 'var(--bg)' }}>
          <div style={{ maxWidth: 1160, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <span className="section-label" style={{ marginBottom: 20, display: 'inline-flex' }}>
                {c('День в лагере', 'A Day at Camp', 'Päev laagris')}
              </span>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, marginBottom: 14, letterSpacing: '-0.02em', color: 'var(--text)' }}>
                {c('Расписание дня', 'Daily Schedule', 'Päevakava')}
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
              {[
                { time: '09:00', icon: '', title: c('Сбор', 'Arrival', 'Kogunemine'), desc: c('Встреча детей, знакомство, настрой на день', 'Meeting kids, introductions, setting the mood', 'Laste vastuvõtt, tutvumine, päevaks häälestamine') },
                { time: '09:30', icon: '', title: c('Разминка', 'Warm-up', 'Soojendus'), desc: c('Активные тренировки и командные игры', 'Active training and team games', 'Aktiivsed treeningud ja meeskonnmängud') },
                { time: '10:00', icon: '', title: c('Водный блок', 'Water block', 'Vesiplokk'), desc: c('Безопасность, гидрокостюмы, SUP-серфинг', 'Safety, wetsuits, SUP surfing', 'Ohutus, märjaksüidid, SUP surfamine') },
                { time: '12:00', icon: '', title: c('Обед', 'Lunch', 'Lõuna'), desc: c('Индивидуальная порция в боксе, учёт аллергий', 'Individual portion in a box, allergies considered', 'Individuaalne portsjon kastis, arvestatakse allergiaid') },
                { time: '13:30', icon: '', title: c('Активная программа', 'Active programme', 'Aktiivne programm'), desc: c('Виндсёрфинг, SUP, кайт, пляжные игры, поход', 'Windsurfing, SUP, kite, beach games, hiking', 'Purjelaud, SUP, kait, rannamängud, matk') },
                { time: '15:30', icon: '', title: c('Чаепитие', 'Tea time', 'Tee aeg'), desc: c('Перерыв, отдых, общение', 'Break, rest, socialising', 'Paus, puhkus, suhtlemine') },
                { time: '16:30', icon: '', title: c('Спокойный блок', 'Calm block', 'Rahulik plokk'), desc: c('Игры, творчество, интеллектуальные задания', 'Games, creativity, intellectual tasks', 'Mängud, loovus, intellektuaalsed ülesanded') },
                { time: '17:00', icon: '', title: c('Домой', 'Home time', 'Kodu aeg'), desc: c('Конец программы, ожидание родителей', 'End of programme, waiting for parents', 'Programmi lõpp, vanemate ootamine') },
              ].map((item, i) => (
                <div key={i} className="card" style={{ padding: 20, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <div style={{ textAlign: 'center', flexShrink: 0 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.04em', marginBottom: 4 }}>{item.time}</div>
                    <div className="time-dot" aria-hidden="true" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)', marginBottom: 4 }}>{item.title}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: 12, lineHeight: 1.6 }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── GALLERY ── */}
        <section id="gallery" style={{ padding: '96px 24px', background: 'var(--bg-light)' }}>
          <div style={{ maxWidth: 1160, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <span className="section-label" style={{ marginBottom: 20, display: 'inline-flex' }}>
                {c('Галерея', 'Gallery', 'Galerii')}
              </span>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, marginBottom: 14, letterSpacing: '-0.02em', color: 'var(--text)' }}>
                {c('Атмосфера лагеря', 'Camp Atmosphere', 'Laagri atmosfäär')}
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>
                {c('Фотографии появятся с началом сезона. Пока — превью активностей.', 'Photos will appear as the season begins. For now — activity previews.', 'Fotod ilmuvad hooaja alguses. Praegu — tegevuste eelvaated.')}
              </p>
            </div>
            <div className="gallery-grid-inner" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
              {GALLERY_ITEMS.map((item, i) => (
                <div
                  key={i}
                  className="gallery-item"
                  onClick={() => setLightbox(i)}
                  style={{
                    background: `linear-gradient(135deg, ${item.color}22, ${item.color}44)`,
                    border: `2px solid ${item.color}33`,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    padding: 20, gap: 10, aspectRatio: '4/3',
                    borderRadius: 14, cursor: 'pointer', position: 'relative', overflow: 'hidden',
                    transition: 'transform 0.25s, box-shadow 0.25s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)'
                    e.currentTarget.style.boxShadow = `0 20px 50px ${item.color}33`
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = ''
                    e.currentTarget.style.boxShadow = ''
                  }}
                >
                  <div className="gallery-mark" style={{ background: item.color, fontSize: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-hidden="true">
                    {item.icon}
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: item.color, textAlign: 'center', letterSpacing: '-0.01em' }}>
                    {item.label[lang]}
                  </div>
                  <div className="preview-hint" style={{
                    position: 'absolute', inset: 0,
                    background: `${item.color}cc`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    borderRadius: 12,
                  }}>
                    <div style={{ color: 'white', fontWeight: 700, fontSize: 14, textAlign: 'center' }}>
                      {c('Открыть', 'Open', 'Ava')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRICING ── */}
        <section id="pricing" style={{ padding: '96px 24px', background: 'var(--bg-dark)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(ellipse at 30% 50%, rgba(0,180,216,0.2) 0%, transparent 60%)', pointerEvents: 'none' }} />
          <div style={{ maxWidth: 1160, margin: '0 auto', position: 'relative', zIndex: 2 }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <span className="section-label-white" style={{ marginBottom: 20, display: 'inline-flex' }}>
                {c('Стоимость', 'Pricing', 'Hinnad')}
              </span>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, marginBottom: 14, letterSpacing: '-0.02em', color: 'white' }}>
                {c('Прозрачные цены, всё включено', 'Transparent pricing, all included', 'Läbipaistvad hinnad, kõik sees')}
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 17 }}>
                {c('В цену входит вся программа, питание и оборудование.', 'Price includes full programme, meals and equipment.', 'Hind sisaldab kogu programmi, toitlustust ja varustust.')}
              </p>
            </div>

            <div className="pricing-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 40 }}>
              {[
                { days: c('3 дня', '3 days', '3 päeva'), price: '190€', popular: false, note: c('Идеально для пробы', 'Perfect to try', 'Ideaalne proovimiseks') },
                { days: c('5 дней', '5 days', '5 päeva'), price: '265€', popular: true, note: c('Полная программа', 'Full programme', 'Täisprogramm') },
                { days: c('4 дня', '4 days', '4 päeva'), price: '235€', popular: false, note: c('Гибкий формат', 'Flexible format', 'Paindlik formaat') },
              ].map((plan, i) => (
                <div key={i} style={{
                  background: plan.popular ? 'white' : 'rgba(255,255,255,0.08)',
                  border: plan.popular ? 'none' : '1px solid rgba(255,255,255,0.15)',
                  borderRadius: 20, padding: 28, textAlign: 'center',
                  position: 'relative', transition: 'transform 0.2s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-4px)')}
                  onMouseLeave={e => (e.currentTarget.style.transform = '')}
                >
                  {plan.popular && (
                    <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: '#FF6F61', color: 'white', fontSize: 11, fontWeight: 800, padding: '4px 16px', borderRadius: 100, whiteSpace: 'nowrap' }}>
                      {c('Самый популярный', 'Most popular', 'Populaarseim')}
                    </div>
                  )}
                  <div style={{ fontSize: 15, fontWeight: 700, color: plan.popular ? 'var(--text-muted)' : 'rgba(255,255,255,0.7)', marginBottom: 8, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    {plan.days}
                  </div>
                  <div style={{ fontSize: 52, fontWeight: 900, letterSpacing: '-0.04em', color: plan.popular ? 'var(--accent)' : 'white', marginBottom: 4 }}>
                    {plan.price}
                  </div>
                  <div style={{ fontSize: 13, color: plan.popular ? 'var(--text-muted)' : 'rgba(255,255,255,0.6)', marginBottom: 24 }}>
                    {plan.note}
                  </div>
                  <a href={REGISTER_URL} target="_blank" rel="noopener noreferrer"
                    style={{
                      display: 'block', textAlign: 'center', padding: '12px 20px',
                      background: plan.popular ? 'linear-gradient(135deg, #FF6F61, #e85d50)' : 'rgba(255,255,255,0.15)',
                      color: 'white', borderRadius: 12, fontWeight: 700, fontSize: 14,
                      textDecoration: 'none', transition: 'opacity 0.2s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                    onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                  >
                    {c('Записаться', 'Register', 'Registreeru')} →
                  </a>
                </div>
              ))}
            </div>

            {/* What's included */}
            <div style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 20, padding: 32 }}>
              <div style={{ textAlign: 'center', fontWeight: 700, color: 'white', fontSize: 18, marginBottom: 24 }}>
                {c('В цену включено:', 'Price includes:', 'Hind sisaldab:')}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
                {[
                  { icon: '', text: c('Вся программа серфинга', 'Full surf programme', 'Kogu surfi programm') },
                  { icon: '', text: c('Питание (Tark Catering)', 'Meals (Tark Catering)', 'Toitlustus (Tark Catering)') },
                  { icon: '', text: c('Полдник / чаепитие', 'Afternoon snack', 'Pärastlõunane eine') },
                  { icon: '', text: c('Гидрокостюмы', 'Wetsuits', 'Märjaksüidid') },
                  { icon: '', text: c('Жилеты', 'Life jackets', 'Päästevested') },
                  { icon: '', text: c('Всё необходимое оборудование', 'All necessary equipment', 'Kogu vajalik varustus') },
                  { icon: '', text: c('Работа инструкторов', 'Instructor work', 'Instruktorite töö') },
                  { icon: '', text: c('Мастер-классы', 'Workshops', 'Töötoad') },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <span className="mini-mark" aria-hidden="true">{i + 1}</span>
                    <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13 }}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── ALL DATES ── */}
        <section style={{ padding: '96px 24px', background: 'var(--bg)' }}>
          <div style={{ maxWidth: 1160, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <span className="section-label" style={{ marginBottom: 20, display: 'inline-flex' }}>
                {c('Расписание', 'Schedule', 'Ajakava')}
              </span>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, marginBottom: 14, letterSpacing: '-0.02em', color: 'var(--text)' }}>
                {c('Все смены лета 2026', 'All sessions summer 2026', 'Kõik vahetused suvel 2026')}
              </h2>
            </div>
            <div className="dates-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
              {DATES.map((d, i) => (
                <div key={i} className="card" style={{
                  padding: 20,
                  border: d.hot ? '2px solid #FF6F61' : '1px solid var(--border)',
                  background: d.hot ? 'rgba(255,111,97,0.04)' : 'white',
                }}>
                  {d.hot && (
                    <div className="date-badge" style={{ marginBottom: 10, display: 'inline-flex' }}>
                       {d.spots}
                    </div>
                  )}
                  <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--text)', marginBottom: 4 }}>{d.dates}</div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: d.tag === 'cinema' ? '#FF6F61' : d.tag === 'hike' ? '#00B4D8' : 'var(--accent)', marginBottom: 6 }}>
                    {d.type}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    {d.leaders}
                  </div>
                  <a href={REGISTER_URL} target="_blank" rel="noopener noreferrer" style={{
                    display: 'block', marginTop: 14, textAlign: 'center', padding: '8px',
                    background: d.hot ? 'linear-gradient(135deg, #FF6F61, #e85d50)' : 'rgba(0,119,190,0.08)',
                    color: d.hot ? 'white' : 'var(--accent)', borderRadius: 10, fontWeight: 700, fontSize: 13,
                    textDecoration: 'none', transition: 'opacity 0.2s',
                  }}>
                    {c('Записаться', 'Register', 'Registreeru')} →
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section style={{ padding: '96px 24px', background: 'var(--bg-light)' }}>
          <div style={{ maxWidth: 740, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <span className="section-label" style={{ marginBottom: 20, display: 'inline-flex' }}>FAQ</span>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, marginBottom: 14, letterSpacing: '-0.02em', color: 'var(--text)' }}>
                {c('Частые вопросы', 'Frequently Asked Questions', 'Korduma kippuvad küsimused')}
              </h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                {
                  q: c('Какой возраст подходит?', 'What age is suitable?', 'Mis vanus sobib?'),
                  a: c('Основная программа для детей 7–12 лет. Возможно участие детей помладше, если они справляются с программой, и постарше — до 14 лет.', 'Main programme for ages 7–12. Younger children may participate if capable, and older up to 14.', 'Põhiprogramm lastele vanuses 7–12. Nooremad lapsed võivad osaleda, kui nad tulevad programmiga toime, ja vanemad kuni 14-aastased.'),
                },
                {
                  q: c('Нужен ли опыт серфинга?', 'Is surfing experience required?', 'Kas surfikogemus on vajalik?'),
                  a: c('Нет. Лагерь подходит для начинающих — мы обучаем с нуля. Опытные дети тоже найдут для себя вызов.', 'No. The camp is for beginners — we teach from scratch. Experienced kids will also find a challenge.', 'Ei. Laager sobib algajatele — õpetame nullist. Ka kogenud lapsed leiavad endale väljakutse.'),
                },
                {
                  q: c('Что входит в стоимость?', 'What is included in the price?', 'Mis on hinnas sees?'),
                  a: c('Вся программа, питание (обед и полдник), гидрокостюмы, спасательные жилеты, всё необходимое оборудование и работа инструкторов.', 'Full programme, meals (lunch and snack), wetsuits, life jackets, all equipment and instructor work.', 'Kogu programm, toitlustus (lõuna ja eine), märjaksüidid, päästevested, kogu varustus ja instruktorite töö.'),
                },
                {
                  q: c('Что нужно взять с собой?', 'What to bring?', 'Mida kaasa võtta?'),
                  a: c('Сменную одежду, полотенце, солнцезащитный крем, воду и хорошее настроение. Гидрокостюм и оборудование предоставляем мы.', 'A change of clothes, towel, sunscreen, water and a good attitude. We provide wetsuit and equipment.', 'Vahetusriided, rätik, päikesekaitsevahend, vesi ja hea tuju. Märjaksüidi ja varustuse pakume meie.'),
                },
                {
                  q: c('Где находится лагерь?', 'Where is the camp?', 'Kus laager asub?'),
                  a: c('Пляж Штромка (Stroomi rand), конец пляжа ближе к Рокка-аль-Маре, серфинг-станция Time to Surf. Удобная транспортная доступность из центра Таллина.', 'Stroomi beach, at the end near Rocca al Mare, Time to Surf station. Easy access from Tallinn centre.', 'Stroomi rand, ranna lõpus Rocca al Mare poole, Time to Surf jaam. Mugav ühendus Tallinna keskusest.'),
                },
                {
                  q: c('Можно ли прийти на часть смены?', 'Can we attend part of the session?', 'Kas saab osa vahetusest osaleda?'),
                  a: c('Да! Доступны форматы 3 дня (190€) и 4 дня (235€). Укажите при регистрации, на сколько дней хотите записаться.', 'Yes! Available formats: 3 days (€190) and 4 days (€235). Specify at registration how many days you want.', 'Jah! Saadaval formaadid: 3 päeva (190€) ja 4 päeva (235€). Märkige registreerimisel, mitmeks päevaks soovite.'),
                },
                {
                  q: c('Есть ли учёт питания по аллергиям?', 'Are food allergies considered?', 'Kas arvestatakse toiduallergiad?'),
                  a: c('Да, каждый ребёнок получает индивидуальную порцию в отдельном боксе с учётом особенностей питания. Укажите аллергии при регистрации.', 'Yes, each child receives an individual portion in a separate box with dietary needs considered. Please note allergies at registration.', 'Jah, iga laps saab individuaalse portsjoni eraldi kastis, arvestades toitumisvajadusi. Märkige allergiad registreerimisel.'),
                },
              ].map((item, i) => (
                <div key={i} className={`faq-item${openFaq === i ? ' open' : ''}`}>
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '18px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, textAlign: 'left' }}>
                    <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', letterSpacing: '-0.01em' }}>{item.q}</span>
                    <svg style={{ flexShrink: 0, color: 'var(--accent)', transition: 'transform 0.3s', transform: openFaq === i ? 'rotate(180deg)' : 'none' }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
                  </button>
                  {openFaq === i && (
                    <div style={{ padding: '0 22px 18px', color: 'var(--text-soft)', lineHeight: 1.8, fontSize: 14 }}>{item.a}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── LOCATION ── */}
        <section id="location" style={{ padding: '96px 24px', background: 'var(--bg)' }}>
          <div style={{ maxWidth: 1160, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <span className="section-label" style={{ marginBottom: 20, display: 'inline-flex' }}>
                {c('Место проведения', 'Location', 'Asukoht')}
              </span>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, marginBottom: 14, letterSpacing: '-0.02em', color: 'var(--text)' }}>
                {c('Пляж Штромка, Таллин', 'Stroomi Beach, Tallinn', 'Stroomi rand, Tallinn')}
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: 16, maxWidth: 500, margin: '0 auto' }}>
                {c('Конец пляжа, ближе к Рокка-аль-Маре — серфинг-станция Time to Surf.', 'End of the beach, near Rocca al Mare — Time to Surf station.', 'Ranna lõpus, Rocca al Mare poole — Time to Surf jaam.')}
              </p>
            </div>
            <div className="two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'start' }}>
              <div>
                <div style={{ borderRadius: 20, overflow: 'hidden', border: '2px solid var(--border)', boxShadow: '0 8px 40px rgba(0,119,190,0.1)' }}>
                  <iframe
                    src="https://www.google.com/maps?q=Stroomi%20rand%2C%20Tallinn%2C%20Estonia&z=15&output=embed"
                    width="100%"
                    height="350"
                    style={{ border: 0, display: 'block' }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Time to Surf — Stroomi rand"
                  />
                </div>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Stroomi%20rand%2C%20Tallinn%2C%20Estonia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                  style={{ marginTop: 16, display: 'inline-flex' }}
                >
                  {c('Открыть в Google Maps', 'Open in Google Maps', 'Ava Google Mapsis')}
                </a>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { icon: '📍', title: c('Адрес', 'Address', 'Aadress'), desc: c('Stroomi rand, конец пляжа, Таллин, Эстония', 'Stroomi beach, end of the beach, Tallinn, Estonia', 'Stroomi rand, ranna lõpp, Tallinn, Eesti') },
                  { icon: '🚌', title: c('Как добраться', 'Getting there', 'Kuidas jõuda'), desc: c('Автобус № 40, 48 до остановки Stroomi rand. 20 минут из центра.', 'Bus No. 40, 48 to Stroomi rand stop. 20 minutes from the centre.', 'Buss nr 40, 48 peatuseni Stroomi rand. 20 minutit kesklinnast.') },
                  { icon: '🏄', title: c('Серфинг-станция', 'Surf station', 'Surfi jaam'), desc: c('Ищите флаг Time to Surf на конце пляжа, рядом с Рокка-аль-Маре.', 'Look for the Time to Surf flag at the end of the beach near Rocca al Mare.', 'Otsige Time to Surf lippu ranna lõpus Rocca al Mare lähedal.') },
                  { icon: '☎️', title: c('По вопросам', 'Questions', 'Küsimused'), desc: '+372 55512872 (Андрей)' },
                ].map((item, i) => (
                  <div key={i} className="card" style={{ padding: '18px 20px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    {item.icon && <div style={{ fontSize: 24, flexShrink: 0, marginTop: 2 }}>{item.icon}</div>}
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)', marginBottom: 4 }}>{item.title}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: 13, lineHeight: 1.6 }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA FINAL ── */}
        <section style={{ padding: '96px 24px', background: 'linear-gradient(135deg, #0077BE, #00B4D8)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(ellipse at 70% 50%, rgba(255,255,255,0.08) 0%, transparent 60%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: -2, left: 0, right: 0, height: 80 }}>
            <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }} preserveAspectRatio="none">
              <path d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,20 1440,40 L1440,0 L0,0 Z" fill="#f0f9ff"/>
            </svg>
          </div>
          <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
            
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 900, color: 'white', marginBottom: 16, letterSpacing: '-0.03em' }}>
              {c('Количество мест ограничено!', 'Limited spots available!', 'Kohti on piiratud!')}
            </h2>
            <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, marginBottom: 12 }}>
              {c(
                'Мы работаем в маленьких группах (12–16 человек), чтобы уделить внимание каждому ребёнку.',
                'We work in small groups (12–16 children) to give attention to every child.',
                'Töötame väikestes rühmades (12–16 last), et pühendada tähelepanu igale lapsele.'
              )}
            </p>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', marginBottom: 40 }}>
              {c('Ближайшая смена: 15 июня 2026 · Цена: 265€ / 5 дней', 'Next session: June 15, 2026 · Price: €265 / 5 days', 'Järgmine vahetus: 15. juuni 2026 · Hind: 265€ / 5 päeva')}
            </p>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 28 }}>
              <a href={REGISTER_URL} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ padding: '16px 40px', fontSize: 17 }}>
                {c('Записаться в лагерь', 'Register for Camp', 'Registreeru laagrisse')}
              </a>
              <a href="tel:+37255512872" className="btn-white" style={{ padding: '16px 32px', fontSize: 17 }}>
                +372 55512872
              </a>
            </div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)' }}>
              {c('Или напишите в Telegram: ', 'Or write on Telegram: ', 'Või kirjutage Telegramis: ')}
              <a href="https://t.me/Andrei_Time_to_Surf" target="_blank" rel="noopener noreferrer" style={{ color: 'white', fontWeight: 700 }}>
                @Andrei_Time_to_Surf
              </a>
            </p>
          </div>
        </section>

        {/* ── ABOUT TTS ── */}
        <section style={{ padding: '80px 24px', background: 'var(--bg-light)' }}>
          <div style={{ maxWidth: 1160, margin: '0 auto' }}>
            <div className="two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
              <div>
                <span className="section-label" style={{ marginBottom: 20, display: 'inline-flex' }}>
                  {c('О нас', 'About us', 'Meist')}
                </span>
                <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 38px)', fontWeight: 800, marginBottom: 16, color: 'var(--text)', letterSpacing: '-0.02em' }}>
                  Time to Surf — {c('школа серфинга и сноуборда', 'surfing and snowboard school', 'surfamise ja lumelaua kool')}
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: 16, lineHeight: 1.75, marginBottom: 16 }}>
                  {c(
                    'Мы живём в Эстонии и занимаемся всеми возможными видами серфинга. Миссия нашей школы — поддержка физического и ментального развития человека и формирование здорового мышления.',
                    'We live in Estonia and practice all forms of surfing. Our school\'s mission is to support physical and mental development and build a healthy mindset.',
                    'Elame Eestis ja tegeleme kõigi surfi liikidega. Meie kooli missioon on toetada inimese füüsilist ja vaimset arengut ning kujundada tervislikku mõtteviisi.'
                  )}
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: 16, lineHeight: 1.75, marginBottom: 24 }}>
                  {c(
                    'Кайтсерфинг, виндсерфинг, САП-серфинг, вейксерфинг и классический серфинг — всё это возможно в Эстонии. В Эстонии больше возможностей, чем кажется!',
                    'Kitesurfing, windsurfing, SUP, wakesurfing and classic surfing — all possible in Estonia. Estonia has more to offer than you think!',
                    'Kaitesurfing, purjelaud, SUP, wakesurfing ja klassikaline surfamine — kõik võimalik Eestis. Eestis on rohkem võimalusi, kui arvatakse!'
                  )}
                </p>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <a href="https://www.instagram.com/timetosurf.ee" target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ padding: '10px 20px', fontSize: 13 }}>Instagram</a>
                  <a href="https://www.facebook.com/timetosurf.ee" target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ padding: '10px 20px', fontSize: 13 }}>Facebook</a>
                  <a href="https://timetosurf.ee" target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ padding: '10px 20px', fontSize: 13 }}>timetosurf.ee</a>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                {[
                  { icon: '🪁', title: c('Кайтсерфинг', 'Kitesurfing', 'Kaitesurfing'), color: '#0077BE' },
                  { icon: '⛵', title: c('Виндсерфинг', 'Windsurfing', 'Purjelaud'), color: '#00B4D8' },
                  { icon: '🏄', title: 'SUP-серфинг', color: '#FF6F61' },
                  { icon: '🌊', title: c('Классический серфинг', 'Classic Surfing', 'Klassikaline surfamine'), color: '#4CAF50' },
                ].map((s, i) => (
                  <div key={i} style={{
                    background: `${s.color}12`, border: `1.5px solid ${s.color}30`,
                    borderRadius: 14, padding: 20, textAlign: 'center',
                    transition: 'transform 0.2s',
                  }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-3px)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = '')}
                  >
                    <div className="surf-mark" style={{ background: s.color, fontSize: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-hidden="true">
                      {s.icon}
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: s.color }}>{s.title}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{ background: '#001f3d', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '40px 24px' }}>
          <div style={{ maxWidth: 1160, margin: '0 auto' }}>
            <div className="two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, marginBottom: 32 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <img src="/time-to-surf-logo.png" alt="Time to Surf" style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', background: 'white', padding: 3 }} />
                  <div>
                    <div style={{ color: 'white', fontWeight: 800, fontSize: 18, letterSpacing: '-0.02em' }}>Time to Surf</div>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      {c('Детские лагеря · Эстония', 'Kids Camps · Estonia', 'Laste laagrid · Eesti')}
                    </div>
                  </div>
                </div>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', maxWidth: 320, lineHeight: 1.7 }}>
                  {c('Серфинг-школа и летние лагеря для детей в Таллине. Пляж Штромка.', 'Surf school and summer camps for children in Tallinn. Stroomi Beach.', 'Surfamise kool ja suvelaagrid lastele Tallinnas. Stroomi rand.')}
                </p>
              </div>
              <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap' }}>
                <div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>
                    {c('Контакты', 'Contacts', 'Kontaktid')}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[
                      { icon: null, text: '+372 55512872', href: 'tel:+37255512872' },
                      { icon: '', text: 'info@timetosurf.ee', href: 'mailto:info@timetosurf.ee' },
                      { icon: '', text: 'Telegram', href: 'https://t.me/Andrei_Time_to_Surf' },
                      { icon: null, text: 'Stroomi rand, Tallinn', href: null },
                    ].map((item, i) => (
                      <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        {item.icon && <span style={{ fontSize: 14 }}>{item.icon}</span>}
                        {item.href
                          ? <a href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, textDecoration: 'none' }}>{item.text}</a>
                          : <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>{item.text}</span>}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>
                    {c('Ближайшие смены', 'Next sessions', 'Järgmised vahetused')}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {DATES.slice(0, 4).map((d, i) => (
                      <div key={i} style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
                        <span style={{ color: d.tag === 'cinema' ? '#FF6F61' : d.tag === 'hike' ? '#00B4D8' : '#00B4D8' }}>●</span> {d.dates}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
                © 2026 Time to Surf. {c('Все права защищены.', 'All rights reserved.', 'Kõik õigused kaitstud.')}
              </p>
              <a href="https://timetosurf.ee" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, textDecoration: 'none' }}>
                timetosurf.ee ↗
              </a>
            </div>
          </div>
        </footer>
      </main>
    </>
  )
}





