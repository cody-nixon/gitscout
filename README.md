# GitScout 🔭

> Find your first open source contribution in 60 seconds.

**Live:** [cody-nixon.github.io/gitscout](https://cody-nixon.github.io/gitscout/)

## The Problem

Junior developers are told "contribute to open source" but nobody helps them find the right project. GitHub has 86,000+ "good first issues" — but no skill matching, no freshness filters, no complexity analysis. Finding the right issue to start with is overwhelming.

## The Solution

GitScout matches your skills to real open source issues:

1. **Select your skills** — JavaScript, Python, React, Go, etc.
2. **Click Scout** — searches GitHub for fresh "good first issue" issues
3. **AI Analysis** (optional) — rates complexity, skill match %, and beginner-friendliness
4. **Filter & Sort** — by match score, freshness, complexity, or stars
5. **Bookmark** — save interesting issues for later

## Features

- 🎯 **Skill-based matching** — Select languages & frameworks you know
- 🤖 **AI-powered analysis** — Complexity ratings, skill match %, estimated time (via OpenRouter)
- 🕐 **Freshness indicators** — See how recently issues were updated
- ⭐ **Repo metadata** — Stars, comments, activity level
- 🔖 **Bookmarks** — Save issues to review later
- 🌙 **Dark/light mode** — Dark by default
- 📱 **Mobile responsive** — Works on any device
- 🔑 **BYOK** — Bring your own GitHub token & OpenRouter key (stored locally)

## Tech Stack

- React + TypeScript + Vite
- shadcn/ui + Tailwind CSS
- GitHub Search API
- OpenRouter API (Gemini Flash) for AI analysis
- Deployed on GitHub Pages

## Setup (local development)

```bash
git clone https://github.com/cody-nixon/gitscout.git
cd gitscout
npm install
npm run dev
```

### Optional: AI Analysis

1. Get an API key from [openrouter.ai/keys](https://openrouter.ai/keys)
2. Click Settings in the app and paste your key
3. Issues will be analyzed for complexity and skill match

### Optional: Higher GitHub Rate Limits

1. Create a token at [github.com/settings/tokens](https://github.com/settings/tokens) (no scopes needed)
2. Add it in Settings for 30 req/min instead of 10

## Screenshots

Landing page with skill selector, search results with freshness indicators and filter controls.

## License

MIT

---

Built by [Cody Nixon](https://github.com/cody-nixon) in a single session as part of the Daily Build challenge.
