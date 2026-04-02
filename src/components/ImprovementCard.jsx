const ACCENT_COLORS = ['#7B61FF', '#FF3CAC', '#00D4AA', '#FFD93D', '#FF6B35', '#7B61FF']

export default function ImprovementCard({ improvements, missing, strengths }) {
  return (
    <div className="flex flex-col gap-6">

      {/* Strengths */}
      {strengths?.length > 0 && (
        <div className="glass-card p-5">
          <h3 className="font-mono text-xs text-success tracking-widest uppercase mb-4">
            ✓ Strengths
          </h3>
          <div className="flex flex-col gap-2">
            {strengths.map((s, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-xl"
                style={{ background: 'rgba(0,212,170,0.06)', border: '1px solid rgba(0,212,170,0.12)' }}
              >
                <span className="text-success mt-0.5 text-sm">✓</span>
                <p className="font-grotesk text-sm text-white/80">{s}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Improvements */}
      {improvements?.length > 0 && (
        <div className="glass-card p-5">
          <h3 className="font-mono text-xs text-warning tracking-widest uppercase mb-4">
            ↑ Improvements
          </h3>
          <div className="flex flex-col gap-3">
            {improvements.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-3 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${ACCENT_COLORS[i]}22` }}
              >
                <span
                  className="font-mono text-xs font-bold shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5"
                  style={{
                    background: `${ACCENT_COLORS[i]}18`,
                    color: ACCENT_COLORS[i],
                    border: `1px solid ${ACCENT_COLORS[i]}40`,
                  }}
                >
                  {i + 1}
                </span>
                <p className="font-grotesk text-sm text-white/75 leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Missing sections */}
      {missing?.length > 0 && (
        <div className="glass-card p-5">
          <h3 className="font-mono text-xs text-danger tracking-widest uppercase mb-4">
            ⚠ Missing Sections
          </h3>
          <div className="flex flex-wrap gap-2">
            {missing.map((section, i) => (
              <span
                key={i}
                className="font-mono text-xs px-3 py-1.5 rounded-full"
                style={{
                  background: `${ACCENT_COLORS[i % ACCENT_COLORS.length]}12`,
                  border: `1px solid ${ACCENT_COLORS[i % ACCENT_COLORS.length]}40`,
                  color: ACCENT_COLORS[i % ACCENT_COLORS.length],
                }}
              >
                + {section}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
