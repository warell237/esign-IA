'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Définition des 5 modes avec leurs icônes et chemins
const modes = [
  {
    id: 'chat',
    label: 'Chat',
    icon: '',
    path: '/chat',
    description: 'Assistant général ESIGN',
  },
  {
    id: 'mentor',
    label: 'Mentor',
    icon: '',
    path: '/mentor',
    description: 'Coaching personnalisé',
  },
  {
    id: 'exam',
    label: 'Examen',
    icon: '',
    path: '/exam',
    description: 'Simulations et exercices',
  },
  {
    id: 'business',
    label: 'Business',
    icon: '',
    path: '/business',
    description: 'Générer des revenus',
  },
  {
    id: 'prof',
    label: 'Prof',
    icon: '',
    path: '/prof',
    description: 'Infos école et cours',
  },
];

export default function ModeSelector() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 md:left-0 md:top-16 md:bottom-0 md:w-20 lg:w-64"
      style={{
        background: 'var(--sidebar-bg)',
        borderTop: '1px solid var(--border)',
        borderRight: '1px solid var(--border)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      {/* Navigation mobile : barre horizontale en bas */}
      <div className="flex md:flex-col h-16 md:h-full md:py-4 overflow-x-auto md:overflow-y-auto">
        {modes.map((mode) => {
          const isActive = pathname === mode.path || pathname.startsWith(mode.path + '/');
          return (
            <Link
              key={mode.id}
              href={mode.path}
              className={`flex items-center gap-3 px-3 py-3 mx-1 my-0.5 rounded-xl transition-all duration-300 flex-shrink-0 md:flex-shrink ${
                isActive
                  ? 'bg-[var(--accent-light)] text-[var(--accent)] font-semibold'
                  : 'text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-secondary)]'
              }`}
              title={mode.description}
            >
              {/* Icône */}
              <span className="text-xl flex-shrink-0">{mode.icon}</span>
              {/* Label (caché sur mobile, visible sur desktop large) */}
              <span className="hidden lg:block text-sm whitespace-nowrap">
                {mode.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}