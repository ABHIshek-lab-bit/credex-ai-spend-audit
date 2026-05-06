# LLM Prompts

## Audit Summary Generation Prompt

### Model Used
Claude 3.5 Sonnet (via Anthropic API)

### Full Prompt

```
Generate a concise, personalized 100-word summary for this AI spend audit:

Team size: {teamSize}
Primary use case: {primaryUseCase}
Tools: {toolsList}

Key findings:
{findings}

Write a friendly, actionable summary that highlights the biggest opportunities.
```

### Why This Structure

1. **Concise constraint (100 words):** Keeps the summary scannable. Users don't want to read a wall of text—they want the TL;DR.

2. **Context first:** Providing team size and use case helps the LLM tailor the tone. A solo founder gets different language than a VP Engineering.

3. **Key findings as bullet points:** Structured input produces structured output. The LLM can reference specific tools and actions.

4. **"Friendly, actionable":** This primes the model to avoid jargon and focus on next steps, not just analysis.

### What I Tried That Didn't Work

#### Attempt 1: Too Open-Ended
```
Summarize this audit: {data}
```

**Problem:** Output was too generic. "You can save money by optimizing your tools." Not helpful.

#### Attempt 2: Too Prescriptive
```
Write a summary in this exact format:
- Paragraph 1: Current state
- Paragraph 2: Recommendations
- Paragraph 3: Next steps
```

**Problem:** Output felt robotic and templated. Defeated the purpose of using an LLM.

#### Attempt 3: Too Long
```
Generate a detailed 300-word analysis...
```

**Problem:** Users didn't read it. Heatmaps (hypothetically) would show they scrolled past it. 100 words is the sweet spot.

### Fallback Template

If the API fails (rate limit, timeout, invalid key), we use this template:

```typescript
const totalSavings = toolAudits.reduce((sum, a) => sum + a.recommendation.monthlySavings, 0);
const actionableCount = toolAudits.filter(a => a.recommendation.action !== 'keep').length;

return `Based on your ${useCase} workflow with ${teamSize} team member(s), we found ${actionableCount} optimization${actionableCount !== 1 ? 's' : ''} across your AI tool stack. You could save up to $${totalSavings.toFixed(0)}/month by ${actions}. ${totalSavings > 500 ? 'Credex can help you capture these savings through discounted credits.' : 'Your spend is relatively optimized for your current usage.'}`;
```

### Why the Fallback Works

- **Data-driven:** Uses actual numbers from the audit
- **Conditional logic:** High-value users get Credex pitch, low-value users get validation
- **Grammatically correct:** Handles pluralization ("1 optimization" vs "2 optimizations")

### API Configuration

```typescript
{
  model: 'claude-3-5-sonnet-20241022',
  max_tokens: 200,
  temperature: 0.7, // Slightly creative, but not too wild
  messages: [{
    role: 'user',
    content: prompt
  }]
}
```

### Cost Analysis

- **Input:** ~150 tokens (prompt + data)
- **Output:** ~100 tokens (summary)
- **Cost per audit:** ~$0.0015 (negligible)
- **At 1,000 audits/month:** $1.50

This is cheap enough to use on every audit without worrying about cost.

### Error Handling

1. **API timeout (>5s):** Fall back to template immediately
2. **Rate limit (429):** Fall back to template, log for monitoring
3. **Invalid API key:** Fall back to template, alert developer
4. **Malformed response:** Fall back to template, log response for debugging

We never show an error to the user—they always get a summary, even if it's not LLM-generated.

### Future Improvements

1. **Caching:** If two users have identical tool configurations, cache the LLM response. Could reduce API calls by 30-40%.

2. **Batch processing:** If we get 100 audits in a minute, batch them into a single API call with multiple prompts. Anthropic supports this.

3. **Fine-tuning:** After 1,000+ audits, we could fine-tune a smaller model (GPT-3.5) on our data for faster, cheaper summaries.

4. **A/B testing:** Test different prompt styles (formal vs. casual, short vs. long) to see what drives higher email capture rates.
