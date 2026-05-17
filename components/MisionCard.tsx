'use client';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Mision {
  id: string;
  titulo: string;
  descripcion: string | null;
  puntos_premio: number;
  meta_tipo: string;
  meta_valor: number;
  fecha_fin: string | null;
}

interface Props {
  onOpen: () => void;
  mision: Mision | null;
}

function MisionIcon({ tipo }: { tipo: string }) {
  if (tipo === 'compras' || tipo === 'visitas') {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
      </svg>
    );
  }
  if (tipo === 'monto') {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    );
  }
  if (tipo === 'dias') {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2c0 4-4 7-4 11a4 4 0 0 0 8 0c0-4-4-7-4-11z"/>
        <path d="M12 13c0-2 1.5-3 1.5-5"/>
      </svg>
    );
  }
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/>
    </svg>
  );
}

function daysLeft(fechaFin: string | null): string {
  if (!fechaFin) return '';
  const days = Math.ceil((new Date(fechaFin).getTime() - Date.now()) / 86400000);
  if (days <= 0) return 'Vence hoy';
  return `${days} día${days === 1 ? '' : 's'} restante${days === 1 ? '' : 's'}`;
}

export default function MisionCard({ onOpen, mision }: Props) {
  const [barWidth, setBarWidth] = useState(0);

  useEffect(() => {
    if (!mision) return;
    const t = setTimeout(() => setBarWidth(0), 300);
    return () => clearTimeout(t);
  }, [mision]);

  if (!mision) return null;

  const dias = daysLeft(mision.fecha_fin);
  const subtitle = [
    `0 de ${mision.meta_valor}`,
    dias,
  ].filter(Boolean).join(' · ');

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.19, duration: 0.4 }}
      onClick={onOpen}
      className="cfiel-card"
      style={{
        borderRadius: 20,
        padding: 14, marginBottom: 12, cursor: 'pointer',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
        <div style={{
          width: 42, height: 42, background: '#222222', borderRadius: 14,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, color: '#818CF8',
        }}>
          <MisionIcon tipo={mision.meta_tipo} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 2 }}>
            {mision.titulo}
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)' }}>
            {subtitle}
          </div>
        </div>
        <div style={{
          background: '#6366F1',
          borderRadius: 20, padding: '5px 12px',
          fontSize: 11, fontWeight: 700, color: '#fff',
          whiteSpace: 'nowrap', flexShrink: 0,
        }}>
          +{mision.puntos_premio} pts
        </div>
      </div>

      <div style={{ height: 5, background: 'rgba(255,255,255,0.07)', borderRadius: 5, overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          background: 'linear-gradient(90deg, #6366F1, #818CF8)',
          borderRadius: 5,
          width: `${barWidth}%`,
          transition: 'width 1.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 5 }}>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)' }}>0% completada</div>
        <div style={{ fontSize: 10, color: '#6366F1' }}>Ver todas →</div>
      </div>
    </motion.div>
  );
}
