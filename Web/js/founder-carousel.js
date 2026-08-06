(function () {
  function initCarousel(root) {
    var slides = root.querySelectorAll("[data-founder-slide]");
    var dotsWrap = root.querySelector("[data-founder-dots]");
    var captionEl = root.querySelector("[data-founder-caption]");
    var dots = dotsWrap ? dotsWrap.querySelectorAll("button") : [];
    if (!slides.length) return;

    var idx = 0;
    var timer = null;

    function captionFor(i) {
      var slide = slides[i];
      return (slide && slide.getAttribute("data-caption")) || "";
    }

    function show(next) {
      idx = ((next % slides.length) + slides.length) % slides.length;
      for (var i = 0; i < slides.length; i++) {
        var active = i === idx;
        slides[i].classList.toggle("is-active", active);
        slides[i].hidden = !active;
        if (dots[i]) dots[i].classList.toggle("is-active", active);
      }
      if (captionEl) captionEl.textContent = captionFor(idx);
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(idx + 1);
      }, 7000);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    for (var d = 0; d < dots.length; d++) {
      (function (dotIndex) {
        dots[dotIndex].addEventListener("click", function () {
          show(dotIndex);
          start();
        });
      })(d);
    }

    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", start);

    show(0);
    start();
  }

  function init() {
    var carousels = document.querySelectorAll("[data-founder-carousel]");
    for (var i = 0; i < carousels.length; i++) {
      initCarousel(carousels[i]);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
