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
  { key: 'modalità attiva', value: 'always-on · scrive lei per prima ogni mattina', isCode: false },
]

export function SpecsSection() {
  return (
    <section id="specs" className="py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-10">
            <h2 className="font-display italic font-light text-[32px] text-ink leading-none mb-2">
              Specifiche tecniche
            </h2>
            <p className="font-mono text-xs text-ink-muted">
              ana_bot v2.7.3-beta · release corrente
            </p>
          </div>

          <div
            className="rounded-xl overflow-hidden border"
            style={{ borderColor: 'var(--border-soft)' }}
          >
            {SPECS.map((spec, i) => (
              <motion.div
                key={spec.key}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.04 }}
                className={`flex items-start gap-4 px-6 py-4 ${
                  i < SPECS.length - 1 ? 'border-b' : ''
                } ${i % 2 === 0 ? 'bg-elevated' : 'bg-paper'}`}
                style={i < SPECS.length - 1 ? { borderColor: 'var(--border-soft)' } : undefined}
              >
                <span className="font-mono text-[11px] text-ink-faint w-36 pt-0.5 shrink-0 leading-relaxed">
                  {spec.key}
                </span>
                <div className="flex-1">
                  {spec.isCode ? (
                    <code
                      className="font-mono text-sm text-gold px-2 py-0.5 rounded"
                      style={{ background: '#FBF3E2' }}
                    >
                      {spec.value}
                    </code>
                  ) : (
                    <span className="text-sm text-ink-mid">{spec.value}</span>
                  )}
                  {spec.bar !== undefined && (
                    <div
                      className="mt-2.5 h-1 w-full max-w-[180px] rounded-full overflow-hidden"
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
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
