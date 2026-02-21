"use client"

import { useState } from "react"
import { Search, Download, Share2, ExternalLink, TrendingUp, Clock } from "lucide-react"

interface ResearchResult {
  id: string
  title: string
  source: string
  relevance: number
  date: string
  summary: string
  url: string
  type: "article" | "report" | "whitepaper" | "news"
  tags: string[]
}

interface KnowledgeNode {
  id: string
  name: string
  type: "concept" | "person" | "company" | "trend"
  importance: number
  connections: string[]
  description: string
}

export function ResearchResultsPage() {
  const [searchQuery, setSearchQuery] = useState("AI in Executive Leadership")
  const [filterType, setFilterType] = useState("all")
  const [sortBy, setSortBy] = useState("relevance")

  const researchResults: ResearchResult[] = [
    {
      id: "1",
      title: "The Future of AI-Powered Executive Dashboards: Insights from Fortune 500 Leaders",
      source: "Harvard Business Review",
      relevance: 98,
      date: "2 days ago",
      summary:
        "A comprehensive study on how executives are leveraging AI to make better decisions faster. Key findings include 67% productivity increase and improved decision-making speed.",
      url: "#",
      type: "article",
      tags: ["AI", "Executive", "Productivity", "Decision Making"],
    },
    {
      id: "2",
      title: "Enterprise AI Implementation: Best Practices Report 2024",
      source: "Gartner Research",
      relevance: 95,
      date: "1 week ago",
      summary:
        "An in-depth analysis of enterprise AI adoption trends, implementation strategies, and ROI metrics. Highlights the importance of executive buy-in and change management.",
      url: "#",
      type: "report",
      tags: ["Enterprise AI", "Implementation", "ROI", "Best Practices"],
    },
    {
      id: "3",
      title: "Intelligent Automation: Reshaping the Executive Workflow",
      source: "McKinsey & Company",
      relevance: 92,
      date: "2 weeks ago",
      summary:
        "Explores how intelligent automation can transform executive workflows, reducing administrative burden by up to 40% and freeing time for strategic decisions.",
      url: "#",
      type: "whitepaper",
      tags: ["Automation", "Workflow", "Efficiency", "Strategic Planning"],
    },
    {
      id: "4",
      title: "AI-Driven Decision Making: New Era of Executive Leadership",
      source: "Forbes",
      relevance: 88,
      date: "3 days ago",
      summary:
        "News coverage of how leading executives are using AI assistants to handle routine tasks and focus on high-impact strategic decisions.",
      url: "#",
      type: "news",
      tags: ["AI", "Leadership", "Strategy", "Decision Making"],
    },
    {
      id: "5",
      title: "The Business Value of Intelligent Executive Assistants",
      source: "Deloitte Insights",
      relevance: 85,
      date: "1 month ago",
      summary:
        "Quantifies the business impact of AI-powered executive assistants including time savings, improved focus, and better outcomes in key initiatives.",
      url: "#",
      type: "report",
      tags: ["Executive Assistants", "AI", "Business Value", "ROI"],
    },
  ]

  const knowledgeGraph: KnowledgeNode[] = [
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
    {
      id: "6",
      name: "Analytics",
      type: "concept",
      importance: 7,
      connections: ["2", "5"],
      description: "Data analysis for insights and reporting",
    },
    {
      id: "7",
      name: "Email Management",
      type: "concept",
      importance: 6,
      connections: ["3", "4"],
      description: "Email organization and prioritization",
    },
    {
      id: "8",
      name: "Calendar Optimization",
      type: "concept",
      importance: 6,
      connections: ["3", "9"],
      description: "Meeting scheduling and time management",
    },
    {
      id: "9",
      name: "Focus Time",
      type: "concept",
      importance: 7,
      connections: ["4", "8"],
      description: "Uninterrupted time for deep work",
    },
    {
      id: "10",
      name: "Enterprise Implementation",
      type: "concept",
      importance: 8,
      connections: ["5", "1"],
      description: "Deploying AI across the organization",
    },
  ]

  const filteredResults = researchResults.filter((result) => {
    if (filterType === "all") return true
    return result.type === filterType
  })

  const sortedResults = [...filteredResults].sort((a, b) => {
    if (sortBy === "relevance") return b.relevance - a.relevance
    if (sortBy === "date") return new Date(b.date).getTime() - new Date(a.date).getTime()
    return 0
  })

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/50 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Research Results</h1>
          <p className="text-muted-foreground">AI-curated insights and knowledge connections for your research</p>
        </div>

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
                placeholder="Search research topics..."
              />
            </div>
            <button className="px-6 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 rounded-lg text-white font-medium transition-all">
              Search
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Research Results */}
          <div className="lg:col-span-2 space-y-4">
            {/* Filter and Sort */}
            <div className="glass rounded-lg p-4 flex gap-4 flex-wrap">
              <div>
                <label className="text-sm text-muted-foreground block mb-2">Type</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="glass px-3 py-2 rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                >
                  <option value="all">All Types</option>
                  <option value="article">Articles</option>
                  <option value="report">Reports</option>
                  <option value="whitepaper">Whitepapers</option>
                  <option value="news">News</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-muted-foreground block mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="glass px-3 py-2 rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                >
                  <option value="relevance">Relevance</option>
                  <option value="date">Most Recent</option>
                </select>
              </div>
            </div>

            {/* Results List */}
            <div className="space-y-4">
              {sortedResults.map((result) => (
                <div
                  key={result.id}
                  className="glass rounded-lg p-5 border border-white/10 hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-foreground hover:text-cyan-400 cursor-pointer transition-colors">
                          {result.title}
                        </h3>
                        <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 capitalize">
                          {result.type}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{result.source}</p>
                      <p className="text-foreground mb-3">{result.summary}</p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {result.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Relevance Score */}
                    <div className="text-right flex-shrink-0">
                      <div className="text-2xl font-bold text-cyan-400">{result.relevance}%</div>
                      <p className="text-xs text-muted-foreground">Relevance</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/10">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {result.date}
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                        <Share2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                        <Download className="w-4 h-4" />
                      </button>
                      <a
                        href={result.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-cyan-400 hover:text-cyan-300"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Knowledge Graph Sidebar */}
          <div className="glass rounded-lg p-6 border border-white/10 h-fit sticky top-6">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              Knowledge Graph
            </h2>

            <p className="text-xs text-muted-foreground mb-4">Related concepts and their importance in your research</p>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {knowledgeGraph
                .sort((a, b) => b.importance - a.importance)
                .slice(0, 8)
                .map((node) => (
                  <div
                    key={node.id}
                    className="p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <p className="font-medium text-foreground text-sm">{node.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">{node.type}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="flex gap-0.5">
                          {[...Array(node.importance)].map((_, i) => (
                            <div key={i} className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">{node.description}</p>
                    <div className="mt-2 flex gap-1 flex-wrap">
                      {node.connections.slice(0, 2).map((connId) => {
                        const conn = knowledgeGraph.find((n) => n.id === connId)
                        return (
                          <span
                            key={connId}
                            className="text-xs px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30"
                          >
                            → {conn?.name}
                          </span>
                        )
                      })}
                      {node.connections.length > 2 && (
                        <span className="text-xs text-muted-foreground">+{node.connections.length - 2} more</span>
                      )}
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
