// Cliente Supabase con service role — SOLO para API routes (server-side).
// Bypasea RLS: jamás importar desde componentes de cliente. El anon key del
// navegador quedó únicamente para leer el catálogo (planes_tipo); todas las
// operaciones sobre codigos_plan pasan por aquí desde el lockdown de RLS
// (Sprint 2 de seguridad, 2026-08-29).
import { createClient, SupabaseClient } from '@supabase/supabase-js'

export function getSupabaseAdmin(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) return null
  return createClient(url, serviceKey, { auth: { persistSession: false } })
}
