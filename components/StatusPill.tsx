interface StatusPillProps {
  status: 'ONLINE' | 'BETA' | 'OFFLINE'
}

export function StatusPill({ status }: StatusPillProps) {
  const configs = {
    ONLINE: {
      dot: 'bg-term-green animate-pulse',
      text: 'text-term-green',
      border: 'border-term-green/30 bg-term-green/10',
    },
    BETA: {
      dot: 'bg-term-amber',
      text: 'text-term-amber',
      border: 'border-term-amber/30 bg-term-amber/10',
    },
    OFFLINE: {
      dot: 'bg-term-red',
      text: 'text-term-red',
      border: 'border-term-red/30 bg-term-red/10',
    },
  }

  const c = configs[status]

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border font-mono text-[11px] font-medium tracking-wide ${c.text} ${c.border}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {status}
    </span>
  )
}
