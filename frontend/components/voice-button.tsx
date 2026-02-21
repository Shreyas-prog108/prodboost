"use client"

import { useState } from "react"

export function VoiceButton() {
  const [isActive, setIsActive] = useState(false)

  return (
    <>
      {/* Floating Voice Button */}
      <button
        onClick={() => setIsActive(!isActive)}
        className={`fixed bottom-8 right-8 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold transition-all transform z-40 ${
          isActive ? "glass glow-primary scale-110 shadow-2xl" : "glass hover:bg-white/15"
        }`}
      >
        🎤
      </button>

      {/* Ripple Effect */}
      {isActive && (
        <>
          <div className="fixed bottom-8 right-8 w-16 h-16 rounded-full border-2 border-purple-500/50 animate-pulse z-30" />
          <div
            className="fixed bottom-8 right-8 w-20 h-20 rounded-full border-2 border-purple-500/30 animate-pulse z-20"
            style={{ animationDelay: "0.1s" }}
          />
        </>
      )}
    </>
  )
}
