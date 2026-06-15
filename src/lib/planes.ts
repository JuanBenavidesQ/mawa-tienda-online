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

// Planes base (sin descuento aplicado).
// NOTA: esto es solo FALLBACK. La fuente real es Supabase `planes_tipo`
// (sincronizada desde el catálogo del backend). Estructura del relanzamiento:
// Pacífico $60k (solo piscina) → Montaña $70k (solo puentes) → Travesía $80k
// (piscina + puentes, destacado) → Plan Infantil $40k (sin descuento).
export const PLANES_BASE = [
  // ===== PLANES PASADÍA =====
  {
    key: 'PACIFICO_PISCINA',
    nombre: 'Pacífico',
    descripcion: 'Piscinas y toboganes + bebida de bienvenida + almuerzo + bebida + postre',
    precioBase: 60000,
    precioWeb: 57000,
    categoria: 'adulto' as CategoriaPlanes,
    tipo: 'pasadia' as TipoPlan,
    incluye: ['Piscinas y toboganes', 'Bebida de bienvenida', 'Almuerzo', 'Bebida', 'Postre'],
  },
  {
    key: 'MONTANA',
    nombre: 'Montaña',
    descripcion: 'Puentes tibetanos + bebida de bienvenida + almuerzo + bebida + postre',
    precioBase: 70000,
    precioWeb: 66500,
    categoria: 'adulto' as CategoriaPlanes,
    tipo: 'pasadia' as TipoPlan,
    incluye: ['Puentes tibetanos', 'Bebida de bienvenida', 'Almuerzo', 'Bebida', 'Postre'],
  },
  {
    key: 'TRAVESIA',
    nombre: 'Travesía',
    descripcion: 'Piscinas y toboganes + Puentes tibetanos + bebida de bienvenida + almuerzo + bebida + postre',
    precioBase: 80000,
    precioWeb: 76000,
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
  precioWeb?: number // precio final con descuento (tab Planes del admin); null/0 => sin descuento
  categoria: CategoriaPlanes
  tipo: TipoPlan
  incluye: string[]
  destacado?: boolean
  edadMaxima?: number
}
export type PlanKey = string

/**
 * Carga los planes base desde Supabase `planes_tipo`.
 * Solo incluye planes con visible_tienda=true y los metadatos de presentación
 * (categoria, tipo, incluye) vienen de Supabase — controlados desde el admin.
 * Fallback a PLANES_BASE hardcoded si Supabase falla.
 */
export async function cargarPlanesBase(): Promise<PlanBase[]> {
  try {
    const { data, error } = await supabase
      .from('planes_tipo')
      .select('key, nombre, descripcion, precio_base, precio_web, visible_tienda, categoria_tienda, tipo_tienda, incluye_tienda, destacado_tienda, edad_maxima')
      .eq('activo', true)
      .eq('visible_tienda', true)
      .order('orden', { ascending: true })

    if (error || !data || data.length === 0) {
      console.warn('[Tienda] Fallback a PLANES_BASE hardcoded:', error?.message ?? 'sin datos')
      return PLANES_BASE as unknown as PlanBase[]
    }

    const planes: PlanBase[] = []
    for (const p of data) {
      if (!p.categoria_tienda || !p.tipo_tienda) continue
      planes.push({
        key: p.key,
        nombre: p.nombre,
        descripcion: p.descripcion || '',
        precioBase: Number(p.precio_base) || 0,
        precioWeb: p.precio_web != null ? Number(p.precio_web) : undefined,
        categoria: p.categoria_tienda as CategoriaPlanes,
        tipo: p.tipo_tienda as TipoPlan,
        incluye: Array.isArray(p.incluye_tienda) ? p.incluye_tienda : [],
        destacado: Boolean(p.destacado_tienda),
        edadMaxima: p.edad_maxima ?? undefined,
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

// Aplica el precio web (con descuento) definido por plan en el catálogo.
// FUENTE ÚNICA DE VERDAD: precio_base + precio_web del plan (tab "Planes" del
// admin, sincronizado a Supabase planes_tipo). Si precio_web está vacío, es 0,
// o no es menor que el base => el plan se muestra sin descuento.
// (Se retiró configuracion_precios/DESCUENTO_ como fuente para evitar doble verdad.)
export function aplicarPreciosWeb(
  planesBase: PlanBase[] = PLANES_BASE as unknown as PlanBase[]
): PlanConPrecio[] {
  return planesBase.map((plan) => {
    const web = plan.precioWeb
    const precioWeb = web && web > 0 && web < plan.precioBase ? web : plan.precioBase
    return {
      ...plan,
      precioNormal: plan.precioBase,
      precioWeb,
    }
  })
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
