// Server-only utility functions — only call from API routes.
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function crearUsuario(
  nombre: string,
  telefono: string,
  fechaNacimiento: string | null,
  tenantId: string,
  authId: string,
) {
  console.log('[CFIEL] crearUsuario: buscando por auth_id:', authId);

  // Buscar por auth_id: misma persona en otro dispositivo → devolver su perfil
  const { data: existente } = await supabaseAdmin
    .from('usuarios')
    .select()
    .eq('auth_id', authId)
    .maybeSingle();

  if (existente) {
    console.log('[CFIEL] Usuario existente encontrado:', existente.id, 'puntos:', existente.puntos_total);
    // Actualizar nombre si cambió
    if (existente.nombre !== nombre) {
      const { data: actualizado } = await supabaseAdmin
        .from('usuarios')
        .update({ nombre })
        .eq('id', existente.id)
        .select()
        .single();
      return actualizado ?? existente;
    }
    return existente;
  }

  // No existe → crear nuevo perfil desde cero
  const payload: Record<string, unknown> = {
    id:           authId,
    auth_id:      authId,
    nombre,
    telefono,
    tenant_id:    tenantId,
    puntos_total: 0,
    nivel:        'bronce',
    racha_dias:   0,
  };
  if (fechaNacimiento) payload.fecha_nacimiento = fechaNacimiento;

  console.log('[CFIEL] Creando nuevo usuario:', authId, nombre);

  const { data, error } = await supabaseAdmin
    .from('usuarios')
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  console.log('[CFIEL] Usuario creado:', data.id, 'puntos:', data.puntos_total);
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
