"use client"

import { useState, useEffect } from "react"
import { LoginPage } from "@/components/login-page"
import { Dashboard } from "@/components/dashboard"
import { LandingPage } from "@/components/landing-page"
import { ThemeToggle } from "@/components/theme-toggle"
import { SubscriptionPage } from "@/components/subscription-page"
import { OnboardingFlow } from "@/components/onboarding-flow"
import { markAuthenticated, markUnauthenticated } from "@/lib/auth"
import { api, authApi } from "@/lib/api"

const ONBOARDING_KEY = "onboarding_complete"

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [needsOnboarding, setNeedsOnboarding] = useState(false)
  const [currentPage, setCurrentPage] = useState<"landing" | "pricing" | "login" | "dashboard">("landing")

  // On mount, verify the HttpOnly cookie is still valid by hitting /auth/me.
  // If the cookie exists and is valid, skip straight to the dashboard.
  useEffect(() => {
    api.get<{ id: string; email: string }>("/auth/me")
      .then(() => {
        markAuthenticated()
        setIsLoggedIn(true)
      })
      .catch(() => {
        // No valid session — stay on landing page
      })
  }, [])

  const handleLoginSuccess = () => {
    markAuthenticated()
    const onboardingDone = localStorage.getItem(ONBOARDING_KEY)
    if (!onboardingDone) {
      setNeedsOnboarding(true)
    }
    setIsLoggedIn(true)
  }

  const handleLogout = async () => {
    try {
      await authApi.logout()
    } catch {
      // Ignore errors — proceed with local state reset regardless
    }
    markUnauthenticated()
    setIsLoggedIn(false)
    setCurrentPage("landing")
  }

  const handleOnboardingComplete = () => {
    localStorage.setItem(ONBOARDING_KEY, "true")
    setNeedsOnboarding(false)
  }

  if (!isLoggedIn) {
    if (currentPage === "landing") {
      return (
        <LandingPage onGetStarted={() => setCurrentPage("login")} onViewPricing={() => setCurrentPage("pricing")} />
      )
    }
    if (currentPage === "pricing") {
      return <SubscriptionPage onBack={() => setCurrentPage("landing")} onProceed={() => setCurrentPage("login")} />
    }
    return <LoginPage onLoginSuccess={handleLoginSuccess} />
  }

  if (needsOnboarding) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />
  }

  return (
    <main className="min-h-screen bg-background transition-colors duration-300">
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <Dashboard onLogout={handleLogout} />
    </main>
  )
}

