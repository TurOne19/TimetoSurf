import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET() {
  const { data, error } = await supabase
    .from('gallery_photos')
    .select('*')
    .order('section')
    .order('sort_order')

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data)
}

export async function POST(req: Request) {
  const body = await req.json()
  const { url, section, sort_order } = body

  if (!url) return Response.json({ error: 'Missing url' }, { status: 400 })

  const { data, error } = await supabase
    .from('gallery_photos')
    .insert([{ url, section: section || 'moments', sort_order: sort_order || 0 }])
    .select()
    .single()

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data, { status: 201 })
}

export async function PATCH(req: Request) {
  const body = await req.json()
  const { id, url, section, sort_order } = body

  if (!id) return Response.json({ error: 'Missing id' }, { status: 400 })

  const { error } = await supabase
    .from('gallery_photos')
    .update({
      url,
      section: section || 'moments',
      sort_order: sort_order ?? 0,
    })
    .eq('id', id)

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ success: true })
}

export async function DELETE(req: Request) {
  const body = await req.json()
  const { id } = body

  if (!id) return Response.json({ error: 'Missing id' }, { status: 400 })

  const { error } = await supabase
    .from('gallery_photos')
    .delete()
    .eq('id', id)

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ success: true })
}
