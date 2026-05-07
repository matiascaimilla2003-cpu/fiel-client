'use client';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const STEP_BTN_LABELS = [
  'Continuar →',
  'Enviar SMS →',
  'Verificar número →',
  'Confirmar código →',
];

/* Color de cada segmento de progreso según el paso actual */
function segColor(index: number, step: number): string {
  if (step === 3) return '#D4A847';                // SMS: todos done
  if (index < step) return '#D4A847';              // anteriores: done
  if (index === step) return '#F0C96A';            // actual: active
  return 'rgba(255,255,255,0.10)';                 // siguientes: vacío
}

export default function RegistroPage() {
  const router = useRouter();

  const [step,        setStep]        = useState(0);
  const [dir,         setDir]         = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* Campos de formulario */
  const [nombre,   setNombre]   = useState('');
  const [telefono, setTelefono] = useState('');
  const [dia,      setDia]      = useState('');
  const [mes,      setMes]      = useState('');
  const [anio,     setAnio]     = useState('');
  const [code,     setCode]     = useState('');

  const codeInputRef = useRef<HTMLInputElement>(null);

  /* ── Validación del paso actual ── */
  const canContinue = (): boolean => {
    if (step === 0) return nombre.trim().length >= 2;
    if (step === 1) return telefono.replace(/\D/g, '').length >= 8;
    if (step === 2) return !!dia && !!mes && !!anio && anio.length === 4;
    if (step === 3) return code.length === 4;
    return false;
  };

  /* ── Avanzar paso ── */
  const goNext = async () => {
    if (!canContinue() || isSubmitting) return;
    if (step < 3) {
      setDir(1);
      setStep(step + 1);
      if (step + 1 === 3) {
        setTimeout(() => codeInputRef.current?.focus(), 380);
      }
      return;
    }

    // Paso final: registrar usuario
    setIsSubmitting(true);
    try {
      const email    = `${telefono}@cfiel.app`;
      const password = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);

      const { data: authData } = await supabase.auth.signUp({ email, password });
      const authUserId = authData.user?.id;

      const fechaNacimiento =
        anio && mes && dia
          ? `${anio}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`
          : null;

      const res = await fetch('/api/usuarios/crear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre:          nombre.trim(),
          telefono,
          fecha_nacimiento: fechaNacimiento,
          auth_user_id:    authUserId,
        }),
      });

      const data = await res.json();
      // Garantizar que userId nunca sea string vacío (falsy en el check de home)
      const userId = data.usuario?.id ?? authUserId ?? `demo_${Date.now()}`;

      console.log('[CFIEL] Registro: guardando cfiel_user_id:', userId);
      localStorage.setItem('cfiel_nombre',  nombre.trim().split(' ')[0]);
      localStorage.setItem('cfiel_user_id', userId);
    } catch {
      // Demo mode: continuar sin datos reales, igual necesita un ID
      const demoId = `demo_${Date.now()}`;
      console.log('[CFIEL] Registro demo: guardando cfiel_user_id:', demoId);
      localStorage.setItem('cfiel_nombre',  nombre.trim().split(' ')[0]);
      localStorage.setItem('cfiel_user_id', demoId);
    } finally {
      setIsSubmitting(false);
      router.push('/onboarding/bienvenida');
    }
  };

  /* ── Retroceder paso ── */
  const goBack = () => {
    if (step > 0) { setDir(-1); setStep(step - 1); }
    else router.back();
  };

  /* ── Teléfono formateado para mostrar en el paso SMS ── */
  const telFormatted = `+56 ${telefono.slice(0, 1)} ${telefono.slice(1, 5)} ${telefono.slice(5)}`;

  /* ── Estilos de input reutilizables ── */
  const inputBase: React.CSSProperties = {
    width: '100%',
    background: '#141414',
    border: '0.5px solid rgba(255,255,255,0.13)',
    borderRadius: 14,
    padding: '15px 17px',
    fontSize: 17,
    fontWeight: 500,
    color: '#fff',
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'border-color 0.2s',
    WebkitAppearance: 'none',
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) =>
    (e.target.style.borderColor = '#D4A847');
  const handleBlur  = (e: React.FocusEvent<HTMLInputElement>) =>
    (e.target.style.borderColor = 'rgba(255,255,255,0.13)');

  return (
    <div style={{
      background: '#0a0a0a',
      minHeight: '100dvh',
      maxWidth: 430,
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
    }}>

      {/* ── Header ── */}
      <div style={{
        padding: '18px 24px 14px',
        borderBottom: '0.5px solid rgba(255,255,255,0.07)',
        flexShrink: 0,
      }}>
        <div
          onClick={goBack}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            cursor: 'pointer', marginBottom: 16, width: 'fit-content',
          }}
        >
          <svg width={20} height={20} viewBox="0 0 24 24" fill="none"
            stroke="rgba(255,255,255,0.55)" strokeWidth={2.5}>
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)' }}>Volver</span>
        </div>
        <div style={{
          fontFamily: 'var(--font-bebas), "Bebas Neue", sans-serif',
          fontSize: 30, color: '#fff', letterSpacing: 1, marginBottom: 4,
        }}>
          Crear cuenta
        </div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>
          Solo 3 datos — menos de 1 minuto
        </div>
      </div>

      {/* ── Barra de progreso: 3 segmentos ── */}
      <div style={{ display: 'flex', gap: 5, padding: '14px 24px 0', flexShrink: 0 }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              flex: 1, height: 3, borderRadius: 3,
              background: segColor(i, step),
              transition: 'background 0.4s',
            }}
          />
        ))}
      </div>

      {/* ── Contenido del paso con AnimatePresence ── */}
      <div style={{ flex: 1, position: 'relative', minHeight: 280, overflow: 'hidden' }}>
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={step}
            custom={dir}
            initial={{ opacity: 0, x: dir * 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -28 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            style={{ position: 'absolute', inset: 0, padding: '24px 24px 0' }}
          >

            {/* ── PASO 0: Nombre ── */}
            {step === 0 && (
              <div>
                <div style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.28)', letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: 10 }}>
                  Tu nombre
                </div>
                <input
                  autoFocus
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && goNext()}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  placeholder="Ej: Carlos Morales"
                  autoComplete="name"
                  style={inputBase}
                />
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.28)', marginTop: 9 }}>
                  Así te saludaremos en la app 👋
                </div>
              </div>
            )}

            {/* ── PASO 1: Teléfono ── */}
            {step === 1 && (
              <div>
                <div style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.28)', letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: 10 }}>
                  Tu teléfono
                </div>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <span style={{ position: 'absolute', left: 14, fontSize: 18, pointerEvents: 'none', zIndex: 1 }}>🇨🇱</span>
                  <span style={{ position: 'absolute', left: 44, fontSize: 15, color: 'rgba(255,255,255,0.55)', fontWeight: 500, pointerEvents: 'none', zIndex: 1 }}>+56</span>
                  <input
                    autoFocus
                    type="tel"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value.replace(/\D/g, '').slice(0, 9))}
                    onKeyDown={(e) => e.key === 'Enter' && goNext()}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder="9 1234 5678"
                    maxLength={9}
                    style={{ ...inputBase, paddingLeft: 90 }}
                  />
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.28)', marginTop: 9, lineHeight: 1.55 }}>
                  Te enviamos un código SMS para verificar.{' '}
                  <span style={{ color: '#F0C96A' }}>Sin spam, prometido.</span>
                </div>
              </div>
            )}

            {/* ── PASO 2: Fecha de nacimiento ── */}
            {step === 2 && (
              <div>
                <div style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.28)', letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: 10 }}>
                  Fecha de nacimiento
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                  {[
                    { value: dia,  setter: setDia,  placeholder: 'DD',   maxLen: 2 },
                    { value: mes,  setter: setMes,  placeholder: 'MM',   maxLen: 2 },
                    { value: anio, setter: setAnio, placeholder: 'AAAA', maxLen: 4 },
                  ].map(({ value, setter, placeholder, maxLen }, i) => (
                    <input
                      key={i}
                      autoFocus={i === 0}
                      type="number"
                      value={value}
                      onChange={(e) => setter(e.target.value.slice(0, maxLen))}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      placeholder={placeholder}
                      style={{ ...inputBase, padding: '15px 12px', textAlign: 'center' }}
                    />
                  ))}
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.28)', marginTop: 9, lineHeight: 1.55 }}>
                  Para enviarte{' '}
                  <span style={{ color: '#F0C96A' }}>puntos extra en tu cumpleaños 🎂</span>
                </div>
              </div>
            )}

            {/* ── PASO 3: Verificación SMS ── */}
            {step === 3 && (
              <div>
                <div style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.28)', letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: 10 }}>
                  Código de verificación
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', marginBottom: 14 }}>
                  Enviamos un SMS al{' '}
                  <strong style={{ color: '#fff' }}>{telFormatted.trim() || '+56 9 XXXX XXXX'}</strong>
                </div>

                {/* 4 cajas de código */}
                <div
                  onClick={() => codeInputRef.current?.focus()}
                  style={{ display: 'flex', gap: 10, justifyContent: 'center', margin: '10px 0 18px', cursor: 'text' }}
                >
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      style={{
                        width: 58, height: 68,
                        background: '#141414',
                        border: `0.5px solid ${
                          code[i]         ? '#D4A847'
                          : i === code.length ? '#F0C96A'
                          : 'rgba(255,255,255,0.13)'
                        }`,
                        borderRadius: 14,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 26, fontWeight: 700, color: '#fff',
                        position: 'relative',
                        transition: 'border-color 0.2s',
                      }}
                    >
                      {code[i] ?? ''}
                      {/* Cursor parpadeante */}
                      {i === code.length && (
                        <div style={{
                          position: 'absolute', bottom: 10,
                          width: 2, height: 20,
                          background: '#F0C96A', borderRadius: 1,
                          animation: 'blink 0.9s ease infinite',
                        }} />
                      )}
                    </div>
                  ))}
                </div>

                {/* Input oculto que captura el teclado */}
                <input
                  ref={codeInputRef}
                  type="tel"
                  maxLength={4}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  style={{ position: 'absolute', opacity: 0, width: 1, height: 1, pointerEvents: 'none' }}
                />

                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', textAlign: 'center' }}>
                  ¿No llegó?{' '}
                  <span style={{ color: '#D4A847', cursor: 'pointer' }}>Reenviar →</span>
                </div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)', textAlign: 'center', marginTop: 8 }}>
                  Demo: escribe cualquier 4 dígitos
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Botón continuar + términos ── */}
      <div style={{ padding: '20px 24px 28px', flexShrink: 0 }}>
        <button
          onClick={goNext}
          disabled={!canContinue() || isSubmitting}
          style={{
            background: canContinue() && !isSubmitting ? '#fff' : 'rgba(255,255,255,0.08)',
            color: canContinue() && !isSubmitting ? '#0a0a0a' : 'rgba(255,255,255,0.28)',
            border: 'none',
            borderRadius: 28,
            padding: 15,
            fontSize: 15,
            fontWeight: 700,
            cursor: canContinue() && !isSubmitting ? 'pointer' : 'not-allowed',
            width: '100%',
            fontFamily: 'inherit',
            transition: 'all 0.2s',
          }}
        >
          {isSubmitting ? 'Creando cuenta...' : STEP_BTN_LABELS[step]}
        </button>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', textAlign: 'center', marginTop: 12 }}>
          Al continuar aceptas los{' '}
          <span style={{ color: 'rgba(255,255,255,0.55)' }}>Términos de uso</span>
        </div>
      </div>
    </div>
  );
}
