// ============================================
// src/app/components/PremiumPopup.js
// ============================================

'use client';

export default function PremiumPopup({ isDark, onClose, onSubscribe }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 250,
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20,
    }}>
      <div style={{
        background: isDark ? 'rgba(10,15,40,0.98)' : 'white',
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
        borderRadius: 24, padding: '32px 28px', maxWidth: 360, width: '100%',
        textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
      }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ffb347" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 16 }}>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
        <h3 style={{ color: isDark ? 'white' : '#0a1035', fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
          Passez Premium
        </h3>
        <p style={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.55)', fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
          Vous avez utilise toutes vos questions gratuites aujourd&apos;hui. Passez Premium pour un acces illimite et toutes les fonctionnalites.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          <button onClick={onClose} style={{
            padding: '10px 18px', borderRadius: 10,
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'}`,
            background: 'transparent', color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
            cursor: 'pointer', fontSize: 13, fontWeight: 500,
          }}>
            Plus tard
          </button>
          <button onClick={onSubscribe} style={{
            padding: '10px 22px', borderRadius: 10, border: 'none',
            background: 'linear-gradient(135deg, #ffb347, #ff8c00)',
            color: 'white', cursor: 'pointer', fontSize: 13, fontWeight: 600,
          }}>
            Voir les offres
          </button>
        </div>
      </div>
    </div>
  );
}