/* gc-i360.js — 商品頁上半部（Insta360 版型）的互動：選項方塊換變體與圖、套餐卡片、加購配件、
   底欄價格、加入購物車（主商品＋配件一次 /cart/add.js）。折扣百分比只是畫面，真折扣靠後台自動折扣。 */
(function () {
  if (window.__gcI360) return; window.__gcI360 = true;
  var SW = { 'graphite black': '#2c2c2e', black: '#1d1d1f', silver: '#c9c9ce', white: '#f2f2f2', gray: '#8e8e93', grey: '#8e8e93', red: '#e84448', blue: '#3a6ea5', navy: '#1f3a5f', green: '#4f7f5a', pink: '#f0a3b6', purple: '#7d5ba6', yellow: '#f2c94c', orange: '#f28c28', brown: '#7b4b2a', beige: '#d9c7b2', '石墨黑': '#2c2c2e', '黑': '#1d1d1f', '黑色': '#1d1d1f', '白': '#f2f2f2', '白色': '#f2f2f2', '紅色': '#e84448', '橙色': '#f28c28', '藍色': '#3a6ea5', '淺藍色': '#8fbbe8', '藏藍': '#1f3a5f', '粉色': '#f0a3b6', '粉紅色': '#f0a3b6', '淺紫色': '#b9a3d9', '墨綠色': '#2f5d50', '軍綠': '#5b6b3a', '駝色': '#c19a6b', '卡其': '#b8a27a', '銀色': '#c9c9ce', '灰': '#8e8e93', '灰色': '#8e8e93' };
  function swatch(name) { var k = String(name || '').toLowerCase().trim(); if (SW[k]) return SW[k]; for (var key in SW) if (k.indexOf(key) >= 0) return SW[key]; return '#c7c7cc'; }
  function money(cents) { var f = (window.themeVariables && window.themeVariables.settings && window.themeVariables.settings.moneyFormat) || '{{amount_no_decimals}}'; var n = cents / 100; var r = Math.round(n).toLocaleString('en-US'); return f.replace(/\{\{\s*amount_no_decimals\s*\}\}/, r).replace(/\{\{\s*amount\s*\}\}/, n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })).replace(/\{\{[^}]*\}\}/g, r); }
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // 數字跳動：從上一個值滑到新值（0.5 秒、先快後慢），並閃一下紅色
  function tween(el, to) {
    var from = el.hasAttribute('data-v') ? parseInt(el.getAttribute('data-v'), 10) : to;
    el.setAttribute('data-v', to);
    if (from === to || reduceMotion || !window.requestAnimationFrame) { el.textContent = money(to); return; }
    if (el.__raf) cancelAnimationFrame(el.__raf);
    var t0 = performance.now(), dur = 500;
    el.classList.add('is-tick'); clearTimeout(el.__tk); el.__tk = setTimeout(function () { el.classList.remove('is-tick'); }, 650);
    function step(now) { var p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 3); el.textContent = money(Math.round((from + (to - from) * e) / 100) * 100); if (p < 1) el.__raf = requestAnimationFrame(step); else el.textContent = money(to); }
    el.__raf = requestAnimationFrame(step);
  }
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }

  function setup(root) {
    if (root.hasAttribute('data-gi-ready')) return; root.setAttribute('data-gi-ready', '');
    var variants; try { variants = JSON.parse($('[data-gi-variants]', root).textContent); } catch (e) { variants = []; }
    if (!variants.length) return;
    var tiers = (root.getAttribute('data-tiers') || '5,10,15').split(',').map(function (x) { return parseInt(x, 10) || 0; });
    var idInput = $('[data-gi-id]', root);
    var cur = variants.filter(function (v) { return String(v.id) === String(idInput && idInput.value); })[0] || variants[0];
    var sel = cur.opts.slice();
    var optGroups = $$('[data-gi-opt]', root);
    var bundleEls = $$('[data-bundle]', root);
    var bundleNames = {}; bundleEls.forEach(function (b) { var n = $('.gi__bnm', b); bundleNames[b.getAttribute('data-bundle')] = n ? n.textContent.trim() : ''; });
    var addonRows = $$('[data-gi-addon]', root);
    var addons = {};
    addonRows.forEach(function (r) {
      var vs; try { vs = JSON.parse(r.getAttribute('data-variants') || '[]'); } catch (e) { vs = []; }
      var a = { el: r, handle: r.getAttribute('data-gi-addon'), vid: r.getAttribute('data-vid'), price: parseInt(r.getAttribute('data-price') || '0', 10), on: false, variants: vs };
      addons[a.handle] = a;
      if (vs.length > 1) {
        var box = $('[data-gi-adsel]', r);
        box.innerHTML = '<select aria-label="款式">' + vs.map(function (v) { return '<option value="' + v.id + '"' + (String(v.id) === String(a.vid) ? ' selected' : '') + '>' + v.title + '</option>'; }).join('') + '</select>';
        box.addEventListener('click', function (e) { e.stopPropagation(); });
        box.querySelector('select').addEventListener('change', function (e) {
          var v = vs.filter(function (x) { return String(x.id) === e.target.value; })[0]; if (!v) return;
          a.vid = String(v.id); a.price = v.price; var img = $('.gi__adimg img', r); if (img && v.img && !img.hasAttribute('data-gi-cut')) img.src = v.img; render();
        });
      }
      r.addEventListener('click', function () { a.on = !a.on; if ($('.gi__tab[data-src="items"]', root)) state.view = 'items'; render(); }); // 加購是疊在目前套餐上，不會取消套餐的選取
    });
    var state = { bundle: 'std', view: 'variant' };
    var bundleAddons = {}; bundleEls.forEach(function (b) { var k = b.getAttribute('data-bundle'); if (k !== 'custom') bundleAddons[k] = (b.getAttribute('data-addons') || '').split(',').filter(Boolean); });

    // 色塊上色
    // 色塊：認得出顏色才畫，認不出（例如「材質」其實是款式名）就不畫灰點
    $$('[data-gi-dot]', root).forEach(function (d) { var c = swatch(d.getAttribute('data-gi-dot')); if (c === '#c7c7cc') d.remove(); else d.style.setProperty('--c', c); });

    function findVariant(opts) {
      var exact = variants.filter(function (v) { return v.opts.join('|') === opts.join('|'); })[0];
      return exact || null;
    }
    function pctFor(n) { if (n <= 0) return 0; return tiers[Math.min(n, tiers.length) - 1] || 0; }
    function discounted(cents, pct) { return Math.round(cents * (100 - pct) / 100 / 100) * 100; }
    function onList() { return Object.keys(addons).filter(function (h) { return addons[h].on; }); }
    // key＝套餐卡片：只算套餐自己的配件；withAdds＝再加上使用者勾的加購（底欄總價用）
    function bundlePrice(key, withAdds) {
      var list = (bundleAddons[key] || []).slice();
      if (withAdds) onList().forEach(function (h) { if (list.indexOf(h) < 0) list.push(h); });
      var pct = pctFor(list.length), now = cur.price, was = (cur.cmp > cur.price ? cur.cmp : cur.price);
      list.forEach(function (h) { var a = addons[h]; if (!a) return; now += discounted(a.price, pct); was += a.price; });
      return { now: now, was: was, n: list.length, pct: pct };
    }
    function render() {
      // 選項方塊：目前值反白；跟目前其他選項組不出變體的畫斜線
      optGroups.forEach(function (g, gi) {
        $$('.gi__tile', g).forEach(function (t) {
          var val = t.getAttribute('data-val'); var on = sel[gi] === val;
          t.classList.toggle('is-on', on); t.setAttribute('aria-checked', on);
          var test = sel.slice(); test[gi] = val; var v = findVariant(test);
          t.classList.toggle('is-off', !v || !v.avail);
        });
      });
      bundleEls.forEach(function (b) { var k = b.getAttribute('data-bundle'); if (k === 'custom') return; var on = k === state.bundle; b.classList.toggle('is-on', on); if (b.tagName === 'BUTTON') b.setAttribute('aria-pressed', on); var p = $('[data-gi-bprice]', b); if (p) { var bp = bundlePrice(k); p.innerHTML = money(bp.now) + (bp.was > bp.now ? '<s>' + money(bp.was) + '</s>' : ''); } });
      var total = bundlePrice(state.bundle, true), n = onList().length, addPct = pctFor(total.n);
      addonRows.forEach(function (r) { var a = addons[r.getAttribute('data-gi-addon')]; r.setAttribute('aria-pressed', a.on); var now = $('[data-gi-adnow]', r), was = $('[data-gi-adwas]', r); var pct = a.on ? addPct : 0; if (now) tween(now, discounted(a.price, pct)); if (was) { was.hidden = !pct; was.textContent = money(a.price); } });
      var bar = $('[data-gi-pbar]', root); if (bar) bar.style.width = Math.min(n, 3) / 3 * 100 + '%';
      var noDisc = tiers.every(function (x) { return !x; });
      var ptxt = $('[data-gi-ptxt]', root); if (ptxt && noDisc) ptxt.textContent = n ? '已選 ' + n + ' 件配件，會一起加入購物車' : '勾選配件，一起加入購物車'; else if (ptxt) ptxt.textContent = n === 0 ? '再加購 1 件，省 ' + tiers[0] + '%' : n === 1 ? '已省 ' + tiers[0] + '%，再加 1 件省 ' + (tiers[1] || tiers[0]) + '%' : n === 2 ? '已省 ' + (tiers[1] || tiers[0]) + '%，再加 1 件省 ' + tiers[tiers.length - 1] + '%' : '已達最高 ' + tiers[tiers.length - 1] + '% 折扣';
      // 底欄價格與規格摘要
      var bp = total;
      var priceEl = $('[data-gi-price]', root), cmpEl = $('[data-gi-cmp]', root);
      if (priceEl) tween(priceEl, bp.now);
      if (cmpEl) { cmpEl.hidden = !(bp.was > bp.now); cmpEl.textContent = money(bp.was); }
      var extra = onList().filter(function (h) { return (bundleAddons[state.bundle] || []).indexOf(h) < 0; }).length; // 套餐內含的不算加購
      var bname = (bundleNames[state.bundle] || '') + (extra ? '＋' + extra + ' 件加購' : '');
      $$('[data-gi-meta]', root).forEach(function (m) { m.innerHTML = sel.filter(function (v) { return v !== 'Default Title'; }).map(function (v) { return '<span>' + v + '</span>'; }).concat(bname ? ['<span>' + bname + '</span>'] : []).join('<i></i>'); });
      // 物品面板：主商品＋目前套餐與加購的配件
      var items = $('[data-gi-items]', root);
      if (items) {
        var list = (bundleAddons[state.bundle] || []).slice(); onList().forEach(function (h) { if (list.indexOf(h) < 0) list.push(h); });
        var pimg = root.getAttribute('data-gi-pimg') || cur.img, palt = root.getAttribute('data-gi-pimg-alt') || '';
        if (palt.indexOf('=') > 0) { var pk = palt.split('='); if (cur.opts.indexOf(pk[0]) >= 0) pimg = pk.slice(1).join('='); } // 顏色對得上就換白色去背
        var html = '<figure class="gi__item gi__item--main"><img src="' + pimg + '" alt=""><figcaption>' + (root.getAttribute('data-gi-pname') || '') + '</figcaption></figure>';
        var acc = '';
        list.forEach(function (h) { var a = addons[h]; if (!a) return; var im = $('.gi__adimg img', a.el), nm = $('.gi__adname', a.el); acc += '<figure class="gi__item"><img src="' + (im ? im.src : '') + '" alt=""><figcaption>' + (nm ? nm.textContent : h) + '</figcaption></figure>'; });
        if (acc) html += '<span class="gi__plus" aria-hidden="true">＋</span><div class="gi__acc gi__acc--' + Math.min(list.length, 4) + '">' + acc + '</div>';
        items.innerHTML = html; items.hidden = state.view !== 'items';
      }
      // 圖
      var img = $('[data-gi-img]', root), vid = $('[data-gi-video]', root);
      if (state.view === 'items' && items) { img.hidden = true; if (vid) { vid.hidden = true; var v0 = vid.querySelector('video'); if (v0) v0.pause(); } }
      else if (state.view === 'video' && vid) { img.hidden = true; vid.hidden = false; var v = vid.querySelector('video'); if (v && v.paused) v.play().catch(function () {}); }
      else { if (vid) { vid.hidden = true; var v2 = vid.querySelector('video'); if (v2) v2.pause(); } img.hidden = false; var src = state.view === 'variant' ? cur.img : state.view; if (src && img.getAttribute('src') !== src) img.src = src; }
      $$('.gi__tab', root).forEach(function (t) { t.classList.toggle('is-on', t.getAttribute('data-src') === state.view); });
      // 借圖的變體：在「目前變體圖」分頁上標示示意
      var gtag = $('[data-gi-gtag]', root);
      if (gtag) { var showTag = state.view === 'variant' && cur.own === false && cur.opts[cur.opts.length - 1] !== 'Default Title'; gtag.hidden = !showTag; if (showTag) gtag.textContent = (root.getAttribute('data-gi-tag') || '示意圖，實品為 %s').replace('%s', cur.opts[cur.opts.length - 1]); }
      if (idInput) idInput.value = cur.id;
      $$('[data-gi-add]', root).forEach(function (b) { b.disabled = !cur.avail; b.textContent = cur.avail ? (b.getAttribute('data-label') || b.textContent) : '售完'; });
    }
    $$('[data-gi-add]', root).forEach(function (b) { b.setAttribute('data-label', b.textContent.trim()); });

    optGroups.forEach(function (g, gi) {
      g.addEventListener('click', function (e) {
        var t = e.target.closest('.gi__tile'); if (!t) return;
        var test = sel.slice(); test[gi] = t.getAttribute('data-val');
        var v = findVariant(test);
        if (!v) { // 這個值配目前其他選項組不出來：找含這個值的第一個變體
          v = variants.filter(function (x) { return x.opts[gi] === test[gi]; })[0]; if (!v) return;
        }
        cur = v; sel = v.opts.slice(); render();
        try { var u = new URL(location.href); u.searchParams.set('variant', v.id); history.replaceState({}, '', u); } catch (err) {}
      });
    });
    function hasItemsTab() { return !!$('.gi__tab[data-src="items"]', root); }
    bundleEls.forEach(function (b) { if (b.tagName === 'BUTTON') b.addEventListener('click', function () { state.bundle = b.getAttribute('data-bundle'); Object.keys(addons).forEach(function (h) { addons[h].on = (bundleAddons[state.bundle] || []).indexOf(h) >= 0; }); if (hasItemsTab()) state.view = 'items'; render(); }); });
    var tabs = $('[data-gi-tabs]', root); if (tabs) tabs.addEventListener('click', function (e) { var t = e.target.closest('.gi__tab'); if (!t) return; state.view = t.getAttribute('data-src'); render(); });
    var gift = $('.gi__gift .gi__cb', root); if (gift) gift.closest('.gi__gift').addEventListener('click', function (e) { if (e.target.closest('a')) return; gift.classList.toggle('is-on'); });

    // 加入購物車：主商品＋勾選的配件一次送
    var form = $('form.gi__form', root);
    async function add() {
      if (!cur.avail) return;
      var items = [{ id: cur.id, quantity: 1 }];
      var list = (bundleAddons[state.bundle] || []).slice(); onList().forEach(function (h) { if (list.indexOf(h) < 0) list.push(h); });
      list.forEach(function (h) { var a = addons[h]; if (a) items.push({ id: a.vid, quantity: 1 }); });
      var buttons = $$('[data-gi-add]', root);
      buttons.forEach(function (b) { b.disabled = true; b.setAttribute('aria-busy', 'true'); });
      var routes = (window.themeVariables && window.themeVariables.routes) || {};
      var res, json;
      try {
        res = await fetch((routes.cartAddUrl || '/cart/add') + '.js', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest', 'Accept': 'application/json' }, body: JSON.stringify({ items: items, sections: 'mini-cart' }) });
        json = await res.json();
      } catch (err) { res = { ok: false }; json = { description: '加入購物車失敗，請再試一次。' }; }
      buttons.forEach(function (b) { b.disabled = false; b.removeAttribute('aria-busy'); });
      var cartType = root.getAttribute('data-cart-type') || (window.themeVariables && window.themeVariables.settings && window.themeVariables.settings.cartType) || 'page';
      if (res.ok) {
        if (cartType === 'page') { location.href = (routes.cartUrl || '/cart'); return; }
        if (form) form.dispatchEvent(new CustomEvent('variant:added', { bubbles: true, detail: { variant: json.items ? json.items[0] : json } }));
        fetch((routes.cartUrl || '/cart') + '.js').then(async function (r2) {
          var cart = await r2.json();
          document.documentElement.dispatchEvent(new CustomEvent('cart:updated', { bubbles: true, detail: { cart: cart } }));
          cart.sections = json.sections;
          document.documentElement.dispatchEvent(new CustomEvent('cart:refresh', { bubbles: true, detail: { cart: cart, openMiniCart: cartType === 'drawer' } }));
        });
      }
      (form || root).dispatchEvent(new CustomEvent('cart-notification:show', { bubbles: true, cancelable: true, detail: { status: res.ok ? 'success' : 'error', error: json.description || '' } }));
      if (!res.ok) alert(json.description || '加入購物車失敗，請再試一次。');
    }
    $$('[data-gi-add]', root).forEach(function (b) { b.addEventListener('click', function (e) { e.preventDefault(); add(); }); });
    if (form) form.addEventListener('submit', function (e) { e.preventDefault(); add(); });
    document.body.classList.add('gi-has-bar');
    // 底欄實際高度給 CSS（手機 68、桌機 88），浮動小工具照這個往上推
    var barEl = $('[data-gi-bar]', root);
    function setBarVar() { if (barEl) document.documentElement.style.setProperty('--gi-bar', barEl.getBoundingClientRect().height + 'px'); }
    setBarVar(); window.addEventListener('resize', setBarVar);
    // 往下捲：浮動小工具淡出；往上捲或停 450ms：回來
    var lastY = window.scrollY, idleT;
    window.addEventListener('scroll', function () {
      var y = window.scrollY, down = y > lastY + 2; lastY = y;
      if (down) document.body.classList.add('gi-scrolling'); else if (y < lastY + 0) document.body.classList.remove('gi-scrolling');
      if (!down) document.body.classList.remove('gi-scrolling');
      clearTimeout(idleT); idleT = setTimeout(function () { document.body.classList.remove('gi-scrolling'); }, 450);
    }, { passive: true });
    render();
  }
  function init() { $$('[data-gi]').forEach(setup); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
  document.addEventListener('shopify:section:load', init);
})();
