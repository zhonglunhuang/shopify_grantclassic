/* 六重防護：切換列＋示意曲線動畫。
   每個防護一條曲線（座標系 560×260、基線 y=232、門檻線 y 可調）：
   線用 stroke-dash 畫出來，畫到觸發點亮紅點。3 秒自動輪播、使用者點了就停。 */
if (!window.__tsGuardInit) {
  window.__tsGuardInit = 1;
  (function () {
    var MODES = [
      { tab: "過壓", axis: "電壓", th: 70, thLabel: "門檻",
        d: "M40,215 C120,205 200,170 270,130 L330,70 L330,232 L540,232",
        dot: [330, 70], cap: "電壓衝過門檻的瞬間，直接切斷輸出。" },
      { tab: "過熱", axis: "溫度", th: 70, thLabel: "45°C",
        d: "M40,215 C130,200 220,150 300,70 C370,100 460,118 540,112",
        dot: [300, 70], cap: "溫度碰到 45°C 先降載續充，降溫後恢復功率。" },
      { tab: "過載", axis: "輸出電流", th: 84, thLabel: "上限",
        d: "M40,215 C110,200 180,150 250,84 L540,84",
        dot: [250, 84], cap: "輸出異常爬升，到上限就鎖住，自動限流。" },
      { tab: "過充", axis: "電量", th: 70, thLabel: "100%",
        d: "M40,215 C150,195 260,130 360,70 L540,70",
        dot: [360, 70], cap: "充到滿就停在滿，不硬灌、不涓流虐待電芯。" },
      { tab: "短路", axis: "電流", th: 60, thLabel: "短路",
        d: "M40,150 L280,150 L298,60 L306,232 L540,232",
        dot: [298, 60], cap: "偵測到短路突波，瞬間斷路，保住整顆電芯。" },
      { tab: "異物偵測", axis: "輸出功率", th: 0, thLabel: "",
        d: "M40,120 L300,120 L312,232 L540,232",
        dot: [300, 120], cap: "鑰匙、硬幣放上充電區，立刻停止輸出（FOD）。" }
    ];

    function start() {
      var sec = document.querySelector("[data-ts-guard]");
      if (!sec) return;
      var tabs = sec.querySelector("#gxTabs");
      var curve = sec.querySelector("#gxCurve");
      var dot = sec.querySelector("#gxDot");
      var th = sec.querySelector("#gxTh");
      var thLabel = sec.querySelector("#gxThLabel");
      var axis = sec.querySelector("#gxAxis");
      var cap = sec.querySelector("#gxCap");
      if (!tabs || !curve) return;

      var reduce = matchMedia("(prefers-reduced-motion:reduce)").matches;
      /* 2026-08-19 SEO：按鈕改由 Liquid 渲染（ts-guard.liquid），這裡沿用現成的；
         沒渲染時才後備生成。順序必須跟 MODES 一致。 */
      var btns = [].slice.call(tabs.querySelectorAll("button"));
      if (!btns.length) {
        btns = MODES.map(function (m) {
          var b = document.createElement("button");
          b.type = "button"; b.textContent = m.tab; b.setAttribute("role", "tab");
          tabs.appendChild(b);
          return b;
        });
      }
      btns.forEach(function (b, i) {
        b.addEventListener("click", function () { manual = true; lastY = scrollY; show(i); });
      });

      var cur = -1, manual = false, lastY = 0, dotTimer = null;
      function show(i) {
        cur = i;
        var m = MODES[i];
        btns.forEach(function (b, j) { b.classList.toggle("on", j === i); });
        axis.textContent = m.axis;
        if (m.th > 0) {
          th.style.display = ""; thLabel.style.display = "";
          th.setAttribute("y1", m.th); th.setAttribute("y2", m.th);
          thLabel.setAttribute("y", m.th - 10);
          thLabel.textContent = m.thLabel;
        } else { th.style.display = "none"; thLabel.style.display = "none"; }
        cap.textContent = m.cap;
        dot.classList.remove("on");
        if (dotTimer) clearTimeout(dotTimer);
        curve.setAttribute("d", m.d);
        dot.setAttribute("cx", m.dot[0]); dot.setAttribute("cy", m.dot[1]);
        var len = curve.getTotalLength();
        if (reduce) {
          curve.style.strokeDasharray = "none";
          dot.classList.add("on");
          return;
        }
        curve.style.transition = "none";
        curve.style.strokeDasharray = len;
        curve.style.strokeDashoffset = len;
        void curve.getBoundingClientRect();
        curve.style.transition = "stroke-dashoffset 1.5s cubic-bezier(.3,.5,.25,1)";
        curve.style.strokeDashoffset = "0";
        /* 紅點在線畫到觸發點時亮（觸發點約在整條線 55-65% 處，取 60%） */
        dotTimer = setTimeout(function () { dot.classList.add("on"); }, 950);
      }

      show(0);

      /* 2026-08-19 Mars 三改：手機＝釘住舞台（260vh sticky）、進度讀舞台捲了多少；
         桌機＝不釘（視窗高、置中會空一大截），進度讀段落穿過視窗多少（頭尾各留白）。
         兩邊都是邊滑邊換模式；點分頁可暫時手動、再捲動 120px 就交還。 */
      if (!reduce) {
        var stage = sec.querySelector(".gxstage") || sec;
        var mobilePin = matchMedia("(max-width:860px)");
        var ticking = false;
        lastY = scrollY;
        function update() {
          ticking = false;
          var vh = innerHeight, r = stage.getBoundingClientRect();
          if (r.bottom < 0 || r.top > vh) return;
          var p;
          if (mobilePin.matches) {
            var h = stage.offsetHeight - vh;
            p = (0 - r.top) / (h > 0 ? h : 1);
          } else {
            p = ((vh - r.top) / (vh + r.height) - 0.14) / 0.7;
          }
          if (p < 0) p = 0; else if (p > 1) p = 1;
          var idx = Math.floor(p * MODES.length * 0.999);
          if (idx > MODES.length - 1) idx = MODES.length - 1;
          if (!manual && idx !== cur) show(idx);
        }
        function onScroll() {
          if (manual && Math.abs(scrollY - lastY) > 120) manual = false;
          if (!ticking) { ticking = true; requestAnimationFrame(update); }
        }
        addEventListener("scroll", onScroll, { passive: true });
        addEventListener("resize", onScroll);
        update();
      }
    }
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", start);
    } else { start(); }
  })();
}
