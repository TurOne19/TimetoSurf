'use client'
import { useState, useEffect, useRef } from 'react'

type Lang = 'ru' | 'en' | 'et'
const REG = 'https://docs.google.com/forms/d/e/1FAIpQLSf-HIXlcSpWy0v0MfJ7HpFNcn_fGDd2Hns2JeHe4kZkNVtqDA/viewform'

function useReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('on') })
    }, { rootMargin: '-40px 0px -20px 0px', threshold: 0.04 })
    document.querySelectorAll('.rv, .sg').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])
}

interface Review { id: number; name: string; text: string; program?: string; rating: number }

function ScrollProgress() {
  const [prog, setProg] = useState(0)
  useEffect(() => {
    const fn = () => {
      const h = document.documentElement
      setProg((window.scrollY / (h.scrollHeight - h.clientHeight)) * 100)
    }
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])
  return (
    <div style={{position:'fixed',top:0,left:0,right:0,height:'3px',background:'transparent',zIndex:999,pointerEvents:'none'}}>
      <div style={{height:'100%',width:`${prog}%`,background:'linear-gradient(90deg,var(--teal),var(--teal-lt),var(--sun))',transition:'width 60ms linear',boxShadow:'0 0 8px rgba(10,172,172,.6)'}}/>
    </div>
  )
}

export default function Home() {
  const [lang, setLang] = useState<Lang>('ru')
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [expandedFormat, setExpandedFormat] = useState<number | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [reviewHover, setReviewHover] = useState(0)
  const [reviewForm, setReviewForm] = useState({ name: '', text: '', program: '', rating: 0 })
  const [reviewSent, setReviewSent] = useState(false)
  const [reviewLoading, setReviewLoading] = useState(false)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [galleryLightbox, setGalleryLightbox] = useState<{src:string,idx:number,pool:'gallery'|'hero'} | null>(null)
  const [programModal, setProgramModal] = useState<string | null>(null)
  const [introVisible, setIntroVisible] = useState(true)

  const c = (ru: string, en: string, et: string) => lang === 'ru' ? ru : lang === 'en' ? en : et

  useReveal()

  useEffect(() => {
    const saved = localStorage.getItem('tts-lang') as Lang | null
    if (saved) setLang(saved)
    else {
      const bl = (navigator.languages?.[0] || 'ru').toLowerCase()
      if (bl.startsWith('et')) setLang('et')
      else if (bl.startsWith('en')) setLang('en')
    }
  }, [])

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => { document.body.style.overflow = (menuOpen || galleryLightbox !== null || programModal !== null) ? 'hidden' : '' }, [menuOpen, galleryLightbox, programModal])

  useEffect(() => {
    fetch('/api/reviews').then(r => r.json()).then(d => { if (Array.isArray(d)) setReviews(d) }).catch(() => {})
  }, [])

  // 4 hero showcase photos (top grid, separate lightbox)
  const HERO_PHOTOS = [
    '/photo-output-2-1024x1024__1_.jpeg',
    '/IMG_7917-1024x768.jpeg',
    '/IMG_6615-821x1024.jpeg',
    '/IMG_8779-1-768x1024.jpeg',
  ]

  // All gallery photos organized in sections
  const GALLERY_SECTIONS = [
    {
      label: c('На воде', 'On the Water', 'Vees'),
      imgs: [
        '/DSC02601-150x150.jpeg',
        '/DSC02691-150x150.jpeg',
        '/DSC02699-150x150.jpeg',
        '/DSC02878-150x150.jpeg',
        '/DSC02883-150x150.jpeg',
        '/DSC02899-150x150.jpeg',
        '/IMG_7757-150x150.jpeg',
        '/IMG_7758-150x150.jpeg',
        '/IMG_7773-150x150.jpeg',
        '/IMG_7752-150x150.jpeg',
        '/IMG_7796-150x150.jpeg',
        '/IMG_7787-150x150.jpeg',
      ]
    },
    {
      label: c('Команда и атмосфера', 'Team & Vibes', 'Meeskond ja atmosfäär'),
      imgs: [
        '/217650841_4107074432694657_6267790752617918985_n.jpg',
        '/IMG_0806-150x150.jpeg',
        '/IMG_0843-150x150.jpeg',
        '/IMG_0850-150x150.jpeg',
        '/IMG_0857-150x150.jpeg',
        '/IMG_7805-150x150.jpeg',
        '/IMG_7807-150x150.jpeg',
        '/IMG_7809-150x150.jpeg',
        '/IMG_7812-150x150.jpeg',
        '/IMG_7659-150x150.jpeg',
        '/IMG_7046-150x150.jpg',
      ]
    },
    {
      label: c('Моменты', 'Moments', 'Hetked'),
      imgs: [
        '/IMG_9281-150x150.jpeg',
        '/IMG_9284-150x150.jpeg',
        '/IMG_9294-150x150.jpeg',
        '/IMG_9302-150x150.jpeg',
        '/IMG_9532-150x150.jpeg',
        '/IMG_9585-150x150.jpeg',
        '/IMG_6342-150x150.jpg',
        '/IMG_6351-150x150.jpg',
        '/IMG_6359-2-150x150.jpg',
        '/IMG_6613-150x150.jpeg',
        '/IMG_6614-150x150.jpeg',
        '/photo_2026-04-18-10_00_40-150x150.jpeg',
        '/photo_2026-04-18-10_00_44-150x150.jpeg',
        '/photo_2026-04-18-10_00_46-150x150.jpeg',
        '/IMG_8779-1-768x1024.jpeg',
        '/photo-output-2-1024x1024__1_.jpeg',
      ]
    },
  ]

  // Flat list for lightbox navigation
  const GALLERY_IMGS = GALLERY_SECTIONS.flatMap(s => s.imgs)

  useEffect(() => {
    if (!galleryLightbox) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setGalleryLightbox(null)
      const pool = galleryLightbox.pool === 'hero' ? HERO_PHOTOS : GALLERY_IMGS
      if (e.key === 'ArrowRight') setGalleryLightbox(prev => {
        if (!prev) return null
        const next = (prev.idx + 1) % pool.length
        return { src: pool[next], idx: next, pool: prev.pool }
      })
      if (e.key === 'ArrowLeft') setGalleryLightbox(prev => {
        if (!prev) return null
        const next = (prev.idx - 1 + pool.length) % pool.length
        return { src: pool[next], idx: next, pool: prev.pool }
      })
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [galleryLightbox])

  const go = (id: string) => {
    setMenuOpen(false)
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80)
  }

  const submitReview = async () => {
    if (!reviewForm.name || !reviewForm.text || reviewForm.rating === 0) return
    setReviewLoading(true)
    try {
      await fetch('/api/reviews', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(reviewForm) })
      setReviewSent(true)
    } catch {}
    setReviewLoading(false)
  }

  const DATES = [
    { dates: '15.06 - 19.06.2026', type: c('СЕРФИНГ + КИНО','SURF + CINEMA','SURF + KINO'), color: '#7C3AED', leaders: c('Наташа К. + Даша','Natasha K. + Dasha','Natasha K. + Dasha'), hot: true, detail: 'kino' },
    { dates: '29.06 - 03.07.2026', type: c('СЕРФИНГ + КИНО','SURF + CINEMA','SURF + KINO'), color: '#7C3AED', leaders: c('Наташа К. + Даша','Natasha K. + Dasha','Natasha K. + Dasha'), hot: false, detail: 'kino' },
    { dates: '06.07 - 10.07.2026', type: c('СЕРФИНГ ЛАГЕРЬ','SURF CAMP','SURFI LAAGER'), color: '#1A6BAA', leaders: c('Надежда + Григорий','Nadezhda + Grigory','Nadezhda + Grigory'), hot: false, detail: 'surf' },
    { dates: '13.07 - 17.07.2026', type: c('СЕРФИНГ + ПОХОД','SURF + HIKE','SURF + MATK'), color: '#16A34A', leaders: c('Виталий + Григорий','Vitaliy + Grigory','Vitaliy + Grigory'), hot: false, detail: 'pohod' },
    { dates: '20.07 - 24.07.2026', type: c('СЕРФИНГ ЛАГЕРЬ','SURF CAMP','SURFI LAAGER'), color: '#1A6BAA', leaders: c('Надежда + Ксения','Nadezhda + Kseniya','Nadezhda + Kseniya'), hot: false, detail: 'surf' },
    { dates: '27.07 - 30.07.2026', type: c('СЕРФИНГ (4 ДНЯ)','SURF (4 DAYS)','SURF (4 PAEVA)'), color: '#1A6BAA', leaders: 'TBD', hot: false, detail: 'surf' },
    { dates: '03.08 - 07.08.2026', type: c('СЕРФИНГ ЛАГЕРЬ','SURF CAMP','SURFI LAAGER'), color: '#1A6BAA', leaders: c('Даша + ...','Dasha + ...','Dasha + ...'), hot: false, detail: 'surf' },
    { dates: '10.08 - 14.08.2026', type: c('СЕРФИНГ ЛАГЕРЬ','SURF CAMP','SURFI LAAGER'), color: '#1A6BAA', leaders: c('Надежда + ...','Nadezhda + ...','Nadezhda + ...'), hot: false, detail: 'surf' },
    { dates: '17.08 - 21.08.2026', type: c('СЕРФИНГ + ПОХОД','SURF + HIKE','SURF + MATK'), color: '#16A34A', leaders: c('Виталий + ...','Vitaliy + ...','Vitaliy + ...'), hot: false, detail: 'pohod' },
  ]

  const FAQS = [
    { q: c('Нужен ли опыт серфинга?','Is surfing experience required?','Kas surfikogemus on vajalik?'), a: c('Нет, лагерь подходит полным новичкам - учим с нуля. Дети с опытом тоже найдут задачу по уровню.','No. The camp suits complete beginners - we teach from scratch. Experienced kids find their challenge too.','Ei. Laager sobib algajatele - õpetame nullist.') },
    { q: c('Какой возраст подходит?','What age is suitable?','Mis vanus sobib?'), a: c('Основная программа для детей 7-12 лет. Возможно участие помладше, если справляется с программой. Максимум - 14 лет.','Main programme for ages 7-12. Younger children may attend if capable. Maximum age 14.','Põhiprogramm on 7-12-aastastele. Maksimaalne vanus 14.') },
    { q: c('Что входит в стоимость?','What is included?','Mis on hinnas sees?'), a: c('Вся программа, питание от Tark Catering (обед + полдник), гидрокостюмы, спасательные жилеты, всё оборудование, работа инструкторов и сертификат участника.','Full programme, meals (lunch + snack, Tark Catering), wetsuits, life jackets, all equipment, instructors, certificate.','Kogu programm, toitlustus (Tark Catering), märjaksüidid, päästevested, varustus, sertifikaat.') },
    { q: c('Что взять с собой?','What to bring?','Mida kaasa võtta?'), a: c('Сменную одежду, полотенце, солнцезащитный крем и бутылку воды. Гидрокостюм и оборудование - от нас.','Change of clothes, towel, sunscreen, water bottle. Wetsuit and equipment provided.','Vahetusriided, rätik, päikesekaitsevahend, veepudel. Märjaksüit ja varustus meie käest.') },
    { q: c('Что если плохая погода?','What if the weather is bad?','Mis saab halva ilmaga?'), a: c('Работаем в любую погоду - для этого и нужны гидрокостюмы! При реальной угрозе безопасности программа переходит на берег.','We work in any weather - that\'s what wetsuits are for! Real safety risk → shore programme.','Töötame igasuguse ilmaga! Reaalse ohu korral programm kaldale.') },
    { q: c('Учитываются ли аллергии?','Are allergies accommodated?','Kas allergiad arvestatakse?'), a: c('Да, каждый ребёнок получает порцию с учётом питания. Укажите аллергии при регистрации.','Yes. Individual portions, noting dietary needs. Note allergies at registration.','Jah. Individuaalsed portsjonid. Märkige allergiad registreerimisel.') },
    { q: c('Можно на 3-4 дня?','Can we attend 3-4 days?','Kas saab 3-4 päevaks?'), a: c('Да! 3 дня - 190€, 4 дня - 235€. Укажите при регистрации.','Yes! 3 days €190, 4 days €235. Specify at registration.','Jah! 3 päeva 190€, 4 päeva 235€.') },
    { q: c('Как обеспечивается безопасность на воде?','How is water safety ensured?','Kuidas veeohutus tagatakse?'), a: c('Все дети в воде - только в жилете и гидрокостюме. Группы 12-16 человек, постоянный контроль, обязательная теория безопасности перед каждым заходом.','All children in the water only with life jacket and wetsuit. Groups 12-16, constant supervision, mandatory safety theory before every session.','Kõik lapsed vees ainult päästevesti ja märjaksüidiga. Grupid 12-16, pidev järelevalve.') },
  ]

  const PROGRAM_DATA: Record<string, {title:string,sub:string,photo:string,price:string,age:string,dates:string[],sections:{title:string,items:string[]}[],leader:{initials:string,name:string,bio:string}}> = {
    kino: {
      title: c('Серфинг + Кино','Surf + Cinema','Surf + Kino'),
      sub: c('Лагерь, где дети не просто отдыхают - а становятся героями своего фильма. 5 дней приключений.','A camp where kids don\'t just rest - they become heroes of their own film. 5 days of adventure.','Laager, kus lapsed ei puhka lihtsalt - nad saavad oma filmi kangelasteks. 5 paeva seiklusi.'),
      photo: '/IMG_7917-1024x768.jpeg',
      price: '265€', age: c('7-12 лет','7-12 years','7-12 aastat'),
      dates: ['15.06 - 19.06.2026', '29.06 - 03.07.2026'],
      sections: [
        { title: c('Серфинг и активность','Surfing & Activity','Surfamine ja aktiivsus'), items: [
          c('SUP-серфинг, баланс, координация и ОФП каждый день','SUP surfing, balance, coordination and fitness every day','SUP surfamine, tasakaal, koordinatsioon ja kehaline ettevalmistus iga paev'),
          c('Игры на пляже','Beach games','Rannamangud'),
          c('Безопасность на воде - важный блок','Water safety - a key module','Veeohutus - oluline osa'),
          c('Учимся лучше чувствовать себя рядом со стихиями','Learning to feel at ease with nature','Opime end looduse juures paremini tundma'),
        ]},
        { title: c('Создание фильма','Film Making','Filmi loomine'), items: [
          c('Ведущие - снимают репортажи и берут интервью','Hosts - shoot reports and conduct interviews','Saatejuhid - teevad reportaaeze ja intervjuusid'),
          c('Операторы - учатся видеть детали и кадры','Cameramen - learn to see details and frames','Operaatorid - opivad naegema detaile ja kaadrit'),
          c('Монтажёры - собирают видео простым и понятным способом','Editors - assemble video simply and clearly','Monteerijad - koostavad video lihtsalt ja selgelt'),
          c('Креативная команда - идеи, сцены, эмоции','Creative team - ideas, scenes, emotions','Loominguline meeskond - ideed, stseenid, emotsioonid'),
        ]},
        { title: c('Что снимаем','What we film','Mida filmime'), items: [
          c('"Новости лагеря" каждый день','"Camp News" every day','"Laagri uudised" iga paev'),
          c('Смешные и живые моменты','Funny and lively moments','Naljakad ja elavad hetked'),
          c('Сцены в воде - брызги, эмоции, движение','Water scenes - splashes, emotions, movement','Veestseenid - pritsmeid, emotsioone, liikumist'),
          c('Дружба, команда, впечатления','Friendship, teamwork, impressions','Soprus, meeskond, muljed'),
        ]},
        { title: c('Результат','Result','Tulemus'), items: [
          c('Короткий фильм, который останется вам на память','A short film to keep as a memory','Luhifilm, mis jaab teile malestuseks'),
          c('Опыт выступления перед камерой','Experience performing in front of a camera','Kogemus kaamera ees esinemisest'),
          c('Новые навыки и уверенность','New skills and confidence','Uued oskused ja enesekindlus'),
          c('Воспоминания, которые они реально проживут','Memories they will truly live','Malestused, mida nad pariston elavad'),
        ]},
      ],
      leader: {
        initials: 'НК',
        name: c('Наталья Карасёва','Natalia Karaseva','Natalia Karaseva'),
        bio: c('Тележурналист, 20 лет на ТВ в двух странах, автор подкаста "Cozy with Tasha", создатель видеоконтента и документального короткого жанра.','TV journalist, 20 years on TV in two countries, podcast "Cozy with Tasha", creator of video content and documentary short films.','Teleajakirjanik, 20 aastat televisioonis kahes riigis, taskuhaalingu "Cozy with Tasha" autor, videofilmide looja.'),
      }
    },
    pohod: {
      title: c('Серфинг + Поход','Surf + Hike','Surf + Matk'),
      sub: c('Приключенческая программа, где ребёнок открывает мир серфинга и учится жить в природе.','An adventure programme where the child discovers surfing and learns to live in nature.','Seiklusprogramm, kus laps avastab surfimaailma ja opib looduses elama.'),
      photo: '/photo_2026-04-18-10_00_46-150x150.jpeg',
      price: '265€', age: c('7-14 лет','7-14 years','7-14 aastat'),
      dates: ['13.07 - 17.07.2026', '17.08 - 21.08.2026'],
      sections: [
        { title: c('Серфинг-часть','Surf part','Surfiosa'), items: [
          c('Виндсерфинг, SUP-серфинг, вингфоилинг','Windsurfing, SUP surfing, wingfoiling','Purjelaud, SUP surfamine, wingfoiling'),
          c('Бодиборд','Bodyboard','Bodybord'),
          c('Знакомство с гидрокостюмами и уход за ними','Introduction to wetsuits and their care','Marjaksuitide tutvustus ja hooldamine'),
          c('Безопасность, чтение ветра и природы','Safety, reading wind and nature','Ohutus, tuule ja looduse lugemine'),
        ]},
        { title: c('Походная часть','Hiking part','Matkaosa'), items: [
          c('Ориентирование по карте и компасу','Map and compass navigation','Kaardi ja kompassiga orienteerumine'),
          c('Навыки поведения в лесу','Forest survival skills','Metsas kaitumise oskused'),
          c('Сборка палатки и организация лагеря','Setting up a tent and organising camp','Telgi punjstitamine ja laagri korraldamine'),
          c('Разведение костра и базовые навыки выживания','Making a fire and basic survival skills','Loke tegemine ja ellujaamise pohioskused'),
          c('Финал - настоящий мини-поход с применением всех навыков','Finale - a real mini-hike applying all skills','Finaal - paris minimatk koigi oskustega'),
        ]},
        { title: c('Что получает ребёнок','What the child gains','Mida laps saab'), items: [
          c('Уверенность на воде и в природе','Confidence in water and in nature','Enesekindlus vees ja looduses'),
          c('Умение ориентироваться и принимать решения','Ability to navigate and make decisions','Oskus orienteeruda ja otsuseid teha'),
          c('Самостоятельность и осознанность','Independence and mindfulness','Iseseisvus ja teadlikkus'),
          c('Нашивку походника Time to Surf','Time to Surf hiker patch','Time to Surf matkaja embleem'),
        ]},
      ],
      leader: {
        initials: 'ВХ',
        name: c('Виталий Холстинин','Vitaliy Kholstinin','Vitaliy Kholstinin'),
        bio: c('Предприниматель, хайкер, основатель Join The Hike. Более 10 лет опыта. Höga Kusten 140 км (UNESCO), Land of Giants 120 км. Живёт тем, что преподаёт.','Entrepreneur, hiker, founder of Join The Hike. 10+ years experience. Höga Kusten 140km (UNESCO), Land of Giants 120km. Lives what he teaches.','Ettevotja, matkaja, Join The Hike asutaja. 10+ aastat kogemust. Höga Kusten 140km (UNESCO), Land of Giants 120km. Elab seda, mida opetab.'),
      }
    },
    surf: {
      title: c('Серфинг лагерь','Surf Camp','Surfilaager'),
      sub: c('Классическая программа для тех, кто впервые открывает мир серфинга. Разные виды водного спорта, безопасность и командные игры.','The classic programme for those discovering surfing for the first time. Different water sports, safety and team games.','Klassikaline programm neile, kes avastab surfimaailma esimest korda. Erinevad veespordialad, ohutus ja meeskonnamangud.'),
      photo: '/DSC02878-150x150.jpeg',
      price: '265€', age: c('7-12 лет','7-12 years','7-12 aastat'),
      dates: ['06.07', '20.07', '27.07', '03.08', '10.08'],
      sections: [
        { title: c('Знакомство с миром серфинга','Discovering surfing','Surfimaailma avastamine'), items: [
          c('Кайтсерфинг','Kitesurfing','Kaidisurfamine'),
          c('Виндсерфинг','Windsurfing','Purjelaud'),
          c('SUP-серфинг','SUP surfing','SUP surfamine'),
          c('Вингфоилинг','Wingfoiling','Wingfoiling'),
          c('Бодиборд','Bodyboard','Bodybord'),
        ]},
        { title: c('Культура серфинга','Surf culture','Surfikultuur'), items: [
          c('Какие бывают гидрокостюмы','Types of wetsuits','Marjaksuitide tuubid'),
          c('Как правильно их надевать','How to put them on correctly','Kuidas neid oigesti selga panna'),
          c('Как ухаживать, чтобы служили долго','How to care for them to last longer','Kuidas hooldada, et kestaksid kaua'),
        ]},
        { title: c('Командные игры и развитие','Team games & development','Meeskonnamangud ja areng'), items: [
          c('Работа в команде','Teamwork','Meeskonnatok'),
          c('Поддержка друг друга','Supporting each other','Uksteise toetamine'),
          c('Правила безопасности на воде','Water safety rules','Veeohutuse reeglid'),
          c('Понимание ветра, погоды и природы','Understanding wind, weather and nature','Tuule, ilma ja looduse moistmine'),
        ]},
        { title: c('Результат','Result','Tulemus'), items: [
          c('Реальный прогресс и уверенность на воде','Real progress and confidence in water','Tegelik areng ja enesekindlus vees'),
          c('Развитие командного мышления','Team thinking development','Meeskonnamotlemise arendamine'),
          c('Навыки безопасного поведения','Safe behaviour skills','Ohutu kaitumise oskused'),
          c('Сертификат участника','Participation certificate','Osalussertifikaat'),
        ]},
      ],
      leader: {
        initials: 'НГ',
        name: c('Надежда + Григорий','Nadezhda + Grigory','Nadezhda + Grigory'),
        bio: c('Сертифицированные инструктора с многолетним опытом работы с детьми на Балтийском море. Умеют мотивировать и поддерживать на каждом этапе.','Certified instructors with years of experience working with children on the Baltic Sea. They know how to motivate and support at every stage.','Sertifitseeritud juhendajad mitmeaastase kogemusega laste juhendamisel Lameresel. Oskavad motiveerida ja toetada igas etapis.'),
      }
    }
  }

  const CSS = `
    @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:ital,wght@0,400;0,600;0,700;0,800;1,700;1,800&display=swap');
    :root {
      --ocean:#0B3D6B; --ocean2:#0E4F8A; --ocean3:#1565A8;
      --teal:#0AACAC; --teal-lt:#1DCFCF; --teal-pale:rgba(10,172,172,.10);
      --sand:#F7F0E0; --sand-lt:#FDFAF3; --sand2:#F0E8D0;
      --sun:#F5A623; --sun-pale:rgba(245,166,35,.12);
      --white:#FFFFFF; --text:#0A1E30; --mid:#344E63; --muted:#6B8AA0;
      --border:#D4E6F1; --bwarm:#DDD0B0;
      --green:#16A34A; --purple:#7C3AED;
      --ease:cubic-bezier(0.23,1,0.32,1); --ease-io:cubic-bezier(0.77,0,0.175,1);
    }
    /* === ANIMATIONS === */
    @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
    @keyframes floatY2{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
    @keyframes pulseGlow{0%,100%{box-shadow:0 4px 20px rgba(10,172,172,.28)}50%{box-shadow:0 8px 40px rgba(10,172,172,.55),0 0 0 4px rgba(10,172,172,.12)}}
    @keyframes shimmer{0%{background-position:200% center}100%{background-position:-200% center}}
    @keyframes waveAnim{0%{transform:translateX(0) scaleY(1)}50%{transform:translateX(-2%) scaleY(1.04)}100%{transform:translateX(0) scaleY(1)}}
    @keyframes rotateIn{from{opacity:0;transform:rotate(-4deg) scale(.95)}to{opacity:1;transform:rotate(0) scale(1)}}
    @keyframes slideRight{from{opacity:0;transform:translateX(-24px)}to{opacity:1;transform:translateX(0)}}
    @keyframes countUp{from{opacity:0;transform:translateY(12px) scale(.9)}to{opacity:1;transform:translateY(0) scale(1)}}
    @keyframes borderPulse{0%,100%{border-color:var(--border)}50%{border-color:var(--teal)}}
    @keyframes bgShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
    @keyframes dotBlink{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(.7)}}
    @keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
    @keyframes introFade{0%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(1.04);pointer-events:none}}
    @keyframes introScale{from{opacity:0;transform:scale(0.7)}to{opacity:1;transform:scale(1)}}
    @keyframes introSlide{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
    @keyframes introBar{from{width:0;opacity:0}to{width:40px;opacity:1}}

    *{box-sizing:border-box;margin:0;padding:0}
    html{scroll-behavior:smooth}
    body{font-family:'Manrope',system-ui,sans-serif;color:var(--text);background:var(--white);-webkit-font-smoothing:antialiased;overflow-x:hidden;line-height:1.6}
    img{display:block;max-width:100%} a{text-decoration:none} button{font-family:inherit;cursor:pointer}
    ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-track{background:var(--sand-lt)} ::-webkit-scrollbar-thumb{background:var(--border);border-radius:2px}

    .rv{opacity:0;transform:translateY(24px) scale(.98);transition:opacity 680ms var(--ease),transform 680ms var(--ease)}
    .rv.on{opacity:1;transform:translateY(0) scale(1)}
    .sg>*{opacity:0;transform:translateY(20px) scale(.97);transition:opacity 560ms var(--ease),transform 560ms var(--ease)}
    .sg.on>*:nth-child(1){opacity:1;transform:translateY(0) scale(1);transition-delay:0ms}
    .sg.on>*:nth-child(2){opacity:1;transform:translateY(0) scale(1);transition-delay:70ms}
    .sg.on>*:nth-child(3){opacity:1;transform:translateY(0) scale(1);transition-delay:140ms}
    .sg.on>*:nth-child(4){opacity:1;transform:translateY(0) scale(1);transition-delay:210ms}
    .sg.on>*:nth-child(5){opacity:1;transform:translateY(0) scale(1);transition-delay:280ms}
    .sg.on>*:nth-child(6){opacity:1;transform:translateY(0) scale(1);transition-delay:350ms}
    .sg.on>*:nth-child(7){opacity:1;transform:translateY(0) scale(1);transition-delay:420ms}
    .sg.on>*:nth-child(n+8){opacity:1;transform:translateY(0) scale(1);transition-delay:490ms}
    @media(prefers-reduced-motion:reduce){.rv,.sg>*{opacity:1!important;transform:none!important;transition:none!important}}

    .wrap{max-width:1180px;margin:0 auto;padding:0 40px}
    .tag{font-size:11px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;display:inline-block;margin-bottom:14px}
    .tag-teal{color:var(--teal)} .tag-pale{color:rgba(255,255,255,.42)} .tag-muted{color:var(--muted)}
    .pjs{font-family:'Plus Jakarta Sans',sans-serif}
    .sec-h{font-family:'Plus Jakarta Sans',sans-serif;font-size:clamp(30px,3.6vw,50px);font-weight:800;line-height:1.06;letter-spacing:-.03em}
    .sec-h em{font-style:italic;color:var(--teal);position:relative}
    .sec-h-lt{color:white} .sec-h-lt em{color:var(--teal-lt);text-shadow:0 0 40px rgba(10,172,172,.3)}
    .sec-sub{font-size:15px;color:var(--muted);line-height:1.8;max-width:500px}

    .btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;font-weight:600;font-size:14px;letter-spacing:.01em;border:none;border-radius:50px;transition:transform 160ms var(--ease),box-shadow 200ms var(--ease),background 180ms ease;text-decoration:none}
    .btn:active{transform:scale(.97)!important}
    .btn-teal{background:var(--teal);color:white;padding:14px 32px;box-shadow:0 4px 20px rgba(10,172,172,.28);animation:pulseGlow 3s ease-in-out infinite}
    .btn-teal:hover{background:var(--teal-lt);transform:translateY(-1px);box-shadow:0 8px 32px rgba(10,172,172,.4)}
    .btn-sun{background:linear-gradient(110deg,#F5A623 0%,#f7bc55 30%,#F5A623 60%,#e8951f 100%);background-size:200% auto;color:white;padding:14px 32px;box-shadow:0 4px 20px rgba(245,166,35,.25);animation:shimmer 3s linear infinite}
    .btn-sun:hover{transform:translateY(-1px);box-shadow:0 8px 28px rgba(245,166,35,.38)}
    .btn-ghost{background:transparent;color:white;padding:13px 28px;border:1.5px solid rgba(255,255,255,.28)}
    .btn-ghost:hover{background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.5)}
    .btn-outline{background:transparent;color:var(--ocean);padding:11px 22px;border:1.5px solid var(--border)}
    .btn-outline:hover{background:var(--sand-lt);border-color:var(--teal)}
    .btn-sm{font-size:13px;padding:10px 22px}

    /* NAV */
    .nav{position:fixed;top:0;left:0;right:0;z-index:200;transition:background 280ms var(--ease),border-color 280ms}
    .nav.on{background:rgba(11,61,107,.97);border-bottom:1px solid rgba(255,255,255,.1);backdrop-filter:blur(28px);box-shadow:0 4px 32px rgba(0,0,0,.3)}
    .nav-i{max-width:1180px;margin:0 auto;padding:0 40px;height:66px;display:flex;align-items:center;justify-content:space-between;gap:32px}
    .nav-brand{display:flex;align-items:center;gap:10px}
    .nav-logo{width:40px;height:40px;border-radius:50%;object-fit:cover;flex-shrink:0;transition:transform 300ms var(--ease),box-shadow 300ms var(--ease)}
    .nav-logo:hover{transform:scale(1.1) rotate(-4deg);box-shadow:0 4px 20px rgba(10,172,172,.4)}
    .nav-name{font-family:'Plus Jakarta Sans',sans-serif;font-size:17px;font-weight:800;color:white;letter-spacing:-.01em}
    .nav-sub{font-size:9px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.38)}
    .nav-links{display:flex;align-items:center;gap:28px}
    .nav-link{font-size:13px;font-weight:500;color:rgba(255,255,255,.6);background:none;border:none;transition:color 180ms;letter-spacing:.01em;padding:0}
    .nav-link:hover{color:white}
    .nav-r{display:flex;align-items:center;gap:12px}
    .lang-sw{display:flex;gap:1px}
    .lang-btn{font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;padding:5px 8px;border-radius:4px;border:none;transition:background 180ms,color 180ms;font-family:'Manrope',sans-serif}
    .lang-btn.a{background:rgba(255,255,255,.15);color:white}
    .lang-btn:not(.a){background:transparent;color:rgba(255,255,255,.35)}
    .lang-btn:not(.a):hover{color:rgba(255,255,255,.7)}
    .mob-btn{display:none;background:none;border:none;color:white;padding:4px}
    .mob-menu{position:fixed;inset:0;background:rgba(11,61,107,.98);z-index:300;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:24px;opacity:0;pointer-events:none;transition:opacity 220ms var(--ease)}
    .mob-menu.open{opacity:1;pointer-events:all}
    .mob-menu .nav-link{font-family:'Plus Jakarta Sans',sans-serif;font-size:28px;font-weight:700;color:rgba(255,255,255,.85)}
    .mob-close{position:absolute;top:20px;right:24px;background:none;border:none;color:rgba(255,255,255,.6)}

    /* HERO */
    .hero{min-height:100vh;background:linear-gradient(160deg,#082847 0%,#0B3D6B 45%,#0E5080 100%);display:flex;flex-direction:column;position:relative;overflow:hidden;padding-top:66px}
    .hero::before{content:'';position:absolute;inset:0;background-image:radial-gradient(circle,rgba(255,255,255,.03) 1px,transparent 1px);background-size:40px 40px;pointer-events:none;z-index:0}
    .hero-glow{position:absolute;width:900px;height:900px;background:radial-gradient(ellipse,rgba(10,172,172,.15) 0%,rgba(10,172,172,.04) 40%,transparent 65%);top:-200px;right:-200px;pointer-events:none;animation:floatY 8s ease-in-out infinite}
    .hero-glow2{position:absolute;width:600px;height:600px;background:radial-gradient(ellipse,rgba(245,166,35,.08) 0%,transparent 60%);bottom:0;left:-100px;pointer-events:none;animation:floatY2 10s ease-in-out infinite}
    .hero-wave{position:absolute;bottom:0;left:0;right:0;height:100px;background:var(--sand-lt);clip-path:ellipse(55% 100% at 50% 100%)}
    .hero-in{flex:1;display:flex;align-items:center;position:relative;z-index:1}
    .hero-grid{display:grid;grid-template-columns:1fr 400px;gap:56px;align-items:center;padding:72px 0 110px;width:100%}
    .hero-ey{display:flex;align-items:center;gap:12px;margin-bottom:18px}
    .hero-dot{width:6px;height:6px;border-radius:50%;background:var(--teal);flex-shrink:0;animation:dotBlink 2s ease-in-out infinite}
    .hero-ey-t{font-size:11px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,.5)}
    .hero-h1{font-family:'Plus Jakarta Sans',sans-serif;font-size:clamp(42px,5.2vw,72px);font-weight:800;line-height:1.0;letter-spacing:-.035em;color:white;margin-bottom:20px}
    .hero-h1 em{font-style:italic;color:var(--teal-lt);text-shadow:0 0 60px rgba(29,207,207,.4)}
    .hero-desc{font-size:16px;color:rgba(255,255,255,.62);line-height:1.8;max-width:460px;margin-bottom:12px}
    .hero-pills{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:34px}
    .pill{font-size:12px;font-weight:600;color:rgba(255,255,255,.75);padding:6px 14px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.15);border-radius:50px;transition:background 200ms,border-color 200ms,transform 200ms var(--ease);cursor:default}
    .pill:hover{background:rgba(255,255,255,.18);border-color:var(--teal-lt);transform:translateY(-1px)}
    .hero-acts{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:40px}

    /* HERO CARD */
    .hcard{background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.15);border-radius:20px;overflow:hidden;backdrop-filter:blur(16px);box-shadow:0 20px 60px rgba(0,0,0,.2)}
    .hcard-head{padding:18px 22px 14px;border-bottom:1px solid rgba(255,255,255,.07)}
    .hcard-lbl{font-size:9px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,.3);margin-bottom:12px}
    .hcard-row{display:flex;align-items:center;padding:10px 0;border-bottom:1px solid rgba(255,255,255,.05);transition:background 180ms;border-radius:6px;padding-left:4px;padding-right:4px;margin:0 -4px}
    .hcard-row:hover{background:rgba(255,255,255,.05)}
    .hcard-row:last-child{border-bottom:none}
    .hcard-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;margin-right:12px}
    .hcard-name{font-size:13px;font-weight:500;color:rgba(255,255,255,.85);flex:1}
    .hcard-date{font-size:11px;color:rgba(255,255,255,.3);font-variant-numeric:tabular-nums}
    .hcard-stats{display:grid;grid-template-columns:repeat(3,1fr)}
    .hstat{padding:16px 18px;text-align:center;border-right:1px solid rgba(255,255,255,.06);transition:background 200ms var(--ease);cursor:default}
    .hstat:hover{background:rgba(255,255,255,.06)}
    .hstat:hover .hstat-n{transform:scale(1.08)}
    .hstat:last-child{border-right:none}
    .hstat-n{font-family:'Plus Jakarta Sans',sans-serif;font-size:28px;font-weight:800;color:white;line-height:1;margin-bottom:3px;letter-spacing:-.03em;transition:transform 200ms var(--ease)}
    .hstat-l{font-size:9px;color:rgba(255,255,255,.3);letter-spacing:.06em;text-transform:uppercase}

    /* HERO BAR */
    .hero-bar{position:relative;z-index:1;background:rgba(255,255,255,.04);border-top:1px solid rgba(255,255,255,.07)}
    .hero-bar-g{display:grid;grid-template-columns:repeat(4,1fr)}
    .hero-bar-item{padding:16px 28px;border-right:1px solid rgba(255,255,255,.06)}
    .hero-bar-item:last-child{border-right:none}
    .hero-bar-l{font-size:9px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.28);margin-bottom:3px}
    .hero-bar-v{font-family:'Plus Jakarta Sans',sans-serif;font-size:16px;font-weight:700;color:rgba(255,255,255,.82);line-height:1.2}

    .trust{background:var(--sand-lt);border-bottom:1px solid var(--bwarm)}
    .trust-g{display:grid;grid-template-columns:repeat(4,1fr)}
    .trust-it{padding:44px 28px;text-align:center;border-right:1px solid var(--bwarm);transition:background 240ms var(--ease),transform 240ms var(--ease);cursor:default}
    .trust-it:hover{background:var(--sand2);transform:translateY(-3px)}
    .trust-it:last-child{border-right:none}
    .trust-n{font-family:'Plus Jakarta Sans',sans-serif;font-size:52px;font-weight:800;color:var(--ocean);line-height:1;letter-spacing:-.04em;margin-bottom:6px;transition:transform 300ms var(--ease),color 200ms}
    .trust-it:hover .trust-n{transform:scale(1.08);color:var(--teal)}
    .trust-l{font-size:11px;font-weight:600;color:var(--muted);letter-spacing:.07em;text-transform:uppercase}

    /* FORMATS */
    .formats{background:var(--white);padding:96px 0}
    .fhead{text-align:center;margin-bottom:52px}
    .fg{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
    .fcard{background:var(--white);border:2px solid var(--border);border-radius:16px;overflow:hidden;transition:transform 240ms var(--ease),box-shadow 240ms var(--ease),border-color 200ms}
    .fcard:hover{transform:translateY(-8px);box-shadow:0 28px 64px rgba(11,61,107,.16);border-color:var(--teal)}
    .fcard-banner{height:180px;display:flex;flex-direction:column;justify-content:flex-end;padding:20px;position:relative;overflow:hidden;background:#0B3D6B}
    .fcard-banner img.fb-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0}
    .fcard-banner::after{content:'';position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.6) 0%,transparent 60%);pointer-events:none;z-index:1}
    .fcard-blbl{font-size:9px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,.6);margin-bottom:5px;position:relative;z-index:1}
    .fcard-bt{font-family:'Plus Jakarta Sans',sans-serif;font-size:23px;font-weight:800;color:white;line-height:1.05;letter-spacing:-.015em;position:relative;z-index:1}
    .fcard-body{padding:20px 20px 14px}
    .fcard-desc{font-size:13px;color:var(--mid);line-height:1.75;margin-bottom:16px}
    .fcard-list{display:flex;flex-direction:column;gap:8px;margin-bottom:16px}
    .fcard-it{display:flex;align-items:flex-start;gap:10px;font-size:13px;color:var(--mid)}
    .fcard-ck{width:16px;height:16px;border-radius:50%;background:var(--teal-pale);display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px}
    .fcard-foot{padding:14px 20px;border-top:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}
    .fcard-price{font-family:'Plus Jakarta Sans',sans-serif;font-size:24px;font-weight:800;color:var(--ocean);letter-spacing:-.02em}
    .fcard-ps{font-size:10px;color:var(--muted);letter-spacing:.04em;margin-top:1px}
    .fcard-btns{display:flex;gap:8px}
    .fcard-more{font-size:12px;font-weight:600;color:var(--teal);padding:8px 14px;border:1.5px solid var(--teal);border-radius:50px;background:transparent;transition:background 180ms}
    .fcard-more:hover{background:var(--teal-pale)}
    .fcard-exp{background:var(--sand-lt);border-radius:12px;padding:18px;margin:0 20px 14px;font-size:13px;color:var(--mid);line-height:1.75}
    .fcard-exp h4{font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--ocean);margin-bottom:8px;margin-top:14px}
    .fcard-exp h4:first-child{margin-top:0}
    .fcard-leader{display:flex;align-items:center;gap:12px;background:white;border-radius:10px;padding:12px;margin-top:10px;border:1px solid var(--border)}
    .fcard-lphoto{width:44px;height:44px;border-radius:50%;object-fit:cover;flex-shrink:0}
    .fcard-lname{font-size:13px;font-weight:700;color:var(--ocean)}
    .fcard-lrole{font-size:11px;color:var(--muted);line-height:1.5;margin-top:2px}

    /* SAFETY */
    .safety{background:linear-gradient(145deg,#062040,#0B3D6B,#082847,#0E4060);background-size:300% 300%;padding:88px 0;animation:bgShift 12s ease infinite reverse}
    .safety-g{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center}
    .safety-photos{display:grid;grid-template-columns:1fr 1fr;gap:10px}
    .safety-photo{border-radius:12px;overflow:hidden;aspect-ratio:4/3;object-fit:cover;width:100%}
    .safety-items{display:flex;flex-direction:column;gap:14px;margin-top:28px}
    .safety-it{display:flex;gap:14px;align-items:flex-start}
    .safety-icon{width:40px;height:40px;border-radius:12px;background:rgba(10,172,172,.15);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:18px}
    .safety-t{font-size:14px;font-weight:700;color:white;margin-bottom:3px}
    .safety-d{font-size:13px;color:rgba(255,255,255,.48);line-height:1.7}

    /* PRICING */
    .pricing{background:var(--sand-lt);padding:96px 0}
    .phead{text-align:center;margin-bottom:52px}
    .pg{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:32px}
    .pc{border-radius:16px;padding:28px;text-align:center;transition:transform 240ms var(--ease)}
    .pc:hover{transform:translateY(-3px)}
    .pc-std{background:white;border:2px solid var(--border)}
    .pc-feat{background:linear-gradient(145deg,#0B3D6B,#0E4F8A);border:2px solid rgba(10,172,172,.3);box-shadow:0 12px 48px rgba(11,61,107,.3)}
    .pc-tag{font-size:9px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;margin-bottom:8px}
    .pc-tag-std{color:var(--muted)} .pc-tag-feat{color:rgba(255,255,255,.5)}
    .pc-days{font-size:13px;font-weight:600;margin-bottom:8px}
    .pc-days-std{color:var(--mid)} .pc-days-feat{color:rgba(255,255,255,.7)}
    .pc-price{font-family:'Plus Jakarta Sans',sans-serif;font-size:54px;font-weight:800;letter-spacing:-.04em;line-height:1;margin-bottom:6px}
    .pc-price-std{color:var(--ocean)} .pc-price-feat{color:white}
    .pc-note{font-size:12px;margin-bottom:22px}
    .pc-note-std{color:var(--muted)} .pc-note-feat{color:rgba(255,255,255,.5)}
    .pop-badge{font-size:9px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--teal);background:var(--teal-pale);padding:4px 12px;border-radius:20px;display:inline-block;margin-bottom:10px}
    .pc-btn-std{display:block;padding:12px;background:var(--ocean);color:white;border-radius:50px;font-size:13px;font-weight:700;transition:background 180ms;text-decoration:none;text-align:center}
    .pc-btn-std:hover{background:var(--ocean2)}
    .pc-btn-feat{display:block;padding:12px;background:var(--teal);color:white;border-radius:50px;font-size:13px;font-weight:700;box-shadow:0 4px 16px rgba(10,172,172,.35);transition:box-shadow 180ms;text-decoration:none;text-align:center}
    .pc-btn-feat:hover{box-shadow:0 8px 28px rgba(10,172,172,.5)}
    .includes{background:white;border:2px solid var(--border);border-radius:16px;padding:28px;transition:box-shadow 240ms var(--ease)}
    .includes:hover{box-shadow:0 12px 40px rgba(11,61,107,.08)}
    .inc-title{font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);margin-bottom:18px;text-align:center}
    .inc-g{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
    .inc-it{display:flex;align-items:flex-start;gap:8px;font-size:13px;color:var(--mid);font-weight:500}
    .inc-dot{width:6px;height:6px;border-radius:50%;background:var(--teal);flex-shrink:0;margin-top:6px}

    /* WHY */
    .why{background:linear-gradient(145deg,#082847,#0B3D6B,#0E4F8A,#082847);background-size:300% 300%;padding:96px 0;animation:bgShift 16s ease infinite}
    .why-h{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:end;margin-bottom:60px}
    .why-g{display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid rgba(255,255,255,.08)}
    .why-it{padding:38px 30px;border-right:1px solid rgba(255,255,255,.08);border-bottom:1px solid rgba(255,255,255,.08);transition:background 260ms var(--ease)}
    .why-it:hover{background:rgba(255,255,255,.06)}
    .why-it:hover .why-t{color:var(--teal-lt)}
    .why-t{transition:color 200ms}
    .why-it:nth-child(3n){border-right:none}
    .why-n{font-size:11px;font-weight:700;letter-spacing:.2em;color:var(--teal);margin-bottom:12px}
    .why-t{font-family:'Plus Jakarta Sans',sans-serif;font-size:18px;font-weight:700;color:white;margin-bottom:8px;line-height:1.2}
    .why-d{font-size:13px;color:rgba(255,255,255,.42);line-height:1.8}

    /* TEAM */
    .team{background:var(--white);padding:96px 0;border-top:1px solid var(--border)}
    .team-h{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:end;margin-bottom:52px}
    .team-g{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
    .tc{background:var(--sand-lt);border:2px solid var(--bwarm);border-radius:16px;padding:24px;transition:transform 240ms var(--ease),box-shadow 240ms var(--ease)}
    .tc:hover{transform:translateY(-6px);box-shadow:0 24px 60px rgba(11,61,107,.16)}
    .tc-av{width:54px;height:54px;border-radius:50%;object-fit:cover;margin-bottom:14px;border:3px solid white}
    .tc-av-p{width:54px;height:54px;border-radius:50%;background:var(--ocean);display:flex;align-items:center;justify-content:center;margin-bottom:14px;font-family:'Plus Jakarta Sans',sans-serif;font-size:20px;font-weight:800;color:rgba(255,255,255,.7)}
    .tc-name{font-family:'Plus Jakarta Sans',sans-serif;font-size:18px;font-weight:800;color:var(--ocean);margin-bottom:2px}
    .tc-role{font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--teal);margin-bottom:10px}
    .tc-bio{font-size:13px;color:var(--mid);line-height:1.75}

    /* DATES */
    .dates{background:var(--sand-lt);padding:96px 0}
    .dhead{text-align:center;margin-bottom:52px}
    .dg{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
    .dc{background:white;border:2px solid var(--border);border-radius:14px;padding:20px;transition:transform 220ms var(--ease),box-shadow 220ms var(--ease),border-color 200ms}
    .dc:hover{transform:translateY(-4px);box-shadow:0 16px 48px rgba(11,61,107,.14);border-color:var(--teal)}
    .dc.hot{border-color:var(--sun);background:rgba(245,166,35,.03)}
    .dc-badge{font-size:9px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--sun);background:var(--sun-pale);padding:4px 10px;border-radius:20px;display:inline-block;margin-bottom:10px;animation:pulseGlow 2s ease-in-out infinite;box-shadow:0 0 0 0 rgba(245,166,35,.3)}
    .dc-dates{font-family:'Plus Jakarta Sans',sans-serif;font-size:18px;font-weight:800;color:var(--ocean);letter-spacing:-.01em;margin-bottom:4px}
    .dc-type{font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;margin-bottom:4px}
    .dc-leaders{font-size:12px;color:var(--muted);margin-bottom:14px;font-weight:500}
    .dc-acts{display:flex;gap:8px;flex-wrap:wrap}
    .dc-cta{display:inline-flex;align-items:center;justify-content:center;padding:9px 16px;background:var(--ocean);color:white;border-radius:50px;font-size:12px;font-weight:700;transition:background 180ms;text-decoration:none;flex:1}
    .dc-cta:hover{background:var(--ocean2)}
    .dc.hot .dc-cta{background:var(--sun)}
    .dc.hot .dc-cta:hover{background:#e8951f}
    .dc-more{display:inline-flex;align-items:center;justify-content:center;padding:9px 14px;border:1.5px solid var(--teal);color:var(--teal);border-radius:50px;font-size:12px;font-weight:700;transition:background 180ms;background:transparent}
    .dc-more:hover{background:var(--teal-pale)}

    /* SCHEDULE */
    .sched{background:linear-gradient(160deg,#0B3D6B,#0E4F8A,#0B3D6B);background-size:200% 200%;padding:96px 0;animation:bgShift 14s ease infinite}
    .sched-h{text-align:center;margin-bottom:52px}
    .sched-g{display:grid;grid-template-columns:repeat(4,1fr);gap:0;border:1px solid rgba(255,255,255,.08);border-radius:16px;overflow:hidden}
    .sched-it{padding:24px 20px;border-right:1px solid rgba(255,255,255,.08);border-bottom:1px solid rgba(255,255,255,.08);transition:background 220ms}
    .sched-it:hover{background:rgba(255,255,255,.07)}
    .sched-it{transition:background 220ms var(--ease),transform 200ms var(--ease)}
    .sched-time{font-size:11px;font-weight:700;letter-spacing:.1em;color:var(--teal);margin-bottom:8px}
    .sched-name{font-family:'Plus Jakarta Sans',sans-serif;font-size:16px;font-weight:700;color:white;margin-bottom:4px}
    .sched-desc{font-size:12px;color:rgba(255,255,255,.36);line-height:1.65}

    /* GALLERY */
    .gallery{background:linear-gradient(150deg,#082847,#0B3D6B,#0E4060);background-size:200% 200%;padding:96px 0;animation:bgShift 18s ease infinite reverse}
    .ghead{text-align:center;margin-bottom:48px}
    .gg{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}
    .gi{aspect-ratio:1/1;border-radius:8px;overflow:hidden;cursor:zoom-in;position:relative}
    .gi img{width:100%;height:100%;object-fit:cover;object-position:center top;transition:transform 300ms var(--ease),filter 200ms;display:block}
    .gi:hover img{transform:scale(1.06);filter:brightness(1.1)}
    .gi-wide{grid-column:span 2;aspect-ratio:2/1}
    .gi-overlay{position:absolute;inset:0;background:rgba(0,0,0,0);transition:background 200ms;display:flex;align-items:center;justify-content:center}
    .gi:hover .gi-overlay{background:rgba(0,0,0,.18)}
    .gi-zoom{opacity:0;color:white;font-size:28px;transition:opacity 200ms}
    .gi:hover .gi-zoom{opacity:1}

    /* LIGHTBOX */
    @keyframes lbIn{from{opacity:0;transform:scale(.96)}to{opacity:1;transform:scale(1)}}
    .lb-overlay{position:fixed;inset:0;z-index:600;background:rgba(0,0,0,.95);display:flex;align-items:center;justify-content:center;animation:lbIn 220ms ease}
    .lb-overlay img{max-width:88vw;max-height:86vh;object-fit:contain;border-radius:8px;cursor:default;user-select:none}
    .lb-close{position:absolute;top:18px;right:22px;background:rgba(255,255,255,.12);border:none;color:white;width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:20px;cursor:pointer;transition:background 160ms;z-index:1}
    .lb-close:hover{background:rgba(255,255,255,.28)}
    .lb-prev,.lb-next{position:absolute;top:50%;transform:translateY(-50%);background:rgba(255,255,255,.12);border:none;color:white;width:50px;height:50px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:22px;cursor:pointer;transition:background 160ms;z-index:1;user-select:none}
    .lb-prev{left:18px}
    .lb-next{right:18px}
    .lb-prev:hover,.lb-next:hover{background:rgba(255,255,255,.28)}
    .lb-counter{position:absolute;bottom:18px;left:50%;transform:translateX(-50%);color:rgba(255,255,255,.5);font-size:12px;font-weight:600;letter-spacing:.08em}

    /* PROGRAM MODAL */
    .pm-overlay{position:fixed;inset:0;z-index:600;background:rgba(0,0,0,.72);display:flex;align-items:flex-start;justify-content:center;padding:24px 16px;overflow-y:auto;animation:lbIn 220ms ease}
    .pm-box{background:white;border-radius:20px;max-width:620px;width:100%;position:relative;margin:auto}
    .pm-hero{height:200px;position:relative;overflow:hidden;border-radius:20px 20px 0 0;flex-shrink:0}
    .pm-hero img{width:100%;height:100%;object-fit:cover}
    .pm-hero::after{content:'';position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.65) 0%,transparent 55%)}
    .pm-hero-txt{position:absolute;bottom:18px;left:22px;right:52px;z-index:1}
    .pm-hero-lbl{font-size:10px;font-weight:700;letter-spacing:.15em;text-transform:uppercase;color:rgba(255,255,255,.6);margin-bottom:5px}
    .pm-hero-title{font-family:'Plus Jakarta Sans',sans-serif;font-size:26px;font-weight:800;color:white;line-height:1.1;letter-spacing:-.02em}
    .pm-close{position:absolute;top:14px;right:14px;z-index:10;background:rgba(0,0,0,.45);border:none;color:white;width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:17px;transition:background 160ms}
    .pm-close:hover{background:rgba(0,0,0,.75)}
    .pm-body{padding:22px 24px}
    .pm-sub{font-size:14px;color:var(--mid);line-height:1.7;margin-bottom:18px;font-style:italic}
    .pm-meta{display:flex;gap:20px;flex-wrap:wrap;margin-bottom:18px;padding-bottom:16px;border-bottom:1px solid var(--border)}
    .pm-meta-item span{font-size:11px;color:var(--muted);display:block;margin-bottom:2px}
    .pm-meta-item strong{font-size:13px;color:var(--ocean)}
    .pm-dates{display:flex;flex-wrap:wrap;gap:7px;margin-bottom:18px}
    .pm-date-chip{background:var(--sand-lt);border:1.5px solid var(--bwarm);border-radius:50px;padding:5px 14px;font-size:12px;font-weight:700;color:var(--ocean)}
    .pm-sec-title{font-family:'Plus Jakarta Sans',sans-serif;font-size:14px;font-weight:700;color:var(--ocean);margin-bottom:9px;margin-top:16px}
    .pm-sec-title:first-of-type{margin-top:0}
    .pm-item{display:flex;gap:9px;align-items:flex-start;font-size:13px;color:var(--mid);line-height:1.6;margin-bottom:6px}
    .pm-dot{width:6px;height:6px;border-radius:50%;background:var(--teal);flex-shrink:0;margin-top:6px}
    .pm-leader{display:flex;align-items:center;gap:12px;background:var(--sand-lt);border-radius:12px;padding:14px;margin-top:18px;border:1.5px solid var(--bwarm)}
    .pm-leader-av{width:48px;height:48px;border-radius:50%;background:var(--ocean);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-family:'Plus Jakarta Sans',sans-serif;font-size:15px;font-weight:800;color:rgba(255,255,255,.8)}
    .pm-leader-name{font-size:14px;font-weight:700;color:var(--ocean);margin-bottom:3px}
    .pm-leader-bio{font-size:12px;color:var(--mid);line-height:1.55}
    .pm-footer{padding:16px 24px 22px;display:flex;align-items:center;gap:12px;border-top:1px solid var(--border);flex-wrap:wrap}
    .pm-price{font-family:'Plus Jakarta Sans',sans-serif;font-size:26px;font-weight:800;color:var(--ocean)}
    .pm-price-note{font-size:11px;color:var(--muted)}

    /* REVIEWS */
    .reviews{background:var(--sand-lt);padding:96px 0}
    .revh{text-align:center;margin-bottom:52px}
    .rev-g{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-bottom:36px}
    .rc{background:white;border:2px solid var(--border);border-radius:14px;padding:20px;transition:transform 220ms var(--ease)}
    .rc:hover{transform:translateY(-2px)}
    .rc-stars{display:flex;gap:3px;margin-bottom:10px}
    .rc-star{color:var(--sun);font-size:16px}
    .rc-text{font-size:14px;color:var(--mid);line-height:1.75;margin-bottom:12px}
    .rc-name{font-size:13px;font-weight:700;color:var(--ocean)}
    .rc-prog{font-size:11px;color:var(--muted);margin-top:2px}
    .rev-empty{grid-column:span 3;text-align:center;padding:48px;color:var(--muted);font-size:14px}
    .rev-form{background:white;border:2px solid var(--border);border-radius:16px;padding:28px;max-width:580px;margin:0 auto}
    .rf-title{font-family:'Plus Jakarta Sans',sans-serif;font-size:20px;font-weight:800;color:var(--ocean);margin-bottom:18px}
    .rf-field{margin-bottom:14px}
    .rf-label{font-size:12px;font-weight:700;color:var(--mid);margin-bottom:6px;display:block;letter-spacing:.04em}
    .rf-input{width:100%;padding:10px 14px;border:1.5px solid var(--border);border-radius:10px;font-family:'Manrope',sans-serif;font-size:14px;color:var(--text);outline:none;transition:border-color 180ms}
    .rf-input:focus{border-color:var(--teal)}
    .rf-stars{display:flex;gap:6px}
    .rf-star{font-size:24px;transition:transform 150ms,color 150ms;color:#CBD5E0}
    .rf-star:hover{transform:scale(1.2)}
    .rf-success{text-align:center;padding:32px;color:var(--teal);font-size:15px;font-weight:600}

    /* FAQ */
    .faq{background:white;padding:96px 0}
    .faqh{text-align:center;margin-bottom:48px}
    .faq-list{max-width:720px;margin:0 auto;display:flex;flex-direction:column;gap:8px}
    .faq-it{background:var(--sand-lt);border:2px solid var(--bwarm);border-radius:12px;overflow:hidden;transition:border-color 200ms,box-shadow 200ms var(--ease)}
    .faq-it:hover{box-shadow:0 6px 24px rgba(11,61,107,.08)}
    .faq-it.open{border-color:var(--teal)}
    .faq-q{width:100%;background:none;border:none;padding:17px 20px;display:flex;justify-content:space-between;align-items:center;gap:16px;text-align:left}
    .faq-qt{font-size:14px;font-weight:600;color:var(--text);line-height:1.45}
    .faq-ic{width:18px;height:18px;flex-shrink:0;color:var(--teal);transition:transform 280ms var(--ease)}
    .faq-it.open .faq-ic{transform:rotate(180deg)}
    .faq-a{max-height:0;overflow:hidden;transition:max-height 400ms var(--ease-io)}
    .faq-it.open .faq-a{max-height:400px}
    .faq-ai{padding:0 20px 17px;font-size:13px;color:var(--mid);line-height:1.85}

    /* LOCATION */
    .loc{background:var(--sand-lt);padding:96px 0;border-top:1px solid var(--bwarm)}
    .loch{text-align:center;margin-bottom:52px}
    .loc-g{display:grid;grid-template-columns:1fr 1fr;gap:36px;align-items:start}
    .loc-map{border-radius:14px;overflow:hidden;border:2px solid var(--border)}
    .loc-info{display:flex;flex-direction:column;gap:12px}
    .loc-card{background:white;border:2px solid var(--border);border-radius:12px;padding:14px 16px;display:flex;gap:12px;align-items:flex-start;transition:transform 220ms var(--ease),box-shadow 220ms var(--ease),border-color 200ms}
    .loc-card:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(11,61,107,.1);border-color:var(--teal)}
    .loc-ic{width:36px;height:36px;border-radius:10px;background:var(--teal-pale);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:17px}
    .loc-t{font-size:12px;font-weight:700;color:var(--text);margin-bottom:3px}
    .loc-d{font-size:12px;color:var(--muted);line-height:1.65}

    /* CTA */
    .cta{background:linear-gradient(135deg,#082847,#0B3D6B,#0E5A8A,#082847);background-size:300% 300%;padding:110px 0;position:relative;overflow:hidden;animation:bgShift 10s ease infinite}
    .cta-glow{position:absolute;width:700px;height:700px;background:radial-gradient(ellipse,rgba(10,172,172,.1) 0%,transparent 65%);top:50%;left:50%;transform:translate(-50%,-50%);pointer-events:none}
    .cta-in{text-align:center;position:relative;z-index:1;max-width:660px;margin:0 auto}
    .cta-h{font-family:'Plus Jakarta Sans',sans-serif;font-size:clamp(32px,5vw,62px);font-weight:800;color:white;line-height:1.05;letter-spacing:-.035em;margin-bottom:16px}
    .cta-h em{font-style:italic;color:var(--teal-lt)}
    .cta-p{font-size:16px;color:rgba(255,255,255,.52);line-height:1.8;margin-bottom:38px}
    .cta-btns{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-bottom:22px}
    .cta-sub{font-size:12px;color:rgba(255,255,255,.32)}
    .cta-sub a{color:rgba(255,255,255,.55);transition:color 180ms}
    .cta-sub a:hover{color:white}

    /* FOOTER */
    .footer{background:#061828;border-top:1px solid rgba(255,255,255,.07);padding:44px 0 32px}
    .footer-g{display:grid;grid-template-columns:1fr auto auto;gap:52px;margin-bottom:28px;align-items:start}
    .footer-desc{font-size:12px;color:rgba(255,255,255,.3);line-height:1.7;max-width:260px;margin-top:12px}
    .footer-ct{font-size:9px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,.28);margin-bottom:14px}
    .footer-ls{display:flex;flex-direction:column;gap:8px}
    .footer-l{font-size:12px;color:rgba(255,255,255,.45);transition:color 180ms;text-decoration:none}
    .footer-l:hover{color:rgba(255,255,255,.8)}
    .footer-bot{border-top:1px solid rgba(255,255,255,.06);padding-top:16px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px}
    .footer-copy{font-size:11px;color:rgba(255,255,255,.22)}
    .soc-ls{display:flex;gap:16px}
    .soc-l{font-size:11px;color:rgba(255,255,255,.3);transition:color 180ms;letter-spacing:.04em;text-decoration:none}
    .soc-l:hover{color:rgba(255,255,255,.7)}

    /* RESPONSIVE */
    @media(max-width:1024px){
      .wrap{padding:0 28px} .nav-i{padding:0 28px}
      .hero-grid{grid-template-columns:1fr;gap:32px}
      .hero-bar-g{grid-template-columns:repeat(2,1fr)}
      .trust-g{grid-template-columns:repeat(2,1fr)}
      .trust-it:nth-child(2){border-right:none}
      .trust-it:nth-child(n+3){border-top:1px solid var(--bwarm)}
      .fg{grid-template-columns:1fr 1fr}
      .safety-g{grid-template-columns:1fr;gap:32px}
      .why-h{grid-template-columns:1fr;gap:14px}
      .why-g{grid-template-columns:repeat(2,1fr)}
      .why-it:nth-child(2n){border-right:none}
      .team-h{grid-template-columns:1fr;gap:14px}
      .team-g{grid-template-columns:repeat(2,1fr)}
      .sched-g{grid-template-columns:repeat(2,1fr)}
      .dg{grid-template-columns:repeat(2,1fr)}
      .pg{grid-template-columns:1fr 1fr}
      .inc-g{grid-template-columns:repeat(2,1fr)}
      .gg{grid-template-columns:repeat(3,1fr)}
      .rev-g{grid-template-columns:repeat(2,1fr)}
      .rev-empty{grid-column:span 2}
      .loc-g{grid-template-columns:1fr}
      .footer-g{grid-template-columns:1fr;gap:28px}
    }
    @media(max-width:768px){
      .wrap{padding:0 20px} .nav-i{padding:0 20px}
      .nav-links,.nav-r .btn-teal{display:none}
      .mob-btn{display:block}
      .hero-h1{font-size:clamp(32px,9vw,50px)}
      .hero-grid{padding:40px 0 96px}
      .fg{grid-template-columns:1fr}
      .why-g{grid-template-columns:1fr}
      .why-it{border-right:none!important}
      .team-g{grid-template-columns:1fr}
      .sched-g{grid-template-columns:1fr 1fr}
      .dg{grid-template-columns:1fr}
      .pg{grid-template-columns:1fr}
      .inc-g{grid-template-columns:1fr 1fr}
      .gg{grid-template-columns:repeat(2,1fr)}
      .gi-wide{grid-column:span 1}
      .rev-g{grid-template-columns:1fr}
      .rev-empty{grid-column:span 1}
      .cta-btns,.hero-acts{flex-direction:column;align-items:center}
      .hero-acts .btn{width:100%;justify-content:center}
    }
  `

  return (
    <>
      <style>{CSS}</style>

      {/* INTRO ANIMATION */}
      {introVisible && (
        <div
          style={{
            position:'fixed',inset:0,zIndex:999,background:'#0B3D6B',
            display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',
            animation:'introFade 0.6s ease 1.8s forwards',
            pointerEvents:'none',
          }}
          onAnimationEnd={() => setIntroVisible(false)}
        >
          <div style={{animation:'introScale 0.7s cubic-bezier(0.23,1,0.32,1) 0.2s both'}}>
            <img
              src="/logo.jpeg"
              alt="Time to Surf"
              style={{width:100,height:100,borderRadius:'50%',objectFit:'cover',
                border:'3px solid rgba(10,172,172,0.6)',
                boxShadow:'0 0 60px rgba(10,172,172,0.4), 0 0 120px rgba(10,172,172,0.15)',
              }}
            />
          </div>
          <div style={{
            fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:28,fontWeight:800,color:'white',
            letterSpacing:'-.03em',marginTop:20,animation:'introSlide 0.6s ease 0.5s both'
          }}>Time to Surf</div>
          <div style={{
            fontSize:11,fontWeight:700,letterSpacing:'.18em',textTransform:'uppercase',
            color:'rgba(255,255,255,.4)',marginTop:6,animation:'introSlide 0.6s ease 0.65s both'
          }}>{c('Детские лагеря · Таллин','Kids Camps · Tallinn','Laste laagrid · Tallinn')}</div>
          <div style={{
            width:40,height:2,background:'var(--teal)',borderRadius:1,marginTop:24,
            animation:'introBar 0.8s ease 0.8s both'
          }}/>
        </div>
      )}
      <ScrollProgress />

      {/* GALLERY LIGHTBOX */}
      {galleryLightbox && (() => {
        const pool = galleryLightbox.pool === 'hero' ? HERO_PHOTOS : GALLERY_IMGS
        return (
          <div className="lb-overlay" onClick={() => setGalleryLightbox(null)}>
            <button className="lb-close" onClick={() => setGalleryLightbox(null)}>✕</button>
            <button className="lb-prev" onClick={e => { e.stopPropagation(); const ni = (galleryLightbox.idx - 1 + pool.length) % pool.length; setGalleryLightbox({src:pool[ni],idx:ni,pool:galleryLightbox.pool}) }}>‹</button>
            <img src={galleryLightbox.src} alt="" onClick={e => e.stopPropagation()} />
            <button className="lb-next" onClick={e => { e.stopPropagation(); const ni = (galleryLightbox.idx + 1) % pool.length; setGalleryLightbox({src:pool[ni],idx:ni,pool:galleryLightbox.pool}) }}>›</button>
            <div className="lb-counter">{galleryLightbox.idx + 1} / {pool.length}</div>
          </div>
        )
      })()}

      {/* PROGRAM MODAL */}
      {programModal && PROGRAM_DATA[programModal] && (() => {
        const d = PROGRAM_DATA[programModal]
        return (
          <div className="pm-overlay" onClick={() => setProgramModal(null)}>
            <div className="pm-box" onClick={e => e.stopPropagation()}>
              <div className="pm-hero">
                <img src={d.photo} alt={d.title} />
                <div className="pm-hero-txt">
                  <div className="pm-hero-lbl">Time to Surf · {c('Программа','Programme','Programm')}</div>
                  <div className="pm-hero-title">{d.title}</div>
                </div>
              </div>
              <button className="pm-close" onClick={() => setProgramModal(null)}>✕</button>
              <div className="pm-body">
                <p className="pm-sub">{d.sub}</p>
                <div className="pm-meta">
                  <div className="pm-meta-item"><span>{c('Возраст','Age','Vanus')}</span><strong>{d.age}</strong></div>
                  <div className="pm-meta-item"><span>{c('Стоимость','Price','Hind')}</span><strong>{d.price} - {c('всё включено','all included','kõik sees')}</strong></div>
                </div>
                <div className="pm-dates">
                  {d.dates.map((dt: string) => <div key={dt} className="pm-date-chip">{dt}</div>)}
                </div>
                {d.sections.map((sec: {title:string,items:string[]}, i: number) => (
                  <div key={i}>
                    <div className="pm-sec-title">{sec.title}</div>
                    {sec.items.map((item: string, j: number) => (
                      <div key={j} className="pm-item"><div className="pm-dot"/><span>{item}</span></div>
                    ))}
                  </div>
                ))}
                <div className="pm-leader">
                  <div className="pm-leader-av">{d.leader.initials}</div>
                  <div>
                    <div className="pm-leader-name">{d.leader.name}</div>
                    <div className="pm-leader-bio">{d.leader.bio}</div>
                  </div>
                </div>
              </div>
              <div className="pm-footer">
                <div>
                  <div className="pm-price">{d.price}</div>
                  <div className="pm-price-note">{c('5 дней - всё включено','5 days - all included','5 paeva - koik sees')}</div>
                </div>
                <a href={REG} target="_blank" className="btn btn-teal" style={{marginLeft:'auto'}} onClick={() => setProgramModal(null)}>{c('Записаться','Register','Registreeru')} →</a>
              </div>
            </div>
          </div>
        )
      })()}

      {/* NAV */}
      <header className={`nav${scrolled ? ' on' : ''}`}>
        <div className="nav-i">
          <div className="nav-brand" style={{cursor:'pointer'}} onClick={() => window.scrollTo({top:0,behavior:'smooth'})}>
            <img src="/logo.jpeg" alt="Time to Surf" className="nav-logo" />
            <div>
              <div className="nav-name">Time to Surf</div>
              <div className="nav-sub">{c('Детские лагеря · Таллин','Kids Camps · Tallinn','Laste laagrid · Tallinn')}</div>
            </div>
          </div>
          <nav className="nav-links">
            {[
              [c('Программы','Programmes','Programmid'),'formats'],
              [c('Цены','Prices','Hinnad'),'pricing'],
              [c('Расписание','Schedule','Ajakava'),'dates'],
              [c('Команда','Team','Meeskond'),'team'],
              [c('Отзывы','Reviews','Arvustused'),'reviews'],
              [c('Место','Location','Asukoht'),'location'],
            ].map(([l,id]) => (
              <button key={id as string} className="nav-link" onClick={() => go(id as string)}>{l}</button>
            ))}
          </nav>
          <div className="nav-r">
            <div className="lang-sw">
              {(['ru','en','et'] as Lang[]).map(l => (
                <button key={l} className={`lang-btn${lang===l?' a':''}`} onClick={() => { setLang(l); localStorage.setItem('tts-lang',l); setMenuOpen(false) }}>{l.toUpperCase()}</button>
              ))}
            </div>
            <a href={REG} target="_blank" className="btn btn-teal btn-sm">{c('Записаться','Register','Registreeru')}</a>
          </div>
          <button className="mob-btn" onClick={() => setMenuOpen(true)} aria-label="Menu">
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h16M3 7h16M3 17h16"/></svg>
          </button>
        </div>
      </header>

      {/* MOBILE MENU */}
      <div className={`mob-menu${menuOpen?' open':''}`}>
        <button className="mob-close" onClick={() => setMenuOpen(false)}>
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
        {[
          [c('Программы','Programmes','Programmid'),'formats'],
          [c('Цены','Prices','Hinnad'),'pricing'],
          [c('Расписание','Schedule','Ajakava'),'dates'],
          [c('Команда','Team','Meeskond'),'team'],
          [c('Отзывы','Reviews','Arvustused'),'reviews'],
          [c('Место','Location','Asukoht'),'location'],
        ].map(([l,id]) => (
          <button key={id as string} className="nav-link" onClick={() => go(id as string)}>{l}</button>
        ))}
        <div className="lang-sw" style={{marginTop:8}}>
          {(['ru','en','et'] as Lang[]).map(l => (
            <button key={l} className={`lang-btn${lang===l?' a':''}`} onClick={() => { setLang(l); localStorage.setItem('tts-lang',l); setMenuOpen(false) }}>{l.toUpperCase()}</button>
          ))}
        </div>
        <a href={REG} target="_blank" className="btn btn-sun" style={{marginTop:8}}>{c('Записаться в лагерь','Register for Camp','Registreeru laagrisse')}</a>
      </div>

      {/* HERO */}
      <section className="hero">
        <div className="hero-glow"/>
        <div className="hero-glow2"/>
        <div className="hero-in">
          <div className="wrap" style={{width:'100%'}}>
            <div className="hero-grid">
              <div>
                <div className="hero-ey rv">
                  <div className="hero-dot"/>
                  <span className="hero-ey-t">{c('Таллин · Пляж Штромка · Лето 2026','Tallinn · Stroomi Beach · Summer 2026','Tallinn · Stroomi rand · Suvi 2026')}</span>
                </div>
                <h1 className="hero-h1 rv" style={{transitionDelay:'60ms'}}>
                  {c('Детский','Kids','Laste')}<br/><em>{c('серфинг-лагерь','Surf Camp','surfilaager')}</em><br/>{c('на море','by the Sea','mere ääres')}
                </h1>
                <p className="hero-desc rv" style={{transitionDelay:'110ms'}}>
                  {c('Серфинг, природа, настоящая команда - 5 дней, которые ребёнок запомнит навсегда. Море, ветер, новые друзья.','Surfing, nature and real teamwork - 5 days your child will never forget. Sea, wind, new friends.','Surfamine, loodus ja meeskonnatöö - 5 päeva, mida laps igavesti mäletab.')}
                </p>
                <div className="hero-pills rv" style={{transitionDelay:'150ms'}}>
                  <span className="pill">{c('Возраст 7-14 лет','Age 7-14','Vanus 7-14')}</span>
                  <span className="pill">{c('от 190€','from €190','alates 190€')}</span>
                  <span className="pill">{c('Питание включено','Meals included','Toitlustus sees')}</span>
                  <span className="pill">{c('12-16 детей в группе','Groups of 12-16','12-16 last rühmas')}</span>
                </div>
                <div className="hero-acts rv" style={{transitionDelay:'190ms'}}>
                  <a href={REG} target="_blank" className="btn btn-sun" style={{padding:'15px 36px',fontSize:15}}>{c('Записать ребёнка','Register my child','Registreeri laps')}</a>
                  <button onClick={() => go('formats')} className="btn btn-ghost">{c('Узнать больше','Learn more','Loe lähemalt')}</button>
                </div>
              </div>
              <div className="hcard rv" style={{transitionDelay:'170ms',animation:'floatY2 5s ease-in-out infinite'}}>
                <div className="hcard-head">
                  <div className="hcard-lbl">{c('Форматы лагерей 2026','Camp Formats 2026','Laagri formaadid 2026')}</div>
                  {[
                    {color:'#7C3AED', name:c('Серфинг + Кино','Surf + Cinema','Surf + Kino'), date:'Jun-Jul'},
                    {color:'#16A34A', name:c('Серфинг + Поход','Surf + Hike','Surf + Matk'), date:'Jul-Aug'},
                    {color:'#1A6BAA', name:c('Серфинг лагерь','Surf Camp','Surfilaager'), date:'Jun-Aug'},
                  ].map(r => (
                    <div key={r.name} className="hcard-row">
                      <div className="hcard-dot" style={{background:r.color}}/>
                      <span className="hcard-name">{r.name}</span>
                      <span className="hcard-date">{r.date}</span>
                    </div>
                  ))}
                </div>
                <div className="hcard-stats">
                  {[
                    {n:'7+', l:c('лет','years','aastat')},
                    {n:'265€', l:c('5 дней','5 days','5 päeva')},
                    {n:'9', l:c('смен','sessions','vahetust')},
                  ].map(s => (
                    <div key={s.l} className="hstat">
                      <div className="hstat-n">{s.n}</div>
                      <div className="hstat-l">{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-bar rv">
          <div className="wrap">
            <div className="hero-bar-g">
              {[
                {l:c('Ближайшая смена','Next session','Järgmine vahetus'), v:'15.06.2026'},
                {l:c('Место','Location','Asukoht'), v:'Stroomi rand, Tallinn'},
                {l:c('Контакт','Contact','Kontakt'), v:'+372 55512872'},
                {l:'Telegram', v:'@Andrei_Time_to_Surf'},
              ].map(b => (
                <div key={b.l} className="hero-bar-item">
                  <div className="hero-bar-l">{b.l}</div>
                  <div className="hero-bar-v">{b.v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="hero-wave"/>
      </section>


      {/* MARQUEE TICKER */}
      <div style={{background:'var(--teal)',overflow:'hidden',padding:'10px 0',position:'relative',zIndex:1}}>
        <div style={{display:'flex',gap:0,animation:'marquee 18s linear infinite',width:'max-content'}}>
          {Array.from({length:2}).map((_,rep) => (
            <div key={rep} style={{display:'flex',gap:0,flexShrink:0}}>
              {[
                c('🏄 Серфинг','🏄 Surfing','🏄 Surfamine'),
                c('🎬 Кино','🎬 Cinema','🎬 Kino'),
                c('🥾 Поход','🥾 Hiking','🥾 Matk'),
                c('🌊 Таллин','🌊 Tallinn','🌊 Tallinn'),
                c('⭐ Лето 2026','⭐ Summer 2026','⭐ Suvi 2026'),
                c('🛟 Безопасность','🛟 Safety','🛟 Ohutus'),
                c('👧 Возраст 7-14','👧 Ages 7-14','👧 Vanus 7-14'),
                c('🌍 Эстония','🌍 Estonia','🌍 Eesti'),
              ].map((item, i) => (
                <span key={i} style={{
                  fontSize:12,fontWeight:700,letterSpacing:'.08em',textTransform:'uppercase',
                  color:'rgba(255,255,255,.9)',padding:'0 28px',whiteSpace:'nowrap',
                  borderRight:'1px solid rgba(255,255,255,.25)',
                }}>{item}</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* TRUST */}
      <section className="trust">
        <div className="wrap">
          <div className="trust-g sg">
            {[
              {n:'7+', l:c('лет школа работает','years running','aastat töötame'), color:'var(--ocean)'},
              {n:'1000+', l:c('детей прошли лагерь','kids attended','last osalenud'), color:'var(--teal)'},
              {n:'3', l:c('уникальных программы','unique programmes','ainulaadset programmi'), color:'var(--ocean)'},
              {n:'9', l:c('смен за лето','sessions per summer','vahetust suvel'), color:'var(--teal)'},
            ].map((t,i) => (
              <div key={t.l} className="trust-it" style={{animation:`countUp 600ms var(--ease) ${i*120}ms both`}}>
                <div className="trust-n" style={{color:t.color}}>{t.n}</div>
                <div className="trust-l">{t.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FORMATS */}
      <section className="formats" id="formats">
        <div className="wrap">
          <div className="fhead rv">
            <div className="tag tag-teal" style={{background:'var(--teal-pale)',padding:'6px 16px',borderRadius:50}}>{c('Наши программы','Our programmes','Meie programmid')}</div>
            <h2 className="sec-h" style={{marginBottom:12}}>{c('Три уникальные программы','Three unique programmes','Kolm ainulaadset programmi')}</h2>
            <p className="sec-sub" style={{margin:'0 auto'}}>{c('Серфинг - основа каждой программы. Всё остальное - особенный опыт, который не повторить.','Surfing is the core of every programme. The rest is a unique experience that can\'t be repeated.','Surfamine on iga programmi alus. Ülejäänud on ainulaadne kogemus.')}</p>
          </div>
          <div className="fg sg">
            {[
              {
                bg:null, photo:'/IMG_7917-1024x768.jpeg',
                lbl:c('Серфинг + Творчество','Surfing + Creativity','Surfamine + Loovus'),
                title:c('Серфинг + Кино','Surf + Cinema','Surf + Kino'),
                desc:c('Утром - серфинг и вода. После обеда - настоящая киностудия. Дети берут интервью, снимают репортажи и монтируют короткий фильм, который останется на память.','Morning: surfing and water. Afternoon: a real film studio. Kids interview, shoot reports and edit a short film.','Hommikul surfamine. Pärastlõunal päris filmistuudio. Lapsed monteerivad lühifilmi.'),
                items:[
                  c('SUP-серфинг, бодиборд, ОФП каждый день','SUP surfing, bodyboard, fitness every day','SUP surfamine, bodybord iga päev'),
                  c('Роли: ведущий, оператор, монтажёр, сценарист','Roles: host, cameraman, editor, writer','Rollid: saatejuht, operaator, monteerija'),
                  c('Финальный показ фильма для родителей','Final film screening for parents','Lõpulinastus vanematele'),
                  c('Ведущая: Наталья Карасёва - ТВ-журналист, 20+ лет','Lead: Natalia Karaseva - TV journalist 20+ years','Juht: Natalia Karaseva - teleajakirjanik 20+ aastat'),
                ],
                leaderInitials:'НК',
                leaderName:c('Наталья Карасёва','Natalia Karaseva','Natalia Karaseva'),
                leaderRole:c('Тележурналист с 20-летним стажем в двух странах, автор подкаста «Cozy with Tasha», создатель документальных проектов. Учит детей видеть историю и не бояться камеры.','TV journalist 20+ years in two countries, podcast host "Cozy with Tasha". Teaches kids to see a story and not fear the camera.','Teleajakirjanik 20+ aastat kahes riigis, taskuhäälingu autor "Cozy with Tasha". Õpetab lapsi nägema lugu ja mitte kartma kaamerat.'),
                dates:c('15.06 и 29.06.2026','June 15 and June 29, 2026','15.06 ja 29.06.2026'),
              },
              {
                bg:null, photo:'/photo_2026-04-18-10_00_46-150x150.jpeg',
                lbl:c('Серфинг + Приключение','Surfing + Adventure','Surfamine + Seiklus'),
                title:c('Серфинг + Поход','Surf + Hike','Surf + Matk'),
                desc:c('Серфинг на воде и настоящие приключения в природе: ориентирование, разведение костра, палатка. Финал - мини-поход с применением всех навыков.','Surfing on water and real nature adventures: navigation, fire, tent. The finale is a mini-hike using all skills.','Surfamine vees ja päris loodusseiklused. Finaal - minimatk kõigi oskustega.'),
                items:[
                  c('Виндсерфинг, SUP, кайт каждый день','Windsurfing, SUP, kite every day','Purjelaud, SUP, kait iga päev'),
                  c('Ориентирование по карте и компасу','Map and compass navigation','Kaardi ja kompassi navigeerimine'),
                  c('Костёр, палатка, навыки выживания','Fire, tent, survival skills','Lõke, telk, ellujäämisoskused'),
                  c('Ведущий: Виталий - хайкер, Höga Kusten 140 км (UNESCO)','Lead: Vitaliy - hiker, Höga Kusten 140km (UNESCO)','Juht: Vitaliy - matkaja, Höga Kusten 140km'),
                ],
                leaderInitials:'ВХ',
                leaderName:c('Виталий Холстинин','Vitaliy Kholstinin','Vitaliy Kholstinin'),
                leaderRole:c('Предприниматель, хайкер, основатель Join The Hike. Höga Kusten 140 км (UNESCO) и Land of Giants 120 км. Живёт тем, что преподаёт.','Entrepreneur, hiker, founder of Join The Hike. Höga Kusten 140km (UNESCO) and Land of Giants 120km.','Ettevõtja, matkaja, Join The Hike asutaja. Höga Kusten 140km (UNESCO) ja Land of Giants 120km. Elab seda, mida õpetab.'),
                dates:c('13.07 и 17.08.2026','July 13 and Aug 17, 2026','13.07 ja 17.08.2026'),
              },
              {
                bg:null, photo:'/DSC02878-150x150.jpeg',
                lbl:c('Классика · Лучший старт','Classic · Best start','Klassika · Parim algus'),
                title:c('Серфинг лагерь','Surf Camp','Surfilaager'),
                desc:c('Классическая программа для тех, кто впервые открывает мир серфинга. Разные виды водного спорта, безопасность и командные игры - идеально для старта.','Classic programme for first-timers. Different water sports, safety training and team games - perfect for a first experience.','Klassikaline programm esmakordseks tutvumiseks surfimaailmaga.'),
                items:[
                  c('SUP, виндсерфинг, кайт, бодиборд, вингфоилинг','SUP, windsurfing, kite, bodyboard, wingfoiling','SUP, purjelaud, kait, bodybord, wingfoiling'),
                  c('Гидрокостюмы и жилеты - всё включено','Wetsuits and life jackets - all included','Märjaksüidid ja päästevested - kõik sees'),
                  c('Культура серфинга: виды костюмов и уход','Surf culture: wetsuit types and care','Surfikultuur: märjaksüidi tüübid ja hooldus'),
                  c('Подходит для новичков и с опытом','Suits beginners and experienced kids','Sobib algajatele ja kogenud lastele'),
                ],
                leaderInitials:'НГ',
                leaderName:c('Надежда + Григорий','Nadezhda + Grigory','Nadezhda + Grigory'),
                leaderRole:c('Сертифицированные инструктора с многолетним опытом работы с детьми на Балтийском море. Умеют мотивировать и поддерживать на каждом этапе.','Certified surf instructors with years of experience working with children on the Baltic Sea.','Sertifitseeritud instruktorid Läänemere lastega töötamisel mitmeaastase kogemusega.'),
                dates:c('6 смен: июнь - август 2026','6 sessions: June - August 2026','6 vahetust: juuni - august 2026'),
              },
            ].map((f, i) => (
              <div key={i} className="fcard">
                <div className="fcard-banner">
                  {f.photo && <img src={f.photo} alt={f.title as string} className="fb-img" />}
                  <div className="fcard-blbl">{f.lbl}</div>
                  <div className="fcard-bt">{f.title}</div>
                </div>
                <div className="fcard-body">
                  <p className="fcard-desc">{f.desc}</p>
                  <div className="fcard-list">
                    {f.items.map((it,j) => (
                      <div key={j} className="fcard-it">
                        <div className="fcard-ck">
                          <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1 4l2 2 4-4" stroke="var(--teal)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </div>
                        <span>{it}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {expandedFormat === i && (
                  <div className="fcard-exp">
                    <h4>{c('Ведущий программы','Programme lead','Programmi juht')}</h4>
                    <div className="fcard-leader">
                      <div style={{width:44,height:44,borderRadius:'50%',background:'var(--ocean)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,color:'rgba(255,255,255,.8)',fontWeight:800,fontSize:14,fontFamily:"'Plus Jakarta Sans',sans-serif",letterSpacing:'-.01em'}}>{f.leaderInitials}</div>
                      <div>
                        <div className="fcard-lname">{f.leaderName}</div>
                        <div className="fcard-lrole">{f.leaderRole}</div>
                      </div>
                    </div>
                    <h4 style={{marginTop:14}}>{c('Даты','Dates','Kuupäevad')}</h4>
                    <div style={{fontWeight:700,color:'var(--ocean)',fontSize:14}}>{f.dates}</div>
                  </div>
                )}
                <div className="fcard-foot">
                  <div className="fcard-btns">
                    <button className="fcard-more" onClick={() => setExpandedFormat(expandedFormat===i?null:i)}>
                      {expandedFormat===i ? c('Свернуть','Close','Sulge') : c('Подробнее','Details','Loe lähemalt')}
                    </button>
                    <a href={REG} target="_blank" className="btn btn-teal btn-sm">{c('Записаться','Register','Registreeru')}</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SAFETY */}
      <section className="safety">
        <div className="wrap">
          <div className="safety-g">
            <div className="rv">
              <div className="tag tag-pale">{c('Безопасность','Safety','Ohutus')}</div>
              <h2 className="sec-h sec-h-lt" style={{marginBottom:12}}>
                {c('Родителям','Parents','Vanematele')}<br/><em>{c('спокойно','can relax','on rahulik')}</em>
              </h2>
              <p className="sec-sub" style={{color:'rgba(255,255,255,.42)',marginBottom:8}}>
                {c('Безопасность - это не пункт в программе. Это основа всего, что мы делаем. Дети учатся не бояться воды, а понимать её.','Safety is not a programme item. It\'s the foundation of everything we do. Kids learn to understand water, not fear it.','Ohutus ei ole lihtsalt programmipunkt. See on alus kõigele, mida teeme.')}
              </p>
              <div className="safety-items">
                {[
                  {icon:'🛟', t:c('Жилеты и гидрокостюмы всегда','Life jackets and wetsuits always','Päästevested alati'), d:c('Каждый ребёнок в воде только в жилете и гидрокостюме. Без исключений.','Every child in the water only with a life jacket and wetsuit. No exceptions.','Iga laps vees ainult päästevesti ja märjaksüidiga.')},
                  {icon:'👥', t:c('Группы 12-16 детей','Groups of 12-16 kids','Grupid 12-16 last'), d:c('Каждый инструктор видит каждого ребёнка. Никто не остаётся без внимания.','Every instructor sees every child. No one goes unnoticed.','Iga instruktor näeb iga last.')},
                  {icon:'📚', t:c('Теория безопасности перед водой','Safety theory before water','Ohutusteooroia enne vett'), d:c('Перед каждым заходом - правила, разбор ситуаций и объяснение опасностей.','Before every session - rules, scenario analysis and hazard explanation.','Enne iga sessiooni - reeglid, stsenaariumid ja ohuanalüüs.')},
                  {icon:'🌊', t:c('Учим читать воду и ветер','We teach reading water and wind','Õpetame lugema vett ja tuult'), d:c('Дети понимают ветер, погоду и как это влияет на безопасность на воде.','Kids learn wind, weather and how it affects water safety.','Lapsed mõistavad tuult ja ilma ning nende mõju ohutusele.')},
                ].map((s,i) => (
                  <div key={i} className="safety-it">
                    <div className="safety-icon">{s.icon}</div>
                    <div>
                      <div className="safety-t">{s.t}</div>
                      <div className="safety-d">{s.d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="safety-photos sg">
              <img src="/DSC02691-150x150.jpeg" alt="Safety" className="safety-photo"/>
              <img src="/IMG_7773-150x150.jpeg" alt="Kids in water" className="safety-photo"/>
              <img src="/IMG_7812-150x150.jpeg" alt="Group" className="safety-photo"/>
              <img src="/DSC02699-150x150.jpeg" alt="Instructor" className="safety-photo"/>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="pricing" id="pricing">
        <div className="wrap">
          <div className="phead rv">
            <div className="tag tag-muted">{c('Стоимость','Pricing','Hinnad')}</div>
            <h2 className="sec-h" style={{marginBottom:12}}>{c('Прозрачные цены -','Transparent pricing -','Läbipaistvad hinnad -')}<br/><em>{c('всё включено','all included','kõik sees')}</em></h2>
          </div>
          <div className="pg sg">
            {[
              {tag:'3', days:c('3 ДНЯ','3 DAYS','3 PÄEVA'), label:c('Пробная смена','Trial session','Proovisessioon'), price:'190€', note:c('Идеально для первого знакомства','Perfect for a first try','Ideaalne esimeseks tutvumiseks'), feat:false},
              {tag:'pop', days:c('5 ДНЕЙ','5 DAYS','5 PÄEVA'), label:c('Полная программа','Full programme','Täisprogramm'), price:'265€', note:c('Максимум впечатлений и навыков','Maximum impressions and skills','Maksimaalselt muljeid ja oskusi'), feat:true},
              {tag:'4', days:c('4 ДНЯ','4 DAYS','4 PÄEVA'), label:c('Гибкий формат','Flexible format','Paindlik formaat'), price:'235€', note:c('Удобно для занятых семей','Convenient for busy families','Mugav hõivatud peredele'), feat:false},
            ].map((p,i) => (
              <div key={i} className={`pc ${p.feat?'pc-feat':'pc-std'}`}>
                {p.feat && <div className="pop-badge">{c('Самый популярный','Most popular','Populaarseim')}</div>}
                <div className={`pc-tag ${p.feat?'pc-tag-feat':'pc-tag-std'}`}>{p.days}</div>
                <div className={`pc-days ${p.feat?'pc-days-feat':'pc-days-std'}`}>{p.label}</div>
                <div className={`pc-price ${p.feat?'pc-price-feat':'pc-price-std'}`}>{p.price}</div>
                <div className={`pc-note ${p.feat?'pc-note-feat':'pc-note-std'}`}>{p.note}</div>
                <a href={REG} target="_blank" className={p.feat?'pc-btn-feat':'pc-btn-std'}>{c('Записаться','Register','Registreeru')}</a>
              </div>
            ))}
          </div>
          <div className="includes rv">
            <div className="inc-title">{c('В цену входит','Included in price','Hind sisaldab')}</div>
            <div className="inc-g">
              {[
                c('Вся программа серфинга','Full surf programme','Kogu surfi programm'),
                c('Питание от Tark Catering','Meals - Tark Catering','Toitlustus - Tark Catering'),
                c('Гидрокостюмы и жилеты','Wetsuits and life jackets','Märjaksüidid ja päästevested'),
                c('Всё оборудование','All equipment','Kogu varustus'),
                c('Работа инструкторов','Instructor work','Instruktorite töö'),
                c('Мастер-классы и активности','Workshops and activities','Töötoad ja tegevused'),
                c('Чаепитие и полдник','Tea time and snack','Tee aeg ja eine'),
                c('Сертификат участника','Participation certificate','Osalussertifikaat'),
              ].map(item => (
                <div key={item} className="inc-it"><div className="inc-dot"/><span>{item}</span></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* WHY */}
      <section className="why">
        <div className="wrap">
          <div className="why-h">
            <div className="rv">
              <div className="tag tag-teal">{c('Почему серфинг','Why surfing','Miks surfamine')}</div>
              <h2 className="sec-h sec-h-lt">{c('Серфинг - это больше,','Surfing is more','Surfamine on rohkem')}<br/><em>{c('чем спорт','than a sport','kui sport')}</em></h2>
            </div>
            <div className="rv" style={{transitionDelay:'80ms'}}>
              <p className="sec-sub" style={{color:'rgba(255,255,255,.42)'}}>
                {c('На волне невозможно думать о лишнем - только здесь и сейчас. Серфинг - это стиль мышления, который остаётся с ребёнком навсегда.','On a wave, your mind can only be here and now. Surfing is a mindset that stays with the child forever.','Lainel saab mõelda ainult praegusele hetkele. Surfamine on mõtteviis, mis jääb kogu eluks.')}
              </p>
            </div>
          </div>
          <div className="why-g sg">
            {[
              {n:'01', t:c('Здоровье и сила','Health & Strength','Tervis ja tugevus'), d:c('Морской воздух, движение, солнце - полная перезагрузка тела и головы без гаджетов.','Sea air, movement, sun - a complete reset of body and mind without screens.','Mereõhk, liikumine, päike - keha ja pea täielik taastumine ekraanideta.')},
              {n:'02', t:c('Здесь и сейчас','Present moment','Praegune hetk'), d:c('Вода учит концентрации и осознанности лучше любого тренинга. Лишние мысли просто не помещаются.','Water teaches focus and mindfulness better than any training. Distracting thoughts just don\'t fit.','Vesi õpetab keskendumisvõimet paremini kui ükski treening.')},
              {n:'03', t:c('Чтение природы','Reading nature','Looduse lugemine'), d:c('Дети учатся читать ветер, воду и погоду - навык, который остаётся с ними на всю жизнь.','Children learn to read wind, water and weather - a lifelong skill.','Lapsed õpivad lugema tuult, vett ja ilma - eluaegne oskus.')},
              {n:'04', t:c('Уверенность в себе','Self-confidence','Enesekindlus'), d:c('Встать на доску и поймать волну - маленькая, но настоящая победа. Ребёнок видит свой прогресс каждый день.','Standing on a board and catching a wave is a small but real victory. The child sees their progress every day.','Lapse iga päev nähtav areng annab tõelise enesekindluse.')},
              {n:'05', t:c('Командный дух','Team spirit','Meeskonnavaim'), d:c('Дети поддерживают друг друга в воде и на берегу. Настоящая дружба - один из главных результатов лагеря.','Kids support each other in the water and on shore. Real friendship is one of the main outcomes.','Lapsed toetavad üksteist. Päris sõprus on üks peamisi tulemusi.')},
              {n:'06', t:c('Внутренний баланс','Inner balance','Sisemine tasakaal'), d:c('Вода учит спокойствию и контролю эмоций. Ребёнок возвращается домой спокойнее и увереннее.','Water teaches calm and emotional control. The child comes home calmer and more confident.','Vesi õpetab rahulikkust. Laps tuleb koju rahulikuma ja enesekindlamana.')},
            ].map(w => (
              <div key={w.n} className="why-it">
                <div className="why-n">{w.n}</div>
                <div className="why-t">{w.t}</div>
                <div className="why-d">{w.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="team" id="team">
        <div className="wrap">
          <div className="team-h">
            <div className="rv">
              <div className="tag tag-teal">{c('Наша команда','Our team','Meie meeskond')}</div>
              <h2 className="sec-h">{c('Люди, которым','People you','Inimesed, kellele')}<br/><em>{c('вы доверяете','can trust','usaldate')}</em></h2>
            </div>
            <div className="rv" style={{transitionDelay:'80ms'}}>
              <p className="sec-sub">{c('Каждый инструктор - живой человек со своей историей. Ваш ребёнок в надёжных руках.','Every instructor is a real person with their own story. Your child is in safe hands.','Iga instruktor on ehtne inimene oma looga. Teie laps on heades kätes.')}</p>
            </div>
          </div>
          <div className="team-g sg">
            {[
              {initials:'НК', name:'Наталья Карасёва', role:c('Ведущая - Серфинг + Кино','Cinema programme lead','Kino-programmi juht'), bio:c('Тележурналист с 20-летним стажем в двух странах, автор подкаста «Cozy with Tasha», создатель документальных проектов. Учит детей видеть историю в каждом кадре и не бояться камеры.','TV journalist with 20+ years in two countries, podcast "Cozy with Tasha". Teaches kids to see a story in every frame.','Teleajakirjanik 20+ aastat kahes riigis, taskuhäälingu «Cozy with Tasha» autor, dokumentaalfilmide looja. Õpetab lapsi nägema lugu igas kaadris ja mitte kartma kaamerat.')},
              {initials:'ВХ', name:'Виталий Холстинин', role:c('Ведущий - Серфинг + Поход','Hiking programme lead','Matkaprogrammi juht'), bio:c('Предприниматель, хайкер, основатель Join The Hike. Прошёл Höga Kusten (140 км, UNESCO) и Land of Giants (120 км). Живёт тем, что преподаёт.','Entrepreneur, hiker, founder of Join The Hike. Completed Höga Kusten (140km, UNESCO) and Land of Giants (120km).','Ettevõtja, matkaja, Join The Hike asutaja. Läbinud Höga Kusten (140 km, UNESCO) ja Land of Giants (120 km). Elab seda, mida õpetab.')},
              {initials:'НГ', name:'Надежда + Григорий', role:c('Инструктора по серфингу','Surf instructors','Surfiinstruktorid'), bio:c('Сертифицированные инструктора с многолетним опытом работы с детьми на Балтийском море. Умеют мотивировать и поддерживать - от первого шага на доске до уверенного катания.','Certified surf instructors with years of experience with children on the Baltic Sea. They know how to motivate and support at every stage.','Sertifitseeritud surfiinstruktorid, kes on aastaid töötanud lastega Läänemere ääres. Oskavad motiveerida ja toetada – esimesest sammust laual kuni enesekindla sõitmiseni.')},
            ].map((t,i) => (
              <div key={i} className="tc">
                <div className="tc-av-p">{t.initials}</div>
                <div className="tc-name">{t.name}</div>
                <div className="tc-role">{t.role}</div>
                <p className="tc-bio">{t.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DATES */}
      <section className="dates" id="dates">
        <div className="wrap">
          <div className="dhead rv">
            <div className="tag tag-muted">{c('Все смены','All sessions','Kõik vahetused')}</div>
            <h2 className="sec-h" style={{marginBottom:12}}>{c('Расписание лета 2026','Summer 2026 schedule','Suve 2026 ajakava')}</h2>
            <p className="sec-sub" style={{margin:'0 auto'}}>{c('Выберите смену и записывайтесь - места ограничены, группы маленькие.','Choose your session and register - spots are limited, groups are small.','Valige vahetus ja registreeruge - kohti on piiratud.')}</p>
          </div>
          <div className="dg sg">
            {DATES.map((d,i) => (
              <div key={i} className={`dc${d.hot?' hot':''}`}>
                {d.hot && <div className="dc-badge">{c('Мест мало!','Few spots!','Kohti vähe!')}</div>}
                <div className="dc-dates">{d.dates}</div>
                <div className="dc-type" style={{color:d.color}}>{d.type}</div>
                <div className="dc-leaders">{d.leaders}</div>
                <div className="dc-acts">
                  <a href={REG} target="_blank" className="dc-cta">{c('Записаться →','Register →','Registreeru →')}</a>
                  <button className="dc-more" onClick={() => setProgramModal(d.detail)}>{c('Подробнее','Details','Loe lähemalt')}</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SCHEDULE */}
      <section className="sched" id="program">
        <div className="wrap">
          <div className="sched-h rv">
            <div className="tag tag-pale">{c('Программа дня','Day programme','Päevaprogramm')}</div>
            <h2 className="sec-h sec-h-lt">{c('Как проходит день','How the day goes','Kuidas päev kulgeb')}</h2>
          </div>
          <div className="sched-g sg">
            {[
              {time:'09:00 - 09:30', name:c('Сбор детей','Arrival','Kogunemine'), desc:c('Встреча детей, знакомство, настрой на день','Meeting kids, introductions, setting the mood','Laste vastuvõtt, tutvumine')},
              {time:'09:30 - 10:00', name:c('Разминка','Warm-up','Soojendus'), desc:c('Активные тренировки и командные игры на берегу','Active training and team games on shore','Aktiivsed treeningud ja meeskonnmängud')},
              {time:'10:00 - 12:00', name:c('Водный блок','Water block','Vesiplokk'), desc:c('Теория безопасности, гидрокостюмы, SUP и виндсерфинг','Safety theory, wetsuits, SUP and windsurfing','Ohutusteooroia, märjaksüidid, SUP')},
              {time:'12:00 - 13:00', name:c('Обед','Lunch','Lõuna'), desc:c('Индивидуальные порции с учётом аллергий. Питание от Tark Catering 🍽','Individual portions, allergies noted - Tark Catering','Individuaalsed portsjonid - Tark Catering')},
              {time:'13:00 - 13:30', name:c('Отдых после обеда','After-lunch rest','Puhkus pärast lõunat'), desc:c('Спокойные и настольные игры, свободное общение','Quiet games, free time, conversations','Vaiksed mängud, vaba suhtlemine')},
              {time:'13:30 - 15:30', name:c('Активная программа','Active programme','Aktiivne programm'), desc:c('Виндсёрфинг, кайт, SUP, поход, хайкинг или пляжные игры - зависит от погоды','Windsurfing, kite, SUP, hiking or beach games - depends on weather','Purjelaud, kait, SUP, matk või rannamängud')},
              {time:'15:30 - 15:45', name:c('Чаепитие ☕','Tea time ☕','Tee aeg ☕'), desc:c('Перерыв, отдых, свободное общение','Break, rest, free conversation','Paus, puhkus, vaba suhtlemine')},
              {time:'15:45 - 16:30', name:c('Спокойный блок','Calm block','Rahulik plokk'), desc:c('Игры, творчество, интеллектуальные задания','Games, creativity, intellectual tasks','Mängud, loovus, intellektuaalsed ülesanded')},
              {time:'16:30', name:c('До завтра! 👋','See you tomorrow! 👋','Homseni! 👋'), desc:c('Конец программы, ожидание родителей','Programme ends, parents pick up','Programm lõpeb, vanemad tulevad järele')},
            ].map(s => (
              <div key={s.time} className="sched-it">
                <div className="sched-time">{s.time}</div>
                <div className="sched-name">{s.name}</div>
                <div className="sched-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="gallery" id="gallery">
        <div className="wrap">
          <div className="ghead rv">
            <div className="tag tag-pale">{c('Атмосфера','Atmosphere','Atmosfäär')}</div>
            <h2 className="sec-h sec-h-lt">{c('Жизнь в лагере','Life at camp','Elu laagris')}</h2>
            <p style={{color:'rgba(255,255,255,.4)',fontSize:14,marginTop:8,maxWidth:480,margin:'8px auto 0'}}>
              {c(`${GALLERY_IMGS.length + HERO_PHOTOS.length} фотографий`,`${GALLERY_IMGS.length + HERO_PHOTOS.length} photos`,`${GALLERY_IMGS.length + HERO_PHOTOS.length} fotot`)}
            </p>
          </div>

          {/* HERO SHOWCASE - 4 big photos with separate lightbox */}
          <div style={{marginBottom:48}}>
            <div style={{
              fontSize:10,fontWeight:700,letterSpacing:'.16em',textTransform:'uppercase',
              color:'rgba(255,255,255,.35)',marginBottom:14,
            }}>{c('Лучшие моменты','Best moments','Parimad hetked')}</div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:6}}>
              {HERO_PHOTOS.map((src, i) => (
                <div key={i} style={{aspectRatio:'3/4',borderRadius:10,overflow:'hidden',cursor:'zoom-in',position:'relative'}}
                  onClick={() => setGalleryLightbox({src,idx:i,pool:'hero'})}>
                  <img src={src} alt="" style={{width:'100%',height:'100%',objectFit:'cover',transition:'transform 300ms',display:'block'}}
                    onMouseEnter={e=>(e.currentTarget.style.transform='scale(1.06)')}
                    onMouseLeave={e=>(e.currentTarget.style.transform='scale(1)')} />
                  <div style={{position:'absolute',inset:0,background:'linear-gradient(to top,rgba(0,0,0,.2) 0%,transparent 50%)',pointerEvents:'none'}}/>
                  <div style={{position:'absolute',bottom:8,right:8,background:'rgba(0,0,0,.4)',color:'white',borderRadius:'50%',width:28,height:28,display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,opacity:0.7}}>⊕</div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTIONED GALLERY */}
          {GALLERY_SECTIONS.map((section, si) => (
            <div key={si} className="rv" style={{marginBottom:40}}>
              <div style={{
                display:'flex',alignItems:'center',gap:14,marginBottom:16,
              }}>
                <div style={{
                  fontSize:10,fontWeight:700,letterSpacing:'.16em',textTransform:'uppercase',
                  color:'rgba(255,255,255,.35)',
                }}>{section.label}</div>
                <div style={{flex:1,height:1,background:'rgba(255,255,255,.1)'}}/>
                <div style={{fontSize:11,color:'rgba(255,255,255,.25)'}}>{section.imgs.length}</div>
              </div>
              <div className="gg sg" style={{marginBottom:0}}>
                {section.imgs.map((src, i) => {
                  const globalIdx = GALLERY_SECTIONS.slice(0,si).reduce((a,s)=>a+s.imgs.length,0) + i
                  return (
                    <div key={i} className="gi" onClick={() => setGalleryLightbox({src,idx:globalIdx,pool:'gallery'})}>
                      <img src={src} alt="" loading="lazy" />
                      <div className="gi-overlay"><span className="gi-zoom">⊕</span></div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* REVIEWS */}
      <section className="reviews" id="reviews">
        <div className="wrap">
          <div className="revh rv">
            <div className="tag tag-muted">{c('Отзывы','Reviews','Arvustused')}</div>
            <h2 className="sec-h" style={{marginBottom:12}}>{c('Что говорят родители','What parents say','Mida vanemad ütlevad')}</h2>
            <p className="sec-sub" style={{margin:'0 auto'}}>{c('Настоящие отзывы родителей, чьи дети уже побывали в лагере.','Real reviews from parents whose children have attended camp.','Päris arvustused vanematelt, kelle lapsed on laagris käinud.')}</p>
          </div>
          <div className="rev-g sg" style={{minHeight: reviews.length === 0 ? '0' : undefined}}>
            {reviews.length === 0 ? null : reviews.map(r => (
              <div key={r.id} className="rc">
                <div className="rc-stars">{Array.from({length:r.rating}).map((_,i) => <span key={i} className="rc-star">★</span>)}</div>
                <p className="rc-text">"{r.text}"</p>
                <div className="rc-name">{r.name}</div>
                {r.program && <div className="rc-prog">{r.program}</div>}
              </div>
            ))}
          </div>
          <div style={{textAlign:'center'}}>
            {reviewSent ? (
              <div className="rev-form"><div className="rf-success">✓ {c('Спасибо! Отзыв отправлен на проверку.','Thank you! Your review is pending approval.','Aitäh! Arvustus ootab heakskiitu.')}</div></div>
            ) : (
              <div className="rev-form">
                <div className="rf-title">{c('Оставить отзыв','Leave a review','Jäta arvustus')}</div>
                <div className="rf-field">
                  <label className="rf-label">{c('Ваше имя','Your name','Teie nimi')} *</label>
                  <input className="rf-input" value={reviewForm.name} onChange={e => setReviewForm(f => ({...f,name:e.target.value}))} placeholder={c('Мария К.','Maria K.','Maria K.')}/>
                </div>
                <div className="rf-field">
                  <label className="rf-label">{c('Программа','Programme','Programm')}</label>
                  <input className="rf-input" value={reviewForm.program} onChange={e => setReviewForm(f => ({...f,program:e.target.value}))} placeholder={c('Серфинг + Кино','Surf + Cinema','Surf + Kino')}/>
                </div>
                <div className="rf-field">
                  <label className="rf-label">{c('Оценка','Rating','Hinnang')}</label>
                  <div className="rf-stars">
                    {[1,2,3,4,5].map(n => (
                      <span
                        key={n}
                        style={{fontSize:28,cursor:'pointer',color:n<=(reviewHover||reviewForm.rating)?'var(--sun)':'#CBD5E0',transition:'color 150ms,transform 150ms',display:'inline-block'}}
                        onClick={() => setReviewForm(f => ({...f,rating:n}))}
                        onMouseEnter={() => setReviewHover(n)}
                        onMouseLeave={() => setReviewHover(0)}
                      >★</span>
                    ))}
                  </div>
                </div>
                <div className="rf-field">
                  <label className="rf-label">{c('Ваш отзыв','Your review','Teie arvustus')} *</label>
                  <textarea className="rf-input" rows={4} value={reviewForm.text} onChange={e => setReviewForm(f => ({...f,text:e.target.value}))} placeholder={c('Расскажите о вашем опыте...','Tell us about your experience...','Rääkige oma kogemusest...')} style={{resize:'vertical'}}/>
                </div>
                <div style={{display:'flex',gap:10,justifyContent:'flex-end'}}>
                  <button className="btn btn-teal btn-sm" onClick={submitReview} disabled={reviewLoading}>
                    {reviewLoading ? c('Отправка...','Sending...','Saadan...') : c('Отправить отзыв','Submit review','Saada arvustus')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq" id="faq">
        <div className="wrap">
          <div className="faqh rv">
            <div className="tag tag-teal">FAQ</div>
            <h2 className="sec-h" style={{marginBottom:12}}>{c('Частые вопросы','Frequently asked','Korduma kippuvad')}</h2>
          </div>
          <div className="faq-list">
            {FAQS.map((f,i) => (
              <div key={i} className={`faq-it${openFaq===i?' open':''}`}>
                <button className="faq-q" onClick={() => setOpenFaq(openFaq===i ? null : i)}>
                  <span className="faq-qt">{f.q}</span>
                  <svg className="faq-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
                </button>
                <div className="faq-a"><div className="faq-ai">{f.a}</div></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LOCATION */}
      <section className="loc" id="location">
        <div className="wrap">
          <div className="loch rv">
            <div className="tag tag-muted">{c('Место проведения','Location','Asukoht')}</div>
            <h2 className="sec-h">{c('Пляж Штромка, Таллин','Stroomi Beach, Tallinn','Stroomi rand, Tallinn')}</h2>
          </div>
          <div className="loc-g">
            <div>
              <div className="loc-map">
                <iframe src="https://www.google.com/maps?q=Stroomi+rand+Tallinn&z=15&output=embed" width="100%" height="340" style={{border:0,display:'block'}} allowFullScreen loading="lazy"/>
              </div>
              <a href="https://www.google.com/maps/search/?api=1&query=Stroomi+rand+Tallinn" target="_blank" className="btn btn-outline" style={{marginTop:14,display:'inline-flex'}}>{c('Открыть в Google Maps','Open in Google Maps','Ava Google Mapsis')}</a>
            </div>
            <div className="loc-info sg">
              {[
                {icon:'📍', t:c('Адрес','Address','Aadress'), d:c('Stroomi rand - конец пляжа, ближе к Рокка-аль-Маре. Серфинг-станция Time to Surf.','Stroomi beach, end of the beach, near Rocca al Mare. Time to Surf surf station.','Stroomi rand, ranna lõpp, Rocca al Mare lähedal.')},
                {icon:'🚌', t:c('Как добраться','Getting there','Kuidas jõuda'), d:c('Автобусы №40, 48 до остановки Stroomi rand - около 20 минут от центра.','Buses 40, 48 to Stroomi rand stop - about 20 minutes from the city centre.','Bussid nr 40, 48 peatuseni Stroomi rand - ~20 min kesklinnast.')},
                {icon:'🚗', t:c('Парковка','Parking','Parkimine'), d:c('Бесплатная парковка у пляжа. В выходные может быть занята - приезжайте заранее.','Free parking at the beach. Can be busy on weekends - arrive early.','Tasuta parkimine ranna juures. Nädalavahetustel võib täis olla.')},
                {icon:'📞', t:c('Контакт','Contact','Kontakt'), d:'+372 55512872 (Андрей)\nTelegram: @Andrei_Time_to_Surf\ninfo@timetosurf.ee'},
              ].map((lc,i) => (
                <div key={i} className="loc-card">
                  <div className="loc-ic">{lc.icon}</div>
                  <div>
                    <div className="loc-t">{lc.t}</div>
                    <div className="loc-d" style={{whiteSpace:'pre-line'}}>{lc.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <div className="cta-glow"/>
        <div className="wrap">
          <div className="cta-in rv">
            <div className="tag tag-pale">{c('Лето 2026 · Таллин','Summer 2026 · Tallinn','Suvi 2026 · Tallinn')}</div>
            <h2 className="cta-h">
              {c('Места','Spots are','Kohti on')} <em>{c('ограничены.','limited.','piiratud.')}</em><br/>{c('Записывайтесь сейчас.','Register now.','Registreeruge kohe.')}
            </h2>
            <p className="cta-p">{c('Мы работаем в малых группах - 12-16 детей - чтобы каждый ребёнок получил внимание инструктора. Ближайшая смена: 15 июня 2026.','Small groups of 12-16 children - every child gets personal instructor attention. Next session: June 15, 2026.','Väikesed rühmad 12-16 last - iga laps saab instruktori tähelepanu. Järgmine vahetus: 15. juuni 2026.')}</p>
            <div className="cta-btns">
              <a href={REG} target="_blank" className="btn btn-sun" style={{padding:'16px 40px',fontSize:16}}>{c('Записать ребёнка','Register my child','Registreeri laps')}</a>
              <a href="tel:+37255512872" className="btn btn-ghost" style={{padding:'16px 28px',fontSize:15}}>+372 55512872</a>
            </div>
            <div className="cta-sub">Telegram: <a href="https://t.me/Andrei_Time_to_Surf" target="_blank">@Andrei_Time_to_Surf</a></div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="wrap">
          <div className="footer-g">
            <div>
              <div style={{display:'flex',alignItems:'center',gap:10}}>
                <img src="/logo.jpeg" alt="Time to Surf" style={{width:40,height:40,borderRadius:'50%',objectFit:'cover'}}/>
                <div>
                  <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:16,fontWeight:800,color:'white'}}>Time to Surf</div>
                  <div style={{fontSize:9,fontWeight:700,letterSpacing:'.14em',textTransform:'uppercase',color:'rgba(255,255,255,.28)'}}>{c('Детские лагеря · Эстония','Kids Camps · Estonia','Laste laagrid · Eesti')}</div>
                </div>
              </div>
              <p className="footer-desc">{c('Серфинг-школа и летние лагеря для детей в Таллине. Пляж Штромка. С 2017 года.','Surf school and summer camps for children in Tallinn. Stroomi Beach. Since 2017.','Surfamise kool ja suvelaagrid lastele Tallinnas. Stroomi rand. Alates 2017.')}</p>
            </div>
            <div>
              <div className="footer-ct">{c('Контакты','Contacts','Kontaktid')}</div>
              <div className="footer-ls">
                <a href="tel:+37255512872" className="footer-l">+372 55512872</a>
                <a href="mailto:info@timetosurf.ee" className="footer-l">info@timetosurf.ee</a>
                <a href="https://t.me/Andrei_Time_to_Surf" target="_blank" className="footer-l">Telegram</a>
              </div>
            </div>
            <div>
              <div className="footer-ct">{c('Ссылки','Links','Lingid')}</div>
              <div className="footer-ls">
                <a href="https://timetosurf.ee" target="_blank" className="footer-l">timetosurf.ee</a>
                <a href="https://www.instagram.com/timetosurf.ee" target="_blank" className="footer-l">Instagram</a>
                <a href="https://www.facebook.com/timetosurf.ee" target="_blank" className="footer-l">Facebook</a>
              </div>
            </div>
          </div>
          <div className="footer-bot">
            <span className="footer-copy">© 2026 Time to Surf</span>
            <div className="soc-ls">
              <a href="https://www.instagram.com/timetosurf.ee" target="_blank" className="soc-l">Instagram</a>
              <a href="https://www.facebook.com/timetosurf.ee" target="_blank" className="soc-l">Facebook</a>
              <a href="https://timetosurf.ee" target="_blank" className="soc-l">timetosurf.ee ↗</a>
            </div>
          </div>
          <div style={{borderTop:'1px solid rgba(255,255,255,.04)',paddingTop:12,marginTop:4,display:'flex',justifyContent:'center'}}>
            <a href="https://www.northpixel.ee/" target="_blank" rel="noopener noreferrer" style={{fontSize:11,color:'rgba(255,255,255,.18)',letterSpacing:'.06em',textDecoration:'none',transition:'color 200ms',display:'flex',alignItems:'center',gap:6}}
              onMouseEnter={e=>(e.currentTarget.style.color='rgba(255,255,255,.5)')}
              onMouseLeave={e=>(e.currentTarget.style.color='rgba(255,255,255,.18)')}>
              <span style={{fontSize:10,letterSpacing:'.14em',textTransform:'uppercase'}}>Web page by</span>
              <strong style={{letterSpacing:'.08em',fontWeight:700,textTransform:'uppercase',fontSize:11}}>NorthPixel</strong>
            </a>
          </div>
        </div>
      </footer>
    </>
  )
}