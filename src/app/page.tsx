'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import {
  formatCOP,
  generarCodigoVenta,
  obtenerDescuentoWeb,
  calcularPlanesConDescuento,
  calcularTotalCarrito,
  PlanConPrecio,
} from '@/lib/planes'
import { supabase } from '@/lib/supabase'
import {
  obtenerFechasDisponibles,
  calcularFechaVencimiento,
  formatearFechaCorta,
  tipoDia,
} from '@/lib/fechas'
import BoldPayButton from '@/components/BoldPayButton'

const BOLD_API_KEY = process.env.NEXT_PUBLIC_BOLD_API_KEY || ''

export default function TiendaPage() {
  const [planes, setPlanes] = useState<PlanConPrecio[]>([])
  const [descuentoPorcentaje, setDescuentoPorcentaje] = useState<number>(10)
  const [cargandoPrecios, setCargandoPrecios] = useState(true)

  // Selecciones: { 'PACIFICO_PISCINA': 2, 'INFANTIL': 1, ... }
  const [selecciones, setSelecciones] = useState<Record<string, number>>({})

  const [fechaVisita, setFechaVisita] = useState<Date | null>(null)
  const [formData, setFormData] = useState({
    nombre: '',
    celular: '',
    email: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Estados para Bold
  const [ordenConfirmada, setOrdenConfirmada] = useState(false)
  const [codigoOrden, setCodigoOrden] = useState('')
  const [integrityHash, setIntegrityHash] = useState('')
  const [boldReady, setBoldReady] = useState(false)

  // Cargar descuento desde Supabase al iniciar
  useEffect(() => {
    async function cargarDescuento() {
      setCargandoPrecios(true)
      const descuento = await obtenerDescuentoWeb()
      setDescuentoPorcentaje(descuento)
      setPlanes(calcularPlanesConDescuento(descuento))
      setCargandoPrecios(false)
    }
    cargarDescuento()
  }, [])

  // Obtener fechas disponibles
  const fechasDisponibles = useMemo(() => obtenerFechasDisponibles(15), [])

  // Calcular totales
  const totales = useMemo(() => {
    return calcularTotalCarrito(selecciones, planes)
  }, [selecciones, planes])

  const fechaVencimiento = fechaVisita ? calcularFechaVencimiento(fechaVisita) : null
  const haySeleccion = totales.cantidadPersonas > 0

  // Funciones para manejar cantidades
  const incrementar = (key: string) => {
    setSelecciones(prev => ({
      ...prev,
      [key]: Math.min((prev[key] || 0) + 1, 10)
    }))
  }

  const decrementar = (key: string) => {
    setSelecciones(prev => ({
      ...prev,
      [key]: Math.max((prev[key] || 0) - 1, 0)
    }))
  }

  // Confirmar orden antes de mostrar Bold
  const handleConfirmarOrden = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!haySeleccion || !fechaVisita) return

    // Validar campos requeridos
    if (!formData.nombre.trim() || !formData.celular.trim()) {
      setError('Por favor completa tu nombre y celular')
      return
    }

    setLoading(true)
    setError('')

    try {
      const codigo = generarCodigoVenta()
      const vencimiento = calcularFechaVencimiento(fechaVisita)

      // Crear descripción del pedido
      const descripcionPlanes = totales.detalle
        .map(d => `${d.cantidad}x ${d.nombre}`)
        .join(', ')

      // Crear el codigo en Supabase como PENDIENTE_PAGO
      const { error: dbError } = await supabase
        .from('codigos_plan')
        .insert({
          codigo,
          plan_tipo_key: totales.detalle.length === 1 ? totales.detalle[0].key : 'MULTIPLE',
          plan_nombre: descripcionPlanes,
          monto: totales.total,
          cliente_nombre: formData.nombre.toUpperCase(),
          cliente_celular: formData.celular,
          cliente_email: formData.email || null,
          num_personas: totales.cantidadPersonas,
          fecha_venta: new Date().toISOString(),
          fecha_visita: fechaVisita.toISOString(),
          valido_hasta: vencimiento.toISOString(),
          estado: 'PENDIENTE_PAGO',
          agente_nombre: 'VENTA_WEB',
          metodo_pago: 'BOLD_ONLINE',
          sincronizado_local: false,
          notas: JSON.stringify(totales.detalle),
        })

      if (dbError) throw dbError

      // Obtener hash de integridad desde API local
      try {
        const hashResponse = await fetch('/api/bold/integrity-hash', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: codigo,
            amount: totales.total,
            currency: 'COP',
          }),
        })

        if (hashResponse.ok) {
          const hashData = await hashResponse.json()
          if (hashData.ok && hashData.hash) {
            setIntegrityHash(hashData.hash)
          }
        }
      } catch (hashErr) {
        console.warn('No se pudo obtener hash de integridad:', hashErr)
        // Continuar sin hash (Bold podría rechazarlo)
      }

      // Guardar codigo y mostrar botón de Bold
      setCodigoOrden(codigo)
      setOrdenConfirmada(true)
    } catch (err: any) {
      console.error('Error:', err)
      setError('Error al procesar la compra. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  // URL de redirección después del pago
  const getRedirectUrl = useCallback(() => {
    if (!codigoOrden || !fechaVisita) return ''

    const vencimiento = calcularFechaVencimiento(fechaVisita)
    const descripcionPlanes = totales.detalle
      .map(d => `${d.cantidad}x ${d.nombre}`)
      .join(', ')

    const params = new URLSearchParams({
      codigo: codigoOrden,
      plan: descripcionPlanes,
      cantidad: totales.cantidadPersonas.toString(),
      fechaVisita: fechaVisita.toISOString(),
      validoHasta: vencimiento.toISOString(),
    })

    // Usar el dominio actual para la redirección
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
    return `${baseUrl}/exito?${params.toString()}`
  }, [codigoOrden, fechaVisita, totales])

  // Cancelar y volver a editar
  const handleCancelarOrden = async () => {
    if (codigoOrden) {
      // Eliminar la orden pendiente de Supabase
      await supabase
        .from('codigos_plan')
        .delete()
        .eq('codigo', codigoOrden)
        .eq('estado', 'PENDIENTE_PAGO')
    }
    setOrdenConfirmada(false)
    setCodigoOrden('')
    setIntegrityHash('')
    setBoldReady(false)
  }

  // Separar planes por categoría
  const planesAdulto = planes.filter(p => p.categoria === 'adulto')
  const planesInfantil = planes.filter(p => p.categoria === 'infantil')

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Header */}
      <header className="bg-emerald-800 text-white py-4">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">MAWA</h1>
          <span className="bg-yellow-400 text-emerald-900 px-3 py-1 rounded-full text-sm font-semibold">
            {descuentoPorcentaje}% OFF Compra Online
          </span>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-emerald-700 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-2">Compra tus Entradas Online</h2>
          <p className="text-emerald-100">
            Ahorra {descuentoPorcentaje}% en todos los planes
          </p>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {cargandoPrecios ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          </div>
        ) : (
          <form onSubmit={handleConfirmarOrden} className="space-y-8">
            {/* Selector de Planes */}
            <section className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                1. Selecciona tus entradas
              </h3>

              {/* Planes Adulto */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Planes Adulto
                </h4>
                <div className="space-y-3">
                  {planesAdulto.map((plan) => {
                    const cantidad = selecciones[plan.key] || 0
                    const isSelected = cantidad > 0

                    return (
                      <div
                        key={plan.key}
                        className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-50'
                            : 'border-gray-200 hover:border-emerald-300'
                        }`}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h5 className="font-semibold text-gray-800">{plan.nombre}</h5>
                            {'destacado' in plan && plan.destacado && (
                              <span className="bg-yellow-400 text-yellow-900 text-xs px-2 py-0.5 rounded-full font-medium">
                                Recomendado
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">{plan.descripcion}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-gray-400 line-through">
                              {formatCOP(plan.precioNormal)}
                            </span>
                            <span className="font-bold text-emerald-600">
                              {formatCOP(plan.precioWeb)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 ml-4">
                          <button
                            type="button"
                            onClick={() => decrementar(plan.key)}
                            disabled={cantidad === 0}
                            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg flex items-center justify-center"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-bold text-lg">{cantidad}</span>
                          <button
                            type="button"
                            onClick={() => incrementar(plan.key)}
                            className="w-8 h-8 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-lg flex items-center justify-center"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Planes Infantil */}
              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Plan Infantil <span className="font-normal">(hasta 10 años)</span>
                </h4>
                <div className="space-y-3">
                  {planesInfantil.map((plan) => {
                    const cantidad = selecciones[plan.key] || 0
                    const isSelected = cantidad > 0

                    return (
                      <div
                        key={plan.key}
                        className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                          isSelected
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-purple-300'
                        }`}
                      >
                        <div className="flex-1">
                          <h5 className="font-semibold text-gray-800">{plan.nombre}</h5>
                          <p className="text-sm text-gray-500">{plan.descripcion}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-gray-400 line-through">
                              {formatCOP(plan.precioNormal)}
                            </span>
                            <span className="font-bold text-purple-600">
                              {formatCOP(plan.precioWeb)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 ml-4">
                          <button
                            type="button"
                            onClick={() => decrementar(plan.key)}
                            disabled={cantidad === 0}
                            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg flex items-center justify-center"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-bold text-lg">{cantidad}</span>
                          <button
                            type="button"
                            onClick={() => incrementar(plan.key)}
                            className="w-8 h-8 rounded-full bg-purple-500 hover:bg-purple-600 text-white font-bold text-lg flex items-center justify-center"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Resumen de selección */}
              {haySeleccion && (
                <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">
                      {totales.cantidadPersonas} {totales.cantidadPersonas === 1 ? 'persona' : 'personas'}
                    </span>
                    <div className="text-right">
                      <span className="text-sm text-emerald-600">Ahorras {formatCOP(totales.ahorro)}</span>
                      <div className="text-xl font-bold text-gray-800">{formatCOP(totales.total)}</div>
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* Selector de Fecha */}
            {haySeleccion && (
              <section className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  2. Selecciona la fecha de tu visita
                </h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                  {fechasDisponibles.map((fecha) => {
                    const isSelected = fechaVisita?.toDateString() === fecha.toDateString()
                    const tipo = tipoDia(fecha)

                    return (
                      <button
                        key={fecha.toISOString()}
                        type="button"
                        onClick={() => setFechaVisita(fecha)}
                        className={`p-3 rounded-xl text-center transition-all ${
                          isSelected
                            ? 'bg-emerald-600 text-white ring-2 ring-emerald-300'
                            : 'bg-gray-50 hover:bg-emerald-50 border border-gray-200'
                        }`}
                      >
                        <div className={`text-xs ${isSelected ? 'text-emerald-100' : 'text-gray-500'}`}>
                          {tipo}
                        </div>
                        <div className={`font-bold ${isSelected ? 'text-white' : 'text-gray-800'}`}>
                          {formatearFechaCorta(fecha)}
                        </div>
                      </button>
                    )
                  })}
                </div>
                {fechaVisita && fechaVencimiento && (
                  <p className="mt-4 text-sm text-emerald-600 bg-emerald-50 p-3 rounded-lg">
                    Tu código será válido hasta el {fechaVencimiento.toLocaleDateString('es-CO', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                    })} (30 días adicionales)
                  </p>
                )}
              </section>
            )}

            {/* Datos del cliente */}
            {haySeleccion && fechaVisita && (
              <section className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  3. Tus datos
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre completo *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Juan Pérez"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Celular *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.celular}
                      onChange={(e) => setFormData({ ...formData, celular: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="300 123 4567"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email (para recibir tu código)
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="tu@email.com"
                  />
                </div>
              </section>
            )}

            {/* Resumen final y botón de pago */}
            {haySeleccion && fechaVisita && (
              <section className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Resumen de tu compra
                </h3>

                <div className="space-y-2 mb-4">
                  {totales.detalle.map((item) => (
                    <div key={item.key} className="flex justify-between text-gray-600">
                      <span>{item.cantidad}x {item.nombre}</span>
                      <span>{formatCOP(item.subtotal)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-gray-600 text-sm">
                    <span>Fecha de visita</span>
                    <span>{formatearFechaCorta(fechaVisita)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-600 text-sm">
                    <span>Ahorro con descuento web</span>
                    <span>-{formatCOP(totales.ahorro)}</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 flex justify-between items-center mb-6">
                  <span className="text-lg font-bold text-gray-800">Total a pagar</span>
                  <span className="text-2xl font-bold text-emerald-600">{formatCOP(totales.total)}</span>
                </div>

                {error && (
                  <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-4">
                    {error}
                  </div>
                )}

                {!ordenConfirmada ? (
                  <>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white font-bold py-4 px-6 rounded-xl text-lg transition-colors"
                    >
                      {loading ? 'Preparando pago...' : 'Pagar con Bold'}
                    </button>
                    <p className="text-center text-sm text-gray-500 mt-4">
                      Pago seguro procesado por Bold - Tarjetas, PSE, Nequi
                    </p>
                  </>
                ) : (
                  <div className="space-y-4">
                    {BOLD_API_KEY ? (
                      <>
                        {!boldReady ? (
                          <div className="flex flex-col items-center gap-3 py-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                            <span className="text-gray-600">Cargando pasarela de pago...</span>
                          </div>
                        ) : (
                          <p className="text-center text-gray-600 text-sm mb-2">
                            Haz clic en el botón para completar tu pago
                          </p>
                        )}
                        <div className="flex flex-col items-center">
                          <BoldPayButton
                            apiKey={BOLD_API_KEY}
                            amount={totales.total}
                            orderId={codigoOrden}
                            description={`Mawa - ${totales.detalle.map(d => `${d.cantidad}x ${d.nombre}`).join(', ')}`}
                            integrityHash={integrityHash}
                            customerData={{
                              fullName: formData.nombre,
                              phone: formData.celular,
                              email: formData.email,
                              dialCode: '+57',
                            }}
                            redirectionUrl={getRedirectUrl()}
                            onReady={() => setBoldReady(true)}
                          />
                        </div>
                      </>
                    ) : (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
                        <p className="text-yellow-800">
                          Pasarela de pago en configuración. Contacta a Mawa para completar tu compra.
                        </p>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={handleCancelarOrden}
                      className="w-full text-gray-500 hover:text-gray-700 py-2 text-sm"
                    >
                      ← Volver a editar mis datos
                    </button>
                  </div>
                )}
              </section>
            )}
          </form>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p>&copy; 2026 Mawa. Todos los derechos reservados.</p>
          <p className="text-sm mt-2">
            Abrimos sábados, domingos y festivos.
          </p>
        </div>
      </footer>
    </div>
  )
}
