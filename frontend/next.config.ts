import type { NextConfig } from "next";

const securityHeaders = [
  // Prevent browsers from sniffing the MIME type
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Disallow framing from other origins (clickjacking)
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Force HTTPS for 1 year in production
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  // Minimal Referrer policy
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Permissions policy — disable unused sensitive APIs
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  // Content Security Policy
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Allow Next.js inline scripts and eval in development only
      process.env.NODE_ENV === "development"
        ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
        : "script-src 'self'",
      "style-src 'self' 'unsafe-inline'",  // Tailwind requires inline styles
      "img-src 'self' data: blob:",
      "font-src 'self'",
      `connect-src 'self' ${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}`,
      "frame-ancestors 'none'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
