'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronUp, ChevronDown } from 'lucide-react'

const SECTIONS = [
  { id: 'home', label: 'ana_dan.profile' },
  { id: 'specs', label: 'specs.yaml' },
  { id: 'patches', label: 'patch_notes.md' },
  { id: 'compatibility', label: 'compatibility_test' },
  { id: 'diagnostic', label: 'bot_diagnostic' },
  { id: 'chat', label: 'open_chat.sh' },
  { id: 'reviews', label: 'reviews.json' },
  { id: 'footer', label: '_credits' },
]

export function SectionNavigation() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const observers = SECTIONS.map(({ id }, idx) => {
      const el = document.getElementById(id)
      if (!el) return null
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setCurrent(idx)
        },
        { rootMargin: '-30% 0px -60% 0px', threshold: 0 },
      )
      obs.observe(el)
      return obs
    })
    return () => observers.forEach((o) => o?.disconnect())
  }, [])

  const go = useCallback((idx: number) => {
    document.getElementById(SECTIONS[idx].id)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4, ease: 'easeOut' }}
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5"
    >
      {/* Up arrow — hidden on first section */}
      <AnimatePresence>
        {current > 0 && (
          <motion.button
            key="btn-up"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.18 }}
            onClick={() => go(current - 1)}
            aria-label="sezione precedente"
            className="w-11 h-11 rounded-full bg-terminal border border-term-green/50 text-term-green flex items-center justify-center shadow-lg active:scale-90 transition-transform hover:border-term-green hover:bg-terminal-2"
          >
            <ChevronUp size={20} strokeWidth={2} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Section indicator pill */}
      <div className="bg-terminal/95 backdrop-blur-sm border border-[rgba(90,80,60,0.3)] rounded-full px-4 py-2.5 flex items-center gap-2 shadow-xl min-w-0">
        <span className="font-mono text-[10px] text-gold shrink-0">$</span>
        <span className="font-mono text-[11px] text-term truncate max-w-[110px] leading-none">
          {SECTIONS[current].label}
        </span>
        <span className="font-mono text-[10px] text-term-dim shrink-0 leading-none">
          {current + 1}/{SECTIONS.length}
        </span>
      </div>

      {/* Down arrow — hidden on last section */}
      <AnimatePresence>
        {current < SECTIONS.length - 1 && (
          <motion.button
            key="btn-down"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.18 }}
            onClick={() => go(current + 1)}
            aria-label="sezione successiva"
            className="w-11 h-11 rounded-full bg-terminal border border-term-green/50 text-term-green flex items-center justify-center shadow-lg active:scale-90 transition-transform hover:border-term-green hover:bg-terminal-2"
          >
            <ChevronDown size={20} strokeWidth={2} />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
