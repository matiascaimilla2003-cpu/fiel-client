import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const usuario_id = searchParams.get('usuario_id');

  if (!usuario_id) {
    return NextResponse.json({ error: 'usuario_id requerido' }, { status: 400 });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('referidos')
      .select('id, estado, puntos_acreditados, created_at, usuario_referido')
      .eq('usuario_referidor', usuario_id)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const referidoIds = (data ?? [])
      .map((r: { usuario_referido: string }) => r.usuario_referido)
      .filter(Boolean);

    const nombreMap: Record<string, string> = {};
    if (referidoIds.length > 0) {
      const { data: usuarios } = await supabaseAdmin
        .from('usuarios')
        .select('id, nombre')
        .in('id', referidoIds);
      for (const u of usuarios ?? []) {
        nombreMap[u.id] = u.nombre;
      }
    }

    const referidos = (data ?? []).map((r: {
      id: string;
      usuario_referido: string;
      estado: string;
      puntos_acreditados: number;
      created_at: string;
    }) => ({
      id: r.id,
      nombre: nombreMap[r.usuario_referido] ?? 'Amigo',
      estado: r.estado,
      puntos_acreditados: r.puntos_acreditados ?? 0,
      created_at: r.created_at,
    }));

    const total_registrados = referidos.filter((r) => r.estado === 'registrado').length;
    const total_puntos = referidos.reduce((sum, r) => sum + r.puntos_acreditados, 0);

    return NextResponse.json({
      referidos,
      total_invitados: referidos.length,
      total_registrados,
      total_puntos,
    });
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
