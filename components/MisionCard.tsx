'use client';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Props {
  onOpen: () => void;
}

export default function MisionCard({ onOpen }: Props) {
  const [barWidth, setBarWidth] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setBarWidth(50), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.19, duration: 0.4 }}
      onClick={onOpen}
      style={{
        background: '#141414',
        borderRadius: 20,
        border: '0.5px solid rgba(255,255,255,0.07)',
        padding: 14,
        marginBottom: 12,
        cursor: 'pointer',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
        <div style={{
          width: 42, height: 42,
          background: '#222222',
          borderRadius: 14,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 19, flexShrink: 0,
        }}>
          🛒
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 2 }}>
            Compra 2 veces esta semana
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)' }}>
            1 de 2 compras · 4 días restantes
          </div>
        </div>
        <div style={{
          background: 'rgba(212,168,71,0.12)',
          border: '0.5px solid rgba(212,168,71,0.28)',
          borderRadius: 20,
          padding: '4px 9px',
          fontSize: 11,
          fontWeight: 700,
          color: '#F0C96A',
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}>
          +200 pts
        </div>
      </div>

      <div style={{ height: 5, background: 'rgba(255,255,255,0.07)', borderRadius: 5, overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          background: 'linear-gradient(90deg, #D4A847, #F0C96A)',
          borderRadius: 5,
          width: `${barWidth}%`,
          transition: 'width 1.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 5 }}>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)' }}>50% completada</div>
        <div style={{ fontSize: 10, color: '#D4A847' }}>Ver todas →</div>
      </div>
    </motion.div>
  );
}
