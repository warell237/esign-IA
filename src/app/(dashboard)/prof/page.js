'use client';

import { useState } from 'react';
import ChatInterface from '../../components/ChatInterface';
import { useTheme } from '../../providers';

export default function ProfPage({ user, userData }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { label: 'Filieres', query: 'Quelles sont les filieres a ESIGN ?' },
    { label: 'Programmes', query: 'Programme detaille de ma filiere' },
    { label: 'Professeurs', query: 'Liste des professeurs' },
    { label: 'Examens', query: 'Calendrier des examens' },
    { label: 'Campus', query: 'Infos sur le campus de Sangmelima' },
    { label: 'Reglement', query: 'Reglement interieur' },
  ];

  const profSuggestions = [
    'Quelles sont les filieres a ESIGN ?',
    'Programme detaille ISN L2',
    'Calendrier des examens 2026',
    'Liste des professeurs par departement',
    'Reglement interieur de l\'ecole',
    'Comment contacter l\'administration ?',
  ];

  const c = {
    border: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
    text: isDark ? '#ffffff' : '#0a1035',
    text2: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
    mute: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
    accent: '#6699ff',
    bgCard: isDark ? 'rgba(8,8,32,0.8)' : 'rgba(255,255,255,0.8)',
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', fontFamily: 'Arial, sans-serif', overflow: 'hidden' }}>

      {/* Bandeau Prof */}
      <div style={{
        padding: '16px 20px',
         borderBottom: `1px solid ${c.border}`,
        background: c.bgCard, 
        backdropFilter: 'blur(20px)', 
        flexShrink: 0,
        position: 'sticky',  
          top: 0,             
          zIndex: 5,
      }}>
        {/* Titre */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <img src="/icon-192.png" alt="ESIGN" style={{ width: 32, height: 32, borderRadius: 6, objectFit: 'contain' }} />
          <span style={{ color: c.text, fontSize: 17, fontWeight: 700 }}>Informations ESIGN</span>
        </div>

        {/* Barre de recherche */}
        <div style={{ position: 'relative', marginBottom: 12 }}>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Rechercher une information sur ESIGN..."
            style={{
              width: '100%', padding: '12px 16px 12px 42px', borderRadius: 12,
              border: `1px solid ${c.border}`,
              background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
              color: c.text, fontSize: 13, outline: 'none', boxSizing: 'border-box',
            }}
          />
          <svg
            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: c.mute }}
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>

        {/* Categories */}
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
          {categories.map(cat => (
            <button
              key={cat.label}
              onClick={() => setSearchQuery(cat.query)}
              style={{
                padding: '8px 14px', borderRadius: 8, whiteSpace: 'nowrap',
                border: `1px solid ${c.border}`,
                background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                color: c.text2, fontSize: 12, cursor: 'pointer',
                transition: 'all 0.15s', flexShrink: 0,
              }}
              onMouseEnter={e => { e.target.style.borderColor = c.accent; e.target.style.color = c.accent; }}
              onMouseLeave={e => { e.target.style.borderColor = c.border; e.target.style.color = c.text2; }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chat */}
      <div style={{ flex: 1, minHeight: 0 }}>
        <ChatInterface
          userId={user?.uid}
          mode="prof"
          isDark={isDark}
          initialMessages={searchQuery ? [{ role: 'user', content: searchQuery, id: 1 }] : []}
          placeholder="Posez une question sur ESIGN..."
          suggestions={profSuggestions}
          showQuota={false}
        />
      </div>
    </div>
  );
}