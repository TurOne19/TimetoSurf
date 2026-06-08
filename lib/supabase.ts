import { createClient } from '@supabase/supabase-js'

// Supabase credentials
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://imzgzsbvgjudrzksbnow.supabase.co'
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_hndAXpi6MplIOgMx_SLlKw_h4wrcNOb'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
