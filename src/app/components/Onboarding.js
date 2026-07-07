// ============================================
// src/app/components/Onboarding.js
// ============================================

'use client';

import { useState } from 'react';

const STEPS = [
  {
    title: 'Chat',
    desc: 'Posez toutes vos questions sur vos cours, l\'ecole, ou tout autre sujet.',
    accent: '#4488ff',
  },
  {
    title: 'Mentor',
    desc: 'Votre coach personnel pour organiser vos etudes et atteindre vos objectifs.',
    accent: '#00cc88',
  },
  {
    title: 'Examen',
    desc: 'Entrainez-vous avec des exercices, QCM et sujets types.',
    accent: '#ffb347',
  },
  {
    title: 'Business',
    desc: 'Decouvrez comment generer des revenus avec vos competences numeriques.',
    accent: '#ff6b6b',
  },
  {
    title: 'Prof',
    desc: 'Trouvez toutes les informations sur l\'ecole, les filieres et les professeurs.',
    accent: '#6699ff',
  },
];

export default function Onboarding({ isDark, onClose }) {
  const [step, setStep] = useState(0);
  const current = STEPS[step];

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 300,
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20,
    }}>
      <div style={{
        background: isDark ? 'rgba(10,15,40,0.98)' : 'white',
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
        borderRadius: 24, padding: '32px 28px', maxWidth: 380, width: '100%',
        textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
      }}>
        {/* Indicateur étapes */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 24 }}>
          {STEPS.map((_, i) => (
            <div key={i} style={{
              width: i === step ? 24 : 8, height: 8, borderRadius: 4,
              background: i === step ? current.accent : isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease',
            }} />
          ))}
        </div>

        {/* Icône */}
        <div style={{
          width: 64, height: 64, borderRadius: 16,
          background: `${current.accent}20`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px', fontSize: 28,
        }}>
          {step + 1}
        </div>

        {/* Titre */}
        <h2 style={{
          color: isDark ? 'white' : '#0a1035', fontSize: 22, fontWeight: 700,
          marginBottom: 8,
        }}>
          Mode {current.title}
        </h2>

        {/* Description */}
        <p style={{
          color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
          fontSize: 14, lineHeight: 1.6, marginBottom: 28,
        }}>
          {current.desc}
        </p>

        {/* Boutons */}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          {step < STEPS.length - 1 ? (
            <>
              <button onClick={onClose} style={{
                padding: '10px 18px', borderRadius: 10,
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'}`,
                background: 'transparent', color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
                cursor: 'pointer', fontSize: 13, fontWeight: 500,
              }}>
                Passer
              </button>
              <button onClick={() => setStep(step + 1)} style={{
                padding: '10px 22px', borderRadius: 10, border: 'none',
                background: current.accent, color: 'white',
                cursor: 'pointer', fontSize: 13, fontWeight: 600,
              }}>
                Suivant
              </button>
            </>
          ) : (
            <button onClick={onClose} style={{
              padding: '12px 32px', borderRadius: 10, border: 'none',
              background: current.accent, color: 'white',
              cursor: 'pointer', fontSize: 14, fontWeight: 600,
            }}>
              Commencer
            </button>
          )}
        </div>
      </div>
    </div>
  );
}