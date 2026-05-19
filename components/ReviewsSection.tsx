'use client'

import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import reviews from '@/data/reviews.json'

function ReviewCard({
  review,
  index,
}: {
  review: (typeof reviews)[0]
  index: number
}) {
  const date = new Date(review.createdAt).toLocaleDateString('it-IT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="bg-elevated border rounded-xl p-5 space-y-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
      style={{ borderColor: 'var(--border-soft)' }}
    >
      {/* Stars */}
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={12}
            className={i < review.rating ? 'text-sun' : 'text-ink-faint'}
            fill={i < review.rating ? '#F5C842' : 'none'}
          />
        ))}
      </div>

      {/* Title */}
      <h3 className="font-medium text-sm text-ink leading-snug">{review.title}</h3>

      {/* Body */}
      <p className="text-sm text-ink-muted leading-relaxed">{review.body}</p>

      {/* Footer */}
      <div
        className="flex items-center justify-between pt-1 border-t"
        style={{ borderColor: 'var(--border-soft)' }}
      >
        <span className="font-mono text-[11px] text-ink-faint">{review.author}</span>
        <span className="font-mono text-[11px] text-ink-faint">{date}</span>
      </div>
    </motion.div>
  )
}

export function ReviewsSection() {
  const avgRating = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length

  return (
    <section
      id="reviews"
      className="py-16 md:py-24"
      style={{ background: 'rgba(245,240,229,0.3)' }}
    >
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-10">
            <h2 className="font-display italic font-light text-[32px] text-ink leading-none mb-3">
              Recensioni utenti
            </h2>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < Math.round(avgRating) ? 'text-sun' : 'text-ink-faint'}
                    fill={i < Math.round(avgRating) ? '#F5C842' : 'none'}
                  />
                ))}
              </div>
              <span className="text-sm text-ink-muted">
                {avgRating.toFixed(1)} · {reviews.length} recensioni verificate
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((review, i) => (
              <ReviewCard key={review.id} review={review} index={i} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
