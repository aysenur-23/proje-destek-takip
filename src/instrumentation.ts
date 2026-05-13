export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const Sentry = await import("@sentry/nextjs");

    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      enabled: process.env.NODE_ENV === "production",
      tracesSampleRate: 0.1,
      beforeSend(event) {
        if (event.exception?.values?.some((e) => e.value?.includes("anthropic"))) {
          event.tags = { ...event.tags, ai_error: "true" };
        }
        return event;
      },
    });
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    const Sentry = await import("@sentry/nextjs");
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      enabled: process.env.NODE_ENV === "production",
      tracesSampleRate: 0.1,
    });
  }
}

// Next.js RSC / Server Action hatalarını Sentry'ye ilet
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function onRequestError(...args: any[]) {
  const Sentry = await import("@sentry/nextjs");
  // @ts-expect-error — Sentry v8 captureRequestError imzası
  await Sentry.captureRequestError(...args);
}
