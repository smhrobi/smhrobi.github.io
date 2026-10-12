// Theme toggle, entrance reveal, nav scroll-spy, philosophy language toggle.
(function () {
  var root = document.documentElement;
  var KEY = "smh-theme";
  try { var saved = localStorage.getItem(KEY); if (saved === "light" || saved === "dark") root.setAttribute("data-theme", saved); } catch (e) {}
  function current() { var a = root.getAttribute("data-theme"); if (a) return a; return (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) ? "dark" : "light"; }
  var btn = document.getElementById("themeBtn");
  function paint() { if (btn) btn.textContent = current() === "dark" ? "○" : "●"; }
  paint();
  if (btn) btn.addEventListener("click", function () { var n = current() === "dark" ? "light" : "dark"; root.setAttribute("data-theme", n); try { localStorage.setItem(KEY, n); } catch (e) {} paint(); });

  requestAnimationFrame(function () { requestAnimationFrame(function () { document.body.classList.add("is-ready"); }); });

  var links = Array.prototype.slice.call(document.querySelectorAll(".nav a[href^='#']"));
  var map = {}; links.forEach(function (a) { var id = a.getAttribute("href").slice(1); var s = document.getElementById(id); if (s) map[id] = a; });
  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { links.forEach(function (l) { l.classList.remove("active"); }); if (map[en.target.id]) map[en.target.id].classList.add("active"); } });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(map).forEach(function (id) { spy.observe(document.getElementById(id)); });
  }
})();
(function(){document.querySelectorAll(".writings .langbar").forEach(function(bar){bar.addEventListener("click",function(e){var b=e.target.closest(".lang-btn");if(!b)return;var body=bar.closest(".ebody"),l=b.getAttribute("data-l");bar.querySelectorAll(".lang-btn").forEach(function(x){x.classList.toggle("is-on",x===b);});body.querySelectorAll(".pane").forEach(function(p){p.hidden=!p.classList.contains("pane-"+l);});});});})();

/* The phone menu: one button, one list of pages. Above 760px the CSS hides both
   and the plain row of links in the topbar does the work. */
(function () {
  "use strict";

  var btn = document.getElementById("menuBtn");
  var panel = document.getElementById("mnav");

  if (btn && panel) {
    var set = function (open) {
      panel.classList.toggle("is-open", open);
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    };

    btn.addEventListener("click", function () {
      set(!panel.classList.contains("is-open"));
    });
    panel.addEventListener("click", function (e) {
      if (e.target.closest && e.target.closest("a")) set(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" || e.keyCode === 27) set(false);
    });
    document.addEventListener("click", function (e) {
      if (!panel.classList.contains("is-open")) return;
      if (e.target.closest && !e.target.closest("#mnav, #menuBtn")) set(false);
    });

    /* Only a real width change closes it: a bare resize listener also fires
       when a phone hides its address bar. */
    var lastW = window.innerWidth;
    window.addEventListener("resize", function () {
      if (window.innerWidth === lastW) return;
      lastW = window.innerWidth;
      set(false);
    });
  }

  /* The philosophy essays are <details>. A link that targets one has to open
     it, or the jump lands on a collapsed summary and looks like it did
     nothing. */
  function revealTarget() {
    var id = location.hash.slice(1);
    if (!id) return;
    var el = document.getElementById(id);
    if (!el || el.tagName !== "DETAILS" || el.open) return;
    el.open = true;
    el.scrollIntoView({ block: "start", behavior: "auto" });
  }
  window.addEventListener("hashchange", revealTarget);
  revealTarget();
})();
