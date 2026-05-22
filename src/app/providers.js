'use client';

import { createContext, useContext, useEffect, useState } from 'react';

// Création du contexte de thème
const ThemeContext = createContext({
  theme: 'dark',
  toggleTheme: () => {},
});

// Hook personnalisé pour utiliser le thème
export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }) {
  // État du thème (dark par défaut)
  const [theme, setTheme] = useState('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Récupérer le thème sauvegardé
    const savedTheme = localStorage.getItem('esign-theme') || 'dark';
    setTheme(savedTheme);
    // Appliquer la classe au html
    if (savedTheme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, []);

  // Fonction pour basculer le thème
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('esign-theme', newTheme);
    if (newTheme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  };

  // Éviter le flash de thème au chargement
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}