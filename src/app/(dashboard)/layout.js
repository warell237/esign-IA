'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '../providers';
import ChatBackground from '../components/ChatBackground';

const FAKE_USER = {
  uid: 'demo123',
  email: 'jean@esign.cm',
  displayName: 'Jean Balla',
};

const FAKE_CONVERSATIONS = [
  { id: 1, title: 'Aide examen algorithmique', date: "Aujourd'hui" },
  { id: 2, title: 'Révision réseaux TCP/IP', date: 'Hier' },
  { id: 3, title: 'Exercices pointeurs en C', date: 'Il y a 2 jours' },
  { id: 4, title: 'Cours Base de données SQL', date: 'Il y a 3 jours' },
  { id: 5, title: 'Simulation examen réseau', date: 'Il y a 5 jours' },
  { id: 6, title: 'Idées business freelance', date: 'La semaine dernière' },
];

const modes = [
  { id: 'chat', icon: '', label: 'Chat', path: '/chat' },
  { id: 'mentor', icon: '', label: 'Mentor', path: '/mentor' },
  { id: 'exam', icon: '', label: 'Examen', path: '/exam' },
  { id: 'business', icon: '', label: 'Business', path: '/business' },
  { id: 'prof', icon: '', label: 'Prof', path: '/prof' },
];

export default function DashboardLayout({ children }) {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);       // Mobile : overlay
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // Desktop : réduire
  const [currentConv, setCurrentConv] = useState(null);
  const isDark = theme === 'dark';

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (isMobile) setSidebarOpen(false);
  }, [pathname, isMobile]);

  // Largeur de la sidebar selon l'état
  const sidebarWidth = isMobile ? 280 : sidebarCollapsed ? 0 : 280;

  return (
    <div style={{
      height: '100vh', width: '100vw', display: 'flex', position: 'relative',
      background: isDark ? '#000010' : '#f2f5ff', overflow: 'hidden',
    }}>
      <ChatBackground />

      {/* Fond animé */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: isDark
          ? 'radial-gradient(ellipse at 50% 30%, rgba(68,136,255,0.05) 0%, transparent 70%), radial-gradient(ellipse at 85% 90%, rgba(102,153,255,0.04) 0%, transparent 60%)'
          : 'radial-gradient(ellipse at 50% 30%, rgba(68,136,255,0.04) 0%, transparent 70%), radial-gradient(ellipse at 85% 90%, rgba(102,153,255,0.03) 0%, transparent 60%)',
        animation: 'bgPulse 8s ease-in-out infinite',
      }} />

      {/* Overlay mobile */}
      {isMobile && sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{
          position: 'fixed', inset: 0, zIndex: 50,
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)',
        }} />
      )}

      {/* ============================================ */}
      {/* SIDEBAR */}
      {/* ============================================ */}
      <div style={{
        position: isMobile ? 'fixed' : 'relative',
        left: isMobile
          ? sidebarOpen ? '0' : '-100%'
          : '0',
        top: 0, bottom: 0,
        width: sidebarWidth,
        minWidth: sidebarWidth,
        zIndex: 60,
        display: 'flex',
        flexDirection: 'column',
        background: isDark ? 'rgba(8,8,32,0.94)' : 'rgba(255,255,255,0.94)',
        backdropFilter: 'blur(30px)',
        borderRight: sidebarCollapsed && !isMobile
          ? 'none'
          : `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
        transition: 'left 0.25s cubic-bezier(0.4, 0, 0.2, 1), width 0.25s ease, min-width 0.25s ease',
        overflow: 'hidden',
        flexShrink: 0,
      }}>
        {/* ========== ZONE 1 : HAUT FIXE ========== */}
        <div style={{
          flexShrink: 0,
          padding: sidebarCollapsed && !isMobile ? '18px 8px 10px' : '18px 14px 10px',
          borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
          display: sidebarCollapsed && !isMobile ? 'flex' : 'block',
          justifyContent: 'center',
        }}>
          {/* Logo + Titre */}
          {!(sidebarCollapsed && !isMobile) && (
            <>
              <Link href="/chat" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, textDecoration: 'none' }}
                onClick={() => isMobile && setSidebarOpen(false)}>
                <img
                  src="/icône PWA 192x192.png"
                  alt="ESIGN"
                  style={{
                    width: 28, height: 28, borderRadius: 6,
                    objectFit: 'contain',
                    flexShrink: 0,
                  }}
                />
                <div>
                  <div style={{ color: isDark ? 'white' : '#0a1035', fontSize: 16, fontWeight: 700, letterSpacing: 1, lineHeight: 1 }}>
                    ESIGN AI
                  </div>
                  <div style={{ color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)', fontSize: 10.5, marginTop: 1 }}>
                    Assistant Intelligent
                  </div>
                </div>
              </Link>

              {/* Bouton Nouvelle conversation */}
              <button
                onClick={() => { setCurrentConv(null); if (isMobile) setSidebarOpen(false); }}
                style={{
                  width: '100%', padding: '10px 0', borderRadius: 8, border: 'none',
                  background: 'linear-gradient(135deg, #4488ff, #3366cc)',
                  color: 'white', fontWeight: 600, fontSize: 12.5, cursor: 'pointer',
                  boxShadow: '0 3px 12px rgba(68,136,255,0.25)',
                  transition: 'transform 0.15s, box-shadow 0.15s',
                }}
                onMouseEnter={(e) => { e.target.style.transform = 'translateY(-1px)'; e.target.style.boxShadow = '0 6px 18px rgba(68,136,255,0.35)'; }}
                onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 3px 12px rgba(68,136,255,0.25)'; }}
              >
                + Nouvelle conversation
              </button>
            </>
          )}

          {/* Bouton réduire/ouvrir desktop */}
          {!isMobile && (
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              style={{
                marginTop: sidebarCollapsed ? 0 : 12,
                width: 32, height: 32, borderRadius: 6,
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                background: 'transparent',
                cursor: 'pointer',
                fontSize: 14,
                color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s',
              }}
              title={sidebarCollapsed ? 'Ouvrir la barre latérale' : 'Fermer la barre latérale'}
            >
              {sidebarCollapsed ? '▶' : '◀'}
            </button>
          )}
        </div>

        {/* ========== ZONE 2 : SCROLLABLE ========== */}
        {!(sidebarCollapsed && !isMobile) && (
          <div style={{ flex: 1, overflowY: 'auto', padding: '0 0 8px 0' }}>
            {/* Section Conversations */}
            <div style={{ padding: '12px 14px 4px' }}>
              <span style={{ color: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
                Conversations
              </span>
            </div>
            <div style={{ padding: '4px 8px' }}>
              {FAKE_CONVERSATIONS.map(conv => (
                <button
                  key={conv.id}
                  onClick={() => { setCurrentConv(conv); if (isMobile) setSidebarOpen(false); }}
                  style={{
                    width: '100%', textAlign: 'left', padding: '10px 12px', borderRadius: 8, border: 'none',
                    background: currentConv?.id === conv.id ? (isDark ? 'rgba(68,136,255,0.12)' : 'rgba(68,136,255,0.06)') : 'transparent',
                    color: currentConv?.id === conv.id ? '#4488ff' : (isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)'),
                    cursor: 'pointer', fontSize: 12.5, marginBottom: 1,
                    transition: 'background 0.15s',
                  }}
                >
                  <div style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 2 }}>
                    {conv.title}
                  </div>
                  <div style={{ fontSize: 10.5, color: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)' }}>{conv.date}</div>
                </button>
              ))}
            </div>

            {/* Séparateur */}
            <div style={{ margin: '8px 14px', height: '1px', background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' }} />

            {/* Section Modes */}
            <div style={{ padding: '12px 14px 4px' }}>
              <span style={{ color: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
                Modes
              </span>
            </div>
            <div style={{ padding: '4px 8px' }}>
              {modes.map(mode => {
                const active = pathname === mode.path || pathname.startsWith(mode.path + '/');
                return (
                  <Link
                    key={mode.id}
                    href={mode.path}
                    onClick={() => isMobile && setSidebarOpen(false)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '9px 12px', borderRadius: 8,
                      textDecoration: 'none', fontSize: 13, fontWeight: 500,
                      color: active ? '#4488ff' : (isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.55)'),
                      background: active ? (isDark ? 'rgba(68,136,255,0.12)' : 'rgba(68,136,255,0.06)') : 'transparent',
                      marginBottom: 1,
                      transition: 'background 0.15s',
                    }}
                  >
                    <span style={{ fontSize: 15 }}>{mode.icon}</span>
                    <span>{mode.label}</span>
                    {active && (
                      <span style={{
                        marginLeft: 'auto', width: 5, height: 5, borderRadius: '50%',
                        background: '#4488ff', boxShadow: '0 0 6px rgba(68,136,255,0.5)',
                      }} />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* ========== ZONE 3 : BAS FIXE ========== */}
        {!(sidebarCollapsed && !isMobile) && (
          <div style={{
            flexShrink: 0, padding: '10px 14px',
            borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <Link href="/profile" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}
              onClick={() => isMobile && setSidebarOpen(false)}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: 'linear-gradient(135deg, #4488ff, #3366cc)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontSize: 11, fontWeight: 700,
                flexShrink: 0,
              }}>J</div>
              <span style={{
                color: isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.55)',
                fontSize: 11.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                Jean Balla
              </span>
            </Link>
            <button
              onClick={toggleTheme}
              style={{
                width: 30, height: 30, borderRadius: 7, flexShrink: 0,
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
                background: 'transparent', cursor: 'pointer', fontSize: 14,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s',
              }}
              aria-label={isDark ? 'Mode clair' : 'Mode sombre'}
            >
              {isDark ? '☀️' : '🌙'}
            </button>
          </div>
        )}
      </div>

      {/* ============================================ */}
      {/* CONTENU PRINCIPAL */}
      {/* ============================================ */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, height: '100%' }}>
        {/* Barre top : desktop ET mobile */}
        <div style={{
          padding: '10px 14px', flexShrink: 0,
          borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
          background: isDark ? 'rgba(8,8,32,0.8)' : 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(20px)',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          {/* Bouton hamburger : mobile → ouvre overlay, desktop → toggle collapse */}
          <button
            onClick={() => {
              if (isMobile) {
                setSidebarOpen(true);
              } else {
                setSidebarCollapsed(!sidebarCollapsed);
              }
            }}
            style={{
              background: 'none', border: 'none', fontSize: 20, cursor: 'pointer',
              color: isDark ? 'white' : '#0a1035', padding: 0, lineHeight: 1,
            }}
          >
            ☰
          </button>

          {/* Logo + titre (toujours visible) */}
          <Link href="/chat" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <img
              src="/icône PWA 192x192.png"
              alt="ESIGN"
              style={{
                width: 28, height: 28, borderRadius: 6,
                objectFit: 'contain',
                flexShrink: 0,
              }}
            />
            <div style={{ color: isDark ? 'white' : '#0a1035', fontSize: 14, fontWeight: 700, letterSpacing: 1 }}>
              ESIGN AI
            </div>
          </Link>

          <div style={{ flex: 1 }} />

          {/* Bouton thème (toujours visible) */}
          <button onClick={toggleTheme} style={{
            width: 30, height: 30, borderRadius: 7,
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
            background: 'transparent', cursor: 'pointer', fontSize: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {isDark ? '☀️' : '🌙'}
          </button>
        </div>

        {/* Pages */}
        <div style={{ flex: 1, overflow: 'hidden', position: 'relative', zIndex: 1 }}>
          {children}
        </div>
      </div>

      <style>{`
        @keyframes bgPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}