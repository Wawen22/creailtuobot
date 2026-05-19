'use client'

import { motion } from 'framer-motion'
import { StatusPill } from './StatusPill'
import { SunflowerDecoration } from './SunflowerDecoration'

const COMPAT_ROWS = [
  { icon: '🌻', tech: 'girasoli', status: '✓ nativa', type: 'ok' },
  { icon: '🎵', tech: 'reggaeton', status: '✓ core feature', type: 'ok' },
  { icon: '🏖', tech: 'mare', status: '✓ requisito base', type: 'ok' },
  { icon: '🎨', tech: 'design', status: '✓ funzione primaria', type: 'ok' },
  { icon: '�', tech: 'Eckhart Tolle', status: '✓ lettura corrente', type: 'ok', tooltip: 'Il Potere di Adesso · condiviso spontaneamente alle 23:52' },
  { icon: '💻', tech: 'developer API', status: '⚠ conflitti noti', type: 'warn', tooltip: 'dev usa JS · il bot usa design system · conflitto cronico, mai risolto' },
  { icon: '🔬', tech: 'release finale', status: '~ in fase di test', type: 'pending', tooltip: '"vediamo." — risposta ufficiale del sistema · 18 maggio 2026' },
  { icon: '🕐', tech: 'puntualità.exe', status: '⚠ patch pending', type: 'warn', tooltip: 'due rollback: 10.05 beach volley · 16.05 Disco Euphoria' },
]

export function HeroSection() {
  return (
    <section id="home" className="min-h-screen flex items-center relative overflow-hidden">
      <div className="absolute inset-0 bg-paper" />
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 100%, #F5F0E5 0%, transparent 70%)',
        }}
      />

      <div className="relative max-w-5xl mx-auto px-6 pt-12 pb-20 w-full">
        <div className="max-w-2xl space-y-8">
          {/* Status row */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center gap-3 flex-wrap"
          >
            <StatusPill status="ONLINE" />
            <StatusPill status="BETA" />
            <span className="font-mono text-[11px] text-ink-faint">
              v2.7.3-beta · build 2026.05.21
            </span>
          </motion.div>

          {/* Main name */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-4">
              <h1 className="font-display font-light italic leading-none text-ink tracking-tight text-[clamp(56px,10vw,96px)]">
                ana.dan
              </h1>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="pointer-events-none select-none mt-1"
              >
                <SunflowerDecoration size={48} opacity={0.85} />
              </motion.div>
            </div>
            <p className="font-mono text-sm text-ink-muted mt-3 leading-relaxed">
              human_bot · UI/UX class · girasole_core enabled
            </p>
          </motion.div>

          {/* Profile card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="bg-elevated rounded-xl border p-6 shadow-sm max-w-md"
            style={{ borderColor: 'var(--border-soft)' }}
          >
            <div className="space-y-3.5">
              {[
                { k: 'modello', v: 'señorita_pro_max', gold: true },
                { k: 'build', v: '2026.05.21', gold: false },
                { k: 'status', v: 'ONLINE · beta perenne', green: true },
                { k: 'firma', v: '🌻 (crittografata)', gold: false },
              ].map(({ k, v, gold, green }) => (
                <div key={k} className="flex items-start gap-3">
                  <span className="font-mono text-[11px] text-ink-faint w-16 pt-0.5 shrink-0">
                    {k}
                  </span>
                  <span
                    className={`font-mono text-sm ${
                      gold
                        ? 'text-gold font-medium'
                        : green
                        ? 'text-term-green'
                        : 'text-ink-mid'
                    }`}
                  >
                    {v}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Compat preview */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.65 }}
          >
            <p className="font-mono text-[11px] text-ink-faint mb-3 uppercase tracking-wider">
              compatibilità rapida
            </p>
            <div className="flex flex-wrap gap-2">
              {COMPAT_ROWS.map((row) => (
                <span
                  key={row.tech}
                  className="group relative font-mono text-[11px] px-2.5 py-1 rounded-full border cursor-default transition-all"
                  style={{
                    borderColor:
                      row.type === 'ok'
                        ? 'rgba(76,175,114,0.3)'
                        : row.type === 'warn'
                        ? 'rgba(232,148,58,0.3)'
                        : 'rgba(184,134,42,0.3)',
                    background:
                      row.type === 'ok'
                        ? 'rgba(76,175,114,0.08)'
                        : row.type === 'warn'
                        ? 'rgba(232,148,58,0.08)'
                        : 'rgba(184,134,42,0.08)',
                    color:
                      row.type === 'ok'
                        ? '#4CAF72'
                        : row.type === 'warn'
                        ? '#E8943A'
                        : '#B8862A',
                  }}
                >
                  {row.icon} {row.tech}
                  {row.tooltip && (
                    <span className="hidden md:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-terminal text-term text-[11px] rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 border border-white/10">
                      {row.tooltip}
                    </span>
                  )}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Scroll hint */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="font-mono text-[11px] text-ink-faint pt-2"
          >
            ↓ scroll per il profilo completo
          </motion.p>
        </div>
      </div>
    </section>
  )
}
