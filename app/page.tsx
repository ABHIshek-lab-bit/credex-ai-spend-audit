'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuditInput, ToolSpend, UseCase } from '@/lib/types';

export default function Home() {
  const router = useRouter();
  const [formData, setFormData] = useState<AuditInput>({
    tools: [],
    teamSize: 1,
    primaryUseCase: 'coding',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('auditFormData');
    if (saved) {
      try {
        setFormData(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved form data');
      }
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('auditFormData', JSON.stringify(formData));
  }, [formData]);

  // Track mouse position for 3D effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const addTool = () => {
    setFormData({
      ...formData,
      tools: [
        ...formData.tools,
        { tool: 'cursor', plan: 'pro', monthlySpend: 0, seats: 1 },
      ],
    });
  };

  const removeTool = (index: number) => {
    setFormData({
      ...formData,
      tools: formData.tools.filter((_, i) => i !== index),
    });
  };

  const updateTool = (index: number, updates: Partial<ToolSpend>) => {
    const newTools = [...formData.tools];
    newTools[index] = { ...newTools[index], ...updates };
    setFormData({ ...formData, tools: newTools });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Audit failed');

      const result = await response.json();
      router.push(`/audit/${result.id}`);
    } catch (error) {
      console.error('Error generating audit:', error);
      alert('Failed to generate audit. Please try again.');
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
        {/* Hero Section */}
        <div className="text-center mb-16 animate-slide-down">
          <div className="inline-block mb-6">
            <span className="px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-500/30 rounded-full text-blue-300 text-sm font-medium animate-pulse-slow">
              🚀 Trusted by 500+ Startups
            </span>
          </div>
          
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight">
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
              Stop Overpaying
            </span>
            <span className="block text-white mt-2">for AI Tools</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Free audit finds <span className="text-blue-400 font-semibold">hidden savings</span> in your Cursor, Claude, ChatGPT, and Copilot spend
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>No login required</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Instant results</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              <span>Shareable report</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto animate-scale-in">
          <div className="relative group">
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            
            <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 border border-white/20">
              <div className="mb-10">
                <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                  <span className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </span>
                  Your AI Tool Stack
                </h2>
                <p className="text-gray-400">Add the tools you're currently using</p>
              </div>
              
              <div className="space-y-6 mb-8">
                {formData.tools.map((tool, index) => (
                  <div 
                    key={index} 
                    className="group/card relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 card-3d"
                  >
                    <button
                      type="button"
                      onClick={() => removeTool(index)}
                      className="absolute top-4 right-4 w-8 h-8 bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white rounded-lg transition-all duration-200 flex items-center justify-center group/btn"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          Tool
                        </label>
                        <select
                          value={tool.tool}
                          onChange={(e) => updateTool(index, { tool: e.target.value as any })}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                        >
                          <option value="cursor" className="bg-slate-800">Cursor</option>
                          <option value="github-copilot" className="bg-slate-800">GitHub Copilot</option>
                          <option value="claude" className="bg-slate-800">Claude</option>
                          <option value="chatgpt" className="bg-slate-800">ChatGPT</option>
                          <option value="anthropic-api" className="bg-slate-800">Anthropic API</option>
                          <option value="openai-api" className="bg-slate-800">OpenAI API</option>
                          <option value="gemini" className="bg-slate-800">Google Gemini</option>
                          <option value="windsurf" className="bg-slate-800">Windsurf</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          Plan
                        </label>
                        <select
                          value={tool.plan}
                          onChange={(e) => updateTool(index, { plan: e.target.value })}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                        >
                          {getPlansForTool(tool.tool).map(plan => (
                            <option key={plan} value={plan} className="bg-slate-800">{plan}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          Monthly Spend ($)
                        </label>
                        <input
                          type="number"
                          value={tool.monthlySpend}
                          onChange={(e) => updateTool(index, { monthlySpend: parseFloat(e.target.value) || 0 })}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                          min="0"
                          step="0.01"
                          required
                          placeholder="0.00"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          Number of Seats
                        </label>
                        <input
                          type="number"
                          value={tool.seats}
                          onChange={(e) => updateTool(index, { seats: parseInt(e.target.value) || 1 })}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                          min="1"
                          required
                          placeholder="1"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addTool}
                  className="w-full py-4 border-2 border-dashed border-white/20 rounded-2xl text-gray-300 hover:border-blue-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  <svg className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="font-semibold">Add Another Tool</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Team Size
                  </label>
                  <input
                    type="number"
                    value={formData.teamSize}
                    onChange={(e) => setFormData({ ...formData, teamSize: parseInt(e.target.value) || 1 })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                    min="1"
                    required
                    placeholder="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Primary Use Case
                  </label>
                  <select
                    value={formData.primaryUseCase}
                    onChange={(e) => setFormData({ ...formData, primaryUseCase: e.target.value as UseCase })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                  >
                    <option value="coding" className="bg-slate-800">Coding</option>
                    <option value="writing" className="bg-slate-800">Writing</option>
                    <option value="data" className="bg-slate-800">Data Analysis</option>
                    <option value="research" className="bg-slate-800">Research</option>
                    <option value="mixed" className="bg-slate-800">Mixed</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || formData.tools.length === 0}
                className="relative w-full py-5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-lg overflow-hidden group"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating Your Audit...
                    </>
                  ) : (
                    <>
                      Get My Free Audit
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          </div>
        </form>

        {/* Social Proof */}
        <div className="mt-16 text-center animate-slide-up">
          <p className="text-gray-400 mb-6 text-lg">Trusted by startups to optimize AI spend</p>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="bg-white/5 backdrop-blur-sm px-6 py-4 rounded-2xl border border-white/10 hover:border-blue-500/50 transition-all duration-300 hover:scale-105">
              <div className="text-3xl mb-2">🚀</div>
              <div className="text-white font-bold text-xl">500+</div>
              <div className="text-gray-400 text-sm">YC-backed teams</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm px-6 py-4 rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:scale-105">
              <div className="text-3xl mb-2">💰</div>
              <div className="text-white font-bold text-xl">$2.1M+</div>
              <div className="text-gray-400 text-sm">Total saved</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm px-6 py-4 rounded-2xl border border-white/10 hover:border-pink-500/50 transition-all duration-300 hover:scale-105">
              <div className="text-3xl mb-2">⚡</div>
              <div className="text-white font-bold text-xl">5 min</div>
              <div className="text-gray-400 text-sm">Average audit</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function getPlansForTool(tool: string): string[] {
  const plans: Record<string, string[]> = {
    'cursor': ['hobby', 'pro', 'business', 'enterprise'],
    'github-copilot': ['individual', 'business', 'enterprise'],
    'claude': ['free', 'pro', 'team', 'enterprise', 'api'],
    'chatgpt': ['free', 'plus', 'team', 'enterprise', 'api'],
    'anthropic-api': ['api'],
    'openai-api': ['api'],
    'gemini': ['free', 'advanced', 'api'],
    'windsurf': ['free', 'pro', 'teams', 'enterprise'],
  };
  return plans[tool] || ['pro'];
}
