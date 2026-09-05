// POST /api/mi-codigo  { celular }
// "¿Perdiste tu código?": pide al backend de Mawá que reenvíe por WhatsApp los
// códigos web activos de ese celular. El navegador nunca habla con el backend
// ni ve la llave compartida; y aquí se limita el número de intentos por IP.
// Si el backend no responde, se devuelve `fallback: true` para que la página
// ofrezca escribir por WhatsApp.
import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = (process.env.BACKEND_URL || '').replace(/\/$/, '')
const TIENDA_API_KEY = process.env.TIENDA_API_KEY || ''

const intentosPorIp = new Map<string, { n: number; desde: number }>()
const VENTANA_MS = 60 * 60 * 1000
const MAX_POR_HORA = 10

export async function POST(request: NextRequest) {
  try {
    const ip = (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'desconocida'
    const ahora = Date.now()
    const reg = intentosPorIp.get(ip)
    if (reg && ahora - reg.desde < VENTANA_MS) {
      if (reg.n >= MAX_POR_HORA) {
        return NextResponse.json({ ok: false, error: 'Demasiados intentos. Intenta más tarde.' }, { status: 429 })
      }
      reg.n += 1
    } else {
      intentosPorIp.set(ip, { n: 1, desde: ahora })
    }

    const body = await request.json().catch(() => null)
    const celular = String(body?.celular ?? '').replace(/[\s()+-]/g, '')
    if (!/^\d{10,12}$/.test(celular)) {
      return NextResponse.json({ ok: false, error: 'Escribe un celular válido de 10 dígitos' }, { status: 400 })
    }

    if (!BACKEND_URL || !TIENDA_API_KEY) {
      return NextResponse.json({ ok: false, fallback: true })
    }

    const resp = await fetch(`${BACKEND_URL}/api/public/tienda/reenviar-codigo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-tienda-key': TIENDA_API_KEY },
      body: JSON.stringify({ celular }),
      signal: AbortSignal.timeout(12_000),
      cache: 'no-store',
    })
    const data = await resp.json().catch(() => null)
    if (resp.status === 429) {
      return NextResponse.json({ ok: false, error: data?.error || 'Demasiados intentos. Intenta en una hora.' }, { status: 429 })
    }
    if (!resp.ok || !data?.ok) {
      console.error('[MiCodigo] Backend respondió', resp.status, data?.error)
      return NextResponse.json({ ok: false, fallback: true })
    }
    return NextResponse.json({ ok: true, codigos: data.codigos ?? [], enviado: Boolean(data.enviado) })
  } catch (err) {
    console.error('[MiCodigo] Error:', err instanceof Error ? err.message : err)
    return NextResponse.json({ ok: false, fallback: true })
  }
}
