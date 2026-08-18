/* 多角度段：捲動刷影片（scroll-scrub）——捲動進度 0→1 對應 currentTime 0→片尾。
   影片是全關鍵幀（-g 1），任意 seek 都是整格、不會卡。
   prefers-reduced-motion 退回自動循環播放。 */
if (!window.__tsViewsInit) {
  window.__tsViewsInit = 1;
  (function () {
    function start() {
      var sec = document.querySelector("[data-ts-viewscrub]");
      if (!sec) return;
      var vid = sec.querySelector("video");
      if (!vid) return;

      if (matchMedia("(prefers-reduced-motion:reduce)").matches) {
        vid.loop = true;
        var pr = vid.play();
        if (pr && pr.catch) pr.catch(function () {});
        return;
      }

      vid.pause();
      /* iOS Safari：沒 play 過的影片不渲染畫格，捲動刷會全黑——
         先 play 再立刻 pause 逼出第一格（muted+playsinline 不需手勢） */
      function prime() {
        var pr = vid.play();
        if (pr && pr.then) pr.then(function () { vid.pause(); }).catch(function () {});
        else vid.pause();
      }
      if (vid.readyState >= 2) prime();
      else vid.addEventListener("canplay", prime, { once: true });
      var ticking = false;
      function update() {
        ticking = false;
        var vh = innerHeight, r = sec.getBoundingClientRect();
        if (r.bottom < -80 || r.top > vh + 80) return;
        if (!vid.duration) return;
        var h = sec.offsetHeight - vh;
        var p = (0 - r.top) / (h > 0 ? h : 1);
        if (p < 0) p = 0; else if (p > 1) p = 1;
        var t = p * (vid.duration - 0.04);
        /* 差距小於一格就不 seek，省掉無謂的解碼 */
        if (Math.abs(vid.currentTime - t) > 0.03) vid.currentTime = t;
      }
      function onScroll() {
        if (!ticking) { ticking = true; requestAnimationFrame(update); }
      }
      addEventListener("scroll", onScroll, { passive: true });
      addEventListener("resize", onScroll);
      if (vid.readyState >= 1) update();
      else vid.addEventListener("loadedmetadata", update);
    }
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", start);
    } else { start(); }
  })();
}
