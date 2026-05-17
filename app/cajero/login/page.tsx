'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function CajeroLoginPage() {
  const router = useRouter();
  const [password,  setPassword]  = useState('');
  const [error,     setError]     = useState('');
  const [loading,   setLoading]   = useState(false);

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

  return (
    <div style={{
      background: '#0a0a0a',
      minHeight: '100dvh',
      maxWidth: 430,
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px 24px',
    }}>

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          fontFamily: 'var(--font-bebas), "Bebas Neue", sans-serif',
          fontSize: 52, letterSpacing: 4, lineHeight: 1,
          marginBottom: 6,
        }}
      >
        <span style={{ color: '#6366F1' }}>C</span>
        <span style={{ color: '#fff' }}>FIEL</span>
      </motion.div>

      {/* Título */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        style={{
          fontFamily: 'var(--font-bebas), "Bebas Neue", sans-serif',
          fontSize: 22, letterSpacing: 2,
          color: 'rgba(255,255,255,0.35)',
          textTransform: 'uppercase',
          marginBottom: 40,
        }}
      >
        Acceso Cajero
      </motion.div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        style={{
          width: '100%',
          background: '#141414',
          border: '0.5px solid rgba(255,255,255,0.07)',
          borderRadius: 24,
          padding: '28px 24px',
        }}
      >
        <div style={{
          fontSize: 10, fontWeight: 600,
          color: 'rgba(255,255,255,0.28)',
          letterSpacing: '1.2px', textTransform: 'uppercase',
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
          placeholder="••••••••"
          style={{
            width: '100%',
            background: '#0a0a0a',
            border: `0.5px solid ${error ? 'rgba(231,76,60,0.6)' : 'rgba(255,255,255,0.13)'}`,
            borderRadius: 14,
            padding: '15px 17px',
            fontSize: 20,
            color: '#fff',
            fontFamily: 'inherit',
            outline: 'none',
            marginBottom: error ? 10 : 20,
            transition: 'border-color 0.2s',
            letterSpacing: 3,
          }}
          onFocus={(e) => { if (!error) e.target.style.borderColor = '#6366F1'; }}
          onBlur={(e)  => { if (!error) e.target.style.borderColor = 'rgba(255,255,255,0.13)'; }}
        />

        {/* Error */}
        {error && (
          <div style={{
            fontSize: 12,
            color: '#E74C3C',
            marginBottom: 16,
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none"
              stroke="#E74C3C" strokeWidth={2.5}>
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
            background: password && !loading ? '#6366F1' : 'rgba(255,255,255,0.08)',
            color: password && !loading ? '#0a0a0a' : 'rgba(255,255,255,0.28)',
            border: 'none',
            borderRadius: 28,
            padding: 15,
            fontSize: 15,
            fontWeight: 700,
            cursor: password && !loading ? 'pointer' : 'not-allowed',
            fontFamily: 'inherit',
            transition: 'all 0.2s',
          }}
        >
          {loading ? 'Verificando...' : 'Entrar →'}
        </button>
      </motion.div>

      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', marginTop: 24 }}>
        Solo personal autorizado
      </div>
    </div>
  );
}
