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

function TxIcon({ tipo }: { tipo: string }) {
  if (tipo === 'compra') return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
    </svg>
  );
  if (tipo === 'canje') return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 12 20 22 4 22 4 12"/>
      <rect x="2" y="7" width="20" height="5"/>
      <line x1="12" y1="22" x2="12" y2="7"/>
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
    </svg>
  );
  if (tipo === 'bono') return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  );
  if (tipo === 'ruleta') return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 8v4l3 3"/>
    </svg>
  );
  if (tipo === 'referido') return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  );
  if (tipo === 'mision') return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
      <path d="M4 22h16"/>
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/>
    </svg>
  );
  if (tipo === 'reversa') return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="1 4 1 10 7 10"/>
      <path d="M3.51 15a9 9 0 1 0 .49-3.45"/>
    </svg>
  );
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  );
}

function iconBg(tipo: string, puntos: number): string {
  if (tipo === 'bono' || tipo === 'ruleta' || tipo === 'mision') return 'rgba(99,102,241,0.12)';
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
        flexShrink: 0, color: 'rgba(255,255,255,0.6)',
      }}>
        <TxIcon tipo={tx.tipo} />
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
      <div style={{ background: '#0a0a14', minHeight: '100dvh', maxWidth: 430, margin: '0 auto' }}>
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
    <div style={{ background: '#0a0a14', minHeight: '100dvh', maxWidth: 430, margin: '0 auto' }}>
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
          <div className="cfiel-card" style={{ borderRadius: 14, padding: '13px 14px' }}>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: 4 }}>
              Ganados
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#2ECC71' }}>
              +{ganados.toLocaleString('es-CL')}
            </div>
          </div>
          <div className="cfiel-card" style={{ borderRadius: 14, padding: '13px 14px' }}>
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
            <div style={{ marginBottom: 12, color: 'rgba(255,255,255,0.28)' }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-6l-2 3h-4l-2-3H2"/>
                <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>
              </svg>
            </div>
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
