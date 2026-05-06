import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

function calcularNivel(puntos: number): string {
  if (puntos >= 2000) return 'platino';
  if (puntos >= 1000) return 'oro';
  if (puntos >= 500)  return 'plata';
  return 'bronce';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      usuario_id,
      monto,
      descripcion,
      referencia_externa,
    }: {
      usuario_id: string;
      tenant_id?: string;
      tenant_slug?: string;
      monto: number;
      descripcion?: string;
      referencia_externa?: string;
    } = body;

    let tenant_id: string = body.tenant_id;

    if (!tenant_id && body.tenant_slug) {
      const { data: tenant } = await supabaseAdmin
        .from('tenants')
        .select('id')
        .eq('slug', body.tenant_slug)
        .single();
      tenant_id = tenant?.id;
    }

    if (!usuario_id || !tenant_id || !monto) {
      return NextResponse.json(
        { error: 'usuario_id, tenant_id (o tenant_slug) y monto son requeridos' },
        { status: 400 },
      );
    }

    const puntos_ganados = Math.max(1, Math.floor(monto / 100));

    const { data: usuario, error: userError } = await supabaseAdmin
      .from('usuarios')
      .select('puntos_total, nivel, nombre')
      .eq('id', usuario_id)
      .single();

    if (userError || !usuario) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    const puntos_total = usuario.puntos_total + puntos_ganados;
    const nivel_nuevo  = calcularNivel(puntos_total);
    const subio_nivel  = nivel_nuevo !== usuario.nivel;

    await supabaseAdmin.from('transacciones_puntos').insert({
      usuario_id,
      tenant_id,
      tipo: 'compra',
      puntos: puntos_ganados,
      descripcion: descripcion ?? `Compra $${monto.toLocaleString('es-CL')}`,
      referencia_externa: referencia_externa ?? null,
    });

    await supabaseAdmin
      .from('usuarios')
      .update({ puntos_total, nivel: nivel_nuevo })
      .eq('id', usuario_id);

    return NextResponse.json({
      puntos_ganados,
      puntos_total,
      nivel_nuevo,
      subio_nivel,
      nombre: usuario.nombre,
    });
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
