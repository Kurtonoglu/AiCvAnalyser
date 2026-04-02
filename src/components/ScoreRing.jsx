import { useEffect, useState } from 'react'

function getColor(score) {
  if (score >= 75) return { stroke: '#00D4AA', glow: 'ring-glow-green', label: 'Great', text: 'text-success' }
  if (score >= 50) return { stroke: '#FFD93D', glow: 'ring-glow-yellow', label: 'Fair', text: 'text-warning' }
  return { stroke: '#FF6B35', glow: 'ring-glow-orange', label: 'Needs Work', text: 'text-danger' }
}

export default function ScoreRing({ score = 0 }) {
  const [animated, setAnimated] = useState(0)

  useEffect(() => {
    const duration = 1200
    const start = performance.now()
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setAnimated(Math.round(eased * score))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [score])

  const size = 200
  const strokeWidth = 14
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (animated / 100) * circumference
  const { stroke, glow, label, text } = getColor(animated)

  return (
    <div className="flex flex-col items-center gap-4">
      <div className={`relative ${glow}`}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={strokeWidth}
          />
          {/* Progress */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{ transition: 'stroke-dashoffset 0.05s ease' }}
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-grotesk font-bold text-5xl ${text}`}>{animated}</span>
          <span className="font-mono text-xs text-white/30 tracking-widest uppercase mt-1">/100</span>
        </div>
      </div>

      <div className="text-center">
        <p className={`font-mono text-sm font-bold tracking-widest uppercase ${text}`}>{label}</p>
        <p className="font-grotesk text-white/40 text-sm mt-1">Overall CV Score</p>
      </div>
    </div>
  )
}
