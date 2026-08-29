/* ═══════════════════════════════════════════════════════════════
   gc 法律文件：左欄選章節、右欄顯示內文（2026-08-29）

   刻意做成「漸進增強」：HTML 裡永遠是一份完整的長文件，
   這支 JS 只是在瀏覽器裡把它「分頁化」。

   為什麼一定要這樣做而不是後端切開：
   - Google 的爬蟲拿到的是原始 HTML，六份文件的每一個字都在裡面。
     分頁／摺疊裡的內容 Google 照樣索引也不扣分，會出事的是
     「點了才去抓」（AJAX 載入）那種——這支不會發任何請求。
   - AI 購物介面（/agents.md 指過來的那四份）讀的也是原始 HTML，同理。
   - JS 掛掉或被擋，畫面就退回一份完整的長文件，不會壞。

   附帶處理的三件事：
   - 直接開 /policies/xxx#sec-7 這種深連結會自動切到那一章
   - 「展開全部」讓使用者可以 Ctrl+F 搜尋全文（分頁會藏住其他章，
     這是分頁式版面唯一真正的損失，所以一定要給出口）
   - 列印時 CSS 會強制顯示全部（見 gc-policy.css 的 @media print）

   要還原：把 theme.liquid 那一行拿掉，畫面自動變回長文件。
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  if (window.__gcPolicyInit) return;   // 同一頁被載入兩次時不要重跑
  window.__gcPolicyInit = true;

  /* Shopify 自動管理的政策（目前是隱私權政策）不能用 API 改內容——
     改了會被擋：「必須先關閉 Privacy Policy 的自動管理，才能進行變更」。
     關掉自動管理就等於以後法規更新變成自己的責任，為了版面付這個代價不划算。

     所以這一頁改在瀏覽器裡包：找到沒有 .gc-legal 的政策內文，
     用 JS 補上外框、頁首、目錄與底部連結，內容一個字都不動。
     JS 產生的 DOM 不經過 Shopify 的標籤白名單，所以 <div> 以外的限制也不適用。

     SEO 不受影響：文件的每一個字本來就在原始 HTML 裡，
     JS 只是加上導覽用的外殼。 */
  var OTHER = [
    ['/policies/terms-of-service','服務條款'],
    ['/policies/refund-policy','退款政策'],
    ['/policies/shipping-policy','運送政策'],
    ['/pages/warranty-policy','保固政策'],
    ['/pages/payment-method','付款方式'],
    ['/policies/contact-information','聯絡資訊']
  ];

  function autoWrap() {
    document.querySelectorAll('.shopify-policy__body').forEach(function (body) {
      if (body.querySelector('.gc-legal')) return;              // 已經包好的不動
      var host = body.querySelector('.rte') || body;
      var heads = [];
      Array.prototype.forEach.call(host.children, function (el) {
        if (el.tagName === 'H2') heads.push(el);
      });
      if (heads.length < 3) return;                              // 太短的不值得分頁

      var wrap = document.createElement('div');
      wrap.className = 'gc-legal';
      while (host.firstChild) wrap.appendChild(host.firstChild);
      host.appendChild(wrap);

      // 開頭若是「最新更新：…」那一行，搬進頁首框當日期，不重寫文字
      var head = document.createElement('div');
      head.className = 'gc-legal__head';
      var first = wrap.querySelector('p');
      if (first && /更新/.test(first.textContent) && first.textContent.trim().length < 40) {
        first.className = 'gc-legal__meta';
        head.appendChild(first);
      }
      wrap.insertBefore(head, wrap.firstChild);

      // 目錄
      var nav = document.createElement('div');
      nav.className = 'gc-legal__toc';
      nav.setAttribute('role', 'navigation');
      var navHtml = '<p class="gc-legal__toc-title">本頁內容</p><ol>';
      heads.forEach(function (h, i) {
        if (!h.id) h.id = 'sec-' + (i + 1);
        navHtml += '<li><a href="#' + h.id + '">' + h.textContent.trim() + '</a></li>';
      });
      nav.innerHTML = navHtml + '</ol>';
      wrap.insertBefore(nav, head.nextSibling);

      // 底部其他政策
      var rel = document.createElement('div');
      rel.className = 'gc-legal__related';
      var here = location.pathname.replace(/\/$/, '');
      rel.innerHTML = '<p class="gc-legal__related-label">其他政策</p>' +
        OTHER.filter(function (o) { return o[0] !== here; })
             .map(function (o) { return '<a href="' + o[0] + '">' + o[1] + '</a>'; }).join('');
      wrap.appendChild(rel);
    });
  }

  function init() {
    autoWrap();
    document.querySelectorAll('.gc-legal').forEach(setup);
  }

  function setup(root) {
    var toc = root.querySelector('.gc-legal__toc');
    var heads = Array.prototype.slice.call(root.querySelectorAll(':scope > h2[id]'));
    // 少於三章的短文件（聯絡資訊）不值得分頁，維持原樣
    if (!toc || heads.length < 3) return;

    // ── 把「h2 到下一個 h2 之間」包成一個章節區塊 ──
    var related = root.querySelector('.gc-legal__related');
    heads.forEach(function (h) {
      var sec = document.createElement('section');
      sec.className = 'gc-legal__sec';
      sec.setAttribute('data-for', h.id);
      sec.setAttribute('role', 'tabpanel');
      sec.setAttribute('aria-labelledby', 'tab-' + h.id);
      h.parentNode.insertBefore(sec, h);
      var n = h;
      while (n) {
        var next = n.nextSibling;
        // 碰到下一個 h2 或底部的「其他政策」就停
        if (n.nodeType === 1 && n !== h &&
            (n.tagName === 'H2' || n === related || n.classList.contains('gc-legal__sec'))) break;
        sec.appendChild(n);
        n = next;
      }
    });

    var secs = Array.prototype.slice.call(root.querySelectorAll('.gc-legal__sec'));
    if (!secs.length) return;

    // ── 左欄：把目錄的連結接上行為 ──
    var links = Array.prototype.slice.call(toc.querySelectorAll('a[href^="#"]'));
    toc.setAttribute('role', 'tablist');
    links.forEach(function (a) {
      var id = a.getAttribute('href').slice(1);
      a.id = 'tab-' + id;
      a.setAttribute('role', 'tab');
      a.addEventListener('click', function (e) {
        e.preventDefault();
        show(id, true);
      });
      a.addEventListener('keydown', function (e) {
        var i = links.indexOf(a), t = null;
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') t = links[i + 1];
        if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') t = links[i - 1];
        if (t) { e.preventDefault(); t.focus(); show(t.getAttribute('href').slice(1), true); }
      });
    });

    // ── 「展開全部」：分頁會藏住其他章，Ctrl+F 就找不到，所以給一個出口 ──
    var all = document.createElement('button');
    all.type = 'button';
    all.className = 'gc-legal__expand';
    all.textContent = '展開全部';
    all.addEventListener('click', function () {
      var on = root.classList.toggle('is-expanded');
      all.textContent = on ? '收合' : '展開全部';
      all.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    all.setAttribute('aria-pressed', 'false');
    toc.appendChild(all);

    function show(id, fromClick) {
      root.classList.remove('is-expanded');
      all.textContent = '展開全部';
      all.setAttribute('aria-pressed', 'false');
      secs.forEach(function (s) {
        s.classList.toggle('is-on', s.getAttribute('data-for') === id);
      });
      links.forEach(function (a) {
        var on = a.getAttribute('href') === '#' + id;
        a.classList.toggle('is-on', on);
        a.setAttribute('aria-selected', on ? 'true' : 'false');
      });
      if (fromClick) {
        // 用 replaceState 換網址，避免瀏覽器把畫面捲到錨點
        try { history.replaceState(null, '', '#' + id); } catch (err) {}
        // 視窗已經捲過章節區時，把右欄頂端拉回來
        var box = root.getBoundingClientRect();
        if (box.top < 0) window.scrollTo({ top: window.scrollY + box.top - 24, behavior: 'smooth' });
      }
    }

    // 深連結：/policies/xxx#sec-7 直接開到那一章
    var want = (location.hash || '').slice(1);
    var has = secs.some(function (s) { return s.getAttribute('data-for') === want; });
    show(has ? want : secs[0].getAttribute('data-for'), false);

    root.classList.add('is-tabbed');   // CSS 只在接手成功後才隱藏其他章
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
