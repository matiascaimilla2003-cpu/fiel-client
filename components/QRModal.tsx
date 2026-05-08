'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';

const NIVEL_EMOJI: Record<string, string> = {
  bronce: '🥉', plata: '🥈', oro: '⭐', platino: '👑',
};

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

  const levelKey = (userLevel ?? '').toLowerCase();
  const levelEmoji = NIVEL_EMOJI[levelKey] ?? '';
  const displayName = userName ?? 'Tu QR Personal';

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
            background: 'rgba(0,0,0,0.88)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 20, zIndex: 50,
          }}
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            transition={{ type: 'spring', damping: 22, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#141414',
              border: '0.5px solid rgba(255,255,255,0.13)',
              borderRadius: 32,
              padding: '28px 22px',
              width: '100%',
              maxWidth: 310,
              textAlign: 'center',
            }}
          >
            <div style={{
              fontSize: 10, letterSpacing: '1.5px',
              color: 'rgba(255,255,255,0.28)',
              textTransform: 'uppercase', marginBottom: 6,
            }}>
              Tu QR Personal
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 16 }}>
              {displayName}
            </div>

            {/* QR real */}
            <div style={{
              background: '#fff', borderRadius: 16, padding: 18,
              display: 'inline-block', marginBottom: 14,
            }}>
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
            </div>

            {userId && (
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.38)', marginTop: 8, fontFamily: 'monospace', letterSpacing: '0.5px' }}>
                ID: {userId.slice(0, 8)}
              </div>
            )}

            {userLevel && (
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', marginBottom: 5, marginTop: 12 }}>
                Nivel {userLevel} {levelEmoji}
              </div>
            )}
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', marginBottom: 18 }}>
              Muéstralo en caja para acumular puntos
            </div>

            <button
              onClick={onClose}
              style={{
                background: '#fff', color: '#0a0a0a', border: 'none',
                borderRadius: 20, padding: '12px 36px',
                fontSize: 14, fontWeight: 700,
                cursor: 'pointer', fontFamily: 'inherit',
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
