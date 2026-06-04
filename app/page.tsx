'use client'
import { useState, useEffect, useRef } from 'react'

type Lang = 'ru' | 'en' | 'et'
const REG = 'https://docs.google.com/forms/d/e/1FAIpQLSf-HIXlcSpWy0v0MfJ7HpFNcn_fGDd2Hns2JeHe4kZkNVtqDA/viewform'

function useReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('on') })
    }, { rootMargin: '-60px 0px -40px 0px', threshold: 0.05 })
    document.querySelectorAll('.rv, .sg').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])
}

export default function Home() {
  const [lang, setLang] = useState<Lang>('ru')
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const c = (ru: string, en: string, et: string) =>
    lang === 'ru' ? ru : lang === 'en' ? en : et

  useReveal()

  useEffect(() => {
    const saved = localStorage.getItem('tts-lang') as Lang | null
    if (saved && ['ru','en','et'].includes(saved)) setLang(saved)
    else {
      const bl = (navigator.languages?.[0] || navigator.language || 'ru').toLowerCase()
      if (bl.startsWith('et')) setLang('et')
      else if (bl.startsWith('en')) setLang('en')
      else setLang('ru')
    }
  }, [])

  const changeLang = (l: Lang) => { setLang(l); localStorage.setItem('tts-lang', l); setMenuOpen(false) }

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const go = (id: string) => {
    setMenuOpen(false)
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80)
  }

  const DATES = [
    { dates: '15.06 – 19.06.2026', type: c('СЕРФИНГ + КИНО','SURF + CINEMA','SURF + KINO'), color: '#8B4FC8', leaders: 'Наташа К. + Даша', hot: true, badge: c('Мест мало','Few spots','Kohti vähe') },
    { dates: '29.06 – 03.07.2026', type: c('СЕРФИНГ + КИНО','SURF + CINEMA','SURF + KINO'), color: '#8B4FC8', leaders: 'Наташа К. + Даша', hot: false },
    { dates: '06.07 – 10.07.2026', type: c('СЕРФИНГ ЛАГЕРЬ','SURF CAMP','SURFI LAAGER'), color: '#1A5A88', leaders: 'Надежда + Григорий', hot: false },
    { dates: '13.07 – 17.07.2026', type: c('СЕРФИНГ + ПОХОД','SURF + HIKE','SURF + MATK'), color: '#2E7D50', leaders: 'Виталий + Григорий', hot: false },
    { dates: '20.07 – 24.07.2026', type: c('СЕРФИНГ ЛАГЕРЬ','SURF CAMP','SURFI LAAGER'), color: '#1A5A88', leaders: 'Надежда + Ксения', hot: false },
    { dates: '27.07 – 30.07.2026', type: c('СЕРФИНГ (4 ДНЯ)','SURF (4 DAYS)','SURF (4 PÄEVA)'), color: '#1A5A88', leaders: c('Инструктора TBD','Instructors TBD','Instruktorid TBD'), hot: false },
    { dates: '03.08 – 07.08.2026', type: c('СЕРФИНГ ЛАГЕРЬ','SURF CAMP','SURFI LAAGER'), color: '#1A5A88', leaders: 'Даша + …', hot: false },
    { dates: '10.08 – 14.08.2026', type: c('СЕРФИНГ ЛАГЕРЬ','SURF CAMP','SURFI LAAGER'), color: '#1A5A88', leaders: 'Надежда + …', hot: false },
    { dates: '17.08 – 21.08.2026', type: c('СЕРФИНГ + ПОХОД','SURF + HIKE','SURF + MATK'), color: '#2E7D50', leaders: 'Виталий + …', hot: false },
  ]

  const FAQS = [
    { q: c('Какой возраст подходит?','What age is suitable?','Mis vanus sobib?'), a: c('Основная программа рассчитана на детей 7–12 лет. Возможно участие детей помладше, если они справляются с программой, и постарше — до 14 лет.','The main programme is designed for children aged 7–12. Younger children may participate if capable, and older ones up to 14.','Põhiprogramm on mõeldud 7–12-aastastele lastele. Nooremad lapsed võivad osaleda, kui nad tulevad programmiga toime.') },
    { q: c('Нужен ли опыт серфинга?','Is surfing experience required?','Kas surfikogemus on vajalik?'), a: c('Нет. Лагерь подходит для начинающих — мы обучаем с нуля. Дети с опытом тоже найдут задачу по уровню.','No. The camp is suitable for beginners — we teach from scratch. Experienced children will also find a challenge at their level.','Ei. Laager sobib algajatele — õpetame nullist.') },
    { q: c('Что входит в стоимость?','What is included?','Mis on hinnas sees?'), a: c('Вся программа, питание (обед и полдник от Tark Catering), гидрокостюмы, спасательные жилеты, всё оборудование, работа инструкторов и сертификат участника.','Full programme, meals (lunch and snack from Tark Catering), wetsuits, life jackets, all equipment, instructors, and a participation certificate.','Kogu programm, toitlustus, märjaksüidid, päästevested, kogu varustus ja osalussertifikaat.') },
    { q: c('Что взять с собой?','What to bring?','Mida kaasa võtta?'), a: c('Сменную одежду, полотенце, солнцезащитный крем, бутылку воды. Гидрокостюм и оборудование предоставляем мы.','A change of clothes, towel, sunscreen, water bottle. We provide the wetsuit and equipment.','Vahetusriided, rätik, päikesekaitsevahend, veepudel. Märjaksüidi ja varustuse pakume meie.') },
    { q: c('Учитываются ли пищевые аллергии?','Are food allergies considered?','Kas toiduallergiad arvestatakse?'), a: c('Да, каждый ребёнок получает индивидуальную порцию в отдельном боксе с учётом особенностей питания. Укажите аллергии при регистрации.','Yes, each child receives an individual portion accounting for dietary needs. Please note allergies at registration.','Jah, iga laps saab individuaalse portsjoni. Märkige allergiad registreerimisel.') },
    { q: c('Можно ли прийти только на несколько дней?','Can we attend for just a few days?','Kas saab tulla ainult mõneks päevaks?'), a: c('Да! Доступны форматы 3 дня (190€) и 4 дня (235€). Укажите при регистрации, на сколько дней записываетесь.','Yes! 3-day (€190) and 4-day (€235) formats are available. Specify at registration.','Jah! Saadaval on 3-päevane (190€) ja 4-päevane (235€) formaat.') },
  ]

  const s: Record<string, React.CSSProperties> = {
    wrap: { maxWidth: 1180, margin: '0 auto', padding: '0 40px' },
  }

  return (
    <>
      <style>{`
        .wrap { max-width:1180px; margin:0 auto; padding:0 40px }
        .tag { font-size:10px; font-weight:600; letter-spacing:.18em; text-transform:uppercase; display:inline-block; margin-bottom:18px }
        .tag-gold { color:var(--gold) }
        .tag-pale { color:rgba(255,255,255,.38) }
        .sec-title { font-family:'Cormorant Garamond',Georgia,serif; font-size:clamp(36px,4vw,56px); font-weight:600; line-height:1.05; letter-spacing:-.025em }
        .sec-title em { font-style:italic; color:var(--gold-lt) }
        .sec-sub { font-size:15px; font-weight:300; color:var(--muted); line-height:1.8; max-width:480px }

        .btn { display:inline-flex; align-items:center; justify-content:center; gap:10px; font-family:'DM Sans',sans-serif; font-weight:500; font-size:14px; letter-spacing:.02em; border:none; cursor:pointer; border-radius:3px; transition:transform 160ms var(--ease),box-shadow 200ms var(--ease),background 180ms ease; text-decoration:none }
        .btn:active { transform:scale(0.97)!important; transition-duration:100ms!important }
        .btn-gold { background:var(--gold); color:white; padding:14px 30px; box-shadow:0 4px 20px rgba(184,133,42,.28) }
        .btn-gold:hover { transform:translateY(-1px); box-shadow:0 8px 32px rgba(184,133,42,.42) }
        .btn-ghost { background:transparent; color:white; padding:14px 28px; border:1px solid rgba(255,255,255,.22) }
        .btn-ghost:hover { background:rgba(255,255,255,.07); border-color:rgba(255,255,255,.38) }
        .btn-outline { background:transparent; color:var(--text); padding:12px 24px; border:1px solid var(--border) }
        .btn-outline:hover { background:var(--warm); border-color:var(--mid) }
        .btn-sm { font-size:13px; padding:10px 20px }

        /* NAV */
        .nav { position:fixed; top:0; left:0; right:0; z-index:200; transition:background 280ms var(--ease),border-color 280ms ease; border-bottom:1px solid transparent }
        .nav.scrolled { background:rgba(5,12,23,.96); border-color:var(--bdark); backdrop-filter:blur(24px) }
        .nav-inner { max-width:1180px; margin:0 auto; padding:0 40px; height:66px; display:flex; align-items:center; justify-content:space-between; gap:32px }
        .nav-brand { display:flex; align-items:center; gap:11px; cursor:pointer }
        .nav-logo { width:34px; height:34px; border-radius:50%; object-fit:cover; background:white; padding:2px; flex-shrink:0 }
        .nav-brand-name { font-family:'Cormorant Garamond',serif; font-size:19px; font-weight:600; color:white; letter-spacing:.01em; line-height:1.15 }
        .nav-brand-sub { font-size:9px; font-weight:500; letter-spacing:.16em; text-transform:uppercase; color:rgba(255,255,255,.38) }
        .nav-links { display:flex; align-items:center; gap:34px }
        .nav-link { font-size:13px; font-weight:400; color:rgba(255,255,255,.55); background:none; border:none; cursor:pointer; transition:color 180ms ease; letter-spacing:.025em; padding:0 }
        .nav-link:hover { color:rgba(255,255,255,.9) }
        .nav-right { display:flex; align-items:center; gap:14px }
        .lang-sw { display:flex; gap:1px }
        .lang-btn { font-size:10px; font-weight:600; letter-spacing:.1em; text-transform:uppercase; padding:5px 8px; border-radius:3px; border:none; cursor:pointer; transition:background 180ms ease,color 180ms ease; font-family:'DM Sans',sans-serif }
        .lang-btn.active { background:rgba(255,255,255,.14); color:white }
        .lang-btn:not(.active) { background:transparent; color:rgba(255,255,255,.32) }
        .lang-btn:not(.active):hover { color:rgba(255,255,255,.65) }
        .nav-mob { display:none; background:none; border:none; cursor:pointer; color:white; padding:4px }

        /* MOBILE MENU */
        .mob-menu { position:fixed; inset:0; background:rgba(5,12,23,.98); z-index:300; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:28px; opacity:0; pointer-events:none; transition:opacity 220ms var(--ease) }
        .mob-menu.open { opacity:1; pointer-events:all }
        .mob-menu .nav-link { font-family:'Cormorant Garamond',serif; font-size:32px; font-weight:500; color:rgba(255,255,255,.8) }
        .mob-close { position:absolute; top:20px; right:24px; background:none; border:none; cursor:pointer; color:rgba(255,255,255,.6) }

        /* HERO */
        .hero { min-height:100vh; background:var(--navy); display:flex; flex-direction:column; position:relative; overflow:hidden; padding-top:66px }
        .hero-glow { position:absolute; width:900px; height:900px; background:radial-gradient(ellipse,rgba(26,90,136,.13) 0%,transparent 65%); top:-300px; right:-200px; pointer-events:none }
        .hero-glow2 { position:absolute; width:600px; height:600px; background:radial-gradient(ellipse,rgba(184,133,42,.06) 0%,transparent 65%); bottom:-100px; left:-100px; pointer-events:none }
        .hero-inner { flex:1; display:flex; align-items:center; position:relative; z-index:1 }
        .hero-grid { display:grid; grid-template-columns:1fr 440px; gap:72px; align-items:center; padding:72px 0 96px; width:100% }
        .hero-eyebrow { display:flex; align-items:center; gap:14px; margin-bottom:24px }
        .hero-eyebrow-line { width:28px; height:1px; background:var(--gold) }
        .hero-eyebrow-txt { font-size:10px; font-weight:600; letter-spacing:.2em; text-transform:uppercase; color:var(--gold) }
        .hero-h1 { font-family:'Cormorant Garamond',serif; font-size:clamp(50px,6vw,82px); font-weight:600; line-height:1.01; letter-spacing:-.03em; color:white; margin-bottom:26px }
        .hero-h1 em { font-style:italic; color:var(--gold-lt) }
        .hero-desc { font-size:16px; font-weight:300; line-height:1.85; color:rgba(255,255,255,.56); max-width:460px; margin-bottom:14px }
        .hero-meta { font-size:12px; color:rgba(255,255,255,.28); letter-spacing:.05em; margin-bottom:40px }
        .hero-actions { display:flex; gap:12px; flex-wrap:wrap; margin-bottom:48px }
        .hero-pills { display:flex; gap:8px; flex-wrap:wrap }
        .hero-pill { font-size:11px; font-weight:400; color:rgba(255,255,255,.38); padding:5px 13px; border:1px solid rgba(255,255,255,.09); border-radius:100px; letter-spacing:.03em }

        /* HERO CARD */
        .hcard { background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08); border-radius:6px; overflow:hidden }
        .hcard-head { padding:22px 26px 18px; border-bottom:1px solid rgba(255,255,255,.05) }
        .hcard-lbl { font-size:9px; font-weight:600; letter-spacing:.18em; text-transform:uppercase; color:rgba(255,255,255,.28); margin-bottom:10px }
        .hcard-row { display:flex; align-items:center; padding:13px 0; border-bottom:1px solid rgba(255,255,255,.04) }
        .hcard-row:last-child { border-bottom:none }
        .hcard-dot { width:5px; height:5px; border-radius:50%; flex-shrink:0; margin-right:12px }
        .hcard-name { font-size:14px; font-weight:400; color:rgba(255,255,255,.82); flex:1 }
        .hcard-date { font-size:11px; color:rgba(255,255,255,.28); font-variant-numeric:tabular-nums }
        .hcard-stats { display:grid; grid-template-columns:repeat(3,1fr) }
        .hstat { padding:18px 22px; text-align:center; border-right:1px solid rgba(255,255,255,.05) }
        .hstat:last-child { border-right:none }
        .hstat-n { font-family:'Cormorant Garamond',serif; font-size:30px; font-weight:600; color:white; line-height:1; margin-bottom:3px; letter-spacing:-.02em }
        .hstat-l { font-size:9px; color:rgba(255,255,255,.28); letter-spacing:.06em; text-transform:uppercase }

        /* HERO BAR */
        .hero-bar { position:relative; z-index:1; border-top:1px solid rgba(255,255,255,.05) }
        .hero-bar-grid { display:grid; grid-template-columns:repeat(4,1fr) }
        .hero-bar-item { padding:20px 32px; border-right:1px solid rgba(255,255,255,.05) }
        .hero-bar-item:last-child { border-right:none }
        .hero-bar-lbl { font-size:9px; font-weight:500; letter-spacing:.14em; text-transform:uppercase; color:rgba(255,255,255,.26); margin-bottom:3px }
        .hero-bar-val { font-family:'Cormorant Garamond',serif; font-size:19px; font-weight:500; color:rgba(255,255,255,.82); line-height:1.2 }

        /* TRUST */
        .trust { background:var(--warm); border-bottom:1px solid var(--border) }
        .trust-grid { display:grid; grid-template-columns:repeat(4,1fr) }
        .trust-item { padding:52px 36px; text-align:center; border-right:1px solid var(--border) }
        .trust-item:last-child { border-right:none }
        .trust-n { font-family:'Cormorant Garamond',serif; font-size:52px; font-weight:600; color:var(--navy); line-height:1; letter-spacing:-.025em; margin-bottom:6px }
        .trust-l { font-size:11px; font-weight:400; color:var(--muted); letter-spacing:.07em; text-transform:uppercase }

        /* PRICING (moved up) */
        .pricing { background:var(--navy-2); padding:110px 0 }
        .pricing-head { text-align:center; margin-bottom:60px }
        .pricing-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; margin-bottom:40px }
        .pcard { border-radius:4px; padding:30px; text-align:center; transition:transform 240ms var(--ease) }
        .pcard:hover { transform:translateY(-3px) }
        .pcard-std { background:rgba(255,255,255,.04); border:1px solid var(--bdark) }
        .pcard-feat { background:white; border:none }
        .pcard-tag { font-size:9px; font-weight:700; letter-spacing:.16em; text-transform:uppercase; margin-bottom:10px }
        .pcard-tag-std { color:rgba(255,255,255,.28) }
        .pcard-tag-feat { color:var(--gold) }
        .pcard-days { font-size:13px; font-weight:500; letter-spacing:.06em; text-transform:uppercase; margin-bottom:8px }
        .pcard-days-std { color:rgba(255,255,255,.45) }
        .pcard-days-feat { color:var(--mid) }
        .pcard-price { font-family:'Cormorant Garamond',serif; font-size:58px; font-weight:600; letter-spacing:-.04em; line-height:1; margin-bottom:6px }
        .pcard-price-std { color:white }
        .pcard-price-feat { color:var(--navy) }
        .pcard-note { font-size:12px; margin-bottom:26px }
        .pcard-note-std { color:rgba(255,255,255,.3) }
        .pcard-note-feat { color:var(--muted) }
        .pcard-btn-std { display:block; padding:12px; background:rgba(255,255,255,.1); color:white; border-radius:3px; font-size:13px; font-weight:500; letter-spacing:.03em; transition:background 180ms ease,transform 160ms var(--ease); text-decoration:none; text-align:center }
        .pcard-btn-std:hover { background:rgba(255,255,255,.18) }
        .pcard-btn-feat { display:block; padding:12px; background:var(--gold); color:white; border-radius:3px; font-size:13px; font-weight:500; letter-spacing:.03em; box-shadow:0 4px 16px rgba(184,133,42,.3); transition:box-shadow 180ms ease,transform 160ms var(--ease); text-decoration:none; text-align:center }
        .pcard-btn-feat:hover { box-shadow:0 8px 28px rgba(184,133,42,.44) }
        .pcard-btn-std:active,.pcard-btn-feat:active { transform:scale(0.97) }
        .popular-badge { font-size:9px; font-weight:700; letter-spacing:.12em; text-transform:uppercase; color:var(--gold); background:var(--gold-pale); padding:4px 12px; border-radius:2px; display:inline-block; margin-bottom:14px }
        .includes { background:rgba(255,255,255,.04); border:1px solid var(--bdark); border-radius:4px; padding:32px }
        .includes-title { font-size:12px; font-weight:600; letter-spacing:.12em; text-transform:uppercase; color:rgba(255,255,255,.35); margin-bottom:22px; text-align:center }
        .includes-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:16px }
        .inc-item { display:flex; align-items:flex-start; gap:10px; font-size:13px; color:rgba(255,255,255,.55) }
        .inc-dash { width:8px; height:1px; background:var(--gold); flex-shrink:0; margin-top:8px }

        /* WHY */
        .why { background:var(--navy-2); padding:110px 0 }
        .why-header { display:grid; grid-template-columns:1fr 1fr; gap:72px; align-items:end; margin-bottom:72px }
        .why-grid { display:grid; grid-template-columns:repeat(3,1fr); border-top:1px solid var(--bdark) }
        .why-item { padding:44px 38px; border-right:1px solid var(--bdark); border-bottom:1px solid var(--bdark); transition:background 260ms var(--ease) }
        .why-item:hover { background:rgba(255,255,255,.025) }
        .why-item:nth-child(3n) { border-right:none }
        .why-num { font-size:10px; font-weight:600; letter-spacing:.2em; color:var(--gold); margin-bottom:18px }
        .why-title { font-family:'Cormorant Garamond',serif; font-size:22px; font-weight:600; color:white; margin-bottom:10px; letter-spacing:-.01em; line-height:1.2 }
        .why-desc { font-size:13px; font-weight:300; color:rgba(255,255,255,.4); line-height:1.85 }

        /* FORMATS */
        .formats { background:var(--warm-2); padding:110px 0 }
        .formats-head { text-align:center; margin-bottom:60px }
        .formats-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:18px }
        .fcard { background:white; border:1px solid var(--border); border-radius:4px; overflow:hidden; transition:transform 240ms var(--ease),box-shadow 240ms var(--ease) }
        .fcard:hover { transform:translateY(-4px); box-shadow:0 20px 56px rgba(0,0,0,.08) }
        .fcard:active { transform:scale(0.99) }
        .fcard-banner { height:170px; display:flex; flex-direction:column; justify-content:flex-end; padding:22px; position:relative; overflow:hidden }
        .fcard-banner::after { content:''; position:absolute; inset:0; background:linear-gradient(to top,rgba(0,0,0,.4) 0%,transparent 60%); pointer-events:none }
        .fcard-banner-label { font-size:9px; font-weight:600; letter-spacing:.18em; text-transform:uppercase; color:rgba(255,255,255,.5); margin-bottom:6px; position:relative; z-index:1 }
        .fcard-banner-title { font-family:'Cormorant Garamond',serif; font-size:26px; font-weight:600; color:white; line-height:1.05; letter-spacing:-.01em; position:relative; z-index:1 }
        .fcard-body { padding:26px 26px 20px }
        .fcard-desc { font-size:13px; font-weight:300; color:var(--muted); line-height:1.8; margin-bottom:22px }
        .fcard-list { display:flex; flex-direction:column; gap:9px; margin-bottom:22px }
        .fcard-item { display:flex; align-items:flex-start; gap:11px; font-size:13px; color:var(--mid) }
        .fcard-dash { width:10px; height:1px; background:var(--gold); flex-shrink:0; margin-top:8px }
        .fcard-foot { padding:16px 26px; border-top:1px solid var(--border); display:flex; align-items:center; justify-content:space-between }
        .fcard-price { font-family:'Cormorant Garamond',serif; font-size:26px; font-weight:600; color:var(--navy); letter-spacing:-.02em }
        .fcard-price-sub { font-size:10px; color:var(--muted); letter-spacing:.04em }

        /* TEAM */
        .team { background:var(--warm); padding:110px 0; border-top:1px solid var(--border); border-bottom:1px solid var(--border) }
        .team-head { display:grid; grid-template-columns:1fr 1fr; gap:72px; align-items:end; margin-bottom:60px }
        .team-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:20px }
        .tcard { background:white; border:1px solid var(--border); border-radius:4px; padding:30px; transition:transform 240ms var(--ease),box-shadow 240ms var(--ease) }
        .tcard:hover { transform:translateY(-3px); box-shadow:0 16px 48px rgba(0,0,0,.07) }
        .tcard-avatar { width:56px; height:56px; border-radius:50%; background:var(--navy); display:flex; align-items:center; justify-content:center; margin-bottom:18px }
        .tcard-init { font-family:'Cormorant Garamond',serif; font-size:20px; font-weight:600; color:var(--gold-lt) }
        .tcard-name { font-family:'Cormorant Garamond',serif; font-size:21px; font-weight:600; color:var(--navy); margin-bottom:3px; letter-spacing:-.01em }
        .tcard-role { font-size:10px; font-weight:600; letter-spacing:.15em; text-transform:uppercase; color:var(--gold); margin-bottom:12px }
        .tcard-bio { font-size:13px; font-weight:300; color:var(--muted); line-height:1.8 }

        /* DATES */
        .dates { background:var(--warm-2); padding:110px 0 }
        .dates-head { text-align:center; margin-bottom:60px }
        .dates-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:14px }
        .dcard { background:white; border:1px solid var(--border); border-radius:4px; padding:22px; transition:transform 220ms var(--ease),box-shadow 220ms var(--ease) }
        .dcard:hover { transform:translateY(-2px); box-shadow:0 12px 36px rgba(0,0,0,.07) }
        .dcard.hot { border-color:var(--gold); background:rgba(184,133,42,.03) }
        .dcard-badge { font-size:9px; font-weight:700; letter-spacing:.14em; text-transform:uppercase; color:var(--gold); background:var(--gold-pale); padding:4px 10px; border-radius:2px; display:inline-block; margin-bottom:10px }
        .dcard-dates { font-family:'Cormorant Garamond',serif; font-size:20px; font-weight:600; color:var(--navy); letter-spacing:-.01em; margin-bottom:4px }
        .dcard-type { font-size:11px; font-weight:600; letter-spacing:.1em; text-transform:uppercase; margin-bottom:5px }
        .dcard-leaders { font-size:12px; color:var(--muted); margin-bottom:14px }
        .dcard-cta { display:block; text-align:center; padding:9px; background:var(--navy); color:white; border-radius:3px; font-size:12px; font-weight:500; letter-spacing:.04em; transition:background 180ms ease,transform 160ms var(--ease); text-decoration:none }
        .dcard-cta:hover { background:var(--navy-3) }
        .dcard-cta:active { transform:scale(0.97) }
        .dcard.hot .dcard-cta { background:var(--gold) }
        .dcard.hot .dcard-cta:hover { background:var(--gold-lt) }

        /* SCHEDULE */
        .sched { background:var(--navy); padding:110px 0 }
        .sched-head { text-align:center; margin-bottom:64px }
        .sched-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:0; border:1px solid var(--bdark) }
        .sched-item { padding:28px 24px; border-right:1px solid var(--bdark); border-bottom:1px solid var(--bdark); transition:background 220ms var(--ease) }
        .sched-item:hover { background:rgba(255,255,255,.025) }
        .sched-time { font-size:11px; font-weight:600; letter-spacing:.1em; color:var(--gold); margin-bottom:10px }
        .sched-name { font-family:'Cormorant Garamond',serif; font-size:18px; font-weight:600; color:white; margin-bottom:6px; letter-spacing:-.01em }
        .sched-desc { font-size:12px; font-weight:300; color:rgba(255,255,255,.35); line-height:1.7 }

        /* GALLERY */
        .gallery { background:var(--navy); padding:110px 0 }
        .gallery-head { text-align:center; margin-bottom:60px }
        .gallery-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:12px }
        .gitem { aspect-ratio:4/3; border-radius:3px; position:relative; overflow:hidden; cursor:pointer; transition:transform 240ms var(--ease) }
        .gitem:hover { transform:scale(1.02) }
        .gitem:active { transform:scale(0.98) }
        .gitem-overlay { position:absolute; inset:0; background:rgba(0,0,0,0); transition:background 200ms ease; display:flex; align-items:flex-end; padding:14px }
        .gitem:hover .gitem-overlay { background:rgba(0,0,0,.25) }
        .gitem-label { font-size:11px; font-weight:500; letter-spacing:.04em; color:rgba(255,255,255,.6); opacity:0; transform:translateY(4px); transition:opacity 200ms ease,transform 200ms var(--ease) }
        .gitem:hover .gitem-label { opacity:1; transform:translateY(0) }
        .gallery-note { text-align:center; margin-top:28px; font-size:12px; color:rgba(255,255,255,.24); letter-spacing:.04em }

        /* FAQ */
        .faq { background:var(--warm-2); padding:110px 0 }
        .faq-head { text-align:center; margin-bottom:56px }
        .faq-list { max-width:720px; margin:0 auto; display:flex; flex-direction:column; gap:8px }
        .faq-item { background:white; border:1px solid var(--border); border-radius:3px; overflow:hidden; transition:border-color 200ms ease,box-shadow 200ms ease }
        .faq-item.open { border-color:rgba(184,133,42,.3); box-shadow:0 4px 20px rgba(0,0,0,.05) }
        .faq-q { width:100%; background:none; border:none; cursor:pointer; padding:18px 22px; display:flex; justify-content:space-between; align-items:center; gap:16px; text-align:left }
        .faq-q-text { font-size:14px; font-weight:500; color:var(--text); letter-spacing:-.01em; line-height:1.45 }
        .faq-icon { width:18px; height:18px; flex-shrink:0; color:var(--gold); transition:transform 280ms var(--ease) }
        .faq-item.open .faq-icon { transform:rotate(180deg) }
        .faq-a { max-height:0; overflow:hidden; transition:max-height 320ms var(--ease-io) }
        .faq-a-inner { padding:0 22px 18px; font-size:13px; font-weight:300; color:var(--mid); line-height:1.85 }

        /* LOCATION */
        .loc { background:var(--warm); padding:110px 0; border-top:1px solid var(--border) }
        .loc-head { text-align:center; margin-bottom:60px }
        .loc-grid { display:grid; grid-template-columns:1fr 1fr; gap:40px; align-items:start }
        .loc-map { border-radius:4px; overflow:hidden; border:1px solid var(--border) }
        .loc-info { display:flex; flex-direction:column; gap:14px }
        .loc-card { background:white; border:1px solid var(--border); border-radius:3px; padding:18px 20px; display:flex; gap:14px; align-items:flex-start }
        .loc-card-icon { width:34px; height:34px; border-radius:50%; background:var(--gold-pale); display:flex; align-items:center; justify-content:center; flex-shrink:0 }
        .loc-card-title { font-size:12px; font-weight:600; color:var(--text); margin-bottom:3px; letter-spacing:.01em }
        .loc-card-text { font-size:12px; font-weight:300; color:var(--muted); line-height:1.7 }

        /* CTA */
        .cta { background:var(--navy); padding:120px 0; position:relative; overflow:hidden }
        .cta-glow { position:absolute; width:800px; height:800px; background:radial-gradient(ellipse,rgba(184,133,42,.07) 0%,transparent 65%); top:50%; left:50%; transform:translate(-50%,-50%); pointer-events:none }
        .cta-inner { text-align:center; position:relative; z-index:1; max-width:680px; margin:0 auto }
        .cta-h { font-family:'Cormorant Garamond',serif; font-size:clamp(36px,5vw,68px); font-weight:600; color:white; line-height:1.05; letter-spacing:-.03em; margin-bottom:18px }
        .cta-h em { font-style:italic; color:var(--gold-lt) }
        .cta-p { font-size:16px; font-weight:300; color:rgba(255,255,255,.5); line-height:1.8; margin-bottom:44px }
        .cta-btns { display:flex; gap:12px; justify-content:center; flex-wrap:wrap; margin-bottom:28px }
        .cta-sub { font-size:12px; color:rgba(255,255,255,.28); letter-spacing:.04em }
        .cta-sub a { color:rgba(255,255,255,.5); transition:color 180ms ease }
        .cta-sub a:hover { color:white }

        /* FOOTER */
        .footer { background:var(--navy-2); border-top:1px solid var(--bdark); padding:48px 0 36px }
        .footer-grid { display:grid; grid-template-columns:1fr auto auto; gap:64px; margin-bottom:36px; align-items:start }
        .footer-desc { font-size:12px; font-weight:300; color:rgba(255,255,255,.3); line-height:1.7; max-width:280px }
        .footer-col-title { font-size:9px; font-weight:700; letter-spacing:.18em; text-transform:uppercase; color:rgba(255,255,255,.28); margin-bottom:16px }
        .footer-links { display:flex; flex-direction:column; gap:8px }
        .footer-link { font-size:12px; color:rgba(255,255,255,.45); transition:color 180ms ease; text-decoration:none }
        .footer-link:hover { color:rgba(255,255,255,.75) }
        .footer-bottom { border-top:1px solid var(--bdark); padding-top:20px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px }
        .footer-copy { font-size:11px; color:rgba(255,255,255,.22) }
        .social-links { display:flex; gap:14px }
        .social-link { font-size:11px; color:rgba(255,255,255,.3); transition:color 180ms ease; letter-spacing:.04em; text-decoration:none }
        .social-link:hover { color:rgba(255,255,255,.65) }

        /* RESPONSIVE */
        @media(max-width:1024px){
          .wrap{padding:0 28px}
          .nav-inner{padding:0 28px}
          .hero-grid{grid-template-columns:1fr;gap:40px}
          .hero-bar-grid{grid-template-columns:repeat(2,1fr)}
          .trust-grid{grid-template-columns:repeat(2,1fr)}
          .trust-item:nth-child(2){border-right:none}
          .trust-item:nth-child(3){border-right:1px solid var(--border)}
          .trust-item:nth-child(n+3){border-top:1px solid var(--border)}
          .why-header{grid-template-columns:1fr;gap:20px}
          .why-grid{grid-template-columns:repeat(2,1fr)}
          .why-item:nth-child(2n){border-right:none}
          .formats-grid{grid-template-columns:1fr 1fr}
          .team-head{grid-template-columns:1fr;gap:20px}
          .team-grid{grid-template-columns:repeat(2,1fr)}
          .sched-grid{grid-template-columns:repeat(2,1fr)}
          .dates-grid{grid-template-columns:repeat(2,1fr)}
          .pricing-grid{grid-template-columns:1fr 1fr}
          .includes-grid{grid-template-columns:repeat(2,1fr)}
          .gallery-grid{grid-template-columns:repeat(3,1fr)}
          .loc-grid{grid-template-columns:1fr}
          .footer-grid{grid-template-columns:1fr;gap:36px}
        }
        @media(max-width:768px){
          .wrap{padding:0 20px}
          .nav-inner{padding:0 20px}
          .nav-links,.nav-right .btn{display:none}
          .nav-mob{display:block}
          .hero-h1{font-size:clamp(36px,9vw,52px)}
          .hero-grid{padding:48px 0 64px}
          .trust-grid{grid-template-columns:1fr 1fr}
          .why-grid{grid-template-columns:1fr}
          .why-item{border-right:none!important}
          .formats-grid{grid-template-columns:1fr}
          .team-grid{grid-template-columns:1fr}
          .sched-grid{grid-template-columns:1fr 1fr}
          .dates-grid{grid-template-columns:1fr}
          .pricing-grid{grid-template-columns:1fr}
          .includes-grid{grid-template-columns:1fr 1fr}
          .gallery-grid{grid-template-columns:repeat(2,1fr)}
          .cta-btns{flex-direction:column;align-items:center}
          .hero-actions{flex-direction:column;align-items:flex-start}
          .hero-actions .btn{width:100%;justify-content:center}
        }
      `}</style>

      {/* NAV */}
      <header className={`nav${scrolled ? ' scrolled' : ''}`}>
        <div className="nav-inner">
          <div className="nav-brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img src="/time-to-surf-logo.png" alt="Time to Surf" className="nav-logo" />
            <div>
              <div className="nav-brand-name">Time to Surf</div>
              <div className="nav-brand-sub">{c('Детские лагеря · Эстония', 'Kids Camps · Estonia', 'Laste laagrid · Eesti')}</div>
            </div>
          </div>
          <nav className="nav-links">
            <button className="nav-link" onClick={() => go('formats')}>{c('Программы', 'Programmes', 'Programmid')}</button>
            <button className="nav-link" onClick={() => go('pricing')}>{c('Цены', 'Prices', 'Hinnad')}</button>
            <button className="nav-link" onClick={() => go('dates')}>{c('Расписание', 'Schedule', 'Ajakava')}</button>
            <button className="nav-link" onClick={() => go('team')}>{c('Команда', 'Team', 'Meeskond')}</button>
            <button className="nav-link" onClick={() => go('location')}>{c('Место', 'Location', 'Asukoht')}</button>
          </nav>
          <div className="nav-right">
            <div className="lang-sw">
              {(['ru','en','et'] as Lang[]).map(l => (
                <button key={l} className={`lang-btn${lang === l ? ' active' : ''}`} onClick={() => changeLang(l)}>{l.toUpperCase()}</button>
              ))}
            </div>
            <a href={REG} target="_blank" className="btn btn-gold btn-sm">{c('Записаться', 'Register', 'Registreeru')}</a>
          </div>
          <button className="nav-mob" onClick={() => setMenuOpen(true)} aria-label="Menu">
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 12h16M3 7h16M3 17h16"/></svg>
          </button>
        </div>
      </header>

      {/* MOBILE MENU */}
      <div className={`mob-menu${menuOpen ? ' open' : ''}`}>
        <button className="mob-close" onClick={() => setMenuOpen(false)}>
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
        {[
          { label: c('Программы','Programmes','Programmid'), id: 'formats' },
          { label: c('Цены','Prices','Hinnad'), id: 'pricing' },
          { label: c('Расписание','Schedule','Ajakava'), id: 'dates' },
          { label: c('Команда','Team','Meeskond'), id: 'team' },
          { label: c('Место','Location','Asukoht'), id: 'location' },
        ].map(item => (
          <button key={item.id} className="nav-link" onClick={() => go(item.id)}>{item.label}</button>
        ))}
        <div className="lang-sw" style={{ marginTop: 8 }}>
          {(['ru','en','et'] as Lang[]).map(l => (
            <button key={l} className={`lang-btn${lang === l ? ' active' : ''}`} onClick={() => changeLang(l)}>{l.toUpperCase()}</button>
          ))}
        </div>
        <a href={REG} target="_blank" className="btn btn-gold" style={{ marginTop: 4 }}>{c('Записаться в лагерь','Register for Camp','Registreeru laagrisse')}</a>
      </div>

      {/* HERO */}
      <section className="hero">
        <div className="hero-glow" /><div className="hero-glow2" />
        <div className="hero-inner">
          <div className="wrap" style={{ width: '100%' }}>
            <div className="hero-grid">
              <div>
                <div className="hero-eyebrow rv">
                  <div className="hero-eyebrow-line" />
                  <span className="hero-eyebrow-txt">{c('Таллин · Пляж Штромка · Лето 2026','Tallinn · Stroomi Beach · Summer 2026','Tallinn · Stroomi rand · Suvi 2026')}</span>
                </div>
                <h1 className="hero-h1 rv" style={{ transitionDelay: '60ms' }}>
                  {c('Детский','Kids','Laste')}<br /><em>{c('серфинг-лагерь','Surf Camp','surfilaager')}</em><br />{c('на море','by the Sea','mere ääres')}
                </h1>
                <p className="hero-desc rv" style={{ transitionDelay: '120ms' }}>
                  {c('Серфинг, природа, настоящая команда — 5 дней, которые ребёнок запомнит навсегда. Таллин, море, лето 2026.','Surfing, nature, real teamwork — 5 days your child will remember forever. Tallinn, the sea, summer 2026.','Surfamine, loodus, päris meeskonnatöö — 5 päeva, mida laps igavesti mäletab.')}
                </p>
                <p className="hero-meta rv" style={{ transitionDelay: '160ms' }}>
                  {c('Возраст 7–14 лет · от 190€ · Питание включено · Малые группы 12–16 человек','Age 7–14 · from €190 · Meals included · Small groups 12–16 kids','Vanus 7–14 · alates 190€ · Toitlustus sees · Väikesed grupid 12–16 last')}
                </p>
                <div className="hero-actions rv" style={{ transitionDelay: '200ms' }}>
                  <a href={REG} target="_blank" className="btn btn-gold">{c('Записаться в лагерь','Register for Camp','Registreeru laagrisse')}</a>
                  <button onClick={() => go('formats')} className="btn btn-ghost">{c('Узнать больше','Learn More','Loe lähemalt')}</button>
                </div>
                <div className="hero-pills rv" style={{ transitionDelay: '260ms' }}>
                  {[
                    c('Сертифицированные инструктора','Certified instructors','Sertifitseeritud instruktorid'),
                    c('Питание включено','Meals included','Toitlustus sees'),
                    c('3 уникальные программы','3 unique programmes','3 ainulaadset programmi'),
                  ].map(p => <span key={p} className="hero-pill">{p}</span>)}
                </div>
              </div>
              <div className="hcard rv" style={{ transitionDelay: '180ms' }}>
                <div className="hcard-head">
                  <div className="hcard-lbl">{c('Форматы лагерей 2026','Camp Formats 2026','Laagri formaadid 2026')}</div>
                  {[
                    { color: '#8B4FC8', name: c('Серфинг + Кино','Surf + Cinema','Surf + Kino'), date: 'Jun – Jul' },
                    { color: '#2E7D50', name: c('Серфинг + Поход','Surf + Hike','Surf + Matk'), date: 'Jul – Aug' },
                    { color: '#1A5A88', name: c('Серфинг лагерь','Surf Camp','Surfilaager'), date: 'Jul – Aug' },
                  ].map(row => (
                    <div key={row.name} className="hcard-row">
                      <div className="hcard-dot" style={{ background: row.color }} />
                      <span className="hcard-name">{row.name}</span>
                      <span className="hcard-date">{row.date}</span>
                    </div>
                  ))}
                </div>
                <div className="hcard-stats">
                  <div className="hstat"><div className="hstat-n">7+</div><div className="hstat-l">{c('лет','years','aastat')}</div></div>
                  <div className="hstat"><div className="hstat-n">265€</div><div className="hstat-l">{c('5 дней','5 days','5 päeva')}</div></div>
                  <div className="hstat"><div className="hstat-n">16</div><div className="hstat-l">{c('макс. группа','max group','max grupp')}</div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-bar rv">
          <div className="wrap">
            <div className="hero-bar-grid">
              {[
                { lbl: c('Следующая смена','Next session','Järgmine vahetus'), val: '15.06.2026' },
                { lbl: c('Место','Location','Asukoht'), val: 'Stroomi rand' },
                { lbl: c('Контакт','Contact','Kontakt'), val: '+372 55512872' },
                { lbl: 'Telegram', val: '@Andrei_TTS' },
              ].map(item => (
                <div key={item.lbl} className="hero-bar-item">
                  <div className="hero-bar-lbl">{item.lbl}</div>
                  <div className="hero-bar-val">{item.val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="trust">
        <div className="wrap">
          <div className="trust-grid sg">
            {[
              { n: '7+', l: c('лет работы','years running','aastat töötame') },
              { n: '1000+', l: c('детей прошли','kids attended','last osalenud') },
              { n: '3', l: c('уникальных формата','unique formats','ainulaadset formaati') },
              { n: '9', l: c('смен за лето','sessions per summer','vahetust suvel') },
            ].map(item => (
              <div key={item.l} className="trust-item">
                <div className="trust-n">{item.n}</div>
                <div className="trust-l">{item.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FORMATS */}
      <section className="formats" id="formats">
        <div className="wrap">
          <div className="formats-head rv">
            <div className="tag tag-gold">{c('Форматы лагерей','Camp Formats','Laagri formaadid')}</div>
            <h2 className="sec-title" style={{ marginBottom: 12 }}>{c('Три уникальные программы','Three unique programmes','Kolm ainulaadset programmi')}</h2>
            <p className="sec-sub" style={{ margin: '0 auto' }}>{c('Каждый ребёнок найдёт то, что зажжёт именно его. Серфинг — основа каждой программы.','Every child finds what ignites them. Surfing is the foundation of every programme.','Iga laps leiab selle, mis just teda süütab. Surfamine on iga programmi alus.')}</p>
          </div>
          <div className="formats-grid sg">
            {[
              {
                bg: 'linear-gradient(145deg,#1A1A2E,#2D1B52)',
                lbl: c('Кино + Море','Cinema + Sea','Kino + Meri'),
                title: c('Серфинг\n+ Кино','Surf\n+ Cinema','Surf\n+ Kino'),
                desc: c('Утром — серфинг на волнах Балтийского моря. После обеда — настоящая киностудия. Дети создают короткометражный фильм, который останется на память навсегда.','Morning: surfing Baltic waves. Afternoon: a real film studio. Children create a short film that will last forever.','Hommikul surfamine. Pärastlõunal päris filmistuudio. Lapsed loovad lühifilmi igaveseks.'),
                items: [
                  c('SUP-серфинг и виндсерфинг каждое утро','SUP surfing and windsurfing every morning','SUP surfamine ja purjelaud iga hommik'),
                  c('Роли: ведущий, оператор, монтажёр','Roles: host, cameraman, editor','Rollid: saatejuht, operaator, monteerija'),
                  c('Финальный показ фильма родителям','Final screening for parents','Lõpulinastus vanematele'),
                  c('Наталья Карасёва, тележурналист 20+ лет','Natalia Karaseva, TV journalist 20+ years','Natalia Karaseva, teleajakirjanik 20+ aastat'),
                ],
              },
              {
                bg: 'linear-gradient(145deg,#0D2B1A,#1A4A2E)',
                lbl: c('Природа + Море','Nature + Sea','Loodus + Meri'),
                title: c('Серфинг\n+ Поход','Surf\n+ Hike','Surf\n+ Matk'),
                desc: c('Серфинг на воде плюс настоящие приключения в природе: ориентирование, разведение костра, установка палатки.','Surfing plus real nature adventures: navigation, fire starting, tent setup. The child returns a different person.','Surfamine vees pluss päris loodusseiklused: navigeerimine, lõkke tegemine, telgi püstitamine.'),
                items: [
                  c('Серфинг и SUP каждый день','Surfing and SUP every day','Surfamine ja SUP iga päev'),
                  c('Ориентирование по карте и компасу','Map and compass navigation','Kaardi ja kompassi navigeerimine'),
                  c('Навыки выживания, костёр, палатка','Survival skills, fire, tent','Ellujäämisoskused, lõke, telk'),
                  c('Виталий Холстинин, Höga Kusten 140км','Vitaliy, Höga Kusten 140km hiker','Vitaliy, Höga Kusten 140km matkaja'),
                ],
              },
              {
                bg: 'linear-gradient(145deg,#0D1E3A,#0F3A5C)',
                lbl: c('Классика · Лучший старт','Classic · Best start','Klassika · Parim algus'),
                title: c('Серфинг\nлагерь','Surf\nCamp','Surfi\nlaager'),
                desc: c('Классическая программа для тех, кто впервые открывает мир серфинга. Разные виды, безопасность на воде, командные игры.','Classic programme for those discovering surfing for the first time. Various types, water safety, team games.','Klassikaline programm neile, kes avastab surfamise maailma esimest korda.'),
                items: [
                  c('SUP, виндсерфинг, кайт, бодиборд','SUP, windsurfing, kite, bodyboard','SUP, purjelaud, kait, lauasurfamine'),
                  c('Гидрокостюмы и оборудование включены','Wetsuits and equipment included','Märjaksüidid ja varustus sees'),
                  c('Безопасность на воде — основа программы','Water safety is the programme foundation','Veeohutus on programmi alus'),
                  c('Для полных новичков и опытных детей','For total beginners and experienced kids','Täielikele algajatele ja kogenud lastele'),
                ],
              },
            ].map((fc, i) => (
              <div key={i} className="fcard">
                <div className="fcard-banner" style={{ background: fc.bg }}>
                  <div className="fcard-banner-label">{fc.lbl}</div>
                  <div className="fcard-banner-title">{fc.title.split('\n').map((line, j) => <span key={j}>{line}{j === 0 && <br />}</span>)}</div>
                </div>
                <div className="fcard-body">
                  <p className="fcard-desc">{fc.desc}</p>
                  <div className="fcard-list">
                    {fc.items.map((item, j) => <div key={j} className="fcard-item"><div className="fcard-dash" /><span>{item}</span></div>)}
                  </div>
                </div>
                <div className="fcard-foot">
                  <div><div className="fcard-price">265€</div><div className="fcard-price-sub">{c('5 дней, всё включено','5 days, all included','5 päeva, kõik sees')}</div></div>
                  <a href={REG} target="_blank" className="btn btn-gold btn-sm">{c('Записаться','Register','Registreeru')}</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING — moved up before Why/Schedule */}
      <section className="pricing" id="pricing">
        <div className="wrap">
          <div className="pricing-head rv">
            <div className="tag tag-pale">{c('Стоимость','Pricing','Hinnad')}</div>
            <h2 className="sec-title" style={{ color: 'white', marginBottom: 12 }}>
              {c('Прозрачные цены,','Transparent pricing,','Läbipaistvad hinnad,')}<br /><em>{c('всё включено','all included','kõik sees')}</em>
            </h2>
          </div>
          <div className="pricing-grid sg">
            <div className="pcard pcard-std">
              <div className="pcard-tag pcard-tag-std">{c('3 ДНЯ','3 DAYS','3 PÄEVA')}</div>
              <div className="pcard-days pcard-days-std">{c('Пробная смена','Trial session','Proovisessioon')}</div>
              <div className="pcard-price pcard-price-std">190€</div>
              <div className="pcard-note pcard-note-std">{c('Идеально для первого знакомства','Perfect for a first try','Ideaalne esimeseks tutvuseks')}</div>
              <a href={REG} target="_blank" className="pcard-btn-std">{c('Записаться','Register','Registreeru')}</a>
            </div>
            <div className="pcard pcard-feat">
              <div className="popular-badge">{c('Самый популярный','Most popular','Populaarseim')}</div>
              <div className="pcard-tag pcard-tag-feat">{c('5 ДНЕЙ','5 DAYS','5 PÄEVA')}</div>
              <div className="pcard-days pcard-days-feat">{c('Полная программа','Full programme','Täisprogramm')}</div>
              <div className="pcard-price pcard-price-feat">265€</div>
              <div className="pcard-note pcard-note-feat">{c('Максимум впечатлений и навыков','Maximum impressions and skills','Maksimaalselt muljeid ja oskusi')}</div>
              <a href={REG} target="_blank" className="pcard-btn-feat">{c('Записаться','Register','Registreeru')}</a>
            </div>
            <div className="pcard pcard-std">
              <div className="pcard-tag pcard-tag-std">{c('4 ДНЯ','4 DAYS','4 PÄEVA')}</div>
              <div className="pcard-days pcard-days-std">{c('Гибкий формат','Flexible format','Paindlik formaat')}</div>
              <div className="pcard-price pcard-price-std">235€</div>
              <div className="pcard-note pcard-note-std">{c('Удобно для занятых семей','Convenient for busy families','Mugav hõivatud peredele')}</div>
              <a href={REG} target="_blank" className="pcard-btn-std">{c('Записаться','Register','Registreeru')}</a>
            </div>
          </div>
          <div className="includes rv">
            <div className="includes-title">{c('В цену входит','Included in price','Hind sisaldab')}</div>
            <div className="includes-grid">
              {[
                c('Вся программа серфинга','Full surf programme','Kogu surfi programm'),
                c('Питание (Tark Catering)','Meals (Tark Catering)','Toitlustus (Tark Catering)'),
                c('Гидрокостюмы и жилеты','Wetsuits and life jackets','Märjaksüidid ja päästevested'),
                c('Всё необходимое оборудование','All necessary equipment','Kogu vajalik varustus'),
                c('Работа инструкторов','Instructor work','Instruktorite töö'),
                c('Полдник / чаепитие','Afternoon snack','Pärastlõunane eine'),
                c('Мастер-классы и активности','Workshops and activities','Töötoad ja tegevused'),
                c('Сертификат участника','Participation certificate','Osalussertifikaat'),
              ].map(item => (
                <div key={item} className="inc-item"><div className="inc-dash" /><span>{item}</span></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* WHY */}
      <section className="why" style={{ background: 'var(--navy)' }}>
        <div className="wrap">
          <div className="why-header">
            <div className="rv">
              <div className="tag tag-pale">{c('Почему это важно','Why it matters','Miks see on oluline')}</div>
              <h2 className="sec-title" style={{ color: 'white' }}>
                {c('Серфинг — это больше,','Surfing is more','Surfamine on rohkem')}<br /><em>{c('чем спорт','than a sport','kui sport')}</em>
              </h2>
            </div>
            <div className="rv" style={{ transitionDelay: '80ms' }}>
              <p className="sec-sub" style={{ color: 'rgba(255,255,255,.4)', maxWidth: 380 }}>
                {c('Это стиль мышления и образ жизни, который остаётся с ребёнком навсегда. Мы создаём опыт, а не просто лагерь.','It\'s a mindset and lifestyle that stays with the child forever. We create experiences, not just a camp.','See on mõtteviis ja eluviis, mis jääb lapsega igaveseks.')}
              </p>
            </div>
          </div>
          <div className="why-grid sg">
            {[
              { n: '01', t: c('Здоровье и сила','Health & Strength','Tervis ja tugevus'), d: c('Свежий морской воздух, движение, солнце — полная перезагрузка тела и духа за пять дней.','Sea air, movement, sun — a complete recharge of body and spirit in five days.','Mereõhk, liikumine, päike — keha ja vaimu täielik taastumine viie päevaga.') },
              { n: '02', t: c('Здесь и сейчас','Present moment','Praegune hetk'), d: c('На волне невозможно думать о лишнем. Вода учит концентрации и осознанности лучше любого тренинга.','On a wave, your mind can only be here. Water teaches focus and mindfulness better than any training.','Lainel saab mõelda ainult praegusele. Vesi õpetab keskendumisvõimet.') },
              { n: '03', t: c('Чтение природы','Reading nature','Looduse lugemine'), d: c('Дети учатся читать ветер, воду и погоду. Навык, который остаётся на всю жизнь.','Children learn to read wind, water, and weather — a skill that lasts a lifetime.','Lapsed õpivad lugema tuult, vett ja ilma — oskus, mis jääb kogu eluks.') },
              { n: '04', t: c('Уверенность в себе','Self-confidence','Enesekindlus'), d: c('Встать на доску и поймать волну — это победа, которую ребёнок помнит всегда.','Standing on a board and catching a wave is a victory the child always remembers.','Lauale tõusmine ja laine püüdmine on võit, mida laps alati mäletab.') },
              { n: '05', t: c('Командный дух','Team spirit','Meeskonnavaim'), d: c('Через игры и совместную работу дети учатся поддерживать друг друга в нужный момент.','Through games and joint activities children learn to support each other when it matters.','Mängude kaudu õpivad lapsed üksteist toetama olulisel hetkel.') },
              { n: '06', t: c('Внутренний баланс','Inner balance','Sisemine tasakaal'), d: c('Вода учит спокойствию и эмоциональному контролю. Лучшая профилактика тревожности для детей.','Water teaches calm and emotional control — the best prevention of anxiety for children.','Vesi õpetab rahulikkust ja emotsioonikontrolli — parim ärevuse ennetamine lastele.') },
            ].map(item => (
              <div key={item.n} className="why-item">
                <div className="why-num">{item.n}</div>
                <div className="why-title">{item.t}</div>
                <div className="why-desc">{item.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="team" id="team">
        <div className="wrap">
          <div className="team-head">
            <div className="rv">
              <div className="tag tag-gold">{c('Наша команда','Our team','Meie meeskond')}</div>
              <h2 className="sec-title">
                {c('Люди, которым','People you','Inimesed, kellele')}<br /><em>{c('вы доверяете','can trust','usaldate')}</em>
              </h2>
            </div>
            <div className="rv" style={{ transitionDelay: '80ms' }}>
              <p className="sec-sub">{c('Каждый инструктор — это личность со своим опытом и страстью. Ваш ребёнок в надёжных руках.','Every instructor is a personality with their own experience and passion. Your child is in safe hands.','Iga instruktor on isiksus oma kogemuse ja kirega. Teie laps on heades kätes.')}</p>
            </div>
          </div>
          <div className="team-grid sg">
            {[
              { init: 'НК', name: 'Наталья Карасёва', role: c('Ведущая кино-программы','Cinema programme lead','Kinoosa juht'), bio: c('Тележурналист с 20-летним стажем, автор подкаста «Cozy with Tasha», создатель документальных проектов. Учит детей видеть историю в каждом кадре.','TV journalist with 20 years of experience, podcast author, documentary filmmaker. Teaches children to see a story in every frame.','Teleajakirjanik 20-aastase kogemusega, taskuhäälingu autor, dokumentaalfilmide looja.') },
              { init: 'ВХ', name: 'Виталий Холстинин', role: c('Ведущий походной программы','Hiking programme lead','Matkaprogrammi juht'), bio: c('Предприниматель, хайкер, создатель сообщества Join The Hike. Прошёл маршруты Höga Kusten (140 км) и Land of Giants (120 км).','Entrepreneur, hiker, founder of Join The Hike. Completed Höga Kusten (140km) and Land of Giants (120km).','Ettevõtja, matkaja, Join The Hike asutaja. Läbinud Höga Kusten (140km) ja Land of Giants (120km).') },
              { init: 'НГ', name: 'Надежда + Григорий', role: c('Серфинг-инструктора','Surf instructors','Surfiinstruktorid'), bio: c('Сертифицированные инструктора по серфингу с многолетним опытом работы с детьми на Балтийском море. Умеют мотивировать и поддерживать на каждом этапе.','Certified surf instructors with years of experience working with children on the Baltic Sea.','Sertifitseeritud surfiinstruktorid mitmeaastase kogemusega lastega töötamisel Läänemeres.') },
            ].map(t => (
              <div key={t.name} className="tcard">
                <div className="tcard-avatar"><span className="tcard-init">{t.init}</span></div>
                <div className="tcard-name">{t.name}</div>
                <div className="tcard-role">{t.role}</div>
                <p className="tcard-bio">{t.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DATES */}
      <section className="dates" id="dates">
        <div className="wrap">
          <div className="dates-head rv">
            <div className="tag tag-gold">{c('Все смены','All sessions','Kõik vahetused')}</div>
            <h2 className="sec-title" style={{ marginBottom: 12 }}>{c('Расписание лета 2026','Summer 2026 schedule','Suve 2026 ajakava')}</h2>
            <p className="sec-sub" style={{ margin: '0 auto' }}>{c('Выберите подходящую смену и запишитесь сейчас — места ограничены.','Choose your session and register now — spots are limited.','Valige sobiv vahetus ja registreeruge kohe — kohti on piiratud.')}</p>
          </div>
          <div className="dates-grid sg">
            {DATES.map((d, i) => (
              <div key={i} className={`dcard${d.hot ? ' hot' : ''}`}>
                {d.hot && d.badge && <div className="dcard-badge">{d.badge}</div>}
                <div className="dcard-dates">{d.dates}</div>
                <div className="dcard-type" style={{ color: d.color }}>{d.type}</div>
                <div className="dcard-leaders">{d.leaders}</div>
                <a href={REG} target="_blank" className="dcard-cta">{c('Записаться →','Register →','Registreeru →')}</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SCHEDULE */}
      <section className="sched" id="program">
        <div className="wrap">
          <div className="sched-head rv">
            <div className="tag tag-pale">{c('День в лагере','A day at camp','Päev laagris')}</div>
            <h2 className="sec-title" style={{ color: 'white' }}>{c('Расписание дня','Daily Schedule','Päevakava')}</h2>
          </div>
          <div className="sched-grid sg">
            {[
              { time: '09:00', name: c('Сбор','Arrival','Kogunemine'), desc: c('Встреча детей, знакомство, настрой на день','Meeting kids, introductions, setting the mood','Laste vastuvõtt, tutvumine, häälestamine') },
              { time: '09:30', name: c('Разминка','Warm-up','Soojendus'), desc: c('Активные тренировки и командные игры на берегу','Active training and team games on the shore','Aktiivsed treeningud ja meeskonnmängud kaldal') },
              { time: '10:00', name: c('Водный блок','Water block','Vesiplokk'), desc: c('Безопасность, гидрокостюмы, SUP-серфинг','Safety brief, wetsuits, SUP surfing','Ohutus, märjaksüidid, SUP surfamine') },
              { time: '12:00', name: c('Обед','Lunch','Lõuna'), desc: c('Индивидуальные порции, учёт аллергий, Tark Catering','Individual portions, allergies noted, Tark Catering','Individuaalsed portsjonid, allergiad arvestatud') },
              { time: '13:30', name: c('Активная программа','Active programme','Aktiivne programm'), desc: c('Виндсёрфинг, кайт, SUP, пляжные игры или поход','Windsurfing, kite, SUP, beach games or hiking','Purjelaud, kait, SUP, rannamängud või matk') },
              { time: '15:30', name: c('Чаепитие','Tea time','Tee aeg'), desc: c('Перерыв, отдых, общение в группе','Break, rest, group conversation','Paus, puhkus, grupis suhtlemine') },
              { time: '16:30', name: c('Спокойный блок','Calm block','Rahulik plokk'), desc: c('Игры, творчество, интеллектуальные задания','Games, creativity, intellectual tasks','Mängud, loovus, intellektuaalsed ülesanded') },
              { time: '17:00', name: c('Домой','Home time','Kodu aeg'), desc: c('Конец программы, ожидание родителей','Programme ends, parents pick up','Programm lõpeb, vanemad tulevad järele') },
            ].map(item => (
              <div key={item.time} className="sched-item">
                <div className="sched-time">{item.time}</div>
                <div className="sched-name">{item.name}</div>
                <div className="sched-desc">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="gallery" id="gallery">
        <div className="wrap">
          <div className="gallery-head rv">
            <div className="tag tag-pale">{c('Атмосфера','Atmosphere','Atmosfäär')}</div>
            <h2 className="sec-title" style={{ color: 'white' }}>{c('Жизнь в лагере','Life at camp','Elu laagris')}</h2>
          </div>
          <div className="gallery-grid sg">
            {[
              { bg: 'linear-gradient(135deg,#0D1E3A,#0F3A5C)', label: c('SUP-серфинг','SUP Surfing','SUP surfamine') },
              { bg: 'linear-gradient(135deg,#1A1A2E,#2D1B52)', label: c('Кино-смена','Cinema Camp','Kinolaager') },
              { bg: 'linear-gradient(135deg,#0D2B1A,#1A4A2E)', label: c('Природа и поход','Nature & Hiking','Loodus ja matk') },
              { bg: 'linear-gradient(135deg,#2A1A0D,#4A2E14)', label: c('Команда','Team','Meeskond') },
              { bg: 'linear-gradient(135deg,#0D1E3A,#0F3A5C)', label: c('Виндсерфинг','Windsurfing','Purjelaud') },
              { bg: 'linear-gradient(135deg,#0D2B1A,#1A4A2E)', label: c('Мастер-классы','Workshops','Töötoad') },
              { bg: 'linear-gradient(135deg,#1A1A2E,#2D1B52)', label: c('Штромка','Stroomi Beach','Stroomi rand') },
              { bg: 'linear-gradient(135deg,#2A1A0D,#4A2E14)', label: c('Безопасность','Water Safety','Veeohutus') },
            ].map((g, i) => (
              <div key={i} className="gitem" style={{ background: g.bg }}>
                <div className="gitem-overlay"><span className="gitem-label">{g.label}</span></div>
              </div>
            ))}
          </div>
          <div className="gallery-note">{c('Фотографии сезона 2026 появятся с началом первой смены','Season 2026 photos will appear with the start of the first session','2026. aasta hooaja fotod ilmuvad esimese vahetuse algusega')}</div>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq" id="faq">
        <div className="wrap">
          <div className="faq-head rv">
            <div className="tag tag-gold">FAQ</div>
            <h2 className="sec-title" style={{ marginBottom: 12 }}>{c('Частые вопросы','Frequently asked','Korduma kippuvad')}</h2>
          </div>
          <div className="faq-list">
            {FAQS.map((faq, i) => (
              <div key={i} className={`faq-item rv${openFaq === i ? ' open' : ''}`} style={{ transitionDelay: `${i * 40}ms` }}>
                <button className="faq-q" onClick={() => {
                  const el = document.querySelectorAll('.faq-a')[i] as HTMLElement
                  if (openFaq === i) {
                    setOpenFaq(null)
                    el.style.maxHeight = '0'
                  } else {
                    if (openFaq !== null) {
                      const prev = document.querySelectorAll('.faq-a')[openFaq] as HTMLElement
                      if (prev) prev.style.maxHeight = '0'
                    }
                    setOpenFaq(i)
                    el.style.maxHeight = el.scrollHeight + 'px'
                  }
                }}>
                  <span className="faq-q-text">{faq.q}</span>
                  <svg className="faq-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 9l6 6 6-6"/></svg>
                </button>
                <div className="faq-a"><div className="faq-a-inner">{faq.a}</div></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LOCATION */}
      <section className="loc" id="location">
        <div className="wrap">
          <div className="loc-head rv">
            <div className="tag tag-gold">{c('Место проведения','Location','Asukoht')}</div>
            <h2 className="sec-title">{c('Пляж Штромка, Таллин','Stroomi Beach, Tallinn','Stroomi rand, Tallinn')}</h2>
          </div>
          <div className="loc-grid">
            <div>
              <div className="loc-map">
                <iframe src="https://www.google.com/maps?q=Stroomi+rand+Tallinn&z=15&output=embed" width="100%" height="340" style={{ border: 0, display: 'block' }} allowFullScreen loading="lazy" />
              </div>
              <a href="https://www.google.com/maps/search/?api=1&query=Stroomi+rand+Tallinn" target="_blank" className="btn btn-outline" style={{ marginTop: 14, display: 'inline-flex' }}>{c('Открыть в Google Maps','Open in Google Maps','Ava Google Mapsis')}</a>
            </div>
            <div className="loc-info sg">
              {[
                { icon: <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>, title: c('Адрес','Address','Aadress'), text: c('Stroomi rand, конец пляжа, ближе к Рокка-аль-Маре, Таллин','Stroomi beach, end of the beach, near Rocca al Mare, Tallinn','Stroomi rand, ranna lõpp, Rocca al Mare lähedal, Tallinn') },
                { icon: <><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>, title: c('Как добраться','Getting there','Kuidas jõuda'), text: c('Автобусы №40, 48 до остановки Stroomi rand — 20 минут из центра города','Buses 40, 48 to Stroomi rand stop — 20 minutes from the city centre','Bussid nr 40, 48 peatuseni Stroomi rand — 20 minutit kesklinnast') },
                { icon: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.7 12 19.79 19.79 0 0 1 1.58 3.38 2 2 0 0 1 3.55 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.7a16 16 0 0 0 6.29 6.29l.9-.9a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>, title: c('Контакт','Contact','Kontakt'), text: '+372 55512872 (Андрей)\ninfo@timetosurf.ee' },
                { icon: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>, title: 'Telegram', text: '@Andrei_Time_to_Surf' },
              ].map((card, i) => (
                <div key={i} className="loc-card">
                  <div className="loc-card-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.8" style={{ width: 15, height: 15 }}>{card.icon}</svg>
                  </div>
                  <div>
                    <div className="loc-card-title">{card.title}</div>
                    <div className="loc-card-text" style={{ whiteSpace: 'pre-line' }}>{card.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <div className="cta-glow" />
        <div className="wrap">
          <div className="cta-inner rv">
            <div className="tag tag-pale">{c('Лето 2026 · Таллин','Summer 2026 · Tallinn','Suvi 2026 · Tallinn')}</div>
            <h2 className="cta-h">
              {c('Места','Spots are','Kohti on')} <em>{c('ограничены.','limited.','piiratud.')}</em><br />{c('Записывайтесь сейчас.','Register now.','Registreeruge kohe.')}
            </h2>
            <p className="cta-p">{c('Мы работаем в малых группах — 12–16 детей — чтобы каждый ребёнок получил внимание инструктора. Ближайшая смена: 15 июня 2026.','We work in small groups — 12–16 children — so every child receives instructor attention. Next session: June 15, 2026.','Töötame väikestes rühmades — 12–16 last — et iga laps saaks instruktori tähelepanu.')}</p>
            <div className="cta-btns">
              <a href={REG} target="_blank" className="btn btn-gold" style={{ padding: '16px 36px', fontSize: 15 }}>{c('Записаться в лагерь','Register for Camp','Registreeru laagrisse')}</a>
              <a href="tel:+37255512872" className="btn btn-ghost" style={{ padding: '16px 28px', fontSize: 15 }}>+372 55512872</a>
            </div>
            <div className="cta-sub">
              Telegram: <a href="https://t.me/Andrei_Time_to_Surf" target="_blank">@Andrei_Time_to_Surf</a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="wrap">
          <div className="footer-grid">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 14 }}>
                <img src="/time-to-surf-logo.png" alt="Time to Surf" style={{ width: 38, height: 38, borderRadius: '50%', background: 'white', padding: 2, objectFit: 'cover' }} />
                <div>
                  <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, fontWeight: 600, color: 'white', letterSpacing: '.01em' }}>Time to Surf</div>
                  <div style={{ fontSize: 9, fontWeight: 500, letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,.28)' }}>{c('Детские лагеря · Эстония','Kids Camps · Estonia','Laste laagrid · Eesti')}</div>
                </div>
              </div>
              <p className="footer-desc">{c('Серфинг-школа и летние лагеря для детей в Таллине. Пляж Штромка. С 2017 года.','Surf school and summer camps for children in Tallinn. Stroomi Beach. Since 2017.','Surfamise kool ja suvelaagrid lastele Tallinnas. Stroomi rand. Alates 2017.')}</p>
            </div>
            <div>
              <div className="footer-col-title">{c('Контакты','Contacts','Kontaktid')}</div>
              <div className="footer-links">
                <a href="tel:+37255512872" className="footer-link">+372 55512872</a>
                <a href="mailto:info@timetosurf.ee" className="footer-link">info@timetosurf.ee</a>
                <a href="https://t.me/Andrei_Time_to_Surf" target="_blank" className="footer-link">Telegram</a>
              </div>
            </div>
            <div>
              <div className="footer-col-title">{c('Ссылки','Links','Lingid')}</div>
              <div className="footer-links">
                <a href="https://timetosurf.ee" target="_blank" className="footer-link">timetosurf.ee</a>
                <a href="https://www.instagram.com/timetosurf.ee" target="_blank" className="footer-link">Instagram</a>
                <a href="https://www.facebook.com/timetosurf.ee" target="_blank" className="footer-link">Facebook</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <span className="footer-copy">© 2026 Time to Surf</span>
            <div className="social-links">
              <a href="https://www.instagram.com/timetosurf.ee" target="_blank" className="social-link">Instagram</a>
              <a href="https://www.facebook.com/timetosurf.ee" target="_blank" className="social-link">Facebook</a>
              <a href="https://timetosurf.ee" target="_blank" className="social-link">timetosurf.ee ↗</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
