import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const { data: usuario, error } = await supabaseAdmin
      .from('usuarios')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    const { data: transacciones } = await supabaseAdmin
      .from('transacciones_puntos')
      .select('*')
      .eq('usuario_id', id)
      .order('created_at', { ascending: false })
      .limit(20);

    return NextResponse.json({ usuario, transacciones: transacciones ?? [] });
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
