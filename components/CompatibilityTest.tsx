'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { StreamingTerminal } from './StreamingTerminal'

export function CompatibilityTest() {
  const [name, setName] = useState('')
  const [trait, setTrait] = useState('')
  const [lookingFor, setLookingFor] = useState('')
  const [output, setOutput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [hasResult, setHasResult] = useState(false)
  const [error, setError] = useState('')
  const abortRef = useRef<AbortController | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !trait.trim() || !lookingFor.trim()) return

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
          looking_for: lookingFor.trim(),
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

  const canSubmit = name.trim() && trait.trim() && lookingFor.trim() && !isLoading

  return (
    <section id="compatibility" className="py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-10">
            <h2 className="font-display italic font-light text-[32px] text-ink leading-none mb-2">
              Test di compatibilità
            </h2>
            <p className="text-sm text-ink-muted">
              inserisci i tuoi dati · il sistema calcolerà la compatibilità con ana_bot v2.7.3-beta
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 mb-8">
            {[
              {
                id: 'name',
                label: 'il tuo nome (o codice utente)',
                placeholder: 'es. rad_dev · señor_qualsiasi · papasito_42',
                value: name,
                onChange: setName,
                max: 50,
              },
              {
                id: 'trait',
                label: 'una tua caratteristica',
                placeholder: 'es. developer che non usa il CSS · nocturnale occasionale',
                value: trait,
                onChange: setTrait,
                max: 100,
              },
              {
                id: 'looking',
                label: 'una cosa che cerchi',
                placeholder: 'es. qualcuno con cui camminare 8km · una persona presente',
                value: lookingFor,
                onChange: setLookingFor,
                max: 100,
              },
            ].map((field) => (
              <div key={field.id}>
                <label className="font-mono text-[11px] text-ink-faint block mb-1.5">
                  {field.label}
                </label>
                <input
                  type="text"
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  placeholder={field.placeholder}
                  maxLength={field.max}
                  className="w-full px-4 py-3 bg-elevated border rounded-lg text-sm text-ink placeholder:text-ink-faint focus:outline-none transition-colors"
                  style={{
                    borderColor: 'var(--border-soft)',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#D4A843'
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-soft)'
                  }}
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={!canSubmit}
              className="flex items-center gap-2.5 px-6 py-3 bg-ink text-paper text-sm font-medium rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ fontFamily: 'var(--font-geist-sans)' }}
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
                'avvia analisi →'
              )}
            </button>
          </form>

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
