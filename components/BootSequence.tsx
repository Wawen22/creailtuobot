'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const BOOT_LINES = [
  { text: '[boot] loading ana_dan.profile......', suffix: ' ok', delay: 0 },
  { text: '[boot] mounting señorita_edition....', suffix: ' ok', delay: 200 },
  { text: '[boot] syncing mirandola.context....', suffix: ' ok', delay: 420 },
  { text: '[boot] loading 🌻 · trust_level: alto', suffix: ' ok', delay: 640 },
  { text: '', suffix: '', delay: 820 },
  { text: '> buonasera, señorita_', suffix: '', delay: 900 },
]

interface BootSequenceProps {
  onComplete: () => void
}

export function BootSequence({ onComplete }: BootSequenceProps) {
  const [visibleCount, setVisibleCount] = useState(0)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []

    BOOT_LINES.forEach((line, i) => {
      timers.push(setTimeout(() => setVisibleCount(i + 1), line.delay))
    })

    timers.push(setTimeout(() => setIsExiting(true), 1500))
    timers.push(setTimeout(() => onComplete(), 2100))

    return () => timers.forEach(clearTimeout)
  }, [onComplete])

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-terminal"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          <div className="font-mono text-[13px] leading-[1.9] w-[500px] max-w-[90vw] px-6">
            {BOOT_LINES.slice(0, visibleCount).map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.08 }}
              >
                {line.text === '' ? (
                  <span>&nbsp;</span>
                ) : line.text.startsWith('>') ? (
                  <span className="text-term-green">
                    {line.text}
                    <span className="inline-block w-2 h-[1em] bg-term-green ml-1 align-middle animate-pulse" />
                  </span>
                ) : (
                  <span>
                    <span className="text-term-dim">{line.text}</span>
                    {line.suffix && (
                      <span className="text-term-green">{line.suffix}</span>
                    )}
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
