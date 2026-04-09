import ScoreRing from './ScoreRing'
import CategoryBar from './CategoryBar'
import ImprovementCard from './ImprovementCard'
import JobMatchPanel from './JobMatchPanel'
import { exportPDF } from '../utils/exportPDF'

export default function AnalysisResults({ result, cvText, filename, jobMatch, onJobMatch }) {
  return (
    <div className="flex flex-col gap-8 animate-fade-up">

      {/* Summary banner */}
      {result.summary && (
        <div
          className="p-5 rounded-2xl"
          style={{ background: 'rgba(123,97,255,0.08)', border: '1px solid rgba(123,97,255,0.2)' }}
        >
          <p className="font-mono text-xs text-accent-purple tracking-widest uppercase mb-2">AI Summary</p>
          <p className="font-grotesk text-white/75 leading-relaxed">{result.summary}</p>
        </div>
      )}

      {/* Score section */}
      <div className="glass-card p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="flex justify-center">
            <ScoreRing score={result.overall_score} />
          </div>
          <CategoryBar scores={result.scores ?? {}} />
        </div>
      </div>

      {/* Feedback section */}
      <ImprovementCard
        improvements={result.improvements}
        missing={result.missing_sections}
        strengths={result.strengths}
      />

      {/* Download button */}
      <div className="flex justify-end">
        <button
          onClick={() => exportPDF(result, filename, jobMatch)}
          className="border border-white/20 text-white/60 hover:border-accent-purple hover:text-accent-purple px-4 py-2 rounded-xl font-mono text-sm transition-all"
        >
          📄 Download Report
        </button>
      </div>

      {/* Job match */}
      <JobMatchPanel cvText={cvText} onJobMatch={onJobMatch} />
    </div>
  )
}
