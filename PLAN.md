# Technical Plan: GitScout

## Product
- **Name:** GitScout
- **Tagline:** "Find your first open source contribution in 60 seconds"

## User Stories
1. As a junior dev, I want to enter my skills and see matching open source issues instantly
2. As a job seeker, I want to know which issues are fresh and in active repos
3. As a newcomer, I want complexity ratings so I don't waste time on issues beyond my level
4. As a contributor, I want to filter by language, framework, and issue freshness
5. As a returning user, I want to see new issues since my last visit

## Tech Stack
- **Frontend:** React + TypeScript + Vite
- **UI:** shadcn/ui + Tailwind CSS + Lucide icons
- **API:** GitHub Search API (public, rate-limited) + OpenRouter for AI analysis
- **Deploy:** GitHub Pages (static frontend)
- **State:** localStorage for user preferences (skills, filters, bookmarks)
- **No backend needed** — all API calls from browser

## Architecture
```
User enters skills → GitHub Search API (issues with "good first issue" label)
                   → Filter by language/framework
                   → AI analyzes top results (complexity, skill match, freshness)
                   → Display ranked results with scores
```

## Key Features
1. **Skill Input** — Multi-select tags for languages/frameworks (React, Python, Node.js, etc.)
2. **Smart Search** — Queries GitHub for fresh "good first issue" + "help wanted" issues
3. **AI Analysis** — For each issue, AI rates: complexity (1-5), skill match (%), beginner-friendliness
4. **Freshness Indicators** — Shows repo activity (stars, recent commits, PR merge time)
5. **Filters** — By language, complexity, freshness, stars
6. **Bookmarks** — Save interesting issues to review later (localStorage)
7. **Dark mode** — Default dark, toggle light

## API Design
- GitHub Search API: `GET /search/issues?q=label:"good first issue" language:javascript is:open`
- OpenRouter: POST with issue details → structured JSON response with scores
- Rate limiting: GitHub allows 10 search requests/min unauthenticated, 30 with token

## UI Flow
1. Landing page: Hero with tagline + skill selector
2. User picks skills from tag list (or types custom)
3. Click "Scout Issues" → loading state with progress
4. Results page: Cards with issue title, repo, complexity badge, match %, freshness
5. Click card → expands with AI analysis details + direct GitHub link
6. Sidebar filters for refinement

## What We're NOT Building
- No accounts/auth (not needed — no payments)
- No backend server (all client-side)
- No issue tracking/notifications
- No social features
- No GitHub OAuth (optional token input for rate limits)

## Security
- OpenRouter API key: BYOK model (user provides their own key, stored in localStorage)
  OR use env var if deploying with backend
- No secrets in source code
- GitHub token: optional, user-provided, never sent anywhere except GitHub API
- All API calls made directly from browser to respective APIs
