// ============================================
// ChatBackground.js
// ============================================

'use client';

import { useTheme } from '../providers';

export default function ChatBackground({ rainbow = false }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}
    >
      {/* Orbe spatial */}
      <div
        style={{
          position: 'absolute',
          width: '350px',
          height: '350px',
          borderRadius: '50%',
          background: isDark
            ? 'radial-gradient(circle, rgba(68,136,255,0.06) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(68,136,255,0.04) 0%, transparent 70%)',
          top: '-8%',
          right: '-5%',
          animation: 'orbFloat 20s ease-in-out infinite',
        }}
      />

      {/* Orbe secondaire */}
      <div
        style={{
          position: 'absolute',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: isDark
            ? 'radial-gradient(circle, rgba(102,153,255,0.04) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(102,153,255,0.03) 0%, transparent 70%)',
          bottom: '-10%',
          left: '-3%',
          animation: 'orbFloat 25s ease-in-out infinite reverse',
        }}
      />

      {/* Grille circuit */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='60' height='60' patternUnits='userSpaceOnUse'%3E%3Cpath d='M60 0L0 0 0 60' fill='none' stroke='%234488ff' stroke-width='0.5' stroke-opacity='0.04'/%3E%3Ccircle cx='30' cy='30' r='1.5' fill='%234488ff' fill-opacity='0.08'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px',
          opacity: 0.5,
        }}
      />

      {/* ✅ Arc-en-ciel temporaire */}
      {rainbow && (
        <div style={{
          position: 'absolute', inset: 0,
          background: isDark
            ? 'linear-gradient(135deg, rgba(68,136,255,0.1), rgba(255,107,107,0.08), rgba(0,204,136,0.08), rgba(255,179,71,0.08), rgba(102,153,255,0.1))'
            : 'linear-gradient(135deg, rgba(68,136,255,0.05), rgba(255,107,107,0.04), rgba(0,204,136,0.04), rgba(255,179,71,0.04), rgba(102,153,255,0.05))',
          backgroundSize: '400% 400%',
          animation: 'rainbowFlow 5s ease-out forwards',
        }} />
      )}

      <style>{`
        @keyframes orbFloat {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(-15px, 10px) scale(1.08); }
          50% { transform: translate(5px, -15px) scale(0.95); }
          75% { transform: translate(12px, 5px) scale(1.03); }
        }
       @keyframes rainbowLine {
  0% { background-position: 0% 50%; opacity: 1; }
  100% { background-position: 100% 50%; opacity: 0; }
         }

        }
      `}</style>
    </div>
  );
}