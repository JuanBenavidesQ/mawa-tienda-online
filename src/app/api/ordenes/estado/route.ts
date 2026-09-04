// GET /api/ordenes/estado?codigo=MAWA-XXXXXX
// Devuelve el estado de un código exacto y el resumen mínimo de la compra —
// lo usa /exito para el polling de confirmación y para reportar la compra a
// Meta/GA4 con su valor real (el navegador nunca conoce el monto por otra vía
// desde que el total se calcula en el servidor). Reemplaza el SELECT anónimo
// sobre codigos_plan (cerrado en el lockdown de RLS): el cliente solo puede
// preguntar por un código que ya conoce y no recibe datos personales.
import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

const PATRON_CODIGO = /^MAWA-[A-Z0-9]{6}$/

type ItemNota = { key?: string; nombre?: string; cantidad?: number; precioUnitario?: number }

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
      .select('estado, monto, plan_nombre, num_personas, fecha_visita, valido_hasta, notas')
      .eq('codigo', codigo)
      .maybeSingle()

    if (error) {
      console.error('[Ordenes] Error consultando estado:', error.message)
      return NextResponse.json({ ok: false, error: 'Error consultando' }, { status: 500 })
    }
    if (!data) {
      return NextResponse.json({ ok: false, error: 'No existe' }, { status: 404 })
    }

    // El detalle de items se guardó como JSON en `notas` al crear la orden.
    let items: { key: string; nombre: string; cantidad: number; precioUnitario: number }[] = []
    try {
      const parsed = data.notas ? (JSON.parse(data.notas) as ItemNota[]) : []
      if (Array.isArray(parsed)) {
        items = parsed
          .filter((i) => i && typeof i.key === 'string')
          .map((i) => ({
            key: String(i.key),
            nombre: String(i.nombre ?? i.key),
            cantidad: Number(i.cantidad) || 1,
            precioUnitario: Number(i.precioUnitario) || 0,
          }))
      }
    } catch {
      // notas no era JSON (órdenes viejas): sin detalle, el valor total basta
    }

    return NextResponse.json({
      ok: true,
      estado: data.estado,
      monto: Number(data.monto) || 0,
      planNombre: data.plan_nombre ?? null,
      personas: Number(data.num_personas) || null,
      fechaVisita: data.fecha_visita ?? null,
      validoHasta: data.valido_hasta ?? null,
      items,
    })
  } catch (err: any) {
    console.error('[Ordenes] Error:', err?.message || err)
    return NextResponse.json({ ok: false, error: 'Error interno' }, { status: 500 })
  }
}
