'use client';

import { useState } from 'react';
import { useTheme } from '../providers';

const plans = [
  {
    id: 'monthly',
    name: 'Premium Mensuel',
    price: '1 000 FCFA',
    priceRaw: 1000,
    duration: '30 jours',
    popular: false,
  },
  {
    id: 'yearly',
    name: 'Premium Annuel',
    price: '10 000 FCFA',
    priceRaw: 10000,
    duration: '365 jours',
    popular: true,
    savings: 'Economisez 2 000 FCFA',
  },
];

export default function PaymentModal({ userId, isOpen, onClose, onSuccess }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [selectedPlan, setSelectedPlan] = useState('yearly');
  const [paymentMethod, setPaymentMethod] = useState('orange-money');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handlePayment = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    if (!phoneNumber || phoneNumber.length < 9) {
      setError('Numero de telephone valide requis');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/subscription/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, plan: selectedPlan, paymentMethod, phoneNumber }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(data.message);
        setTimeout(() => { onSuccess && onSuccess(data); onClose(); }, 2000);
      } else {
        setError(data.error || 'Erreur de paiement');
      }
    } catch (err) {
      setError('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const c = {
    text: isDark ? '#ffffff' : '#0a1035',
    text2: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
    mute: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)',
    accent: '#4488ff',
    cardBg: isDark ? 'rgba(8,8,32,0.95)' : 'rgba(255,255,255,0.95)',
    border: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
    inputBg: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
    inputBorder: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
    error: '#ff4455',
    success: '#00cc88',
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, fontFamily: 'Arial, sans-serif' }}>
      
      {/* Overlay */}
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0,
        background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)',
      }} />

      {/* Modal */}
      <div style={{
        position: 'relative', zIndex: 10, width: '100%', maxWidth: 440,
        padding: '28px 24px', borderRadius: 20,
        background: c.cardBg, backdropFilter: 'blur(30px)',
        border: `1px solid ${c.border}`,
        boxShadow: isDark ? '0 30px 60px rgba(0,0,0,0.5)' : '0 30px 60px rgba(0,0,0,0.1)',
        maxHeight: '90vh', overflowY: 'auto',
        animation: 'modalIn 0.25s ease',
      }}>
        
        {/* Titre */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <img
            src="/icon-192.png"
            alt="ESIGN"
            style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'contain', marginBottom: 12 }}
          />
          <h2 style={{ color: c.text, fontSize: 19, fontWeight: 700, margin: '0 0 4px' }}>
            Choisissez votre plan
          </h2>
          <p style={{ color: c.mute, fontSize: 12, margin: 0 }}>
            Debloquez toutes les fonctionnalites
          </p>
        </div>

        {/* Plans */}
        <div style={{ marginBottom: 20 }}>
          {plans.map(plan => (
            <button
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              style={{
                width: '100%', textAlign: 'left', padding: '14px 16px', borderRadius: 12,
                border: selectedPlan === plan.id ? `2px solid ${c.accent}` : `1px solid ${c.border}`,
                background: selectedPlan === plan.id
                  ? (isDark ? 'rgba(68,136,255,0.1)' : 'rgba(68,136,255,0.05)')
                  : 'transparent',
                marginBottom: 8, cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ color: c.text, fontSize: 14, fontWeight: 600, marginBottom: 2 }}>
                    {plan.name}
                  </div>
                  <div style={{ color: c.mute, fontSize: 11 }}>{plan.duration}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: c.accent, fontSize: 18, fontWeight: 700 }}>{plan.price}</div>
                  {plan.savings && (
                    <div style={{ color: '#00cc88', fontSize: 10, fontWeight: 600, marginTop: 2 }}>
                      {plan.savings}
                    </div>
                  )}
                </div>
              </div>
              {plan.popular && (
                <span style={{
                  display: 'inline-block', marginTop: 8, padding: '3px 10px', borderRadius: 12,
                  background: c.accent, color: 'white', fontSize: 10, fontWeight: 600,
                }}>
                  Le plus populaire
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Methode de paiement */}
        <div style={{ marginBottom: 16 }}>
          <span style={{ color: c.text2, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, display: 'block' }}>
            Methode de paiement
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => setPaymentMethod('orange-money')}
              style={{
                flex: 1, padding: '12px', borderRadius: 10, textAlign: 'center',
                border: paymentMethod === 'orange-money' ? '2px solid #f97316' : `1px solid ${c.border}`,
                background: paymentMethod === 'orange-money' ? 'rgba(249,115,22,0.1)' : 'transparent',
                color: paymentMethod === 'orange-money' ? '#f97316' : c.text2,
                fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
              }}
            >
              Orange Money
            </button>
            <button
              onClick={() => setPaymentMethod('mtn-momo')}
              style={{
                flex: 1, padding: '12px', borderRadius: 10, textAlign: 'center',
                border: paymentMethod === 'mtn-momo' ? '2px solid #eab308' : `1px solid ${c.border}`,
                background: paymentMethod === 'mtn-momo' ? 'rgba(234,179,8,0.1)' : 'transparent',
                color: paymentMethod === 'mtn-momo' ? '#eab308' : c.text2,
                fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
              }}
            >
              MTN MoMo
            </button>
          </div>
        </div>

        {/* Telephone */}
        <div style={{ marginBottom: 16 }}>
          <span style={{ color: c.text2, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, display: 'block' }}>
            Numero {paymentMethod === 'orange-money' ? 'Orange Money' : 'MTN MoMo'}
          </span>
          <input
            type="tel"
            value={phoneNumber}
            onChange={e => setPhoneNumber(e.target.value)}
            placeholder="Ex: 691234567"
            style={{
              width: '100%', padding: '12px 14px', borderRadius: 10,
              border: `1px solid ${c.inputBorder}`, background: c.inputBg,
              color: c.text, fontSize: 14, outline: 'none', boxSizing: 'border-box',
            }}
            onFocus={e => e.target.style.borderColor = c.accent}
            onBlur={e => e.target.style.borderColor = c.inputBorder}
          />
        </div>

        {/* Messages */}
        {error && (
          <div style={{
            padding: '10px 14px', borderRadius: 10, marginBottom: 12,
            background: 'rgba(255,68,85,0.1)', border: '1px solid rgba(255,68,85,0.2)',
            color: '#ff4455', fontSize: 12,
          }}>
            {error}
          </div>
        )}
        {success && (
          <div style={{
            padding: '10px 14px', borderRadius: 10, marginBottom: 12,
            background: 'rgba(0,204,136,0.1)', border: '1px solid rgba(0,204,136,0.2)',
            color: '#00cc88', fontSize: 12,
          }}>
            {success}
          </div>
        )}

        {/* Boutons */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: '13px', borderRadius: 10,
              border: `1px solid ${c.border}`, background: 'transparent',
              color: c.text2, fontWeight: 500, fontSize: 13, cursor: 'pointer',
            }}
          >
            Annuler
          </button>
          <button
            onClick={handlePayment}
            disabled={loading}
            style={{
              flex: 1.5, padding: '13px', borderRadius: 10, border: 'none',
              background: loading ? 'rgba(68,136,255,0.4)' : 'linear-gradient(135deg, #4488ff, #3366cc)',
              color: 'white', fontWeight: 600, fontSize: 13,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? 'Paiement en cours...' : `Payer ${plans.find(p => p.id === selectedPlan)?.price}`}
          </button>
        </div>

        <p style={{ textAlign: 'center', color: c.mute, fontSize: 10, marginTop: 12 }}>
          Paiement securise via Orange Money et MTN Mobile Money
        </p>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}