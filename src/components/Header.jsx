export default function Header() {
  return (
    <header className="text-center py-12 px-4">
      <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full border border-white/10 bg-white/5">
        <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
        <span className="font-mono text-xs text-white/50 tracking-widest uppercase">AI-Powered Analysis</span>
      </div>

      <h1
        className="gradient-text font-grotesk font-bold leading-none tracking-tight mb-4"
        style={{ fontSize: 'clamp(2.5rem, 8vw, 5rem)' }}
      >
        CV ANALYSER
      </h1>

      <p className="text-white/50 font-grotesk text-lg max-w-xl mx-auto leading-relaxed">
        Upload your CV and get instant AI feedback — scores, improvements,
        and job match analysis powered by Gemini.
      </p>
    </header>
  )
}
