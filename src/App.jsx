import { useState } from 'react'
import Header from './components/Header'
import UploadZone from './components/UploadZone'
import AnalysisResults from './components/AnalysisResults'
import LoadingProgress from './components/LoadingProgress'
import HistoryPanel from './components/HistoryPanel'
import { analyseCV } from './services/gemini'
import { extractTextFromFile } from './services/pdfParser'
import useAnalysisHistory from './hooks/useAnalysisHistory'

export default function App() {
  const [file, setFile] = useState(null)
  const [cvText, setCvText] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loadingStage, setLoadingStage] = useState(null)
  const [error, setError] = useState(null)
  const [jobMatch, setJobMatch] = useState(null)

  const [history, saveEntry, deleteEntry, clearHistory] = useAnalysisHistory()

  const handleFile = (f) => {
    setFile(f)
    setResult(null)
    setError(null)
    setCvText(null)
    setJobMatch(null)
  }

  const handleAnalyse = async () => {
    if (!file) return
    setLoading(true)
    setError(null)
    setResult(null)
    setJobMatch(null)
    setLoadingStage(0)

    const t1 = setTimeout(() => setLoadingStage(1), 1500)
    const t2 = setTimeout(() => setLoadingStage(2), 3500)
    const t3 = setTimeout(() => setLoadingStage(3), 5500)

    try {
      const text = await extractTextFromFile(file)
      if (!text || text.trim().length < 50) {
        throw new Error('Could not extract enough text from your file. Try a different format.')
      }
      setCvText(text)
      const analysis = await analyseCV(text)
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3)
      setResult(analysis)
      saveEntry({
        filename: file.name,
        timestamp: Date.now(),
        overallScore: analysis.overall_score,
        scores: analysis.scores,
        result: analysis,
        jobMatch: null,
      })
    } catch (e) {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3)
      setError(e.message)
    } finally {
      setLoadingStage(null)
      setLoading(false)
    }
  }

  const handleViewHistory = (entry) => {
    setResult(entry.result)
    setFile({ name: entry.filename })
    setCvText(null)
    setJobMatch(entry.jobMatch ?? null)
    setError(null)
  }

  return (
    <div className="min-h-screen flex flex-col font-grotesk">
      <div className="flex-1 w-full max-w-[800px] mx-auto px-4 pb-16">
        <Header />

        {/* Upload zone */}
        <div className="mb-6">
          <UploadZone onFile={handleFile} disabled={loading} />
        </div>

        {/* Analyse button */}
        {file && !loading && (
          <div className="flex justify-center mb-10">
            <button
              onClick={handleAnalyse}
              className="btn-glow px-10 py-4 rounded-2xl font-mono text-sm font-bold tracking-[0.15em] text-white uppercase"
            >
              ✦ Analyse CV
            </button>
          </div>
        )}

        {/* History */}
        {!loading && (
          <div className="mb-8">
            <HistoryPanel
              history={history}
              onView={handleViewHistory}
              onDelete={deleteEntry}
              onClear={clearHistory}
            />
          </div>
        )}

        {/* Loading */}
        {loading && <LoadingProgress stage={loadingStage} />}

        {/* Error */}
        {error && !loading && (
          <div
            className="mb-8 p-5 rounded-2xl"
            style={{ background: 'rgba(255,107,53,0.07)', border: '1px solid rgba(255,107,53,0.2)' }}
          >
            <p className="font-mono text-xs text-danger tracking-widest uppercase mb-1">Error</p>
            <p className="font-grotesk text-sm text-white/70">{error}</p>
          </div>
        )}

        {/* Results */}
        {result && !loading && (
          <AnalysisResults
            result={result}
            cvText={cvText}
            filename={file?.name ?? 'CV'}
            jobMatch={jobMatch}
            onJobMatch={setJobMatch}
          />
        )}
      </div>

      {/* Footer */}
      <footer className="py-6 text-center border-t border-white/[0.04]">
        <p className="font-mono text-xs text-white/20 tracking-[0.2em] uppercase">
          Built by Nedim &nbsp;•&nbsp; Powered by Gemini AI
        </p>
      </footer>
    </div>
  )
}
