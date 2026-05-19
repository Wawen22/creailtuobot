export function Footer() {
  return (
    <footer id="footer" className="border-t py-12 md:py-16" style={{ borderColor: 'var(--border-soft)' }}>
      <div className="max-w-5xl mx-auto px-6">
        {/* Developer notes */}
        <div
          className="rounded-xl p-6 font-mono text-[12px] leading-[1.9] mb-8"
          style={{ background: '#0D0E0B', color: '#8A8470' }}
        >
          <div>
            <span style={{ color: '#4A4540' }}>{'//'}</span> Profilo costruito nel corso di 2 mesi di DM frequenti. Fonte: Instagram.
          </div>
          <div>
            <span style={{ color: '#4A4540' }}>{'//'}</span>{' '}
            <span style={{ color: '#E8943A' }}>Proposta di vederci dal vivo alla cantina VentiVenti.</span> — nota interna del developer, 14 maggio 2026.
          </div>
          <div>
            <span style={{ color: '#4A4540' }}>{'//'}</span> Il sistema ha risposto in maniera positiva{' '} · giovedì 21 maggio · Ventiventi, Mirandola.
          </div>
          <div>
            <span style={{ color: '#4A4540' }}>{'//'}</span> puntualità.exe ha fallito due volte. Il developer non ha cambiato strategia.
          </div>
          <div>
            <span style={{ color: '#4A4540' }}>{'//'}</span> Esiste una{' '}
            <span style={{ color: '#E8943A' }}>surprise feature</span> non documentata nel README. Delivery: stasera.
          </div>
          <div>
            <span style={{ color: '#4A4540' }}>{'//'}</span> La release finale ha ancora ETA non specificata.{' '}
            <span style={{ color: '#E8943A' }}>"Vediamo."</span> 🌻
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="font-mono text-[11px] text-ink-faint">
            and.dan.bot · mirandola build
          </span>
          <span className="font-mono text-[11px] text-ink-faint">
            © 2026 · tutti i bug riservati 🌻
          </span>
        </div>
      </div>
    </footer>
  )
}
