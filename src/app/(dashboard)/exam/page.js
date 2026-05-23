'use client';

import { useState } from 'react';
import ChatInterface from '../../components/ChatInterface';
import SubscriptionGuard from '../../components/SubscriptionGuard';
import { useTheme } from '../../providers';

export default function ExamPage({ user, userData }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [selectedMatiere, setSelectedMatiere] = useState('');
  const [difficulty, setDifficulty] = useState('moyen');
  const [stats] = useState({
    exercisesDone: 24,
    averageScore: 13.5,
    bestMatiere: 'Programmation',
  });

  const matieres = [
    'Mathematiques',
    'Programmation',
    'Reseaux',
    'Base de donnees',
    'Systemes embarques',
    'Design UI/UX',
    'Sociotechnique',
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
    bgCard: isDark ? 'rgba(8,8,32,0.8)' : 'rgba(255,255,255,0.8)',
  };

  return (
    <SubscriptionGuard userId={user?.uid}>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', fontFamily: 'Arial, sans-serif' }}>

        {/* Bandeau Examen */}
        <div style={{
          padding: '16px 20px', borderBottom: `1px solid ${c.border}`,
          background: c.bgCard, backdropFilter: 'blur(20px)', flexShrink: 0,
        }}>
          {/* Titre */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <img src="/icon-192.png" alt="ESIGN" style={{ width: 32, height: 32, borderRadius: 6, objectFit: 'contain' }} />
              <span style={{ color: c.text, fontSize: 17, fontWeight: 700 }}>Mode Examen</span>
            </div>
            <span style={{ color: c.text2, fontSize: 12 }}>
              {stats.exercisesDone} exercices - Moy: {stats.averageScore}/20
            </span>
          </div>

          {/* Controles */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Select matiere */}
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

            {/* Difficultes */}
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

        {/* Chat */}
        <div style={{ flex: 1, minHeight: 0 }}>
          <ChatInterface
            userId={user?.uid}
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