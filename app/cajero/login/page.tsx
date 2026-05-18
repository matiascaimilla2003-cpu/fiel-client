'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const BEBAS = 'var(--font-bebas), "Bebas Neue", sans-serif';

export default function CajeroLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const [focused,  setFocused]  = useState(false);

  const handleSubmit = async () => {
    if (!password || loading) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/cajero/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Contraseña incorrecta');
        return;
      }

      localStorage.setItem('cfiel_cajero', 'true');
      router.replace('/cajero');
    } catch {
      setError('Error de conexión. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const active = Boolean(password) && !loading;

  return (
    <div style={{
      background: '#0a0a14',
      minHeight: '100dvh',
      maxWidth: 430,
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px 24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Ambient glow */}
      <div style={{
        position: 'absolute', top: '15%', left: '50%',
        transform: 'translateX(-50%)',
        width: 480, height: 480,
        background: 'radial-gradient(circle, rgba(99,102,241,0.13) 0%, transparent 65%)',
        pointerEvents: 'none',
      }}/>

      {/* Lock icon */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, type: 'spring', stiffness: 280, damping: 22 }}
        style={{
          width: 56, height: 56,
          background: 'linear-gradient(135deg, rgba(99,102,241,0.18), rgba(99,102,241,0.06))',
          border: '1px solid rgba(99,102,241,0.28)',
          borderRadius: 16,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#818CF8', marginBottom: 22,
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
      </motion.div>

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.06 }}
        style={{
          fontFamily: BEBAS,
          fontSize: 54, letterSpacing: 4, lineHeight: 1,
          marginBottom: 7,
          textShadow: '0 0 50px rgba(99,102,241,0.35)',
        }}
      >
        <span style={{ color: '#6366F1' }}>C</span>
        <span style={{ color: '#fff' }}>FIEL</span>
      </motion.div>

      {/* Subtitle */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.12, duration: 0.4 }}
        style={{
          fontFamily: BEBAS,
          fontSize: 14, letterSpacing: '0.22em',
          color: 'rgba(255,255,255,0.25)',
          marginBottom: 40,
        }}
      >
        ACCESO CAJERO
      </motion.div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.16, duration: 0.4 }}
        style={{
          width: '100%',
          background: 'linear-gradient(135deg, rgba(99,102,241,0.10), rgba(99,102,241,0.03))',
          border: '1px solid rgba(99,102,241,0.20)',
          borderRadius: 24,
          padding: '28px 24px',
        }}
      >
        <div style={{
          fontSize: 10, fontWeight: 600,
          color: 'rgba(255,255,255,0.28)',
          letterSpacing: '0.16em', textTransform: 'uppercase',
          marginBottom: 10,
        }}>
          Contraseña
        </div>

        <input
          type="password"
          autoFocus
          value={password}
          onChange={(e) => { setPassword(e.target.value); setError(''); }}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="••••••••"
          style={{
            width: '100%',
            background: 'rgba(0,0,0,0.35)',
            border: `1px solid ${error ? 'rgba(248,113,113,0.55)' : focused ? '#6366F1' : 'rgba(99,102,241,0.20)'}`,
            borderRadius: 14,
            padding: '15px 18px',
            fontSize: 20,
            color: '#fff',
            fontFamily: 'inherit',
            outline: 'none',
            marginBottom: error ? 10 : 20,
            transition: 'border-color 0.2s',
            letterSpacing: 4,
          }}
        />

        {error && (
          <div style={{
            fontSize: 12,
            color: '#F87171',
            marginBottom: 16,
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none"
              stroke="#F87171" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {error}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={!password || loading}
          style={{
            width: '100%',
            background: active
              ? 'linear-gradient(135deg, #6366F1 0%, #4f46e5 100%)'
              : 'rgba(255,255,255,0.06)',
            color: active ? '#fff' : 'rgba(255,255,255,0.22)',
            border: 'none',
            borderRadius: 14,
            padding: 17,
            fontFamily: BEBAS,
            fontSize: 18,
            letterSpacing: '0.07em',
            cursor: active ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s',
            boxShadow: active ? '0 6px 22px rgba(99,102,241,0.38)' : 'none',
          }}
        >
          {loading ? 'VERIFICANDO...' : 'ENTRAR'}
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.32 }}
        style={{
          fontSize: 11, color: 'rgba(255,255,255,0.18)',
          marginTop: 24,
          display: 'flex', alignItems: 'center', gap: 6,
        }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
        Solo personal autorizado
      </motion.div>
    </div>
  );
}
