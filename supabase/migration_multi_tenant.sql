-- ── Multi-tenant user cards ───────────────────────────────────────────────────

-- 1. Add auth_id to link multiple tenant rows to the same Supabase Auth user
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS auth_id uuid;

-- 2. Backfill: existing users have id = auth_id (first registration pattern)
UPDATE usuarios SET auth_id = id WHERE auth_id IS NULL;

-- 3. Replace unique(tenant_id, telefono) with unique(auth_id, tenant_id)
ALTER TABLE usuarios DROP CONSTRAINT IF EXISTS usuarios_tenant_id_telefono_key;
ALTER TABLE usuarios ADD CONSTRAINT usuarios_auth_id_tenant_id_key
  UNIQUE (auth_id, tenant_id);

-- 4. Helper function used by the API to get all cards for a user
CREATE OR REPLACE FUNCTION get_tarjetas_usuario(p_telefono text)
RETURNS TABLE(
  usuario_id    uuid,
  tenant_id     uuid,
  tenant_nombre text,
  tenant_slug   text,
  puntos_total  integer,
  nivel         text,
  racha_dias    integer
)
LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT
    u.id            AS usuario_id,
    u.tenant_id,
    t.nombre        AS tenant_nombre,
    t.slug          AS tenant_slug,
    u.puntos_total,
    u.nivel,
    u.racha_dias
  FROM  usuarios u
  JOIN  tenants  t ON t.id = u.tenant_id
  WHERE u.telefono = p_telefono
  ORDER BY u.puntos_total DESC;
$$;
