'use client'

import { useState } from 'react'
import { PLANES_WEB, formatCOP, calcularDescuento, generarCodigoVenta } from '@/lib/planes'
import { supabase } from '@/lib/supabase'

type PlanSeleccionado = typeof PLANES_WEB[number] | null

export default function TiendaPage() {
  const [planSeleccionado, setPlanSeleccionado] = useState<PlanSeleccionado>(null)
  const [cantidad, setCantidad] = useState(1)
  const [formData, setFormData] = useState({
    nombre: '',
    celular: '',
    email: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const total = planSeleccionado ? planSeleccionado.precioWeb * cantidad : 0
  const ahorro = planSeleccionado
    ? (planSeleccionado.precioNormal - planSeleccionado.precioWeb) * cantidad
    : 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!planSeleccionado) return

    setLoading(true)
    setError('')

    try {
      const codigo = generarCodigoVenta()

      // Crear el código en Supabase
      const { error: dbError } = await supabase
        .from('codigos_plan')
        .insert({
          codigo,
          plan_tipo_key: planSeleccionado.key,
          plan_nombre: planSeleccionado.nombre,
          monto: total,
          cliente_nombre: formData.nombre.toUpperCase(),
          cliente_celular: formData.celular,
          cliente_email: formData.email || null,
          num_personas: cantidad,
          fecha_venta: new Date().toISOString(),
          estado: 'PENDIENTE',
          agente_nombre: 'VENTA_WEB',
          metodo_pago: 'BOLD_ONLINE',
          sincronizado_local: false,
        })

      if (dbError) throw dbError

      // Redirigir a página de éxito con el código
      window.location.href = `/exito?codigo=${codigo}&plan=${encodeURIComponent(planSeleccionado.nombre)}&cantidad=${cantidad}`
    } catch (err: any) {
      console.error('Error:', err)
      setError('Error al procesar la compra. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Header */}
      <header className="bg-emerald-800 text-white py-4">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">MAWA</h1>
          <span className="bg-yellow-400 text-emerald-900 px-3 py-1 rounded-full text-sm font-semibold">
            10% OFF Compra Online
          </span>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-emerald-700 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Vive la Experiencia Mawa</h2>
          <p className="text-xl text-emerald-100">
            Compra tu entrada online y ahorra 10% en todos los planes
          </p>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Planes */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Selecciona tu Plan
          </h3>

          <div className="grid md:grid-cols-3 gap-6">
            {PLANES_WEB.map((plan) => {
              const descuento = calcularDescuento(plan.precioNormal, plan.precioWeb)
              const isSelected = planSeleccionado?.key === plan.key

              return (
                <div
                  key={plan.key}
                  onClick={() => setPlanSeleccionado(plan)}
                  className={`
                    relative rounded-2xl p-6 cursor-pointer transition-all
                    ${isSelected
                      ? 'bg-emerald-600 text-white ring-4 ring-emerald-300 scale-105'
                      : 'bg-white hover:shadow-lg border-2 border-gray-100'
                    }
                    ${'destacado' in plan && plan.destacado ? 'md:-mt-4 md:mb-4' : ''}
                  `}
                >
                  {'destacado' in plan && plan.destacado && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-emerald-900 px-4 py-1 rounded-full text-sm font-bold">
                      Recomendado
                    </span>
                  )}

                  <h4 className={`text-xl font-bold mb-2 ${isSelected ? 'text-white' : 'text-gray-800'}`}>
                    {plan.nombre}
                  </h4>

                  <p className={`text-sm mb-4 ${isSelected ? 'text-emerald-100' : 'text-gray-600'}`}>
                    {plan.descripcion}
                  </p>

                  <div className="mb-4">
                    <span className={`text-sm line-through ${isSelected ? 'text-emerald-200' : 'text-gray-400'}`}>
                      {formatCOP(plan.precioNormal)}
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className={`text-3xl font-bold ${isSelected ? 'text-white' : 'text-emerald-600'}`}>
                        {formatCOP(plan.precioWeb)}
                      </span>
                      <span className={`text-sm font-semibold ${isSelected ? 'text-yellow-300' : 'text-yellow-600'}`}>
                        -{descuento}%
                      </span>
                    </div>
                  </div>

                  <ul className={`text-sm space-y-1 ${isSelected ? 'text-emerald-100' : 'text-gray-600'}`}>
                    {plan.incluye.map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className={isSelected ? 'text-yellow-300' : 'text-emerald-500'}>✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </section>

        {/* Formulario de compra */}
        {planSeleccionado && (
          <section className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              Completa tu compra
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Cantidad */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cantidad de personas
                </label>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                    className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 font-bold text-xl"
                  >
                    -
                  </button>
                  <span className="text-2xl font-bold w-12 text-center">{cantidad}</span>
                  <button
                    type="button"
                    onClick={() => setCantidad(Math.min(10, cantidad + 1))}
                    className="w-10 h-10 rounded-full bg-emerald-100 hover:bg-emerald-200 text-emerald-700 font-bold text-xl"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Datos del cliente */}
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Juan Perez"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="300 123 4567"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email (para recibir tu codigo)
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="tu@email.com"
                />
              </div>

              {/* Resumen */}
              <div className="bg-emerald-50 rounded-xl p-4">
                <div className="flex justify-between text-gray-600 mb-2">
                  <span>{planSeleccionado.nombre} x {cantidad}</span>
                  <span>{formatCOP(planSeleccionado.precioWeb * cantidad)}</span>
                </div>
                <div className="flex justify-between text-emerald-600 text-sm mb-2">
                  <span>Ahorro con descuento web</span>
                  <span>-{formatCOP(ahorro)}</span>
                </div>
                <div className="border-t border-emerald-200 pt-2 flex justify-between">
                  <span className="text-lg font-bold text-gray-800">Total a pagar</span>
                  <span className="text-2xl font-bold text-emerald-600">{formatCOP(total)}</span>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white font-bold py-4 px-6 rounded-xl text-lg transition-colors"
              >
                {loading ? 'Procesando...' : `Pagar ${formatCOP(total)}`}
              </button>

              <p className="text-center text-sm text-gray-500">
                Pago seguro procesado por Bold
              </p>
            </form>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p>&copy; 2026 Mawa. Todos los derechos reservados.</p>
          <p className="text-sm mt-2">
            Presenta tu codigo en la entrada para activar tu manilla.
          </p>
        </div>
      </footer>
    </div>
  )
}
