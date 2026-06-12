'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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

  const logoSize = isMobile ? 120 : 180;
  const titleSize = isMobile ? '28px' : '46px';
  const subtitleSize = isMobile ? '13px' : '18px';
  const subtitleSpacing = isMobile ? '4px' : '8px';
  const featuresSize = isMobile ? '11px' : '14px';
  const btnFontSize = isMobile ? '14px' : '16px';
  const btnPadding = isMobile ? '14px 0' : '18px 0';
  const btnMaxWidth = isMobile ? '300px' : '420px';
  const bottomGap = isMobile ? '30px' : '50px';

  return (
    <main style={{
      width: '100%',
      height: '100dvh',
      overflow: 'hidden',
      background: theme === 'dark' ? '#000010' : '#f2f5ff',
      position: 'relative',
      fontFamily: 'Arial, sans-serif',
      transition: 'background 0.4s ease',
    }}>
      <SpaceBackground />

      {/* Bouton theme */}
      <div style={{
        position: 'fixed',
        top: isMobile ? '12px' : '20px',
        right: isMobile ? '12px' : '20px',
        zIndex: 100,
      }}>
        <button
          onClick={toggleTheme}
          style={{
            width: isMobile ? '38px' : '44px',
            height: isMobile ? '38px' : '44px',
            borderRadius: '10px',
            border: theme === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
            background: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
            backdropFilter: 'blur(20px)',
            color: theme === 'dark' ? 'white' : '#0a1035',
            fontSize: isMobile ? '16px' : '20px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
          }}
          aria-label={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>

      {/* Contenu centre */}
      <div style={{
        position: 'absolute',
        top: isMobile ? '38%' : '42%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 10,
        textAlign: 'center',
        pointerEvents: 'none',
        width: '90%',
        maxWidth: '500px',
      }}>
        <div style={{
          width: `${logoSize}px`,
          height: `${logoSize}px`,
          margin: `0 auto ${isMobile ? '15px' : '25px'} auto`,
          animation: 'pulse 3s ease-in-out infinite',
        }}>
          <img
            src={theme === 'dark' ? '/logo-esign-dark.png' : '/logo-esign-light.png'}
            alt="ESIGN Logo"
            width={logoSize}
            height={logoSize}
            priority
            style={{ objectFit: 'contain' }}
          />
        </div>

        <h1 style={{
          color: theme === 'dark' ? 'white' : '#0a1035',
          fontSize: titleSize,
          fontWeight: '800',
          letterSpacing: isMobile ? '3px' : '6px',
          margin: `0 0 ${isMobile ? '8px' : '12px'} 0`,
          textShadow: theme === 'dark'
            ? '0 0 20px rgba(68, 136, 255, 0.8), 0 0 40px rgba(68, 136, 255, 0.4)'
            : '0 0 20px rgba(51, 102, 204, 0.3)',
          wordBreak: 'break-word',
        }}>
          ESIGN AI
        </h1>

        <p style={{
          color: theme === 'dark' ? 'rgba(200, 210, 255, 0.85)' : 'rgba(10, 16, 53, 0.7)',
          fontSize: subtitleSize,
          letterSpacing: subtitleSpacing,
          margin: `0 0 ${isMobile ? '18px' : '25px'} 0`,
          fontWeight: '300',
        }}>
          ASSISTANT INTELLIGENT
        </p>

        <p style={{
          color: theme === 'dark' ? 'rgba(180, 190, 230, 0.5)' : 'rgba(10, 16, 53, 0.5)',
          fontSize: featuresSize,
          letterSpacing: isMobile ? '1px' : '2px',
          margin: 0,
          lineHeight: '1.6',
        }}>
          {isMobile ? 'Coaching • Examens' : 'Coaching • Examens • Business • Infos ESIGN'}
          {isMobile && <br />}
          {isMobile && 'Business • Infos ESIGN'}
        </p>
      </div>

      {/* Boutons en bas */}
      <div style={{
        position: 'absolute',
        bottom: bottomGap,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: isMobile ? '10px' : '14px',
        width: '90%',
        maxWidth: btnMaxWidth,
        pointerEvents: 'auto',
      }}>
        <Link href="/register" style={{
          display: 'block', width: '100%', padding: btnPadding,
          textAlign: 'center', color: 'white', fontWeight: '600',
          fontSize: btnFontSize, borderRadius: '14px', textDecoration: 'none',
          background: 'linear-gradient(135deg, #4488ff, #3366cc)',
          boxShadow: '0 6px 25px rgba(68, 136, 255, 0.4)',
          transition: 'all 0.3s ease', letterSpacing: '0.5px',
        }}>
          Commencer gratuitement
        </Link>

        <Link href="/login" style={{
          display: 'block', width: '100%', padding: btnPadding,
          textAlign: 'center',
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(10, 16, 53, 0.8)',
          fontWeight: '500', fontSize: btnFontSize, borderRadius: '14px',
          textDecoration: 'none',
          border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(10, 16, 53, 0.2)',
          transition: 'all 0.3s ease', letterSpacing: '0.5px',
        }}>
          J&apos;ai deja un compte
        </Link>

        <p style={{
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(10, 16, 53, 0.4)',
          fontSize: isMobile ? '10px' : '12px',
          margin: `${isMobile ? '6px' : '10px'} 0 0 0`,
          textAlign: 'center',
        }}>
          {isMobile
            ? '50 questions/jour • Premium 1000 FCFA/mois'
            : '50 questions gratuites par jour • Premium des 1 000 FCFA/mois'}
        </p>
      </div>

      {/* Footer + Signature */}
      <div style={{
        position: 'absolute',
        bottom: isMobile ? '6px' : '10px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10,
        textAlign: 'center',
      }}>
        <p style={{
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(10, 16, 53, 0.2)',
          fontSize: isMobile ? '9px' : '11px',
          letterSpacing: '1px',
          margin: 0,
          whiteSpace: 'nowrap',
        }}>
          ESIGN • UIECC • Sangmelima • Cameroun-Congo
        </p>
        <p style={{
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(10, 16, 53, 0.12)',
          fontSize: isMobile ? '7px' : '9px',
          margin: '2px 0 0 0',
        }}>
          Realise par Empire Digital
        </p>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); filter: brightness(1); }
          50% { transform: scale(1.06); filter: brightness(1.3); }
        }
      `}</style>
    </main>
  );
}