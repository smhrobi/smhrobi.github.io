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

/* Dropdown navigation. The open state is a class set here rather than left to
   :hover and :focus-within alone, so pointer, keyboard and touch all drive one
   explicit state; the CSS keeps matching rules for both pseudo-classes, which
   is what runs if this file never loads. */
(function () {
  "use strict";

  var coarse = window.matchMedia && window.matchMedia("(hover: none)").matches;
  var drops = Array.prototype.slice.call(document.querySelectorAll(".nd"));

  function closeAll(except) {
    drops.forEach(function (d) { if (d !== except) d.classList.remove("is-open"); });
  }

  /* Measured each time it opens, not once up front: the nav reflows after the
     webfonts land, and a panel past the window edge would be unreachable. */
  function place(d) {
    var m = d.querySelector(".nd__m");
    if (!m) return;
    m.classList.remove("is-left", "is-right");
    var b = m.getBoundingClientRect(), pad = 12;
    if (b.left < pad) m.classList.add("is-left");
    else if (b.right > window.innerWidth - pad) m.classList.add("is-right");
  }

  function open(d) { closeAll(d); d.classList.add("is-open"); place(d); }
  function shut(d) { d.classList.remove("is-open"); }

  drops.forEach(function (d) {
    var top = d.querySelector(":scope > a");
    if (!top) return;
    if (!coarse) {
      d.addEventListener("mouseenter", function () { open(d); });
      d.addEventListener("mouseleave", function () { shut(d); });
    }
    d.addEventListener("focusin", function () { open(d); });
    d.addEventListener("focusout", function (e) {
      if (!d.contains(e.relatedTarget)) shut(d);
    });
    top.addEventListener("click", function (e) {
      if (!coarse) return;
      if (!d.classList.contains("is-open")) { e.preventDefault(); open(d); }
    });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape" && e.keyCode !== 27) return;
    var f = document.querySelector(".nd.is-open :focus");
    closeAll(null);
    if (f && f.blur) f.blur();
  });

  document.addEventListener("click", function (e) {
    if (!e.target.closest || !e.target.closest(".nd")) closeAll(null);
  });

  /* Only a real width change closes them: a bare resize listener also fires
     when a phone hides its address bar. */
  var lastW = window.innerWidth;
  window.addEventListener("resize", function () {
    if (window.innerWidth === lastW) return;
    lastW = window.innerWidth;
    closeAll(null);
  });

  /* ---- the mobile panel ---- */
  var btn = document.getElementById("menuBtn");
  var panel = document.getElementById("mnav");

  if (btn && panel) {
    btn.addEventListener("click", function () {
      var on = panel.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", on ? "true" : "false");
    });
  }

  Array.prototype.forEach.call(document.querySelectorAll(".mn__c"), function (c) {
    c.addEventListener("click", function () {
      var m = document.getElementById(c.getAttribute("aria-controls"));
      if (!m) return;
      var on = m.classList.toggle("is-open");
      c.setAttribute("aria-expanded", on ? "true" : "false");
    });
  });

  if (panel) {
    panel.addEventListener("click", function (e) {
      var a = e.target.closest ? e.target.closest("a") : null;
      if (!a) return;
      var href = a.getAttribute("href") || "";
      var here = (location.pathname.split("/").pop() || "index.html").toLowerCase();
      var file = href.split("#")[0].toLowerCase();
      if (href.charAt(0) === "#" || file === "" || file === here) {
        panel.classList.remove("is-open");
        if (btn) btn.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* The philosophy essays are <details>. A menu link to one has to open it,
     or the jump lands on a collapsed summary and looks like it did nothing. */
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
