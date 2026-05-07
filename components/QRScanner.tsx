'use client';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { Html5Qrcode as Html5QrcodeType } from 'html5-qrcode';

interface Props {
  onScan: (result: string) => void;
  onCancel: () => void;
}

const SCANNER_ID = 'cfiel-qr-scanner';

function Corner({
  style,
}: {
  style: React.CSSProperties;
}) {
  return <div style={{ position: 'absolute', width: 28, height: 28, ...style }} />;
}

export default function QRScanner({ onScan, onCancel }: Props) {
  const stopped = useRef(false);
  const scannerRef = useRef<Html5QrcodeType | null>(null);
  const [permError, setPermError] = useState(false);

  useEffect(() => {
    stopped.current = false;

    import('html5-qrcode')
      .then(({ Html5Qrcode }) => {
        if (stopped.current) return;
        const scanner = new Html5Qrcode(SCANNER_ID);
        scannerRef.current = scanner;

        scanner
          .start(
            { facingMode: 'environment' },
            { fps: 10, qrbox: { width: 240, height: 240 } },
            (decoded: string) => {
              if (stopped.current) return;
              stopped.current = true;
              scanner
                .stop()
                .catch(() => {})
                .finally(() => {
                  try {
                    onScan(decoded);
                  } catch (err) {
                    console.error('[QRScanner] onScan lanzó un error:', err);
                  }
                });
            },
            () => {},
          )
          .catch(() => {
            if (!stopped.current) setPermError(true);
          });
      })
      .catch((err) => {
        console.error('[QRScanner] No se pudo cargar html5-qrcode:', err);
        if (!stopped.current) setPermError(true);
      });

    return () => {
      stopped.current = true;
      scannerRef.current?.stop().catch(() => {});
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCancel = () => {
    stopped.current = true;
    (scannerRef.current?.stop() ?? Promise.resolve())
      .catch(() => {})
      .finally(() => onCancel());
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{
        position: 'fixed', inset: 0, background: '#000', zIndex: 100,
        display: 'flex', flexDirection: 'column',
        fontFamily: 'inherit',
      }}
    >
      {/* Top bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
        padding: '52px 20px 20px',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.85), transparent)',
        textAlign: 'center',
      }}>
        <div style={{ color: '#fff', fontSize: 16, fontWeight: 600 }}>
          Escanear QR del cliente
        </div>
        <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, marginTop: 4 }}>
          Apunta la cámara al código QR
        </div>
      </div>

      {permError ? (
        /* ── Permission denied ── */
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '0 32px', textAlign: 'center', gap: 16,
        }}>
          <div style={{ fontSize: 48 }}>📷</div>
          <div style={{ color: '#fff', fontSize: 16, fontWeight: 600 }}>
            Sin acceso a la cámara
          </div>
          <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, lineHeight: 1.5 }}>
            Permite el acceso a la cámara en la configuración del navegador y vuelve a intentarlo.
          </div>
        </div>
      ) : (
        <>
          {/* Camera feed */}
          <div id={SCANNER_ID} style={{ flex: 1, width: '100%' }} />

          {/* Animated corners overlay */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{ position: 'relative', width: 240, height: 240 }}>
              <Corner style={{ top: 0, left: 0, borderTop: '3px solid #D4A847', borderLeft: '3px solid #D4A847' }} />
              <Corner style={{ top: 0, right: 0, borderTop: '3px solid #D4A847', borderRight: '3px solid #D4A847' }} />
              <Corner style={{ bottom: 0, left: 0, borderBottom: '3px solid #D4A847', borderLeft: '3px solid #D4A847' }} />
              <Corner style={{ bottom: 0, right: 0, borderBottom: '3px solid #D4A847', borderRight: '3px solid #D4A847' }} />

              {/* Scan line */}
              <motion.div
                animate={{ y: [0, 218, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
                style={{
                  position: 'absolute', left: 4, right: 4, height: 2,
                  background: 'linear-gradient(90deg, transparent, #D4A847 30%, #F0C96A 50%, #D4A847 70%, transparent)',
                  boxShadow: '0 0 10px rgba(212,168,71,0.7)',
                }}
              />
            </div>
          </div>
        </>
      )}

      {/* Bottom bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10,
        padding: '20px 24px 48px',
        background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
        display: 'flex', justifyContent: 'center',
      }}>
        <button
          onClick={handleCancel}
          style={{
            background: 'rgba(255,255,255,0.12)',
            color: '#fff',
            border: '0.5px solid rgba(255,255,255,0.25)',
            borderRadius: 28,
            padding: '14px 52px',
            fontSize: 15, fontWeight: 600,
            cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          Cancelar
        </button>
      </div>

      <style>{`
        #${SCANNER_ID} video { object-fit: cover; }
        #${SCANNER_ID} img { display: none !important; }
      `}</style>
    </motion.div>
  );
}
