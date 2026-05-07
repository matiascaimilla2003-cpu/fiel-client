import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ tenant_slug: string }> },
) {
  try {
    const { tenant_slug } = await params;

    const { data: tenant, error: tError } = await supabaseAdmin
      .from('tenants')
      .select('id')
      .eq('slug', tenant_slug)
      .single();

    if (tError || !tenant) {
      return NextResponse.json({ error: 'Tenant no encontrado' }, { status: 404 });
    }

    const { data, error } = await supabaseAdmin
      .from('beneficios')
      .select('id, nombre, descripcion, puntos_costo, icono')
      .eq('tenant_id', tenant.id)
      .eq('disponible', true)
      .order('puntos_costo', { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ beneficios: data ?? [], tenant_id: tenant.id });
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
