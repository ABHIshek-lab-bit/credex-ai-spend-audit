# Metrics

## North Star Metric

**Qualified Leads Generated per Month**

### Why this metric?

This tool exists to generate leads for Credex. Revenue comes from converted leads, not from audit volume. A "qualified lead" is someone who:
1. Completes an audit
2. Has >$200/month in AI spend (meaningful savings opportunity)
3. Provides email contact

This metric captures both product usage (audits completed) and business value (qualified for Credex).

### Why not "Audits Completed"?

Audits from hobbyists or students don't drive revenue. Need to optimize for quality of leads, not just volume.

### Why not "Customers Acquired"?

That's too far down the funnel—it's influenced by Credex's sales team, not just the audit tool. Can't control close rate, but can control lead quality.

---

## Input Metrics (What Drives the North Star)

### 1. Landing Page → Audit Started (Activation Rate)

**Definition:** % of landing page visitors who add at least one tool to the form

**Target:** 30%

**Why it matters:** If this is low, our value prop isn't clear or the form is too intimidating. High drop-off here means we're not communicating the benefit.

**How to improve:**
- Clearer hero headline
- Add social proof (testimonials, savings stats)
- Reduce perceived friction (show "5-min audit" prominently)

---

### 2. Audit Started → Audit Completed (Completion Rate)

**Definition:** % of users who add a tool and submit the form

**Target:** 60%

**Why it matters:** If users start but don't finish, the form is too long or confusing. This is pure UX.

**How to improve:**
- Simplify form (fewer fields)
- Add progress indicator
- Save state to localStorage (already implemented)
- Pre-fill common plans (e.g., default to "Pro" for Cursor)

---

### 3. Audit Completed → Email Captured (Lead Conversion Rate)

**Definition:** % of users who complete an audit and provide email

**Target:** 25% overall (50% for high-value, 15% for low-value)

**Why it matters:** This is where we convert anonymous users into leads. If this is low, we're not providing enough value to justify the ask.

**How to improve:**
- Show value first (audit results) before asking for email
- Differentiate CTA by savings level (high-value = "Talk to Credex", low-value = "Get updates")
- Add incentive (e.g., "Get a PDF report")

---

## What We'd Instrument First

### Day 1 (MVP):
1. **Audits completed** (total count)
2. **Email capture rate** (% of audits that convert to leads)
3. **Average savings per audit** (to understand value prop strength)

### Week 2 (after initial data):
4. **Landing page → audit started** (activation rate)
5. **Audit started → completed** (completion rate)
6. **High-value lead %** (% of audits with >$500/mo savings)

### Month 2 (optimization phase):
7. **Traffic source breakdown** (Reddit vs. Twitter vs. HN vs. organic)
8. **Time to complete audit** (to identify friction)
9. **Share rate** (% of users who share their audit)

### Tools:
- **Plausible or PostHog** for privacy-friendly analytics
- **Custom events** in Next.js API routes (already have access to request data)
- **Supabase** for lead data (can query for cohort analysis)

---

## Pivot Triggers

### Scenario 1: Low Activation (<15% landing → audit started)

**Diagnosis:** Value prop isn't resonating or form is too intimidating

**Action:** Simplify the landing page. Add a "See Example Audit" button that shows a pre-filled result. Or add a calculator mode: "Enter your monthly AI spend" → instant ballpark savings.

---

### Scenario 2: Low Completion (<40% audit started → completed)

**Diagnosis:** Form is too long or confusing

**Action:** Reduce to 1-2 tools max for MVP. Or switch to a conversational UI (chatbot-style: "What tools do you use?" → "How much do you spend?").

---

### Scenario 3: Low Lead Conversion (<10% audit → email)

**Diagnosis:** Audit isn't valuable enough to justify email

**Action:** Add more value before the ask:
- PDF export (email required)
- Personalized recommendations (email required)
- Benchmark data (email required)

Or the audit is too valuable—users get what they need and leave. In that case, create a reason to stay engaged (e.g., "Get notified when new savings opportunities apply to your stack").

---

### Scenario 4: High Volume, Low Quality (<20% of leads are high-value)

**Diagnosis:** Attracting the wrong audience (hobbyists, students, low-spend users)

**Action:** Change distribution channels. Stop posting in general startup forums, focus on engineering manager communities. Or add a qualifier question upfront: "What's your monthly AI spend?" and only show the audit if >$200/month.

---

## Success Criteria (Month 1)

If we hit these numbers, the tool is working:

- **200 audits completed**
- **50 qualified leads** (25% conversion)
- **10 high-value leads** (>$500/mo savings)
- **2 customers** (Credex closes 2 deals from the tool)

If we don't hit these, we diagnose using the input metrics above and iterate.
