import { useState } from 'react'

function scoreColor(score) {
  if (score >= 75) return { bg: 'rgba(0,212,170,0.12)', border: 'rgba(0,212,170,0.35)', text: '#00D4AA' }
  if (score >= 50) return { bg: 'rgba(255,217,61,0.12)', border: 'rgba(255,217,61,0.35)', text: '#FFD93D' }
  return { bg: 'rgba(255,107,53,0.12)', border: 'rgba(255,107,53,0.35)', text: '#FF6B35' }
}

function formatDate(ts) {
  return new Date(ts).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' })
}

export default function HistoryPanel({ history, onView, onDelete, onClear }) {
  const [removingIds, setRemovingIds] = useState(new Set())

  if (!history.length) return null

  const handleDelete = (id) => {
    setRemovingIds((prev) => new Set([...prev, id]))
    setTimeout(() => {
      onDelete(id)
      setRemovingIds((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }, 300)
  }

  const handleClear = () => {
    if (window.confirm('Clear all analysis history?')) onClear()
  }

  return (
    <div className="glass-card p-5 animate-fade-up">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-base">🕐</span>
          <h3 className="font-grotesk font-bold text-white/80 text-sm">Past Analyses</h3>
          <span
            className="font-mono text-xs px-1.5 py-0.5 rounded"
            style={{ background: 'rgba(123,97,255,0.15)', color: '#7B61FF' }}
          >
            {history.length}
          </span>
        </div>
        <button
          onClick={handleClear}
          className="font-mono text-xs text-white/25 hover:text-danger/70 transition-colors tracking-wider"
        >
          Clear All
        </button>
      </div>

      <div className="flex flex-col gap-2 max-h-[260px] overflow-y-auto pr-1"
        style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}
      >
        {history.map((entry) => {
          const col = scoreColor(entry.overallScore)
          const isRemoving = removingIds.has(entry.id)
          return (
            <div
              key={entry.id}
              className="flex items-center gap-3 p-3 rounded-xl transition-all duration-300"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                opacity: isRemoving ? 0 : 1,
                transform: isRemoving ? 'translateX(20px)' : 'translateX(0)',
                maxHeight: isRemoving ? '0' : '100px',
                overflow: 'hidden',
              }}
            >
              {/* Score badge */}
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center font-grotesk font-bold text-sm shrink-0"
                style={{ background: col.bg, border: `1px solid ${col.border}`, color: col.text }}
              >
                {entry.overallScore}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-grotesk text-xs text-white/75 truncate">{entry.filename}</p>
                <p className="font-mono text-xs text-white/25 mt-0.5">{formatDate(entry.timestamp)}</p>
              </div>

              {/* Actions */}
              <button
                onClick={() => onView(entry)}
                className="font-mono text-xs px-3 py-1.5 rounded-lg shrink-0 transition-all"
                style={{
                  background: 'rgba(123,97,255,0.12)',
                  border: '1px solid rgba(123,97,255,0.3)',
                  color: '#7B61FF',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(123,97,255,0.22)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(123,97,255,0.12)' }}
              >
                View
              </button>
              <button
                onClick={() => handleDelete(entry.id)}
                className="font-mono text-xs text-white/20 hover:text-danger/70 transition-colors px-1.5 shrink-0"
                aria-label="Delete entry"
              >
                ×
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
