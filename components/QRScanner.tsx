'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface Props {
  onScan: (result: string) => void;
  onCancel: () => void;
}

function Corner({ style }: { style: React.CSSProperties }) {
  return <div style={{ position: 'absolute', width: 28, height: 28, ...style }} />;
}

export default function QRScanner({ onScan, onCancel }: Props) {
  const videoRef  = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef    = useRef<number | null>(null);
  const doneRef   = useRef(false);
  const [permError, setPermError] = useState(false);

  // Stable across renders — only touches refs
  const releaseCamera = useCallback(() => {
    doneRef.current = true;
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  useEffect(() => {
    doneRef.current = false;

    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } },
          audio: false,
        });

        if (doneRef.current) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamRef.current = stream;
        const video = videoRef.current;
        if (!video) { releaseCamera(); return; }

        video.srcObject = stream;
        await video.play();

        // Import once, then scan every frame
        const { default: jsQR } = await import('jsqr');
        if (doneRef.current) return;

        const tick = () => {
          if (doneRef.current) return;

          const canvas = canvasRef.current;
          const vid    = videoRef.current;

          if (!canvas || !vid || vid.readyState < HTMLMediaElement.HAVE_ENOUGH_DATA) {
            rafRef.current = requestAnimationFrame(tick);
            return;
          }

          const w = vid.videoWidth;
          const h = vid.videoHeight;
          if (!w || !h) {
            rafRef.current = requestAnimationFrame(tick);
            return;
          }

          canvas.width  = w;
          canvas.height = h;

          const ctx = canvas.getContext('2d', { willReadFrequently: true });
          if (!ctx) {
            rafRef.current = requestAnimationFrame(tick);
            return;
          }

          ctx.drawImage(vid, 0, 0, w, h);
          const img  = ctx.getImageData(0, 0, w, h);
          const code = jsQR(img.data, img.width, img.height, {
            inversionAttempts: 'dontInvert',
          });

          if (code?.data) {
            releaseCamera();
            try {
              onScan(code.data);
            } catch (e) {
              console.error('[QRScanner] onScan error:', e);
            }
          } else {
            rafRef.current = requestAnimationFrame(tick);
          }
        };

        rafRef.current = requestAnimationFrame(tick);
      } catch (e) {
        console.error('[QRScanner] Camera error:', e);
        if (!doneRef.current) setPermError(true);
      }
    })();

    return releaseCamera;
  }, [releaseCamera]);

  const handleCancel = () => {
    releaseCamera();
    onCancel();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{
        position: 'fixed',
        inset: 0,
        background: '#000',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
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
        /* ── Sin permiso de cámara ── */
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
          {/* Feed de cámara en vivo */}
          <video
            ref={videoRef}
            playsInline
            muted
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />

          {/* Canvas oculto — solo para procesamiento de frames */}
          <canvas ref={canvasRef} style={{ display: 'none' }} />

          {/* Overlay de apuntado */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{ position: 'relative', width: 240, height: 240 }}>
              <Corner style={{ top: 0, left: 0, borderTop: '3px solid #6366F1', borderLeft: '3px solid #6366F1' }} />
              <Corner style={{ top: 0, right: 0, borderTop: '3px solid #6366F1', borderRight: '3px solid #6366F1' }} />
              <Corner style={{ bottom: 0, left: 0, borderBottom: '3px solid #6366F1', borderLeft: '3px solid #6366F1' }} />
              <Corner style={{ bottom: 0, right: 0, borderBottom: '3px solid #6366F1', borderRight: '3px solid #6366F1' }} />

              <motion.div
                animate={{ y: [0, 218, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
                style={{
                  position: 'absolute',
                  left: 4,
                  right: 4,
                  height: 2,
                  background:
                    'linear-gradient(90deg, transparent, #6366F1 30%, #818CF8 50%, #6366F1 70%, transparent)',
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
            fontSize: 15,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Cancelar
        </button>
      </div>
    </motion.div>
  );
}
