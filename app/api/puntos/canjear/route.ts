import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: NextRequest) {
  try {
    const { usuario_id, tenant_id, beneficio_id } = await request.json();

    if (!usuario_id || !tenant_id || !beneficio_id) {
      return NextResponse.json(
        { error: 'usuario_id, tenant_id y beneficio_id son requeridos' },
        { status: 400 },
      );
    }

    const { data: beneficio, error: bError } = await supabaseAdmin
      .from('beneficios')
      .select('puntos_costo, nombre')
      .eq('id', beneficio_id)
      .single();

    if (bError || !beneficio) {
      return NextResponse.json({ error: 'Beneficio no encontrado' }, { status: 404 });
    }

    const { data: usuario, error: uError } = await supabaseAdmin
      .from('usuarios')
      .select('puntos_total')
      .eq('id', usuario_id)
      .single();

    if (uError || !usuario) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    if (usuario.puntos_total < beneficio.puntos_costo) {
      return NextResponse.json({ error: 'Puntos insuficientes' }, { status: 400 });
    }

    const puntos_restantes = usuario.puntos_total - beneficio.puntos_costo;
    const codigo_canje = `CFIEL-${Math.random().toString(36).toUpperCase().slice(2, 8)}`;

    await supabaseAdmin.from('canjes').insert({
      usuario_id,
      tenant_id,
      beneficio_id,
      puntos_usados: beneficio.puntos_costo,
      codigo_canje,
    });

    await supabaseAdmin.from('transacciones_puntos').insert({
      usuario_id,
      tenant_id,
      tipo: 'canje',
      puntos: -beneficio.puntos_costo,
      descripcion: `Canje: ${beneficio.nombre}`,
    });

    await supabaseAdmin
      .from('usuarios')
      .update({ puntos_total: puntos_restantes })
      .eq('id', usuario_id);

    return NextResponse.json({
      codigo_canje,
      puntos_usados: beneficio.puntos_costo,
      puntos_restantes,
    });
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
