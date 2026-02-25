"use client"

import { useState, useEffect } from "react"
import { tasksApi, type Task, type TaskStatus } from "@/lib/api"

interface TaskManagerProps {
  /** When true, render a full-page view with more space */
  fullPage?: boolean
}

export function TaskManager({ fullPage = false }: TaskManagerProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [isAdding, setIsAdding] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await tasksApi.list()
      if (response.success) {
        setTasks(response.data)
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load tasks"
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  const addTask = async () => {
    if (!newTaskTitle.trim()) return
    setIsAdding(true)
    try {
      const response = await tasksApi.create({ title: newTaskTitle.trim() })
      if (response.success) {
        setTasks((prev) => [...prev, response.data])
        setNewTaskTitle("")
        setShowAddForm(false)
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to create task"
      setError(message)
    } finally {
      setIsAdding(false)
    }
  }

  const toggleTask = async (task: Task) => {
    const nextStatus: TaskStatus =
      task.status === "DONE" ? "TODO" : "DONE"
    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, status: nextStatus } : t))
    )
    try {
      await tasksApi.update(task.id, { status: nextStatus })
    } catch {
      // Revert on failure
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, status: task.status } : t))
      )
    }
  }

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case "TODO":
        return "bg-amber-500"
      case "IN_PROGRESS":
        return "bg-cyan-500"
      case "DONE":
        return "bg-emerald-500"
      default:
        return "bg-slate-500"
    }
  }

  const completedCount = tasks.filter((t) => t.status === "DONE").length
  const pendingCount = tasks.filter((t) => t.status !== "DONE").length
  const inProgressCount = tasks.filter((t) => t.status === "IN_PROGRESS").length

  const containerClass = fullPage
    ? "glass-dark p-8 rounded-2xl space-y-4 max-w-3xl mx-auto"
    : "glass-dark p-6 rounded-2xl space-y-4"

  return (
    <div className={containerClass}>
      <div className="flex items-center justify-between mb-6">
        <h3 className={`font-bold text-white ${fullPage ? "text-2xl" : "text-lg"}`}>
          Smart Tasks
        </h3>
        <button
          onClick={() => setShowAddForm((v) => !v)}
          className="text-xs px-2 py-1 rounded bg-purple-500/30 text-purple-300 hover:bg-purple-500/40 transition-colors"
        >
          + Add Task
        </button>
      </div>

      {/* Add task form */}
      {showAddForm && (
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            placeholder="Task title..."
            className="flex-1 px-3 py-2 text-sm bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-purple-500/50"
            autoFocus
          />
          <button
            onClick={addTask}
            disabled={isAdding || !newTaskTitle.trim()}
            className="px-3 py-2 bg-purple-500/40 hover:bg-purple-500/60 text-white text-sm rounded-lg disabled:opacity-50 transition-colors"
          >
            {isAdding ? "..." : "Add"}
          </button>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
          {error}
          <button onClick={fetchTasks} className="ml-2 underline">
            Retry
          </button>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 bg-white/5 rounded-lg animate-pulse" />
          ))}
        </div>
      )}

      {/* Task list */}
      {!isLoading && !error && (
        <div className={`space-y-2 overflow-y-auto ${fullPage ? "max-h-[600px]" : "max-h-96"}`}>
          {tasks.length === 0 ? (
            <p className="text-sm text-slate-400 py-4 text-center">No tasks yet. Add one above.</p>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className={`p-3 rounded-lg flex items-center gap-3 cursor-pointer transition-all hover:bg-white/10 ${
                  task.status === "DONE" ? "opacity-50" : ""
                }`}
              >
                <button
                  onClick={() => toggleTask(task)}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                    task.status === "DONE"
                      ? "bg-emerald-500 border-emerald-500"
                      : "border-slate-500 hover:border-slate-400"
                  }`}
                >
                  {task.status === "DONE" && (
                    <span className="text-white text-xs">✓</span>
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-medium ${
                      task.status === "DONE"
                        ? "line-through text-slate-500"
                        : "text-white"
                    }`}
                  >
                    {task.title}
                  </p>
                  {task.description && (
                    <p className="text-xs text-slate-400 truncate">{task.description}</p>
                  )}
                  {task.due_date && (
                    <p className="text-xs text-slate-500">
                      Due: {new Date(task.due_date).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${getStatusColor(task.status)}`} />
              </div>
            ))
          )}
        </div>
      )}

      {/* Footer stats */}
      {!isLoading && (
        <div className="pt-4 border-t border-white/10 space-y-1">
          <p className="text-xs text-slate-400">
            <span className="font-semibold text-emerald-400">{completedCount}</span> done ·{" "}
            <span className="font-semibold text-amber-400">{pendingCount} pending</span>
            {inProgressCount > 0 && (
              <>
                {" "}· <span className="font-semibold text-cyan-400">{inProgressCount} in progress</span>
              </>
            )}
          </p>
        </div>
      )}
    </div>
  )
}
