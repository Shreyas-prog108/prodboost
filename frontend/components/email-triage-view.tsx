"use client"

import { useState } from "react"
import {
  Mail,
  Star,
  Archive,
  Trash2,
  Reply,
  Forward,
  MoreVertical,
  AlertCircle,
  Clock,
  LinkIcon,
  Tag,
} from "lucide-react"

interface Email {
  id: string
  from: string
  senderRole?: string
  subject: string
  preview: string
  body: string
  timestamp: string
  priority: "critical" | "high" | "normal" | "low"
  tags: string[]
  hasAttachment: boolean
  isRead: boolean
  starred: boolean
  category: "inbox" | "urgent" | "follow_up" | "archived" | "trash"
}

export function EmailTriageView() {
  const [emails, setEmails] = useState<Email[]>([
    {
      id: "1",
      from: "Sarah Chen",
      senderRole: "Board Member",
      subject: "Q4 Strategic Initiative Review - Urgent",
      preview: "Please review the attached proposal before our board meeting tomorrow at 2 PM...",
      body: "Please review the attached proposal before our board meeting tomorrow at 2 PM. The strategic initiative requires your approval on three key areas: market expansion, technology investments, and talent allocation.",
      timestamp: "2 hours ago",
      priority: "critical",
      tags: ["board", "strategic", "urgent"],
      hasAttachment: true,
      isRead: false,
      starred: true,
      category: "inbox",
    },
    {
      id: "2",
      from: "James Wilson",
      senderRole: "VP of Operations",
      subject: "Weekly Operations Report",
      preview: "This week we achieved 98% efficiency target and resolved 3 critical system issues...",
      body: "This week we achieved 98% efficiency target and resolved 3 critical system issues. Overall team performance is excellent. Please see attached report for detailed metrics.",
      timestamp: "4 hours ago",
      priority: "high",
      tags: ["operations", "report"],
      hasAttachment: true,
      isRead: true,
      starred: false,
      category: "inbox",
    },
    {
      id: "3",
      from: "Emily Rodriguez",
      senderRole: "Marketing Lead",
      subject: "Campaign Performance Metrics",
      preview: "Our latest campaign exceeded all KPIs - 45% increase in engagement...",
      body: "Our latest campaign exceeded all KPIs - 45% increase in engagement and 32% in conversions. ROI is tracking 15% above projections.",
      timestamp: "1 day ago",
      priority: "normal",
      tags: ["marketing", "performance"],
      hasAttachment: false,
      isRead: true,
      starred: true,
      category: "inbox",
    },
    {
      id: "4",
      from: "David Park",
      senderRole: "Team Member",
      subject: "Time-off Request",
      preview: "I would like to request time off from Dec 15-22 for personal matters...",
      body: "I would like to request time off from Dec 15-22 for personal matters. I have arranged coverage for my responsibilities.",
      timestamp: "2 days ago",
      priority: "low",
      tags: ["hr", "requests"],
      hasAttachment: false,
      isRead: true,
      starred: false,
      category: "inbox",
    },
  ])

  const [selectedEmail, setSelectedEmail] = useState<Email>(emails[0])
  const [filter, setFilter] = useState<"all" | "unread" | "starred" | "urgent">("all")

  const filteredEmails = emails.filter((email) => {
    if (filter === "unread") return !email.isRead
    if (filter === "starred") return email.starred
    if (filter === "urgent") return email.priority === "critical" || email.priority === "high"
    return true
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-500/20 border-red-500/50 text-red-300"
      case "high":
        return "bg-orange-500/20 border-orange-500/50 text-orange-300"
      case "normal":
        return "bg-cyan-500/20 border-cyan-500/50 text-cyan-300"
      case "low":
        return "bg-gray-500/20 border-gray-500/50 text-gray-300"
      default:
        return ""
    }
  }

  const toggleStarred = (emailId: string) => {
    setEmails(emails.map((e) => (e.id === emailId ? { ...e, starred: !e.starred } : e)))
  }

  const markAsRead = (emailId: string) => {
    setEmails(emails.map((e) => (e.id === emailId ? { ...e, isRead: true } : e)))
  }

  const archiveEmail = (emailId: string) => {
    setEmails(emails.map((e) => (e.id === emailId ? { ...e, category: "archived" } : e)))
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Header */}
      <header className="glass-dark border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Mail className="w-6 h-6 text-purple-400" />
          <h1 className="text-2xl font-bold text-foreground">Smart Email Triage</h1>
        </div>
        <div className="text-sm text-muted-foreground">
          {filteredEmails.filter((e) => !e.isRead).length} unread messages
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Email List */}
        <div className="w-96 border-r border-white/10 flex flex-col bg-slate-900/50">
          {/* Filter Tabs */}
          <div className="glass-dark border-b px-4 py-3 flex gap-2">
            {["all", "unread", "starred", "urgent"].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab as any)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors capitalize ${
                  filter === tab
                    ? "bg-purple-500/30 text-purple-200 border border-purple-500/50"
                    : "bg-white/10 text-muted-foreground hover:bg-white/15"
                }`}
              >
                {tab === "all" ? "All" : tab === "unread" ? "Unread" : tab === "starred" ? "Starred" : "Urgent"}
              </button>
            ))}
          </div>

          {/* Email List Items */}
          <div className="flex-1 overflow-y-auto">
            {filteredEmails.map((email) => (
              <button
                key={email.id}
                onClick={() => {
                  setSelectedEmail(email)
                  markAsRead(email.id)
                }}
                className={`w-full text-left p-4 border-b border-white/10 transition-all hover:bg-white/5 ${
                  selectedEmail.id === email.id ? "bg-purple-500/10 border-l-2 border-l-purple-500" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <p
                      className={`font-semibold truncate ${email.isRead ? "text-muted-foreground" : "text-foreground"}`}
                    >
                      {email.from}
                    </p>
                    <p className="text-xs text-muted-foreground">{email.senderRole}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleStarred(email.id)
                    }}
                    className="text-muted-foreground hover:text-yellow-400 transition-colors"
                  >
                    <Star className={`w-4 h-4 ${email.starred ? "fill-current text-yellow-400" : ""}`} />
                  </button>
                </div>

                <p
                  className={`text-sm truncate mb-1 ${email.isRead ? "text-muted-foreground" : "text-foreground font-medium"}`}
                >
                  {email.subject}
                </p>

                <p className="text-xs text-muted-foreground truncate mb-2">{email.preview}</p>

                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(email.priority)}`}>
                    {email.priority.charAt(0).toUpperCase() + email.priority.slice(1)}
                  </span>
                  {email.hasAttachment && <span className="text-xs text-cyan-400">📎 Attachment</span>}
                  {!email.isRead && <span className="w-2 h-2 rounded-full bg-purple-400"></span>}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Email Detail View */}
        <div className="flex-1 flex flex-col overflow-hidden bg-gradient-to-br from-slate-950 via-purple-950/50 to-slate-950">
          {/* Detail Header */}
          <div className="glass-dark border-b px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-foreground">{selectedEmail.subject}</h2>
              <p className="text-sm text-muted-foreground mt-1">From {selectedEmail.from}</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <Star
                  className={`w-5 h-5 ${selectedEmail.starred ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                />
              </button>
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <MoreVertical className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Email Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Sender Info Card */}
            <div className="glass rounded-lg p-4 border border-white/10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                  {selectedEmail.from
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{selectedEmail.from}</p>
                  <p className="text-sm text-muted-foreground">{selectedEmail.senderRole}</p>
                </div>
              </div>
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-2 gap-4">
              <div className="glass rounded-lg p-4 border border-white/10 flex items-center gap-3">
                <Clock className="w-5 h-5 text-cyan-400" />
                <div>
                  <p className="text-xs text-muted-foreground">Received</p>
                  <p className="text-sm text-foreground">{selectedEmail.timestamp}</p>
                </div>
              </div>
              <div className="glass rounded-lg p-4 border border-white/10 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-orange-400" />
                <div>
                  <p className="text-xs text-muted-foreground">Priority</p>
                  <p className="text-sm text-foreground capitalize">{selectedEmail.priority}</p>
                </div>
              </div>
            </div>

            {/* Email Body */}
            <div className="glass rounded-lg p-6 border border-white/10">
              <p className="text-foreground leading-relaxed">{selectedEmail.body}</p>
            </div>

            {/* Tags */}
            {selectedEmail.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedEmail.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-sm bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-2"
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Attachments */}
            {selectedEmail.hasAttachment && (
              <div className="glass rounded-lg p-4 border border-white/10">
                <p className="text-sm font-semibold text-foreground mb-3">Attachments</p>
                <div className="space-y-2">
                  {["proposal.pdf", "metrics.xlsx"].map((file) => (
                    <a
                      key={file}
                      href="#"
                      className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors"
                    >
                      <LinkIcon className="w-4 h-4 text-cyan-400" />
                      <span className="text-sm text-foreground">{file}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="glass-dark border-t px-6 py-4 flex items-center justify-between">
            <div className="flex gap-2">
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                <Reply className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                <Forward className="w-5 h-5" />
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => archiveEmail(selectedEmail.id)}
                className="px-4 py-2 glass hover:bg-white/10 rounded-lg text-foreground transition-colors"
              >
                <Archive className="w-5 h-5" />
              </button>
              <button className="px-4 py-2 glass hover:bg-white/10 rounded-lg text-foreground transition-colors">
                <Trash2 className="w-5 h-5" />
              </button>
              <button className="px-4 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 rounded-lg text-white font-medium transition-all">
                Mark as Follow-up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
