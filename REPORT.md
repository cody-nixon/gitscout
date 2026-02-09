# Build Report: GitScout

## The Problem
Junior developers struggle to find open source issues that match their skills. They're told "contribute to open source" to get hired, but GitHub has 86,000+ "good first issues" with no way to filter by skill, complexity, or freshness. Finding the right issue is overwhelming.

**Source:** Reddit r/AppIdeas — "App for getting SWE job" (5 upvotes, 8 comments) — a developer describing exactly this pain point.

## Why This Problem
- **Urgency:** 9/10 — The 2026 junior dev job market is brutal. AI is displacing entry-level roles.
- **Impact:** 9/10 — Millions of junior devs, bootcamp grads, career changers globally.
- **Novelty:** 8/10 — GitHub has labels but no intelligent matching. No existing tool does this well.
- **Feasibility:** 9/10 — GitHub API + AI analysis. Built in one session.
- **No overlap:** Completely different from past builds (LLM comparison tools).

## What I Built
GitScout — a web app that:
1. Lets users select their skills from a tag picker (JavaScript, React, Python, etc.)
2. Searches GitHub for fresh "good first issue" issues matching those skills
3. Optionally runs AI analysis on each issue (complexity, skill match %, beginner-friendliness)
4. Shows results with freshness dots, repo metadata, and filters
5. Lets users bookmark issues for later

## Design Decisions
- **Frontend-only** — No backend needed. GitHub API and OpenRouter API called directly from browser.
- **BYOK model** — Users provide their own API keys (stored in localStorage, never sent to any third party).
- **Dark-first** — Developers live in dark mode.
- **Minimal but functional** — Skill picker, search, sort, filter, bookmark. No bloat.

## Tech Stack
- React + TypeScript + Vite
- shadcn/ui + Tailwind CSS + Lucide icons
- GitHub Search API
- OpenRouter API (Gemini Flash for AI analysis)
- GitHub Pages deployment

## Live URL
https://cody-nixon.github.io/gitscout/

## GitHub Repo
https://github.com/cody-nixon/gitscout

## What Works
- ✅ Skill selection with 28 popular skills + custom input
- ✅ Real GitHub search returning fresh issues
- ✅ Freshness indicators (5-dot system based on update recency)
- ✅ Repo metadata (stars, comments, last updated)
- ✅ Sort by match, freshness, complexity, stars
- ✅ Filter by complexity (easy/medium/hard)
- ✅ Bookmark system (localStorage)
- ✅ Dark/light mode toggle
- ✅ Settings dialog for API keys
- ✅ AI analysis (when OpenRouter key provided)
- ✅ Mobile responsive
- ✅ Clean GitHub Pages deployment

## Limitations
- GitHub API rate limits (10 req/min unauthenticated, 30 with token)
- AI analysis requires user to provide their own OpenRouter key
- No pagination yet (shows first 20 results)
- No email notifications for new matching issues
- Skills filter uses GitHub's `language:` filter which doesn't cover frameworks well

## If This Were a Real Startup
1. Add a backend to cache GitHub issues and pre-analyze them
2. Build a recommendation engine that learns from user behavior
3. Add email/push notifications for new matching issues
4. GitHub OAuth for seamless integration + contribution tracking
5. Premium tier: personalized weekly digest, priority analysis
6. Community features: "I contributed to this!" badges
7. Company partnerships: companies flagging their repos as contributor-friendly
