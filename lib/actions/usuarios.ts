// Server-only utility functions — only call from API routes.
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function crearUsuario(
  nombre: string,
  telefono: string,
  fechaNacimiento: string | null,
  tenantId: string,
) {
  console.log('[USUARIOS] Buscando teléfono:', telefono, '| Tenant ID:', tenantId);

  // Buscar por teléfono + tenant: misma persona → devolver su perfil sin modificar puntos
  const { data: existente, error: buscarError } = await supabaseAdmin
    .from('usuarios')
    .select('*')
    .eq('telefono', telefono)
    .eq('tenant_id', tenantId)
    .maybeSingle();

  if (buscarError) {
    console.error('[USUARIOS] Error Supabase al buscar:', JSON.stringify(buscarError));
  }

  if (existente) {
    console.log('[USUARIOS] Usuario existente:', existente.id, 'puntos:', existente.puntos_total);
    return existente;
  }

  // No existe → INSERT sin id explícito, Supabase genera el UUID automáticamente
  const insertPayload: Record<string, unknown> = {
    nombre,
    telefono,
    tenant_id:    tenantId,
    puntos_total: 0,
    nivel:        'bronce',
    racha_dias:   0,
  };
  if (fechaNacimiento) insertPayload.fecha_nacimiento = fechaNacimiento;

  console.log('[USUARIOS] Insertando payload:', JSON.stringify(insertPayload));

  const { data, error } = await supabaseAdmin
    .from('usuarios')
    .insert(insertPayload)
    .select()
    .single();

  if (error) {
    console.error('[USUARIOS] Error Supabase al insertar:', JSON.stringify(error));
    throw error;
  }

  console.log('[USUARIOS] Usuario creado:', data.id, 'puntos:', data.puntos_total);
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
