import { supabaseAdmin } from '@/lib/supabase-admin';

function calcularNivel(puntos: number): string {
  if (puntos >= 2000) return 'platino';
  if (puntos >= 1000) return 'oro';
  if (puntos >= 500) return 'plata';
  return 'bronce';
}

async function aplicarReferido(
  codigoReferido: string,
  nuevoUsuarioId: string,
  tenantId: string,
): Promise<void> {
  const upperCode = codigoReferido.toUpperCase().trim();
  if (!upperCode.startsWith('CFIEL-') || upperCode.length !== 12) return;
  const prefix = upperCode.slice(6).toLowerCase();

  const { data: referidores } = await supabaseAdmin
    .from('usuarios')
    .select('id, nombre')
    .like('id', `${prefix}%`)
    .eq('tenant_id', tenantId)
    .limit(1);

  const referidor = referidores?.[0];
  if (!referidor || referidor.id === nuevoUsuarioId) return;

  const { data: existing } = await supabaseAdmin
    .from('referidos')
    .select('id')
    .eq('usuario_referido', nuevoUsuarioId)
    .maybeSingle();
  if (existing) return;

  await supabaseAdmin.from('referidos').insert({
    usuario_referidor: referidor.id,
    usuario_referido: nuevoUsuarioId,
    tenant_id: tenantId,
    estado: 'registrado',
    puntos_acreditados: 250,
  });

  // +250 pts al referidor
  const { data: refUser } = await supabaseAdmin
    .from('usuarios')
    .select('puntos_total')
    .eq('id', referidor.id)
    .single();
  if (refUser) {
    const total = refUser.puntos_total + 250;
    await supabaseAdmin.from('transacciones_puntos').insert({
      usuario_id: referidor.id,
      tenant_id: tenantId,
      tipo: 'bono',
      puntos: 250,
      descripcion: 'Bono por referido',
    });
    await supabaseAdmin
      .from('usuarios')
      .update({ puntos_total: total, nivel: calcularNivel(total) })
      .eq('id', referidor.id);
  }

  // +200 pts extra al nuevo usuario (ya tiene 200 → total 400)
  const { data: newUser } = await supabaseAdmin
    .from('usuarios')
    .select('puntos_total')
    .eq('id', nuevoUsuarioId)
    .single();
  if (newUser) {
    const total = newUser.puntos_total + 200;
    await supabaseAdmin.from('transacciones_puntos').insert({
      usuario_id: nuevoUsuarioId,
      tenant_id: tenantId,
      tipo: 'bono',
      puntos: 200,
      descripcion: 'Bono extra por código de invitación',
    });
    await supabaseAdmin
      .from('usuarios')
      .update({ puntos_total: total, nivel: calcularNivel(total) })
      .eq('id', nuevoUsuarioId);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('[CREAR] Body:', JSON.stringify(body));

    const { nombre, telefono, fecha_nacimiento, codigo_referido } = body as {
      nombre?: string;
      telefono?: string;
      fecha_nacimiento?: string;
      codigo_referido?: string;
    };

    if (!nombre || !telefono) {
      return Response.json({ error: 'Faltan campos' }, { status: 400 });
    }

    // Obtener tenant de Tío Polo
    const { data: tenant, error: tenantError } = await supabaseAdmin
      .from('tenants')
      .select('id')
      .eq('slug', 'tio-polo')
      .single();

    console.log('[CREAR] Tenant:', tenant, 'Error:', tenantError);

    if (tenantError || !tenant) {
      return Response.json({ error: 'Tenant no encontrado' }, { status: 404 });
    }

    // Buscar si ya existe
    const { data: existing } = await supabaseAdmin
      .from('usuarios')
      .select('*')
      .eq('telefono', telefono)
      .eq('tenant_id', tenant.id)
      .maybeSingle();

    console.log('[CREAR] Existing:', existing);

    if (existing) {
      return Response.json({ usuario: existing });
    }

    // Crear nuevo usuario — sin id explícito, Supabase genera el UUID
    const { data: nuevo, error: insertError } = await supabaseAdmin
      .from('usuarios')
      .insert({
        nombre,
        telefono,
        fecha_nacimiento: fecha_nacimiento || null,
        tenant_id: tenant.id,
        puntos_total: 200,
        nivel: 'bronce',
        racha_dias: 0,
      })
      .select()
      .single();

    console.log('[CREAR] Nuevo:', nuevo, 'Error:', insertError);

    if (insertError) {
      return Response.json({ error: insertError.message }, { status: 500 });
    }

    // Registrar bono de bienvenida en transacciones_puntos
    const { error: txError } = await supabaseAdmin
      .from('transacciones_puntos')
      .insert({
        usuario_id:  nuevo.id,
        tenant_id:   tenant.id,
        tipo:        'bono',
        puntos:      200,
        descripcion: 'Bono de bienvenida',
      });

    if (txError) {
      console.error('[CREAR] Error al registrar transacción de bienvenida:', txError.message);
    }

    // Aplicar código de referido si viene en la solicitud
    if (codigo_referido?.trim()) {
      try {
        await aplicarReferido(codigo_referido.trim(), nuevo.id, tenant.id);
      } catch (refErr) {
        console.error('[CREAR] Error al aplicar referido (no bloquea):', refErr);
      }
    }

    return Response.json({ usuario: nuevo });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[CREAR] Error:', msg);
    return Response.json({ error: msg }, { status: 500 });
  }
}
