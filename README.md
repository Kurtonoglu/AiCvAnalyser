# CV Analyser

> AI-powered resume reviewer built with React, Vite, and Google Gemini.

![CV Analyser Screenshot](./screenshot.png)

Upload your CV and get instant feedback: an overall score, category breakdowns, specific improvements, missing sections, and a job-match analysis — all running **100% client-side**, no backend required.

---

## Features

- **Drag-and-drop upload** — PDF, TXT, MD, DOC
- **Client-side PDF parsing** via `pdf.js`
- **Overall score** with animated SVG ring (0–100)
- **5 category scores** — Experience, Skills, Education, Formatting, Impact
- **Strengths & improvements** with numbered action cards
- **Missing sections** highlighted as tags
- **Job Match panel** — enter a role, get a match score + skill gap analysis
- **Bold dark UI** — glass-morphism, gradient glow, Space Grotesk typography

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| UI | React 18 + Vite |
| Styling | Tailwind CSS v3 |
| AI | Google Gemini 2.5 Flash |
| PDF | pdfjs-dist |
| Runtime | Browser-only (no backend) |

---

## Setup

### 1. Clone and install

```bash
git clone <your-repo-url>
cd cv-analyser
npm install
```

### 2. Add your Gemini API key

```bash
cp .env.example .env
```

Open `.env` and replace the placeholder:

```
VITE_GEMINI_API_KEY=your_actual_key_here
```

### 3. Start the dev server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## Getting a Free Gemini API Key

1. Visit [https://aistudio.google.com/apikey](https://aistudio.google.com/apikey)
2. Sign in with your Google account
3. Click **Create API key**
4. Copy the key into your `.env` file

### Free tier limits
- **10 requests per minute (RPM)**
- **250 requests per day**

These limits are more than enough for personal use.

---

## Build for production

```bash
npm run build
npm run preview
```

---

## License

MIT

---

## Author

**Nedim** — built with ♥ and Gemini AI
