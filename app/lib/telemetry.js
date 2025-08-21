// Minimal telemetry helpers with optional Sentry forwarding
// Browser: uses global window.Sentry if loaded via CDN (see SentryInit)
// Server (API routes): if SENTRY_DSN is set, send a basic event to Sentry store API

function isBrowser() {
  return typeof window !== 'undefined' && typeof window.document !== 'undefined'
}

async function sendToSentryServer(event, dsn) {
  try {
    if (!dsn) return
    const u = new URL(dsn)
    const publicKey = u.username
    const host = u.host
    const projectId = u.pathname.replace(/^\//, '')
    const url = `https://${host}/api/${projectId}/store/`
    const auth = `Sentry sentry_version=7, sentry_client=afropop-next/1.0, sentry_key=${publicKey}`
    await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-sentry-auth': auth },
      body: JSON.stringify(event),
    })
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Sentry server send failed:', e)
  }
}

function normalizeError(err) {
  if (!err) return { message: 'Unknown error' }
  if (err instanceof Error) return { message: err.message, stack: err.stack }
  if (typeof err === 'string') return { message: err }
  try { return { message: JSON.stringify(err) } } catch { return { message: String(err) } }
}

async function reportError(err, context) {
  const info = normalizeError(err)
  if (isBrowser() && typeof window.Sentry !== 'undefined') {
    try { window.Sentry.captureException(err, { extra: context || {} }) } catch {}
    return
  }
  // Server path: push to Sentry store if DSN present
  const dsn = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN
  if (dsn && typeof fetch !== 'undefined') {
    const event = {
      level: 'error',
      message: info.message,
      exception: info.stack ? { values: [{ type: 'Error', value: info.message, stacktrace: { frames: [] } }] } : undefined,
      timestamp: Date.now() / 1000,
      tags: { source: 'server' },
      extra: context || {},
    }
    await sendToSentryServer(event, dsn)
  }
  // Always log to console as a fallback
  // eslint-disable-next-line no-console
  console.error('reportError:', info.message, context)
}

async function reportMessage(message, level = 'info', context) {
  if (isBrowser() && typeof window.Sentry !== 'undefined') {
    try { window.Sentry.captureMessage(message, { level, extra: context || {} }) } catch {}
    return
  }
  const dsn = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN
  if (dsn && typeof fetch !== 'undefined') {
    const event = {
      level,
      message,
      timestamp: Date.now() / 1000,
      tags: { source: 'server' },
      extra: context || {},
    }
    await sendToSentryServer(event, dsn)
  }
  // eslint-disable-next-line no-console
  console.log(`[${level}]`, message, context || '')
}

module.exports = { reportError, reportMessage }

