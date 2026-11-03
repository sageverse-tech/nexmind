'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();
  const [demoProjectId, setDemoProjectId] = useState<string | null>(null);
  const [isCreatingDemo, setIsCreatingDemo] = useState(false);

  // Check if demo project exists or create it with seed data
  useEffect(() => {
    async function initializeDemo() {
      try {
        setIsCreatingDemo(true);
        // Use seed endpoint to create demo project with all sample data
        const seedResponse = await fetch('/api/seed', {
          method: 'POST',
        });

        if (seedResponse.ok) {
          const data = await seedResponse.json();
          setDemoProjectId(data.projectId);
        }
      } catch (error) {
        console.error('Error initializing demo:', error);
      } finally {
        setIsCreatingDemo(false);
      }
    }

    initializeDemo();
  }, []);

  const handleStartDemo = () => {
    if (demoProjectId) {
      router.push(`/demo?projectId=${demoProjectId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="bg-slate-900/50 backdrop-blur border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
              N
            </div>
            <span className="text-xl font-bold text-white">NEXMIND</span>
          </div>
          <div className="text-sm text-slate-400">Knowledge Transfer Intelligence</div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl font-bold text-white leading-tight">
                Intelligent Knowledge <span className="text-blue-400">Transfer</span> for Teams
              </h1>
              <p className="text-xl text-slate-300">
                NEXMIND transforms institutional knowledge into structured, verifiable insights. Track decisions, verify claims, bridge knowledge gaps, and enable seamless project handovers.
              </p>
            </div>

            {/* Problem-Solution */}
            <div className="space-y-6 bg-slate-800/30 border border-slate-700 rounded-xl p-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-200 mb-2">The Problem</h3>
                <p className="text-slate-400">
                  When team members transition, critical context is lost. Decisions lack documentation. Lessons learned disappear. Projects restart from scratch.
                </p>
              </div>
              <div className="border-t border-slate-700 pt-6">
                <h3 className="text-lg font-semibold text-green-400 mb-2">The Solution</h3>
                <p className="text-slate-400">
                  NEXMIND automatically captures, organizes, and verifies project knowledge through an 8-phase workflow. Successors inherit complete context. Knowledge compounds across handovers.
                </p>
              </div>
            </div>

            {/* How It Works Preview */}
            <div className="space-y-3">
              <h3 className="font-semibold text-slate-200">How It Works</h3>
              <div className="flex flex-col gap-2 text-sm text-slate-400">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">1</div>
                  <span><strong>Connect:</strong> Link GitHub repos, notes, and documentation sources</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">2</div>
                  <span><strong>Normalize:</strong> Extract and structure events from all sources</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">3</div>
                  <span><strong>Reconstruct:</strong> Build decision timelines and relationships</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">4-8</div>
                  <span><strong>Extract, Verify, Review, Handover, Feedback:</strong> Validate claims, gather team review, create successor documentation</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Features */}
          <div className="space-y-6">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-blue-600 transition">
              <div className="text-3xl mb-2">📊</div>
              <h4 className="font-semibold text-white mb-2">Timeline Reconstruction</h4>
              <p className="text-slate-400 text-sm">Chronologically organize all decisions and events from project history with full source traceability.</p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-blue-600 transition">
              <div className="text-3xl mb-2">✓</div>
              <h4 className="font-semibold text-white mb-2">Claim Verification</h4>
              <p className="text-slate-400 text-sm">Link evidence to claims. Get confidence scores. Identify missing documentation and conflicting information.</p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-blue-600 transition">
              <div className="text-3xl mb-2">🔍</div>
              <h4 className="font-semibold text-white mb-2">Knowledge Gap Detection</h4>
              <p className="text-slate-400 text-sm">Automatically identify what's missing. Prioritize gaps by impact. Focus team efforts on critical unknowns.</p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-blue-600 transition">
              <div className="text-3xl mb-2">🤝</div>
              <h4 className="font-semibold text-white mb-2">Human-in-the-Loop Review</h4>
              <p className="text-slate-400 text-sm">Contributors and leads review and approve claims. Maintain accuracy. Catch context AI might miss.</p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-blue-600 transition">
              <div className="text-3xl mb-2">📦</div>
              <h4 className="font-semibold text-white mb-2">Structured Handover</h4>
              <p className="text-slate-400 text-sm">Generate comprehensive successor documents. Include decisions, patterns, warnings, and next steps.</p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-blue-600 transition">
              <div className="text-3xl mb-2">💬</div>
              <h4 className="font-semibold text-white mb-2">Feedback Loop</h4>
              <p className="text-slate-400 text-sm">Successors provide feedback. Knowledge compounds. Each handover makes the next one better.</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Experience the Complete Workflow</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Walk through all 10 steps of the NEXMIND system with our guided Smart Agriculture demo. See how institutional knowledge is captured, verified, and transferred.
          </p>
          <button
            onClick={handleStartDemo}
            disabled={!demoProjectId || isCreatingDemo}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreatingDemo ? 'Initializing Demo...' : demoProjectId ? 'Open Demo Workspace' : 'Loading Demo...'}
          </button>
        </div>

        {/* 8-Phase Workflow Visualization */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">The 8-Phase NEXMIND Workflow</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { phase: 'Connect', desc: 'Link sources', color: 'bg-green-600' },
              { phase: 'Normalise', desc: 'Extract data', color: 'bg-green-500' },
              { phase: 'Reconstruct', desc: 'Build timeline', color: 'bg-blue-600' },
              { phase: 'Extract Intent', desc: 'Identify claims', color: 'bg-blue-600' },
              { phase: 'Verify', desc: 'Check evidence', color: 'bg-purple-600' },
              { phase: 'Human Review', desc: 'Team approval', color: 'bg-purple-600' },
              { phase: 'Handover', desc: 'Create docs', color: 'bg-orange-600' },
              { phase: 'Feedback', desc: 'Successor input', color: 'bg-orange-500' },
            ].map((item, i) => (
              <div key={i} className={`${item.color} rounded-lg p-4 text-center text-white`}>
                <div className="text-2xl font-bold mb-1">{i + 1}</div>
                <div className="font-semibold text-sm">{item.phase}</div>
                <div className="text-xs opacity-75">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-700 bg-slate-900/50 mt-20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-400 text-sm">
          <p>NEXMIND • Intelligent Knowledge Transfer for Modern Teams</p>
        </div>
      </div>
    </div>
  );
}
