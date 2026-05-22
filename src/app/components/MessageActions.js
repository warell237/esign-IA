'use client';

import { useState } from 'react';

export default function MessageActions({ content, onRefresh }) {
  const [show, setShow] = useState(false);       // Afficher/cacher les boutons
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = content;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ text: content });
    } else {
      handleCopy();
    }
  };

  const handleLike = () => {
    setLiked(!liked);
    if (disliked) setDisliked(false);
  };

  const handleDislike = () => {
    setDisliked(!disliked);
    if (liked) setLiked(false);
  };

  // Style des boutons : très discrets
  const btnStyle = (active, color) => ({
    background: active && color ? color + '20' : 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: 12,
    padding: '3px 5px',
    borderRadius: 4,
    color: active && color ? color : 'rgba(255,255,255,0.3)',
    transition: 'all 0.15s',
    lineHeight: 1,
  });

  return (
    <div
      style={{
        marginTop: 6,
        paddingTop: 4,
        borderTop: show ? '1px solid rgba(255,255,255,0.05)' : 'none',
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        opacity: show ? 1 : 0,
        transition: 'opacity 0.2s',
      }}
    >
      <button onClick={handleLike} style={btnStyle(liked, '#22c55e')} title="Utile">
        ▲
      </button>
      <button onClick={handleDislike} style={btnStyle(disliked, '#ef4444')} title="Pas utile">
        ▼
      </button>
      <button onClick={handleCopy} style={btnStyle(false, null)} title="Copier">
        {copied ? '✓' : '⎘'}
      </button>
      <button onClick={handleShare} style={btnStyle(false, null)} title="Partager">
        ↗
      </button>
      {onRefresh && (
        <button onClick={onRefresh} style={btnStyle(false, null)} title="Régénérer">
          ↻
        </button>
      )}
    </div>
  );
}