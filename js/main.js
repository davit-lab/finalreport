/* ============================================================
   ვინილის მხარე B — რენდერი და ინტერაქცია
   ეს ფაილი აწყობს გვერდს data.js-ის ტექსტებიდან.
   ტექსტის შესაცვლელად შედი data.js-ში — აქ ხელის ხლება არ არის საჭირო.
   ============================================================ */
(function () {
  "use strict";
  var D = window.SITE;
  var $ = function (s, r) { return (r || document).querySelector(s); };

  /* ---------- დამხმარე ---------- */
  function esc(t) {
    return String(t == null ? "" : t)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function paras(arr) { return (arr || []).map(function (p) { return "<p>" + esc(p) + "</p>"; }).join(""); }

  /* ---------- ფოტოს ბლოკი (placeholder-ით) ---------- */
  function photoBlock(src, alt, icon) {
    return '<img src="' + esc(src) + '" alt="' + esc(alt) + '" ' +
           'onerror="this.style.display=\'none\'">' +
           '<div class="ph"><span class="ico">' + (icon || "📷") + '</span>' + esc(alt) + '</div>';
  }

  /* ---------- YouTube ID ამოღება ---------- */
  /* იღებს ნებისმიერ ფორმას: სრულ ლინკს, youtu.be-ს, embed-ს ან პირდაპირ ID-ს */
  function ytId(u) {
    if (!u) return "";
    u = String(u).trim();
    var m = u.match(/(?:v=|\/embed\/|youtu\.be\/|\/shorts\/|\/live\/)([A-Za-z0-9_-]{11})/);
    if (m) return m[1];
    if (/^[A-Za-z0-9_-]{11}$/.test(u)) return u;
    return "";
  }

  /* ---------- ვიდეო card ---------- */
  function filmCard(v) {
    var id = ytId(v.youtube);
    var media;
    if (id) {
      /* YouTube embed — არ საჭიროებს ფაილის ატვირთვას, ზომის ლიმიტი არ აქვს */
      media =
        '<div class="film-frame film-frame--yt">' +
          '<iframe src="https://www.youtube-nocookie.com/embed/' + esc(id) + '?rel=0&modestbranding=1" ' +
            'title="' + esc(v.title || "") + '" loading="lazy" ' +
            'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" ' +
            'allowfullscreen></iframe>' +
        '</div>';
    } else {
      /* ლოკალური ფაილი (fallback) — თუ youtube ცარიელია, ცდილობს assets/videos-ს */
      media =
        '<div class="film-frame">' +
          '<video controls preload="metadata" playsinline>' +
            '<source src="' + esc(v.src) + '" type="video/mp4">' +
            'ბრაუზერი ვიდეოს ვერ რთავს. სცადე ვიდეოს გახსნა სხვა ბრაუზერით ან გამოიყენე YouTube-ლინკი.' +
          '</video>' +
        '</div>';
    }
    return '' +
      '<div class="film-card">' +
        media +
        '<div class="film-cap">' +
          '<div>' +
            '<div class="film-title">' + esc(v.title) + '</div>' +
            '<p class="film-desc">' + esc(v.desc) + '</p>' +
          '</div>' +
          (v.button && !id ? '<button class="btn btn--ghost" type="button" onclick="this.closest(\'.film-card\').querySelector(\'video\').play()">▶ ' + esc(v.button) + '</button>' : '') +
        '</div>' +
      '</div>';
  }

  /* ---------- HERO ---------- */
  function renderHero() {
    var m = D.meta;
    $("#hero .wrap").innerHTML = '' +
      '<div class="hero__grid">' +
        '<div class="reveal in">' +
          '<div class="hero__kicker">Long Read · Side B · Georgian Music</div>' +
          '<h1>' + esc(m.title) + ' <span class="side-b">' + esc(m.titleMark) + '</span></h1>' +
          '<p class="hero__accent"><b>' + esc(m.titleAccent) + '</b></p>' +
          '<p class="hero__sub">' + esc(m.subtitle) + '</p>' +
          '<div class="hero__authors">' + esc(m.authors) + '</div>' +
          '<div class="hero__ctas">' +
            '<a class="btn btn--primary" href="#intro">🎵 ' + esc(m.ctaRead) + '</a>' +
            '<a class="btn btn--ghost" href="#videos">🎬 ' + esc(m.ctaVideos) + '</a>' +
          '</div>' +
          '<p class="hero__note">' + esc(m.heroNote) + '</p>' +
        '</div>' +
        '<div class="vinyl-stage">' +
          '<div class="tonearm"><i></i></div>' +
          '<div class="vinyl" role="img" aria-label="ნელა მბრუნავი ვინილის ფირფიტა, მხარე B">' +
            '<div class="vinyl__label"><span>SIDE<span class="b">B</span></span></div>' +
            '<div class="vinyl__hole"></div>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  /* ---------- NAV ---------- */
  function renderNav() {
    $("#nav .nav__brand").innerHTML = '<span class="dot">📀</span> ' + esc(D.meta.title) + ' <span class="dot">' + esc(D.meta.titleMark) + '</span>';
    $("#nav .nav__links").innerHTML = D.nav.map(function (n) {
      return '<a href="#' + n.id + '">' + esc(n.label) + '</a>';
    }).join("");
  }

  /* ---------- CONTENTS / ტრეკლისტი ---------- */
  function renderContents() {
    var el = $("#contents .wrap");
    if (!el) return;
    var half = Math.ceil(D.nav.length / 2);
    var items = D.nav.map(function (n, i) {
      var no = ("0" + (i + 1)).slice(-2);
      var side = i < half ? "A" + (i + 1) : "B" + (i + 1 - half);
      return '<a class="track" href="#' + n.id + '">' +
               '<span class="track__no">' + no + '</span>' +
               '<span class="track__name">' + esc(n.label) + '</span>' +
               '<span class="track__side">' + side + '</span>' +
             '</a>';
    }).join("");
    el.innerHTML =
      '<div class="contents__head reveal">' +
        '<span class="contents__label">შიგთავსი — Tracklist</span>' +
        '<span class="contents__meta">' + D.nav.length + ' თავი · მხარე B</span>' +
      '</div>' +
      '<div class="tracklist reveal">' + items + '</div>';
  }

  /* ---------- INTRO ---------- */
  function renderIntro() {
    var i = D.intro;
    $("#intro .wrap").innerHTML =
      '<span class="eyebrow reveal">' + esc(i.eyebrow) + '</span>' +
      '<h2 class="section-title reveal">' + esc(i.title) + '</h2>' +
      '<div class="prose reveal">' + paras(i.paragraphs) + '</div>';
  }

  /* ---------- CONTEXT ---------- */
  function renderContext() {
    var c = D.context;
    var tl = c.timeline.map(function (t) {
      return '<div class="tl-item reveal"><span class="tag">' + esc(t.tag) + '</span><span class="txt">' + esc(t.text) + '</span></div>';
    }).join("");
    $("#context .wrap").innerHTML =
      '<span class="eyebrow reveal">' + esc(c.eyebrow) + '</span>' +
      '<h2 class="section-title reveal">' + esc(c.title) + '</h2>' +
      '<div class="prose reveal">' + paras(c.paragraphs) +
        '<blockquote class="pull">' + esc(c.closing) + '</blockquote></div>' +
      '<div class="timeline">' + tl + '</div>';
  }

  /* ---------- ARTISTS ---------- */
  function soloCard(a, flip) {
    var photo = '<div class="artist-photo">' + photoBlock(a.photo, a.photoAlt, "🎤") + '</div>';
    var body = '' +
      '<div class="artist-body">' +
        '<div class="artist-role">' + esc(a.role) + '</div>' +
        '<h3 class="artist-name">' + esc(a.name) + '</h3>' +
        '<p class="artist-bio">' + esc(a.bio) + '</p>' +
        '<p class="artist-quote">' + esc(a.quote) + '</p>' +
        filmCard(a.video) +
      '</div>';
    return '<article class="artist-card reveal' + (flip ? ' flip' : '') + '">' +
           (flip ? body + photo : photo + body) + '</article>';
  }

  function levaniCard(l) {
    var qa = l.qa.map(function (x) {
      return '<div class="qa__item"><p class="qa__q">' + esc(x.q) + '</p><p class="qa__a">' + esc(x.a) + '</p></div>';
    }).join("");
    var quotes = (l.quotes || []).map(function (q) {
      return '<div class="quote-card"><span>' + esc(q) + '</span></div>';
    }).join("");
    return '' +
      '<article class="levani reveal">' +
        '<div class="levani__head">' +
          '<div class="levani__photo">' + photoBlock(l.photo, l.photoAlt, "🎸") + '</div>' +
          '<div>' +
            '<span class="levani__badge">' + esc(l.note) + '</span>' +
            '<h3 class="levani__title">' + esc(l.title) + '</h3>' +
            '<p class="levani__bio">' + esc(l.bio) + '</p>' +
          '</div>' +
        '</div>' +
        '<div class="qa">' + qa + '</div>' +
        (quotes ? '<div class="quote-row">' + quotes + '</div>' : '') +
      '</article>';
  }

  function renderArtists() {
    var a = D.artists;
    $("#artists .wrap").innerHTML =
      '<span class="eyebrow reveal">' + esc(a.eyebrow) + '</span>' +
      '<h2 class="section-title reveal">' + esc(a.title) + '</h2>' +
      soloCard(a.duda, false) +
      soloCard(a.lasha, true) +
      levaniCard(a.levani);
  }

  /* ---------- PROBLEMS ---------- */
  function renderProblems() {
    var p = D.problems;
    var items = p.items.map(function (it) {
      return '<div class="problem reveal">' +
               '<div class="problem__num">' + esc(it.num) + '</div>' +
               '<div><h3 class="problem__title">' + esc(it.title) + '</h3>' +
               '<p class="problem__text">' + esc(it.text) + '</p></div></div>';
    }).join("");
    $("#problems .wrap").innerHTML =
      '<span class="eyebrow reveal">' + esc(p.eyebrow) + '</span>' +
      '<h2 class="section-title reveal">' + esc(p.title) + '</h2>' +
      '<div class="prose reveal">' + paras(p.intro) + '</div>' +
      '<div class="problem-list">' + items + '</div>';
  }

  /* ---------- OPEN AIR ---------- */
  function renderOpenAir() {
    var o = D.openair;
    var gal = o.gallery.map(function (g) {
      return '<figure class="oa-photo">' + photoBlock(g.src, g.alt, "📸") +
             '<figcaption>' + esc(g.caption) + '</figcaption></figure>';
    }).join("");
    var qs = o.quotes.map(function (q) {
      return '<div class="oa-quote"><span>' + esc(q) + '</span></div>';
    }).join("");
    $("#openair .wrap").innerHTML =
      '<span class="eyebrow reveal">' + esc(o.eyebrow) + '</span>' +
      '<h2 class="section-title reveal">' + esc(o.title) + '</h2>' +
      '<div class="prose reveal">' + paras(o.paragraphs) + '</div>' +
      '<div class="openair__video reveal">' + filmCard(o.video) + '</div>' +
      '<div class="oa-gallery">' + gal + '</div>' +
      '<div class="oa-quotes">' + qs + '</div>';
  }

  /* ---------- LISTENERS ---------- */
  function renderListeners() {
    var l = D.listeners;
    var cards = l.cards.map(function (c) {
      return '<div class="lc reveal"><p class="lc__text">' + esc(c.text) + '</p>' +
             '<div class="lc__who">' + esc(c.who) + '</div></div>';
    }).join("");
    var stats = l.stats.map(function (s) {
      return '<div class="stat reveal"><div class="stat__v">' + esc(s.value) + '</div>' +
             '<div class="stat__l">' + esc(s.label) + '</div></div>';
    }).join("");
    $("#listeners .wrap").innerHTML =
      '<span class="eyebrow reveal">' + esc(l.eyebrow) + '</span>' +
      '<h2 class="section-title reveal">' + esc(l.title) + '</h2>' +
      '<div class="prose reveal">' + paras(l.paragraphs) + '</div>' +
      '<div class="listener-cards">' + cards + '</div>' +
      '<div class="stats">' + stats + '</div>';
  }

  /* ---------- ფატიმა ალანია — მსმენელის პროფილი ---------- */
  function renderFatima() {
    var f = D.fatima;
    var el = $("#fatima .wrap");
    if (!f || !el) return;
    var photo = '<div class="artist-photo">' + photoBlock(f.photo, f.photoAlt, "🎧") + '</div>';
    var body = '' +
      '<div class="artist-body">' +
        '<div class="artist-role">' + esc(f.meta) + '</div>' +
        '<div class="prose">' + paras(f.paragraphs) + '</div>' +
        (f.pull ? '<blockquote class="pull">' + esc(f.pull) + '</blockquote>' : '') +
      '</div>';
    el.innerHTML =
      '<span class="eyebrow reveal">' + esc(f.eyebrow) + '</span>' +
      '<h2 class="section-title reveal">' + esc(f.title) + '</h2>' +
      '<article class="artist-card fatima-card reveal">' + photo + body + '</article>';
  }

  /* ---------- VIDEOS HUB (მენიუსთვის) ---------- */
  function renderVideos() {
    var a = D.artists, o = D.openair;
    $("#videos .wrap").innerHTML =
      '<span class="eyebrow reveal">ვიდეოები</span>' +
      '<h2 class="section-title reveal">🎬 სამი ხმა ქართული მუსიკის მომავალზე</h2>' +
      '<div class="prose reveal"><p class="dim">ამ სექციაში ერთიანდება დუდას და ლაშას ვიდეოინტერვიუები, ასევე თბილისის Open Air-ის კადრები — სამი განსხვავებული შესასვლელი ერთ საერთო კითხვაში: როგორ ცხოვრობს და როგორ შეიძლება განვითარდეს ქართული მუსიკა დღეს?</p></div>' +
      '<div class="video-hub">' +
        '<div class="reveal">' + filmCard(a.duda.video) + '</div>' +
        '<div class="reveal">' + filmCard(a.lasha.video) + '</div>' +
      '</div>' +
      '<div class="reveal" style="margin-top:1.6rem">' + filmCard(o.video) + '</div>';
  }

  /* ---------- GALLERY ---------- */
  function renderGallery() {
    var g = D.gallery;
    var cells = g.items.map(function (it) {
      return '<figure class="gcell">' + photoBlock(it.src, it.alt, "🖼️") +
             '<figcaption>' + esc(it.caption) + '</figcaption></figure>';
    }).join("");
    $("#gallery .wrap").innerHTML =
      '<span class="eyebrow reveal">' + esc(g.eyebrow) + '</span>' +
      '<h2 class="section-title reveal">' + esc(g.title) + '</h2>' +
      '<div class="gallery-grid">' + cells + '</div>';
  }

  /* ---------- CONCLUSION ---------- */
  function renderConclusion() {
    var c = D.conclusion;
    $("#conclusion .wrap").innerHTML =
      '<span class="eyebrow reveal">' + esc(c.eyebrow) + '</span>' +
      '<h2 class="section-title reveal">' + esc(c.title) + '</h2>' +
      '<div class="prose reveal">' + paras(c.paragraphs) + '</div>' +
      '<p class="conclusion__closing reveal">' + esc(c.closing) + '</p>' +
      '<div class="conclusion__mark reveal">🎵 🎶 🎧 📀</div>';
  }

  /* ---------- FOOTER ---------- */
  function renderFooter() {
    var f = D.footer;
    var lines = f.lines.map(function (t, idx) {
      return idx === 0 ? '<div class="footer__t">' + esc(t) + '</div>' : '<p>' + esc(t) + '</p>';
    }).join("");
    $("#footer .wrap").innerHTML =
      '<div class="footer__vinyl" aria-hidden="true"></div>' + lines +
      '<div class="footer__mark" aria-hidden="true">🎵 🎶 🎧 🎤 📀</div>';
  }

  /* ---------- ინტერაქცია ---------- */
  function wireInteractions() {
    var nav = $("#nav");
    var toggle = $("#navToggle");
    var links = $("#nav .nav__links");

    toggle.addEventListener("click", function () {
      links.classList.toggle("open");
    });
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") links.classList.remove("open");
    });

    // solid nav + progress bar on scroll
    var progress = $("#progress");
    function onScroll() {
      var y = window.scrollY || document.documentElement.scrollTop;
      nav.classList.toggle("solid", y > 40);
      var h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // reveal on scroll
    var els = document.querySelectorAll(".reveal:not(.in)");
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
        });
      }, { threshold: 0.12 });
      els.forEach(function (el) { io.observe(el); });
    } else {
      els.forEach(function (el) { el.classList.add("in"); });
    }

    // active nav link
    var sections = D.nav.map(function (n) { return document.getElementById(n.id); }).filter(Boolean);
    var navLinks = links.querySelectorAll("a");
    function setActive() {
      var pos = (window.scrollY || 0) + 120;
      var current = sections[0] ? sections[0].id : null;
      sections.forEach(function (s) { if (s.offsetTop <= pos) current = s.id; });
      navLinks.forEach(function (a) {
        a.classList.toggle("active", a.getAttribute("href") === "#" + current);
      });
    }
    window.addEventListener("scroll", setActive, { passive: true });
    setActive();
  }

  /* ---------- გაშვება ---------- */
  function init() {
    if (!D) { console.error("SITE data არ ჩაიტვირთა (data.js)."); return; }
    renderNav();
    renderHero();
    renderContents();
    renderIntro();
    renderContext();
    renderArtists();
    renderProblems();
    renderOpenAir();
    renderListeners();
    renderFatima();
    renderVideos();
    renderGallery();
    renderConclusion();
    renderFooter();
    wireInteractions();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else { init(); }
})();
