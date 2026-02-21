"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface DayData {
  date: number
  month: number
  year: number
  intensity: number // 0-5 (0 = no events, 5 = very busy)
  events: number
  meetings: number
  tasks: number
  description: string
}

export function CalendarHeatmapView() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 11, 14))

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  // Generate mock heatmap data
  const generateHeatmapData = (): DayData[] => {
    const daysInMonth = getDaysInMonth(currentDate)
    const days: DayData[] = []

    for (let day = 1; day <= daysInMonth; day++) {
      const intensity = Math.floor(Math.random() * 6)
      const meetings = Math.floor(Math.random() * 5)
      const tasks = Math.floor(Math.random() * 8)

      days.push({
        date: day,
        month: currentDate.getMonth(),
        year: currentDate.getFullYear(),
        intensity,
        events: meetings + tasks,
        meetings,
        tasks,
        description: `${meetings} meetings, ${tasks} tasks`,
      })
    }
    return days
  }

  const heatmapData = generateHeatmapData()
  const firstDay = getFirstDayOfMonth(currentDate)
  const daysInMonth = getDaysInMonth(currentDate)

  const getIntensityColor = (intensity: number) => {
    switch (intensity) {
      case 0:
        return "bg-slate-700 hover:bg-slate-600"
      case 1:
        return "bg-cyan-900 hover:bg-cyan-800"
      case 2:
        return "bg-cyan-700 hover:bg-cyan-600"
      case 3:
        return "bg-cyan-500 hover:bg-cyan-400"
      case 4:
        return "bg-purple-600 hover:bg-purple-500"
      case 5:
        return "bg-purple-500 hover:bg-purple-400"
      default:
        return "bg-slate-800"
    }
  }

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const monthName = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <div className="w-full max-w-5xl mx-auto p-6 space-y-6 bg-gradient-to-br from-slate-950 via-purple-950/50 to-slate-950 rounded-xl min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Calendar Heatmap</h1>
        <p className="text-muted-foreground">Visualize your workload and productivity patterns across the month</p>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between glass rounded-lg p-4">
        <button
          onClick={previousMonth}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-2xl font-bold text-foreground min-w-48 text-center">{monthName}</h2>
        <button
          onClick={nextMonth}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors text-muted-foreground hover:text-foreground"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="glass rounded-lg p-6 space-y-4">
        {/* Week Day Headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {weekDays.map((day) => (
            <div key={day} className="text-center text-sm font-semibold text-muted-foreground py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2">
          {/* Empty cells for days before month starts */}
          {Array.from({ length: firstDay }).map((_, idx) => (
            <div key={`empty-${idx}`} className="aspect-square"></div>
          ))}

          {/* Days of month */}
          {heatmapData.map((day) => (
            <div
              key={day.date}
              className={`aspect-square rounded-lg p-2 cursor-pointer transition-all transform hover:scale-105 ${getIntensityColor(day.intensity)} group relative`}
            >
              <div className="h-full flex flex-col justify-between">
                <span className="text-sm font-semibold text-white">{day.date}</span>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-white/80">{day.events}</span>
                  <div className="w-1 h-1 rounded-full bg-white/60"></div>
                </div>
              </div>

              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                <div className="glass rounded-lg p-3 whitespace-nowrap text-xs">
                  <p className="font-semibold text-foreground">{day.description}</p>
                  <p className="text-muted-foreground mt-1">Intensity: {day.intensity}/5</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="border-t border-white/10 pt-4 mt-4">
          <p className="text-sm font-semibold text-foreground mb-3">Intensity Legend</p>
          <div className="flex items-center gap-4 flex-wrap">
            {[
              { intensity: 0, label: "None" },
              { intensity: 1, label: "Low" },
              { intensity: 2, label: "Moderate" },
              { intensity: 3, label: "High" },
              { intensity: 4, label: "Very High" },
              { intensity: 5, label: "Critical" },
            ].map(({ intensity, label }) => (
              <div key={intensity} className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded ${getIntensityColor(intensity)}`}></div>
                <span className="text-sm text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Events</p>
          <p className="text-3xl font-bold text-cyan-400">{heatmapData.reduce((sum, d) => sum + d.events, 0)}</p>
        </div>
        <div className="glass rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Meetings</p>
          <p className="text-3xl font-bold text-purple-400">{heatmapData.reduce((sum, d) => sum + d.meetings, 0)}</p>
        </div>
        <div className="glass rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Tasks</p>
          <p className="text-3xl font-bold text-cyan-300">{heatmapData.reduce((sum, d) => sum + d.tasks, 0)}</p>
        </div>
        <div className="glass rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Busiest Day</p>
          <p className="text-3xl font-bold text-orange-400">
            {Math.max(...heatmapData.map((d) => d.date))} ({Math.max(...heatmapData.map((d) => d.events))} items)
          </p>
        </div>
      </div>

      {/* Weekly Breakdown */}
      <div className="glass rounded-lg p-6">
        <h3 className="text-xl font-semibold text-foreground mb-4">Weekly Breakdown</h3>
        <div className="space-y-3">
          {[
            { week: "Week 1", workload: 60, meetings: 4, tasks: 12 },
            { week: "Week 2", workload: 75, meetings: 5, tasks: 15 },
            { week: "Week 3", workload: 45, meetings: 3, tasks: 9 },
            { week: "Week 4", workload: 80, meetings: 6, tasks: 18 },
          ].map(({ week, workload, meetings, tasks }) => (
            <div key={week}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-foreground">{week}</span>
                <span className="text-sm text-muted-foreground">
                  {meetings}m, {tasks}t
                </span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all"
                  style={{ width: `${workload}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
