import * as pdfjsLib from 'pdfjs-dist'

// Point worker to the bundled file via CDN to avoid Vite worker complications
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`

export async function extractTextFromPDF(file) {
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

  const pageTexts = []
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    const pageText = content.items.map((item) => item.str).join(' ')
    pageTexts.push(pageText)
  }

  return pageTexts.join('\n\n').trim()
}

export async function extractTextFromFile(file) {
  const ext = file.name.split('.').pop().toLowerCase()

  if (ext === 'pdf') {
    return extractTextFromPDF(file)
  }

  // Plain text files (.txt, .md, .doc treated as text)
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.onerror = () => reject(new Error('Failed to read file.'))
    reader.readAsText(file)
  })
}
