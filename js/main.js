(function(){
  "use strict";

  var LANG_KEY = "idolvpn-lang";
  var THEME_KEY = "idolvpn-theme";
  var root = document.documentElement;

  /* ---------------- language ---------------- */
  function applyLang(lang){
    var dict = window.I18N[lang] || window.I18N.fa;
    root.lang = lang;
    root.dir = lang === "fa" ? "rtl" : "ltr";

    document.querySelectorAll("[data-i18n]").forEach(function(el){
      var key = el.getAttribute("data-i18n");
      if (dict[key] !== undefined) el.textContent = dict[key];
    });

    document.querySelectorAll("[data-i18n-attr]").forEach(function(el){
      el.getAttribute("data-i18n-attr").split(";").forEach(function(pair){
        var parts = pair.split(":");
        if (parts.length !== 2) return;
        var attr = parts[0].trim(), key = parts[1].trim();
        if (dict[key] !== undefined) el.setAttribute(attr, dict[key]);
      });
    });

    var langBtn = document.getElementById("langToggle");
    if (langBtn) langBtn.textContent = lang === "fa" ? "FA / EN" : "EN / FA";

    document.title = dict["meta.title"];
    localStorage.setItem(LANG_KEY, lang);

    // let other modules (posts feed) know so they can re-render in the new language
    document.dispatchEvent(new CustomEvent("idolvpn:lang", { detail: { lang: lang } }));
  }

  function initLang(){
    var saved = localStorage.getItem(LANG_KEY);
    var lang = saved || "fa";
    applyLang(lang);

    var btn = document.getElementById("langToggle");
    if (btn) btn.addEventListener("click", function(){
      applyLang(root.lang === "fa" ? "en" : "fa");
    });
  }

  /* ---------------- theme ---------------- */
  function applyTheme(theme){
    root.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
    var sun = document.getElementById("themeIconSun");
    var moon = document.getElementById("themeIconMoon");
    if (sun && moon){
      sun.style.display = theme === "dark" ? "block" : "none";
      moon.style.display = theme === "dark" ? "none" : "block";
    }
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#070B18" : "#F4F7FC");
  }

  function initTheme(){
    var saved = localStorage.getItem(THEME_KEY);
    var prefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
    var theme = saved || (prefersLight ? "light" : "dark");
    applyTheme(theme);

    var btn = document.getElementById("themeToggle");
    if (btn) btn.addEventListener("click", function(){
      applyTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
    });
  }

  /* ---------------- scroll reveal ---------------- */
  function initReveal(){
    var els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window) || !els.length){
      els.forEach(function(el){ el.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting){
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold:.15, rootMargin:"0px 0px -40px 0px" });
    els.forEach(function(el){ io.observe(el); });
  }

  /* ---------------- speed-test iframe fallback ---------------- */
  function initSpeedFrame(){
    var frame = document.getElementById("speedFrame");
    var fallback = document.getElementById("speedFallback");
    if (!frame || !fallback) return;

    var settled = false;
    var timer = setTimeout(function(){
      if (!settled){ fallback.classList.add("show"); }
    }, 4500);

    frame.addEventListener("load", function(){
      settled = true;
      clearTimeout(timer);
      // a same-origin check would throw if the frame refused to embed (X-Frame-Options);
      // cross-origin access always throws here even on success, so we only use the
      // load event as a best-effort signal and keep the timeout as the real safety net.
    });

    frame.addEventListener("error", function(){
      settled = true;
      clearTimeout(timer);
      fallback.classList.add("show");
    });
  }

  /* ---------------- mobile nav ---------------- */
  function initMobileNav(){
    var burger = document.getElementById("navBurger");
    var links = document.querySelector(".nav-links");
    if (!burger || !links) return;

    function close(){
      links.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
    }
    burger.addEventListener("click", function(){
      var isOpen = links.classList.toggle("open");
      burger.setAttribute("aria-expanded", String(isOpen));
    });
    links.querySelectorAll("a").forEach(function(a){
      a.addEventListener("click", close);
    });
  }

  /* ---------------- misc ---------------- */
  function initYear(){
    var y = document.getElementById("year");
    if (y) y.textContent = new Date().getFullYear();
  }

  document.addEventListener("DOMContentLoaded", function(){
    initLang();
    initTheme();
    initReveal();
    initSpeedFrame();
    initMobileNav();
    initYear();
  });
})();
