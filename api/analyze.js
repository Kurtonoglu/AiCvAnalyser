const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

function buildAnalysisPrompt(cvText) {
  return `You are an expert CV/resume reviewer with 15+ years of hiring experience across tech, finance, and creative industries.

Analyse the following CV and return a JSON object with this exact schema. Do not include any text outside the JSON.

CV TEXT:
---
${cvText}
---

Return ONLY this JSON structure (no markdown, no explanation):
{
  "overall_score": <number 0-100>,
  "scores": {
    "experience": <number 0-100>,
    "skills": <number 0-100>,
    "education": <number 0-100>,
    "formatting": <number 0-100>,
    "impact": <number 0-100>
  },
  "missing_sections": [<array of strings — section names that are absent but recommended>],
  "strengths": [<array of 3-5 specific strengths found in this CV>],
  "improvements": [<array of 4-6 specific, actionable improvement suggestions>],
  "summary": "<2-3 sentence professional assessment of this CV>"
}

Scoring guide:
- experience: depth and relevance of work history, years, progression
- skills: breadth and relevance of technical/soft skills listed
- education: qualifications, institutions, relevance to experience
- formatting: clarity, structure, readability, use of sections
- impact: quantifiable achievements, strong action verbs, measurable results

Be honest and constructive. Base scores strictly on what is present in the CV text.`
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { text } = req.body || {}
  if (!text) {
    return res.status(400).json({ error: 'Missing required field: text' })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'Server misconfiguration: missing API key' })
  }

  try {
    const response = await fetch(`${BASE_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: buildAnalysisPrompt(text) }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      }),
    })

    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      const msg = err?.error?.message || `HTTP ${response.status}`
      if (response.status === 429) return res.status(429).json({ error: 'Rate limit reached. Please wait a moment and try again.' })
      if (response.status === 400) return res.status(400).json({ error: `Invalid request: ${msg}` })
      return res.status(response.status).json({ error: `Gemini API error: ${msg}` })
    }

    const data = await response.json()
    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text
    if (!raw) return res.status(500).json({ error: 'Empty response from Gemini API.' })

    const result = JSON.parse(raw)
    return res.status(200).json(result)
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Internal server error' })
  }
}
