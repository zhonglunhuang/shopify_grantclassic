/* gc-i360.js — 商品頁上半部（Insta360 版型）的互動：選項方塊換變體與圖、套餐卡片、加購配件、
   底欄價格、加入購物車（主商品＋配件一次 /cart/add.js）。折扣百分比只是畫面，真折扣靠後台自動折扣。
   套餐卡帶 data-pct（GrantOS 套餐組 GOS-0281 寫的折數）時：卡上的配件照那個折數算，
   加完購物車去讀 /cart.js 對帳——Shopify 真的折了才算數，沒折到就把配件收回並告訴客人。 */
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
    // 團購價（GrantOS GOS-0285）：gc-team.js 抓到檔期後會廣播「這幾個變體的團購價」（variant_id → {now, was}，單位＝分），
    // 底欄與入組卡的主商品改用它、原價劃線；配件照原本規則。沒帶團購連結的訪客這張表永遠是空的，底下每一條都走原本的路。
    var teamPrices = (window.__gcTeamPrices && typeof window.__gcTeamPrices === 'object') ? window.__gcTeamPrices : {};
    // 有團購價時劃掉的是「原本的售價」（跟頁頂價條同一個數字），不是 compare_at 那個定價——
    // 兩個地方一個劃 2,280、一個劃 3,980，客人會以為是兩檔不同的優惠。
    function mainPrice() {
      var t = teamPrices[String(cur.id)];
      if (t && t.now > 0 && t.was > t.now) return { now: t.now, was: t.was };
      return { now: cur.price, was: cur.cmp > cur.price ? cur.cmp : cur.price };
    }
    document.addEventListener('gc-team:prices', function (e) { teamPrices = (e.detail && typeof e.detail === 'object') ? e.detail : {}; render(); });
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
        var selEl = document.createElement('select'); selEl.setAttribute('aria-label', '款式');
        vs.forEach(function (v) { var op = document.createElement('option'); op.value = v.id; op.textContent = v.title; op.selected = String(v.id) === String(a.vid); selEl.appendChild(op); });
        box.textContent = ''; box.appendChild(selEl);
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
    // 套餐卡自己的折數（GrantOS 套餐組寫進 custom.bundles 第五段）；沒有的卡走加購階梯
    var bundlePct = {}; bundleEls.forEach(function (b) { var k = b.getAttribute('data-bundle'), p = parseInt(b.getAttribute('data-pct') || '', 10); if (k !== 'custom' && p > 0) bundlePct[k] = p; });
    var BMARK = '_gcb';  // 我們預期會被折到的配件列（套餐卡上的、或有加購階梯的）掛這個記號，對帳收回時只認記號
    // 同件買多件（GOS-0283）：custom.qty_tiers "2:10,3:15" → [{q:2,p:10},{q:3,p:15}]，qty 遞增
    var qtyTiers = (root.getAttribute('data-qtiers') || '').split(',').map(function (x) { var a = x.split(':'); return { q: parseInt(a[0], 10) || 0, p: parseInt(a[1], 10) || 0 }; }).filter(function (t) { return t.q > 0 && t.p > 0; }).sort(function (a, b) { return a.q - b.q; });
    var qty = 1;
    function volPct(n) { var p = 0; qtyTiers.forEach(function (t) { if (n >= t.q) p = t.p; }); return p; }
    function volHint(n) {
      if (!qtyTiers.length) return '';
      var now = volPct(n), next = null;
      qtyTiers.forEach(function (t) { if (t.q > n && next === null) next = t; });
      if (next) return (now ? '已省 ' + now + '%，' : '') + '再買 ' + (next.q - n) + ' 件省 ' + next.p + '%';
      return '已達最高 ' + now + '% 折扣';
    }

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
    // 這個配件現在幾折：在目前套餐卡裡而且那張卡有自己的折數 → 用卡的；否則走加購階梯
    function addonPct(h, key, n) { var inB = (bundleAddons[key] || []).indexOf(h) >= 0; if (inB && bundlePct[key]) return bundlePct[key]; return pctFor(n); }
    // withAdds＝底欄總價（含客人勾的加購、主商品×數量與買多件折扣）；套餐卡本身永遠是「一組」的價
    function bundlePrice(key, withAdds) {
      var list = (bundleAddons[key] || []).slice();
      if (withAdds) onList().forEach(function (h) { if (list.indexOf(h) < 0) list.push(h); });
      var pct = pctFor(list.length), n = withAdds ? qty : 1, vp = withAdds ? volPct(qty) : 0;
      var mp = mainPrice(), now = discounted(mp.now, vp) * n, was = mp.was * n;
      list.forEach(function (h) { var a = addons[h]; if (!a) return; now += discounted(a.price, addonPct(h, key, list.length)); was += a.price; });
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
      $$('[data-gi-vcard]', root).forEach(function (c) { var on = c.getAttribute('data-gi-vcard') === String(cur.id); c.classList.toggle('is-on', on); c.setAttribute('aria-pressed', on); });
      bundleEls.forEach(function (b) { var k = b.getAttribute('data-bundle'); if (k === 'custom') return; var on = k === state.bundle; b.classList.toggle('is-on', on); if (b.tagName === 'BUTTON') b.setAttribute('aria-pressed', on); var p = $('[data-gi-bprice]', b); if (p) { var bp = bundlePrice(k); p.innerHTML = money(bp.now) + (bp.was > bp.now ? '<s>' + money(bp.was) + '</s>' : ''); } });
      var total = bundlePrice(state.bundle, true), n = onList().length, addPct = pctFor(total.n);
      addonRows.forEach(function (r) { var a = addons[r.getAttribute('data-gi-addon')]; r.setAttribute('aria-pressed', a.on); var now = $('[data-gi-adnow]', r), was = $('[data-gi-adwas]', r); var pct = a.on ? addonPct(a.handle, state.bundle, total.n) : 0; if (now) tween(now, discounted(a.price, pct)); if (was) { was.hidden = !pct; was.textContent = money(a.price); } });
      var bar = $('[data-gi-pbar]', root); if (bar) bar.style.width = Math.min(n, 3) / 3 * 100 + '%';
      var noDisc = tiers.every(function (x) { return !x; });
      var ptxt = $('[data-gi-ptxt]', root); if (ptxt && noDisc) ptxt.textContent = n ? '已選 ' + n + ' 件配件，會一起加入購物車' : '勾選配件，一起加入購物車'; else if (ptxt) ptxt.textContent = n === 0 ? '再加購 1 件，省 ' + tiers[0] + '%' : n === 1 ? '已省 ' + tiers[0] + '%，再加 1 件省 ' + (tiers[1] || tiers[0]) + '%' : n === 2 ? '已省 ' + (tiers[1] || tiers[0]) + '%，再加 1 件省 ' + tiers[tiers.length - 1] + '%' : '已達最高 ' + tiers[tiers.length - 1] + '% 折扣';
      // 底欄價格與規格摘要
      var bp = total;
      var priceEl = $('[data-gi-price]', root), cmpEl = $('[data-gi-cmp]', root);
      if (priceEl) tween(priceEl, bp.now);
      if (cmpEl) { cmpEl.hidden = !(bp.was > bp.now); cmpEl.textContent = money(bp.was); }
      // 團購價生效時底欄掛記號：手機版平常藏起來的劃線原價，這時要露出來（gc-i360.css）
      if (priceEl && priceEl.parentNode) priceEl.parentNode.classList.toggle('gi__barp--team', mainPrice().now !== cur.price);
      var qn = $('[data-gi-qn]', root), qm = $('[data-gi-qm]', root), qi = $('[data-gi-qinput]', root), qh = $('[data-gi-qhint]', root);
      if (qn) qn.textContent = qty; if (qm) qm.disabled = qty <= 1; if (qi) qi.value = qty;
      if (qh) { var h = volHint(qty); qh.hidden = !h; qh.textContent = h; }
      // 入組卡：數量剛好等於那張卡就反白；價格照 JS 同一套四捨五入重算（Liquid 只會無條件捨去），換變體時也跟著變
      $$('[data-gi-qcard]', root).forEach(function (c) {
        var n = parseInt(c.getAttribute('data-qcard') || c.getAttribute('data-gi-qcard'), 10), on = n === qty;
        c.classList.toggle('is-on', on); c.setAttribute('aria-pressed', on);
        var each = discounted(mainPrice().now, volPct(n)), pe = $('[data-gi-qeach]', c), pp = $('[data-gi-qprice]', c), bg = $('.gi__badge', c);
        if (pe) pe.textContent = money(each);
        if (pp) pp.innerHTML = money(each * n) + '<s>' + money(cur.price * n) + '</s>';
        if (bg) bg.textContent = '省 ' + money(cur.price * n - each * n);
      });
      var extra = onList().filter(function (h) { return (bundleAddons[state.bundle] || []).indexOf(h) < 0; }).length; // 套餐內含的不算加購
      var bname = (bundleNames[state.bundle] || '') + (extra ? '＋' + extra + ' 件加購' : '');
      // 用 textContent 組，不用 innerHTML 串字串：套餐名／選項值是後台填的文字，不能當 HTML 解析（資安審查）
      $$('[data-gi-meta]', root).forEach(function (m) {
        var parts = sel.filter(function (v) { return v !== 'Default Title'; }).concat(bname ? [bname] : []);
        m.textContent = '';
        parts.forEach(function (v, i) { if (i) m.appendChild(document.createElement('i')); var sp = document.createElement('span'); sp.textContent = v; m.appendChild(sp); });
      });
      // 物品面板：主商品＋目前套餐與加購的配件
      var items = $('[data-gi-items]', root);
      if (items) {
        var list = (bundleAddons[state.bundle] || []).slice(); onList().forEach(function (h) { if (list.indexOf(h) < 0) list.push(h); });
        var pimg = root.getAttribute('data-gi-pimg') || cur.img, palt = root.getAttribute('data-gi-pimg-alt') || '';
        if (palt.indexOf('=') > 0) { var pk = palt.split('='); if (cur.opts.indexOf(pk[0]) >= 0) pimg = pk.slice(1).join('='); } // 顏色對得上就換白色去背
        function fig(src, cap, cls) { var f = document.createElement('figure'); f.className = cls; var im = document.createElement('img'); im.src = src || ''; im.alt = ''; var c = document.createElement('figcaption'); c.textContent = cap; f.appendChild(im); f.appendChild(c); return f; }
        items.textContent = '';
        items.appendChild(fig(pimg, root.getAttribute('data-gi-pname') || '', 'gi__item gi__item--main'));
        var accEl = document.createElement('div'), accN = 0;
        list.forEach(function (h) { var a = addons[h]; if (!a) return; var im = $('.gi__adimg img', a.el), nm = $('.gi__adname', a.el); accEl.appendChild(fig(im ? im.src : '', nm ? nm.textContent : h, 'gi__item')); accN++; });
        if (accN) { var plus = document.createElement('span'); plus.className = 'gi__plus'; plus.setAttribute('aria-hidden', 'true'); plus.textContent = '＋'; items.appendChild(plus); accEl.className = 'gi__acc gi__acc--' + Math.min(list.length, 4); items.appendChild(accEl); }
        items.hidden = state.view !== 'items';
      }
      // 圖
      var img = $('[data-gi-img]', root), vid = $('[data-gi-video]', root);
      if (state.view === 'items' && items) { img.hidden = true; if (vid) { vid.hidden = true; var v0 = vid.querySelector('video'); if (v0) v0.pause(); } }
      else if (state.view === 'video' && vid) { img.hidden = true; vid.hidden = false; var v = vid.querySelector('video'); if (v && v.paused) v.play().catch(function () {}); }
      else { if (vid) { vid.hidden = true; var v2 = vid.querySelector('video'); if (v2) v2.pause(); } img.hidden = false; var src = state.view === 'variant' ? cur.img : state.view; if (src && img.getAttribute('src') !== src) { img.style.transform = 'none'; img.classList.remove('is-fit'); img.src = src; } else if (root.__autoFit) root.__autoFit(); }
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
    // 變體當套餐卡：點了就是換變體
    $$('[data-gi-vcard]', root).forEach(function (c) { c.addEventListener('click', function () { var v = variants.filter(function (x) { return String(x.id) === c.getAttribute('data-gi-vcard'); })[0]; if (!v) return; cur = v; sel = v.opts.slice(); render(); try { var u = new URL(location.href); u.searchParams.set('variant', v.id); history.replaceState({}, '', u); } catch (err) {} }); });
    bundleEls.forEach(function (b) { if (b.tagName === 'BUTTON') b.addEventListener('click', function () { state.bundle = b.getAttribute('data-bundle'); Object.keys(addons).forEach(function (h) { addons[h].on = (bundleAddons[state.bundle] || []).indexOf(h) >= 0; }); if (hasItemsTab()) state.view = 'items'; render(); }); });
    $$('[data-gi-qcard]', root).forEach(function (c) { c.addEventListener('click', function () { var n = parseInt(c.getAttribute('data-gi-qcard'), 10); qty = (qty === n) ? 1 : n; render(); }); }); // 再點一次＝回到 1 件
    var qmB = $('[data-gi-qm]', root), qpB = $('[data-gi-qp]', root);
    if (qmB) qmB.addEventListener('click', function () { if (qty > 1) { qty--; render(); } });
    if (qpB) qpB.addEventListener('click', function () { if (qty < 99) { qty++; render(); } });
    var tabs = $('[data-gi-tabs]', root); if (tabs) tabs.addEventListener('click', function (e) { var t = e.target.closest('.gi__tab'); if (!t) return; state.view = t.getAttribute('data-src'); render(); });
    var gift = $('.gi__gift .gi__cb', root); if (gift) gift.closest('.gi__gift').addEventListener('click', function (e) { if (e.target.closest('a')) return; gift.classList.toggle('is-on'); });

    // 加入購物車：主商品＋勾選的配件一次送
    var form = $('form.gi__form', root);
    async function add() {
      if (!cur.avail) return;
      var items = [{ id: cur.id, quantity: qty }];
      var list = (bundleAddons[state.bundle] || []).slice(); onList().forEach(function (h) { if (list.indexOf(h) < 0) list.push(h); });
      var dealPct = 0, dealIds = {}, mainPct = volPct(qty);
      list.forEach(function (h) {
        var a = addons[h]; if (!a) return;
        var it = { id: a.vid, quantity: 1 };
        // 畫面上說會折的配件（套餐卡的折數、或加購階梯）掛記號，加完要對帳；沒說折的不掛
        if (addonPct(h, state.bundle, list.length) > 0) { var props = {}; props[BMARK] = '1'; it.properties = props; dealIds[String(a.vid)] = true; dealPct = 1; }
        items.push(it);
      });
      var buttons = $$('[data-gi-add]', root);
      buttons.forEach(function (b) { b.disabled = true; b.setAttribute('aria-busy', 'true'); });
      var routes = (window.themeVariables && window.themeVariables.routes) || {};
      var res, json;
      try {
        res = await fetch((routes.cartAddUrl || '/cart/add') + '.js', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest', 'Accept': 'application/json' }, body: JSON.stringify({ items: items, sections: 'mini-cart' }) });
        json = await res.json();
      } catch (err) { res = { ok: false }; json = { description: '加入購物車失敗，請再試一次。' }; }
      var cartType = root.getAttribute('data-cart-type') || (window.themeVariables && window.themeVariables.settings && window.themeVariables.settings.cartType) || 'page';
      // 套餐對帳：Shopify 有沒有真的折到那幾件配件。沒折到（活動剛結束、被別的折扣擠掉…）就收回、講一聲，
      // 不讓客人抱著一個標著折扣、結帳卻原價的東西走到結帳頁。只收我們掛記號的那幾列。
      if (res.ok && (dealPct || mainPct)) {
        try {
          var cart0 = await (await fetch((routes.cartUrl || '/cart') + '.js', { credentials: 'same-origin' })).json();
          var bad = {}, mainMissed = false;
          function gotDisc(l) { return (l.discount_allocations || []).some(function (d) { return (d.amount || d.discount_amount || 0) > 0; }); }
          (cart0.items || []).forEach(function (l) {
            var p = l.properties || {};
            if (p[BMARK] && dealIds[String(l.variant_id || l.id)]) { if (!gotDisc(l)) bad[l.key] = 0; return; }
            // 同件買多件：主商品那列數量到了階梯卻沒折 → 只提醒不動它（客人自己選的數量，不能替他改）
            if (mainPct && String(l.variant_id || l.id) === String(cur.id) && l.quantity >= qty && !gotDisc(l)) mainMissed = true;
          });
          if (Object.keys(bad).length) {
            await fetch((routes.cartUrl || '/cart') + '/update.js', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify({ updates: bad }) });
            alert('配件的折扣現在套不上（活動可能剛結束），配件已從購物車移除——你選的主商品還在。');
          } else if (mainMissed) {
            alert('買多件的折扣現在套不上（活動可能剛結束），購物車顯示的是實際價格，請確認後再結帳。');
          }
        } catch (err) { /* 對帳失敗不擋客人：購物車頁與結帳頁看到的是 Shopify 算的真價格 */ }
      }
      buttons.forEach(function (b) { b.disabled = false; b.removeAttribute('aria-busy'); });
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
    // 大圖自動置中：商品照的留白每張不一樣（有的產品偏下），用 canvas 找出「非底色」的範圍，
    // 再用 transform 把產品本體放到灰底矩形正中央、放大到約 72% 高。Shopify CDN 有開 CORS，抓不到就放棄不動。
    var galEl = $('[data-gi-gal]', root), mainImg = $('[data-gi-img]', root), fitT;
    function autoFit() {
      if (!mainImg || !galEl || mainImg.hidden || !mainImg.complete || !mainImg.naturalWidth) return;
      try {
        var W = 160, H = 160, c = document.createElement('canvas'); c.width = W; c.height = H;
        var x = c.getContext('2d', { willReadFrequently: true }); x.drawImage(mainImg, 0, 0, W, H);
        var d = x.getImageData(0, 0, W, H).data, bg = [d[0], d[1], d[2]], minx = W, miny = H, maxx = -1, maxy = -1;
        for (var yy = 0; yy < H; yy++) for (var xx = 0; xx < W; xx++) { var i = (yy * W + xx) * 4; if (d[i + 3] < 20) continue; if (Math.abs(d[i] - bg[0]) + Math.abs(d[i + 1] - bg[1]) + Math.abs(d[i + 2] - bg[2]) > 36) { if (xx < minx) minx = xx; if (xx > maxx) maxx = xx; if (yy < miny) miny = yy; if (yy > maxy) maxy = yy; } }
        if (maxx < 0 || (maxx - minx) < 8 || (maxy - miny) < 8) return;
        var fx = (minx + maxx + 1) / 2 / W, fy = (miny + maxy + 1) / 2 / H, fw = (maxx - minx + 1) / W, fh = (maxy - miny + 1) / H;
        mainImg.style.transform = 'none';
        var r = mainImg.getBoundingClientRect(), g = galEl.getBoundingClientRect();
        var padB = parseFloat(getComputedStyle(galEl).paddingBottom) || 0, contentH = g.height - padB;
        var s = Math.min((contentH * 0.72) / (fh * r.height), (g.width * 0.8) / (fw * r.width)); s = Math.max(0.6, Math.min(2.4, s));
        var cx = g.left + g.width / 2, cy = g.top + contentH / 2, px = r.left + fx * r.width, py = r.top + fy * r.height;
        mainImg.style.transformOrigin = (fx * 100) + '% ' + (fy * 100) + '%';
        mainImg.style.transform = 'translate(' + (cx - px).toFixed(1) + 'px,' + (cy - py).toFixed(1) + 'px) scale(' + s.toFixed(3) + ')';
        mainImg.classList.add('is-fit');
      } catch (e) { /* 跨網域讀不到像素就維持原樣 */ }
    }
    if (mainImg) { mainImg.addEventListener('load', autoFit); window.addEventListener('resize', function () { clearTimeout(fitT); fitT = setTimeout(autoFit, 120); }); }
    root.__autoFit = autoFit;
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
