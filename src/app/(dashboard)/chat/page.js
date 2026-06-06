'use client';

import ChatInterface from '../../components/ChatInterface';
import SubscriptionGuard from '../../components/SubscriptionGuard';
import { useTheme } from '../../providers';
import { useUser } from '../layout';

export default function ChatPage() {
  const { theme } = useTheme();
  const { user, userData } = useUser(); // ✅ via Context
  const isDark = theme === 'dark';

  const chatSuggestions = [
    'Explique les pointeurs en C',
    'Aide pour examen algorithme',
    'Idees business a Sangmelima',
    'Programme Master 1 Reseaux',
  ];

  return (
    <SubscriptionGuard userId={user?.id}>
      <ChatInterface
        userId={user?.id}
        mode="chat"
        isDark={isDark}
        placeholder="Posez votre question..."
        suggestions={chatSuggestions}
      />
    </SubscriptionGuard>
  );
}