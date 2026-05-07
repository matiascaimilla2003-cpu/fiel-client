'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import HeroCard from '@/components/HeroCard';
import StreakCard from '@/components/StreakCard';
import RuletaCard from '@/components/RuletaCard';
import MisionCard from '@/components/MisionCard';
import QRModal from '@/components/QRModal';
import StreakModal from '@/components/StreakModal';
import MisionesModal from '@/components/MisionesModal';
import BottomNav from '@/components/BottomNav';

/* ─── Helpers de nivel ─── */
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

/* ─── Forma del estado de usuario ─── */
interface UserState {
  name: string;
  lastName: string;
  points: number;
  level: string;
  streak: number;
  progressPct: number;
  ptsToNextLevel: number;
}

const DEFAULT_USER: UserState = {
  name: 'Carlos',
  lastName: 'Morales',
  points: 1207,
  level: 'Oro',
  streak: 7,
  progressPct: 72,
  ptsToNextLevel: 293,
};

const ACTIVITY = [
  { initials: 'ML', name: 'Marcela L.',  detail: 'Compra $6.400',  pts: '+80',  time: 'Ahora'      },
  { initials: 'RF', name: 'Roberto F.',  detail: 'Compra $19.500', pts: '+240', time: 'Ahora'      },
  { initials: 'PS', name: 'Paula S.',    detail: 'Compra $12.800', pts: '+160', time: 'Hace 5 min' },
];

type Modal = 'qr' | 'streak' | 'misiones' | null;

/* animación fadeUp reutilizable */
const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.4 },
});

export default function HomePage() {
  const router           = useRouter();
  const [modal, setModal] = useState<Modal>(null);
  const [USER,  setUser]  = useState<UserState>(DEFAULT_USER);

  useEffect(() => {
    const userId = localStorage.getItem('cfiel_user_id');
    if (!userId) { router.replace('/'); return; }

    fetch(`/api/usuarios/${userId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data?.usuario) return;
        const u = data.usuario;
        const nivel = (u.nivel as string) ?? 'bronce';
        setUser({
          name:          u.nombre.split(' ')[0],
          lastName:      u.nombre.split(' ')[1] ?? '',
          points:        u.puntos_total,
          level:         nivel.charAt(0).toUpperCase() + nivel.slice(1),
          streak:        u.racha_dias,
          progressPct:   calcProgressPct(nivel, u.puntos_total),
          ptsToNextLevel: calcPtsToNextLevel(nivel, u.puntos_total),
        });
      })
      .catch(() => {}); // mantiene DEFAULT_USER si hay error
  }, [router]);

  return (
    <div style={{
      background: '#0a0a0a',
      minHeight: '100dvh',
      maxWidth: 430,
      margin: '0 auto',
      position: 'relative',
    }}>

      {/* ── Contenido scrolleable ── */}
      <div style={{ padding: '16px 16px 90px', overflowY: 'auto' }}>

        {/* ── Header ── */}
        <motion.div
          {...fadeUp(0.05)}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}
        >
          <div>
            <div style={{ fontSize: 18, fontWeight: 600, color: '#fff', letterSpacing: -0.4 }}>
              Hola, {USER.name} 👋
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', marginTop: 2 }}>
              Bienvenido de vuelta
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Campana */}
            <div
              onClick={() => setModal('misiones')}
              style={{
                width: 36, height: 36,
                background: '#1a1a1a',
                borderRadius: '50%',
                border: '0.5px solid rgba(255,255,255,0.13)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
                position: 'relative',
              }}
            >
              <svg width={17} height={17} viewBox="0 0 24 24" fill="none"
                stroke="rgba(255,255,255,0.65)" strokeWidth={2}>
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              <div style={{
                position: 'absolute', top: 0, right: 0,
                width: 9, height: 9,
                background: '#E74C3C',
                borderRadius: '50%',
                border: '1.5px solid #0a0a0a',
                animation: 'pulseDot 2s ease infinite',
              }} />
            </div>

            {/* Avatar */}
            <div style={{
              width: 36, height: 36,
              background: '#222222',
              borderRadius: '50%',
              border: '1px solid rgba(255,255,255,0.13)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 600, color: '#fff',
            }}>
              {USER.name[0]}
            </div>
          </div>
        </motion.div>

        {/* ── Hero: puntos + nivel + progreso ── */}
        <HeroCard
          points={USER.points}
          level={USER.level}
          progressPct={USER.progressPct}
          ptsToNextLevel={USER.ptsToNextLevel}
        />

        {/* ── Duo grid: streak + ruleta ── */}
        <motion.div
          {...fadeUp(0.19)}
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}
        >
          <StreakCard streak={USER.streak} onOpen={() => setModal('streak')} />
          <RuletaCard onOpen={() => setModal('misiones')} />
        </motion.div>

        {/* ── Misión activa ── */}
        <motion.div
          {...fadeUp(0.19)}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}
        >
          <div style={{
            fontSize: 10, fontWeight: 600,
            color: 'rgba(255,255,255,0.28)',
            letterSpacing: '1.2px', textTransform: 'uppercase',
          }}>
            Misión activa
          </div>
          <div
            onClick={() => setModal('misiones')}
            style={{ fontSize: 11, color: '#D4A847', cursor: 'pointer' }}
          >
            2 misiones →
          </div>
        </motion.div>

        <MisionCard onOpen={() => setModal('misiones')} />

        {/* ── Referidos entry ── */}
        <motion.div
          {...fadeUp(0.26)}
          style={{
            background: '#141414',
            border: '0.5px solid rgba(212,168,71,0.28)',
            borderRadius: 20,
            padding: 14,
            marginBottom: 12,
            display: 'flex', alignItems: 'center', gap: 12,
            cursor: 'pointer',
            position: 'relative', overflow: 'hidden',
          }}
        >
          <div style={{
            position: 'absolute', top: -20, right: -20,
            width: 80, height: 80,
            background: 'radial-gradient(circle, rgba(212,168,71,0.13), transparent)',
            borderRadius: '50%', pointerEvents: 'none',
          }} />
          <div style={{
            width: 46, height: 46,
            background: 'rgba(212,168,71,0.12)',
            borderRadius: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, flexShrink: 0,
          }}>🤝</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 2 }}>
              Trae un amigo, gana puntos
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)' }}>
              Nivel Oro:{' '}
              <span style={{ color: '#F0C96A', fontWeight: 600 }}>+500 pts</span>
              {' '}por referido · 3 invitados
            </div>
          </div>
          <div style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.28)', fontSize: 20, flexShrink: 0 }}>›</div>
        </motion.div>

        {/* ── QR Card (fondo blanco) ── */}
        <motion.div
          {...fadeUp(0.26)}
          onClick={() => setModal('qr')}
          style={{
            background: '#fff',
            borderRadius: 32,
            padding: '14px 16px',
            marginBottom: 12,
            display: 'flex', alignItems: 'center', gap: 13,
            cursor: 'pointer',
          }}
        >
          <div style={{ width: 46, height: 46, flexShrink: 0 }}>
            <svg viewBox="0 0 48 48" width={46} height={46} fill="black">
              <rect x="2" y="2" width="18" height="18" rx="2" fill="none" stroke="black" strokeWidth="2.5"/>
              <rect x="6" y="6" width="10" height="10"/>
              <rect x="28" y="2" width="18" height="18" rx="2" fill="none" stroke="black" strokeWidth="2.5"/>
              <rect x="32" y="6" width="10" height="10"/>
              <rect x="2" y="28" width="18" height="18" rx="2" fill="none" stroke="black" strokeWidth="2.5"/>
              <rect x="6" y="32" width="10" height="10"/>
              <rect x="28" y="28" width="6" height="6"/>
              <rect x="36" y="28" width="6" height="6"/>
              <rect x="28" y="36" width="6" height="6"/>
              <rect x="36" y="36" width="6" height="6"/>
            </svg>
          </div>
          <div>
            <div style={{
              fontSize: 13, fontWeight: 700, color: '#0a0a0a',
              textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 2,
            }}>
              Tu QR Personal
            </div>
            <div style={{ fontSize: 11, color: '#777' }}>
              Muéstralo en caja para sumar puntos
            </div>
          </div>
          <div style={{ marginLeft: 'auto', color: '#bbb', fontSize: 20 }}>›</div>
        </motion.div>

        {/* ── Promo del día ── */}
        <motion.div
          {...fadeUp(0.26)}
          style={{
            background: '#141414',
            border: '0.5px solid rgba(212,168,71,0.28)',
            borderRadius: 20,
            padding: '13px 14px',
            marginBottom: 12,
            display: 'flex', alignItems: 'center', gap: 10,
            cursor: 'pointer',
          }}
        >
          <div style={{
            width: 42, height: 42,
            background: 'rgba(212,168,71,0.12)',
            borderRadius: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, flexShrink: 0,
          }}>🍺</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 2 }}>
              2× puntos en cervezas
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)' }}>Solo hoy · hasta las 22:00</div>
          </div>
          <div style={{
            marginLeft: 'auto',
            background: '#D4A847',
            color: '#000',
            fontSize: 10, fontWeight: 800,
            padding: '3px 8px',
            borderRadius: 20,
            whiteSpace: 'nowrap', flexShrink: 0,
            letterSpacing: '0.3px',
          }}>
            HOY
          </div>
        </motion.div>

        {/* ── Actividad reciente ── */}
        <motion.div
          {...fadeUp(0.33)}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}
        >
          <div style={{
            fontSize: 10, fontWeight: 600,
            color: 'rgba(255,255,255,0.28)',
            letterSpacing: '1.2px', textTransform: 'uppercase',
          }}>
            Actividad reciente
          </div>
          <div style={{ fontSize: 11, color: '#D4A847', cursor: 'pointer' }}>Ver todo →</div>
        </motion.div>

        {ACTIVITY.map((item, i) => (
          <motion.div
            key={i}
            {...fadeUp(0.33 + i * 0.05)}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '11px 13px',
              background: '#141414',
              borderRadius: 14,
              border: '0.5px solid rgba(255,255,255,0.07)',
              marginBottom: 6,
              cursor: 'pointer',
            }}
          >
            <div style={{
              width: 34, height: 34,
              background: '#222222',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 600,
              color: 'rgba(255,255,255,0.55)',
              flexShrink: 0,
            }}>
              {item.initials}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: '#fff', marginBottom: 1 }}>{item.name}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)' }}>{item.detail}</div>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#2ECC71' }}>{item.pts}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)', textAlign: 'right' }}>{item.time}</div>
            </div>
          </motion.div>
        ))}

      </div>

      {/* ── Modales ── */}
      <QRModal      open={modal === 'qr'}       onClose={() => setModal(null)} userName={`${USER.name} ${USER.lastName}`.trim()} userLevel={USER.level} />
      <StreakModal   open={modal === 'streak'}   onClose={() => setModal(null)} streak={USER.streak} />
      <MisionesModal open={modal === 'misiones'} onClose={() => setModal(null)} />

      {/* ── Bottom Nav ── */}
      <BottomNav />

    </div>
  );
}
