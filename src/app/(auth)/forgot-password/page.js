'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import SpaceBackground from '../../components/SpaceBackground';
import { useTheme } from '../../providers';
import { resetPassword } from '../../lib/auth';

export default function ForgotPasswordPage() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsMobile(window.innerWidth < 640);
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!mounted) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    const result = await resetPassword(email);
    if (result.success) {
      setMessage('Email de réinitialisation envoyé. Vérifiez votre boîte mail.');
    } else {
      setError(result.error || 'Erreur');
    }
    setLoading(false);
  };

  const isDark = theme === 'dark';

  const inputStyle = {
    width: '100%',
    padding: isMobile ? '12px 14px' : '14px 16px',
    borderRadius: '12px',
    border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
    background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
    color: isDark ? 'white' : '#0a1035',
    fontSize: isMobile ? '14px' : '15px',
    outline: 'none',
    boxSizing: 'border-box',
  };

  const labelStyle = {
    color: isDark ? 'rgba(200,210,255,0.7)' : 'rgba(10,16,53,0.6)',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    marginBottom: '6px',
    display: 'block',
  };

  return (
    <main style={{
      width: '100vw',
      minHeight: '100vh',
      background: isDark ? '#000010' : '#f2f5ff',
      position: 'relative',
      fontFamily: 'Arial, sans-serif',
      transition: 'background 0.4s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    }}>
      <SpaceBackground />

      <div style={{
        position: 'fixed',
        top: isMobile ? '12px' : '20px',
        left: isMobile ? '12px' : '20px',
        right: isMobile ? '12px' : '20px',
        zIndex: 100,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <Link href="/login" style={{
          color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(10,16,53,0.6)',
          fontSize: isMobile ? '13px' : '14px',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          ← Retour
        </Link>

        <button
          onClick={toggleTheme}
          style={{
            width: isMobile ? '38px' : '44px',
            height: isMobile ? '38px' : '44px',
            borderRadius: '10px',
            border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
            background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
            backdropFilter: 'blur(20px)',
            color: isDark ? 'white' : '#0a1035',
            fontSize: isMobile ? '16px' : '20px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label={isDark ? 'Mode clair' : 'Mode sombre'}
        >
          {isDark ? '☀️' : '🌙'}
        </button>
      </div>

      <div style={{
        position: 'relative',
        zIndex: 10,
        width: '90%',
        maxWidth: '440px',
        padding: isMobile ? '30px 24px' : '40px 36px',
        borderRadius: '24px',
        background: isDark ? 'rgba(10, 15, 40, 0.7)' : 'rgba(255, 255, 255, 0.7)',
        border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.08)',
        backdropFilter: 'blur(30px)',
        boxShadow: isDark
          ? '0 20px 60px rgba(0,0,0,0.5), 0 0 80px rgba(68,136,255,0.1)'
          : '0 20px 60px rgba(0,0,0,0.1), 0 0 80px rgba(51,102,204,0.05)',
        animation: 'slideUp 0.5s ease-out',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #4488ff, #3366cc)',
            margin: '0 auto 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
            boxShadow: '0 8px 25px rgba(68,136,255,0.3)',
          }}>
            🔒
          </div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h1 style={{
            color: isDark ? 'white' : '#0a1035',
            fontSize: isMobile ? '20px' : '24px',
            fontWeight: '800',
            letterSpacing: '2px',
            margin: '0 0 6px 0',
          }}>
            Mot de passe oublié
          </h1>
          <p style={{
            color: isDark ? 'rgba(200,210,255,0.6)' : 'rgba(10,16,53,0.5)',
            fontSize: isMobile ? '13px' : '14px',
            margin: 0,
          }}>
            Reçois un lien par email
          </p>
        </div>

        {error && (
          <div style={{
            padding: '12px 16px',
            borderRadius: '12px',
            background: 'rgba(255,68,85,0.1)',
            border: '1px solid rgba(255,68,85,0.3)',
            color: '#ff4455',
            fontSize: '13px',
            marginBottom: '20px',
            textAlign: 'center',
          }}>
            {error}
          </div>
        )}

        {message && (
          <div style={{
            padding: '12px 16px',
            borderRadius: '12px',
            background: 'rgba(0,204,136,0.1)',
            border: '1px solid rgba(0,204,136,0.3)',
            color: '#00cc88',
            fontSize: '13px',
            marginBottom: '20px',
            textAlign: 'center',
          }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jean@esign.cm"
              style={inputStyle}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: isMobile ? '14px' : '16px',
              borderRadius: '14px',
              border: 'none',
              background: loading ? 'rgba(68,136,255,0.5)' : 'linear-gradient(135deg, #4488ff, #3366cc)',
              color: 'white',
              fontWeight: '600',
              fontSize: isMobile ? '15px' : '16px',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 6px 25px rgba(68,136,255,0.4)',
              transition: 'all 0.3s ease',
            }}
          >
            {loading ? ' Envoi...' : ' Envoyer le lien'}
          </button>
        </form>

        <p style={{
          textAlign: 'center',
          marginTop: '20px',
          color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(10,16,53,0.4)',
          fontSize: isMobile ? '12px' : '13px',
        }}>
          <Link href="/login" style={{
            color: '#4488ff',
            textDecoration: 'none',
            fontWeight: '600',
          }}>
            ← Retour à la connexion
          </Link>
        </p>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
}