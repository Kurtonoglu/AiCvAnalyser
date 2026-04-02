export default function LoadingOrb({ message = 'ANALYZING YOUR CV...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-8">
      {/* Orb */}
      <div className="relative">
        {/* Outer glow rings */}
        <div
          className="absolute inset-0 rounded-full animate-ping"
          style={{
            background: 'radial-gradient(circle, rgba(123,97,255,0.3) 0%, transparent 70%)',
            transform: 'scale(1.8)',
            animationDuration: '2s',
          }}
        />
        <div
          className="absolute inset-0 rounded-full animate-ping"
          style={{
            background: 'radial-gradient(circle, rgba(255,60,172,0.2) 0%, transparent 70%)',
            transform: 'scale(2.4)',
            animationDuration: '2.5s',
            animationDelay: '0.3s',
          }}
        />

        {/* Main orb */}
        <div
          className="relative w-24 h-24 rounded-full animate-pulse-orb"
          style={{
            background: 'radial-gradient(circle at 35% 35%, #a78bfa, #7B61FF 40%, #FF3CAC 100%)',
            boxShadow: '0 0 40px rgba(123,97,255,0.6), 0 0 80px rgba(255,60,172,0.3)',
          }}
        />

        {/* Inner shine */}
        <div
          className="absolute top-3 left-4 w-8 h-5 rounded-full opacity-40"
          style={{ background: 'radial-gradient(circle, white, transparent)' }}
        />
      </div>

      {/* Text */}
      <div className="text-center">
        <p className="font-mono text-sm tracking-[0.25em] text-white/60 uppercase">
          {message}
        </p>
        <div className="flex justify-center gap-1 mt-3">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-accent-purple animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
