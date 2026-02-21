"use client"

export function QuickActions() {
  const actions = [
    { icon: "📅", label: "Schedule Meeting", description: "Create a new meeting" },
    { icon: "✉️", label: "Draft Email", description: "Compose an email" },
    { icon: "🔍", label: "Research Topic", description: "Deep dive analysis" },
    { icon: "📄", label: "Analyze Document", description: "Review & summarize" },
  ]

  return (
    <div className="glass-dark p-8 rounded-2xl">
      <h3 className="text-lg font-bold text-white mb-6">Quick Actions</h3>
      <div className="grid grid-cols-4 gap-4">
        {actions.map((action, idx) => (
          <button
            key={idx}
            className="p-6 rounded-xl glass hover:bg-white/15 transition-all group flex flex-col items-center text-center gap-3"
          >
            <div className="text-3xl group-hover:scale-110 transition-transform">{action.icon}</div>
            <div>
              <p className="text-sm font-semibold text-white">{action.label}</p>
              <p className="text-xs text-slate-400 mt-1">{action.description}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Keyboard Shortcut Hint */}
      <div className="mt-6 pt-6 border-t border-white/10 text-center">
        <p className="text-xs text-slate-400">
          Press <kbd className="px-2 py-1 rounded bg-white/10 text-slate-300 font-mono">Cmd+K</kbd> to open command
          palette
        </p>
      </div>
    </div>
  )
}
