// ============================================
// ChatInterface.js
// ============================================

'use client';

import { useState, useRef, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import MessageActions from './MessageActions';
import Markdown from 'react-markdown';

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

function MarkdownContent({ content, isDark, textColor }) {
  return (
    <>
      <Markdown
        components={{
          p: ({ children }) => (
            <p style={{ margin: '0 0 8px 0', lineHeight: 1.7, color: textColor }}>
              {children}
            </p>
          ),
          strong: ({ children }) => (
            <strong style={{ fontWeight: 700, color: textColor }}>{children}</strong>
          ),
          em: ({ children }) => (
            <em style={{ fontStyle: 'italic', color: textColor }}>{children}</em>
          ),
          h1: ({ children }) => (
            <h1 style={{ fontSize: 18, fontWeight: 700, margin: '12px 0 6px', color: textColor }}>{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 style={{ fontSize: 16, fontWeight: 700, margin: '10px 0 5px', color: textColor }}>{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 style={{ fontSize: 14, fontWeight: 700, margin: '8px 0 4px', color: textColor }}>{children}</h3>
          ),
          ul: ({ children }) => (
            <ul style={{ margin: '6px 0', paddingLeft: 20, color: textColor }}>{children}</ul>
          ),
          ol: ({ children }) => (
            <ol style={{ margin: '6px 0', paddingLeft: 20, color: textColor }}>{children}</ol>
          ),
          li: ({ children }) => (
            <li style={{ margin: '3px 0', lineHeight: 1.6, color: textColor }}>{children}</li>
          ),
          code: ({ inline, children }) => inline ? (
            <code style={{
              background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
              color: isDark ? '#7dd3fc' : '#0369a1',
              padding: '1px 6px', borderRadius: 4,
              fontFamily: 'monospace', fontSize: 13,
            }}>
              {children}
            </code>
          ) : (
            <code style={{ fontFamily: 'monospace', fontSize: 13, color: isDark ? '#7dd3fc' : '#0369a1' }}>
              {children}
            </code>
          ),
          pre: ({ children }) => (
            <pre style={{
              background: isDark ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.06)',
              border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.1)',
              borderRadius: 8, padding: '12px 14px',
              overflowX: 'auto', margin: '8px 0',
              fontFamily: 'monospace', fontSize: 13,
              lineHeight: 1.6,
              color: isDark ? '#e2e8f0' : '#1e293b',
            }}>
              {children}
            </pre>
          ),
          hr: () => (
            <hr style={{ border: 'none', borderTop: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)', margin: '10px 0' }} />
          ),
          blockquote: ({ children }) => (
            <blockquote style={{
              borderLeft: `3px solid ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}`,
              paddingLeft: 12, margin: '8px 0',
              color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
              fontStyle: 'italic',
            }}>
              {children}
            </blockquote>
          ),
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: '#4488ff', textDecoration: 'underline' }}>
              {children}
            </a>
          ),
        }}
      >
        {content}
      </Markdown>
    </>
  );
}

export default function ChatInterface({
  userId,
  mode = 'chat',
  conversationId = null,
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
  const [isOnline, setIsOnline] = useState(true);
  const recognitionRef = useRef(null);
  const [hoveredMsgId, setHoveredMsgId] = useState(null);
  const [showRainbow, setShowRainbow] = useState(false);
  const [lastSendTime, setLastSendTime] = useState(0);

  useEffect(() => {
    const update = () => setIsOnline(navigator.onLine);
    update();
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);

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
    if (initialMessages.length > 0) setMessages(initialMessages);
  }, [initialMessages]);

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
  if (!conversationId || !userId) return;

  supabase
    .from('conversations')
    .select('messages')
    .eq('id', conversationId)
    .eq('user_id', userId)
    .single()
    .then(({ data }) => {
      if (data?.messages && Array.isArray(data.messages)) {
        setMessages(data.messages);
      }
    });
}, [conversationId, userId]);

  const saveConversation = async (msgs) => {
    if (!userId || !conversationId || msgs.length === 0) return;
    const title = msgs[0]?.content?.substring(0, 60) || 'Nouvelle conversation';
    
    const { data: existing } = await supabase
      .from('conversations')
      .select('id')
      .eq('id', conversationId)
      .single();

    if (existing) {
      await supabase.from('conversations').update({
        messages: msgs, title, updated_at: new Date().toISOString()
      }).eq('id', conversationId);
    } else {
      await supabase.from('conversations').insert({
        id: conversationId, user_id: userId, title, messages: msgs, mode,
        created_at: new Date().toISOString(), updated_at: new Date().toISOString()
      });
    }
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading || !isOnline) return;

    // Délai minimum de 3 secondes entre les messages
    const now = Date.now();
    if (now - lastSendTime < 3000) return;
    setLastSendTime(now);

    const userMsg = { role: 'user', content: text, id: Date.now() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    setError('');

    if (messages.length === 0) {
      setShowRainbow(true);
      setTimeout(() => setShowRainbow(false), 5000);
    }

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, mode, userId, history: messages.slice(-20) }),
      });

      if (!res.ok) {
        const data = await res.json();
        if (data.error === 'QUOTA_EXCEEDED') {
          setError('Questions gratuites épuisées pour aujourd\'hui. Passez Premium pour continuer.');
        } else {
          setError('');
        }
        setLoading(false);
        return;
      }

      const aiMsgId = Date.now() + 1;
      const aiMsg = { role: 'ai', content: '', id: aiMsgId };
      setMessages(prev => [...prev, aiMsg]);
      setLoading(false);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const delta = parsed.choices?.[0]?.delta?.content || '';
            if (delta) {
              fullText += delta;
              setMessages(prev => prev.map(m =>
                m.id === aiMsgId ? { ...m, content: fullText } : m
              ));
            }
          } catch {}
        }
      }

      const finalMessages = [...newMessages, { role: 'ai', content: fullText, id: aiMsgId }];
      saveConversation(finalMessages);

    } catch (err) {
      // Erreur silencieuse
      setLoading(false);
    }
  };

  const handleRefresh = async (msgId) => {
    const msgIndex = messages.findIndex(m => m.id === msgId);
    if (msgIndex === -1) return;
    const userMsg = messages[msgIndex - 1];
    if (!userMsg || userMsg.role !== 'user') return;
    const trimmed = messages.slice(0, msgIndex);
    setMessages(trimmed);
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.content, mode, userId, history: trimmed.slice(-20) }),
      });
      if (res.ok) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let fullText = '';
        const aiMsgId = Date.now();
        const aiMsg = { role: 'ai', content: '', id: aiMsgId };
        setMessages(prev => [...prev, aiMsg]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');
          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            const jsonStr = line.slice(6).trim();
            if (jsonStr === '[DONE]') continue;
            try {
              const parsed = JSON.parse(jsonStr);
              const delta = parsed.choices?.[0]?.delta?.content || '';
              if (delta) {
                fullText += delta;
                setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, content: fullText } : m));
              }
            } catch {}
          }
        }
        const finalMessages = [...trimmed, { role: 'ai', content: fullText, id: aiMsgId }];
        saveConversation(finalMessages);
      }
    } catch (err) {
      // Erreur silencieuse
    } finally {
      setLoading(false);
    }
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const userMsg = { role: 'user', content: `[Fichier: ${file.name}]`, id: Date.now(), file };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    saveConversation(newMessages);
  };

  const startRecording = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { alert('Reconnaissance vocale non supportee.'); return; }
    const recognition = new SpeechRecognition();
    recognition.lang = 'fr-FR';
    recognition.interimResults = false;
    recognition.onresult = (event) => setInput(prev => (prev + ' ' + event.results[0][0].transcript).trim());
    recognition.onend = () => setIsRecording(false);
    recognition.onerror = () => setIsRecording(false);
    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (recognitionRef.current) recognitionRef.current.stop();
    setIsRecording(false);
  };

  const welcomeMessages = [
    { title: 'Prêt à apprendre ?', text: 'Posez une question sur vos cours, je vous guide sans donner la réponse.' },
    { title: 'Mode examen activé', text: 'Je peux vous générer des QCM, des exercices et corriger vos réponses.' },
    { title: 'Besoin de motivation ?', text: 'Je suis votre coach personnel. Parlons de vos objectifs et de votre planning.' },
    { title: 'Envie d\'entreprendre ?', text: 'Découvrez comment générer des revenus avec vos compétences numériques.' },
    { title: 'Nouveau chez ESIGN ?', text: 'Je connais tout de l\'école : filières, profs, campus, emploi du temps.' },
  ];

  const [welcome] = useState(welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', fontFamily: 'Arial, sans-serif', minHeight: 0, overflow: 'hidden', position: 'relative' }}>

      {showRainbow && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
          background: 'linear-gradient(135deg, #ff6b6b, #ffb347, #ffd93d, #6bcb77, #4d96ff, #9b59b6, #ff6b6b)',
          backgroundSize: '400% 400%',
          animation: 'rainbowFlow 5s ease-out forwards',
        }} />
      )}

      {/* ✅ Bandeau hors-ligne */}
      {!isOnline && (
        <div style={{
          padding: '8px 14px', textAlign: 'center', flexShrink: 0,
          background: 'rgba(255,68,85,0.1)', color: '#ff4455',
          fontSize: 12, borderBottom: '1px solid rgba(255,68,85,0.2)',
        }}>
          Pas de connexion — Mode hors-ligne
        </div>
      )}

      {showQuota && quota && (
        <div style={{ padding: '6px 14px', textAlign: 'center', flexShrink: 0, background: isDark ? 'rgba(68,136,255,0.1)' : 'rgba(68,136,255,0.05)', color: theme.accent, fontSize: 11, borderBottom: `1px solid ${c.border}` }}>
          {quota.plan === 'premium' ? 'Premium - Acces illimite' : `Questions restantes : ${quota.questionsRemaining}`}
        </div>
      )}

      {headerContent}

      {/* ✅ Bandeau d'erreur discret */}
      {error && (
        <div style={{
          padding: '8px 14px', textAlign: 'center', flexShrink: 0,
          background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
          color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)',
          fontSize: 11, borderBottom: `1px solid ${c.border}`,
        }}>
          {error}
        </div>
      )}

      <div ref={messagesContainerRef} style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '12px 10px' : '20px 20px', WebkitOverflowScrolling: 'touch', minHeight: 0, overscrollBehavior: 'contain', position: 'relative', zIndex: 1 }}>

        {messages.length === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100%', textAlign: 'center', padding: '20px 0' }}>
            <img src="/icon-192.png" alt="ESIGN" style={{ width: isMobile ? 48 : 56, height: isMobile ? 48 : 56, borderRadius: 14, objectFit: 'contain', marginBottom: 16 }} />
            <h1 style={{ color: c.text, fontSize: isMobile ? 16 : 18, fontWeight: 700, marginBottom: 6 }}>{welcome.title}</h1>
            <p style={{ color: c.mute, fontSize: isMobile ? 12 : 13, maxWidth: 360, lineHeight: 1.6, marginBottom: 18, padding: '0 8px' }}>{welcome.text}</p>
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
          <div
            key={msg.id}
            style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: 16, animation: 'msgIn 0.25s ease' }}
            onMouseEnter={() => msg.role === 'ai' && setHoveredMsgId(msg.id)}
            onMouseLeave={() => setHoveredMsgId(null)}
          >
            {msg.role === 'ai' && (
              <img src="/icon-192.png" alt="ESIGN" style={{ width: 28, height: 28, borderRadius: 8, objectFit: 'contain', flexShrink: 0, marginRight: 10, marginTop: 2 }} />
            )}

            <div style={{ maxWidth: isMobile ? '92%' : '78%', display: 'flex', flexDirection: 'column' }}>
              {msg.role === 'user' && (
                <div style={{
                  padding: '10px 14px', borderRadius: '18px 18px 4px 18px',
                  background: c.userBubble, color: 'white', fontSize: 14,
                  lineHeight: 1.6, wordBreak: 'break-word', overflowWrap: 'break-word',
                  alignSelf: 'flex-end',
                }}>
                  {msg.content}
                </div>
              )}

              {msg.role === 'ai' && (
                <div style={{ fontSize: 14, lineHeight: 1.7, color: c.text, wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                  <MarkdownContent content={msg.content} isDark={isDark} textColor={c.text} />
                  <div style={{ opacity: isMobile ? 1 : hoveredMsgId === msg.id ? 1 : 0, transition: 'opacity 0.2s', marginTop: 4 }}>
                    <MessageActions content={msg.content} isDark={isDark} onRefresh={() => handleRefresh(msg.id)} />
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 10 }}>
            <img src="/icon-192.png" alt="ESIGN" style={{ width: 28, height: 28, borderRadius: 8, objectFit: 'contain', marginRight: 10 }} />
            <div style={{ padding: '12px 18px', borderRadius: '14px 14px 14px 4px', background: c.aiBg, border: `1px solid ${c.aiBorder}`, display: 'flex', gap: 4 }}>
              {[0, 1, 2].map(i => (
                <span key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: theme.accent, animation: `bounce 1.4s infinite ${i * 0.2}s` }} />
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={{ padding: isMobile ? '6px 8px 8px' : '12px 16px 12px', flexShrink: 0, borderTop: `1px solid ${c.border}` }}>
        <div style={{ width: '100%', maxWidth: 720, margin: '0 auto', display: 'flex', alignItems: 'flex-end', gap: 6, background: c.inputBg, borderRadius: 18, border: `1.5px solid ${c.inputBorder}`, padding: '4px 4px 4px 8px' }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <button onClick={() => setShowMenu(!showMenu)} style={{ width: 34, height: 34, borderRadius: 12, border: 'none', background: 'transparent', color: c.mute, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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

          <button onMouseDown={startRecording} onMouseUp={stopRecording} onTouchStart={startRecording} onTouchEnd={stopRecording}
            style={{ width: 34, height: 34, borderRadius: 12, border: 'none', background: isRecording ? '#ff4455' : 'transparent', color: isRecording ? 'white' : c.mute, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="1" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0014 0"/></svg>
          </button>

          <button onClick={handleSend} disabled={!input.trim() || loading || !isOnline}
            style={{ width: 34, height: 34, borderRadius: 12, border: 'none', background: input.trim() && isOnline ? theme.accentGradient : 'transparent', color: input.trim() && isOnline ? 'white' : c.mute, cursor: input.trim() && isOnline ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, opacity: input.trim() && isOnline ? 1 : 0.4, boxShadow: input.trim() && isOnline ? `0 4px 14px ${theme.accent}40` : 'none' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
          </button>
        </div>
        <p style={{ textAlign: 'center', color: c.mute, fontSize: 9, marginTop: 5 }}>
          ESIGN AI peut faire des erreurs. Verifiez les informations importantes.
        </p>
      </div>

      <style>{`
        @keyframes msgIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bounce { 0%, 80%, 100% { transform: scale(0.5); opacity: 0.3; } 40% { transform: scale(1); opacity: 1; } }
        @keyframes rainbowFlow {
          0% { background-position: 0% 50%; opacity: 0.8; }
          50% { opacity: 0.4; }
          100% { background-position: 100% 50%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}