"use client"

import { useState } from "react"
import { Sidebar } from "./sidebar"
import { DailyBrief } from "./daily-brief"
import { SchedulePanel } from "./schedule-panel"
import { TaskManager } from "./task-manager"
import { IntelligenceFeed } from "./intelligence-feed"
import { QuickActions } from "./quick-actions"
import { VoiceButton } from "./voice-button"

export function Dashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 overflow-hidden">
      {/* Sidebar - 30% */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content - 70% */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="glass-dark border-b px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Executive Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search or ask..."
              className="glass px-4 py-2 rounded-full text-sm text-slate-300 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 w-64"
            />
            <button className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/15 transition-colors">
              🔔
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          {/* Daily Brief */}
          <DailyBrief />

          {/* Three Column Layout */}
          <div className="grid grid-cols-3 gap-6">
            <SchedulePanel />
            <TaskManager />
            <IntelligenceFeed />
          </div>

          {/* Quick Actions */}
          <QuickActions />
        </div>
      </div>

      {/* Voice Button */}
      <VoiceButton />
    </div>
  )
}
