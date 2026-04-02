const API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

async function callGemini(prompt) {
  if (!API_KEY) {
    throw new Error('Gemini API key not found. Please add VITE_GEMINI_API_KEY to your .env file.')
  }

  const response = await fetch(`${BASE_URL}?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    const msg = err?.error?.message || `HTTP ${response.status}`
    if (response.status === 429) throw new Error('Rate limit reached. Please wait a moment and try again.')
    if (response.status === 400) throw new Error(`Invalid request: ${msg}`)
    if (response.status === 403) throw new Error('Invalid API key. Please check your VITE_GEMINI_API_KEY.')
    throw new Error(`Gemini API error: ${msg}`)
  }

  const data = await response.json()

  const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text
  if (!raw) throw new Error('Empty response from Gemini API.')

  try {
    return JSON.parse(raw)
  } catch {
    throw new Error('Failed to parse Gemini response as JSON. Try again.')
  }
}

export async function analyseCV(cvText, buildPrompt) {
  const prompt = buildPrompt(cvText)
  return callGemini(prompt)
}

export async function matchJob(cvText, jobTitle, buildPrompt) {
  const prompt = buildPrompt(cvText, jobTitle)
  return callGemini(prompt)
}
