/* ═══════════════════════════════════════════════════════════
   gc-dock ── 把點數按鈕改成跟 LINE 那顆一樣的設計（2026-08-30）

   ── 為什麼需要 JS ──
   點數按鈕（Loloyal）的紅色圓角方塊畫在 **Shadow DOM 裡**
   （`#loloyal-launcher-box` 有 shadowRoot），文件層的 CSS 一個字都碰不到它。
   唯一的辦法是把樣式注入到那個 shadow root 裡面。

   ── 為什麼不用 transform 縮放 ──
   第一版我用 `transform:scale()` 把它縮到 48px。**那會弄壞面板**：
   transform 會讓元素變成它內部 `position:fixed` 子孫的定位基準，
   而面板 `.loloyal-iframe-page` 正好是它的子元素——
   面板高度寫的是 `calc(100% - 112px)`，那個 100% 就從「整個畫面 900px」
   變成「按鈕 60px」，算出負數被 min-height 卡在 52px。
   實測：有 transform 面板高 42px、拿掉之後 640px（2026-08-30）。
   所以尺寸一律用 width/height，**絕對不要對這個外框用 transform**。

   ── 顏色怎麼跟著後台走 ──
   CSS 自訂屬性**會**穿進 Shadow DOM（一般的 CSS 規則不會）。
   所以這裡只寫 var()，實際值由 gc-dock.css 依照後台選的樣式設在 :root。

   要還原：把 layout 裡的 section 那行拿掉即可。
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  if (window.__gcDockInit) return;      // 三個 layout 都會載，只跑一次
  window.__gcDockInit = true;

  var STYLE_ID = 'gc-dock-shadow-style';
  var CSS = [
    '.loloyal-launcher{',
    /* 尺寸也要在這裡鎖死。外框我們用 CSS 壓成 48×48，但**裡面這顆圓是 App 畫的**，
       它的手機設定與桌機設定是兩組（Loloyal 後台 launcher.desktop / launcher.mobile），
       手機那組如果比較大，就會撐出 48 的框——電腦模擬看不出來、真手機才會發現
       （Mars 2026-09-01 用 iPhone 16 回報「大小不一樣」）。 */
    '  width: 100% !important;',
    '  height: 100% !important;',
    '  min-width: 0 !important;',
    '  min-height: 0 !important;',
    '  background: var(--gcd-btn-bg, rgba(255,255,255,.8)) !important;',
    '  border-radius: 50% !important;',
    '  box-shadow: 0 2px 8px rgba(0,0,0,.15) !important;',
    '  -webkit-backdrop-filter: var(--gcd-btn-blur, blur(10px));',
    '  backdrop-filter: var(--gcd-btn-blur, blur(10px));',
    '}',
    /* 圖示是 App 給的圖檔，改不了顏色，只能用濾鏡。
       brightness(0) 把任何顏色壓成純黑；要白色就再 invert(1)。 */
    '.loloyal-launcher-icon, .loloyal-launcher-close-icon{',
    '  filter: var(--gcd-icon-filter, brightness(0)) !important;',
    '}',
    /* 滑過去浮起來，跟 LINE 那顆一致（Mars 2026-09-01）。
       transform 只能下在 **shadow root 裡面的這顆圓**——
       它不是面板 .loloyal-iframe-page 的祖先（面板是外框的另一個子元素），
       所以不會踩到上面那個「transform 毀掉面板定位」的雷。
       外框本身仍然一個 transform 都不能加。 */
    '.loloyal-launcher{',
    '  transition: transform .22s cubic-bezier(.2,.7,.3,1), box-shadow .22s !important;',
    '}',
    '.loloyal-launcher:hover{',
    '  transform: translateY(-2px) !important;',
    '  box-shadow: 0 6px 16px rgba(0,0,0,.20) !important;',
    '}',
    '@media (hover:none){ .loloyal-launcher:hover{ transform:none !important; } }'
  ].join('\n');

  function paint() {
    var box = document.getElementById('loloyal-launcher-box');
    if (!box || !box.shadowRoot) return false;
    if (box.shadowRoot.getElementById(STYLE_ID)) return true;   // 已經注入過
    var st = document.createElement('style');
    st.id = STYLE_ID;
    st.textContent = CSS;
    box.shadowRoot.appendChild(st);
    return true;
  }

  /* App 是非同步載入的，而且換頁（Turbo）之後可能重建。
     先試幾次，再交給觀察器盯著——不要用 setInterval 一直跑，
     那會在使用者停留很久的頁面上一直燒 CPU。 */
  var tries = 0;
  (function attempt() {
    if (paint() || ++tries > 40) return;    // 最多試 40 次 × 250ms ＝ 10 秒
    setTimeout(attempt, 250);
  })();

  if (window.MutationObserver) {
    var mo = new MutationObserver(function () { paint(); });
    mo.observe(document.body, { childList: true, subtree: false });
  }
})();
