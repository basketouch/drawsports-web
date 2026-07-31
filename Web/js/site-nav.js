(function () {
  var headerInner = document.querySelector(".site-header .container, .site-header .container-wide");
  if (!headerInner) return;

  var header = headerInner.closest(".site-header");
  var nav = headerInner.querySelector(".nav");
  if (!header || !nav || headerInner.querySelector("[data-nav-toggle]")) return;

  nav.id = nav.id || "site-nav";

  var toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "nav-toggle";
  toggle.setAttribute("data-nav-toggle", "");
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-controls", nav.id);
  toggle.setAttribute("aria-label", "Abrir menú");
  toggle.innerHTML =
    '<svg class="nav-toggle-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
    '<path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
    "</svg>";

  headerInner.insertBefore(toggle, nav);

  function setOpen(open) {
    header.classList.toggle("is-nav-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    document.body.classList.toggle("nav-menu-open", open);
  }

  function closeMenu() {
    setOpen(false);
  }

  toggle.addEventListener("click", function () {
    setOpen(!header.classList.contains("is-nav-open"));
  });

  nav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeMenu();
  });

  document.addEventListener("click", function (event) {
    if (!header.classList.contains("is-nav-open")) return;
    if (header.contains(event.target)) return;
    closeMenu();
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 640) closeMenu();
  });
})();
