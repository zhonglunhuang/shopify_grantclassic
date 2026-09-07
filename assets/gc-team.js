/* gc-team.js — 團購歸因、自動套碼、商品頁專屬價條（GrantOS GOS-0253／GOS-0256）。
 *
 * 一支檔案三個角色：
 * 1. 專屬頁（有 [data-gc-team]）：種第一方 cookie（天數＝歸因期間）、加入購物車、套碼＋寫記號。
 * 2. 商品介紹頁：網址帶 gct=<代碼> 或 cookie 還在 → 抓該檔資料（/pages/team-<代碼>?view=gc-team-data）
 *    → 這個商品的變體在檔期裡就顯示底部一行「專屬價條」（頁面本身不變、加車用原本的購買列；
 *    Mars 2026-09-08 拍板不做底部購買區——五家開同一個商品也是同一頁、各認各的碼）。
 * 3. 全站任何頁（layout/theme.liquid 載入）：cookie 還在就把碼套回購物車、寫記號，
 *    客人隔幾天從首頁回來買一樣是團購價、一樣算那位團購主的。
 *
 * 套碼走 2025-05 開放的 /cart/update.js `discount` 參數。記號 _gc_team 是購物車屬性（底線開頭＝客人看不到）；
 * 「立即購買」會掉屬性，所以碼才是主線。後點的團購主蓋掉先點的（最後接觸歸因）。
 */
(function () {
  if (window.__gcTeamInit) return;
  window.__gcTeamInit = true;

  var COOKIE = '_gc_team';
  var host = document.querySelector('[data-gc-team]');

  function readCookie() {
    var m = document.cookie.match(new RegExp('(?:^|; )' + COOKIE + '=([^;]*)'));
    if (!m) return null;
    try {
      var v = decodeURIComponent(m[1]).split('|');
      return { code: v[0] || '', discount: v[1] || '', attr: v[2] || '_gc_team' };
    } catch (e) { return null; }
  }
  function writeCookie(code, discount, attr, days) {
    var maxAge = Math.max(1, parseInt(days, 10) || 30) * 86400;
    document.cookie = COOKIE + '=' + encodeURIComponent(code + '|' + discount + '|' + attr) +
      '; Max-Age=' + maxAge + '; Path=/; SameSite=Lax' + (location.protocol === 'https:' ? '; Secure' : '');
  }
  function fetchCart() {
    return fetch('/cart.js', { credentials: 'same-origin' }).then(function (r) { return r.json(); });
  }
  // 套碼＋寫記號。購物車空的時候有些版本不收 discount，先寫記號、碼等有東西再套。
  function apply(ref, force) {
    if (!ref || !ref.code) return Promise.resolve();
    return fetchCart().then(function (cart) {
      var attrs = (cart && cart.attributes) || {};
      var codes = (cart && cart.discount_codes) || [];
      var hasCode = codes.some(function (c) { return (c.code || '').toUpperCase() === (ref.discount || '').toUpperCase(); });
      var hasAttr = attrs[ref.attr] === ref.code;
      var empty = !cart || !cart.item_count;
      if (!force && hasAttr && (hasCode || empty || !ref.discount)) return;
      var body = { attributes: {} };
      body.attributes[ref.attr] = ref.code;
      if (ref.discount && !empty) body.discount = ref.discount;
      return fetch('/cart/update.js', {
        method: 'POST', credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(body)
      }).then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; });
    }).catch(function () {});
  }

  // 全站：客人加東西進購物車之後再套一次（碼要有商品才套得上）
  function hookCartAdd(ref) {
    if (!window.fetch || window.__gcTeamHooked) return;
    window.__gcTeamHooked = true;
    var origFetch = window.fetch;
    window.fetch = function (input, init) {
      var url = typeof input === 'string' ? input : (input && input.url) || '';
      var p = origFetch.apply(this, arguments);
      if (/\/cart\/(add|change)(\.js)?(\?|$)/.test(url)) {
        p.then(function () { setTimeout(function () { apply(readCookie() || ref, false); }, 150); }).catch(function () {});
      }
      return p;
    };
    document.addEventListener('submit', function (e) {
      var f = e.target;
      if (f && f.action && /\/cart\/add/.test(f.action)) {
        setTimeout(function () { apply(readCookie() || ref, false); }, 800);
      }
    }, true);
  }

  // 檔期資料：專屬頁的資料版型回 metafield 那份 JSON；同一個分頁只抓一次
  function loadData(code) {
    if (!code) return Promise.resolve(null);
    var key = 'gc_team_data_' + code.toUpperCase();
    try { var hit = sessionStorage.getItem(key); if (hit) return Promise.resolve(JSON.parse(hit)); } catch (e) {}
    return fetch('/pages/team-' + code.toLowerCase() + '?view=gc-team-data', { credentials: 'same-origin' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) {
        if (d && d.code) { try { sessionStorage.setItem(key, JSON.stringify(d)); } catch (e) {} return d; }
        return null;
      }).catch(function () { return null; });
  }

  // 商品頁：這個商品有哪些變體在檔期裡
  function productVariantIds() {
    var ids = [];
    try {
      var meta = window.ShopifyAnalytics && window.ShopifyAnalytics.meta && window.ShopifyAnalytics.meta.product;
      if (meta && meta.variants) meta.variants.forEach(function (v) { ids.push(String(v.id)); });
    } catch (e) {}
    if (!ids.length) {
      document.querySelectorAll('[name="id"]').forEach(function (el) {
        if (el.tagName === 'SELECT') { Array.prototype.forEach.call(el.options, function (o) { if (o.value) ids.push(String(o.value)); }); }
        else if (el.value) ids.push(String(el.value));
      });
    }
    return ids;
  }

  function fmt(n) { return 'NT$' + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }

  // 專屬價條：固定底部、可收合；只在商品頁而且變體對得上時出現
  function renderBar(d, ref) {
    if (!d || d.status !== 'active' || !/^\/products\//.test(location.pathname)) return;
    if (document.querySelector('.gct-bar')) return;
    var ids = productVariantIds();
    var items = (d.items || []).filter(function (it) { return ids.indexOf(String(it.variant_id)) >= 0; });
    if (!items.length) return;
    var it = items[0];
    var multi = (d.items || []).length > 1;
    var css = '.gct-bar{position:fixed;left:12px;right:76px;bottom:14px;z-index:60;background:#1d1d1f;color:#fff;border-radius:16px;' +
      'padding:12px 14px;display:flex;align-items:center;gap:12px;box-shadow:0 10px 30px rgba(0,0,0,.25);' +
      'font-family:-apple-system,"SF Pro Text","PingFang TC","Noto Sans TC",sans-serif;font-size:14px;line-height:1.35}' +
      '.gct-bar__txt{flex:1;min-width:0}.gct-bar__who{font-size:12px;color:#c7c7cc;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
      '.gct-bar__price{font-weight:700;font-size:18px;font-variant-numeric:tabular-nums;white-space:nowrap}' +
      '.gct-bar__was{font-size:12.5px;color:#a1a1a6;text-decoration:line-through;margin-left:6px}' +
      '.gct-bar__note{font-size:12px;color:#c7c7cc;white-space:nowrap}' +
      '.gct-bar__more{color:#fff;font-size:12.5px;white-space:nowrap;text-decoration:underline;text-underline-offset:3px}' +
      '.gct-bar__x{border:0;background:rgba(255,255,255,.14);color:#fff;border-radius:999px;width:28px;height:28px;cursor:pointer;flex:none;font-size:16px;line-height:1}' +
      '@media(min-width:900px){.gct-bar{left:50%;right:auto;transform:translateX(-50%);min-width:520px;max-width:720px;bottom:20px}}';
    var style = document.createElement('style'); style.textContent = css; document.head.appendChild(style);
    var bar = document.createElement('div'); bar.className = 'gct-bar'; bar.setAttribute('role', 'status');
    var esc = function (s) { return String(s || '').replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
    bar.innerHTML =
      '<div class="gct-bar__txt"><div class="gct-bar__who">' + esc(d.kol_name) + ' 粉絲專屬價・結帳自動折</div>' +
      '<div><span class="gct-bar__price">' + fmt(it.team_price) + '</span>' +
      (it.orig_price > it.team_price ? '<span class="gct-bar__was">' + fmt(it.orig_price) + '</span>' : '') + '</div></div>' +
      (multi && d.hub ? '<a class="gct-bar__more" href="' + esc(d.hub) + '">看全部團購商品</a>' : '') +
      '<button class="gct-bar__x" type="button" aria-label="收起">×</button>';
    bar.querySelector('.gct-bar__x').addEventListener('click', function () { bar.remove(); try { sessionStorage.setItem('gc_team_bar_hide', '1'); } catch (e) {} });
    try { if (sessionStorage.getItem('gc_team_bar_hide') === '1') return; } catch (e) {}
    document.body.appendChild(bar);
  }

  // 加入購物車（專屬頁的卡與商品頁底部購買區共用）：加車 → 套碼 → 按鈕變「前往結帳」
  function bindAdd(container, getRef, toast) {
    function say(msg) {
      if (!toast) return;
      toast.textContent = msg; toast.classList.add('on');
      setTimeout(function () { toast.classList.remove('on'); }, 2600);
    }
    container.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-gc-add]');
      if (!btn || btn.disabled) return;
      if (btn.getAttribute('data-gc-go')) { location.href = '/cart'; return; }
      var id = parseInt(btn.getAttribute('data-gc-add'), 10);
      btn.disabled = true; var old = btn.textContent; btn.textContent = '加入中…';
      fetch('/cart/add.js', {
        method: 'POST', credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ items: [{ id: id, quantity: 1 }] })
      }).then(function (r) {
        if (!r.ok) throw new Error('add failed');
        return apply(getRef(), true);
      }).then(function () {
        btn.textContent = '已加入・前往結帳'; btn.classList.add('is-done'); btn.disabled = false;
        btn.setAttribute('data-gc-go', '1');
        say('已加入購物車，團購價會在結帳時套用');
        document.dispatchEvent(new CustomEvent('cart:refresh'));
      }).catch(function () {
        btn.textContent = old; btn.disabled = false;
        say('加入失敗，請重新整理再試一次');
      });
    });
  }

  var ref = readCookie();
  var gct = (location.search.match(/[?&]gct=([A-Za-z0-9]+)/) || [])[1];

  if (host) {
    // ── 專屬頁（目錄／備援） ──
    var cfg = {
      code: host.getAttribute('data-code') || '',
      discount: host.getAttribute('data-discount') || '',
      attr: host.getAttribute('data-attr') || '_gc_team',
      days: host.getAttribute('data-days') || '30',
      status: host.getAttribute('data-status') || ''
    };
    if (cfg.status === 'active' && cfg.code) {
      writeCookie(cfg.code, cfg.discount, cfg.attr, cfg.days);   // 後點的蓋掉先點的
      ref = { code: cfg.code, discount: cfg.discount, attr: cfg.attr };
      apply(ref, false);
    }
    bindAdd(host, function () { return ref; }, host.querySelector('[data-gc-toast]'));
  } else if (gct) {
    // ── 商品頁帶 gct 進來：抓資料、種 cookie、套碼、顯示價條 ──
    loadData(gct).then(function (d) {
      if (!d || d.status !== 'active') return;
      writeCookie(d.code, d.discount_code || '', d.attr_key || '_gc_team', d.days);
      ref = { code: d.code, discount: d.discount_code || '', attr: d.attr_key || '_gc_team' };
      apply(ref, false);
      hookCartAdd(ref);
      renderBar(d, ref);
    });
  } else if (ref && ref.code) {
    // ── 歸因期內回站：套碼；在商品頁就順便顯示價條 ──
    apply(ref, false);
    if (/^\/products\//.test(location.pathname)) {
      loadData(ref.code).then(function (d) { renderBar(d, ref); });
    }
  }
  if (ref && ref.code && !gct) hookCartAdd(ref);
})();
