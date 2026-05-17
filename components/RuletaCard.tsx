'use client';
import { motion } from 'framer-motion';

interface Props {
  onOpen: () => void;
}

export default function RuletaCard({ onOpen }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.19, duration: 0.4 }}
      onClick={onOpen}
      style={{
        background: '#141414',
        borderRadius: 20,
        border: '0.5px solid rgba(255,255,255,0.13)',
        padding: 14,
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      {/* Punto rojo de disponible */}
      <div style={{
        position: 'absolute', top: 10, right: 10,
        width: 8, height: 8,
        background: '#E74C3C',
        borderRadius: '50%',
        border: '1.5px solid #141414',
      }} />

      <div style={{ fontSize: 28, marginBottom: 6, lineHeight: 1 }}>🎰</div>
      <div style={{ fontSize: 12, fontWeight: 600, color: '#fff', marginBottom: 2 }}>
        Ruleta semanal
      </div>
      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', marginBottom: 10, lineHeight: 1.3 }}>
        1 giro gratis disponible
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); onOpen(); }}
        style={{
          background: '#6366F1',
          color: '#0a0a0a',
          border: 'none',
          borderRadius: 16,
          padding: '7px 0',
          fontSize: 12,
          fontWeight: 700,
          cursor: 'pointer',
          width: '100%',
          letterSpacing: '0.3px',
          fontFamily: 'inherit',
        }}
      >
        ¡Girar ahora!
      </button>
    </motion.div>
  );
}
