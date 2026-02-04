import { customAlphabet } from 'nanoid'

// Genera código tipo MAWA-ABC123 (6 caracteres alfanuméricos)
const generateId = customAlphabet('ABCDEFGHJKLMNPQRSTUVWXYZ23456789', 6)

export function generarCodigoVenta(): string {
  return `MAWA-${generateId()}`
}

// Planes disponibles para venta online (con descuento web)
export const PLANES_WEB = [
  {
    key: 'PACIFICO_PISCINA',
    nombre: 'Pacífico - Piscina',
    descripcion: 'Disfruta de nuestras piscinas naturales con vista al río',
    precioNormal: 60000,
    precioWeb: 54000,
    incluye: ['Acceso a piscinas', 'Zona de hamacas', 'Parqueadero'],
  },
  {
    key: 'PACIFICO_PUENTES',
    nombre: 'Pacífico - Puentes',
    descripcion: 'Aventura en los puentes colgantes sobre el río',
    precioNormal: 60000,
    precioWeb: 54000,
    incluye: ['Recorrido puentes', 'Guía acompañante', 'Parqueadero'],
  },
  {
    key: 'TRAVESIA',
    nombre: 'Travesía Completa',
    descripcion: 'La experiencia completa: piscinas + puentes + sendero ecológico',
    precioNormal: 70000,
    precioWeb: 63000,
    incluye: ['Piscinas', 'Puentes', 'Sendero ecológico', 'Guía', 'Parqueadero'],
    destacado: true,
  },
] as const

export type PlanKey = typeof PLANES_WEB[number]['key']

// Formatea número como moneda COP
export function formatCOP(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Calcula el porcentaje de descuento
export function calcularDescuento(precioNormal: number, precioWeb: number): number {
  return Math.round(((precioNormal - precioWeb) / precioNormal) * 100)
}
