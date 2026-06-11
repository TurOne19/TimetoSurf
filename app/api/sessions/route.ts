import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET() {
  const { data, error } = await supabase
    .from('camp_sessions')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data)
}

export async function POST(req: Request) {
  const body = await req.json()
  const { dates, type_ru, type_en, type_et, color, leaders, hot, detail, sort_order, spots_left, capacity } = body

  if (!dates || !type_ru) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('camp_sessions')
    .insert([{
      dates,
      type_ru,
      type_en: type_en || type_ru,
      type_et: type_et || type_ru,
      color: color || '#0e7490',
      leaders: leaders || '',
      hot: hot || false,
      detail: detail || 'surf',
      sort_order: sort_order || 0,
      spots_left: spots_left ?? null,
      capacity: capacity ?? null,
    }])
    .select()
    .single()

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data, { status: 201 })
}

export async function PATCH(req: Request) {
  const body = await req.json()
  const { id, ...updates } = body

  if (!id) return Response.json({ error: 'Missing id' }, { status: 400 })

  const { error } = await supabase
    .from('camp_sessions')
    .update(updates)
    .eq('id', id)

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ success: true })
}

export async function DELETE(req: Request) {
  const body = await req.json()
  const { id } = body

  if (!id) return Response.json({ error: 'Missing id' }, { status: 400 })

  const { error } = await supabase
    .from('camp_sessions')
    .delete()
    .eq('id', id)

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ success: true })
}
