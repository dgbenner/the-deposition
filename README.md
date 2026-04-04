# The Deposition
### An Unguarded Account

A fictional analytical construct that gives Donald Trump the self-awareness he lacks in real life — explaining his actual motivations, psychology, and decision-making plainly, without performance or deflection.

Built on sourced biographical and psychological research: Mary Trump's clinical assessments, Bob Woodward's interviews, Wayne Barrett's investigative reporting, the NYT tax investigation, Frontline documentaries, and others. The system prompt contains a detailed psychological profile covering formation, family dynamics, key influences (Fred Trump, Roy Cohn, Norman Vincent Peale), political architecture, financial history, and Jungian shadow analysis.

This is not an impersonation. It is a transparency engine.

---

## Live

**[the-deposition-ttoq.vercel.app](https://the-deposition-ttoq.vercel.app)**

---

## Modes

**SCENARIO** — Present a current event, policy decision, or political action. The construct processes it through its actual logic — what the mechanism is underneath the official explanation.

**FIRESIDE** — Give a topic or theme. The construct traces it autobiographically from formation through to present action — Queens, Fred Trump, Roy Cohn, Norman Vincent Peale, and forward to the policy.

---

## Features

- **Password-gated access** — configurable via environment variable
- **Suggested Topics modal** — curated topic buttons across six categories (This Week, Family & Formation, Psychology & Shadow, The Presidency, Platform & Power, Money & Legacy) with hidden expanded prompts behind each
- **Dynamic current events** — "This Week" section auto-generates from live web search on login
- **Large text mode** — toggle for accessibility, on by default, adjusts response length accordingly
- **Web search** — the construct can pull current news and process it through the psychological model in real time
- **Model fallback chain** — Opus → Sonnet → Haiku, degrades gracefully on billing limits
- **Google Sheets logging** — all questions, responses, model used, and token counts logged via Apps Script webhook
- **CRT terminal aesthetic** — amber phosphor UI with scanlines, chunky Atari-style scrollbar with pixelated arrow buttons, retro typography

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Primary LLM | Claude Opus (Anthropic API) with web search |
| Topic generation | Claude Haiku for fast current event scanning |
| Fallback chain | Opus → Sonnet → Haiku |
| Hosting | Vercel (serverless Node.js functions + static HTML) |
| Frontend | Vanilla HTML / CSS / JS — no frameworks |
| Logging | Google Apps Script webhook → Google Sheets |
| Analytics | Statcounter |
| Version control | GitHub with Vercel auto-deploy on push to main |

---

## Project Structure

```
the-deposition/
├── api/
│   ├── chat.js          ← Main LLM endpoint (system prompt, fallback chain, logging)
│   ├── verify.js        ← Password verification
│   └── topics.js        ← Dynamic current events via Haiku + web search
├── subjects/
│   └── trump.md         ← Full psychological reference profile (901 lines, sourced)
├── index.html           ← Frontend (terminal UI, topics modal, all interactions)
├── portrait.png         ← Subject portrait
├── vercel.json          ← Vercel routing config
├── package.json         ← Dependencies (@anthropic-ai/sdk)
├── google-apps-script.js ← Reference copy of the Sheets webhook script
├── .env.example         ← Template for environment variables
└── .gitignore           ← Excludes .env, node_modules, .vercel
```

---

## Environment Variables

| Key | Where | Purpose |
|-----|-------|---------|
| `ANTHROPIC_API_KEY` | `.env` + Vercel dashboard | Anthropic API access |
| `DEPOSITION_PASSWORD` | `.env` + Vercel dashboard | Password gate (default: `deposition`) |
| `SHEET_LOG_URL` | `.env` + Vercel dashboard | Google Apps Script webhook for logging |

---

## Local Development

```bash
# Install dependencies
npm install

# Create your .env file
cp .env.example .env
# Fill in ANTHROPIC_API_KEY and DEPOSITION_PASSWORD

# Run locally
npx vercel dev
```

The app runs at `http://localhost:3000`. Opening `index.html` directly won't work — the API routes require the Vercel dev server.

---

## Deploy to Vercel

1. Push to GitHub
2. Import the repo at vercel.com
3. Add environment variables in the Vercel dashboard
4. Vercel deploys automatically on every push to main

---

## Google Sheets Logging Setup

1. Create a Google Sheet
2. Extensions → Apps Script → paste contents of `google-apps-script.js`
3. Deploy → New Deployment → Web App → "Anyone" can access → Deploy
4. Copy the Web App URL and add it as `SHEET_LOG_URL` in Vercel

Logged columns: Timestamp, Mode, Question, Response, Text Size, Model, Input Tokens, Output Tokens

---

## Sources

The psychological profile is compiled from:

- Mary L. Trump, *Too Much and Never Enough* (2020)
- Wayne Barrett, *Trump: The Deals and the Downfall* (1992)
- Michael Wolff, *Fire and Fury* (2018) and *Landslide* (2021)
- Bob Woodward, *Fear* (2018), *Rage* (2020), *War* (2024)
- New York Times tax investigation (2018)
- OpenSecrets FEC data
- Frontline documentary *The Choice* (2024)
- *Where's My Roy Cohn?* documentary (2019)
- Multiple primary sources and press accounts

---

*Fictional analytical construct. Not a real person. Not a real record. Built for understanding political psychology.*
