'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'

interface EasterEggProps {
  onClose: () => void
}

export function EasterEgg({ onClose }: EasterEggProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center p-6"
        style={{ background: 'rgba(13,14,11,0.9)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="rounded-xl p-8 max-w-md w-full border"
          style={{
            background: '#0D0E0B',
            borderColor: 'rgba(184,134,42,0.25)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="font-mono text-[13px] leading-[1.9]">
            <div style={{ color: '#8A8470' }} className="mb-4">
              ana_bot.sh — authentication required
            </div>
            <div style={{ color: '#E8C86A' }}>
              {'>'} bot speaking.
            </div>
            <div style={{ color: '#E8943A' }}>
              authentication required.
            </div>
            <div style={{ color: '#E05C5C' }}>
              permission denied.
            </div>
            <div style={{ color: '#4CAF72' }} className="mt-2">
              🌻
            </div>
          </div>
          <button
            onClick={onClose}
            className="mt-6 w-full font-mono text-[11px] py-2 rounded border transition-colors"
            style={{
              color: '#8A8470',
              borderColor: 'rgba(255,255,255,0.08)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(184,134,42,0.3)'
              e.currentTarget.style.color = '#B8862A'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
              e.currentTarget.style.color = '#8A8470'
            }}
          >
            [ESC] · chiudi terminale
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
