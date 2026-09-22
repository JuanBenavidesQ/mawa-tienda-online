'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense, useEffect, useState } from 'react'
import { trackCompra, type ItemCompra } from '@/lib/analytics'
import { WHATSAPP_URL } from '@/lib/site'
import Header from '@/components/tienda/Header'
import Footer from '@/components/tienda/Footer'
import { IconoWhatsApp } from '@/components/tienda/Iconos'

type EstadoPago = 'consultando' | 'confirmado' | 'verificando'

type Resumen = {
  monto: number
  planNombre: string | null
  personas: number | null
  fechaVisita: string | null
  validoHasta: string | null
  items: ItemCompra[]
}

function ExitoContent() {
  const searchParams = useSearchParams()
  const codigo = searchParams.get('codigo') || 'MAWA-XXXXXX'
  const planParam = searchParams.get('plan') || 'Plan'
  const cantidadParam = parseInt(searchParams.get('cantidad') || '1')
  const fechaVisitaParam = searchParams.get('fechaVisita')

  // Estado del pago según el BACKEND (webhook de Bold), no según este navegador.
  // Esta página es SOLO-LECTURA: quien marca el código como pagado es el webhook
  // SALE_APPROVED de Bold en el backend. Aquí solo consultamos hasta verlo
  // confirmado (o nos rendimos a los 60 s y mostramos "en verificación" — el
  // código se activa igual por el webhook o la reconciliación del sync).
  const [estadoPago, setEstadoPago] = useState<EstadoPago>('consultando')
  const [resumen, setResumen] = useState<Resumen | null>(null)
  const [copiado, setCopiado] = useState(false)

  useEffect(() => {
    if (!codigo || codigo === 'MAWA-XXXXXX') {
      setEstadoPago('verificando')
      return
    }

    let cancelado = false
    const inicio = Date.now()

    async function consultarEstado() {
      try {
        // Consulta vía API route del servidor (el anon key ya no puede leer
        // codigos_plan tras el lockdown de RLS).
        const resp = await fetch(`/api/ordenes/estado?codigo=${encodeURIComponent(codigo)}`)
        const data = resp.ok ? await resp.json().catch(() => null) : null

        if (cancelado) return
        if (data?.ok) {
          const r: Resumen = {
            monto: Number(data.monto) || 0,
            planNombre: data.planNombre ?? null,
            personas: data.personas ?? null,
            fechaVisita: data.fechaVisita ?? null,
            validoHasta: data.validoHasta ?? null,
            items: Array.isArray(data.items) ? data.items : [],
          }
          setResumen(r)
          if (data.estado && data.estado !== 'PENDIENTE_PAGO') {
            setEstadoPago('confirmado')
            // Compra confirmada por el backend: se reporta a Meta/GA4 una sola vez.
            trackCompra(codigo, r.monto, r.items)
            return
          }
        }
      } catch (err) {
        console.error('Error consultando estado del pago:', err)
      }

      if (cancelado) return
      if (Date.now() - inicio < 60_000) {
        setTimeout(consultarEstado, 4000)
      } else {
        setEstadoPago('verificando')
      }
    }

    consultarEstado()
    return () => {
      cancelado = true
    }
  }, [codigo])

  const plan = resumen?.planNombre || planParam
  const cantidad = resumen?.personas || cantidadParam
  const fechaVisita = resumen?.fechaVisita
    ? new Date(resumen.fechaVisita)
    : fechaVisitaParam
      ? new Date(fechaVisitaParam)
      : null
  const validoHasta = resumen?.validoHasta ? new Date(resumen.validoHasta) : null

  const formatearFecha = (fecha: Date) =>
    fecha.toLocaleDateString('es-CO', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'America/Bogota',
    })

  const copiarCodigo = async () => {
    try {
      await navigator.clipboard.writeText(codigo)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2500)
    } catch {
      // Sin permiso de portapapeles: el código sigue visible para copiarlo a mano
    }
  }

  // Mostrar loading mientras se confirma el pago
  if (estadoPago === 'consultando') {
    return (
      <div className="min-h-screen flex flex-col">
        <Header solido />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-xl shadow-mawa-verde-900/10 p-8 max-w-md w-full text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mawa-verde-700 mx-auto mb-4"></div>
            <p className="text-mawa-gris">Confirmando tu pago...</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header solido />

      {/* Contenido */}
      <main className="flex-1 flex items-center justify-center p-4 py-10">
        <div className="bg-white rounded-3xl shadow-xl shadow-mawa-verde-900/10 p-6 sm:p-8 max-w-md w-full text-center">
          {/* Icono de éxito */}
          <div className="w-20 h-20 bg-mawa-crema rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-mawa-verde-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="font-display text-3xl font-bold text-mawa-verde-900 mb-2">
            ¡Compra exitosa!
          </h1>
          {estadoPago === 'confirmado' ? (
            <p className="text-mawa-gris mb-8">
              Tu entrada a Mawá está confirmada. Te enviamos el código por WhatsApp al celular que registraste.
            </p>
          ) : (
            <div className="bg-mawa-crema border border-mawa-arena/60 rounded-xl p-3 mb-8 text-left">
              <p className="text-sm text-mawa-ink">
                Tu pago está siendo verificado con el banco. Tu código quedará
                activo automáticamente en unos minutos y te lo enviaremos por
                WhatsApp. Guárdalo y preséntalo en la entrada con toda confianza.
              </p>
            </div>
          )}

          {/* Código */}
          <div className="bg-mawa-crema/70 rounded-2xl p-6 mb-6">
            <p className="text-sm text-mawa-verde-700 font-semibold mb-2">Tu código de acceso</p>
            <div className="bg-white rounded-xl p-4 border-2 border-dashed border-mawa-verde-500/60">
              <span className="text-2xl sm:text-3xl font-mono font-bold text-mawa-verde-900 tracking-wider whitespace-nowrap">
                {codigo}
              </span>
            </div>
          </div>

          {/* Detalles */}
          <div className="text-left bg-mawa-crema/40 rounded-xl p-4 mb-6">
            <div className="flex justify-between py-2 border-b border-mawa-verde-900/10">
              <span className="text-mawa-gris">Plan</span>
              <span className="font-medium text-mawa-ink text-right">{plan}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-mawa-verde-900/10">
              <span className="text-mawa-gris">Personas</span>
              <span className="font-medium text-mawa-ink">{cantidad}</span>
            </div>
            {fechaVisita && (
              <div className="flex justify-between py-2 border-b border-mawa-verde-900/10">
                <span className="text-mawa-gris">Fecha planeada</span>
                <span className="font-medium text-mawa-ink text-right text-sm">
                  {formatearFecha(fechaVisita)}
                </span>
              </div>
            )}
            {validoHasta && (
              <div className="flex justify-between py-2">
                <span className="text-mawa-gris">Válido hasta</span>
                <span className="font-medium text-mawa-ink text-right text-sm">
                  {formatearFecha(validoHasta)}
                </span>
              </div>
            )}
          </div>

          {/* Instrucciones */}
          <div className="bg-mawa-crema rounded-xl p-4 text-left mb-6">
            <h2 className="font-bold text-mawa-verde-900 mb-2">Importante</h2>
            <ul className="text-sm text-mawa-ink space-y-1">
              <li>1. Guarda o toma captura de este código.</li>
              <li>2. Preséntalo en la entrada de Mawá.</li>
              <li>3. Recibirás tu manilla de acceso.</li>
              <li>4. Puedes usarlo cualquier sábado, domingo o festivo hasta la fecha de validez.</li>
            </ul>
          </div>

          {/* Botones */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={copiarCodigo}
              className="w-full bg-mawa-gradient hover:brightness-110 text-white font-bold py-3 px-6 rounded-full transition"
            >
              {copiado ? '¡Código copiado!' : 'Copiar código'}
            </button>
            <a
              href={`${WHATSAPP_URL}?text=${encodeURIComponent(`Hola, compré en la tienda web y mi código es ${codigo}. Tengo una duda:`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-whatsapp hover:bg-[#1ebe5b] text-white font-semibold py-3 px-6 rounded-full transition-colors"
            >
              <IconoWhatsApp /> ¿Dudas? Escríbenos por WhatsApp
            </a>
            <Link href="/mi-codigo" className="block w-full text-mawa-gris hover:text-mawa-ink font-medium py-2 text-sm">
              ¿No te llegó el WhatsApp? Reenviar mi código
            </Link>
            <Link
              href="/"
              className="block w-full text-mawa-gris hover:text-mawa-ink font-medium py-2 text-sm"
            >
              Comprar otra entrada
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function ExitoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mawa-verde-700"></div>
      </div>
    }>
      <ExitoContent />
    </Suspense>
  )
}
