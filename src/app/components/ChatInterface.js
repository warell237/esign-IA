'use client';

import { useState, useRef, useEffect } from 'react';

const THEMES = {
  chat: {
    welcomeTitle: 'ESIGN AI',
    welcomeText: 'Votre assistant pour les etudes, examens et la vie a ESIGN.',
    accent: '#4488ff',
    accentGradient: 'linear-gradient(135deg, #4488ff, #3366cc)',
  },
  mentor: {
    welcomeTitle: 'Mode Mentor',
    welcomeText: 'Je suis votre coach personnel. Discutons de vos objectifs et de votre progression.',
    accent: '#00cc88',
    accentGradient: 'linear-gradient(135deg, #00cc88, #009966)',
  },
  exam: {
    welcomeTitle: 'Mode Examen',
    welcomeText: 'Generez des exercices, travaillez sur des sujets types et progressez.',
    accent: '#ffb347',
    accentGradient: 'linear-gradient(135deg, #ffb347, #ff8c00)',
  },
  business: {
    welcomeTitle: 'Mode Business',
    welcomeText: 'Decouvrez comment generer des revenus avec vos competences numeriques.',
    accent: '#ff6b6b',
    accentGradient: 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
  },
  prof: {
    welcomeTitle: 'Mode Prof',
    welcomeText: 'Trouvez toutes les informations sur ESIGN, les filieres et les cours.',
    accent: '#6699ff',
    accentGradient: 'linear-gradient(135deg, #6699ff, #4477dd)',
  },
};

export default function ChatInterface({
  userId,
  mode = 'chat',
  initialMessages = [],
  placeholder = 'Ecrivez votre message...',
  onSend,
  showQuota = true,
  isDark = true,
  headerContent,
  suggestions = [],
}) {
  const theme = THEMES[mode] || THEMES.chat;
  const [isMobile, setIsMobile] = useState(false);

  const c = {
    border: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
    text: isDark ? '#ffffff' : '#0a1035',
    text2: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
    mute: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
    userBubble: `linear-gradient(135deg, ${theme.accent}, ${theme.accent}dd)`,
    aiBg: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.025)',
    aiBorder: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
    inputBg: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
    inputBorder: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
  };

  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [quota, setQuota] = useState(null);
  const [error, setError] = useState('');
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    const handleFocus = () => {
      setTimeout(() => {
        if (messagesContainerRef.current) {
          messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
        // Force scroll de l'input dans la vue sur iOS
        el.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 350);
    };
    el.addEventListener('focus', handleFocus);
    return () => el.removeEventListener('focus', handleFocus);
  }, []);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { role: 'user', content: text, id: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setError('');

    try {
      if (onSend) {
        await onSend(text, messages, (reply) => {
          setMessages(prev => [...prev, { role: 'ai', content: reply, id: Date.now() + 1 }]);
        });
      } else {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: text, mode, userId, history: messages.slice(-20) }),
        });
        const data = await res.json();
        if (data.success) {
          setMessages(prev => [...prev, { role: 'ai', content: data.reply, id: Date.now() + 1 }]);
          if (data.quota) setQuota(data.quota);
        } else if (data.error === 'QUOTA_EXCEEDED') {
          setError(data.message);
        } else {
          setError(data.error || 'Erreur');
        }
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Arial, sans-serif',
      minHeight: 0,
      overflow: 'hidden',   // ← AJOUTÉ
    }}>

      {showQuota && quota && (
        <div style={{
          padding: '6px 14px', textAlign: 'center', flexShrink: 0,
          background: isDark ? 'rgba(68,136,255,0.1)' : 'rgba(68,136,255,0.05)',
          color: theme.accent, fontSize: 11, borderBottom: `1px solid ${c.border}`,
        }}>
          {quota.plan === 'premium' ? 'Premium - Acces illimite' : `Questions restantes : ${quota.questionsRemaining}`}
        </div>
      )}

      {headerContent}

      {error && (
        <div style={{
          padding: '10px 14px', background: 'rgba(255,68,85,0.1)', color: '#ff4455',
          fontSize: 12, textAlign: 'center', borderBottom: '1px solid rgba(255,68,85,0.2)', flexShrink: 0,
        }}>
          {error}
          <button onClick={() => setError('')} style={{
            marginLeft: 8, textDecoration: 'underline', color: '#ff4455',
            background: 'none', border: 'none', cursor: 'pointer',
          }}>Fermer</button>
        </div>
      )}

      {/* Zone messages - SEULE zone qui scroll */}
      <div ref={messagesContainerRef} style={{
        flex: 1,
        overflowY: 'auto',
        padding: isMobile ? '12px 10px' : '20px 20px',
        WebkitOverflowScrolling: 'touch',
        minHeight: 0,
        overscrollBehavior: 'contain',
      }}>

        {messages.length === 0 && (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', minHeight: '100%', textAlign: 'center',
            padding: '20px 0',
          }}>
            <img src="/icon-192.png" alt="ESIGN" style={{ width: isMobile ? 48 : 56, height: isMobile ? 48 : 56, borderRadius: 14, objectFit: 'contain', marginBottom: 16 }} />
            <h1 style={{ color: c.text, fontSize: isMobile ? 16 : 18, fontWeight: 700, marginBottom: 6 }}>{theme.welcomeTitle}</h1>
            <p style={{ color: c.mute, fontSize: isMobile ? 12 : 13, maxWidth: 360, lineHeight: 1.6, marginBottom: 18, padding: '0 8px' }}>{theme.welcomeText}</p>
            {suggestions.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', maxWidth: 440, padding: '0 8px' }}>
                {suggestions.map((s, i) => (
                  <button key={i} onClick={() => { setInput(s); inputRef.current?.focus(); }}
                    style={{ padding: '8px 14px', borderRadius: 20, border: `1px solid ${c.border}`, background: 'transparent', color: c.text2, fontSize: 12, cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
                    onMouseEnter={e => { e.target.style.borderColor = theme.accent; e.target.style.color = theme.accent; }}
                    onMouseLeave={e => { e.target.style.borderColor = c.border; e.target.style.color = c.text2; }}>
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {messages.map(msg => (
          <div key={msg.id} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: 10, animation: 'msgIn 0.25s ease' }}>
            {msg.role === 'ai' && (
              <img src="/icon-192.png" alt="ESIGN" style={{ width: 26, height: 26, borderRadius: 6, objectFit: 'contain', flexShrink: 0, marginRight: 8, marginTop: 2 }} />
            )}
            <div style={{
              maxWidth: isMobile ? '88%' : '72%', padding: '10px 14px',
              borderRadius: msg.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
              background: msg.role === 'user' ? c.userBubble : c.aiBg,
              color: msg.role === 'user' ? 'white' : c.text, fontSize: 13.5, lineHeight: 1.6,
              border: msg.role === 'ai' ? `1px solid ${c.aiBorder}` : 'none',
              wordBreak: 'break-word', overflowWrap: 'break-word',
            }}>{msg.content}</div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 10 }}>
            <img src="/icon-192.png" alt="ESIGN" style={{ width: 26, height: 26, borderRadius: 6, objectFit: 'contain', marginRight: 8 }} />
            <div style={{ padding: '12px 18px', borderRadius: '14px 14px 14px 4px', background: c.aiBg, border: `1px solid ${c.aiBorder}`, display: 'flex', gap: 4 }}>
              {[0, 1, 2].map(i => (
                <span key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: theme.accent, animation: `bounce 1.4s infinite ${i * 0.2}s` }} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input fixe en bas */}
      <div style={{ padding: isMobile ? '6px 8px 8px' : '12px 16px 16px', flexShrink: 0 }}>
        <div style={{
          width: '100%', maxWidth: 720, margin: '0 auto', display: 'flex', alignItems: 'flex-end', gap: 8,
          background: c.inputBg, borderRadius: 18, border: `1.5px solid ${c.inputBorder}`,
          padding: '4px 4px 4px 16px',
        }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder={placeholder}
            rows={1}
            style={{
              flex: 1, border: 'none', outline: 'none', background: 'transparent',
              color: c.text,
              fontSize: 16,          // ← 16px minimum pour éviter zoom iOS
              resize: 'none', maxHeight: 100,
              fontFamily: 'inherit', padding: '8px 0',
            }}
          />
          <button onClick={handleSend} disabled={!input.trim() || loading}
            style={{
              width: 36, height: 36, borderRadius: 12, border: 'none',
              background: input.trim() ? theme.accentGradient : 'transparent',
              color: input.trim() ? 'white' : c.mute,
              cursor: input.trim() ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, opacity: input.trim() ? 1 : 0.4,
              boxShadow: input.trim() ? `0 4px 14px ${theme.accent}40` : 'none',
            }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
          </button>
        </div>
        <p style={{ textAlign: 'center', color: c.mute, fontSize: 9, marginTop: 6 }}>
          ESIGN AI peut faire des erreurs. Verifiez les informations importantes.
        </p>
      </div>

      <style>{`
        @keyframes msgIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bounce { 0%, 80%, 100% { transform: scale(0.5); opacity: 0.3; } 40% { transform: scale(1); opacity: 1; } }
      `}</style>
    </div>
  );
}