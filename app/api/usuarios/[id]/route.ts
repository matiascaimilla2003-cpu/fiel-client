import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

interface TenantRow { nombre: string; slug: string; }

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!id || typeof id !== 'string' || !id.trim()) {
      return NextResponse.json({ error: 'ID de usuario requerido' }, { status: 400 });
    }

    const { data: usuario, error } = await supabaseAdmin
      .from('usuarios')
      .select('*, tenants(nombre, slug)')
      .eq('id', id.trim())
      .single();

    if (error || !usuario) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // All tenant cards that share the same phone number
    const { data: rows } = await supabaseAdmin
      .from('usuarios')
      .select('id, tenant_id, puntos_total, nivel, racha_dias, tenants(nombre, slug)')
      .eq('telefono', usuario.telefono as string)
      .order('puntos_total', { ascending: false });

    const tarjetas = (rows ?? []).map((row) => {
      const t = row.tenants as TenantRow | null;
      return {
        usuario_id:    row.id           as string,
        tenant_id:     row.tenant_id    as string,
        tenant_nombre: t?.nombre        ?? '',
        tenant_slug:   t?.slug          ?? '',
        puntos_total:  row.puntos_total as number,
        nivel:         row.nivel        as string,
        racha_dias:    row.racha_dias   as number,
      };
    });

    const { data: transacciones } = await supabaseAdmin
      .from('transacciones_puntos')
      .select('*')
      .eq('usuario_id', id)
      .order('created_at', { ascending: false })
      .limit(20);

    const codigo_referido = `CFIEL-${id.trim().substring(0, 6).toUpperCase()}`;

    return NextResponse.json({
      usuario: { ...usuario, codigo_referido },
      tarjetas,
      transacciones: transacciones ?? [],
    });
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    if (!id || typeof id !== 'string' || !id.trim()) {
      return NextResponse.json({ error: 'ID de usuario requerido' }, { status: 400 });
    }
    const body = await request.json();
    const nombre = body?.nombre;
    if (!nombre?.trim()) {
      return NextResponse.json({ error: 'Nombre requerido' }, { status: 400 });
    }
    const { data, error } = await supabaseAdmin
      .from('usuarios')
      .update({ nombre: nombre.trim() })
      .eq('id', id.trim())
      .select()
      .single();
    if (error || !data) {
      return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 });
    }
    return NextResponse.json({ usuario: data });
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
