import html2pdf from 'html2pdf.js'

function scoreColor(score) {
  if (score >= 75) return '#00D4AA'
  if (score >= 50) return '#FFD93D'
  return '#FF6B35'
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function exportPDF(result, filename = 'CV', jobMatch = null) {
  const today = new Date().toISOString().slice(0, 10)
  const stem = filename.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_')
  const scoreCol = scoreColor(result.overall_score)

  const categoryRows = Object.entries(result.scores ?? {})
    .map(([cat, score]) => {
      const col = scoreColor(score)
      return `
        <tr>
          <td style="padding:6px 8px;font-size:12px;color:#555;text-transform:capitalize;">${cat.replace(/_/g, ' ')}</td>
          <td style="padding:6px 8px;width:55%;">
            <div style="height:8px;border-radius:4px;background:#eee;overflow:hidden;">
              <div style="height:100%;width:${score}%;background:${col};border-radius:4px;"></div>
            </div>
          </td>
          <td style="padding:6px 8px;font-size:12px;font-weight:bold;color:${col};text-align:right;">${score}</td>
        </tr>`
    })
    .join('')

  const strengthsList = (result.strengths ?? [])
    .map((s) => `<li style="margin-bottom:4px;color:#333;">${s}</li>`)
    .join('')

  const improvementsList = (result.improvements ?? [])
    .map((imp, i) => `<li style="margin-bottom:6px;color:#333;"><strong style="color:#FF6B35;">${i + 1}.</strong> ${imp}</li>`)
    .join('')

  const missingTags = (result.missing_sections ?? [])
    .map((m) => `<span style="display:inline-block;margin:3px;padding:3px 10px;border-radius:20px;background:#fff0eb;border:1px solid #FF6B35;color:#FF6B35;font-size:11px;">${m}</span>`)
    .join('')

  let jobMatchSection = ''
  if (jobMatch) {
    const jCol = scoreColor(jobMatch.match_score)
    const matchingSkills = (jobMatch.matching_skills ?? [])
      .map((s) => `<span style="display:inline-block;margin:2px;padding:2px 8px;border-radius:20px;background:#e8fdf8;border:1px solid #00D4AA;color:#00D4AA;font-size:11px;">${s}</span>`)
      .join('')
    const missingSkills = (jobMatch.missing_skills ?? [])
      .map((s) => `<span style="display:inline-block;margin:2px;padding:2px 8px;border-radius:20px;background:#fff0eb;border:1px solid #FF6B35;color:#FF6B35;font-size:11px;">${s}</span>`)
      .join('')

    jobMatchSection = `
      <div style="margin-top:28px;">
        <h2 style="color:#7B61FF;font-size:14px;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:12px;border-bottom:1px solid #e5e5e5;padding-bottom:6px;">Job Match Analysis</h2>
        <div style="display:flex;gap:24px;margin-bottom:12px;">
          <div>
            <p style="font-size:11px;color:#888;margin:0 0 2px;">Match Score</p>
            <p style="font-size:28px;font-weight:bold;color:${jCol};margin:0;">${jobMatch.match_score}<span style="font-size:14px;color:#999;">/100</span></p>
          </div>
          <div>
            <p style="font-size:11px;color:#888;margin:0 0 2px;">Fit Level</p>
            <p style="font-size:20px;font-weight:bold;color:${jCol};margin:0;">${jobMatch.fit_level}</p>
          </div>
        </div>
        ${matchingSkills ? `<p style="font-size:11px;color:#00D4AA;font-weight:bold;margin-bottom:4px;">✓ MATCHING SKILLS</p><div style="margin-bottom:10px;">${matchingSkills}</div>` : ''}
        ${missingSkills ? `<p style="font-size:11px;color:#FF6B35;font-weight:bold;margin-bottom:4px;">✗ MISSING SKILLS</p><div style="margin-bottom:10px;">${missingSkills}</div>` : ''}
        ${jobMatch.recommendation ? `<div style="padding:10px 14px;background:#f5f3ff;border-left:3px solid #7B61FF;border-radius:4px;"><p style="font-size:11px;color:#7B61FF;font-weight:bold;margin:0 0 4px;">💡 RECOMMENDATION</p><p style="font-size:12px;color:#444;margin:0;">${jobMatch.recommendation}</p></div>` : ''}
      </div>`
  }

  const html = `
    <div style="font-family:'Segoe UI',Arial,sans-serif;color:#1a1a1a;max-width:700px;margin:0 auto;padding:32px 40px;">
      <!-- Header -->
      <div style="background:linear-gradient(135deg,#7B61FF,#FF3CAC);border-radius:12px;padding:24px 28px;margin-bottom:28px;color:white;">
        <h1 style="margin:0;font-size:22px;letter-spacing:0.05em;">CV Analysis Report</h1>
        <p style="margin:6px 0 0;font-size:12px;opacity:0.8;">${filename} &nbsp;·&nbsp; ${formatDate(new Date().toISOString())}</p>
      </div>

      <!-- Overall Score -->
      <div style="display:flex;align-items:center;gap:20px;margin-bottom:28px;padding:20px;background:#fafafa;border-radius:12px;border:1px solid #eee;">
        <div style="width:80px;height:80px;border-radius:50%;background:${scoreCol};display:flex;align-items:center;justify-content:center;color:white;font-size:26px;font-weight:bold;flex-shrink:0;">
          ${result.overall_score}
        </div>
        <div>
          <p style="font-size:11px;color:#888;margin:0 0 2px;letter-spacing:0.1em;text-transform:uppercase;">Overall CV Score</p>
          <p style="font-size:16px;font-weight:bold;color:${scoreCol};margin:0;">${result.overall_score >= 75 ? 'Great' : result.overall_score >= 50 ? 'Fair' : 'Needs Work'}</p>
          ${result.summary ? `<p style="font-size:12px;color:#555;margin:6px 0 0;line-height:1.5;">${result.summary}</p>` : ''}
        </div>
      </div>

      <!-- Category Scores -->
      <h2 style="color:#7B61FF;font-size:14px;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:12px;border-bottom:1px solid #e5e5e5;padding-bottom:6px;">Category Scores</h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
        ${categoryRows}
      </table>

      <!-- Strengths -->
      ${strengthsList ? `
      <h2 style="color:#00D4AA;font-size:14px;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:10px;border-bottom:1px solid #e5e5e5;padding-bottom:6px;">Strengths</h2>
      <ul style="margin:0 0 24px;padding-left:20px;line-height:1.8;">${strengthsList}</ul>` : ''}

      <!-- Improvements -->
      ${improvementsList ? `
      <h2 style="color:#FF6B35;font-size:14px;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:10px;border-bottom:1px solid #e5e5e5;padding-bottom:6px;">Improvements</h2>
      <ul style="margin:0 0 24px;padding-left:20px;line-height:1.8;list-style:none;">${improvementsList}</ul>` : ''}

      <!-- Missing Sections -->
      ${missingTags ? `
      <h2 style="color:#FF6B35;font-size:14px;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:10px;border-bottom:1px solid #e5e5e5;padding-bottom:6px;">Missing Sections</h2>
      <div style="margin-bottom:24px;">${missingTags}</div>` : ''}

      <!-- Job Match -->
      ${jobMatchSection}

      <!-- Footer -->
      <div style="margin-top:36px;padding-top:16px;border-top:1px solid #eee;text-align:center;">
        <p style="font-size:10px;color:#bbb;margin:0;">Generated by AI CV Analyser — github.com/Kurtonoglu/AiCvAnalyser</p>
      </div>
    </div>`

  html2pdf()
    .set({
      margin: 15,
      filename: `CV_Analysis_Report_${stem}_${today}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    })
    .from(html)
    .save()
}
