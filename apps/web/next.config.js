const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/:path*`,
      },
    ];
  },
  experimental: {
    appDir: false,
  },
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
  },
};

// Make Sentry optional for local development
let config = nextConfig;

try {
  const { withSentryConfig } = require("@sentry/nextjs");

  // Only enable Sentry if DSN is provided
  if (process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_AUTH_TOKEN) {
    config = withSentryConfig(nextConfig, {
      org: "beyondscale",
      project: "kowtha-frontend",
      silent: !process.env.CI,
      widenClientFileUpload: true,
      disableLogger: true,
      // automaticVercelMonitors: true,
    });
  }
} catch (e) {
  // Sentry not installed or configuration failed - continue without it
  console.log("⚠️  Sentry not configured - running without error tracking");
}

module.exports = config;
