"use client"

import { useState } from "react"
import { Sidebar } from "./sidebar"
import { DailyBrief } from "./daily-brief"
import { SchedulePanel } from "./schedule-panel"
import { TaskManager } from "./task-manager"
import { IntelligenceFeed } from "./intelligence-feed"
import { QuickActions } from "./quick-actions"
import { VoiceButton } from "./voice-button"
import { AnalyticsDashboard } from "./analytics-dashboard"
import { EmailTriageView } from "./email-triage-view"
import { MeetingPrepAssistant } from "./meeting-prep-assistant"
import { ResearchResultsPage } from "./research-results-page"
import { CalendarHeatmapView } from "./calendar-heatmap-view"
import { SettingsPanel } from "./settings-panel"
import { markUnauthenticated } from "@/lib/auth"
import { authApi } from "@/lib/api"

const TAB_TITLES: Record<string, string> = {
  dashboard: "Executive Dashboard",
  calendar: "Calendar",
  tasks: "Tasks",
  email: "Email Triage",
  research: "Research",
  analytics: "Analytics",
  settings: "Settings",
}

export function Dashboard({ onLogout }: { onLogout?: () => void }) {
  const [activeTab, setActiveTab] = useState("dashboard")

  const handleLogout = async () => {
    try {
      await authApi.logout()
    } catch {
      // ignore
    }
    markUnauthenticated()
    if (onLogout) {
      onLogout()
    } else {
      window.location.reload()
    }
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="flex-1 overflow-y-auto p-8 space-y-6">
            <DailyBrief />
            <div className="grid grid-cols-3 gap-6">
              <SchedulePanel />
              <TaskManager />
              <IntelligenceFeed />
            </div>
            <QuickActions />
          </div>
        )
      case "calendar":
        return (
          <div className="flex-1 overflow-y-auto">
            <CalendarHeatmapView />
          </div>
        )
      case "tasks":
        return (
          <div className="flex-1 overflow-y-auto p-8">
            <TaskManager fullPage />
          </div>
        )
      case "email":
        return (
          <div className="flex-1 overflow-hidden">
            <EmailTriageView />
          </div>
        )
      case "research":
        return (
          <div className="flex-1 overflow-y-auto">
            <ResearchResultsPage />
          </div>
        )
      case "analytics":
        return (
          <div className="flex-1 overflow-y-auto">
            <AnalyticsDashboard />
          </div>
        )
      case "settings":
        return (
          <div className="flex-1 overflow-y-auto">
            <SettingsPanel />
          </div>
        )
      default:
        return null
    }
  }

  // Email triage has its own header — skip the shared header for it
  const showSharedHeader = activeTab !== "email"

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 overflow-hidden">
      {/* Sidebar - 30% */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />

      {/* Main Content - 70% */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {showSharedHeader && (
          <header className="glass-dark border-b px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                {TAB_TITLES[activeTab] ?? "Executive Dashboard"}
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
        )}

        {renderContent()}
      </div>

      {/* Voice Button */}
      <VoiceButton />
    </div>
  )
}
