"use client"

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  onLogout?: () => void
}

export function Sidebar({ activeTab, setActiveTab, onLogout }: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "calendar", label: "Calendar", icon: "📅" },
    { id: "tasks", label: "Tasks", icon: "✓" },
    { id: "email", label: "Email", icon: "✉️" },
    { id: "research", label: "Research", icon: "🔍" },
    { id: "analytics", label: "Analytics", icon: "📈" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ]

  const stats = [
    { label: "Tasks Completed", value: "12", color: "from-emerald-500 to-teal-500" },
    { label: "Meetings Today", value: "3", color: "from-cyan-500 to-blue-500" },
    { label: "Emails Triaged", value: "8", color: "from-purple-500 to-pink-500" },
  ]

  return (
    <div className="w-[30%] flex flex-col glass-dark border-r overflow-hidden">
      {/* Avatar and Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full glass glow-primary flex items-center justify-center text-xl font-bold animate-pulse">
            🤖
          </div>
          <div className="flex-1">
            <h2 className="text-sm font-semibold text-white">Alex</h2>
            <p className="text-xs text-slate-400">Your AI Assistant</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="p-6 space-y-3 border-b border-white/10">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="glass-dark p-4 rounded-lg hover:bg-white/15 transition-colors group cursor-pointer"
          >
            <p className="text-xs text-slate-400 group-hover:text-slate-300">{stat.label}</p>
            <p className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left ${
              activeTab === item.id
                ? "glass glow-primary text-white"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-sm font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Recent Activity Footer */}
      <div className="p-6 border-t border-white/10">
        <p className="text-xs text-slate-400 mb-3">Recent Activity</p>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span className="text-slate-400">Report completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
            <span className="text-slate-400">Meeting scheduled</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
            <span className="text-slate-400">2 pending items</span>
          </div>
        </div>
        {onLogout && (
          <button
            onClick={onLogout}
            className="mt-4 w-full text-xs text-slate-500 hover:text-red-400 transition-colors text-left px-1"
          >
            Sign out
          </button>
        )}
      </div>
    </div>
  )
}
