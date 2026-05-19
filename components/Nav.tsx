'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const NAV_LINKS = [
  { label: 'specs', href: '#specs' },
  { label: 'patch notes', href: '#patches' },
  { label: 'compatibilità', href: '#compatibility' },
  { label: 'diagnostica', href: '#diagnostic' },
  { label: 'chat', href: '#chat' },
  { label: 'recensioni', href: '#reviews' },
]

export function Nav() {
  const [visible, setVisible] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 320)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = (href: string) => {
    const id = href.replace('#', '')
    setMobileOpen(false)
    // Small delay so the mobile menu close animation doesn't cancel the scroll
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-paper/90 border-b border-[var(--border-soft)]"
        >
          <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
            <span className="font-mono text-xs text-ink-faint">
              <span className="text-gold">ana_bot</span> v2.7.3-beta
            </span>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-7">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className="font-body text-sm text-ink-muted hover:text-ink transition-colors duration-150"
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* Mobile toggle */}
            <button
              className="md:hidden font-mono text-xs text-ink-muted"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="menu"
            >
              {mobileOpen ? '× close' : '≡ menu'}
            </button>
          </div>

          {/* Mobile menu */}
          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="md:hidden overflow-hidden border-t border-[var(--border-soft)] bg-paper/98"
              >
                <div className="px-6 py-4 flex flex-col gap-4">
                  {NAV_LINKS.map((link) => (
                    <button
                      key={link.href}
                      onClick={() => scrollTo(link.href)}
                      className="text-sm text-ink-muted hover:text-ink transition-colors text-left"
                    >
                      {link.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>
      )}
    </AnimatePresence>
  )
}
