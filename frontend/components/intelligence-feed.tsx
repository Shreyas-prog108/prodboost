"use client"

import { useState } from "react"

export function IntelligenceFeed() {
  const [activeTab, setActiveTab] = useState("news")

  const tabs = ["News", "Competitors", "Trends"]

  const items = [
    { title: "Tech Industry Report Q4", source: "📰", relevance: 5, snippet: "Latest developments in AI market" },
    {
      title: "Market Analysis: SPY Performance",
      source: "📊",
      relevance: 5,
      snippet: "S&P 500 continues upward trend",
    },
    { title: "Competitor Activity Update", source: "🔍", relevance: 4, snippet: "3 new product launches this week" },
    {
      title: "Industry Trend: AI Adoption",
      source: "🚀",
      relevance: 5,
      snippet: "Enterprise AI spending increased 34%",
    },
  ]

  return (
    <div className="glass-dark p-6 rounded-2xl space-y-4">
      <h3 className="text-lg font-bold text-white mb-4">Intelligence Feed</h3>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 border-b border-white/10 pb-3">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab.toLowerCase())}
            className={`text-xs font-medium px-3 py-2 rounded transition-all ${
              activeTab === tab.toLowerCase()
                ? "text-cyan-300 border-b-2 border-cyan-400 -mb-3"
                : "text-slate-400 hover:text-slate-300"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Items */}
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {items.slice(0, 3).map((item, idx) => (
          <div key={idx} className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all cursor-pointer group">
            <div className="flex items-start gap-3">
              <span className="text-lg flex-shrink-0">{item.source}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
                  {item.title}
                </p>
                <p className="text-xs text-slate-400 mt-1">{item.snippet}</p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                {[...Array(item.relevance)].map((_, i) => (
                  <span key={i} className="text-xs text-amber-400">
                    ★
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-white/10">
        <button className="text-xs text-cyan-400 hover:text-cyan-300 font-medium">View All →</button>
      </div>
    </div>
  )
}
