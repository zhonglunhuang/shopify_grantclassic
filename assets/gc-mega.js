/* gc-mega.js — Insta360-style mega menu (US showcase).
   Reads #gc-mega-data (rendered by snippets/gc-mega.liquid) and rebuilds the inside of
   Focal's own dropdown container for the trigger items, so hover/open/close stays Focal's.
   Idempotent, defensive: if anything is missing it leaves the stock dropdown alone. */
(function () {
  if (window.__gcMegaInit) return;
  window.__gcMegaInit = true;

  var ICONS = {
    train: '<svg viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="14" rx="3"/><path d="M5 11h14M9 17l-2 4M15 17l2 4"/><circle cx="9" cy="14" r="1"/><circle cx="15" cy="14" r="1"/></svg>',
    plane: '<svg viewBox="0 0 24 24"><path d="M2 12l20-8-5 17-4-6-6-1z"/><path d="M13 15l9-11"/></svg>',
    moto: '<svg viewBox="0 0 24 24"><circle cx="6" cy="17" r="3"/><circle cx="18" cy="17" r="3"/><path d="M6 17l4-7h5l3 7M10 10l-2-4h3M15 10l2-3h3"/></svg>',
    paw: '<svg viewBox="0 0 24 24"><circle cx="7" cy="9" r="1.8"/><circle cx="12" cy="6.5" r="1.8"/><circle cx="17" cy="9" r="1.8"/><path d="M8 17c0-2.5 1.8-4.5 4-4.5s4 2 4 4.5c0 1.5-1 2.5-2.5 2.5-.6 0-1-.2-1.5-.5-.5.3-.9.5-1.5.5C9 19.5 8 18.5 8 17z"/></svg>',
    mountain: '<svg viewBox="0 0 24 24"><path d="M3 19l6-10 4 6 2-3 6 7z"/><path d="M9 9l1.5-2.5L12 9"/></svg>',
    gift: '<svg viewBox="0 0 24 24"><rect x="3" y="9" width="18" height="12" rx="2"/><path d="M3 13h18M12 9v12M12 9c-2.5 0-4.5-1.5-4.5-3S9 3.5 10.5 4.5 12 9 12 9zm0 0c2.5 0 4.5-1.5 4.5-3S15 3.5 13.5 4.5 12 9 12 9z"/></svg>',
    chev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>',
    bundle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 3.5 7.5 12 12l8.5-4.5L12 3z"/><path d="M3.5 7.5v9L12 21l8.5-4.5v-9"/><path d="M12 12v9"/></svg>',
    compare: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="3" y="5" width="7" height="14" rx="1.5"/><rect x="14" y="5" width="7" height="14" rx="1.5"/></svg>',
    cat: '<svg viewBox="0 0 24 24"><path d="M5 10l-1-6 5 3h6l5-3-1 6a7 7 0 0 1-14 0z"/><path d="M9 13h.01M15 13h.01M10 17c1 .8 3 .8 4 0"/></svg>',
    dog: '<svg viewBox="0 0 24 24"><path d="M7 5l-3 5 3 2v4a4 4 0 0 0 4 4h2a4 4 0 0 0 4-4v-4l3-2-3-5-3 3H10z"/><path d="M10 13h.01M14 13h.01M11 17h2"/></svg>',
    home: '<svg viewBox="0 0 24 24"><path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/></svg>',
    leaf: '<svg viewBox="0 0 24 24"><path d="M4 20c0-9 6-15 16-16-1 10-7 16-16 16z"/><path d="M4 20c4-4 7-7 12-12"/></svg>',
    road: '<svg viewBox="0 0 24 24"><path d="M7 3L3 21M17 3l4 18"/><path d="M12 4v3M12 10v4M12 17v3"/></svg>',
    box: '<svg viewBox="0 0 24 24"><path d="M3 8l9-4 9 4-9 4z"/><path d="M3 8v9l9 4 9-4V8"/><path d="M12 12v9"/></svg>',
    palette: '<svg viewBox="0 0 24 24"><path d="M12 3a9 9 0 1 0 0 18c1.5 0 2-1 2-2 0-1.2-1-1.5-1-2.5 0-1 .8-1.5 2-1.5h1.5A4.5 4.5 0 0 0 21 10.5C21 6 17 3 12 3z"/><circle cx="7.5" cy="10.5" r="1.2"/><circle cx="10.5" cy="7" r="1.2"/><circle cx="15" cy="7.5" r="1.2"/></svg>',
    car: '<svg viewBox="0 0 24 24"><path d="M4 14l2-6h12l2 6"/><rect x="3" y="14" width="18" height="5" rx="1.5"/><circle cx="7.5" cy="19" r="1.5"/><circle cx="16.5" cy="19" r="1.5"/></svg>'
  };

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function readData() {
    var el = document.getElementById('gc-mega-data');
    if (!el) return null;
    try { return JSON.parse(el.textContent); } catch (e) { return null; }
  }

  function card(handle, D) {
    var p = D.products[handle];
    if (!p) return '';
    if (D.cutouts && D.cutouts[handle] && !p.cutout) p.cutout = D.cutouts[handle]; // TW: cutout PNG copied from the US store
    var tag = D.taglines[handle] || '';
    return '<li><a class="gc-mega__card" href="' + esc(p.url) + '">' +
      '<span class="gc-mega__thumb' + (p.cutout ? ' gc-mega__thumb--cut' : '') + '">' + ((p.cutout || p.img) ? '<img src="' + esc(p.cutout || p.img) + '" alt="" loading="lazy" width="116" height="116"' + (p.cutout && p.img ? ' onerror="this.onerror=null;this.src=\'' + esc(p.img) + '\';this.parentNode.classList.remove(\'gc-mega__thumb--cut\')"' : '') + '>' : '') + '</span>' +
      '<span class="gc-mega__body"><span class="gc-mega__title">' + esc((D.names && D.names[handle]) || p.title) + '</span>' +
      (tag ? '<span class="gc-mega__desc">' + esc(tag) + '</span>' : '') +
      (D.designs && D.designs[handle] ? '<span class="gc-mega__designs" data-href="' + esc(D.designs[handle]) + '">' + esc((D.labels && D.labels.designs) || 'Design Editions') + ' ›</span>' : '') + '</span></a></li>';
  }

  // GOS-0279：系列總覽圖卡。分類帶 hub 鍵 → 分頁最上方放一張橫幅圖卡（桌機／手機各一種版型，資料同一份）
  function hubOf(c, D) { return (c.hub && D.hubs && D.hubs[c.hub]) || null; }
  function hubImg(hub, w) { return hub.img ? esc(hub.img + (hub.img.indexOf('?') > -1 ? '&' : '?') + 'width=' + w) : ''; }
  function hubCard(hub) {
    return '<a class="gc-mega__hub" href="' + esc(hub.url) + '"' + (hub.img ? ' style="--gc-hub-img:url(' + hubImg(hub, 1600) + ')"' : '') + '>' +
      '<span class="gc-mega__hub-body">' +
      (hub.eyebrow ? '<span class="gc-mega__hub-eyebrow">' + esc(hub.eyebrow) + '</span>' : '') +
      '<span class="gc-mega__hub-title">' + esc(hub.title) + '</span>' +
      (hub.sub ? '<span class="gc-mega__hub-sub">' + esc(hub.sub) + '</span>' : '') + '</span>' +
      (hub.cta ? '<span class="gc-mega__hub-cta">' + esc(hub.cta) + ICONS.chev + '</span>' : '') + '</a>';
  }
  function hubTile(hub) {
    return '<li class="mobile-nav__item gc-mmenu__hubItem" data-level="3"><a href="' + esc(hub.url) + '" class="mobile-nav__link gc-mmenu__hub"' + (hub.img ? ' style="--gc-hub-img:url(' + hubImg(hub, 900) + ')"' : '') + '>' +
      '<span class="gc-mmenu__hub-body">' +
      (hub.eyebrow ? '<span class="gc-mmenu__hub-eyebrow">' + esc(hub.eyebrow) + '</span>' : '') +
      '<span class="gc-mmenu__hub-title">' + esc(hub.title) + ICONS.chev + '</span></span></a></li>';
  }

  function build(D, M, uid) {
    var L = D.labels || {};
    // hide groups that have no live product yet (add the handle in gc-mega.liquid when it exists)
    var cats = (M.categories || []).filter(function (c) { return c.items.some(function (h) { return !!D.products[h]; }); });
    if (!cats.length) return null;
    var activeId = cats[0].id;
    var left = '<div class="gc-mega__left"><p class="gc-mega__label">' + esc(L.list || 'Products') + '</p><ul class="gc-mega__cats" role="tablist">' +
      cats.map(function (c) {
        return '<li><button type="button" class="gc-mega__cat" role="tab" data-cat="' + esc(c.id) + '" aria-selected="' + (c.id === activeId) + '" aria-controls="' + uid + '-' + esc(c.id) + '">' + esc(c.title) + '</button></li>';
      }).join('') + '</ul>' +
      ((M.compare || M.bundles) ? '<div class="gc-mega__side-foot">' +
        (M.compare ? '<a href="' + esc(M.compare.url) + '">' + ICONS.compare + esc(M.compare.label || L.compare || 'Compare') + '</a>' : '') +
        (M.bundles ? '<a href="' + esc(M.bundles.url) + '">' + ICONS.bundle + esc(M.bundles.label || L.bundles || 'Bundles & kits') + '</a>' : '') + '</div>' : '') + '</div>';
    var center = '<div class="gc-mega__panes">' + cats.map(function (c) {
      var items = c.items.map(function (h) { return card(h, D); }).join('');
      var hub = hubOf(c, D);
      return '<div class="gc-mega__pane" id="' + uid + '-' + esc(c.id) + '" role="tabpanel" data-cat="' + esc(c.id) + '" data-active="' + (c.id === activeId) + '">' +
        (hub ? hubCard(hub) : '') +
        '<ul class="gc-mega__grid">' + items + '</ul>' +
        (c.items.filter(function (h) { return !!D.products[h]; }).length > 2 && c.url && !(hub && hub.url === c.url) ? '<div class="gc-mega__foot"><a class="gc-mega__all" href="' + esc(c.url) + '">' + esc(L.view_all || 'View all') + ICONS.chev + '</a></div>' : '') + '</div>';
    }).join('') + '</div>';
    var right = '<div class="gc-mega__right"><p class="gc-mega__label">' + esc(L.made_for || 'Made for') + '</p><ul class="gc-mega__scen">' +
      (M.scenarios || []).map(function (s) {
        return '<li><a href="' + esc(s.url) + '">' + (ICONS[s.icon] || '') + '<span>' + esc(s.title) + '</span><span class="gc-mega__chev">' + ICONS.chev + '</span></a></li>';
      }).join('') + '</ul></div>';
    var root = document.createElement('div');
    root.className = 'gc-mega';
    root.innerHTML = left + center + right;
    // category switching on hover and click (Insta360 switches on hover)
    function activate(id) {
      root.querySelectorAll('.gc-mega__cat').forEach(function (b) { b.setAttribute('aria-selected', String(b.dataset.cat === id)); });
      root.querySelectorAll('.gc-mega__pane').forEach(function (p) { p.dataset.active = String(p.dataset.cat === id); });
    }
    root.addEventListener('mouseover', function (e) { var b = e.target.closest('.gc-mega__cat'); if (b) activate(b.dataset.cat); });
    root.addEventListener('click', function (e) {
      var d = e.target.closest('.gc-mega__designs'); if (d) { e.preventDefault(); location.href = d.getAttribute('data-href'); return; }
      var b = e.target.closest('.gc-mega__cat'); if (b) { e.preventDefault(); activate(b.dataset.cat); }
    });
    root.addEventListener('keydown', function (e) {
      var b = e.target.closest('.gc-mega__cat'); if (!b) return;
      var btns = Array.prototype.slice.call(root.querySelectorAll('.gc-mega__cat')), i = btns.indexOf(b);
      if (e.key === 'ArrowDown' && btns[i + 1]) { btns[i + 1].focus(); activate(btns[i + 1].dataset.cat); e.preventDefault(); }
      if (e.key === 'ArrowUp' && btns[i - 1]) { btns[i - 1].focus(); activate(btns[i - 1].dataset.cat); e.preventDefault(); }
    });
    return root;
  }

  function extras(D) {
    // TW (GOS-0248): extra top-level links on the test theme without touching the shared backend menu (menus are shared by every theme).
    // Clones an existing plain item so the markup/styles are exactly Focal's. Go-live: add the item to the navigation for real and drop this.
    (D.extra || []).forEach(function (x) {
      var anchor = document.querySelector('.header__linklist-item[data-item-title="' + x.before + '"]');
      if (anchor && !document.querySelector('.header__linklist-item[data-item-title="' + x.title + '"]')) {
        var li = anchor.cloneNode(true); li.setAttribute('data-item-title', x.title); li.classList.remove('has-dropdown');
        var a = li.querySelector('a'); a.textContent = x.title; a.setAttribute('href', x.url); a.removeAttribute('aria-controls'); a.removeAttribute('aria-expanded');
        Array.prototype.slice.call(li.children).forEach(function (c) { if (c !== a) li.removeChild(c); });
        anchor.parentNode.insertBefore(li, anchor);
      }
      var drawer = document.getElementById('mobile-menu-drawer');
      var tops = drawer ? Array.prototype.slice.call(drawer.querySelectorAll('.drawer__content > .mobile-nav > .mobile-nav__item')) : [];
      var mAnchor = tops.filter(function (li) { var l = li.querySelector('.mobile-nav__link'); return l && l.textContent.trim() === x.before; })[0];
      if (mAnchor && !tops.some(function (li) { var l = li.querySelector('.mobile-nav__link'); return l && l.textContent.trim() === x.title; })) {
        var mli = mAnchor.cloneNode(true); var ml = mli.querySelector('.mobile-nav__link'); ml.textContent = x.title; if (ml.tagName === 'A') ml.setAttribute('href', x.url);
        mAnchor.parentNode.insertBefore(mli, mAnchor);
      }
    });
  }

  function run() {
    var D = readData();
    if (!D || !D.products || !D.menus) return;
    extras(D);
    var items = document.querySelectorAll('.header__linklist-item.has-dropdown[data-item-title]');
    items.forEach(function (li, idx) {
      if (li.hasAttribute('data-gc-mega')) return;
      var title = (li.getAttribute('data-item-title') || '').trim().toLowerCase();
      var M = D.menus[D.triggers[title]];
      if (!M) return;
      var link = li.querySelector('a[aria-controls]');
      var host = link && document.getElementById(link.getAttribute('aria-controls'));
      if (!host) return;
      var container = host.querySelector(':scope > .container') || host;
      var uid = 'gc-mega-' + idx;
      var panel = build(D, M, uid);
      if (!panel) return;
      // TW (GOS-0248): keep Focal's original links in the DOM (hidden) so the rendered DOM still carries every menu link for Google; only the visual panel changes.
      var keep = document.createElement('div'); keep.className = 'gc-mega__orig'; keep.hidden = true;
      while (container.firstChild) keep.appendChild(container.firstChild);
      container.appendChild(keep);
      container.appendChild(panel);
      host.classList.add('gc-mega-host');
      // TW (GOS-0248): Focal's closeDropdown only keeps a panel 250ms while the next opens when it has class "mega-menu" (US host has it, TW's .tmenu does not) - without it the old panel vanishes instantly and the hero flashes through for ~100ms.
      if (host.classList.contains('tmenu')) host.classList.add('mega-menu');
      li.setAttribute('data-gc-mega', '');
    });
  }


  /* ---------- Mobile drawer (Focal accordion): product rows get the cutout thumb + tagline,
     the desktop image cards are hidden by CSS, and only one top-level category stays open. ---------- */
  function mobile() {
    // Mobile drawer = the same data as the desktop mega menu (Mars 2026-09-03: the two sides must match).
    // Focal renders the Shopify menu (1-2 products per group); we replace each trigger panel with the
    // full category / product / "Made For" structure from #gc-mega-data. Own toggles (no `is=` built-ins:
    // Safari has no customized built-in support, so dynamically-added toggle-buttons would stay dead).
    var D = readData();
    var drawer = document.getElementById('mobile-menu-drawer');
    if (!D || !D.products || !D.menus || !drawer || drawer.hasAttribute('data-gc-mmenu')) return;
    drawer.setAttribute('data-gc-mmenu', '');
    var L = D.labels || {};
    var uid = 0;
    function tile(h) {
      var p = D.products[h]; if (!p) return '';
      if (D.cutouts && D.cutouts[h] && !p.cutout) p.cutout = D.cutouts[h];
      var name = (D.names && D.names[h]) || p.title;
      var img = p.cutout || p.img;
      return '<li class="mobile-nav__item" data-level="3"><a href="' + esc(p.url) + '" class="mobile-nav__link gc-mmenu__prod" data-gc-prod>' +
        '<span class="gc-mmenu__thumb">' + (img ? '<img src="' + esc(img) + '" alt="" loading="lazy" width="56" height="56"' + (p.cutout && p.img ? ' onerror="this.onerror=null;this.src=\'' + esc(p.img) + '\'"' : '') + '>' : '') + '</span>' +
        '<span class="gc-mmenu__body"><span class="gc-mmenu__name">' + esc(name) + '</span></span></a></li>';
    }
    function panel(M) {
      var html = '<ul class="mobile-nav list--unstyled gc-mmenu" role="list">';
      (M.categories || []).forEach(function (c) {
        var items = (c.items || []).filter(function (h) { return D.products[h]; });
        if (!items.length) return;
        var id = 'gc-mm-' + (++uid);
        var hub = hubOf(c, D);
        html += '<li class="mobile-nav__item" data-level="2">' +
          '<button type="button" class="mobile-nav__link gc-mmenu__cat" aria-controls="' + id + '" aria-expanded="false">' + esc(c.title) + '<span class="animated-plus"></span></button>' +
          '<div id="' + id + '" class="gc-mmenu__panel"><div class="gc-mmenu__panelIn"><ul class="mobile-nav list--unstyled" role="list">' +
          (hub ? hubTile(hub) : '') +
          items.map(tile).join('') +
          (c.url && items.length > 2 && !(hub && hub.url === c.url) ? '<li class="mobile-nav__item" data-level="3"><a href="' + esc(c.url) + '" class="mobile-nav__link gc-mmenu__more">' + esc(L.view_all || 'View All') + ' ' + esc(c.title) + ' ›</a></li>' : '') +
          '</ul></div></div></li>';
      });
      if (M.scenarios && M.scenarios.length) {
        html += '<li class="mobile-nav__item gc-mmenu__head" data-level="2"><span>' + esc(L.made_for || 'Made For') + '</span></li>';
        M.scenarios.forEach(function (sc) {
          html += '<li class="mobile-nav__item" data-level="2"><a href="' + esc(sc.url) + '" class="mobile-nav__link gc-mmenu__scen">' + (ICONS[sc.icon] || '') + '<span>' + esc(sc.title) + '</span></a></li>';
        });
      }
      html += '<li class="mobile-nav__item gc-mmenu__foot" data-level="2">' +
        (M.compare ? '<a href="' + esc(M.compare.url) + '" class="mobile-nav__link gc-mmenu__link">' + ICONS.compare + '<span>' + esc(M.compare.label || L.compare || 'Compare') + '</span></a>' : '') +
        (M.bundles ? '<a href="' + esc(M.bundles.url) + '" class="mobile-nav__link gc-mmenu__link">' + ICONS.bundle + '<span>' + esc(M.bundles.label || L.bundles || 'Bundles & Kits') + '</span></a>' : '') +
        '</li></ul>';
      return html;
    }
    var tops = Array.prototype.slice.call(drawer.querySelectorAll('.drawer__content > .mobile-nav > .mobile-nav__item > .mobile-nav__link[aria-controls]'));
    tops.forEach(function (btn) {
      var key = (btn.textContent || '').trim().toLowerCase();
      if (D.hide && D.hide.indexOf(key) > -1) { btn.setAttribute('data-gc-hide', ''); return; }
      var m = D.triggers && D.triggers[key];
      var cc = document.getElementById(btn.getAttribute('aria-controls'));
      if (m && D.menus[m] && cc) { var keep = document.createElement('div'); keep.className = 'gc-mmenu__orig'; keep.hidden = true; while (cc.firstChild) keep.appendChild(cc.firstChild); cc.appendChild(keep); cc.insertAdjacentHTML('beforeend', panel(D.menus[m])); }
      // Top level: Insta360 behaviour (Mars 2026-09-03) - tap opens, content just extends downward. No auto-collapse, no scrolling.
    });
    // Category level: same - tap to open, tap again to close, several can stay open. Nothing moves except the content below.
    drawer.addEventListener('click', function (e) {
      var b = e.target.closest('.gc-mmenu__cat'); if (!b) return;
      e.preventDefault(); e.stopPropagation();
      var pn = document.getElementById(b.getAttribute('aria-controls')); if (!pn) return;
      var open = b.getAttribute('aria-expanded') === 'true';
      b.setAttribute('aria-expanded', open ? 'false' : 'true'); pn.classList.toggle('is-open', !open);
    }, true);
  }


  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { run(); mobile(); });
  else { run(); mobile(); }
  document.addEventListener('shopify:section:load', function () { run(); mobile(); });
})();
