// Server-only utility functions — only call from API routes.
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function crearUsuario(
  nombre: string,
  telefono: string,
  fechaNacimiento: string | null,
  tenantId: string,
  authUserId?: string,
) {
  const payload: Record<string, unknown> = { nombre, telefono, tenant_id: tenantId };
  if (fechaNacimiento) payload.fecha_nacimiento = fechaNacimiento;
  if (authUserId)      payload.id = authUserId;

  const { data, error } = await supabaseAdmin
    .from('usuarios')
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return data;
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
