'use client';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import BottomNav from '@/components/BottomNav';

const USER = {
  name:     'Carlos',
  lastName: 'Morales',
  points:   1207,
  since:    'enero 2025',
};

const STATS = [
  { value: '$4.720', label: 'Total ahorrado',  color: '#D4A847' },
  { value: '18',     label: 'Visitas este mes', color: '#ffffff' },
  { value: '+1.847', label: 'Pts ganados',      color: '#2ECC71' },
  { value: '4',      label: 'Canjes usados',    color: '#ffffff' },
];

const LEVELS = ['Bronce', 'Plata', 'Oro', 'Platino'];

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.4 },
});

export default function PerfilPage() {
  const router = useRouter();

  const MENU = [
    { icon: '🤝', label: 'Referidos · 3 amigos', route: null,          danger: false },
    { icon: '🎁', label: 'Ver beneficios',        route: '/beneficios', danger: false },
    { icon: '📋', label: 'Mi historial',           route: '/historial',  danger: false },
    { icon: '🔔', label: 'Notificaciones',         route: null,          danger: false },
    { icon: '🚪', label: 'Cerrar sesión',          route: '/home',       danger: true  },
  ];

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100dvh', maxWidth: 430, margin: '0 auto' }}>
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
            border: '2px solid rgba(212,168,71,0.28)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, fontWeight: 700, color: '#fff', flexShrink: 0,
          }}>
            {USER.name[0]}
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', letterSpacing: -0.4, marginBottom: 3 }}>
              {USER.name} {USER.lastName}
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', marginBottom: 7 }}>
              Miembro desde {USER.since}
            </div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              background: 'rgba(212,168,71,0.12)',
              border: '0.5px solid rgba(212,168,71,0.28)',
              borderRadius: 20, padding: '3px 10px',
            }}>
              <span style={{ fontSize: 10 }}>⭐</span>
              <span style={{ fontSize: 10, fontWeight: 600, color: '#D4A847', letterSpacing: '0.5px' }}>NIVEL ORO</span>
            </div>
          </div>
        </motion.div>

        {/* ── Card de nivel ── */}
        <motion.div
          {...fadeUp(0.1)}
          style={{
            background: '#141414',
            borderRadius: 32,
            border: '0.5px solid rgba(212,168,71,0.28)',
            padding: 18,
            marginBottom: 14,
            position: 'relative', overflow: 'hidden',
          }}
        >
          {/* Glow decorativo */}
          <div style={{
            position: 'absolute', bottom: -20, right: -20,
            width: 90, height: 90,
            background: 'radial-gradient(circle, rgba(212,168,71,0.1), transparent)',
            borderRadius: '50%', pointerEvents: 'none',
          }} />

          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
            <div>
              <div style={{
                fontSize: 10, color: 'rgba(255,255,255,0.28)',
                letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 2,
              }}>
                Nivel actual
              </div>
              <div style={{
                fontFamily: 'var(--font-bebas), "Bebas Neue", sans-serif',
                fontSize: 22, color: '#D4A847', letterSpacing: 2, marginTop: 4,
              }}>
                ORO
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>
                {USER.points.toLocaleString('es-CL')} pts
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>acumulados</div>
              <div style={{ fontSize: 10, color: '#F0C96A', marginTop: 3 }}>→ 293 pts para Platino</div>
            </div>
          </div>

          {/* Barra de 4 niveles: 2 done, 1 parcial (Oro activo), 1 vacío */}
          <div style={{ display: 'flex', gap: 5, marginBottom: 6 }}>
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  flex: 1, height: 4, borderRadius: 4,
                  background:
                    i < 2
                      ? '#D4A847'
                      : i === 2
                      ? 'linear-gradient(90deg, #D4A847 60%, rgba(255,255,255,0.08) 60%)'
                      : 'rgba(255,255,255,0.08)',
                }}
              />
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {LEVELS.map((lv, i) => (
              <span key={i} style={{
                fontSize: 9,
                color: i === 2 ? '#F0C96A' : 'rgba(255,255,255,0.28)',
                fontWeight: i === 2 ? 600 : 400,
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
          {STATS.map((s, i) => (
            <div key={i} style={{
              background: '#141414', borderRadius: 14,
              border: '0.5px solid rgba(255,255,255,0.07)',
              padding: 14, textAlign: 'center',
            }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: s.color, marginBottom: 2 }}>
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
                fontSize: 16, flexShrink: 0,
              }}>
                {icon}
              </div>
              <div style={{
                fontSize: 14, fontWeight: 500,
                color: danger ? '#E74C3C' : '#fff',
              }}>
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
