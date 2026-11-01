export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-white mb-4">NEXMIND</h1>
        <p className="text-xl text-slate-300 mb-8">The Adaptive Knowledge Continuity Platform</p>
        <p className="text-lg text-slate-400 mb-12">
          Reconstruct project knowledge and create verified handovers for successors.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mt-12">
          <div className="bg-slate-700 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-white mb-4">Quick Start</h2>
            <ul className="text-slate-300 space-y-2">
              <li>• Create a new project</li>
              <li>• Connect GitHub repository</li>
              <li>• Import project documents</li>
              <li>• Run analysis workflow</li>
            </ul>
          </div>

          <div className="bg-slate-700 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-white mb-4">Features</h2>
            <ul className="text-slate-300 space-y-2">
              <li>• Multi-source ingestion</li>
              <li>• Verified knowledge claims</li>
              <li>• Human-in-the-loop review</li>
              <li>• Structured handover generation</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 text-center">
          <a
            href="/projects"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg"
          >
            Get Started
          </a>
        </div>
      </div>
    </main>
  );
}
