import type { NextConfig } from "next";

// ─── Security Headers ────────────────────────────────────────────────────────
// Domains used by the app that must be whitelisted in CSP:
//   • TMDB / Unsplash         → images
//   • Google Fonts            → style + font loading
//   • Vercel Analytics        → script + connect
//   • ExoClick / MagSrv       → ad scripts + frames
//   • profitablecpmratenetwork→ ad scripts
//   • highperformanceformat   → ad scripts
//   • Video embed providers   → iframes (frame-src)
//   • Upstash                 → API connect (redis REST)
//   • TMDB API                → connect

const scriptSrc = [
  "'self'",
  // Inline scripts & eval required by ad networks / Next.js runtime
  "'unsafe-inline'",
  // ExoClick / MagSrv ad provider
  "https://a.magsrv.com",
  // Propeller-Ads / profitablecpmrate networks
  "https://pl29432416.profitablecpmratenetwork.com",
  "https://pl29432417.profitablecpmratenetwork.com",
  "https://pl29435454.profitablecpmratenetwork.com",
  // HighPerformanceFormat ad invoke
  "https://www.highperformanceformat.com",
  // Vercel Analytics
  "https://va.vercel-scripts.com",
  "https://vercel.live",
].join(" ");

const styleSrc = [
  "'self'",
  "'unsafe-inline'", // Required by Next.js CSS-in-JS and inline styles
  "https://fonts.googleapis.com",
].join(" ");

const fontSrc = [
  "'self'",
  "https://fonts.gstatic.com",
  "data:",
].join(" ");

const imgSrc = [
  "'self'",
  "data:",
  "blob:",
  "https://image.tmdb.org",
  "https://images.unsplash.com",
  "https://netfast.stream",
  // Ad networks may serve tracking pixels
  "https:",
].join(" ");

const connectSrc = [
  "'self'",
  // TMDB API
  "https://api.themoviedb.org",
  // Upstash Redis REST API
  "https://*.upstash.io",
  // Vercel Analytics
  "https://va.vercel-scripts.com",
  "https://vitals.vercel-insights.com",
  // Ad network beacons / tracking
  "https://a.magsrv.com",
  "https://*.profitablecpmratenetwork.com",
  "https://www.highperformanceformat.com",
  // CodeSpecters embed API
  "https://api.codespecters.com",
].join(" ");

// Video embed providers loaded in <iframe> inside VideoPlayer
const frameSrc = [
  "'self'",
  "https://api.codespecters.com",
  "https://vidsrc.xyz",
  "https://vidsrc.to",
  "https://embed.su",
  "https://player.smashy.stream",
  "https://vidlink.pro",
  "https://vidsrc.me",
  "https://multiembed.mov",
  // ExoClick ad iframes
  "https://a.magsrv.com",
  "https://*.exoclick.com",
  // AdBanner iframes
  "https://*.profitablecpmratenetwork.com",
  "https://www.highperformanceformat.com",
].join(" ");

const mediaSrc = [
  "'self'",
  "blob:",
  "https://image.tmdb.org",
].join(" ");

const workerSrc = [
  "'self'",
  "blob:",
].join(" ");

// Compose the full CSP string
const contentSecurityPolicy = [
  `default-src 'self'`,
  `script-src ${scriptSrc}`,
  `style-src ${styleSrc}`,
  `font-src ${fontSrc}`,
  `img-src ${imgSrc}`,
  `connect-src ${connectSrc}`,
  `frame-src ${frameSrc}`,
  `media-src ${mediaSrc}`,
  `worker-src ${workerSrc}`,
  `object-src 'none'`,
  `base-uri 'self'`,
  `form-action 'self'`,
  // Allow the site to be embedded only by itself (anti-clickjacking)
  `frame-ancestors 'self'`,
  `upgrade-insecure-requests`,
].join("; ");

const securityHeaders = [
  // ── Content-Security-Policy ──────────────────────────────────────────────
  {
    key: "Content-Security-Policy",
    value: contentSecurityPolicy,
  },
  // ── X-Frame-Options (legacy fallback for older browsers) ─────────────────
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  // ── X-Content-Type-Options (prevent MIME sniffing) ───────────────────────
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  // ── Referrer-Policy ──────────────────────────────────────────────────────
  // Send full URL within same origin; only origin for cross-origin HTTPS
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  // ── Permissions-Policy ───────────────────────────────────────────────────
  // Restrict powerful browser APIs; keep fullscreen + autoplay for the player
  {
    key: "Permissions-Policy",
    value: [
      "camera=()",
      "microphone=()",
      "geolocation=()",
      "payment=()",
      "usb=()",
      "magnetometer=()",
      "gyroscope=()",
      "accelerometer=()",
      "ambient-light-sensor=()",
      "browsing-topics=()",
      // Allow autoplay & fullscreen for the video player
      "autoplay=(self)",
      "fullscreen=(self)",
      "picture-in-picture=(self)",
      // Allow orientation lock used by VideoPlayer mobile landscape toggle
      "screen-wake-lock=(self)",
    ].join(", "),
  },
  // ── Strict-Transport-Security (HSTS) ─────────────────────────────────────
  // Already passing per the scan — keep it consistent / explicit here too
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // ── X-DNS-Prefetch-Control ───────────────────────────────────────────────
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  // ── X-XSS-Protection (legacy IE/old Chrome hardening) ───────────────────
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
];
// ─────────────────────────────────────────────────────────────────────────────

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
    qualities: [75, 85, 90],
  },

  // Enable gzip/brotli compression for all responses
  compress: true,

  // Client-side router cache: keeps prefetched pages alive so back/forward
  // navigation is instant without a server round-trip.
  experimental: {
    staleTimes: {
      dynamic: 30,   // dynamic pages cached 30s on client router
      static: 300,   // static pages cached 5min on client router
    },
  },

  async headers() {
    return [
      {
        // Apply security headers to every route
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },

  // Remove the default "X-Powered-By: Next.js" header to reduce fingerprinting
  poweredByHeader: false,
};

export default nextConfig;
