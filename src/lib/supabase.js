import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://oqljvlibccryyykdjohv.supabase.co'
const supabaseKey = 'sb_publishable_9pg_3719JWAREiUBA59uQw_pAfMH4-h'

export const supabase = createClient(supabaseUrl, supabaseKey)
