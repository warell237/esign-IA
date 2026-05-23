'use client';

import { useState } from 'react';
import ChatInterface from '../../components/ChatInterface';
import SubscriptionGuard from '../../components/SubscriptionGuard';
import { useTheme } from '../../providers';

export default function BusinessPage({ user, userData }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [weeklyStrategy] = useState(
    'Cette semaine : Proposez vos services de creation de CV et lettres de motivation aux etudiants de votre promo via WhatsApp.'
  );

  const businessSuggestions = [
    'Comment vendre sur Alibaba depuis le Cameroun ?',
    'Strategie dropshipping avec Pinduoduo',
    'Idees e-commerce rentables a Sangmelima',
    'Comment creer une boutique en ligne ?',
    'Freelance en programmation : par ou commencer ?',
    'Marketing digital pour petits commerces',
    'Vendre des logos et designs UI/UX',
    'Quels produits importes se vendent bien ?',
  ];

  const c = {
    border: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
    text: isDark ? '#ffffff' : '#0a1035',
    text2: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
    accent: '#ff6b6b',
    bgCard: isDark ? 'rgba(8,8,32,0.8)' : 'rgba(255,255,255,0.8)',
    accentLight: isDark ? 'rgba(255,107,107,0.1)' : 'rgba(255,107,107,0.05)',
  };

  return (
    <SubscriptionGuard userId={user?.uid}>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', fontFamily: 'Arial, sans-serif' }}>

        {/* Bandeau Business */}
        <div style={{
          padding: '16px 20px', borderBottom: `1px solid ${c.border}`,
          background: c.bgCard, backdropFilter: 'blur(20px)', flexShrink: 0,
        }}>
          {/* Titre */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <img src="/icon-192.png" alt="ESIGN" style={{ width: 32, height: 32, borderRadius: 6, objectFit: 'contain' }} />
            <span style={{ color: c.text, fontSize: 17, fontWeight: 700 }}>Mode Business</span>
          </div>

          {/* Strategie de la semaine */}
          <div style={{
            padding: '14px 16px', borderRadius: 12,
            background: c.accentLight,
            border: `1px solid ${c.accent}30`,
          }}>
            <span style={{
              color: c.accent, fontSize: 10, fontWeight: 600,
              textTransform: 'uppercase', letterSpacing: 1.5,
            }}>
              Strategie de la semaine
            </span>
            <p style={{ color: c.text, fontSize: 13, margin: '6px 0 0 0', lineHeight: 1.5 }}>
              {weeklyStrategy}
            </p>
          </div>
        </div>

        {/* Chat */}
        <div style={{ flex: 1, minHeight: 0 }}>
          <ChatInterface
            userId={user?.uid}
            mode="business"
            isDark={isDark}
            placeholder="Comment generer des revenus avec vos competences ?"
            suggestions={businessSuggestions}
          />
        </div>
      </div>
    </SubscriptionGuard>
  );
}