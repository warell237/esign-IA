// ============================================
// src/app/components/Onboarding.js
// ============================================

'use client';

import { useState, useEffect } from 'react';

const STEPS = [
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
      </svg>
    ),
    title: 'Chat',
    desc: 'Posez toutes vos questions sur vos cours, l\'ecole, ou tout autre sujet.',
    accent: '#4488ff',
    gradient: 'linear-gradient(135deg, #4488ff, #3366cc)',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/>
      </svg>
    ),
    title: 'Mentor',
    desc: 'Votre coach personnel pour organiser vos etudes et atteindre vos objectifs.',
    accent: '#00cc88',
    gradient: 'linear-gradient(135deg, #00cc88, #009966)',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 14l2 2 4-4"/>
      </svg>
    ),
    title: 'Examen',
    desc: 'Entrainez-vous avec des exercices, QCM et sujets types.',
    accent: '#ffb347',
    gradient: 'linear-gradient(135deg, #ffb347, #ff8c00)',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
      </svg>
    ),
    title: 'Business',
    desc: 'Decouvrez comment generer des revenus avec vos competences numeriques.',
    accent: '#ff6b6b',
    gradient: 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
      </svg>
    ),
    title: 'Prof',
    desc: 'Trouvez toutes les informations sur l\'ecole, les filieres et les professeurs.',
    accent: '#6699ff',
    gradient: 'linear-gradient(135deg, #6699ff, #4477dd)',
  },
];

export default function Onboarding({ isDark, onClose }) {
  const [step, setStep] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState(1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const current = STEPS[step];

  const goNext = () => {
    if (animating) return;
    setDirection(1);
    setAnimating(true);
    setTimeout(() => {
      setStep(step + 1);
      setAnimating(false);
    }, 300);
  };

  const goPrev = () => {
    if (animating || step === 0) return;
    setDirection(-1);
    setAnimating(true);
    setTimeout(() => {
      setStep(step - 1);
      setAnimating(false);
    }, 300);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 300,
      background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20, perspective: '1000px',
    }}>
      {/* Fond particules */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {[...Array(20)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: 2 + Math.random() * 4,
            height: 2 + Math.random() * 4,
            borderRadius: '50%',
            background: STEPS[i % 5].accent,
            opacity: 0.3,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `particleFloat ${3 + Math.random() * 4}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 3}s`,
          }} />
        ))}
      </div>

      {/* Carte 3D */}
      <div style={{
        background: isDark ? 'rgba(10,15,40,0.98)' : 'rgba(255,255,255,0.98)',
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
        borderRadius: 28, padding: '36px 32px', maxWidth: 400, width: '100%',
        textAlign: 'center',
        boxShadow: `0 30px 80px rgba(0,0,0,0.6), 0 0 60px ${current.accent}20`,
        transform: mounted
          ? `rotateY(${animating ? direction * 15 : 0}deg) scale(${animating ? 0.9 : 1})`
          : 'rotateY(90deg) scale(0.8)',
        opacity: mounted ? 1 : 0,
        transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Barre de progression */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 28 }}>
          {STEPS.map((_, i) => (
            <button
              key={i}
              onClick={() => { setStep(i); }}
              style={{
                width: i === step ? 32 : 10,
                height: 10,
                borderRadius: 5,
                border: 'none',
                background: i === step
                  ? current.gradient
                  : isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: i === step ? `0 0 16px ${current.accent}40` : 'none',
              }}
            />
          ))}
        </div>

        {/* Icône avec anneau tournant */}
        <div style={{ position: 'relative', width: 88, height: 88, margin: '0 auto 20px' }}>
          {/* Anneau externe */}
          <div style={{
            position: 'absolute', inset: -8, borderRadius: '50%',
            border: `2px solid ${current.accent}30`,
            borderTopColor: current.accent,
            animation: 'ringSpin 3s linear infinite',
          }} />
          {/* Anneau interne */}
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            border: `2px solid ${current.accent}20`,
            borderBottomColor: current.accent,
            animation: 'ringSpin 2s linear infinite reverse',
          }} />
          {/* Icône */}
          <div style={{
            position: 'absolute', inset: 0, borderRadius: 20,
            background: `${current.accent}15`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: current.accent, fontSize: 32,
            animation: 'iconPulse 2s ease-in-out infinite',
          }}>
            {current.icon}
          </div>
        </div>

        {/* Titre */}
        <h2 style={{
          color: isDark ? 'white' : '#0a1035',
          fontSize: 24, fontWeight: 800,
          marginBottom: 10, letterSpacing: '-0.5px',
        }}>
          Mode {current.title}
        </h2>

        {/* Description */}
        <p style={{
          color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
          fontSize: 14, lineHeight: 1.7, marginBottom: 32,
          minHeight: 48,
        }}>
          {current.desc}
        </p>

        {/* Navigation */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', alignItems: 'center' }}>
          {step > 0 && (
            <button onClick={goPrev} style={{
              width: 42, height: 42, borderRadius: 12, border: `1px solid ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'}`,
              background: 'transparent', color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
          )}

          {step < STEPS.length - 1 ? (
            <>
              <button onClick={onClose} style={{
                padding: '12px 20px', borderRadius: 12,
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
                background: 'transparent', color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
                cursor: 'pointer', fontSize: 13, fontWeight: 500,
                transition: 'all 0.2s',
              }}>
                Passer
              </button>
              <button onClick={goNext} style={{
                padding: '12px 28px', borderRadius: 12, border: 'none',
                background: current.gradient, color: 'white',
                cursor: 'pointer', fontSize: 14, fontWeight: 600,
                boxShadow: `0 8px 25px ${current.accent}40`,
                transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                Suivant
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </>
          ) : (
            <button onClick={onClose} style={{
              padding: '14px 36px', borderRadius: 14, border: 'none',
              background: current.gradient, color: 'white',
              cursor: 'pointer', fontSize: 15, fontWeight: 700,
              boxShadow: `0 10px 30px ${current.accent}50`,
              transition: 'all 0.2s',
              animation: 'btnGlow 2s ease-in-out infinite',
            }}>
              Commencer
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes ringSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes iconPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes particleFloat {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.2; }
          50% { transform: translateY(-20px) scale(1.5); opacity: 0.4; }
        }
        @keyframes btnGlow {
          0%, 100% { box-shadow: 0 10px 30px ${current.accent}50; }
          50% { box-shadow: 0 10px 50px ${current.accent}80; }
        }
      `}</style>
    </div>
  );
}