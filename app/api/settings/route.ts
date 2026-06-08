import { supabase } from '@/lib/supabase'

export async function GET() {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')

  if (error) return Response.json({ error: error.message }, { status: 500 })

  // Convert array to object
  const settings: Record<string, string> = {}
  if (data) data.forEach((row: { key: string; value: string }) => { settings[row.key] = row.value })

  return Response.json(settings)
}

export async function POST(req: Request) {
  const body = await req.json()
  const { key, value } = body

  if (!key || value === undefined) {
    return Response.json({ error: 'Missing key or value' }, { status: 400 })
  }

  const { error } = await supabase
    .from('site_settings')
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' })

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ success: true })
}

export async function PATCH(req: Request) {
  const body = await req.json()
  // Batch update: { settings: { key: value, ... } }
  const { settings } = body

  if (!settings || typeof settings !== 'object') {
    return Response.json({ error: 'Missing settings' }, { status: 400 })
  }

  const rows = Object.entries(settings).map(([key, value]) => ({
    key,
    value: String(value),
    updated_at: new Date().toISOString()
  }))

  const { error } = await supabase
    .from('site_settings')
    .upsert(rows, { onConflict: 'key' })

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ success: true })
}
