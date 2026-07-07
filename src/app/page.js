'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import SpaceBackground from './components/SpaceBackground';
import { useTheme } from './providers';

export default function HomePage() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsMobile(window.innerWidth < 640);
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!mounted) return null;

  const isDark = theme === 'dark';
  const logoSize = isMobile ? 120 : 180;

  return (
    <main style={{ width: '100%', height: '100dvh', overflow: 'hidden', background: isDark ? '#000010' : '#f2f5ff', position: 'relative', fontFamily: 'Arial, sans-serif' }}>
      <SpaceBackground />

      <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 100 }}>
        <button onClick={toggleTheme} style={{ width: 44, height: 44, borderRadius: 10, border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)', background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {isDark ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffb347" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/></svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3366cc" strokeWidth="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
          )}
        </button>
      </div>

      <div style={{ position: 'absolute', top: '42%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 10, textAlign: 'center' }}>
        <div style={{ width: logoSize, height: logoSize, margin: '0 auto 25px', animation: 'pulse 3s ease-in-out infinite' }}>
          <img src={isDark ? '/logo-esign-dark.png' : '/logo-esign-light.png'} alt="ESIGN Logo" width={logoSize} height={logoSize} style={{ objectFit: 'contain' }} />
        </div>
        <h1 style={{ color: isDark ? 'white' : '#0a1035', fontSize: 46, fontWeight: 800, letterSpacing: 6 }}>ESIGN AI</h1>
        <p style={{ color: isDark ? 'rgba(200,210,255,0.85)' : 'rgba(10,16,53,0.7)', fontSize: 18, letterSpacing: 8, fontWeight: 300 }}>ASSISTANT INTELLIGENT</p>
      </div>

      <div style={{ position: 'absolute', bottom: 50, left: '50%', transform: 'translateX(-50%)', zIndex: 10, display: 'flex', flexDirection: 'column', gap: 14, width: '90%', maxWidth: 420 }}>
        <Link href="/register" style={{ display: 'block', width: '100%', padding: '18px 0', textAlign: 'center', color: 'white', fontWeight: 600, fontSize: 16, borderRadius: 14, textDecoration: 'none', background: 'linear-gradient(135deg, #4488ff, #3366cc)' }}>Commencer gratuitement</Link>
        <Link href="/login" style={{ display: 'block', width: '100%', padding: '18px 0', textAlign: 'center', color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(10,16,53,0.8)', fontWeight: 500, fontSize: 16, borderRadius: 14, textDecoration: 'none', border: isDark ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(10,16,53,0.2)' }}>J&apos;ai deja un compte</Link>
      </div>

      <div style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', zIndex: 10, textAlign: 'center' }}>
        <p style={{ color: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(10,16,53,0.2)', fontSize: 11, margin: 0 }}>ESIGN - UIECC - Sangmelima</p>
      </div>

      <style>{`@keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.06); } }`}</style>
    </main>
  );
}