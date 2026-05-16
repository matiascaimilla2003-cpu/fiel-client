'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import BottomNav from '@/components/BottomNav';

interface Transaccion {
  id: string;
  tipo: string;
  puntos: number;
  descripcion: string;
  created_at: string;
}

const ICON_MAP: Record<string, string> = {
  compra:   '🛒',
  canje:    '🎁',
  bono:     '⭐',
  ruleta:   '🎰',
  referido: '🤝',
  mision:   '🏆',
  reversa:  '↩️',
};

function iconBg(tipo: string, puntos: number): string {
  if (tipo === 'bono' || tipo === 'ruleta' || tipo === 'mision') return 'rgba(212,168,71,0.12)';
  return puntos >= 0 ? 'rgba(46,204,113,0.1)' : 'rgba(231,76,60,0.1)';
}

function formatDate(iso: string): string {
  const diffDays = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (diffDays === 0) return 'Hoy';
  if (diffDays === 1) return 'Ayer';
  return new Date(iso).toLocaleDateString('es-CL', { day: 'numeric', month: 'short' });
}

function monthLabel(iso: string): string {
  const s = new Date(iso).toLocaleDateString('es-CL', { month: 'long', year: 'numeric' });
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function groupByMonth(txs: Transaccion[]): [string, Transaccion[]][] {
  const map = new Map<string, Transaccion[]>();
  for (const tx of txs) {
    const key = monthLabel(tx.created_at);
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(tx);
  }
  return Array.from(map.entries());
}

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.4 },
});

function Sk({ w, h, r = 8 }: { w: number | string; h: number; r?: number }) {
  return <div style={{ width: w, height: h, background: '#1a1a1a', borderRadius: r, flexShrink: 0 }} />;
}

function TxRow({ tx, delay }: { tx: Transaccion; delay: number }) {
  return (
    <motion.div
      {...fadeUp(delay)}
      style={{
        display: 'flex', alignItems: 'center', gap: 11,
        padding: '12px 14px',
        borderBottom: '0.5px solid rgba(255,255,255,0.07)',
      }}
    >
      <div style={{
        width: 38, height: 38, borderRadius: 10,
        background: iconBg(tx.tipo, tx.puntos),
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 17, flexShrink: 0,
      }}>
        {ICON_MAP[tx.tipo] ?? '📌'}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: '#fff', marginBottom: 2 }}>
          {tx.descripcion}
        </div>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)' }}>
          {formatDate(tx.created_at)}
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: tx.puntos >= 0 ? '#2ECC71' : '#E74C3C' }}>
          {tx.puntos > 0 ? '+' : ''}{tx.puntos}
        </div>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)', marginTop: 1 }}>pts</div>
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
  const router = useRouter();
  const [transacciones, setTransacciones] = useState<Transaccion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem('cfiel_user_id');
    if (!userId) { router.replace('/'); return; }

    fetch(`/api/usuarios/${userId}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.transacciones) setTransacciones(data.transacciones); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [router]);

  const ganados = transacciones.filter(t => t.puntos > 0).reduce((s, t) => s + t.puntos, 0);
  const usados  = transacciones.filter(t => t.puntos < 0).reduce((s, t) => s + Math.abs(t.puntos), 0);
  const grupos  = groupByMonth(transacciones);

  if (loading) {
    return (
      <div style={{ background: '#0a0a0a', minHeight: '100dvh', maxWidth: 430, margin: '0 auto' }}>
        <div style={{ padding: '16px 16px 90px' }}>
          <Sk w={120} h={30} r={8} />
          <div style={{ height: 8 }} />
          <Sk w={180} h={12} r={6} />
          <div style={{ height: 16 }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
            <Sk w="100%" h={68} r={14} />
            <Sk w="100%" h={68} r={14} />
          </div>
          {[0, 1, 2, 3, 4].map(i => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '12px 0', borderBottom: '0.5px solid rgba(255,255,255,0.07)' }}>
              <Sk w={38} h={38} r={10} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <Sk w="70%" h={12} />
                <Sk w="40%" h={10} />
              </div>
              <Sk w={40} h={14} />
            </div>
          ))}
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100dvh', maxWidth: 430, margin: '0 auto' }}>
      <div style={{ padding: '16px 16px 90px' }}>

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

        {/* Stats */}
        <motion.div
          {...fadeUp(0.1)}
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}
        >
          <div style={{ background: '#141414', borderRadius: 14, border: '0.5px solid rgba(255,255,255,0.07)', padding: '13px 14px' }}>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: 4 }}>
              Ganados
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#2ECC71' }}>
              +{ganados.toLocaleString('es-CL')}
            </div>
          </div>
          <div style={{ background: '#141414', borderRadius: 14, border: '0.5px solid rgba(255,255,255,0.07)', padding: '13px 14px' }}>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: 4 }}>
              Usados
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#E74C3C' }}>
              −{usados.toLocaleString('es-CL')}
            </div>
          </div>
        </motion.div>

        {transacciones.length === 0 ? (
          <motion.div
            {...fadeUp(0.14)}
            style={{ textAlign: 'center', padding: '48px 20px', color: 'rgba(255,255,255,0.28)', fontSize: 13, lineHeight: 1.6 }}
          >
            <div style={{ fontSize: 36, marginBottom: 12 }}>📭</div>
            Aún no tienes actividad.
            <br />¡Haz tu primera compra!
          </motion.div>
        ) : (
          grupos.map(([mes, txs], gi) => (
            <div key={mes}>
              <MonthLabel label={mes} delay={0.12 + gi * 0.04} />
              {txs.map((tx, i) => (
                <TxRow key={tx.id} tx={tx} delay={0.14 + gi * 0.04 + i * 0.04} />
              ))}
            </div>
          ))
        )}

      </div>
      <BottomNav />
    </div>
  );
}
