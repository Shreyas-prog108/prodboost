"use client"

import { useState } from "react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TrendingUp, Clock, Zap, Target } from "lucide-react"

export function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState("week")

  // Productivity trend data
  const productivityData = [
    { day: "Mon", productivity: 78, meetings: 4, focus: 6 },
    { day: "Tue", productivity: 85, meetings: 5, focus: 7 },
    { day: "Wed", productivity: 72, meetings: 6, focus: 5 },
    { day: "Thu", productivity: 88, meetings: 3, focus: 8 },
    { day: "Fri", productivity: 82, meetings: 2, focus: 9 },
    { day: "Sat", productivity: 65, meetings: 1, focus: 4 },
    { day: "Sun", productivity: 70, meetings: 0, focus: 5 },
  ]

  // Time allocation data
  const timeAllocationData = [
    { name: "Deep Work", value: 32, color: "#06b6d4" },
    { name: "Meetings", value: 28, color: "#a855f7" },
    { name: "Email", value: 18, color: "#f59e0b" },
    { name: "Admin", value: 12, color: "#64748b" },
    { name: "Breaks", value: 10, color: "#10b981" },
  ]

  // Focus hours data
  const focusHoursData = [
    { time: "6-9 AM", hours: 2.5, productive: true },
    { time: "9-12 PM", hours: 2.0, productive: true },
    { time: "12-3 PM", hours: 0.5, productive: false },
    { time: "3-6 PM", hours: 1.5, productive: true },
    { time: "6-9 PM", hours: 0.3, productive: false },
  ]

  // Meeting patterns
  const meetingPatternsData = [
    { hour: "8-9", count: 1 },
    { hour: "9-10", count: 3 },
    { hour: "10-11", count: 2 },
    { hour: "11-12", count: 2 },
    { hour: "1-2", count: 2 },
    { hour: "2-3", count: 1 },
  ]

  const metrics = [
    {
      icon: TrendingUp,
      label: "Productivity Score",
      value: "82/100",
      change: "+5%",
      trend: "up",
    },
    {
      icon: Clock,
      label: "Focus Time",
      value: "6.5h",
      change: "+1.2h",
      trend: "up",
    },
    {
      icon: Zap,
      label: "Energy Level",
      value: "8.2/10",
      change: "-0.3",
      trend: "down",
    },
    {
      icon: Target,
      label: "Goals Completed",
      value: "7/10",
      change: "+2",
      trend: "up",
    },
  ]

  return (
    <div className="w-full max-h-screen overflow-y-auto bg-gradient-to-br from-slate-950 via-purple-950/50 to-slate-950 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics & Productivity</h1>
          <p className="text-muted-foreground mt-1">Track your work patterns and optimize your schedule</p>
        </div>

        {/* Time Range Selector */}
        <div className="glass rounded-lg p-1 flex gap-2">
          {["week", "month", "quarter"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg capitalize text-sm font-medium transition-all ${
                timeRange === range
                  ? "bg-purple-500/30 text-purple-200 border border-purple-500/50"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, idx) => {
          const Icon = metric.icon
          return (
            <div key={idx} className="glass rounded-lg p-4 border border-white/10">
              <div className="flex items-start justify-between mb-4">
                <Icon className="w-6 h-6 text-cyan-400" />
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    metric.trend === "up" ? "bg-green-500/20 text-green-300" : "bg-orange-500/20 text-orange-300"
                  }`}
                >
                  {metric.change}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-1">{metric.label}</p>
              <p className="text-2xl font-bold text-foreground">{metric.value}</p>
            </div>
          )
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Productivity Trend */}
        <div className="glass rounded-lg p-6 border border-white/10">
          <h2 className="text-lg font-semibold text-foreground mb-4">Weekly Productivity Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={productivityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="day" stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(0,0,0,0.8)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="productivity" stroke="#06b6d4" strokeWidth={2} dot={{ fill: "#06b6d4" }} />
              <Line type="monotone" dataKey="focus" stroke="#a855f7" strokeWidth={2} dot={{ fill: "#a855f7" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Time Allocation */}
        <div className="glass rounded-lg p-6 border border-white/10">
          <h2 className="text-lg font-semibold text-foreground mb-4">Time Allocation (This Week)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={timeAllocationData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {timeAllocationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(0,0,0,0.8)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {timeAllocationData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-muted-foreground">{item.name}</span>
                </div>
                <span className="text-foreground font-semibold">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Meeting Patterns */}
        <div className="glass rounded-lg p-6 border border-white/10">
          <h2 className="text-lg font-semibold text-foreground mb-4">Meeting Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={meetingPatternsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="hour" stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(0,0,0,0.8)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="count" fill="#a855f7" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Focus Hours Analysis */}
        <div className="glass rounded-lg p-6 border border-white/10">
          <h2 className="text-lg font-semibold text-foreground mb-4">Peak Focus Hours</h2>
          <div className="space-y-3">
            {focusHoursData.map((item) => (
              <div key={item.time}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-foreground">{item.time}</span>
                  <span className="text-sm text-muted-foreground">{item.hours}h</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      item.productive ? "bg-gradient-to-r from-cyan-500 to-purple-500" : "bg-orange-500/50"
                    }`}
                    style={{ width: `${(item.hours / 2.5) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Insights & Recommendations */}
      <div className="glass rounded-lg p-6 border border-white/10">
        <h2 className="text-lg font-semibold text-foreground mb-4">AI Insights & Recommendations</h2>
        <div className="space-y-3">
          {[
            {
              insight: "Your peak productivity is between 9-12 AM. Schedule critical tasks during this window.",
              icon: "💡",
            },
            {
              insight: "You have 28% of your time in meetings. Consider batch-scheduling meetings on specific days.",
              icon: "📊",
            },
            {
              insight: "Email takes 18% of your time. Our triage system can reduce this by 40%.",
              icon: "✉️",
            },
            {
              insight: "You completed 70% of weekly goals. Focus on 3 high-impact items this week.",
              icon: "🎯",
            },
          ].map((item, idx) => (
            <div key={idx} className="flex gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
              <span className="text-xl">{item.icon}</span>
              <p className="text-sm text-foreground">{item.insight}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
