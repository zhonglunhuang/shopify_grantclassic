/* ============================================================
   gc-header.js —— 導覽列的滑動底線
   ------------------------------------------------------------
   只做一件事：在整條列的底部放一條線，游標移到哪一項就滑到哪一項。
   樣式全部在 gc-header.css 的第 11 段，主題原檔一個字都沒改。
   要還原：刪這個檔 ＋ 拿掉 layout/theme.liquid 裡載入它的那一行。
   ============================================================ */
(function () {
  'use strict';

  // 同一支 JS 可能被載入不只一次（每個 <script src> 各執行一遍），用旗標擋住
  if (window.__gcHeaderNav) return;
  window.__gcHeaderNav = true;

  var BP = 741;              // 桌機斷點，跟 CSS 那邊一致
  var ind = null;            // 底線本體
  var list = null;           // 導覽的 <ul>
  var wrap = null;           // 整條列
  var rects = null;          // 量到的位置，快取起來
  var raf = 0;

  function measure() {
    if (!list || !wrap) return;
    var wr = wrap.getBoundingClientRect();
    rects = [].slice.call(list.querySelectorAll('.header__linklist-item')).map(function (li) {
      var r = li.getBoundingClientRect();
      return { el: li, left: r.left - wr.left, width: r.width };
    });
  }

  function moveTo(li) {
    if (!ind || window.innerWidth < BP) return;
    if (!rects) measure();
    var hit = null;
    for (var i = 0; i < rects.length; i++) { if (rects[i].el === li) { hit = rects[i]; break; } }
    if (!hit) return;
    ind.style.width = hit.width + 'px';
    ind.style.transform = 'translateX(' + hit.left + 'px)';
    ind.style.opacity = '1';
  }

  function hide() { if (ind) ind.style.opacity = '0'; }

  function init() {
    var nav = document.querySelector('.header__inline-navigation');
    if (!nav) return;
    list = nav.querySelector('.header__linklist');
    wrap = document.querySelector('.header__wrapper');
    if (!list || !wrap) return;

    // 換過頁或 section 重載時不要疊第二條
    var old = wrap.querySelector('.gc-nav-ind');
    if (old) old.parentNode.removeChild(old);

    ind = document.createElement('span');
    ind.className = 'gc-nav-ind';
    ind.setAttribute('aria-hidden', 'true');
    wrap.appendChild(ind);

    [].slice.call(list.querySelectorAll('.header__linklist-item')).forEach(function (li) {
      li.addEventListener('mouseenter', function () { moveTo(li); });
      // 鍵盤 Tab 過去也要跟著走
      li.addEventListener('focusin', function () { moveTo(li); });
    });
    nav.addEventListener('mouseleave', hide);
    nav.addEventListener('focusout', function (e) {
      if (!nav.contains(e.relatedTarget)) hide();
    });

    measure();
  }

  // 視窗變寬變窄要重量。跟捲動共用一個 rAF 節流，不然拖視窗會整個卡住
  function onResize() {
    if (raf) return;
    raf = requestAnimationFrame(function () {
      raf = 0;
      rects = null;          // 下次 hover 再量，不用每一幀都算
      hide();
    });
  }
  window.addEventListener('resize', onResize, { passive: true });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
  // 在主題編輯器裡改頁首設定時會重新渲染那一段
  document.addEventListener('shopify:section:load', function (e) {
    if (e.target && e.target.id === 'shopify-section-header') init();
  });
})();

/* ============================================================
   大選單「同時只開一個」防護
   ------------------------------------------------------------
   實測（2026-08-28）：滑鼠在頂層項目之間移動時，主題的 JS 會把新的面板打開，
   但**沒有把前一個關掉** —— 兩張滿版面板疊在一起，看起來就是閃來閃去、
   或者「本來看到的那個整個消失」。

   主題原檔不能改，所以在外面盯著：任何一個面板被打開時，
   把其他還開著的關掉。只動 hidden 屬性，跟主題用的是同一個開關。
   ============================================================ */
(function () {
  'use strict';
  if (window.__gcOnePanel) return;
  window.__gcOnePanel = true;

  function guard() {
    var panels = document.querySelectorAll('.tmenu');
    if (!panels.length) return;

    var obs = new MutationObserver(function (list) {
      for (var i = 0; i < list.length; i++) {
        var p = list[i].target;
        if (p.hasAttribute('hidden')) continue;   // 這個是剛被關掉的，不用理
        // 面板要滿版靠 --gc-vw，打開的當下重算一次 ——
        // 這樣就算 resize 事件因為任何原因沒發（背景分頁、模擬器），也不會用到舊寬度
        document.documentElement.style.setProperty(
          '--gc-vw', document.documentElement.clientWidth + 'px');
        // 這個剛被打開 → 其他還開著的全部關掉
        for (var j = 0; j < panels.length; j++) {
          if (panels[j] !== p && !panels[j].hasAttribute('hidden')) {
            // 圖卡面板（gc-mega-host，GOS-0248）：讓 Focal 自己的 250ms 重疊先跑完再收，
            // 立刻收會讓兩片之間露出底圖閃一下；260ms 後還開著才當保險關掉。
            if (p.classList.contains('gc-mega-host') || panels[j].classList.contains('gc-mega-host')) {
              (function (other, opened) {
                setTimeout(function () {
                  if (!opened.hasAttribute('hidden') && !other.hasAttribute('hidden')) other.setAttribute('hidden', '');
                }, 260);
              })(panels[j], p);
            } else {
              panels[j].setAttribute('hidden', '');
            }
          }
        }
      }
    });

    for (var k = 0; k < panels.length; k++) {
      obs.observe(panels[k], { attributes: true, attributeFilter: ['hidden'] });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', guard, { once: true });
  } else {
    guard();
  }
  document.addEventListener('shopify:section:load', function (e) {
    if (e.target && e.target.id === 'shopify-section-header') guard();
  });
})();

/* ============================================================
   --gc-vw：視窗寬度（不含捲軸）
   ------------------------------------------------------------
   給大選單滿版用。不能用 CSS 的 100vw —— 那個含捲軸寬度，
   會比實際可視寬多出幾 px，造成整頁多一條橫向捲軸。
   ============================================================ */
(function () {
  'use strict';
  if (window.__gcVW) return;
  window.__gcVW = true;
  function set() {
    document.documentElement.style.setProperty(
      '--gc-vw', document.documentElement.clientWidth + 'px');
  }
  set();
  // 不要用 requestAnimationFrame 包 —— rAF 在背景/隱藏分頁裡不會執行，
  // 使用者切回來時寬度就是舊的（實測過：視窗已經變 768，變數還停在 1585）。
  // 這裡只有「讀一次 clientWidth ＋ 寫一個變數」，本來就夠輕，不需要節流。
  window.addEventListener('resize', set, { passive: true });
  window.addEventListener('orientationchange', set, { passive: true });
  // 分頁從背景切回前景時補一次，確保不是舊值
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) set();
  });
})();

/* ============================================================
   捲過首圖就把透明頁首換成白底
   ------------------------------------------------------------
   主題只在「大選單打開」時換狀態，捲動時不換 ——
   捲過 banner 之後白 logo 會壓在白色內容上完全看不見。
   門檻取「首圖高度 − 頁首高度」，也就是首圖剛好捲完的那一刻。
   ============================================================ */
(function () {
  'use strict';
  if (window.__gcSolid) return;
  window.__gcSolid = true;

  function start() {
    var h = document.querySelector('.header');
    if (!h) return;
    // 不要在這裡檢查 header--transparent 就 return ——
    // 主題初始化時那個 class 會短暫消失，剛好撞上就永遠不會掛監聽器。
    // CSS 選擇器本來就要求 .header--transparent.gc-solid，沒開透明時多一個 class 也沒作用。

    function solid(v) { h.classList.toggle('gc-solid', !!v); }

    /* 什麼時候變成白色霧面玻璃（2026-09-01 改）
       ── 舊做法：等整張首圖捲完才變。Mars 在手機實測「要滑到第二頁才變」，
          因為首圖有 624px 高，滑一小段當然還是透明的。
       ── 新做法：照 Apple ——**離開最頂端就變**。門檻只留 24px，
          避免手指輕輕一碰就閃一下。
       手機的透明頁首因此只在「完全在最上面」時出現，往下滑立刻交給玻璃，
       這正是 Mars 要的順序。 */
    var THRESHOLD = 24;
    var raf = 0;
    function tick() {
      if (raf) return;
      raf = requestAnimationFrame(function () {
        raf = 0;
        solid((window.scrollY || document.documentElement.scrollTop || 0) > THRESHOLD);
      });
    }
    tick();
    window.addEventListener('scroll', tick, { passive: true });
    window.addEventListener('resize', tick, { passive: true });

    // 圖片載完首圖高度才準，重新綁一次
    window.addEventListener('load', tick, { once: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else { start(); }
})();

/* ============================================================
   手機選單：展開大分類時，順便展開第一個子分類
   ------------------------------------------------------------
   原本是三層：寵物生活 → 自動飲水機 → 商品。
   Mars：「消費者根本不知道要點進第二層」（那些 + 沒人看得懂）。
   做法：點開大分類時，自動把第一個子分類也打開 —— 消費者一眼看到商品，
   就知道旁邊那些 + 點下去會出現什麼，不用人教。

   全部子分類一起展開的話，光「寵物生活」就是 39 張帶圖的商品卡、
   要滑約 4000px 才到下一個大分類，所以只開第一個（Mars 2026-08-28 拍板）。

   用 .click() 走主題自己的展開流程，不要直接改 aria-expanded ——
   <collapsible-content> 要自己算高度做動畫，硬改屬性會算錯。
   ============================================================ */
(function () {
  'use strict';
  if (window.__gcDrawerAuto) return;
  window.__gcDrawerAuto = true;

  function init() {
    var drawer = document.querySelector('#mobile-menu-drawer');
    if (!drawer) return;

    var tops = drawer.querySelectorAll('.drawer__content > .mobile-nav > .mobile-nav__item');
    for (var i = 0; i < tops.length; i++) {
      (function (li) {
        var btn = li.querySelector(':scope > .mobile-nav__link');
        if (!btn || btn.__gcWatched) return;
        btn.__gcWatched = true;

        var handled = false;      // 同一次展開只自動開一次，使用者手動收起來就不再插手
        new MutationObserver(function () {
          if (btn.getAttribute('aria-expanded') !== 'true') { handled = false; return; }
          if (handled) return;
          handled = true;
          var sub = li.querySelector(
            ':scope > collapsible-content > ul > .mobile-nav__item > .mobile-nav__link');
          if (sub && sub.getAttribute('aria-expanded') === 'false') {
            // 等上一層的展開動畫先起跑，子層的高度才算得準
            setTimeout(function () { sub.click(); }, 80);
          }
        }).observe(btn, { attributes: true, attributeFilter: ['aria-expanded'] });
      })(tops[i]);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else { init(); }
  document.addEventListener('shopify:section:load', function (e) {
    if (e.target && e.target.id === 'shopify-section-header') init();
  });
})();
