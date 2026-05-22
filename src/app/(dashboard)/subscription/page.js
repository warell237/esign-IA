'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PaymentModal from '../../components/PaymentModal';
import { useTheme } from '../../providers';

export default function SubscriptionPage({ user, userData }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('yearly');
  const router = useRouter();

  const currentPlan = userData?.subscription?.plan || 'free';

  const plans = [
    {
      id: 'monthly',
      name: 'Mensuel',
      price: '1 000',
      duration: '/mois',
      savings: null,
      features: [
        'Questions illimitees',
        'Tous les modes disponibles',
        'Historique complet',
        'Support prioritaire',
      ],
      popular: false,
    },
    {
      id: 'yearly',
      name: 'Annuel',
      price: '10 000',
      duration: '/an',
      savings: 'Economisez 2 000 FCFA',
      features: [
        'Tout le plan Mensuel',
        '2 mois offerts',
        'Badge Premium sur votre profil',
        'Acces anticipe aux nouveautes',
      ],
      popular: true,
    },
  ];

  const c = {
    bg: isDark ? '#000010' : '#f2f5ff',
    border: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
    text: isDark ? '#ffffff' : '#0a1035',
    text2: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
    mute: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)',
    accent: '#4488ff',
    success: '#00cc88',
    cardBg: isDark ? 'rgba(8,8,32,0.7)' : 'rgba(255,255,255,0.7)',
  };

  return (
    <div style={{
      height: '100%', overflowY: 'auto', padding: '24px 20px',
      fontFamily: 'Arial, sans-serif',
    }}>
      
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        
        {/* Entete */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <img
            src="/icône PWA 192x192.png"
            alt="ESIGN"
            style={{ width: 48, height: 48, borderRadius: 10, objectFit: 'contain', marginBottom: 16 }}
          />
          <h1 style={{ color: c.text, fontSize: 22, fontWeight: 700, marginBottom: 6 }}>
            Choisissez votre plan
          </h1>
          <p style={{ color: c.mute, fontSize: 13 }}>
            Debloquez tout le potentiel d&apos;ESIGN AI
          </p>
        </div>

        {/* Plans */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16,
          marginBottom: 24,
        }}>
          {plans.map(plan => {
            const isCurrent = currentPlan === 'premium' && userData?.subscription?.planType === plan.id;
            return (
              <div
                key={plan.id}
                style={{
                  padding: '24px 20px', borderRadius: 16,
                  background: c.cardBg, backdropFilter: 'blur(30px)',
                  border: plan.popular ? `2px solid ${c.accent}` : `1px solid ${c.border}`,
                  position: 'relative',
                }}
              >
                {/* Badge */}
                {plan.popular && (
                  <span style={{
                    position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                    padding: '5px 16px', borderRadius: 20,
                    background: c.accent, color: 'white',
                    fontSize: 11, fontWeight: 600,
                  }}>
                    Le plus populaire
                  </span>
                )}

                {/* Nom */}
                <h3 style={{ color: c.text, fontSize: 17, fontWeight: 700, marginBottom: 8 }}>
                  {plan.name}
                </h3>

                {/* Prix */}
                <div style={{ marginBottom: 6 }}>
                  <span style={{ color: c.accent, fontSize: 32, fontWeight: 800 }}>
                    {plan.price}
                  </span>
                  <span style={{ color: c.mute, fontSize: 14 }}>
                    {' '}FCFA{plan.duration}
                  </span>
                </div>

                {/* Economie */}
                {plan.savings && (
                  <span style={{
                    display: 'inline-block', padding: '4px 10px', borderRadius: 6,
                    background: isDark ? 'rgba(0,204,136,0.1)' : 'rgba(0,204,136,0.06)',
                    color: c.success, fontSize: 11, fontWeight: 600, marginBottom: 14,
                  }}>
                    {plan.savings}
                  </span>
                )}
                {!plan.savings && <div style={{ marginBottom: 14 }} />}

                {/* Features */}
                <div style={{ marginBottom: 20 }}>
                  {plan.features.map((f, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '6px 0', color: c.text2, fontSize: 12.5,
                    }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c.success} strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {f}
                    </div>
                  ))}
                </div>

                {/* Bouton */}
                <button
                  onClick={() => {
                    if (!isCurrent) {
                      setSelectedPlan(plan.id);
                      setShowPayment(true);
                    }
                  }}
                  style={{
                    width: '100%', padding: '12px', borderRadius: 10, border: 'none',
                    background: isCurrent
                      ? (isDark ? 'rgba(0,204,136,0.12)' : 'rgba(0,204,136,0.08)')
                      : plan.popular
                        ? 'linear-gradient(135deg, #4488ff, #3366cc)'
                        : 'transparent',
                    border: isCurrent ? `1px solid rgba(0,204,136,0.3)` : plan.popular ? 'none' : `1px solid ${c.border}`,
                    color: isCurrent ? c.success : plan.popular ? 'white' : c.text2,
                    fontWeight: 600, fontSize: 13, cursor: isCurrent ? 'default' : 'pointer',
                  }}
                >
                  {isCurrent ? 'Plan actuel' : currentPlan === 'premium' ? 'Changer' : 'Choisir'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Info paiement */}
        <div style={{
          textAlign: 'center', padding: 16, borderRadius: 12,
          background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.015)',
          border: `1px solid ${c.border}`,
        }}>
          <p style={{ color: c.mute, fontSize: 12, margin: 0 }}>
            Paiement securise via Orange Money et MTN Mobile Money
          </p>
        </div>
      </div>

      {/* Modal */}
      <PaymentModal
        userId={user?.uid}
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        onSuccess={() => router.refresh()}
      />
    </div>
  );
}