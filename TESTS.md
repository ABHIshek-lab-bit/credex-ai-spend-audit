# Tests

## Test Files

### 1. `__tests__/audit-engine.test.ts`

**What it covers:**
- Core audit logic for identifying overspending
- Recommendation generation for different scenarios
- Total savings calculation
- Multi-tool audit handling

**How to run:**
```bash
npm test __tests__/audit-engine.test.ts
```

**Test cases:**
1. **Overpaying for team plan:** Detects when a small team is paying for minimum seats they don't need
2. **Well-optimized setup:** Correctly identifies when spend is appropriate
3. **High spend Credex opportunity:** Suggests Credex discount for large spends
4. **Use case mismatch:** Recommends switching tools when current tool doesn't fit use case
5. **Multiple tools:** Handles auditing multiple tools in one request
6. **Savings calculation:** Correctly sums monthly and annual savings
7. **Zero savings:** Handles cases with no optimization opportunities

---

## Running All Tests

```bash
npm test
```

## Running Tests in Watch Mode

```bash
npm run test:watch
```

## Test Coverage

To generate coverage report:

```bash
npm test -- --coverage
```

---

## Why These Tests Matter

The audit engine is the core value proposition. If the recommendations are wrong, users lose trust and won't provide their email. These tests ensure:

1. **Accuracy:** Recommendations are based on correct pricing data
2. **Logic:** Edge cases (small teams, high spend, use case mismatches) are handled
3. **Reliability:** Calculations don't have off-by-one errors or rounding issues

---

## Future Test Coverage

### Phase 2 (after MVP):
- API route tests (audit generation, lead capture)
- Component tests (form validation, results display)
- E2E tests (full user flow from landing to email capture)
- Pricing data validation (ensure all tools have complete pricing)

### Phase 3 (production):
- Load testing (can handle 100 concurrent audits)
- LLM fallback testing (graceful degradation when API fails)
- Rate limiting tests (prevents abuse)
