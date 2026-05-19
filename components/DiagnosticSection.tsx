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
  const [focused, setFocused] = useState(false)
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
    >
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8">
            <h2 className="font-display italic font-light text-[32px] text-ink leading-none mb-2">
              Diagnostica del sistema
            </h2>
            <p className="text-sm text-ink-muted">
              descrivi il problema · il bot eseguirà un&apos;analisi completa
            </p>
          </div>

          {/* Quick-fill chips */}
          <div className="mb-5">
            <p className="font-mono text-[10px] text-ink-faint mb-2">problemi frequenti →</p>
            <div className="flex flex-wrap gap-2">
              {[
                'puntualità.exe ha crashato ancora',
                'comportamenti in beta non documentati',
                'sistema immunitario instabile',
                'release finale: ETA indefinita',
                'dottore/paziente: conflitto di ruolo',
              ].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => setProblem(chip)}
                  className="font-mono text-[10px] px-2.5 py-1 rounded-md border transition-all duration-150 active:scale-95"
                  style={{
                    borderColor: problem === chip ? 'rgba(76,175,114,0.5)' : 'var(--border-soft)',
                    color: problem === chip ? '#4CAF72' : '#7A736B',
                    background: problem === chip ? 'rgba(76,175,114,0.06)' : 'transparent',
                  }}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mb-8">
            {/* Terminal dark card */}
            <div
              className="rounded-xl overflow-hidden mb-4 transition-all duration-200"
              style={{
                background: '#0D0E0B',
                border: `1.5px solid ${focused ? 'rgba(76,175,114,0.5)' : 'rgba(76,175,114,0.18)'}`,
                boxShadow: focused ? '0 0 0 3px rgba(76,175,114,0.08)' : 'none',
              }}
            >
              {/* Terminal chrome */}
              <div
                className="px-4 py-2.5 border-b flex items-center gap-3"
                style={{ borderColor: 'rgba(76,175,114,0.1)' }}
              >
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(224,92,92,0.5)' }} />
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(232,148,58,0.5)' }} />
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(76,175,114,0.5)' }} />
                </div>
                <span className="font-mono text-[11px]" style={{ color: '#4A4540' }}>
                  sudo bot-diagnostic --mode=verbose
                </span>
              </div>

              {/* Input area */}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-mono text-[11px]" style={{ color: '#4CAF72' }}>$</span>
                  <span className="font-mono text-[11px]" style={{ color: '#4A4540' }}>describe_problem --verbose</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-mono text-sm mt-3 shrink-0" style={{ color: '#4CAF72' }}>→</span>
                  <textarea
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    placeholder="inserisci il problema da diagnosticare..."
                    rows={4}
                    maxLength={500}
                    className="flex-1 bg-transparent font-mono text-sm focus:outline-none resize-none leading-relaxed pt-3 placeholder:opacity-30"
                    style={{ color: '#D4CEBC', caretColor: '#4CAF72' }}
                  />
                </div>
                <div className="flex justify-end mt-1">
                  <span className="font-mono text-[10px]" style={{ color: '#4A4540' }}>
                    {problem.length}/500
                  </span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={!problem.trim() || isLoading}
              className="flex items-center gap-2.5 px-6 py-3 text-sm font-medium rounded-lg transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.99]"
              style={{
                background: '#0D0E0B',
                color: '#4CAF72',
                border: '1.5px solid rgba(76,175,114,0.3)',
              }}
              onMouseEnter={(e) => {
                if (!e.currentTarget.disabled) {
                  e.currentTarget.style.borderColor = 'rgba(76,175,114,0.7)'
                  e.currentTarget.style.background = '#1C1E18'
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(76,175,114,0.3)'
                e.currentTarget.style.background = '#0D0E0B'
              }}
            >
              {isLoading ? (
                <>
                  <span className="flex gap-1 items-center">
                    {[0, 150, 300].map((d) => (
                      <span
                        key={d}
                        className="w-1 h-1 rounded-full animate-bounce"
                        style={{ background: '#4CAF72', animationDelay: `${d}ms` }}
                      />
                    ))}
                  </span>
                  eseguendo diagnostica...
                </>
              ) : (
                <>
                  <span className="font-mono text-[11px] opacity-60">[→]</span>
                  esegui diagnostica
                </>
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
