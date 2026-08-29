// GET /api/ordenes/estado?codigo=MAWA-XXXXXX
// Devuelve únicamente el estado de un código exacto — lo usa /exito para el
// polling de confirmación. Reemplaza el SELECT anónimo del navegador sobre
// codigos_plan (cerrado en el lockdown de RLS): el cliente solo puede
// preguntar por un código que ya conoce, y solo recibe el estado.
import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

const PATRON_CODIGO = /^MAWA-[A-Z0-9]{6}$/

export async function GET(request: NextRequest) {
  try {
    const admin = getSupabaseAdmin()
    if (!admin) {
      return NextResponse.json({ ok: false, error: 'Tienda en configuración' }, { status: 500 })
    }

    const codigo = (request.nextUrl.searchParams.get('codigo') || '').toUpperCase()
    if (!PATRON_CODIGO.test(codigo)) {
      return NextResponse.json({ ok: false, error: 'Código inválido' }, { status: 400 })
    }

    const { data, error } = await admin
      .from('codigos_plan')
      .select('estado')
      .eq('codigo', codigo)
      .maybeSingle()

    if (error) {
      console.error('[Ordenes] Error consultando estado:', error.message)
      return NextResponse.json({ ok: false, error: 'Error consultando' }, { status: 500 })
    }
    if (!data) {
      return NextResponse.json({ ok: false, error: 'No existe' }, { status: 404 })
    }

    return NextResponse.json({ ok: true, estado: data.estado })
  } catch (err: any) {
    console.error('[Ordenes] Error:', err?.message || err)
    return NextResponse.json({ ok: false, error: 'Error interno' }, { status: 500 })
  }
}
