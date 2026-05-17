'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

/* ── Tipos ── */
interface ConfettiPiece {
  id: number;
  left: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
  isRound: boolean;
}

const CONFETTI_COLORS = ['#6366F1', '#818CF8', '#2ECC71', '#ffffff', '#E8C060', '#3B82F6'];

const CARDS: { icon: React.ReactElement; title: string; sub: string; pts: string }[] = [
  {
    icon: (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 12 20 22 4 22 4 12"/>
        <rect x="2" y="7" width="20" height="5"/>
        <line x1="12" y1="22" x2="12" y2="7"/>
        <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
        <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
      </svg>
    ),
    title: 'Bono de bienvenida', sub: 'Puntos para empezar ya', pts: '+200 pts',
  },
  {
    icon: (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2c0 4-4 7-4 11a4 4 0 0 0 8 0c0-4-4-7-4-11z"/>
        <path d="M12 13c0-2 1.5-3 1.5-5"/>
      </svg>
    ),
    title: 'Racha activada', sub: 'Abre la app cada día', pts: 'Día 1',
  },
  {
    icon: (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
      </svg>
    ),
    title: 'Misión de inicio', sub: 'Haz tu primera compra', pts: '+300 pts',
  },
];

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.4 },
});

export default function BienvenidaPage() {
  const router = useRouter();
  const [nombre,   setNombre]   = useState('');
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);

  /* Leer nombre desde localStorage y generar confetti en el cliente */
  useEffect(() => {
    const saved = localStorage.getItem('cfiel_nombre');
    if (saved) setNombre(saved);

    setConfetti(
      Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left:     Math.random() * 100,
        size:     5 + Math.random() * 7,
        color:    CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        duration: 1.8 + Math.random() * 2,
        delay:    Math.random() * 0.9,
        isRound:  Math.random() > 0.5,
      }))
    );
  }, []);

  return (
    <div style={{
      background: '#0a0a14',
      minHeight: '100dvh',
      maxWidth: 430,
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* ── Capa de confeti ── */}
      <div style={{
        position: 'absolute', inset: 0,
        pointerEvents: 'none', overflow: 'hidden', zIndex: 15,
      }}>
        {confetti.map((p) => (
          <motion.div
            key={p.id}
            initial={{ y: -20, opacity: 1, rotate: 0 }}
            animate={{ y: 900, opacity: 0, rotate: 720 }}
            transition={{ duration: p.duration, delay: p.delay, ease: 'linear' }}
            style={{
              position: 'absolute',
              left: `${p.left}%`,
              top: 0,
              width: p.size,
              height: p.size,
              background: p.color,
              borderRadius: p.isRound ? '50%' : 2,
            }}
          />
        ))}
      </div>

      {/* ── Hero section ── */}
      <motion.div
        {...fadeUp(0.05)}
        style={{
          width: '100%',
          background: '#141414',
          borderRadius: '0 0 32px 32px',
          padding: '28px 24px 24px',
          textAlign: 'center',
          marginBottom: 20,
          borderBottom: '0.5px solid rgba(99,102,241,0.28)',
          position: 'relative',
          zIndex: 20,
        }}
      >
        <div style={{ marginBottom: 14, display: 'flex', justifyContent: 'center' }}>
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>

        <div style={{
          fontFamily: 'var(--font-bebas), "Bebas Neue", sans-serif',
          fontSize: 36, letterSpacing: 1, lineHeight: 1, marginBottom: 8,
        }}>
          <span style={{ color: '#fff' }}>¡BIENVENIDO,</span>
          <br />
          <span style={{ color: '#6366F1' }}>{nombre.toUpperCase() || 'CARLOS'}</span>
          <span style={{ color: '#fff' }}>!</span>
        </div>

        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>
          Tu cuenta está lista. Ya puedes acumular puntos en cada compra.
        </div>
      </motion.div>

      {/* ── Cards animadas con delay escalonado ── */}
      <div style={{
        padding: '0 16px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        marginBottom: 20,
        position: 'relative',
        zIndex: 20,
      }}>
        {CARDS.map((card, i) => (
          <motion.div
            key={i}
            {...fadeUp(0.1 + i * 0.1)}
            style={{
              background: '#141414',
              borderRadius: 20,
              border: '0.5px solid rgba(255,255,255,0.07)',
              padding: '13px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <div style={{
              width: 40, height: 40,
              background: '#222222',
              borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, color: '#818CF8',
            }}>
              {card.icon}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 2 }}>
                {card.title}
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)' }}>{card.sub}</div>
            </div>
            <div style={{
              marginLeft: 'auto',
              fontSize: 13, fontWeight: 700,
              color: '#818CF8',
              flexShrink: 0,
            }}>
              {card.pts}
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Botón dorado ── */}
      <motion.div
        {...fadeUp(0.45)}
        style={{ padding: '0 16px 32px', width: '100%', position: 'relative', zIndex: 20 }}
      >
        <button
          onClick={async () => {
            // Verificar que cfiel_user_id ya está escrito antes de navegar
            if (!localStorage.getItem('cfiel_user_id')) {
              await new Promise(r => setTimeout(r, 500));
            }
            router.push('/home');
          }}
          style={{
            background: '#6366F1',
            color: '#0a0a0a',
            border: 'none',
            borderRadius: 28,
            padding: 15,
            fontSize: 15,
            fontWeight: 700,
            cursor: 'pointer',
            width: '100%',
            fontFamily: 'inherit',
            letterSpacing: '0.2px',
          }}
        >
          Ir a mi cuenta →
        </button>
      </motion.div>
    </div>
  );
}
