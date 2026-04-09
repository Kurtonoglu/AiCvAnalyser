const STAGES = [
  { icon: '📄', label: 'Extracting text...' },
  { icon: '🔍', label: 'Analyzing CV structure...' },
  { icon: '📊', label: 'Scoring categories...' },
  { icon: '💡', label: 'Generating suggestions...' },
]

const PROGRESS = [25, 50, 75, 90]

export default function LoadingProgress({ stage }) {
  const progress = stage !== null ? PROGRESS[stage] ?? 0 : 0

  return (
    <div className="flex flex-col items-center py-16 gap-8">
      {/* Small orb */}
      <div className="relative w-16 h-16">
        <div
          className="absolute inset-0 rounded-full animate-ping"
          style={{
            background: 'radial-gradient(circle, rgba(123,97,255,0.3) 0%, transparent 70%)',
            transform: 'scale(1.8)',
            animationDuration: '2s',
          }}
        />
        <div
          className="relative w-16 h-16 rounded-full animate-pulse-orb"
          style={{
            background: 'radial-gradient(circle at 35% 35%, #a78bfa, #7B61FF 40%, #FF3CAC 100%)',
            boxShadow: '0 0 30px rgba(123,97,255,0.5), 0 0 60px rgba(255,60,172,0.2)',
          }}
        />
        <div
          className="absolute top-2 left-3 w-5 h-3 rounded-full opacity-40"
          style={{ background: 'radial-gradient(circle, white, transparent)' }}
        />
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-xs">
        <div className="h-1 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #7B61FF, #FF3CAC)',
              transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
        </div>
        <p className="font-mono text-xs text-white/30 text-right mt-1 tracking-widest">{progress}%</p>
      </div>

      {/* Stage list */}
      <div className="flex flex-col gap-3 w-full max-w-xs">
        {STAGES.map((s, i) => {
          const isDone = i < stage
          const isCurrent = i === stage
          const isPending = i > stage

          return (
            <div
              key={i}
              className="flex items-center gap-3 transition-all duration-300"
              style={{ opacity: isPending ? 0.25 : 1 }}
            >
              <span className="text-base w-6 text-center shrink-0">
                {isDone ? (
                  <span
                    className="inline-block text-success animate-fade-up"
                    style={{ animationDuration: '0.3s' }}
                  >
                    ✓
                  </span>
                ) : (
                  s.icon
                )}
              </span>
              <span
                className={`font-mono text-xs tracking-wider ${
                  isDone
                    ? 'text-success'
                    : isCurrent
                    ? 'text-white'
                    : 'text-white/40'
                }`}
              >
                {s.label}
              </span>
              {isCurrent && (
                <span
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-accent-purple animate-pulse shrink-0"
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
