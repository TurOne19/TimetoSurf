import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function PATCH(req: Request) {
  const body = await req.json()
  const { items } = body

  if (!Array.isArray(items)) {
    return Response.json({ error: 'Missing items' }, { status: 400 })
  }

  for (const item of items) {
    const id = Number(item.id)
    const sort_order = Number(item.sort_order)
    if (!id || !sort_order) continue

    const { error } = await supabase
      .from('camp_sessions')
      .update({ sort_order, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (error) return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json({ success: true })
}
