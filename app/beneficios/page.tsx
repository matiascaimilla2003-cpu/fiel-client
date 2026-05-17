'use client';
import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import BottomNav from '@/components/BottomNav';
import CanjeModal from '@/components/CanjeModal';

const BEBAS = 'var(--font-bebas), "Bebas Neue", sans-serif';

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

function CategoryIcon({ tipo, locked }: { tipo: string; locked: boolean }) {
  const c = locked ? 'rgba(255,255,255,0.35)' : '#818CF8';
  const t = tipo.toLowerCase();
  if (t === 'bebidas') return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 2h8l-1 8a4 4 0 0 1-3 4 4 4 0 0 1-3-4L8 2zM12 14v8M9 22h6"/>
    </svg>
  );
  if (t === 'descuentos' || t === 'descuento') return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
      <line x1="7" y1="7" x2="7.01" y2="7"/>
    </svg>
  );
  if (t === 'packs' || t === 'pack') return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
      <line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
  );
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
    </svg>
  );
}

function Sk({ w, h, r = 8 }: { w: number | string; h: number; r?: number }) {
  return <div style={{ width: w, height: h, background: '#1a1a1a', borderRadius: r, flexShrink: 0 }} />;
}

export default function BeneficiosPage() {
  const router = useRouter();
  const [cat, setCat]               = useState<Category>('todos');
  const [beneficios, setBeneficios] = useState<Beneficio[]>([]);
  const [userPoints, setUserPoints] = useState(0);
  const [tenantId, setTenantId]     = useState('');
  const [userId, setUserId]         = useState('');
  const [loading, setLoading]       = useState(true);
  const [canje, setCanje]           = useState<Beneficio | null>(null);

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

  const visible = useMemo(() => {
    if (cat === 'todos') return beneficios;
    return beneficios.filter(b => {
      const t = b.tipo.toLowerCase();
      if (cat === 'bebidas')    return t === 'bebidas';
      if (cat === 'descuentos') return t === 'descuentos' || t === 'descuento';
      if (cat === 'packs')      return t === 'packs' || t === 'pack';
      return false;
    });
  }, [beneficios, cat]);

  const counts = useMemo(() => ({
    todos:      beneficios.length,
    bebidas:    beneficios.filter(b => b.tipo.toLowerCase() === 'bebidas').length,
    descuentos: beneficios.filter(b => ['descuentos', 'descuento'].includes(b.tipo.toLowerCase())).length,
    packs:      beneficios.filter(b => ['packs', 'pack'].includes(b.tipo.toLowerCase())).length,
  }), [beneficios]);

  const affordableCount = useMemo(() =>
    beneficios.filter(b => b.puntos_costo <= userPoints).length,
  [beneficios, userPoints]);

  if (loading) {
    return (
      <div style={{ background: '#0a0a14', minHeight: '100dvh', maxWidth: 430, margin: '0 auto' }}>
        <div style={{ padding: '20px 20px 90px' }}>
          <Sk w={160} h={38} r={6} />
          <div style={{ height: 8 }} />
          <Sk w={220} h={13} r={6} />
          <div style={{ height: 12 }} />
          <Sk w={240} h={40} r={100} />
          <div style={{ height: 16 }} />
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            {[80, 80, 100, 70].map((w, i) => <Sk key={i} w={w} h={34} r={100} />)}
          </div>
          {[0, 1, 2].map(i => (
            <div key={i} style={{ marginBottom: 12 }}>
              <Sk w="100%" h={130} r={20} />
            </div>
          ))}
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div style={{
      background: '#0a0a14',
      minHeight: '100dvh',
      maxWidth: 430,
      margin: '0 auto',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* ambient glow */}
      <div style={{
        position: 'absolute', top: -120, left: '50%', transform: 'translateX(-50%)',
        width: 600, height: 500,
        background: 'radial-gradient(circle, rgba(99,102,241,0.10) 0%, transparent 60%)',
        pointerEvents: 'none',
      }}/>

      {/* Header + filters */}
      <div style={{ padding: '20px 20px 0', position: 'relative' }}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 style={{
            fontFamily: BEBAS, fontSize: 38, margin: 0, lineHeight: 1,
            letterSpacing: '0.03em', color: '#fff',
          }}>BENEFICIOS</h1>
          <p style={{ fontSize: 13, color: '#8a8aa3', margin: '4px 0 12px' }}>
            Canjea tus puntos por premios reales
          </p>

          {/* Premium balance pill */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            padding: '8px 14px 8px 10px', borderRadius: 100,
            background: 'linear-gradient(135deg, rgba(99,102,241,0.18), rgba(99,102,241,0.06))',
            border: '1px solid rgba(99,102,241,0.40)',
            boxShadow: '0 4px 18px rgba(99,102,241,0.18), inset 0 1px 0 rgba(255,255,255,0.04)',
            marginBottom: 16,
          }}>
            <div style={{
              width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg, #818CF8, #4F46E5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 12px rgba(99,102,241,0.6)',
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9"/><path d="M12 7v10M8 12h8"/>
              </svg>
            </div>
            <span style={{
              fontFamily: BEBAS, fontSize: 20, color: '#818CF8',
              letterSpacing: '0.04em', textShadow: '0 0 12px rgba(99,102,241,0.5)',
            }}>{userPoints.toLocaleString('es-CL')}</span>
            <span style={{ fontSize: 13, color: '#8a8aa3' }}>pts disponibles</span>
            <span style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.10)', flexShrink: 0 }}/>
            <span style={{ fontSize: 12, color: '#818CF8', fontWeight: 600 }}>
              {affordableCount} {affordableCount === 1 ? 'premio' : 'premios'} al alcance
            </span>
          </div>
        </motion.div>

        {/* Filter chips */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.07 }}
          style={{
            display: 'flex', gap: 8, marginBottom: 12,
            overflowX: 'auto', scrollbarWidth: 'none',
          }}
        >
          {CATS.map(({ id, label }) => {
            const active = id === cat;
            return (
              <button
                key={id}
                onClick={() => setCat(id)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '7px 14px', borderRadius: 100, fontSize: 13,
                  cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit',
                  border: `1px solid ${active ? 'rgba(99,102,241,0.6)' : 'rgba(255,255,255,0.07)'}`,
                  background: active ? 'rgba(99,102,241,0.18)' : 'transparent',
                  color: active ? '#818CF8' : '#8a8aa3',
                  fontWeight: active ? 600 : 500,
                  transition: 'all 0.2s', flexShrink: 0,
                }}
              >
                {label}
                <span style={{
                  fontSize: 11, fontWeight: 700,
                  background: active ? 'rgba(99,102,241,0.35)' : 'rgba(255,255,255,0.06)',
                  color: active ? '#818CF8' : '#5b5b75',
                  borderRadius: 100, padding: '1px 6px',
                }}>{counts[id]}</span>
              </button>
            );
          })}
        </motion.div>
      </div>

      {/* Benefit list */}
      <div style={{ padding: '4px 20px 100px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {visible.length === 0 && (
            <div style={{ textAlign: 'center', padding: '48px 20px', color: '#8a8aa3', fontSize: 13 }}>
              No hay premios en esta categoría
            </div>
          )}
          {visible.map((b, i) => {
            const affordable = b.puntos_costo <= userPoints;
            const pct = Math.min(1, userPoints / b.puntos_costo);
            const missing = b.puntos_costo - userPoints;
            return (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i, duration: 0.4 }}
                style={{
                  position: 'relative',
                  borderRadius: 20,
                  background: affordable
                    ? 'linear-gradient(135deg, rgba(99,102,241,0.10), rgba(99,102,241,0.03))'
                    : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${affordable ? 'rgba(99,102,241,0.22)' : 'rgba(255,255,255,0.05)'}`,
                  padding: '18px 16px',
                  overflow: 'hidden',
                }}
              >
                {/* decorative dot glow */}
                {affordable && (
                  <svg
                    style={{ position: 'absolute', top: -8, right: -8, opacity: 0.4, pointerEvents: 'none' }}
                    width="80" height="80" viewBox="0 0 80 80" fill="none"
                  >
                    <defs>
                      <radialGradient id={`bg${i}`} cx="0.6" cy="0.3" r="0.6">
                        <stop offset="0" stopColor="rgba(99,102,241,0.4)"/>
                        <stop offset="1" stopColor="rgba(99,102,241,0)"/>
                      </radialGradient>
                    </defs>
                    <circle cx="55" cy="20" r="40" fill={`url(#bg${i})`}/>
                  </svg>
                )}

                {/* header row */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, position: 'relative' }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                    background: affordable ? 'rgba(99,102,241,0.12)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${affordable ? 'rgba(99,102,241,0.30)' : 'rgba(255,255,255,0.06)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <CategoryIcon tipo={b.tipo} locked={!affordable}/>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{
                      fontSize: 16, fontWeight: 600, margin: 0, lineHeight: 1.2,
                      color: affordable ? '#fff' : '#8a8aa3',
                    }}>{b.nombre}</h3>
                    {b.descripcion && (
                      <div style={{ fontSize: 12, color: '#8a8aa3', marginTop: 2 }}>{b.descripcion}</div>
                    )}
                  </div>
                </div>

                {/* gradient divider */}
                <div style={{
                  margin: '14px 0 12px', height: 1,
                  background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.18), transparent)',
                }}/>

                {/* footer */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                    <span style={{
                      fontFamily: BEBAS, fontSize: 26, lineHeight: 1,
                      color: affordable ? '#818CF8' : '#8a8aa3',
                      textShadow: affordable ? '0 0 14px rgba(99,102,241,0.4)' : 'none',
                      letterSpacing: '0.02em',
                    }}>{b.puntos_costo.toLocaleString('es-CL')}</span>
                    <span style={{ fontSize: 12, color: '#8a8aa3', fontWeight: 500 }}>pts</span>
                  </div>

                  {affordable ? (
                    <button
                      onClick={() => setCanje(b)}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        background: '#6366F1', color: '#fff', border: 'none',
                        borderRadius: 100, padding: '9px 18px',
                        fontSize: 13, fontWeight: 700,
                        cursor: 'pointer', fontFamily: 'inherit',
                        boxShadow: '0 4px 18px rgba(99,102,241,0.35)',
                        flexShrink: 0,
                      }}
                    >
                      Canjear
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M13 5l7 7-7 7"/>
                      </svg>
                    </button>
                  ) : (
                    <div style={{ flex: 1, marginLeft: 8 }}>
                      <div style={{
                        height: 4, background: 'rgba(255,255,255,0.06)',
                        borderRadius: 100, overflow: 'hidden', marginBottom: 4,
                      }}>
                        <div style={{
                          height: '100%', width: `${pct * 100}%`,
                          background: 'linear-gradient(90deg, #4F46E5, #818CF8)',
                          borderRadius: 100,
                        }}/>
                      </div>
                      <div style={{ fontSize: 11, color: '#8a8aa3', textAlign: 'right' }}>
                        Te faltan{' '}
                        <span style={{ color: '#818CF8', fontWeight: 600 }}>
                          {missing.toLocaleString('es-CL')} pts
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <CanjeModal
        open={!!canje}
        onClose={() => setCanje(null)}
        nombre={canje?.nombre ?? ''}
        puntos={canje?.puntos_costo ?? 0}
        usuarioId={userId}
        tenantId={tenantId}
        beneficioId={canje?.id ?? ''}
        userPoints={userPoints}
        onSuccess={(puntosRestantes) => setUserPoints(puntosRestantes)}
      />

      <BottomNav/>
    </div>
  );
}
