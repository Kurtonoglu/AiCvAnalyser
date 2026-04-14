# CV Analyser

> AI-powered resume reviewer built with React, Vite, and Google Gemini.

![CV Analyser Screenshot](./screenshot.png)

Upload your CV and get instant AI feedback: an overall score, category breakdowns, specific improvements, missing sections, and a job-match analysis — secured via a serverless API proxy with rate limiting and response caching.

**Live demo → [ai-cv-analyser-kohl.vercel.app](https://ai-cv-analyser-kohl.vercel.app)**

---

## Features

- **Drag-and-drop upload** — PDF, DOCX, TXT, MD (max 5 MB, single file)
- **Client-side PDF parsing** via `pdf.js`
- **Overall score** with animated SVG ring (0–100)
- **5 category scores** — Experience, Skills, Education, Formatting, Impact
- **Strengths & improvements** with numbered action cards
- **Missing sections** highlighted as tags
- **Job Match panel** — enter a role, get a match score + skill gap analysis
- **Analysis history** — last 10 results saved in localStorage, re-viewable any time
- **PDF export** — download a formatted report of your analysis
- **Multi-stage loading** — live progress indicator during analysis
- **Smart retry** — auto-retries on Gemini 503 errors with user feedback
- **Bold dark UI** — glass-morphism, gradient glow, Space Grotesk typography

---

## Architecture

```
Browser (React + Vite)
        │
        │  POST /api/analyze
        │  POST /api/match
        ▼
Vercel Serverless Functions
        │
        ├──► Google Gemini 2.5 Flash  (AI analysis)
        │
        └──► Supabase
               ├── rate_limits   (3 analyses / hr per IP)
               ├── analysis_cache (30-min TTL)
               └── analytics     (event tracking)
```

The Gemini API key never reaches the browser — all AI calls are proxied through serverless functions.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| UI | React 18 + Vite |
| Styling | Tailwind CSS v3 |
| AI | Google Gemini 2.5 Flash |
| PDF | pdfjs-dist |
| API | Vercel Serverless Functions |
| Database | Supabase (PostgreSQL) |
| Deployment | Vercel |

---

## Setup

### 1. Clone and install

```bash
git clone https://github.com/Kurtonoglu/AiCvAnalyser.git
cd AiCvAnalyser
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in your keys:

```
GEMINI_API_KEY=your_gemini_key_here

# Supabase (optional — enables rate limiting, caching, and analytics)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
```

> **Note:** These are server-side variables (no `VITE_` prefix). They are used only by the Vercel serverless functions and are never exposed to the browser.

### 3. Set up Supabase (optional but recommended)

1. Create a free project at [supabase.com](https://supabase.com)
2. Open the **SQL Editor** and run the contents of `supabase/schema.sql`
3. Copy your **Project URL** and **anon public key** from Project Settings → API

If `SUPABASE_URL` / `SUPABASE_ANON_KEY` are not set, the app still works — rate limiting and caching are simply skipped.

### 4. Run locally

The serverless functions require the Vercel CLI to run locally:

```bash
npm install -g vercel
vercel dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deploying to Vercel

1. Push to GitHub
2. Import the repo in [vercel.com/new](https://vercel.com/new)
3. Add environment variables in the Vercel dashboard:
   - `GEMINI_API_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
4. Deploy

---

## Getting a Free Gemini API Key

1. Visit [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
2. Sign in with your Google account
3. Click **Create API key**
4. Copy the key into your `.env` file (or Vercel environment variables)

### Gemini free tier limits
- **10 requests per minute (RPM)**
- **250 requests per day**

The app-level rate limit (3 analyses per hour per IP) sits well within these constraints.

---

## License

MIT

---

## Author

**Nedim Kurtovic** — [github.com/Kurtonoglu](https://github.com/Kurtonoglu)
