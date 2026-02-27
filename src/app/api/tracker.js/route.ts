import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const domain = process.env.NEXT_PUBLIC_APP_URL || (req.headers.get("host") ? `http://${req.headers.get("host")}` : "https://kiwiko.io");

  const script = `
(function() {
  if (window.__KIWIKO_INITIALIZED__) return;
  window.__KIWIKO_INITIALIZED__ = true;

  const scriptTag = document.currentScript || document.querySelector('script[src*="tracker.js"]');
  const publicKey = scriptTag ? scriptTag.getAttribute('data-project') : null;

  if (!publicKey) {
    console.error('Kiwiko Tracker: data-project attribute missing');
    return;
  }

  const STORAGE_KEY = 'kiwiko_user_id';
  const SESSION_KEY = 'kiwiko_session_id';

  function getUuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  let userId = localStorage.getItem(STORAGE_KEY);
  if (!userId) {
    userId = 'user_' + getUuid();
    localStorage.setItem(STORAGE_KEY, userId);
  }

  let sessionId = sessionStorage.getItem(SESSION_KEY);
  let isNewSession = false;
  if (!sessionId) {
    sessionId = 'sess_' + getUuid();
    sessionStorage.setItem(SESSION_KEY, sessionId);
    isNewSession = true;
  }

  function track(eventName, metadata = {}) {
    const payload = {
      publicKey,
      userId,
      sessionId,
      eventName,
      url: window.location.href,
      metadata,
      timestamp: new Date().toISOString()
    };

    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
      navigator.sendBeacon('${domain}/api/ingest', blob);
    } else {
      fetch('${domain}/api/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true
      }).catch(() => {});
    }
  }

  // Initial events
  if (isNewSession) {
    track('session_start');
  }
  track('page_view');

  // Heartbeat
  setInterval(() => {
    track('heartbeat');
  }, 30000);

  // SPA Route Change Detection
  let lastUrl = window.location.href;
  const observer = new MutationObserver(() => {
    if (window.location.href !== lastUrl) {
      lastUrl = window.location.href;
      track('page_view');
    }
  });

  observer.observe(document.querySelector('body'), {
    childList: true,
    subtree: true
  });

  // Global API
  window.Kiwiko = {
    identify: (newUserId) => {
      userId = newUserId;
      localStorage.setItem(STORAGE_KEY, userId);
      track('identify', { userId });
    },
    track: (eventName, metadata) => {
      track(eventName, metadata);
    }
  };

  console.log('Kiwiko Tracker: Initialized for project ' + publicKey);
})();
  `.trim();

  return new NextResponse(script, {
    headers: {
      "Content-Type": "application/javascript",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=3600",
    },
  });
}
