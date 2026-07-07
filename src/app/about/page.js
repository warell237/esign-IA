'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import SpaceBackground from '../components/SpaceBackground';
import { useTheme } from '../providers';

export default function AboutPage() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [visibleCards, setVisibleCards] = useState([]);
  const cardsRef = useRef([]);

  useEffect(() => {
    setMounted(true);
    setIsMobile(window.innerWidth < 640);
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);

    // Animation d'apparition séquentielle des cartes
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.index);
            setVisibleCards((prev) => [...new Set([...prev, index])]);
          }
        });
      },
      { threshold: 0.2 }
    );

    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    };
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
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a10 10 0 1010 10A10 10 0 0012 2z"/>
          <path d="M12 6v6l4 2"/>
        </svg>
      ),
      title: "Qu'est-ce que ESIGN AI ?",
      text: "ESIGN AI est l'assistant intelligent officiel des etudiants de l'Ecole Superieure Internationale de Genie Numerique (ESIGN). Elle aide les etudiants a reussir leurs etudes, preparer leurs examens, et developper leur esprit entrepreneurial grace a l'intelligence artificielle.",
      gradient: 'linear-gradient(135deg, #4488ff20, #3366cc10)',
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
          <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/>
        </svg>
      ),
      title: 'Qui a cree ESIGN AI ?',
      text: 'ESIGN AI a ete developpee par Empire Digital, une startup technologique fondee par un etudiant entrepreneur de l\'ESIGN. Empire Digital est specialisee dans le developpement de logiciels, sites web, applications mobiles et solutions numeriques.',
      gradient: 'linear-gradient(135deg, #00cc8820, #00996610)',
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 6v6l4 2"/>
        </svg>
      ),
      title: 'Notre mission',
      text: "Rendre l'education numerique accessible a tous les etudiants de l'ESIGN, en leur offrant un assistant disponible 24h/24 pour les aider a apprendre, reviser, entreprendre et reussir leurs projets.",
      gradient: 'linear-gradient(135deg, #ffb34720, #ff8c0010)',
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ),
      title: 'Fonctionnalites',
      features: [
        { label: 'Chat', desc: "Posez toutes vos questions sur les cours et l'ecole" },
        { label: 'Mentor', desc: 'Coaching personnalise pour votre reussite academique' },
        { label: 'Examen', desc: 'Entrainez-vous avec des QCM et exercices' },
        { label: 'Business', desc: 'Decouvrez comment generer des revenus avec vos competences' },
        { label: 'Prof', desc: "Accedez aux informations sur l'ecole, les filieres et les profs" },
      ],
      gradient: 'linear-gradient(135deg, #ff6b6b20, #ee5a2410)',
    },
  ];

  return (
    <main style={{
      width: '100%', minHeight: '100dvh',
      background: isDark ? '#000010' : '#f2f5ff',
      position: 'relative', fontFamily: 'Arial, sans-serif',
      transition: 'background 0.4s ease',
      overflow: 'hidden',
    }}>
      <SpaceBackground />

      {/* Particules flottantes */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        {[...Array(8)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: 2 + Math.random() * 3,
            height: 2 + Math.random() * 3,
            borderRadius: '50%',
            background: accent,
            opacity: 0.15,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `floatParticle ${6 + Math.random() * 8}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
          }} />
        ))}
      </div>

      {/* Header */}
      <div style={{ position: 'fixed', top: isMobile ? '12px' : '20px', left: isMobile ? '12px' : '20px', right: isMobile ? '12px' : '20px', zIndex: 100, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(10,16,53,0.6)', fontSize: 14, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, transition: 'color 0.2s' }}>
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
      <div style={{ position: 'relative', zIndex: 10, maxWidth: 720, margin: '0 auto', padding: isMobile ? '80px 16px 40px' : '100px 24px 50px' }}>
        
        {/* Titre avec animation */}
        <div style={{ textAlign: 'center', marginBottom: 48, animation: 'fadeSlideDown 0.8s ease' }}>
          <h1 style={{
            color: titleColor, fontSize: isMobile ? 32 : 42, fontWeight: 800,
            marginBottom: 12, letterSpacing: '-0.5px',
            background: 'linear-gradient(135deg, #4488ff, #6699ff)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            A propos
          </h1>
          <div style={{
            width: 60, height: 4, borderRadius: 2,
            background: 'linear-gradient(90deg, #4488ff, #6699ff, #4488ff)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 2s ease-in-out infinite',
            margin: '0 auto',
          }} />
        </div>

        {/* Cartes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {cards.map((card, i) => (
            <div
              key={i}
              ref={(el) => (cardsRef.current[i] = el)}
              data-index={i}
              style={{
                background: cardBg,
                border: `1px solid ${cardBorder}`,
                borderRadius: 20,
                padding: isMobile ? '24px 20px' : '30px 28px',
                backdropFilter: 'blur(20px)',
                opacity: visibleCards.includes(i) ? 1 : 0,
                transform: visibleCards.includes(i) ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)',
                transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.15}s`,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Fond gradient animé */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                background: card.gradient, opacity: visibleCards.includes(i) ? 1 : 0,
                transition: `opacity 0.8s ease ${i * 0.2}s`,
                pointerEvents: 'none',
              }} />

              {/* Barre latérale */}
              <div style={{
                position: 'absolute', left: 0, top: '20%', bottom: '20%',
                width: 3, borderRadius: '0 4px 4px 0',
                background: accent,
                transform: visibleCards.includes(i) ? 'scaleY(1)' : 'scaleY(0)',
                transition: `transform 0.6s ease ${i * 0.2 + 0.3}s`,
                transformOrigin: 'top',
              }} />

              <div style={{ position: 'relative', zIndex: 1 }}>
                {/* Icone + Titre */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 14,
                    background: `${accent}15`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    {card.icon}
                  </div>
                  <h2 style={{ color: titleColor, fontSize: isMobile ? 18 : 20, fontWeight: 700, margin: 0 }}>
                    {card.title}
                  </h2>
                </div>

                {/* Contenu */}
                {card.text && (
                  <p style={{ color: textColor, fontSize: 14, lineHeight: 1.8, margin: 0 }}>
                    {card.text}
                  </p>
                )}

                {/* Features */}
                {card.features && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {card.features.map((f, j) => (
                      <div
                        key={j}
                        style={{
                          display: 'flex', gap: 12, alignItems: 'flex-start',
                          padding: '8px 12px', borderRadius: 10,
                          background: `${accent}08`,
                          opacity: visibleCards.includes(i) ? 1 : 0,
                          transform: visibleCards.includes(i) ? 'translateX(0)' : 'translateX(-20px)',
                          transition: `all 0.4s ease ${i * 0.15 + j * 0.1}s`,
                        }}
                      >
                        <span style={{
                          color: accent, fontWeight: 700, fontSize: 13,
                          minWidth: 70, flexShrink: 0,
                        }}>
                          {f.label}
                        </span>
                        <span style={{ color: textColor, fontSize: 13, lineHeight: 1.6 }}>
                          {f.desc}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          textAlign: 'center', marginTop: 40,
          opacity: visibleCards.length > 0 ? 1 : 0,
          transition: 'opacity 0.8s ease 1s',
        }}>
          <p style={{ color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)', fontSize: 12, marginBottom: 8 }}>
            ESIGN AI — Developpe par Empire Digital
          </p>
          <p style={{ color: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)', fontSize: 11, margin: 0 }}>
            Fait avec passion pour les etudiants de l&apos;ESIGN
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes floatParticle {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.1; }
          50% { transform: translateY(-30px) scale(1.5); opacity: 0.25; }
        }
      `}</style>
    </main>
  );
}