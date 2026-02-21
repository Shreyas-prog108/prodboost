"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

interface SettingsSection {
  id: string
  title: string
  description: string
  options: SettingOption[]
}

interface SettingOption {
  id: string
  label: string
  type: "toggle" | "select" | "slider"
  value: boolean | string | number
  onChange: (value: any) => void
}

export function SettingsPanel() {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["display", "widgets", "notifications"]),
  )
  const [dashboardSettings, setDashboardSettings] = useState({
    compactMode: false,
    animationsEnabled: true,
    emailNotifications: true,
    slackNotifications: false,
    dailyBriefTime: "08:00",
    refreshInterval: 5,
    widgetsEnabled: {
      schedule: true,
      tasks: true,
      intelligence: true,
      quickActions: true,
    },
    colorScheme: "auto",
    fontSize: "medium",
  })

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId)
    } else {
      newExpanded.add(sectionId)
    }
    setExpandedSections(newExpanded)
  }

  const updateSetting = (key: string, value: any) => {
    setDashboardSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const updateWidgetSetting = (widget: string, enabled: boolean) => {
    setDashboardSettings((prev) => ({
      ...prev,
      widgetsEnabled: {
        ...prev.widgetsEnabled,
        [widget]: enabled,
      },
    }))
  }

  const sections: SettingsSection[] = [
    {
      id: "display",
      title: "Display Settings",
      description: "Customize how your dashboard looks and feels",
      options: [],
    },
    {
      id: "widgets",
      title: "Widget Preferences",
      description: "Choose which widgets to display on your dashboard",
      options: [],
    },
    {
      id: "notifications",
      title: "Notification Settings",
      description: "Manage how and when you receive notifications",
      options: [],
    },
    {
      id: "integrations",
      title: "Connected Services",
      description: "Manage your connected applications and services",
      options: [],
    },
  ]

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard Settings</h1>
        <p className="text-muted-foreground">Customize your executive dashboard to match your preferences</p>
      </div>

      {/* Display Settings */}
      <div className="glass rounded-lg">
        <button
          onClick={() => toggleSection("display")}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors"
        >
          <div className="text-left">
            <h2 className="text-xl font-semibold text-foreground">Display Settings</h2>
            <p className="text-sm text-muted-foreground">Customize how your dashboard looks and feels</p>
          </div>
          <ChevronDown
            className={`w-5 h-5 text-muted-foreground transition-transform ${
              expandedSections.has("display") ? "rotate-180" : ""
            }`}
          />
        </button>

        {expandedSections.has("display") && (
          <div className="border-t border-white/10 px-6 py-4 space-y-6">
            {/* Compact Mode Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-foreground font-medium">Compact Mode</label>
                <p className="text-sm text-muted-foreground">Reduce spacing and font sizes</p>
              </div>
              <input
                type="checkbox"
                checked={dashboardSettings.compactMode}
                onChange={(e) => updateSetting("compactMode", e.target.checked)}
                className="w-6 h-6 cursor-pointer"
              />
            </div>

            {/* Animations Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-foreground font-medium">Enable Animations</label>
                <p className="text-sm text-muted-foreground">Smooth transitions and visual effects</p>
              </div>
              <input
                type="checkbox"
                checked={dashboardSettings.animationsEnabled}
                onChange={(e) => updateSetting("animationsEnabled", e.target.checked)}
                className="w-6 h-6 cursor-pointer"
              />
            </div>

            {/* Color Scheme */}
            <div>
              <label className="text-foreground font-medium block mb-2">Color Scheme</label>
              <select
                value={dashboardSettings.colorScheme}
                onChange={(e) => updateSetting("colorScheme", e.target.value)}
                className="w-full glass px-4 py-2 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
              >
                <option value="auto">System (Auto)</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>

            {/* Font Size */}
            <div>
              <label className="text-foreground font-medium block mb-2">Font Size</label>
              <select
                value={dashboardSettings.fontSize}
                onChange={(e) => updateSetting("fontSize", e.target.value)}
                className="w-full glass px-4 py-2 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
              >
                <option value="small">Small</option>
                <option value="medium">Medium (Default)</option>
                <option value="large">Large</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Widget Preferences */}
      <div className="glass rounded-lg">
        <button
          onClick={() => toggleSection("widgets")}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors"
        >
          <div className="text-left">
            <h2 className="text-xl font-semibold text-foreground">Widget Preferences</h2>
            <p className="text-sm text-muted-foreground">Choose which widgets to display on your dashboard</p>
          </div>
          <ChevronDown
            className={`w-5 h-5 text-muted-foreground transition-transform ${
              expandedSections.has("widgets") ? "rotate-180" : ""
            }`}
          />
        </button>

        {expandedSections.has("widgets") && (
          <div className="border-t border-white/10 px-6 py-4 space-y-4">
            {Object.entries(dashboardSettings.widgetsEnabled).map(([widget, enabled]) => (
              <div key={widget} className="flex items-center justify-between">
                <div>
                  <label className="text-foreground font-medium capitalize">{widget} Widget</label>
                  <p className="text-sm text-muted-foreground">
                    {widget === "schedule" && "Today's schedule and meetings"}
                    {widget === "tasks" && "Smart task management and tracking"}
                    {widget === "intelligence" && "AI-powered insights and recommendations"}
                    {widget === "quickActions" && "Quick action buttons and shortcuts"}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(e) => updateWidgetSetting(widget, e.target.checked)}
                  className="w-6 h-6 cursor-pointer"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Notification Settings */}
      <div className="glass rounded-lg">
        <button
          onClick={() => toggleSection("notifications")}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors"
        >
          <div className="text-left">
            <h2 className="text-xl font-semibold text-foreground">Notification Settings</h2>
            <p className="text-sm text-muted-foreground">Manage how and when you receive notifications</p>
          </div>
          <ChevronDown
            className={`w-5 h-5 text-muted-foreground transition-transform ${
              expandedSections.has("notifications") ? "rotate-180" : ""
            }`}
          />
        </button>

        {expandedSections.has("notifications") && (
          <div className="border-t border-white/10 px-6 py-4 space-y-6">
            {/* Daily Brief Time */}
            <div>
              <label className="text-foreground font-medium block mb-2">Daily Brief Time</label>
              <input
                type="time"
                value={dashboardSettings.dailyBriefTime}
                onChange={(e) => updateSetting("dailyBriefTime", e.target.value)}
                className="glass px-4 py-2 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
              />
              <p className="text-sm text-muted-foreground mt-2">When to deliver your daily executive brief</p>
            </div>

            {/* Email Notifications */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-foreground font-medium">Email Notifications</label>
                <p className="text-sm text-muted-foreground">Receive important updates via email</p>
              </div>
              <input
                type="checkbox"
                checked={dashboardSettings.emailNotifications}
                onChange={(e) => updateSetting("emailNotifications", e.target.checked)}
                className="w-6 h-6 cursor-pointer"
              />
            </div>

            {/* Slack Notifications */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-foreground font-medium">Slack Notifications</label>
                <p className="text-sm text-muted-foreground">Get alerts delivered to your Slack workspace</p>
              </div>
              <input
                type="checkbox"
                checked={dashboardSettings.slackNotifications}
                onChange={(e) => updateSetting("slackNotifications", e.target.checked)}
                className="w-6 h-6 cursor-pointer"
              />
            </div>

            {/* Refresh Interval */}
            <div>
              <label className="text-foreground font-medium block mb-2">
                Data Refresh Interval: {dashboardSettings.refreshInterval} minutes
              </label>
              <input
                type="range"
                min="1"
                max="30"
                value={dashboardSettings.refreshInterval}
                onChange={(e) => updateSetting("refreshInterval", Number.parseInt(e.target.value))}
                className="w-full"
              />
              <p className="text-sm text-muted-foreground mt-2">How often to refresh dashboard data</p>
            </div>
          </div>
        )}
      </div>

      {/* Integrations - Placeholder */}
      <div className="glass rounded-lg">
        <button
          onClick={() => toggleSection("integrations")}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors"
        >
          <div className="text-left">
            <h2 className="text-xl font-semibold text-foreground">Connected Services</h2>
            <p className="text-sm text-muted-foreground">Manage your connected applications and services</p>
          </div>
          <ChevronDown
            className={`w-5 h-5 text-muted-foreground transition-transform ${
              expandedSections.has("integrations") ? "rotate-180" : ""
            }`}
          />
        </button>

        {expandedSections.has("integrations") && (
          <div className="border-t border-white/10 px-6 py-4 space-y-4">
            <div className="text-muted-foreground">No integrations connected yet</div>
            <button className="glass px-4 py-2 rounded-lg text-accent hover:bg-white/10 transition-colors">
              + Add Integration
            </button>
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="flex gap-4 pt-4">
        <button className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground font-medium py-3 rounded-lg transition-colors">
          Save Settings
        </button>
        <button className="flex-1 glass hover:bg-white/10 text-foreground font-medium py-3 rounded-lg transition-colors">
          Reset to Default
        </button>
      </div>
    </div>
  )
}
