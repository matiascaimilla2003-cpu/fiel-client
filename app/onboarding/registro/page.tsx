'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

// ── Estilos de input reutilizables ──────────────────────────

const inputField: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.02)',
  border: '1px solid rgba(255,255,255,0.06)',
  borderRadius: 16,
  padding: '18px 20px',
  fontSize: 17,
  fontWeight: 500,
  color: '#fff',
  fontFamily: 'inherit',
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
  WebkitAppearance: 'none',
};

const inputLabel: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  color: 'rgba(255,255,255,0.4)',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  marginBottom: 8,
  display: 'block',
};

const inputHelp: React.CSSProperties = {
  fontSize: 13,
  color: 'rgba(255,255,255,0.4)',
  lineHeight: 1.5,
  marginTop: 8,
};

function focusInput(e: React.FocusEvent<HTMLInputElement>) {
  e.target.style.borderColor = 'rgba(99,102,241,0.6)';
  e.target.style.boxShadow = '0 0 0 4px rgba(99,102,241,0.12)';
}
function blurInput(e: React.FocusEvent<HTMLInputElement>) {
  e.target.style.borderColor = 'rgba(255,255,255,0.06)';
  e.target.style.boxShadow = 'none';
}

// ── Etiquetas de botón por paso ─────────────────────────────

const STEP_BTN_LABELS = ['Continuar', 'Enviar SMS', 'Verificar número', 'Confirmar código'];
const STEP_LABELS     = ['NOMBRE', 'TELÉFONO', 'NACIMIENTO', 'VERIFICACIÓN'];

// ── Color del segmento de progreso ─────────────────────────

function segBg(i: number, step: number): string {
  if (i < step) return 'linear-gradient(90deg, #4F46E5, #6366F1)';
  if (i === step) return 'linear-gradient(90deg, #6366F1, #818CF8, #6366F1)';
  return 'rgba(255,255,255,0.06)';
}

// ── Página principal ────────────────────────────────────────

export default function RegistroPage() {
  const router = useRouter();

  const [step,         setStep]         = useState(0);
  const [dir,          setDir]          = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [nombre,         setNombre]         = useState('');
  const [codigoReferido, setCodigoReferido] = useState('');
  const [telefono,       setTelefono]       = useState('');
  const [dia,            setDia]            = useState('');
  const [mes,            setMes]            = useState('');
  const [anio,           setAnio]           = useState('');
  const [otp,            setOtp]            = useState(['', '', '', '']);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    localStorage.removeItem('cfiel_user_id');
    localStorage.removeItem('cfiel_nombre');
    localStorage.removeItem('cfiel_cajero');
    localStorage.removeItem('cfiel_codigo_referido');
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) setCodigoReferido(ref.toUpperCase().trim());
  }, []);

  // ── Validación de fecha ─────────────────────────────────

  const fechaEsValida = (): boolean => {
    if (!dia || !mes || anio.length < 4) return false;
    const d = parseInt(dia, 10);
    const m = parseInt(mes, 10);
    const a = parseInt(anio, 10);
    return d >= 1 && d <= 31 && m >= 1 && m <= 12 && a >= 1920 && a <= 2010;
  };

  const mostrarErrorFecha = step === 2 && !!(dia || mes || anio) && !fechaEsValida();

  // ── Validación por paso ─────────────────────────────────

  const canContinue = (): boolean => {
    if (step === 0) return nombre.trim().length >= 2;
    if (step === 1) return telefono.replace(/\D/g, '').length >= 8;
    if (step === 2) return fechaEsValida();
    if (step === 3) return otp.every(c => c.length === 1);
    return false;
  };

  // ── Manejo de OTP ───────────────────────────────────────

  const handleOtp = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const arr = [...otp]; arr[i] = val; setOtp(arr);
    if (val && i < 3) otpRefs.current[i + 1]?.focus();
  };

  // ── Avanzar ─────────────────────────────────────────────

  const goNext = async () => {
    if (!canContinue() || isSubmitting) return;
    if (step < 3) {
      setDir(1);
      setStep(step + 1);
      if (step + 1 === 3) {
        setTimeout(() => otpRefs.current[0]?.focus(), 380);
      }
      return;
    }

    setIsSubmitting(true);
    try {
      const fechaNacimiento =
        anio && mes && dia
          ? `${anio}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`
          : null;

      const res = await fetch('/api/usuarios/crear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre:           nombre.trim(),
          telefono,
          fecha_nacimiento: fechaNacimiento,
          codigo_referido:  codigoReferido.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!data.usuario?.id) throw new Error(data.error ?? 'Sin respuesta del servidor');

      localStorage.setItem('cfiel_user_id', data.usuario.id);
      localStorage.setItem('cfiel_nombre',  data.usuario.nombre.split(' ')[0]);
    } catch (err) {
      console.error('[CFIEL] Error en registro:', err);
    } finally {
      setIsSubmitting(false);
      router.push('/onboarding/bienvenida');
    }
  };

  // ── Retroceder ──────────────────────────────────────────

  const goBack = () => {
    if (step > 0) { setDir(-1); setStep(step - 1); }
    else router.back();
  };

  const telFormatted = `+56 ${telefono.slice(0, 1)} ${telefono.slice(1, 5)} ${telefono.slice(5)}`;
  const teléfonoValido = telefono.replace(/\D/g, '').length >= 8;

  return (
    <div style={{
      background: '#0a0a14',
      minHeight: '100dvh',
      maxWidth: 430,
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
    }}>

      {/* ── Header: volver + contador ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 24px' }}>
        <button
          onClick={goBack}
          style={{
            background: 'transparent', border: 'none', color: '#fff',
            display: 'flex', alignItems: 'center', gap: 8,
            cursor: 'pointer', padding: 4, fontFamily: 'inherit',
            opacity: step === 0 ? 0.4 : 1,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          <span style={{ fontSize: 14, fontWeight: 500 }}>Volver</span>
        </button>
        <div style={{
          fontFamily: 'var(--font-bebas), "Bebas Neue", sans-serif',
          fontSize: 12, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.45)',
        }}>
          {step + 1} <span style={{ opacity: 0.4 }}>/ 4</span>
        </div>
      </div>

      {/* ── Título + progreso ── */}
      <div style={{ padding: '12px 24px 24px' }}>
        <div style={{
          fontFamily: 'var(--font-bebas), "Bebas Neue", sans-serif',
          fontSize: 12, letterSpacing: '0.32em',
          color: '#818CF8', marginBottom: 6,
        }}>
          PASO {step + 1} · {STEP_LABELS[step]}
        </div>
        <h1 style={{
          fontFamily: 'var(--font-bebas), "Bebas Neue", sans-serif',
          fontSize: 42, lineHeight: 0.95,
          margin: '0 0 6px', color: '#fff',
        }}>
          CREAR CUENTA
        </h1>
        <p style={{ fontSize: 14, margin: 0, color: 'rgba(255,255,255,0.45)' }}>
          Menos de 1 minuto · 4 pasos rápidos
        </p>

        {/* Barra de 4 segmentos */}
        <div style={{ display: 'flex', gap: 6, marginTop: 24 }}>
          {[0, 1, 2, 3].map(i => (
            <div key={i} style={{
              flex: 1, height: 3,
              background: 'rgba(255,255,255,0.06)',
              borderRadius: 100, overflow: 'hidden',
            }}>
              <div style={{
                height: '100%', width: '100%',
                borderRadius: 100,
                transformOrigin: 'left',
                transform: i <= step ? 'scaleX(1)' : 'scaleX(0)',
                opacity: i <= step ? 1 : 0,
                background: segBg(i, step),
                backgroundSize: i === step ? '200% 100%' : '100% 100%',
                animation: i === step ? 'shimmer 2s linear infinite' : 'none',
                transition: 'transform 0.5s cubic-bezier(.4,0,.2,1), opacity 0.3s',
              }}/>
            </div>
          ))}
        </div>
      </div>

      {/* ── Contenido del paso ── */}
      <div style={{ flex: 1, position: 'relative', minHeight: 280, overflow: 'hidden' }}>
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={step}
            custom={dir}
            initial={{ opacity: 0, x: dir * 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -28 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            style={{ position: 'absolute', inset: 0, padding: '12px 24px 0' }}
          >

            {/* ── Paso 0: Nombre ── */}
            {step === 0 && (
              <div>
                <label style={inputLabel}>Tu nombre</label>
                <input
                  autoFocus
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && goNext()}
                  onFocus={focusInput}
                  onBlur={blurInput}
                  placeholder="Ej: Carlos Morales"
                  autoComplete="name"
                  style={inputField}
                />
                <p style={inputHelp}>Así te saludaremos cuando entres.</p>

                <div style={{ height: 20 }}/>

                <label style={inputLabel}>
                  Código de invitación{' '}
                  <span style={{ textTransform: 'none', letterSpacing: 0, color: 'rgba(255,255,255,0.3)' }}>
                    (opcional)
                  </span>
                </label>
                <input
                  type="text"
                  value={codigoReferido}
                  onChange={(e) =>
                    setCodigoReferido(e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, ''))
                  }
                  onFocus={focusInput}
                  onBlur={blurInput}
                  placeholder="Ej: CFIEL-04863C"
                  style={{ ...inputField, fontSize: 15 }}
                />
                {codigoReferido.length > 0 && (
                  <div style={{ fontSize: 11, color: '#6366F1', marginTop: 7 }}>
                    +200 pts extra de bienvenida al registrarte
                  </div>
                )}
              </div>
            )}

            {/* ── Paso 1: Teléfono ── */}
            {step === 1 && (
              <div>
                <label style={inputLabel}>Tu teléfono</label>
                <div style={{
                  display: 'flex', alignItems: 'center',
                  height: 64, background: 'rgba(255,255,255,0.02)',
                  border: `1px solid ${telefono ? 'rgba(99,102,241,0.6)' : 'rgba(255,255,255,0.06)'}`,
                  borderRadius: 16, padding: '0 20px', gap: 14,
                  boxShadow: telefono ? '0 0 0 4px rgba(99,102,241,0.12)' : 'none',
                  transition: 'all 0.2s ease',
                }}>
                  {/* Chilean flag */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingRight: 14, borderRight: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{
                      width: 22, height: 16, borderRadius: 2,
                      background: 'linear-gradient(180deg, #fff 50%, #D52B1E 50%)',
                      boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.2)',
                      position: 'relative', flexShrink: 0,
                    }}>
                      <div style={{ position: 'absolute', top: 0, left: 0, width: 9, height: 8, background: '#0033A0' }}/>
                      <div style={{
                        position: 'absolute', top: 2, left: 3, width: 3, height: 3,
                        background: '#fff',
                        clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
                      }}/>
                    </div>
                    <span style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>+56</span>
                  </div>
                  <input
                    autoFocus
                    type="tel"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value.replace(/\D/g, '').slice(0, 9))}
                    onKeyDown={(e) => e.key === 'Enter' && goNext()}
                    placeholder="9 8765 4321"
                    maxLength={9}
                    style={{
                      flex: 1, background: 'transparent', border: 'none',
                      outline: 'none', color: '#fff',
                      fontSize: 18, fontWeight: 500, fontFamily: 'inherit',
                    }}
                  />
                  {teléfonoValido && (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#818CF8" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                  )}
                </div>
                <p style={inputHelp}>
                  Te enviaremos un código por SMS.{' '}
                  <span style={{ color: '#818CF8' }}>Sin spam, prometido.</span>
                </p>
              </div>
            )}

            {/* ── Paso 2: Fecha de nacimiento ── */}
            {step === 2 && (
              <div>
                <label style={inputLabel}>Fecha de nacimiento</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.5fr', gap: 10 }}>
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
                      onFocus={focusInput}
                      onBlur={blurInput}
                      placeholder={placeholder}
                      style={{ ...inputField, padding: '18px 12px', textAlign: 'center' }}
                    />
                  ))}
                </div>
                {mostrarErrorFecha ? (
                  <p style={{ ...inputHelp, color: '#E74C3C' }}>Fecha inválida, verifica los datos</p>
                ) : (
                  <p style={inputHelp}>Usamos esto para regalos en tu mes.</p>
                )}

                {/* Birthday bonus card */}
                <div style={{
                  marginTop: 16, padding: '14px 16px', borderRadius: 14,
                  background: 'rgba(99,102,241,0.06)',
                  border: '1px dashed rgba(99,102,241,0.25)',
                  display: 'flex', alignItems: 'center', gap: 12,
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#818CF8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="8" width="18" height="13" rx="2"/>
                    <path d="M12 8V4M8 4h8M3 13h18"/>
                  </svg>
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>
                    Te enviamos{' '}
                    <span style={{ color: '#818CF8', fontWeight: 600 }}>+500 pts</span>
                    {' '}el día de tu cumpleaños.
                  </span>
                </div>
              </div>
            )}

            {/* ── Paso 3: Verificación SMS ── */}
            {step === 3 && (
              <div>
                <label style={inputLabel}>Código de verificación</label>
                <p style={{ fontSize: 14, margin: '0 0 16px', color: 'rgba(255,255,255,0.55)' }}>
                  Enviamos un SMS al{' '}
                  <strong style={{ color: '#fff' }}>{telFormatted.trim() || '+56 9 XXXX XXXX'}</strong>
                </p>

                {/* 4 inputs OTP individuales */}
                <div style={{ display: 'flex', gap: 10 }}>
                  {[0, 1, 2, 3].map(i => (
                    <input
                      key={i}
                      ref={el => { otpRefs.current[i] = el; }}
                      type="tel"
                      inputMode="numeric"
                      maxLength={1}
                      value={otp[i]}
                      onChange={(e) => handleOtp(i, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Backspace' && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus();
                      }}
                      style={{
                        flex: 1,
                        height: 72,
                        background: 'rgba(255,255,255,0.02)',
                        border: `1px solid ${otp[i] ? 'rgba(99,102,241,0.6)' : 'rgba(255,255,255,0.06)'}`,
                        boxShadow: otp[i] ? '0 0 0 4px rgba(99,102,241,0.12)' : 'none',
                        borderRadius: 16,
                        textAlign: 'center',
                        fontSize: 28, fontWeight: 700,
                        color: '#fff',
                        outline: 'none',
                        caretColor: 'transparent',
                        fontFamily: 'inherit',
                        transition: 'border-color 0.2s, box-shadow 0.2s',
                      }}
                    />
                  ))}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 }}>
                  <span style={inputHelp}>¿No llegó?</span>
                  <button style={{
                    background: 'transparent', border: 'none',
                    color: '#818CF8', fontSize: 13, fontWeight: 600,
                    cursor: 'pointer', padding: 0,
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    fontFamily: 'inherit',
                  }}>
                    Reenviar
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                      <path d="M3 12a9 9 0 0 1 15-6.7M21 4v5h-5M21 12a9 9 0 0 1-15 6.7M3 20v-5h5"/>
                    </svg>
                  </button>
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── CTA + términos ── */}
      <div style={{ padding: '20px 24px 36px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <button
          onClick={goNext}
          disabled={!canContinue() || isSubmitting}
          style={{
            background: canContinue() && !isSubmitting ? '#fff' : 'rgba(255,255,255,0.08)',
            color: canContinue() && !isSubmitting ? '#0a0a14' : 'rgba(255,255,255,0.28)',
            border: 'none', borderRadius: 100, padding: '16px 24px',
            fontSize: 15, fontWeight: 700, cursor: canContinue() && !isSubmitting ? 'pointer' : 'not-allowed',
            width: '100%', fontFamily: 'inherit',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            transition: 'all 0.2s',
          }}
        >
          {isSubmitting ? 'Creando cuenta...' : STEP_BTN_LABELS[step]}
          {canContinue() && !isSubmitting && (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 5l7 7-7 7"/>
            </svg>
          )}
        </button>
        <div style={{ textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.28)' }}>
          Al continuar aceptas los{' '}
          <span style={{ color: '#818CF8', fontWeight: 600 }}>Términos de uso</span>
        </div>
      </div>
    </div>
  );
}
