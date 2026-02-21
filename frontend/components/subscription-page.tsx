"use client"

import { useState } from "react"
import { ThemeToggle } from "./theme-toggle"
import { Button } from "./ui/button"
import { ArrowLeft, Check } from "lucide-react"

interface SubscriptionPageProps {
  onBack: () => void
  onProceed: () => void
}

export function SubscriptionPage({ onBack, onProceed }: SubscriptionPageProps) {
  const [isAnnual, setIsAnnual] = useState(false)

  const plans = [
    {
      name: "Starter",
      monthlyPrice: 10,
      annualPrice: 100,
      description: "Perfect for individual executives",
      features: [
        "Daily AI-powered brief",
        "Smart task management",
        "Basic analytics",
        "Email support",
        "5 AI queries per day",
      ],
      popular: false,
    },
    {
      name: "Professional",
      monthlyPrice: 79,
      annualPrice: 790,
      description: "For growing teams",
      features: [
        "Everything in Starter",
        "Unlimited AI queries",
        "Advanced analytics",
        "Priority support",
        "Team collaboration",
        "Custom integrations",
        "Multi-user dashboard",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      monthlyPrice: 199,
      annualPrice: 1990,
      description: "For large organizations",
      features: [
        "Everything in Professional",
        "Dedicated account manager",
        "Custom training",
        "Advanced security",
        "SLA guarantee",
        "API access",
        "White-label options",
      ],
      popular: false,
    },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md border-b border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back</span>
          </button>
          <ThemeToggle />
        </div>
      </nav>

      {/* Header */}
      <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight">
            Simple, Transparent{" "}
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Pricing</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect plan for your needs. Always flexible to scale as you grow.
          </p>

          {/* Discount Banner for Annual Plans */}
          <div className="mt-8 inline-block bg-primary/10 border border-primary/30 rounded-full px-4 py-2">
            <p className="text-sm font-semibold text-primary">🎉 Annual Plans - Save 17% Off Monthly Pricing</p>
          </div>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 pt-4">
            <span className={`text-sm font-medium ${!isAnnual ? "text-foreground" : "text-muted-foreground"}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative inline-flex h-8 w-14 items-center rounded-full bg-border/50 transition-colors hover:bg-border"
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-foreground transition-transform ${
                  isAnnual ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${isAnnual ? "text-foreground" : "text-muted-foreground"}`}>
              Annual
            </span>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl border transition-all duration-300 ${
                  plan.popular
                    ? "border-primary/50 bg-primary/5 ring-2 ring-primary/20 sm:lg:scale-105"
                    : "border-border/50 bg-card/30 hover:border-border/80"
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-primary px-3 py-1 rounded-full text-xs font-semibold text-primary-foreground">
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="p-6 sm:p-8 space-y-6">
                  {/* Plan Name */}
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold">{plan.name}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-2">{plan.description}</p>
                  </div>

                  {/* Pricing */}
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl sm:text-5xl font-bold">
                        ${isAnnual ? plan.annualPrice : plan.monthlyPrice}
                      </span>
                      <span className="text-muted-foreground text-xs sm:text-sm">{isAnnual ? "/year" : "/month"}</span>
                    </div>
                    {isAnnual && (
                      <p className="text-xs text-primary mt-2 font-semibold">
                        ${(plan.annualPrice / 12).toFixed(2)}/month billed annually
                      </p>
                    )}
                  </div>

                  {/* CTA Button */}
                  <Button
                    size="lg"
                    onClick={onProceed}
                    className="w-full"
                    variant={plan.popular ? "default" : "outline"}
                  >
                    Get Started
                  </Button>

                  {/* Divider */}
                  <div className="border-t border-border/50" />

                  {/* Features List */}
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-sm text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card/30">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">Frequently Asked Questions</h2>

          <div className="space-y-4 sm:space-y-6">
            {[
              {
                q: "Can I change my plan anytime?",
                a: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.",
              },
              {
                q: "Is there a free trial?",
                a: "Yes, all plans come with a 14-day free trial. No credit card required to start.",
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit cards, PayPal, and bank transfers for annual plans.",
              },
              {
                q: "Do you offer discounts for annual billing?",
                a: "Yes, save 17% when you choose annual billing instead of monthly.",
              },
            ].map((item, idx) => (
              <div key={idx} className="border border-border/50 rounded-lg p-4 sm:p-6">
                <h3 className="text-sm sm:text-base font-semibold mb-2">{item.q}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
            © 2025 Executive AI. All rights reserved.
          </p>
          <div className="flex gap-4 sm:gap-6 text-xs sm:text-sm text-muted-foreground">
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
