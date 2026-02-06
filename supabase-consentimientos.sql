-- =====================================================
-- Script para agregar campos de consentimiento
-- Ejecutar en Supabase SQL Editor
-- =====================================================

-- 1. Agregar columnas de consentimiento a codigos_plan
ALTER TABLE codigos_plan
ADD COLUMN IF NOT EXISTS acepta_politica BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS acepta_marketing BOOLEAN DEFAULT false;

-- 2. Comentarios para documentación
COMMENT ON COLUMN codigos_plan.acepta_politica IS 'Cliente aceptó política de tratamiento de datos (Ley 1581/2012)';
COMMENT ON COLUMN codigos_plan.acepta_marketing IS 'Cliente acepta recibir promociones por WhatsApp/Email';

-- =====================================================
-- Verificar que las columnas se crearon
-- =====================================================
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'codigos_plan'
AND column_name IN ('acepta_politica', 'acepta_marketing');
