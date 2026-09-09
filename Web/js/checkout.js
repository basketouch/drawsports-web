/**
 * Checkout de DrawSports PRO con Paddle.
 *
 * Planes 1/3/5 licencias y add-on para quien ya tiene CutSports Pro activo.
 */
(function () {
  var config = window.DRAWSPORTS_CONFIG || {};
  var esEN = /\/en\//.test(window.location.pathname);
  var botones = Array.prototype.slice.call(document.querySelectorAll("[data-plan-seats]"));
  var addonOffer = document.getElementById("addon-offer");
  var addonBtn = document.querySelector("[data-checkout-addon]");
  var addonStatus = document.getElementById("addon-status");
  var addonPeriodDefault = addonStatus ? addonStatus.textContent : "";

  var params = {};
  try {
    params = new URLSearchParams(window.location.search);
  } catch (_) {}

  var addonMode = params.get("addon") === "1" || !!addonOffer;
  if (!botones.length && !addonMode) return;

  var t = esEN
    ? {
        title: "Buy DrawSports PRO",
        addonTitle: "Add DrawSports to your CutSports Pro",
        lead: "Enter the email you will use to sign in to DrawSports. Your licence is tied to it.",
        addonLead:
          "Enter the same email you use for CutSports Pro on your Mac. We will add DrawSports on iPad to that licence.",
        email: "Email",
        placeholder: "you@email.com",
        cancel: "Cancel",
        continue: "Continue",
        close: "Close",
        invalid: "Enter a valid email.",
        checking: "Checking your licence…",
        addonNoPro: "You need an active CutSports Pro licence with this email.",
        addonHasDrawsports: "You already have DrawSports PRO with this email.",
        addonUnavailable: "Write to help@basketouch.com and we will help you.",
        addonError: "We could not verify your licence. Try again.",
        openPanel: "Open panel",
        packLink: "See Mac + iPad pack",
      }
    : {
        title: "Comprar DrawSports PRO",
        addonTitle: "Añade DrawSports a tu CutSports Pro",
        lead: "Escribe el email con el que entrarás en DrawSports. Tu licencia queda ligada a él.",
        addonLead:
          "Escribe el mismo email con el que activas CutSports Pro en tu Mac. Añadiremos DrawSports en iPad a esa licencia.",
        email: "Email",
        placeholder: "tu@email.com",
        cancel: "Cancelar",
        continue: "Continuar",
        close: "Cerrar",
        invalid: "Introduce un email válido.",
        checking: "Comprobando tu licencia…",
        addonNoPro: "Necesitas CutSports Pro activo con este email.",
        addonHasDrawsports: "Ya tienes DrawSports PRO con este email.",
        addonUnavailable: "Escríbenos a help@basketouch.com y te ayudamos.",
        addonError: "No pudimos comprobar tu licencia. Inténtalo de nuevo.",
        openPanel: "Abrir panel",
        packLink: "Ver pack Mac + iPad",
      };

  var listo =
    typeof Paddle !== "undefined" &&
    config.paddleClientToken &&
    config.prices &&
    Object.keys(config.prices).length;

  var listoAddon = listo && config.priceAddon;

  function urlGracias(plazas, email) {
    var base = esEN ? "/pro/gracias/en/" : "/pro/gracias/";
    var qs = "?seats=" + encodeURIComponent(String(plazas || 1));
    if (emailValido(email)) qs += "&email=" + encodeURIComponent(email);
    return base + qs;
  }

  var ultimoEmailCheckout = "";
  var plazasActuales = 1;
  var intentActual = "plan";

  if (listo || listoAddon) {
    Paddle.Environment.set(config.paddleEnvironment === "sandbox" ? "sandbox" : "production");
    Paddle.Initialize({
      token: config.paddleClientToken,
      eventCallback: function (evento) {
        if (!evento || evento.name !== "checkout.completed") return;
        window.setTimeout(function () {
          window.location.href = urlGracias(plazasActuales, ultimoEmailCheckout);
        }, 1500);
      },
    });
  }

  var modal = null;
  var campo = null;
  var aviso = null;
  var tituloEl = null;
  var leadEl = null;

  function precioDe(plazas) {
    return (config.prices || {})[String(plazas)] || "";
  }

  function emailValido(valor) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(valor || "").trim());
  }

  function crearModal() {
    if (modal) return;
    modal = document.createElement("div");
    modal.className = "ds-modal";
    modal.hidden = true;
    modal.innerHTML =
      '<div class="ds-modal-fondo" data-cerrar></div>' +
      '<div class="ds-modal-caja" role="dialog" aria-modal="true">' +
      '  <button type="button" class="ds-modal-cerrar" data-cerrar aria-label="' + t.close + '">×</button>' +
      '  <h2 id="checkout-modal-title"></h2>' +
      '  <p class="ds-modal-lead" id="checkout-modal-lead"></p>' +
      '  <form class="ds-modal-form" novalidate>' +
      "    <label>" + t.email +
      '      <input type="email" name="email" autocomplete="email" required placeholder="' + t.placeholder + '" />' +
      "    </label>" +
      '    <p class="ds-modal-error" hidden></p>' +
      '    <div class="ds-modal-acciones">' +
      '      <button type="button" class="plan-btn plan-btn-outline" data-cerrar>' + t.cancel + "</button>" +
      '      <button type="submit" class="plan-btn" id="checkout-modal-submit">' + t.continue + "</button>" +
      "    </div>" +
      "  </form>" +
      "</div>";
    document.body.appendChild(modal);

    tituloEl = modal.querySelector("#checkout-modal-title");
    leadEl = modal.querySelector("#checkout-modal-lead");
    campo = modal.querySelector('input[name="email"]');
    aviso = modal.querySelector(".ds-modal-error");

    modal.addEventListener("click", function (e) {
      if (e.target && e.target.hasAttribute("data-cerrar")) cerrar();
    });
    modal.querySelector("form").addEventListener("submit", function (e) {
      e.preventDefault();
      onModalSubmit();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal && !modal.hidden) cerrar();
    });
  }

  function setModalCopy(esAddon) {
    if (tituloEl) tituloEl.textContent = esAddon ? t.addonTitle : t.title;
    if (leadEl) leadEl.textContent = esAddon ? t.addonLead : t.lead;
  }

  function abrir(plazas, esAddon) {
    intentActual = esAddon ? "addon" : "plan";
    plazasActuales = esAddon ? 1 : plazas;
    crearModal();
    setModalCopy(esAddon);
    aviso.hidden = true;
    campo.value = emailValido(emailPrevio) ? emailPrevio : "";
    modal.hidden = false;
    document.body.classList.add("ds-modal-abierto");
    campo.focus();
  }

  function cerrar() {
    if (!modal) return;
    modal.hidden = true;
    document.body.classList.remove("ds-modal-abierto");
  }

  function abrirPaddle(priceId, email, plazas) {
    ultimoEmailCheckout = email;
    plazasActuales = plazas || 1;
    try {
      sessionStorage.setItem("drawsports_checkout_email", email);
    } catch (_) {}
    Paddle.Checkout.open({
      items: [{ priceId: priceId, quantity: 1 }],
      customer: { email: email },
      customData: {
        locale: esEN ? "en" : "es",
        purchase_context: intentActual === "addon" ? "addon" : "plan",
      },
    });
  }

  function checkAddonEligibility(email) {
    if (!config.supabaseUrl || !config.supabaseAnonKey) {
      return Promise.resolve({ ok: true, eligible_for_addon: true, reason: "eligible" });
    }
    var url =
      String(config.supabaseUrl).replace(/\/$/, "") +
      "/functions/v1/check-drawsports-addon-eligibility";
    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + config.supabaseAnonKey,
        apikey: config.supabaseAnonKey,
      },
      body: JSON.stringify({ email: email }),
    }).then(function (response) {
      return response.json().then(function (body) {
        if (!response.ok || !body || body.ok === false) {
          throw new Error((body && body.error) || "eligibility_failed");
        }
        return body;
      });
    });
  }

  function onModalSubmit() {
    var valor = (campo.value || "").trim().toLowerCase();
    if (!emailValido(valor)) {
      aviso.hidden = false;
      aviso.textContent = t.invalid;
      return;
    }

    if (intentActual === "addon") {
      if (!listoAddon) {
        aviso.hidden = false;
        aviso.textContent = t.addonUnavailable;
        return;
      }
      aviso.hidden = true;
      aviso.textContent = t.checking;
      aviso.hidden = false;
      checkAddonEligibility(valor)
        .then(function (result) {
          aviso.hidden = true;
          if (!result.eligible_for_addon) {
            aviso.hidden = false;
            aviso.textContent =
              result.reason === "already_has_drawsports"
                ? t.addonHasDrawsports
                : t.addonNoPro;
            return;
          }
          cerrar();
          abrirPaddle(config.priceAddon, valor, 1);
        })
        .catch(function () {
          aviso.hidden = false;
          aviso.textContent = t.addonError;
        });
      return;
    }

    cerrar();
    abrirPaddle(precioDe(plazasActuales), valor, plazasActuales);
  }

  var emailPrevio = (params.get("email") || "").trim().toLowerCase();

  botones.forEach(function (boton) {
    var plazas = parseInt(boton.getAttribute("data-plan-seats"), 10);
    if (!listo || !precioDe(plazas)) return;
    var comprar = document.createElement("button");
    comprar.type = "button";
    comprar.className = boton.className;
    comprar.textContent = boton.getAttribute("data-plan-label") || boton.textContent;
    comprar.addEventListener("click", function () {
      abrir(plazas, false);
    });
    boton.parentNode.replaceChild(comprar, boton);
  });

  function mostrarAddonOffer(estado, email) {
    if (!addonOffer) return;
    if (addonStatus) {
      if (estado === "checking") addonStatus.textContent = t.checking;
      else if (estado === "eligible") addonStatus.textContent = addonPeriodDefault;
      else if (estado === "no_pro") addonStatus.textContent = t.addonNoPro;
      else if (estado === "has_drawsports") addonStatus.textContent = t.addonHasDrawsports;
      else if (estado === "unavailable") addonStatus.textContent = t.addonUnavailable;
      else addonStatus.textContent = addonPeriodDefault;
    }
    if (addonBtn) {
      addonBtn.disabled = estado !== "eligible" || !listoAddon;
      addonBtn.removeAttribute("data-action");
      if (estado === "has_drawsports") {
        addonBtn.textContent = t.openPanel;
        addonBtn.setAttribute("data-action", "panel");
        addonBtn.onclick = function () {
          window.location.href =
            (config.panelUrl || "https://panel.drawsports.app/") +
            (esEN ? "en/login" : "es/login") +
            (emailValido(email) ? "?email=" + encodeURIComponent(email) : "");
        };
      } else {
        addonBtn.onclick = null;
        addonBtn.textContent = addonBtn.getAttribute("data-plan-label") || addonBtn.textContent;
      }
    }
  }

  if (addonOffer || addonBtn) {
    if (!listoAddon) {
      if (addonBtn) addonBtn.disabled = true;
    } else if (emailValido(emailPrevio)) {
      mostrarAddonOffer("checking");
      checkAddonEligibility(emailPrevio)
        .then(function (result) {
          if (result.eligible_for_addon) mostrarAddonOffer("eligible", emailPrevio);
          else if (result.reason === "already_has_drawsports")
            mostrarAddonOffer("has_drawsports", emailPrevio);
          else mostrarAddonOffer("no_pro", emailPrevio);
        })
        .catch(function () {
          if (addonStatus) addonStatus.textContent = t.addonError;
        });
    } else {
      mostrarAddonOffer(listoAddon ? "eligible" : "unavailable");
    }
  }

  if (addonBtn) {
    addonBtn.addEventListener("click", function () {
      if (addonBtn.getAttribute("data-action") === "panel") return;
      if (!listoAddon || addonBtn.disabled) return;
      abrir(1, true);
    });
  }

  if (params.get("addon") === "1" && addonOffer) {
    try {
      addonOffer.scrollIntoView({ behavior: "smooth", block: "center" });
    } catch (_) {}
  }
})();
