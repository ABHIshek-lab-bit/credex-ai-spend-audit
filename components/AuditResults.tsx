'use client';

import { useState } from 'react';
import { AuditResult } from '@/lib/types';

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
    <main className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000,transparent)]"></div>
        
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-6xl relative z-10">
        {/* Hero Results */}
        <div className="relative group mb-12 animate-scale-in">
          {/* Glow Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition duration-1000"></div>
          
          <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 border border-white/20">
            <div className="text-center mb-10">
              <div className="inline-block mb-4">
                <span className="px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-green-500/30 rounded-full text-green-300 text-sm font-medium">
                  ✨ Audit Complete
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
                Your AI Spend Analysis
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                {audit.summary}
              </p>
            </div>
            
            {/* Total Savings - Big Numbers */}
            <div className="grid md:grid-cols-2 gap-6 mb-10">
              <div className="relative group/card">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur opacity-30 group-hover/card:opacity-50 transition duration-300"></div>
                <div className="relative bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-2xl p-8 border border-green-500/30">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                      <svg className="w-7 h-7 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="text-sm text-green-300 font-semibold">Monthly Savings</div>
                  </div>
                  <div className="text-5xl md:text-6xl font-black text-white mb-2">
                    ${audit.totalMonthlySavings.toFixed(0)}
                  </div>
                  <div className="text-green-300 text-sm">per month</div>
                </div>
              </div>
              
              <div className="relative group/card">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-30 group-hover/card:opacity-50 transition duration-300"></div>
                <div className="relative bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/30">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                      <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <div className="text-sm text-blue-300 font-semibold">Annual Savings</div>
                  </div>
                  <div className="text-5xl md:text-6xl font-black text-white mb-2">
                    ${audit.totalAnnualSavings.toFixed(0)}
                  </div>
                  <div className="text-blue-300 text-sm">per year</div>
                </div>
              </div>
            </div>

            {/* Per-Tool Breakdown */}
            <div className="space-y-4 mb-10">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </span>
                Tool-by-Tool Breakdown
              </h2>
              
              {audit.toolAudits.map((toolAudit, index) => (
                <div 
                  key={index} 
                  className="relative group/tool bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-white capitalize">
                          {toolAudit.tool.replace('-', ' ')}
                        </h3>
                        {toolAudit.recommendation.action === 'keep' ? (
                          <span className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-green-300 text-xs font-semibold flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Optimized
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-orange-500/20 border border-orange-500/30 rounded-full text-orange-300 text-xs font-semibold flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            Can Optimize
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-400">
                        Current: <span className="text-gray-300 font-medium">{toolAudit.currentPlan}</span> plan • <span className="text-gray-300 font-medium">${toolAudit.currentSpend}/mo</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 mb-4 border border-white/10">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-purple-300 capitalize mb-1">
                          {toolAudit.recommendation.action}
                        </div>
                        <div className="text-sm text-gray-300">
                          {toolAudit.recommendation.reason}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {toolAudit.recommendation.monthlySavings > 0 && (
                    <div className="flex items-center justify-between bg-green-500/10 backdrop-blur-sm rounded-xl p-4 border border-green-500/20">
                      <span className="text-sm text-gray-300 font-medium">Potential savings:</span>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-400">
                          ${toolAudit.recommendation.monthlySavings.toFixed(2)}/mo
                        </div>
                        <div className="text-xs text-green-300">
                          ${toolAudit.recommendation.annualSavings.toFixed(2)}/yr
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* CTA Section */}
        {highValue && !submitted && (
          <div className="relative group mb-12 animate-slide-up">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition duration-1000"></div>
            
            <div className="relative bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-3xl p-8 md:p-10 border border-purple-500/30">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-3xl font-black text-white mb-3">
                    💰 Unlock ${audit.totalMonthlySavings.toFixed(0)}/month in Savings
                  </h3>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    Credex offers discounted AI credits for Cursor, Claude, ChatGPT Enterprise, and more.
                    With your current spend, you could save an additional <span className="text-purple-300 font-bold">15-25%</span> through our platform.
                  </p>
                </div>
              </div>
              
              {!showLeadCapture ? (
                <button
                  onClick={() => setShowLeadCapture(true)}
                  className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 text-lg flex items-center justify-center gap-2 group/btn"
                >
                  Talk to Credex
                  <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
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
                      className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Company name (optional)"
                      className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-purple-500/50 disabled:opacity-50 transition-all duration-300 text-lg"
                  >
                    {isSubmitting ? 'Submitting...' : 'Get Credex Pricing'}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
        
        {!highValue && !submitted && (
          <div className="relative group mb-12 animate-slide-up">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            
            <div className="relative bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl rounded-3xl p-8 border border-blue-500/30">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Stay Updated
                  </h3>
                  <p className="text-gray-300">
                    Your spend is well-optimized! Get notified when new savings opportunities apply to your stack.
                  </p>
                </div>
              </div>
              
              {!showLeadCapture ? (
                <button
                  onClick={() => setShowLeadCapture(true)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-blue-500/50 transition-all duration-300"
                >
                  Notify Me
                </button>
              ) : (
                <form onSubmit={handleLeadSubmit} className="flex flex-col md:flex-row gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email"
                    required
                    className="flex-1 px-5 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-blue-500/50 disabled:opacity-50 transition-all duration-300"
                  >
                    {isSubmitting ? '...' : 'Subscribe'}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
        
        {submitted && (
          <div className="relative group mb-12 animate-scale-in">
            <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl blur-xl opacity-30 transition duration-1000"></div>
            
            <div className="relative bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-xl rounded-3xl p-10 border border-green-500/30 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-white mb-3">
                Thanks! We&apos;ll be in touch soon.
              </h3>
              <p className="text-gray-300 text-lg">
                Check your email for your audit report and next steps.
              </p>
            </div>
          </div>
        )}
        
        {/* Share Button */}
        <div className="text-center mb-12">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300 group"
          >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share this audit
          </button>
        </div>
        
        {/* Footer CTA */}
        <div className="text-center">
          <a
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 text-lg group"
          >
            Audit Your AI Spend
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    </main>
  );
}
