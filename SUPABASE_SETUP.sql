-- =====================================================
-- CONFIGURACIÓN DE SUPABASE PARA NOTAS APP
-- Copia todo este código y ejecútalo en el SQL Editor
-- =====================================================

-- 1. CREAR LA TABLA NOTAS
-- =====================================================
CREATE TABLE IF NOT EXISTS notas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  contenido TEXT NOT NULL,
  fecha TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CREAR ÍNDICES PARA MEJOR RENDIMIENTO
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_notas_user_id ON notas(user_id);
CREATE INDEX IF NOT EXISTS idx_notas_fecha ON notas(fecha DESC);

-- 3. HABILITAR ROW LEVEL SECURITY
-- =====================================================
ALTER TABLE notas ENABLE ROW LEVEL SECURITY;

-- 4. ELIMINAR POLÍTICAS EXISTENTES (si las hay)
-- =====================================================
DROP POLICY IF EXISTS "Usuarios pueden ver sus propias notas" ON notas;
DROP POLICY IF EXISTS "Usuarios pueden crear sus propias notas" ON notas;
DROP POLICY IF EXISTS "Usuarios pueden actualizar sus propias notas" ON notas;
DROP POLICY IF EXISTS "Usuarios pueden eliminar sus propias notas" ON notas;

-- 5. CREAR POLÍTICAS RLS
-- =====================================================

-- Política SELECT: Solo ver notas propias
CREATE POLICY "Usuarios pueden ver sus propias notas" 
ON notas FOR SELECT 
USING (auth.uid() = user_id);

-- Política INSERT: Solo crear notas para uno mismo
CREATE POLICY "Usuarios pueden crear sus propias notas" 
ON notas FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Política UPDATE: Solo actualizar notas propias
CREATE POLICY "Usuarios pueden actualizar sus propias notas" 
ON notas FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Política DELETE: Solo eliminar notas propias
CREATE POLICY "Usuarios pueden eliminar sus propias notas" 
ON notas FOR DELETE 
USING (auth.uid() = user_id);

-- =====================================================
-- ¡LISTO! Tu base de datos está configurada y segura
-- =====================================================

-- Verificación (opcional): Descomenta para probar
-- SELECT * FROM pg_policies WHERE tablename = 'notas';
