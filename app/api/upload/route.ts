import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

const BUCKET = 'gallery'

export async function POST(req: Request) {
  const form = await req.formData()
  const file = form.get('file')
  const kind = String(form.get('kind') || 'media')

  if (!(file instanceof File)) {
    return Response.json({ error: 'Файл не выбран' }, { status: 400 })
  }

  const ext = file.name.split('.').pop()?.toLowerCase() || 'bin'
  const safeName = file.name
    .replace(/\.[^.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'upload'
  const path = `${kind}/${Date.now()}-${safeName}.${ext}`

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, {
      cacheControl: '31536000',
      contentType: file.type || undefined,
      upsert: false,
    })

  if (error) {
    return Response.json({
      error: `${error.message}. Проверь, что в Supabase есть public bucket "gallery" и политики Storage для upload/select.`,
    }, { status: 500 })
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return Response.json({ url: data.publicUrl, path })
}
