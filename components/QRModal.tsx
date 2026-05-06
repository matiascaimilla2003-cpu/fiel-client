'use client';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function QRModal({ open, onClose }: Props) {
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
              Carlos Morales
            </div>

            {/* QR SVG inline idéntico al HTML */}
            <div style={{
              background: '#fff', borderRadius: 16, padding: 18,
              display: 'inline-block', marginBottom: 14,
            }}>
              <svg viewBox="0 0 100 100" width={150} height={150} fill="black">
                <rect x="5" y="5" width="38" height="38" rx="4" fill="none" stroke="black" strokeWidth="5"/>
                <rect x="14" y="14" width="20" height="20"/>
                <rect x="57" y="5" width="38" height="38" rx="4" fill="none" stroke="black" strokeWidth="5"/>
                <rect x="66" y="14" width="20" height="20"/>
                <rect x="5" y="57" width="38" height="38" rx="4" fill="none" stroke="black" strokeWidth="5"/>
                <rect x="14" y="66" width="20" height="20"/>
                <rect x="57" y="57" width="12" height="12"/>
                <rect x="72" y="57" width="12" height="12"/>
                <rect x="57" y="72" width="12" height="12"/>
                <rect x="72" y="72" width="12" height="12"/>
                <rect x="87" y="57" width="8" height="8"/>
                <rect x="87" y="87" width="8" height="8"/>
                <rect x="57" y="87" width="8" height="8"/>
              </svg>
            </div>

            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', marginBottom: 5 }}>
              Cliente #00847 · Nivel ORO ⭐
            </div>
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
