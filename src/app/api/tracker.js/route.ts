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
    console.warn('Kiwiko Tracker: data-project attribute missing');
    return;
  }

  const config = {
    publicKey: publicKey,
    STORAGE_KEY: 'kiwiko_user_id',
    SESSION_KEY: 'kiwiko_session_id',
    isNewUser: false,
    isNewSession: false
  };

  function getUuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  let userId = localStorage.getItem(config.STORAGE_KEY);
  if (!userId) {
    userId = 'user_' + getUuid();
    localStorage.setItem(config.STORAGE_KEY, userId);
    config.isNewUser = true;
  }

  let sessionId = sessionStorage.getItem(config.SESSION_KEY);
  if (!sessionId) {
    sessionId = 'sess_' + getUuid();
    sessionStorage.setItem(config.SESSION_KEY, sessionId);
    config.isNewSession = true;
  }

  function track(eventName, metadata = {}) {
    try {
      const payload = {
        publicKey: config.publicKey,
        userId: userId,
        sessionId: sessionId,
        eventName: eventName,
        url: window.location.href,
        metadata: {
          ...metadata,
          visitorType: config.isNewUser ? 'new' : 'returning'
        },
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
    } catch (e) {
      console.error('Kiwiko Tracker Error:', e);
    }
  }

  // Initial events
  if (config.isNewSession) {
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

  if (document.body) {
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // Global API
  window.Kiwiko = {
    identify: (newUserId) => {
      userId = newUserId;
      localStorage.setItem(config.STORAGE_KEY, userId);
      track('identify', { userId });
    },
    track: (eventName, metadata) => {
      track(eventName, metadata);
    }
  };

  console.log('Kiwiko Tracker: Initialized for project ' + config.publicKey);
})();
  `.trim();

  return new NextResponse(script, {
    headers: {
      "Content-Type": "application/javascript",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=3600",
    },
  });
}
