'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { StreamingTerminal } from './StreamingTerminal'

export function DiagnosticSection() {
  const [problem, setProblem] = useState('')
  const [output, setOutput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [hasResult, setHasResult] = useState(false)
  const [error, setError] = useState('')
  const abortRef = useRef<AbortController | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!problem.trim()) return

    abortRef.current?.abort()
    abortRef.current = new AbortController()

    setIsLoading(true)
    setOutput('')
    setHasResult(false)
    setError('')

    try {
      const res = await fetch('/api/diagnostic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problem: problem.trim() }),
        signal: abortRef.current.signal,
      })

      if (!res.ok) {
        if (res.status === 429) {
          setError('Troppe richieste. Aspetta un minuto e riprova.')
        } else {
          setError('Modulo diagnostico non disponibile.')
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

  return (
    <section
      id="diagnostic"
      className="py-16 md:py-24"
      style={{ background: 'rgba(245,240,229,0.25)' }}
    >
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-10">
            <h2 className="font-display italic font-light text-[32px] text-ink leading-none mb-2">
              Diagnostica del sistema
            </h2>
            <p className="text-sm text-ink-muted">
              descrivi il problema · il bot eseguirà un&apos;analisi completa
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 mb-8">
            <div>
              <label className="font-mono text-[11px] text-ink-faint block mb-1.5">
                input diagnostica
              </label>
              <textarea
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                placeholder="es. 'non capisco certi comportamenti in beta...' — il bot diagnostica tutto"
                rows={4}
                maxLength={500}
                className="w-full px-4 py-3 bg-elevated border rounded-lg text-sm text-ink placeholder:text-ink-faint focus:outline-none transition-colors resize-none leading-relaxed"
                style={{ borderColor: 'var(--border-soft)' }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#D4A843'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-soft)'
                }}
              />
              <p className="font-mono text-[10px] text-ink-faint mt-1 text-right">
                {problem.length}/500
              </p>
            </div>

            <button
              type="submit"
              disabled={!problem.trim() || isLoading}
              className="flex items-center gap-2.5 px-6 py-3 bg-ink text-paper text-sm font-medium rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              onMouseEnter={(e) => {
                if (!e.currentTarget.disabled) e.currentTarget.style.background = '#4A4540'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#1A1714'
              }}
            >
              {isLoading ? (
                <>
                  <span className="flex gap-1 items-center">
                    {[0, 150, 300].map((d) => (
                      <span
                        key={d}
                        className="w-1 h-1 rounded-full bg-paper animate-bounce"
                        style={{ animationDelay: `${d}ms` }}
                      />
                    ))}
                  </span>
                  eseguendo diagnostica...
                </>
              ) : (
                'esegui diagnostica →'
              )}
            </button>
          </form>

          {error && (
            <p className="font-mono text-sm text-term-red mb-4">[ERROR] {error}</p>
          )}

          <AnimatePresence>
            {((isLoading && output) || hasResult) && output ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
              >
                <StreamingTerminal text={output} isStreaming={isLoading} />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
