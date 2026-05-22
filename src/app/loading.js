// ============================================
// Écran de chargement global
// ============================================

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen" style={{ background: 'var(--bg-primary)' }}>
      <div className="flex gap-1">
        <span className="typing-dot" />
        <span className="typing-dot" />
        <span className="typing-dot" />
      </div>
    </div>
  );
}