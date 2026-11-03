'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

function OverviewContent() {
  const params = useSearchParams();
  const projectId = params.get('projectId');
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) {
      setError('Project ID is required');
      setLoading(false);
      return;
    }

    async function loadStats() {
      try {
        setError(null);
        const res = await fetch(`/api/projects/${projectId}/stats`);
        if (!res.ok) {
          throw new Error(`Failed to load stats: ${res.statusText}`);
        }
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error('Error loading stats:', error);
        setError(error instanceof Error ? error.message : 'Failed to load project stats');
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, [projectId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-slate-600">Loading project overview...</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="font-semibold text-red-900 mb-2">Error Loading Project</h3>
        <p className="text-red-800">{error || 'Unknown error occurred'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Project Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h1 className="text-3xl font-bold text-slate-900">{stats.project.name}</h1>
        <p className="text-slate-600 mt-2">{stats.project.description}</p>
        <div className="mt-4 text-sm text-slate-500">
          <a href={stats.project.repositoryUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            {stats.project.repositoryUrl}
          </a>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard label="Source Events" value={stats.stats.totalSourceEvents} />
        <MetricCard label="Candidate Claims" value={stats.stats.totalClaims} />
        <MetricCard label="Knowledge Gaps" value={stats.stats.totalGaps} />
        <MetricCard label="Reviews Completed" value={stats.stats.totalReviews} />
      </div>

      {/* Workflow Progress */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">8-Phase Workflow Progress</h2>
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {['CONNECT', 'NORMALISE', 'RECONSTRUCT', 'EXTRACT', 'VERIFY', 'REVIEW', 'HANDOVER', 'FEEDBACK'].map((phase, i) => (
            <div key={i} className="flex items-center min-w-fit">
              <div className={`px-3 py-1 rounded text-sm font-semibold text-white ${
                i < 3 ? 'bg-green-600' : i < 5 ? 'bg-blue-600' : 'bg-slate-400'
              }`}>
                {phase}
              </div>
              {i < 7 && <div className="text-slate-400 mx-2">→</div>}
            </div>
          ))}
        </div>
      </div>

      {/* Claims by Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Claims by Verification Status</h3>
          <div className="space-y-2">
            {Object.entries(stats.stats.claimsByStatus).map(([status, count]: [string, unknown]) => (
              <div key={status} className="flex justify-between text-sm">
                <span className="text-slate-600">{status}</span>
                <span className="font-semibold text-slate-900">{count as number}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Knowledge Gaps by Priority</h3>
          <div className="space-y-2">
            {Object.entries(stats.stats.gapsByPriority).map(([priority, count]: [string, unknown]) => (
              <div key={priority} className="flex justify-between text-sm">
                <span className="text-slate-600">{priority}</span>
                <span className="font-semibold text-slate-900">{count as number}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Latest Workflow */}
      {stats.stats.latestWorkflow && (
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Latest Workflow Run</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Phase</span>
              <span className="font-semibold">{stats.stats.latestWorkflow.phaseKey}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Status</span>
              <span className={`font-semibold ${
                stats.stats.latestWorkflow.status === 'completed' ? 'text-green-600' :
                stats.stats.latestWorkflow.status === 'paused' ? 'text-yellow-600' :
                stats.stats.latestWorkflow.status === 'failed' ? 'text-red-600' : 'text-blue-600'
              }`}>
                {stats.stats.latestWorkflow.status}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Started</span>
              <span className="font-semibold">{new Date(stats.stats.latestWorkflow.startedAt).toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4">
      <div className="text-3xl font-bold text-slate-900">{value}</div>
      <div className="text-sm text-slate-600 mt-1">{label}</div>
    </div>
  );
}

export default function OverviewPage() {
  return (
    <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
      <OverviewContent />
    </Suspense>
  );
}
