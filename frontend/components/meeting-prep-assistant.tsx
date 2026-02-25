"use client"

import { useState } from "react"
import {
  Users,
  FileText,
  Zap,
  AlertCircle,
  Clock,
  MapPin,
  MessageSquare,
  Download,
  Share2,
  BookOpen,
  Lightbulb,
  Upload,
  X,
} from "lucide-react"
import { meetingsApi, type Meeting } from "@/lib/api"

interface PrepItem {
  id: string
  category: "research" | "context" | "talking-points" | "questions"
  title: string
  content: string
  importance: "high" | "medium" | "low"
}

// Static prep items (AI-generated content from backend would populate these in future)
const DEFAULT_PREP_ITEMS: PrepItem[] = [
  {
    id: "1",
    category: "context",
    title: "Previous Meeting Outcomes",
    content:
      "Last board meeting resulted in approval for market expansion. Board requested detailed implementation timeline by end of Q3.",
    importance: "high",
  },
  {
    id: "2",
    category: "research",
    title: "Market Analysis - Industry Trends",
    content:
      "Growth in AI-driven solutions expected to reach 35% CAGR. Competitors launching 3 new products this quarter.",
    importance: "high",
  },
  {
    id: "3",
    category: "talking-points",
    title: "Key Achievements to Highlight",
    content:
      "25% revenue growth YoY, expanded market share in Asia, successful product launch 2 weeks ahead of schedule",
    importance: "high",
  },
  {
    id: "4",
    category: "questions",
    title: "Potential Board Questions",
    content:
      "What are the risks of rapid expansion? How will we handle increased competition? What's the timeline for profitability?",
    importance: "medium",
  },
]

export function MeetingPrepAssistant() {
  // ── Upload state ──────────────────────────────────────────────────────────
  const [showUpload, setShowUpload] = useState(false)
  const [uploadTitle, setUploadTitle] = useState("")
  const [uploadTranscript, setUploadTranscript] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadedMeetings, setUploadedMeetings] = useState<Meeting[]>([])

  // ── Summarize state ───────────────────────────────────────────────────────
  const [summarizingId, setSummarizingId] = useState<string | null>(null)
  const [summarizeMessage, setSummarizeMessage] = useState<string | null>(null)

  // ── Prep view selection ───────────────────────────────────────────────────
  const [selectedMeetingIdx, setSelectedMeetingIdx] = useState(0)

  // Static fallback meetings for display when no real meetings have been uploaded
  const staticMeetings = [
    {
      id: "static-1",
      title: "Q4 Strategic Review with Board",
      time: "2:00 PM",
      duration: 90,
      location: "Boardroom A",
      organizer: "Sarah Chen (Board Member)",
      attendees: [
        { name: "Sarah Chen", role: "Board Member", avatar: "SC" },
        { name: "James Wilson", role: "VP Operations", avatar: "JW" },
        { name: "Emily Rodriguez", role: "Marketing Lead", avatar: "ER" },
      ],
      agenda: "Review Q4 performance, discuss 2025 strategy, budget allocation",
      objective: "Secure board approval for strategic initiatives",
      relatedEmails: 12,
      attachments: ["Q4_Financial_Report.pdf", "Strategic_Proposal.docx"],
    },
    {
      id: "static-2",
      title: "Product Roadmap Sync",
      time: "3:30 PM",
      duration: 60,
      location: "Conference Room B",
      organizer: "Alex Kumar (Product Manager)",
      attendees: [
        { name: "Alex Kumar", role: "Product Manager", avatar: "AK" },
        { name: "Lisa Chen", role: "Engineering Lead", avatar: "LC" },
      ],
      agenda: "Review product updates, discuss Q1 priorities, technical dependencies",
      objective: "Align on engineering roadmap and technical decisions",
      relatedEmails: 8,
      attachments: ["Product_Roadmap_2025.pdf"],
    },
  ]

  const handleUpload = async () => {
    if (!uploadTitle.trim() || !uploadTranscript.trim()) return
    setIsUploading(true)
    setUploadError(null)
    try {
      const response = await meetingsApi.upload({
        title: uploadTitle.trim(),
        transcript: uploadTranscript.trim(),
      })
      if (response.success) {
        setUploadedMeetings((prev) => [response.data, ...prev])
        setUploadTitle("")
        setUploadTranscript("")
        setShowUpload(false)
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Upload failed"
      setUploadError(message)
    } finally {
      setIsUploading(false)
    }
  }

  const handleSummarize = async (meetingId: string) => {
    setSummarizingId(meetingId)
    setSummarizeMessage(null)
    try {
      const response = await meetingsApi.summarize(meetingId)
      if (response.success) {
        setSummarizeMessage(`Summarization queued (Job ID: ${response.data.job_id})`)
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to queue summarization"
      setSummarizeMessage(message)
    } finally {
      setSummarizingId(null)
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "research":
        return <BookOpen className="w-4 h-4" />
      case "context":
        return <FileText className="w-4 h-4" />
      case "talking-points":
        return <Lightbulb className="w-4 h-4" />
      case "questions":
        return <AlertCircle className="w-4 h-4" />
      default:
        return null
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "research":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30"
      case "context":
        return "bg-cyan-500/20 text-cyan-300 border-cyan-500/30"
      case "talking-points":
        return "bg-green-500/20 text-green-300 border-green-500/30"
      case "questions":
        return "bg-orange-500/20 text-orange-300 border-orange-500/30"
      default:
        return ""
    }
  }

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case "high":
        return "bg-red-500/20 border-red-500/50"
      case "medium":
        return "bg-yellow-500/20 border-yellow-500/50"
      case "low":
        return "bg-gray-500/20 border-gray-500/50"
      default:
        return ""
    }
  }

  const currentMeeting = staticMeetings[selectedMeetingIdx]

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/50 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Meeting Preparation Assistant</h1>
            <p className="text-muted-foreground">AI-curated insights and talking points for your upcoming meetings</p>
          </div>
          <button
            onClick={() => setShowUpload((v) => !v)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 rounded-lg text-white font-medium transition-all"
          >
            <Upload className="w-4 h-4" />
            Upload Transcript
          </button>
        </div>

        {/* Upload Panel */}
        {showUpload && (
          <div className="glass rounded-lg p-6 border border-purple-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Upload Meeting Transcript</h2>
              <button
                onClick={() => setShowUpload(false)}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            {uploadError && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
                {uploadError}
              </div>
            )}
            <div>
              <label className="text-sm text-muted-foreground block mb-1">Meeting Title</label>
              <input
                type="text"
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                placeholder="e.g. Q4 Board Review"
                className="w-full px-3 py-2 glass rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground block mb-1">Transcript</label>
              <textarea
                value={uploadTranscript}
                onChange={(e) => setUploadTranscript(e.target.value)}
                placeholder="Paste the meeting transcript here..."
                rows={6}
                className="w-full px-3 py-2 glass rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm resize-none"
              />
            </div>
            <button
              onClick={handleUpload}
              disabled={isUploading || !uploadTitle.trim() || !uploadTranscript.trim()}
              className="px-6 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 rounded-lg text-white font-medium transition-all disabled:opacity-50"
            >
              {isUploading ? "Uploading..." : "Upload"}
            </button>
          </div>
        )}

        {/* Uploaded Meetings (from API) */}
        {uploadedMeetings.length > 0 && (
          <div className="glass rounded-lg p-6 border border-white/10 space-y-3">
            <h2 className="text-lg font-semibold text-foreground">Your Uploaded Meetings</h2>
            {summarizeMessage && (
              <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-sm">
                {summarizeMessage}
              </div>
            )}
            {uploadedMeetings.map((m) => (
              <div key={m.id} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                <div>
                  <p className="font-medium text-foreground">{m.title}</p>
                  <p className="text-xs text-muted-foreground">
                    Status: <span className="capitalize">{m.status.toLowerCase()}</span>
                    {m.summary && " · Summary available"}
                  </p>
                  {m.summary && (
                    <p className="text-xs text-cyan-300 mt-1 max-w-xl truncate">{m.summary}</p>
                  )}
                </div>
                <button
                  onClick={() => handleSummarize(m.id)}
                  disabled={summarizingId === m.id}
                  className="px-3 py-1 glass hover:bg-white/10 rounded-lg text-sm text-foreground transition-colors disabled:opacity-50"
                >
                  {summarizingId === m.id ? "Queuing..." : "Summarize"}
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Meeting List Sidebar */}
          <div className="lg:col-span-1 space-y-3">
            <h2 className="text-lg font-semibold text-foreground">Upcoming Meetings</h2>
            {staticMeetings.map((meeting, idx) => (
              <button
                key={meeting.id}
                onClick={() => setSelectedMeetingIdx(idx)}
                className={`w-full text-left p-4 rounded-lg transition-all border ${
                  selectedMeetingIdx === idx
                    ? "glass bg-purple-500/20 border-purple-500/50"
                    : "glass border-white/10 hover:bg-white/5"
                }`}
              >
                <p className="font-semibold text-foreground text-sm mb-1">{meeting.title}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {meeting.time} · {meeting.duration}m
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                  <MapPin className="w-3 h-3" />
                  {meeting.location}
                </div>
              </button>
            ))}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Meeting Details */}
            <div className="glass rounded-lg p-6 border border-white/10">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">{currentMeeting.title}</h2>
                  <p className="text-muted-foreground">Organized by {currentMeeting.organizer}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-cyan-400">{currentMeeting.duration}m</div>
                  <p className="text-xs text-muted-foreground">Duration</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                  <Clock className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-xs text-muted-foreground">Time</p>
                    <p className="text-foreground font-medium">{currentMeeting.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                  <MapPin className="w-5 h-5 text-cyan-400" />
                  <div>
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="text-foreground font-medium">{currentMeeting.location}</p>
                  </div>
                </div>
              </div>

              {/* Objective */}
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 mb-4">
                <p className="text-sm text-green-200 font-medium mb-1">Meeting Objective</p>
                <p className="text-sm text-green-100">{currentMeeting.objective}</p>
              </div>

              {/* Agenda */}
              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                <p className="text-sm text-blue-200 font-medium mb-2">Agenda</p>
                <p className="text-sm text-blue-100">{currentMeeting.agenda}</p>
              </div>
            </div>

            {/* Attendees */}
            <div className="glass rounded-lg p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-cyan-400" />
                Attendees
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentMeeting.attendees.map((attendee) => (
                  <div key={attendee.name} className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white font-semibold text-sm">
                      {attendee.avatar}
                    </div>
                    <div>
                      <p className="text-foreground font-medium text-sm">{attendee.name}</p>
                      <p className="text-xs text-muted-foreground">{attendee.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Prep Checklist */}
            <div className="glass rounded-lg p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                Preparation Checklist
              </h3>
              <div className="space-y-3">
                {[
                  "Review related emails",
                  "Prepare key talking points",
                  "Gather supporting data and reports",
                  "Prepare for Q&A",
                  "Test technology (video/screen share)",
                ].map((item, idx) => (
                  <label key={idx} className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg cursor-pointer">
                    <input type="checkbox" className="w-5 h-5 rounded cursor-pointer" defaultChecked={idx < 2} />
                    <span className={idx < 2 ? "text-muted-foreground line-through" : "text-foreground"}>{item}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Prep Items */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Curated Preparation Materials</h3>
              {DEFAULT_PREP_ITEMS.map((item) => (
                <div
                  key={item.id}
                  className={`glass rounded-lg p-4 border transition-all ${getImportanceColor(item.importance)}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${getCategoryColor(item.category)}`}>
                      {getCategoryIcon(item.category)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <h4 className="font-semibold text-foreground text-sm">{item.title}</h4>
                          <p className="text-xs text-muted-foreground capitalize">{item.category.replace("-", " ")}</p>
                        </div>
                        <span className="text-xs px-2 py-1 rounded-full bg-white/10 border border-white/20 text-muted-foreground capitalize">
                          {item.importance}
                        </span>
                      </div>
                      <p className="text-sm text-foreground">{item.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Resources */}
            <div className="glass rounded-lg p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-400" />
                Related Resources
              </h3>
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                  <span className="text-sm text-foreground">{currentMeeting.relatedEmails} related emails</span>
                  <MessageSquare className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
              <div className="space-y-2 mb-6">
                {currentMeeting.attachments.map((file) => (
                  <div
                    key={file}
                    className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10"
                  >
                    <span className="text-sm text-foreground">{file}</span>
                    <Download className="w-4 h-4 text-cyan-400 cursor-pointer hover:text-cyan-300" />
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button className="flex-1 px-4 py-2 glass hover:bg-white/10 rounded-lg text-foreground font-medium transition-colors flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  Export Brief
                </button>
                <button className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 rounded-lg text-white font-medium transition-all flex items-center justify-center gap-2">
                  <Share2 className="w-4 h-4" />
                  Share Notes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
