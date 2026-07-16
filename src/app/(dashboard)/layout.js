// ============================================
// src/app/(dashboard)/layout.js — COMPLET
// ============================================

'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from '../providers';
import ChatBackground from '../components/ChatBackground';
import Onboarding from '../components/Onboarding';
import PremiumPopup from '../components/PremiumPopup';
import { supabase } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export const UserContext = createContext(null);
export function useUser() { return useContext(UserContext); }

const modes = [
  { id: 'chat', icon: '', label: 'Chat', path: '/chat' },
  { id: 'mentor', icon: '', label: 'Mentor', path: '/mentor' },
  { id: 'exam', icon: '', label: 'Examen', path: '/exam' },
  { id: 'business', icon: '', label: 'Business', path: '/business' },
  { id: 'prof', icon: '', label: 'Prof', path: '/prof' },
];

const HEADER_HEIGHT = 48;

export default function DashboardLayout({ children }) {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentConv, setCurrentConv] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showPremiumPopup, setShowPremiumPopup] = useState(false);
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

  useEffect(() => {
    let mounted = true;

   const init = async () => {
  let { data } = await supabase.auth.getSession();
  
  // Si pas de session, essayer de la rafraîchir
  if (!data.session) {
    const { data: refreshData } = await supabase.auth.refreshSession();
    if (refreshData?.session) {
      data = refreshData;
    }
  }

  if (!mounted) return;

  if (!data.session) {
    router.replace('/login');
    return;
  }

      const uid = data.session.user.id;
      setUser(data.session.user);

      const [userResult, convsResult] = await Promise.all([
        supabase.from('users').select('*').eq('id', uid).single(),
        supabase.from('conversations').select('id, title, updated_at, created_at, mode')
          .eq('user_id', uid).order('updated_at', { ascending: false }).limit(30),
      ]);

      if (!mounted) return;
      if (userResult.data) {
        setUserData(userResult.data);

        // Onboarding première fois
        const hasSeenOnboarding = localStorage.getItem('esign-onboarding-done');
        if (!hasSeenOnboarding) {
          setShowOnboarding(true);
        }

        // Popup Premium si quota épuisé
        if (userResult.data.subscription_plan === 'free' && userResult.data.questions_remaining <= 5) {
          setShowPremiumPopup(true);
        }
      }
      if (convsResult.data) setConversations(convsResult.data);
      setLoading(false);
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      if (event === 'SIGNED_OUT') router.replace('/login');
    });

    return () => {
      mounted = false;
      listener?.subscription?.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/');
  };

  const newConversation = () => {
    const newId = uuidv4();
    router.push(`/chat/${newId}`);
    if (isMobile) setSidebarOpen(false);
  };

  const sidebarWidth = isMobile ? 280 : sidebarCollapsed ? 0 : 280;

  if (loading) {
    return (
      <div style={{ height: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: isDark ? '#000010' : '#f2f5ff' }}>
        <div style={{ display: 'flex', gap: 4 }}>
          {[0, 1, 2].map(i => (
            <span key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: '#4488ff', animation: `bounce 1.4s infinite ${i * 0.2}s` }} />
          ))}
        </div>
        <style>{`@keyframes bounce { 0%, 80%, 100% { transform: scale(0.5); opacity: 0.3; } 40% { transform: scale(1); opacity: 1; } }`}</style>
      </div>
    );
  }

  return (
    <UserContext.Provider value={{ user, userData }}>
      <div style={{ height: '100dvh', width: '100%', display: 'flex', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: isDark ? '#000010' : '#f2f5ff', overflow: 'hidden' }}>
        <ChatBackground />

        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, background: isDark ? 'radial-gradient(ellipse at 50% 30%, rgba(68,136,255,0.05) 0%, transparent 70%)' : 'radial-gradient(ellipse at 50% 30%, rgba(68,136,255,0.04) 0%, transparent 70%)', animation: 'bgPulse 8s ease-in-out infinite' }} />

        {isMobile && sidebarOpen && (
          <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)' }} />
        )}

        {/* Onboarding */}
        {showOnboarding && (
          <Onboarding
            isDark={isDark}
            onClose={() => {
              setShowOnboarding(false);
              localStorage.setItem('esign-onboarding-done', 'true');
            }}
          />
        )}

        {/* Popup Premium */}
        {showPremiumPopup && (
          <PremiumPopup
            isDark={isDark}
            onClose={() => setShowPremiumPopup(false)}
            onSubscribe={() => router.push('/subscription')}
          />
        )}

        {/* Modal déconnexion */}
        {showLogoutConfirm && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: isDark ? 'rgba(10,15,40,0.98)' : 'white', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)', borderRadius: 20, padding: '28px 32px', maxWidth: 320, width: '90%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#4488ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 12 }}>
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              <h3 style={{ color: isDark ? 'white' : '#0a1035', fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Se deconnecter ?</h3>
              <p style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)', fontSize: 13, marginBottom: 24 }}>Tu devras te reconnecter pour acceder a ESIGN AI.</p>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setShowLogoutConfirm(false)} style={{ flex: 1, padding: '12px', borderRadius: 12, border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(0,0,0,0.15)', background: 'transparent', color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)', cursor: 'pointer', fontSize: 14, fontWeight: 500 }}>Annuler</button>
                <button onClick={handleLogout} style={{ flex: 1, padding: '12px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #ff4455, #cc2233)', color: 'white', cursor: 'pointer', fontSize: 14, fontWeight: 600, boxShadow: '0 4px 15px rgba(255,68,85,0.3)' }}>Deconnexion</button>
              </div>
            </div>
          </div>
        )}

        {/* SIDEBAR */}
        <div style={{ position: isMobile ? 'fixed' : 'relative', left: isMobile ? (sidebarOpen ? '0' : '-100%') : '0', top: 0, bottom: 0, width: sidebarWidth, minWidth: sidebarWidth, zIndex: 60, display: 'flex', flexDirection: 'column', background: isDark ? 'rgba(8,8,32,0.94)' : 'rgba(255,255,255,0.94)', backdropFilter: 'blur(30px)', borderRight: sidebarCollapsed && !isMobile ? 'none' : `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`, transition: 'left 0.25s cubic-bezier(0.4, 0, 0.2, 1), width 0.25s ease, min-width 0.25s ease', overflow: 'hidden', flexShrink: 0 }}>
          <div style={{ flexShrink: 0, padding: sidebarCollapsed && !isMobile ? '18px 8px 10px' : '18px 14px 10px', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`, display: sidebarCollapsed && !isMobile ? 'flex' : 'block', justifyContent: 'center' }}>
            {!(sidebarCollapsed && !isMobile) && (
              <>
               <button onClick={() => { newConversation(); if (isMobile) setSidebarOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                  <img src="/icon-192.png" alt="ESIGN" style={{ width: 28, height: 28, borderRadius: 6, objectFit: 'contain', flexShrink: 0 }} />
                  <div>
                    <div style={{ color: isDark ? 'white' : '#0a1035', fontSize: 16, fontWeight: 700, letterSpacing: 1, lineHeight: 1 }}>ESIGN AI</div>
                    <div style={{ color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)', fontSize: 10.5, marginTop: 1 }}>Assistant Intelligent</div>
                  </div>
                </button>
                <button onClick={newConversation} style={{ width: '100%', padding: '10px 0', borderRadius: 8, border: 'none', background: 'linear-gradient(135deg, #4488ff, #3366cc)', color: 'white', fontWeight: 600, fontSize: 12.5, cursor: 'pointer', boxShadow: '0 3px 12px rgba(68,136,255,0.25)', transition: 'transform 0.15s' }} onMouseEnter={e => { e.target.style.transform = 'translateY(-1px)'; }} onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; }}>
                  + Nouvelle conversation
                </button>
              </>
            )}
            {!isMobile && (
              <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} style={{ marginTop: sidebarCollapsed ? 0 : 12, width: 32, height: 32, borderRadius: 6, border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`, background: 'transparent', cursor: 'pointer', fontSize: 14, color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
                {sidebarCollapsed ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                )}
              </button>
            )}
          </div>

          {!(sidebarCollapsed && !isMobile) && (
            <div style={{ flex: 1, overflowY: 'auto', padding: '0 0 8px 0' }}>
              <div style={{ padding: '12px 14px 4px' }}><span style={{ color: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>Modes</span></div>
              <div style={{ padding: '4px 8px' }}>
                {modes.map(mode => {
                  const active = pathname === mode.path || pathname.startsWith(mode.path + '/');
                  return (
                    <Link key={mode.id} href={mode.path} onClick={() => isMobile && setSidebarOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 8, textDecoration: 'none', fontSize: 13, fontWeight: 500, color: active ? '#4488ff' : (isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.55)'), background: active ? (isDark ? 'rgba(68,136,255,0.12)' : 'rgba(68,136,255,0.06)') : 'transparent', marginBottom: 1, transition: 'background 0.15s' }}>
                      <span style={{ fontSize: 15 }}>{mode.icon}</span><span>{mode.label}</span>
                      {active && <span style={{ marginLeft: 'auto', width: 5, height: 5, borderRadius: '50%', background: '#4488ff', boxShadow: '0 0 6px rgba(68,136,255,0.5)' }} />}
                    </Link>
                  );
                })}
              </div>
              <div style={{ margin: '8px 14px', height: '1px', background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' }} />
              <div style={{ padding: '12px 14px 4px' }}><span style={{ color: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>Conversations</span></div>
              <div style={{ padding: '4px 8px' }}>
                {conversations.length === 0 ? (
                  <div style={{ padding: '16px 12px', textAlign: 'center', color: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)', fontSize: 12 }}>Aucune conversation</div>
                ) : (
                  conversations.map(conv => (
                    <button key={conv.id} onClick={() => { router.push(`/chat/${conv.id}`); if (isMobile) setSidebarOpen(false); }} style={{ width: '100%', textAlign: 'left', padding: '10px 12px', borderRadius: 8, border: 'none', background: currentConv?.id === conv.id ? (isDark ? 'rgba(68,136,255,0.12)' : 'rgba(68,136,255,0.06)') : 'transparent', color: currentConv?.id === conv.id ? '#4488ff' : (isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)'), cursor: 'pointer', fontSize: 12.5, marginBottom: 1, transition: 'background 0.15s' }}>
                      <div style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 2 }}>{conv.title || 'Nouvelle conversation'}</div>
                      <div style={{ fontSize: 10.5, color: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)' }}>{formatDate(conv.updated_at || conv.created_at)}</div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}

          {!(sidebarCollapsed && !isMobile) && (
            <div style={{ flexShrink: 0, padding: '10px 14px', borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Link href="/profile" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', flex: 1, minWidth: 0 }} onClick={() => isMobile && setSidebarOpen(false)}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #4488ff, #3366cc)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{user?.email?.charAt(0)?.toUpperCase() || 'E'}</div>
                <span style={{ color: isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.55)', fontSize: 11.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userData?.first_name || user?.email?.split('@')[0] || 'Utilisateur'}</span>
              </Link>
              <button onClick={() => setShowLogoutConfirm(true)} style={{ padding: '6px 10px', borderRadius: 7, flexShrink: 0, border: '1px solid rgba(255,68,85,0.3)', background: 'transparent', cursor: 'pointer', fontSize: 11, color: '#ff4455', fontWeight: 500, transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 4 }} onMouseEnter={e => { e.target.style.background = 'rgba(255,68,85,0.1)'; }} onMouseLeave={e => { e.target.style.background = 'transparent'; }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                Quitter
              </button>
              <button onClick={toggleTheme} style={{ width: 30, height: 30, borderRadius: 7, flexShrink: 0, marginLeft: 6, border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`, background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
                {isDark ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffb347" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3366cc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
                )}
              </button>
            </div>
          )}
        </div>

        {/* CONTENU PRINCIPAL */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, height: '100%', overflow: 'hidden' }}>
          <div style={{ position: 'fixed', top: 0, left: isMobile ? 0 : sidebarCollapsed ? 0 : 280, right: 0, height: HEADER_HEIGHT, zIndex: 40, padding: '0 14px', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`, background: isDark ? 'rgba(8,8,32,0.95)' : 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', gap: 10, transition: 'left 0.25s ease', transform: 'translateZ(0)', WebkitTransform: 'translateZ(0)' }}>
            <button onClick={() => { if (isMobile) { setSidebarOpen(true); } else { setSidebarCollapsed(!sidebarCollapsed); } }} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: isDark ? 'white' : '#0a1035', padding: 0, lineHeight: 1 }}>☰</button>
            <button onClick={() => { newConversation(); if (isMobile) setSidebarOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'none' }}>
              <img src="/icon-192.png" alt="ESIGN" style={{ width: 28, height: 28, borderRadius: 6, objectFit: 'contain', flexShrink: 0 }} />
              <div style={{ color: isDark ? 'white' : '#0a1035', fontSize: 14, fontWeight: 700, letterSpacing: 1 }}>ESIGN AI</div>
            </button>
            <div style={{ flex: 1 }} />
            <button onClick={toggleTheme} style={{ width: 30, height: 30, borderRadius: 7, border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`, background: 'transparent', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {isDark ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffb347" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3366cc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
              )}
            </button>
          </div>

          <div style={{ position: 'absolute', top: HEADER_HEIGHT, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', zIndex: 1, maxWidth: 900, margin: '0 auto', width: '100%' }}>
            {children}
          </div>
        </div>

        <style>{`@keyframes bgPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }`}</style>
      </div>
    </UserContext.Provider>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now - date;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Aujourd'hui";
  if (days === 1) return 'Hier';
  if (days < 7) return `Il y a ${days} jours`;
  if (days < 30) return `Il y a ${Math.floor(days / 7)} semaine(s)`;
  return date.toLocaleDateString('fr');
}