import { NextRequest, NextResponse } from 'next/server';
import { generateAudit, calculateTotalSavings } from '@/lib/audit-engine';
import { AuditInput, AuditResult } from '@/lib/types';
import { nanoid } from 'nanoid';

export async function POST(request: NextRequest) {
  try {
    const input: AuditInput = await request.json();
    
    if (!input.tools || input.tools.length === 0) {
      return NextResponse.json(
        { error: 'At least one tool is required' },
        { status: 400 }
      );
    }
    
    const toolAudits = generateAudit(input);
    const { monthly, annual } = calculateTotalSavings(toolAudits);
    const id = nanoid(10);
    const summary = await generateSummary(input, toolAudits);
    
    const result: AuditResult = {
      id,
      toolAudits,
      totalMonthlySavings: monthly,
      totalAnnualSavings: annual,
      summary,
      createdAt: new Date().toISOString(),
    };
    
    await storeAudit(id, result, input);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Audit generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate audit' },
      { status: 500 }
    );
  }
}

async function generateSummary(input: AuditInput, toolAudits: any[]): Promise<string> {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 200,
        messages: [{
          role: 'user',
          content: `Generate a concise, personalized 100-word summary for this AI spend audit:

Team size: ${input.teamSize}
Primary use case: ${input.primaryUseCase}
Tools: ${input.tools.map(t => `${t.tool} (${t.plan})`).join(', ')}

Key findings:
${toolAudits.map(a => `- ${a.tool}: ${a.recommendation.action} - ${a.recommendation.reason}`).join('\n')}

Write a friendly, actionable summary that highlights the biggest opportunities.`
        }]
      }),
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.content[0].text;
    }
  } catch (error) {
    console.error('LLM summary generation failed:', error);
  }
  
  const totalSavings = toolAudits.reduce((sum, a) => sum + a.recommendation.monthlySavings, 0);
  const actionableCount = toolAudits.filter(a => a.recommendation.action !== 'keep').length;
  
  return `Based on your ${input.primaryUseCase} workflow with ${input.teamSize} team member(s), we found ${actionableCount} optimization${actionableCount !== 1 ? 's' : ''} across your AI tool stack. You could save up to $${totalSavings.toFixed(0)}/month by ${toolAudits.filter(a => a.recommendation.action !== 'keep').map(a => a.recommendation.action).join(', ')}ing select tools. ${totalSavings > 500 ? 'Credex can help you capture these savings through discounted credits.' : 'Your spend is relatively optimized for your current usage.'}`;
}

const auditStore = new Map<string, { result: AuditResult; input: AuditInput }>();

async function storeAudit(id: string, result: AuditResult, input: AuditInput) {
  auditStore.set(id, { result, input });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  if (!id) {
    return NextResponse.json({ error: 'ID required' }, { status: 400 });
  }
  
  const stored = auditStore.get(id);
  if (!stored) {
    return NextResponse.json({ error: 'Audit not found' }, { status: 404 });
  }
  
  return NextResponse.json(stored.result);
}
