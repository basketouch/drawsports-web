/**
 * Aviso de cookies de drawsports.app.
 *
 * Sin elección, la analítica propia (js/telemetry.js) NO se activa. El aviso guarda la decisión en
 * localStorage y avisa a quien la escuche con el evento «drawsports:consent».
 * Cualquier elemento con data-cookie-settings reabre el aviso para cambiar de decisión.
 */
(function () {
  var KEY = "drawsports.cookieConsent";
  var en = /\/en(\/|$)/.test(window.location.pathname);
  var t = en
    ? {
        body: "We use cookies to make the site work and, if you accept, to measure visits. ",
        more: "More information",
        reject: "Reject",
        accept: "Accept",
        aria: "Cookie notice",
        path: "/en/legal/cookies/",
      }
    : {
        body: "Usamos cookies para que la web funcione y, si aceptas, para medir visitas. ",
        more: "Más información",
        reject: "Rechazar",
        accept: "Aceptar",
        aria: "Aviso de cookies",
        path: "/legal/cookies/",
      };

  function get() {
    try {
      return window.localStorage.getItem(KEY);
    } catch (_) {
      return null;
    }
  }

  function set(value) {
    try {
      if (value) window.localStorage.setItem(KEY, value);
      else window.localStorage.removeItem(KEY);
    } catch (_) {}
    try {
      window.dispatchEvent(new CustomEvent("drawsports:consent", { detail: { value: value } }));
    } catch (_) {}
  }

  window.DrawSportsConsent = {
    get: get,
    accepted: function () {
      return get() === "accepted";
    },
    reopen: function () {
      set(null);
      show();
    },
  };

  function injectStyles() {
    if (document.getElementById("ds-cookie-style")) return;
    var style = document.createElement("style");
    style.id = "ds-cookie-style";
    style.textContent =
      ".ds-cookie{position:fixed;left:1rem;right:1rem;bottom:1rem;z-index:1000;display:flex;justify-content:center;pointer-events:none}" +
      ".ds-cookie-inner{pointer-events:auto;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:1rem;width:min(42rem,100%);padding:1.1rem 1.25rem;background:rgba(20,22,28,.97);color:#e8eaf0;border:1px solid rgba(255,255,255,.14);border-radius:12px;box-shadow:0 16px 48px rgba(0,0,0,.45)}" +
      ".ds-cookie p{margin:0;flex:1 1 15rem;font-size:.9rem;line-height:1.5;color:#c4c9d4}" +
      ".ds-cookie a{color:#fff;text-decoration:underline;text-underline-offset:3px}" +
      ".ds-cookie-actions{display:flex;gap:.65rem;flex-shrink:0}" +
      ".ds-cookie button{padding:.55rem 1rem;border-radius:8px;font:inherit;font-size:.88rem;font-weight:600;cursor:pointer;border:1px solid rgba(255,255,255,.28);background:transparent;color:#fff}" +
      ".ds-cookie button:hover{background:rgba(255,255,255,.08)}";
    document.head.appendChild(style);
  }

  function show() {
    if (document.querySelector(".ds-cookie")) return;
    injectStyles();
    var banner = document.createElement("div");
    banner.className = "ds-cookie";
    banner.setAttribute("role", "region");
    banner.setAttribute("aria-label", t.aria);
    banner.innerHTML =
      '<div class="ds-cookie-inner"><p>' + t.body + '<a href="' + t.path + '">' + t.more + "</a>.</p>" +
      '<div class="ds-cookie-actions">' +
      '<button type="button" data-cookie-reject>' + t.reject + "</button>" +
      '<button type="button" data-cookie-accept>' + t.accept + "</button>" +
      "</div></div>";
    document.body.appendChild(banner);
    banner.querySelector("[data-cookie-accept]").addEventListener("click", function () {
      set("accepted");
      banner.remove();
    });
    banner.querySelector("[data-cookie-reject]").addEventListener("click", function () {
      set("rejected");
      banner.remove();
    });
  }

  function boot() {
    document.addEventListener("click", function (event) {
      var target = event.target && event.target.closest ? event.target.closest("[data-cookie-settings]") : null;
      if (target) {
        event.preventDefault();
        window.DrawSportsConsent.reopen();
      }
    });
    if (!get()) show();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
