'use client';
import { motion } from 'framer-motion';
import BottomNav from '@/components/BottomNav';

type TxType = 'e' | 's' | 'g'; // entrada (verde) / salida (rojo) / gold (bono)

interface Tx {
  icon: string;
  type: TxType;
  title: string;
  date: string;
  pts: string;
  sub: string;
}

const ABRIL: Tx[] = [
  { icon: '🛒', type: 'e', title: 'Compra en tienda',       date: 'Hoy · $12.800',   pts: '+160', sub: 'pts'      },
  { icon: '🍺', type: 'g', title: 'Compra 2× cervezas',     date: 'Hoy · $6.400',    pts: '+160', sub: 'bonus 2×' },
  { icon: '🎁', type: 's', title: 'Canje descuento $5.000', date: '28 abr',           pts: '−640', sub: 'pts'      },
  { icon: '🛒', type: 'e', title: 'Compra en tienda',       date: '26 abr · $19.500', pts: '+240', sub: 'pts'      },
  { icon: '🛒', type: 'e', title: 'Compra en tienda',       date: '22 abr · $8.100',  pts: '+100', sub: 'pts'      },
];

const MARZO: Tx[] = [
  { icon: '🛒', type: 'e', title: 'Compra en tienda',      date: '31 mar · $15.200', pts: '+187', sub: 'pts'    },
  { icon: '🛒', type: 'e', title: 'Compra en tienda',      date: '15 mar · $22.000', pts: '+270', sub: 'pts'    },
  { icon: '🔥', type: 'g', title: 'Bono racha 14 días',    date: '10 mar',           pts: '+100', sub: 'bonus'  },
  { icon: '🎰', type: 'g', title: 'Premio ruleta semanal', date: '3 mar',            pts: '+200', sub: 'ruleta' },
];

const TYPE_STYLE: Record<TxType, { iconBg: string; ptsColor: string }> = {
  e: { iconBg: 'rgba(46,204,113,0.1)',  ptsColor: '#2ECC71' },
  s: { iconBg: 'rgba(231,76,60,0.1)',   ptsColor: '#E74C3C' },
  g: { iconBg: 'rgba(212,168,71,0.12)', ptsColor: '#2ECC71' },
};

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.4 },
});

function TxItem({ tx, delay }: { tx: Tx; delay: number }) {
  const { iconBg, ptsColor } = TYPE_STYLE[tx.type];
  return (
    <motion.div
      {...fadeUp(delay)}
      style={{
        display: 'flex', alignItems: 'center', gap: 11,
        padding: '12px 14px',
        borderBottom: '0.5px solid rgba(255,255,255,0.07)',
        cursor: 'pointer',
      }}
    >
      <div style={{
        width: 38, height: 38, borderRadius: 10,
        background: iconBg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 17, flexShrink: 0,
      }}>
        {tx.icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: '#fff', marginBottom: 2 }}>{tx.title}</div>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)' }}>{tx.date}</div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: ptsColor }}>{tx.pts}</div>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)', marginTop: 1 }}>{tx.sub}</div>
      </div>
    </motion.div>
  );
}

function MonthLabel({ label, delay }: { label: string; delay: number }) {
  return (
    <motion.div
      {...fadeUp(delay)}
      style={{
        fontSize: 10, fontWeight: 600,
        color: 'rgba(255,255,255,0.28)',
        letterSpacing: '1px', textTransform: 'uppercase',
        margin: '10px 0 6px',
      }}
    >
      {label}
    </motion.div>
  );
}

export default function HistorialPage() {
  return (
    <div style={{ background: '#0a0a0a', minHeight: '100dvh', maxWidth: 430, margin: '0 auto' }}>
      <div style={{ padding: '16px 16px 90px' }}>

        {/* ── Header ── */}
        <motion.div {...fadeUp(0.05)} style={{ marginBottom: 16 }}>
          <div style={{
            fontFamily: 'var(--font-bebas), "Bebas Neue", sans-serif',
            fontSize: 30, color: '#fff', letterSpacing: 1, marginBottom: 3,
          }}>
            Historial
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>
            Tus movimientos de puntos
          </div>
        </motion.div>

        {/* ── Stats 2×2 ── */}
        <motion.div
          {...fadeUp(0.1)}
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}
        >
          <div style={{
            background: '#141414', borderRadius: 14,
            border: '0.5px solid rgba(255,255,255,0.07)',
            padding: '13px 14px',
          }}>
            <div style={{
              fontSize: 10, color: 'rgba(255,255,255,0.28)',
              letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: 4,
            }}>
              Ganados
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#2ECC71' }}>+1.847</div>
          </div>
          <div style={{
            background: '#141414', borderRadius: 14,
            border: '0.5px solid rgba(255,255,255,0.07)',
            padding: '13px 14px',
          }}>
            <div style={{
              fontSize: 10, color: 'rgba(255,255,255,0.28)',
              letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: 4,
            }}>
              Usados
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#E74C3C' }}>−640</div>
          </div>
        </motion.div>

        {/* ── Abril ── */}
        <MonthLabel label="Abril 2025" delay={0.14} />
        {ABRIL.map((tx, i) => (
          <TxItem key={i} tx={tx} delay={0.16 + i * 0.05} />
        ))}

        {/* ── Marzo ── */}
        <MonthLabel label="Marzo 2025" delay={0.42} />
        {MARZO.map((tx, i) => (
          <TxItem key={i} tx={tx} delay={0.44 + i * 0.05} />
        ))}

      </div>

      <BottomNav />
    </div>
  );
}
