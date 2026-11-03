import { ReactNode } from 'react';
import Link from 'next/link';

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-white text-slate-900">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-slate-200 bg-slate-50 overflow-y-auto">
        <div className="p-6 border-b border-slate-200">
          <h1 className="text-2xl font-bold text-slate-900">NEXMIND</h1>
          <p className="text-xs text-slate-500 mt-1">Knowledge Continuity</p>
        </div>

        <nav className="p-4 space-y-1">
          <NavLink href="/overview" icon="📊" label="Overview" />
          <NavLink href="/activity-timeline" icon="📈" label="Activity Timeline" />
          <NavLink href="/decision-trails" icon="🔗" label="Decision Trails" />
          <NavLink href="/knowledge-gaps" icon="❓" label="Knowledge Gaps" />
          <NavLink href="/review-centre" icon="✅" label="Review Centre" />
          <NavLink href="/successor-handover" icon="📋" label="Successor Handover" />
          <NavLink href="/feedback" icon="💬" label="Feedback" />
          <NavLink href="/settings" icon="⚙️" label="Settings" />
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200 bg-slate-50 w-64">
          <button className="w-full px-3 py-2 text-sm text-slate-600 hover:bg-slate-200 rounded">
            ← Back to Projects
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="border-b border-slate-200 bg-white px-8 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Project Workspace</h2>
            <p className="text-sm text-slate-500">Smart Agriculture Prediction</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">Demo Mode</span>
            <select className="px-3 py-1 text-sm border border-slate-300 rounded bg-white">
              <option value="contributor">Contributor: Alice</option>
              <option value="lead">Lead: Project Manager</option>
              <option value="successor">Successor: Carol</option>
            </select>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-8">{children}</div>
        </div>
      </main>
    </div>
  );
}

function NavLink({ href, icon, label }: { href: string; icon: string; label: string }) {
  return (
    <Link href={href}>
      <span className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-200 rounded transition-colors cursor-pointer">
        <span className="text-lg">{icon}</span>
        {label}
      </span>
    </Link>
  );
}
