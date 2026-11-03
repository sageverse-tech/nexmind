'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

function SuccessorHandoverContent() {
  const params = useSearchParams();
  const projectId = params.get('projectId');
  const [handover, setHandover] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) {
      setError('Project ID is required');
      setLoading(false);
      return;
    }

    async function loadHandover() {
      try {
        setError(null);
        const res = await fetch(`/api/projects/${projectId}/handover`);
        if (!res.ok) {
          throw new Error(`Failed to load handover: ${res.statusText}`);
        }
        const data = await res.json();
        setHandover(data);
      } catch (error) {
        console.error('Error loading handover:', error);
        setError(error instanceof Error ? error.message : 'Failed to load handover dossier');
      } finally {
        setLoading(false);
      }
    }

    loadHandover();
  }, [projectId]);

  const handleDownload = (format: 'json' | 'markdown') => {
    if (!handover) return;

    let content = '';
    let filename = `handover.${format}`;

    if (format === 'json') {
      content = JSON.stringify(handover, null, 2);
    } else {
      // Generate markdown format
      content = `# Successor Handover Dossier
Generated: ${new Date(handover.generatedAt).toLocaleString()}

## Project Overview
- **Name:** ${handover.projectName}
- **Description:** ${handover.projectDescription}
- **Repository:** ${handover.repositoryUrl}

## Summary
- Total Source Events: ${handover.summary?.totalSourceEvents || 0}
- Approved Claims: ${handover.summary?.totalApprovedClaims || 0}
- Knowledge Gaps: ${handover.summary?.totalKnowledgeGaps || 0}
- Reviews Completed: ${handover.summary?.reviewsCompleted || 0}

## Approved Decisions & Claims
${handover.approvedDecisions?.map((claim: any) => `- **${claim.type}:** ${claim.text}`).join('\n') || 'No approved claims'}

## Knowledge Gaps
${handover.knowledgeGaps?.map((gap: any) => `- **${gap.priority}:** ${gap.description}`).join('\n') || 'No gaps identified'}

## Next Actions
${handover.nextActions?.map((action: string) => `- ${action}`).join('\n') || 'No pending actions'}
`;
    }

    const blob = new Blob([content], { type: format === 'json' ? 'application/json' : 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-slate-600">Generating handover dossier...</p>
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

  if (!handover) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <p className="text-yellow-800">No handover dossier available</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Successor Handover Dossier</h1>
        <p className="text-slate-600">Knowledge transfer document for project continuity</p>
        <p className="text-xs text-slate-500 mt-4">Generated: {new Date(handover.generatedAt).toLocaleString()}</p>
      </div>

      {/* Project Overview */}
      <section className="bg-white border border-slate-200 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Project Overview</h2>
        <div className="space-y-2">
          <div><strong>Name:</strong> {handover.project.name}</div>
          <div><strong>Description:</strong> {handover.project.description}</div>
          <div><strong>Repository:</strong> <a href={handover.project.repositoryUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{handover.project.repositoryUrl}</a></div>
        </div>
      </section>

      {/* Summary */}
      <section className="bg-white border border-slate-200 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Summary</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-slate-50 p-4 rounded">
            <div className="text-3xl font-bold text-blue-600">{handover.summary.totalSourceEvents}</div>
            <div className="text-sm text-slate-600">Source Events</div>
          </div>
          <div className="bg-slate-50 p-4 rounded">
            <div className="text-3xl font-bold text-green-600">{handover.summary.totalApprovedClaims}</div>
            <div className="text-sm text-slate-600">Approved Claims</div>
          </div>
          <div className="bg-slate-50 p-4 rounded">
            <div className="text-3xl font-bold text-orange-600">{handover.summary.knowledgeGaps}</div>
            <div className="text-sm text-slate-600">Knowledge Gaps</div>
          </div>
        </div>
      </section>

      {/* Approved Claims */}
      {handover.approvedClaims.length > 0 && (
        <section className="bg-white border border-slate-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Approved Claims & Decisions</h2>
          <div className="space-y-3">
            {handover.approvedClaims.map((claim: any) => (
              <div key={claim.id} className="border-l-4 border-green-500 pl-4 py-2">
                <h3 className="font-semibold text-slate-900">{claim.claimText}</h3>
                <p className="text-xs text-slate-500 mt-1">Type: {claim.claimType} | Status: {claim.verificationStatus}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 py-4">
        <button
          onClick={() => handleDownload('markdown')}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
        >
          Download as Markdown
        </button>
        <button
          onClick={() => handleDownload('json')}
          className="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 font-medium transition-colors"
        >
          Download as JSON
        </button>
      </div>
    </div>
  );
}

export default function SuccessorHandoverPage() {
  return (
    <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
      <SuccessorHandoverContent />
    </Suspense>
  );
}
