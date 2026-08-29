'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'

function ExitoContent() {
  const searchParams = useSearchParams()
  const codigo = searchParams.get('codigo') || 'MAWA-XXXXXX'
  const plan = searchParams.get('plan') || 'Plan'
  const cantidad = parseInt(searchParams.get('cantidad') || '1')
  const fechaVisitaStr = searchParams.get('fechaVisita')
  const validoHastaStr = searchParams.get('validoHasta')

  const fechaVisita = fechaVisitaStr ? new Date(fechaVisitaStr) : null
  const validoHasta = validoHastaStr ? new Date(validoHastaStr) : null

  // Estado del pago según el BACKEND (webhook de Bold), no según este navegador.
  // Esta página es SOLO-LECTURA: quien marca el código como pagado es el webhook
  // SALE_APPROVED de Bold en el backend. Aquí solo consultamos hasta verlo
  // confirmado (o nos rendimos a los 60s y mostramos "en verificación" — el
  // código se activa igual por el webhook o la reconciliación del sync).
  const [estadoPago, setEstadoPago] = useState<'consultando' | 'confirmado' | 'verificando'>('consultando')

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
        if (data?.ok && data.estado && data.estado !== 'PENDIENTE_PAGO') {
          setEstadoPago('confirmado')
          return
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

  const formatearFecha = (fecha: Date) => {
    return fecha.toLocaleDateString('es-CO', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  // Mostrar loading mientras se confirma el pago
  if (estadoPago === 'consultando') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex flex-col">
        <header className="bg-emerald-800 text-white py-3">
          <div className="max-w-6xl mx-auto px-4">
            <img src="/LogoMawaVerde.jpg" alt="Mawa" className="h-12 w-auto rounded" />
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
      <header className="bg-emerald-800 text-white py-4">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-2xl font-bold">MAWA</h1>
        </div>
      </header>

      {/* Contenido */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
          {/* Icono de exito */}
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Compra Exitosa
          </h2>
          {estadoPago === 'confirmado' ? (
            <p className="text-gray-600 mb-8">
              Tu entrada a Mawa esta confirmada
            </p>
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-8 text-left">
              <p className="text-sm text-amber-800">
                Tu pago esta siendo verificado con el banco. Tu codigo quedara
                activo automaticamente en unos minutos — guardalo y presentalo
                en la entrada con toda confianza.
              </p>
            </div>
          )}

          {/* Codigo */}
          <div className="bg-emerald-50 rounded-2xl p-6 mb-6">
            <p className="text-sm text-emerald-600 font-medium mb-2">Tu codigo de acceso</p>
            <div className="bg-white rounded-xl p-4 border-2 border-dashed border-emerald-300">
              <span className="text-3xl font-mono font-bold text-emerald-700 tracking-wider">
                {codigo}
              </span>
            </div>
          </div>

          {/* Detalles */}
          <div className="text-left bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">Plan</span>
              <span className="font-medium text-gray-800">{plan}</span>
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
          </div>

          {/* Instrucciones */}
          <div className="bg-yellow-50 rounded-xl p-4 text-left mb-6">
            <h3 className="font-bold text-yellow-800 mb-2 flex items-center gap-2">
              <span>Importante</span>
            </h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>1. Guarda o toma captura de este codigo</li>
              <li>2. Presentalo en la entrada de Mawa</li>
              <li>3. Recibiras tu manilla de acceso</li>
              <li>4. Puedes usar tu codigo cualquier sabado, domingo o festivo</li>
            </ul>
          </div>

          {/* Botones */}
          <div className="space-y-3">
            <button
              onClick={() => {
                navigator.clipboard.writeText(codigo)
                alert('Codigo copiado!')
              }}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl transition-colors"
            >
              Copiar Codigo
            </button>
            <a
              href="/"
              className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-xl transition-colors"
            >
              Comprar otra entrada
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 py-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm">
          <p>Tambien enviamos el codigo a tu email (si lo proporcionaste)</p>
          <p className="mt-2">&copy; 2026 Mawa</p>
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
