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
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);

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
  const [showMenu, setShowMenu] = useState(false);
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

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setMessages(prev => [...prev, {
      role: 'user',
      content: `[Fichier: ${file.name}]`,
      id: Date.now(),
      file: file,
    }]);
  };

  const startRecording = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Reconnaissance vocale non supportee sur ce navigateur.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'fr-FR';
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(prev => (prev + ' ' + transcript).trim());
    };

    recognition.onend = () => setIsRecording(false);
    recognition.onerror = () => setIsRecording(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', fontFamily: 'Arial, sans-serif', minHeight: 0, overflow: 'hidden' }}>
      
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
          <button onClick={() => setError('')} style={{ marginLeft: 8, textDecoration: 'underline', color: '#ff4455', background: 'none', border: 'none', cursor: 'pointer' }}>Fermer</button>
        </div>
      )}

      <div ref={messagesContainerRef} style={{
        flex: 1, overflowY: 'auto', padding: isMobile ? '12px 10px' : '20px 20px',
        WebkitOverflowScrolling: 'touch', minHeight: 0, overscrollBehavior: 'contain',
      }}>
        
        {messages.length === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100%', textAlign: 'center', padding: '20px 0' }}>
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

      {/* Input */}
      <div style={{ padding: isMobile ? '6px 8px 8px' : '12px 16px 16px', flexShrink: 0 }}>
        <div style={{
          width: '100%', maxWidth: 720, margin: '0 auto', display: 'flex', alignItems: 'flex-end', gap: 6,
          background: c.inputBg, borderRadius: 18, border: `1.5px solid ${c.inputBorder}`,
          padding: '4px 4px 4px 8px',
        }}>
          
          {/* Bouton + */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <button onClick={() => setShowMenu(!showMenu)}
              style={{ width: 34, height: 34, borderRadius: 12, border: 'none', background: 'transparent', color: c.mute, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </button>
            {showMenu && (
              <div style={{ position: 'absolute', bottom: '100%', left: 0, marginBottom: 8, padding: 8, borderRadius: 12, minWidth: 170, background: isDark ? 'rgba(8,8,32,0.95)' : 'rgba(255,255,255,0.95)', border: `1px solid ${c.border}`, backdropFilter: 'blur(20px)', display: 'flex', flexDirection: 'column', gap: 2, zIndex: 20 }}>
                <button onClick={() => { document.getElementById('file-upload').click(); setShowMenu(false); }} style={{ padding: '10px 12px', borderRadius: 8, border: 'none', background: 'transparent', color: c.text2, cursor: 'pointer', textAlign: 'left', fontSize: 13 }}>Importer un fichier</button>
                <button onClick={() => { document.getElementById('camera-upload').click(); setShowMenu(false); }} style={{ padding: '10px 12px', borderRadius: 8, border: 'none', background: 'transparent', color: c.text2, cursor: 'pointer', textAlign: 'left', fontSize: 13 }}>Prendre une photo</button>
                <button onClick={() => { document.getElementById('gallery-upload').click(); setShowMenu(false); }} style={{ padding: '10px 12px', borderRadius: 8, border: 'none', background: 'transparent', color: c.text2, cursor: 'pointer', textAlign: 'left', fontSize: 13 }}>Galerie</button>
              </div>
            )}
          </div>

          <input type="file" accept="image/*,.pdf,.doc,.docx,.txt" style={{ display: 'none' }} id="file-upload" onChange={handleFile} />
          <input type="file" accept="image/*" capture="environment" style={{ display: 'none' }} id="camera-upload" onChange={handleFile} />
          <input type="file" accept="image/*" style={{ display: 'none' }} id="gallery-upload" onChange={handleFile} />

          <textarea ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder={placeholder} rows={1}
            style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', color: c.text, fontSize: 16, resize: 'none', maxHeight: 100, fontFamily: 'inherit', padding: '8px 0' }} />

          {/* Micro vocal */}
          <button
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
            onTouchStart={startRecording}
            onTouchEnd={stopRecording}
            style={{
              width: 34, height: 34, borderRadius: 12, border: 'none',
              background: isRecording ? '#ff4455' : 'transparent',
              color: isRecording ? 'white' : c.mute,
              cursor: 'pointer', display: 'flex', alignItems: 'center',
              justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s',
            }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="1" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0014 0"/></svg>
          </button>

          {/* Envoyer */}
          <button onClick={handleSend} disabled={!input.trim() || loading}
            style={{ width: 34, height: 34, borderRadius: 12, border: 'none', background: input.trim() ? theme.accentGradient : 'transparent', color: input.trim() ? 'white' : c.mute, cursor: input.trim() ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, opacity: input.trim() ? 1 : 0.4, boxShadow: input.trim() ? `0 4px 14px ${theme.accent}40` : 'none' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
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