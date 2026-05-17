'use client';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Props {
  points: number;
  level: string;
  progressPct: number;
  ptsToNextLevel: number;
}

export default function HeroCard({ points, level, progressPct, ptsToNextLevel }: Props) {
  const [barWidth, setBarWidth] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setBarWidth(progressPct), 300);
    return () => clearTimeout(t);
  }, [progressPct]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.12, duration: 0.4 }}
      className="cfiel-card"
      style={{
        borderRadius: 32,
        padding: '20px 20px 16px',
        marginBottom: 12,
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
      }}
    >
      {/* Glow radial */}
      <div style={{
        position: 'absolute', top: -40, right: -40,
        width: 150, height: 150,
        background: 'radial-gradient(circle, rgba(99,102,241,0.15), transparent 68%)',
        borderRadius: '50%',
        pointerEvents: 'none',
      }} />

      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)', letterSpacing: '1.4px', textTransform: 'uppercase', marginBottom: 3 }}>
        Puntos acumulados
      </div>

      <div style={{
        fontFamily: 'var(--font-bebas), "Bebas Neue", sans-serif',
        fontSize: 66,
        color: '#fff',
        lineHeight: 1,
        letterSpacing: -2,
        marginBottom: 3,
      }}>
        {points.toLocaleString('es-CL')}
      </div>

      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', marginBottom: 14 }}>
        ≈ $1.448 en descuentos
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          background: 'rgba(99,102,241,0.12)',
          border: '0.5px solid rgba(99,102,241,0.28)',
          borderRadius: 20, padding: '3px 10px',
        }}>
          <span style={{ fontSize: 10 }}>⭐</span>
          <span style={{ fontSize: 10, fontWeight: 600, color: '#6366F1', letterSpacing: '0.5px' }}>
            NIVEL {level.toUpperCase()}
          </span>
        </div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)' }}>
          → {ptsToNextLevel} pts para Platino
        </div>
      </div>

      {/* Barra progreso animada */}
      <div style={{ height: 5, background: 'rgba(255,255,255,0.07)', borderRadius: 5, overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          background: 'linear-gradient(90deg, #6366F1, #818CF8)',
          borderRadius: 5,
          width: `${barWidth}%`,
          transition: 'width 1.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }} />
      </div>

      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)', marginTop: 6 }}>
        Te faltan{' '}
        <span style={{ color: '#818CF8', fontWeight: 600 }}>{ptsToNextLevel} pts</span>
        {' '}para el siguiente nivel
      </div>
    </motion.div>
  );
}
