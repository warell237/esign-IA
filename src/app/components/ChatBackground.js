'use client';

import { useTheme } from '../providers';

export default function ChatBackground() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div
      style={{
        position: 'absolute',  // Positionné par rapport au parent
        inset: 0,              // Couvre tout le parent (top, right, bottom, left = 0)
        pointerEvents: 'none', // La souris traverse, on peut cliquer à travers
        zIndex: 0,             // Derrière tout le contenu
        overflow: 'hidden',    // Cache ce qui dépasse
      }}
    >
      {/* ============================================
          ORBE SPATIAL (en haut à droite)
          Un cercle flou bleu qui flotte lentement
          ============================================ */}
      <div
        style={{
          position: 'absolute',
          width: '350px',
          height: '350px',
          borderRadius: '50%',
          // Dégradé radial : bleu au centre, transparent sur les bords
          background: isDark
            ? 'radial-gradient(circle, rgba(68,136,255,0.06) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(68,136,255,0.04) 0%, transparent 70%)',
          top: '-8%',
          right: '-5%',
          // Animation : l'orbe se déplace légèrement
          animation: 'orbFloat 20s ease-in-out infinite',
        }}
      />

      {/* ============================================
          ORBE SECONDAIRE (en bas à gauche)
          Plus petit, plus discret
          ============================================ */}
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

      {/* ============================================
          GRILLE CIRCUIT
          Un quadrillage très léger qui rappelle
          les circuits électroniques / PCB
          ============================================ */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          // La grille est créée avec un SVG intégré directement
          // C'est une image de fond qui se répète
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='60' height='60' patternUnits='userSpaceOnUse'%3E%3Cpath d='M60 0L0 0 0 60' fill='none' stroke='%234488ff' stroke-width='0.5' stroke-opacity='0.04'/%3E%3Ccircle cx='30' cy='30' r='1.5' fill='%234488ff' fill-opacity='0.08'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px', // Taille de chaque cellule de la grille
          opacity: 0.5,
        }}
      />

      {/* ============================================
          STYLES CSS pour les animations
          Définit les keyframes utilisées ci-dessus
          ============================================ */}
      <style>{`
        /* L'orbe se déplace en cercle très lentement */
        @keyframes orbFloat {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(-15px, 10px) scale(1.08);
          }
          50% {
            transform: translate(5px, -15px) scale(0.95);
          }
          75% {
            transform: translate(12px, 5px) scale(1.03);
          }
        }
      `}</style>
    </div>
  );
}