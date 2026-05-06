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
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Stop Overpaying for AI Tools
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Free audit finds hidden savings in your Cursor, Claude, ChatGPT, and Copilot spend
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
            <span>✓ No login required</span>
            <span>✓ Instant results</span>
            <span>✓ Shareable report</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-6">Your AI Tool Stack</h2>
            
            {formData.tools.map((tool, index) => (
              <div key={index} className="mb-6 p-6 bg-gray-50 rounded-lg relative">
                <button
                  type="button"
                  onClick={() => removeTool(index)}
                  className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tool
                    </label>
                    <select
                      value={tool.tool}
                      onChange={(e) => updateTool(index, { tool: e.target.value as any })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="cursor">Cursor</option>
                      <option value="github-copilot">GitHub Copilot</option>
                      <option value="claude">Claude</option>
                      <option value="chatgpt">ChatGPT</option>
                      <option value="anthropic-api">Anthropic API</option>
                      <option value="openai-api">OpenAI API</option>
                      <option value="gemini">Google Gemini</option>
                      <option value="windsurf">Windsurf</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Plan
                    </label>
                    <select
                      value={tool.plan}
                      onChange={(e) => updateTool(index, { plan: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {getPlansForTool(tool.tool).map(plan => (
                        <option key={plan} value={plan}>{plan}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Monthly Spend ($)
                    </label>
                    <input
                      type="number"
                      value={tool.monthlySpend}
                      onChange={(e) => updateTool(index, { monthlySpend: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Seats
                    </label>
                    <input
                      type="number"
                      value={tool.seats}
                      onChange={(e) => updateTool(index, { seats: parseInt(e.target.value) || 1 })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="1"
                      required
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addTool}
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-colors"
            >
              + Add Another Tool
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Team Size
              </label>
              <input
                type="number"
                value={formData.teamSize}
                onChange={(e) => setFormData({ ...formData, teamSize: parseInt(e.target.value) || 1 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Use Case
              </label>
              <select
                value={formData.primaryUseCase}
                onChange={(e) => setFormData({ ...formData, primaryUseCase: e.target.value as UseCase })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="coding">Coding</option>
                <option value="writing">Writing</option>
                <option value="data">Data Analysis</option>
                <option value="research">Research</option>
                <option value="mixed">Mixed</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || formData.tools.length === 0}
            className="w-full py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-lg"
          >
            {isSubmitting ? 'Generating Audit...' : 'Get My Free Audit'}
          </button>
        </form>

        {/* Social Proof */}
        <div className="mt-12 text-center text-gray-600">
          <p className="mb-4">Trusted by startups to optimize AI spend</p>
          <div className="flex justify-center gap-8 text-sm">
            <span>🚀 YC-backed teams</span>
            <span>💰 $2M+ saved</span>
            <span>⚡ 5-min audit</span>
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
