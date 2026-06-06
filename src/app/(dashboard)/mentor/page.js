'use client';

import { useState, useRef, useEffect } from 'react';
import ChatInterface from '../../components/ChatInterface';
import SubscriptionGuard from '../../components/SubscriptionGuard';
import { useTheme } from '../../providers';
import { supabase } from '../../lib/supabase';
import { useUser } from '../layout';

const HEADER_GENERAL = 48;

export default function MentorPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { user, userData } = useUser();
  const bandeauRef = useRef(null);
  const [bandeauHeight, setBandeauHeight] = useState(160);

  const [progress, setProgress] = useState({
    sessionsCompleted: 0,
    objectivesAchieved: 0,
    currentStreak: 0,
    progressPercent: 0,
  });
  const [loading, setLoading] = useState(true);

  const mentorSuggestions = [
    'Comment organiser mes revisions ?',
    'Aide-moi a fixer des objectifs',
    'Je veux ameliorer ma moyenne en algorithmique',
    "Plan d'etude pour les examens",
    'Conseils pour rester motive',
    'Gerer mon temps entre cours et projets',
  ];

  const c = {
    border: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
    text: isDark ? '#ffffff' : '#0a1035',
    text2: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
    mute: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
    accent: '#00cc88',
    bgCard: isDark ? 'rgba(8,8,32,0.95)' : 'rgba(255,255,255,0.95)',
  };

  // Charger les stats mentor depuis Supabase
  useEffect(() => {
    if (!user) return;

    supabase
      .from('users')
      .select('mentor_sessions, mentor_objectives, mentor_streak, mentor_progress')
      .eq('id', user.id)
      .single()
      .then(({ data, error }) => {
        if (!error && data) {
          setProgress({
            sessionsCompleted: data.mentor_sessions || 0,
            objectivesAchieved: data.mentor_objectives || 0,
            currentStreak: data.mentor_streak || 0,
            progressPercent: data.mentor_progress || 0,
          });
        }
        setLoading(false);
      });
  }, [user]);

  // Observer la hauteur du bandeau
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <img src="/icon-192.png" alt="ESIGN" style={{ width: 32, height: 32, borderRadius: 6, objectFit: 'contain' }} />
              <span style={{ color: c.text, fontSize: 17, fontWeight: 700 }}>Coaching Personnalise</span>
            </div>
            <span style={{ color: c.text2, fontSize: 12 }}>
              {userData?.filiere || ''} {userData?.niveau ? `- ${userData.niveau}` : ''}
            </span>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: 20, color: c.mute }}>Chargement...</div>
          ) : (
            <>
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
            </>
          )}
        </div>

        {/* CHAT */}
        <div style={{
          position: 'absolute',
          top: bandeauHeight,
          left: 0,
          right: 0,
          bottom: 0,
        }}>
          <ChatInterface
            userId={user?.id}
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