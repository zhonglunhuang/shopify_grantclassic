/* 拆解段（.xps）：①影片進視窗才播、只播一次、停在散開那格；
   ②捲動進度把六組零件一個一個點亮（.on）、其他變暗（.xps-live）。
   清單本身由 ts-air.js 的 LAYERS 生成，這裡每次 update 重抓、不搶先機。 */
if (!window.__tsXpInit) {
  window.__tsXpInit = 1;
  (function () {
    function start() {
      var sec = document.querySelector("[data-ts-xps]");
      if (!sec) return;

      var vid = sec.querySelector(".xpvid");
      if (vid && "IntersectionObserver" in window) {
        var played = false;
        new IntersectionObserver(function (es, io) {
          for (var i = 0; i < es.length; i++) {
            if (es[i].isIntersecting && !played) {
              played = true;
              var pr = vid.play();
              if (pr && pr.catch) pr.catch(function () {});
              io.disconnect();
            }
          }
        }, { threshold: 0.35 }).observe(vid);
      } else if (vid) {
        var pr2 = vid.play();
        if (pr2 && pr2.catch) pr2.catch(function () {});
      }

      if (matchMedia("(prefers-reduced-motion:reduce)").matches) return;

      /* 線到線：七層在定格畫面裡的錨點（% of 影片框），由上往下對應清單 01→07。
         Y=層高度、X=該層右緣（Type-C 那件偏左所以 X 特別小）。 */
      var LAYER_Y = [17, 31, 43, 55, 65, 74, 84];
      var LAYER_X = [74, 76, 76, 42, 77, 72, 79];
      var linkLayer = sec.querySelector(".xp__linklayer");
      var linkSvg = sec.querySelector(".xp__link");
      var linkPath = sec.querySelector(".xp__linkpath");
      var linkDot = sec.querySelector(".xp__linkdot");
      var vidbox = sec.querySelector(".xp__vidbox");
      var splitEl = sec.querySelector(".split");
      var lastActive = -1;

      function drawLink(active, items) {
        /* display:none（手機版）時 offsetWidth 是 0，直接不畫 */
        if (!linkPath || !vidbox || !splitEl || !linkLayer.offsetWidth) return;
        var sr = splitEl.getBoundingClientRect();
        var vb = vidbox.getBoundingClientRect();
        var ir = items[active].getBoundingClientRect();
        var w = Math.max(1, Math.round(sr.width)), h = Math.max(1, Math.round(sr.height));
        linkSvg.setAttribute("viewBox", "0 0 " + w + " " + h);
        var x1 = vb.left - sr.left + vb.width * (LAYER_X[active] || 76) / 100;
        var y1 = vb.top - sr.top + vb.height * (LAYER_Y[active] || 50) / 100;
        var x3 = ir.left - sr.left - 16;
        var y3 = ir.top - sr.top + ir.height / 2;
        var x2 = x1 + (x3 - x1) * 0.42;
        linkPath.setAttribute("d",
          "M" + x1.toFixed(1) + " " + y1.toFixed(1) +
          " L" + x2.toFixed(1) + " " + y1.toFixed(1) +
          " L" + x3.toFixed(1) + " " + y3.toFixed(1));
        linkDot.style.left = x1 + "px";
        linkDot.style.top = y1 + "px";
        var len = linkPath.getTotalLength();
        linkPath.style.transition = "none";
        linkPath.style.strokeDasharray = len;
        linkPath.style.strokeDashoffset = len;
        void linkPath.getBoundingClientRect();
        linkPath.style.transition = "stroke-dashoffset .55s cubic-bezier(.25,.6,.2,1)";
        linkPath.style.strokeDashoffset = "0";
      }

      var ticking = false;
      function update() {
        ticking = false;
        var vh = innerHeight, r = sec.getBoundingClientRect();
        if (r.bottom < -80 || r.top > vh + 80) return;
        var p;
        if (matchMedia("(max-width:768px)").matches) {
          /* 手機沒釘住（塞不下一屏），進度改「段落穿過視窗多少」，頭尾各留 15% */
          p = ((vh - r.top) / (vh + r.height) - 0.15) / 0.7;
        } else {
          var h = sec.offsetHeight - vh;
          p = (0 - r.top) / (h > 0 ? h : 1);
        }
        if (p < 0) p = 0; else if (p > 1) p = 1;

        var list = document.getElementById("xpList");
        var items = list ? [].slice.call(list.children) : [];
        if (!items.length) return;

        var live = p > 0.015;
        sec.classList.toggle("xps-live", live);
        var active = Math.min(items.length - 1, Math.floor(p * items.length));
        for (var i = 0; i < items.length; i++) {
          items[i].classList.toggle("on", live && i === active);
        }

        /* 換層：引線重畫（藍點滑過去、折線從層端長到清單那項） */
        if (live && active !== lastActive) {
          lastActive = active;
          drawLink(active, items);
        }
        if (!live) lastActive = -1;
      }
      function onScroll() {
        if (!ticking) { ticking = true; requestAnimationFrame(update); }
      }
      addEventListener("scroll", onScroll, { passive: true });
      addEventListener("resize", function () { lastActive = -1; onScroll(); });
      update();
    }
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", start);
    } else { start(); }
  })();
}
