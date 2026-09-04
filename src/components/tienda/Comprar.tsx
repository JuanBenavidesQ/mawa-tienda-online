'use client'

import { useState, useMemo, useEffect, useCallback, useRef } from 'react'
import {
  formatCOP,
  cargarPlanesBase,
  aplicarPreciosWeb,
  calcularTotalCarrito,
  filtrarPlanesPorTipo,
  esFechaValidaAlojamiento,
  calcularDescuento,
  PlanConPrecio,
  TipoPlan,
} from '@/lib/planes'
import {
  obtenerFechasDisponibles,
  calcularFechaVencimiento,
  formatearFechaCorta,
  formatearFecha,
  tipoDia,
} from '@/lib/fechas'
import BoldPayButton from '@/components/BoldPayButton'
import { trackInicioPago } from '@/lib/analytics'
import { WHATSAPP_URL } from '@/lib/site'
import { INCLUYE_FALLBACK, RESUMEN_FALLBACK } from '@/lib/contenido'
import { IconoCheck, IconoEscudo, IconoWhatsApp } from './Iconos'

const BOLD_API_KEY = process.env.NEXT_PUBLIC_BOLD_API_KEY || ''
const MAX_POR_PLAN = 10

// 'sáb, 6 sept' → 'Sáb, 6 sept' (solo la primera letra; CSS capitalize pondría 'De Sept')
const capitalizar = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s)

function Paso({ numero, titulo, sub }: { numero: number; titulo: string; sub?: string }) {
  return (
    <div className="flex items-start gap-3 mb-5">
      <span className="shrink-0 w-9 h-9 rounded-full bg-mawa-gradient text-white font-bold flex items-center justify-center">
        {numero}
      </span>
      <div>
        <h3 className="font-display text-xl sm:text-2xl font-semibold text-mawa-verde-900 leading-tight">{titulo}</h3>
        {sub && <p className="text-sm text-mawa-gris mt-1">{sub}</p>}
      </div>
    </div>
  )
}

function TarjetaPlan({
  plan,
  cantidad,
  onMas,
  onMenos,
}: {
  plan: PlanConPrecio
  cantidad: number
  onMas: () => void
  onMenos: () => void
}) {
  const seleccionado = cantidad > 0
  const conDescuento = plan.precioNormal !== plan.precioWeb
  const incluye = plan.incluye.length > 0 ? plan.incluye : INCLUYE_FALLBACK[plan.key] ?? []
  // Frase corta de la tarjeta. La descripción larga del catálogo solo se usa
  // cuando no hay lista de "incluye" (para no repetir lo mismo dos veces).
  const resumen = RESUMEN_FALLBACK[plan.key] ?? (incluye.length === 0 ? plan.descripcion : '')

  return (
    <div
      className={`relative rounded-2xl border-2 p-4 sm:p-5 transition-colors ${
        seleccionado ? 'border-mawa-verde-500 bg-mawa-crema/60' : 'border-mawa-verde-900/10 bg-white hover:border-mawa-verde-500/50'
      }`}
    >
      {plan.destacado && (
        <span className="absolute -top-3 left-4 bg-mawa-arena text-mawa-verde-950 text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full shadow">
          Recomendado
        </span>
      )}
      <div className="flex items-baseline justify-between gap-3 flex-wrap">
        <h4 className="font-display text-xl font-semibold text-mawa-verde-900">{plan.nombre}</h4>
        {plan.edadMaxima && <span className="text-xs font-semibold text-mawa-gris bg-mawa-crema rounded-full px-2 py-0.5">Hasta {plan.edadMaxima} años</span>}
      </div>
      {resumen && <p className="text-sm text-mawa-gris mt-0.5">{resumen}</p>}
      {incluye.length > 0 && (
        <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5">
          {incluye.map((item) => (
            <li key={item} className="flex items-start gap-1.5 text-sm text-mawa-ink">
              <IconoCheck className="w-3.5 h-3.5 mt-1 text-mawa-verde-500 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 pt-4 border-t border-mawa-verde-900/10 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-mawa-verde-700 tabular-nums">{formatCOP(plan.precioWeb)}</span>
            {conDescuento && (
              <span className="text-[11px] font-bold text-white bg-mawa-verde-500 rounded-full px-2 py-0.5 whitespace-nowrap">
                -{calcularDescuento(plan.precioNormal, plan.precioWeb)}%
              </span>
            )}
          </div>
          <p className="text-xs text-mawa-gris mt-0.5 whitespace-nowrap">
            {conDescuento && <span className="line-through tabular-nums">{formatCOP(plan.precioNormal)}</span>}
            {conDescuento && ' en taquilla · '}por persona
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0" role="group" aria-label={`Cantidad de ${plan.nombre}`}>
          <button
            type="button"
            onClick={onMenos}
            disabled={cantidad === 0}
            aria-label={`Quitar ${plan.nombre}`}
            className="w-11 h-11 rounded-full border-2 border-mawa-verde-900/15 text-mawa-verde-900 text-xl font-bold flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-mawa-crema transition-colors"
          >
            −
          </button>
          <span className="w-8 text-center text-xl font-bold text-mawa-ink tabular-nums" aria-live="polite">{cantidad}</span>
          <button
            type="button"
            onClick={onMas}
            aria-label={`Agregar ${plan.nombre}`}
            className="w-11 h-11 rounded-full bg-mawa-gradient text-white text-xl font-bold flex items-center justify-center shadow hover:brightness-110 transition"
          >
            +
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Comprar() {
  const [planes, setPlanes] = useState<PlanConPrecio[]>([])
  const [cargandoPrecios, setCargandoPrecios] = useState(true)
  const [tabActivo, setTabActivo] = useState<TipoPlan>('pasadia')
  const [selecciones, setSelecciones] = useState<Record<string, number>>({})
  const [fechaVisita, setFechaVisita] = useState<Date | null>(null)
  const [formData, setFormData] = useState({
    nombre: '',
    celular: '',
    email: '',
    aceptaPolitica: false,
    aceptaMarketing: false,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Estados para Bold
  const [ordenConfirmada, setOrdenConfirmada] = useState(false)
  const [codigoOrden, setCodigoOrden] = useState('')
  // Total calculado por el SERVIDOR al crear la orden: es el monto que se le
  // pasa a Bold (y sobre el que se firmó el hash), no el total del navegador.
  const [ordenTotal, setOrdenTotal] = useState(0)
  const [integrityHash, setIntegrityHash] = useState('')
  const [boldReady, setBoldReady] = useState(false)
  const [mostrarMensajeGrupal, setMostrarMensajeGrupal] = useState(false)

  const refFecha = useRef<HTMLElement>(null)
  const refDatos = useRef<HTMLElement>(null)

  useEffect(() => {
    let activo = true
    async function cargarTodo() {
      const planesBase = await cargarPlanesBase()
      if (!activo) return
      setPlanes(aplicarPreciosWeb(planesBase))
      setCargandoPrecios(false)
    }
    cargarTodo()
    return () => {
      activo = false
    }
  }, [])

  const fechasDisponibles = useMemo(() => {
    const fechas = obtenerFechasDisponibles(30)
    if (tabActivo === 'alojamiento') return fechas.filter(esFechaValidaAlojamiento)
    return fechas.slice(0, 15)
  }, [tabActivo])

  const totales = useMemo(() => calcularTotalCarrito(selecciones, planes), [selecciones, planes])
  const haySeleccion = totales.cantidadPersonas > 0

  const incrementar = (key: string) => {
    setSelecciones((prev) => {
      const actual = prev[key] || 0
      if (actual >= MAX_POR_PLAN) {
        setMostrarMensajeGrupal(true)
        return prev
      }
      setMostrarMensajeGrupal(false)
      return { ...prev, [key]: actual + 1 }
    })
  }

  const decrementar = (key: string) => {
    setSelecciones((prev) => ({ ...prev, [key]: Math.max((prev[key] || 0) - 1, 0) }))
  }

  // Al elegir la primera entrada, llevar al usuario al paso de la fecha.
  const seleccionPrevia = useRef(false)
  useEffect(() => {
    if (haySeleccion && !seleccionPrevia.current) {
      setTimeout(() => refFecha.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
    }
    seleccionPrevia.current = haySeleccion
  }, [haySeleccion])

  const elegirFecha = (fecha: Date) => {
    setFechaVisita(fecha)
    setTimeout(() => refDatos.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
  }

  const handleConfirmarOrden = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!haySeleccion || !fechaVisita) return

    if (!formData.nombre.trim() || !formData.celular.trim()) {
      setError('Por favor completa tu nombre y celular')
      return
    }
    if (!formData.aceptaPolitica) {
      setError('Debes aceptar la política de tratamiento de datos para continuar')
      return
    }

    setLoading(true)
    setError('')

    try {
      // La orden se crea SERVER-SIDE: el servidor calcula el precio desde el
      // catálogo (el navegador solo dice qué planes y cuántos), inserta el
      // código con el service role y devuelve el hash de integridad de Bold
      // firmado sobre el total real.
      const resp = await fetch('/api/ordenes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          selecciones,
          fechaVisita: fechaVisita.toISOString(),
          nombre: formData.nombre,
          celular: formData.celular,
          email: formData.email,
          aceptaPolitica: formData.aceptaPolitica,
          aceptaMarketing: formData.aceptaMarketing,
        }),
      })

      const data = await resp.json().catch(() => null)
      if (!resp.ok || !data?.ok) {
        setError(data?.error || 'Error al procesar la compra. Intenta de nuevo.')
        return
      }

      setCodigoOrden(data.codigo)
      setOrdenTotal(data.total)
      setIntegrityHash(data.hash || '')
      setOrdenConfirmada(true)
      trackInicioPago(
        data.codigo,
        Number(data.total) || totales.total,
        totales.detalle.map((d) => ({ key: d.key, nombre: d.nombre, cantidad: d.cantidad, precioUnitario: d.precioUnitario }))
      )
    } catch (err) {
      console.error('Error:', err)
      setError('Error al procesar la compra. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const getRedirectUrl = useCallback(() => {
    if (!codigoOrden || !fechaVisita) return ''
    const vencimiento = calcularFechaVencimiento(fechaVisita)
    const descripcionPlanes = totales.detalle.map((d) => `${d.cantidad}x ${d.nombre}`).join(', ')
    const params = new URLSearchParams({
      codigo: codigoOrden,
      plan: descripcionPlanes,
      cantidad: totales.cantidadPersonas.toString(),
      fechaVisita: fechaVisita.toISOString(),
      validoHasta: vencimiento.toISOString(),
    })
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
    return `${baseUrl}/exito?${params.toString()}`
  }, [codigoOrden, fechaVisita, totales])

  // Cancelar y volver a editar. La eliminación va por el servidor (solo borra
  // órdenes web SIN pagar); best-effort — si falla, la reconciliación la expira.
  const handleCancelarOrden = async () => {
    if (codigoOrden) {
      try {
        await fetch(`/api/ordenes?codigo=${encodeURIComponent(codigoOrden)}`, { method: 'DELETE' })
      } catch {
        // La orden quedará PENDIENTE_PAGO y expira sola a las 48h.
      }
    }
    setOrdenConfirmada(false)
    setCodigoOrden('')
    setOrdenTotal(0)
    setIntegrityHash('')
    setBoldReady(false)
  }

  const hayPasadia = planes.some((p) => p.tipo === 'pasadia')
  const hayAlojamiento = planes.some((p) => p.tipo === 'alojamiento')
  const planesDelTab = useMemo(() => filtrarPlanesPorTipo(planes, tabActivo), [planes, tabActivo])
  const planesAdulto = planesDelTab.filter((p) => p.categoria === 'adulto')
  const planesInfantil = planesDelTab.filter((p) => p.categoria === 'infantil')

  const handleCambiarTab = (nuevoTab: TipoPlan) => {
    setTabActivo(nuevoTab)
    setSelecciones({})
    setFechaVisita(null)
    setOrdenConfirmada(false)
    setCodigoOrden('')
  }

  const inputClase =
    'w-full px-4 py-3 rounded-xl border border-mawa-verde-900/20 bg-white text-mawa-ink placeholder:text-mawa-gris/60 focus:outline-none focus:ring-2 focus:ring-mawa-verde-500 focus:border-mawa-verde-500'

  return (
    <section id="planes" className="scroll-mt-16 bg-mawa-crema/40 border-y border-mawa-verde-900/5">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="text-center mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-mawa-verde-500">Compra online</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-mawa-verde-900 mt-2">Elige tu plan</h2>
          <p className="mt-3 text-mawa-gris">
            Todos los planes de pasadía incluyen almuerzo a elección del menú, con bebida y postre.
          </p>
        </div>

        {hayPasadia && hayAlojamiento && (
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-full p-1 shadow inline-flex" role="tablist">
              {(['pasadia', 'alojamiento'] as TipoPlan[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  role="tab"
                  aria-selected={tabActivo === t}
                  onClick={() => handleCambiarTab(t)}
                  className={`px-6 py-2.5 rounded-full font-semibold transition-colors ${
                    tabActivo === t ? 'bg-mawa-verde-700 text-white shadow-sm' : 'text-mawa-gris hover:text-mawa-verde-700'
                  }`}
                >
                  {t === 'pasadia' ? 'Pasadía' : 'Alojamiento'}
                </button>
              ))}
            </div>
          </div>
        )}

        {cargandoPrecios ? (
          <div className="flex justify-center py-12" aria-busy="true">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mawa-verde-700"></div>
          </div>
        ) : (
          <form onSubmit={handleConfirmarOrden} className="space-y-6">
            {/* 1. Planes */}
            <section className="bg-white rounded-3xl shadow-lg shadow-mawa-verde-900/5 p-5 sm:p-8">
              <Paso numero={1} titulo={tabActivo === 'pasadia' ? 'Elige tus entradas' : 'Elige tus reservaciones'} sub="Puedes combinar planes de adulto e infantil en una misma compra." />

              <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-mawa-gris mb-3">
                {tabActivo === 'pasadia' ? 'Adultos y jóvenes' : 'Alojamiento adulto'}
              </h4>
              <div className="space-y-4">
                {planesAdulto.map((plan) => (
                  <TarjetaPlan
                    key={plan.key}
                    plan={plan}
                    cantidad={selecciones[plan.key] || 0}
                    onMas={() => incrementar(plan.key)}
                    onMenos={() => decrementar(plan.key)}
                  />
                ))}
              </div>

              {planesInfantil.length > 0 && (
                <>
                  <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-mawa-gris mt-8 mb-3">
                    {tabActivo === 'pasadia' ? 'Niños hasta 12 años' : 'Alojamiento niño'}
                  </h4>
                  <div className="space-y-4">
                    {planesInfantil.map((plan) => (
                      <TarjetaPlan
                        key={plan.key}
                        plan={plan}
                        cantidad={selecciones[plan.key] || 0}
                        onMas={() => incrementar(plan.key)}
                        onMenos={() => decrementar(plan.key)}
                      />
                    ))}
                  </div>
                </>
              )}

              {mostrarMensajeGrupal && (
                <div className="mt-4 p-4 bg-mawa-crema border border-mawa-arena/50 rounded-xl text-sm text-mawa-ink flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
                  <span>Para grupos grandes tenemos tarifas especiales. Escríbenos y te armamos la cotización.</span>
                  <a
                    href={`${WHATSAPP_URL}?text=${encodeURIComponent('Hola Mawá, quiero cotizar un plan para un grupo grande')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-whatsapp text-white font-semibold rounded-full px-4 py-2 shrink-0"
                  >
                    <IconoWhatsApp className="w-4 h-4" /> Cotizar grupo
                  </a>
                </div>
              )}

              {haySeleccion && (
                <div className="mt-6 p-4 bg-mawa-crema/70 rounded-2xl flex justify-between items-center">
                  <span className="text-mawa-gris">
                    {totales.cantidadPersonas} {totales.cantidadPersonas === 1 ? 'persona' : 'personas'}
                  </span>
                  <div className="text-right">
                    {totales.ahorro > 0 && (
                      <span className="block text-sm font-semibold text-mawa-verde-500">Ahorras {formatCOP(totales.ahorro)}</span>
                    )}
                    <span className="text-2xl font-bold text-mawa-verde-900">{formatCOP(totales.total)}</span>
                  </div>
                </div>
              )}
            </section>

            {/* 2. Fecha */}
            {haySeleccion && (
              <section ref={refFecha} className="bg-white rounded-3xl shadow-lg shadow-mawa-verde-900/5 p-5 sm:p-8 scroll-mt-20">
                <Paso
                  numero={2}
                  titulo={tabActivo === 'pasadia' ? 'Elige la fecha de tu visita' : 'Elige la fecha de llegada'}
                  sub="Es la fecha que planeas venir. Tu código vale 30 días desde ese día, cualquier sábado, domingo o festivo."
                />
                {tabActivo === 'alojamiento' && (
                  <p className="text-sm text-mawa-marron bg-mawa-crema p-3 rounded-xl mb-4">
                    El alojamiento está disponible sábados y domingos de puente festivo.
                  </p>
                )}
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {fechasDisponibles.map((fecha) => {
                    const isSelected = fechaVisita?.toDateString() === fecha.toDateString()
                    return (
                      <button
                        key={fecha.toISOString()}
                        type="button"
                        onClick={() => elegirFecha(fecha)}
                        aria-pressed={isSelected}
                        className={`p-3 rounded-xl text-center transition-colors border ${
                          isSelected
                            ? 'bg-mawa-verde-700 border-mawa-verde-700 text-white shadow'
                            : 'bg-white border-mawa-verde-900/10 hover:border-mawa-verde-500 text-mawa-ink'
                        }`}
                      >
                        <span className={`block text-xs ${isSelected ? 'text-white/80' : 'text-mawa-gris'}`}>{tipoDia(fecha)}</span>
                        <span className="block font-bold">{capitalizar(formatearFechaCorta(fecha))}</span>
                      </button>
                    )
                  })}
                </div>
              </section>
            )}

            {/* 3. Datos */}
            {haySeleccion && fechaVisita && (
              <section ref={refDatos} className="bg-white rounded-3xl shadow-lg shadow-mawa-verde-900/5 p-5 sm:p-8 scroll-mt-20">
                <Paso numero={3} titulo="Tus datos" sub="Al celular que registres te enviamos el código por WhatsApp." />
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="nombre" className="block text-sm font-semibold text-mawa-ink mb-1">Nombre completo *</label>
                    <input
                      id="nombre"
                      type="text"
                      required
                      autoComplete="name"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      className={inputClase}
                      placeholder="Juan Pérez"
                    />
                  </div>
                  <div>
                    <label htmlFor="celular" className="block text-sm font-semibold text-mawa-ink mb-1">Celular (WhatsApp) *</label>
                    <input
                      id="celular"
                      type="tel"
                      required
                      inputMode="tel"
                      autoComplete="tel"
                      value={formData.celular}
                      onChange={(e) => setFormData({ ...formData, celular: e.target.value })}
                      className={inputClase}
                      placeholder="300 123 4567"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label htmlFor="email" className="block text-sm font-semibold text-mawa-ink mb-1">Email (opcional)</label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={inputClase}
                    placeholder="tu@email.com"
                  />
                </div>

                <div className="mt-6 space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.aceptaPolitica}
                      onChange={(e) => setFormData({ ...formData, aceptaPolitica: e.target.checked })}
                      className="mt-1 w-5 h-5 accent-mawa-verde-700"
                    />
                    <span className="text-sm text-mawa-gris">
                      Acepto la{' '}
                      <a href="/politica-datos" target="_blank" className="text-mawa-verde-700 underline hover:text-mawa-verde-900">
                        política de tratamiento de datos personales
                      </a>{' '}
                      <span className="text-red-500">*</span>
                    </span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.aceptaMarketing}
                      onChange={(e) => setFormData({ ...formData, aceptaMarketing: e.target.checked })}
                      className="mt-1 w-5 h-5 accent-mawa-verde-700"
                    />
                    <span className="text-sm text-mawa-gris">Quiero recibir promociones y ofertas exclusivas por WhatsApp</span>
                  </label>
                </div>
              </section>
            )}

            {/* Resumen y pago */}
            {haySeleccion && fechaVisita && (
              <section className="bg-white rounded-3xl shadow-lg shadow-mawa-verde-900/5 p-5 sm:p-8 border-2 border-mawa-verde-500/30">
                <h3 className="font-display text-2xl font-semibold text-mawa-verde-900 mb-4">Resumen de tu compra</h3>

                <div className="space-y-2 mb-4 text-mawa-ink">
                  {totales.detalle.map((item) => (
                    <div key={item.key} className="flex justify-between">
                      <span>{item.cantidad}x {item.nombre}</span>
                      <span className="tabular-nums">{formatCOP(item.subtotal)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-sm text-mawa-gris">
                    <span>Fecha de visita</span>
                    <span>{capitalizar(formatearFecha(fechaVisita))}</span>
                  </div>
                  {totales.ahorro > 0 && (
                    <div className="flex justify-between text-sm font-semibold text-mawa-verde-500">
                      <span>Ahorro por compra online</span>
                      <span>-{formatCOP(totales.ahorro)}</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-mawa-verde-900/10 pt-4 flex justify-between items-center mb-6">
                  <span className="text-lg font-bold text-mawa-ink">Total a pagar</span>
                  <span className="text-3xl font-bold text-mawa-verde-900 tabular-nums">{formatCOP(totales.total)}</span>
                </div>

                {error && (
                  <div role="alert" className="bg-red-50 text-red-700 border border-red-200 px-4 py-3 rounded-xl mb-4">
                    {error}
                  </div>
                )}

                {!ordenConfirmada ? (
                  <>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-mawa-gradient disabled:opacity-60 text-white font-bold py-4 px-6 rounded-full text-lg shadow-lg shadow-mawa-verde-900/20 hover:brightness-110 transition"
                    >
                      {loading ? 'Preparando pago...' : 'Continuar al pago seguro'}
                    </button>
                    <p className="flex items-center justify-center gap-2 text-sm text-mawa-gris mt-4">
                      <IconoEscudo className="w-4 h-4 text-mawa-verde-500" />
                      Pago procesado por Bold · Tarjetas, PSE, Nequi, Daviplata
                    </p>
                  </>
                ) : (
                  <div className="space-y-4">
                    {BOLD_API_KEY ? (
                      <>
                        {!boldReady ? (
                          <div className="flex flex-col items-center gap-3 py-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mawa-verde-700"></div>
                            <span className="text-mawa-gris">Cargando pasarela de pago...</span>
                          </div>
                        ) : (
                          <p className="text-center text-mawa-gris text-sm mb-2">Haz clic en el botón para completar tu pago</p>
                        )}
                        <div className="flex flex-col items-center">
                          <BoldPayButton
                            apiKey={BOLD_API_KEY}
                            amount={ordenTotal || totales.total}
                            orderId={codigoOrden}
                            description={`Mawa - ${totales.detalle.map((d) => `${d.cantidad}x ${d.nombre}`).join(', ')}`}
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
                      <div className="bg-mawa-crema border border-mawa-arena/50 rounded-xl p-4 text-center text-mawa-ink">
                        Pasarela de pago en configuración. Escríbenos por WhatsApp para completar tu compra.
                      </div>
                    )}
                    <button type="button" onClick={handleCancelarOrden} className="w-full text-mawa-gris hover:text-mawa-ink py-2 text-sm">
                      ← Volver a editar mis datos
                    </button>
                  </div>
                )}
              </section>
            )}
          </form>
        )}
      </div>
    </section>
  )
}
