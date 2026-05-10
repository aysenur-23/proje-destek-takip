import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Sadece production'da aktif
  enabled: process.env.NODE_ENV === "production",

  // Hata örnekleme oranı (%100 — tüm hatalar yakalanır)
  tracesSampleRate: 0.1,        // %10 performans trace
  replaysOnErrorSampleRate: 1.0, // Hata anında tam replay
  replaysSessionSampleRate: 0.05, // %5 oturum replay

  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],

  // Hangi hataları göz ardı edelim
  ignoreErrors: [
    "ResizeObserver loop limit exceeded",
    "Network request failed",
    "NetworkError",
    "AbortError",
  ],
});
