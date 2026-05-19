export function SunflowerDecoration({
  size = 240,
  opacity = 0.07,
  className = '',
}: {
  size?: number
  opacity?: number
  className?: string
}) {
  const N = 13 // Fibonacci
  const cx = 120
  const cy = 120

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 240 240"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity }}
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {/* 13 Petals */}
      {Array.from({ length: N }, (_, i) => (
        <ellipse
          key={i}
          cx={cx}
          cy={cy - 80}
          rx={20}
          ry={52}
          fill="#E8C46A"
          transform={`rotate(${(360 / N) * i}, ${cx}, ${cy})`}
        />
      ))}

      {/* Center disk */}
      <circle cx={cx} cy={cy} r={47} fill="#2C1A0E" />

      {/* Outer seed ring — 21 dots @ r=36 */}
      {Array.from({ length: 21 }, (_, i) => {
        const a = ((360 / 21) * i - 90) * (Math.PI / 180)
        return (
          <circle
            key={`o${i}`}
            cx={cx + 36 * Math.cos(a)}
            cy={cy + 36 * Math.sin(a)}
            r={2.8}
            fill="#4A2E18"
          />
        )
      })}

      {/* Middle seed ring — 13 dots @ r=24 */}
      {Array.from({ length: 13 }, (_, i) => {
        const a = ((360 / 13) * i - 90) * (Math.PI / 180)
        return (
          <circle
            key={`m${i}`}
            cx={cx + 24 * Math.cos(a)}
            cy={cy + 24 * Math.sin(a)}
            r={3.2}
            fill="#3D2510"
          />
        )
      })}

      {/* Inner seed ring — 8 dots @ r=13 */}
      {Array.from({ length: 8 }, (_, i) => {
        const a = ((360 / 8) * i - 90) * (Math.PI / 180)
        return (
          <circle
            key={`in${i}`}
            cx={cx + 13 * Math.cos(a)}
            cy={cy + 13 * Math.sin(a)}
            r={2.8}
            fill="#30200E"
          />
        )
      })}

      {/* Center */}
      <circle cx={cx} cy={cy} r={5} fill="#1E1208" />
    </svg>
  )
}
