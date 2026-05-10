import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  enabled: process.env.NODE_ENV === "production",

  // Server-side hata örnekleme
  tracesSampleRate: 0.1,

  // AI API hatalarını öncelikli yakala
  beforeSend(event) {
    // Anthropic timeout hatalarını ayrı tag ile işaretle
    if (event.exception?.values?.some((e) => e.value?.includes("anthropic"))) {
      event.tags = { ...event.tags, ai_error: "true" };
    }
    return event;
  },
});
