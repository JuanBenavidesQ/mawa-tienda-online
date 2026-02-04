-- =====================================================
-- Tabla de Configuracion de Precios para Tienda Web
-- Ejecutar en Supabase SQL Editor
-- =====================================================

-- Crear tabla de configuracion
CREATE TABLE IF NOT EXISTS configuracion_precios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clave TEXT UNIQUE NOT NULL,
  valor TEXT NOT NULL,
  descripcion TEXT,
  actualizado_por TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insertar configuracion inicial de descuento web (10%)
INSERT INTO configuracion_precios (clave, valor, descripcion, actualizado_por)
VALUES (
  'DESCUENTO_WEB_PORCENTAJE',
  '10',
  'Porcentaje de descuento para compras online',
  'SISTEMA'
)
ON CONFLICT (clave) DO NOTHING;

-- Funcion para actualizar timestamp automaticamente
CREATE OR REPLACE FUNCTION update_configuracion_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar timestamp
DROP TRIGGER IF EXISTS trigger_update_configuracion_timestamp ON configuracion_precios;
CREATE TRIGGER trigger_update_configuracion_timestamp
  BEFORE UPDATE ON configuracion_precios
  FOR EACH ROW
  EXECUTE FUNCTION update_configuracion_timestamp();

-- Habilitar RLS
ALTER TABLE configuracion_precios ENABLE ROW LEVEL SECURITY;

-- Politica: Cualquiera puede leer (para la tienda web)
CREATE POLICY "Lectura publica de configuracion"
  ON configuracion_precios
  FOR SELECT
  USING (true);

-- =====================================================
-- INSTRUCCIONES PARA EL SUPERVISOR
-- =====================================================
-- Para cambiar el descuento, ejecutar:
--
-- UPDATE configuracion_precios
-- SET valor = '15', actualizado_por = 'SUPERVISOR_NOMBRE'
-- WHERE clave = 'DESCUENTO_WEB_PORCENTAJE';
--
-- Valores ejemplo:
--   '10' = 10% de descuento
--   '15' = 15% de descuento
--   '0'  = Sin descuento
-- =====================================================
