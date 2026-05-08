// Server-only utility functions — only call from API routes.
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function crearUsuario(
  nombre: string,
  telefono: string,
  fechaNacimiento: string | null,
  tenantId: string,
  authUserId?: string,
) {
  // El ID siempre proviene de Supabase Auth para garantizar unicidad por persona
  const userId = authUserId ?? crypto.randomUUID();

  const payload: Record<string, unknown> = {
    id:        userId,
    auth_id:   userId,
    nombre,
    telefono,
    tenant_id: tenantId,
  };
  if (fechaNacimiento) payload.fecha_nacimiento = fechaNacimiento;

  const { data, error } = await supabaseAdmin
    .from('usuarios')
    .insert(payload)
    .select()
    .single();

  if (!error) return data;

  // Conflicto de PK: este auth user ya tiene fila — devolver perfil existente
  // (y actualizar nombre si cambió)
  if (error.code === '23505') {
    const { data: existente, error: fetchErr } = await supabaseAdmin
      .from('usuarios')
      .select()
      .eq('id', userId)
      .single();

    if (fetchErr) throw fetchErr;

    if (existente.nombre !== nombre) {
      const { data: actualizado } = await supabaseAdmin
        .from('usuarios')
        .update({ nombre })
        .eq('id', userId)
        .select()
        .single();
      return actualizado ?? existente;
    }

    return existente;
  }

  throw error;
}

export async function obtenerUsuario(userId: string) {
  const { data, error } = await supabaseAdmin
    .from('usuarios')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
}

export async function actualizarPuntos(userId: string, puntos: number) {
  const { data, error } = await supabaseAdmin
    .from('usuarios')
    .update({ puntos_total: puntos })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function obtenerRanking(tenantId: string) {
  const { data, error } = await supabaseAdmin
    .from('usuarios')
    .select('id, nombre, puntos_total, nivel')
    .eq('tenant_id', tenantId)
    .order('puntos_total', { ascending: false })
    .limit(10);

  if (error) throw error;
  return data ?? [];
}
