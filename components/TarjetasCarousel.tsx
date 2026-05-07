'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PanInfo } from 'framer-motion';

interface Tarjeta {
  empresa: string;
  puntos: number;
  nivel: 'bronce' | 'plata' | 'oro' | 'platino';
  progreso: number;
}

const TARJETAS: Tarjeta[] = [
  { empresa: 'Tío Polo',    puntos: 1207, nivel: 'oro',    progreso: 72 },
  { empresa: 'Bot. Matías', puntos:  340, nivel: 'bronce', progreso: 34 },
];

const NIVEL_META: Record<string, { label: string; color: string; next: string }> = {
  bronce:  { label: 'BRONCE',  color: '#CD8B4A', next: 'Plata'   },
  plata:   { label: 'PLATA',   color: '#A8B8C0', next: 'Oro'     },
  oro:     { label: 'ORO',     color: '#D4A847', next: 'Platino' },
  platino: { label: 'PLATINO', color: '#8ECFEF', next: ''        },
};

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0.5 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? '-80%' : '80%', opacity: 0 }),
};

function TarjetaCard({ tarjeta }: { tarjeta: Tarjeta }) {
  const [barW, setBarW] = useState(0);
  const meta = NIVEL_META[tarjeta.nivel] ?? NIVEL_META.bronce;
  const inicial = tarjeta.empresa.charAt(0).toUpperCase();

  useEffect(() => {
    const t = setTimeout(() => setBarW(tarjeta.progreso), 200);
    return () => clearTimeout(t);
  }, [tarjeta.progreso]);

  return (
    <div style={{
      background: '#141414',
      borderRadius: 32,
      border: `1px solid ${meta.color}55`,
      padding: '18px 20px 16px',
      position: 'relative',
      overflow: 'hidden',
      userSelect: 'none',
    }}>
      {/* Glow top-right */}
      <div style={{
        position: 'absolute', top: -40, right: -40,
        width: 160, height: 160,
        background: `radial-gradient(circle, ${meta.color}20, transparent 68%)`,
        borderRadius: '50%',
        pointerEvents: 'none',
      }} />

      {/* Empresa header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <div style={{
          width: 40, height: 40,
          background: `${meta.color}20`,
          border: `1.5px solid ${meta.color}55`,
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, fontWeight: 700, color: meta.color,
          flexShrink: 0,
        }}>
          {inicial}
        </div>
        <div>
          <div style={{
            fontSize: 9, color: 'rgba(255,255,255,0.4)',
            letterSpacing: '1px', textTransform: 'uppercase',
          }}>
            Programa fidelidad
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', letterSpacing: -0.3 }}>
            {tarjeta.empresa}
          </div>
        </div>
      </div>

      <div style={{
        fontSize: 10, color: 'rgba(255,255,255,0.28)',
        letterSpacing: '1.4px', textTransform: 'uppercase', marginBottom: 2,
      }}>
        Puntos acumulados
      </div>

      <div style={{
        fontFamily: 'var(--font-bebas), "Bebas Neue", sans-serif',
        fontSize: 64,
        color: '#fff',
        lineHeight: 1,
        letterSpacing: -2,
        marginBottom: 12,
      }}>
        {tarjeta.puntos.toLocaleString('es-CL')}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          background: `${meta.color}18`,
          border: `0.5px solid ${meta.color}45`,
          borderRadius: 20, padding: '3px 10px',
        }}>
          <span style={{ fontSize: 10 }}>⭐</span>
          <span style={{ fontSize: 10, fontWeight: 600, color: meta.color, letterSpacing: '0.5px' }}>
            NIVEL {meta.label}
          </span>
        </div>
        {meta.next && (
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)' }}>
            → {100 - tarjeta.progreso}% para {meta.next}
          </div>
        )}
      </div>

      {/* Barra de progreso */}
      <div style={{ height: 5, background: 'rgba(255,255,255,0.07)', borderRadius: 5, overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          background: `linear-gradient(90deg, ${meta.color}, ${meta.color}cc)`,
          borderRadius: 5,
          width: `${barW}%`,
          transition: 'width 1.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }} />
      </div>

      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)', marginTop: 6 }}>
        Progreso al siguiente nivel:{' '}
        <span style={{ color: meta.color, fontWeight: 600 }}>{tarjeta.progreso}%</span>
      </div>
    </div>
  );
}

export default function TarjetasCarousel() {
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState(0);

  const goTo = (index: number) => {
    if (index === active || index < 0 || index >= TARJETAS.length) return;
    setDir(index > active ? 1 : -1);
    setActive(index);
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -40) goTo(active + 1);
    else if (info.offset.x > 40) goTo(active - 1);
  };

  return (
    <div style={{ marginBottom: 12 }}>
      {/* Viewport */}
      <div style={{ overflow: 'hidden', borderRadius: 32 }}>
        <AnimatePresence initial={false} custom={dir} mode="wait">
          <motion.div
            key={active}
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 380, damping: 36 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.08}
            onDragEnd={handleDragEnd}
            style={{ cursor: 'grab' }}
          >
            <TarjetaCard tarjeta={TARJETAS[active]} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots indicadores */}
      {TARJETAS.length > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 5, marginTop: 9 }}>
          {TARJETAS.map((_, i) => (
            <motion.div
              key={i}
              onClick={() => goTo(i)}
              animate={{
                width: i === active ? 20 : 6,
                backgroundColor: i === active ? '#D4A847' : 'rgba(255,255,255,0.22)',
              }}
              transition={{ duration: 0.3 }}
              style={{ height: 6, borderRadius: 3, cursor: 'pointer' }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
