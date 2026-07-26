(function(){
  "use strict";

  var feedEl = document.getElementById("feedList");
  var updatedEl = document.getElementById("feedUpdatedAt");
  if (!feedEl) return;

  var state = { posts: null, updatedAt: null, failed: false };

  function fmtDate(iso, lang){
    if (!iso) return "";
    try{
      var d = new Date(iso);
      if (lang === "fa"){
        return new Intl.DateTimeFormat("fa-IR-u-ca-persian", { month:"short", day:"numeric" }).format(d);
      }
      return new Intl.DateTimeFormat("en-US", { month:"short", day:"numeric" }).format(d);
    }catch(e){ return ""; }
  }

  function fmtUpdated(iso, lang){
    if (!iso) return "—";
    try{
      var d = new Date(iso);
      var opts = { year:"numeric", month:"short", day:"numeric", hour:"2-digit", minute:"2-digit" };
      if (lang === "fa") return new Intl.DateTimeFormat("fa-IR-u-ca-persian", opts).format(d);
      return new Intl.DateTimeFormat("en-US", opts).format(d);
    }catch(e){ return iso; }
  }

  function escapeHtml(s){
    return (s || "").replace(/[&<>"']/g, function(c){
      return { "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c];
    });
  }

  function render(){
    var lang = document.documentElement.lang === "en" ? "en" : "fa";
    var dict = window.I18N[lang];

    if (updatedEl) updatedEl.textContent = fmtUpdated(state.updatedAt, lang);

    if (state.failed || !state.posts || !state.posts.length){
      feedEl.innerHTML = '<div class="feed-empty">' + escapeHtml(dict["posts.empty"]) + "</div>";
      return;
    }

    var openLabel = dict["posts.open"];
    feedEl.innerHTML = state.posts.map(function(post){
      var text = escapeHtml(post.text || "").slice(0, 220);
      return (
        '<a class="feed-item" href="' + escapeHtml(post.link || "https://t.me/Idolvpn") + '" target="_blank" rel="noopener">' +
          '<span class="feed-date">' + escapeHtml(fmtDate(post.date, lang)) + "</span>" +
          '<span class="feed-text">' + text + "</span>" +
          '<span class="feed-open">' + escapeHtml(openLabel) + " ↗</span>" +
        "</a>"
      );
    }).join("");
  }

  function load(){
    fetch("data/posts.json", { cache: "no-store" })
      .then(function(res){ if (!res.ok) throw new Error("bad status"); return res.json(); })
      .then(function(data){
        state.posts = Array.isArray(data.posts) ? data.posts.slice(0, 8) : [];
        state.updatedAt = data.updated_at || null;
        render();
      })
      .catch(function(){
        state.failed = true;
        render();
      });
  }

  document.addEventListener("DOMContentLoaded", load);
  document.addEventListener("idolvpn:lang", render);
})();

