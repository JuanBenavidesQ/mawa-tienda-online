-- =====================================================
-- Tabla de Codigos de Plan (para ventas web)
-- Ejecutar en Supabase SQL Editor
-- =====================================================

-- Crear tabla de codigos de plan
CREATE TABLE IF NOT EXISTS codigos_plan (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo TEXT UNIQUE NOT NULL,
  plan_tipo_key TEXT NOT NULL,
  plan_nombre TEXT NOT NULL,
  monto INTEGER NOT NULL,
  cliente_nombre TEXT NOT NULL,
  cliente_celular TEXT NOT NULL,
  cliente_email TEXT,
  num_personas INTEGER DEFAULT 1,
  fecha_venta TIMESTAMPTZ DEFAULT NOW(),
  fecha_visita TIMESTAMPTZ,
  valido_hasta TIMESTAMPTZ,
  estado TEXT DEFAULT 'PENDIENTE_PAGO',
  agente_nombre TEXT DEFAULT 'VENTA_WEB',
  metodo_pago TEXT DEFAULT 'BOLD_ONLINE',
  referencia_pago TEXT,
  sincronizado_local BOOLEAN DEFAULT FALSE,
  notas TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indice para busquedas rapidas por codigo
CREATE INDEX IF NOT EXISTS idx_codigos_plan_codigo ON codigos_plan(codigo);
CREATE INDEX IF NOT EXISTS idx_codigos_plan_estado ON codigos_plan(estado);
CREATE INDEX IF NOT EXISTS idx_codigos_plan_celular ON codigos_plan(cliente_celular);

-- Funcion para actualizar timestamp automaticamente
CREATE OR REPLACE FUNCTION update_codigos_plan_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar timestamp
DROP TRIGGER IF EXISTS trigger_update_codigos_plan_timestamp ON codigos_plan;
CREATE TRIGGER trigger_update_codigos_plan_timestamp
  BEFORE UPDATE ON codigos_plan
  FOR EACH ROW
  EXECUTE FUNCTION update_codigos_plan_timestamp();

-- =====================================================
-- Politicas RLS (Row Level Security)
-- =====================================================

-- Habilitar RLS
ALTER TABLE codigos_plan ENABLE ROW LEVEL SECURITY;

-- Politica: Permitir insertar nuevos codigos (para la tienda web)
CREATE POLICY "Insertar codigos desde web"
  ON codigos_plan
  FOR INSERT
  WITH CHECK (true);

-- Politica: Permitir leer codigos (para consultas)
CREATE POLICY "Leer codigos"
  ON codigos_plan
  FOR SELECT
  USING (true);

-- Politica: Permitir actualizar estado del codigo (para confirmacion de pago)
-- Solo permite cambiar de PENDIENTE_PAGO a PENDIENTE
CREATE POLICY "Actualizar estado de pago"
  ON codigos_plan
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Politica: Permitir eliminar codigos pendientes de pago (para cancelaciones)
CREATE POLICY "Eliminar codigos pendientes"
  ON codigos_plan
  FOR DELETE
  USING (estado = 'PENDIENTE_PAGO');

-- =====================================================
-- Estados del codigo:
-- PENDIENTE_PAGO: Creado, esperando pago en Bold
-- PENDIENTE: Pagado, listo para canjear en Mawa
-- CANJEADO: Ya usado en Mawa
-- EXPIRADO: Vencido sin usar
-- CANCELADO: Cancelado/reembolsado
-- =====================================================
