import { Metadata } from 'next';
import AuditResults from '@/components/AuditResults';

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Fetch audit data for OG tags
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  try {
    const response = await fetch(`${baseUrl}/api/audit?id=${params.id}`, {
      cache: 'no-store',
    });
    
    if (response.ok) {
      const audit = await response.json();
      const savings = audit.totalMonthlySavings;
      
      return {
        title: `AI Spend Audit Results - Save $${savings.toFixed(0)}/month`,
        description: `This startup could save $${savings.toFixed(0)}/month ($${audit.totalAnnualSavings.toFixed(0)}/year) on AI tools. Get your free audit.`,
        openGraph: {
          title: `Save $${savings.toFixed(0)}/month on AI Tools`,
          description: `Free audit found $${audit.totalAnnualSavings.toFixed(0)}/year in savings. Audit your AI spend in 5 minutes.`,
          type: 'website',
        },
        twitter: {
          card: 'summary_large_image',
          title: `Save $${savings.toFixed(0)}/month on AI Tools`,
          description: `Free audit found $${audit.totalAnnualSavings.toFixed(0)}/year in savings.`,
        },
      };
    }
  } catch (error) {
    console.error('Failed to fetch audit for metadata:', error);
  }
  
  return {
    title: 'AI Spend Audit Results',
    description: 'See how much you can save on your AI tool stack',
  };
}

export default async function AuditPage({ params }: Props) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  let audit = null;
  let error = null;
  
  try {
    const response = await fetch(`${baseUrl}/api/audit?id=${params.id}`, {
      cache: 'no-store',
    });
    
    if (response.ok) {
      audit = await response.json();
    } else {
      error = 'Audit not found';
    }
  } catch (e) {
    error = 'Failed to load audit';
  }
  
  if (error || !audit) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Audit Not Found</h1>
          <p className="text-gray-600 mb-6">This audit may have expired or the link is incorrect.</p>
          <a href="/" className="text-blue-600 hover:underline">
            Create a new audit →
          </a>
        </div>
      </main>
    );
  }
  
  return <AuditResults audit={audit} />;
}
