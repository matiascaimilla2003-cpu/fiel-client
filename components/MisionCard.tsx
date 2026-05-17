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

const MISION_ICON: Record<string, string> = {
  compras: '🛒',
  visitas: '🛒',
  monto:   '💰',
  dias:    '🔥',
};

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

  const icon = MISION_ICON[mision.meta_tipo] ?? '🎯';
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
          fontSize: 19, flexShrink: 0,
        }}>
          {icon}
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
