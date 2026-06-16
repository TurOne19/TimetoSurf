'use client'

import { useEffect, useState } from 'react'

type Tab = 'reviews' | 'sessions' | 'media' | 'pricing' | 'content' | 'faq' | 'seo'

interface Review { id:number; name:string; text:string; program?:string; rating:number; approved:boolean; created_at:string }
interface Session { id:number; dates:string; type_ru:string; type_en:string; type_et:string; color:string; leaders:string; hot:boolean; sold_out?:boolean; detail:string; sort_order:number }
interface MediaItem { id:number; url:string; section:string; sort_order:number; media_type?:string; poster_url?:string; title?:string }
interface ContentItem { key:string; label:string; group_name:string; value_ru:string; value_en:string; value_et:string; sort_order:number }
interface FaqItem { id:number; question_ru:string; answer_ru:string; question_en:string; answer_en:string; question_et:string; answer_et:string; sort_order:number; active:boolean }

const ADMIN_PASSWORD = 'surf2026admin'

const S = {
  btn: (bg = '#0B3D6B', color = 'white') => ({ padding:'10px 16px', background:bg, color, border:'none', borderRadius:10, cursor:'pointer', fontWeight:800, fontSize:13 } as React.CSSProperties),
  input: { width:'100%', padding:'11px 13px', border:'1.5px solid #D4E6F1', borderRadius:10, fontSize:14, fontFamily:'inherit', outline:'none', boxSizing:'border-box' } as React.CSSProperties,
  area: { width:'100%', minHeight:82, padding:'11px 13px', border:'1.5px solid #D4E6F1', borderRadius:10, fontSize:14, fontFamily:'inherit', outline:'none', boxSizing:'border-box', resize:'vertical' } as React.CSSProperties,
  card: { background:'white', borderRadius:16, padding:20, boxShadow:'0 10px 30px rgba(11,61,107,.08)', marginBottom:14 } as React.CSSProperties,
  label: { fontSize:12, fontWeight:800, color:'#344E63', marginBottom:5, display:'block' } as React.CSSProperties,
}

const tabs: [Tab,string][] = [
  ['reviews','Отзывы'],
  ['sessions','Смены'],
  ['media','Фото / видео'],
  ['pricing','Цены'],
  ['content','Тексты'],
  ['faq','FAQ'],
  ['seo','SEO / CTA'],
]

const mediaSections = [
  ['hero','Hero / верх сайта'],
  ['water','Галерея - вода'],
  ['team','Галерея - команда'],
  ['moments','Галерея - моменты'],
  ['video','Галерея - видео'],
  ['safety','Безопасность'],
  ['trust','Почему родители выбирают нас'],
]

const contentSeed: ContentItem[] = [
  { key:'hero_eyebrow', label:'Hero - верхняя строка', group_name:'Hero', value_ru:'Детский серфинг-лагерь - Stroomi rand / Tallinn - Лето 2026', value_en:'Kids surf camp - Stroomi Beach / Tallinn - Summer 2026', value_et:'Laste surfilaager - Stroomi rand / Tallinn - Suvi 2026', sort_order:1 },
  { key:'hero_title', label:'Hero - заголовок', group_name:'Hero', value_ru:'Лето, море и серфинг для детей 7-14 лет', value_en:'Summer, sea and surfing for kids ages 7-14', value_et:'Suvi, meri ja surf lastele 7-14 aastat', sort_order:2 },
  { key:'hero_text', label:'Hero - описание', group_name:'Hero', value_ru:'5 дней на Stroomi rand: вода, спорт, друзья и свобода без телефона. Малые группы 12-16 детей, жилеты и гидрокостюмы, инструкторы рядом. Лето 2026, от 190€, места ограничены.', value_en:'5 days at Stroomi Beach: water, sport, friends and phone-free freedom. Small groups of 12-16 kids, life jackets, wetsuits and instructors close by. Summer 2026, from 190€, limited spots.', value_et:'5 päeva Stroomi rannas: vesi, sport, sõbrad ja telefonivaba vabadus. Väikesed grupid 12-16 last, päästevestid, märjaksüidid ja instruktorid kõrval. Suvi 2026, alates 190€, kohad piiratud.', sort_order:3 },
  { key:'safety_title', label:'Безопасность - заголовок', group_name:'Безопасность', value_ru:'Родителям спокойно', value_en:'Parents can relax', value_et:'Vanematele on rahulik', sort_order:10 },
  { key:'formats_title', label:'Программы - заголовок', group_name:'Программы', value_ru:'Три уникальные программы', value_en:'Three unique programmes', value_et:'Kolm ainulaadset programmi', sort_order:20 },
  { key:'day_title', label:'Программа дня - заголовок', group_name:'Программа дня', value_ru:'Как проходит день', value_en:'How the day goes', value_et:'Kuidas päev kulgeb', sort_order:30 },
  { key:'dates_title', label:'Смены - заголовок', group_name:'Смены', value_ru:'Расписание лета 2026', value_en:'Summer 2026 schedule', value_et:'Suve 2026 ajakava', sort_order:40 },
  { key:'gallery_title', label:'Галерея - заголовок', group_name:'Галерея', value_ru:'Фото и видео со смен', value_en:'Photos and videos from camp', value_et:'Fotod ja videod laagrist', sort_order:50 },
  { key:'cta_title', label:'CTA - заголовок', group_name:'CTA', value_ru:'Места ограничены. Записывайтесь сейчас.', value_en:'Spots are limited. Register now.', value_et:'Kohti on piiratud. Registreeruge kohe.', sort_order:60 },
]

export default function AdminPage() {
  const [authed,setAuthed] = useState(false)
  const [pw,setPw] = useState('')
  const [tab,setTab] = useState<Tab>('reviews')

  useEffect(() => { if (sessionStorage.getItem('tts-admin') === ADMIN_PASSWORD) setAuthed(true) }, [])
  const login = () => { if (pw === ADMIN_PASSWORD) { sessionStorage.setItem('tts-admin', ADMIN_PASSWORD); setAuthed(true) } }

  if (!authed) return (
    <main style={{minHeight:'100vh',display:'grid',placeItems:'center',background:'#061828',fontFamily:'system-ui,sans-serif'}}>
      <div style={{background:'white',borderRadius:22,padding:38,width:360,boxShadow:'0 30px 90px rgba(0,0,0,.35)'}}>
        <h1 style={{margin:0,color:'#0B3D6B'}}>Time to Surf</h1>
        <p style={{color:'#6B8AA0',margin:'4px 0 24px'}}>Админка сайта</p>
        <label style={S.label}>Пароль</label>
        <input style={{...S.input,fontSize:16}} type="password" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==='Enter'&&login()} autoFocus />
        <button style={{...S.btn('#0B3D6B'),width:'100%',marginTop:14,padding:13}} onClick={login}>Войти</button>
      </div>
    </main>
  )

  return (
    <main style={{minHeight:'100vh',background:'#f6f8fb',fontFamily:'system-ui,sans-serif'}}>
      <header style={{background:'linear-gradient(135deg,#061828,#0B3D6B)',padding:'18px 28px',color:'white'}}>
        <div style={{maxWidth:1180,margin:'0 auto',display:'flex',justifyContent:'space-between',gap:16,alignItems:'center'}}>
          <div><strong style={{fontSize:20}}>Time to Surf - админка</strong><div style={{fontSize:12,opacity:.58}}>Смены, медиа, тексты, FAQ, CTA, SEO</div></div>
          <div style={{display:'flex',gap:10}}><a href="/" style={{color:'white',opacity:.75,textDecoration:'none',fontSize:13}}>На сайт</a><button style={S.btn('rgba(255,255,255,.15)')} onClick={()=>{sessionStorage.removeItem('tts-admin');setAuthed(false)}}>Выйти</button></div>
        </div>
      </header>
      <nav style={{background:'#0B3D6B',padding:'0 28px'}}>
        <div style={{maxWidth:1180,margin:'0 auto',display:'flex',gap:4,overflowX:'auto'}}>
          {tabs.map(([id,label]) => <button key={id} onClick={()=>setTab(id)} style={{...S.btn(tab===id?'white':'transparent',tab===id?'#0B3D6B':'rgba(255,255,255,.72)'),borderRadius:'10px 10px 0 0',whiteSpace:'nowrap'}}>{label}</button>)}
        </div>
      </nav>
      <div style={{maxWidth:1180,margin:'0 auto',padding:'28px'}}>
        {tab==='reviews' && <ReviewsTab/>}
        {tab==='sessions' && <SessionsTab/>}
        {tab==='media' && <MediaTab/>}
        {tab==='pricing' && <PricingTab/>}
        {tab==='content' && <ContentTab/>}
        {tab==='faq' && <FaqTab/>}
        {tab==='seo' && <SeoTab/>}
      </div>
    </main>
  )
}

function Title({children,sub}:{children:string;sub:string}) {
  return <div style={{marginBottom:22}}><h2 style={{margin:0,color:'#0B3D6B',fontSize:24}}>{children}</h2><p style={{margin:'4px 0 0',color:'#6B8AA0',fontSize:13}}>{sub}</p></div>
}
function Toast({msg}:{msg:string}) { return msg ? <div style={{...S.card,background:'#ecfdf5',color:'#047857',fontWeight:800}}>{msg}</div> : null }

function ReviewsTab() {
  const [items,setItems]=useState<Review[]>([])
  const load=async()=>{const d=await fetch('/api/reviews/admin').then(r=>r.json()).catch(()=>[]); if(Array.isArray(d)) setItems(d)}
  useEffect(()=>{load()},[])
  const approve=async(id:number)=>{await fetch('/api/reviews/admin',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({id,approved:true})});load()}
  const del=async(id:number)=>{if(confirm('Удалить отзыв?')){await fetch('/api/reviews/admin',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({id})});load()}}
  return <section><Title sub="Модерация отзывов. На сайт попадают только опубликованные.">Отзывы</Title>{items.map(r=><div key={r.id} style={{...S.card,border:`1.5px solid ${r.approved?'#dbeafe':'#F5A623'}`}}><div style={{display:'flex',justifyContent:'space-between',gap:14}}><div><strong>{r.name}</strong> <span style={{color:'#F5A623'}}>{'★'.repeat(r.rating)}</span><p style={{color:'#344E63'}}>{r.text}</p></div><div style={{display:'flex',gap:8,alignItems:'start'}}>{!r.approved&&<button style={S.btn('#16A34A')} onClick={()=>approve(r.id)}>Опубликовать</button>}<button style={S.btn('#fee2e2','#dc2626')} onClick={()=>del(r.id)}>Удалить</button></div></div></div>)}</section>
}

function SessionsTab() {
  const blank = {dates:'',type_ru:'',type_en:'',type_et:'',color:'#1A6BAA',leaders:'',hot:false,sold_out:false,detail:'surf'}
  const [items,setItems]=useState<Session[]>([])
  const [form,setForm]=useState<any>(blank)
  const [editing,setEditing]=useState<number|null>(null)
  const [msg,setMsg]=useState('')
  const load=async()=>{const d=await fetch('/api/sessions').then(r=>r.json()).catch(()=>[]); if(Array.isArray(d)) setItems(d)}
  useEffect(()=>{load()},[])
  const save=async()=>{const body={...form,id:editing,sort_order:items.length+1}; await fetch('/api/sessions',{method:editing?'PATCH':'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}); setForm(blank); setEditing(null); setMsg('Смена сохранена'); load(); setTimeout(()=>setMsg(''),2500)}
  const edit=(s:Session)=>{setEditing(s.id);setForm({dates:s.dates,type_ru:s.type_ru,type_en:s.type_en,type_et:s.type_et,color:s.color,leaders:s.leaders,hot:s.hot,sold_out:!!s.sold_out,detail:s.detail})}
  const del=async(id:number)=>{if(confirm('Удалить смену?')){await fetch('/api/sessions',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({id})});load()}}
  return <section><Title sub="Даты, тип программы, руководители, цвет, метка 'мест мало' и статус 'укомплектована'.">Смены</Title><Toast msg={msg}/><div style={S.card}><div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:12}}><Field label="Даты" v={form.dates} set={v=>setForm({...form,dates:v})}/><Field label="Руководители" v={form.leaders} set={v=>setForm({...form,leaders:v})}/><Field label="Название RU" v={form.type_ru} set={v=>setForm({...form,type_ru:v})}/><Field label="Название EN" v={form.type_en} set={v=>setForm({...form,type_en:v})}/><Field label="Название ET" v={form.type_et} set={v=>setForm({...form,type_et:v})}/><div><label style={S.label}>Тип</label><select style={S.input} value={form.detail} onChange={e=>setForm({...form,detail:e.target.value})}><option value="surf">Серфинг</option><option value="kino">Серфинг + Кино</option><option value="pohod">Серфинг + Поход</option></select></div><Field label="Цвет" v={form.color} set={v=>setForm({...form,color:v})}/><div style={{display:'flex',gap:18,alignItems:'center',paddingTop:24}}><label><input type="checkbox" checked={form.hot} onChange={e=>setForm({...form,hot:e.target.checked})}/> Мест мало</label><label><input type="checkbox" checked={form.sold_out} onChange={e=>setForm({...form,sold_out:e.target.checked})}/> Укомплектована</label></div></div><button style={{...S.btn('#0B3D6B'),marginTop:14}} onClick={save}>{editing?'Сохранить':'Добавить смену'}</button></div>{items.map(s=><div key={s.id} style={{...S.card,display:'flex',alignItems:'center',gap:12}}><div style={{width:8,height:50,borderRadius:8,background:s.color}}/><div style={{flex:1}}><strong>{s.dates}</strong><div style={{fontSize:13,color:'#6B8AA0'}}>{s.type_ru} · {s.leaders} {s.hot?'· мест мало':''} {s.sold_out?'· укомплектована':''}</div></div><button style={S.btn('#e0f2fe','#0B3D6B')} onClick={()=>edit(s)}>Изменить</button><button style={S.btn('#fee2e2','#dc2626')} onClick={()=>del(s.id)}>Удалить</button></div>)}</section>
}

function MediaTab() {
  const [items,setItems]=useState<MediaItem[]>([])
  const [form,setForm]=useState({url:'',section:'water',media_type:'image',poster_url:'',title:''})
  const [msg,setMsg]=useState('')
  const load=async()=>{const d=await fetch('/api/gallery').then(r=>r.json()).catch(()=>[]); if(Array.isArray(d)) setItems(d)}
  useEffect(()=>{load()},[])
  const add=async()=>{if(!form.url)return; await fetch('/api/gallery',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...form,sort_order:items.length+1})}); setForm({...form,url:'',poster_url:'',title:''}); setMsg('Медиа добавлено'); load(); setTimeout(()=>setMsg(''),2500)}
  const del=async(id:number)=>{if(confirm('Удалить медиа?')){await fetch('/api/gallery',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({id})});load()}}
  return <section><Title sub="Новый формат галереи: фото и видео. Для видео обязательно ставь poster, чтобы на телефоне не было чёрного экрана.">Фото / видео</Title><Toast msg={msg}/><div style={S.card}><div style={{display:'grid',gridTemplateColumns:'1.2fr .7fr .7fr',gap:12}}><Field label="URL файла" v={form.url} set={v=>setForm({...form,url:v})}/><div><label style={S.label}>Тип</label><select style={S.input} value={form.media_type} onChange={e=>setForm({...form,media_type:e.target.value})}><option value="image">Фото</option><option value="video">Видео</option></select></div><div><label style={S.label}>Секция</label><select style={S.input} value={form.section} onChange={e=>setForm({...form,section:e.target.value})}>{mediaSections.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></div><Field label="Poster для видео" v={form.poster_url} set={v=>setForm({...form,poster_url:v})}/><Field label="Подпись / alt" v={form.title} set={v=>setForm({...form,title:v})}/></div><button style={{...S.btn('#0B3D6B'),marginTop:14}} onClick={add}>Добавить</button></div><div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))',gap:12}}>{items.map(m=><div key={m.id} style={{...S.card,padding:10,margin:0}}>{m.media_type==='video'?<video src={m.url} poster={m.poster_url||undefined} controls style={{width:'100%',height:110,objectFit:'cover',borderRadius:10}}/>:<img src={m.url} alt="" style={{width:'100%',height:110,objectFit:'cover',borderRadius:10}}/>}<div style={{fontSize:11,color:'#6B8AA0',marginTop:6,wordBreak:'break-all'}}>{m.media_type||'image'} · {m.section}<br/>{m.url}</div><button style={{...S.btn('#fee2e2','#dc2626'),marginTop:8,width:'100%'}} onClick={()=>del(m.id)}>Удалить</button></div>)}</div></section>
}

function PricingTab() {
  return <SettingsEditor title="Цены" sub="Цена 3/4/5 дней и счетчики мест." keys={[['price_3day','Цена 3 дня'],['price_4day','Цена 4 дня'],['price_5day','Цена 5 дней'],['spots_taken','Мест занято'],['spots_total','Мест всего'],['group_size','Размер группы']]}/>
}

function SeoTab() {
  return <SettingsEditor title="SEO / CTA" sub="Title, description, ссылки CTA, телефон, Telegram, ближайшая смена." keys={[['seo_title','SEO title'],['seo_description','Meta description'],['og_title','Open Graph title'],['og_description','Open Graph description'],['registration_url','Ссылка Записать ребёнка'],['question_url','Ссылка Задать вопрос'],['phone','Телефон'],['telegram','Telegram'],['next_session_date','Ближайшая смена коротко'],['next_session_date_full','Ближайшая смена полностью']]}/>
}

function SettingsEditor({title,sub,keys}:{title:string;sub:string;keys:[string,string][]}) {
  const [s,setS]=useState<Record<string,string>>({})
  const [msg,setMsg]=useState('')
  const load=async()=>{const d=await fetch('/api/settings').then(r=>r.json()).catch(()=>({})); setS(d||{})}
  useEffect(()=>{load()},[])
  const save=async()=>{await fetch('/api/settings',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({settings:s})});setMsg('Сохранено');setTimeout(()=>setMsg(''),2500)}
  return <section><Title sub={sub}>{title}</Title><Toast msg={msg}/><div style={S.card}>{keys.map(([k,l])=><Field key={k} label={l} v={s[k]||''} set={v=>setS({...s,[k]:v})}/>) }<button style={S.btn('#0B3D6B')} onClick={save}>Сохранить</button></div></section>
}

function ContentTab() {
  const [items,setItems]=useState<ContentItem[]>([])
  const [query,setQuery]=useState('')
  const [group,setGroup]=useState('all')
  const [msg,setMsg]=useState('')
  const load=async()=>{
    const d=await fetch('/api/content').then(r=>r.json()).catch(()=>[])
    if(Array.isArray(d)&&d.length){setItems(d);return}
    const seed=await fetch('/site-content-seed.json').then(r=>r.json()).catch(()=>contentSeed)
    setItems(Array.isArray(seed)&&seed.length?seed:contentSeed)
  }
  useEffect(()=>{load()},[])
  const setItem=(i:number,patch:Partial<ContentItem>)=>setItems(items.map((it,idx)=>idx===i?{...it,...patch}:it))
  const save=async()=>{await fetch('/api/content',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({items})});setMsg('Тексты сохранены');setTimeout(()=>setMsg(''),2500)}
  const groups=Array.from(new Set(items.map(i=>i.group_name||'Site text')))
  const filtered=items.filter(it=>{
    const q=query.trim().toLowerCase()
    const okGroup=group==='all'||it.group_name===group
    const okQuery=!q||[it.key,it.label,it.value_ru,it.value_en,it.value_et,it.group_name].join(' ').toLowerCase().includes(q)
    return okGroup&&okQuery
  })
  return <section>
    <Title sub="Все строки из главной страницы. Меняешь букву или предложение здесь - сохраняешь - сайт подтягивает значение из Supabase.">Тексты сайта</Title>
    <Toast msg={msg}/>
    <div style={{...S.card,position:'sticky',top:0,zIndex:5,display:'grid',gridTemplateColumns:'1fr 220px auto',gap:12,alignItems:'end'}}>
      <div><label style={S.label}>Поиск по ключу / слову / предложению</label><input style={S.input} value={query} onChange={e=>setQuery(e.target.value)} placeholder="Например: hero, цена, Записаться, text_128"/></div>
      <div><label style={S.label}>Секция</label><select style={S.input} value={group} onChange={e=>setGroup(e.target.value)}><option value="all">Все секции</option>{groups.map(g=><option key={g} value={g}>{g}</option>)}</select></div>
      <button style={S.btn('#0B3D6B')} onClick={save}>Сохранить всё</button>
      <div style={{gridColumn:'1 / -1',fontSize:12,color:'#6B8AA0'}}>Всего строк: {items.length}. Показано: {filtered.length}.</div>
    </div>
    {filtered.map((it)=><div key={it.key} style={S.card}>
      <div style={{display:'flex',justifyContent:'space-between',gap:12,alignItems:'center',marginBottom:10}}>
        <div><strong style={{color:'#0B3D6B'}}>{it.group_name} / {it.label}</strong><div style={{fontSize:11,color:'#6B8AA0'}}>{it.key}</div></div>
        <button style={S.btn('#e0f2fe','#0B3D6B')} onClick={()=>navigator.clipboard?.writeText(it.key)}>Копировать ключ</button>
      </div>
      <Text label="RU" v={it.value_ru} set={v=>setItems(items.map(row=>row.key===it.key?{...row,value_ru:v}:row))}/>
      <Text label="EN" v={it.value_en} set={v=>setItems(items.map(row=>row.key===it.key?{...row,value_en:v}:row))}/>
      <Text label="ET" v={it.value_et} set={v=>setItems(items.map(row=>row.key===it.key?{...row,value_et:v}:row))}/>
    </div>)}
  </section>
}

function FaqTab() {
  const blank={question_ru:'',answer_ru:'',question_en:'',answer_en:'',question_et:'',answer_et:'',sort_order:0,active:true}
  const [items,setItems]=useState<FaqItem[]>([])
  const [form,setForm]=useState<any>(blank)
  const [editing,setEditing]=useState<number|null>(null)
  const load=async()=>{const d=await fetch('/api/faqs').then(r=>r.json()).catch(()=>[]); if(Array.isArray(d)) setItems(d)}
  useEffect(()=>{load()},[])
  const save=async()=>{await fetch('/api/faqs',{method:editing?'PATCH':'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...form,id:editing,sort_order:form.sort_order||items.length+1})});setForm(blank);setEditing(null);load()}
  const del=async(id:number)=>{if(confirm('Удалить вопрос?')){await fetch('/api/faqs',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({id})});load()}}
  return <section><Title sub="Вопросы-ответы на сайте. Управляются из базы и отображаются на лендинге.">FAQ</Title><div style={S.card}><Text label="Вопрос RU" v={form.question_ru} set={v=>setForm({...form,question_ru:v})}/><Text label="Ответ RU" v={form.answer_ru} set={v=>setForm({...form,answer_ru:v})}/><Text label="Question EN" v={form.question_en} set={v=>setForm({...form,question_en:v})}/><Text label="Answer EN" v={form.answer_en} set={v=>setForm({...form,answer_en:v})}/><Text label="Question ET" v={form.question_et} set={v=>setForm({...form,question_et:v})}/><Text label="Answer ET" v={form.answer_et} set={v=>setForm({...form,answer_et:v})}/><label><input type="checkbox" checked={form.active} onChange={e=>setForm({...form,active:e.target.checked})}/> Активен</label><br/><button style={{...S.btn('#0B3D6B'),marginTop:12}} onClick={save}>{editing?'Сохранить':'Добавить FAQ'}</button></div>{items.map(f=><div key={f.id} style={S.card}><strong>{f.question_ru}</strong><p>{f.answer_ru}</p><button style={S.btn('#e0f2fe','#0B3D6B')} onClick={()=>{setEditing(f.id);setForm(f)}}>Изменить</button> <button style={S.btn('#fee2e2','#dc2626')} onClick={()=>del(f.id)}>Удалить</button></div>)}</section>
}

function Field({label,v,set}:{label:string;v:string;set:(v:string)=>void}) { return <div style={{marginBottom:12}}><label style={S.label}>{label}</label><input style={S.input} value={v} onChange={e=>set(e.target.value)}/></div> }
function Text({label,v,set}:{label:string;v:string;set:(v:string)=>void}) { return <div style={{marginBottom:12}}><label style={S.label}>{label}</label><textarea style={S.area} value={v} onChange={e=>set(e.target.value)}/></div> }
