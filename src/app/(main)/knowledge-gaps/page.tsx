'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

function KnowledgeGapsContent() {
  const params = useSearchParams();
  const projectId = params.get('projectId');
  const [gaps, setGaps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) {
      setError('Project ID is required');
      setLoading(false);
      return;
    }

    async function loadGaps() {
      try {
        setError(null);
        const res = await fetch(`/api/projects/${projectId}/gaps`);
        if (!res.ok) {
          throw new Error(`Failed to load gaps: ${res.statusText}`);
        }
        const data = await res.json();
        // Handle both array and wrapped response
        const gapsList = Array.isArray(data) ? data : data.gaps || [];
        setGaps(gapsList);
      } catch (error) {
        console.error('Error loading gaps:', error);
        setError(error instanceof Error ? error.message : 'Failed to load knowledge gaps');
      } finally {
        setLoading(false);
      }
    }

    loadGaps();
  }, [projectId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-slate-600">Loading knowledge gaps...</p>
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Knowledge Gaps & Contradictions</h1>
        <p className="text-slate-600">Missing information and unresolved questions about the project</p>
      </div>

      {gaps.length === 0 ? (
        <div className="text-center py-12 text-slate-500">No knowledge gaps identified</div>
      ) : (
        <div className="space-y-4">
          {gaps.map(gap => (
            <div key={gap.id} className={`bg-white border-l-4 rounded-lg p-6 ${
              gap.priority === 'critical' ? 'border-red-500' :
              gap.priority === 'high' ? 'border-orange-500' :
              gap.priority === 'medium' ? 'border-yellow-500' :
              'border-slate-300'
            }`}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900">{gap.description}</h3>
                  <p className="text-sm text-slate-600 mt-2">Priority: <span className="font-medium">{gap.priority}</span></p>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded text-white ${
                  gap.priority === 'critical' ? 'bg-red-600' :
                  gap.priority === 'high' ? 'bg-orange-600' :
                  gap.priority === 'medium' ? 'bg-yellow-600' :
                  'bg-slate-400'
                }`}>
                  {gap.priority?.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function KnowledgeGapsPage() {
  return (
    <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
      <KnowledgeGapsContent />
    </Suspense>
  );
}
