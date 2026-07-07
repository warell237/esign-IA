'use client'

import { useState } from 'react'

export default function RatingStars({ onRate, isDark = true, disabled = false }) {
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)

  const handleSubmit = async () => {
    if (rating === 0) return
    setSending(true)
    await new Promise(resolve => setTimeout(resolve, 600))
    onRate({ rating, feedback })
    setSubmitted(true)
    setSending(false)
  }

  const messages = {
    1: { label: 'Pas utile', color: '#ef4444' },
    2: { label: 'Peu utile', color: '#f97316' },
    3: { label: 'Utile', color: '#eab308' },
    4: { label: 'Tres utile', color: '#22c55e' },
    5: { label: 'Excellent', color: '#4488ff' },
  }

  const c = {
    bg: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
    border: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
    text: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
    accent: '#4488ff',
    muted: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.25)',
    inputBg: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
  }

  if (submitted) {
    return (
      <div style={{
        textAlign: 'center', padding: '20px 16px', animation: 'fadeSlideIn 0.5s ease',
        background: c.bg, borderRadius: 14, border: `1px solid ${c.border}`,
      }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#22c55e20', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', animation: 'popIn 0.4s ease' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <p style={{ color: isDark ? 'white' : '#0a1035', fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Merci pour ton retour</p>
        <p style={{ color: c.muted, fontSize: 12 }}>Tu contribues a ameliorer ESIGN AI pour tous les etudiants</p>
      </div>
    )
  }

  return (
    <div style={{
      padding: '16px', borderRadius: 14,
      background: c.bg, border: `1px solid ${c.border}`,
      animation: 'fadeSlideIn 0.3s ease',
    }}>
      <p style={{ color: isDark ? 'white' : '#0a1035', fontSize: 13, fontWeight: 500, marginBottom: 12, textAlign: 'center' }}>
        Cette reponse t&apos;a ete utile ?
      </p>

      {/* Etoiles */}
      <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 10 }}>
        {[1, 2, 3, 4, 5].map((star) => {
          const active = star <= (hover || rating)
          const msg = messages[star]
          return (
            <button
              key={star}
              disabled={disabled}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              style={{
                width: 40, height: 40, borderRadius: 10,
                border: 'none', cursor: 'pointer',
                background: active ? `${msg.color}20` : 'transparent',
                transition: 'all 0.2s ease',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transform: active ? 'scale(1.1)' : 'scale(1)',
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? msg.color : 'none'} stroke={active ? msg.color : c.muted} strokeWidth="1.5" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            </button>
          )
        })}
      </div>

      {/* Label */}
      {rating > 0 && (
        <p style={{
          textAlign: 'center', fontSize: 12, fontWeight: 600,
          color: messages[rating].color,
          marginBottom: 12, transition: 'all 0.3s ease',
        }}>
          {messages[rating].label}
        </p>
      )}

      {/* Feedback */}
      {rating > 0 && (
        <div style={{ marginBottom: 12 }}>
          <textarea
            placeholder={rating >= 4 ? 'Un petit mot sympa ? (optionnel)' : 'Dis-nous comment on peut s\'ameliorer...'}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            maxLength={500}
            rows={rating >= 4 ? 2 : 3}
            style={{
              width: '100%', background: c.inputBg,
              border: `1px solid ${c.border}`, borderRadius: 10,
              padding: '10px 12px', color: isDark ? 'white' : '#0a1035',
              fontSize: 13, resize: 'none', outline: 'none',
              fontFamily: 'inherit', lineHeight: 1.5, boxSizing: 'border-box',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => e.target.style.borderColor = c.accent}
            onBlur={(e) => e.target.style.borderColor = c.border}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
            <span style={{ color: c.muted, fontSize: 10 }}>{feedback.length}/500</span>
          </div>
        </div>
      )}

      {/* Bouton envoyer */}
      {rating > 0 && (
        <button
          onClick={handleSubmit}
          disabled={sending}
          style={{
            width: '100%', padding: '10px 0', borderRadius: 10, border: 'none',
            background: sending ? 'rgba(68,136,255,0.4)' : 'linear-gradient(135deg, #4488ff, #3366cc)',
            color: 'white', fontWeight: 600, fontSize: 13, cursor: sending ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          {sending ? (
            <>
              <span style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', animation: 'spin 0.6s linear infinite' }} />
              Envoi...
            </>
          ) : 'Envoyer'}
        </button>
      )}

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes popIn {
          from { transform: scale(0); }
          to { transform: scale(1); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}