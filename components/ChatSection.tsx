'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  streaming?: boolean
}

const MAX_MESSAGES = 5

export function ChatSection() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [userMsgCount, setUserMsgCount] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async () => {
    const text = input.trim()
    if (!text || isLoading || userMsgCount >= MAX_MESSAGES) return

    const newUserMsg: Message = { role: 'user', content: text }
    const updatedMessages = [...messages, newUserMsg]

    setMessages([...updatedMessages, { role: 'assistant', content: '', streaming: true }])
    setInput('')
    setUserMsgCount((c) => c + 1)
    setIsLoading(true)

    abortRef.current?.abort()
    abortRef.current = new AbortController()

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages
            .filter((m) => m.content.trim().length > 0)
            .map((m) => ({ role: m.role, content: m.content })),
        }),
        signal: abortRef.current.signal,
      })

      if (!res.ok) {
        setMessages([
          ...updatedMessages,
          {
            role: 'assistant',
            content:
              res.status === 429
                ? 'Troppe richieste. Sistema in pausa momentanea.'
                : '[ERROR] Sistema temporaneamente offline. 🌻',
          },
        ])
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
        setMessages([
          ...updatedMessages,
          { role: 'assistant', content: acc, streaming: true },
        ])
      }

      const finalContent = acc.trim() || '[nessuna risposta dal sistema. 🌻]'
      setMessages([...updatedMessages, { role: 'assistant', content: finalContent, streaming: false }])
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setMessages([
          ...updatedMessages,
          { role: 'assistant', content: '[ERROR] Connessione persa. 🌻' },
        ])
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const remaining = MAX_MESSAGES - userMsgCount

  return (
    <section id="chat" className="py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-10">
            <h2 className="font-display italic font-light text-[32px] text-ink leading-none mb-2">
              Chiedi al bot
            </h2>
            <p className="text-sm text-ink-muted">chat libera con ana_bot v2.7.3-beta</p>
          </div>

          <div className="rounded-xl overflow-hidden" style={{ background: '#0D0E0B' }}>
            {/* Terminal header */}
            <div
              className="flex items-center justify-between px-4 py-3 border-b"
              style={{ borderColor: 'rgba(255,255,255,0.07)' }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ background: '#E05C5C', opacity: 0.7 }}
                />
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ background: '#E8943A', opacity: 0.7 }}
                />
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ background: '#4CAF72', opacity: 0.7 }}
                />
                <span className="ml-2 font-mono text-[11px]" style={{ color: '#8A8470' }}>
                  ana_bot.chat · v2.7.3-beta
                </span>
              </div>
              <span className="font-mono text-[11px]" style={{ color: '#8A8470' }}>
                <span style={{ color: remaining > 1 ? '#4CAF72' : '#E8943A' }}>{remaining}</span>
                /{MAX_MESSAGES} query rimaste
              </span>
            </div>

            {/* Messages area */}
            <div ref={containerRef} className="min-h-[260px] max-h-[420px] overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-32 gap-2">
                  <p className="font-mono text-[11px]" style={{ color: '#8A8470' }}>
                    ana_bot v2.7.3-beta · ONLINE · in attesa di input
                  </p>
                  <p className="font-mono text-[10px]" style={{ color: 'rgba(138,132,112,0.5)' }}>
                    max {MAX_MESSAGES} messaggi per sessione
                  </p>
                </div>
              )}

              <AnimatePresence initial={false}>
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex gap-2.5 ${
                      msg.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {msg.role === 'assistant' && (
                      <div
                        className="w-6 h-6 rounded flex items-center justify-center text-xs shrink-0 mt-0.5 border"
                        style={{
                          background: 'rgba(184,134,42,0.15)',
                          borderColor: 'rgba(184,134,42,0.25)',
                        }}
                      >
                        🌻
                      </div>
                    )}

                    <div
                      className="max-w-[78%] rounded-xl px-3.5 py-2.5 font-mono text-[13px] leading-relaxed"
                      style={
                        msg.role === 'user'
                          ? {
                              background: 'rgba(26,23,20,0.85)',
                              color: '#FDFAF5',
                              border: '1px solid rgba(255,255,255,0.08)',
                            }
                          : {
                              background: '#1C1E18',
                              color: '#D4CEBC',
                              border: '1px solid rgba(255,255,255,0.05)',
                            }
                      }
                    >
                      {msg.content === '' && msg.streaming ? (
                        <span className="flex gap-1 items-center h-5">
                          {[0, 150, 300].map((d) => (
                            <span
                              key={d}
                              className="w-1.5 h-1.5 rounded-full animate-bounce"
                              style={{
                                background: '#4CAF72',
                                animationDelay: `${d}ms`,
                              }}
                            />
                          ))}
                        </span>
                      ) : (
                        <>
                          {msg.content}
                          {msg.streaming && msg.content && (
                            <span
                              className="inline-block w-[6px] h-[0.85em] ml-0.5 align-middle animate-pulse"
                              style={{ background: '#4CAF72' }}
                            />
                          )}
                        </>
                      )}
                    </div>

                    {msg.role === 'user' && (
                      <div
                        className="w-6 h-6 rounded flex items-center justify-center font-mono text-[10px] shrink-0 mt-0.5 border"
                        style={{
                          background: 'rgba(255,255,255,0.06)',
                          color: '#8A8470',
                          borderColor: 'rgba(255,255,255,0.1)',
                        }}
                      >
                        &gt;
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>


            </div>

            {/* Input */}
            <div
              className="border-t p-3"
              style={{ borderColor: 'rgba(255,255,255,0.07)' }}
            >
              {remaining === 0 ? (
                <div
                  className="text-center py-3 font-mono text-[11px]"
                  style={{ color: '#8A8470' }}
                >
                  limite sessione raggiunto · ricarica la pagina per una nuova sessione 🌻
                </div>
              ) : (
                <div className="flex gap-2 items-end">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="scrivi un messaggio..."
                    rows={1}
                    disabled={isLoading || remaining === 0}
                    className="flex-1 rounded-lg px-3 py-2.5 font-mono text-[13px] focus:outline-none resize-none transition-colors disabled:opacity-50"
                    style={{
                      background: '#1C1E18',
                      color: '#D4CEBC',
                      border: '1px solid rgba(255,255,255,0.08)',
                      minHeight: '42px',
                      maxHeight: '120px',
                      '::placeholder': { color: 'rgba(138,132,112,0.5)' },
                    } as React.CSSProperties}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(184,134,42,0.4)'
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                    }}
                  />
                  <button
                    onClick={handleSend}
                    disabled={isLoading || !input.trim() || remaining === 0}
                    className="w-10 h-10 flex items-center justify-center rounded-lg border transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                    style={{
                      background: 'rgba(184,134,42,0.15)',
                      borderColor: 'rgba(184,134,42,0.3)',
                      color: '#B8862A',
                    }}
                    onMouseEnter={(e) => {
                      if (!e.currentTarget.disabled) {
                        e.currentTarget.style.background = 'rgba(184,134,42,0.25)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(184,134,42,0.15)'
                    }}
                  >
                    <Send size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
