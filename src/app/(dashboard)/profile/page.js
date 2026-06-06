'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '../../providers';
import { useUser } from '../layout';

export default function ProfilePage() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { user, userData } = useUser();

  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: userData?.firstName || '',
    lastName: userData?.lastName || '',
    filiere: userData?.filiere || '',
    niveau: userData?.niveau || '',
    phone: userData?.phone || '',
  });

  const handleSave = async () => {
    setEditing(false);
  };

  const c = {
    bg: isDark ? '#000010' : '#f2f5ff',
    border: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
    text: isDark ? '#ffffff' : '#0a1035',
    text2: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
    mute: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)',
    accent: '#4488ff',
    cardBg: isDark ? 'rgba(8,8,32,0.7)' : 'rgba(255,255,255,0.7)',
    inputBg: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
    inputBorder: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
    error: '#ff4455',
    success: '#00cc88',
  };

  const fields = [
    { label: 'Prenom', key: 'firstName' },
    { label: 'Nom', key: 'lastName' },
    { label: 'Filiere', key: 'filiere' },
    { label: 'Niveau', key: 'niveau' },
    { label: 'Telephone', key: 'phone' },
  ];

  return (
    <div style={{
      height: '100%', overflowY: 'auto', padding: '24px 20px',
      fontFamily: 'Arial, sans-serif',
    }}>
      
      {/* Titre */}
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <h1 style={{ color: c.text, fontSize: 22, fontWeight: 700, marginBottom: 24 }}>
          Mon Profil
        </h1>

        {/* Carte Profil */}
        <div style={{
          padding: '24px', borderRadius: 16,
          background: c.cardBg, backdropFilter: 'blur(30px)',
          border: `1px solid ${c.border}`,
          marginBottom: 16,
        }}>
          {/* Avatar + Nom */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: 'linear-gradient(135deg, #4488ff, #3366cc)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontSize: 20, fontWeight: 700, flexShrink: 0,
            }}>
              {user?.displayName?.charAt(0)?.toUpperCase() || 'E'}
            </div>
            <div>
              <h2 style={{ color: c.text, fontSize: 17, fontWeight: 600, margin: '0 0 2px' }}>
                {user?.displayName || 'Etudiant ESIGN'}
              </h2>
              <span style={{ color: c.mute, fontSize: 13 }}>{user?.email}</span>
            </div>
          </div>

          {/* Champs */}
          <div style={{ marginBottom: 20 }}>
            {fields.map(field => (
              <div
                key={field.key}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '12px 0', borderBottom: `1px solid ${c.border}`,
                }}
              >
                <span style={{ color: c.mute, fontSize: 13, fontWeight: 500 }}>
                  {field.label}
                </span>
                {editing ? (
                  <input
                    value={formData[field.key]}
                    onChange={e => setFormData({ ...formData, [field.key]: e.target.value })}
                    style={{
                      width: 180, padding: '8px 12px', borderRadius: 8,
                      border: `1px solid ${c.inputBorder}`,
                      background: c.inputBg, color: c.text,
                      fontSize: 13, outline: 'none', textAlign: 'right',
                    }}
                    onFocus={e => e.target.style.borderColor = c.accent}
                    onBlur={e => e.target.style.borderColor = c.inputBorder}
                  />
                ) : (
                  <span style={{ color: c.text, fontSize: 13, fontWeight: 500 }}>
                    {field.value || 'Non renseigne'}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Boutons */}
          <div style={{ display: 'flex', gap: 10 }}>
            {editing ? (
              <>
                <button
                  onClick={handleSave}
                  style={{
                    flex: 1, padding: '12px', borderRadius: 10, border: 'none',
                    background: 'linear-gradient(135deg, #4488ff, #3366cc)',
                    color: 'white', fontWeight: 600, fontSize: 13, cursor: 'pointer',
                  }}
                >
                  Enregistrer
                </button>
                <button
                  onClick={() => setEditing(false)}
                  style={{
                    flex: 1, padding: '12px', borderRadius: 10,
                    border: `1px solid ${c.border}`, background: 'transparent',
                    color: c.text2, fontWeight: 500, fontSize: 13, cursor: 'pointer',
                  }}
                >
                  Annuler
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditing(true)}
                style={{
                  width: '100%', padding: '12px', borderRadius: 10,
                  border: `1px solid ${c.border}`, background: 'transparent',
                  color: c.text2, fontWeight: 500, fontSize: 13, cursor: 'pointer',
                }}
              >
                Modifier
              </button>
            )}
          </div>
        </div>

        {/* Carte Abonnement */}
        <div style={{
          padding: '24px', borderRadius: 16,
          background: c.cardBg, backdropFilter: 'blur(30px)',
          border: `1px solid ${c.border}`,
          marginBottom: 16,
        }}>
          <h3 style={{ color: c.text, fontSize: 16, fontWeight: 600, marginBottom: 14 }}>
            Abonnement
          </h3>
          
          <div style={{
            padding: 16, borderRadius: 12,
            background: userData?.subscription?.plan === 'premium'
              ? (isDark ? 'rgba(0,204,136,0.08)' : 'rgba(0,204,136,0.04)')
              : (isDark ? 'rgba(68,136,255,0.08)' : 'rgba(68,136,255,0.04)'),
            border: `1px solid ${userData?.subscription?.plan === 'premium' ? 'rgba(0,204,136,0.2)' : 'rgba(68,136,255,0.2)'}`,
            marginBottom: 16,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{
                  color: userData?.subscription?.plan === 'premium' ? c.success : c.accent,
                  fontSize: 15, fontWeight: 700,
                }}>
                  {userData?.subscription?.plan === 'premium' ? 'Premium' : 'Gratuit'}
                </span>
                <span style={{ display: 'block', color: c.mute, fontSize: 12, marginTop: 3 }}>
                  {userData?.subscription?.plan === 'premium'
                    ? `Expire le ${new Date(userData?.subscription?.endDate).toLocaleDateString('fr')}`
                    : `${userData?.subscription?.questionsRemaining || 50} questions restantes aujourd'hui`}
                </span>
              </div>
              <div style={{
                padding: '6px 14px', borderRadius: 6,
                background: userData?.subscription?.plan === 'premium' ? 'rgba(0,204,136,0.15)' : 'rgba(68,136,255,0.15)',
                color: userData?.subscription?.plan === 'premium' ? c.success : c.accent,
                fontSize: 12, fontWeight: 600,
              }}>
                {userData?.subscription?.plan === 'premium' ? 'Actif' : '50 questions/jour'}
              </div>
            </div>
          </div>

          <button
            onClick={() => router.push('/subscription')}
            style={{
              width: '100%', padding: '12px', borderRadius: 10, border: 'none',
              background: 'linear-gradient(135deg, #4488ff, #3366cc)',
              color: 'white', fontWeight: 600, fontSize: 13, cursor: 'pointer',
            }}
          >
            {userData?.subscription?.plan === 'premium' ? 'Gerer mon abonnement' : 'Passer Premium'}
          </button>
        </div>

        {/* Déconnexion */}
        <button
          onClick={() => router.push('/')}
          style={{
            width: '100%', padding: '14px', borderRadius: 12,
            border: `1px solid rgba(255,68,85,0.3)`, background: 'transparent',
            color: c.error, fontWeight: 500, fontSize: 13, cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => e.target.style.background = 'rgba(255,68,85,0.05)'}
          onMouseLeave={e => e.target.style.background = 'transparent'}
        >
          Se deconnecter
        </button>

        <p style={{ textAlign: 'center', color: c.mute, fontSize: 11, marginTop: 16 }}>
          ESIGN AI - Assistant Intelligent
        </p>
      </div>
    </div>
  );
}