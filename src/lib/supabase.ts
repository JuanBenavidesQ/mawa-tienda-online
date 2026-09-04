import { createClient, SupabaseClient } from '@supabase/supabase-js'

let cliente: SupabaseClient | null | undefined

/**
 * Cliente Supabase con el anon key (solo lectura del catálogo `planes_tipo`).
 * Se crea de forma perezosa: si las variables no existen (p. ej. el entorno
 * de Preview de Vercel, o el prerender en build), devuelve null y quien lo
 * use cae al catálogo de respaldo en vez de romper el build con
 * "supabaseUrl is required".
 */
export function getSupabase(): SupabaseClient | null {
  if (cliente !== undefined) return cliente
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  cliente = url && key ? createClient(url, key) : null
  if (!cliente) console.warn('[Tienda] Supabase sin configurar: se usa el catálogo de respaldo')
  return cliente
}
