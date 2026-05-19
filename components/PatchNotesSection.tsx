'use client'

import { motion } from 'framer-motion'

const PATCHES = {
  added: [
    {
      feature: 'eckhart_tolle_protocol',
      description: 'condivisione spontanea · 18 maggio 2026. trust_level rilevato: alto.',
    },
    {
      feature: 'dottore_paziente.exe',
      description: 'gioco di ruolo emergente via DM. ironico, efficace, non rimovibile.',
    },
    {
      feature: 'girasole_api v4.2',
      description: 'emoji 🌻 come firma universale e unità di misura emotiva.',
    },
    {
      feature: 'conversazione_notturna v2.1',
      description: 'attivata 18 maggio. latenza quasi zero. qualità: molto alta.',
    },
  ],
  improved: [
    {
      feature: 'instagram_channel',
      description: 'da "non sono interessata" a DM frequenti. throughput aumentato del 400%.',
    },
    {
      feature: 'deployment_scheduling',
      description: '"Conferma cena a tema Puglia" · giovedì 21 maggio · Ventiventi, Medolla · primo deploy live confermato.',
    },
    {
      feature: 'señorita_mode',
      description: 'calibrazione migliorata nelle interazioni 1:1 con developer compatibile.',
    },
  ],
  bugs: [
    {
      feature: 'puntualità.exe',
      description: 'due rollback confermati: 10.05 beach volley · 16.05 Disco Euphoria. monitoring attivo.',
    },
    {
      feature: 'sistema immunitario',
      description: 'crash stagionali frequenti. patch disponibile ma applicazione irregolare.',
    },
    {
      feature: 'release_finale',
      description: '"in progress." — risposta ufficiale, 18 maggio. ETA: non specificata. nota: non è un bug.',
    },
  ],
}

interface PatchGroupProps {
  label: string
  color: string
  borderColor: string
  dotColor: string
  items: { feature: string; description: string }[]
  delay?: number
}

function PatchGroup({ label, color, borderColor, dotColor, items, delay = 0 }: PatchGroupProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="w-2 h-2 rounded-full" style={{ background: dotColor }} />
        <span
          className="font-mono text-[11px] font-medium uppercase tracking-widest"
          style={{ color }}
        >
          {label}
        </span>
      </div>
      <div
        className="space-y-3 pl-5 border-l-2"
        style={{ borderColor }}
      >
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: delay + i * 0.08 }}
          >
            <code className="font-mono text-[12px] text-gold">{item.feature}</code>
            <span className="text-sm text-ink-muted"> — {item.description}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export function PatchNotesSection() {
  return (
    <section id="patches" className="py-16 md:py-24" style={{ background: 'rgba(245,240,229,0.35)' }}>
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="font-display italic font-light text-[32px] text-ink leading-none">
                Patch notes
              </h2>
              <span
                className="font-mono text-[11px] text-gold border border-gold-border px-2 py-0.5 rounded"
                style={{ background: '#FBF3E2' }}
              >
                v2.7.3
              </span>
            </div>
            <p className="font-mono text-xs text-ink-muted">changelog · ultima release stabile</p>
          </div>

          <div className="space-y-10">
            <PatchGroup
              label="Added"
              color="#4CAF72"
              borderColor="rgba(76,175,114,0.25)"
              dotColor="#4CAF72"
              items={PATCHES.added}
              delay={0.1}
            />
            <PatchGroup
              label="Improved"
              color="#6AB0E8"
              borderColor="rgba(106,176,232,0.25)"
              dotColor="#6AB0E8"
              items={PATCHES.improved}
              delay={0.2}
            />
            <PatchGroup
              label="Known Bug"
              color="#E8943A"
              borderColor="rgba(232,148,58,0.25)"
              dotColor="#E8943A"
              items={PATCHES.bugs}
              delay={0.3}
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
