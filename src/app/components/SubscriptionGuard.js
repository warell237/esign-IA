'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SubscriptionGuard({ userId, children }) {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    // Vérifier l'abonnement
    fetch('/api/subscription/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSubscription(data.subscription);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex gap-1">
          <span className="typing-dot" />
          <span className="typing-dot" />
          <span className="typing-dot" />
        </div>
      </div>
    );
  }

  // Si quota épuisé, afficher le message
  if (
    subscription &&
    subscription.plan === 'free' &&
    subscription.questionsRemaining <= 0
  ) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        {/* Icône */}
        <div className="text-6xl mb-6">😔</div>
        {/* Message */}
        <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
          Quota quotidien épuisé
        </h2>
        <p className="mb-8 max-w-md" style={{ color: 'var(--text-secondary)' }}>
          Vous avez utilisé vos 50 questions gratuites aujourd'hui. Passez à Premium pour un accès illimité et débloquez toutes les fonctionnalités.
        </p>
        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => router.push('/subscription')}
            className="btn-esign"
          >
            ⭐ Passer à Premium
          </button>
          <button
            onClick={() => router.push('/chat')}
            className="btn-outline"
          >
            Retour au chat
          </button>
        </div>
        <p className="mt-4 text-xs" style={{ color: 'var(--text-muted)' }}>
          Votre quota se réinitialise chaque jour à minuit.
        </p>
      </div>
    );
  }

  // Sinon, afficher le contenu normal
  return children;
}