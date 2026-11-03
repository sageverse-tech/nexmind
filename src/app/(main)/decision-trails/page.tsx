'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

interface DecisionTrail {
  claim: {
    id: string;
    claimType: string;
    claimText: string;
    verificationStatus: string;
    reviewStatus: string;
  };
  evidence: Array<{
    id: string;
    evidenceType: string;
    confidence: number;
    explanation?: string;
  }>;
  sourceEvents: Array<{
    id: string;
    sourceType: string;
    title?: string;
    content?: string;
    timestamp: string;
  }>;
}

function DecisionTrailsContent() {
  const params = useSearchParams();
  const projectId = params.get('projectId');
  const [trails, setTrails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedClaim, setExpandedClaim] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) {
      setError('Project ID is required');
      setLoading(false);
      return;
    }

    async function loadDecisions() {
      try {
        setError(null);
        const res = await fetch(`/api/projects/${projectId}/decisions`);
        if (!res.ok) {
          throw new Error(`Failed to load decisions: ${res.statusText}`);
        }
        const data = await res.json();
        // Handle both array and wrapped response
        const decisionsList = Array.isArray(data) ? data : data.decisions || [];
        setTrails(decisionsList);
      } catch (error) {
        console.error('Error loading decisions:', error);
        setError(error instanceof Error ? error.message : 'Failed to load decision trails');
      } finally {
        setLoading(false);
      }
    }

    loadDecisions();
  }, [projectId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-slate-600">Loading decision trails...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="font-semibold text-red-900 mb-2">Error</h3>
        <p className="text-red-800">{error}</p>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    supported: 'bg-green-100 text-green-800',
    partially_supported: 'bg-yellow-100 text-yellow-800',
    unverified: 'bg-gray-100 text-gray-800',
    conflicting: 'bg-red-100 text-red-800',
    missing_evidence: 'bg-orange-100 text-orange-800',
  };

  const reviewColors: Record<string, string> = {
    approved: 'bg-green-50 border-green-300',
    rejected: 'bg-red-50 border-red-300',
    pending: 'bg-blue-50 border-blue-300',
    flagged: 'bg-yellow-50 border-yellow-300',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Decision Trails</h1>
        <p className="text-slate-600">Claims with supporting evidence and decision history</p>
      </div>

      <div className="space-y-4">
        {trails.length === 0 ? (
          <div className="text-center py-8 text-slate-500">No claims found</div>
        ) : (
          trails.map((trail) => (
            <div
              key={trail.claim.id}
              className={`border-2 rounded-lg p-6 transition-colors cursor-pointer ${
                reviewColors[trail.claim.reviewStatus] || 'bg-white border-slate-200'
              }`}
              onClick={() =>
                setExpandedClaim(
                  expandedClaim === trail.claim.id ? null : trail.claim.id
                )
              }
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-semibold px-3 py-1 bg-slate-200 text-slate-900 rounded">
                      {trail.claim.claimType}
                    </span>
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded ${
                        statusColors[trail.claim.verificationStatus] ||
                        'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {trail.claim.verificationStatus}
                    </span>
                    <span className="text-xs font-semibold px-2 py-1 bg-slate-100 text-slate-700 rounded">
                      {trail.claim.reviewStatus}
                    </span>
                  </div>
                  <p className="text-slate-900 font-medium">{trail.claim.claimText}</p>
                </div>
                <span className="text-2xl text-slate-400">
                  {expandedClaim === trail.claim.id ? '−' : '+'}
                </span>
              </div>

              {expandedClaim === trail.claim.id && (
                <div className="mt-6 space-y-4">
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-3">
                      Evidence ({trail.evidence.length})
                    </h4>
                    {trail.evidence.length === 0 ? (
                      <p className="text-slate-500 text-sm">No evidence linked</p>
                    ) : (
                      <div className="space-y-2">
                        {trail.evidence.map((ev) => (
                          <div
                            key={ev.id}
                            className="bg-white p-3 rounded border border-slate-200 text-sm"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="font-semibold text-slate-900">
                                  {ev.evidenceType}
                                </span>
                                {ev.explanation && (
                                  <p className="text-slate-600 mt-1">{ev.explanation}</p>
                                )}
                              </div>
                              <span className="text-xs bg-slate-100 px-2 py-1 rounded">
                                {ev.confidence}% confidence
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {trail.sourceEvents.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-3">
                        Source Events ({trail.sourceEvents.length})
                      </h4>
                      <div className="space-y-2">
                        {trail.sourceEvents.map((evt) => (
                          <div
                            key={evt.id}
                            className="bg-white p-3 rounded border border-slate-200 text-sm"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-semibold text-slate-900">
                                  {evt.title || 'Untitled'}
                                </p>
                                <p className="text-slate-600 mt-1">
                                  {evt.content || 'No description'}
                                </p>
                                <p className="text-xs text-slate-500 mt-2">
                                  {new Date(evt.timestamp).toLocaleDateString()}
                                </p>
                              </div>
                              <span className="text-xs bg-slate-100 px-2 py-1 rounded">
                                {evt.sourceType}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default function DecisionTrailsPage() {
  return (
    <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
      <DecisionTrailsContent />
    </Suspense>
  );
}
