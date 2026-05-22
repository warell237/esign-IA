'use client';

import { useState } from 'react';
import ChatInterface from '../../components/ChatInterface';
import SubscriptionGuard from '../../components/SubscriptionGuard';
import { useTheme } from '../../providers';

export default function ChatPage({ user, userData }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const chatSuggestions = [
    'Explique les pointeurs en C',
    'Aide pour examen algorithme',
    'Idees business a Sangmelima',
    'Programme Master 1 Reseaux',
  ];

  return (
    <SubscriptionGuard userId={user?.uid}>
      <ChatInterface
        userId={user?.uid}
        mode="chat"
        isDark={isDark}
        placeholder="Posez votre question..."
        suggestions={chatSuggestions}
      />
    </SubscriptionGuard>
  );
}