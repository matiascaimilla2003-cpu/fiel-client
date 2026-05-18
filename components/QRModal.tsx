'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';

const NIVEL_LABEL: Record<string, string> = {
  bronce: 'BRONCE', plata: 'PLATA', oro: 'ORO', platino: 'PLATINO',
};
const TIER_COLOR: Record<string, string> = {
  bronce: '#B07A4A', plata: '#B0B5C5', oro: '#F5C16C', platino: '#C7D2FE',
};
const TIER_BG: Record<string, string> = {
  bronce: 'rgba(176,122,74,0.12)', plata: 'rgba(176,181,197,0.12)',
  oro: 'rgba(245,193,108,0.12)',   platino: 'rgba(199,210,254,0.12)',
};

type CornerKey = 'TL' | 'TR' | 'BL' | 'BR';

function cornerStyle(c: CornerKey): React.CSSProperties {
  return {
    position: 'absolute',
    width: 22, height: 22,
    left:   (c === 'TL' || c === 'BL') ? -10 : undefined,
    right:  (c === 'TR' || c === 'BR') ? -10 : undefined,
    top:    (c === 'TL' || c === 'TR') ? -10 : undefined,
    bottom: (c === 'BL' || c === 'BR') ? -10 : undefined,
    borderRadius: 6,
    borderTop:    (c === 'TL' || c === 'TR') ? '2.5px solid #6366F1' : 'none',
    borderBottom: (c === 'BL' || c === 'BR') ? '2.5px solid #6366F1' : 'none',
    borderLeft:   (c === 'TL' || c === 'BL') ? '2.5px solid #6366F1' : 'none',
    borderRight:  (c === 'TR' || c === 'BR') ? '2.5px solid #6366F1' : 'none',
    boxShadow: '0 0 12px rgba(99,102,241,0.5)',
  };
}

interface Props {
  open: boolean;
  onClose: () => void;
  userName?: string;
  userLevel?: string;
}

export default function QRModal({ open, onClose, userName, userLevel }: Props) {
  const [userId, setUserId] = useState('');

  useEffect(() => {
    setUserId(localStorage.getItem('cfiel_user_id') ?? '');
  }, [open]);

  const levelKey    = (userLevel ?? '').toLowerCase();
  const displayName = (userName ?? 'USUARIO').toUpperCase();
  const tierColor   = TIER_COLOR[levelKey] ?? '#F5C16C';
  const tierBg      = TIER_BG[levelKey]    ?? 'rgba(245,193,108,0.12)';
  const tierLabel   = NIVEL_LABEL[levelKey] ?? (userLevel ?? '').toUpperCase();
  const cfielCode   = userId ? `CFIEL-${userId.slice(0, 6).toUpperCase()}` : '————————';

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
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
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: 360,
              background: 'linear-gradient(180deg, #15151f 0%, #0e0e18 100%)',
              border: '1px solid rgba(99,102,241,0.25)',
              borderRadius: 24, padding: 24,
              boxShadow: '0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(99,102,241,0.08), inset 0 1px 0 rgba(255,255,255,0.05)',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
            }}
          >
            <div style={{
              fontFamily: 'var(--font-bebas), "Bebas Neue", sans-serif',
              fontSize: 11, letterSpacing: '0.32em', color: '#8a8aa3',
            }}>
              TU QR PERSONAL
            </div>

            <div style={{
              fontFamily: 'var(--font-bebas), "Bebas Neue", sans-serif',
              fontSize: 34, marginTop: 4, marginBottom: 14,
              background: 'linear-gradient(180deg, #fff, #818CF8)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              letterSpacing: '0.04em',
            }}>
              {displayName}
            </div>

            {/* QR with corner brackets */}
            <div style={{ position: 'relative' }}>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                style={{
                  padding: 14, borderRadius: 18, background: '#fff',
                  boxShadow: '0 12px 40px rgba(99,102,241,0.4), 0 0 0 1px rgba(99,102,241,0.3)',
                }}
              >
                {userId ? (
                  <QRCodeSVG
                    value={userId}
                    size={150}
                    bgColor="#ffffff"
                    fgColor="#000000"
                    level="M"
                  />
                ) : (
                  <div style={{
                    width: 150, height: 150,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#aaa', fontSize: 12,
                  }}>
                    Cargando...
                  </div>
                )}
              </motion.div>
              {(['TL', 'TR', 'BL', 'BR'] as CornerKey[]).map(c => (
                <div key={c} style={cornerStyle(c)}/>
              ))}
            </div>

            {/* meta row */}
            <div style={{
              marginTop: 18, width: '100%',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '0 4px',
            }}>
              <div>
                <div style={{
                  fontFamily: 'var(--font-bebas), "Bebas Neue", sans-serif',
                  fontSize: 10, letterSpacing: '0.2em', color: '#5b5b75',
                }}>
                  ID
                </div>
                <div style={{ fontSize: 13, fontFamily: 'monospace', color: '#fff', marginTop: 2 }}>
                  {cfielCode}
                </div>
              </div>
              {tierLabel && (
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  padding: '5px 10px', borderRadius: 100,
                  background: tierBg,
                  border: `1px solid ${tierColor}66`,
                  fontFamily: 'var(--font-bebas), "Bebas Neue", sans-serif',
                  fontSize: 12, letterSpacing: '0.16em',
                  color: tierColor,
                }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zM5 18h14v2H5z"/>
                  </svg>
                  NIVEL {tierLabel}
                </div>
              )}
            </div>

            <p style={{ fontSize: 13, color: '#8a8aa3', textAlign: 'center', margin: '14px 0 0', lineHeight: 1.5 }}>
              Muéstralo en caja para sumar puntos a cada compra
            </p>

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
      )}
    </AnimatePresence>
  );
}
