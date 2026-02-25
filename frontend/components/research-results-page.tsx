"use client"

import { useState, useEffect } from "react"
import { Search, Download, Share2, ExternalLink, TrendingUp, Clock, Plus, X } from "lucide-react"
import { researchApi, type ResearchProject } from "@/lib/api"

interface KnowledgeNode {
  id: string
  name: string
  type: "concept" | "person" | "company" | "trend"
  importance: number
  connections: string[]
  description: string
}

const DEFAULT_KNOWLEDGE_GRAPH: KnowledgeNode[] = [
  {
    id: "1",
    name: "Executive AI",
    type: "concept",
    importance: 10,
    connections: ["2", "3", "4"],
    description: "AI systems designed for executive decision support and workflow optimization",
  },
  {
    id: "2",
    name: "Decision Making",
    type: "concept",
    importance: 9,
    connections: ["1", "5", "6"],
    description: "Strategic and tactical decisions made by business leaders",
  },
  {
    id: "3",
    name: "Productivity",
    type: "concept",
    importance: 8,
    connections: ["1", "7", "8"],
    description: "Efficiency and output of executive work",
  },
  {
    id: "4",
    name: "Automation",
    type: "concept",
    importance: 8,
    connections: ["1", "3", "9"],
    description: "Automated handling of routine tasks",
  },
  {
    id: "5",
    name: "Strategy",
    type: "concept",
    importance: 9,
    connections: ["2", "10"],
    description: "Long-term business planning and direction",
  },
]

export function ResearchResultsPage() {
  // ── Projects state ────────────────────────────────────────────────────────
  const [projects, setProjects] = useState<ResearchProject[]>([])
  const [isLoadingProjects, setIsLoadingProjects] = useState(true)
  const [projectsError, setProjectsError] = useState<string | null>(null)
  const [selectedProject, setSelectedProject] = useState<ResearchProject | null>(null)

  // ── New project form ──────────────────────────────────────────────────────
  const [showNewProject, setShowNewProject] = useState(false)
  const [newProjectTitle, setNewProjectTitle] = useState("")
  const [newProjectDesc, setNewProjectDesc] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)

  // ── Add source form ───────────────────────────────────────────────────────
  const [showAddSource, setShowAddSource] = useState(false)
  const [sourceUrl, setSourceUrl] = useState("")
  const [sourceTitle, setSourceTitle] = useState("")
  const [isAddingSource, setIsAddingSource] = useState(false)
  const [sourceMsg, setSourceMsg] = useState<string | null>(null)

  // ── Generate draft ────────────────────────────────────────────────────────
  const [isGenerating, setIsGenerating] = useState(false)
  const [generateMsg, setGenerateMsg] = useState<string | null>(null)

  // ── Search/filter (local) ─────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    setIsLoadingProjects(true)
    setProjectsError(null)
    try {
      const response = await researchApi.listProjects()
      if (response.success) {
        setProjects(response.data)
        if (response.data.length > 0 && !selectedProject) {
          setSelectedProject(response.data[0])
        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load research projects"
      setProjectsError(message)
    } finally {
      setIsLoadingProjects(false)
    }
  }

  const createProject = async () => {
    if (!newProjectTitle.trim()) return
    setIsCreating(true)
    setCreateError(null)
    try {
      const response = await researchApi.createProject({
        title: newProjectTitle.trim(),
        description: newProjectDesc.trim() || undefined,
      })
      if (response.success) {
        setProjects((prev) => [response.data, ...prev])
        setSelectedProject(response.data)
        setNewProjectTitle("")
        setNewProjectDesc("")
        setShowNewProject(false)
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to create project"
      setCreateError(message)
    } finally {
      setIsCreating(false)
    }
  }

  const addSource = async () => {
    if (!selectedProject || !sourceUrl.trim()) return
    setIsAddingSource(true)
    setSourceMsg(null)
    try {
      await researchApi.addSource(selectedProject.id, {
        url: sourceUrl.trim(),
        title: sourceTitle.trim() || undefined,
      })
      setSourceMsg("Source added successfully.")
      setSourceUrl("")
      setSourceTitle("")
      setShowAddSource(false)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to add source"
      setSourceMsg(message)
    } finally {
      setIsAddingSource(false)
    }
  }

  const generateDraft = async () => {
    if (!selectedProject) return
    setIsGenerating(true)
    setGenerateMsg(null)
    try {
      const response = await researchApi.generateDraft(selectedProject.id)
      if (response.success) {
        setGenerateMsg(`Draft generation queued (Job ID: ${response.data.job_id})`)
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to queue draft generation"
      setGenerateMsg(message)
    } finally {
      setIsGenerating(false)
    }
  }

  const filteredProjects = projects.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.description ?? "").toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/50 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Research Projects</h1>
            <p className="text-muted-foreground">Manage research projects, add sources, and generate AI drafts</p>
          </div>
          <button
            onClick={() => setShowNewProject((v) => !v)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 rounded-lg text-white font-medium transition-all"
          >
            <Plus className="w-4 h-4" />
            New Project
          </button>
        </div>

        {/* New Project Form */}
        {showNewProject && (
          <div className="glass rounded-lg p-6 border border-purple-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">New Research Project</h2>
              <button onClick={() => setShowNewProject(false)} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            {createError && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm">{createError}</div>
            )}
            <div>
              <label className="text-sm text-muted-foreground block mb-1">Title</label>
              <input
                type="text"
                value={newProjectTitle}
                onChange={(e) => setNewProjectTitle(e.target.value)}
                placeholder="e.g. AI in Executive Leadership"
                className="w-full px-3 py-2 glass rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground block mb-1">Description (optional)</label>
              <textarea
                value={newProjectDesc}
                onChange={(e) => setNewProjectDesc(e.target.value)}
                placeholder="Brief description of the research topic..."
                rows={3}
                className="w-full px-3 py-2 glass rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm resize-none"
              />
            </div>
            <button
              onClick={createProject}
              disabled={isCreating || !newProjectTitle.trim()}
              className="px-6 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 rounded-lg text-white font-medium transition-all disabled:opacity-50"
            >
              {isCreating ? "Creating..." : "Create Project"}
            </button>
          </div>
        )}

        {/* Search Bar */}
        <div className="glass rounded-lg p-4">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-3 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-2 glass rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                placeholder="Search research projects..."
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Projects List */}
          <div className="lg:col-span-2 space-y-4">
            {/* Loading / Error */}
            {isLoadingProjects && (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-24 glass rounded-lg animate-pulse" />
                ))}
              </div>
            )}
            {projectsError && (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
                {projectsError}
                <button onClick={fetchProjects} className="ml-2 underline">Retry</button>
              </div>
            )}

            {/* Empty state */}
            {!isLoadingProjects && !projectsError && filteredProjects.length === 0 && (
              <div className="glass rounded-lg p-8 border border-white/10 text-center">
                <p className="text-muted-foreground">
                  {projects.length === 0
                    ? "No research projects yet. Create your first project above."
                    : "No projects match your search."}
                </p>
              </div>
            )}

            {/* Project cards */}
            {!isLoadingProjects &&
              filteredProjects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  className={`glass rounded-lg p-5 border transition-colors cursor-pointer ${
                    selectedProject?.id === project.id
                      ? "border-purple-500/50 bg-purple-500/10"
                      : "border-white/10 hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground mb-1">{project.title}</h3>
                      {project.description && (
                        <p className="text-sm text-muted-foreground mb-2">{project.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-white/10">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {new Date(project.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedProject(project); setShowAddSource(true) }}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-muted-foreground hover:text-foreground text-xs px-3"
                      >
                        + Source
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedProject(project); generateDraft() }}
                        disabled={isGenerating}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-cyan-400 hover:text-cyan-300 text-xs px-3 disabled:opacity-50"
                      >
                        {isGenerating && selectedProject?.id === project.id ? "Queuing..." : "Generate Draft"}
                      </button>
                      <a
                        href="#"
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-cyan-400 hover:text-cyan-300"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}

            {/* Status messages */}
            {generateMsg && (
              <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-sm">
                {generateMsg}
              </div>
            )}
            {sourceMsg && (
              <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-sm">
                {sourceMsg}
              </div>
            )}

            {/* Add Source Form */}
            {showAddSource && selectedProject && (
              <div className="glass rounded-lg p-5 border border-cyan-500/30 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">Add Source to: {selectedProject.title}</h3>
                  <button onClick={() => setShowAddSource(false)} className="p-1 hover:bg-white/10 rounded-lg">
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground block mb-1">URL</label>
                  <input
                    type="url"
                    value={sourceUrl}
                    onChange={(e) => setSourceUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 glass rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground block mb-1">Title (optional)</label>
                  <input
                    type="text"
                    value={sourceTitle}
                    onChange={(e) => setSourceTitle(e.target.value)}
                    placeholder="Source title..."
                    className="w-full px-3 py-2 glass rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-sm"
                  />
                </div>
                <button
                  onClick={addSource}
                  disabled={isAddingSource || !sourceUrl.trim()}
                  className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 rounded-lg text-white font-medium text-sm transition-all disabled:opacity-50"
                >
                  {isAddingSource ? "Adding..." : "Add Source"}
                </button>
              </div>
            )}
          </div>

          {/* Knowledge Graph Sidebar */}
          <div className="glass rounded-lg p-6 border border-white/10 h-fit sticky top-6">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              Knowledge Graph
            </h2>
            <p className="text-xs text-muted-foreground mb-4">Related concepts and their importance in your research</p>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {DEFAULT_KNOWLEDGE_GRAPH.sort((a, b) => b.importance - a.importance).map((node) => (
                <div
                  key={node.id}
                  className="p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <p className="font-medium text-foreground text-sm">{node.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{node.type}</p>
                    </div>
                    <div className="flex gap-0.5">
                      {[...Array(Math.min(node.importance, 5))].map((_, i) => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{node.description}</p>
                  <div className="mt-2 flex gap-1 flex-wrap">
                    {node.connections.slice(0, 2).map((connId) => {
                      const conn = DEFAULT_KNOWLEDGE_GRAPH.find((n) => n.id === connId)
                      return (
                        <span
                          key={connId}
                          className="text-xs px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30"
                        >
                          → {conn?.name}
                        </span>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Export Options */}
            <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
              <button className="w-full px-3 py-2 glass hover:bg-white/10 rounded-lg text-foreground text-sm font-medium transition-colors flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                Export Report
              </button>
              <button className="w-full px-3 py-2 glass hover:bg-white/10 rounded-lg text-foreground text-sm font-medium transition-colors flex items-center justify-center gap-2">
                <Share2 className="w-4 h-4" />
                Share Insights
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
