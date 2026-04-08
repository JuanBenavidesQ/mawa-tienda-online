import { customAlphabet } from 'nanoid'
import { supabase } from './supabase'

// Genera código tipo MAWA-ABC123 (6 caracteres alfanuméricos)
const generateId = customAlphabet('ABCDEFGHJKLMNPQRSTUVWXYZ23456789', 6)

export function generarCodigoVenta(): string {
  return `MAWA-${generateId()}`
}

// Categorías de planes
export type CategoriaPlanes = 'adulto' | 'infantil'
export type TipoPlan = 'pasadia' | 'alojamiento'

// Planes base (sin descuento aplicado)
export const PLANES_BASE = [
  // ===== PLANES PASADÍA =====
  {
    key: 'PACIFICO_PISCINA',
    nombre: 'Pacífico - Piscina',
    descripcion: 'Piscinas y toboganes + bebida de bienvenida + almuerzo + bebida + postre',
    precioBase: 60000,
    categoria: 'adulto' as CategoriaPlanes,
    tipo: 'pasadia' as TipoPlan,
    incluye: ['Piscinas y toboganes', 'Bebida de bienvenida', 'Almuerzo', 'Bebida', 'Postre'],
  },
  {
    key: 'PACIFICO_PUENTES',
    nombre: 'Pacífico - Puentes',
    descripcion: 'Puentes tibetanos + bebida de bienvenida + almuerzo + bebida + postre',
    precioBase: 60000,
    categoria: 'adulto' as CategoriaPlanes,
    tipo: 'pasadia' as TipoPlan,
    incluye: ['Puentes tibetanos', 'Bebida de bienvenida', 'Almuerzo', 'Bebida', 'Postre'],
  },
  {
    key: 'TRAVESIA',
    nombre: 'Travesía Completa',
    descripcion: 'Piscinas y toboganes + Puentes tibetanos + bebida de bienvenida + almuerzo + bebida + postre',
    precioBase: 70000,
    categoria: 'adulto' as CategoriaPlanes,
    tipo: 'pasadia' as TipoPlan,
    incluye: ['Piscinas y toboganes', 'Puentes tibetanos', 'Bebida de bienvenida', 'Almuerzo', 'Bebida', 'Postre'],
    destacado: true,
  },
  {
    key: 'INFANTIL',
    nombre: 'Plan Infantil',
    descripcion: 'Piscinas y toboganes + menú infantil con bebida + picnic',
    precioBase: 40000,
    categoria: 'infantil' as CategoriaPlanes,
    tipo: 'pasadia' as TipoPlan,
    incluye: ['Piscinas y toboganes', 'Menú infantil con bebida', 'Picnic'],
    edadMaxima: 12,
  },
  // ===== PLANES ALOJAMIENTO =====
  {
    key: 'ALOJAMIENTO_ADULTO',
    nombre: 'Alojamiento - Adulto',
    descripcion: 'Alojamiento en acomodación doble + desayuno + piscinas y toboganes + puentes tibetanos',
    precioBase: 100000,
    categoria: 'adulto' as CategoriaPlanes,
    tipo: 'alojamiento' as TipoPlan,
    incluye: ['Bebida de bienvenida', 'Alojamiento en acomodación doble', 'Desayuno', 'Piscinas y toboganes', 'Puentes tibetanos'],
    destacado: true,
  },
  {
    key: 'ALOJAMIENTO_NINO',
    nombre: 'Alojamiento - Niño',
    descripcion: 'Alojamiento en acomodación doble + desayuno + piscinas y toboganes + puentes tibetanos',
    precioBase: 80000,
    categoria: 'infantil' as CategoriaPlanes,
    tipo: 'alojamiento' as TipoPlan,
    incluye: ['Bebida de bienvenida', 'Alojamiento en acomodación doble', 'Desayuno', 'Piscinas y toboganes', 'Puentes tibetanos'],
    edadMaxima: 12,
  },
]

// Tipo explícito del plan (no inferido del const, para que cargarPlanesBase() pueda construirlo)
export type PlanBase = {
  key: string
  nombre: string
  descripcion: string
  precioBase: number
  categoria: CategoriaPlanes
  tipo: TipoPlan
  incluye: string[]
  destacado?: boolean
  edadMaxima?: number
}
export type PlanKey = string

// Mapa de metadatos UI por key — estable entre deploys, solo cambia si añadimos planes nuevos
// al catálogo de la tienda. Precio y nombre vienen de Supabase; esto es solo estructura UI.
const METADATA_POR_KEY: Record<string, Omit<PlanBase, 'key' | 'nombre' | 'precioBase'>> = Object.fromEntries(
  PLANES_BASE.map(({ key: _k, nombre: _n, precioBase: _p, ...meta }) => [_k, meta])
)

/**
 * Carga los planes base desde Supabase `planes_tipo`.
 * Solo incluye planes que tengan metadatos UI definidos en METADATA_POR_KEY
 * (los planes internos como ALIMENTACION_ADULTO no aparecen en la tienda).
 * Fallback a PLANES_BASE hardcoded si Supabase falla.
 */
export async function cargarPlanesBase(): Promise<PlanBase[]> {
  try {
    const { data, error } = await supabase
      .from('planes_tipo')
      .select('key, nombre, descripcion, precio_base')
      .eq('activo', true)
      .order('orden', { ascending: true })

    if (error || !data || data.length === 0) {
      console.warn('[Tienda] Fallback a PLANES_BASE hardcoded:', error?.message ?? 'sin datos')
      return PLANES_BASE as unknown as PlanBase[]
    }

    const planes: PlanBase[] = []
    for (const p of data) {
      const meta = METADATA_POR_KEY[p.key]
      if (!meta) continue // plan no publicado en tienda
      planes.push({
        ...meta,
        key: p.key,
        nombre: p.nombre,
        descripcion: p.descripcion ?? meta.descripcion,
        precioBase: Number(p.precio_base) || 0,
      })
    }

    return planes.length > 0 ? planes : (PLANES_BASE as unknown as PlanBase[])
  } catch (err: any) {
    console.error('[Tienda] Error cargando planes desde Supabase:', err?.message)
    return PLANES_BASE as unknown as PlanBase[]
  }
}

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

// Obtiene los descuentos por plan desde Supabase
export async function obtenerDescuentosPorPlan(): Promise<Record<string, number>> {
  try {
    const { data, error } = await supabase
      .from('configuracion_precios')
      .select('clave, valor')
      .like('clave', 'DESCUENTO_%')

    if (error || !data) {
      console.warn('No se pudieron obtener descuentos:', error)
      return {}
    }

    console.log('[Tienda] Datos crudos de Supabase:', data)

    const descuentos: Record<string, number> = {}
    for (const row of data) {
      // Formato: DESCUENTO_PLAN_KEY -> extraer PLAN_KEY
      const match = row.clave.match(/^DESCUENTO_(.+)$/)
      if (match) {
        const planKey = match[1]
        // Ignorar el descuento general viejo
        if (planKey === 'WEB_PORCENTAJE') continue
        const valor = parseInt(row.valor, 10)
        if (!isNaN(valor)) {
          descuentos[planKey] = valor
        }
      }
    }
    console.log('[Tienda] Descuentos por plan:', descuentos)
    return descuentos
  } catch (err) {
    console.error('Error obteniendo descuentos:', err)
    return {}
  }
}

// Calcula los planes con descuentos individuales por plan
export function calcularPlanesConDescuentos(
  descuentosPorPlan: Record<string, number>,
  planesBase: PlanBase[] = PLANES_BASE as unknown as PlanBase[]
): PlanConPrecio[] {
  const planes = planesBase.map((plan) => {
    // Buscar descuento específico del plan (0 si no tiene)
    const descuento = descuentosPorPlan[plan.key] ?? 0
    const precioWeb = descuento > 0
      ? Math.round(plan.precioBase * (1 - descuento / 100))
      : plan.precioBase

    console.log(`[Tienda] ${plan.key}: base=${plan.precioBase}, descuento=${descuento}%, web=${precioWeb}`)

    return {
      ...plan,
      precioNormal: plan.precioBase,
      precioWeb,
    }
  })
  return planes
}

// Filtra planes por tipo
export function filtrarPlanesPorTipo(planes: PlanConPrecio[], tipo: TipoPlan): PlanConPrecio[] {
  return planes.filter((plan) => plan.tipo === tipo)
}

// Festivos Colombia 2025-2026 (lunes festivos y otros)
// Formato: 'YYYY-MM-DD'
export const FESTIVOS_COLOMBIA: string[] = [
  // 2025
  '2025-01-06', // Reyes Magos
  '2025-03-24', // San José
  '2025-04-17', // Jueves Santo
  '2025-04-18', // Viernes Santo
  '2025-05-01', // Día del Trabajo
  '2025-06-02', // Ascensión
  '2025-06-23', // Corpus Christi
  '2025-06-30', // Sagrado Corazón
  '2025-07-20', // Independencia
  '2025-08-07', // Batalla de Boyacá
  '2025-08-18', // Asunción
  '2025-10-13', // Día de la Raza
  '2025-11-03', // Todos los Santos
  '2025-11-17', // Independencia Cartagena
  '2025-12-08', // Inmaculada Concepción
  '2025-12-25', // Navidad
  // 2026
  '2026-01-01', // Año Nuevo
  '2026-01-12', // Reyes Magos
  '2026-03-23', // San José
  '2026-04-02', // Jueves Santo
  '2026-04-03', // Viernes Santo
  '2026-05-01', // Día del Trabajo
  '2026-05-18', // Ascensión
  '2026-06-08', // Corpus Christi
  '2026-06-15', // Sagrado Corazón
  '2026-06-29', // San Pedro y San Pablo
  '2026-07-20', // Independencia
  '2026-08-07', // Batalla de Boyacá
  '2026-08-17', // Asunción
  '2026-10-12', // Día de la Raza
  '2026-11-02', // Todos los Santos
  '2026-11-16', // Independencia Cartagena
  '2026-12-08', // Inmaculada Concepción
  '2026-12-25', // Navidad
]

// Verifica si un domingo es parte de un puente festivo (lunes festivo)
export function esPuenteFestivo(fecha: Date): boolean {
  // Si es domingo, verificar si el lunes siguiente es festivo
  if (fecha.getDay() === 0) {
    const lunes = new Date(fecha)
    lunes.setDate(lunes.getDate() + 1)
    const lunesStr = lunes.toISOString().split('T')[0]
    return FESTIVOS_COLOMBIA.includes(lunesStr)
  }
  return false
}

// Verifica si una fecha es sábado
export function esSabado(fecha: Date): boolean {
  return fecha.getDay() === 6
}

// Verifica si una fecha es válida para alojamiento
// Solo sábados, y domingos si el lunes es festivo
export function esFechaValidaAlojamiento(fecha: Date): boolean {
  const dia = fecha.getDay()

  // Sábados siempre válidos
  if (dia === 6) return true

  // Domingos solo si es puente festivo
  if (dia === 0) return esPuenteFestivo(fecha)

  return false
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
