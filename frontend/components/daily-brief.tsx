"use client"

import { useState, useEffect } from "react"

export function DailyBrief() {
  const [greeting, setGreeting] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting("Good morning")
    else if (hour < 18) setGreeting("Good afternoon")
    else setGreeting("Good evening")
    setIsLoading(false)
  }, [])

  return (
    <div className="glass-dark p-8 rounded-2xl space-y-6 glow-primary">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-white mb-2">
            {greeting},{" "}
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Alex</span>
          </h2>
          <p className="text-slate-400">Here's your executive summary for today</p>
        </div>
        <div className="text-right">
          <div className="text-sm font-semibold text-slate-300">Next Meeting In</div>
          <div className="text-2xl font-bold text-cyan-400">2h 15m</div>
        </div>
      </div>

      {/* Summary Bullets */}
      <div className="space-y-3">
        {[
          { icon: "📋", text: "4 priority items need your attention" },
          { icon: "💼", text: "Quarterly earnings report scheduled for 3 PM" },
          { icon: "📈", text: "Market analysis shows 12% portfolio growth this week" },
          { icon: "🎯", text: "Team standup at 10 AM - 8 attendees confirmed" },
        ].map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            <span className="text-xl">{item.icon}</span>
            <p className="text-slate-300 text-sm">{item.text}</p>
          </div>
        ))}
      </div>

      {/* Weather and Timer */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg glass flex items-center justify-center text-xl">☀️</div>
          <div>
            <p className="text-xs text-slate-400">Weather</p>
            <p className="text-sm font-semibold text-white">72°F • Clear</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg glass flex items-center justify-center text-xl">⏰</div>
          <div>
            <p className="text-xs text-slate-400">Current Time</p>
            <p className="text-sm font-semibold text-white">
              {new Date().toLocaleTimeString().split(":").slice(0, 2).join(":")}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
