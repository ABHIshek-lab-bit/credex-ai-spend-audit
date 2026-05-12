# Reflection

## 1. The Hardest Bug This Week

### The Bug
The audit engine was recommending that users on Claude Team plan (5-seat minimum, $30/seat) downgrade to Claude Pro ($20/seat), even when they had 5 team members. The math was correct—$150/month vs $100/month—but the recommendation was wrong because Claude Team has features (shared workspaces, admin controls) that Pro doesn't.

### Hypotheses I Formed
1. **Hypothesis 1:** The pricing data was wrong. Maybe Team plan is actually cheaper than I thought?
   - **Tested:** Checked Anthropic's pricing page. Team is definitely $30/seat with 5-seat minimum.
   - **Result:** Pricing data was correct.

2. **Hypothesis 2:** The logic wasn't accounting for feature differences, only price.
   - **Tested:** Read through `audit-engine.ts`. Confirmed: I was only comparing `monthlySpend` and `seats`, not features.
   - **Result:** This was the root cause.

3. **Hypothesis 3:** Maybe I should add a "features" field to the pricing data?
   - **Tested:** Started adding `features: ['shared-workspace', 'admin-controls']` to each plan.
   - **Result:** This would work, but it's overkill for MVP. The real issue is simpler.

### What I Tried
1. **First attempt:** Added a hardcoded check: "If plan is 'team', don't recommend downgrade to 'pro'."
   - **Problem:** This is too specific. What about ChatGPT Team? GitHub Copilot Business? I'd need a check for every tool.

2. **Second attempt:** Changed the logic to only recommend downgrades if `seats < minSeats`.
   - **Problem:** This prevents the bad recommendation, but it doesn't explain *why* Team is worth keeping. The reason just says "appropriately sized."

3. **Third attempt (what worked):** Added logic to check if the user is at or above `minSeats` for a team plan. If yes, assume they need the team features and don't recommend downgrade. If they're below `minSeats` (e.g., paying for 5 seats but only have 2 users), then recommend downgrade.

### The Fix
```typescript
if (seats === minSeats && teamSize < minSeats) {
  const downgradePlan = findDowngradePlan(tool, plan);
  if (downgradePlan) {
    // Recommend downgrade
  }
}
```

This correctly handles:
- **5 users on Team plan:** Keep it (they need team features)
- **2 users on Team plan:** Downgrade to Pro (paying for 3 unused seats)

### What I Learned
Don't just compare numbers—understand the *why* behind the pricing. Team plans aren't just "more expensive Pro plans"—they have different features. The audit needs to respect that.

---

## 2. A Decision I Reversed Mid-Week

### Original Decision: Use Supabase for Database

**Reasoning:** Supabase is great—Postgres, real-time, auth, generous free tier. I've used it before and it's fast to set up.

**When I made it:** Day 1, during architecture planning.

### Why I Reversed It

**Day 3:** I was setting up the Supabase project and realized:
1. I need to create a schema (tables, columns, indexes)
2. I need to write migrations
3. I need to set up environment variables
4. I need to deploy the database before I can test the app

This is 2-3 hours of work. And for what? The MVP doesn't actually need persistence. Audits are ephemeral—users complete them, see results, and leave. We only need to store data for:
- Shareable URLs (so `/audit/[id]` works)
- Lead capture (email, audit ID)

Both of these can be handled with in-memory storage for MVP. I can migrate to Supabase later when I need:
- Analytics (query all audits)
- Admin dashboard (view leads)
- Persistence across server restarts

### New Decision: In-Memory Storage (Map)

**Reasoning:** Ship faster. I can always add Supabase later. The API routes already abstract the storage layer (`storeAudit()`, `getAudit()`), so swapping in Supabase is a 10-line change.

**Trade-off:** Data is lost on server restart. But for MVP, this is fine. Vercel doesn't restart often, and if it does, losing a few audits isn't catastrophic.

### What Made Me Reverse It

**Time pressure.** I have 7 days to ship a working product. Spending 3 hours on database setup when I don't need it yet is a bad trade. I'd rather spend that time on:
- User interviews
- Landing page copy
- Testing the audit logic

This is the "do things that don't scale" principle. In-memory storage doesn't scale, but it's good enough for 100 users. I'll migrate to Supabase when I hit that limit.

---

## 3. What I Would Build in Week 2

### Feature 1: PDF Export

**Why:** Multiple user interviews mentioned wanting to "send this to my CFO" or "share with my team." A PDF is more professional than a screenshot.

**How:** Use a library like `react-pdf` or `puppeteer` to generate a PDF from the audit results page. Add a "Download PDF" button that triggers the generation.

**Effort:** 1 day

---

### Feature 2: Benchmark Mode

**Why:** Jessica (VP Engineering interview) said she cares more about "am I normal?" than "can I save money?" Benchmarking is a different value prop that appeals to larger teams.

**How:** Collect anonymized data from all audits (team size, total spend, use case). Calculate median spend per developer for each use case. Show: "Your spend: $X/dev. Companies your size: $Y/dev."

**Effort:** 2 days (need enough data first)

---

### Feature 3: Underutilization Detection

**Why:** Large teams often pay for seats that aren't being used. This is a different kind of waste than overpaying.

**How:** Add a field to the form: "How many seats are actively used?" Compare to "How many seats are you paying for?" Flag the difference.

**Effort:** 1 day

---

### Feature 4: Email Drip Campaign

**Why:** Most users won't convert immediately. A drip campaign keeps them engaged and reminds them of Credex.

**How:** Use Resend to send:
- Day 1: Confirmation email with audit link
- Day 3: "Did you implement our recommendations?"
- Day 7: "New AI tools launched—time to re-audit?"

**Effort:** 2 days

---

### Feature 5: Admin Dashboard

**Why:** Credex needs to see leads, filter by savings amount, and track conversion.

**How:** Build a simple Next.js page (`/admin`) with auth (Supabase). Show table of leads with filters (high-value, date range, use case).

**Effort:** 2 days

---

**Priority:** PDF export > Underutilization > Admin dashboard > Benchmark > Email drip

---

## 4. How I Used AI Tools

### Tools Used

1. **Cursor (Pro plan):** Primary code editor
2. **Claude (Pro plan):** Architecture planning, copy writing, debugging
3. **ChatGPT (Plus):** Quick syntax lookups, regex patterns

### What I Used Them For

**Cursor:**
- Autocomplete for boilerplate (React components, TypeScript types)
- Refactoring (renaming variables, extracting functions)
- Writing tests (generated test scaffolding, I filled in assertions)

**Claude:**
- Brainstorming GTM strategy (gave it the assignment, asked for distribution ideas)
- Writing landing page copy (gave it the value prop, asked for headline variations)
- Debugging logic errors (pasted code + error, asked for explanation)

**ChatGPT:**
- Regex for email validation
- Tailwind class combinations (e.g., "gradient from blue to purple")
- Quick TypeScript syntax checks

### What I Didn't Trust Them With

1. **Pricing data:** AI hallucinates numbers. I manually verified every price on vendor websites.
2. **Audit logic:** AI suggested overly complex rules. I kept it simple and defensible.
3. **User interview synthesis:** AI can summarize, but it misses nuance. I wrote USER_INTERVIEWS.md myself.
4. **Architecture decisions:** AI suggested trendy tech (tRPC, Prisma, Zod everywhere). I chose boring, proven tools.

### One Specific Time the AI Was Wrong

**Prompt to Claude:** "Write a function to calculate annual savings from monthly savings."

**Claude's output:**
```typescript
function calculateAnnualSavings(monthlySavings: number): number {
  return monthlySavings * 365 / 30;
}
```

**Why it's wrong:** This assumes every month has 30 days, which gives ~12.17 months per year. The correct answer is just `monthlySavings * 12`.

**How I caught it:** I read all AI-generated code before using it. The `365 / 30` looked weird, so I did the math and caught it.

**Lesson:** AI is great for boilerplate, terrible at math. Always verify.

---

## 5. Self-Rating (1-10 Scale)

### Discipline: 8/10

**Why:** I started on Day 1, committed daily, and spread work across the week. I didn't cram everything into the weekend.

**What I could improve:** I spent too much time on architecture docs early on. Should have built the MVP first, then documented.

---

### Code Quality: 7/10

**Why:** Code is readable, typed, and tested. I used TypeScript properly (no `any` types). Components are small and focused.

**What I could improve:** Some functions in `audit-engine.ts` are too long (50+ lines). Should extract helper functions. Also, no error boundaries in React components.

---

### Design Sense: 6/10

**Why:** The UI is clean and functional. I used Tailwind well (consistent spacing, good color palette). Mobile-responsive.

**What I could improve:** The results page is text-heavy. Could use more visual elements (charts, progress bars). Also, the form could be more engaging (multi-step wizard instead of one long form).

---

### Problem-Solving: 9/10

**Why:** I identified the core problem (startups don't know if they're overspending) and built a solution that addresses it. I made good trade-offs (in-memory storage, hardcoded logic) to ship faster.

**What I could improve:** I should have done user interviews *before* building, not during. Would have caught the "benchmarking" insight earlier.

---

### Entrepreneurial Thinking: 8/10

**Why:** I treated this as a real product, not a coding exercise. I did user interviews, wrote GTM strategy, calculated unit economics. I understand the business model (lead gen for Credex).

**What I could improve:** I didn't think enough about competitive moats. What stops someone from cloning this in a weekend? The answer is distribution (Credex's customer base), but I should have emphasized that more in ECONOMICS.md.
