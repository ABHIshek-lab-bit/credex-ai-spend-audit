import { generateAudit, calculateTotalSavings } from '@/lib/audit-engine';
import { AuditInput, ToolSpend } from '@/lib/types';

describe('Audit Engine', () => {
  describe('generateAudit', () => {
    test('identifies overpaying for team plan with small team', () => {
      const input: AuditInput = {
        tools: [
          {
            tool: 'claude',
            plan: 'team',
            monthlySpend: 150, // 5 seats × $30
            seats: 5,
          },
        ],
        teamSize: 2,
        primaryUseCase: 'coding',
      };

      const audits = generateAudit(input);
      
      expect(audits).toHaveLength(1);
      expect(audits[0].recommendation.action).toBe('downgrade');
      expect(audits[0].recommendation.monthlySavings).toBeGreaterThan(0);
    });

    test('recommends keeping well-optimized setup', () => {
      const input: AuditInput = {
        tools: [
          {
            tool: 'github-copilot',
            plan: 'individual',
            monthlySpend: 10,
            seats: 1,
          },
        ],
        teamSize: 1,
        primaryUseCase: 'coding',
      };

      const audits = generateAudit(input);
      
      expect(audits).toHaveLength(1);
      expect(audits[0].recommendation.action).toBe('keep');
    });

    test('suggests Credex discount for high spend', () => {
      const input: AuditInput = {
        tools: [
          {
            tool: 'cursor',
            plan: 'business',
            monthlySpend: 400, // 10 seats × $40
            seats: 10,
          },
        ],
        teamSize: 10,
        primaryUseCase: 'coding',
      };

      const audits = generateAudit(input);
      
      expect(audits).toHaveLength(1);
      expect(audits[0].recommendation.monthlySavings).toBeGreaterThan(0);
      expect(audits[0].recommendation.reason).toContain('Credex');
    });

    test('recommends cheaper alternative for use case mismatch', () => {
      const input: AuditInput = {
        tools: [
          {
            tool: 'cursor',
            plan: 'pro',
            monthlySpend: 20,
            seats: 1,
          },
        ],
        teamSize: 1,
        primaryUseCase: 'writing',
      };

      const audits = generateAudit(input);
      
      expect(audits).toHaveLength(1);
      expect(audits[0].recommendation.action).toBe('switch');
    });

    test('handles multiple tools correctly', () => {
      const input: AuditInput = {
        tools: [
          {
            tool: 'cursor',
            plan: 'pro',
            monthlySpend: 20,
            seats: 1,
          },
          {
            tool: 'claude',
            plan: 'pro',
            monthlySpend: 20,
            seats: 1,
          },
        ],
        teamSize: 1,
        primaryUseCase: 'coding',
      };

      const audits = generateAudit(input);
      
      expect(audits).toHaveLength(2);
      expect(audits[0].tool).toBe('cursor');
      expect(audits[1].tool).toBe('claude');
    });
  });

  describe('calculateTotalSavings', () => {
    test('sums monthly and annual savings correctly', () => {
      const audits = [
        {
          tool: 'cursor' as const,
          currentPlan: 'pro',
          currentSpend: 20,
          recommendation: {
            action: 'keep' as const,
            reason: 'test',
            monthlySavings: 10,
            annualSavings: 120,
          },
        },
        {
          tool: 'claude' as const,
          currentPlan: 'pro',
          currentSpend: 20,
          recommendation: {
            action: 'downgrade' as const,
            reason: 'test',
            monthlySavings: 15,
            annualSavings: 180,
          },
        },
      ];

      const totals = calculateTotalSavings(audits);
      
      expect(totals.monthly).toBe(25);
      expect(totals.annual).toBe(300); // 25 × 12
    });

    test('handles zero savings', () => {
      const audits = [
        {
          tool: 'cursor' as const,
          currentPlan: 'pro',
          currentSpend: 20,
          recommendation: {
            action: 'keep' as const,
            reason: 'test',
            monthlySavings: 0,
            annualSavings: 0,
          },
        },
      ];

      const totals = calculateTotalSavings(audits);
      
      expect(totals.monthly).toBe(0);
      expect(totals.annual).toBe(0);
    });
  });
});
