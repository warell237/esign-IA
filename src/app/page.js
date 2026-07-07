'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import SpaceBackground from './components/SpaceBackground';
import { useTheme } from './providers';

export default function HomePage() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsMobile(window.innerWidth < 640);
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);

    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(iOS);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return () => window.removeEventListener('resize', handleResize);
    }

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBanner(true);
    };
    window.addEventListener('beforeinstallprompt', handler);

    if (iOS) setShowInstallBanner(true);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice;
      if (result.outcome === 'accepted') setShowInstallBanner(false);
      setDeferredPrompt(null);
    }
  };

  if (!mounted) return null;

  const isDark = theme === 'dark';
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
    <main style={{ width: '100%', height: '100dvh', overflow: 'hidden', background: isDark ? '#000010' : '#f2f5ff', position: 'relative', fontFamily: 'Arial, sans-serif', transition: 'background 0.4s ease' }}>
      <SpaceBackground />

      {/* Bouton theme */}
      <div style={{ position: 'fixed', top: isMobile ? '12px' : '20px', right: isMobile ? '12px' : '20px', zIndex: 100 }}>
        <button onClick={toggleTheme} style={{ width: isMobile ? '38px' : '44px', height: isMobile ? '38px' : '44px', borderRadius: '10px', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)', background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', backdropFilter: 'blur(20px)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease' }} aria-label={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}>
          {isDark ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffb347" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3366cc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
          )}
        </button>
      </div>

      {/* Banniere PWA */}
      {showInstallBanner && !isInstalled && (
        <div style={{ position: 'fixed', bottom: isMobile ? 16 : 24, left: '50%', transform: 'translateX(-50%)', zIndex: 200, width: '90%', maxWidth: 440, padding: isMobile ? '16px 18px' : '20px 24px', borderRadius: 16, background: isDark ? 'rgba(10,15,50,0.98)' : 'rgba(255,255,255,0.98)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`, backdropFilter: 'blur(20px)', boxShadow: '0 10px 40px rgba(0,0,0,0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: isIOS ? 12 : 8 }}>
            <img src="/icon-192.png" alt="ESIGN" style={{ width: 32, height: 32, borderRadius: 8 }} />
            <span style={{ color: isDark ? 'white' : '#0a1035', fontWeight: 700, fontSize: 15 }}>Installer ESIGN AI</span>
          </div>
          {isIOS ? (
            <div style={{ marginBottom: 12 }}>
              {[
                { num: 1, text: 'Appuyez sur le bouton Partager en bas de Safari' },
                { num: 2, text: 'Faites defiler et choisissez Sur l\'ecran d\'accueil' },
                { num: 3, text: 'Appuyez sur Ajouter' },
              ].map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 8 }}>
                  <span style={{ width: 22, height: 22, borderRadius: '50%', flexShrink: 0, background: '#4488ff', color: 'white', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{step.num}</span>
                  <span style={{ color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)', fontSize: 13, lineHeight: 1.5 }}>{step.text}</span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)', fontSize: 13, margin: '0 0 12px 0', lineHeight: 1.5 }}>
              Ajoutez cette app a votre ecran d&apos;accueil pour un acces rapide comme une vraie application.
            </p>
          )}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button onClick={() => setShowInstallBanner(false)} style={{ padding: '8px 16px', borderRadius: 8, border: `1px solid ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'}`, background: 'transparent', color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)', fontWeight: 500, fontSize: 13, cursor: 'pointer' }}>Plus tard</button>
            {!isIOS && (
              <button onClick={handleInstall} style={{ padding: '8px 18px', borderRadius: 8, border: 'none', background: 'linear-gradient(135deg, #4488ff, #3366cc)', color: 'white', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>Installer</button>
            )}
          </div>
        </div>
      )}

      {/* Contenu centre */}
      <div style={{ position: 'absolute', top: isMobile ? '38%' : '42%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 10, textAlign: 'center', pointerEvents: 'none', width: '90%', maxWidth: '500px' }}>
        <div style={{ width: `${logoSize}px`, height: `${logoSize}px`, margin: `0 auto ${isMobile ? '15px' : '25px'} auto`, animation: 'pulse 3s ease-in-out infinite' }}>
          <img src={isDark ? '/logo-esign-dark.png' : '/logo-esign-light.png'} alt="ESIGN Logo" width={logoSize} height={logoSize} style={{ objectFit: 'contain' }} />
        </div>
        <h1 style={{ color: isDark ? 'white' : '#0a1035', fontSize: titleSize, fontWeight: '800', letterSpacing: isMobile ? '3px' : '6px', margin: `0 0 ${isMobile ? '8px' : '12px'} 0`, textShadow: isDark ? '0 0 20px rgba(68, 136, 255, 0.8), 0 0 40px rgba(68, 136, 255, 0.4)' : '0 0 20px rgba(51, 102, 204, 0.3)', wordBreak: 'break-word' }}>ESIGN AI</h1>
        <p style={{ color: isDark ? 'rgba(200, 210, 255, 0.85)' : 'rgba(10, 16, 53, 0.7)', fontSize: subtitleSize, letterSpacing: subtitleSpacing, margin: `0 0 ${isMobile ? '18px' : '25px'} 0`, fontWeight: '300' }}>ASSISTANT INTELLIGENT</p>
        <p style={{ color: isDark ? 'rgba(180, 190, 230, 0.5)' : 'rgba(10, 16, 53, 0.5)', fontSize: featuresSize, letterSpacing: isMobile ? '1px' : '2px', margin: 0, lineHeight: '1.6' }}>
          {isMobile ? 'Coaching - Examens' : 'Coaching - Examens - Business - Infos ESIGN'}
          {isMobile && <br />}{isMobile && 'Business - Infos ESIGN'}
        </p>
      </div>

      {/* Boutons */}
      <div style={{ position: 'absolute', bottom: bottomGap, left: '50%', transform: 'translateX(-50%)', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: isMobile ? '10px' : '14px', width: '90%', maxWidth: btnMaxWidth, pointerEvents: 'auto' }}>
        <Link href="/register" style={{ display: 'block', width: '100%', padding: btnPadding, textAlign: 'center', color: 'white', fontWeight: '600', fontSize: btnFontSize, borderRadius: '14px', textDecoration: 'none', background: 'linear-gradient(135deg, #4488ff, #3366cc)', boxShadow: '0 6px 25px rgba(68, 136, 255, 0.4)', transition: 'all 0.3s ease', letterSpacing: '0.5px' }}>Commencer gratuitement</Link>
        <Link href="/login" style={{ display: 'block', width: '100%', padding: btnPadding, textAlign: 'center', color: isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(10, 16, 53, 0.8)', fontWeight: '500', fontSize: btnFontSize, borderRadius: '14px', textDecoration: 'none', border: isDark ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(10, 16, 53, 0.2)', transition: 'all 0.3s ease', letterSpacing: '0.5px' }}>J&apos;ai deja un compte</Link>
        <p style={{ color: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(10, 16, 53, 0.4)', fontSize: isMobile ? '10px' : '12px', margin: `${isMobile ? '6px' : '10px'} 0 0 0`, textAlign: 'center' }}>{isMobile ? '50 questions/jour - Premium 1000 FCFA/mois' : '50 questions gratuites par jour - Premium des 1 000 FCFA/mois'}</p>
      </div>

      {/* Footer */}
      <div style={{ position: 'absolute', bottom: isMobile ? '6px' : '10px', left: '50%', transform: 'translateX(-50%)', zIndex: 10, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <p style={{ color: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(10, 16, 53, 0.2)', fontSize: isMobile ? '9px' : '11px', letterSpacing: '1px', margin: 0, whiteSpace: 'nowrap' }}>ESIGN - UIECC - Sangmelima</p>
          <span style={{ color: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', fontSize: 10 }}>|</span>
          <Link href="/about" style={{ color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)', fontSize: isMobile ? '8px' : '10px', textDecoration: 'none', padding: '2px 8px', borderRadius: 6, border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)', transition: 'all 0.2s' }}
            onMouseEnter={(e) => { e.target.style.color = '#4488ff'; e.target.style.borderColor = '#4488ff'; }}
            onMouseLeave={(e) => { e.target.style.color = isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'; e.target.style.borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'; }}
          >A propos</Link>
        </div>
        <p style={{ color: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(10, 16, 53, 0.12)', fontSize: isMobile ? '7px' : '9px', margin: 0 }}>Realise par Empire Digital</p>
      </div>

      <style>{`@keyframes pulse { 0%, 100% { transform: scale(1); filter: brightness(1); } 50% { transform: scale(1.06); filter: brightness(1.3); } }`}</style>
    </main>
  );
}