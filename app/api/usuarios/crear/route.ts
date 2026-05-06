import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { crearUsuario } from '@/lib/actions/usuarios';

export async function POST(request: NextRequest) {
  try {
    const { nombre, telefono, fecha_nacimiento, auth_user_id } = await request.json();

    if (!nombre || !telefono) {
      return NextResponse.json({ error: 'nombre y telefono son requeridos' }, { status: 400 });
    }

    const { data: tenant, error: tenantError } = await supabaseAdmin
      .from('tenants')
      .select('id')
      .eq('slug', 'tio-polo')
      .single();

    if (tenantError || !tenant) {
      return NextResponse.json({ error: 'Tenant no encontrado' }, { status: 404 });
    }

    const usuario = await crearUsuario(
      nombre,
      telefono,
      fecha_nacimiento ?? null,
      tenant.id,
      auth_user_id,
    );

    return NextResponse.json({ usuario });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error interno';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
