'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import BottomNav from '@/components/BottomNav';
import CanjeModal from '@/components/CanjeModal';

type Category = 'todos' | 'bebidas' | 'descuentos' | 'packs';

interface Beneficio {
  id: string;
  nombre: string;
  descripcion: string | null;
  puntos_costo: number;
  icono: string | null;
  tipo: string;
}

const CATS: { id: Category; label: string }[] = [
  { id: 'todos',      label: 'Todos'      },
  { id: 'bebidas',    label: 'Bebidas'    },
  { id: 'descuentos', label: 'Descuentos' },
  { id: 'packs',      label: 'Packs'      },
];

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.4 },
});

function Sk({ w, h, r = 8 }: { w: number | string; h: number; r?: number }) {
  return <div style={{ width: w, height: h, background: '#1a1a1a', borderRadius: r, flexShrink: 0 }} />;
}

function BeneficioSVG({ tipo }: { tipo: string }) {
  if (tipo === 'descuento' || tipo === 'descuentos') {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
        <line x1="7" y1="7" x2="7.01" y2="7"/>
      </svg>
    );
  }
  if (tipo === 'especial') {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    );
  }
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
      <line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
  );
}

export default function BeneficiosPage() {
  const router = useRouter();
  const [cat, setCat]             = useState<Category>('todos');
  const [beneficios, setBeneficios] = useState<Beneficio[]>([]);
  const [userPoints, setUserPoints] = useState(0);
  const [tenantId, setTenantId]   = useState('');
  const [userId, setUserId]       = useState('');
  const [loading, setLoading]     = useState(true);
  const [canje, setCanje]         = useState<Beneficio | null>(null);

  useEffect(() => {
    const uid = localStorage.getItem('cfiel_user_id');
    if (!uid) { router.replace('/'); return; }
    setUserId(uid);

    Promise.all([
      fetch('/api/beneficios/tio-polo').then(r => r.ok ? r.json() : null),
      fetch(`/api/usuarios/${uid}`).then(r => r.ok ? r.json() : null),
    ])
      .then(([benData, userData]) => {
        if (benData?.beneficios) setBeneficios(benData.beneficios);
        if (benData?.tenant_id)  setTenantId(benData.tenant_id);
        if (userData?.usuario?.puntos_total != null) setUserPoints(userData.usuario.puntos_total);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [router]);

  const visible = beneficios.filter(b => cat === 'todos' || b.tipo === cat);

  if (loading) {
    return (
      <div style={{ background: '#0a0a14', minHeight: '100dvh', maxWidth: 430, margin: '0 auto' }}>
        <div style={{ padding: '16px 16px 90px' }}>
          <Sk w={140} h={30} r={8} />
          <div style={{ height: 8 }} />
          <Sk w={220} h={12} r={6} />
          <div style={{ height: 12 }} />
          <Sk w={130} h={26} r={20} />
          <div style={{ height: 14 }} />
          <div style={{ display: 'flex', gap: 7, marginBottom: 14 }}>
            {[80, 72, 96, 60].map((w, i) => <Sk key={i} w={w} h={34} r={20} />)}
          </div>
          {[0, 1, 2].map(i => (
            <div key={i} style={{ marginBottom: 10 }}>
              <Sk w="100%" h={116} r={32} />
            </div>
          ))}
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div style={{ background: '#0a0a14', minHeight: '100dvh', maxWidth: 430, margin: '0 auto' }}>
      <div style={{ padding: '16px 16px 90px' }}>

        {/* ── Header ── */}
        <motion.div {...fadeUp(0.05)} style={{ marginBottom: 14 }}>
          <div style={{
            fontFamily: 'var(--font-bebas), "Bebas Neue", sans-serif',
            fontSize: 32, color: '#fff', letterSpacing: '-0.02em', marginBottom: 3,
          }}>
            Beneficios
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', marginBottom: 8 }}>
            Canjea tus puntos por premios reales
          </div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            background: 'rgba(99,102,241,0.12)',
            border: '0.5px solid rgba(99,102,241,0.28)',
            borderRadius: 20, padding: '4px 12px',
            fontSize: 11, color: '#818CF8', fontWeight: 500,
          }}>
            ⭐ {userPoints.toLocaleString('es-CL')} pts disponibles
          </div>
        </motion.div>

        {/* ── Tabs ── */}
        <motion.div
          {...fadeUp(0.1)}
          style={{ display: 'flex', gap: 7, marginBottom: 14, overflowX: 'auto' }}
        >
          {CATS.map(({ id, label }) => {
            const active = id === cat;
            return (
              <button
                key={id}
                onClick={() => setCat(id)}
                style={{
                  padding: '7px 15px', borderRadius: 20, fontSize: 12,
                  cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit',
                  border: `0.5px solid ${active ? '#fff' : 'rgba(255,255,255,0.07)'}`,
                  background: active ? '#fff' : 'transparent',
                  color: active ? '#0a0a0a' : 'rgba(255,255,255,0.55)',
                  fontWeight: active ? 600 : 500, transition: 'all 0.2s',
                }}
              >
                {label}
              </button>
            );
          })}
        </motion.div>

        {/* ── Empty state ── */}
        {visible.length === 0 && (
          <motion.div
            {...fadeUp(0.14)}
            style={{ textAlign: 'center', padding: '48px 20px', color: 'rgba(255,255,255,0.28)', fontSize: 13, lineHeight: 1.6 }}
          >
            <div style={{ fontSize: 36, marginBottom: 12 }}>🎁</div>
            Tu botillería aún no tiene beneficios configurados
          </motion.div>
        )}

        {/* ── Beneficio cards ── */}
        {visible.map((b, i) => {
          const locked = b.puntos_costo > userPoints;
          return (
            <motion.div
              key={b.id}
              {...fadeUp(0.12 + i * 0.07)}
              className="cfiel-card"
              style={{
                borderRadius: 32,
                overflow: 'hidden', marginBottom: 10,
                opacity: locked ? 0.5 : 1,
              }}
            >
              {/* Top section */}
              <div style={{
                background: '#1a1a1a', padding: 16,
                display: 'flex', alignItems: 'center', gap: 13,
                borderBottom: '0.5px solid rgba(255,255,255,0.07)',
              }}>
                <div style={{
                  background: locked ? 'rgba(255,255,255,0.06)' : 'rgba(99,102,241,0.15)',
                  borderRadius: 10, padding: 10, flexShrink: 0,
                  color: locked ? 'rgba(255,255,255,0.3)' : '#818CF8',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <BeneficioSVG tipo={b.tipo} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#fff', letterSpacing: '-0.01em', marginBottom: 2 }}>
                    {b.nombre}
                  </div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>
                    {b.descripcion ?? ''}
                  </div>
                </div>
                {locked && <div style={{ fontSize: 18, opacity: 0.5 }}>🔒</div>}
              </div>

              {/* Bottom: pts + button */}
              <div style={{ padding: '12px 15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: locked ? 'rgba(255,255,255,0.28)' : '#6366F1',
                  }} />
                  <div style={{
                    fontSize: 14, fontWeight: 700,
                    color: locked ? 'rgba(255,255,255,0.28)' : '#818CF8',
                  }}>
                    {b.puntos_costo.toLocaleString('es-CL')}
                  </div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)' }}>pts</div>
                </div>
                <button
                  disabled={locked}
                  onClick={() => !locked && setCanje(b)}
                  style={{
                    background: locked ? '#222222' : '#fff',
                    color: locked ? 'rgba(255,255,255,0.28)' : '#0a0a0a',
                    border: locked ? '0.5px solid rgba(255,255,255,0.07)' : 'none',
                    borderRadius: 20, padding: '8px 18px',
                    fontSize: 12, fontWeight: 700,
                    cursor: locked ? 'not-allowed' : 'pointer',
                    fontFamily: 'inherit', transition: 'transform 0.15s',
                  }}
                >
                  {locked ? 'Bloqueado' : 'Canjear'}
                </button>
              </div>
            </motion.div>
          );
        })}

      </div>

      <CanjeModal
        open={!!canje}
        onClose={() => setCanje(null)}
        nombre={canje?.nombre ?? ''}
        puntos={canje?.puntos_costo ?? 0}
        usuarioId={userId}
        tenantId={tenantId}
        beneficioId={canje?.id ?? ''}
        onSuccess={(puntosRestantes) => setUserPoints(puntosRestantes)}
      />

      <BottomNav />
    </div>
  );
}
