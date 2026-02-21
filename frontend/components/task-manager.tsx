"use client"

import { useState } from "react"

export function TaskManager() {
  const [tasks, setTasks] = useState([
    { id: 1, title: "Review Q4 budget", priority: "urgent", category: "work", completed: false },
    { id: 2, title: "Approve team requests", priority: "high", category: "delegated", completed: false },
    { id: 3, title: "Prepare presentation", priority: "high", category: "work", completed: false },
    { id: 4, title: "Follow up with vendors", priority: "medium", category: "waiting", completed: false },
  ])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500"
      case "high":
        return "bg-amber-500"
      case "medium":
        return "bg-cyan-500"
      default:
        return "bg-emerald-500"
    }
  }

  const toggleTask = (id: number) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)))
  }

  return (
    <div className="glass-dark p-6 rounded-2xl space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white">Smart Tasks</h3>
        <button className="text-xs px-2 py-1 rounded bg-purple-500/30 text-purple-300 hover:bg-purple-500/40 transition-colors">
          + Add Task
        </button>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`p-3 rounded-lg flex items-center gap-3 cursor-pointer transition-all hover:bg-white/10 ${
              task.completed ? "opacity-50" : ""
            }`}
          >
            <button
              onClick={() => toggleTask(task.id)}
              className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                task.completed ? "bg-emerald-500 border-emerald-500" : "border-slate-500 hover:border-slate-400"
              }`}
            >
              {task.completed && <span className="text-white text-xs">✓</span>}
            </button>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${task.completed ? "line-through text-slate-500" : "text-white"}`}>
                {task.title}
              </p>
            </div>
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${getPriorityColor(task.priority)}`}></div>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-white/10 space-y-1">
        <p className="text-xs text-slate-400">
          <span className="font-semibold text-emerald-400">3</span> tasks ·{" "}
          <span className="font-semibold text-amber-400">2 urgent</span>
        </p>
      </div>
    </div>
  )
}
