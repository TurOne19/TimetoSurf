import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET() {
  const { data, error } = await supabase
    .from('faqs')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data || [])
}

export async function POST(req: Request) {
  const body = await req.json()
  const { question_ru, answer_ru, question_en, answer_en, question_et, answer_et, sort_order, active } = body

  if (!question_ru || !answer_ru) return Response.json({ error: 'Missing required fields' }, { status: 400 })

  const { data, error } = await supabase
    .from('faqs')
    .insert([{
      question_ru,
      answer_ru,
      question_en: question_en || question_ru,
      answer_en: answer_en || answer_ru,
      question_et: question_et || question_ru,
      answer_et: answer_et || answer_ru,
      sort_order: sort_order || 0,
      active: active !== false,
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
    .from('faqs')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ success: true })
}

export async function DELETE(req: Request) {
  const body = await req.json()
  const { id } = body

  if (!id) return Response.json({ error: 'Missing id' }, { status: 400 })

  const { error } = await supabase
    .from('faqs')
    .delete()
    .eq('id', id)

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ success: true })
}
