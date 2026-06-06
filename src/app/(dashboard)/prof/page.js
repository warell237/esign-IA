'use client';

import { useState, useRef, useEffect } from 'react';
import ChatInterface from '../../components/ChatInterface';
import SubscriptionGuard from '../../components/SubscriptionGuard';
import { useTheme } from '../../providers';
import { useUser } from '../layout';

const HEADER_GENERAL = 48;

export default function ProfPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { user, userData } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const bandeauRef = useRef(null);
  const [bandeauHeight, setBandeauHeight] = useState(160);

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
    "Reglement interieur de l'ecole",
    'Comment contacter l\'administration ?',
  ];

  const c = {
    border: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
    text: isDark ? '#ffffff' : '#0a1035',
    text2: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
    mute: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
    accent: '#6699ff',
    bgCard: isDark ? 'rgba(8,8,32,0.95)' : 'rgba(255,255,255,0.95)',
  };

  useEffect(() => {
    if (!bandeauRef.current) return;
    const observer = new ResizeObserver(() => {
      setBandeauHeight(bandeauRef.current?.offsetHeight || 160);
    });
    observer.observe(bandeauRef.current);
    setBandeauHeight(bandeauRef.current.offsetHeight);
    return () => observer.disconnect();
  }, []);

  return (
    <SubscriptionGuard userId={user?.id}>
      <div style={{ height: '100%', position: 'relative', fontFamily: 'Arial, sans-serif' }}>
      
        {/* BANDEAU FIXE */}
      <div
        ref={bandeauRef}
        style={{
          position: 'fixed',
          top: HEADER_GENERAL,
          left: 0,
          right: 0,
          zIndex: 30,
          padding: '16px 20px',
          borderBottom: `1px solid ${c.border}`,
          background: c.bgCard,
          backdropFilter: 'blur(20px)',
          transform: 'translateZ(0)',
          WebkitTransform: 'translateZ(0)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <img src="/icon-192.png" alt="ESIGN" style={{ width: 32, height: 32, borderRadius: 6, objectFit: 'contain' }} />
          <span style={{ color: c.text, fontSize: 17, fontWeight: 700 }}>Informations ESIGN</span>
        </div>

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
              color: c.text, fontSize: 16, outline: 'none', boxSizing: 'border-box',
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
      </div>

      {/* CHAT — commence sous le bandeau */}
      <div style={{
        position: 'absolute',
        top: bandeauHeight,
        left: 0,
        right: 0,
        bottom: 0,
      }}>
        <ChatInterface
          userId={user?.id}
          mode="prof"
          isDark={isDark}
          initialMessages={searchQuery ? [{ role: 'user', content: searchQuery, id: 1 }] : []}
          placeholder="Posez une question sur ESIGN..."
          suggestions={profSuggestions}
          showQuota={false}
        />
      </div>
    </SubscriptionGuard>
  );
}