'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import SpaceBackground from '../components/SpaceBackground';
import { useTheme } from '../providers';

export default function AboutPage() {
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

  const textColor = isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.65)';
  const titleColor = isDark ? 'white' : '#0a1035';
  const cardBg = isDark ? 'rgba(10,15,40,0.7)' : 'rgba(255,255,255,0.7)';
  const cardBorder = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';

  return (
    <main style={{
      width: '100%', minHeight: '100dvh',
      background: isDark ? '#000010' : '#f2f5ff',
      position: 'relative', fontFamily: 'Arial, sans-serif',
      transition: 'background 0.4s ease',
      overflow: 'hidden',
    }}>
      <SpaceBackground />

      {/* Header */}
      <div style={{ position: 'fixed', top: isMobile ? '12px' : '20px', left: isMobile ? '12px' : '20px', right: isMobile ? '12px' : '20px', zIndex: 100, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(10,16,53,0.6)', fontSize: 14, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          Retour
        </Link>
        <button onClick={toggleTheme} style={{ width: 40, height: 40, borderRadius: 10, border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`, background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', backdropFilter: 'blur(20px)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease' }}>
          {isDark ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffb347" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3366cc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
          )}
        </button>
      </div>

      {/* Contenu */}
      <div style={{ position: 'relative', zIndex: 10, maxWidth: 700, margin: '0 auto', padding: isMobile ? '80px 20px 40px' : '100px 30px 50px' }}>
        
        {/* Titre */}
        <h1 style={{ color: titleColor, fontSize: isMobile ? 28 : 36, fontWeight: 800, textAlign: 'center', marginBottom: 40 }}>
          A propos
        </h1>

        {/* Carte : ESIGN AI */}
        <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 20, padding: isMobile ? '24px 20px' : '30px 28px', marginBottom: 20, backdropFilter: 'blur(20px)' }}>
          <h2 style={{ color: '#4488ff', fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Qu&apos;est-ce que ESIGN AI ?</h2>
          <p style={{ color: textColor, fontSize: 14, lineHeight: 1.7, margin: 0 }}>
            ESIGN AI est l&apos;assistant intelligent officiel des etudiants de l&apos;Ecole Superieure Internationale de Genie Numerique (ESIGN). 
            Elle aide les etudiants a reussir leurs etudes, preparer leurs examens, et developper leur esprit entrepreneurial grace a l&apos;intelligence artificielle.
          </p>
        </div>

        {/* Carte : Créateur */}
        <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 20, padding: isMobile ? '24px 20px' : '30px 28px', marginBottom: 20, backdropFilter: 'blur(20px)' }}>
          <h2 style={{ color: '#4488ff', fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Qui a cree ESIGN AI ?</h2>
          <p style={{ color: textColor, fontSize: 14, lineHeight: 1.7, margin: '0 0 12px 0' }}>
            ESIGN AI a ete developpee par <strong style={{ color: isDark ? 'white' : '#0a1035' }}>Empire Digital</strong>, une startup technologique fondee par un etudiant entrepreneur de l&apos;ESIGN.
          </p>
          <p style={{ color: textColor, fontSize: 14, lineHeight: 1.7, margin: 0 }}>
            Empire Digital est specialisee dans le developpement de logiciels, sites web, applications mobiles et solutions numeriques.
          </p>
        </div>

        {/* Carte : Mission */}
        <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 20, padding: isMobile ? '24px 20px' : '30px 28px', marginBottom: 20, backdropFilter: 'blur(20px)' }}>
          <h2 style={{ color: '#4488ff', fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Notre mission</h2>
          <p style={{ color: textColor, fontSize: 14, lineHeight: 1.7, margin: 0 }}>
            Rendre l&apos;education numerique accessible a tous les etudiants de l&apos;ESIGN, en leur offrant un assistant disponible 24h/24 pour les aider a apprendre, reviser, entreprendre et reussir leurs projets.
          </p>
        </div>

        {/* Carte : Fonctionnalités */}
        <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 20, padding: isMobile ? '24px 20px' : '30px 28px', backdropFilter: 'blur(20px)' }}>
          <h2 style={{ color: '#4488ff', fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Fonctionnalites</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { label: 'Chat', desc: 'Posez toutes vos questions sur les cours et l\'ecole' },
              { label: 'Mentor', desc: 'Coaching personnalise pour votre reussite academique' },
              { label: 'Examen', desc: 'Entrainez-vous avec des QCM et exercices' },
              { label: 'Business', desc: 'Decouvrez comment generer des revenus avec vos competences' },
              { label: 'Prof', desc: 'Accedez aux informations sur l\'ecole, les filieres et les profs' },
            ].map((f, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'baseline' }}>
                <span style={{ color: '#4488ff', fontWeight: 700, fontSize: 13, minWidth: 70 }}>{f.label}</span>
                <span style={{ color: textColor, fontSize: 13 }}>{f.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}