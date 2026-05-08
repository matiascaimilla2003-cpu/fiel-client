import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('[CREAR] Body:', JSON.stringify(body));

    const { nombre, telefono, fecha_nacimiento } = body as {
      nombre?: string;
      telefono?: string;
      fecha_nacimiento?: string;
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
        puntos_total: 0,
        nivel: 'bronce',
        racha_dias: 0,
      })
      .select()
      .single();

    console.log('[CREAR] Nuevo:', nuevo, 'Error:', insertError);

    if (insertError) {
      return Response.json({ error: insertError.message }, { status: 500 });
    }

    return Response.json({ usuario: nuevo });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[CREAR] Error:', msg);
    return Response.json({ error: msg }, { status: 500 });
  }
}
