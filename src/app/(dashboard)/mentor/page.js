'use client';

import { useState } from 'react';
import ChatInterface from '../../components/ChatInterface';
import SubscriptionGuard from '../../components/SubscriptionGuard';
import { useTheme } from '../../providers';

export default function MentorPage({ user, userData }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [progress] = useState({
    sessionsCompleted: 12,
    objectivesAchieved: 5,
    currentStreak: 7,
    progressPercent: 60,
  });

  const mentorSuggestions = [
    'Comment organiser mes revisions ?',
    'Aide-moi a fixer des objectifs',
    'Je veux ameliorer ma moyenne en algorithmique',
    'Plan d\'etude pour les examens',
    'Conseils pour rester motive',
    'Gerer mon temps entre cours et projets',
  ];

  const c = {
    border: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
    text: isDark ? '#ffffff' : '#0a1035',
    text2: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
    mute: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
    accent: '#00cc88',
    bgCard: isDark ? 'rgba(8,8,32,0.8)' : 'rgba(255,255,255,0.8)',
  };

  return (
    <SubscriptionGuard userId={user?.uid}>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', fontFamily: 'Arial, sans-serif',overflow: 'hidden' }}>
        
        {/* Bandeau - FIXE */}
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <img src="/icon-192.png" alt="ESIGN" style={{ width: 32, height: 32, borderRadius: 6, objectFit: 'contain' }} />
              <span style={{ color: c.text, fontSize: 17, fontWeight: 700 }}>Coaching Personnalise</span>
            </div>
            <span style={{ color: c.text2, fontSize: 12 }}>
              {userData?.filiere} {userData?.niveau && `- ${userData.niveau}`}
            </span>
          </div>

          <div style={{ display: 'flex', gap: 28, marginBottom: 14 }}>
            <div>
              <span style={{ color: c.accent, fontSize: 24, fontWeight: 700 }}>{progress.sessionsCompleted}</span>
              <span style={{ display: 'block', color: c.mute, fontSize: 10, textTransform: 'uppercase', marginTop: 2 }}>Sessions</span>
            </div>
            <div>
              <span style={{ color: '#4488ff', fontSize: 24, fontWeight: 700 }}>{progress.objectivesAchieved}</span>
              <span style={{ display: 'block', color: c.mute, fontSize: 10, textTransform: 'uppercase', marginTop: 2 }}>Objectifs</span>
            </div>
            <div>
              <span style={{ color: '#ffb347', fontSize: 24, fontWeight: 700 }}>{progress.currentStreak}</span>
              <span style={{ display: 'block', color: c.mute, fontSize: 10, textTransform: 'uppercase', marginTop: 2 }}>Jours consecutifs</span>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
              <span style={{ color: c.text2, fontSize: 11 }}>Progression globale</span>
              <span style={{ color: c.accent, fontSize: 11, fontWeight: 600 }}>{progress.progressPercent}%</span>
            </div>
            <div style={{ height: 6, borderRadius: 3, background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}>
              <div style={{ height: '100%', width: `${progress.progressPercent}%`, borderRadius: 3, background: 'linear-gradient(90deg, #00cc88, #4488ff)', transition: 'width 1s ease' }} />
            </div>
          </div>
        </div>

        {/* Chat */}
        <div style={{ flex: 1, minHeight: 0 }}>
          <ChatInterface
            userId={user?.uid}
            mode="mentor"
            isDark={isDark}
            placeholder="Parlez de vos objectifs, difficultes, progression..."
            suggestions={mentorSuggestions}
          />
        </div>
      </div>
    </SubscriptionGuard>
  );
}