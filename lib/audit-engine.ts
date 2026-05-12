import { AuditInput, ToolAudit, Recommendation, ToolSpend, UseCase, AITool } from './types';
import { PRICING, CREDEX_DISCOUNT_RATE, TOOL_USE_CASE_FIT } from './pricing-data';

export function generateAudit(input: AuditInput): ToolAudit[] {
  return input.tools.map(toolSpend => auditTool(toolSpend, input.teamSize, input.primaryUseCase));
}

function auditTool(toolSpend: ToolSpend, teamSize: number, useCase: UseCase): ToolAudit {
  const recommendation = generateRecommendation(toolSpend, teamSize, useCase);
  
  return {
    tool: toolSpend.tool,
    currentPlan: toolSpend.plan,
    currentSpend: toolSpend.monthlySpend,
    recommendation,
  };
}

function generateRecommendation(
  toolSpend: ToolSpend,
  teamSize: number,
  useCase: UseCase
): Recommendation {
  const { tool, plan, monthlySpend, seats } = toolSpend;
  
  const toolFitsUseCase = TOOL_USE_CASE_FIT[useCase]?.includes(tool);
  const pricingData = PRICING[tool]?.[plan as keyof typeof PRICING[typeof tool]] as any;
  
  if (!pricingData) {
    return {
      action: 'keep',
      reason: 'Unable to verify pricing for this plan',
      monthlySavings: 0,
      annualSavings: 0,
    };
  }

  if (pricingData.perSeat) {
    const expectedSpend = pricingData.monthly * seats;
    const minSeats = 'minSeats' in pricingData ? pricingData.minSeats : 1;
    
    // Check if team is larger than seats (underutilization or need more seats)
    if (teamSize > seats && seats > 0) {
      const unusedTeamMembers = teamSize - seats;
      return {
        action: 'keep',
        reason: `You have ${unusedTeamMembers} team member(s) without access. Consider adding seats if they need ${tool}, or you're optimized if only ${seats} people use it.`,
        monthlySavings: 0,
        annualSavings: 0,
      };
    }
    
    // Check if paying for more seats than team size
    if (seats > teamSize && teamSize > 0) {
      const excessSeats = seats - teamSize;
      const savingsPerSeat = pricingData.monthly;
      const potentialSavings = excessSeats * savingsPerSeat;
      
      return {
        action: 'downgrade',
        reason: `You're paying for ${seats} seats but only have ${teamSize} team members. Reduce to ${teamSize} seats to save money.`,
        newPlan: plan,
        monthlySavings: potentialSavings,
        annualSavings: potentialSavings * 12,
      };
    }
    
    // Check if paying significantly more than expected
    if (monthlySpend > expectedSpend * 1.15) {
      const potentialSavings = monthlySpend - expectedSpend;
      return {
        action: 'review',
        reason: `Paying $${monthlySpend.toFixed(0)}/mo for ${seats} seats, but ${plan} plan should cost $${expectedSpend.toFixed(0)}/mo. Review your billing.`,
        newPlan: plan,
        monthlySavings: potentialSavings,
        annualSavings: potentialSavings * 12,
      };
    }
    
    // Check if paying significantly less (might be on discount or old pricing)
    if (monthlySpend < expectedSpend * 0.85 && monthlySpend > 0) {
      // They have a good deal, acknowledge it
      if (monthlySpend >= 100) {
        const credexSavings = monthlySpend * CREDEX_DISCOUNT_RATE;
        return {
          action: 'keep',
          reason: `You have a good rate on ${plan} plan. Credex can offer additional ~15% discount ($${credexSavings.toFixed(0)}/mo).`,
          monthlySavings: credexSavings,
          annualSavings: credexSavings * 12,
        };
      }
      return {
        action: 'keep',
        reason: `You have a favorable rate on ${plan} plan for ${seats} seats. Keep this pricing!`,
        monthlySavings: 0,
        annualSavings: 0,
      };
    }
  }
  
  if (!toolFitsUseCase) {
    const betterAlternative = findBetterAlternative(tool, useCase, monthlySpend);
    if (betterAlternative) {
      return betterAlternative;
    }
  }
  
  if (monthlySpend >= 100) {
    const credexSavings = monthlySpend * CREDEX_DISCOUNT_RATE;
    return {
      action: 'keep',
      reason: `Your ${plan} plan is well-suited for your needs. Credex can offer ~15% discount on credits.`,
      monthlySavings: credexSavings,
      annualSavings: credexSavings * 12,
    };
  }
  
  if (plan !== 'free' && plan !== 'hobby' && seats <= 2 && monthlySpend < 50 && monthlySpend > 15) {
    const freeTierTool = findFreeTierAlternative(tool, useCase);
    if (freeTierTool && freeTierTool !== tool) {
      return {
        action: 'switch',
        reason: `For light usage, ${freeTierTool} free tier may be sufficient. Test before canceling.`,
        newTool: freeTierTool as AITool,
        newPlan: 'free',
        monthlySavings: monthlySpend,
        annualSavings: monthlySpend * 12,
      };
    }
  }
  
  return {
    action: 'keep',
    reason: `Your ${plan} plan is appropriately sized for ${seats} seat(s) and ${useCase} use case.`,
    monthlySavings: 0,
    annualSavings: 0,
  };
}

function findDowngradePlan(tool: AITool, currentPlan: string): string | null {
  const plans = Object.keys(PRICING[tool]);
  const currentIndex = plans.indexOf(currentPlan);
  
  if (currentIndex > 0) {
    return plans[currentIndex - 1];
  }
  
  return null;
}

function findBetterAlternative(
  currentTool: AITool,
  useCase: UseCase,
  currentSpend: number
): Recommendation | null {
  const suitableTools = TOOL_USE_CASE_FIT[useCase];
  
  if (useCase === 'coding') {
    if (currentTool === 'claude' || currentTool === 'chatgpt') {
      return {
        action: 'switch',
        reason: `For coding-focused work, Cursor ($20/mo) or GitHub Copilot ($10/mo) are more cost-effective than general AI assistants.`,
        newTool: 'github-copilot',
        newPlan: 'individual',
        monthlySavings: Math.max(0, currentSpend - 10),
        annualSavings: Math.max(0, (currentSpend - 10) * 12),
      };
    }
  }
  
  if ((useCase === 'writing' || useCase === 'research') && currentTool === 'cursor') {
    return {
      action: 'switch',
      reason: `For ${useCase} work, Claude Pro ($20/mo) or ChatGPT Plus ($20/mo) are better suited than coding-specific tools.`,
      newTool: 'claude',
      newPlan: 'pro',
      monthlySavings: Math.max(0, currentSpend - 20),
      annualSavings: Math.max(0, (currentSpend - 20) * 12),
    };
  }
  
  return null;
}

function findFreeTierAlternative(currentTool: AITool, useCase: UseCase): string | null {
  const suitableTools = TOOL_USE_CASE_FIT[useCase];
  
  if (useCase === 'coding') {
    return 'windsurf';
  }
  
  if (useCase === 'writing' || useCase === 'research') {
    return 'claude';
  }
  
  return null;
}

export function calculateTotalSavings(audits: ToolAudit[]): {
  monthly: number;
  annual: number;
} {
  const monthly = audits.reduce((sum, audit) => sum + audit.recommendation.monthlySavings, 0);
  return {
    monthly,
    annual: monthly * 12,
  };
}
