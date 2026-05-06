'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import BottomNav from '@/components/BottomNav';
import CanjeModal from '@/components/CanjeModal';

type Category = 'todos' | 'bebidas' | 'descuentos' | 'packs';

interface Reward {
  emoji: string;
  nombre: string;
  desc: string;
  pts: number;
  cat: Category;
  badge: string | null;
  locked: boolean;
  platinoOnly?: boolean;
}

const REWARDS: Reward[] = [
  {
    emoji: '🍺', nombre: 'Cerveza gratis',
    desc: 'Una cerveza premium de la casa',
    pts: 800, cat: 'bebidas', badge: 'HOY 2×', locked: false,
  },
  {
    emoji: '💸', nombre: 'Descuento $3.000',
    desc: 'En tu próxima compra, sin mínimo',
    pts: 600, cat: 'descuentos', badge: null, locked: false,
  },
  {
    emoji: '🎁', nombre: 'Pack Fin de Semana',
    desc: '6 cervezas + snacks seleccionados',
    pts: 1500, cat: 'packs', badge: null, locked: false,
  },
  {
    emoji: '🥃', nombre: 'Botella Premium',
    desc: 'Whisky o pisco de la casa',
    pts: 3000, cat: 'bebidas', badge: null, locked: true,
  },
  {
    emoji: '👑', nombre: 'Descuento $10.000',
    desc: 'Exclusivo nivel Platino',
    pts: 5000, cat: 'descuentos', badge: null, locked: true, platinoOnly: true,
  },
];

const CATS: { id: Category; label: string }[] = [
  { id: 'todos',      label: 'Todos'      },
  { id: 'bebidas',    label: 'Bebidas'    },
  { id: 'descuentos', label: 'Descuentos' },
  { id: 'packs',      label: 'Packs'      },
];

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.4 },
});

export default function BeneficiosPage() {
  const [cat, setCat]     = useState<Category>('todos');
  const [canje, setCanje] = useState<Reward | null>(null);

  const visible = REWARDS.filter((r) => cat === 'todos' || r.cat === cat);

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100dvh', maxWidth: 430, margin: '0 auto' }}>
      <div style={{ padding: '16px 16px 90px' }}>

        {/* ── Header ── */}
        <motion.div {...fadeUp(0.05)} style={{ marginBottom: 14 }}>
          <div style={{
            fontFamily: 'var(--font-bebas), "Bebas Neue", sans-serif',
            fontSize: 30, color: '#fff', letterSpacing: 1, marginBottom: 3,
          }}>
            Beneficios
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', marginBottom: 8 }}>
            Canjea tus puntos por premios reales
          </div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            background: 'rgba(212,168,71,0.12)',
            border: '0.5px solid rgba(212,168,71,0.28)',
            borderRadius: 20, padding: '4px 12px',
            fontSize: 11, color: '#F0C96A', fontWeight: 500,
          }}>
            ⭐ 1.207 pts disponibles
          </div>
        </motion.div>

        {/* ── Tabs de categoría ── */}
        <motion.div
          {...fadeUp(0.1)}
          style={{ display: 'flex', gap: 7, marginBottom: 14, overflowX: 'auto' }}
        >
          {CATS.map(({ id, label }) => {
            const active = id === cat;
            return (
              <button
                key={id}
                onClick={() => setCat(id)}
                style={{
                  padding: '7px 15px',
                  borderRadius: 20,
                  fontSize: 12,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  fontFamily: 'inherit',
                  border: `0.5px solid ${active ? '#fff' : 'rgba(255,255,255,0.07)'}`,
                  background: active ? '#fff' : 'transparent',
                  color: active ? '#0a0a0a' : 'rgba(255,255,255,0.55)',
                  fontWeight: active ? 600 : 500,
                  transition: 'all 0.2s',
                }}
              >
                {label}
              </button>
            );
          })}
        </motion.div>

        {/* ── Reward cards ── */}
        {visible.map((r, i) => (
          <motion.div
            key={r.nombre}
            {...fadeUp(0.12 + i * 0.07)}
            style={{
              background: '#141414',
              borderRadius: 32,
              border: '0.5px solid rgba(255,255,255,0.07)',
              overflow: 'hidden',
              marginBottom: 10,
              opacity: r.locked ? 0.5 : 1,
              position: 'relative',
            }}
          >
            {/* Badge HOY 2× */}
            {r.badge && (
              <div style={{
                position: 'absolute', top: 12, right: 12,
                background: '#D4A847', color: '#000',
                fontSize: 9, fontWeight: 800,
                padding: '2px 7px', borderRadius: 10,
                letterSpacing: '0.5px', zIndex: 1,
              }}>
                {r.badge}
              </div>
            )}

            {/* Parte superior: bg #1a1a1a */}
            <div style={{
              background: '#1a1a1a',
              padding: 16,
              display: 'flex', alignItems: 'center', gap: 13,
              borderBottom: '0.5px solid rgba(255,255,255,0.07)',
            }}>
              <div style={{
                width: 48, height: 48,
                background: '#222222', borderRadius: 14,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 23, flexShrink: 0,
              }}>
                {r.emoji}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 2 }}>
                  {r.nombre}
                </div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)' }}>{r.desc}</div>
              </div>
              {r.locked && <div style={{ fontSize: 18, opacity: 0.5 }}>🔒</div>}
            </div>

            {/* Parte inferior: puntos + botón */}
            <div style={{
              padding: '12px 15px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: r.locked ? 'rgba(255,255,255,0.28)' : '#D4A847',
                }} />
                <div style={{
                  fontSize: 15, fontWeight: 700,
                  color: r.locked ? 'rgba(255,255,255,0.28)' : '#F0C96A',
                }}>
                  {r.pts.toLocaleString('es-CL')}
                </div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)' }}>pts</div>
              </div>

              <button
                disabled={r.locked}
                onClick={() => !r.locked && setCanje(r)}
                style={{
                  background: r.locked ? '#222222' : '#fff',
                  color: r.locked ? 'rgba(255,255,255,0.28)' : '#0a0a0a',
                  border: r.locked ? '0.5px solid rgba(255,255,255,0.07)' : 'none',
                  borderRadius: 20, padding: '8px 18px',
                  fontSize: 12, fontWeight: 700,
                  cursor: r.locked ? 'not-allowed' : 'pointer',
                  fontFamily: 'inherit',
                  transition: 'transform 0.15s',
                }}
              >
                {r.locked ? (r.platinoOnly ? 'Platino' : 'Bloqueado') : 'Canjear'}
              </button>
            </div>
          </motion.div>
        ))}

      </div>

      {/* ── Canje modal ── */}
      <CanjeModal
        open={!!canje}
        onClose={() => setCanje(null)}
        nombre={canje?.nombre ?? ''}
        puntos={canje?.pts ?? 0}
      />

      <BottomNav />
    </div>
  );
}
