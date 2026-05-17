import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

function calcularNivel(puntos: number): string {
  if (puntos >= 2000) return 'platino';
  if (puntos >= 1000) return 'oro';
  if (puntos >= 500) return 'plata';
  return 'bronce';
}

async function acreditarPuntos(
  usuarioId: string,
  tenantId: string,
  puntos: number,
  descripcion: string,
) {
  const { data: user } = await supabaseAdmin
    .from('usuarios')
    .select('puntos_total, nivel')
    .eq('id', usuarioId)
    .single();

  if (!user) return;

  const nuevoTotal = user.puntos_total + puntos;
  const nuevoNivel = calcularNivel(nuevoTotal);

  await supabaseAdmin.from('transacciones_puntos').insert({
    usuario_id: usuarioId,
    tenant_id: tenantId,
    tipo: 'bono',
    puntos,
    descripcion,
  });

  await supabaseAdmin
    .from('usuarios')
    .update({ puntos_total: nuevoTotal, nivel: nuevoNivel })
    .eq('id', usuarioId);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { codigo_referido, nuevo_usuario_id, tenant_id } = body as {
      codigo_referido: string;
      nuevo_usuario_id: string;
      tenant_id: string;
    };

    if (!codigo_referido || !nuevo_usuario_id || !tenant_id) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }

    // Parse "CFIEL-04863C" → "04863c"
    const upperCode = codigo_referido.toUpperCase().trim();
    if (!upperCode.startsWith('CFIEL-') || upperCode.length !== 12) {
      return NextResponse.json({ error: 'Código de referido inválido' }, { status: 400 });
    }
    const prefix = upperCode.slice(6).toLowerCase();

    const { data: referidores } = await supabaseAdmin
      .from('usuarios')
      .select('id, nombre, tenant_id')
      .like('id', `${prefix}%`)
      .eq('tenant_id', tenant_id)
      .limit(1);

    const referidor = referidores?.[0];
    if (!referidor) {
      return NextResponse.json({ error: 'Código de referido no encontrado' }, { status: 404 });
    }

    if (referidor.id === nuevo_usuario_id) {
      return NextResponse.json({ error: 'No puedes referirte a ti mismo' }, { status: 400 });
    }

    const { data: existingRef } = await supabaseAdmin
      .from('referidos')
      .select('id')
      .eq('usuario_referido', nuevo_usuario_id)
      .maybeSingle();

    if (existingRef) {
      return NextResponse.json(
        { error: 'Este usuario ya usó un código de referido' },
        { status: 400 },
      );
    }

    await supabaseAdmin.from('referidos').insert({
      usuario_referidor: referidor.id,
      usuario_referido: nuevo_usuario_id,
      tenant_id,
      estado: 'registrado',
      puntos_acreditados: 250,
    });

    await acreditarPuntos(referidor.id, tenant_id, 250, 'Bono por referido');
    await acreditarPuntos(nuevo_usuario_id, tenant_id, 200, 'Bono extra por código de invitación');

    return NextResponse.json({
      exito: true,
      referidor_nombre: referidor.nombre,
      puntos_acreditados: 250,
    });
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
