import { customAlphabet } from 'nanoid'
import { supabase } from './supabase'

// Genera código tipo MAWA-ABC123 (6 caracteres alfanuméricos)
const generateId = customAlphabet('ABCDEFGHJKLMNPQRSTUVWXYZ23456789', 6)

export function generarCodigoVenta(): string {
  return `MAWA-${generateId()}`
}

// Planes base (sin descuento aplicado)
export const PLANES_BASE = [
  {
    key: 'PACIFICO_PISCINA',
    nombre: 'Pacífico - Piscina',
    descripcion: 'Disfruta de nuestras piscinas naturales con vista al río',
    precioBase: 60000,
    incluye: ['Acceso a piscinas', 'Zona de hamacas', 'Parqueadero'],
  },
  {
    key: 'PACIFICO_PUENTES',
    nombre: 'Pacífico - Puentes',
    descripcion: 'Aventura en los puentes colgantes sobre el río',
    precioBase: 60000,
    incluye: ['Recorrido puentes', 'Guía acompañante', 'Parqueadero'],
  },
  {
    key: 'TRAVESIA',
    nombre: 'Travesía Completa',
    descripcion: 'La experiencia completa: piscinas + puentes + sendero ecológico',
    precioBase: 70000,
    incluye: ['Piscinas', 'Puentes', 'Sendero ecológico', 'Guía', 'Parqueadero'],
    destacado: true,
  },
] as const

export type PlanBase = typeof PLANES_BASE[number]
export type PlanKey = PlanBase['key']

// Plan con precios calculados
export type PlanConPrecio = PlanBase & {
  precioNormal: number
  precioWeb: number
}

// Obtiene el descuento configurado desde Supabase
export async function obtenerDescuentoWeb(): Promise<number> {
  try {
    const { data, error } = await supabase
      .from('configuracion_precios')
      .select('valor')
      .eq('clave', 'DESCUENTO_WEB_PORCENTAJE')
      .single()

    if (error || !data) {
      console.warn('No se pudo obtener descuento, usando 10% por defecto:', error)
      return 10 // Valor por defecto
    }

    const descuento = parseInt(data.valor, 10)
    return isNaN(descuento) ? 10 : descuento
  } catch (err) {
    console.error('Error obteniendo descuento:', err)
    return 10 // Valor por defecto
  }
}

// Calcula los planes con el descuento aplicado
export function calcularPlanesConDescuento(descuentoPorcentaje: number): PlanConPrecio[] {
  return PLANES_BASE.map((plan) => ({
    ...plan,
    precioNormal: plan.precioBase,
    precioWeb: Math.round(plan.precioBase * (1 - descuentoPorcentaje / 100)),
  }))
}

// Formatea número como moneda COP
export function formatCOP(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Calcula el porcentaje de descuento (para mostrar en UI)
export function calcularDescuento(precioNormal: number, precioWeb: number): number {
  return Math.round(((precioNormal - precioWeb) / precioNormal) * 100)
}
