/**
 * Checkout de DrawSports PRO con Paddle.
 *
 * Pide el email antes de abrir el pago porque es la pieza que une el cobro con
 * la cuenta: el webhook `paddle-webhook` crea la organización y da acceso PRO a
 * ese mismo correo, y con él se entra en la app y en el panel.
 *
 * Si falta el token o el precio del tramo, el botón se queda como consulta por
 * email en vez de romperse.
 */
(function () {
  var config = window.DRAWSPORTS_CONFIG || {};
  var esEN = /\/en\//.test(window.location.pathname);
  var botones = Array.prototype.slice.call(document.querySelectorAll("[data-plan-seats]"));
  if (!botones.length) return;

  var t = esEN
    ? {
        title: "Buy DrawSports PRO",
        lead: "Enter the email you will use to sign in to DrawSports. Your licence is tied to it.",
        email: "Email",
        placeholder: "you@email.com",
        cancel: "Cancel",
        continue: "Continue",
        close: "Close",
        invalid: "Enter a valid email.",
        seats: "licences",
        seat: "licence",
      }
    : {
        title: "Comprar DrawSports PRO",
        lead: "Escribe el email con el que entrarás en DrawSports. Tu licencia queda ligada a él.",
        email: "Email",
        placeholder: "tu@email.com",
        cancel: "Cancelar",
        continue: "Continuar",
        close: "Cerrar",
        invalid: "Introduce un email válido.",
        seats: "licencias",
        seat: "licencia",
      };

  var listo =
    typeof Paddle !== "undefined" && config.paddleClientToken && config.prices;

  if (listo) {
    Paddle.Environment.set(config.paddleEnvironment === "sandbox" ? "sandbox" : "production");
    Paddle.Initialize({
      token: config.paddleClientToken,
      eventCallback: function (evento) {
        if (!evento || evento.name !== "checkout.completed") return;
        window.setTimeout(function () {
          window.location.href = (config.panelUrl || "https://panel.drawsports.app/") + "?comprado=1";
        }, 1500);
      },
    });
  }

  var modal = null;
  var campo = null;
  var aviso = null;
  var plazasActuales = null;

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
      "  <h2>" + t.title + "</h2>" +
      '  <p class="ds-modal-lead">' + t.lead + "</p>" +
      '  <form class="ds-modal-form" novalidate>' +
      "    <label>" + t.email +
      '      <input type="email" name="email" autocomplete="email" required placeholder="' + t.placeholder + '" />' +
      "    </label>" +
      '    <p class="ds-modal-error" hidden></p>' +
      '    <div class="ds-modal-acciones">' +
      '      <button type="button" class="plan-btn plan-btn-outline" data-cerrar>' + t.cancel + "</button>" +
      '      <button type="submit" class="plan-btn">' + t.continue + "</button>" +
      "    </div>" +
      "  </form>" +
      "</div>";
    document.body.appendChild(modal);

    campo = modal.querySelector('input[name="email"]');
    aviso = modal.querySelector(".ds-modal-error");

    modal.addEventListener("click", function (e) {
      if (e.target && e.target.hasAttribute("data-cerrar")) cerrar();
    });
    modal.querySelector("form").addEventListener("submit", function (e) {
      e.preventDefault();
      var valor = (campo.value || "").trim().toLowerCase();
      if (!emailValido(valor)) {
        aviso.hidden = false;
        aviso.textContent = t.invalid;
        return;
      }
      cerrar();
      abrirPaddle(plazasActuales, valor);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal && !modal.hidden) cerrar();
    });
  }

  function abrir(plazas) {
    plazasActuales = plazas;
    crearModal();
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

  function abrirPaddle(plazas, email) {
    Paddle.Checkout.open({
      items: [{ priceId: precioDe(plazas), quantity: 1 }],
      customer: { email: email },
      customData: { locale: esEN ? "en" : "es" },
    });
  }

  // El panel enlaza con ?email=… para no volver a pedirlo.
  var emailPrevio = "";
  try {
    emailPrevio = (new URLSearchParams(window.location.search).get("email") || "").trim().toLowerCase();
  } catch (_) {}

  botones.forEach(function (boton) {
    var plazas = parseInt(boton.getAttribute("data-plan-seats"), 10);
    if (!listo || !precioDe(plazas)) return; // se queda el enlace de consulta
    var comprar = document.createElement("button");
    comprar.type = "button";
    comprar.className = boton.className;
    comprar.textContent = boton.getAttribute("data-plan-label") || boton.textContent;
    comprar.addEventListener("click", function () {
      abrir(plazas);
    });
    boton.parentNode.replaceChild(comprar, boton);
  });
})();
