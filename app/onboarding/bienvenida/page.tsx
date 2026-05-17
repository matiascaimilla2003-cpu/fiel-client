'use client';
import { useState, useEffect } from 'react';
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

const CARDS = [
  { icon: '🎁', title: 'Bono de bienvenida', sub: 'Puntos para empezar ya',    pts: '+200 pts' },
  { icon: '🔥', title: 'Racha activada',      sub: 'Abre la app cada día',      pts: 'Día 1'    },
  { icon: '🛒', title: 'Misión de inicio',    sub: 'Haz tu primera compra',     pts: '+300 pts' },
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
      background: '#0a0a0a',
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
        <span style={{ fontSize: 56, display: 'block', marginBottom: 14 }}>🎉</span>

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
              fontSize: 19, flexShrink: 0,
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
