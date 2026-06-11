'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  Lang,
  SiteContent,
  defaultContent,
  languages,
  listToText,
  parseContent,
  publicPhotos,
  textToList,
} from '@/lib/siteContent'

type Review = {
  id: number
  name: string
  text: string
  program?: string
  rating: number
  approved: boolean
  created_at: string
}

type Session = {
  id: number
  dates: string
  type_ru: string
  type_en: string
  type_et: string
  color: string
  leaders: string
  hot: boolean
  detail: string
  sort_order: number
  spots_left?: number | null
  capacity?: number | null
}

type Photo = { id: number; url: string; section: string; sort_order: number }
type Settings = Record<string, string>

const ADMIN_PASSWORD = 'surf2026admin'

const input: React.CSSProperties = {
  width: '100%',
  border: '1px solid #d8e5ec',
  borderRadius: 8,
  padding: '11px 12px',
  outline: 0,
  fontSize: 14,
  boxSizing: 'border-box',
  background: 'white',
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [tab, setTab] = useState('content')

  useEffect(() => {
    if (sessionStorage.getItem('tts-admin') === ADMIN_PASSWORD) setAuthed(true)
  }, [])

  if (!authed) {
    return (
      <main style={loginWrap}>
        <section style={loginCard}>
          <img src="/logo.jpeg" alt="" style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', margin: '0 auto 16px' }} />
          <h1 style={{ margin: 0, color: '#07395d', fontSize: 24 }}>Time to Surf</h1>
          <p style={{ color: '#688092', margin: '6px 0 24px' }}>Админка сайта</p>
          <input
            type="password"
            value={password}
            onChange={event => setPassword(event.target.value)}
            onKeyDown={event => {
              if (event.key === 'Enter' && password === ADMIN_PASSWORD) {
                sessionStorage.setItem('tts-admin', ADMIN_PASSWORD)
                setAuthed(true)
              }
            }}
            placeholder="Пароль"
            style={{ ...input, marginBottom: 12 }}
          />
          <button style={{ ...button(), width: '100%' }} onClick={() => {
            if (password === ADMIN_PASSWORD) {
              sessionStorage.setItem('tts-admin', ADMIN_PASSWORD)
              setAuthed(true)
            }
          }}>
            Войти
          </button>
        </section>
      </main>
    )
  }

  return (
    <main style={{ minHeight: '100vh', background: '#f6f8f8', fontFamily: 'Manrope, system-ui, sans-serif' }}>
      <header style={adminTop}>
        <div>
          <strong style={{ color: 'white', fontSize: 18 }}>Time to Surf админка</strong>
          <p style={{ margin: '3px 0 0', color: 'rgba(255,255,255,.62)', fontSize: 12 }}>
            Полное управление сайтом: RU/EN/ET тексты отдельно, цифры и ссылки один раз
          </p>
        </div>
        <a href="/" style={{ color: 'white', fontWeight: 800 }}>На сайт</a>
      </header>
      <nav style={tabsWrap}>
        {[
          ['content', 'Все тексты'],
          ['numbers', 'Цифры и ссылки'],
          ['sessions', 'Смены'],
          ['gallery', 'Фото'],
          ['reviews', 'Отзывы'],
          ['seo', 'SEO'],
        ].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} style={tabStyle(tab === id)}>
            {label}
          </button>
        ))}
      </nav>
      <section style={{ width: 'min(1180px, calc(100% - 32px))', margin: '0 auto', padding: '28px 0 56px' }}>
        {tab === 'content' && <ContentTab />}
        {tab === 'numbers' && <NumbersTab />}
        {tab === 'sessions' && <SessionsTab />}
        {tab === 'gallery' && <GalleryTab />}
        {tab === 'reviews' && <ReviewsTab />}
        {tab === 'seo' && <SeoTab />}
      </section>
    </main>
  )
}

function ContentTab() {
  const { settings, saveSettings, msg, saving } = useSettings()
  const [lang, setLang] = useState<Lang>('ru')
  const [content, setContent] = useState<SiteContent>(defaultContent)
  const [rawOpen, setRawOpen] = useState(false)
  const [raw, setRaw] = useState('')

  useEffect(() => {
    const parsed = parseContent(settings.content_json)
    setContent(parsed)
    setRaw(JSON.stringify(parsed, null, 2))
  }, [settings.content_json])

  const patch = (mutate: (draft: SiteContent) => void) => {
    setContent(prev => {
      const next = JSON.parse(JSON.stringify(prev)) as SiteContent
      mutate(next)
      setRaw(JSON.stringify(next, null, 2))
      return next
    })
  }

  const save = async () => {
    await saveSettings({ content_json: JSON.stringify(content) })
  }

  const applyRaw = () => {
    try {
      const next = parseContent(raw)
      setContent(next)
      setRaw(JSON.stringify(next, null, 2))
    } catch {
      alert('JSON не читается')
    }
  }

  return (
    <Panel title="Все тексты сайта" subtitle="Выбираешь язык и меняешь каждую видимую фразу. Цены, возраст, даты, телефон и места меняются отдельно во вкладке “Цифры и ссылки”.">
      {msg && <Notice text={msg} />}
      <LangTabs lang={lang} setLang={setLang} />

      <EditorSection title="Навигация">
        <Grid columns={4}>
          {Object.entries(content.nav).map(([key, value]) => (
            <Field key={key} label={key}>
              <input style={input} value={value[lang]} onChange={e => patch(c => { c.nav[key][lang] = e.target.value })} />
            </Field>
          ))}
        </Grid>
      </EditorSection>

      <EditorSection title="Hero">
        <Grid>
          <TextField label="eyebrow" value={content.hero.eyebrow[lang]} onChange={value => patch(c => { c.hero.eyebrow[lang] = value })} />
          <TextField label="title" value={content.hero.title[lang]} onChange={value => patch(c => { c.hero.title[lang] = value })} />
          <AreaField label="text" value={content.hero.text[lang]} onChange={value => patch(c => { c.hero.text[lang] = value })} />
          <TextField label="primary button" value={content.hero.primary[lang]} onChange={value => patch(c => { c.hero.primary[lang] = value })} />
          <TextField label="secondary button" value={content.hero.secondary[lang]} onChange={value => patch(c => { c.hero.secondary[lang] = value })} />
          <ListField label="facts, по строке" value={content.hero.facts[lang]} onChange={value => patch(c => { c.hero.facts[lang] = value })} />
        </Grid>
      </EditorSection>

      <EditorSection title="Time to Surf — не просто лагерь">
        <Grid>
          <TextField label="eyebrow" value={content.about.eyebrow[lang]} onChange={value => patch(c => { c.about.eyebrow[lang] = value })} />
          <TextField label="title" value={content.about.title[lang]} onChange={value => patch(c => { c.about.title[lang] = value })} />
          <AreaField label="text" value={content.about.text[lang]} onChange={value => patch(c => { c.about.text[lang] = value })} />
          <ListField label="points, по строке" value={content.about.points[lang]} onChange={value => patch(c => { c.about.points[lang] = value })} />
        </Grid>
      </EditorSection>

      <EditorSection title="Безопасность / доверие">
        <Grid>
          <TextField label="eyebrow" value={content.safety.eyebrow[lang]} onChange={value => patch(c => { c.safety.eyebrow[lang] = value })} />
          <TextField label="title" value={content.safety.title[lang]} onChange={value => patch(c => { c.safety.title[lang] = value })} />
          <ListField label="cards, по строке" value={content.safety.points[lang]} onChange={value => patch(c => { c.safety.points[lang] = value })} />
        </Grid>
      </EditorSection>

      <EditorSection title="Наши программы / 3 программы">
        <Grid>
          <TextField label="section eyebrow" value={content.programs.eyebrow[lang]} onChange={value => patch(c => { c.programs.eyebrow[lang] = value })} />
          <TextField label="section title" value={content.programs.title[lang]} onChange={value => patch(c => { c.programs.title[lang] = value })} />
        </Grid>
        {content.programs.items.map((program, index) => (
          <div key={program.key} style={subCard}>
            <strong style={smallTitle}>Программа {index + 1}</strong>
            <Grid>
              <TextField label="photo" value={program.photo} onChange={value => patch(c => { c.programs.items[index].photo = value })} />
              <TextField label="kicker" value={program.kicker[lang]} onChange={value => patch(c => { c.programs.items[index].kicker[lang] = value })} />
              <TextField label="title" value={program.title[lang]} onChange={value => patch(c => { c.programs.items[index].title[lang] = value })} />
              <AreaField label="text" value={program.text[lang]} onChange={value => patch(c => { c.programs.items[index].text[lang] = value })} />
              <ListField label="bullets" value={program.bullets[lang]} onChange={value => patch(c => { c.programs.items[index].bullets[lang] = value })} />
            </Grid>
          </div>
        ))}
      </EditorSection>

      <EditorSection title="Программа дня">
        <Grid>
          <TextField label="eyebrow" value={content.day.eyebrow[lang]} onChange={value => patch(c => { c.day.eyebrow[lang] = value })} />
          <TextField label="title" value={content.day.title[lang]} onChange={value => patch(c => { c.day.title[lang] = value })} />
          <AreaField label="text" value={content.day.text[lang]} onChange={value => patch(c => { c.day.text[lang] = value })} />
        </Grid>
        {content.day.items.map((item, index) => (
          <div key={`${item.time}-${index}`} style={subCard}>
            <Grid columns={3}>
              <TextField label="time" value={item.time} onChange={value => patch(c => { c.day.items[index].time = value })} />
              <TextField label="title" value={item.title[lang]} onChange={value => patch(c => { c.day.items[index].title[lang] = value })} />
              <AreaField label="text" value={item.text[lang]} onChange={value => patch(c => { c.day.items[index].text[lang] = value })} />
            </Grid>
          </div>
        ))}
      </EditorSection>

      <EditorSection title="Смены, цены, галерея, отзывы">
        <Grid>
          <TextField label="sessions eyebrow" value={content.sessions.eyebrow[lang]} onChange={value => patch(c => { c.sessions.eyebrow[lang] = value })} />
          <TextField label="sessions title" value={content.sessions.title[lang]} onChange={value => patch(c => { c.sessions.title[lang] = value })} />
          <TextField label="spots available" value={content.sessions.spotsAvailable[lang]} onChange={value => patch(c => { c.sessions.spotsAvailable[lang] = value })} />
          <TextField label="low spots" value={content.sessions.lowSpots[lang]} onChange={value => patch(c => { c.sessions.lowSpots[lang] = value })} />
          <TextField label="spots word" value={content.sessions.spotsWord[lang]} onChange={value => patch(c => { c.sessions.spotsWord[lang] = value })} />
          <TextField label="prices eyebrow" value={content.prices.eyebrow[lang]} onChange={value => patch(c => { c.prices.eyebrow[lang] = value })} />
          <TextField label="prices title" value={content.prices.title[lang]} onChange={value => patch(c => { c.prices.title[lang] = value })} />
          <AreaField label="prices included" value={content.prices.included[lang]} onChange={value => patch(c => { c.prices.included[lang] = value })} />
          <TextField label="gallery eyebrow" value={content.gallery.eyebrow[lang]} onChange={value => patch(c => { c.gallery.eyebrow[lang] = value })} />
          <TextField label="gallery title" value={content.gallery.title[lang]} onChange={value => patch(c => { c.gallery.title[lang] = value })} />
          <AreaField label="gallery text" value={content.gallery.text[lang]} onChange={value => patch(c => { c.gallery.text[lang] = value })} />
          <TextField label="gallery button" value={content.gallery.button[lang]} onChange={value => patch(c => { c.gallery.button[lang] = value })} />
          <TextField label="reviews eyebrow" value={content.reviews.eyebrow[lang]} onChange={value => patch(c => { c.reviews.eyebrow[lang] = value })} />
          <TextField label="reviews title" value={content.reviews.title[lang]} onChange={value => patch(c => { c.reviews.title[lang] = value })} />
          <TextField label="review form title" value={content.reviews.formTitle[lang]} onChange={value => patch(c => { c.reviews.formTitle[lang] = value })} />
          <TextField label="review submit" value={content.reviews.submit[lang]} onChange={value => patch(c => { c.reviews.submit[lang] = value })} />
        </Grid>
        {content.prices.cards.map((card, index) => (
          <div key={card.priceKey} style={subCard}>
            <strong style={smallTitle}>{card.priceKey}</strong>
            <Grid>
              <TextField label="label" value={card.label[lang]} onChange={value => patch(c => { c.prices.cards[index].label[lang] = value })} />
              <AreaField label="text" value={card.text[lang]} onChange={value => patch(c => { c.prices.cards[index].text[lang] = value })} />
            </Grid>
          </div>
        ))}
      </EditorSection>

      <EditorSection title="FAQ">
        <Grid>
          <TextField label="eyebrow" value={content.faq.eyebrow[lang]} onChange={value => patch(c => { c.faq.eyebrow[lang] = value })} />
          <TextField label="title" value={content.faq.title[lang]} onChange={value => patch(c => { c.faq.title[lang] = value })} />
        </Grid>
        <button style={{ ...button('#14a7a3'), marginBottom: 12 }} onClick={() => patch(c => {
          c.faq.items.push({ q: { ru: '', en: '', et: '' }, a: { ru: '', en: '', et: '' } })
        })}>
          Добавить вопрос
        </button>
        {content.faq.items.map((item, index) => (
          <div key={index} style={subCard}>
            <Grid>
              <TextField label="question" value={item.q[lang]} onChange={value => patch(c => { c.faq.items[index].q[lang] = value })} />
              <AreaField label="answer" value={item.a[lang]} onChange={value => patch(c => { c.faq.items[index].a[lang] = value })} />
            </Grid>
            <button style={button('#fee2e2', '#b91c1c')} onClick={() => patch(c => { c.faq.items.splice(index, 1) })}>Удалить вопрос</button>
          </div>
        ))}
      </EditorSection>

      <EditorSection title="Место проведения, CTA, футер">
        <Grid>
          <TextField label="location eyebrow" value={content.location.eyebrow[lang]} onChange={value => patch(c => { c.location.eyebrow[lang] = value })} />
          <TextField label="location title" value={content.location.title[lang]} onChange={value => patch(c => { c.location.title[lang] = value })} />
          <AreaField label="location text" value={content.location.text[lang]} onChange={value => patch(c => { c.location.text[lang] = value })} />
          <TextField label="location button" value={content.location.button[lang]} onChange={value => patch(c => { c.location.button[lang] = value })} />
          <TextField label="cta eyebrow" value={content.cta.eyebrow[lang]} onChange={value => patch(c => { c.cta.eyebrow[lang] = value })} />
          <TextField label="cta title" value={content.cta.title[lang]} onChange={value => patch(c => { c.cta.title[lang] = value })} />
          <AreaField label="cta text" value={content.cta.text[lang]} onChange={value => patch(c => { c.cta.text[lang] = value })} />
          <TextField label="cta primary" value={content.cta.primary[lang]} onChange={value => patch(c => { c.cta.primary[lang] = value })} />
          <TextField label="cta secondary" value={content.cta.secondary[lang]} onChange={value => patch(c => { c.cta.secondary[lang] = value })} />
          <AreaField label="footer text" value={content.footer.text[lang]} onChange={value => patch(c => { c.footer.text[lang] = value })} />
          <TextField label="footer contacts" value={content.footer.contacts[lang]} onChange={value => patch(c => { c.footer.contacts[lang] = value })} />
          <TextField label="footer links" value={content.footer.links[lang]} onChange={value => patch(c => { c.footer.links[lang] = value })} />
          <TextField label="NorthPixel credit" value={content.footer.credit[lang]} onChange={value => patch(c => { c.footer.credit[lang] = value })} />
        </Grid>
      </EditorSection>

      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 18, position: 'sticky', bottom: 16, zIndex: 2 }}>
        <button style={button()} onClick={save} disabled={saving}>Сохранить весь контент</button>
        <button style={button('#eef4f7', '#07395d')} onClick={() => setRawOpen(!rawOpen)}>JSON для разработчика</button>
      </div>

      {rawOpen && (
        <div style={{ marginTop: 18 }}>
          <textarea style={{ ...input, minHeight: 380, fontFamily: 'Consolas, monospace' }} value={raw} onChange={e => setRaw(e.target.value)} />
          <button style={{ ...button('#14a7a3'), marginTop: 10 }} onClick={applyRaw}>Применить JSON в форму</button>
        </div>
      )}
    </Panel>
  )
}

function NumbersTab() {
  const { settings, setSettings, saveSettings, msg, saving } = useSettings()
  const save = () => saveSettings({
    price_3day: settings.price_3day || '190€',
    price_4day: settings.price_4day || '235€',
    price_5day: settings.price_5day || '265€',
    group_size: settings.group_size || '12-16',
    age_range: settings.age_range || '7-14',
    day_hours: settings.day_hours || '09:30-16:30',
    phone: settings.phone || '+372 55512872',
    email: settings.email || 'info@timetosurf.ee',
    cta_link: settings.cta_link || '',
    telegram_link: settings.telegram_link || 'https://t.me/Andrei_Time_to_Surf',
    instagram_link: settings.instagram_link || 'https://www.instagram.com/timetosurf.ee',
    facebook_link: settings.facebook_link || 'https://www.facebook.com/timetosurf.ee',
    site_link: settings.site_link || 'https://timetosurf.ee',
  })

  return (
    <Panel title="Цифры, цены и ссылки" subtitle="Эти значения общие для всех языков. Меняешь один раз — на сайте в RU/EN/ET цифры не расходятся.">
      {msg && <Notice text={msg} />}
      <Grid columns={3}>
        {[
          ['price_3day', 'Цена 3 дня'],
          ['price_4day', 'Цена 4 дня'],
          ['price_5day', 'Цена 5 дней'],
          ['group_size', 'Размер группы'],
          ['age_range', 'Возраст'],
          ['day_hours', 'Время дня'],
          ['phone', 'Телефон'],
          ['email', 'Email'],
          ['cta_link', 'Ссылка записи'],
          ['telegram_link', 'Telegram'],
          ['instagram_link', 'Instagram'],
          ['facebook_link', 'Facebook'],
          ['site_link', 'Основной сайт'],
        ].map(([key, label]) => (
          <Field key={key} label={label}>
            <input style={input} value={settings[key] || ''} onChange={e => setSettings({ ...settings, [key]: e.target.value })} />
          </Field>
        ))}
      </Grid>
      <button style={button()} onClick={save} disabled={saving}>Сохранить цифры и ссылки</button>
    </Panel>
  )
}

function SeoTab() {
  const { settings, setSettings, saveSettings, msg, saving } = useSettings()
  return (
    <Panel title="SEO title/description" subtitle="Для Vercel/Google: основной title и description. Контент на странице всё равно меняется в трёх языках.">
      {msg && <Notice text={msg} />}
      <Grid>
        <Field label="SEO title">
          <input style={input} value={settings.seo_title || ''} onChange={e => setSettings({ ...settings, seo_title: e.target.value })} />
        </Field>
        <Field label="SEO description">
          <textarea style={input} rows={5} value={settings.seo_description || ''} onChange={e => setSettings({ ...settings, seo_description: e.target.value })} />
        </Field>
      </Grid>
      <button style={button()} onClick={() => saveSettings({ seo_title: settings.seo_title || '', seo_description: settings.seo_description || '' })} disabled={saving}>
        Сохранить SEO
      </button>
    </Panel>
  )
}

function SessionsTab() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Partial<Session> | null>(null)
  const [msg, setMsg] = useState('')

  const blank: Partial<Session> = {
    dates: '',
    type_ru: '',
    type_en: '',
    type_et: '',
    color: '#0e7490',
    leaders: '',
    hot: false,
    detail: 'surf',
    spots_left: 16,
    capacity: 16,
  }

  const load = async () => {
    setLoading(true)
    try {
      const data = await fetch('/api/sessions').then(r => r.json())
      if (Array.isArray(data)) setSessions(data)
    } catch {}
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const save = async () => {
    if (!editing?.dates || !editing?.type_ru) return
    const method = editing.id ? 'PATCH' : 'POST'
    await fetch('/api/sessions', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...editing,
        type_en: editing.type_en || editing.type_ru,
        type_et: editing.type_et || editing.type_ru,
        sort_order: editing.sort_order ?? sessions.length + 1,
      }),
    })
    setEditing(null)
    setMsg('Смена сохранена')
    load()
    setTimeout(() => setMsg(''), 2500)
  }

  const remove = async (id: number) => {
    if (!confirm('Удалить смену?')) return
    await fetch('/api/sessions', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    load()
  }

  return (
    <Panel title="Смены" subtitle="Даты и места задаются один раз. Название программы редактируется отдельно на RU/EN/ET.">
      {msg && <Notice text={msg} />}
      <button style={{ ...button('#14a7a3'), marginBottom: 16 }} onClick={() => setEditing(blank)}>Добавить смену</button>
      {editing && (
        <section style={{ ...card, marginBottom: 18, borderColor: '#14a7a3' }}>
          <Grid columns={3}>
            <TextField label="Даты" value={editing.dates || ''} onChange={value => setEditing({ ...editing, dates: value })} />
            <TextField label="Название RU" value={editing.type_ru || ''} onChange={value => setEditing({ ...editing, type_ru: value })} />
            <TextField label="Название EN" value={editing.type_en || ''} onChange={value => setEditing({ ...editing, type_en: value })} />
            <TextField label="Название ET" value={editing.type_et || ''} onChange={value => setEditing({ ...editing, type_et: value })} />
            <TextField label="Руководители" value={editing.leaders || ''} onChange={value => setEditing({ ...editing, leaders: value })} />
            <NumberField label="Мест осталось" value={editing.spots_left ?? ''} onChange={value => setEditing({ ...editing, spots_left: value })} />
            <NumberField label="Всего мест" value={editing.capacity ?? ''} onChange={value => setEditing({ ...editing, capacity: value })} />
            <Field label="Тип">
              <select style={input} value={editing.detail || 'surf'} onChange={e => setEditing({ ...editing, detail: e.target.value })}>
                <option value="surf">Серфинг лагерь</option>
                <option value="kino">Серфинг + кино</option>
                <option value="hike">Серфинг + поход</option>
                <option value="pohod">Серфинг + поход</option>
              </select>
            </Field>
            <Field label="Цвет">
              <input type="color" style={{ ...input, height: 43 }} value={editing.color || '#0e7490'} onChange={e => setEditing({ ...editing, color: e.target.value })} />
            </Field>
          </Grid>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '8px 0 14px', fontWeight: 800, color: '#496273' }}>
            <input type="checkbox" checked={Boolean(editing.hot)} onChange={e => setEditing({ ...editing, hot: e.target.checked })} />
            Выделить как “мало мест”
          </label>
          <button style={button()} onClick={save}>Сохранить</button>
          <button style={{ ...button('#eef4f7', '#173349'), marginLeft: 8 }} onClick={() => setEditing(null)}>Отмена</button>
        </section>
      )}
      {loading ? <p>Загрузка...</p> : sessions.map(session => (
        <article key={session.id} style={{ ...card, display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, marginBottom: 10 }}>
          <div>
            <strong style={{ color: '#07395d' }}>{session.dates}</strong>
            <p style={{ margin: '4px 0 0', color: '#62798b' }}>
              {session.type_ru} / {session.type_en} / {session.type_et} · {session.leaders} · {session.spots_left ?? '-'} из {session.capacity ?? '-'}
            </p>
          </div>
          <div>
            <button style={button('#eef4f7', '#07395d')} onClick={() => setEditing(session)}>Изменить</button>
            <button style={{ ...button('#fee2e2', '#b91c1c'), marginLeft: 8 }} onClick={() => remove(session.id)}>Удалить</button>
          </div>
        </article>
      ))}
    </Panel>
  )
}

function GalleryTab() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [url, setUrl] = useState('')
  const [section, setSection] = useState('moments')
  const [sortOrder, setSortOrder] = useState('0')
  const [msg, setMsg] = useState('')

  const load = async () => {
    try {
      const data = await fetch('/api/gallery').then(r => r.json())
      if (Array.isArray(data)) setPhotos(data)
    } catch {}
  }

  useEffect(() => {
    load()
  }, [])

  const add = async (photoUrl = url, order = sortOrder) => {
    if (!photoUrl.trim()) return
    await fetch('/api/gallery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: photoUrl.trim(), section, sort_order: Number(order) || 0 }),
    })
    setUrl('')
    load()
  }

  const seed = async () => {
    let order = photos.length + 1
    for (const photo of publicPhotos) {
      await add(photo, String(order))
      order += 1
    }
    setMsg('Фото из public добавлены')
    setTimeout(() => setMsg(''), 2500)
  }

  const remove = async (id: number) => {
    await fetch('/api/gallery', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    load()
  }

  return (
    <Panel title="Фото / Галерея" subtitle="Старые фото удалены из проекта. Здесь можно добавить все новые фото из public или управлять каждым URL вручную.">
      {msg && <Notice text={msg} />}
      <Grid columns={4}>
        <TextField label="Путь или URL" value={url} onChange={setUrl} />
        <Field label="Раздел">
          <select style={input} value={section} onChange={e => setSection(e.target.value)}>
            <option value="moments">Моменты</option>
            <option value="water">Вода</option>
            <option value="team">Команда</option>
            <option value="hero">Hero</option>
          </select>
        </Field>
        <TextField label="Порядок" value={sortOrder} onChange={setSortOrder} />
        <Field label="Действие">
          <button style={{ ...button(), width: '100%' }} onClick={() => add()}>Добавить</button>
        </Field>
      </Grid>
      <button style={{ ...button('#14a7a3'), margin: '4px 0 18px' }} onClick={seed}>Добавить все фото из public</button>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10 }}>
        {photos.map(photo => (
          <article key={photo.id} style={{ position: 'relative', overflow: 'hidden', borderRadius: 8, background: 'white', border: '1px solid #e1ebf0' }}>
            <img src={photo.url} alt="" style={{ width: '100%', height: 92, objectFit: 'cover' }} />
            <button style={{ position: 'absolute', top: 6, right: 6, ...button('rgba(185,28,28,.9)') }} onClick={() => remove(photo.id)}>x</button>
            <p style={{ margin: 0, padding: 7, fontSize: 11, color: '#62798b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{photo.url}</p>
          </article>
        ))}
      </div>
    </Panel>
  )
}

function ReviewsTab() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [filter, setFilter] = useState('pending')
  const [editing, setEditing] = useState<Review | null>(null)

  const load = async () => {
    try {
      const data = await fetch('/api/reviews/admin').then(r => r.json())
      if (Array.isArray(data)) setReviews(data)
    } catch {}
  }

  useEffect(() => {
    load()
  }, [])

  const save = async () => {
    if (!editing) return
    await fetch('/api/reviews/admin', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editing) })
    setEditing(null)
    load()
  }

  const remove = async (id: number) => {
    await fetch('/api/reviews/admin', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    load()
  }

  const approve = async (id: number) => {
    await fetch('/api/reviews/admin', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, approved: true }) })
    load()
  }

  const visible = useMemo(
    () => reviews.filter(review => (filter === 'all' ? true : filter === 'approved' ? review.approved : !review.approved)),
    [reviews, filter],
  )

  return (
    <Panel title="Отзывы" subtitle="Можно публиковать, удалять и редактировать текст, имя, программу и рейтинг.">
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {['pending', 'approved', 'all'].map(item => (
          <button key={item} style={button(filter === item ? '#07395d' : '#eef4f7', filter === item ? 'white' : '#07395d')} onClick={() => setFilter(item)}>
            {item === 'pending' ? 'На проверке' : item === 'approved' ? 'Опубликованные' : 'Все'}
          </button>
        ))}
      </div>
      {editing && (
        <section style={{ ...card, marginBottom: 16, borderColor: '#14a7a3' }}>
          <Grid>
            <TextField label="Имя" value={editing.name} onChange={value => setEditing({ ...editing, name: value })} />
            <TextField label="Программа" value={editing.program || ''} onChange={value => setEditing({ ...editing, program: value })} />
            <NumberField label="Рейтинг" value={editing.rating} onChange={value => setEditing({ ...editing, rating: Number(value) || 5 })} />
            <AreaField label="Текст" value={editing.text} onChange={value => setEditing({ ...editing, text: value })} />
          </Grid>
          <label style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12, fontWeight: 800 }}>
            <input type="checkbox" checked={editing.approved} onChange={e => setEditing({ ...editing, approved: e.target.checked })} />
            Опубликован
          </label>
          <button style={button()} onClick={save}>Сохранить отзыв</button>
          <button style={{ ...button('#eef4f7', '#07395d'), marginLeft: 8 }} onClick={() => setEditing(null)}>Отмена</button>
        </section>
      )}
      {visible.map(review => (
        <article key={review.id} style={{ ...card, marginBottom: 10 }}>
          <strong style={{ color: '#07395d' }}>{review.name}</strong>
          <p style={{ color: '#62798b' }}>{review.text}</p>
          <button style={button('#eef4f7', '#07395d')} onClick={() => setEditing(review)}>Изменить</button>
          {!review.approved && <button style={{ ...button('#14a7a3'), marginLeft: 8 }} onClick={() => approve(review.id)}>Опубликовать</button>}
          <button style={{ ...button('#fee2e2', '#b91c1c'), marginLeft: 8 }} onClick={() => remove(review.id)}>Удалить</button>
        </article>
      ))}
    </Panel>
  )
}

function useSettings() {
  const [settings, setSettings] = useState<Settings>({})
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(d => d && typeof d === 'object' && setSettings(d))
      .catch(() => {})
  }, [])

  const saveSettings = async (payload: Settings) => {
    setSaving(true)
    await fetch('/api/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ settings: payload }),
    })
    setSettings(prev => ({ ...prev, ...payload }))
    setSaving(false)
    setMsg('Сохранено')
    setTimeout(() => setMsg(''), 2500)
  }

  return { settings, setSettings, saveSettings, saving, msg }
}

function LangTabs({ lang, setLang }: { lang: Lang; setLang: (lang: Lang) => void }) {
  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
      {languages.map(item => (
        <button key={item.code} style={button(lang === item.code ? '#07395d' : '#eef4f7', lang === item.code ? 'white' : '#07395d')} onClick={() => setLang(item.code)}>
          {item.label}
        </button>
      ))}
    </div>
  )
}

function Panel({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <section>
      <div style={{ marginBottom: 18 }}>
        <h1 style={{ margin: 0, color: '#07395d', fontSize: 28 }}>{title}</h1>
        <p style={{ margin: '5px 0 0', color: '#62798b' }}>{subtitle}</p>
      </div>
      <div style={card}>{children}</div>
    </section>
  )
}

function EditorSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details open style={{ borderTop: '1px solid #e1ebf0', padding: '16px 0' }}>
      <summary style={{ color: '#07395d', fontSize: 17, fontWeight: 900, cursor: 'pointer', marginBottom: 14 }}>{title}</summary>
      {children}
    </details>
  )
}

function Grid({ children, columns = 2 }: { children: React.ReactNode; columns?: number }) {
  return <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, gap: 14, marginBottom: 16 }}>{children}</div>
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label>
      <span style={{ display: 'block', marginBottom: 5, color: '#496273', fontSize: 12, fontWeight: 900 }}>{label}</span>
      {children}
    </label>
  )
}

function TextField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <Field label={label}><input style={input} value={value} onChange={e => onChange(e.target.value)} /></Field>
}

function AreaField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <Field label={label}><textarea style={input} rows={4} value={value} onChange={e => onChange(e.target.value)} /></Field>
}

function ListField({ label, value, onChange }: { label: string; value: string[]; onChange: (value: string[]) => void }) {
  return <Field label={label}><textarea style={input} rows={5} value={listToText(value)} onChange={e => onChange(textToList(e.target.value))} /></Field>
}

function NumberField({ label, value, onChange }: { label: string; value: number | string; onChange: (value: number | null) => void }) {
  return (
    <Field label={label}>
      <input
        style={input}
        type="number"
        value={value}
        onChange={e => onChange(e.target.value === '' ? null : Number(e.target.value))}
      />
    </Field>
  )
}

function Notice({ text }: { text: string }) {
  return <div style={{ marginBottom: 14, padding: 12, borderRadius: 8, background: '#e8fbf6', color: '#08756d', fontWeight: 800 }}>{text}</div>
}

function button(bg = '#07395d', color = 'white'): React.CSSProperties {
  return {
    border: 0,
    borderRadius: 8,
    background: bg,
    color,
    padding: '10px 14px',
    fontWeight: 900,
    cursor: 'pointer',
  }
}

const card: React.CSSProperties = {
  background: 'white',
  border: '1px solid #e1ebf0',
  borderRadius: 8,
  padding: 18,
  boxShadow: '0 12px 36px rgba(7,57,93,.06)',
}

const subCard: React.CSSProperties = {
  border: '1px solid #e1ebf0',
  borderRadius: 8,
  padding: 14,
  marginBottom: 12,
  background: '#fbfdfd',
}

const smallTitle: React.CSSProperties = {
  display: 'block',
  marginBottom: 10,
  color: '#07395d',
  fontSize: 13,
}

const loginWrap: React.CSSProperties = {
  minHeight: '100vh',
  display: 'grid',
  placeItems: 'center',
  background: 'linear-gradient(135deg, #07395d, #14a7a3)',
  fontFamily: 'Manrope, system-ui, sans-serif',
}

const loginCard: React.CSSProperties = {
  width: 360,
  maxWidth: 'calc(100% - 32px)',
  borderRadius: 12,
  background: 'white',
  padding: 34,
  textAlign: 'center',
  boxShadow: '0 24px 70px rgba(0,0,0,.22)',
}

const adminTop: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '18px 28px',
  background: '#07395d',
}

const tabsWrap: React.CSSProperties = {
  display: 'flex',
  gap: 6,
  overflowX: 'auto',
  padding: '12px 28px',
  background: '#07395d',
  borderTop: '1px solid rgba(255,255,255,.14)',
}

function tabStyle(active: boolean): React.CSSProperties {
  return {
    border: 0,
    borderRadius: 8,
    padding: '10px 14px',
    whiteSpace: 'nowrap',
    background: active ? 'white' : 'rgba(255,255,255,.1)',
    color: active ? '#07395d' : 'white',
    fontWeight: 900,
    cursor: 'pointer',
  }
}
