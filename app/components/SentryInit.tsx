"use client"
import React from 'react'

export default function SentryInit() {
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN
  if (!dsn) return null
  const script = `
    (function(){
      try {
        if (!window.Sentry) {
          var s = document.createElement('script');
          s.src = 'https://browser.sentry-cdn.com/7.114.0/bundle.min.js';
          s.crossOrigin = 'anonymous';
          s.onload = function(){
            try { window.Sentry && window.Sentry.init({ dsn: '${dsn}', tracesSampleRate: 0.1 }); } catch(e) {}
          };
          document.head.appendChild(s);
        } else {
          window.Sentry.init({ dsn: '${dsn}', tracesSampleRate: 0.1 });
        }
      } catch(e) {}
    })();
  `
  return <script dangerouslySetInnerHTML={{ __html: script }} />
}

