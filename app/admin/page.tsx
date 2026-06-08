'use client'
import { useState, useEffect } from 'react'

interface Review {
  id: number
  name: string
  text: string
  program?: string
  rating: number
  approved: boolean
  created_at: string
}

export default function AdminPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('pending')

  const fetchReviews = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/reviews/admin')
      const data = await res.json()
      if (Array.isArray(data)) setReviews(data)
    } catch {}
    setLoading(false)
  }

  useEffect(() => { fetchReviews() }, [])

  const approve = async (id: number) => {
    await fetch(`/api/reviews/admin`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, approved: true })
    })
    fetchReviews()
  }

  const reject = async (id: number) => {
    if (!confirm('Удалить этот отзыв?')) return
    await fetch(`/api/reviews/admin`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
    fetchReviews()
  }

  const filtered = reviews.filter(r => {
    if (filter === 'pending') return !r.approved
    if (filter === 'approved') return r.approved
    return true
  })

  const pending = reviews.filter(r => !r.approved).length

  return (
    <div style={{minHeight:'100vh',background:'#f8fafc',fontFamily:'system-ui,sans-serif'}}>
      <div style={{background:'#0B3D6B',padding:'20px 40px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div>
          <div style={{color:'white',fontSize:20,fontWeight:700}}>Time to Surf — Админка</div>
          <div style={{color:'rgba(255,255,255,.5)',fontSize:12,marginTop:2}}>Управление отзывами</div>
        </div>
        <a href="/" style={{color:'rgba(255,255,255,.6)',fontSize:13,textDecoration:'none'}}>← На сайт</a>
      </div>

      <div style={{maxWidth:800,margin:'0 auto',padding:'32px 24px'}}>
        <div style={{display:'flex',gap:8,marginBottom:24}}>
          {(['pending','approved','all'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding:'8px 18px',borderRadius:8,border:'none',cursor:'pointer',fontWeight:600,fontSize:13,
              background: filter===f ? '#0B3D6B' : 'white',
              color: filter===f ? 'white' : '#344E63',
              boxShadow:'0 1px 4px rgba(0,0,0,.08)'
            }}>
              {f==='pending' ? `Ожидают (${pending})` : f==='approved' ? 'Опубликованные' : 'Все'}
            </button>
          ))}
          <button onClick={fetchReviews} style={{marginLeft:'auto',padding:'8px 16px',borderRadius:8,border:'1px solid #D4E6F1',background:'white',cursor:'pointer',fontSize:13,color:'#344E63'}}>
            Обновить
          </button>
        </div>

        {loading ? (
          <div style={{textAlign:'center',padding:60,color:'#888'}}>Загрузка...</div>
        ) : filtered.length === 0 ? (
          <div style={{textAlign:'center',padding:60,color:'#888',background:'white',borderRadius:12}}>
            {filter === 'pending' ? 'Нет отзывов на проверке 🎉' : 'Отзывов нет'}
          </div>
        ) : (
          <div style={{display:'flex',flexDirection:'column',gap:12}}>
            {filtered.map(r => (
              <div key={r.id} style={{
                background:'white',borderRadius:12,padding:20,
                border: r.approved ? '2px solid #D4E6F1' : '2px solid #F5A623',
                boxShadow:'0 2px 8px rgba(0,0,0,.06)'
              }}>
                <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:12,flexWrap:'wrap'}}>
                  <div style={{flex:1}}>
                    <div style={{display:'flex',gap:10,alignItems:'center',marginBottom:6,flexWrap:'wrap'}}>
                      <span style={{fontWeight:700,fontSize:15,color:'#0B3D6B'}}>{r.name}</span>
                      {r.program && <span style={{fontSize:11,background:'#EEF6FF',color:'#0B3D6B',padding:'2px 8px',borderRadius:20,fontWeight:600}}>{r.program}</span>}
                      <span style={{color:'#F5A623',fontSize:14}}>{'★'.repeat(r.rating)}</span>
                      <span style={{fontSize:11,color:'#aaa'}}>
                        {new Date(r.created_at).toLocaleDateString('ru-RU')}
                      </span>
                    </div>
                    <p style={{fontSize:14,color:'#344E63',lineHeight:1.7,margin:0}}>"{r.text}"</p>
                  </div>
                  <div style={{display:'flex',gap:8,flexShrink:0}}>
                    {!r.approved && (
                      <button onClick={() => approve(r.id)} style={{
                        padding:'8px 16px',background:'#16A34A',color:'white',border:'none',
                        borderRadius:8,cursor:'pointer',fontWeight:600,fontSize:13
                      }}>✓ Опубликовать</button>
                    )}
                    <button onClick={() => reject(r.id)} style={{
                      padding:'8px 14px',background:'#fee2e2',color:'#dc2626',border:'none',
                      borderRadius:8,cursor:'pointer',fontWeight:600,fontSize:13
                    }}>✕ Удалить</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
