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
    setTimeout(() => setVisible(true), 200);
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
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
        </svg>
      ),
      title: "Qu'est-ce que ESIGN AI ?",
      text: "ESIGN AI est l'assistant intelligent officiel des etudiants de l'Ecole Superieure Internationale de Genie Numerique (ESIGN). Elle aide les etudiants a reussir leurs etudes, preparer leurs examens, et developper leur esprit entrepreneurial grace a l'intelligence artificielle.",
      color: '#4488ff',
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00cc88" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/>
        </svg>
      ),
      title: 'Qui a cree ESIGN AI ?',
      text: "ESIGN AI a ete developpee par Empire Digital, une startup technologique fondee par un etudiant entrepreneur de l'ESIGN. Empire Digital est specialisee dans le developpement de logiciels, sites web et applications mobiles.",
      color: '#00cc88',
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffb347" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ),
      title: 'Notre mission',
      text: "Rendre l'education numerique accessible a tous les etudiants de l'ESIGN, en leur offrant un assistant disponible 24h/24 pour les aider a apprendre, reviser, entreprendre et reussir leurs projets.",
      color: '#ffb347',
    },
  ];

  const features = [
    { label: 'Chat', desc: "Posez toutes vos questions sur les cours et l'ecole", color: '#4488ff' },
    { label: 'Mentor', desc: 'Coaching personnalise pour votre reussite academique', color: '#00cc88' },
    { label: 'Examen', desc: 'Entrainez-vous avec des QCM et exercices', color: '#ffb347' },
    { label: 'Business', desc: 'Decouvrez comment generer des revenus', color: '#ff6b6b' },
    { label: 'Prof', desc: "Accedez aux informations sur l'ecole et les filieres", color: '#6699ff' },
  ];

  return (
    <main style={{ width: '100%', minHeight: '100dvh', background: isDark ? '#000010' : '#f2f5ff', position: 'relative', fontFamily: 'Arial, sans-serif', overflow: 'hidden' }}>
      <SpaceBackground />

      {/* Particules flottantes colorees */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        {[...Array(12)].map((_, i) => {
          const colors = ['#4488ff', '#00cc88', '#ffb347', '#ff6b6b', '#6699ff'];
          const c = colors[i % colors.length];
          return (
            <div key={i} style={{
              position: 'absolute', width: 2 + Math.random() * 4, height: 2 + Math.random() * 4,
              borderRadius: '50%', background: c, opacity: 0.15,
              top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`,
              animation: `floatParticle ${5 + Math.random() * 6}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 4}s`,
            }} />
          );
        })}
      </div>

      {/* Header */}
      <div style={{ position: 'fixed', top: isMobile ? '12px' : '20px', left: isMobile ? '12px' : '20px', right: isMobile ? '12px' : '20px', zIndex: 100, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(10,16,53,0.6)', fontSize: 14, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, transition: 'color 0.2s' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          Retour
        </Link>
        <button onClick={toggleTheme} style={{ width: 40, height: 40, borderRadius: 10, border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`, background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', backdropFilter: 'blur(20px)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease' }}>
          {isDark ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffb347" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/></svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3366cc" strokeWidth="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
          )}
        </button>
      </div>

      {/* Contenu */}
      <div style={{ position: 'relative', zIndex: 10, maxWidth: 680, margin: '0 auto', padding: isMobile ? '80px 16px 40px' : '100px 24px 50px' }}>

        {/* Titre anime */}
        <div style={{ textAlign: 'center', marginBottom: 40, opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(-15px)', transition: 'all 0.8s ease' }}>
          <h1 style={{ color: titleColor, fontSize: isMobile ? 30 : 40, fontWeight: 800, marginBottom: 10, letterSpacing: '-0.5px', background: 'linear-gradient(135deg, #4488ff, #6699ff, #00cc88, #ffb347)', backgroundSize: '300% 100%', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', animation: 'titleGradient 4s ease-in-out infinite' }}>A propos</h1>
          <div style={{ width: 50, height: 3, borderRadius: 2, background: 'linear-gradient(90deg, #4488ff, #00cc88, #ffb347)', backgroundSize: '200% 100%', animation: 'shimmer 2s ease-in-out infinite', margin: '0 auto' }} />
        </div>

        {/* Cartes avec icones */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {cards.map((card, i) => (
            <div key={i} style={{
              background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 18,
              padding: isMobile ? '20px 16px' : '26px 24px',
              opacity: visible ? 1 : 0, transform: visible ? 'translateX(0)' : `translateX(${i % 2 === 0 ? '-30px' : '30px'})`,
              transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.3 + i * 0.15}s`,
              position: 'relative', overflow: 'hidden',
            }}>
              {/* Barre laterale coloree */}
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: card.color, borderRadius: '0 4px 4px 0' }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: `${card.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {card.icon}
                  </div>
                  <h2 style={{ color: titleColor, fontSize: isMobile ? 17 : 19, fontWeight: 700, margin: 0 }}>{card.title}</h2>
                </div>
                <p style={{ color: textColor, fontSize: 14, lineHeight: 1.8, margin: 0 }}>{card.text}</p>
              </div>
            </div>
          ))}

          {/* Carte Fonctionnalites */}
          <div style={{
            background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 18,
            padding: isMobile ? '20px 16px' : '26px 24px',
            opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(30px)',
            transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.3 + 3 * 0.15}s`,
          }}>
            <h2 style={{ color: titleColor, fontSize: isMobile ? 17 : 19, fontWeight: 700, marginBottom: 16 }}>Fonctionnalites</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {features.map((f, i) => (
                <div key={i} style={{
                  display: 'flex', gap: 12, alignItems: 'center', padding: '8px 12px',
                  borderRadius: 10, background: `${f.color}08`,
                  opacity: visible ? 1 : 0, transform: visible ? 'translateX(0)' : 'translateX(-15px)',
                  transition: `all 0.4s ease ${0.6 + i * 0.08}s`,
                }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: f.color, flexShrink: 0 }} />
                  <span style={{ color: f.color, fontWeight: 700, fontSize: 13, minWidth: 70 }}>{f.label}</span>
                  <span style={{ color: textColor, fontSize: 13 }}>{f.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: 36, opacity: visible ? 1 : 0, transition: 'opacity 0.8s ease 1.2s' }}>
          <p style={{ color: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)', fontSize: 11, margin: 0 }}>ESIGN AI — Developpe par Empire Digital</p>
        </div>
      </div>

      <style>{`
        @keyframes floatParticle {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.1; }
          50% { transform: translateY(-25px) scale(1.8); opacity: 0.25; }
        }
        @keyframes shimmer {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes titleGradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </main>
  );
}