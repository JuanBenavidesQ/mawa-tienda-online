import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

// Llave secreta de Bold (variable de entorno del servidor - NO pública)
const BOLD_SECRET_KEY = process.env.BOLD_SECRET_KEY || ''

export async function POST(request: NextRequest) {
  try {
    const { orderId, amount, currency = 'COP' } = await request.json()

    // Validar campos requeridos
    if (!orderId || amount === undefined || amount === null) {
      return NextResponse.json(
        { ok: false, error: 'orderId y amount son requeridos' },
        { status: 400 }
      )
    }

    // Validar que la llave secreta esté configurada
    if (!BOLD_SECRET_KEY) {
      console.error('BOLD_SECRET_KEY no está configurada')
      return NextResponse.json(
        { ok: false, error: 'Pasarela de pagos no configurada' },
        { status: 500 }
      )
    }

    // Generar el hash SHA256
    // Formato: {orderId}{amount}{currency}{secretKey}
    const dataToHash = `${orderId}${amount}${currency}${BOLD_SECRET_KEY}`
    const hash = crypto.createHash('sha256').update(dataToHash).digest('hex')

    return NextResponse.json({
      ok: true,
      hash,
      orderId,
      amount,
      currency,
    })
  } catch (error: any) {
    console.error('Error generando hash de integridad:', error)
    return NextResponse.json(
      { ok: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
