export type AITool = 
  | 'cursor'
  | 'github-copilot'
  | 'claude'
  | 'chatgpt'
  | 'anthropic-api'
  | 'openai-api'
  | 'gemini'
  | 'windsurf';

export type UseCase = 'coding' | 'writing' | 'data' | 'research' | 'mixed';

export type CursorPlan = 'hobby' | 'pro' | 'business' | 'enterprise';
export type CopilotPlan = 'individual' | 'business' | 'enterprise';
export type ClaudePlan = 'free' | 'pro' | 'team' | 'enterprise' | 'api';
export type ChatGPTPlan = 'free' | 'plus' | 'team' | 'enterprise' | 'api';
export type GeminiPlan = 'free' | 'advanced' | 'api';
export type WindsurfPlan = 'free' | 'pro' | 'teams' | 'enterprise';

export interface ToolSpend {
  tool: AITool;
  plan: string;
  monthlySpend: number;
  seats: number;
}

export interface AuditInput {
  tools: ToolSpend[];
  teamSize: number;
  primaryUseCase: UseCase;
}

export interface Recommendation {
  action: 'keep' | 'downgrade' | 'switch' | 'upgrade' | 'review';
  reason: string;
  newTool?: AITool;
  newPlan?: string;
  monthlySavings: number;
  annualSavings: number;
}

export interface ToolAudit {
  tool: AITool;
  currentPlan: string;
  currentSpend: number;
  recommendation: Recommendation;
}

export interface AuditResult {
  id: string;
  toolAudits: ToolAudit[];
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  summary: string;
  createdAt: string;
}

export interface LeadCapture {
  email: string;
  companyName?: string;
  role?: string;
  teamSize?: number;
  auditId: string;
}
