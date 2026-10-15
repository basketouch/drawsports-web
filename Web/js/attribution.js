/**
 * Atribución de campañas (UTM) de drawsports.app.
 *
 * Sin cookies y sin enviar nada a ningún servidor: lee utm_* de la URL, los guarda solo mientras dura la
 * pestaña (sessionStorage) y los propaga a los enlaces internos, a cutsports.app y a la App Store, y al checkout
 * de Paddle (window.DrawSportsAttribution.get()). Así el Hub puede atribuir la compra a la campaña.
 */
(function () {
  var KEY = "drawsports_attribution";
  var RE = /^[a-z0-9][a-z0-9_-]{0,119}$/;
  var UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content"];

  function normalize(value) {
    if (value == null) return "";
    var v = String(value).trim().toLowerCase().replace(/\s+/g, "_");
    return v && RE.test(v) ? v : "";
  }

  function read() {
    try {
      var parsed = JSON.parse(sessionStorage.getItem(KEY) || "{}");
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch (_) {
      return {};
    }
  }

  function capture() {
    var attr = read();
    try {
      var params = new URLSearchParams(window.location.search || "");
      UTM_KEYS.forEach(function (key) {
        var value = normalize(params.get(key));
        if (value) attr[key] = value;
      });
      sessionStorage.setItem(KEY, JSON.stringify(attr));
    } catch (_) {}
    return attr;
  }

  var attribution = capture();

  window.DrawSportsAttribution = {
    get: function () {
      var out = {};
      UTM_KEYS.forEach(function (key) {
        if (attribution[key]) out[key] = attribution[key];
      });
      return out;
    },
  };

  if (!attribution.utm_campaign && !attribution.utm_source) return;

  function appStoreCampaign() {
    return [attribution.utm_campaign, attribution.utm_source, attribution.utm_medium, attribution.utm_content]
      .filter(Boolean)
      .join("_")
      .slice(0, 40);
  }

  function decorate(link) {
    var href = link.getAttribute("href");
    if (!href || href.charAt(0) === "#" || /^(mailto|tel|javascript):/i.test(href)) return;
    var url;
    try {
      url = new URL(href, window.location.href);
    } catch (_) {
      return;
    }
    var host = url.hostname.toLowerCase();
    if (host === "apps.apple.com") {
      if (!url.searchParams.has("ct")) url.searchParams.set("ct", appStoreCampaign());
    } else if (host === window.location.hostname || host === "drawsports.app" || host === "cutsports.app") {
      UTM_KEYS.forEach(function (key) {
        if (attribution[key] && !url.searchParams.has(key)) url.searchParams.set(key, attribution[key]);
      });
    } else {
      return;
    }
    link.setAttribute("href", url.toString());
  }

  function run() {
    Array.prototype.forEach.call(document.querySelectorAll("a[href]"), decorate);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run);
  else run();
})();
