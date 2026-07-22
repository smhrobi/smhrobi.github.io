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
