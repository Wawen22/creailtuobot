'use client'

import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

interface SectionTransitionProps {
  command: string
  nextSectionId: string
}

export function SectionTransition({ command, nextSectionId }: SectionTransitionProps) {
  const scrollToNext = () => {
    document.getElementById(nextSectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-4">
      {/* Terminal command divider */}
      <div className="flex items-center gap-4">
        <div className="h-px flex-1" style={{ background: 'var(--border-soft)' }} />
        <span className="font-mono text-[11px] text-ink-faint whitespace-nowrap">
          <span className="text-gold">$</span> {command}
        </span>
        <div className="h-px flex-1" style={{ background: 'var(--border-soft)' }} />
      </div>

      {/* Bouncing arrow — tap to jump to next section */}
      <div className="flex justify-center mt-5 mb-1">
        <motion.button
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.4 }}
          onClick={scrollToNext}
          aria-label={`vai a ${nextSectionId}`}
          className="group w-11 h-11 rounded-full border border-[var(--border-strong)] bg-paper hover:bg-sunken hover:border-gold-border flex items-center justify-center transition-colors duration-200 shadow-sm"
        >
          <ChevronDown
            size={20}
            strokeWidth={2}
            className="text-ink-muted group-hover:text-gold transition-colors"
          />
        </motion.button>
      </div>
    </div>
  )
}
