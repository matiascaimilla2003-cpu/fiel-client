'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import TarjetasCarousel from '@/components/TarjetasCarousel';
import StreakCard from '@/components/StreakCard';
import MisionCard from '@/components/MisionCard';
import QRModal from '@/components/QRModal';
import StreakModal from '@/components/StreakModal';
import MisionesModal from '@/components/MisionesModal';
import BottomNav from '@/components/BottomNav';

const BEBAS = 'var(--font-bebas), "Bebas Neue", sans-serif';

/* ── Tier helpers ── */
function calcProgressPct(nivel: string, puntos: number): number {
  const ranges: Record<string, [number, number]> = {
    bronce: [0, 500], plata: [500, 1000], oro: [1000, 2000], platino: [2000, 2000],
  };
  const [min, max] = ranges[nivel] ?? [0, 500];
  if (max === min) return 100;
  return Math.min(100, Math.round(((puntos - min) / (max - min)) * 100));
}

function calcPtsToNextLevel(nivel: string, puntos: number): number {
  const next: Record<string, number> = { bronce: 500, plata: 1000, oro: 2000, platino: 0 };
  return Math.max(0, (next[nivel] ?? 500) - puntos);
}

interface UserState {
  name: string;
  lastName: string;
  points: number;
  level: string;
  streak: number;
  progressPct: number;
  ptsToNextLevel: number;
  empresa: string;
}

interface Mision {
  id: string;
  titulo: string;
  descripcion: string | null;
  puntos_premio: number;
  meta_tipo: string;
  meta_valor: number;
  fecha_fin: string | null;
}

interface Promocion {
  id: string;
  titulo: string;
  descripcion: string | null;
  tipo: 'puntos_extra' | 'descuento' | 'producto_gratis';
  valor: string;
  fecha_fin: string;
}

const EMPTY_USER: UserState = {
  name: '', lastName: '',
  points: 0, level: 'bronce',
  streak: 0, progressPct: 0, ptsToNextLevel: 500,
  empresa: '',
};

type Modal = 'qr' | 'streak' | 'misiones' | null;

export default function HomePage() {
  const router             = useRouter();
  const [modal, setModal]  = useState<Modal>(null);
  const [USER, setUser]    = useState<UserState>(EMPTY_USER);
  const [misiones, setMisiones] = useState<Mision[]>([]);
  const [promoActiva, setPromoActiva] = useState<Promocion | null>(null);
  const [loading, setLoading]   = useState(true);
  const [referidosCount, setReferidosCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      // ── 1. Verificar sesión de Supabase Auth ──────────────
      const { data: { session } } = await supabase.auth.getSession();

      let userId: string | null = localStorage.getItem('cfiel_user_id');

      if (!userId) {
        if (session?.user?.id) {
          // Sesión activa — para usuarios nuevos auth.user.id = usuarios.id
          userId = session.user.id;
          localStorage.setItem('cfiel_user_id', session.user.id);
        } else {
          // Sin sesión ni ID local — intentar recuperar desde teléfono guardado
          const tel = localStorage.getItem('cfiel_telefono');
          if (tel) {
            try {
              const { data: inData } = await supabase.auth.signInWithPassword({
                email: `${tel}@cfiel.app`,
                password: `cfiel_${tel}`,
              });
              if (inData.session?.user.id) {
                userId = inData.session.user.id;
                localStorage.setItem('cfiel_user_id', userId);
              }
            } catch { /* sin bloquear */ }
          }
        }
      } else if (!session) {
        // Tiene ID local pero sin sesión — restaurar sesión en segundo plano
        const tel = localStorage.getItem('cfiel_telefono');
        if (tel) {
          supabase.auth.signInWithPassword({
            email: `${tel}@cfiel.app`,
            password: `cfiel_${tel}`,
          }).catch(() => {});
        }
      }

      if (!userId) {
        if (!cancelled) router.replace('/');
        return;
      }

      try {
        const [userRes, misionRes, refRes] = await Promise.all([
          fetch(`/api/usuarios/${userId}`).catch(() => null as null),
          fetch('/api/misiones?tenant_slug=tio-polo').catch(() => null as null),
          fetch(`/api/referidos?usuario_id=${userId}`).catch(() => null as null),
        ]);

        if (!userRes?.ok) {
          localStorage.removeItem('cfiel_user_id');
          localStorage.removeItem('cfiel_nombre');
          if (!cancelled) router.replace('/');
          return;
        }

        const [userData, misionData, refData] = await Promise.all([
          userRes.json().catch(() => null),
          misionRes?.ok ? misionRes.json().catch(() => null) : null,
          refRes?.ok ? refRes.json().catch(() => null) : null,
        ]);

        if (cancelled) return;

        if (userData?.usuario) {
          const u = userData.usuario;
          const nivel = (u.nivel as string) ?? 'bronce';
          setUser({
            name:           u.nombre.split(' ')[0],
            lastName:       u.nombre.split(' ')[1] ?? '',
            points:         u.puntos_total,
            level:          nivel.charAt(0).toUpperCase() + nivel.slice(1),
            streak:         u.racha_dias,
            progressPct:    calcProgressPct(nivel, u.puntos_total),
            ptsToNextLevel: calcPtsToNextLevel(nivel, u.puntos_total),
            empresa:        (u.tenants as { nombre?: string } | null)?.nombre ?? '',
          });

          if (u.tenant_id) {
            const promoRes = await fetch(`/api/promociones/activas?tenant_id=${u.tenant_id}`).catch(() => null);
            if (promoRes?.ok && !cancelled) {
              const promoData = await promoRes.json().catch(() => null);
              if (promoData?.promociones?.length > 0) {
                setPromoActiva(promoData.promociones[0] as Promocion);
              }
            }
          }
        }

        if (misionData?.misiones) setMisiones(misionData.misiones);

        if (typeof refData?.total_registrados === 'number') {
          setReferidosCount(refData.total_registrados);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    init();
    return () => { cancelled = true; };
  }, [router]);

  return (
    <div style={{
      background: 'var(--cfiel-bg)',
      minHeight: '100dvh',
      maxWidth: 430,
      margin: '0 auto',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Ambient background glow */}
      <div style={{
        position: 'absolute', top: -100, left: '50%', transform: 'translateX(-50%)',
        width: 600, height: 600,
        background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 60%)',
        pointerEvents: 'none',
        zIndex: 0,
      }}/>

      {/* ── TopBar ── */}
      <div style={{
        padding: '8px 20px 4px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0, position: 'relative', zIndex: 2,
      }}>
        <div>
          {loading ? (
            <>
              <div style={{ width: 150, height: 18, background: 'var(--cfiel-card)', borderRadius: 6, marginBottom: 6 }}/>
              <div style={{ width: 110, height: 11, background: 'var(--cfiel-card2)', borderRadius: 4 }}/>
            </>
          ) : (
            <>
              <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--cfiel-text)', letterSpacing: '-0.01em' }}>
                Hola, <span style={{ color: '#818CF8' }}>{USER.name || '…'}</span>
              </div>
              <div style={{ fontSize: 13, color: '#8a8aa3', marginTop: 2 }}>Bienvenido de vuelta</div>
            </>
          )}
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          {/* Bell */}
          <div
            onClick={() => setModal('misiones')}
            style={{
              width: 40, height: 40, borderRadius: 14,
              background: 'var(--cfiel-card)',
              border: '1px solid var(--cfiel-border)',
              color: 'var(--cfiel-text)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', position: 'relative',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10 21a2 2 0 0 0 4 0"/>
            </svg>
            {misiones.length > 0 && (
              <div style={{
                position: 'absolute', top: 8, right: 8,
                width: 8, height: 8,
                background: '#F87171',
                border: '2px solid var(--cfiel-bg)',
                borderRadius: '50%',
              }}/>
            )}
          </div>

          {/* Avatar */}
          <div style={{
            width: 40, height: 40, borderRadius: 14,
            background: 'linear-gradient(135deg, #818CF8, #6366F1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: BEBAS, fontSize: 18, color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
            cursor: 'pointer',
          }}>
            {USER.name ? USER.name[0].toUpperCase() : '?'}
          </div>
        </div>
      </div>

      {/* ── Scroll area ── */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        padding: '8px 20px 100px',
        scrollbarWidth: 'none',
        position: 'relative',
        zIndex: 1,
      }}>

        {/* Hero membership card */}
        <TarjetasCarousel
          puntos={USER.points}
          nivel={(USER.level.toLowerCase() as 'bronce' | 'plata' | 'oro' | 'platino') || 'bronce'}
          progreso={USER.progressPct}
          empresa={USER.empresa || 'Tío Polo'}
          onQROpen={() => setModal('qr')}
        />

        {/* Promo activa */}
        {promoActiva && (
          <div style={{
            marginBottom: 12,
            display: 'flex', alignItems: 'center', gap: 14,
            background: 'linear-gradient(135deg, rgba(139,92,246,0.18) 0%, rgba(99,102,241,0.10) 40%, rgba(99,102,241,0.04) 100%)',
            border: '1px solid rgba(139,92,246,0.30)',
            borderRadius: 22,
            padding: 18,
            animation: 'fadeUp 0.6s cubic-bezier(.2,.8,.2,1) 0.1s both',
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', flexShrink: 0,
              boxShadow: '0 6px 20px rgba(139,92,246,0.4)',
            }}>
              {promoActiva.tipo === 'puntos_extra' ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                </svg>
              ) : promoActiva.tipo === 'descuento' ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
                  <line x1="7" y1="7" x2="7.01" y2="7"/>
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <polyline points="20 12 20 22 4 22 4 12"/>
                  <rect x="2" y="7" width="20" height="5"/>
                  <line x1="12" y1="22" x2="12" y2="7"/>
                  <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
                  <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
                </svg>
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: BEBAS, fontSize: 11, letterSpacing: '0.28em', color: '#818CF8', marginBottom: 2 }}>PROMO ACTIVA</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--cfiel-text)' }}>{promoActiva.titulo}</div>
              {promoActiva.descripcion && (
                <div style={{ fontSize: 12, color: '#8a8aa3', marginTop: 2 }}>{promoActiva.descripcion}</div>
              )}
              <div style={{ fontSize: 12, color: '#8a8aa3', marginTop: 2 }}>
                Hasta el{' '}
                <span style={{ color: 'var(--cfiel-text)' }}>
                  {new Date(promoActiva.fecha_fin).toLocaleDateString('es-CL', { day: '2-digit', month: 'short' })}
                </span>
              </div>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5b5b75"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </div>
        )}

        {/* Streak */}
        <StreakCard streak={USER.streak} onOpen={() => setModal('streak')}/>

        {/* Misión activa */}
        {misiones.length > 0 && (
          <>
            <div style={{
              fontSize: 11, fontWeight: 600,
              letterSpacing: '0.18em', color: '#8a8aa3',
              textTransform: 'uppercase',
              margin: '24px 4px 10px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <span>Misión activa</span>
              <span
                onClick={() => setModal('misiones')}
                style={{
                  color: '#818CF8', fontSize: 12, fontWeight: 600,
                  letterSpacing: 0, textTransform: 'none',
                  cursor: 'pointer',
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                }}
              >
                Ver todas
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 5l7 7-7 7"/>
                </svg>
              </span>
            </div>
            <MisionCard onOpen={() => setModal('misiones')} mision={misiones[0]}/>
          </>
        )}

        {/* Referidos CTA */}
        <div
          onClick={() => router.push('/referidos')}
          style={{
            marginBottom: 12,
            position: 'relative', overflow: 'hidden',
            borderRadius: 22, padding: 16,
            background: 'linear-gradient(135deg, #2a2540 0%, #14121f 100%)',
            border: '1px solid rgba(139,92,246,0.30)',
            display: 'flex', alignItems: 'center', gap: 14,
            cursor: 'pointer',
            animation: 'fadeUp 0.6s cubic-bezier(.2,.8,.2,1) 0.25s both',
          }}
        >
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: 'rgba(139,92,246,0.18)',
            border: '1px solid rgba(139,92,246,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#C4B5FD', flexShrink: 0,
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>

          <div style={{ flex: 1, minWidth: 0, position: 'relative' }}>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 2, color: '#fff' }}>Trae un amigo</div>
            <div style={{ fontSize: 12, color: '#8a8aa3' }}>
              {referidosCount !== null && referidosCount > 0 && (
                <><span style={{ color: '#C4B5FD', fontWeight: 600 }}>{referidosCount} registrado{referidosCount !== 1 ? 's' : ''}</span> · </>
              )}
              Ganas{' '}
              <span style={{ fontFamily: BEBAS, color: '#C4B5FD', fontSize: 15, letterSpacing: '0.04em' }}>+250 PTS</span>
              {' '}por cada referido
            </div>
          </div>

          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5b5b75"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 5l7 7-7 7"/>
          </svg>
        </div>

      </div>

      {/* ── Modales ── */}
      <QRModal
        open={modal === 'qr'}
        onClose={() => setModal(null)}
        userName={`${USER.name} ${USER.lastName}`.trim()}
        userLevel={USER.level}
      />
      <StreakModal
        open={modal === 'streak'}
        onClose={() => setModal(null)}
        streak={USER.streak}
      />
      <MisionesModal
        open={modal === 'misiones'}
        onClose={() => setModal(null)}
        misiones={misiones}
      />

      <BottomNav/>
    </div>
  );
}
