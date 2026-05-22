import './globals.css';
import { ThemeProvider } from './providers';

// Métadonnées pour le SEO et les réseaux sociaux
export const metadata = {
  title: 'ESIGN AI - Assistant Intelligent pour Étudiants',
  description:
    'Assistant IA conçu pour les étudiants de ESIGN (École Supérieure Internationale de Génie Numérique) - UIECC Sangmélima. Coaching, examens, business et plus.',
  // Pour le favicon
  icons: {
    icon: '/favicon.ico',
    apple: '/icon-192.png',
  },
  // Pour la PWA
  manifest: '/manifest.json',
  // Pour le partage sur les réseaux
  openGraph: {
    title: 'ESIGN AI - Assistant Intelligent',
    description: 'L\'IA qui transforme ta manière d\'apprendre à ESIGN',
    type: 'website',
    locale: 'fr_FR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ESIGN AI',
    description: 'L\'IA pour les étudiants ESIGN',
  },

  // Mots clés SEO
  keywords: ['IA étudiants', 'ESIGN', 'assistant scolaire', 'Cameroun'],

  // Auteur
  authors: [{ name: 'ESIGN - UIECC Sangmélima' }],
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        {/* Meta tags pour la PWA */}
        <meta name="application-name" content="ESIGN AI" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="ESIGN AI" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#000010" />
        
        {/* Lien vers le manifest PWA */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body>
        {/* Provider pour le thème clair/sombre */}
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}