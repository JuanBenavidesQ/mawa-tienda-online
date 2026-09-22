'use client'

import { useState } from 'react'
import { WHATSAPP_URL } from '@/lib/site'
import { IconoWhatsApp } from '@/components/tienda/Iconos'

type CodigoResumen = {
  codigoEnmascarado: string
  plan: string
  personas: number | null
  estado: 'ACTIVO' | 'CANJEADO' | 'PENDIENTE_PAGO' | 'EXPIRADO' | 'OTRO'
  fechaVisita: string | null
  validoHasta: string | null
}

const ETIQUETA_ESTADO: Record<CodigoResumen['estado'], { texto: string; clase: string }> = {
  ACTIVO: { texto: 'Activo', clase: 'bg-mawa-verde-500 text-white' },
  CANJEADO: { texto: 'Ya usado', clase: 'bg-mawa-crema text-mawa-gris' },
  PENDIENTE_PAGO: { texto: 'Pago sin confirmar', clase: 'bg-mawa-arena/40 text-mawa-marron' },
  EXPIRADO: { texto: 'Vencido', clase: 'bg-mawa-crema text-mawa-gris' },
  OTRO: { texto: 'Consulta en recepción', clase: 'bg-mawa-crema text-mawa-gris' },
}

function fecha(iso: string | null) {
  if (!iso) return null
  return new Date(iso).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'America/Bogota' })
}

export default function FormularioMiCodigo() {
  const [celular, setCelular] = useState('')
  const [estado, setEstado] = useState<'inicio' | 'cargando' | 'listo' | 'fallback' | 'error'>('inicio')
  const [error, setError] = useState('')
  const [codigos, setCodigos] = useState<CodigoResumen[]>([])
  const [enviado, setEnviado] = useState(false)

  const buscar = async (e: React.FormEvent) => {
    e.preventDefault()
    const limpio = celular.replace(/[\s()+-]/g, '')
    if (!/^\d{10,12}$/.test(limpio)) {
      setError('Escribe un celular válido de 10 dígitos')
      setEstado('error')
      return
    }
    setEstado('cargando')
    setError('')
    try {
      const resp = await fetch('/api/mi-codigo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ celular: limpio }),
      })
      const data = await resp.json().catch(() => null)
      if (data?.ok) {
        setCodigos(Array.isArray(data.codigos) ? data.codigos : [])
        setEnviado(Boolean(data.enviado))
        setEstado('listo')
      } else if (data?.fallback) {
        setEstado('fallback')
      } else {
        setError(data?.error || 'No pudimos consultar. Intenta de nuevo.')
        setEstado('error')
      }
    } catch {
      setEstado('fallback')
    }
  }

  const mensajeWa = `${WHATSAPP_URL}?text=${encodeURIComponent(`Hola Mawá, compré entradas en la tienda web con el celular ${celular || '...'} y perdí mi código. ¿Me lo pueden reenviar?`)}`
  const inputClase =
    'w-full px-4 py-3 rounded-xl border border-mawa-verde-900/20 bg-white text-mawa-ink placeholder:text-mawa-gris/60 focus:outline-none focus:ring-2 focus:ring-mawa-verde-500 focus:border-mawa-verde-500'

  return (
    <div className="mt-6">
      <form onSubmit={buscar} className="space-y-4">
        <div>
          <label htmlFor="celular" className="block text-sm font-semibold text-mawa-ink mb-1">Celular de la compra</label>
          <input
            id="celular"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={celular}
            onChange={(e) => setCelular(e.target.value)}
            className={inputClase}
            placeholder="300 123 4567"
          />
        </div>
        {estado === 'error' && (
          <p role="alert" className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>
        )}
        <button
          type="submit"
          disabled={estado === 'cargando'}
          className="w-full bg-mawa-gradient disabled:opacity-60 text-white font-bold py-3.5 px-6 rounded-full shadow hover:brightness-110 transition"
        >
          {estado === 'cargando' ? 'Buscando...' : 'Reenviar mi código por WhatsApp'}
        </button>
      </form>

      {estado === 'listo' && (
        <div className="mt-6 space-y-4">
          {codigos.length === 0 ? (
            <div className="bg-mawa-crema rounded-xl p-4 text-sm text-mawa-ink">
              No encontramos compras en la tienda web con ese celular en los últimos 90 días. Revisa que sea el mismo
              número que registraste al comprar, o escríbenos por WhatsApp.
            </div>
          ) : (
            <>
              <div
                className={`rounded-xl p-4 text-sm ${enviado ? 'bg-mawa-verde-500/10 text-mawa-verde-900' : 'bg-mawa-crema text-mawa-ink'}`}
              >
                {enviado
                  ? 'Te enviamos por WhatsApp los códigos activos al celular registrado. Revisa tus mensajes en un momento.'
                  : codigos.some((c) => c.estado === 'ACTIVO')
                    ? 'Ya te reenviamos tus códigos hace menos de una hora. Revisa tu WhatsApp; si no llegó, escríbenos.'
                    : 'No tienes códigos activos por reenviar: los de esta lista ya fueron usados, vencieron o no se confirmó el pago.'}
              </div>
              <ul className="divide-y divide-mawa-verde-900/10 border-y border-mawa-verde-900/10">
                {codigos.map((c) => {
                  const et = ETIQUETA_ESTADO[c.estado]
                  return (
                    <li key={c.codigoEnmascarado + c.fechaVisita} className="py-3 flex items-start justify-between gap-3">
                      <div>
                        <p className="font-mono font-bold text-mawa-verde-900">{c.codigoEnmascarado}</p>
                        <p className="text-sm text-mawa-gris">
                          {c.plan}
                          {c.personas && c.personas > 1 ? ` · ${c.personas} personas` : ''}
                        </p>
                        {c.validoHasta && c.estado === 'ACTIVO' && (
                          <p className="text-xs text-mawa-gris">Válido hasta {fecha(c.validoHasta)}</p>
                        )}
                      </div>
                      <span className={`shrink-0 text-xs font-semibold rounded-full px-2.5 py-1 ${et.clase}`}>{et.texto}</span>
                    </li>
                  )
                })}
              </ul>
              <p className="text-xs text-mawa-gris">
                Por seguridad mostramos los códigos incompletos: el código completo solo llega al WhatsApp del celular con el que compraste.
              </p>
            </>
          )}
        </div>
      )}

      {(estado === 'fallback' || estado === 'listo') && (
        <a
          href={mensajeWa}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 flex items-center justify-center gap-2 w-full bg-whatsapp hover:bg-[#1ebe5b] text-white font-semibold py-3 px-6 rounded-full transition-colors"
        >
          <IconoWhatsApp />
          {estado === 'fallback' ? 'No pudimos consultar ahora. Escríbenos por WhatsApp' : '¿Dudas? Escríbenos por WhatsApp'}
        </a>
      )}
    </div>
  )
}
