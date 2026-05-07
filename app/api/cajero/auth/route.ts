import { NextRequest, NextResponse } from 'next/server';

const COOKIE_NAME = 'cfiel_cajero_auth';
const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
};

// POST — verificar contraseña y emitir cookie de sesión
export async function POST(request: NextRequest) {
  const { password } = await request.json();

  if (!password || password !== process.env.CAJERO_PASSWORD) {
    return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, '1', { ...COOKIE_OPTS, maxAge: 60 * 60 * 8 }); // 8 horas
  return res;
}

// DELETE — cerrar sesión (borrar cookie)
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, '', { ...COOKIE_OPTS, maxAge: 0 });
  return res;
}
