// Festivos Colombia 2026 (lunes festivos)
// Fuente: Ley 51 de 1983 - festivos trasladados al lunes
export const FESTIVOS_2026 = [
  '2026-01-12', // Reyes Magos (trasladado)
  '2026-03-23', // San Jose (trasladado)
  '2026-04-02', // Jueves Santo
  '2026-04-03', // Viernes Santo
  '2026-05-18', // Ascension del Senor (trasladado)
  '2026-06-08', // Corpus Christi (trasladado)
  '2026-06-15', // Sagrado Corazon (trasladado)
  '2026-06-29', // San Pedro y San Pablo (trasladado)
  '2026-07-20', // Independencia
  '2026-08-07', // Batalla de Boyaca
  '2026-08-17', // Asuncion de la Virgen (trasladado)
  '2026-10-12', // Dia de la Raza (trasladado)
  '2026-11-02', // Todos los Santos (trasladado)
  '2026-11-16', // Independencia de Cartagena (trasladado)
  '2026-12-25', // Navidad
]

/**
 * Verifica si una fecha es dia de apertura (sabado, domingo o festivo)
 */
export function esDiaApertura(fecha: Date): boolean {
  const diaSemana = fecha.getDay() // 0 = domingo, 6 = sabado
  const fechaStr = fecha.toISOString().split('T')[0]

  // Sabado o domingo
  if (diaSemana === 0 || diaSemana === 6) {
    return true
  }

  // Festivo
  if (FESTIVOS_2026.includes(fechaStr)) {
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
  const fechaStr = fecha.toISOString().split('T')[0]

  if (FESTIVOS_2026.includes(fechaStr)) {
    return 'Festivo'
  }
  if (diaSemana === 0) return 'Domingo'
  if (diaSemana === 6) return 'Sabado'
  return ''
}
