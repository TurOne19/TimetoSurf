import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

const stripLeaderColumns = (row: Record<string, unknown>) => {
  const { leaders_ru, leaders_en, leaders_et, ...rest } = row
  return rest
}

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
  const { dates, type_ru, type_en, type_et, color, leaders, leaders_ru, leaders_en, leaders_et, hot, sold_out, detail, sort_order } = body

  if (!dates || !type_ru) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const row = { dates, type_ru, type_en: type_en || type_ru, type_et: type_et || type_ru, color: color || '#1A6BAA', leaders: leaders || leaders_ru || '', leaders_ru: leaders_ru || leaders || '', leaders_en: leaders_en || leaders_ru || leaders || '', leaders_et: leaders_et || leaders_ru || leaders || '', hot: hot || false, sold_out: sold_out || false, detail: detail || 'surf', sort_order: Number(sort_order) || 0 }
  let { data, error } = await supabase
    .from('camp_sessions')
    .insert([row])
    .select()
    .single()

  if (error && /leaders_(ru|en|et)/.test(error.message)) {
    const retry = await supabase
      .from('camp_sessions')
      .insert([stripLeaderColumns(row)])
      .select()
      .single()
    data = retry.data
    error = retry.error
  }

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

  let { error } = await supabase
    .from('camp_sessions')
    .update(cleanUpdates)
    .eq('id', id)

  if (error && /leaders_(ru|en|et)/.test(error.message)) {
    const retry = await supabase
      .from('camp_sessions')
      .update(stripLeaderColumns(cleanUpdates))
      .eq('id', id)
    error = retry.error
  }

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
