"use client"

import type React from "react"

import { useState } from "react"
import { Mail, Lock, Chrome, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { authApi } from "@/lib/api"
import { markAuthenticated } from "@/lib/auth"

interface LoginPageProps {
  onLoginSuccess: () => void
}

export function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCustomLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    try {
      const response = await authApi.login({ email, password })
      if (response.success && response.data?.access_token) {
        markAuthenticated()
        onLoginSuccess()
      } else {
        setError("Login failed. Please check your credentials.")
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Login failed. Please try again."
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  // OAuth logins are not yet wired to a backend OAuth flow;
  // they fall through to a "not supported" notice for now.
  const handleGoogleLogin = () => {
    setError("Google sign-in is not yet configured.")
  }

  const handleMicrosoftLogin = () => {
    setError("Microsoft sign-in is not yet configured.")
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      {/* Animated background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-purple-900 to-slate-950" />
      <div className="fixed inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-lime-500/10 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      {/* Login Container */}
      <div className="relative z-10 w-full max-w-md">
        <div className="glass rounded-2xl p-8 md:p-10 space-y-8 border border-pink-500/20 shadow-2xl">
          {/* Header */}
          <div className="space-y-2 text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-lime-300 bg-clip-text text-transparent">
              Executive
            </h1>
            <p className="text-muted-foreground">AI-Powered Dashboard</p>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-pink-500/30 to-transparent" />

          {/* OAuth Login Options */}
          <div className="space-y-3">
            <Button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-700 hover:to-pink-600 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-3 group"
            >
              <Chrome className="w-5 h-5" />
              <span>Sign in with Google</span>
            </Button>

            <Button
              onClick={handleMicrosoftLogin}
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zm12.6 0H12.6V0H24v11.4z" />
              </svg>
              <span>Sign in with Microsoft</span>
            </Button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/10" />
            <span className="text-xs text-muted-foreground font-medium">OR</span>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/10" />
          </div>

          {/* Error Message */}
          {error && (
            <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-sm text-red-300">
              {error}
            </div>
          )}

          {/* Custom Login Form */}
          <form onSubmit={handleCustomLogin} className="space-y-4">
            {/* Email Input */}
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-lime-400/60 group-focus-within:text-lime-300 transition-colors" />
              <Input
                type="email"
                placeholder="Email or Username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 h-12 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:border-lime-400/50 focus:bg-white/10 transition-all"
              />
            </div>

            {/* Password Input */}
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-400/60 group-focus-within:text-pink-300 transition-colors" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 h-12 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:border-pink-400/50 focus:bg-white/10 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/70 transition-colors"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <button type="button" className="text-sm text-lime-300 hover:text-lime-200 transition-colors font-medium">
                Forgot Password?
              </button>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              disabled={isLoading || !email || !password}
              className="w-full h-12 bg-gradient-to-r from-lime-500 to-lime-400 hover:from-lime-600 hover:to-lime-500 text-slate-950 font-bold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Login</span>
                </>
              )}
            </Button>
          </form>

          {/* Signup Link */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <button
                type="button"
                disabled={isLoading || !email || !password}
                onClick={async () => {
                  setIsLoading(true)
                  setError(null)
                  try {
                    await authApi.register({ email, password })
                    // After registration, log in immediately
                    const response = await authApi.login({ email, password })
                    if (response.success && response.data?.access_token) {
                      markAuthenticated()
                      onLoginSuccess()
                    }
                  } catch (err: unknown) {
                    const message = err instanceof Error ? err.message : "Registration failed."
                    setError(message)
                  } finally {
                    setIsLoading(false)
                  }
                }}
                className="text-pink-400 hover:text-pink-300 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>

        {/* Footer Text */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}
