'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

const WORKFLOW_STEPS = [
  {
    step: 1,
    title: 'Enter Demo Project',
    description: 'Load the Smart Agriculture project and initialize the knowledge transfer workflow.',
    phase: 'connect',
    action: 'Load Project',
  },
  {
    step: 2,
    title: 'View Project Timeline',
    description: 'See all source events (commits, PRs, issues, notes) chronologically organized.',
    phase: 'normalise',
    action: 'View Timeline',
  },
  {
    step: 3,
    title: 'Explore Decisions & Claims',
    description: 'Review all extracted claims with linked evidence and verification status.',
    phase: 'reconstruct',
    action: 'View Decisions',
  },
  {
    step: 4,
    title: 'Identify Knowledge Gaps',
    description: 'See what critical information is missing, prioritized by impact.',
    phase: 'extract_intent',
    action: 'View Gaps',
  },
  {
    step: 5,
    title: 'Contributor Review',
    description: 'Review and approve claims as a project contributor. Edit inaccuracies.',
    phase: 'verify',
    action: 'Start Review',
  },
  {
    step: 6,
    title: 'Lead Approval',
    description: 'Lead reviews flagged items and provides final verification before handover.',
    phase: 'human_review',
    action: 'Lead Review',
  },
  {
    step: 7,
    title: 'Generate Handover Document',
    description: 'Create structured successor documentation with all approved knowledge.',
    phase: 'handover',
    action: 'Generate Doc',
  },
  {
    step: 8,
    title: 'Successor Feedback',
    description: 'Successor reviews documentation and provides corrections and clarifications.',
    phase: 'feedback',
    action: 'Add Feedback',
  },
  {
    step: 9,
    title: 'Review & Refine',
    description: 'Team incorporates feedback. Refine claims and close gaps for next successor.',
    phase: 'human_review',
    action: 'Refine',
  },
  {
    step: 10,
    title: 'Complete Transfer',
    description: 'Workflow complete. Knowledge captured, verified, and transferred successfully.',
    phase: 'feedback',
    action: 'Complete',
  },
];

function DemoContent() {
  const params = useSearchParams();
  const router = useRouter();
  const projectId = params.get('projectId');

  const [currentStep, setCurrentStep] = useState(1);
  const [project, setProject] = useState<any>(null);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stepConfig = WORKFLOW_STEPS[currentStep - 1];

  // Load project data
  useEffect(() => {
    if (!projectId) return;

    async function loadProject() {
      try {
        setLoading(true);
        const res = await fetch(`/api/projects/${projectId}`);
        if (res.ok) {
          setProject(await res.json());
        }
      } catch (err) {
        setError('Failed to load project');
      } finally {
        setLoading(false);
      }
    }

    loadProject();
  }, [projectId]);

  // Load step-specific data
  useEffect(() => {
    if (!projectId || currentStep < 2) return;

    async function loadStepData() {
      try {
        setLoading(true);
        setError(null);
        let endpoint = '';

        switch (currentStep) {
          case 2: // Timeline
            endpoint = `/api/projects/${projectId}/timeline`;
            break;
          case 3: // Decisions
            endpoint = `/api/projects/${projectId}/decisions`;
            break;
          case 4: // Gaps
            endpoint = `/api/projects/${projectId}/gaps`;
            break;
          case 7: // Handover
            endpoint = `/api/projects/${projectId}/handover`;
            break;
          case 8: // Feedback
            endpoint = `/api/projects/${projectId}/feedback`;
            break;
        }

        if (endpoint) {
          const res = await fetch(endpoint);
          if (res.ok) {
            setData(await res.json());
          } else {
            setError(`Failed to load data for step ${currentStep}`);
          }
        }
      } catch (err) {
        setError(`Error: ${String(err)}`);
      } finally {
        setLoading(false);
      }
    }

    loadStepData();
  }, [projectId, currentStep]);

  const handleNext = () => {
    if (currentStep < WORKFLOW_STEPS.length) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleReset = () => {
    setCurrentStep(1);
    setData(null);
    window.scrollTo(0, 0);
  };

  const handleBackToHome = () => {
    router.push('/');
  };

  if (!projectId) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Demo Project Not Found</h1>
          <button
            onClick={handleBackToHome}
            className="text-blue-600 hover:underline"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">NEXMIND Demo</h1>
            <p className="text-sm text-slate-600">{project?.name || 'Loading...'}</p>
          </div>
          <button
            onClick={handleBackToHome}
            className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition"
          >
            ← Back
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-semibold text-slate-900">Step {currentStep} of 10</span>
            <span className="text-sm text-slate-600">Phase: <span className="font-semibold text-blue-600">{stepConfig.phase}</span></span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 10) * 100}%` }}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-3 gap-8 mb-12">
          {/* Sidebar - Steps */}
          <div className="col-span-1">
            <div className="bg-white border border-slate-200 rounded-lg p-6 sticky top-24">
              <h3 className="font-semibold text-slate-900 mb-4">Workflow Steps</h3>
              <div className="space-y-2">
                {WORKFLOW_STEPS.map((item) => (
                  <button
                    key={item.step}
                    onClick={() => setCurrentStep(item.step)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition text-sm ${
                      currentStep === item.step
                        ? 'bg-blue-100 text-blue-900 font-semibold border border-blue-300'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div className="font-semibold">Step {item.step}</div>
                    <div className="text-xs opacity-75">{item.title}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-2">
            <div className="bg-white border border-slate-200 rounded-lg p-8">
              {/* Step Header */}
              <div className="mb-8">
                <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold mb-4">
                  {stepConfig.phase.toUpperCase().replace('_', ' ')}
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">
                  Step {currentStep}: {stepConfig.title}
                </h2>
                <p className="text-slate-600">{stepConfig.description}</p>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="py-12 text-center">
                  <div className="inline-block">
                    <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
                  </div>
                  <p className="text-slate-600 mt-2">Loading step {currentStep}...</p>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                  {error}
                </div>
              )}

              {/* Step-Specific Content */}
              {!loading && !error && (
                <div className="space-y-6">
                  {currentStep === 1 && project && (
                    <div className="space-y-4">
                      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                        <h4 className="font-semibold text-slate-900 mb-2">Project Information</h4>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-slate-600">Name:</span>
                            <span className="ml-2 font-semibold text-slate-900">{project.name}</span>
                          </div>
                          <div>
                            <span className="text-slate-600">Repository:</span>
                            <a href={project.repositoryUrl} target="_blank" rel="noopener noreferrer" className="ml-2 font-semibold text-blue-600 hover:underline">
                              {project.repositoryUrl}
                            </a>
                          </div>
                          <div>
                            <span className="text-slate-600">Description:</span>
                            <p className="ml-2 text-slate-700 mt-1">{project.description}</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-900">
                          This is the Smart Agriculture demo project. It contains sample data showing how NEXMIND captures and organizes agricultural knowledge across multiple team transitions.
                        </p>
                      </div>
                    </div>
                  )}

                  {currentStep === 2 && data?.events && (
                    <div className="space-y-3">
                      <div className="text-sm text-slate-600 mb-4">
                        Total Events: <span className="font-semibold">{data.count}</span>
                      </div>
                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {data.events.slice(0, 10).map((event: any, i: number) => (
                          <div key={i} className="bg-slate-50 border border-slate-200 rounded p-3 text-sm">
                            <div className="font-semibold text-slate-900">{event.title}</div>
                            <div className="text-xs text-slate-600 mt-1">
                              Type: {event.sourceType} • {new Date(event.timestamp).toLocaleDateString()}
                            </div>
                            {event.content && (
                              <div className="text-slate-700 mt-2 line-clamp-2">{event.content}</div>
                            )}
                          </div>
                        ))}
                        {data.count > 10 && (
                          <div className="text-center text-sm text-slate-600 py-2">
                            +{data.count - 10} more events
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {currentStep === 3 && data?.decisions && (
                    <div className="space-y-3">
                      <div className="text-sm text-slate-600 mb-4">
                        Total Decisions: <span className="font-semibold">{data.count}</span>
                      </div>
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {data.decisions.slice(0, 5).map((decision: any, i: number) => (
                          <div key={i} className="bg-slate-50 border border-slate-200 rounded p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div className="font-semibold text-slate-900">{decision.claimType}</div>
                              <span className={`px-2 py-1 text-xs font-semibold rounded ${
                                decision.verificationStatus === 'supported' ? 'bg-green-100 text-green-700' :
                                decision.verificationStatus === 'partially_supported' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-slate-200 text-slate-700'
                              }`}>
                                {decision.verificationStatus}
                              </span>
                            </div>
                            <p className="text-slate-700 text-sm mb-3">{decision.claimText}</p>
                            {decision.evidence && (
                              <div className="text-xs space-y-1">
                                <div>Supporting: {decision.evidence.supporting.length}</div>
                                <div>Contradicting: {decision.evidence.contradicting.length}</div>
                              </div>
                            )}
                          </div>
                        ))}
                        {data.count > 5 && (
                          <div className="text-center text-sm text-slate-600 py-2">
                            +{data.count - 5} more decisions
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {currentStep === 4 && data?.gaps && (
                    <div className="space-y-3">
                      <div className="text-sm text-slate-600 mb-4">
                        Knowledge Gaps: <span className="font-semibold">{data.count}</span>
                      </div>
                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {data.gaps.slice(0, 8).map((gap: any, i: number) => (
                          <div key={i} className="bg-slate-50 border border-slate-200 rounded p-3">
                            <div className="flex justify-between items-start mb-2">
                              <span className="font-semibold text-slate-900 text-sm">{gap.description}</span>
                              <span className={`px-2 py-1 text-xs font-semibold rounded ${
                                gap.priority === 'critical' ? 'bg-red-100 text-red-700' :
                                gap.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                                gap.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-slate-100 text-slate-700'
                              }`}>
                                {gap.priority || 'medium'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {currentStep === 5 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <h4 className="font-semibold text-blue-900 mb-3">Contributor Review</h4>
                      <p className="text-sm text-blue-800 mb-4">
                        As a contributor, you would review all candidate claims, verify accuracy, edit inaccuracies, and provide feedback on completeness.
                      </p>
                      <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
                        Start Contributor Review
                      </button>
                    </div>
                  )}

                  {currentStep === 6 && (
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                      <h4 className="font-semibold text-purple-900 mb-3">Lead Approval</h4>
                      <p className="text-sm text-purple-800 mb-4">
                        The lead reviews flagged items, provides strategic context, and approves the final knowledge base before handover.
                      </p>
                      <button className="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition">
                        Start Lead Review
                      </button>
                    </div>
                  )}

                  {currentStep === 7 && data && (
                    <div className="space-y-4">
                      <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
                        <h4 className="font-semibold text-slate-900 mb-4">Handover Document Generated</h4>
                        <div className="space-y-3 text-sm">
                          <div>
                            <span className="text-slate-600">Project:</span>
                            <span className="ml-2 font-semibold">{data.projectName}</span>
                          </div>
                          <div>
                            <span className="text-slate-600">Generated:</span>
                            <span className="ml-2 font-semibold">{new Date(data.generatedAt).toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-slate-600">Approved Claims:</span>
                            <span className="ml-2 font-semibold">{data.summary.totalApprovedClaims}</span>
                          </div>
                          <div>
                            <span className="text-slate-600">Knowledge Gaps to Address:</span>
                            <span className="ml-2 font-semibold">{data.summary.totalKnowledgeGaps}</span>
                          </div>
                        </div>
                      </div>
                      <button className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition">
                        Download Handover Document
                      </button>
                    </div>
                  )}

                  {currentStep === 8 && data && (
                    <div className="space-y-4">
                      <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
                        <h4 className="font-semibold text-slate-900 mb-4">Successor Feedback</h4>
                        <p className="text-sm text-slate-600 mb-4">
                          The successor reviews the handover document and provides feedback on accuracy, clarity, and completeness.
                        </p>
                        <div className="space-y-2 max-h-48 overflow-y-auto mb-4">
                          {data.feedback && data.feedback.length > 0 ? (
                            data.feedback.map((f: any, i: number) => (
                              <div key={i} className="bg-white border border-slate-200 rounded p-2 text-xs">
                                <span className="font-semibold">{f.feedbackType}:</span> {f.feedbackText}
                              </div>
                            ))
                          ) : (
                            <div className="text-slate-600 text-sm">No feedback yet. Add feedback below.</div>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <textarea
                          placeholder="Provide feedback on the handover document..."
                          className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows={3}
                        />
                        <button className="w-full bg-orange-600 text-white py-2 rounded-lg font-semibold hover:bg-orange-700 transition">
                          Submit Feedback
                        </button>
                      </div>
                    </div>
                  )}

                  {currentStep === 9 && (
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
                      <h4 className="font-semibold text-slate-900 mb-3">Review & Refine</h4>
                      <p className="text-sm text-slate-600 mb-4">
                        The team incorporates successor feedback, refines claims, closes identified gaps, and prepares documentation for the next handover cycle.
                      </p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">Feedback items processed:</span>
                          <span className="font-semibold">All</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">Claims updated:</span>
                          <span className="font-semibold">3</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">Gaps closed:</span>
                          <span className="font-semibold">2</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStep === 10 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
                      <div className="text-5xl mb-4">✓</div>
                      <h4 className="text-2xl font-bold text-green-900 mb-3">Workflow Complete!</h4>
                      <p className="text-green-800 mb-6">
                        Knowledge captured, verified, and successfully transferred to your successor.
                      </p>
                      <div className="space-y-2 text-sm text-green-800 bg-white border border-green-300 rounded-lg p-4 mb-6">
                        <div>✓ Timeline documented</div>
                        <div>✓ Decisions verified</div>
                        <div>✓ Gaps identified and addressed</div>
                        <div>✓ Handover document approved</div>
                        <div>✓ Successor feedback incorporated</div>
                      </div>
                      <button
                        onClick={handleReset}
                        className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition"
                      >
                        Start New Workflow
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="border-t border-slate-200 mt-8 pt-6 flex justify-between">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Previous
                </button>
                <button
                  onClick={handleReset}
                  className="px-6 py-2 text-slate-600 hover:text-slate-900 transition"
                >
                  Reset
                </button>
                <button
                  onClick={handleNext}
                  disabled={currentStep === 10}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DemoPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading demo...</div>}>
      <DemoContent />
    </Suspense>
  );
}
