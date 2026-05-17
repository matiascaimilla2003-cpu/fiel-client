'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

// ── Confetti ─────────────────────────────────────────────────

interface ConfettiPiece {
  id: number;
  left: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
  shape: 'rect' | 'circle' | 'diamond';
}

const CONFETTI_COLORS = ['#6366F1', '#818CF8', '#A5B4FC', '#ffffff', '#4F46E5'];

function Confetti() {
  const pieces = useMemo<ConfettiPiece[]>(() => {
    const shapes: ConfettiPiece['shape'][] = ['rect', 'circle', 'diamond'];
    return Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 5 + Math.random() * 9,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      duration: 2.2 + Math.random() * 2,
      delay: Math.random() * 1.2,
      shape: shapes[Math.floor(Math.random() * shapes.length)],
    }));
  }, []);

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 15 }}>
      {pieces.map(p => (
        <motion.div
          key={p.id}
          initial={{ y: -20, opacity: 0.9, rotate: 0 }}
          animate={{ y: 900, opacity: 0, rotate: (Math.random() - 0.5) * 720 }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'linear' }}
          style={{
            position: 'absolute',
            left: `${p.left}%`,
            top: 0,
            width: p.size,
            height: p.shape === 'rect' ? p.size * 0.38 : p.size,
            background: p.color,
            borderRadius: p.shape === 'circle' ? '50%' : 2,
            transform: p.shape === 'diamond' ? 'rotate(45deg)' : undefined,
          }}
        />
      ))}
    </div>
  );
}

// ── Logros ───────────────────────────────────────────────────

const ACHIEVEMENTS: {
  title: string;
  sub: string;
  value: string;
  unit: string;
  icon: React.ReactElement;
}[] = [
  {
    title: 'Bono de bienvenida',
    sub: 'Puntos para empezar ya',
    value: '+200',
    unit: 'pts',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
      </svg>
    ),
  },
  {
    title: 'Racha activada',
    sub: 'Abre la app cada día',
    value: 'DÍA',
    unit: '1',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2c1 4 5 6 5 11a5 5 0 0 1-10 0c0-2 1-3 2-4-.5 2 .5 3 1 3-.5-3 0-7 2-10z"/>
      </svg>
    ),
  },
  {
    title: 'Misión de inicio',
    sub: 'Haz tu primera compra',
    value: '+300',
    unit: 'pts',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1.5"/>
        <circle cx="19" cy="21" r="1.5"/>
        <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/>
      </svg>
    ),
  },
];

// ── Página principal ─────────────────────────────────────────

export default function BienvenidaPage() {
  const router = useRouter();
  const [nombre,   setNombre]   = useState('');
  const [mounted,  setMounted]  = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('cfiel_nombre');
    if (saved) setNombre(saved);
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{
      background: '#0a0a14',
      minHeight: '100dvh',
      maxWidth: 430,
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Confetti */}
      <Confetti/>

      {/* Halo de fondo */}
      <div style={{
        position: 'absolute', left: '50%', top: 220,
        transform: 'translate(-50%, -50%)',
        width: 500, height: 500,
        background: 'radial-gradient(circle, rgba(99,102,241,0.22) 0%, transparent 60%)',
        filter: 'blur(20px)',
        pointerEvents: 'none',
      }}/>

      {/* Contenido principal */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        padding: '32px 24px 24px', position: 'relative', zIndex: 20,
      }}>

        {/* Eyebrow */}
        <div style={{
          fontFamily: 'var(--font-bebas), "Bebas Neue", sans-serif',
          fontSize: 12, letterSpacing: '0.4em',
          color: 'rgba(255,255,255,0.45)',
          textAlign: 'center', marginTop: 24,
          opacity: mounted ? 1 : 0,
          transition: 'opacity 0.6s ease 0.15s',
        }}>
          CUENTA CREADA · BIENVENIDO
        </div>

        {/* Nombre protagonista */}
        <div style={{
          position: 'relative',
          display: 'flex', justifyContent: 'center',
          marginTop: 16, marginBottom: 8,
        }}>
          {/* Halo mayor */}
          <div style={{
            position: 'absolute', inset: '-40px -20px',
            background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.45) 0%, rgba(99,102,241,0.12) 35%, transparent 65%)',
            filter: 'blur(8px)',
            opacity: mounted ? 1 : 0,
            transition: 'opacity 1s ease 0.2s',
            pointerEvents: 'none',
          }}/>
          {/* Halo menor pulsante */}
          <div style={{
            position: 'absolute', inset: '-10px 30px',
            background: 'radial-gradient(ellipse at center, rgba(129,140,248,0.4) 0%, transparent 70%)',
            filter: 'blur(4px)',
            opacity: mounted ? 0.7 : 0,
            animation: mounted ? 'glowPulse 3.5s ease-in-out infinite' : 'none',
            pointerEvents: 'none',
          }}/>
          <h1 style={{
            fontFamily: 'var(--font-bebas), "Bebas Neue", sans-serif',
            fontSize: 88, lineHeight: 0.9, margin: 0, position: 'relative',
            background: 'linear-gradient(180deg, #C7D2FE 0%, #818CF8 50%, #6366F1 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '0.02em',
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.94)',
            transition: 'all 0.9s cubic-bezier(.2,.9,.3,1) 0.3s',
            filter: 'drop-shadow(0 0 24px rgba(99,102,241,0.4))',
          }}>
            {nombre.toUpperCase() || 'CARLOS'}
          </h1>
        </div>

        <p style={{
          fontSize: 14, lineHeight: 1.55,
          margin: '8px auto 0', maxWidth: 320, textAlign: 'center',
          color: 'rgba(255,255,255,0.55)',
          opacity: mounted ? 1 : 0,
          transition: 'opacity 0.6s ease 0.6s',
        }}>
          Tu cuenta está lista. Estos tres regalos te están esperando.
        </p>

        {/* Achievement cards */}
        <div style={{ marginTop: 36, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {ACHIEVEMENTS.map((a, i) => (
            <div
              key={i}
              style={{
                position: 'relative',
                background: 'linear-gradient(180deg, rgba(99,102,241,0.14) 0%, rgba(99,102,241,0.04) 100%)',
                border: '1.5px solid rgba(129,140,248,0.55)',
                borderRadius: 18,
                padding: '16px 18px',
                display: 'flex', alignItems: 'center', gap: 14,
                boxShadow: '0 0 0 1px rgba(99,102,241,0.08), 0 12px 32px rgba(99,102,241,0.18), inset 0 1px 0 rgba(255,255,255,0.06)',
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.95)',
                transition: `all 0.7s cubic-bezier(.2,1.2,.3,1) ${0.9 + i * 0.22}s`,
              }}
            >
              {/* Top edge highlight */}
              <div style={{
                position: 'absolute', top: 0, left: 16, right: 16, height: 1,
                background: 'linear-gradient(90deg, transparent, rgba(165,180,252,0.6), transparent)',
              }}/>

              {/* Icono */}
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: 'linear-gradient(135deg, rgba(99,102,241,0.4), rgba(99,102,241,0.15))',
                border: '1px solid rgba(129,140,248,0.5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#C7D2FE', flexShrink: 0,
                boxShadow: '0 4px 16px rgba(99,102,241,0.3)',
              }}>
                {a.icon}
              </div>

              {/* Texto */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>{a.title}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>{a.sub}</div>
              </div>

              {/* Valor */}
              <div style={{ textAlign: 'right', display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span style={{
                  fontFamily: 'var(--font-bebas), "Bebas Neue", sans-serif',
                  fontSize: 36, lineHeight: 1, color: '#818CF8',
                  letterSpacing: '0.02em',
                  textShadow: '0 0 16px rgba(99,102,241,0.6)',
                }}>
                  {a.value}
                </span>
                <span style={{
                  fontFamily: 'var(--font-bebas), "Bebas Neue", sans-serif',
                  fontSize: 13, color: '#818CF8', opacity: 0.7,
                }}>
                  {a.unit}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ flex: 1 }}/>

        {/* CTA */}
        <div style={{
          display: 'flex', flexDirection: 'column', gap: 10,
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.6s cubic-bezier(.2,.8,.2,1) 1.7s',
        }}>
          <button
            onClick={async () => {
              if (!localStorage.getItem('cfiel_user_id')) {
                await new Promise(r => setTimeout(r, 500));
              }
              router.push('/home');
            }}
            style={{
              background: '#6366F1', color: '#fff', border: 'none',
              borderRadius: 100, padding: '16px 24px',
              fontSize: 15, fontWeight: 700, cursor: 'pointer',
              width: '100%', fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
          >
            Ir a mi cuenta
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 5l7 7-7 7"/>
            </svg>
          </button>
          <div style={{ textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
            Tu primer punto está esperando.
          </div>
        </div>
      </div>
    </div>
  );
}
