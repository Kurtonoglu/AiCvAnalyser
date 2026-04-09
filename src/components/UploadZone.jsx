import { useState, useRef, useCallback } from 'react'

const ACCEPTED = ['.pdf', '.docx', '.doc', '.txt', '.md']
const ACCEPTED_MIME = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
  'text/plain',
  'text/markdown',
]
const MAX_SIZE = 5 * 1024 * 1024

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function UploadZone({ onFile, disabled }) {
  const [dragging, setDragging] = useState(false)
  const [file, setFile] = useState(null)
  const [error, setError] = useState(null)
  const inputRef = useRef(null)

  const handleFile = useCallback((f) => {
    if (!f) return
    const ext = '.' + f.name.split('.').pop().toLowerCase()
    if (!ACCEPTED.includes(ext) && !ACCEPTED_MIME.includes(f.type)) {
      setError('Unsupported file type. Please upload a PDF, DOCX, TXT, or MD file')
      return
    }
    if (f.size > MAX_SIZE) {
      setError('File too large. Maximum size is 5MB')
      return
    }
    setError(null)
    setFile(f)
    onFile(f)
  }, [onFile])

  const onDrop = useCallback((e) => {
    e.preventDefault()
    setDragging(false)
    if (e.dataTransfer.files.length > 1) {
      setError('Only one file can be uploaded at a time')
      return
    }
    const f = e.dataTransfer.files[0]
    handleFile(f)
  }, [handleFile])

  const onDragOver = (e) => { e.preventDefault(); setDragging(true) }
  const onDragLeave = () => setDragging(false)
  const onInputChange = (e) => handleFile(e.target.files[0])

  return (
    <div className="w-full">
      <div
        onClick={() => !disabled && inputRef.current?.click()}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className={[
          'relative rounded-2xl p-10 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all duration-300',
          'border-2 border-dashed',
          dragging
            ? 'border-accent-purple bg-accent-purple/10 scale-[1.01]'
            : file
            ? 'border-success/50 bg-success/5'
            : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]',
          disabled ? 'opacity-50 cursor-not-allowed' : '',
        ].join(' ')}
        style={{
          boxShadow: dragging ? '0 0 30px rgba(123,97,255,0.15)' : undefined,
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx,.doc,.txt,.md"
          onChange={onInputChange}
          className="hidden"
          disabled={disabled}
        />

        {file ? (
          <>
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
              style={{ background: 'rgba(0,212,170,0.15)', border: '1px solid rgba(0,212,170,0.3)' }}
            >
              📄
            </div>
            <div className="text-center">
              <p className="font-grotesk font-semibold text-white/90 text-lg">{file.name}</p>
              <p className="font-mono text-xs text-white/40 mt-1">{formatBytes(file.size)}</p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); setFile(null); setError(null); onFile(null) }}
              className="font-mono text-xs text-white/30 hover:text-white/60 transition-colors mt-1"
            >
              × Remove file
            </button>
          </>
        ) : (
          <>
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl transition-transform duration-300"
              style={{
                background: dragging ? 'rgba(123,97,255,0.2)' : 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                transform: dragging ? 'scale(1.1)' : 'scale(1)',
              }}
            >
              {dragging ? '✨' : '📁'}
            </div>
            <div className="text-center">
              <p className="font-grotesk font-semibold text-white/80 text-lg">
                {dragging ? 'Drop it here!' : 'Drop your CV here'}
              </p>
              <p className="font-grotesk text-white/40 text-sm mt-1">
                or <span className="text-accent-purple">click to browse</span>
              </p>
            </div>
            <p className="font-mono text-xs text-white/25 tracking-wider">
              PDF · DOCX · DOC · TXT · MD — max 5 MB
            </p>
          </>
        )}
      </div>

      {error && (
        <p className="mt-3 text-center font-mono text-xs text-danger/80">{error}</p>
      )}
    </div>
  )
}
