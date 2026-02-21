"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Mic, MicOff, Search, Send, X } from "lucide-react"

interface Command {
  id: string
  text: string
  category: "schedule" | "email" | "tasks" | "analytics" | "settings"
  icon: string
  action: string
}

interface VoiceTranscript {
  id: string
  text: string
  timestamp: string
  status: "listening" | "processing" | "executed"
  response?: string
}

export function VoiceCommandModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [isListening, setIsListening] = useState(false)
  const [currentTranscript, setCurrentTranscript] = useState("")
  const [transcripts, setTranscripts] = useState<VoiceTranscript[]>([])
  const [suggestedCommands, setSuggestedCommands] = useState<Command[]>([
    {
      id: "1",
      text: "Schedule meeting with marketing team next Tuesday at 2 PM",
      category: "schedule",
      icon: "📅",
      action: "schedule_meeting",
    },
    {
      id: "2",
      text: "Show me important emails from today",
      category: "email",
      icon: "✉️",
      action: "filter_emails",
    },
    {
      id: "3",
      text: "What are my top priorities today",
      category: "tasks",
      icon: "✓",
      action: "show_priorities",
    },
    {
      id: "4",
      text: "Show my productivity analytics this week",
      category: "analytics",
      icon: "📊",
      action: "show_analytics",
    },
    {
      id: "5",
      text: "Enable focus mode for 2 hours",
      category: "settings",
      icon: "🎯",
      action: "enable_focus_mode",
    },
    {
      id: "6",
      text: "Send email to the team about the update",
      category: "email",
      icon: "📧",
      action: "compose_email",
    },
  ])

  const [filteredCommands, setFilteredCommands] = useState<Command[]>(suggestedCommands)

  useEffect(() => {
    if (!isOpen) {
      setIsListening(false)
      setCurrentTranscript("")
    }
  }, [isOpen])

  const startListening = () => {
    setIsListening(true)
    setCurrentTranscript("Listening...")
    // Simulate voice recognition with fake transcript
    setTimeout(() => {
      setCurrentTranscript("Schedule a meeting with Sarah for tomorrow at 10 AM")
      setIsListening(false)
    }, 3000)
  }

  const stopListening = () => {
    setIsListening(false)
  }

  const executeCommand = (transcript: string) => {
    const newTranscript: VoiceTranscript = {
      id: Date.now().toString(),
      text: transcript,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "processing",
    }

    setTranscripts((prev) => [newTranscript, ...prev])
    setCurrentTranscript("")

    // Simulate processing
    setTimeout(() => {
      setTranscripts((prev) =>
        prev.map((t) =>
          t.id === newTranscript.id
            ? {
                ...t,
                status: "executed",
                response: "Command executed successfully. Your meeting has been scheduled.",
              }
            : t,
        ),
      )
    }, 1500)
  }

  const handleCommandClick = (command: Command) => {
    executeCommand(command.text)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase()
    if (query === "") {
      setFilteredCommands(suggestedCommands)
    } else {
      setFilteredCommands(
        suggestedCommands.filter((cmd) => cmd.text.toLowerCase().includes(query) || cmd.category.includes(query)),
      )
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col border border-white/20">
        {/* Header */}
        <div className="glass-dark border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Voice Assistant</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto flex flex-col">
          {/* Transcript History */}
          {transcripts.length > 0 && (
            <div className="p-6 border-b border-white/10 space-y-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase">Recent Commands</p>
              <div className="space-y-2">
                {transcripts.map((transcript) => (
                  <div key={transcript.id} className="glass p-3 rounded-lg border border-white/10">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="text-sm text-foreground flex-1">{transcript.text}</p>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">{transcript.timestamp}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          transcript.status === "executed" ? "bg-green-500" : "bg-yellow-500"
                        }`}
                      ></div>
                      <span className="text-xs text-muted-foreground">
                        {transcript.status === "executed" ? "Executed" : "Processing"}
                      </span>
                    </div>
                    {transcript.response && (
                      <p className="text-xs text-cyan-300 mt-2 p-2 rounded bg-cyan-500/10 border border-cyan-500/20">
                        {transcript.response}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Voice Input Section */}
          <div className="flex-1 p-6 flex flex-col justify-center items-center space-y-6">
            {/* Microphone Visualization */}
            <div className="flex flex-col items-center gap-4">
              <div
                className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
                  isListening
                    ? "bg-gradient-to-br from-purple-500/30 to-cyan-500/30 border-2 border-purple-500 animate-pulse"
                    : "bg-white/10 border-2 border-white/20"
                }`}
              >
                {isListening ? (
                  <Mic className="w-10 h-10 text-purple-300 animate-pulse" />
                ) : (
                  <MicOff className="w-10 h-10 text-muted-foreground" />
                )}
              </div>

              {/* Waveform animation */}
              {isListening && (
                <div className="flex items-center justify-center gap-1">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-1 bg-gradient-to-t from-purple-500 to-cyan-500 rounded-full"
                      style={{
                        height: `${20 + Math.random() * 40}px`,
                        animation: `pulse ${0.5 + i * 0.1}s infinite`,
                      }}
                    ></div>
                  ))}
                </div>
              )}
            </div>

            {/* Current Transcript */}
            <div className="text-center">
              <p
                className={`text-lg ${
                  isListening
                    ? "text-purple-300 animate-pulse"
                    : currentTranscript
                      ? "text-foreground"
                      : "text-muted-foreground"
                }`}
              >
                {isListening ? "Listening..." : currentTranscript || "Say something..."}
              </p>
            </div>

            {/* Voice Control Buttons */}
            <div className="flex gap-3">
              {!isListening ? (
                <button
                  onClick={startListening}
                  className="px-8 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 rounded-full text-white font-semibold flex items-center gap-2 transition-all"
                >
                  <Mic className="w-5 h-5" />
                  Start Speaking
                </button>
              ) : (
                <button
                  onClick={stopListening}
                  className="px-8 py-3 bg-red-500/20 border border-red-500/50 hover:bg-red-500/30 rounded-full text-red-300 font-semibold flex items-center gap-2 transition-all"
                >
                  <MicOff className="w-5 h-5" />
                  Stop
                </button>
              )}

              {currentTranscript && currentTranscript !== "Listening..." && (
                <button
                  onClick={() => executeCommand(currentTranscript)}
                  className="px-8 py-3 bg-green-500/20 border border-green-500/50 hover:bg-green-500/30 rounded-full text-green-300 font-semibold flex items-center gap-2 transition-all"
                >
                  <Send className="w-5 h-5" />
                  Execute
                </button>
              )}
            </div>
          </div>

          {/* Suggested Commands */}
          <div className="p-6 border-t border-white/10">
            <div className="mb-4">
              <label className="text-xs font-semibold text-muted-foreground uppercase block mb-2">
                Or Try These Commands
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search commands..."
                  onChange={handleSearchChange}
                  className="w-full glass pl-10 pr-4 py-2 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {filteredCommands.map((command) => (
                <button
                  key={command.id}
                  onClick={() => handleCommandClick(command)}
                  className="glass p-3 rounded-lg text-left hover:bg-white/10 transition-colors border border-white/10 hover:border-white/20"
                >
                  <span className="text-lg block mb-1">{command.icon}</span>
                  <p className="text-xs text-foreground line-clamp-2">{command.text}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
