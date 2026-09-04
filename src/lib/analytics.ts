// Medición de marketing de la tienda: Meta Pixel + Google Analytics 4.
//
// Los IDs son públicos por naturaleza (viajan en el HTML de cualquier sitio
// que los use), por eso tienen valor por defecto en código: la tienda mide
// sin depender de variables de entorno en Vercel. Se pueden sobreescribir con
// NEXT_PUBLIC_META_PIXEL_ID / NEXT_PUBLIC_GA_MEASUREMENT_ID (p. ej. vaciarlos
// en un ambiente de pruebas para no contaminar las estadísticas reales).
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? '1091782223190583'
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? 'G-JCSCSD22K5'

type FbqFn = (...args: unknown[]) => void
type GtagFn = (...args: unknown[]) => void

declare global {
  interface Window {
    fbq?: FbqFn
    gtag?: GtagFn
    dataLayer?: unknown[]
  }
}

export type ItemCompra = {
  key: string
  nombre: string
  cantidad: number
  precioUnitario: number
}

function fbq(...args: unknown[]) {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') window.fbq(...args)
}
function gtag(...args: unknown[]) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') window.gtag(...args)
}

/** Vista de página (Meta). GA4 la registra solo con enhanced measurement. */
export function trackPageView() {
  fbq('track', 'PageView')
}

/** El cliente confirmó su pedido y va a ver el botón de pago. */
export function trackInicioPago(codigo: string, total: number, items: ItemCompra[]) {
  fbq(
    'track',
    'InitiateCheckout',
    {
      value: total,
      currency: 'COP',
      content_type: 'product',
      content_ids: items.map((i) => i.key),
      contents: items.map((i) => ({ id: i.key, quantity: i.cantidad, item_price: i.precioUnitario })),
      num_items: items.reduce((s, i) => s + i.cantidad, 0),
    },
    { eventID: `checkout:${codigo}` }
  )
  gtag('event', 'begin_checkout', {
    transaction_id: codigo,
    value: total,
    currency: 'COP',
    items: items.map((i) => ({
      item_id: i.key,
      item_name: i.nombre,
      quantity: i.cantidad,
      price: i.precioUnitario,
    })),
  })
}

const KEY_COMPRA = 'mawa_compra_medida:'

/**
 * Compra confirmada por el backend (webhook de Bold). Se reporta UNA sola vez
 * por código aunque el cliente recargue /exito: se marca en sessionStorage y,
 * para Meta, el eventID = código permite deduplicar con la API de conversiones
 * cuando se agregue desde el servidor.
 */
export function trackCompra(codigo: string, total: number, items: ItemCompra[]) {
  try {
    if (sessionStorage.getItem(KEY_COMPRA + codigo)) return
    sessionStorage.setItem(KEY_COMPRA + codigo, '1')
  } catch {
    // sin storage (modo privado): se reporta igual, el riesgo es un duplicado
  }
  fbq(
    'track',
    'Purchase',
    {
      value: total,
      currency: 'COP',
      content_type: 'product',
      content_ids: items.map((i) => i.key),
      contents: items.map((i) => ({ id: i.key, quantity: i.cantidad, item_price: i.precioUnitario })),
      num_items: items.reduce((s, i) => s + i.cantidad, 0),
    },
    { eventID: codigo }
  )
  gtag('event', 'purchase', {
    transaction_id: codigo,
    value: total,
    currency: 'COP',
    items: items.map((i) => ({
      item_id: i.key,
      item_name: i.nombre,
      quantity: i.cantidad,
      price: i.precioUnitario,
    })),
  })
}
