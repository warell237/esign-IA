// ============================================
// src/app/(dashboard)/chat/[id]/page.js
// ============================================

'use client';

import { useParams } from 'next/navigation';
import ChatInterface from '../../../components/ChatInterface';
import SubscriptionGuard from '../../../components/SubscriptionGuard';
import { useTheme } from '../../../providers';
import { useUser } from '../../layout';

export default function ChatPage() {
  const params = useParams();
  const { theme } = useTheme();
  const { user, userData } = useUser();
  const isDark = theme === 'dark';
  const conversationId = params.id;

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
        conversationId={conversationId}
        placeholder="Posez votre question..."
        suggestions={chatSuggestions}
      />
    </SubscriptionGuard>
  );
}