'use client';

import { useState, useRef, useEffect } from 'react';
import ChatInterface from '../../components/ChatInterface';
import SubscriptionGuard from '../../components/SubscriptionGuard';
import { useTheme } from '../../providers';
import { supabase } from '../../lib/supabase';
import { useUser } from '../layout';

const HEADER_GENERAL = 48;

export default function ExamPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const bandeauRef = useRef(null);
  const [bandeauHeight, setBandeauHeight] = useState(160);
  const { user, userData } = useUser();

  const [selectedMatiere, setSelectedMatiere] = useState('');
  const [difficulty, setDifficulty] = useState('moyen');
  const [stats, setStats] = useState({
    exercisesDone: 0,
    averageScore: 0,
    bestMatiere: '-',
  });
  const [loading, setLoading] = useState(true);

  const matieres = [
    'Mathematiques', 'Programmation', 'Reseaux',
    'Base de donnees', 'Systemes embarques', 'Design UI/UX', 'Sociotechnique',
  ];

  const difficulties = [
    { value: 'facile', label: 'Facile' },
    { value: 'moyen', label: 'Moyen' },
    { value: 'difficile', label: 'Difficile' },
    { value: 'examen', label: 'Examen blanc' },
  ];

  const examSuggestions = [
    'Genere un exercice sur les pointeurs en C',
    'QCM algorithmique niveau L2',
    'Sujet type examen reseaux',
    'Corrige ma reponse sur les boucles',
    'Exercice base de donnees SQL',
    'Probleme mathematiques discretes',
  ];

  const c = {
    border: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
    text: isDark ? '#ffffff' : '#0a1035',
    text2: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
    mute: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
    accent: '#ffb347',
    bgCard: isDark ? 'rgba(8,8,32,0.95)' : 'rgba(255,255,255,0.95)',
  };

  // Charger les stats depuis Supabase
  useEffect(() => {
    if (!user) return;

    supabase
      .from('users')
      .select('exam_done, exam_average, exam_best_matiere')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setStats({
            exercisesDone: data.exam_done || 0,
            averageScore: data.exam_average || 0,
            bestMatiere: data.exam_best_matiere || '-',
          });
        }
        setLoading(false);
      });
  }, [user]);

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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <img src="/icon-192.png" alt="ESIGN" style={{ width: 32, height: 32, borderRadius: 6, objectFit: 'contain' }} />
              <span style={{ color: c.text, fontSize: 17, fontWeight: 700 }}>Mode Examen</span>
            </div>
            <span style={{ color: c.text2, fontSize: 12 }}>
              {loading ? 'Chargement...' : `${stats.exercisesDone} exercices - Moy: ${stats.averageScore}/20`}
            </span>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            <select
              value={selectedMatiere}
              onChange={e => setSelectedMatiere(e.target.value)}
              style={{
                padding: '10px 14px', borderRadius: 10,
                border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.15)',
                background: isDark ? '#000000' : '#ffffff',
                color: c.text, fontSize: 13, outline: 'none', cursor: 'pointer',
              }}
            >
              <option value="">Toutes les matieres</option>
              {matieres.map(m => <option key={m} value={m}>{m}</option>)}
            </select>

            <div style={{ display: 'flex', gap: 4 }}>
              {difficulties.map(d => (
                <button
                  key={d.value}
                  onClick={() => setDifficulty(d.value)}
                  style={{
                    padding: '8px 14px', borderRadius: 8, border: 'none',
                    background: difficulty === d.value ? c.accent : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'),
                    color: difficulty === d.value ? '#000' : c.text2,
                    fontSize: 12, fontWeight: difficulty === d.value ? 600 : 400,
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
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
            mode="exam"
            isDark={isDark}
            placeholder={`Exercice ${difficulty}${selectedMatiere ? ` en ${selectedMatiere}` : ''}...`}
            suggestions={examSuggestions}
          />
        </div>
      </div>
    </SubscriptionGuard>
  );
}