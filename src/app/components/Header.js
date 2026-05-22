'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../providers';

export default function Header({ user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const { theme } = useTheme();

  const handleLogout = async () => {
    await onLogout();
    router.push('/login');
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 h-16"
      style={{
        background: 'var(--header-bg)',
        borderBottom: '1px solid var(--border)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      <div className="flex items-center justify-between h-full px-4 max-w-screen-2xl mx-auto">
        {/* Partie gauche : Logo + Titre */}
        <div className="flex items-center gap-3">
          <Link href="/chat" className="flex items-center gap-3">
            {/* Logo ESIGN - Remplace par ton vrai logo */}
            <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center logo-glow">
              <Image
                src="/logo-esign.png"
                alt="ESIGN Logo"
                width={40}
                height={40}
                className="object-contain"
                priority
              />
            </div>
            {/* Titre */}
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                ESIGN AI
              </h1>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Assistant Intelligent
              </p>
            </div>
          </Link>
        </div>

        {/* Partie droite : Navigation, Thème, Profil */}
        <div className="flex items-center gap-2">
          {/* Bouton thème clair/sombre */}
          <ThemeToggle />

          {/* Menu utilisateur */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 p-2 rounded-lg transition-all duration-300 hover:bg-[var(--bg-hover)]"
              >
                {/* Avatar */}
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                  style={{ background: 'var(--accent)' }}
                >
                  {user.displayName?.charAt(0)?.toUpperCase() || 'E'}
                </div>
                <span className="hidden md:block text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {user.displayName || 'Étudiant'}
                </span>
                {/* Flèche */}
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {/* Menu déroulant */}
              {menuOpen && (
                <>
                  {/* Overlay pour fermer en cliquant dehors */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setMenuOpen(false)}
                  />
                  {/* Menu */}
                  <div
                    className="absolute right-0 top-full mt-2 w-56 py-2 rounded-xl z-50 shadow-lg"
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border)',
                      backdropFilter: 'blur(20px)',
                    }}
                  >
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm hover:bg-[var(--bg-hover)] transition-colors"
                      style={{ color: 'var(--text-secondary)' }}
                      onClick={() => setMenuOpen(false)}
                    >
                       Mon Profil
                    </Link>
                    <Link
                      href="/subscription"
                      className="block px-4 py-2 text-sm hover:bg-[var(--bg-hover)] transition-colors"
                      style={{ color: 'var(--text-secondary)' }}
                      onClick={() => setMenuOpen(false)}
                    >
                       Abonnement
                    </Link>
                    <hr style={{ borderColor: 'var(--border)', margin: '8px 0' }} />
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-[var(--bg-hover)] transition-colors"
                      style={{ color: 'var(--error)' }}
                    >
                       Déconnexion
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}