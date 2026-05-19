'use client'

import { motion } from 'framer-motion'

const SPECS = [
  { key: 'modello', value: 'señorita_pro_max', isCode: true },
  { key: 'professione', value: 'UI/UX designer · grafica · partita IVA', isCode: false },
  { key: 'localizzazione', value: 'Mirandola (MO) · deploy attivo', isCode: false },
  { key: 'firmware audio', value: 'reggaeton · musica latina', isCode: false },
  { key: 'lettura corrente', value: 'Il Potere di Adesso — Eckhart Tolle', isCode: false },
  { key: 'combustibile primario', value: 'spritz · vino · mare', isCode: false },
  { key: 'serata ideale', value: 'vino · buone conversazioni · il tempo che passa senza accorgersene ✨', isCode: false },
  { key: 'serata_solo.exe', value: 'candele accese · musica · cucina + skincare in parallelo · monologhi: attivi', isCode: true },
  { key: 'firma digitale', value: '🌻 (presente in ogni messaggio)', isCode: false },
  { key: 'immunità sistema', value: 'bassa — patch frequenti richieste', isCode: false },
  { key: 'compatibilità umana', value: 'selettiva · alta quando attivata', isCode: false, bar: 62 },
  { key: 'puntualità.exe', value: 'due rollback · fix in corso', isCode: true },

]

export function SpecsSection() {
  return (
    <section id="specs" className="py-10 md:py-16">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-6">
            <h2 className="font-display italic font-light text-[32px] text-ink leading-none mb-2">
              Specifiche tecniche
            </h2>
          </div>

          <div
            className="rounded-xl overflow-hidden border"
            style={{ borderColor: 'var(--border-soft)' }}
          >
            {/* Terminal chrome header */}
            <div
              className="px-5 py-2.5 border-b flex items-center gap-3"
              style={{ background: '#F5F0E5', borderColor: 'var(--border-soft)' }}
            >
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#E05C5C]/60" />
                <div className="w-2 h-2 rounded-full bg-[#E8943A]/60" />
                <div className="w-2 h-2 rounded-full bg-[#4CAF72]/60" />
              </div>
              <span className="font-mono text-[11px] text-ink-faint">
                <span className="text-gold">$</span> ana_bot --specs
              </span>
              <span className="font-mono text-[10px] text-ink-faint ml-auto">
                v2.7.3-beta
              </span>
            </div>

            {/* 2-column grid on md+ */}
            <div className="grid grid-cols-1 md:grid-cols-2">
              {SPECS.map((spec, i) => {
                const isLast = i === SPECS.length - 1
                const rowNum = Math.floor(i / 2)
                const bg = rowNum % 2 === 0 ? 'var(--color-elevated)' : 'var(--color-paper)'

                return (
                  <motion.div
                    key={spec.key}
                    initial={{ opacity: 0, x: -6 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.03 }}
                    className={[
                      'flex items-start gap-3 px-5 py-2.5',
                      isLast ? 'md:col-span-2' : '',
                      !isLast ? 'border-b' : '',
                      i % 2 === 0 && !isLast ? 'md:border-r' : '',
                    ].filter(Boolean).join(' ')}
                    style={{ background: bg, borderColor: 'var(--border-soft)' }}
                  >
                    <span className="font-mono text-[10px] text-ink-faint w-28 pt-0.5 shrink-0 leading-relaxed">
                      {spec.key}
                    </span>
                    <div className="flex-1 min-w-0">
                      {spec.isCode ? (
                        <code
                          className="font-mono text-[13px] text-gold px-2 py-0.5 rounded"
                          style={{ background: '#FBF3E2' }}
                        >
                          {spec.value}
                        </code>
                      ) : (
                        <span className="text-[13px] text-ink-mid">{spec.value}</span>
                      )}
                      {spec.bar !== undefined && (
                        <div
                          className="mt-2 h-1 w-full max-w-[140px] rounded-full overflow-hidden"
                          style={{ background: '#F5F0E5' }}
                        >
                          <motion.div
                            className="h-full rounded-full bg-gold"
                            initial={{ width: 0 }}
                            whileInView={{ width: `${spec.bar}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                          />
                        </div>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
