# AI Spend Audit

Free tool that audits your AI tool spending and finds hidden savings. Built for Credex as a lead-generation product that actually helps startups optimize their Cursor, Claude, ChatGPT, and Copilot spend.

## Screenshots

[Will add after deployment - need live URL first]

## Quick Start

Install dependencies:
```bash
npm install
```

Create `.env.local`:
```env
ANTHROPIC_API_KEY=your_key_here
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

Run locally:
```bash
npm run dev
```

Deploy to Vercel:
```bash
vercel
```

## Decisions

### 1. Next.js over Remix/SvelteKit
Server components for better SEO on shareable URLs. The `/audit/[id]` pages need SSR for Open Graph tags to work properly when shared on Twitter/LinkedIn. Remix would work but smaller ecosystem. SvelteKit is faster but less mature for this use case.

### 2. Hardcoded audit rules instead of ML
The recommendations need to be explainable to a CFO. "You're overpaying because..." with clear math beats "our model says..." ML would add cost, complexity, and make the logic a black box. When pricing changes, I can update PRICING_DATA.md in 10 minutes.

### 3. In-memory storage for MVP, Supabase later
Spent 2 hours on Day 3 setting up Supabase before realizing I don't need it yet. Audits are ephemeral - users complete them and leave. Shareable URLs work fine with a Map. Will migrate when I need analytics or an admin dashboard. This decision saved me a day.

### 4. LLM summary with template fallback
Anthropic API adds personality to the audit results, but it can fail (rate limits, timeouts, bad API key). The template fallback ensures users always get a summary. In testing, the template is actually fine - the LLM version is just slightly more engaging.

### 5. localStorage for form persistence
Users tab away to check their Cursor billing page mid-form. Without persistence, they'd lose their data and rage quit. localStorage is simple and works. Doesn't sync across devices but this is a one-time-use tool anyway.

## Deployed URL

[Will add after Vercel deployment]
