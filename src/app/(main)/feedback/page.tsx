'use client';

import { useState } from 'react';

export default function FeedbackPage() {
  const [rating, setRating] = useState<number>(0);
  const [useful, setUseful] = useState<boolean | null>(null);
  const [missingInfo, setMissingInfo] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    // In a real implementation, this would POST to /api/projects/{id}/feedback
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Successor Feedback</h1>
        <p className="text-slate-600">Help us improve the knowledge handover process</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-6">
        {/* Rating */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-3">
            How useful was this handover? (1-5 stars)
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`text-3xl transition-colors ${
                  rating >= star ? 'text-yellow-400' : 'text-slate-300 hover:text-yellow-200'
                }`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        {/* Yes/No Question */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-3">
            Was the handover useful for understanding the project?
          </label>
          <div className="flex gap-4">
            <button
              onClick={() => setUseful(true)}
              className={`px-6 py-2 rounded font-medium transition-colors ${
                useful === true
                  ? 'bg-green-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Yes
            </button>
            <button
              onClick={() => setUseful(false)}
              className={`px-6 py-2 rounded font-medium transition-colors ${
                useful === false
                  ? 'bg-red-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              No
            </button>
          </div>
        </div>

        {/* Text Area */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-3">
            What information was missing or unclear?
          </label>
          <textarea
            value={missingInfo}
            onChange={e => setMissingInfo(e.target.value)}
            placeholder="Please describe any gaps or areas that needed clarification..."
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
        >
          Submit Feedback
        </button>

        {submitted && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700">
            Thank you for your feedback! This helps us improve knowledge handovers.
          </div>
        )}
      </div>
    </div>
  );
}
