import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

const fields = ['program','name_ru','name_en','name_et','bio_ru','bio_en','bio_et','avatar_url','sort_order','active'] as const

function clean(body: Record<string, unknown>) {
  const data: Record<string, unknown> = {}
  fields.forEach(key => { if (body[key] !== undefined) data[key] = body[key] })
  return data
}

export async function GET() {
  const { data, error } = await supabase.from('program_instructors').select('*').order('program').order('sort_order').order('id')
  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data || [])
}

export async function POST(req: Request) {
  const body = await req.json()
  if (!body.name_ru || !body.program || !body.avatar_url) return Response.json({ error: 'Program, name_ru and avatar_url are required' }, { status: 400 })
  const { data, error } = await supabase.from('program_instructors').insert([clean(body)]).select().single()
  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data, { status: 201 })
}

export async function PATCH(req: Request) {
  const body = await req.json()
  if (!body.id) return Response.json({ error: 'Missing id' }, { status: 400 })
  const { data, error } = await supabase.from('program_instructors').update({...clean(body),updated_at:new Date().toISOString()}).eq('id', body.id).select().single()
  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data)
}

export async function DELETE(req: Request) {
  const { id } = await req.json()
  if (!id) return Response.json({ error: 'Missing id' }, { status: 400 })
  const { error } = await supabase.from('program_instructors').delete().eq('id', id)
  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ success: true })
}
