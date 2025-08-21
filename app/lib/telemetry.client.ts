export async function reportError(err: any, context?: Record<string, any>) {
  try {
    // @ts-ignore
    const S = (globalThis as any).Sentry
    if (S && typeof S.captureException === 'function') {
      S.captureException(err, { extra: context || {} })
      return
    }
  } catch {}
  // eslint-disable-next-line no-console
  console.error('reportError:', err, context)
}

export async function reportMessage(message: string, level: 'info' | 'warning' | 'error' = 'info', context?: Record<string, any>) {
  try {
    // @ts-ignore
    const S = (globalThis as any).Sentry
    if (S && typeof S.captureMessage === 'function') {
      S.captureMessage(message, { level, extra: context || {} })
      return
    }
  } catch {}
  // eslint-disable-next-line no-console
  console.log(`[${level}]`, message, context)
}

