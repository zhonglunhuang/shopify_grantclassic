/* 門市據點頁：搜尋、篩選、分頁、地圖連動、logo 牆捲動 */
(function(){
(function(){
  var D = window.SL_DATA;
  if (!D) return;
  var rows = D.rows || [], ORDER = D.order || [];
  /* 縣市屬於哪一區是固定的地理事實，資料沒帶就用這份內建的——
     少了它 REGION[c] 會整個 undefined，地圖那欄一片空白而且不報錯。 */
  var REGION = D.region || {
    '基隆市':'北部','台北市':'北部','新北市':'北部','桃園市':'北部','新竹市':'北部',
    '新竹縣':'北部','宜蘭縣':'北部','苗栗縣':'中部','台中市':'中部','彰化縣':'中部',
    '南投縣':'中部','雲林縣':'中部','嘉義市':'南部','嘉義縣':'南部','台南市':'南部',
    '高雄市':'南部','屏東縣':'南部','花蓮縣':'東部離島','台東縣':'東部離島',
    '澎湖縣':'東部離島','金門縣':'東部離島','連江縣':'東部離島'};
  var REGIONS = ['北部','中部','南部','東部離島'];
  var KINDS = ['全系列展示店','展示店','連鎖 3C','機車通路','百貨通路','直營店','未分類'];

  /* 模擬稿沒有真的定位權限，用台北車站當基準點算真實直線距離 */
  var ORIGIN = window.SL_ORIGIN || { name:'台北車站', lat:25.04784, lng:121.51704 };
  ORIGIN.lat = parseFloat(ORIGIN.lat); ORIGIN.lng = parseFloat(ORIGIN.lng);

  var PER_PAGE = window.SL_PER_PAGE || 30;
  var state = { mode:'full', kind:null, county:null, q:'', sort:'dist', page:1 };

  function esc(s){ return String(s==null?'':s).replace(/[&<>"]/g,function(c){
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }

  /* logo 牆改由 GrantOS 的資料產生（GOS-0220）。**沒資料就不動**，維持後台手建的
     區塊——GrantOS 還沒推之前這面牆不可以變成空的。
     放在 sl-locator.js 而不是 sl-wall 區塊裡：那個區塊在 sl-data.js 之前就渲染完了，
     在那裡讀 SL_DATA 永遠是 undefined（實測 10 格沒被 6 格取代）。 */
  (function renderWall(){
    if (!D.wall || !D.wall.length) return;
    var host = document.getElementById('sl-wall');
    if (!host) return;
    var base = window.SL_ASSET_BASE || '';
    host.innerHTML = D.wall.map(function(b){
      /* 沒有 logo 就顯示品牌名字——**不可以是破圖** */
      var mark = b.logo
        ? '<img class="sl-cell__logo" src="'+base+esc(b.logo)+'" alt="'+esc(b.n)+'"'
          + ' style="max-height:'+(parseInt(b.h,10)||32)+'px" loading="lazy">'
        : '<span class="sl-cell__mark">'+esc(b.n)+'</span>';
      return '<div class="sl-cell"><span class="sl-cell__box">'+mark+'</span>'
        + (b.cap ? '<span class="sl-cell__cap">'+esc(b.cap)+'</span>' : '')+'</div>';
    }).join('');
  })();

  /* 分店名：品牌已經當眉標顯示在上面了，店名裡再重複一次很吵
     （實測 128 家有品牌的門市裡 104 家、81% 的店名開頭就是品牌名）。
     開頭真的是品牌名才拿掉；像「Q 哥手機快修 / Q哥台中公益店」這種
     開頭對不起來的就整個保留，不要自作聰明去猜。
     **只動顯示，不動 r.n**——搜尋還是拿完整店名比對。 */
  function branchName(r){
    var name = (r.n || '').trim();
    if (!r.ch) return name;
    var squash = function(x){ return String(x).replace(/[\s\u3000]+/g, '').toLowerCase(); };
    var brand = squash(r.ch), i = 0, seen = '';
    while (i < name.length && seen.length < brand.length) {
      seen += squash(name[i]);
      i++;
    }
    if (seen !== brand) return name;
    var rest = name.slice(i).replace(/^[\s\u3000\-–—·・]+/, '').trim();
    return rest || name;      // 整個店名就是品牌名時（沒有分店字樣）就保留原樣
  }

  function km(r){
    var R=6371, t=Math.PI/180;
    var dLat=(r.lat-ORIGIN.lat)*t, dLng=(r.lng-ORIGIN.lng)*t;
    var a=Math.sin(dLat/2)*Math.sin(dLat/2) +
          Math.cos(ORIGIN.lat*t)*Math.cos(r.lat*t)*Math.sin(dLng/2)*Math.sin(dLng/2);
    return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
  }
  rows.forEach(function(r){ r.km = km(r); });

  function match(r){
    if (state.kind && r.cat !== state.kind) return false;
    if (state.county && r.c !== state.county) return false;
    if (state.q && (r.n+' '+r.a).toLowerCase().indexOf(state.q.toLowerCase()) < 0) return false;
    return true;
  }

  /* 營業中／已打烊：拿使用者當下的時間去比，不是寫死的字 */
  function hhmm(m){ return ('0'+Math.floor(m/60)).slice(-2)+':'+('0'+(m%60)).slice(-2); }
  /* 營業中／已打烊：拿使用者當下的時間去比，不是寫死的字。
     **沒填營業時間就回 null**（不是「已打烊」）——GrantOS 那邊真的有兩百多家還沒填，
     一律寫「已打烊」等於對消費者說謊。回 null 時卡片就不顯示這兩個標籤，版面不破。
     資料格式是 {wd:[開,關], sa:[…], su:[…]|null, x:"例外文字"}，三組各自算。 */
  function openState(r){
    if (!r.oh) return null;                      // 還沒填
    var now = new Date();
    var day = now.getDay();                      // 0=日 … 6=六
    var slot = r.oh[day === 0 ? 'su' : (day === 6 ? 'sa' : 'wd')];
    if (!slot || slot[0] === null || slot[1] === null) {
      return { open:false, label:'今日公休', text:'' };
    }
    var o = slot[0], c = slot[1];
    var mins = now.getHours()*60 + now.getMinutes();
    var open = (c <= o) ? (mins >= o || mins < c)   // 跨午夜
                        : (mins >= o && mins < c);
    return { open: open, label: open ? '營業中' : '已打烊', text: hhmm(o)+'–'+hhmm(c) };
  }

  function sorted(list){
    var s = list.slice();
    if (state.sort === 'dist')  s.sort(function(a,b){ return a.km - b.km; });
    if (state.sort === 'name')  s.sort(function(a,b){ return a.n.trim().localeCompare(b.n.trim(),'zh-Hant'); });
    if (state.sort === 'county')s.sort(function(a,b){
      var d = ORDER.indexOf(a.c) - ORDER.indexOf(b.c);
      return d !== 0 ? d : a.km - b.km; });
    return s;
  }

  /* ---- 篩選 ---- */
  function buildPills(){
    /* 分類與 logo 牆用同一套講法。家數 0 的是資料端真的還沒有那類門市，按不下去。 */
    var box = document.getElementById('sl-kindPills');
    box.innerHTML = '<button type="button" class="sl-pill" data-kind="" aria-pressed="true">全部</button>' +
      (D.cats||[]).map(function(x){
        return '<button type="button" class="sl-pill'+(x.c?'':' sl-pill--empty')+'" data-kind="'+esc(x.n)+'"'+
               ' aria-pressed="false"'+(x.c?'':' disabled title="資料端還沒有這一類的門市"')+'>'+
               esc(x.n)+'<b class="sl-tnum">'+x.c+'</b></button>';
      }).join('');
    box.addEventListener('click', function(e){
      var b = e.target.closest('.sl-pill'); if(!b || b.disabled) return;
      state.kind = b.dataset.kind || null; state.page = 1;
      [].forEach.call(box.querySelectorAll('.sl-pill'), function(c){ c.setAttribute('aria-pressed', String(c===b)); });
      render();
    });
  }

  var LAT0=25.35, LAT1=21.85, LNG0=119.95, LNG1=122.10, W=340, H=600;
  function px(lng){ return (lng-LNG0)/(LNG1-LNG0)*W; }
  function py(lat){ return (LAT0-lat)/(LAT0-LAT1)*H; }

  function clusters(){
    var agg = {};
    rows.forEach(function(r){
      var a = agg[r.c] || (agg[r.c] = {n:0,lat:0,lng:0,c:r.c});
      a.n++; a.lat += r.lat; a.lng += r.lng;
    });
    var cs = Object.keys(agg).map(function(k){
      var a = agg[k];
      /* 半徑壓小很多：泡泡佔全島的比例太大就變成一坨紅，也會被推離原位 */
      return { c:a.c, n:a.n, ax:px(a.lng/a.n), ay:py(a.lat/a.n),
               x:px(a.lng/a.n), y:py(a.lat/a.n),
               r:Math.max(8.5, Math.min(15, 7 + Math.sqrt(a.n)*1.1)) };
    });
    /* 北部幾個縣市的重心幾乎疊在一起，先把泡泡推開再畫，不然數字互相蓋住。
       泡泡變小之後只要推一點點，位置就不會離真實重心太遠。 */
    for (var pass=0; pass<220; pass++){
      for (var i=0;i<cs.length;i++) for (var j=i+1;j<cs.length;j++){
        var A=cs[i], B=cs[j], dx=B.x-A.x, dy=B.y-A.y;
        var d=Math.sqrt(dx*dx+dy*dy)||0.01, need=A.r+B.r+2.5;
        if (d < need){
          var push=(need-d)/2, ux=dx/d, uy=dy/d;
          A.x-=ux*push; A.y-=uy*push; B.x+=ux*push; B.y+=uy*push;
        }
      }
    }
    cs.forEach(function(c){
      c.x = Math.max(c.r+2, Math.min(W-c.r-2, c.x));
      c.y = Math.max(c.r+2, Math.min(H-c.r-2, c.y));
    });
    return cs;
  }

  function buildMap(){
    var cs = clusters();
    var leaders = cs.map(function(c){
      var d = Math.hypot(c.x-c.ax, c.y-c.ay);
      return d > c.r ? '<line class="sl-leader" x1="'+c.ax.toFixed(1)+'" y1="'+c.ay.toFixed(1)+
             '" x2="'+c.x.toFixed(1)+'" y2="'+c.y.toFixed(1)+'"/>' : '';
    }).join('');
    var bubbles = cs.map(function(c){
      var x=c.x.toFixed(1), y=c.y.toFixed(1);
      return '<g class="sl-clus" data-county="'+esc(c.c)+'" role="button" tabindex="0" aria-label="'+esc(c.c)+' '+c.n+' 家">'+
             '<circle class="sl-h2" cx="'+x+'" cy="'+y+'" r="'+(c.r*1.95).toFixed(1)+'"/>'+
             '<circle class="sl-h1" cx="'+x+'" cy="'+y+'" r="'+(c.r*1.42).toFixed(1)+'"/>'+
             '<circle class="sl-core" cx="'+x+'" cy="'+y+'" r="'+c.r.toFixed(1)+'"/>'+
             '<text x="'+x+'" y="'+y+'">'+c.n+'</text></g>';
    }).join('');
    var svg = document.getElementById('sl-tw');
    svg.innerHTML =
      '<rect class="sl-tw-sea" x="0" y="0" width="'+W+'" height="'+H+'"/>' +
      '<path class="sl-tw-land" d="'+D.land+'"/>' +
      '<path class="sl-tw-county" d="'+D.counties+'"/>' +
      rows.map(function(r){
        return '<circle class="sl-dot" data-county="'+esc(r.c)+'" data-k="'+esc(r.cat)+'" '+
               'cx="'+px(r.lng).toFixed(1)+'" cy="'+py(r.lat).toFixed(1)+'" r="2.2"/>';
      }).join('') + leaders + bubbles;

    function pick(g){
      var c = g.dataset.county;
      state.county = (state.county === c) ? null : c; state.page = 1;
      render();
    }
    svg.addEventListener('click', function(e){ var g=e.target.closest('.sl-clus'); if(g) pick(g); });
    svg.addEventListener('keydown', function(e){
      var g=e.target.closest('.sl-clus');
      if(g && (e.key==='Enter'||e.key===' ')){ e.preventDefault(); pick(g); }
    });
  }

  /* ---- 清單 ---- */
  function card(r, i){
    var st = openState(r);
    var maps = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(r.a || r.n);
    return '<article class="sl-store">'+
      '<span class="sl-store__i">'+(i+1)+'</span>'+
      '<div class="sl-store__b">'+
        /* 品牌名當眉標放在店名上面（Mars 2026-08-16 選的版面）：
           34 家唯酷原本在清單上是 34 列沒有招牌的店名，而「招牌是誰」正是
           GrantOS 那張品牌表存在的全部理由。沒有品牌的獨立門市就不顯示這一行。 */
        (r.ch ? '<div class="sl-store__ch">'+esc(r.ch)+'</div>' : '')+
        '<div class="sl-store__n">'+esc(branchName(r))+'</div>'+
        '<div class="sl-store__a">'+esc(r.a || '（地址待補）')+'</div>'+
        '<div class="sl-store__tags">'+
          (st ? '<span class="sl-tag '+(st.open?'tag--open':'tag--shut')+'">'+st.label+'</span>' : '')+
          (st && st.text ? '<span class="sl-tag">'+esc(st.text)+'</span>' : '')+
          (r.sv||[]).map(function(s){ return '<span class="sl-tag sl-tag--svc">'+esc(s)+'</span>'; }).join('')+
          '<span class="sl-tag">'+esc(r.cat)+'</span>'+
          (r.fix ? '<span class="sl-tag sl-tag--todo">地址待補</span>' : '')+
        '</div>'+
      '</div>'+
      '<div class="sl-store__r">'+
        '<span class="sl-store__km">'+r.km.toFixed(1)+' km</span>'+
        '<span class="sl-acts">'+
          (r.p ? '<a class="sl-icb" href="tel:'+esc(r.p)+'" aria-label="打給 '+esc(r.n.trim())+'">'+
                 '<svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M3 2.5h2.2l1 2.6-1.4 1a8.5 8.5 0 0 0 4.1 4.1l1-1.4 2.6 1V12a1.5 1.5 0 0 1-1.6 1.5A11 11 0 0 1 2.5 4.1 1.5 1.5 0 0 1 3 2.5Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg></a>' : '')+
          '<a class="sl-nav-btn" href="'+maps+'" target="_blank" rel="noopener noreferrer">導航</a>'+
        '</span>'+
      '</div>'+
    '</article>';
  }

  function briefHTML(){
    var byC = {};
    rows.forEach(function(r){ byC[r.c] = (byC[r.c]||0)+1; });
    return REGIONS.map(function(reg){
      var cs = ORDER.filter(function(c){ return REGION[c]===reg && byC[c]; });
      if (!cs.length) return '';
      var tot = cs.reduce(function(s,c){ return s+byC[c]; },0);
      return '<div class="sl-briefgrp"><p class="sl-briefgrp__h">'+esc(reg)+' ・ '+tot+' 家</p><div class="sl-brief">'+
        cs.map(function(c){
          return '<div class="sl-bcell"><span class="sl-t-body">'+esc(c)+'</span><span class="sl-bcell__n sl-tnum">'+byC[c]+'</span></div>';
        }).join('')+'</div></div>';
    }).join('');
  }

  /* ---- 渲染 ---- */
  function render(){
    var brief = state.mode === 'brief';
    document.getElementById('sl-viewBrief').hidden = !brief;
    document.getElementById('sl-panelTW').hidden = brief;
    document.getElementById('sl-splitView').hidden = brief;

    if (brief){ document.getElementById('sl-briefBox').innerHTML = briefHTML(); return; }

    var list = sorted(rows.filter(match));
    var pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
    if (state.page > pages) state.page = pages;      /* 篩完變少時不要停在不存在的頁 */
    var from = (state.page - 1) * PER_PAGE;
    var slice = list.slice(from, from + PER_PAGE);

    document.getElementById('sl-count').textContent =
      '顯示 ' + list.length + ' 家' +
      (list.length !== rows.length ? '（共 ' + rows.length + ' 家）' : '') +
      (state.county ? ' ・ ' + state.county : '') +
      (state.kind ? ' ・ ' + state.kind : '');
    document.getElementById('sl-list').innerHTML =
      list.length ? slice.map(function(r,i){ return card(r, from + i); }).join('')
                  : '<p class="sl-empty sl-t-body sl-dim">這個條件下沒有據點。換一個篩選試試。</p>';

    /* 分頁只影響清單，地圖照樣把符合條件的全部亮起來 */
    var pg = document.getElementById('sl-pager');
    pg.hidden = list.length <= PER_PAGE;
    if (!pg.hidden){
      pg.innerHTML =
        '<button type="button" data-go="prev"'+(state.page===1?' disabled':'')+'>上一頁</button>'+
        '<span class="sl-pager__n">第 '+state.page+' / '+pages+' 頁 ・ 第 '+(from+1)+'–'+(from+slice.length)+' 家</span>'+
        '<button type="button" data-go="next"'+(state.page===pages?' disabled':'')+'>下一頁</button>';
    }

    var narrowed = !!(state.county || state.kind || state.q);
    [].forEach.call(document.querySelectorAll('#sl-tw .sl-dot'), function(d){
      if (!narrowed){ d.dataset.dim='0'; d.dataset.hit='0'; return; }
      var on = (!state.county || d.dataset.county === state.county) &&
               (!state.kind   || d.dataset.k === state.kind);
      d.dataset.dim = on ? '0' : '1';
      d.dataset.hit = on ? '1' : '0';
    });
    [].forEach.call(document.querySelectorAll('.sl-clus'), function(g){
      g.dataset.on = (state.county && g.dataset.county === state.county) ? '1' : '0';
    });
    document.getElementById('sl-mapHint').textContent =
      state.county ? '再點一次取消 ' + state.county
                   : '點圓圈看該縣市 ・ 距離以' + ORIGIN.name + '計算';
  }

  /* ---- 事件 ---- */
  document.getElementById('sl-sort').addEventListener('change', function(e){
    state.sort = e.target.value; state.page = 1; render();
  });

  var t;
  function doQ(v){ clearTimeout(t); t = setTimeout(function(){ state.q = v; state.page = 1; render(); }, 140); }
  document.getElementById('sl-q').addEventListener('input', function(e){ doQ(e.target.value.trim()); });
  document.getElementById('sl-doSearch').addEventListener('click', function(){
    state.q = document.getElementById('sl-q').value.trim(); state.page = 1; render();
  });
  document.getElementById('sl-useLoc').addEventListener('click', function(){
    document.getElementById('sl-mapHint').textContent =
      '模擬稿沒有定位權限，距離一律以' + ORIGIN.name + '計算';
  });

  function buildWall(){
    /* 格子由 liquid 產生，這裡只負責箭頭要不要出現 */
    syncWallNav();
  }

  /* 滑到頭就把該邊的箭頭收起來 */
  function syncWallNav(){
    var box = document.getElementById('sl-wall');
    var more = box.scrollWidth - box.clientWidth;
    document.getElementById('sl-wallPrev').hidden = more < 4 || box.scrollLeft < 4;
    document.getElementById('sl-wallNext').hidden = more < 4 || box.scrollLeft >= more - 4;
  }

  buildWall(); buildPills(); buildMap(); render();

  /* 欄數會隨寬度變，補白的格子數也要跟著重算 */
  document.getElementById('sl-pager').addEventListener('click', function(e){
    var b = e.target.closest('button[data-go]'); if(!b || b.disabled) return;
    state.page += (b.dataset.go === 'next' ? 1 : -1);
    render();
    document.querySelector('.sl-results').scrollIntoView({block:'start', behavior:'smooth'});
  });

  (function(){
    var box = document.getElementById('sl-wall');
    function page(dir){ box.scrollBy({ left: dir * box.clientWidth, behavior:'smooth' }); }
    document.getElementById('sl-wallPrev').addEventListener('click', function(){ page(-1); });
    document.getElementById('sl-wallNext').addEventListener('click', function(){ page(1); });
    box.addEventListener('scroll', syncWallNav, { passive:true });
    var wt;
    addEventListener('resize', function(){ clearTimeout(wt); wt = setTimeout(syncWallNav, 180); });
  })();
})();
})();
