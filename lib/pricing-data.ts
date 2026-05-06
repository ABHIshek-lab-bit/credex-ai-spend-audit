import { AITool, UseCase } from './types';

export const PRICING = {
  cursor: {
    hobby: { monthly: 0, perSeat: true },
    pro: { monthly: 20, perSeat: true },
    business: { monthly: 40, perSeat: true },
    enterprise: { monthly: 60, perSeat: true },
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
    enterprise: { monthly: 50, perSeat: true },
    api: { monthly: 0, perSeat: false },
  },
  chatgpt: {
    free: { monthly: 0, perSeat: true },
    plus: { monthly: 20, perSeat: true },
    team: { monthly: 25, perSeat: true, minSeats: 2 },
    enterprise: { monthly: 60, perSeat: true },
    api: { monthly: 0, perSeat: false },
  },
  'anthropic-api': {
    api: { monthly: 0, perSeat: false },
  },
  'openai-api': {
    api: { monthly: 0, perSeat: false },
  },
  gemini: {
    free: { monthly: 0, perSeat: true },
    advanced: { monthly: 19.99, perSeat: true },
    api: { monthly: 0, perSeat: false },
  },
  windsurf: {
    free: { monthly: 0, perSeat: true },
    pro: { monthly: 10, perSeat: true },
    teams: { monthly: 35, perSeat: true },
    enterprise: { monthly: 50, perSeat: true },
  },
} as const;

export const CREDEX_DISCOUNT_RATE = 0.15;
export const TOOL_USE_CASE_FIT: Record<UseCase, AITool[]> = {
  coding: ['cursor', 'github-copilot', 'windsurf', 'claude', 'chatgpt'],
  writing: ['claude', 'chatgpt', 'gemini'],
  data: ['claude', 'chatgpt', 'gemini', 'anthropic-api', 'openai-api'],
  research: ['claude', 'chatgpt', 'gemini'],
  mixed: ['claude', 'chatgpt', 'cursor', 'github-copilot'],
};
