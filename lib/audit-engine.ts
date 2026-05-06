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
  
  // Check if tool is appropriate for use case
  const toolFitsUseCase = TOOL_USE_CASE_FIT[useCase]?.includes(tool);
  
  // Calculate expected spend based on pricing data
  const pricingData = PRICING[tool]?.[plan as keyof typeof PRICING[typeof tool]];
  
  if (!pricingData) {
    return {
      action: 'keep',
      reason: 'Unable to verify pricing for this plan',
      monthlySavings: 0,
      annualSavings: 0,
    };
  }

  // Check for seat optimization
  if (pricingData.perSeat) {
    const expectedSpend = pricingData.monthly * seats;
    const minSeats = 'minSeats' in pricingData ? pricingData.minSeats : 1;
    
    // Check if paying for minimum seats but not using them
    if (seats === minSeats && teamSize < minSeats) {
      const downgradePlan = findDowngradePlan(tool, plan);
      if (downgradePlan) {
        const newPricing = PRICING[tool][downgradePlan as keyof typeof PRICING[typeof tool]];
        const newSpend = newPricing.monthly * teamSize;
        const savings = monthlySpend - newSpend;
        
        if (savings > 0) {
          return {
            action: 'downgrade',
            reason: `Team of ${teamSize} doesn't need ${minSeats}-seat minimum. Downgrade to ${downgradePlan} plan.`,
            newPlan: downgradePlan,
            monthlySavings: savings,
            annualSavings: savings * 12,
          };
        }
      }
    }
    
    // Check if overpaying vs expected
    if (monthlySpend > expectedSpend * 1.1) {
      const potentialSavings = monthlySpend - expectedSpend;
      return {
        action: 'downgrade',
        reason: `Paying $${monthlySpend}/mo for ${seats} seats, but ${plan} plan should cost $${expectedSpend}/mo. Review your billing.`,
        newPlan: plan,
        monthlySavings: potentialSavings,
        annualSavings: potentialSavings * 12,
      };
    }
  }
  
  // Check for use case mismatch
  if (!toolFitsUseCase) {
    const betterAlternative = findBetterAlternative(tool, useCase, monthlySpend);
    if (betterAlternative) {
      return betterAlternative;
    }
  }
  
  // Check for Credex savings opportunity
  if (monthlySpend >= 100) {
    const credexSavings = monthlySpend * CREDEX_DISCOUNT_RATE;
    return {
      action: 'keep',
      reason: `Your ${plan} plan is well-suited for your needs. Credex can offer ~15% discount on credits.`,
      monthlySavings: credexSavings,
      annualSavings: credexSavings * 12,
    };
  }
  
  // Check for free tier opportunity
  if (plan !== 'free' && plan !== 'hobby' && seats <= 2 && monthlySpend < 50) {
    const freeTierTool = findFreeTierAlternative(tool, useCase);
    if (freeTierTool) {
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
  
  // No optimization found
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
  
  // For coding use case, suggest cheaper coding-specific tools
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
  
  // For writing/research, suggest Claude or ChatGPT
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
  
  // Suggest free alternatives based on use case
  if (useCase === 'coding') {
    return 'windsurf'; // Has generous free tier
  }
  
  if (useCase === 'writing' || useCase === 'research') {
    return 'claude'; // Free tier available
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
