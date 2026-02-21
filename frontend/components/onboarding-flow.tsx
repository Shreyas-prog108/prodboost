"use client"

import { useState } from "react"
import { ChevronRight, CheckCircle2, Zap, Mail, Calendar, BarChart3, Wand2 } from "lucide-react"

type OnboardingStep = "welcome" | "profile" | "features" | "integrations" | "complete"

export function OnboardingFlow({ onComplete }: { onComplete: () => void }) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("welcome")
  const [completedSteps, setCompletedSteps] = useState<Set<OnboardingStep>>(new Set())
  const [userProfile, setUserProfile] = useState({
    fullName: "",
    role: "Executive",
    team: "Leadership",
    preferences: {
      emailTriage: true,
      calendar: true,
      analytics: true,
      voiceCommands: true,
    },
  })

  const markStepComplete = (step: OnboardingStep) => {
    setCompletedSteps((prev) => new Set(prev).add(step))
  }

  const goToStep = (step: OnboardingStep) => {
    setCurrentStep(step)
    markStepComplete(step)
  }

  const handleComplete = () => {
    markStepComplete("complete")
    onComplete()
  }

  const steps = [
    {
      id: "welcome" as const,
      title: "Welcome to Executive AI",
      description: "Let's set up your intelligent assistant",
    },
    {
      id: "profile" as const,
      title: "Your Profile",
      description: "Tell us about yourself",
    },
    {
      id: "features" as const,
      title: "Explore Features",
      description: "Customize your experience",
    },
    {
      id: "integrations" as const,
      title: "Connect Services",
      description: "Link your tools",
    },
    {
      id: "complete" as const,
      title: "All Set!",
      description: "You're ready to go",
    },
  ]

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, idx) => (
              <div key={step.id} className="flex items-center flex-1">
                <button
                  onClick={() => goToStep(step.id)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                    completedSteps.has(step.id)
                      ? "bg-green-500/20 text-green-400 border border-green-500/50"
                      : currentStep === step.id
                        ? "bg-purple-500/30 text-purple-200 border border-purple-500"
                        : "bg-white/10 text-muted-foreground border border-white/20"
                  }`}
                >
                  {completedSteps.has(step.id) ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                </button>
                {idx < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 transition-all ${
                      completedSteps.has(step.id) ? "bg-green-500/50" : "bg-white/10"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="glass rounded-2xl p-8 backdrop-blur-xl">
          {currentStep === "welcome" && (
            <div className="space-y-6 text-center">
              <div className="inline-flex p-4 rounded-full bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-500/30">
                <Zap className="w-8 h-8 text-purple-300" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">Welcome to Executive AI</h1>
                <p className="text-lg text-muted-foreground">
                  Your intelligent assistant is ready to transform how you work
                </p>
              </div>
              <div className="space-y-3 text-left bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex gap-3">
                  <Zap className="w-5 h-5 text-purple-400 flex-shrink-0" />
                  <p className="text-foreground">Intelligent email triage and priority management</p>
                </div>
                <div className="flex gap-3">
                  <Calendar className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                  <p className="text-foreground">Smart calendar optimization and meeting prep</p>
                </div>
                <div className="flex gap-3">
                  <BarChart3 className="w-5 h-5 text-purple-400 flex-shrink-0" />
                  <p className="text-foreground">Real-time productivity insights and analytics</p>
                </div>
              </div>
              <button
                onClick={() => goToStep("profile")}
                className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
              >
                Get Started
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {currentStep === "profile" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Tell Us About Yourself</h1>
                <p className="text-muted-foreground">Customize your experience with the right settings</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-foreground font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    value={userProfile.fullName}
                    onChange={(e) => setUserProfile({ ...userProfile, fullName: e.target.value })}
                    className="w-full glass px-4 py-3 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    placeholder="John Doe"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-foreground font-medium mb-2">Role</label>
                    <select
                      value={userProfile.role}
                      onChange={(e) => setUserProfile({ ...userProfile, role: e.target.value })}
                      className="w-full glass px-4 py-3 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    >
                      <option>Executive</option>
                      <option>Manager</option>
                      <option>Director</option>
                      <option>C-Suite</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-foreground font-medium mb-2">Team Size</label>
                    <select
                      value={userProfile.team}
                      onChange={(e) => setUserProfile({ ...userProfile, team: e.target.value })}
                      className="w-full glass px-4 py-3 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    >
                      <option>Leadership</option>
                      <option>Small (2-10)</option>
                      <option>Medium (11-50)</option>
                      <option>Large (50+)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => goToStep("welcome")}
                  className="flex-1 glass hover:bg-white/10 text-foreground font-semibold py-3 rounded-lg transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => goToStep("features")}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  Continue
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {currentStep === "features" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Choose Your Features</h1>
                <p className="text-muted-foreground">Select the features most important to you</p>
              </div>

              <div className="space-y-3">
                {[
                  {
                    key: "emailTriage" as const,
                    title: "Email Triage",
                    description: "Intelligent email management and prioritization",
                    icon: Mail,
                  },
                  {
                    key: "calendar" as const,
                    title: "Smart Calendar",
                    description: "Meeting optimization and preparation",
                    icon: Calendar,
                  },
                  {
                    key: "analytics" as const,
                    title: "Productivity Analytics",
                    description: "Insights into your work patterns",
                    icon: BarChart3,
                  },
                  {
                    key: "voiceCommands" as const,
                    title: "Voice Commands",
                    description: "Control your dashboard with your voice",
                    icon: Wand2,
                  },
                ].map(({ key, title, description, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() =>
                      setUserProfile({
                        ...userProfile,
                        preferences: {
                          ...userProfile.preferences,
                          [key]: !userProfile.preferences[key],
                        },
                      })
                    }
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left flex items-start gap-4 ${
                      userProfile.preferences[key]
                        ? "bg-purple-500/20 border-purple-500 glass"
                        : "bg-white/5 border-white/10 glass hover:border-white/20"
                    }`}
                  >
                    <div
                      className={`p-3 rounded-lg ${userProfile.preferences[key] ? "bg-purple-500/30" : "bg-white/10"}`}
                    >
                      <Icon className="w-5 h-5 text-purple-300" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{title}</p>
                      <p className="text-sm text-muted-foreground">{description}</p>
                    </div>
                    <div
                      className={`w-6 h-6 rounded border-2 transition-all ${
                        userProfile.preferences[key] ? "bg-purple-500 border-purple-400" : "border-white/30"
                      }`}
                    >
                      {userProfile.preferences[key] && <CheckCircle2 className="w-full h-full text-white" />}
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => goToStep("profile")}
                  className="flex-1 glass hover:bg-white/10 text-foreground font-semibold py-3 rounded-lg transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => goToStep("integrations")}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  Continue
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {currentStep === "integrations" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Connect Your Services</h1>
                <p className="text-muted-foreground">Link your favorite tools and services</p>
              </div>

              <div className="space-y-3">
                {["Gmail", "Microsoft 365", "Slack", "Google Calendar", "Jira", "Salesforce"].map((service) => (
                  <div
                    key={service}
                    className="glass p-4 rounded-lg border border-white/10 flex items-center justify-between hover:bg-white/10 transition-colors"
                  >
                    <span className="text-foreground font-medium">{service}</span>
                    <button className="px-4 py-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/50 transition-colors">
                      Connect
                    </button>
                  </div>
                ))}
              </div>

              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                <p className="text-sm text-cyan-200">
                  You can add integrations later from the settings panel. Skipping this step won't affect your
                  experience.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => goToStep("features")}
                  className="flex-1 glass hover:bg-white/10 text-foreground font-semibold py-3 rounded-lg transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleComplete}
                  className="flex-1 bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  Start Using Dashboard
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {currentStep === "complete" && (
            <div className="space-y-6 text-center py-4">
              <div className="inline-flex p-4 rounded-full bg-gradient-to-br from-green-500/20 to-cyan-500/20 border border-green-500/30 animate-pulse">
                <CheckCircle2 className="w-8 h-8 text-green-400" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">You're All Set!</h1>
                <p className="text-lg text-muted-foreground">Your executive dashboard is ready to use</p>
              </div>
              <div className="space-y-2 text-left bg-white/5 rounded-lg p-4 border border-white/10">
                <p className="text-foreground">Welcome, {userProfile.fullName || "Executive"}!</p>
                <p className="text-sm text-muted-foreground">
                  Your personalized dashboard is configured with all the features you selected.
                </p>
              </div>
              <button
                onClick={handleComplete}
                className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white font-semibold py-3 rounded-lg transition-all"
              >
                Enter Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
