import { checkRateLimit } from './rateLimit.js'
import { trackEvent } from './trackAnalytics.js'

const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

function buildJobMatchPrompt(cvText, jobTitle) {
  return `You are a senior recruiter evaluating a CV against a specific job role.

JOB TITLE: ${jobTitle}

CV TEXT:
---
${cvText}
---

Evaluate how well this CV matches the role and return ONLY this JSON structure (no markdown, no explanation):
{
  "match_score": <number 0-100>,
  "fit_level": <one of: "Strong Fit", "Good Fit", "Partial Fit", "Weak Fit">,
  "matching_skills": [<array of skills/experiences from the CV that match this role>],
  "missing_skills": [<array of key skills/experiences typically required for this role that are absent>],
  "recommendation": "<2-3 sentence personalised recommendation on how to better tailor this CV for the role>"
}

Be specific and practical. Base your evaluation on realistic job market expectations for "${jobTitle}".`
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

  const { text, jobTitle } = req.body || {}
  if (!text || !jobTitle) {
    return res.status(400).json({ error: 'Missing required fields: text, jobTitle' })
  }

  // Rate limiting (2 per hour for match)
  const ip = req.headers['x-forwarded-for']?.split(',')[0].trim()
    || req.socket?.remoteAddress
    || 'unknown'
  const rateCheck = await checkRateLimit(ip, 'match', 2, 60)
  if (rateCheck.limited) {
    return res.status(429).json({ error: rateCheck.message, retryAfter: rateCheck.retryAfter })
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
        contents: [{ parts: [{ text: buildJobMatchPrompt(text, jobTitle) }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      }),
    })

    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      const msg = err?.error?.message || `HTTP ${response.status}`
      if (response.status === 429 || response.status === 503) {
        return res.status(503).json({ error: 'AI service is temporarily overloaded. Please try again in a moment.' })
      }
      if (response.status === 400) return res.status(400).json({ error: `Invalid request: ${msg}` })
      return res.status(response.status).json({ error: `Gemini API error: ${msg}` })
    }

    const data = await response.json()
    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text
    if (!raw) return res.status(500).json({ error: 'Empty response from Gemini API.' })

    const result = JSON.parse(raw)

    trackEvent({ eventType: 'job_match', jobTitle, matchScore: result.match_score, cacheHit: false })

    return res.status(200).json(result)
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Internal server error' })
  }
}
