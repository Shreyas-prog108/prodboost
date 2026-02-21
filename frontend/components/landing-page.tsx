"use client"

import { ThemeToggle } from "./theme-toggle"
import { Button } from "./ui/button"
import { ArrowRight, Zap, Shield, Sparkles } from "lucide-react"

interface LandingPageProps {
  onGetStarted: () => void
  onViewPricing: () => void
}

export function LandingPage({ onGetStarted, onViewPricing }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md border-b border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">AI</span>
            </div>
            <span className="text-lg font-semibold">Executive AI</span>
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={onViewPricing}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </button>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* ... existing hero section ... */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-block px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
            <span className="text-sm font-semibold text-primary">Introducing Executive AI Assistant</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
            Your AI-Powered{" "}
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Executive Assistant
            </span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Streamline your workflow, accelerate decision-making, and unlock insights with an intelligent assistant
            designed for busy executives.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" onClick={onGetStarted} className="gap-2">
              Get Started <ArrowRight className="w-4 h-4" />
            </Button>
            <Button size="lg" variant="outline" onClick={onViewPricing}>
              View Pricing
            </Button>
          </div>
        </div>
      </section>

      {/* ... existing features section ... */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Powerful Features</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-xl border border-border/50 bg-background hover:border-border/80 transition-colors">
              <Zap className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3">Lightning Fast</h3>
              <p className="text-muted-foreground">Get instant insights and AI-powered recommendations in real-time</p>
            </div>

            <div className="p-8 rounded-xl border border-border/50 bg-background hover:border-border/80 transition-colors">
              <Shield className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3">Enterprise Security</h3>
              <p className="text-muted-foreground">
                Your data is protected with military-grade encryption and compliance
              </p>
            </div>

            <div className="p-8 rounded-xl border border-border/50 bg-background hover:border-border/80 transition-colors">
              <Sparkles className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3">Smart Analytics</h3>
              <p className="text-muted-foreground">Leverage AI to uncover hidden patterns and opportunities</p>
            </div>
          </div>
        </div>
      </section>

      {/* ... existing CTA and footer sections ... */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-8 p-12 rounded-2xl border border-primary/20 bg-primary/5">
          <h2 className="text-3xl font-bold">Ready to Transform Your Workflow?</h2>
          <p className="text-lg text-muted-foreground">
            Join hundreds of executives using AI to work smarter and faster
          </p>
          <Button size="lg" onClick={onGetStarted} className="gap-2">
            Start Free Trial <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </section>

      <footer className="border-t border-border/40 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <p className="text-sm text-muted-foreground">© 2025 Executive AI. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
