"use client"

export function SchedulePanel() {
  const meetings = [
    { time: "9:00 AM", title: "Team Standup", type: "sync", duration: "30m", join: true },
    { time: "10:30 AM", title: "Board Meeting", type: "important", duration: "1h", join: true },
    { time: "2:00 PM", title: "Client Call", type: "external", duration: "45m", join: false },
    { time: "3:30 PM", title: "1:1 with Manager", type: "personal", duration: "30m", join: false },
  ]

  const getTypeColor = (type: string) => {
    switch (type) {
      case "important":
        return "bg-red-500/20 border-red-500/50"
      case "external":
        return "bg-cyan-500/20 border-cyan-500/50"
      case "personal":
        return "bg-purple-500/20 border-purple-500/50"
      default:
        return "bg-emerald-500/20 border-emerald-500/50"
    }
  }

  return (
    <div className="glass-dark p-6 rounded-2xl space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white">Today's Schedule</h3>
        <button className="text-xs px-2 py-1 rounded bg-purple-500/30 text-purple-300 hover:bg-purple-500/40 transition-colors">
          + Add
        </button>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {meetings.map((meeting, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-lg border transition-all hover:shadow-lg ${getTypeColor(meeting.type)}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <p className="text-xs font-semibold text-slate-400">{meeting.time}</p>
                <p className="text-sm font-semibold text-white mt-1">{meeting.title}</p>
                <p className="text-xs text-slate-400 mt-1">{meeting.duration}</p>
              </div>
              {meeting.join && (
                <button className="px-2 py-1 text-xs rounded bg-cyan-500/30 text-cyan-300 hover:bg-cyan-500/50 transition-colors whitespace-nowrap">
                  Join
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-white/10">
        <p className="text-xs text-slate-400">
          <span className="text-amber-400 font-semibold">⚠ Warning:</span> 15min travel time between meetings
        </p>
      </div>
    </div>
  )
}
