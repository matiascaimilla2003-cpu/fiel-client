import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tenant_id = searchParams.get('tenant_id');

    if (!tenant_id) {
      return NextResponse.json({ error: 'tenant_id requerido' }, { status: 400 });
    }

    const now = new Date().toISOString();

    const { data, error } = await supabaseAdmin
      .from('promociones')
      .select('id, titulo, descripcion, tipo, valor, fecha_inicio, fecha_fin, usos_por_cliente')
      .eq('tenant_id', tenant_id)
      .eq('activa', true)
      .gt('fecha_fin', now)
      .order('fecha_fin', { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ promociones: data ?? [] });
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
