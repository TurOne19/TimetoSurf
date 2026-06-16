import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET() {
  const { data, error } = await supabase
    .from('site_content')
    .select('*')
    .order('group_name')
    .order('sort_order')

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data || [])
}

export async function PATCH(req: Request) {
  const body = await req.json()
  const { items } = body

  if (!Array.isArray(items)) return Response.json({ error: 'Missing items' }, { status: 400 })

  const rows = items
    .filter((item) => item && item.key)
    .map((item) => ({
      key: String(item.key),
      label: String(item.label || item.key),
      group_name: String(item.group_name || 'content'),
      value_ru: String(item.value_ru || ''),
      value_en: String(item.value_en || ''),
      value_et: String(item.value_et || ''),
      sort_order: Number(item.sort_order || 0),
      updated_at: new Date().toISOString(),
    }))

  const { error } = await supabase
    .from('site_content')
    .upsert(rows, { onConflict: 'key' })

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ success: true })
}
