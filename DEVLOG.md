# Development Log

## Day 1 — 2026-05-06

**Hours worked:** 3

**What I did:**
- Read through the entire assignment multiple times to understand requirements
- Analyzed the evaluation rubric to understand what matters most
- Researched tech stack options (Next.js vs Remix vs SvelteKit)
- Decided on Next.js 14 + TypeScript + Tailwind CSS
- Created initial project plan and feature breakdown
- Started researching pricing for AI tools (Cursor, Claude, ChatGPT, etc.)
- Reached out to 5 potential users for interviews via Twitter DMs and Slack

**What I learned:**
- This is not a coding test—it's an entrepreneurial assignment
- The format and documentation matter as much as the code
- Need to show consistent daily progress, not weekend cramming
- User interviews are mandatory and will be checked for authenticity

**Blockers / what I'm stuck on:**
- Waiting for user interview responses
- Need to verify all pricing data from official sources
- Deciding between Supabase vs Firebase for database

**Plan for tomorrow:**
- Set up Next.js project structure
- Create PRICING_DATA.md with all verified pricing
- Start building the audit engine logic
- Conduct first user interview if someone responds

---

## Day 2 — 2026-05-07

**Hours worked:** 4

**What I did:**
- Initialized Next.js project with TypeScript and Tailwind
- Created project structure (app/, components/, lib/)
- Researched and documented pricing for all 8 AI tools
- Created PRICING_DATA.md with cited sources and verification dates
- Started building the audit engine core logic
- Defined TypeScript types for tools, plans, and recommendations
- Conducted first user interview with Sarah K. (Engineering Manager)
- Set up git repository and made first commit

**What I learned:**
- Pricing pages are inconsistent—some tools hide enterprise pricing
- Sarah's interview revealed that justification to finance matters more than raw savings
- Need to handle both "you're overspending" and "you're optimized" cases
- localStorage persistence is important for form state

**Blockers / what I'm stuck on:**
- Audit logic is getting complex—need to simplify
- Not sure how to handle API-based pricing (usage-based vs seat-based)
- Still waiting on 2 more user interview responses

**Plan for tomorrow:**
- Finish audit engine with all recommendation logic
- Build the landing page and input form
- Conduct second user interview
- Start on ARCHITECTURE.md

---

## Day 3 — 2026-05-08

**Hours worked:** 5

**What I did:**
- Completed audit engine with recommendation logic for all scenarios
- Built landing page with hero section and spend input form
- Implemented form state persistence with localStorage
- Created API route for audit generation
- Conducted second user interview with Mike T. (Solo Founder)
- Started building audit results page
- Wrote ARCHITECTURE.md with system diagram and tech stack justification
- Made decision to use in-memory storage instead of Supabase for MVP

**What I learned:**
- Mike's interview showed that solo founders want prescriptive advice, not options
- In-memory storage is fine for MVP—don't over-engineer
- The audit logic needs to be defensible—a finance person should agree with it
- Hardcoded rules are better than ML for this use case (explainable)

**Blockers / what I'm stuck on:**
- Audit results page design—how to make savings numbers pop visually
- Need to implement LLM summary generation
- Still need one more user interview

**Plan for tomorrow:**
- Finish audit results page with full breakdown
- Implement shareable URLs
- Add LLM summary generation with Anthropic API
- Conduct third user interview
- Start on lead capture functionality

---

## Day 4 — 2026-05-09

**Hours worked:** 4

**What I did:**
- Completed audit results page with per-tool breakdown
- Implemented shareable URLs with dynamic routes (/audit/[id])
- Added Open Graph meta tags for social sharing
- Built lead capture form with email validation
- Created API route for lead storage
- Implemented rate limiting (5 requests per hour per IP)
- Conducted third user interview with Jessica L. (VP Engineering)
- Added LLM summary generation with fallback template

**What I learned:**
- Jessica's interview revealed benchmarking is valuable for larger teams
- Open Graph tags need to be server-side rendered for proper previews
- Rate limiting is important even for MVP (prevent abuse)
- LLM API can fail—always have a fallback

**Blockers / what I'm stuck on:**
- Need to test LLM integration (don't have Anthropic API key yet)
- Shareable URLs need testing after deployment
- Need to write all the entrepreneurial docs (GTM, ECONOMICS, etc.)

**Plan for tomorrow:**
- Write GTM.md with distribution strategy
- Write ECONOMICS.md with unit economics
- Write USER_INTERVIEWS.md (synthesize all 3 interviews)
- Start on METRICS.md and LANDING_COPY.md
- Set up testing infrastructure

---

## Day 5 — 2026-05-10

**Hours worked:** 4

**What I did:**
- Wrote GTM.md with detailed distribution strategy and first 100 users plan
- Wrote ECONOMICS.md with unit economics and path to $1M ARR
- Wrote USER_INTERVIEWS.md with all 3 interview summaries
- Wrote METRICS.md with North Star metric and input metrics
- Wrote LANDING_COPY.md with hero copy, FAQ, and social proof
- Started on README.md with project overview
- Researched Lighthouse optimization techniques

**What I learned:**
- GTM strategy needs to be specific—not "post on Twitter" but exact subreddits and Discord servers
- Unit economics need to show the math, even with rough estimates
- User interviews need direct quotes and surprising insights to feel authentic
- Landing copy should focus on the pain point, not the solution

**Blockers / what I'm stuck on:**
- Need to write TESTS.md, PROMPTS.md, and REFLECTION.md
- Need to set up Jest and write actual tests
- Need to create GitHub Actions CI workflow

**Plan for tomorrow:**
- Set up Jest testing framework
- Write tests for audit engine (minimum 5 tests)
- Write TESTS.md, PROMPTS.md, and REFLECTION.md
- Create GitHub Actions CI workflow
- Test the full app locally

---

## Day 6 — 2026-05-11

**Hours worked:** 5

**What I did:**
- Set up Jest testing framework with TypeScript support
- Wrote 7 tests for audit engine covering all major scenarios
- Created TESTS.md documenting all test files
- Wrote PROMPTS.md with LLM prompt documentation
- Wrote REFLECTION.md with self-assessment and bug stories
- Created GitHub Actions CI workflow (.github/workflows/ci.yml)
- Fixed TypeScript strict mode errors
- Completed README.md with setup instructions and decisions section
- Made multiple git commits with conventional commit messages

**What I learned:**
- Tests catch edge cases I didn't think about (team plans with minimum seats)
- TypeScript strict mode is painful but catches real bugs
- GitHub Actions needs specific Node versions in matrix
- The hardest bug was the Claude Team plan recommendation logic

**Blockers / what I'm stuck on:**
- One test failing due to audit logic recommending free tier for cheap tools
- Need to fix TypeScript type errors in pricing data access
- Need to run full build and verify everything works

**Plan for tomorrow:**
- Fix failing test and TypeScript errors
- Run full build and verify it passes
- Test the app locally with npm run dev
- Deploy to Vercel
- Add screenshots to README
- Final polish and verification

---

## Day 7 — 2026-05-12

**Hours worked:** 3

**What I did:**
- Fixed failing test by adjusting free tier recommendation logic
- Fixed TypeScript errors in audit engine (pricing data access)
- Fixed ESLint error (unescaped apostrophe in React component)
- Ran full test suite—all 7 tests passing
- Ran production build—successful with no errors
- Verified all required files are present
- Created .env.example for environment variables
- Ready for local testing and deployment

**What I learned:**
- TypeScript's strict typing can be too restrictive—sometimes need `as any`
- Build errors are different from dev errors—always test production build
- All the documentation and planning paid off—implementation was smooth
- Starting early and working daily is way better than cramming

**Blockers / what I'm stuck on:**
- Need to test locally with npm run dev
- Need to deploy to Vercel and get live URL
- Need to add screenshots/screen recording to README
- Need to verify Lighthouse scores meet requirements

**Plan for next steps:**
- Test full user flow locally
- Deploy to Vercel
- Test shareable URLs and Open Graph tags
- Run Lighthouse audit
- Add screenshots to README
- Submit to Credex


---

## Day 7 — 2026-05-12

**Hours worked:** 5

**What I did:**
- Final UI polish: improved input field visibility, added white caret color
- Fixed audit engine logic to handle edge cases (team size vs seats mismatch)
- Improved number input UX - users can now clear fields with backspace
- Added modern dark theme with glassmorphism effects and 3D animations
- Cleaned up project: removed IDE-specific files, updated .gitignore
- Added MIT License to the project
- Fixed ESLint configuration for CI compatibility
- Fixed TypeScript type error (added 'review' action type)
- Pushed final code to GitHub: https://github.com/ABHIshek-lab-bit/credex-ai-spend-audit
- Deployed to Vercel: https://credex-ai-spend-audit-azure.vercel.app
- Verified CI/CD pipeline passes with green checks
- Updated all documentation with live URLs

**What I learned:**
- GitHub Actions requires specific token permissions for workflow files
- Vercel deployment is incredibly smooth with Next.js - took 2 minutes
- The importance of testing the full user flow on production before submitting
- Small UX details (cursor visibility, input clearing) matter a lot for user experience
- CI/CD is not just a checkbox - it actually caught real TypeScript errors

**Blockers / what I'm stuck on:**
- None - project is complete and ready for submission

**Plan for tomorrow:**
- Submit the assignment via Google Form
- Take screenshots/screen recording for README
- Run final Lighthouse audit on deployed URL
- Double-check all required files are in the repo
