// POST /api/ordenes — crea la orden de compra SERVER-SIDE.
//
// Seguridad (Sprint 2, 2026-08-29): antes el navegador insertaba directo en
// codigos_plan con el anon key y mandaba el monto que quisiera (y el endpoint
// de hash firmaba cualquier cifra). Ahora el navegador solo dice QUÉ planes y
// CUÁNTOS; el precio se calcula aquí desde planes_tipo, la fila se inserta con
// el service role, y el hash de integridad de Bold se genera en el mismo paso
// con el total real. El anon key ya no puede tocar codigos_plan (RLS lockdown).
//
// DELETE /api/ordenes?codigo=MAWA-XXXXXX — cancela una orden NO pagada
// (estado PENDIENTE_PAGO, tipo_venta WEB) cuando el cliente vuelve a editar.
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { customAlphabet } from 'nanoid'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { calcularFechaVencimiento } from '@/lib/fechas'
import { cargarFechasCerradas, cierreDelDia } from '@/lib/fechasCerradas'

const generarId = customAlphabet('ABCDEFGHJKLMNPQRSTUVWXYZ23456789', 6)

const MAX_POR_PLAN = 10 // mismo tope que la UI (grupos grandes → contacto directo)
const MAX_PERSONAS = 20
const MAX_ORDENES_POR_CELULAR_HORA = 5
const MAX_DIAS_ANTICIPACION = 120

const PATRON_CODIGO = /^MAWA-[A-Z0-9]{6}$/

export async function POST(request: NextRequest) {
  try {
    const admin = getSupabaseAdmin()
    if (!admin) {
      console.error('[Ordenes] SUPABASE_SERVICE_ROLE_KEY no configurada')
      return NextResponse.json(
        { ok: false, error: 'Tienda en configuración. Intenta más tarde.' },
        { status: 500 }
      )
    }

    const body = await request.json().catch(() => null)
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ ok: false, error: 'Solicitud inválida' }, { status: 400 })
    }

    const { selecciones, fechaVisita, nombre, celular, email, aceptaPolitica, aceptaMarketing } =
      body as {
        selecciones?: Record<string, unknown>
        fechaVisita?: string
        nombre?: string
        celular?: string
        email?: string
        aceptaPolitica?: boolean
        aceptaMarketing?: boolean
      }

    // ---- Validaciones de datos del cliente ----
    const nombreLimpio = String(nombre ?? '').trim()
    if (nombreLimpio.length < 2 || nombreLimpio.length > 80) {
      return NextResponse.json({ ok: false, error: 'Nombre inválido' }, { status: 400 })
    }

    const celularLimpio = String(celular ?? '').replace(/[\s()+-]/g, '')
    if (!/^\d{7,15}$/.test(celularLimpio)) {
      return NextResponse.json({ ok: false, error: 'Celular inválido' }, { status: 400 })
    }

    const emailLimpio = String(email ?? '').trim()
    if (emailLimpio && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailLimpio)) {
      return NextResponse.json({ ok: false, error: 'Email inválido' }, { status: 400 })
    }

    if (aceptaPolitica !== true) {
      return NextResponse.json(
        { ok: false, error: 'Debes aceptar la política de tratamiento de datos' },
        { status: 400 }
      )
    }

    // ---- Validación de fecha de visita ----
    const fecha = fechaVisita ? new Date(fechaVisita) : null
    if (!fecha || isNaN(fecha.getTime())) {
      return NextResponse.json({ ok: false, error: 'Fecha de visita inválida' }, { status: 400 })
    }
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)
    const limite = new Date(hoy)
    limite.setDate(limite.getDate() + MAX_DIAS_ANTICIPACION)
    if (fecha < hoy || fecha > limite) {
      return NextResponse.json({ ok: false, error: 'Fecha de visita fuera de rango' }, { status: 400 })
    }

    // ---- Validación de selecciones ----
    if (!selecciones || typeof selecciones !== 'object' || Array.isArray(selecciones)) {
      return NextResponse.json({ ok: false, error: 'Selección de planes inválida' }, { status: 400 })
    }
    const cantidades: Array<{ key: string; cantidad: number }> = []
    for (const [key, valor] of Object.entries(selecciones)) {
      const cantidad = Number(valor)
      if (!Number.isInteger(cantidad) || cantidad < 0 || cantidad > MAX_POR_PLAN) {
        return NextResponse.json({ ok: false, error: 'Cantidad inválida' }, { status: 400 })
      }
      if (cantidad > 0) cantidades.push({ key: String(key), cantidad })
    }
    if (cantidades.length === 0) {
      return NextResponse.json({ ok: false, error: 'No hay planes seleccionados' }, { status: 400 })
    }

    // ---- Precio SERVER-SIDE desde el catálogo (fuente única de verdad) ----
    const { data: planes, error: errPlanes } = await admin
      .from('planes_tipo')
      .select('key, nombre, precio_base, precio_web, tipo_tienda')
      .eq('activo', true)
      .eq('visible_tienda', true)

    if (errPlanes || !planes || planes.length === 0) {
      console.error('[Ordenes] Error cargando planes:', errPlanes?.message)
      return NextResponse.json(
        { ok: false, error: 'No se pudo cargar el catálogo. Intenta de nuevo.' },
        { status: 500 }
      )
    }

    const porKey = new Map(planes.map((p) => [p.key, p]))
    const detalle: Array<{ key: string; nombre: string; cantidad: number; precioUnitario: number; subtotal: number }> = []
    let total = 0
    let personas = 0

    for (const { key, cantidad } of cantidades) {
      const plan = porKey.get(key)
      if (!plan) {
        return NextResponse.json({ ok: false, error: `Plan no disponible: ${key}` }, { status: 400 })
      }
      const base = Number(plan.precio_base) || 0
      const web = plan.precio_web != null ? Number(plan.precio_web) : 0
      const precioUnitario = web > 0 && web < base ? web : base
      if (precioUnitario <= 0) {
        return NextResponse.json({ ok: false, error: `Plan sin precio: ${key}` }, { status: 400 })
      }
      const subtotal = precioUnitario * cantidad
      detalle.push({ key, nombre: plan.nombre, cantidad, precioUnitario, subtotal })
      total += subtotal
      personas += cantidad
    }

    // ---- Fechas cerradas (exclusividades): guarda server-side, además del
    // trigger de Supabase en codigos_plan. La tienda vende 1 noche por reserva.
    const cierres = await cargarFechasCerradas(admin)
    if (cierres.length > 0) {
      const tipos = new Set(cantidades.map((c) => porKey.get(c.key)?.tipo_tienda))
      const alcances = [tipos.has('alojamiento') && 'ALOJAMIENTO', tipos.has('pasadia') && 'PASADIA'].filter(Boolean) as Array<'ALOJAMIENTO' | 'PASADIA'>
      for (const alcance of alcances) {
        if (cierreDelDia(cierres, fecha, alcance)) {
          return NextResponse.json(
            { ok: false, error: 'Esa fecha no está disponible por un evento privado. Elige otra fecha o escríbenos por WhatsApp.' },
            { status: 409 }
          )
        }
      }
    }

    if (personas > MAX_PERSONAS) {
      return NextResponse.json(
        { ok: false, error: `Máximo ${MAX_PERSONAS} personas por compra. Para grupos grandes contáctanos.` },
        { status: 400 }
      )
    }

    // ---- Rate limit por celular (anti-abuso básico) ----
    const haceUnaHora = new Date(Date.now() - 60 * 60 * 1000).toISOString()
    const { count } = await admin
      .from('codigos_plan')
      .select('id', { count: 'exact', head: true })
      .eq('cliente_celular', celularLimpio)
      .eq('tipo_venta', 'WEB')
      .gte('created_at', haceUnaHora)
    if ((count ?? 0) >= MAX_ORDENES_POR_CELULAR_HORA) {
      return NextResponse.json(
        { ok: false, error: 'Demasiados intentos. Espera unos minutos e intenta de nuevo.' },
        { status: 429 }
      )
    }

    // ---- Crear la orden ----
    const codigo = `MAWA-${generarId()}`
    const vencimiento = calcularFechaVencimiento(fecha)
    const descripcionPlanes = detalle.map((d) => `${d.cantidad}x ${d.nombre}`).join(', ')

    const { error: errInsert } = await admin.from('codigos_plan').insert({
      codigo,
      plan_tipo_key: detalle.length === 1 ? detalle[0].key : 'MULTIPLE',
      plan_nombre: descripcionPlanes,
      monto: total,
      cliente_nombre: nombreLimpio.toUpperCase(),
      cliente_celular: celularLimpio,
      cliente_email: emailLimpio || null,
      num_personas: personas,
      fecha_venta: new Date().toISOString(),
      fecha_visita: fecha.toISOString(),
      valido_hasta: vencimiento.toISOString(),
      estado: 'PENDIENTE_PAGO',
      agente_nombre: 'VENTA_WEB',
      metodo_pago: 'BOLD_ONLINE',
      tipo_venta: 'WEB',
      sincronizado_local: false,
      notas: JSON.stringify(detalle),
      acepta_politica: true,
      acepta_marketing: aceptaMarketing === true,
    })

    if (errInsert) {
      console.error('[Ordenes] Error insertando orden:', errInsert.message)
      return NextResponse.json(
        { ok: false, error: 'Error al crear la orden. Intenta de nuevo.' },
        { status: 500 }
      )
    }

    // ---- Hash de integridad de Bold, con el TOTAL calculado aquí ----
    // Formato oficial: {orderId}{amount}{currency}{secretKey}
    const boldSecret = process.env.BOLD_SECRET_KEY || ''
    let hash: string | null = null
    if (boldSecret) {
      hash = crypto.createHash('sha256').update(`${codigo}${total}COP${boldSecret}`).digest('hex')
    } else {
      console.warn('[Ordenes] BOLD_SECRET_KEY no configurada — orden sin firma de integridad')
    }

    return NextResponse.json({
      ok: true,
      codigo,
      total,
      personas,
      detalle,
      validoHasta: vencimiento.toISOString(),
      hash,
    })
  } catch (err: any) {
    console.error('[Ordenes] Error:', err?.message || err)
    return NextResponse.json({ ok: false, error: 'Error interno' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const admin = getSupabaseAdmin()
    if (!admin) {
      return NextResponse.json({ ok: false, error: 'Tienda en configuración' }, { status: 500 })
    }

    const codigo = request.nextUrl.searchParams.get('codigo') || ''
    if (!PATRON_CODIGO.test(codigo)) {
      return NextResponse.json({ ok: false, error: 'Código inválido' }, { status: 400 })
    }

    // Solo órdenes web SIN pagar: una orden pagada o de agente jamás se borra aquí.
    const { error } = await admin
      .from('codigos_plan')
      .delete()
      .eq('codigo', codigo)
      .eq('estado', 'PENDIENTE_PAGO')
      .eq('tipo_venta', 'WEB')

    if (error) {
      console.error('[Ordenes] Error cancelando orden:', error.message)
      return NextResponse.json({ ok: false, error: 'Error al cancelar' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error('[Ordenes] Error:', err?.message || err)
    return NextResponse.json({ ok: false, error: 'Error interno' }, { status: 500 })
  }
}
