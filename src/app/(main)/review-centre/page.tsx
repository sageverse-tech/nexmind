'use client';

export default function ReviewCentrePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Review Centre</h1>
        <p className="text-slate-600">Two-step human-in-the-loop claim review workflow</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <h3 className="font-semibold text-blue-900 mb-2">Review Workflow</h3>
        <p className="text-sm text-blue-800">
          <strong>Step 1: Contributor Review</strong> - Verify and approve claims based on project knowledge<br/>
          <strong>Step 2: Lead Review</strong> - Final approval before generating handover document
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h3 className="font-semibold text-slate-900 mb-4">Claims Pending Contributor Review</h3>
        <div className="text-center py-8 text-slate-500">
          <p>Review workflow demo - Claims will appear here</p>
          <p className="text-xs mt-2">This demonstrates the two-step approval process:</p>
          <p className="text-xs text-slate-400">1. Contributor verifies and approves claims</p>
          <p className="text-xs text-slate-400">2. Lead performs final approval for handover</p>
        </div>
      </div>
    </div>
  );
}
