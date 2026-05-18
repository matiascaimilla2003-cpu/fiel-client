'use client';
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import BottomNav from '@/components/BottomNav';

interface Transaccion {
  id: string;
  tipo: string;
  puntos: number;
  descripcion: string;
  created_at: string;
}

// ── helpers ──────────────────────────────────────────────────────

function txColor(tipo: string): string {
  const map: Record<string, string> = {
    compra:   '#4ADE80',
    canje:    '#F87171',
    bono:     '#F5C16C',
    ruleta:   '#818CF8',
    referido: '#C4B5FD',
    mision:   '#818CF8',
    reversa:  '#F87171',
  };
  return map[tipo] ?? '#818CF8';
}

function isBono(tipo: string): boolean {
  return ['bono', 'ruleta', 'referido', 'mision'].includes(tipo);
}

function formatDate(iso: string): string {
  const diffDays = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (diffDays === 0) return 'Hoy';
  if (diffDays === 1) return 'Ayer';
  return new Date(iso).toLocaleDateString('es-CL', { day: 'numeric', month: 'short' });
}

function monthLabel(iso: string): string {
  const d = new Date(iso);
  const m = d.toLocaleDateString('es-CL', { month: 'long' });
  return `${m.toUpperCase()} DE ${d.getFullYear()}`;
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

// ── TxIcon ───────────────────────────────────────────────────────

function TxIcon({ tipo, size = 18 }: { tipo: string; size?: number }) {
  const color = txColor(tipo);
  const filled = tipo === 'bono' || tipo === 'mision';

  const paths: Record<string, React.ReactNode> = {
    compra: (
      <>
        <circle cx="9" cy="21" r="1.5"/>
        <circle cx="19" cy="21" r="1.5"/>
        <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/>
      </>
    ),
    canje: (
      <path d="M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
    ),
    bono: (
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    ),
    ruleta: (
      <>
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 6v6l4 2"/>
      </>
    ),
    referido: (
      <>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
      </>
    ),
    mision: (
      <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zM5 18h14v2H5z"/>
    ),
    reversa: (
      <>
        <polyline points="1 4 1 10 7 10"/>
        <path d="M3.51 15a9 9 0 1 0 .49-3.45"/>
      </>
    ),
  };

  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24"
      fill={filled ? color : 'none'}
      stroke={filled ? 'none' : color}
      strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"
    >
      {paths[tipo] ?? (
        <>
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 6v6l4 2"/>
        </>
      )}
    </svg>
  );
}

// ── StatCard ─────────────────────────────────────────────────────

function StatCard({ label, value, type }: { label: string; value: number; type: 'pos' | 'neg' }) {
  const isNeg = type === 'neg';
  return (
    <div style={{
      flex: 1,
      background: 'linear-gradient(180deg, rgba(99,102,241,0.10), rgba(99,102,241,0.04))',
      border: '1px solid rgba(99,102,241,0.20)',
      borderRadius: 22, padding: 18,
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: -20, right: -20,
        width: 90, height: 90,
        background: `radial-gradient(circle, ${isNeg ? 'rgba(248,113,113,0.25)' : 'rgba(99,102,241,0.30)'} 0%, transparent 65%)`,
        pointerEvents: 'none',
      }}/>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
        <div style={{
          fontFamily: 'var(--font-bebas), "Bebas Neue", sans-serif',
          fontSize: 11, letterSpacing: '0.24em', color: '#8a8aa3',
        }}>
          {label}
        </div>
        <div style={{
          width: 24, height: 24, borderRadius: 8,
          background: isNeg ? 'rgba(248,113,113,0.12)' : 'rgba(99,102,241,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: isNeg ? '#F87171' : '#818CF8',
        }}>
          {isNeg ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 10l5 5 5-5"/>
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 14l5-5 5 5"/>
            </svg>
          )}
        </div>
      </div>
      <div style={{
        fontFamily: 'var(--font-bebas), "Bebas Neue", sans-serif',
        fontSize: 34, lineHeight: 1.1, marginTop: 6,
        color: isNeg ? '#F87171' : '#4ADE80',
        textShadow: isNeg ? '0 0 16px rgba(248,113,113,0.3)' : '0 0 16px rgba(74,222,128,0.3)',
        letterSpacing: '0.02em',
      }}>
        {isNeg ? '−' : '+'}{Math.abs(value).toLocaleString('es-CL')}
      </div>
      <div style={{ fontSize: 11, color: '#5b5b75', marginTop: 1, letterSpacing: '0.08em' }}>PTS</div>
    </div>
  );
}

// ── TxRow ────────────────────────────────────────────────────────

function TxRow({ tx, onTap }: { tx: Transaccion; onTap: (t: Transaccion) => void }) {
  const positive = tx.puntos > 0;
  return (
    <div
      onClick={() => onTap(tx)}
      style={{
        display: 'flex', alignItems: 'center', gap: 11,
        padding: '12px 0',
        borderBottom: '0.5px solid rgba(255,255,255,0.05)',
        cursor: 'pointer',
      }}
    >
      <div style={{
        width: 38, height: 38, borderRadius: 11,
        background: 'rgba(99,102,241,0.08)',
        border: '1px solid rgba(99,102,241,0.18)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <TxIcon tipo={tx.tipo} size={18}/>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 14, fontWeight: 600, color: '#fff',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {tx.descripcion}
        </div>
        <div style={{ fontSize: 11, color: '#8a8aa3', marginTop: 2 }}>
          {formatDate(tx.created_at)}
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{
          fontFamily: 'var(--font-bebas), "Bebas Neue", sans-serif',
          fontSize: 18, lineHeight: 1,
          color: positive ? '#4ADE80' : '#F87171',
          letterSpacing: '0.02em',
        }}>
          {positive ? '+' : ''}{tx.puntos}
        </div>
        <div style={{ fontSize: 10, color: '#5b5b75', marginTop: 2, letterSpacing: '0.08em' }}>pts</div>
      </div>
    </div>
  );
}

// ── TxDetailModal ─────────────────────────────────────────────────

function TxDetailModal({
  tx, onClose, balanceAfter,
}: {
  tx: Transaccion; onClose: () => void; balanceAfter: number;
}) {
  const positive = tx.puntos > 0;
  const color = positive ? '#4ADE80' : '#F87171';
  const date = new Date(tx.created_at);
  const dateStr = date.toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' });
  const timeStr = date.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });

  const rows: [string, string][] = [
    ['Fecha', `${dateStr} · ${timeStr}`],
    ['Saldo final', `${balanceAfter.toLocaleString('es-CL')} pts`],
    ['ID', tx.id.toUpperCase()],
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(5,5,12,0.7)',
        backdropFilter: 'blur(8px) saturate(140%)',
        WebkitBackdropFilter: 'blur(8px) saturate(140%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20, zIndex: 100,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.94 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 320,
          background: 'linear-gradient(180deg, #15151f 0%, #0e0e18 100%)',
          border: '1px solid rgba(99,102,241,0.25)',
          borderRadius: 24, padding: 24,
          boxShadow: '0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(99,102,241,0.08), inset 0 1px 0 rgba(255,255,255,0.05)',
          display: 'flex', flexDirection: 'column',
        }}
      >
        {/* icon */}
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
          <div style={{
            position: 'absolute', inset: '-16px',
            background: `radial-gradient(circle, ${positive ? 'rgba(74,222,128,0.28)' : 'rgba(248,113,113,0.28)'}, transparent 65%)`,
            pointerEvents: 'none',
          }}/>
          <div style={{
            width: 60, height: 60, borderRadius: 16,
            background: 'rgba(99,102,241,0.12)',
            border: `1px solid ${positive ? 'rgba(74,222,128,0.4)' : 'rgba(248,113,113,0.4)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative',
            boxShadow: `inset 0 0 18px ${positive ? 'rgba(74,222,128,0.10)' : 'rgba(248,113,113,0.10)'}`,
          }}>
            <TxIcon tipo={tx.tipo} size={26}/>
          </div>
        </div>

        <h2 style={{
          fontFamily: 'var(--font-bebas), "Bebas Neue", sans-serif',
          fontSize: 22, textAlign: 'center', margin: '0 0 4px',
          letterSpacing: '0.04em', color: '#fff',
        }}>
          {tx.descripcion}
        </h2>
        <p style={{ fontSize: 13, color: '#8a8aa3', textAlign: 'center', margin: 0 }}>
          {dateStr}
        </p>

        {/* points highlight */}
        <div style={{
          marginTop: 16, padding: '14px 18px', borderRadius: 14,
          background: positive ? 'rgba(74,222,128,0.08)' : 'rgba(248,113,113,0.08)',
          border: `1.5px solid ${positive ? 'rgba(74,222,128,0.4)' : 'rgba(248,113,113,0.4)'}`,
          textAlign: 'center',
        }}>
          <div style={{
            fontFamily: 'var(--font-bebas), "Bebas Neue", sans-serif',
            fontSize: 42, lineHeight: 1, color,
            textShadow: `0 0 18px ${color}55`,
            letterSpacing: '0.04em',
          }}>
            {positive ? '+' : ''}{tx.puntos}
          </div>
          <div style={{ fontSize: 11, color: '#8a8aa3', marginTop: 4, letterSpacing: '0.08em' }}>
            PUNTOS {positive ? 'GANADOS' : 'USADOS'}
          </div>
        </div>

        {/* meta rows */}
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column' }}>
          {rows.map(([k, v], i) => (
            <div key={k} style={{
              display: 'flex', justifyContent: 'space-between',
              padding: '10px 4px',
              borderBottom: i < rows.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              fontSize: 13,
            }}>
              <span style={{ color: '#8a8aa3' }}>{k}</span>
              <span style={{
                color: k === 'ID' ? '#5b5b75' : '#fff',
                fontFamily: k === 'ID' ? 'monospace' : 'inherit',
                fontWeight: k === 'ID' ? 400 : 500,
              }}>
                {v}
              </span>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          style={{
            alignSelf: 'center', marginTop: 16,
            padding: '12px 36px', borderRadius: 100,
            background: '#fff', color: '#0a0a14',
            fontSize: 15, fontWeight: 600,
            border: 'none', cursor: 'pointer',
          }}
        >
          Cerrar
        </button>
      </motion.div>
    </motion.div>
  );
}

// ── EmptyState ───────────────────────────────────────────────────

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ padding: '60px 24px', textAlign: 'center' }}
    >
      <div style={{
        width: 72, height: 72, borderRadius: 20,
        background: 'rgba(99,102,241,0.08)',
        border: '1px solid rgba(99,102,241,0.22)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        color: '#818CF8', marginBottom: 16,
      }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 6v6l4 2"/>
        </svg>
      </div>
      <h3 style={{
        fontFamily: 'var(--font-bebas), "Bebas Neue", sans-serif',
        fontSize: 22, margin: '0 0 6px',
        letterSpacing: '0.04em', color: '#fff',
      }}>
        SIN MOVIMIENTOS AÚN
      </h3>
      <p style={{
        fontSize: 13, color: '#8a8aa3', margin: 0,
        lineHeight: 1.6, maxWidth: 280, marginInline: 'auto',
      }}>
        Cuando hagas tu primera compra o canjees un premio, aparecerá aquí
      </p>
    </motion.div>
  );
}

// ── Skeleton ─────────────────────────────────────────────────────

function Sk({ w, h, r = 8 }: { w: number | string; h: number; r?: number }) {
  return <div style={{ width: w, height: h, background: '#1a1a1a', borderRadius: r, flexShrink: 0 }} />;
}

// ── Filters ──────────────────────────────────────────────────────

const FILTERS = [
  { id: 'todos', label: 'Todos' },
  { id: 'pos',   label: 'Ganados' },
  { id: 'neg',   label: 'Usados' },
  { id: 'bono',  label: 'Bonus' },
] as const;

type FilterId = typeof FILTERS[number]['id'];

// ── Main ─────────────────────────────────────────────────────────

export default function HistorialPage() {
  const router = useRouter();
  const [transacciones, setTransacciones] = useState<Transaccion[]>([]);
  const [loading, setLoading]             = useState(true);
  const [filter, setFilter]               = useState<FilterId>('todos');
  const [selected, setSelected]           = useState<Transaccion | null>(null);

  useEffect(() => {
    const userId = localStorage.getItem('cfiel_user_id');
    if (!userId) { router.replace('/'); return; }
    fetch(`/api/usuarios/${userId}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.transacciones) setTransacciones(data.transacciones); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [router]);

  const ganados = useMemo(
    () => transacciones.filter(t => t.puntos > 0).reduce((s, t) => s + t.puntos, 0),
    [transacciones],
  );
  const usados = useMemo(
    () => transacciones.filter(t => t.puntos < 0).reduce((s, t) => s + Math.abs(t.puntos), 0),
    [transacciones],
  );

  const filtradas = useMemo(() => transacciones.filter(t => {
    if (filter === 'todos') return true;
    if (filter === 'pos')   return t.puntos > 0;
    if (filter === 'neg')   return t.puntos < 0;
    if (filter === 'bono')  return isBono(t.tipo);
    return true;
  }), [transacciones, filter]);

  const counts = useMemo(() => ({
    todos: transacciones.length,
    pos:   transacciones.filter(t => t.puntos > 0).length,
    neg:   transacciones.filter(t => t.puntos < 0).length,
    bono:  transacciones.filter(t => isBono(t.tipo)).length,
  }), [transacciones]);

  // running balance: oldest → newest accumulation
  const balances = useMemo(() => {
    const b: Record<string, number> = {};
    let running = 0;
    for (let i = transacciones.length - 1; i >= 0; i--) {
      running += transacciones[i].puntos;
      b[transacciones[i].id] = running;
    }
    return b;
  }, [transacciones]);

  const grupos = useMemo(() => groupByMonth(filtradas), [filtradas]);

  if (loading) {
    return (
      <div style={{ background: '#0a0a14', minHeight: '100dvh', maxWidth: 430, margin: '0 auto' }}>
        <div style={{ padding: '16px 20px 90px' }}>
          <Sk w={150} h={36} r={8}/>
          <div style={{ height: 8 }}/>
          <Sk w={200} h={13} r={6}/>
          <div style={{ height: 16 }}/>
          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            <Sk w="50%" h={88} r={22}/>
            <Sk w="50%" h={88} r={22}/>
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            {[80, 80, 75, 70].map((w, i) => <Sk key={i} w={w} h={32} r={100}/>)}
          </div>
          {[0, 1, 2, 3, 4].map(i => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 11,
              padding: '12px 0', borderBottom: '0.5px solid rgba(255,255,255,0.05)',
            }}>
              <Sk w={38} h={38} r={11}/>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <Sk w="70%" h={12}/>
                <Sk w="40%" h={10}/>
              </div>
              <Sk w={40} h={18}/>
            </div>
          ))}
        </div>
        <BottomNav/>
      </div>
    );
  }

  return (
    <>
      <div style={{
        background: '#0a0a14', minHeight: '100dvh', maxWidth: 430,
        margin: '0 auto', display: 'flex', flexDirection: 'column',
        position: 'relative', overflow: 'hidden',
        fontFamily: 'var(--font-dm-sans), "DM Sans", system-ui, sans-serif',
        color: '#fff', WebkitFontSmoothing: 'antialiased',
      }}>
        {/* ambient glow */}
        <div style={{
          position: 'absolute', top: -120, left: '50%', transform: 'translateX(-50%)',
          width: 600, height: 500,
          background: 'radial-gradient(circle, rgba(99,102,241,0.10) 0%, transparent 60%)',
          pointerEvents: 'none', zIndex: 0,
        }}/>

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ padding: '16px 20px 12px', flexShrink: 0, position: 'relative', zIndex: 1 }}
        >
          <h1 style={{
            fontFamily: 'var(--font-bebas), "Bebas Neue", sans-serif',
            fontSize: 38, margin: 0, lineHeight: 1,
            letterSpacing: '0.03em', color: '#fff',
          }}>
            HISTORIAL
          </h1>
          <p style={{ fontSize: 13, color: '#8a8aa3', margin: '4px 0 16px' }}>
            Tus movimientos de puntos
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            <StatCard label="GANADOS" value={ganados} type="pos"/>
            <StatCard label="USADOS"  value={usados}  type="neg"/>
          </div>
        </motion.div>

        {/* ── Filters ── */}
        <div style={{
          display: 'flex', gap: 8, padding: '0 20px 10px',
          overflowX: 'auto', flexShrink: 0, position: 'relative', zIndex: 1,
        }}>
          {FILTERS.map(f => {
            const active = filter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '7px 14px', borderRadius: 100, flexShrink: 0,
                  border: active ? '1px solid #818CF8' : '1px solid rgba(99,102,241,0.22)',
                  background: active
                    ? 'linear-gradient(135deg, #6366F1, #4F46E5)'
                    : 'rgba(99,102,241,0.06)',
                  color: active ? '#fff' : '#8a8aa3',
                  fontSize: 13, fontWeight: 600,
                  cursor: 'pointer', whiteSpace: 'nowrap',
                  boxShadow: active ? '0 2px 12px rgba(99,102,241,0.3)' : 'none',
                }}
              >
                {f.label}
                <span style={{
                  fontSize: 11, borderRadius: 100, padding: '1px 6px',
                  background: active ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)',
                  color: active ? 'rgba(255,255,255,0.9)' : '#5b5b75',
                }}>
                  {counts[f.id]}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── List ── */}
        <div style={{
          flex: 1, overflowY: 'auto', overflowX: 'hidden',
          padding: '0 20px 100px', position: 'relative', zIndex: 1,
        }}>
          {filtradas.length === 0 ? (
            <EmptyState/>
          ) : (
            grupos.map(([key, list]) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
              >
                <div style={{
                  fontSize: 11, fontWeight: 600,
                  letterSpacing: '0.18em', color: '#8a8aa3',
                  textTransform: 'uppercase',
                  margin: '24px 4px 10px',
                }}>
                  {key}
                </div>
                <div style={{
                  background: 'linear-gradient(180deg, rgba(99,102,241,0.10), rgba(99,102,241,0.04))',
                  border: '1px solid rgba(99,102,241,0.20)',
                  borderRadius: 22, padding: '4px 14px',
                }}>
                  {list.map(tx => (
                    <TxRow key={tx.id} tx={tx} onTap={setSelected}/>
                  ))}
                </div>
              </motion.div>
            ))
          )}
          <div style={{ height: 12 }}/>
        </div>

        <BottomNav/>

        <AnimatePresence>
          {selected && (
            <TxDetailModal
              key="detail"
              tx={selected}
              onClose={() => setSelected(null)}
              balanceAfter={balances[selected.id] ?? 0}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
