
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';

export default function ChatRedirect() {
  const router = useRouter();

  useEffect(() => {
    const newId = uuidv4();
    router.replace(`/chat/${newId}`);
  }, []);

  return (
    <div style={{ height: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000010' }}>
      <div style={{ display: 'flex', gap: 4 }}>
        {[0, 1, 2].map(i => (
          <span key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: '#4488ff', animation: `bounce 1.4s infinite ${i * 0.2}s` }} />
        ))}
      </div>
      <style>{`@keyframes bounce { 0%, 80%, 100% { transform: scale(0.5); opacity: 0.3; } 40% { transform: scale(1); opacity: 1; } }`}</style>
    </div>
  );
}