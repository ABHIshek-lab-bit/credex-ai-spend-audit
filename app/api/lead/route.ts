import { NextRequest, NextResponse } from 'next/server';

const rateLimitMap = new Map<string, number[]>();
const MAX_REQUESTS_PER_HOUR = 5;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const hourAgo = now - 60 * 60 * 1000;
  
  const requests = rateLimitMap.get(ip) || [];
  const recentRequests = requests.filter(time => time > hourAgo);
  
  if (recentRequests.length >= MAX_REQUESTS_PER_HOUR) {
    return false;
  }
  
  recentRequests.push(now);
  rateLimitMap.set(ip, recentRequests);
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }
    
    const body = await request.json();
    const { email, companyName, role, teamSize, auditId, honeypot } = body;
    
    if (honeypot) {
      return NextResponse.json({ success: true });
    }
    
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email required' },
        { status: 400 }
      );
    }
    
    const lead = {
      email,
      companyName: companyName || null,
      role: role || null,
      teamSize: teamSize || null,
      auditId,
      createdAt: new Date().toISOString(),
      ip,
    };
    
    console.log('Lead captured:', lead);
    
    await sendConfirmationEmail(email, auditId);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Lead capture error:', error);
    return NextResponse.json(
      { error: 'Failed to capture lead' },
      { status: 500 }
    );
  }
}

async function sendConfirmationEmail(email: string, auditId: string) {
  console.log(`Would send email to ${email} for audit ${auditId}`);
}
