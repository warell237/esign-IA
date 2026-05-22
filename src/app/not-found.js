// ============================================
// Page 404 - Non trouvée
// ============================================

import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex items-center justify-center h-screen text-center p-4" style={{ background: 'var(--bg-primary)' }}>
      <div>
        <h1 className="text-6xl font-bold mb-4" style={{ color: 'var(--accent)' }}>404</h1>
        <p className="text-xl mb-6" style={{ color: 'var(--text-secondary)' }}>
          Cette page est perdue dans l&apos;espace...
        </p>
        <Link href="/" className="btn-esign"> Retour à l&apos;accueil</Link>
      </div>
    </main>
  );
}