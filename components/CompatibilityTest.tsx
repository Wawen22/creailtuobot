'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { StreamingTerminal } from './StreamingTerminal'

const FIELDS = [
  {
    id: 'name' as const,
    num: '01',
    label: 'codice utente',
    sublabel: 'il tuo nome o come ti presenti',
    placeholder: 'rad_dev · señor_qualsiasi · papasito_42',
    chips: ['rad_dev', 'señor_qualsiasi', 'utente_beta_01', 'papasito_42'],
    max: 50,
  },
  {
    id: 'trait' as const,
    num: '02',
    label: 'parametro caratterizzante',
    sublabel: "una cosa che ti descrive",
    placeholder: 'developer fullstack · nocturnale · ama il reggaeton',
    chips: ['developer fullstack', 'ama il mare', 'nocturnale', 'ironico & diretto'],
    max: 100,
  },
  {
    id: 'looking' as const,
    num: '03',
    label: 'obiettivo della ricerca',
    sublabel: "cosa cerchi in un'altra persona",
    placeholder: 'qualcuno con cui camminare 8km · persona presente',
    chips: ['persona presente', 'camminate lunghe', 'conversazioni vere', 'complicità'],
    max: 100,
  },
]

export function CompatibilityTest() {
  const [name, setName] = useState('')
  const [trait, setTrait] = useState('')
  const [looking, setLooking] = useState('')
  const [output, setOutput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [hasResult, setHasResult] = useState(false)
  const [error, setError] = useState('')
  const [focused, setFocused] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const filledCount = [name, trait, looking].filter((v) => v.trim()).length

  const getFieldState = (id: 'name' | 'trait' | 'looking') => {
    if (id === 'name') return [name, setName] as const
    if (id === 'trait') return [trait, setTrait] as const
    return [looking, setLooking] as const
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !trait.trim() || !looking.trim()) return

    abortRef.current?.abort()
    abortRef.current = new AbortController()

    setIsLoading(true)
    setOutput('')
    setHasResult(false)
    setError('')

    try {
      const res = await fetch('/api/compatibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          trait: trait.trim(),
          looking_for: looking.trim(),
        }),
        signal: abortRef.current.signal,
      })

      if (!res.ok) {
        if (res.status === 429) {
          setError('Troppe richieste. Aspetta un minuto e riprova.')
        } else {
          setError('Errore nella connessione al modulo di analisi.')
        }
        setHasResult(true)
        return
      }

      const reader = res.body?.getReader()
      if (!reader) return

      const decoder = new TextDecoder()
      let acc = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        acc += decoder.decode(value, { stream: true })
        setOutput(acc)
      }

      setHasResult(true)
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setError('Connessione persa. Riprova tra qualche istante.')
        setHasResult(true)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const canSubmit = name.trim() && trait.trim() && looking.trim() && !isLoading

  return (
    <section id="compatibility" className="py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8">
            <h2 className="font-display italic font-light text-[32px] text-ink leading-none mb-2">
              Test di compatibilità
            </h2>
            <p className="text-sm text-ink-muted">
              inserisci i parametri · il sistema calcola la compatibilità con ana_bot v2.7.3-beta
            </p>
          </div>

          {/* Form card with terminal chrome */}
          <div
            className="rounded-xl overflow-hidden border shadow-sm mb-8"
            style={{ borderColor: 'var(--border-soft)' }}
          >
            {/* Chrome header */}
            <div
              className="px-5 py-3 border-b flex items-center justify-between"
              style={{ background: '#F5F0E5', borderColor: 'var(--border-soft)' }}
            >
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#E05C5C]/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#E8943A]/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#4CAF72]/60" />
                </div>
                <span className="font-mono text-[11px] text-ink-faint">
                  <span className="text-gold">$</span> compatibility_test.sh
                </span>
              </div>
              <span className="font-mono text-[10px] text-ink-faint">
                parametri:{' '}
                <span
                  className="transition-colors"
                  style={{ color: filledCount === 3 ? '#4CAF72' : '#B8862A' }}
                >
                  {filledCount}/3
                </span>
                {filledCount === 3 && ' ✓'}
              </span>
            </div>

            {/* Fields */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6 bg-elevated">
              {FIELDS.map((field) => {
                const [val, set] = getFieldState(field.id)
                const isFocused = focused === field.id
                return (
                  <div key={field.id}>
                    <div className="flex items-baseline gap-2 mb-1.5">
                      <span className="font-mono text-[10px] text-gold shrink-0">[{field.num}]</span>
                      <label className="font-mono text-[11px] text-ink-faint">{field.label}</label>
                      <span className="font-mono text-[10px] text-ink-faint/50 hidden sm:inline truncate">
                        — {field.sublabel}
                      </span>
                    </div>

                    {/* Quick-fill chips */}
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {field.chips.map((chip) => (
                        <button
                          key={chip}
                          type="button"
                          onClick={() => set(chip)}
                          className="font-mono text-[10px] px-2 py-1 rounded-md border transition-all duration-150 active:scale-95"
                          style={{
                            borderColor: val === chip ? '#D4A843' : 'var(--border-soft)',
                            color: val === chip ? '#B8862A' : '#7A736B',
                            background: val === chip ? '#FBF3E2' : 'var(--color-paper)',
                          }}
                        >
                          {chip}
                        </button>
                      ))}
                    </div>

                    {/* Input with glow focus */}
                    <div
                      className="rounded-lg transition-all duration-200"
                      style={{
                        border: `1.5px solid ${isFocused ? '#D4A843' : 'var(--border-soft)'}`,
                        boxShadow: isFocused ? '0 0 0 3px rgba(212,168,67,0.1)' : 'none',
                      }}
                    >
                      <input
                        type="text"
                        value={val}
                        onChange={(e) => set(e.target.value)}
                        placeholder={field.placeholder}
                        maxLength={field.max}
                        onFocus={() => setFocused(field.id)}
                        onBlur={() => setFocused(null)}
                        className="w-full px-4 py-3 bg-elevated rounded-lg text-sm text-ink placeholder:text-ink-faint focus:outline-none"
                      />
                    </div>
                  </div>
                )
              })}

              <button
                type="submit"
                disabled={!canSubmit}
                className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 bg-ink text-paper text-sm font-medium rounded-lg transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.99]"
                onMouseEnter={(e) => {
                  if (!e.currentTarget.disabled) e.currentTarget.style.background = '#4A4540'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#1A1714'
                }}
              >
                {isLoading ? (
                  <>
                    <LoadingDots />
                    analisi in corso...
                  </>
                ) : (
                  <>
                    <span className="font-mono text-[11px] opacity-50">[→]</span>
                    avvia analisi
                  </>
                )}
              </button>
            </form>
          </div>

          {error && (
            <p className="font-mono text-sm text-term-red mb-4">[ERROR] {error}</p>
          )}

          <AnimatePresence>
            {(isLoading && output) || hasResult ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
              >
                {output && <StreamingTerminal text={output} isStreaming={isLoading} />}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}

function LoadingDots() {
  return (
    <span className="flex gap-1 items-center">
      {[0, 150, 300].map((delay) => (
        <span
          key={delay}
          className="w-1 h-1 rounded-full bg-paper animate-bounce"
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </span>
  )
}
