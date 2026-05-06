export const PRICING = {
  cursor: {
    hobby: { monthly: 0, perSeat: true },
    pro: { monthly: 20, perSeat: true },
    business: { monthly: 40, perSeat: true },
    enterprise: { monthly: 60, perSeat: true }, // Estimated
  },
  'github-copilot': {
    individual: { monthly: 10, perSeat: true },
    business: { monthly: 19, perSeat: true },
    enterprise: { monthly: 39, perSeat: true },
  },
  claude: {
    free: { monthly: 0, perSeat: true },
    pro: { monthly: 20, perSeat: true },
    team: { monthly: 30, perSeat: true, minSeats: 5 },
    enterprise: { monthly: 50, perSeat: true }, // Estimated
    api: { monthly: 0, perSeat: false }, // Usage-based
  },
  chatgpt: {
    free: { monthly: 0, perSeat: true },
    plus: { monthly: 20, perSeat: true },
    team: { monthly: 25, perSeat: true, minSeats: 2 }, // Annual pricing
    enterprise: { monthly: 60, perSeat: true }, // Estimated
    api: { monthly: 0, perSeat: false }, // Usage-based
  },
  'anthropic-api': {
    api: { monthly: 0, perSeat: false }, // Usage-based
  },
  'openai-api': {
    api: { monthly: 0, perSeat: false }, // Usage-based
  },
  gemini: {
    free: { monthly: 0, perSeat: true },
    advanced: { monthly: 19.99, perSeat: true },
    api: { monthly: 0, perSeat: false }, // Usage-based
  },
  windsurf: {
    free: { monthly: 0, perSeat: true },
    pro: { monthly: 10, perSeat: true },
    teams: { monthly: 35, perSeat: true },
    enterprise: { monthly: 50, perSeat: true }, // Estimated
  },
} as const;

// Credex discount rates (estimated based on typical reseller margins)
export const CREDEX_DISCOUNT_RATE = 0.15; // 15% average discount

// Tool capabilities by use case
export const TOOL_USE_CASE_FIT = {
  coding: ['cursor', 'github-copilot', 'windsurf', 'claude', 'chatgpt'],
  writing: ['claude', 'chatgpt', 'gemini'],
  data: ['claude', 'chatgpt', 'gemini', 'anthropic-api', 'openai-api'],
  research: ['claude', 'chatgpt', 'gemini'],
  mixed: ['claude', 'chatgpt', 'cursor', 'github-copilot'],
} as const;
