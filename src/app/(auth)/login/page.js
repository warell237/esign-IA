'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import SpaceBackground from '../../components/SpaceBackground';
import { useTheme } from '../../providers';

export default function LoginPage() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (data.success) {
        router.push('/chat');
      } else {
        setError(data.error || 'Erreur de connexion');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
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

      {/* Header */}
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
        <Link href="/" style={{
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
    border: theme === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
    background: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
    backdropFilter: 'blur(20px)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
  }}
  aria-label={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
>
  {theme === 'dark' ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffb347" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3366cc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
    </svg>
  )}
</button>
      </div>

      {/* Carte */}
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
        {/* Logo */}
<div style={{ textAlign: 'center', marginBottom: '8px' }}>
    <img 
        src="/icon-192.png" 
        alt="ESIGN" 
        style={{ 
            width: 32,
            height: 32,
            borderRadius: 8,
            objectFit: 'contain',
            flexShrink: 0,
            transition: 'transform 0.3s ease, width 0.3s ease',
            cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
            e.target.style.width = '48px';
            e.target.style.height = '48px';
            e.target.style.transform = 'scale(1.15)';
        }}
        onMouseLeave={(e) => {
            e.target.style.width = '32px';
            e.target.style.height = '32px';
            e.target.style.transform = 'scale(1)';
        }}
    />
</div>

        {/* Titre */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h1 style={{
            color: isDark ? 'white' : '#0a1035',
            fontSize: isMobile ? '22px' : '26px',
            fontWeight: '800',
            letterSpacing: '2px',
            margin: '0 0 6px 0',
          }}>
            Connexion
          </h1>
          <p style={{
            color: isDark ? 'rgba(200,210,255,0.6)' : 'rgba(10,16,53,0.5)',
            fontSize: isMobile ? '13px' : '14px',
            margin: 0,
          }}>
            Content de te revoir sur ESIGN AI
          </p>
        </div>

        {/* Erreur */}
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

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
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

          <div style={{ marginBottom: '8px' }}>
            <label style={labelStyle}>Mot de passe</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ ...inputStyle, paddingRight: '44px' }}
                required
              />
              <button
  type="button"
  onClick={() => setShowPassword(!showPassword)}
  style={{
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)',
    cursor: 'pointer',
    padding: 4,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }}
>
  {showPassword ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  )}
</button>
            </div>
          </div>

          <div style={{ textAlign: 'right', marginBottom: '20px' }}>
            <Link href="/forgot-password" style={{
              color: '#4488ff',
              fontSize: '12px',
              textDecoration: 'none',
              fontWeight: '500',
            }}>
              Mot de passe oublié ?
            </Link>
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
            {loading ? ' Connexion...' : ' Se connecter'}
          </button>
        </form>

        {/* Lien inscription */}
        <p style={{
          textAlign: 'center',
          marginTop: '20px',
          color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(10,16,53,0.4)',
          fontSize: isMobile ? '12px' : '13px',
        }}>
          Pas encore de compte ?{' '}
          <Link href="/register" style={{
            color: '#4488ff',
            textDecoration: 'none',
            fontWeight: '600',
          }}>
            S&apos;inscrire
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