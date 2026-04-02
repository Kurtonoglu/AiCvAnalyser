import { useState } from 'react'
import { matchJob } from '../services/gemini'
import LoadingOrb from './LoadingOrb'

const FIT_COLORS = {
  'Strong Fit': '#00D4AA',
  'Good Fit': '#7B61FF',
  'Partial Fit': '#FFD93D',
  'Weak Fit': '#FF6B35',
}

export default function JobMatchPanel({ cvText }) {
  const [jobTitle, setJobTitle] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const validateJobTitle = (title) => {
    if (title.length < 3) return false
    if (!/[aeiou]/i.test(title)) return false
    // Must contain at least one word of 2+ letters (no pure symbol/number strings)
    if (!/[a-zA-Z]{2,}/.test(title)) return false
    // Reject runs of consonants longer than 4 in a single word (gibberish like "xkzpw")
    if (/[^aeiou\s]{5,}/i.test(title)) return false
    return true
  }

  const handleMatch = async () => {
    const trimmed = jobTitle.trim()
    if (!trimmed) return
    if (!validateJobTitle(trimmed)) {
      setError('Please enter a valid job title (e.g. Frontend Developer, Data Analyst)')
      return
    }
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const data = await matchJob(cvText, trimmed)
      setResult(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const fitColor = result ? (FIT_COLORS[result.fit_level] ?? '#7B61FF') : '#7B61FF'

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
          style={{ background: 'rgba(123,97,255,0.15)', border: '1px solid rgba(123,97,255,0.3)' }}
        >
          🎯
        </div>
        <div>
          <h2 className="font-grotesk font-bold text-white/90 text-lg">Job Match</h2>
          <p className="font-mono text-xs text-white/30">See how well your CV fits a role</p>
        </div>
      </div>

      {/* Input */}
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !loading && handleMatch()}
          placeholder="e.g. Senior Frontend Engineer"
          disabled={loading}
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 font-grotesk text-sm text-white/80 placeholder-white/20 outline-none focus:border-accent-purple/60 transition-colors"
        />
        <button
          onClick={handleMatch}
          disabled={loading || jobTitle.trim().length < 3}
          className="btn-glow px-5 py-3 rounded-xl font-mono text-xs font-bold tracking-wider text-white disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none shrink-0"
        >
          MATCH
        </button>
      </div>

      {/* Loading */}
      {loading && <LoadingOrb message="MATCHING ROLE..." />}

      {/* Error */}
      {error && (
        <div
          className="p-4 rounded-xl font-mono text-xs text-danger/80"
          style={{ background: 'rgba(255,107,53,0.08)', border: '1px solid rgba(255,107,53,0.2)' }}
        >
          {error}
        </div>
      )}

      {/* Results */}
      {result && !loading && (
        <div className="flex flex-col gap-5 animate-fade-up">
          {/* Score + fit level */}
          <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: `${fitColor}10`, border: `1px solid ${fitColor}30` }}>
            <div>
              <p className="font-mono text-xs text-white/40 tracking-widest uppercase mb-1">Fit Level</p>
              <p className="font-grotesk font-bold text-xl" style={{ color: fitColor }}>
                {result.fit_level}
              </p>
            </div>
            <div className="text-right">
              <p className="font-mono text-xs text-white/40 tracking-widest uppercase mb-1">Match Score</p>
              <p className="font-grotesk font-bold text-3xl" style={{ color: fitColor }}>
                {result.match_score}
                <span className="text-base font-normal text-white/30 ml-1">/100</span>
              </p>
            </div>
          </div>

          {/* Skills grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Matching */}
            <div>
              <p className="font-mono text-xs text-success tracking-widest uppercase mb-2">✓ Matching Skills</p>
              <div className="flex flex-wrap gap-1.5">
                {result.matching_skills?.map((skill, i) => (
                  <span
                    key={i}
                    className="font-mono text-xs px-2.5 py-1 rounded-full"
                    style={{ background: 'rgba(0,212,170,0.1)', border: '1px solid rgba(0,212,170,0.3)', color: '#00D4AA' }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing */}
            <div>
              <p className="font-mono text-xs text-danger tracking-widest uppercase mb-2">✗ Missing Skills</p>
              <div className="flex flex-wrap gap-1.5">
                {result.missing_skills?.map((skill, i) => (
                  <span
                    key={i}
                    className="font-mono text-xs px-2.5 py-1 rounded-full"
                    style={{ background: 'rgba(255,107,53,0.1)', border: '1px solid rgba(255,107,53,0.3)', color: '#FF6B35' }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Recommendation */}
          {result.recommendation && (
            <div
              className="p-4 rounded-xl"
              style={{ background: 'rgba(123,97,255,0.07)', border: '1px solid rgba(123,97,255,0.2)' }}
            >
              <p className="font-mono text-xs text-accent-purple tracking-widest uppercase mb-2">💡 Recommendation</p>
              <p className="font-grotesk text-sm text-white/70 leading-relaxed">{result.recommendation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
