export function buildAnalysisPrompt(cvText) {
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

export function buildJobMatchPrompt(cvText, jobTitle) {
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
