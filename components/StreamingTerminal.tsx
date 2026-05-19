import React from 'react'

interface StreamingTerminalProps {
  text: string
  isStreaming?: boolean
  className?: string
}

function colorizeLine(line: string): React.ReactNode {
  if (line.startsWith('[INFO]')) {
    return <span style={{ color: '#6AB0E8' }}>{line}</span>
  }
  if (line.startsWith('[WARN]')) {
    return <span style={{ color: '#E8943A' }}>{line}</span>
  }
  if (line.startsWith('[DONE]')) {
    return <span style={{ color: '#4CAF72' }}>{line}</span>
  }
  if (line.startsWith('[ERROR]')) {
    return <span style={{ color: '#E05C5C' }}>{line}</span>
  }
  if (line.startsWith('$ ')) {
    return <span style={{ color: '#E8C86A' }}>{line}</span>
  }
  if (line.startsWith('═══') || line.startsWith('[fine')) {
    return <span style={{ color: '#E8C86A' }}>{line}</span>
  }
  if (line.startsWith('▸')) {
    const parts = line.split(':')
    if (parts.length >= 2) {
      return (
        <span>
          <span style={{ color: '#E8C86A' }}>{parts[0]}:</span>
          <span style={{ color: '#D4CEBC' }}>{parts.slice(1).join(':')}</span>
        </span>
      )
    }
    return <span style={{ color: '#E8C86A' }}>{line}</span>
  }
  if (line.startsWith('  - ') || line.startsWith('  → ')) {
    return <span style={{ color: '#D4CEBC' }}>{line}</span>
  }
  if (line.startsWith('[0') || line.startsWith('[1') || line.startsWith('[2')) {
    return <span style={{ color: '#8A8470' }}>{line}</span>
  }
  return <span style={{ color: '#D4CEBC' }}>{line}</span>
}

export function StreamingTerminal({ text, isStreaming, className }: StreamingTerminalProps) {
  const lines = text.split('\n')

  return (
    <div
      className={`rounded-xl overflow-hidden font-mono text-[13px] leading-[1.65] ${className ?? ''}`}
      style={{ background: '#0D0E0B' }}
    >
      {/* Window chrome */}
      <div
        className="flex items-center gap-2 px-4 py-3 border-b"
        style={{ borderColor: 'rgba(255,255,255,0.07)' }}
      >
        <span className="w-3 h-3 rounded-full" style={{ background: '#E05C5C', opacity: 0.7 }} />
        <span className="w-3 h-3 rounded-full" style={{ background: '#E8943A', opacity: 0.7 }} />
        <span className="w-3 h-3 rounded-full" style={{ background: '#4CAF72', opacity: 0.7 }} />
        <span className="ml-2 text-[11px]" style={{ color: '#8A8470' }}>
          ana_bot.sh
        </span>
      </div>

      {/* Content */}
      <div className="p-5 overflow-x-auto">
        {lines.map((line, i) => (
          <div key={i} className="min-h-[1.4em]">
            {line ? colorizeLine(line) : <span>&nbsp;</span>}
          </div>
        ))}
        {isStreaming && (
          <span
            className="inline-block w-[7px] h-[1em] ml-0.5 align-middle animate-pulse"
            style={{ background: '#4CAF72' }}
          />
        )}
      </div>
    </div>
  )
}
