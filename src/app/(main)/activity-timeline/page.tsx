'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

function TimelineContent() {
  const params = useSearchParams();
  const projectId = params.get('projectId');
  const [events, setEvents] = useState<any[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  useEffect(() => {
    if (!projectId) {
      setError('Project ID is required');
      setLoading(false);
      return;
    }

    async function loadEvents() {
      try {
        setError(null);
        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        if (filterType) params.append('sourceType', filterType);

        const res = await fetch(`/api/projects/${projectId}/timeline?${params.toString()}`);
        if (!res.ok) {
          throw new Error(`Failed to load timeline: ${res.statusText}`);
        }
        const data = await res.json();
        // Handle both array and wrapped response
        const eventList = Array.isArray(data) ? data : data.events || [];
        setEvents(eventList);
        setFilteredEvents(eventList);
      } catch (error) {
        console.error('Error loading timeline:', error);
        setError(error instanceof Error ? error.message : 'Failed to load timeline');
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, [projectId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-slate-600">Loading activity timeline...</p>
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

  const sourceTypes = Array.from(new Set(events.map(e => e.sourceType)));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Activity Timeline</h1>
        <p className="text-slate-600">Chronological view of all imported source events</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setFilterType('')} className={`px-4 py-2 rounded text-sm font-medium transition-colors ${filterType === '' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-900 hover:bg-slate-300'}`}>
          All Events ({events.length})
        </button>
        {sourceTypes.map(type => (
          <button key={type} onClick={() => setFilterType(type)} className={`px-4 py-2 rounded text-sm font-medium transition-colors ${filterType === type ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-900 hover:bg-slate-300'}`}>
            {type} ({events.filter(e => e.sourceType === type).length})
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-8 text-slate-500">No events found</div>
        ) : (
          filteredEvents.map((event, idx) => (
            <div key={event.id} className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${event.sourceType === 'commit' ? 'bg-green-600' : event.sourceType === 'pull_request' ? 'bg-purple-600' : event.sourceType === 'issue' ? 'bg-orange-600' : 'bg-slate-600'}`}>
                    {idx + 1}
                  </div>
                  {idx < filteredEvents.length - 1 && <div className="w-0.5 h-12 bg-slate-300 my-2" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-900">{event.title || 'Untitled'}</h3>
                      <p className="text-sm text-slate-600 mt-1">{event.content || 'No description'}</p>
                    </div>
                    <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-700 rounded">{event.sourceType}</span>
                  </div>
                  <div className="flex items-center gap-4 mt-4 text-sm text-slate-500">
                    <span>{new Date(event.timestamp).toLocaleDateString()}</span>
                    {event.sourceUrl && (
                      <a href={event.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        View in GitHub →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default function TimelinePage() {
  return (
    <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
      <TimelineContent />
    </Suspense>
  );
}
