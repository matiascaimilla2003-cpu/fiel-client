'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import BottomNav from '@/components/BottomNav';

interface UsuarioAPI {
  id: string;
  nombre: string;
  puntos_total: number;
  nivel: string;
  racha_dias: number;
  created_at: string;
}

const NIVEL_META: Record<string, { label: string; color: string; index: number; next: string; ptsNext: number }> = {
  bronce:  { label: 'BRONCE',  color: '#CD8B4A', index: 0, next: 'Plata',   ptsNext: 500  },
  plata:   { label: 'PLATA',   color: '#A8B8C0', index: 1, next: 'Oro',     ptsNext: 1000 },
  oro:     { label: 'ORO',     color: '#D4A847', index: 2, next: 'Platino', ptsNext: 2000 },
  platino: { label: 'PLATINO', color: '#8ECFEF', index: 3, next: '',        ptsNext: 0    },
};

const LEVELS = ['Bronce', 'Plata', 'Oro', 'Platino'];

function calcProgressPct(nivel: string, puntos: number): number {
  const ranges: Record<string, [number, number]> = {
    bronce: [0, 500], plata: [500, 1000], oro: [1000, 2000], platino: [2000, 2000],
  };
  const [min, max] = ranges[nivel] ?? [0, 500];
  if (max === min) return 100;
  return Math.min(100, Math.round(((puntos - min) / (max - min)) * 100));
}

function segmentBg(i: number, levelIdx: number, pct: number, color: string): string {
  if (i < levelIdx) return color;
  if (i === levelIdx) return `linear-gradient(90deg, ${color} ${pct}%, rgba(255,255,255,0.08) ${pct}%)`;
  return 'rgba(255,255,255,0.08)';
}

function desdeLabel(iso: string): string {
  return new Date(iso).toLocaleDateString('es-CL', { month: 'long', year: 'numeric' });
}

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.4 },
});

function Skeleton({ w, h, radius = 8 }: { w: number | string; h: number; radius?: number }) {
  return (
    <div style={{ width: w, height: h, background: '#1a1a1a', borderRadius: radius, flexShrink: 0 }} />
  );
}

export default function PerfilPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<UsuarioAPI | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem('cfiel_user_id');
    if (!userId) {
      router.replace('/');
      return;
    }

    fetch(`/api/usuarios/${userId}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.usuario) setUsuario(data.usuario); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [router]);

  const MENU: { icon: React.ReactElement; label: string; route: string | null; danger: boolean }[] = [
    {
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
      label: 'Referidos · 3 amigos', route: null, danger: false,
    },
    {
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 12 20 22 4 22 4 12"/>
          <rect x="2" y="7" width="20" height="5"/>
          <line x1="12" y1="22" x2="12" y2="7"/>
          <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
          <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
        </svg>
      ),
      label: 'Ver beneficios', route: '/beneficios', danger: false,
    },
    {
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
          <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
        </svg>
      ),
      label: 'Mi historial', route: '/historial', danger: false,
    },
    {
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
      ),
      label: 'Notificaciones', route: null, danger: false,
    },
    {
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16 17 21 12 16 7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
      ),
      label: 'Cerrar sesión', route: '/', danger: true,
    },
  ];

  if (loading) {
    return (
      <div style={{ background: '#0a0a14', minHeight: '100dvh', maxWidth: 430, margin: '0 auto' }}>
        <div style={{ padding: '16px 16px 90px' }}>
          <div style={{ display: 'flex', gap: 14, marginBottom: 14, paddingBottom: 16, borderBottom: '0.5px solid rgba(255,255,255,0.07)', alignItems: 'center' }}>
            <Skeleton w={60} h={60} radius={30} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Skeleton w={160} h={16} />
              <Skeleton w={100} h={12} />
              <Skeleton w={80} h={22} radius={20} />
            </div>
          </div>
          <Skeleton w="100%" h={170} radius={32} />
          <div style={{ height: 14 }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
            {[0,1,2,3].map(i => <Skeleton key={i} w="100%" h={72} radius={14} />)}
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  // Fallback si la API no retornó datos
  const u = usuario ?? { nombre: '—', puntos_total: 0, nivel: 'bronce', racha_dias: 0, created_at: new Date().toISOString(), id: '' };
  const nombreParts = u.nombre.split(' ');
  const firstName   = nombreParts[0] ?? '—';
  const lastName    = nombreParts.slice(1).join(' ');
  const nivelKey    = u.nivel.toLowerCase();
  const meta        = NIVEL_META[nivelKey] ?? NIVEL_META.bronce;
  const pct         = calcProgressPct(nivelKey, u.puntos_total);
  const ptsToNext   = meta.ptsNext > 0 ? Math.max(0, meta.ptsNext - u.puntos_total) : 0;

  const stats = [
    { value: u.puntos_total.toLocaleString('es-CL'),  label: 'Pts acumulados', color: '#6366F1'   },
    { value: meta.label,                               label: 'Nivel actual',   color: '#ffffff'   },
    { value: `${u.racha_dias}d`,                       label: 'Racha',          color: '#2ECC71'   },
    { value: desdeLabel(u.created_at),                 label: 'Miembro desde',  color: '#ffffff'   },
  ];

  return (
    <div style={{ background: '#0a0a14', minHeight: '100dvh', maxWidth: 430, margin: '0 auto' }}>
      <div style={{ padding: '16px 16px 90px' }}>

        {/* ── Hero: avatar + nombre + nivel ── */}
        <motion.div
          {...fadeUp(0.05)}
          style={{
            display: 'flex', alignItems: 'center', gap: 14,
            paddingBottom: 16,
            borderBottom: '0.5px solid rgba(255,255,255,0.07)',
            marginBottom: 14,
          }}
        >
          <div style={{
            width: 60, height: 60,
            background: '#1a1a1a',
            borderRadius: '50%',
            border: `2px solid ${meta.color}45`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, fontWeight: 700, color: '#fff', flexShrink: 0,
          }}>
            {firstName[0]?.toUpperCase() ?? '?'}
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', letterSpacing: -0.4, marginBottom: 3 }}>
              {firstName} {lastName}
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', marginBottom: 7 }}>
              Miembro desde {desdeLabel(u.created_at)}
            </div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              background: `${meta.color}18`,
              border: `0.5px solid ${meta.color}45`,
              borderRadius: 20, padding: '3px 10px',
            }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={meta.color} strokeWidth="1.5">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              <span style={{ fontSize: 10, fontWeight: 600, color: meta.color, letterSpacing: '0.5px' }}>
                NIVEL {meta.label}
              </span>
            </div>
          </div>
        </motion.div>

        {/* ── Card de nivel ── */}
        <motion.div
          {...fadeUp(0.1)}
          className="cfiel-card"
          style={{
            borderRadius: 32,
            padding: 18,
            marginBottom: 14,
            position: 'relative', overflow: 'hidden',
          }}
        >
          <div style={{
            position: 'absolute', bottom: -20, right: -20,
            width: 90, height: 90,
            background: `radial-gradient(circle, ${meta.color}15, transparent)`,
            borderRadius: '50%', pointerEvents: 'none',
          }} />

          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 2 }}>
                Nivel actual
              </div>
              <div style={{ fontFamily: 'var(--font-bebas), "Bebas Neue", sans-serif', fontSize: 22, color: meta.color, letterSpacing: 2, marginTop: 4 }}>
                {meta.label}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>
                {u.puntos_total.toLocaleString('es-CL')} pts
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>acumulados</div>
              {meta.next && (
                <div style={{ fontSize: 10, color: '#818CF8', marginTop: 3 }}>
                  → {ptsToNext} pts para {meta.next}
                </div>
              )}
            </div>
          </div>

          {/* Barra de 4 niveles dinámica */}
          <div style={{ display: 'flex', gap: 5, marginBottom: 6 }}>
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                style={{ flex: 1, height: 4, borderRadius: 4, background: segmentBg(i, meta.index, pct, meta.color) }}
              />
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {LEVELS.map((lv, i) => (
              <span key={i} style={{
                fontSize: 9,
                color: i === meta.index ? meta.color : 'rgba(255,255,255,0.28)',
                fontWeight: i === meta.index ? 600 : 400,
                letterSpacing: '0.4px',
                textTransform: 'uppercase',
              }}>
                {lv}
              </span>
            ))}
          </div>
        </motion.div>

        {/* ── Grid 2×2 stats ── */}
        <motion.div
          {...fadeUp(0.14)}
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}
        >
          {stats.map((s, i) => (
            <div key={i} className="cfiel-card" style={{
              borderRadius: 14,
              padding: 14, textAlign: 'center',
            }}>
              <div style={{ fontSize: i === 3 ? 11 : 22, fontWeight: 700, color: s.color, marginBottom: 2, lineHeight: 1.2 }}>
                {s.value}
              </div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)', letterSpacing: '0.4px' }}>
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* ── Menú de opciones ── */}
        <motion.div {...fadeUp(0.18)}>
          {MENU.map(({ icon, label, route, danger }, i) => (
            <div
              key={i}
              onClick={() => route && router.push(route)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '14px 0',
                borderBottom: i < MENU.length - 1 ? '0.5px solid rgba(255,255,255,0.07)' : 'none',
                cursor: route ? 'pointer' : 'default',
              }}
            >
              <div style={{
                width: 36, height: 36,
                background: danger ? 'rgba(231,76,60,0.1)' : '#1a1a1a',
                borderRadius: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
                color: danger ? '#E74C3C' : 'rgba(255,255,255,0.6)',
              }}>
                {icon}
              </div>
              <div style={{ fontSize: 14, fontWeight: 500, color: danger ? '#E74C3C' : '#fff' }}>
                {label}
              </div>
              <div style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.28)', fontSize: 17 }}>›</div>
            </div>
          ))}
        </motion.div>

      </div>

      <BottomNav />
    </div>
  );
}
