const MAX_RETRIES = 2
const RETRY_DELAY_MS = 10000

async function callWithRetry(url, body, onStatusUpdate) {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    if (attempt > 0) {
      onStatusUpdate?.(`Service is busy, retrying in 10s... (${attempt}/${MAX_RETRIES})`)
      await new Promise(r => setTimeout(r, RETRY_DELAY_MS))
      onStatusUpdate?.(null)
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    if (response.status === 429) {
      throw new Error(data.error || 'Rate limit exceeded. Please try again later.')
    }

    if (response.status === 503) {
      if (attempt < MAX_RETRIES) continue
      throw new Error('AI service temporarily unavailable. Please try again in a few minutes.')
    }

    if (!response.ok) {
      throw new Error(data.error || `Request failed with status ${response.status}`)
    }

    return data
  }
}

export async function analyseCV(cvText, onStatusUpdate) {
  return callWithRetry('/api/analyze', { text: cvText }, onStatusUpdate)
}

export async function matchJob(cvText, jobTitle, onStatusUpdate) {
  return callWithRetry('/api/match', { text: cvText, jobTitle }, onStatusUpdate)
}
