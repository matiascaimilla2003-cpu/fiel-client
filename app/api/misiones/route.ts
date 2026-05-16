import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tenant_slug = searchParams.get('tenant_slug') ?? 'tio-polo';

    const { data: tenant, error: tError } = await supabaseAdmin
      .from('tenants')
      .select('id')
      .eq('slug', tenant_slug)
      .single();

    if (tError || !tenant) {
      return NextResponse.json({ error: 'Tenant no encontrado' }, { status: 404 });
    }

    const now = new Date().toISOString();
    const { data, error } = await supabaseAdmin
      .from('misiones')
      .select('id, titulo, descripcion, puntos_premio, meta_tipo, meta_valor, fecha_fin')
      .eq('tenant_id', tenant.id)
      .eq('activa', true)
      .or(`fecha_fin.is.null,fecha_fin.gte.${now}`)
      .order('created_at', { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ misiones: data ?? [] });
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
