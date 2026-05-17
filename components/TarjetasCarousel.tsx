'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PanInfo } from 'framer-motion';

interface Tarjeta {
  empresa: string;
  puntos: number;
  nivel: 'bronce' | 'plata' | 'oro' | 'platino';
  progreso: number;
  mensaje?: string;
}

interface Props {
  puntos: number;
  nivel: 'bronce' | 'plata' | 'oro' | 'platino';
  progreso: number;
  empresa?: string;
  onQROpen: () => void;
}

const NIVEL_META: Record<string, { label: string; color: string; next: string }> = {
  bronce:  { label: 'BRONCE',  color: '#CD8B4A', next: 'Plata'   },
  plata:   { label: 'PLATA',   color: '#A8B8C0', next: 'Oro'     },
  oro:     { label: 'ORO',     color: '#D4A847', next: 'Platino' },
  platino: { label: 'PLATINO', color: '#8ECFEF', next: ''        },
};

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0.5 }),
  center: { x: 0, opacity: 1 },
  exit:  (dir: number) => ({ x: dir > 0 ? '-80%' : '80%', opacity: 0 }),
};

function TarjetaCard({
  tarjeta, showHint, onTap,
}: {
  tarjeta: Tarjeta;
  showHint?: boolean;
  onTap: () => void;
}) {
  const [barW, setBarW] = useState(0);
  const meta    = NIVEL_META[tarjeta.nivel] ?? NIVEL_META.bronce;
  const inicial = tarjeta.empresa.charAt(0).toUpperCase();

  useEffect(() => {
    const t = setTimeout(() => setBarW(tarjeta.progreso), 200);
    return () => clearTimeout(t);
  }, [tarjeta.progreso]);

  return (
    <motion.div
      onTap={() => onTap()}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.12 }}
      style={{
        background: '#141414',
        borderRadius: 32,
        border: `1px solid ${meta.color}55`,
        padding: '18px 20px 16px',
        position: 'relative',
        overflow: 'hidden',
        userSelect: 'none',
        cursor: 'pointer',
      }}
    >
      {/* Glow */}
      <div style={{
        position: 'absolute', top: -40, right: -40,
        width: 160, height: 160,
        background: `radial-gradient(circle, ${meta.color}20, transparent 68%)`,
        borderRadius: '50%', pointerEvents: 'none',
      }} />

      {/* Empresa header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <div style={{
          width: 40, height: 40,
          background: `${meta.color}20`,
          border: `1.5px solid ${meta.color}55`,
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, fontWeight: 700, color: meta.color, flexShrink: 0,
        }}>
          {inicial}
        </div>
        <div>
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: '1px', textTransform: 'uppercase' }}>
            Programa fidelidad
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', letterSpacing: -0.3 }}>
            {tarjeta.empresa}
          </div>
        </div>
      </div>

      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)', letterSpacing: '1.4px', textTransform: 'uppercase', marginBottom: 2 }}>
        Puntos acumulados
      </div>

      <div style={{
        fontFamily: 'var(--font-bebas), "Bebas Neue", sans-serif',
        fontSize: 64, color: '#fff', lineHeight: 1,
        letterSpacing: -2, marginBottom: tarjeta.mensaje ? 6 : 12,
      }}>
        {tarjeta.puntos.toLocaleString('es-CL')}
      </div>

      {tarjeta.mensaje && (
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 10 }}>
          {tarjeta.mensaje}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          background: `${meta.color}18`, border: `0.5px solid ${meta.color}45`,
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
          borderRadius: 5, width: `${barW}%`,
          transition: 'width 1.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }} />
      </div>

      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)', marginTop: 6 }}>
        Progreso al siguiente nivel:{' '}
        <span style={{ color: meta.color, fontWeight: 600 }}>{tarjeta.progreso}%</span>
      </div>

      {/* Hint sutil solo en la primera tarjeta */}
      {showHint && (
        <div style={{
          marginTop: 10,
          fontSize: 10,
          color: 'rgba(255,255,255,0.2)',
          textAlign: 'center',
          letterSpacing: '0.3px',
        }}>
          Toca para ver tu QR
        </div>
      )}
    </motion.div>
  );
}

export default function TarjetasCarousel({ puntos, nivel, progreso, empresa = 'Tío Polo', onQROpen }: Props) {
  const tarjetas: Tarjeta[] = [
    { empresa, puntos, nivel, progreso },
    { empresa: 'Bot. Matías', puntos: 0, nivel: 'bronce', progreso: 0, mensaje: 'Aún no has comprado aquí' },
  ];

  const [active, setActive]       = useState(0);
  const [dir, setDir]             = useState(0);
  const [showToast, setShowToast] = useState(false);

  const goTo = (index: number) => {
    if (index === active || index < 0 || index >= tarjetas.length) return;
    setDir(index > active ? 1 : -1);
    setActive(index);
  };

  /* Solo maneja swipe — el tap lo detecta onTap en cada TarjetaCard */
  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -40) goTo(active + 1);
    else if (info.offset.x > 40) goTo(active - 1);
  };

  const handleTap = () => {
    if (active === 0) {
      onQROpen();
    } else {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }
  };

  return (
    <div style={{ marginBottom: 12 }}>
      {/* Viewport — el drag vive aquí para el swipe */}
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
            {/* El onTap y whileTap viven en la tarjeta individual */}
            <TarjetaCard
              tarjeta={tarjetas[active]}
              showHint={active === 0}
              onTap={handleTap}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots */}
      {tarjetas.length > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 5, marginTop: 9 }}>
          {tarjetas.map((_, i) => (
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

      {/* Toast para la segunda tarjeta */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ textAlign: 'center', marginTop: 8 }}
          >
            <span style={{
              fontSize: 12,
              color: 'rgba(255,255,255,0.5)',
              padding: '5px 14px',
              background: '#1a1a1a',
              borderRadius: 20,
              border: '0.5px solid rgba(255,255,255,0.1)',
            }}>
              Aún no has comprado aquí
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
