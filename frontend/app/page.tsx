"use client"

import { useState } from "react"
import { LoginPage } from "@/components/login-page"
import { Dashboard } from "@/components/dashboard"
import { LandingPage } from "@/components/landing-page"
import { ThemeToggle } from "@/components/theme-toggle"
import { SubscriptionPage } from "@/components/subscription-page"

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentPage, setCurrentPage] = useState<"landing" | "pricing" | "login" | "dashboard">("landing")

  if (!isLoggedIn) {
    if (currentPage === "landing") {
      return (
        <LandingPage onGetStarted={() => setCurrentPage("login")} onViewPricing={() => setCurrentPage("pricing")} />
      )
    }
    if (currentPage === "pricing") {
      return <SubscriptionPage onBack={() => setCurrentPage("landing")} onProceed={() => setCurrentPage("login")} />
    }
    return <LoginPage onLoginSuccess={() => setIsLoggedIn(true)} />
  }

  return (
    <main className="min-h-screen bg-background transition-colors duration-300">
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <Dashboard />
    </main>
  )
}
