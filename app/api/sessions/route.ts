import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET() {
  const { data, error } = await supabase
    .from('camp_sessions')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('id', { ascending: true })

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data)
}

export async function POST(req: Request) {
  const body = await req.json()
  const { dates, type_ru, type_en, type_et, color, leaders, hot, sold_out, detail, sort_order } = body

  if (!dates || !type_ru) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('camp_sessions')
    .insert([{ dates, type_ru, type_en: type_en || type_ru, type_et: type_et || type_ru, color: color || '#1A6BAA', leaders: leaders || '', hot: hot || false, sold_out: sold_out || false, detail: detail || 'surf', sort_order: Number(sort_order) || 0 }])
    .select()
    .single()

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data, { status: 201 })
}

export async function PATCH(req: Request) {
  const body = await req.json()
  const { id, ...updates } = body

  if (!id) return Response.json({ error: 'Missing id' }, { status: 400 })

  const cleanUpdates = {
    ...updates,
    updated_at: new Date().toISOString(),
  }
  if (updates.sort_order !== undefined) cleanUpdates.sort_order = Number(updates.sort_order) || 0

  const { error } = await supabase
    .from('camp_sessions')
    .update(cleanUpdates)
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
