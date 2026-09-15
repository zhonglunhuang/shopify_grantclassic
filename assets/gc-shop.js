/* gc-shop.js — Air／Pro 頁尾「選購」段（GOS-0286）：三步摺疊（顏色 → 買幾件 → 配件）、數字滾動、真加車＋對帳。
   算價與對帳跟 gc-i360.js 同一套規則：折後四捨五入到元；畫面上說會折的配件掛 _gcb 記號，
   加完讀 /cart.js 的 line_level_total_discount——沒折到的配件收回並提醒，主商品沒折只提醒不動它。 */
(function () {
  if (window.__gcShop) return; window.__gcShop = true;
  var MARK = '_gcb';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  // 店的 money format 是 {{amount_no_decimals}}（沒有幣別）；選購段是下決定的地方，一律標 NT$（跟 Pro 頁原本的「NT$ 2,980」一致）
  function money(cents) { var f = (window.themeVariables && window.themeVariables.settings && window.themeVariables.settings.moneyFormat) || '{{amount_no_decimals}}'; var n = cents / 100, r = Math.round(n).toLocaleString('en-US'); var out = f.replace(/\{\{\s*amount_no_decimals\s*\}\}/, r).replace(/\{\{\s*amount\s*\}\}/, n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })).replace(/\{\{[^}]*\}\}/g, r); return /\$/.test(out) ? out : 'NT$' + out; }
  function disc(cents, pct) { return Math.round(cents * (100 - pct) / 100 / 100) * 100; }
  function tween(el, to) {
    var from = el.hasAttribute('data-v') ? parseInt(el.getAttribute('data-v'), 10) : to;
    el.setAttribute('data-v', to);
    if (from === to || reduce || !window.requestAnimationFrame) { el.textContent = money(to); return; }
    if (el.__raf) cancelAnimationFrame(el.__raf);
    var t0 = performance.now(), dur = 500;
    el.classList.add('tick'); clearTimeout(el.__tk); el.__tk = setTimeout(function () { el.classList.remove('tick'); }, 650);
    function step(now) { var p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 3); el.textContent = money(Math.round((from + (to - from) * e) / 100) * 100); if (p < 1) el.__raf = requestAnimationFrame(step); else el.textContent = money(to); }
    el.__raf = requestAnimationFrame(step);
  }
  var SW = { '石墨黑': '#2c2c2e', '黑': '#1d1d1f', '黑色': '#1d1d1f', '極地銀': '#c9c9ce', '銀': '#c9c9ce', '銀色': '#c9c9ce', '白': '#f2f2f2', '白色': '#f2f2f2', '灰': '#8e8e93', '藍': '#3a6ea5', '紅': '#e84448', 'black': '#1d1d1f', 'silver': '#c9c9ce', 'white': '#f2f2f2' };
  function swatch(name) { var k = String(name || '').toLowerCase(); if (SW[name]) return SW[name]; for (var key in SW) if (k.indexOf(key.toLowerCase()) >= 0) return SW[key]; return '#c7c7cc'; }
  function parseTiers(s, withQty) { return String(s || '').split(',').map(function (x) { var a = x.split(':'); return withQty ? { q: parseInt(a[0], 10) || 0, p: parseInt(a[1], 10) || 0 } : parseInt(a[0], 10) || 0; }).filter(function (t) { return withQty ? (t.q > 0 && t.p > 0) : true; }); }
  var NAMES = { 2: '兩入組', 3: '三入組', 4: '四入組', 5: '五入組', 6: '六入組', 8: '八入組', 10: '十入組' };

  // 款式名去掉各款共同的段落（跟 gc-i360.js 同一套）：「扁線手機充電掛繩 USB-C to USB-C / 黑色」→「黑色」
  function shortTitles(vs) {
    // 以「空格」切成字，去掉每一款都一樣的開頭與結尾（「扁線手機充電掛繩 USB-C to USB-C / 黑色」→「USB-C / 黑色」）
    var parts = vs.map(function (v) { return String(v.title || '').split(' '); });
    if (parts.length < 2) return vs.map(function (v) { return v.title; });
    var lead = 0; while (parts.every(function (p) { return p.length > lead + 1 && p[lead] === parts[0][lead]; })) lead++;
    var tail = 0; while (parts.every(function (p) { var i = p.length - 1 - tail; return i > lead && p[i] === parts[0][parts[0].length - 1 - tail]; })) tail++;
    return parts.map(function (p) { var out = p.slice(lead, p.length - tail).join(' ').replace(/^\/\s*|\s*\/$/g, ''); return out || p.join(' '); });
  }
  function vsel(a) {
    var vs = a.variants || []; if (vs.length < 2) return '';
    var labels = shortTitles(vs);
    return '<span class="gc-shop__vsel" data-vsel="' + esc(a.handle) + '"><select aria-label="款式">' + vs.map(function (v, i) { return '<option value="' + esc(v.id) + '"' + (String(v.id) === String(a.vid) ? ' selected' : '') + '>' + esc(labels[i]) + '</option>'; }).join('') + '</select></span>';
  }
  function setup(root) {
    if (root.hasAttribute('data-gc-ready')) return; root.setAttribute('data-gc-ready', '');
    var variants, addonsArr, bundles;
    try { variants = JSON.parse($('[data-gc-variants]', root).textContent); addonsArr = JSON.parse($('[data-gc-addons]', root).textContent); bundles = JSON.parse($('[data-gc-bundles]', root).textContent); } catch (e) { return; }
    if (!variants.length) return;
    var qt = parseTiers(root.getAttribute('data-qtiers'), true).sort(function (a, b) { return a.q - b.q; });
    var at = parseTiers(root.getAttribute('data-atiers'), false); if (!at.length || at.every(function (x) { return !x; })) at = [];
    var addons = {}; addonsArr.forEach(function (a) { addons[a.handle] = a; });
    bundles.forEach(function (b) { b.items = String(b.handles || '').split(',').filter(function (h) { return addons[h]; }); });
    bundles = bundles.filter(function (b) { return b.items.length; });
    var hasColor = variants.length > 1 && variants.some(function (v) { return v.color && v.color !== 'Default Title'; });
    var curId = root.getAttribute('data-cur');
    var S = { vi: Math.max(0, variants.map(function (v) { return String(v.id); }).indexOf(String(curId))), qty: 1, qmode: 'card', bundle: null, adds: {}, open: hasColor ? 0 : 1, done: [!hasColor, false, false] };
    var stepEls = { color: $('[data-step="color"]', root), qty: $('[data-step="qty"]', root), addons: $('[data-step="addons"]', root) };
    var order = ['color', 'qty', 'addons'];
    if (!hasColor) stepEls.color.hidden = true;
    if (!qt.length) { var qh = $('[data-qhint]', stepEls.qty); if (qh) qh.textContent = '同色或混色都算'; }
    var hasAddons = addonsArr.length > 0;
    if (!hasAddons) stepEls.addons.hidden = true;
    var sum = $('[data-gc-sum]', root), stage = $('[data-gc-stage]', root);
    // 大圖：每個變體一張，切顏色換圖
    stage.innerHTML = variants.map(function (v, i) { return '<img src="' + esc(v.img) + '" alt="" data-vi="' + i + '"' + (i === S.vi ? '' : ' hidden') + '>'; }).join('');
    var toast = document.createElement('div'); toast.className = 'gc-shop__toast'; root.appendChild(toast); var tt;
    function say(m) { toast.textContent = m; toast.classList.add('on'); clearTimeout(tt); tt = setTimeout(function () { toast.classList.remove('on'); }, 3200); }
    function cur() { return variants[S.vi]; }
    function volPct(n) { var p = 0; qt.forEach(function (t) { if (n >= t.q) p = t.p; }); return p; }
    function addPct(n) { return (!at.length || n <= 0) ? 0 : (at[Math.min(n, at.length) - 1] || 0); }
    function inBundle(h) { return S.bundle !== null && bundles[S.bundle].items.indexOf(h) >= 0; }
    function selAdds() { return addonsArr.filter(function (a) { return S.adds[a.handle] || inBundle(a.handle); }); }
    function pctFor(a, n) { return inBundle(a.handle) ? (bundles[S.bundle].pct || addPct(n)) : addPct(n); }
    function total() { var v = cur(), main = disc(v.price, volPct(S.qty)) * S.qty, list = selAdds(), n = list.length, sum = 0, was = (v.cmp > v.price ? v.cmp : v.price) * S.qty; list.forEach(function (a) { sum += disc(a.price, pctFor(a, n)); was += a.price; }); return { now: main + sum, was: was, n: n }; }
    function otherQ() { var has = { 1: 1 }; qt.forEach(function (t) { has[t.q] = 1; }); var q = 2; while (has[q]) q++; return q; }
    function qtyName() { return S.qty === 1 ? '單件' : (NAMES[S.qty] || S.qty + ' 件'); }
    function card(attr, on, inner, badge, extraCls) { return '<button type="button" class="gc-shop__card' + (on ? ' on' : '') + (extraCls ? ' ' + extraCls : '') + '" ' + attr + '>' + (badge ? '<span class="gc-shop__badge">' + esc(badge) + '</span>' : '') + inner + '</button>'; }
    function isOpen(k) { return order[S.open] === k; }
    function addSub(n, pct) { return n === 0 ? '再加購 1 件，省 ' + at[0] + '%' : n < at.length ? '已省 ' + pct + '%，再加 1 件省 ' + at[n] + '%' : '已達最高 ' + at[at.length - 1] + '% 折扣'; }
    function patchAddons(body, n, pct) {
      var bar = $('.gc-shop__bar i', body); if (bar) bar.style.width = Math.min(n, 3) / 3 * 100 + '%';
      var sub = $('.gc-shop__sub2', body); if (sub && at.length) sub.textContent = (bundles.length ? '或自己挑：' : '') + addSub(n, pct);
      $$('[data-b]', body).forEach(function (c) { c.classList.toggle('on', S.bundle === parseInt(c.getAttribute('data-b'), 10)); });
      $$('[data-a]', body).forEach(function (c) {
        var h = c.getAttribute('data-a'), a = addons[h]; if (!a) return;
        var inB = inBundle(h), on = inB || !!S.adds[h], p = on ? pctFor(a, n) : 0;
        c.classList.toggle('on', on); c.disabled = inB;
        var sm = $('.gc-shop__n small', c); if (sm) sm.textContent = (a.sub || '') + (inB ? (a.sub ? '・' : '') + '已在套餐裡' : '');
        var pr = $('.gc-shop__pr', c), b = $('[data-tw]', pr); if (b) b.setAttribute('data-tw', disc(a.price, p));
        var st = $('s', pr); if (p && !st) { st = document.createElement('s'); st.textContent = money(a.price); pr.appendChild(st); } else if (!p && st) st.remove();
      });
    }

    function render() {
      var v = cur();
      order.forEach(function (k, i) { var el = stepEls[k]; el.classList.toggle('is-done', S.done[i] && S.open !== i); el.classList.toggle('is-todo', !S.done[i] && S.open !== i); });
      // 收起來的一行
      var bp = volPct(S.qty), each = disc(v.price, bp);
      var dsum = {
        color: '<b>' + esc(v.color) + '</b>',
        qty: '<b>' + qtyName() + '</b><small>' + (S.qty > 1 ? money(each * S.qty) + '，每件 ' + money(each) + (bp ? '，省 ' + money((v.price - each) * S.qty) : '') : money(v.price)) + '</small>',
        addons: (function () { var l = selAdds(); if (!l.length) return '<b>不加配件</b>'; var t = S.bundle !== null ? bundles[S.bundle].name : ''; var extra = l.filter(function (a) { return !inBundle(a.handle); }).length; return '<b>' + esc(t || '自選配件') + (extra ? '＋' + extra + ' 件加購' : '') + '</b><small>' + esc(l.map(function (a) { return a.title; }).join('、')) + '</small>'; })()
      };
      order.forEach(function (k) { $('[data-dsum]', stepEls[k]).innerHTML = dsum[k]; });
      // 顏色
      var h0 = '<div class="gc-shop__grid">';
      variants.forEach(function (vv, i) { h0 += card('data-c="' + i + '"' + (vv.avail ? '' : ' disabled'), S.vi === i, '<span class="gc-shop__dot" style="background:' + swatch(vv.color) + '"></span><span class="gc-shop__n"><b>' + esc(vv.color) + (vv.avail ? '' : '（缺貨）') + '</b></span>', '', vv.avail ? '' : 'is-off'); });
      h0 += '</div>';
      // 買幾件
      var h1 = '<div class="gc-shop__grid">';
      h1 += card('data-q="1"', S.qmode === 'card' && S.qty === 1, '<span class="gc-shop__n"><b>單件</b><small>' + money(v.price) + '</small></span><span class="gc-shop__pr"><b>' + money(v.price) + '</b></span>');
      // 一階一張卡（2:10,3:15,6:20 → 兩入組／三入組／六入組），最後才是「其他數量」；角標只掛第一階
      qt.forEach(function (t2, ti) { var e2 = disc(v.price, t2.p); h1 += card('data-q="' + t2.q + '"', S.qmode === 'card' && S.qty === t2.q, '<span class="gc-shop__n"><b>' + (NAMES[t2.q] || t2.q + ' 件') + '</b><small>每件 ' + money(e2) + '，折 ' + t2.p + '%</small></span><span class="gc-shop__pr"><b>' + money(e2 * t2.q) + '</b><s>' + money(v.price * t2.q) + '</s><em>省 ' + money((v.price - e2) * t2.q) + '</em></span>', ti === 0 ? '最多人選' : ''); });
      h1 += '</div>';
      var qn = S.qmode === 'step' ? S.qty : otherQ(), eq = disc(v.price, volPct(qn));
      h1 += '<div class="gc-shop__qrow' + (S.qmode === 'step' ? ' on' : '') + '" data-qrow><span class="gc-shop__n"><b>其他數量</b><small>' + qn + ' 件 ' + money(eq * qn) + (volPct(qn) ? '，折 ' + volPct(qn) + '%，省 ' + money((v.price - eq) * qn) : '') + '</small></span><div class="gc-shop__q"><button type="button" data-qm' + (qn <= 2 ? ' disabled' : '') + ' aria-label="減少">−</button><span>' + qn + '</span><button type="button" data-qp aria-label="增加">+</button></div></div>';
      if (S.qmode === 'step' && hasAddons) h1 += '<button type="button" class="gc-shop__next" data-next>下一步</button>';
      // 配件
      var n = selAdds().length, pct = addPct(n), h2 = '';
      if (bundles.length) { h2 += '<div class="gc-shop__list">'; bundles.forEach(function (b, i) { var bsum = 0, bnow = 0; b.items.forEach(function (h) { var a = addons[h]; bsum += a.price; bnow += disc(a.price, b.pct || addPct(b.items.length)); }); h2 += card('data-b="' + i + '"', S.bundle === i, '<img src="' + esc(addons[b.items[0]].img) + '" alt=""><span class="gc-shop__n"><b>' + esc(b.name) + '</b><small>' + esc(b.desc ? b.desc.split(';')[0] : b.items.map(function (h) { return addons[h].title; }).join('＋')) + '</small></span><span class="gc-shop__pr"><b>+' + money(bnow) + '</b>' + (bnow < bsum ? '<s>' + money(bsum) + '</s><em>省 ' + money(bsum - bnow) + '</em>' : '') + '</span>', b.badge || (i === 0 ? '最划算' : '')); }); h2 += '</div>'; }
      if (at.length) h2 += '<p class="gc-shop__sub2">' + (bundles.length ? '或自己挑：' : '') + addSub(n, pct) + '</p><div class="gc-shop__bar"><i style="width:' + Math.min(n, 3) / 3 * 100 + '%"></i></div>';
      else if (bundles.length) h2 += '<p class="gc-shop__sub2">或自己挑：</p>';
      h2 += '<div class="gc-shop__list">';
      addonsArr.forEach(function (a) { var inB = inBundle(a.handle), on = inB || !!S.adds[a.handle], p = on ? pctFor(a, n) : 0; h2 += card('data-a="' + esc(a.handle) + '"' + (inB ? ' disabled' : ''), on, '<img src="' + esc(a.img) + '" alt=""><span class="gc-shop__n"><b>' + esc(a.title) + '</b><small>' + esc(a.sub || '') + (inB ? (a.sub ? '・' : '') + '已在套餐裡' : '') + '</small>' + vsel(a) + '</span><span class="gc-shop__pr"><b data-tw="' + disc(a.price, p) + '">' + money(disc(a.price, p)) + '</b>' + (p ? '<s>' + money(a.price) + '</s>' : '') + '</span>'); });
      h2 += '</div>';
      [['color', h0], ['qty', h1]].forEach(function (pair) { var body = $('[data-body]', stepEls[pair[0]]); if (body.innerHTML !== pair[1]) body.innerHTML = pair[1]; });
      // 配件那步：卡片還是同一批就只改狀態（進度條滑過去、價格滾動），整塊重畫會「啪」一聲（Mars 2026-09-16）
      var abody = $('[data-body]', stepEls.addons), akey = addonsArr.map(function (a) { return a.handle; }).join(',') + '|' + bundles.length + '|' + at.length;
      if (abody.getAttribute('data-key') !== akey) { abody.innerHTML = h2; abody.setAttribute('data-key', akey); } else patchAddons(abody, n, pct);
      $$('[data-tw]', stepEls.addons).forEach(function (el) { tween(el, parseInt(el.getAttribute('data-tw'), 10)); });
      $$('img[data-vi]', stage).forEach(function (im) { im.hidden = parseInt(im.getAttribute('data-vi'), 10) !== S.vi; });
      // 摘要列
      var t = total(), parts = []; if (hasColor) parts.push(v.color); parts.push(qtyName()); if (S.bundle !== null) parts.push(bundles[S.bundle].name); var extra = selAdds().filter(function (a) { return !inBundle(a.handle); }).length; if (extra) parts.push('＋' + extra + ' 件加購');
      $('[data-ss]', sum).textContent = parts.join('・');
      tween($('[data-st]', sum), t.now); $('[data-sw]', sum).textContent = t.was > t.now ? '原價 ' + money(t.was) + '，省 ' + money(t.was - t.now) : '';
      var add = $('[data-add]', sum); add.disabled = !v.avail; if (!v.avail) add.textContent = '暫時缺貨'; else if (!add.getAttribute('aria-busy')) add.textContent = '加入購物車';
    }
    function goto(i) { S.open = i; render(); }
    function nextAfter(i) { for (var j = i + 1; j < order.length; j++) if (!stepEls[order[j]].hidden) return j; return i; }

    root.addEventListener('click', function (e) {
      if (e.target.closest('select')) return;   // 款式下拉在卡片裡：點它不算點卡片
      var b = e.target.closest('button'); if (!b || !root.contains(b)) return;
      var stepEl = b.closest('.gc-shop__step'), si = stepEl ? order.indexOf(stepEl.getAttribute('data-step')) : -1;
      if (b.hasAttribute('data-chg')) { goto(si); return; }
      if (b.hasAttribute('data-c')) { var vi = parseInt(b.getAttribute('data-c'), 10); if (!variants[vi].avail) return; S.vi = vi; S.done[0] = true; try { var u = new URL(location.href); u.searchParams.set('variant', variants[vi].id); history.replaceState({}, '', u); } catch (err) {} goto(nextAfter(0)); return; }
      if (b.hasAttribute('data-q')) { S.qmode = 'card'; S.qty = parseInt(b.getAttribute('data-q'), 10); S.done[1] = true; goto(nextAfter(1)); return; }
      if (b.hasAttribute('data-qm') || b.hasAttribute('data-qp')) { if (S.qmode !== 'step') { S.qmode = 'step'; S.qty = otherQ(); } S.qty = Math.max(2, Math.min(99, S.qty + (b.hasAttribute('data-qp') ? 1 : -1))); S.done[1] = true; render(); return; }
      if (b.hasAttribute('data-next')) { S.done[1] = true; goto(nextAfter(1)); return; }
      if (b.hasAttribute('data-b')) { var i = parseInt(b.getAttribute('data-b'), 10); S.bundle = (S.bundle === i) ? null : i; S.done[2] = true; render(); return; }
      if (b.hasAttribute('data-a')) { var h = b.getAttribute('data-a'); S.adds[h] = !S.adds[h]; S.done[2] = true; render(); return; }
    });
    root.addEventListener('change', function (e) {
      var box = e.target.closest('[data-vsel]'); if (!box) return;
      var a = addons[box.getAttribute('data-vsel')]; if (!a) return;
      var v = (a.variants || []).filter(function (x) { return String(x.id) === String(e.target.value); })[0]; if (!v) return;
      a.vid = v.id; a.price = v.price; render();
    });
    root.addEventListener('click', function (e) { var r = e.target.closest('[data-qrow]'); if (r && !e.target.closest('button') && S.qmode !== 'step') { S.qmode = 'step'; S.qty = otherQ(); S.done[1] = true; render(); } });

    // 加入購物車：主商品×數量＋配件，一次 /cart/add.js；有折的配件掛記號，加完對帳
    var adding = false;
    async function addToCart() {
      if (adding) return; var v = cur(); if (!v.avail) return; adding = true;
      var btn = $('[data-add]', sum); btn.setAttribute('aria-busy', 'true'); btn.textContent = '加入中…';
      var list = selAdds(), n = list.length, items = [{ id: v.id, quantity: S.qty }], dealIds = {}, dealPct = 0, mainPct = volPct(S.qty);
      list.forEach(function (a) { var it = { id: a.vid, quantity: 1 }; if (pctFor(a, n) > 0) { var props = {}; props[MARK] = '1'; it.properties = props; dealIds[String(a.vid)] = true; dealPct = 1; } items.push(it); });
      var routes = (window.themeVariables && window.themeVariables.routes) || {}, root_ = (window.Shopify && window.Shopify.routes && window.Shopify.routes.root) || '/';
      var cartUrl = routes.cartUrl || (root_ + 'cart'), addUrl = (routes.cartAddUrl || (root_ + 'cart/add'));
      var res, json;
      try { res = await fetch(addUrl + '.js', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest', 'Accept': 'application/json' }, body: JSON.stringify({ items: items }) }); json = await res.json(); }
      catch (err) { res = { ok: false }; json = { description: '加入購物車失敗，請再試一次。' }; }
      if (res.ok && (dealPct || mainPct)) {
        try {
          var cart0 = await (await fetch(cartUrl + '.js', { credentials: 'same-origin' })).json();
          var bad = {}, mainMissed = false;
          function gotDisc(l) { return (l.line_level_total_discount || l.total_discount || 0) > 0 || (l.line_level_discount_allocations || l.discount_allocations || []).some(function (d) { return (d.amount || d.discount_amount || 0) > 0; }); } // /cart.js 的折扣在 line_level_*（2026-09-15 真購物車驗過；discount_allocations 是訂單 API 的欄位，購物車沒有）
          (cart0.items || []).forEach(function (l) { var p = l.properties || {}; if (p[MARK] && dealIds[String(l.variant_id || l.id)]) { if (!gotDisc(l)) bad[l.key] = 0; return; } if (mainPct && String(l.variant_id || l.id) === String(v.id) && l.quantity >= S.qty && !gotDisc(l)) mainMissed = true; });
          if (Object.keys(bad).length) { await fetch(cartUrl + '/update.js', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify({ updates: bad }) }); alert('配件的折扣現在套不上（活動可能剛結束），配件已從購物車移除——你選的主商品還在。'); }
          else if (mainMissed) alert('買多件的折扣現在套不上（活動可能剛結束），購物車顯示的是實際價格，請確認後再結帳。');
        } catch (err) { /* 對帳失敗不擋客人：購物車頁看到的是 Shopify 算的真價格 */ }
      }
      btn.removeAttribute('aria-busy'); btn.textContent = '加入購物車'; adding = false;
      if (res.ok) { location.href = cartUrl; return; }
      alert(json.description || '加入購物車失敗，請再試一次。');
    }
    $('[data-add]', sum).addEventListener('click', function (e) { e.preventDefault(); addToCart(); });
    // 摘要列只在選購段進到畫面時出現；Air 的 ts-buybar 這時讓位（body.gc-shop-on）
    if ('IntersectionObserver' in window) { new IntersectionObserver(function (es) { es.forEach(function (x) { sum.classList.toggle('on', x.isIntersecting); document.body.classList.toggle('gc-shop-on', x.isIntersecting); }); }, { threshold: 0.05 }).observe(root); } else sum.classList.add('on');
    render();
    root.__gcShop = { state: S, render: render };
  }
  function init() { $$('[data-gc-shop]').forEach(setup); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
  document.addEventListener('shopify:section:load', init);
})();
