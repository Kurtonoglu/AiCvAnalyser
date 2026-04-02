import { useEffect, useState } from 'react'

const CATEGORIES = [
  { key: 'experience', label: 'Experience', emoji: '💼', color: '#FF6B35' },
  { key: 'skills', label: 'Skills', emoji: '⚡', color: '#00D4AA' },
  { key: 'education', label: 'Education', emoji: '🎓', color: '#7B61FF' },
  { key: 'formatting', label: 'Formatting', emoji: '✨', color: '#FF3CAC' },
  { key: 'impact', label: 'Impact', emoji: '🎯', color: '#FFD93D' },
]

function Bar({ value, color, delay }) {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => setWidth(value), 100 + delay)
    return () => clearTimeout(t)
  }, [value, delay])

  return (
    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-700 ease-out"
        style={{
          width: `${width}%`,
          background: `linear-gradient(90deg, ${color}cc, ${color})`,
          boxShadow: `0 0 8px ${color}66`,
          transitionDelay: `${delay}ms`,
        }}
      />
    </div>
  )
}

export default function CategoryBar({ scores }) {
  return (
    <div className="flex flex-col gap-4">
      {CATEGORIES.map(({ key, label, emoji, color }, i) => (
        <div key={key}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-base">{emoji}</span>
              <span className="font-grotesk text-sm text-white/70">{label}</span>
            </div>
            <span
              className="font-mono text-sm font-bold"
              style={{ color }}
            >
              {scores[key] ?? 0}
            </span>
          </div>
          <Bar value={scores[key] ?? 0} color={color} delay={i * 80} />
        </div>
      ))}
    </div>
  )
}
