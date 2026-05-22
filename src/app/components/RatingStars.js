
'use client'

import { useState } from 'react'

export default function RatingStars({ onRate, disabled = false }) {
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    if (rating === 0) return

    onRate({ rating, feedback })
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="text-center p-4 animate-fade-in">
        <p className="text-esign-success text-lg">✅ Merci pour ton retour !</p>
        <p className="text-esign-lightblue text-sm mt-1">
          Ça nous aide à améliorer ESIGN AI
        </p>
      </div>
    )
  }

  return (
    <div className="p-4 bg-esign-card rounded-xl border border-esign-border">
      <p className="text-white text-sm mb-3">
        Cette réponse t'a été utile ?
      </p>

      {/* Étoiles */}
      <div className="flex gap-1 justify-center mb-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            disabled={disabled}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className="text-2xl transition-transform hover:scale-110"
          >
            {star <= (hover || rating) ? '⭐' : '☆'}
          </button>
        ))}
      </div>

      {/* Label de la note */}
      {rating > 0 && (
        <p className="text-center text-sm text-esign-lightblue mb-3">
          {rating === 1 && 'Pas utile du tout'}
          {rating === 2 && 'Peu utile'}
          {rating === 3 && 'Utile'}
          {rating === 4 && 'Très utile'}
          {rating === 5 && 'Excellent !'}
        </p>
      )}

      {/* Feedback écrit */}
      {rating > 0 && rating <= 3 && (
        <div className="mb-3">
          <textarea
            placeholder="Dis-nous comment on peut s'améliorer..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            maxLength={500}
            rows={3}
            className="w-full bg-esign-dark border border-esign-border rounded-lg p-2 text-white text-sm resize-none focus:border-esign-electric focus:outline-none"
          />
          <p className="text-right text-xs text-esign-lightblue">
            {feedback.length}/500
          </p>
        </div>
      )}

      {rating >= 4 && (
        <div className="mb-3">
          <textarea
            placeholder="Un petit mot sympa ? (optionnel)"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            maxLength={500}
            rows={2}
            className="w-full bg-esign-dark border border-esign-border rounded-lg p-2 text-white text-sm resize-none focus:border-esign-electric focus:outline-none"
          />
          <p className="text-right text-xs text-esign-lightblue">
            {feedback.length}/500
          </p>
        </div>
      )}

      {/* Bouton envoyer */}
      {rating > 0 && (
        <button
          onClick={handleSubmit}
          className="w-full bg-esign-electric hover:bg-esign-lightblue text-white py-2 rounded-lg transition-colors"
        >
          Envoyer
        </button>
      )}
    </div>
  )
}