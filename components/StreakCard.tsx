'use client';
import { motion } from 'framer-motion';

interface Props {
  streak: number;
  onOpen: () => void;
}

export default function StreakCard({ streak, onOpen }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.19, duration: 0.4 }}
      onClick={onOpen}
      style={{
        background: '#141414',
        borderRadius: 20,
        border: '0.5px solid rgba(212,168,71,0.28)',
        padding: 14,
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Glow */}
      <div style={{
        position: 'absolute', bottom: -20, right: -20,
        width: 80, height: 80,
        background: 'radial-gradient(circle, rgba(212,168,71,0.14), transparent)',
        borderRadius: '50%',
        pointerEvents: 'none',
      }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <span style={{ fontSize: 24, lineHeight: 1 }}>🔥</span>
        <div>
          <div style={{
            fontFamily: 'var(--font-bebas), "Bebas Neue", sans-serif',
            fontSize: 36,
            color: '#D4A847',
            lineHeight: 1,
            letterSpacing: -1,
          }}>
            {streak}
          </div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)', marginTop: 1 }}>
            días seguidos
          </div>
        </div>
      </div>

      {/* Pips de 7 días */}
      <div style={{ display: 'flex', gap: 3, marginBottom: 6 }}>
        {Array.from({ length: 7 }, (_, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 4,
              borderRadius: 4,
              background:
                i < streak - 1
                  ? '#D4A847'
                  : i === streak - 1
                  ? '#F0C96A'
                  : 'rgba(255,255,255,0.08)',
            }}
          />
        ))}
      </div>

      <div style={{ fontSize: 10, color: '#F0C96A', fontWeight: 600 }}>+50 pts hoy ✓</div>
    </motion.div>
  );
}
