import Link from 'next/link';

export default function NotFound() {
  return (
    <main style={{
      width: '100vw', height: '100dvh',
      background: '#000010',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Arial, sans-serif',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Fond anime */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(68,136,255,0.08) 0%, transparent 70%)',
          top: '-10%', right: '-5%', animation: 'float1 12s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', width: 300, height: 300, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(102,153,255,0.06) 0%, transparent 70%)',
          bottom: '-8%', left: '-5%', animation: 'float2 15s ease-in-out infinite',
        }} />
      </div>

      {/* Contenu */}
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: 24 }}>
        <img
          src="/icon-192.png"
          alt="ESIGN"
          style={{ width: 64, height: 64, borderRadius: 14, objectFit: 'contain', marginBottom: 24 }}
        />
        <h1 style={{
          color: '#4488ff', fontSize: 80, fontWeight: 800,
          margin: '0 0 8px', letterSpacing: 4,
          textShadow: '0 0 40px rgba(68,136,255,0.4)',
        }}>
          404
        </h1>
        <p style={{
          color: 'rgba(255,255,255,0.6)', fontSize: 16,
          marginBottom: 24, lineHeight: 1.6,
        }}>
          Cette page est perdue dans l&apos;espace.
        </p>
        <Link
          href="/"
          style={{
            display: 'inline-block', padding: '14px 28px', borderRadius: 12,
            background: 'linear-gradient(135deg, #4488ff, #3366cc)',
            color: 'white', fontWeight: 600, fontSize: 14,
            textDecoration: 'none',
            boxShadow: '0 6px 24px rgba(68,136,255,0.3)',
          }}
        >
          Retour a l&apos;accueil
        </Link>
      </div>

      <style>{`
        @keyframes float1 {
          0%, 100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(-30px,20px) scale(1.1); }
        }
        @keyframes float2 {
          0%, 100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(20px,-15px) scale(1.05); }
        }
      `}</style>
    </main>
  );
}