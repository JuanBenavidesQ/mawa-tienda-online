import { customAlphabet } from 'nanoid'
import { supabase } from './supabase'

// Genera código tipo MAWA-ABC123 (6 caracteres alfanuméricos)
const generateId = customAlphabet('ABCDEFGHJKLMNPQRSTUVWXYZ23456789', 6)

export function generarCodigoVenta(): string {
  return `MAWA-${generateId()}`
}

// Categorías de planes
export type CategoriaPlanes = 'adulto' | 'infantil'

// Planes base (sin descuento aplicado)
export const PLANES_BASE = [
  {
    key: 'PACIFICO_PISCINA',
    nombre: 'Pacífico - Piscina',
    descripcion: 'Piscinas naturales + almuerzo + bebida + postre',
    precioBase: 60000,
    categoria: 'adulto' as CategoriaPlanes,
    incluye: ['Acceso a piscinas', 'Almuerzo', 'Bebida', 'Postre'],
  },
  {
    key: 'PACIFICO_PUENTES',
    nombre: 'Pacífico - Puentes',
    descripcion: 'Puentes colgantes + almuerzo + bebida + postre',
    precioBase: 60000,
    categoria: 'adulto' as CategoriaPlanes,
    incluye: ['Recorrido puentes', 'Almuerzo', 'Bebida', 'Postre'],
  },
  {
    key: 'TRAVESIA',
    nombre: 'Travesía Completa',
    descripcion: 'Piscinas + puentes + almuerzo + bebida + postre',
    precioBase: 70000,
    categoria: 'adulto' as CategoriaPlanes,
    incluye: ['Piscinas', 'Puentes', 'Almuerzo', 'Bebida', 'Postre'],
    destacado: true,
  },
  {
    key: 'INFANTIL',
    nombre: 'Plan Infantil',
    descripcion: 'Para niños: piscina + menú infantil + bebida + helado',
    precioBase: 40000,
    categoria: 'infantil' as CategoriaPlanes,
    incluye: ['Acceso a piscinas', 'Menú infantil', 'Bebida', 'Helado'],
    edadMaxima: 10,
  },
]

export type PlanBase = typeof PLANES_BASE[number]
export type PlanKey = PlanBase['key']

// Plan con precios calculados
export type PlanConPrecio = PlanBase & {
  precioNormal: number
  precioWeb: number
}

// Selección de plan (para el carrito)
export type SeleccionPlan = {
  plan: PlanConPrecio
  cantidad: number
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

// Calcula el total del carrito
export function calcularTotalCarrito(selecciones: Record<string, number>, planes: PlanConPrecio[]): {
  subtotal: number
  ahorro: number
  total: number
  cantidadPersonas: number
  detalle: { key: string; nombre: string; cantidad: number; precioUnitario: number; subtotal: number }[]
} {
  let subtotal = 0
  let ahorro = 0
  let cantidadPersonas = 0
  const detalle: { key: string; nombre: string; cantidad: number; precioUnitario: number; subtotal: number }[] = []

  for (const plan of planes) {
    const cantidad = selecciones[plan.key] || 0
    if (cantidad > 0) {
      const subtotalPlan = plan.precioWeb * cantidad
      const ahorroplan = (plan.precioNormal - plan.precioWeb) * cantidad
      subtotal += subtotalPlan
      ahorro += ahorroplan
      cantidadPersonas += cantidad
      detalle.push({
        key: plan.key,
        nombre: plan.nombre,
        cantidad,
        precioUnitario: plan.precioWeb,
        subtotal: subtotalPlan,
      })
    }
  }

  return {
    subtotal,
    ahorro,
    total: subtotal,
    cantidadPersonas,
    detalle,
  }
}
