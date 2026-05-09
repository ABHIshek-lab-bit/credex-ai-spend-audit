'use client';

import { useState } from 'react';
import { AuditResult } from '@/lib/types';
import { CheckCircle, AlertCircle, TrendingDown, TrendingUp, Share2, Mail } from 'lucide-react';

interface Props {
  audit: AuditResult;
}

export default function AuditResults({ audit }: Props) {
  const [showLeadCapture, setShowLeadCapture] = useState(false);
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const highValue = audit.totalMonthlySavings >= 500;
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `I could save $${audit.totalMonthlySavings.toFixed(0)}/month on AI tools`,
          text: `Just audited my AI spend and found $${audit.totalAnnualSavings.toFixed(0)}/year in savings. Check yours:`,
          url: shareUrl,
        });
      } catch (err) {
        console.log('Share failed:', err);
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert('Link copied to clipboard!');
    }
  };
  
  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          companyName,
          auditId: audit.id,
        }),
      });
      
      if (response.ok) {
        setSubmitted(true);
      } else {
        alert('Failed to submit. Please try again.');
      }
    } catch (error) {
      console.error('Lead capture error:', error);
      alert('Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Hero Results */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Your AI Spend Audit Results
            </h1>
            <p className="text-gray-600">
              {audit.summary}
            </p>
          </div>
          
          {/* Total Savings */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
              <div className="text-sm text-green-700 font-medium mb-2">Monthly Savings</div>
              <div className="text-4xl font-bold text-green-900">
                ${audit.totalMonthlySavings.toFixed(2)}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
              <div className="text-sm text-blue-700 font-medium mb-2">Annual Savings</div>
              <div className="text-4xl font-bold text-blue-900">
                ${audit.totalAnnualSavings.toFixed(2)}
              </div>
            </div>
          </div>
          
          {/* Per-Tool Breakdown */}
          <div className="space-y-4 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900">Tool-by-Tool Breakdown</h2>
            
            {audit.toolAudits.map((toolAudit, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 capitalize">
                      {toolAudit.tool.replace('-', ' ')}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Current: {toolAudit.currentPlan} plan - ${toolAudit.currentSpend}/mo
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {toolAudit.recommendation.action === 'keep' ? (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    ) : (
                      <AlertCircle className="w-6 h-6 text-orange-500" />
                    )}
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-3">
                  <div className="flex items-start gap-2">
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {toolAudit.recommendation.action}:
                    </span>
                    <span className="text-sm text-gray-600">
                      {toolAudit.recommendation.reason}
                    </span>
                  </div>
                </div>
                
                {toolAudit.recommendation.monthlySavings > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Potential savings:</span>
                    <span className="font-semibold text-green-600">
                      ${toolAudit.recommendation.monthlySavings.toFixed(2)}/mo
                      (${toolAudit.recommendation.annualSavings.toFixed(2)}/yr)
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* CTA Section */}
          {highValue && !submitted && (
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-8 border-2 border-purple-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                💰 Unlock ${audit.totalMonthlySavings.toFixed(0)}/month in Savings
              </h3>
              <p className="text-gray-700 mb-6">
                Credex offers discounted AI credits for Cursor, Claude, ChatGPT Enterprise, and more.
                With your current spend, you could save an additional 15-25% through our platform.
              </p>
              
              {!showLeadCapture ? (
                <button
                  onClick={() => setShowLeadCapture(true)}
                  className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                >
                  Talk to Credex →
                </button>
              ) : (
                <form onSubmit={handleLeadSubmit} className="space-y-4">
                  <div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Work email"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Company name (optional)"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 disabled:bg-gray-400 transition-colors"
                  >
                    {isSubmitting ? 'Submitting...' : 'Get Credex Pricing'}
                  </button>
                </form>
              )}
            </div>
          )}
          
          {!highValue && !submitted && (
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Stay Updated
              </h3>
              <p className="text-gray-600 mb-4">
                Your spend is well-optimized! Get notified when new savings opportunities apply to your stack.
              </p>
              
              {!showLeadCapture ? (
                <button
                  onClick={() => setShowLeadCapture(true)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Notify Me
                </button>
              ) : (
                <form onSubmit={handleLeadSubmit} className="flex gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email"
                    required
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                  >
                    {isSubmitting ? '...' : 'Subscribe'}
                  </button>
                </form>
              )}
            </div>
          )}
          
          {submitted && (
            <div className="bg-green-50 rounded-xl p-6 border border-green-200 text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Thanks! We&apos;ll be in touch soon.
              </h3>
              <p className="text-gray-600">
                Check your email for your audit report and next steps.
              </p>
            </div>
          )}
          
          {/* Share Button */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 mx-auto text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Share2 className="w-5 h-5" />
              Share this audit
            </button>
          </div>
        </div>
        
        {/* Footer CTA */}
        <div className="text-center">
          <a
            href="/"
            className="inline-block bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow border-2 border-gray-200"
          >
            Audit Your AI Spend →
          </a>
        </div>
      </div>
    </main>
  );
}
