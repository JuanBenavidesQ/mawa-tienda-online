/**
 * Fechas cerradas (exclusividades): espejo `fechas_cerradas` en Supabase,
 * sincronizado desde el backend de Mawá. La tienda solo lee (anon key) para
 * NO ofrecer los días cerrados en el calendario. La guarda real es el trigger
 * de Supabase en `codigos_plan` y la validación server-side de /api/ordenes.
 *
 * Modelo de noches: llegada el día D con N noches ocupa D..D+N-1. La tienda
 * vende 1 noche por reserva.
 */
import type { SupabaseClient } from '@supabase/supabase-js'
import { fechaLocalISO } from './fechas'

export type AlcanceCierre = 'EVENTOS' | 'ALOJAMIENTO' | 'PASADIA'

export type FechaCerrada = {
  fechaInicio: string // YYYY-MM-DD
  fechaFin: string // YYYY-MM-DD inclusive
  cierraEventos: boolean
  cierraAlojamiento: boolean
  cierraPasadia: boolean
  motivo: string
}

/** Carga los cierres vigentes. Sirve con el cliente anon (browser) o el admin (server). */
export async function cargarFechasCerradas(supabase: SupabaseClient | null): Promise<FechaCerrada[]> {
  if (!supabase) return []
  try {
    const { data, error } = await supabase
      .from('fechas_cerradas')
      .select('fecha_inicio, fecha_fin, cierra_eventos, cierra_alojamiento, cierra_pasadia, motivo')
      .eq('activo', true)
      .gte('fecha_fin', fechaLocalISO(new Date()))
    if (error || !data) return []
    return data.map((r) => ({
      fechaInicio: r.fecha_inicio,
      fechaFin: r.fecha_fin,
      cierraEventos: !!r.cierra_eventos,
      cierraAlojamiento: !!r.cierra_alojamiento,
      cierraPasadia: !!r.cierra_pasadia,
      motivo: r.motivo,
    }))
  } catch {
    return []
  }
}

function aplica(c: FechaCerrada, alcance: AlcanceCierre): boolean {
  if (alcance === 'EVENTOS') return c.cierraEventos
  if (alcance === 'ALOJAMIENTO') return c.cierraAlojamiento
  return c.cierraPasadia
}

/** ¿Algún cierre bloquea el día para el alcance? (la tienda vende de a un día / una noche) */
export function cierreDelDia(cierres: FechaCerrada[], fecha: Date, alcance: AlcanceCierre): FechaCerrada | null {
  const dia = fechaLocalISO(fecha)
  for (const c of cierres) {
    if (!aplica(c, alcance)) continue
    if (c.fechaInicio <= dia && c.fechaFin >= dia) return c
  }
  return null
}
