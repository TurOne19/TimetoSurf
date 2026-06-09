'use client'
import { useState, useEffect } from 'react'

interface Review {
  id: number; name: string; text: string; program?: string
  rating: number; approved: boolean; created_at: string
}
interface Session {
  id: number; dates: string; type_ru: string; type_en: string; type_et: string
  color: string; leaders: string; hot: boolean; detail: string; sort_order: number
}
interface GalleryPhoto {
  id: number; url: string; section: string; sort_order: number
}
interface Settings {
  spots_taken?: string; spots_total?: string; next_session_date?: string; next_session_date_full?: string; group_size?: string
  price_3day?: string; price_4day?: string; price_5day?: string; schedule_year_label?: string
}

const ADMIN_PASSWORD = 'surf2026admin'

const COLOR_OPTIONS = [
  { label: 'Синий (Серфинг)', value: '#1A6BAA' },
  { label: 'Фиолетовый (Кино)', value: '#7C3AED' },
  { label: 'Зелёный (Поход)', value: '#16A34A' },
  { label: 'Бирюзовый', value: '#0AACAC' },
  { label: 'Оранжевый', value: '#F5A623' },
]

const SECTION_OPTIONS = [
  { value: 'hero', label: 'Главные фото (верх страницы)' },
  { value: 'water', label: 'На воде' },
  { value: 'team', label: 'Команда и атмосфера' },
  { value: 'moments', label: 'Моменты' },
]

const S = {
  btn: (bg = '#0B3D6B', color = 'white') => ({
    padding: '9px 18px', background: bg, color, border: 'none',
    borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13,
    transition: 'opacity .15s'
  } as React.CSSProperties),
  input: {
    width: '100%', padding: '10px 14px', border: '1.5px solid #D4E6F1',
    borderRadius: 8, fontSize: 14, fontFamily: 'inherit', outline: 'none',
    boxSizing: 'border-box'
  } as React.CSSProperties,
  card: {
    background: 'white', borderRadius: 12, padding: 20,
    boxShadow: '0 2px 8px rgba(0,0,0,.06)', marginBottom: 12
  } as React.CSSProperties,
  label: { fontSize: 12, fontWeight: 700, color: '#344E63', marginBottom: 4, display: 'block' } as React.CSSProperties,
  tab: (active: boolean) => ({
    padding: '10px 18px', borderRadius: 8, border: 'none', cursor: 'pointer',
    fontWeight: 600, fontSize: 13,
    background: active ? 'white' : 'transparent',
    color: active ? '#0B3D6B' : 'rgba(255,255,255,.7)',
    transition: 'all .15s'
  } as React.CSSProperties),
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [pwInput, setPwInput] = useState('')
  const [pwError, setPwError] = useState(false)
  const [tab, setTab] = useState<'reviews'|'sessions'|'gallery'|'pricing'|'settings'>('reviews')

  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('tts-admin') === ADMIN_PASSWORD) setAuthed(true)
  }, [])

  const login = () => {
    if (pwInput === ADMIN_PASSWORD) { sessionStorage.setItem('tts-admin', ADMIN_PASSWORD); setAuthed(true) }
    else { setPwError(true); setTimeout(() => setPwError(false), 2000) }
  }
  const logout = () => { sessionStorage.removeItem('tts-admin'); setAuthed(false) }

  if (!authed) return (
    <div style={{minHeight:'100vh',background:'#0B3D6B',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'system-ui,sans-serif'}}>
      <div style={{background:'white',borderRadius:16,padding:'48px 40px',width:360,textAlign:'center',boxShadow:'0 20px 60px rgba(0,0,0,.3)'}}>
        <div style={{fontSize:48,marginBottom:8}}>🏄</div>
        <h1 style={{fontSize:22,fontWeight:800,color:'#0B3D6B',marginBottom:4}}>Time to Surf</h1>
        <p style={{fontSize:13,color:'#888',marginBottom:32}}>Панель администратора</p>
        <div style={{textAlign:'left',marginBottom:16}}>
          <label style={S.label}>Пароль</label>
          <input type="password" value={pwInput} onChange={e=>setPwInput(e.target.value)}
            onKeyDown={e=>e.key==='Enter'&&login()} placeholder="Введите пароль..."
            autoFocus
            style={{...S.input,border:`1.5px solid ${pwError?'#ef4444':'#D4E6F1'}`,fontSize:16}}/>
          {pwError&&<div style={{color:'#ef4444',fontSize:12,marginTop:6}}>Неверный пароль</div>}
        </div>
        <button onClick={login} style={{...S.btn('#0B3D6B'),width:'100%',padding:'12px 0',fontSize:15}}>Войти</button>
      </div>
    </div>
  )

  return (
    <div style={{background:'#f8fafc',minHeight:'100vh',fontFamily:'system-ui,sans-serif'}}>
      <div style={{background:'#0B3D6B',padding:'16px 32px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div>
          <div style={{color:'white',fontSize:18,fontWeight:700}}>🏄 Time to Surf — Админка</div>
          <div style={{color:'rgba(255,255,255,.45)',fontSize:11,marginTop:1}}>Панель управления сайтом</div>
        </div>
        <div style={{display:'flex',gap:12,alignItems:'center'}}>
          <a href="/" style={{color:'rgba(255,255,255,.6)',fontSize:13,textDecoration:'none'}}>← На сайт</a>
          <button onClick={logout} style={{...S.btn('rgba(255,255,255,.15)'),fontSize:12}}>Выйти</button>
        </div>
      </div>

      <div style={{background:'#0B3D6B',padding:'0 32px',display:'flex',gap:4,borderTop:'1px solid rgba(255,255,255,.1)'}}>
        {([['reviews','💬 Отзывы'],['sessions','📅 Смены'],['gallery','📸 Фото'],['pricing','💰 Цены'],['settings','⚙️ Настройки']] as const).map(([id,label])=>(
          <button key={id} style={S.tab(tab===id)} onClick={()=>setTab(id)}>{label}</button>
        ))}
      </div>

      <div style={{maxWidth:920,margin:'0 auto',padding:'32px 24px'}}>
        {tab==='reviews'&&<ReviewsTab/>}
        {tab==='sessions'&&<SessionsTab/>}
        {tab==='gallery'&&<GalleryTab/>}
        {tab==='pricing'&&<PricingTab/>}
        {tab==='settings'&&<SettingsTab/>}
      </div>
    </div>
  )
}

function SectionHeader({title,sub}:{title:string;sub:string}) {
  return <div style={{marginBottom:24}}><h2 style={{fontSize:22,fontWeight:800,color:'#0B3D6B',margin:0}}>{title}</h2><p style={{fontSize:13,color:'#888',marginTop:4}}>{sub}</p></div>
}
function Spinner() { return <div style={{textAlign:'center',padding:60,color:'#888'}}>Загрузка...</div> }
function Empty({text}:{text:string}) { return <div style={{textAlign:'center',padding:60,color:'#888',background:'white',borderRadius:12}}>{text}</div> }
function Toast({text}:{text:string}) {
  const ok=text.includes('✓')
  return <div style={{padding:'12px 16px',borderRadius:8,marginBottom:16,background:ok?'#dcfce7':'#fee2e2',color:ok?'#16A34A':'#dc2626',fontWeight:600,fontSize:14}}>{text}</div>
}

// ── Reviews ──
function ReviewsTab() {
  const [reviews,setReviews]=useState<Review[]>([])
  const [loading,setLoading]=useState(true)
  const [filter,setFilter]=useState<'pending'|'approved'|'all'>('pending')

  const load=async()=>{setLoading(true);try{const r=await fetch('/api/reviews/admin');const d=await r.json();if(Array.isArray(d))setReviews(d)}catch{}setLoading(false)}
  useEffect(()=>{load()},[])

  const approve=async(id:number)=>{await fetch('/api/reviews/admin',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({id,approved:true})});load()}
  const del=async(id:number)=>{if(!confirm('Удалить?'))return;await fetch('/api/reviews/admin',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({id})});load()}

  const pending=reviews.filter(r=>!r.approved).length
  const filtered=reviews.filter(r=>filter==='all'?true:filter==='pending'?!r.approved:r.approved)

  return <div>
    <SectionHeader title="💬 Отзывы" sub="Нажми «Опубликовать» → отзыв появится на сайте. Непубликованные не видны посетителям."/>
    <div style={{display:'flex',gap:8,marginBottom:20}}>
      {(['pending','approved','all'] as const).map(f=>(
        <button key={f} onClick={()=>setFilter(f)} style={{...S.tab(filter===f),background:filter===f?'#0B3D6B':'white',color:filter===f?'white':'#344E63',boxShadow:'0 1px 4px rgba(0,0,0,.08)'}}>
          {f==='pending'?`Ожидают (${pending})`:f==='approved'?'Опубликованные':'Все'}
        </button>
      ))}
      <button onClick={load} style={{...S.btn('white','#344E63'),marginLeft:'auto',border:'1px solid #D4E6F1'}}>⟳ Обновить</button>
    </div>
    {loading?<Spinner/>:filtered.length===0?<Empty text={filter==='pending'?'Нет отзывов на проверке 🎉':'Отзывов нет'}/>:(
      <div style={{display:'flex',flexDirection:'column',gap:10}}>
        {filtered.map(r=>(
          <div key={r.id} style={{...S.card,border:`2px solid ${r.approved?'#D4E6F1':'#F5A623'}`}}>
            <div style={{display:'flex',gap:8,alignItems:'center',marginBottom:6,flexWrap:'wrap'}}>
              <span style={{fontWeight:700,color:'#0B3D6B'}}>{r.name}</span>
              {r.program&&<span style={{fontSize:11,background:'#EEF6FF',color:'#0B3D6B',padding:'2px 8px',borderRadius:20,fontWeight:600}}>{r.program}</span>}
              <span style={{color:'#F5A623'}}>{'★'.repeat(r.rating)}</span>
              <span style={{fontSize:11,color:'#aaa'}}>{new Date(r.created_at).toLocaleDateString('ru-RU')}</span>
            </div>
            <p style={{fontSize:14,color:'#344E63',lineHeight:1.7,margin:'0 0 12px',wordBreak:'break-word',overflowWrap:'anywhere'}}>"{r.text}"</p>
            <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}>
              {!r.approved&&<button onClick={()=>approve(r.id)} style={S.btn('#16A34A')}>✓ Опубликовать</button>}
              <button onClick={()=>del(r.id)} style={S.btn('#fee2e2','#dc2626')}>✕ Удалить</button>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
}

// ── Sessions ──
function SessionsTab() {
  const [sessions,setSessions]=useState<Session[]>([])
  const [loading,setLoading]=useState(true)
  const [editing,setEditing]=useState<Session|null>(null)
  const [adding,setAdding]=useState(false)
  const blank={dates:'',type_ru:'',type_en:'',type_et:'',color:'#1A6BAA',leaders:'',hot:false,detail:'surf'}
  const [form,setForm]=useState(blank)
  const [saving,setSaving]=useState(false)
  const [msg,setMsg]=useState('')

  const load=async()=>{setLoading(true);try{const r=await fetch('/api/sessions');const d=await r.json();if(Array.isArray(d))setSessions(d)}catch{}setLoading(false)}
  useEffect(()=>{load()},[])

  const save=async()=>{
    setSaving(true)
    try{
      if(editing){await fetch('/api/sessions',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:editing.id,...form})});setMsg('Смена обновлена ✓')}
      else{await fetch('/api/sessions',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...form,sort_order:sessions.length+1})});setMsg('Смена добавлена ✓')}
      setEditing(null);setAdding(false);setForm(blank);load()
    }catch{setMsg('Ошибка')}
    setSaving(false);setTimeout(()=>setMsg(''),3000)
  }
  const del=async(id:number)=>{if(!confirm('Удалить смену?'))return;await fetch('/api/sessions',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({id})});load()}
  const startEdit=(s:Session)=>{setEditing(s);setAdding(false);setForm({dates:s.dates,type_ru:s.type_ru,type_en:s.type_en,type_et:s.type_et,color:s.color,leaders:s.leaders,hot:s.hot,detail:s.detail})}

  return <div>
    <SectionHeader title="📅 Смены лагеря" sub="Расписание на сезон — добавляй, убирай, меняй"/>
    {msg&&<Toast text={msg}/>}
    <div style={{display:'flex',gap:8,marginBottom:20}}>
      <button onClick={()=>{setAdding(true);setEditing(null);setForm(blank)}} style={S.btn('#0AACAC')}>+ Добавить смену</button>
      <button onClick={load} style={{...S.btn('white','#344E63'),border:'1px solid #D4E6F1'}}>⟳ Обновить</button>
    </div>
    {(adding||editing)&&(
      <div style={{...S.card,border:'2px solid #0AACAC',marginBottom:20}}>
        <h3 style={{fontSize:15,fontWeight:700,color:'#0B3D6B',marginBottom:16}}>{editing?'✏️ Редактировать смену':'➕ Новая смена'}</h3>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
          <div><label style={S.label}>Даты *</label><input style={S.input} value={form.dates} onChange={e=>setForm({...form,dates:e.target.value})} placeholder="15.06 - 19.06.2026"/></div>
          <div><label style={S.label}>Руководители</label><input style={S.input} value={form.leaders} onChange={e=>setForm({...form,leaders:e.target.value})} placeholder="Наташа К. + Даша"/></div>
          <div><label style={S.label}>Название RU *</label><input style={S.input} value={form.type_ru} onChange={e=>setForm({...form,type_ru:e.target.value})} placeholder="СЕРФИНГ ЛАГЕРЬ"/></div>
          <div><label style={S.label}>Название EN</label><input style={S.input} value={form.type_en} onChange={e=>setForm({...form,type_en:e.target.value})} placeholder="SURF CAMP"/></div>
          <div><label style={S.label}>Название ET</label><input style={S.input} value={form.type_et} onChange={e=>setForm({...form,type_et:e.target.value})} placeholder="SURFI LAAGER"/></div>
          <div><label style={S.label}>Цвет карточки</label>
            <select style={S.input} value={form.color} onChange={e=>setForm({...form,color:e.target.value})}>
              {COLOR_OPTIONS.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div><label style={S.label}>Тип программы</label>
            <select style={S.input} value={form.detail} onChange={e=>setForm({...form,detail:e.target.value})}>
              <option value="surf">Серфинг лагерь</option>
              <option value="kino">Серфинг + Кино</option>
              <option value="pohod">Серфинг + Поход</option>
            </select>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:8,paddingTop:20}}>
            <input type="checkbox" checked={form.hot} onChange={e=>setForm({...form,hot:e.target.checked})} id="hot" style={{width:18,height:18}}/>
            <label htmlFor="hot" style={{fontSize:14,color:'#344E63',cursor:'pointer'}}>🔥 Горящая смена</label>
          </div>
        </div>
        <div style={{display:'flex',gap:8,marginTop:16}}>
          <button onClick={save} disabled={saving} style={S.btn('#0B3D6B')}>{saving?'Сохранение...':'✓ Сохранить'}</button>
          <button onClick={()=>{setEditing(null);setAdding(false)}} style={S.btn('white','#344E63')}>Отмена</button>
        </div>
      </div>
    )}
    {loading?<Spinner/>:(
      <div style={{display:'flex',flexDirection:'column',gap:8}}>
        {sessions.map(s=>(
          <div key={s.id} style={{...S.card,display:'flex',alignItems:'center',gap:12}}>
            <div style={{width:8,height:44,borderRadius:4,background:s.color,flexShrink:0}}/>
            <div style={{flex:1}}>
              <div style={{fontWeight:700,fontSize:14,color:'#0B3D6B'}}>{s.dates}</div>
              <div style={{fontSize:12,color:'#344E63',marginTop:2}}>{s.type_ru} {s.hot&&'🔥'} · {s.leaders}</div>
            </div>
            <div style={{display:'flex',gap:6}}>
              <button onClick={()=>startEdit(s)} style={S.btn('#EEF6FF','#0B3D6B')}>✏️ Изменить</button>
              <button onClick={()=>del(s.id)} style={S.btn('#fee2e2','#dc2626')}>✕</button>
            </div>
          </div>
        ))}
        {sessions.length===0&&<Empty text="Смен нет. Добавьте первую!"/>}
      </div>
    )}
  </div>
}

// ── Gallery ──
const STATIC_PHOTOS = [
  { url: '/DSC02601-150x150.jpeg', section: 'water' },
  { url: '/DSC02691-150x150.jpeg', section: 'water' },
  { url: '/DSC02699-150x150.jpeg', section: 'water' },
  { url: '/DSC02878-150x150.jpeg', section: 'water' },
  { url: '/DSC02883-150x150.jpeg', section: 'water' },
  { url: '/DSC02899-150x150.jpeg', section: 'water' },
  { url: '/IMG_7757-150x150.jpeg', section: 'water' },
  { url: '/IMG_7758-150x150.jpeg', section: 'water' },
  { url: '/IMG_7773-150x150.jpeg', section: 'water' },
  { url: '/IMG_7752-150x150.jpeg', section: 'water' },
  { url: '/IMG_7796-150x150.jpeg', section: 'water' },
  { url: '/IMG_7787-150x150.jpeg', section: 'water' },
  { url: '/217650841_4107074432694657_6267790752617918985_n.jpg', section: 'team' },
  { url: '/IMG_0806-150x150.jpeg', section: 'team' },
  { url: '/IMG_0843-150x150.jpeg', section: 'team' },
  { url: '/IMG_0850-150x150.jpeg', section: 'team' },
  { url: '/IMG_0857-150x150.jpeg', section: 'team' },
  { url: '/IMG_7805-150x150.jpeg', section: 'team' },
  { url: '/IMG_7807-150x150.jpeg', section: 'team' },
  { url: '/IMG_7809-150x150.jpeg', section: 'team' },
  { url: '/IMG_7812-150x150.jpeg', section: 'team' },
  { url: '/IMG_7659-150x150.jpeg', section: 'team' },
  { url: '/IMG_7046-150x150.jpg', section: 'team' },
  { url: '/IMG_9281-150x150.jpeg', section: 'moments' },
  { url: '/IMG_9284-150x150.jpeg', section: 'moments' },
  { url: '/IMG_9294-150x150.jpeg', section: 'moments' },
  { url: '/IMG_9302-150x150.jpeg', section: 'moments' },
  { url: '/IMG_9532-150x150.jpeg', section: 'moments' },
  { url: '/IMG_9585-150x150.jpeg', section: 'moments' },
  { url: '/IMG_6342-150x150.jpg', section: 'moments' },
  { url: '/IMG_6351-150x150.jpg', section: 'moments' },
  { url: '/IMG_6359-2-150x150.jpg', section: 'moments' },
  { url: '/IMG_6613-150x150.jpeg', section: 'moments' },
  { url: '/IMG_6614-150x150.jpeg', section: 'moments' },
  { url: '/photo_2026-04-18-10_00_40-150x150.jpeg', section: 'moments' },
  { url: '/photo_2026-04-18-10_00_44-150x150.jpeg', section: 'moments' },
  { url: '/photo_2026-04-18-10_00_46-150x150.jpeg', section: 'moments' },
  { url: '/photo-output-2-1024x1024__1_.jpeg', section: 'hero' },
  { url: '/IMG_7917-1024x768.jpeg', section: 'hero' },
  { url: '/IMG_6615-821x1024.jpeg', section: 'hero' },
  { url: '/IMG_8779-1-768x1024.jpeg', section: 'hero' },
]

function GalleryTab() {
  const [photos,setPhotos]=useState<GalleryPhoto[]>([])
  const [loading,setLoading]=useState(true)
  const [newUrl,setNewUrl]=useState('')
  const [newSection,setNewSection]=useState('moments')
  const [adding,setAdding]=useState(false)
  const [seeding,setSeeding]=useState(false)
  const [msg,setMsg]=useState('')

  const load=async()=>{setLoading(true);try{const r=await fetch('/api/gallery');const d=await r.json();if(Array.isArray(d))setPhotos(d)}catch{}setLoading(false)}
  useEffect(()=>{load()},[])

  const add=async()=>{
    if(!newUrl.trim())return
    setAdding(true)
    try{await fetch('/api/gallery',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({url:newUrl.trim(),section:newSection})});setNewUrl('');setMsg('Фото добавлено ✓');load()}
    catch{setMsg('Ошибка')}
    setAdding(false);setTimeout(()=>setMsg(''),3000)
  }
  const del=async(id:number)=>{if(!confirm('Удалить фото?'))return;await fetch('/api/gallery',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({id})});load()}

  const seedStatic=async()=>{
    if(!confirm(`Перенести ${STATIC_PHOTOS.length} статических фото в базу данных? После этого сайт будет использовать фото из базы.`))return
    setSeeding(true)
    let ok=0,fail=0
    for(const p of STATIC_PHOTOS){
      try{
        const r=await fetch('/api/gallery',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({url:p.url,section:p.section,sort_order:0})})
        if(r.ok)ok++;else fail++
      }catch{fail++}
    }
    setMsg(`Добавлено: ${ok} фото${fail>0?`, ошибок: ${fail}`:''}`)
    setSeeding(false)
    load()
    setTimeout(()=>setMsg(''),5000)
  }

  const grouped=SECTION_OPTIONS.map(s=>({...s,photos:photos.filter(p=>p.section===s.value)}))

  return <div>
    <SectionHeader title="📸 Галерея фото" sub="Управление фотографиями на сайте"/>
    {msg&&<Toast text={msg}/>}

    {/* Seed button — shown only when DB is empty */}
    {!loading&&photos.length===0&&(
      <div style={{...S.card,border:'2px solid #F5A623',background:'#FFFBF0',marginBottom:24}}>
        <div style={{display:'flex',alignItems:'flex-start',gap:14}}>
          <div style={{fontSize:28}}>📂</div>
          <div style={{flex:1}}>
            <div style={{fontWeight:700,fontSize:14,color:'#92400E',marginBottom:6}}>База данных галереи пустая</div>
            <p style={{fontSize:13,color:'#78350F',margin:'0 0 14px'}}>
              На сайте есть <strong>{STATIC_PHOTOS.length} существующих фото</strong> (из папки /public/), но они не добавлены в базу. Нажми кнопку ниже — все фото перенесутся в Supabase и станут управляемыми через эту панель.
            </p>
            <button onClick={seedStatic} disabled={seeding} style={{...S.btn('#F5A623','#1C1C1C'),fontSize:13}}>
              {seeding?'Переносим фото...':'🚀 Перенести все существующие фото в базу'}
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Add new photo form */}
    <div style={{...S.card,border:'2px dashed #0AACAC',marginBottom:24}}>
      <h3 style={{fontSize:14,fontWeight:700,color:'#0B3D6B',marginBottom:12}}>Добавить фото</h3>
      <div style={{display:'grid',gridTemplateColumns:'1fr auto auto',gap:8,alignItems:'end'}}>
        <div>
          <label style={S.label}>URL или путь к фото</label>
          <input style={S.input} value={newUrl} onChange={e=>setNewUrl(e.target.value)} placeholder="/имя-файла.jpg или https://..."/>
        </div>
        <div>
          <label style={S.label}>Раздел</label>
          <select style={S.input} value={newSection} onChange={e=>setNewSection(e.target.value)}>
            {SECTION_OPTIONS.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <button onClick={add} disabled={adding||!newUrl.trim()} style={S.btn('#0B3D6B')}>+ Добавить</button>
      </div>
      <p style={{fontSize:11,color:'#888',marginTop:8}}>💡 Для локальных файлов: загрузите в папку /public/ и введите /имя-файла.jpg</p>
    </div>

    {loading?<Spinner/>:(
      photos.length>0?(
        grouped.map(group=>group.photos.length>0&&(
          <div key={group.value} style={{marginBottom:28}}>
            <h3 style={{fontSize:14,fontWeight:700,color:'#0B3D6B',marginBottom:12}}>{group.label} <span style={{color:'#888',fontWeight:400}}>({group.photos.length})</span></h3>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(130px,1fr))',gap:10}}>
              {group.photos.map(p=>(
                <div key={p.id} style={{position:'relative',borderRadius:8,overflow:'hidden',background:'#EEF6FF'}}>
                  <img src={p.url} alt="" style={{width:'100%',height:90,objectFit:'cover',display:'block'}} onError={e=>{(e.target as HTMLImageElement).style.opacity='0.2'}}/>
                  <button onClick={()=>del(p.id)} style={{position:'absolute',top:4,right:4,width:22,height:22,borderRadius:'50%',background:'rgba(220,38,38,.85)',color:'white',border:'none',cursor:'pointer',fontSize:12,fontWeight:700}}>✕</button>
                  <div style={{padding:'4px 6px',fontSize:10,color:'#344E63',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{p.url}</div>
                </div>
              ))}
            </div>
          </div>
        ))
      ):null
    )}
  </div>
}

// ── Pricing ──
function PricingTab() {
  const [s,setS]=useState<Settings>({})
  const [loading,setLoading]=useState(true)
  const [saving,setSaving]=useState(false)
  const [msg,setMsg]=useState('')

  const load=async()=>{setLoading(true);try{const r=await fetch('/api/settings');const d=await r.json();setS(d)}catch{}setLoading(false)}
  useEffect(()=>{load()},[])

  const save=async()=>{
    setSaving(true)
    try{await fetch('/api/settings',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({settings:{price_3day:s.price_3day||'190€',price_4day:s.price_4day||'235€',price_5day:s.price_5day||'265€'}})});setMsg('Цены обновлены ✓')}
    catch{setMsg('Ошибка')}
    setSaving(false);setTimeout(()=>setMsg(''),3000)
  }

  return <div>
    <SectionHeader title="💰 Цены" sub="Стоимость участия в лагере"/>
    {msg&&<Toast text={msg}/>}
    {loading?<Spinner/>:(
      <div style={S.card}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:20,marginBottom:20}}>
          <div style={{background:'#F0F8FF',borderRadius:12,padding:20}}>
            <div style={{fontSize:28,marginBottom:6}}>📅</div>
            <div style={{fontSize:13,fontWeight:700,color:'#344E63',marginBottom:4}}>3 дня — Пробная смена</div>
            <div style={{fontSize:11,color:'#888',marginBottom:12}}>«Идеально для первого знакомства»</div>
            <input value={s.price_3day||''} onChange={e=>setS({...s,price_3day:e.target.value})}
              style={{...S.input,fontWeight:800,fontSize:28,textAlign:'center',color:'#0B3D6B',border:'2px solid #D4E6F1'}} placeholder="190€"/>
          </div>
          <div style={{background:'#F0FFF4',borderRadius:12,padding:20}}>
            <div style={{fontSize:28,marginBottom:6}}>📆</div>
            <div style={{fontSize:13,fontWeight:700,color:'#344E63',marginBottom:4}}>4 дня</div>
            <div style={{fontSize:11,color:'#888',marginBottom:12}}>«Расширенная программа»</div>
            <input value={s.price_4day||''} onChange={e=>setS({...s,price_4day:e.target.value})}
              style={{...S.input,fontWeight:800,fontSize:28,textAlign:'center',color:'#16A34A',border:'2px solid #bbf7d0'}} placeholder="235€"/>
          </div>
          <div style={{background:'#0B3D6B',borderRadius:12,padding:20}}>
            <div style={{fontSize:28,marginBottom:6}}>🏄</div>
            <div style={{fontSize:13,fontWeight:700,color:'rgba(255,255,255,.7)',marginBottom:4}}>5 дней — Полная программа</div>
            <div style={{fontSize:11,color:'rgba(255,255,255,.45)',marginBottom:12}}>«Максимум впечатлений и навыков»</div>
            <input value={s.price_5day||''} onChange={e=>setS({...s,price_5day:e.target.value})}
              style={{...S.input,fontWeight:800,fontSize:28,textAlign:'center',color:'white',background:'rgba(255,255,255,.1)',border:'2px solid rgba(255,255,255,.3)'}} placeholder="265€"/>
          </div>
        </div>
        <button onClick={save} disabled={saving} style={S.btn('#0B3D6B')}>{saving?'Сохранение...':'✓ Сохранить цены'}</button>
        <p style={{fontSize:12,color:'#888',marginTop:10}}>💡 Формат: 190€ или €190. Изменения применятся на сайте после следующей загрузки страницы.</p>
      </div>
    )}
  </div>
}

// ── Settings ──
function SettingsTab() {
  const [s,setS]=useState<Settings>({})
  const [loading,setLoading]=useState(true)
  const [saving,setSaving]=useState(false)
  const [msg,setMsg]=useState('')

  const load=async()=>{setLoading(true);try{const r=await fetch('/api/settings');const d=await r.json();setS(d)}catch{}setLoading(false)}
  useEffect(()=>{load()},[])

  const save=async()=>{
    setSaving(true)
    try{await fetch('/api/settings',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({settings:{spots_taken:s.spots_taken||'4',spots_total:s.spots_total||'16',next_session_date:s.next_session_date||'15.06',next_session_date_full:s.next_session_date_full||'15 июня 2026',group_size:s.group_size||'12-16',schedule_year_label:s.schedule_year_label||'Лето 2026'}})});setMsg('Настройки сохранены ✓')}
    catch{setMsg('Ошибка')}
    setSaving(false);setTimeout(()=>setMsg(''),3000)
  }

  return <div>
    <SectionHeader title="⚙️ Основные настройки" sub="Места, расписание и текстовые метки"/>
    {msg&&<Toast text={msg}/>}
    {loading?<Spinner/>:(
      <div style={{display:'flex',flexDirection:'column',gap:16}}>
        <div style={S.card}>
          <h3 style={{fontSize:14,fontWeight:700,color:'#0B3D6B',marginBottom:4}}>📍 Счётчик мест</h3>
          <p style={{fontSize:12,color:'#888',marginBottom:16}}>Hero: «<strong>{s.spots_taken||'4'} из {s.spots_total||'16'} мест занято · Ближайшая смена {s.next_session_date||'15.06'}</strong>» · CTA: «<strong>Ближайшая смена: {s.next_session_date_full||'15 июня 2026'}</strong>»</p>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12}}>
            <div><label style={S.label}>Мест занято</label><input style={S.input} type="number" value={s.spots_taken||''} onChange={e=>setS({...s,spots_taken:e.target.value})} placeholder="4"/></div>
            <div><label style={S.label}>Мест всего</label><input style={S.input} type="number" value={s.spots_total||''} onChange={e=>setS({...s,spots_total:e.target.value})} placeholder="16"/></div>
            <div><label style={S.label}>Дата ближайшей смены (короткая, для Hero)</label><input style={S.input} value={s.next_session_date||''} onChange={e=>setS({...s,next_session_date:e.target.value})} placeholder="15.06"/></div>
            <div><label style={S.label}>Дата ближайшей смены (полная, для CTA блока)</label><input style={S.input} value={s.next_session_date_full||''} onChange={e=>setS({...s,next_session_date_full:e.target.value})} placeholder="15 июня 2026"/></div>
            <div><label style={S.label}>Размер группы (для CTA блока)</label><input style={S.input} value={s.group_size||''} onChange={e=>setS({...s,group_size:e.target.value})} placeholder="12-16"/></div>
          </div>
        </div>
        <div style={S.card}>
          <h3 style={{fontSize:14,fontWeight:700,color:'#0B3D6B',marginBottom:4}}>📅 Метка расписания</h3>
          <p style={{fontSize:12,color:'#888',marginBottom:16}}>Заголовок раздела: «<strong>Расписание {s.schedule_year_label||'Лето 2026'}</strong>»</p>
          <div><label style={S.label}>Год / Сезон</label><input style={{...S.input,maxWidth:300}} value={s.schedule_year_label||''} onChange={e=>setS({...s,schedule_year_label:e.target.value})} placeholder="Лето 2026"/></div>
          <p style={{fontSize:11,color:'#888',marginTop:8}}>Примеры: «Лето 2027», «Summer 2027», «Сезон 2027»</p>
        </div>
        <div>
          <button onClick={save} disabled={saving} style={S.btn('#0B3D6B')}>{saving?'Сохранение...':'✓ Сохранить настройки'}</button>
        </div>
        <div style={{...S.card,background:'#FFF7E6',border:'1.5px solid #F5A623'}}>
          <h3 style={{fontSize:13,fontWeight:700,color:'#92400E',marginBottom:8}}>ℹ️ Как изменения появляются на сайте</h3>
          <p style={{fontSize:13,color:'#92400E',lineHeight:1.8,margin:0}}>
            Данные сохраняются в Supabase. Чтобы сайт подтягивал их автоматически, нужно добавить в <code>page.tsx</code> fetch-запрос к <code>/api/settings</code> при загрузке страницы (уже подготовлено в API-роуте). До этого настройки используются как fallback-значения.
          </p>
        </div>
      </div>
    )}
  </div>
}