'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { trackCompra, type ItemCompra } from '@/lib/analytics'
import { WHATSAPP_URL } from '@/lib/site'

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
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex flex-col">
        <header className="bg-emerald-800 text-white py-3">
          <div className="max-w-6xl mx-auto px-4">
            <img src="/logo-mawa.png" alt="Mawá" className="h-12 w-auto rounded" />
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Confirmando tu pago...</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex flex-col">
      {/* Header */}
      <header className="bg-emerald-800 text-white py-3">
        <div className="max-w-6xl mx-auto px-4 flex items-center gap-3">
          <img src="/logo-mawa.png" alt="Mawá" className="h-12 w-auto rounded" />
          <span className="text-xl font-bold">Mawá</span>
        </div>
      </header>

      {/* Contenido */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
          {/* Icono de éxito */}
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            ¡Compra exitosa!
          </h1>
          {estadoPago === 'confirmado' ? (
            <p className="text-gray-600 mb-8">
              Tu entrada a Mawá está confirmada. Te enviamos el código por WhatsApp al celular que registraste.
            </p>
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-8 text-left">
              <p className="text-sm text-amber-800">
                Tu pago está siendo verificado con el banco. Tu código quedará
                activo automáticamente en unos minutos y te lo enviaremos por
                WhatsApp. Guárdalo y preséntalo en la entrada con toda confianza.
              </p>
            </div>
          )}

          {/* Código */}
          <div className="bg-emerald-50 rounded-2xl p-6 mb-6">
            <p className="text-sm text-emerald-600 font-medium mb-2">Tu código de acceso</p>
            <div className="bg-white rounded-xl p-4 border-2 border-dashed border-emerald-300">
              <span className="text-2xl sm:text-3xl font-mono font-bold text-emerald-700 tracking-wider whitespace-nowrap">
                {codigo}
              </span>
            </div>
          </div>

          {/* Detalles */}
          <div className="text-left bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">Plan</span>
              <span className="font-medium text-gray-800 text-right">{plan}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">Personas</span>
              <span className="font-medium text-gray-800">{cantidad}</span>
            </div>
            {fechaVisita && (
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Fecha planeada</span>
                <span className="font-medium text-gray-800 text-right text-sm">
                  {formatearFecha(fechaVisita)}
                </span>
              </div>
            )}
            {validoHasta && (
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Válido hasta</span>
                <span className="font-medium text-gray-800 text-right text-sm">
                  {formatearFecha(validoHasta)}
                </span>
              </div>
            )}
          </div>

          {/* Instrucciones */}
          <div className="bg-yellow-50 rounded-xl p-4 text-left mb-6">
            <h2 className="font-bold text-yellow-800 mb-2">Importante</h2>
            <ul className="text-sm text-yellow-700 space-y-1">
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
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl transition-colors"
            >
              {copiado ? '¡Código copiado!' : 'Copiar código'}
            </button>
            <a
              href={`${WHATSAPP_URL}?text=${encodeURIComponent(`Hola, compré en la tienda web y mi código es ${codigo}. Tengo una duda:`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-xl transition-colors"
            >
              ¿Dudas? Escríbenos por WhatsApp
            </a>
            <a
              href="/"
              className="block w-full text-gray-500 hover:text-gray-700 font-medium py-2 text-sm"
            >
              Comprar otra entrada
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 py-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm">
          <p>Te enviamos el código por WhatsApp al celular que registraste.</p>
          <p className="mt-2">&copy; 2026 Mawá · Km 37,5 vía Ipiales – Pasto</p>
        </div>
      </footer>
    </div>
  )
}

export default function ExitoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    }>
      <ExitoContent />
    </Suspense>
  )
}
