/* 加入購物車。

   原本用純 {% form 'product' %} 送出，但主題（Focal）會攔截所有指向 /cart/add 的表單、
   換成它自己的迷你購物車流程；我們的結構不是它預期的那一套，它攔下來之後就沒有下文，
   按了沒反應。這裡不去猜主題會怎麼做 —— 直接呼叫 Shopify 官方的購物車 API，
   成功就帶去購物車頁。表單本身留著，JS 掛掉時還是能用原生送出。

   用捕獲階段（第三個參數 true）綁事件，才能搶在主題的監聽器之前把事件攔下來。 */
if (!window.__tsCartInit) {
  window.__tsCartInit = 1;
  (function () {
    var ROOT = (window.Shopify && window.Shopify.routes && window.Shopify.routes.root) || "/";

    function fail(btn, old, msg) {
      btn.disabled = false;
      btn.textContent = msg;
      setTimeout(function () { btn.textContent = old; }, 2600);
    }

    document.addEventListener("submit", function (e) {
      var form = e.target;
      // 認所有 ts-…-form，之後再多加購買點也不用回來改這裡
      if (!form || !form.id || !/^ts-[\w-]+-form$/.test(form.id)) return;
      e.preventDefault();
      e.stopPropagation();

      var btn = form.querySelector('button[type="submit"]');
      /* 顏色選擇是 radio（2026-08-19）：要抓「被選的那顆」，抓第一顆會永遠加石墨黑 */
      var idInput = form.querySelector('[name="id"]:checked') || form.querySelector('[name="id"]');
      if (!btn || !idInput) return;
      var old = btn.textContent.trim();
      btn.disabled = true;
      btn.textContent = "加入中…";

      fetch(ROOT + "cart/add.js", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ id: Number(idInput.value), quantity: 1 })
      })
        .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
        .then(function (res) {
          if (!res.ok) throw new Error(res.d.description || res.d.message || "加入失敗");
          location.href = ROOT + "cart";
        })
        .catch(function (err) {
          fail(btn, old, err && err.message ? err.message.slice(0, 18) : "加入失敗");
        });
    }, true);
  })();
}
