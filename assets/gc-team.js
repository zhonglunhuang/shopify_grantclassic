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
  // 一檔多優惠（GOS-0261）：ref.discount 可能是好幾個碼用逗號串起來
  function codeList(s) {
    return String(s || '').split(',').map(function (x) { return x.trim(); }).filter(Boolean);
  }

  // 套碼＋寫記號。購物車空的時候有些版本不收 discount，先寫記號、碼等有東西再套。
  function apply(ref, force) {
    if (!ref || !ref.code) return Promise.resolve();
    return fetchCart().then(function (cart) {
      var attrs = (cart && cart.attributes) || {};
      var codes = ((cart && cart.discount_codes) || []).map(function (c) {
        return (c.code || '').toUpperCase();
      });
      var want = codeList(ref.discount);
      var stamp = ref.code + '|' + want.join(',');
      // 「這一組碼送過了」要自己記。不能用「全部的碼都回報得到」當條件——套不到東西的碼
      // Shopify 不會留在 cart.discount_codes 裡，那個條件就永遠不成立，於是每換一頁、每加一次車
      // 都重打一次 /cart/update.js，還會把客人自己輸入的碼蓋掉（2026-09-11 審查）。
      var sent = false;
      try { sent = sessionStorage.getItem('gc_team_sent') === stamp; } catch (e) {}
      var anyCode = want.some(function (c) { return codes.indexOf(c.toUpperCase()) >= 0; });
      var hasAttr = attrs[ref.attr] === ref.code;
      var empty = !cart || !cart.item_count;
      if (!force && hasAttr && (sent || anyCode || empty || !want.length)) return;
      var body = { attributes: {} };
      body.attributes[ref.attr] = ref.code;
      // /cart/update.js 的 discount 參數吃逗號分隔的多個碼（Shopify 2025-05 起）；
      // 折扣連結 /discount/<碼> 只吃得下一個，所以主碼靠連結、其餘靠這裡補上。
      if (want.length && !empty) body.discount = want.join(',');
      return fetch('/cart/update.js', {
        method: 'POST', credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(body)
      }).then(function (r) {
        if (r.ok && want.length && !empty) {
          try { sessionStorage.setItem('gc_team_sent', stamp); } catch (e) {}
        }
        return r.ok ? r.json() : null;
      }).catch(function () { return null; });
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

  /* 目錄頁的「加入購物車」。這支在 GOS-0256 被誤刪、呼叫卻留著，所以整個 IIFE 一進目錄頁
   * 就丟 ReferenceError——正式站從 2026-09-08 起那一頁的加車鈕全是死的（2026-09-11 審查抓到）。
   */
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
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  // 這一檔全部的碼（主碼＋子碼）。舊的檔期資料只有 discount_code，退回去用它。
  function allCodes(d) {
    var list = (d && d.discount_codes) || [];
    if (!list.length && d && d.discount_code) list = [d.discount_code];
    return list.filter(Boolean).join(',');
  }

  /* ── 「想看就看得到」的專屬碼（GOS-0263）──
   * 自動套用完全照舊；多這一行是給「換手機／換瀏覽器」的人自己救。
   * 碼本來就不是秘密——結帳頁一定會把已套用的折扣碼列出來（Mars 2026-09-10）。
   */
  // 每一個碼各自一顆複製鈕。**絕對不要把好幾個碼用逗號黏成一串給人複製**——
  // 結帳頁的折扣碼欄一次只吃一個，貼那串進去是「折扣碼無效」，正好把這個功能存在的理由打掉。
  function codeRow(codes, cls) {
    codes = (codes || []).filter(Boolean);
    if (!codes.length) return '';
    var one = codes.length === 1;
    return '<div class="' + cls + '" data-gct-coderow>' +
      '<span>你的專屬碼</span>' +
      codes.map(function (c) {
        return '<span data-gct-codeitem><b>' + esc(c) + '</b>' +
          '<button type="button" data-gct-copy="' + esc(c) + '">複製</button></span>';
      }).join('') +
      '<span data-gct-hint>換手機或換瀏覽器時，結帳頁貼上' +
      (one ? '就有' : '（一次一個，買哪個商品貼哪個）') + '</span></div>';
  }
  function bindCopy(root) {
    root.querySelectorAll('[data-gct-copy]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();          // 別觸發價條「捲到購買區」
        var text = btn.getAttribute('data-gct-copy') || '';
        var done = function () {
          btn.textContent = '已複製';
          btn.setAttribute('data-gct-done', '1');
          setTimeout(function () {
            btn.textContent = '複製';
            btn.removeAttribute('data-gct-done');
          }, 1600);
        };
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text, done); });
            return;
          }
        } catch (err) {}
        fallbackCopy(text, done);
      });
    });
  }
  // 瀏覽器不給剪貼簿權限時的退路：碼本身看得見，選起來也複製得到
  function fallbackCopy(text, done) {
    try {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;top:-1000px;opacity:0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      done();
    } catch (e) {}
  }

  // 專屬價條：貼在頁首正下方、可收合；只在商品頁而且變體對得上時出現（Mars 2026-09-08：放最上面）。
  // 點整條會捲到頁面的購買區（原本的加車表單）——之後那裡會擺很多可以選購的東西。
  // 價條貼在最上面（top:0），整頁往下推一個價條的高度，黏在頂端的頁首也跟著往下移，
  // 這樣價條不會蓋住頁首、頁首也不會蓋住價條（Air／Pro 的頁首叫 ts-top、Focal 的叫 header，
  // 不認 class 名，用「貼在最上面、固定或黏住、不高於 200px、寬度接近整個視窗」認）。
  var _stickyEls = null;
  function stickyHeaders() {
    if (_stickyEls) return _stickyEls;
    var out = [];
    var els = document.body.querySelectorAll('header, nav, div, section');
    for (var i = 0; i < els.length && i < 4000; i++) {
      var el = els[i];
      if (el.classList.contains('gct-bar')) continue;
      var r = el.getBoundingClientRect();
      if (r.height <= 0 || r.height > 200 || r.top > 2 || r.width < innerWidth * 0.9) continue;
      var pos = getComputedStyle(el).position;
      if (pos !== 'fixed' && pos !== 'sticky') continue;
      out.push(el);
    }
    _stickyEls = out;
    return out;
  }
  function placeBar(bar) {
    var h = Math.round(bar.getBoundingClientRect().height);
    if (!h) return;
    document.documentElement.style.setProperty('--gct-bar-h', h + 'px');
    document.body.style.paddingTop = 'calc(' + (document.body.getAttribute('data-gct-base') || '0px') + ' + ' + h + 'px)';
    stickyHeaders().forEach(function (el) { el.style.top = h + 'px'; });
  }
  function buyTarget() {
    var el = document.querySelector('#buy, #purchase, [id*="buy"], [id*="purchase"], form[action*="/cart/add"]');
    if (el && el.tagName === 'FORM') {
      var sec = el.closest('section, .shopify-section') || el;
      return sec;
    }
    return el;
  }
  // 客人現在選到哪一個變體（換色會改 [name="id"]）。逐品優惠之後，價條與可複製的碼都要跟著它換，
  // 不然選了黑色卻看到白色的價、複製到白色的碼——那個碼對黑色一毛都不折（2026-09-11 審查）。
  function selectedVariantId() {
    var el = document.querySelector('form[action*="/cart/add"] [name="id"]') ||
             document.querySelector('[name="id"]');
    if (el && el.value) return String(el.value);
    var m = location.search.match(/[?&]variant=(\d+)/);
    return m ? m[1] : '';
  }
  function pickItem(items) {
    var sel = selectedVariantId();
    for (var i = 0; i < items.length; i++) {
      if (String(items[i].variant_id) === sel) return items[i];
    }
    return items[0];
  }
  function renderBar(d, ref) {
    if (!d || d.status !== 'active' || !/^\/products\//.test(location.pathname)) return;
    if (document.querySelector('.gct-bar')) return;
    var ids = productVariantIds();
    var items = (d.items || []).filter(function (it) { return ids.indexOf(String(it.variant_id)) >= 0; });
    if (!items.length) return;
    var it = pickItem(items);
    var multi = (d.items || []).length > 1;
    // 置中、沒有關閉鈕、字級照 Mars 2026-09-08 調整：名字與說明 15px、價格 20px 粗、原價 14px、提示 14px
    var css = '.gct-bar{position:fixed;left:0;right:0;z-index:60;background:#1d1d1f;color:#fff;' +
      'padding:10px 16px;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 20px rgba(0,0,0,.18);cursor:pointer;' +
      'font-family:-apple-system,"SF Pro Text","PingFang TC","Noto Sans TC",sans-serif;font-size:15px;line-height:1.35;transition:top .15s;text-align:center}' +
      '.gct-bar__in{display:flex;align-items:baseline;justify-content:center;gap:6px 14px;flex-wrap:wrap;max-width:1120px}' +
      '.gct-bar__who{font-size:15px;color:#f2f2f7;white-space:nowrap;letter-spacing:.01em}' +
      '.gct-bar__price{font-weight:700;font-size:20px;font-variant-numeric:tabular-nums;white-space:nowrap;letter-spacing:-.01em}' +
      '.gct-bar__was{font-size:14px;color:#a1a1a6;text-decoration:line-through;margin-left:8px;font-variant-numeric:tabular-nums}' +
      '.gct-bar__cta{font-size:14px;color:#9ec5ff;white-space:nowrap;text-decoration:underline;text-underline-offset:3px}' +
      '.gct-bar__more{color:#fff;font-size:14px;white-space:nowrap;text-decoration:underline;text-underline-offset:3px}' +
      '@media(max-width:640px){.gct-bar{padding:9px 12px}.gct-bar__who{font-size:13.5px}.gct-bar__price{font-size:18px}.gct-bar__was,.gct-bar__cta,.gct-bar__more{font-size:13px}}';
    css += '.gct-bar__code{display:flex;align-items:center;justify-content:center;gap:9px 12px;flex-wrap:wrap;' +
      'font-size:13px;color:#c7c7cc;padding-top:7px;margin-top:7px;border-top:1px solid rgba(255,255,255,.14);width:100%;max-width:1120px}' +
      '.gct-bar__code b{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:13.5px;font-weight:700;color:#fff;' +
      'background:rgba(255,255,255,.12);border-radius:7px;padding:3px 10px;letter-spacing:.04em}' +
      '.gct-bar__code button{font:inherit;font-size:13px;color:#9ec5ff;background:none;border:0;padding:0;cursor:pointer;' +
      'text-decoration:underline;text-underline-offset:3px}' +
      '.gct-bar__code button[data-gct-done]{color:#7ee2a8;text-decoration:none}' +
      '.gct-bar__code [data-gct-hint]{font-size:12.5px;color:#8e8e93}' +
      '.gct-bar__code [data-gct-codeitem]{display:inline-flex;align-items:center;gap:7px;white-space:nowrap}' +
      // 手機：價條是黏在最上面的，多一行就少一行內容。碼那行壓成一行、長提示整句拿掉——
      // 「你的專屬碼」＋「點一下複製」本身就講完了（實測 375 寬：不壓的話價條會從 90px 變成 166px）
      '@media(max-width:640px){.gct-bar__code{font-size:12.5px;gap:0 10px;flex-wrap:nowrap;padding-top:6px;margin-top:6px;' +
      'white-space:nowrap;overflow:hidden}.gct-bar__code b{font-size:12.5px;padding:2px 8px}' +
      '.gct-bar__code button{font-size:12.5px}.gct-bar__code [data-gct-hint]{display:none}}';
    var style = document.createElement('style'); style.textContent = css; document.head.appendChild(style);
    var bar = document.createElement('div'); bar.className = 'gct-bar'; bar.setAttribute('role', 'button'); bar.setAttribute('tabindex', '0');
    bar.setAttribute('aria-label', '前往購買區');
    bar.style.flexDirection = 'column';
    bar.innerHTML =
      '<div class="gct-bar__in"><span class="gct-bar__who">' + esc(d.kol_name) + ' 粉絲專屬價・結帳自動折</span>' +
      '<span><span class="gct-bar__price">' + fmt(it.team_price) + '</span>' +
      (it.orig_price > it.team_price ? '<span class="gct-bar__was">' + fmt(it.orig_price) + '</span>' : '') + '</span>' +
      '<span class="gct-bar__cta">（詳情請點我）</span>' +
      (multi && d.hub ? '<a class="gct-bar__more" href="' + esc(d.hub) + '">看全部團購商品</a>' : '') + '</div>' +
      // 只列這個商品用的那一個碼——一次列三個碼客人不知道該貼哪個，手機上也會把價條撐成一大塊
      codeRow([it.code || (codeList(allCodes(d))[0] || '')], 'gct-bar__code');
    function go(e) {
      if (e.target.closest('.gct-bar__more') || e.target.closest('.gct-bar__code')) return;
      var t = buyTarget();
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    }
    bar.addEventListener('click', go);
    bar.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') go(e); });
    bar.style.top = '0px';
    var base = getComputedStyle(document.body).paddingTop || '0px';
    document.body.setAttribute('data-gct-base', /calc/.test(base) ? '0px' : base);
    document.body.appendChild(bar);
    bindCopy(bar);
    placeBar(bar);
    var raf = null;
    window.addEventListener('resize', function () { if (raf) return; raf = requestAnimationFrame(function () { raf = null; _stickyEls = null; placeBar(bar); }); });
    setTimeout(function () { _stickyEls = null; placeBar(bar); }, 900);

    // 換色／換版本就重畫價條（價格與可複製的碼都要跟著換）。主題換變體的做法各不相同，
    // 所以三種訊號都收：表單欄位變動、網址的 variant 參數變動、以及主題自己發的事件。
    var lastVid = selectedVariantId();
    function resync() {
      var vid = selectedVariantId();
      if (vid === lastVid) return;
      lastVid = vid;
      var next = pickItem(items);
      var nowEl = bar.querySelector('.gct-bar__price');
      var wasEl = bar.querySelector('.gct-bar__was');
      if (nowEl) nowEl.textContent = fmt(next.team_price);
      if (wasEl) {
        wasEl.textContent = fmt(next.orig_price);
        wasEl.style.display = next.orig_price > next.team_price ? '' : 'none';
      }
      var slot = bar.querySelector('.gct-bar__code');
      if (slot) {
        slot.outerHTML = codeRow([next.code || (codeList(allCodes(d))[0] || '')], 'gct-bar__code');
        bindCopy(bar);
        placeBar(bar);
      }
    }
    document.addEventListener('change', function (e) {
      if (e.target && e.target.name === 'id') resync();
    }, true);
    window.addEventListener('popstate', resync);
    ['variant:change', 'product:variant-change', 'variantChange'].forEach(function (evt) {
      document.addEventListener(evt, resync);
    });
    setInterval(resync, 700);   // 有些主題只改 value 不發事件，輪詢當保底（只比對字串，很便宜）
  }

  /* ── 頁尾「本次專屬活動」（GOS-0262）──
   * 客人落在完整的商品介紹頁，看完介紹滑到最下面才浮出這一檔的其他商品，各卡標自己的優惠。
   * 只有帶 gct= 或 cookie 還在的人看得到；一般訪客與搜尋進來的人完全不會出現這一區。
   */
  function currentProductId() {
    try {
      var m = window.ShopifyAnalytics && window.ShopifyAnalytics.meta && window.ShopifyAnalytics.meta.product;
      if (m && m.id) return String(m.id);
    } catch (e) {}
    return '';   // 讀不到就交給變體比對（isHere 兩條都看），不要在這裡猜
  }
  function campaignMount() {
    var main = document.querySelector('main, #MainContent, [role="main"]');
    if (main) return { el: main, how: 'append' };
    var ftr = document.querySelector('footer, .ts-foot, [class*="footer"]');
    if (ftr && ftr.parentNode) return { el: ftr, how: 'before' };
    return { el: document.body, how: 'append' };
  }
  function daysLeft(iso) {
    if (!iso) return -1;
    var end = new Date(iso + 'T23:59:59');
    if (isNaN(end.getTime())) return -1;
    return Math.ceil((end - new Date()) / 86400000);
  }
  function renderCampaign(d) {
    if (!d || d.status !== 'active' || !/^\/products\//.test(location.pathname)) return;
    if (document.querySelector('.gct-camp')) return;
    var items = (d.items || []).filter(function (it) { return it.handle; });
    if (items.length < 2) return;
    var pid = currentProductId();
    var vids = productVariantIds();
    var isHere = function (it) {
      return (pid && String(it.product_id) === pid) || vids.indexOf(String(it.variant_id)) >= 0;
    };
    // 同一個商品的幾個顏色只畫一張卡
    var seen = {}, cards = [];
    items.forEach(function (it) {
      var key = it.handle;
      if (seen[key]) { if (isHere(it)) seen[key].here = true; return; }
      seen[key] = { it: it, here: isHere(it) };
      cards.push(seen[key]);
    });
    // 這一檔只有現在這個商品＝沒有別的可看，不用長出這一區
    if (cards.length < 2 || !cards.some(function (c) { return !c.here; })) return;

    var css = '.gct-camp{--gc-ink:#1d1d1f;--gc-ink2:#515154;--gc-ink3:#86868b;--gc-line:rgba(0,0,0,.1);--gc-blue:#0b6be0;--gc-soft:#f5f5f7;' +
      'max-width:1240px;margin:0 auto;padding:56px 24px 76px;border-top:1px solid var(--gc-line);color:var(--gc-ink);' +
      'font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text","PingFang TC","Noto Sans TC",sans-serif;box-sizing:border-box}' +
      '.gct-camp *{box-sizing:border-box}' +
      '.gct-camp__hd{display:flex;justify-content:space-between;align-items:flex-end;gap:24px;flex-wrap:wrap}' +
      '.gct-camp__eye{font-size:12px;letter-spacing:.12em;font-weight:600;color:var(--gc-blue)}' +
      '.gct-camp h2{font-size:30px!important;font-weight:700!important;letter-spacing:-.022em;margin:9px 0 0!important;line-height:1.2!important;text-wrap:balance;color:var(--gc-ink)}' +
      '.gct-camp__sub{font-size:15.5px;color:var(--gc-ink2);margin:9px 0 0;max-width:38em;text-wrap:pretty;line-height:1.55}' +
      '.gct-camp__cd{display:flex;align-items:center;gap:9px;font-size:14px;color:var(--gc-ink2);background:var(--gc-soft);' +
      'border-radius:999px;padding:9px 16px;white-space:nowrap;font-variant-numeric:tabular-nums}' +
      '.gct-camp__cd b{color:var(--gc-ink)}' +
      '.gct-camp__grid{display:grid;grid-template-columns:repeat(4,1fr);gap:18px;margin-top:34px}' +
      '.gct-camp__card{background:#fff;border:1px solid var(--gc-line);border-radius:18px;padding:16px;display:flex;' +
      'flex-direction:column;gap:12px;text-align:left;text-decoration:none!important;color:inherit;transition:box-shadow .18s,transform .18s}' +
      '.gct-camp__card:hover{box-shadow:0 10px 30px rgba(0,0,0,.09);transform:translateY(-2px);text-decoration:none!important}' +
      '.gct-camp__card:hover *{text-decoration:none!important}' +
      '.gct-camp__card[data-here]{border-color:var(--gc-blue);box-shadow:0 0 0 1px var(--gc-blue)}' +
      '.gct-camp__img{aspect-ratio:1/1;border-radius:13px;background:var(--gc-soft);position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center}' +
      '.gct-camp__img img{width:100%;height:100%;object-fit:contain;display:block}' +
      '.gct-camp__badge{position:absolute;top:10px;left:10px;font-size:12px;font-weight:700;border-radius:999px;padding:4px 10px;background:#1d1d1f;color:#fff}' +
      '.gct-camp__here{position:absolute;top:10px;right:10px;font-size:11.5px;font-weight:600;border-radius:999px;padding:4px 9px;background:#fff;color:var(--gc-blue);border:1px solid var(--gc-blue)}' +
      '.gct-camp__t{font-size:15px!important;font-weight:600!important;line-height:1.35!important;margin:0!important;text-wrap:balance;color:var(--gc-ink)}' +
      '.gct-camp__p{display:flex;align-items:baseline;gap:9px;font-variant-numeric:tabular-nums;margin-top:auto}' +
      '.gct-camp__now{font-size:21px;font-weight:700;letter-spacing:-.02em}' +
      '.gct-camp__was{font-size:13.5px;color:var(--gc-ink3);text-decoration:line-through}' +
      '.gct-camp__go{font-size:13.5px;color:var(--gc-blue);font-weight:500}' +
      '.gct-camp__foot{margin-top:26px;font-size:13px;color:var(--gc-ink3);max-width:52em;text-wrap:pretty;line-height:1.6}' +
      '@media(max-width:900px){.gct-camp{padding:40px 16px 56px}.gct-camp h2{font-size:24px!important}' +
      '.gct-camp__grid{grid-template-columns:repeat(2,1fr);gap:12px;margin-top:24px}.gct-camp__hd{align-items:flex-start}}' +
      '@media(max-width:520px){.gct-camp__grid{grid-template-columns:1fr}}';
    var style = document.createElement('style'); style.textContent = css; document.head.appendChild(style);

    var left = daysLeft(d.ends_on);
    var cd = left >= 0
      ? '<div class="gct-camp__cd"><span>還有 <b>' + left + ' 天</b>・' +
        esc(d.ends_on.slice(5).replace('-', ' 月 ')) + ' 日截止</span></div>'
      : '';
    var sec = document.createElement('section');
    sec.className = 'gct-camp';
    sec.innerHTML =
      '<div class="gct-camp__hd"><div>' +
        '<div class="gct-camp__eye">僅限此連結</div>' +
        '<h2>' + esc(d.kol_name) + ' 的專屬團購</h2>' +
        '<p class="gct-camp__sub">' + esc(d.intro || '這一檔只有從分享的連結進來才看得到。每個商品的優惠不一樣，加進購物車就自動折。') + '</p>' +
      '</div>' + cd + '</div>' +
      '<div class="gct-camp__grid">' + cards.map(function (c) {
        var it = c.it, off = it.orig_price > it.team_price;
        return '<a class="gct-camp__card" href="/products/' + esc(it.handle) + '?gct=' + esc(d.code) + '"' +
          (c.here ? ' data-here="1"' : '') + '>' +
          '<span class="gct-camp__img">' +
            (it.image ? '<img src="' + esc(it.image) + '" alt="" loading="lazy">' : '') +
            (it.offer ? '<span class="gct-camp__badge">' + esc(it.offer) + '</span>' : '') +
            (c.here ? '<span class="gct-camp__here">你在看這個</span>' : '') +
          '</span>' +
          '<span class="gct-camp__t">' + esc(String(it.title).split('｜')[0]) + '</span>' +
          '<span class="gct-camp__p"><span class="gct-camp__now">' + fmt(it.team_price) + '</span>' +
            (off ? '<span class="gct-camp__was">' + fmt(it.orig_price) + '</span>' : '') + '</span>' +
          '<span class="gct-camp__go">' + (c.here ? '你正在看這一頁' : '看這個商品的介紹 →') + '</span>' +
        '</a>';
      }).join('') + '</div>' +
      '<p class="gct-camp__foot">一般訪客不會看到這一區，也不會看到最上面那條價格——這一頁還是原本的商品介紹頁。</p>';
    var mount = campaignMount();
    if (mount.how === 'before') mount.el.parentNode.insertBefore(sec, mount.el);
    else mount.el.appendChild(sec);
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
      // 目錄頁也給那一行看得到的專屬碼（GOS-0263），跟商品頁同一份實作
      var slot = host.querySelector('[data-gct-codehost]');
      if (slot) {
        slot.innerHTML = codeRow(codeList(cfg.discount), 'gct__code');
        bindCopy(slot);
      }
    }
    bindAdd(host, function () { return ref; }, host.querySelector('[data-gc-toast]'));
  } else if (gct) {
    // ── 商品頁帶 gct 進來：抓資料、種 cookie、套碼、顯示價條 ──
    loadData(gct).then(function (d) {
      if (!d || d.status !== 'active') return;
      writeCookie(d.code, allCodes(d), d.attr_key || '_gc_team', d.days);
      ref = { code: d.code, discount: allCodes(d), attr: d.attr_key || '_gc_team' };
      apply(ref, false);
      hookCartAdd(ref);
      renderBar(d, ref);
      renderCampaign(d);
    });
  } else if (ref && ref.code) {
    // ── 歸因期內回站：套碼；在商品頁就順便顯示價條與頁尾活動區 ──
    apply(ref, false);
    if (/^\/products\//.test(location.pathname)) {
      loadData(ref.code).then(function (d) {
        if (!d) return;
        // 碼可能在這段期間增減（一檔多優惠），以檔期資料為準把 cookie 補正
        var codes = allCodes(d);
        if (codes && codes !== ref.discount) {
          writeCookie(d.code, codes, ref.attr, d.days);
          ref.discount = codes;
          apply(ref, true);
        }
        renderBar(d, ref);
        renderCampaign(d);
      });
    }
  }
  if (ref && ref.code && !gct) hookCartAdd(ref);
})();
