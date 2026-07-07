'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import SpaceBackground from '../components/SpaceBackground';
import { useTheme } from '../providers';

export default function AboutPage() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsMobile(window.innerWidth < 640);
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);
    setTimeout(() => setVisible(true), 100);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!mounted) return null;

  const isDark = theme === 'dark';
  const textColor = isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.65)';
  const titleColor = isDark ? 'white' : '#0a1035';
  const cardBg = isDark ? 'rgba(10,15,40,0.7)' : 'rgba(255,255,255,0.7)';
  const cardBorder = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
  const accent = '#4488ff';

  const cards = [
    { title: "Qu'est-ce que ESIGN AI ?", text: "ESIGN AI est l'assistant intelligent officiel des etudiants de l'Ecole Superieure Internationale de Genie Numerique (ESIGN). Elle aide les etudiants a reussir leurs etudes, preparer leurs examens, et developper leur esprit entrepreneurial." },
    { title: 'Qui a cree ESIGN AI ?', text: "ESIGN AI a ete developpee par Empire Digital, une startup technologique fondee par un etudiant entrepreneur de l'ESIGN. Empire Digital est specialisee dans le developpement de logiciels, sites web et applications mobiles." },
    { title: 'Notre mission', text: "Rendre l'education numerique accessible a tous les etudiants de l'ESIGN, en leur offrant un assistant disponible 24h/24 pour les aider a apprendre, reviser, entreprendre et reussir leurs projets." },
  ];

  const features = [
    { label: 'Chat', desc: "Posez toutes vos questions sur les cours et l'ecole" },
    { label: 'Mentor', desc: 'Coaching personnalise pour votre reussite academique' },
    { label: 'Examen', desc: 'Entrainez-vous avec des QCM et exercices' },
    { label: 'Business', desc: 'Decouvrez comment generer des revenus' },
    { label: 'Prof', desc: "Accedez aux informations sur l'ecole et les filieres" },
  ];

  return (
    <main style={{ width: '100%', minHeight: '100dvh', background: isDark ? '#000010' : '#f2f5ff', position: 'relative', fontFamily: 'Arial, sans-serif', overflow: 'hidden' }}>
      <SpaceBackground />

      {/* Particules simples */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute', width: 3, height: 3, borderRadius: '50%', background: accent,
            opacity: 0.12, top: `${20 + i * 15}%`, left: `${10 + i * 12}%`,
            animation: `floatParticle ${5 + i * 2}s ease-in-out infinite`,
          }} />
        ))}
      </div>

      {/* Header */}
      <div style={{ position: 'fixed', top: isMobile ? '12px' : '20px', left: isMobile ? '12px' : '20px', right: isMobile ? '12px' : '20px', zIndex: 100, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(10,16,53,0.6)', fontSize: 14, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          Retour
        </Link>
        <button onClick={toggleTheme} style={{ width: 40, height: 40, borderRadius: 10, border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`, background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {isDark ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffb347" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/></svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3366cc" strokeWidth="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
          )}
        </button>
      </div>

      {/* Contenu */}
      <div style={{ position: 'relative', zIndex: 10, maxWidth: 650, margin: '0 auto', padding: isMobile ? '80px 16px 40px' : '100px 24px 50px' }}>

        <h1 style={{
          color: titleColor, fontSize: isMobile ? 28 : 36, fontWeight: 800, textAlign: 'center', marginBottom: 32,
          opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(-10px)',
          transition: 'all 0.6s ease',
        }}>
          A propos
        </h1>

        {/* Cartes avec animation fade-in */}
        {cards.map((card, i) => (
          <div key={i} style={{
            background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 16,
            padding: isMobile ? '20px 16px' : '24px 22px', marginBottom: 16,
            opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: `all 0.5s ease ${0.2 + i * 0.15}s`,
          }}>
            <h2 style={{ color: accent, fontSize: 18, fontWeight: 700, marginBottom: 10 }}>{card.title}</h2>
            <p style={{ color: textColor, fontSize: 14, lineHeight: 1.7, margin: 0 }}>{card.text}</p>
          </div>
        ))}

        {/* Carte Fonctionnalites */}
        <div style={{
          background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 16,
          padding: isMobile ? '20px 16px' : '24px 22px',
          opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)',
          transition: `all 0.5s ease ${0.2 + 3 * 0.15}s`,
        }}>
          <h2 style={{ color: accent, fontSize: 18, fontWeight: 700, marginBottom: 10 }}>Fonctionnalites</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {features.map((f, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'baseline' }}>
                <span style={{ color: accent, fontWeight: 700, fontSize: 13, minWidth: 70 }}>{f.label}</span>
                <span style={{ color: textColor, fontSize: 13 }}>{f.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes floatParticle {
          0%, 100% { transform: translateY(0); opacity: 0.1; }
          50% { transform: translateY(-20px); opacity: 0.2; }
        }
      `}</style>
    </main>
  );
}