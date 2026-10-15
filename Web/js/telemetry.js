/**
 * Medición propia y anónima de visitas de drawsports.app.
 *
 * Solo funciona si la persona ha pulsado «Aceptar» en el aviso de cookies. Sin publicidad ni terceros: los
 * eventos van al mismo sistema propio que usa cutsports.app (Supabase, UE). Guarda un identificador aleatorio
 * de visitante (localStorage, hasta 13 meses) y otro de sesión (sessionStorage). Si rechaza o retira el
 * consentimiento, se borran ambos y no se envía nada.
 */
(function () {
  var CONSENT_KEY = "drawsports.cookieConsent";
  var ANON_KEY = "drawsports_telemetry_anon";
  var SESSION_KEY = "drawsports_telemetry_session";
  var SESSION_AT_KEY = "drawsports_telemetry_session_at";
  var ANON_MAX_MS = 395 * 24 * 60 * 60 * 1000; // 13 meses
  var SESSION_MS = 30 * 60 * 1000;
  var started = false;
  var clickBound = false;

  function consented() {
    try {
      return window.localStorage.getItem(CONSENT_KEY) === "accepted";
    } catch (_) {
      return false;
    }
  }

  function config() {
    var c = window.DRAWSPORTS_CONFIG || {};
    return c.supabaseUrl && c.supabaseAnonKey ? c : null;
  }

  function uuid() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") return window.crypto.randomUUID();
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (ch) {
      var r = (Math.random() * 16) | 0;
      return (ch === "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
  }

  function anonymousId() {
    try {
      var raw = JSON.parse(window.localStorage.getItem(ANON_KEY) || "null");
      if (raw && /^[0-9a-f-]{36}$/i.test(raw.id) && Date.now() - raw.at < ANON_MAX_MS) return raw.id;
      var fresh = { id: uuid(), at: Date.now() };
      window.localStorage.setItem(ANON_KEY, JSON.stringify(fresh));
      return fresh.id;
    } catch (_) {
      return uuid();
    }
  }

  function sessionId() {
    var now = Date.now();
    try {
      var id = window.sessionStorage.getItem(SESSION_KEY);
      var at = Number(window.sessionStorage.getItem(SESSION_AT_KEY) || 0);
      if (id && /^[0-9a-f-]{36}$/i.test(id) && at && now - at < SESSION_MS) {
        window.sessionStorage.setItem(SESSION_AT_KEY, String(now));
        return id;
      }
      id = uuid();
      window.sessionStorage.setItem(SESSION_KEY, id);
      window.sessionStorage.setItem(SESSION_AT_KEY, String(now));
      return id;
    } catch (_) {
      return uuid();
    }
  }

  function erase() {
    try {
      window.localStorage.removeItem(ANON_KEY);
      window.sessionStorage.removeItem(SESSION_KEY);
      window.sessionStorage.removeItem(SESSION_AT_KEY);
    } catch (_) {}
  }

  function pageKind() {
    var path = (window.location.pathname || "/").toLowerCase();
    if (path === "/" || path === "/en" || path === "/en/") return "home";
    if (path.indexOf("/pro/planes") === 0) return "pricing";
    return null; // legales, gracias, etc.: no se miden
  }

  function referrerKind() {
    var ref = document.referrer || "";
    if (!ref) return "direct";
    try {
      var host = new URL(ref).hostname.toLowerCase();
      if (host.indexOf("drawsports.app") !== -1) return "direct";
      if (/(google\.|bing\.|duckduckgo\.)/.test(host)) return "search";
      if (/(instagram\.|twitter\.|x\.com|linkedin\.|facebook\.|youtube\.|tiktok\.)/.test(host)) return "social";
      if (/(mail\.|newsletter)/.test(host)) return "email";
      return "referral";
    } catch (_) {
      return "other";
    }
  }

  function send(eventName, properties) {
    var cfg = config();
    if (!cfg || !consented()) return;
    var attr = window.DrawSportsAttribution ? window.DrawSportsAttribution.get() : {};
    var context = { locale: /\/en(\/|$)/.test(window.location.pathname) ? "en" : "es", app_build: "drawsports-web" };
    ["utm_source", "utm_medium", "utm_campaign"].forEach(function (key) {
      if (attr[key]) context[key] = attr[key];
    });
    if (attr.utm_content) context.referral_source = attr.utm_content;
    var body = {
      events: [
        {
          event_id: uuid(),
          contract_version: 1,
          event_name: eventName,
          source: "web",
          occurred_at: new Date().toISOString(),
          anonymous_id: anonymousId(),
          session_id: sessionId(),
          properties: properties || {},
          context: context,
        },
      ],
    };
    try {
      fetch(String(cfg.supabaseUrl).replace(/\/$/, "") + "/functions/v1/cutsports-event-ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + cfg.supabaseAnonKey, apikey: cfg.supabaseAnonKey },
        body: JSON.stringify(body),
        keepalive: true,
      }).catch(function () {});
    } catch (_) {}
  }

  function start() {
    if (started || !consented() || !config()) return;
    started = true;
    var kind = pageKind();
    if (kind) {
      send("page_viewed", { page_kind: kind, referrer_kind: referrerKind() });
      if (kind === "pricing") send("pricing_viewed", { plan_context: "unknown" });
    }
    if (clickBound) return;
    clickBound = true;
    document.addEventListener(
      "click",
      function (event) {
        var target = event.target && event.target.closest ? event.target.closest("a[href]") : null;
        var kindNow = pageKind() || "other";
        if (target) {
          var href = target.getAttribute("href") || "";
          if (href.indexOf("apps.apple.com") !== -1) {
            send("download_clicked", { page_kind: kindNow });
            send("cta_clicked", { cta_name: "download", page_kind: kindNow });
          } else if (href.indexOf("cutsports.app/pricing") !== -1) {
            send("cta_clicked", { cta_name: "pricing", page_kind: kindNow });
          }
        }
        if (event.target && event.target.closest && event.target.closest("[data-plan-seats], [data-checkout-addon]")) {
          send("cta_clicked", { cta_name: "pricing", page_kind: kindNow });
        }
      },
      true
    );
  }

  window.addEventListener("drawsports:consent", function (event) {
    var value = event && event.detail ? event.detail.value : null;
    if (value === "accepted") start();
    else {
      erase();
      started = false;
    }
  });

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
