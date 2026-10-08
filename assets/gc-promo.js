/* gc-promo.js — 商品頁的「買就送」贈品區（GrantOS GOS-0269）。
 *
 * 折扣本身是 Shopify 原生的「購買 X 送 Y」在算（GrantOS GOS-0268 建的），這支只做兩件事：
 *   1. 把活動畫出來——客人要看得到「買這個送這些」才會買。
 *   2. 把贈品放進購物車——**原生折扣只算錢、不會自動加贈品**（Shopify 官方文件明寫）。
 *
 * 第 2 件裡有一半是 Vitals 做不到的：它的贈品只能靠組合區自己那顆按鈕加，客人按商品頁
 * 主按鈕「加入購物車」拿不到贈品（那一檔展示 303 次只有 35 次點擊就是這個結構的結果），
 * 而能治本的「加入購物車時彈出」在 Hobby 方案裡標示為不可用、要花錢升級。
 * 這裡直接攔 /cart/add，**主按鈕也拿得到贈品**。
 *
 * 只新增這一個檔＋一個資料版型；主題原檔一個都不改（全站載入那一行除外）。
 * 跟 gc-team.js 各自包 window.fetch，兩層是串起來的（都用 origFetch.apply）——互不打架。
 */
(function () {
  if (window.__gcPromoInit) return;
  window.__gcPromoInit = true;

  var DATA_URL = '/pages/gc-promo?view=gc-promo-data';
  var KEY = 'gc_promo_data';
  /* 快取只放 10 分鐘，跟 GrantOS 那支收攤排程同一個節奏（`pm/scheduler.py::_promo_tick`）。
   * **沒有這個期限的話「賣完了」會慢半拍**：客人分頁開著逛，期間活動賣完被關檔，
   * 他那一頁的贈品區還在、按下去 Shopify 已經不折——贈品被照原價收錢，
   * 正是那支排程在防的事。結束日的檢查擋不到這種（賣完跟日期無關）。 */
  var TTL = 10 * 60 * 1000;

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function fmt(n) { return 'NT$' + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }

  // 活動資料：資料版型回 metafield 那份 JSON。同一個分頁只抓一次（跟 gc-team.js 同一套）
  function loadData(force) {
    try {
      var hit = JSON.parse(sessionStorage.getItem(KEY) || 'null');
      var age = hit && hit.at ? (Date.now() - hit.at) : -1;
      // **正負都要看**：手機時鐘先快後被校正回來的話 age 會是負的，
      // 只寫 `age < TTL` 等於這份快取永遠不過期。
      if (!force && hit && hit.d && age >= 0 && age < TTL) return Promise.resolve(hit.d);
    } catch (e) {}
    return fetch(DATA_URL, { credentials: 'same-origin' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) {
        if (d && d.offers) {
          try {
            sessionStorage.setItem(KEY, JSON.stringify({ at: Date.now(), d: d }));
          } catch (e) {}
          return d;
        }
        return null;
      }).catch(function () { return null; });
  }

  // 這一頁的商品有哪些變體。DOM 那條是退路：ShopifyAnalytics 在特製版型上不一定有
  function productVariantIds() {
    var ids = [];
    try {
      var meta = window.ShopifyAnalytics && window.ShopifyAnalytics.meta
        && window.ShopifyAnalytics.meta.product;
      if (meta && meta.variants) meta.variants.forEach(function (v) { ids.push(String(v.id)); });
    } catch (e) {}
    if (!ids.length) {
      Array.prototype.forEach.call(document.querySelectorAll('[name="id"]'), function (el) {
        if (el.tagName === 'SELECT') {
          Array.prototype.forEach.call(el.options, function (o) {
            if (o.value) ids.push(String(o.value));
          });
        } else if (el.value) { ids.push(String(el.value)); }
      });
    }
    return ids;
  }

  function selectedVariantId() {
    var el = document.querySelector('form[action*="/cart/add"] [name="id"]') ||
             document.querySelector('[name="id"]');
    if (el && el.value) return String(el.value);
    // 客人從 /products/x?variant=123 進來、版型還沒把值同步到表單時的退路（gc-team.js 有）
    var m = location.search.match(/[?&]variant=(\d+)/);
    return m ? m[1] : '';
  }

  /* 主商品卡要畫「客人現在選的那一個變體」。
   * 同一支商品的不同容量價格不一樣，固定畫第一筆的話價格會是錯的
   * ——團購價條犯過同一個錯（GOS-0261 審查抓到）。 */
  function pickBuy(buys) {
    var sel = selectedVariantId();
    for (var i = 0; i < buys.length; i++) {
      if (String(buys[i].variant_id) === sel) return buys[i];
    }
    var ids = productVariantIds();
    for (var j = 0; j < buys.length; j++) {
      if (ids.indexOf(String(buys[j].variant_id)) >= 0) return buys[j];
    }
    return buys[0];
  }

  /* 台北的「現在」。**不能用客人手機的時區**：折扣的起訖是釘在台北時間的，
   * 人在美西的客人本機還是 9/30 晚上時台北已經 10/1，折扣早就停了——
   * 照本機時區算會讓畫面說「還有 1 天」然後按下去被照原價收錢。 */
  function tpeNow() {
    var d = new Date();
    return new Date(d.getTime() + (d.getTimezoneOffset() + 480) * 60000);
  }
  /* 距離某一天還有幾天（負數＝已經過了）。
   * **日期要自己拆**：`new Date('2026-09-30T23:59:59')` 在舊版 WebKit（LINE 內建瀏覽器、
   * 舊 iOS Safari）會被當成 UTC，台北時間差 8 小時，最後一天會少算一天。 */
  /* 還有幾天——**只用來畫倒數**，不要拿它的正負判斷活動在不在（見 inWindow）。 */
  function daysLeft(iso) {
    var end = dayEdge(iso, true);
    if (!end) return -1;
    var left = Math.ceil((end - tpeNow()) / 86400000);
    return left === 0 ? 0 : left;      // 把負零正規化成 0，不要印出「還有 -0 天」
  }
  // 這一檔現在到底算不算「正在跑」：開始日到了、結束日還沒過
  // 把 YYYY-MM-DD 拆成當天的起點／終點（台北牆鐘座標系，跟 tpeNow() 同一套）
  function dayEdge(iso, end) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso || ''));
    if (!m) return null;
    return end ? new Date(+m[1], +m[2] - 1, +m[3], 23, 59, 59)
               : new Date(+m[1], +m[2] - 1, +m[3], 0, 0, 0);
  }
  /* 活動現在到底算不算在跑。
   * **直接比時間，不要看 daysLeft 的正負**：`Math.ceil` 在「剛過期、還不到一天」時
   * 回的是負零，而 JavaScript 裡 `-0 < 0` 是 **false**——結束日隔天一整天這個檢查
   * 會說「還在跑」，商品頁照畫、按鈕照按，Shopify 早就不折了（審查抓到的）。 */
  function inWindow(o) {
    var now = tpeNow(), e = dayEdge(o.ends_on, true), st = dayEdge(o.starts_on, false);
    if (e && e < now) return false;
    if (st && st > now) return false;
    return true;
  }

  function mount() {
    var main = document.querySelector('main, #MainContent, [role="main"]');
    if (main) return { el: main, how: 'append' };
    var ftr = document.querySelector('footer, .ts-foot, [class*="footer"]');
    if (ftr && ftr.parentNode) return { el: ftr, how: 'before' };
    return { el: document.body, how: 'append' };
  }

  function css() {
    return '.gcp{--gc-ink:#1d1d1f;--gc-ink2:#515154;--gc-ink3:#86868b;--gc-line:rgba(0,0,0,.1);' +
      '--gc-blue:#0b6be0;--gc-soft:#f5f5f7;max-width:1240px;margin:0 auto;padding:56px 24px;' +
      'border-top:1px solid var(--gc-line);color:var(--gc-ink);box-sizing:border-box;' +
      'font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text","PingFang TC","Noto Sans TC",sans-serif}' +
      '.gcp *{box-sizing:border-box}' +
      '.gcp__hd{display:flex;justify-content:space-between;align-items:flex-end;gap:24px;flex-wrap:wrap}' +
      '.gcp__eye{font-size:12px;letter-spacing:.12em;font-weight:600;color:var(--gc-blue)}' +
      '.gcp h2{font-size:30px!important;font-weight:700!important;letter-spacing:-.022em;' +
      'margin:9px 0 0!important;line-height:1.2!important;text-wrap:balance;color:var(--gc-ink)}' +
      '.gcp__sub{font-size:15.5px;color:var(--gc-ink2);margin:9px 0 0;max-width:38em;' +
      'line-height:1.55;text-wrap:pretty}' +
      '.gcp__cd{display:flex;align-items:center;gap:9px;font-size:14px;color:var(--gc-ink2);' +
      'background:var(--gc-soft);border-radius:999px;padding:9px 16px;white-space:nowrap;' +
      'font-variant-numeric:tabular-nums}' +
      '.gcp__cd b{color:var(--gc-ink)}' +
      '.gcp__row{display:flex;align-items:stretch;gap:16px;flex-wrap:wrap;margin-top:34px}' +
      '.gcp__card{background:#fff;border:1px solid var(--gc-line);border-radius:18px;padding:16px;' +
      'flex:1 1 200px;min-width:0;display:flex;flex-direction:column;gap:12px}' +
      '.gcp__card[data-main]{border-color:var(--gc-blue);box-shadow:0 0 0 1px var(--gc-blue)}' +
      '.gcp__card[data-gcp-pick]{cursor:pointer}' +
      '.gcp__card[data-on]{border-color:#8a5a00;box-shadow:0 0 0 1px #8a5a00}' +
      '.gcp__card[data-gcp-pick]:focus-visible{outline:2px solid var(--gc-blue);outline-offset:2px}' +
      '.gcp__img{aspect-ratio:1/1;border-radius:13px;background:var(--gc-soft);position:relative;' +
      'overflow:hidden;display:flex;align-items:center;justify-content:center}' +
      '.gcp__img img{width:100%;height:100%;object-fit:contain;display:block}' +
      '.gcp__badge{position:absolute;top:10px;left:10px;font-size:12px;font-weight:700;' +
      'border-radius:999px;padding:4px 10px;background:#1d1d1f;color:#fff}' +
      '.gcp__badge[data-gift]{background:#8a5a00}' +
      '.gcp__t{font-size:15px!important;font-weight:600!important;line-height:1.35!important;' +
      'margin:0!important;text-wrap:balance;color:var(--gc-ink)}' +
      '.gcp__v{font-size:13.5px;line-height:1.4;color:var(--gc-ink3);margin-top:-8px}' +
      '.gcp__p{display:flex;align-items:baseline;gap:9px;font-variant-numeric:tabular-nums;margin-top:auto}' +
      '.gcp__now{font-size:21px;font-weight:700;letter-spacing:-.02em}' +
      '.gcp__was{font-size:13.5px;color:var(--gc-ink3);text-decoration:line-through}' +
      '.gcp__plus{align-self:center;font-size:22px;color:var(--gc-ink3);flex:none;padding:0 2px;line-height:1}' +
      '.gcp__act{display:flex;align-items:center;gap:16px;flex-wrap:wrap;margin-top:28px}' +
      '.gcp__btn{border:0;border-radius:999px;background:var(--gc-blue);color:#fff;font-size:16px;' +
      'font-weight:600;padding:14px 28px;cursor:pointer;font-family:inherit;line-height:1.2}' +
      '.gcp__btn[disabled]{background:#d2d2d7;color:#6e6e73;cursor:default}' +
      '.gcp__btn.is-done{background:#1d7a36}' +
      '.gcp__save{font-size:14px;color:#1d7a36;background:#e6f4ec;border-radius:999px;' +
      'padding:6px 13px;font-weight:600}' +
      '.gcp__say{flex:1 1 100%;margin:4px 0 0;font-size:13.5px;color:#8a5a00;line-height:1.5}' +
      '.gcp__btn.is-over{background:#d2d2d7;color:#6e6e73;cursor:default}' +
      '.gcp__foot{margin-top:26px;font-size:13px;color:var(--gc-ink3);line-height:1.6;' +
      'max-width:52em;text-wrap:pretty}' +
      // 任選很多款的小格子（GOS-0589）：主商品卡改橫的小卡，贈品一款一格
      '.gcp--many .gcp__card[data-main]{flex:0 1 440px;flex-direction:row;align-items:center;gap:16px}' +
      '.gcp--many .gcp__card[data-main] .gcp__img{width:104px;flex:none}' +
      '.gcp__pickhd{margin-top:28px;display:flex;flex-wrap:wrap;align-items:baseline;gap:4px 12px}' +
      '.gcp__pickhd b{font-size:16px;color:var(--gc-ink);text-wrap:balance}' +
      '.gcp__pickhd span{font-size:14px;color:var(--gc-ink3)}' +
      '.gcp__grid{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:10px;margin-top:14px}' +
      '.gcp__mini{border:1px solid var(--gc-line);border-radius:14px;padding:8px;background:#fff;cursor:pointer;' +
      'display:flex;flex-direction:column;gap:6px;min-width:0}' +
      '.gcp__mini[data-on]{border-color:#8a5a00;box-shadow:0 0 0 1px #8a5a00}' +
      '.gcp__mini:focus-visible{outline:2px solid var(--gc-blue);outline-offset:2px}' +
      '.gcp__mimg{aspect-ratio:1/1;border-radius:10px;background:var(--gc-soft);overflow:hidden;' +
      'display:flex;align-items:center;justify-content:center}' +
      '.gcp__mimg img{width:100%;height:100%;object-fit:contain;display:block}' +
      '.gcp__mname{font-size:13px;line-height:1.35;text-align:center;color:var(--gc-ink);' +
      'text-wrap:balance;overflow-wrap:anywhere}' +
      '@media(max-width:900px){.gcp{padding:40px 16px}.gcp h2{font-size:24px!important}' +
      '.gcp__hd{align-items:flex-start}.gcp__row{gap:12px;margin-top:24px}' +
      '.gcp__card{flex:1 1 calc(50% - 12px)}.gcp__plus{display:none}' +
      '.gcp__grid{grid-template-columns:repeat(4,minmax(0,1fr))}}' +
      '@media(max-width:520px){.gcp__card{flex:1 1 100%}.gcp__act{gap:12px}' +
      '.gcp__grid{grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}}';
  }

  function card(it, isGift, qty, pickable, on) {
    var off = it.orig_price > it.price;
    var n = Math.max(1, parseInt(qty, 10) || 1);
    return '<div class="gcp__card"' + (isGift ? '' : ' data-main') +
      (pickable ? ' data-gcp-pick="' + esc(it.variant_id) + '" tabindex="0" role="radio"' +
                  ' aria-checked="' + (on ? 'true' : 'false') + '"' +
                  (on ? ' data-on' : '') : '') + '>' +
      '<span class="gcp__img">' +
        (it.image ? '<img src="' + esc(it.image) + '" alt="" loading="lazy">' : '') +
        '<span class="gcp__badge"' + (isGift ? ' data-gift' : '') + '>' +
          (isGift ? esc(it.label || '免費') : (n > 1 ? '買 ' + n + ' 件' : '主商品')) + '</span>' +
      '</span>' +
      '<span class="gcp__t">' + esc(String(it.title).split('｜')[0]) + '</span>' +
      // 贈品要寫出是哪一款（GOS-0589）：同一個商品的 14 個顏色名稱都一樣，不寫就只能看圖猜
      (isGift && String(it.title).split('｜')[1]
        ? '<span class="gcp__v">' + esc(String(it.title).split('｜').slice(1).join('｜')) + '</span>' : '') +
      // 主商品不寫價格（GOS-0589）：活動資料裡的價格是加進活動那天記下的，官網改價之後就不對了
      // （阿康專屬賣場 10/8 改價後，這裡還寫 1,599、結帳是 1,980）；客人換規格這張卡也不會跟著換。
      // 現價看商品頁上方的購買區就好。贈品的價格只用來寫「原價」與「免費」，折扣照 Shopify 實際算。
      (isGift
        ? '<span class="gcp__p"><span class="gcp__now">' +
            (it.price <= 0 ? '免費' : fmt(it.price)) + '</span>' +
            (off ? '<span class="gcp__was">' + fmt(it.orig_price) + '</span>' : '') +
          '</span>'
        : '') +
    '</div>';
  }

  /* 任選很多款（GOS-0589）：一款一個小格子（圖＋款式名），點了換選；跟大卡同一套 data-gcp-pick，
   * 換選、鍵盤、加車的邏輯完全不用改。同一個商品的不同款式就把商品名寫一次在上面，格子裡只寫款式。 */
  function manyGifts(gifts) {
    var base = function (g) { return String(g.title).split('｜')[0]; };
    var same = gifts.every(function (g) { return base(g) === base(gifts[0]); });
    var free = gifts.every(function (g) { return g.price <= 0; });
    var was = Math.max.apply(null, gifts.map(function (g) { return g.orig_price || 0; }));
    return '<div class="gcp__pickhd">' +
        '<b>' + esc(same ? base(gifts[0]) : '贈品') + '</b>' +
        '<span>任選一樣・共 ' + gifts.length + ' 款' +
          (free ? '・免費' + (was > 0 ? '（原價 ' + fmt(was) + '）' : '') : '') + '</span>' +
      '</div>' +
      '<div class="gcp__grid" role="radiogroup" aria-label="選一款贈品">' +
        gifts.map(function (g, i) {
          var name = same ? (String(g.title).split('｜').slice(1).join('｜') || base(g)) : String(g.title).replace('｜', ' ');
          return '<div class="gcp__mini" data-gcp-pick="' + esc(g.variant_id) + '" tabindex="0" role="radio"' +
            ' aria-checked="' + (i === 0 ? 'true' : 'false') + '"' + (i === 0 ? ' data-on' : '') + '>' +
            '<span class="gcp__mimg">' +
              (g.image ? '<img src="' + esc(g.image) + '" alt="" loading="lazy">' : '') + '</span>' +
            '<span class="gcp__mname">' + esc(name) + '</span>' +
          '</div>';
        }).join('') +
      '</div>';
  }

  // ── 購物車 ──────────────────────────────────────────────
  /* 兩個原則，這一段所有的複雜度都是為了它們：
   *
   * 1. **只動我們自己放進去的東西。** 贈品同時也是正常販售的商品，客人可能自己買了一個。
   *    每一列我們加的都掛 `_gcp` 記號，收回去時只認這個記號——不然客人自費買的
   *    收納包會被我們靜靜地從購物車刪掉（審查抓到的）。
   * 2. **加完之後去看 Shopify 到底折了沒有。** 折扣會不會套用有太多原因不是我們算得出來的
   *    （活動剛結束、店裡別的折扣把我們擠掉、同一件商品只能吃一個商品折扣……）。
   *    購物車的回應裡就有答案，那是唯一不會說謊的來源：沒折到就把贈品收掉並告訴客人，
   *    不要讓他抱著一個標著「免費」、結帳卻要收錢的東西去結帳。
   */
  var MARK = '_gcp';
  // 每一檔活動註冊一個對帳器；攔截器只包一次，收到訊號就全部叫一輪。
  // （只叫第一個的話，購物車頁上第二檔活動的贈品永遠不會被收回去。）
  var syncs = [];
  function fanout(ms) { syncs.forEach(function (fn) { fn(ms); }); }
  // ours>0 代表現在這一次請求是我們自己打的，攔截器要放它過去，不然會自己觸發自己。
  var ours = 0;

  /* 補贈品要等加車的回應回來之後才做，要一點時間。版型如果加完就整頁跳去購物車頁
   * （商店設定 cart_type=page，gc-i360 購買區就是這樣），那一頁一走，補贈品就被打斷了——
   * 購物車頁只收不補，客人按主按鈕永遠拿不到贈品（GOS-0589 測試主題實測抓到的）。
   * 所以給版型一個「等我補完」：每一檔掛的補贈品流程都閒下來才 resolve，最多等 maxMs，
   * 等不到也放行（寧可少送也不要卡住客人結帳）。 */
  var idlers = [];
  window.gcPromoSettle = function (maxMs) {
    var until = Date.now() + (maxMs || 2500);
    return new Promise(function (resolve) {
      (function tick() {
        var idle = idlers.every(function (fn) { return fn(); });
        if (idle || Date.now() >= until) { resolve(idle); return; }
        setTimeout(tick, 50);
      })();
    });
  };

  function mine(run) {
    ours += 1;
    var off = function () { ours -= 1; };
    try {
      return run().then(function (v) { off(); return v; },
                        function (e) { off(); throw e; });
    } catch (e) {            // fetch 同步丟例外時 .then 掛不上去，計數器會永遠卡住
      off();
      return Promise.reject(e);
    }
  }

  function post(url, body) {
    return fetch(url, {
      method: 'POST', credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(body)
    }).then(function (r) {
      if (!r.ok) throw new Error(url + ' failed');
      return r.json();
    });
  }

  function cartAdd(items) { return mine(function () { return post('/cart/add.js', { items: items }); }); }

  // 一次把幾列歸零。`/cart/update.js` 吃 line key，一趟就做完——
  // 一列打一次 /cart/change.js 是同一個購物車的併發寫入，Shopify 不保證原子性。
  function dropLines(keys) {
    if (!keys.length) return Promise.resolve(null);
    var updates = {};
    keys.forEach(function (k) { updates[k] = 0; });
    return mine(function () { return post('/cart/update.js', { updates: updates }); });
  }

  function cartFetch() {
    return fetch('/cart.js', { credentials: 'same-origin' }).then(function (r) { return r.json(); });
  }

  /* 要放進購物車的贈品。**「任選一樣」時只能放一樣、而且只能放一件**——
   * Shopify 一單只折得了一件，多的會被照原價收錢，跟原本那個 bug 是同一種。 */
  function giftLines(gifts, one) {
    var list = one ? [one] : gifts;
    return list.map(function (g) {
      var props = {};
      props[MARK] = '1';
      return { id: g.variant_id,
               quantity: one ? 1 : Math.max(1, parseInt(g.qty, 10) || 1),
               properties: props };
    });
  }

  // 這一列是我們放進去的贈品嗎？（客人自己買的同款商品沒有這個記號）
  function isOurs(line) {
    var p = line && line.properties;
    return !!(p && (p[MARK] || p['_' + MARK.slice(1)]));
  }

  /* 加完之後對一次帳：贈品那幾列 Shopify 有沒有真的折。沒折到就收回去並說一聲。
   * 這一步取代了所有「猜折扣會不會套用」的邏輯——購物車的回應是唯一的事實來源。 */
  function reconcile(giftIds, say) {
    return cartFetch().then(function (cart) {
      var bad = [];
      Array.prototype.forEach.call(cart.items || [], function (l) {
        if (!isOurs(l) || !giftIds[String(l.variant_id || l.id)]) return;
        var got = (l.discount_allocations || []).some(function (a) {
          return (a.amount || a.discount_amount || 0) > 0;
        });
        // line_price 已經是 0 的（本來就免費的贈品）也算折到了
        if (!got && (l.final_line_price === undefined || l.final_line_price > 0)) bad.push(l.key);
      });
      if (!bad.length) return null;
      return dropLines(bad).then(function () {
        if (say) say('這一檔的贈品現在拿不到了，已經從購物車移除——你原本要買的東西還在。');
        document.dispatchEvent(new CustomEvent('cart:refresh'));
      });
    }).catch(function () {});
  }

  /* 主按鈕也要拿得到贈品——這是 Vitals 做不到的那一點。
   * 客人按商品頁原本的「加入購物車」之後，把缺的贈品補進去。
   *
   * **買幾件才送要先數過**：門檻是 2 件的活動，客人只加 1 件就補贈品的話，
   * Shopify 的原生折扣不會套用，那件「贈品」會照原價收錢——比不補還糟。
   */
  /* `addMissing` 為 false 時**只收不補**。購物車頁就是這樣跑的：
   * 那一頁沒有畫區塊、客人也沒有挑過贈品，「任選一樣」要補哪一樣是答不出來的
   * ——不設限的話會把三樣全部塞進去，而 Shopify 只折一件（我自己的購物車頁測試抓到的）。 */
  function hookMainAdd(offer, gifts, pickOne, say, addMissing) {
    if (!window.fetch) return;
    if (addMissing === undefined) addMissing = true;

    var need = Math.max(1, parseInt(offer.buy_qty, 10) || 1);
    var buyIds = {}, giftIds = {};
    (offer.buy || []).forEach(function (b) { buyIds[String(b.variant_id)] = true; });
    gifts.forEach(function (g) { giftIds[String(g.variant_id)] = true; });
    var running = false, again = false, timer = null;

    // 幾個訊號來源共用一個計時器，一次加車只查一趟購物車
    function schedule(ms) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(function () { timer = null; sync(); }, ms);
    }

    function done() {
      running = false;
      if (again) { again = false; schedule(120); }
    }

    function sync() {
      // 重疊的要排隊，不能丟掉：門檻 2 件時，跨過門檻的那一次很可能正好落在
      // 前一次還在查購物車的時候——丟掉它，贈品就永遠不會補上。
      if (running) { again = true; return; }
      running = true;
      var chain;
      try {
        chain = cartFetch();       // 同步丟例外的話 .then 掛不上去，running 會永遠卡住
      } catch (e) { done(); return; }
      chain.then(function (cart) {
          var bought = 0, ourGifts = [], theirGift = false;
          Array.prototype.forEach.call(cart.items || [], function (l) {
            var v = String(l.variant_id || l.id);
            if (buyIds[v]) bought += (l.quantity || 0);
            if (!giftIds[v]) return;
            if (isOurs(l)) ourGifts.push(l);
            else theirGift = true;     // 客人自己買的同款——不是我們的，永遠不要碰
          });

          if (bought < need) {
            // 買不夠了（客人在購物車把數量改小）——把**我們補的**贈品收回去。
            // 留著的話 Shopify 不折，那件「贈品」會被照原價收錢。
            return dropLines(ourGifts.map(function (l) { return l.key; }))
              .then(function () {
                if (ourGifts.length) document.dispatchEvent(new CustomEvent('cart:refresh'));
              });
          }

          var want = pickOne ? pickOne() : null;
          var wantIds = {};
          giftLines(gifts, want).forEach(function (l) { wantIds[String(l.id)] = true; });
          // 任選一樣時，客人改選了別樣就把舊的換掉——不換的話兩列並存，
          // 而 Shopify 只折一件，另一件照原價收錢。
          var stale = ourGifts.filter(function (l) {
            return !wantIds[String(l.variant_id || l.id)];
          });
          var have = {};
          ourGifts.forEach(function (l) {
            if (wantIds[String(l.variant_id || l.id)]) have[String(l.variant_id || l.id)] = true;
          });
          var missing = giftLines(gifts, want).filter(function (l) { return !have[String(l.id)]; });
          if (theirGift && pickOne && !ourGifts.length) return null;  // 他自己挑好了，別插手

          var job = stale.length
            ? dropLines(stale.map(function (l) { return l.key; })) : Promise.resolve(null);
          return job.then(function () {
            if (!addMissing || !missing.length) {
              return (stale.length || ourGifts.length) ? reconcile(giftIds, say) : null;
            }
            return cartAdd(missing).then(function () {
              document.dispatchEvent(new CustomEvent('cart:refresh'));
              return reconcile(giftIds, say);
            });
          });
        })
        .catch(function () {})
        .then(done, done);
    }

    syncs.push(schedule);
    idlers.push(function () { return !timer && !running && !again; });
    // 客人在區塊裡改選贈品、而且已經加過購物車：立刻把車裡那一列換掉
    document.addEventListener('gcp:repick', function () { schedule(80); }, true);

    if (window.__gcPromoHooked) return;    // 攔截器只包一次
    window.__gcPromoHooked = true;
    var origFetch = window.fetch;
    window.fetch = function (input) {
      // `Request` 用 .url、`URL` 物件用 .href——只認 .url 的話，用 URL 物件加車的版型整個攔不到
      var url = typeof input === 'string' ? input
              : (input && (input.url || input.href)) || '';
      var isMine = ours > 0;
      var p = origFetch.apply(this, arguments);
      // change／update 也要看：客人在購物車把主商品數量改小時，門檻就不成立了，
      // 贈品得跟著拿掉，不然商品頁說「免費」、結帳照原價收。
      if (!isMine && /\/cart\/(add|change|update)(\.js)?(\?|$)/.test(url)) {
        p.then(function () { fanout(250); }).catch(function () {});
      }
      return p;
    };
    // 沒走 AJAX 的版型（整頁換頁那種）：送出後那一頁就走了，這裡只救得到留在原頁的情況
    document.addEventListener('submit', function (e) {
      var f = e.target;
      if (f && f.action && /\/cart\/add/.test(f.action)) fanout(900);
    }, true);
  }

  // ── 畫面 ──────────────────────────────────────────────
  function render(offer) {
    if (document.querySelector('.gcp')) return;
    var gifts = (offer.gifts || []), buys = (offer.buy || []);
    if (!gifts.length || !buys.length) return;

    var style = document.createElement('style');
    style.textContent = css();
    document.head.appendChild(style);

    var need = Math.max(1, parseInt(offer.buy_qty, 10) || 1);
    var left = offer.countdown ? daysLeft(offer.ends_on) : -1;
    var cd = left >= 0
      ? '<div class="gcp__cd"><span>還有 <b>' + left + ' 天</b>・' +
        esc(String(offer.ends_on).slice(5).replace('-', ' 月 ')) + ' 日截止</span></div>'
      : '';
    // **好幾樣贈品時 Shopify 一單只折得了其中一件**，所以畫面要寫「任選一樣」，
    // 三樣都標免費是不實的——而且客人真的只會拿到一件（見 sync.discount_input 的 n_gift）。
    var pick = !!offer.gift_pick;
    var saved = pick
      ? Math.max.apply(null, gifts.map(function (g) {
          return Math.max(0, g.orig_price - g.price);
        }))
      : gifts.reduce(function (a, g) {
          return a + Math.max(0, g.orig_price - g.price) * Math.max(1, parseInt(g.qty, 10) || 1);
        }, 0);
    // 主商品卡只畫一張（同商品好幾個顏色不要畫成好幾張），畫客人現在選的那一個
    var main = pickBuy(buys);
    // 任選的贈品很多款時改成小格子（GOS-0589）：阿康賣場的掛繩 14 色，一款一張大卡在手機上疊成七千多 px
    var many = pick && gifts.length > 4;
    var sec = document.createElement('section');
    sec.className = 'gcp' + (many ? ' gcp--many' : '');
    sec.innerHTML =
      '<div class="gcp__hd"><div>' +
        '<div class="gcp__eye">買就送</div>' +
        '<h2>' + esc(offer.title) + '</h2>' +
        '<p class="gcp__sub">' + esc(offer.note ||
          ('買 ' + need + ' 件' + (pick ? '，下面任選一樣帶走' : '就送') +
           '，折扣結帳時自動套用——不用輸入任何折扣碼。')) + '</p>' +
      '</div>' + cd + '</div>' +
      '<div class="gcp__row">' + card(main, false, need) +
        (many ? '' : gifts.map(function (g, i) {
          return '<span class="gcp__plus">' + (pick && i ? '或' : '＋') + '</span>' +
                 card(g, true, pick ? 1 : g.qty, pick, i === 0);
        }).join('')) +
      '</div>' +
      (many ? manyGifts(gifts) : '') +
      '<div class="gcp__act">' +
        '<button class="gcp__btn" type="button" data-gcp-add>' +
          (pick ? '加入購物車（贈品任選一樣）' : '一起加入購物車') + '</button>' +
        (saved > 0 ? '<span class="gcp__save">現省 ' + fmt(saved) + '</span>' : '') +
      '</div>' +
      '<p class="gcp__foot">按上面原本的「加入購物車」也會把贈品一起帶走，' +
        '不用特地回來按這一顆。贈品數量有限，送完活動就會結束。</p>';

    var m = mount();
    if (m.how === 'before' && m.el.parentNode) m.el.parentNode.insertBefore(sec, m.el);
    else m.el.appendChild(sec);

    // 任選一樣：點卡片換選
    var chosen = gifts[0];
    if (pick) {
      sec.addEventListener('click', function (e) {
        var c = e.target.closest ? e.target.closest('[data-gcp-pick]') : null;
        if (!c) return;
        var id = c.getAttribute('data-gcp-pick');
        for (var i = 0; i < gifts.length; i++) {
          if (String(gifts[i].variant_id) === id) chosen = gifts[i];
        }
        Array.prototype.forEach.call(sec.querySelectorAll('[data-gcp-pick]'), function (el) {
          var on = el === c;
          if (on) el.setAttribute('data-on', ''); else el.removeAttribute('data-on');
          el.setAttribute('aria-checked', on ? 'true' : 'false');
        });
        // 已經加過購物車的話，換選就把車裡那一列一起換掉——
        // 不換的話兩列並存，而 Shopify 只折一件，另一件照原價收錢。
        if (btn.getAttribute('data-gcp-go')) sec.dispatchEvent(new CustomEvent('gcp:repick'));
      });
      sec.addEventListener('keydown', function (e) {
        if ((e.key === 'Enter' || e.key === ' ') && e.target.getAttribute &&
            e.target.getAttribute('data-gcp-pick')) {
          e.preventDefault();
          e.target.click();
        }
      });
    }

    // 一句話的提示條（收回贈品、或選到沒參加的規格時要講一聲）
    function say(msg) {
      var t = sec.querySelector('.gcp__say');
      if (!t) {
        t = document.createElement('p');
        t.className = 'gcp__say';
        sec.querySelector('.gcp__act').appendChild(t);
      }
      t.textContent = msg;
    }

    var btn = sec.querySelector('[data-gcp-add]');
    btn.addEventListener('click', function () {
      if (btn.getAttribute('data-gcp-go')) { location.href = '/cart'; return; }
      // **只能加這一檔真的含的變體**，而且不能默默幫客人換一個。
      // `pickBuy` 找不到時會退回第一個，照著加下去等於把他沒選的顏色／容量放進購物車。
      var hit = pickBuy(buys), sel = selectedVariantId();
      if (sel && String(hit.variant_id) !== sel) {
        say('你現在選的規格沒有參加這一檔活動——請先切到有參加的那一個再加入。');
        return;
      }
      var old = btn.textContent;
      btn.disabled = true;
      btn.textContent = '加入中…';
      var fail = function () { btn.disabled = false; btn.textContent = old; };

      // 先拿最新的活動資料。**拿不到就照樣加**——網路抖一下不代表活動結束了，
      // 對錯與否交給加完之後的對帳（reconcile）去判斷，那才是不會說謊的來源。
      var chain;
      try { chain = loadData(true); } catch (e) { chain = Promise.resolve(null); }
      chain.then(function (d) {
        var fresh = null;
        if (d && d.offers) {
          for (var i = 0; i < d.offers.length; i++) {
            if (d.offers[i].id === offer.id) { fresh = d.offers[i]; break; }
          }
          if (!fresh || fresh.status !== 'active' || !inWindow(fresh)) {
            btn.textContent = '這一檔已經結束了';
            btn.classList.add('is-over');
            say('這一檔剛結束了，重新整理看看還有沒有別的優惠。');
            return null;
          }
        }
        // **用最新那份組購物車內容**，不要用畫面上那份十幾分鐘前的
        // ——活動改過贈品的話，舊的那樣 Shopify 已經不折了。
        var useGifts = (fresh && fresh.gifts && fresh.gifts.length) ? fresh.gifts : gifts;
        var one = null;
        if (pick) {
          one = useGifts[0];
          for (var j = 0; j < useGifts.length; j++) {
            if (String(useGifts[j].variant_id) === String(chosen.variant_id)) one = useGifts[j];
          }
        }
        var ids = {};
        useGifts.forEach(function (g) { ids[String(g.variant_id)] = true; });
        // 門檻幾件就加幾件，不然折扣套不上、贈品會被照原價收錢
        return cartAdd([{ id: hit.variant_id, quantity: need }]
                       .concat(giftLines(useGifts, one)))
          .then(function () {
            btn.disabled = false;
            btn.textContent = '已加入・前往結帳';
            btn.classList.add('is-done');
            btn.setAttribute('data-gcp-go', '1');
            document.dispatchEvent(new CustomEvent('cart:refresh'));
            return reconcile(ids, say);     // Shopify 到底折了沒有，去問購物車
          });
      }).catch(fail);
    });

    // 換顏色／容量時把主商品卡換掉（價格不一樣的變體不能還顯示上一個的價）
    function resync() {
      var now = pickBuy(buys);
      if (now === main) return;
      main = now;
      var old = sec.querySelector('.gcp__card[data-main]');
      if (!old) return;
      var box = document.createElement('div');
      box.innerHTML = card(main, false, need);
      old.parentNode.replaceChild(box.firstChild, old);
    }
    document.addEventListener('change', function (e) {
      if (e.target && (e.target.name === 'id' || e.target.closest('form[action*="/cart/add"]'))) {
        setTimeout(resync, 60);
      }
    }, true);
    ['variant:change', 'product:variant-change', 'variantChange'].forEach(function (evt) {
      document.addEventListener(evt, function () { setTimeout(resync, 60); });
    });

    hookMainAdd(offer, gifts, pick ? function () { return chosen; } : null, say);
  }

  var onProduct = /^\/products\//.test(location.pathname);
  var onCart = /^\/cart(\/|$)/.test(location.pathname);
  if (!onProduct && !onCart) return;

  loadData().then(function (d) {
    if (!d || !(d.offers || []).length) return;
    var live = (d.offers || []).filter(function (o) {
      // 還沒開始或已經結束都不算。GrantOS 那邊有排程在收，但那是每十分鐘一次，
      // 中間這段空窗不該讓客人看到一檔 Shopify 根本還沒／已經不折的活動。
      return o.status === 'active' && inWindow(o);
    });
    if (!live.length) return;

    if (onCart) {
      /* **購物車頁只顧「把帳對好」，不畫區塊。**
       * 公告與教學都寫「客人在購物車把數量改到不夠門檻，贈品會跟著收回去」——
       * 原本這支腳本只在 /products/ 底下跑，那句話在真正的購物車頁根本不會發生
       * （審查抓到的，是文件層級的假成功）。這裡把它補上。 */
      live.forEach(function (o) {
        var gifts = o.gifts || [];
        // 車裡已經有哪一樣就認哪一樣（多贈品活動在這一頁沒有「挑」這個動作）
        var known = function () { return null; };
        hookMainAdd(o, gifts, gifts.length > 1 ? known : null, null, false);
      });
      return;
    }

    var ids = productVariantIds();
    for (var i = 0; i < live.length; i++) {
      var o = live[i];
      var hit = (o.buy || []).some(function (b) {
        return ids.indexOf(String(b.variant_id)) >= 0;
      });
      if (hit) { render(o); return; }
    }
  });
})();
