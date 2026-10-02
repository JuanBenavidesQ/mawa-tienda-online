// Festivos de Colombia (Ley 51 de 1983; los trasladables pasan al lunes).
// Mawá abre TODOS los festivos, también los que caen entre semana sin puente.
// Agregar cada año nuevo antes de diciembre: la tienda vende con anticipación.
export const FESTIVOS = [
  // 2026
  '2026-01-01', // Año Nuevo
  '2026-01-12', // Reyes Magos (trasladado)
  '2026-03-23', // San José (trasladado)
  '2026-04-02', // Jueves Santo
  '2026-04-03', // Viernes Santo
  '2026-05-01', // Día del Trabajo
  '2026-05-18', // Ascensión del Señor (trasladado)
  '2026-06-08', // Corpus Christi (trasladado)
  '2026-06-15', // Sagrado Corazón (trasladado)
  '2026-06-29', // San Pedro y San Pablo (trasladado)
  '2026-07-20', // Independencia
  '2026-08-07', // Batalla de Boyacá
  '2026-08-17', // Asunción de la Virgen (trasladado)
  '2026-10-12', // Día de la Raza (trasladado)
  '2026-11-02', // Todos los Santos (trasladado)
  '2026-11-16', // Independencia de Cartagena (trasladado)
  '2026-12-08', // Inmaculada Concepción
  '2026-12-25', // Navidad
  // 2027
  '2027-01-01', // Año Nuevo
  '2027-01-11', // Reyes Magos (trasladado)
  '2027-03-22', // San José (trasladado)
  '2027-03-25', // Jueves Santo
  '2027-03-26', // Viernes Santo
  '2027-05-01', // Día del Trabajo
  '2027-05-10', // Ascensión del Señor (trasladado)
  '2027-05-31', // Corpus Christi (trasladado)
  '2027-06-07', // Sagrado Corazón (trasladado)
  '2027-07-05', // San Pedro y San Pablo (trasladado)
  '2027-07-20', // Independencia
  '2027-08-07', // Batalla de Boyacá
  '2027-08-16', // Asunción de la Virgen (trasladado)
  '2027-10-18', // Día de la Raza (trasladado)
  '2027-11-01', // Todos los Santos
  '2027-11-15', // Independencia de Cartagena (trasladado)
  '2027-12-08', // Inmaculada Concepción
  '2027-12-25', // Navidad
]

/**
 * 'YYYY-MM-DD' de la fecha en la zona horaria LOCAL del navegador. Antes se
 * usaba toISOString() (UTC): a un cliente fuera de Colombia le podía correr
 * el día y marcar mal los festivos.
 */
export function fechaLocalISO(fecha: Date): string {
  const y = fecha.getFullYear()
  const m = String(fecha.getMonth() + 1).padStart(2, '0')
  const d = String(fecha.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/**
 * Convierte lo que devuelve la API a Date sin correr el día. `fecha_visita` y
 * `valido_hasta` son columnas `date` en Supabase ("2026-09-26"): con
 * `new Date("2026-09-26")` JS asume medianoche UTC, que en Bogotá es las 7 pm
 * del día ANTERIOR, y /exito mostraba "viernes 25" para un sábado 26. Un valor
 * solo-día se ancla al mediodía UTC (mismo día en cualquier zona horaria); un
 * timestamp completo se respeta tal cual.
 */
export function parsearFechaApi(valor: string | null | undefined): Date | null {
  if (!valor) return null
  const soloDia = /^(\d{4})-(\d{2})-(\d{2})$/.exec(valor.trim())
  const fecha = soloDia
    ? new Date(Date.UTC(Number(soloDia[1]), Number(soloDia[2]) - 1, Number(soloDia[3]), 12))
    : new Date(valor)
  return isNaN(fecha.getTime()) ? null : fecha
}

/**
 * Verifica si una fecha es día de apertura (sábado, domingo o festivo)
 */
export function esDiaApertura(fecha: Date): boolean {
  const diaSemana = fecha.getDay() // 0 = domingo, 6 = sábado
  const fechaStr = fechaLocalISO(fecha)

  // Sabado o domingo
  if (diaSemana === 0 || diaSemana === 6) {
    return true
  }

  // Festivo
  if (FESTIVOS.includes(fechaStr)) {
    return true
  }

  return false
}

/**
 * Genera las fechas disponibles para los proximos N dias
 * Solo sabados, domingos y festivos
 */
export function obtenerFechasDisponibles(diasAnticipacion: number = 15): Date[] {
  const fechas: Date[] = []
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)

  // Desde manana hasta diasAnticipacion dias adelante
  for (let i = 1; i <= diasAnticipacion; i++) {
    const fecha = new Date(hoy)
    fecha.setDate(hoy.getDate() + i)

    if (esDiaApertura(fecha)) {
      fechas.push(new Date(fecha))
    }
  }

  return fechas
}

/**
 * Calcula la fecha de vencimiento (fecha elegida + 30 dias)
 */
export function calcularFechaVencimiento(fechaVisita: Date): Date {
  const vencimiento = new Date(fechaVisita)
  vencimiento.setDate(vencimiento.getDate() + 30)
  return vencimiento
}

/**
 * Formatea fecha para mostrar al usuario
 */
export function formatearFecha(fecha: Date): string {
  return fecha.toLocaleDateString('es-CO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Formatea fecha corta
 */
export function formatearFechaCorta(fecha: Date): string {
  return fecha.toLocaleDateString('es-CO', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

/**
 * Obtiene el nombre del tipo de dia
 */
export function tipoDia(fecha: Date): string {
  const diaSemana = fecha.getDay()
  const fechaStr = fechaLocalISO(fecha)

  if (FESTIVOS.includes(fechaStr)) {
    return 'Festivo'
  }
  if (diaSemana === 0) return 'Domingo'
  if (diaSemana === 6) return 'Sábado'
  return ''
}
