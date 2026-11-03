'use client';

export default function SettingsPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Project Settings</h1>
        <p className="text-slate-600">Manage project configuration and team members</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-6">
        {/* Project Details */}
        <section className="border-b border-slate-200 pb-6">
          <h3 className="font-semibold text-slate-900 mb-4">Project Details</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Project Name</label>
              <input type="text" defaultValue="Smart Agriculture Prediction" className="w-full px-4 py-2 border border-slate-300 rounded-lg" disabled />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Repository URL</label>
              <input type="text" defaultValue="https://github.com/demo/smart-agriculture" className="w-full px-4 py-2 border border-slate-300 rounded-lg" disabled />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea defaultValue="ML model for crop yield prediction using soil and weather data" className="w-full px-4 py-2 border border-slate-300 rounded-lg" rows={3} disabled />
            </div>
          </div>
        </section>

        {/* Team Members */}
        <section className="border-b border-slate-200 pb-6">
          <h3 className="font-semibold text-slate-900 mb-4">Team Members</h3>
          <div className="space-y-3">
            {[
              { name: 'Alice Chen', email: 'alice@example.com', role: 'lead' },
              { name: 'Bob Kumar', email: 'bob@example.com', role: 'contributor' },
              { name: 'Carol White', email: 'carol@example.com', role: 'successor' },
            ].map((member, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                  <div className="font-medium text-slate-900">{member.name}</div>
                  <div className="text-sm text-slate-500">{member.email}</div>
                </div>
                <span className="text-xs font-bold px-3 py-1 bg-blue-100 text-blue-700 rounded">{member.role}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Demo Controls */}
        <section>
          <h3 className="font-semibold text-slate-900 mb-4">Demo Controls</h3>
          <button className="w-full px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors">
            Reset & Reseed Demo Data
          </button>
          <p className="text-sm text-slate-500 mt-2">Resets all project data and reseeds the Smart Agriculture demo dataset</p>
        </section>
      </div>
    </div>
  );
}
