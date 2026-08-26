(function(){
if (window.__tspProInit) return; window.__tspProInit = true;
document.body.classList.add('tsp-page');

          (function(){
            var el = document.getElementById('tc2');
            if (!el) return;
            if (!('IntersectionObserver' in window)) { el.classList.add('play'); return; }
            var io = new IntersectionObserver(function(es){
              es.forEach(function(e){ if (e.isIntersecting) { el.classList.add('play'); io.disconnect(); } });
            }, {threshold:.35});
            io.observe(el);
            var btn = document.getElementById('tcmorebtn'), txt = document.getElementById('tcmoretxt');
            if (btn && txt) btn.addEventListener('click', function(){
              var open = btn.getAttribute('aria-expanded') === 'true';
              btn.setAttribute('aria-expanded', String(!open));
              txt.hidden = open;
            });
          })();
        
;

          (function(){
            var b = document.getElementById('chgmorebtn'), t = document.getElementById('chgmoretxt');
            if (b && t) b.addEventListener('click', function(){
              var open = b.getAttribute('aria-expanded') === 'true';
              b.setAttribute('aria-expanded', String(!open)); t.hidden = open;
            });
          })();
        
;

        (function(){
          var car = document.getElementById('fundCar'), tabs = document.getElementById('fundTabs');
          if (!car || !tabs) return;
          var imgs = car.querySelectorAll('img'), btns = tabs.querySelectorAll('button'), pill = tabs.querySelector('.fund__pill');
          function setPill(b){ pill.style.left = b.offsetLeft + 'px'; pill.style.width = b.offsetWidth + 'px'; }
          function go(i){
            imgs.forEach(function(im, k){ im.classList.toggle('on', k === i); });
            btns.forEach(function(b, k){ b.classList.toggle('on', k === i); b.setAttribute('aria-selected', String(k === i)); });
            setPill(btns[i]);
          }
          btns.forEach(function(b, i){ b.addEventListener('click', function(){ go(i); }); });
          requestAnimationFrame(function(){ setPill(tabs.querySelector('button.on')); });
          addEventListener('resize', function(){ setPill(tabs.querySelector('button.on')); });
        })();
        (function(){
          var fig = document.getElementById('qivis');
          if (!fig) return;
          var ticking = false;
          function upd(){
            ticking = false;
            var r = fig.getBoundingClientRect(), vh = innerHeight;
            var p = (vh - r.top) / (vh * 0.85);
            p = Math.max(0, Math.min(1, p));
            var base = Math.min(innerWidth * .88, 1160);
            var w = base + (innerWidth - base) * p;
            fig.style.width = w + 'px';
            fig.style.marginLeft = ((innerWidth - w) / 2 - (fig.parentElement.getBoundingClientRect().left)) + 'px';
            fig.style.borderRadius = (28 * (1 - p)) + 'px';
            var ovl = document.getElementById('qiovl');
            if (ovl) ovl.style.opacity = Math.min(1, p * 1.25);
          }
          function onS(){ if (!ticking) { ticking = true; requestAnimationFrame(upd); } }
          addEventListener('scroll', onS, {passive: true});
          addEventListener('resize', onS, {passive: true});
          upd();
        })();
      
;

(function(){
  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var compareShots = document.querySelectorAll('.mac-col .cmp-shot img');
  if (compareShots[0]) {
    compareShots[0].src = 'https://grantclassic.com/cdn/shop/files/c0a70a2fe589d8d17c4f4e71066f0d72_1800x.png';
    compareShots[0].alt = 'TITANSHIELD Air 極致輕薄行動電源';
  }

  /* 實測影片：雙層 YouTube 播放器輪替——介面彈出永遠發生在看不見的那一層 */
  var vTabs = [].slice.call(document.querySelectorAll('.vs-tab'));
  var vClips = [
    { label:'摔落實測', start:18, end:24, stamp:'00:18\u201300:24' },
    { label:'敲擊實測', start:24, end:32, stamp:'00:24\u201300:32' }
  ];
  var V_ID = 'onFuVqgYKbY';
  var V_START = 18, V_END = 32, V_PRE = 3.4;      /* 循環起訖；PRE＝暗中就位需要的秒數 */
  var V_LEAD = V_START - V_PRE;                    /* 提早起播點，到點時介面剛好淡完 */
  var vIds = ['yt-test-player', 'yt-test-player2'];
  var vP = [null, null];
  var vReadyN = 0;
  var vActive = 0;
  var vCur = -1;
  var vStarted = false;
  var vInView = false;
  var vRevealed = false;
  var vArmed = false;
  var vCover = document.getElementById('yt-test-cover');
  var vBadge = document.getElementById('yt-test-badge');
  function vEl(i){ return document.getElementById(vIds[i]); }
  function vPaint(i){
    if (i === vCur) return;
    vCur = i;
    vTabs.forEach(function(t, n){
      var on = n === vCur;
      t.classList.toggle('on', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      var bar = t.querySelector('.vs-prog i');
      if (bar && !on) bar.style.width = '';
    });
    vBadge.textContent = vClips[vCur].label + '\u30fb' + vClips[vCur].stamp;
  }
  var V_PRE_INIT = 5.2;                            /* 首次開場介面掛得比較久，多留餘裕 */
  var vRevealReady = false;
  function vBegin(){
    if (vStarted || !vP[0] || typeof vP[0].loadVideoById !== 'function') return;
    vStarted = true;
    vP[0].mute();
    vP[0].loadVideoById({ videoId:V_ID, startSeconds:V_START - V_PRE_INIT });
  }
  function vMaybeReveal(){
    if (vRevealed || !vRevealReady || !vInView) return;
    vRevealed = true;
    vCover.classList.add('is-hidden');
  }
  window.onYouTubeIframeAPIReady = function(){
    vIds.forEach(function(id, i){
      vP[i] = new YT.Player(id, {
        host:'https://www.youtube-nocookie.com',
        videoId:V_ID,
        playerVars:{ playsinline:1, rel:0, controls:0, iv_load_policy:3, disablekb:1, start:V_START },
        events:{
          onReady:function(e){
            e.target.mute();
            vReadyN++;
            if (i === 1) vEl(1).classList.add('yt-under');
            if (i === 0) vBegin();               /* 頁面載入就幕後起播，人到時零等待 */
          },
          onStateChange:function(e){
            if (i === 0 && !vRevealReady && e.data === YT.PlayerState.PLAYING){
              setTimeout(function(){ vRevealReady = true; vMaybeReveal(); }, V_PRE_INIT * 1000 - 200);
            }
          }
        }
      });
    });
  };
  if (vTabs.length){
    var ytApi = document.createElement('script');
    ytApi.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(ytApi);
    vTabs.forEach(function(t, i){
      t.addEventListener('click', function(){       /* 使用者自己點的跳段，介面短暫出現屬正常 */
        if (!vStarted){ vBegin(); return; }
        var a = vP[vActive];
        if (a && typeof a.seekTo === 'function'){ a.seekTo(vClips[i].start, true); a.playVideo(); }
        vArmed = false;
        vPaint(i);
      });
    });
    var vSection = document.getElementById('vidshow');
    if ('IntersectionObserver' in window && vSection){
      var vObserver = new IntersectionObserver(function(entries){
        vInView = entries[0].isIntersecting;
        if (vInView) vMaybeReveal();
      }, { threshold:.2, rootMargin:'0px 0px 0px 0px' });
      vObserver.observe(vSection);
    } else {
      vInView = true;
      vMaybeReveal();
    }
    setInterval(function(){
      if (!vStarted) return;
      var a = vP[vActive], b = vP[1 - vActive];
      if (!a || typeof a.getCurrentTime !== 'function') return;
      var t = a.getCurrentTime();
      if (t >= V_START - .3){
        var i = t < vClips[0].end ? 0 : 1;
        vPaint(i);
        var c = vClips[i];
        var bar = vTabs[i] && vTabs[i].querySelector('.vs-prog i');
        if (bar && vRevealed) bar.style.width = Math.max(0, Math.min(100, (t - c.start) / (c.end - c.start) * 100)) + '%';
      }
      /* 循環回頭：先讓底層暗中就位，到點瞬間換層——畫面上看不到任何介面 */
      if (!vArmed && b && typeof b.loadVideoById === 'function' && t >= V_END - V_PRE - .2 && t < V_END - .4){
        vArmed = true;
        b.mute();
        b.loadVideoById({ videoId:V_ID, startSeconds:V_LEAD });
      }
      if (t >= V_END - .06){
        if (vArmed && b){
          vEl(1 - vActive).classList.remove('yt-under');
          vEl(vActive).classList.add('yt-under');
          var old = a;
          setTimeout(function(){ if (old && typeof old.pauseVideo === 'function') old.pauseVideo(); }, 500);
          vActive = 1 - vActive;
          vArmed = false;
        } else {
          a.seekTo(V_START, true);                  /* 後備：底層沒備好就原地跳（極少發生） */
        }
      }
    }, 120);
    vPaint(0);
  }

  /* 電芯受刺動畫：捲動固定，進度直接控制畫面 */
  var cellviz = document.getElementById('cellviz');
  if (cellviz){
    var cellScroll = document.getElementById('cellscroll');
    var cellBtns = [].slice.call(cellviz.querySelectorAll('.seg-in button'));
    var cellCap = document.getElementById('cellcap');
    var cellKicker = document.getElementById('cellkicker');
    var cellNail = cellviz.querySelector('.cv-nail');
    var cellDends = [].slice.call(cellviz.querySelectorAll('.cv-dend path'));
    var cellSpark = cellviz.querySelector('.cv-spark');
    var cellSpread = cellviz.querySelector('.cv-spread');
    var cellRings = [].slice.call(cellviz.querySelectorAll('.cv-ring-danger'));
    var cellReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var cellMode = -1;
    var cellTicking = false;
    function clamp01(n){ return Math.max(0, Math.min(1, n)); }
    function range(n, a, b){ return clamp01((n - a) / (b - a)); }
    function cellSet(i, restart){
      if (i === cellMode && !restart) return;
      cellMode = i;
      cellBtns.forEach(function(x){ x.classList.remove('on'); x.setAttribute('aria-selected', 'false'); });
      var b = cellBtns[i];
      b.classList.add('on'); b.setAttribute('aria-selected', 'true');
      cellviz.classList.toggle('mode-liquid', i === 1);
      cellCap.textContent = b.dataset.cap;
      cellKicker.textContent = i === 1 ? '一般液態電芯' : '準固態電芯';
    }
    function cellRender(){
      cellTicking = false;
      if (cellReduced || !cellScroll) return;
      var r = cellScroll.getBoundingClientRect();
      var pinTop = window.innerWidth <= 760 ? 48 : 52;
      var travel = Math.max(1, cellScroll.offsetHeight - (window.innerHeight - pinTop));
      var progress = clamp01((pinTop - r.top) / travel);
      var liquid = progress >= .36;
      cellSet(liquid ? 1 : 0, false);

      var nailP = liquid ? range(progress, .36, .48) : range(progress, .05, .20);
      cellNail.style.transform = 'translateY(' + (-52 + 52 * nailP) + 'px)';

      var dendP = range(progress, .46, .68);
      cellDends.forEach(function(path, i){
        var local = clamp01(dendP * 1.35 - i * .11);
        path.style.strokeDashoffset = String(70 * (1 - local));
      });
      var spreadP = range(progress, .64, .92);
      cellSpread.style.transform = 'scale(' + spreadP + ')';
      cellSpread.style.opacity = String(.18 + spreadP * .72);
      var sparkP = range(progress, .60, .78);
      var pulse = sparkP > 0 && sparkP < 1 ? Math.abs(Math.sin(sparkP * Math.PI * 4)) : 0;
      cellSpark.style.opacity = String(pulse);
      cellSpark.style.transform = 'scale(' + (.45 + pulse * .85) + ')';
      cellRings.forEach(function(ring, i){
        var rp = range(progress, .69 + i * .05, .98);
        ring.style.transform = 'scale(' + (.2 + rp * .8) + ')';
        ring.style.opacity = String(Math.max(0, .75 - rp * .75));
      });
      var solidBar = cellBtns[0].querySelector('.vs-prog i');
      var liquidBar = cellBtns[1].querySelector('.vs-prog i');
      if (solidBar) solidBar.style.width = (clamp01(progress / .36) * 100) + '%';
      if (liquidBar) liquidBar.style.width = (range(progress, .36, 1) * 100) + '%';
    }
    function cellRequest(){
      if (!cellTicking){ cellTicking = true; requestAnimationFrame(cellRender); }
    }
    cellBtns.forEach(function(b, i){
      b.addEventListener('click', function(){
        if (cellReduced){ cellSet(i, true); return; }
        var top = window.scrollY + cellScroll.getBoundingClientRect().top - (window.innerWidth <= 760 ? 48 : 52);
        var travel = Math.max(1, cellScroll.offsetHeight - (window.innerHeight - (window.innerWidth <= 760 ? 48 : 52)));
        window.scrollTo({ top: top + travel * (i === 0 ? .08 : .46), behavior: 'smooth' });
      });
    });
    if (cellReduced){ cellSet(0, true); }
    else {
      window.addEventListener('scroll', cellRequest, { passive:true });
      window.addEventListener('resize', cellRequest);
      cellRequest();
    }
  }

  var stage = null;
  var sceneFrames = [].slice.call(document.querySelectorAll('.scene:not(.scene-immersive) .scene-frame'));
  var nightScene = document.getElementById('nightscene');
  var nightFrame = nightScene ? nightScene.querySelector('.scene-frame') : null;
  /* 橋段：黑轉白 */
  var bridge = document.getElementById('bridge');
  var bg = document.getElementById('bridgebg');
  var b1 = document.getElementById('b1'), b2 = document.getElementById('b2');
  var bridgeLight = document.getElementById('bridge-light');
  var bridgeWhite = document.getElementById('bridge-white');
  var bridgeCopy = document.getElementById('bridge-copy');
  var topbar = document.querySelector('.topbar');
  function lerp(a, b, t){ return a + (b - a) * t; }
  function smoothstep(a, b, t){
    var x = Math.min(1, Math.max(0, (t - a) / Math.max(.0001, b - a)));
    return x * x * (3 - 2 * x);
  }
  var spyLinks = [].slice.call(document.querySelectorAll('.spy a'));
  var spyTargets = spyLinks.map(function(a){ return document.getElementById(a.dataset.spy); });
  var ticking = false;
  function onScroll(){
    if (ticking) return; ticking = true;
    requestAnimationFrame(function(){
      ticking = false;
      var vh = innerHeight;
      /* 頂欄錨點跟著捲動亮 */
      var active = -1;
      spyTargets.forEach(function(t, i){
        if (t && t.getBoundingClientRect().top <= vh * 0.5) active = i;
      });
      spyLinks.forEach(function(a, i){ a.classList.toggle('on', i === active); });
      if (stage && !reduced){
        var r = stage.getBoundingClientRect();
        var p = Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.9)));
        var s = 0.88 + 0.12 * p;
        stage.style.transform = 'scale(' + s.toFixed(3) + ')';
        stage.style.borderRadius = (28 - 14 * p).toFixed(1) + 'px';
      }
      /* 深夜情境：保留小卡片進場；捲動到終點時鋪滿導覽列下方，不留下過渡色塊 */
      if (nightScene && nightFrame){
        var navH = 52;
        var nr = nightScene.getBoundingClientRect();
        var stickyH = Math.max(1, vh - navH);
        var travel = Math.max(1, nightScene.offsetHeight - stickyH);
        var np = reduced ? 1 : Math.min(1, Math.max(0, -nr.top / travel));
        var ne = smoothstep(0, .88, np);
        var sideInset = innerWidth <= 760 ? 32 : 96;
        var startW = Math.min(Math.max(280, innerWidth - sideInset), 1320);
        var startGap = innerWidth <= 760 ? 28 : Math.min(76, Math.max(38, vh * .07));
        var startH = Math.min(startW * 9 / 16, stickyH - startGap - (innerWidth <= 760 ? 24 : 36));
        nightFrame.style.width = lerp(startW, innerWidth, ne).toFixed(1) + 'px';
        nightFrame.style.height = lerp(startH, stickyH, ne).toFixed(1) + 'px';
        nightFrame.style.marginTop = lerp(startGap, 0, ne).toFixed(1) + 'px';
        nightFrame.style.borderRadius = lerp(28, 0, ne).toFixed(1) + 'px';
        var nt = nightFrame.querySelector('.scene-title');
        if (nt){
          var nop = smoothstep(.42, .82, np);
          nt.style.opacity = nop.toFixed(2);
          nt.style.transform = 'translateY(' + (18 * (1 - nop)).toFixed(1) + 'px)';
        }
      }
      /* 情境照：捲入漸放大到滿版出血（動真實寬度，上下內容跟著讓位不重疊） */
      if (!reduced) sceneFrames.forEach(function(f){
        var fr = f.getBoundingClientRect();
        if (fr.bottom < -120 || fr.top > vh + 120) return;
        var base = f.parentElement.clientWidth - 48;
        if (base <= 0) return;
        var fp = Math.min(1, Math.max(0, (vh - fr.top) / (vh * 0.95)));
        var w = 0.88 * base + (innerWidth - 0.88 * base) * fp;
        f.style.width = w.toFixed(1) + 'px';
        f.style.marginLeft = ((base - w) / 2).toFixed(1) + 'px';
        f.style.borderRadius = Math.max(0, 28 * (1 - fp)).toFixed(1) + 'px';
        var st = f.querySelector('.scene-title');
        if (st){
          var op = Math.min(1, Math.max(0, (fp - 0.45) / 0.45));
          st.style.opacity = op.toFixed(2);
          st.style.transform = 'translateY(' + (16 * (1 - op)).toFixed(1) + 'px)';
        }
      });
      if (bridge){
        var br = bridge.getBoundingClientRect();
        var total = br.height - vh;
        var t = Math.min(1, Math.max(0, -br.top / total));
        var glowIn = smoothstep(.03, .5, t);
        var whiteIn = smoothstep(.62, .94, t);
        var textDark = smoothstep(.72, .9, t);
        var lineTwo = .08 + .92 * smoothstep(.18, .46, t);
        var lightScale = lerp(.86, 2.18, smoothstep(.06, .8, t));
        var lightRise = lerp(18, -5, smoothstep(.04, .76, t));
        var lightBrightness = lerp(.82, 1.48, smoothstep(.12, .72, t));
        var textRgb = Math.round(lerp(245, 29, textDark));
        bg.style.background = '#050506';
        if (bridgeLight){
          bridgeLight.style.opacity = glowIn.toFixed(3);
          bridgeLight.style.transform = 'translate3d(0,' + lightRise.toFixed(2) + '%,0) scale(' + lightScale.toFixed(3) + ')';
          bridgeLight.style.filter = 'brightness(' + lightBrightness.toFixed(3) + ') saturate(' + lerp(1.08, 1.26, glowIn).toFixed(3) + ')';
        }
        if (bridgeWhite) bridgeWhite.style.opacity = whiteIn.toFixed(3);
        if (topbar) topbar.classList.toggle('bridge-light-nav', t >= .84 || br.bottom < vh * .16);
        if (bridgeCopy) bridgeCopy.style.transform = 'translate3d(0,' + lerp(2, -1.5, smoothstep(.08, .76, t)).toFixed(2) + 'vh,0)';
        b1.style.opacity = '1';
        b2.style.opacity = lineTwo.toFixed(3);
        b1.style.color = 'rgb(' + textRgb + ',' + textRgb + ',' + Math.max(27, textRgb - 2) + ')';
        b2.style.color = b1.style.color;
        b1.style.textShadow = textDark > .5 ? 'none' : '0 8px 42px rgba(0,0,0,.16)';
        b2.style.textShadow = b1.style.textShadow;
      }
    });
  }
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll, { passive: true });
  onScroll();

  /* 警鈴 */
  var abtn = document.getElementById('alarmbtn');
  var asec = document.getElementById('alarmsec');
  var actx = null;
  var alarmSoundingTimer = 0;
  function updateAlarmScroll(){
    if (!asec) return;
    if (reduced){
      asec.style.setProperty('--alarm-rise', 1);
      asec.style.setProperty('--alarm-front', 1);
      asec.style.setProperty('--alarm-lay', .55);
      asec.style.setProperty('--alarm-depth', 1);
      asec.style.setProperty('--alarm-wave', 1);
      asec.style.setProperty('--alarm-enter-o', 0);
      asec.style.setProperty('--alarm-front-o', .45);
      asec.style.setProperty('--alarm-lay-o', .55);
      asec.classList.add('sounding');
      return;
    }
    var rect = asec.getBoundingClientRect();
    var travel = Math.max(1, rect.height - innerHeight);
    var progress = Math.min(1, Math.max(0, -rect.top / travel));
    var rise = Math.min(1, progress / .24);
    var front = Math.min(1, Math.max(0, (progress - .25) / .10));
    var lay = Math.min(1, Math.max(0, (progress - .58) / .34));
    var depth = lay >= .48 ? 1 : 0;
    var wave = Math.min(1, Math.max(0, (progress - .68) / .20));
    var enterOpacity = 1 - front;
    var frontOpacity = front * (1 - lay);
    var layOpacity = lay;
    asec.style.setProperty('--alarm-rise', rise.toFixed(3));
    asec.style.setProperty('--alarm-front', front.toFixed(3));
    asec.style.setProperty('--alarm-lay', lay.toFixed(3));
    asec.style.setProperty('--alarm-depth', depth.toFixed(3));
    asec.style.setProperty('--alarm-wave', wave.toFixed(3));
    asec.style.setProperty('--alarm-enter-o', enterOpacity.toFixed(3));
    asec.style.setProperty('--alarm-front-o', frontOpacity.toFixed(3));
    asec.style.setProperty('--alarm-lay-o', layOpacity.toFixed(3));
    asec.classList.toggle('sounding', wave > .08);
  }
  addEventListener('scroll', updateAlarmScroll, { passive:true });
  addEventListener('resize', updateAlarmScroll, { passive:true });
  updateAlarmScroll();
  function beep(t0, dur, f){
    var o = actx.createOscillator(), g = actx.createGain();
    o.type = 'square'; o.frequency.value = f;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(0.12, t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g); g.connect(actx.destination);
    o.start(t0); o.stop(t0 + dur + 0.02);
  }
  abtn.addEventListener('click', function(){
    try{
      if (!actx) actx = new (window.AudioContext || window.webkitAudioContext)();
      if (actx.state === 'suspended') actx.resume();      /* Safari：手勢裡不喚醒就永遠無聲 */
      var t = actx.currentTime;
      for (var i = 0; i < 6; i++) beep(t + i * 0.22, 0.12, i % 2 ? 2350 : 2800);
    }catch(e){}
    asec.classList.add('alarming');
    clearTimeout(alarmSoundingTimer);
    alarmSoundingTimer = setTimeout(function(){ asec.classList.remove('alarming'); }, 2200);
  });

  /* TFT 圈圈進場動畫 */
  var screen = document.getElementById('tftscreen');
  var played = false;
  function playDials(){
    if (played) return; played = true;
    [].forEach.call(screen.querySelectorAll('.arc'), function(a){
      var p = parseFloat(a.dataset.p);
      a.style.transition = reduced ? 'none' : 'stroke-dashoffset 2.6s cubic-bezier(.25,.7,.3,1)';
      requestAnimationFrame(function(){ a.style.strokeDashoffset = 264 * (1 - p); });
    });
    [].forEach.call(screen.querySelectorAll('.cnt'), function(el){
      var to = +el.dataset.to;
      if (reduced){ el.textContent = to; return; }
      var st = null;
      function step(ts){
        if (!st) st = ts;
        var k = Math.min(1, (ts - st) / 2400);
        el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3)));
        if (k < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }
  new IntersectionObserver(function(es){
    es.forEach(function(e){ if (e.isIntersecting) playDials(); });
  }, { threshold: 0.4 }).observe(screen);

  /* 充電曲線與次數表：進場才播 */
  [['chgchart', 0.35], ['times', 0.2], ['hbars', 0.3]].forEach(function(pair){
    var el = document.getElementById(pair[0]);
    if (!el) return;
    if (reduced){ el.classList.add('play'); return; }
    new IntersectionObserver(function(es, ob){
      es.forEach(function(e){ if (e.isIntersecting){ el.classList.add('play'); ob.disconnect(); } });
    }, { threshold: pair[1] }).observe(el);
  });

  /* 散熱材料趨勢：三條線在進入視窗時依序展開 */
  var thermalChart = document.querySelector('.thermal-chart');
  if (thermalChart){
    if (reduced){
      thermalChart.classList.add('is-visible');
    } else {
      new IntersectionObserver(function(entries, observer){
        entries.forEach(function(entry){
          if (entry.isIntersecting){
            thermalChart.classList.add('is-visible');
            observer.disconnect();
          }
        });
      }, { threshold: 0.28 }).observe(thermalChart);
    }
  }

  /* 六重防護：頁籤換觸發曲線（Air 同款） */
  var PROT = [
    {y:'電壓', dash:92,  d:'M50,260 C150,230 250,160 310,92 L316,92 L316,235 L440,235', dot:[313,92],  cap:'電壓一越線，輸出當場切斷。'},
    {y:'溫度', dash:120, d:'M50,275 C160,250 260,190 320,120 C370,140 410,152 440,158', dot:[320,120], cap:'溫度越線不斷充——先降載，降溫後再恢復。'},
    {y:'電流', dash:95,  d:'M50,270 C160,230 240,150 300,95 L440,95',                   dot:[300,95],  cap:'輸出異常，自動限流，守在安全線上。'},
    {y:'電量', dash:90,  d:'M50,280 C150,240 230,150 300,95 L310,90 L440,90',           dot:[310,90],  cap:'充到滿就停在滿，不硬灌、不涓流虐待電芯。'},
    {y:'電流', dash:null,d:'M50,250 L280,248 L292,60 L300,60 L306,270 L440,270',        dot:[296,60],  cap:'瞬間斷路，保住整顆電芯。'},
    {y:'功率', dash:null,d:'M50,240 C150,215 230,190 300,180 L310,182 L318,265 L440,268',dot:[312,182],cap:'偵測到鑰匙、硬幣等金屬異物，立刻停止輸出。'}
  ];
  var protTabs = [].slice.call(document.querySelectorAll('.prot-tabs button'));
  var protChart = document.getElementById('protchart');
  if (protChart){
    var pLine = document.getElementById('protLine'), pDot = document.getElementById('protDot');
    var pDash = document.getElementById('protDash'), pY = document.getElementById('protYlab');
    var pCap = document.getElementById('protCap');
    var protRun = 0, protActive = -1, protDotLength = 0;
    var protSection = document.getElementById('protection');
    function protMeasure(){
      var L = pLine.getTotalLength();
      pLine.style.strokeDasharray = L;
      var tx = +pDot.getAttribute('cx'), ty = +pDot.getAttribute('cy');
      var Ld = L, best = Infinity;
      for (var l = 0; l <= L; l += L / 240){
        var pt = pLine.getPointAtLength(l);
        var d = (pt.x - tx) * (pt.x - tx) + (pt.y - ty) * (pt.y - ty);
        if (d < best){ best = d; Ld = l; }
      }
      protDotLength = Ld;
      return L;
    }
    function protState(i){
      i = Math.max(0, Math.min(PROT.length - 1, i));
      protActive = i;
      protTabs.forEach(function(x, n){
        var on = n === i;
        x.classList.toggle('on', on);
        x.setAttribute('aria-selected', on ? 'true' : 'false');
        if (on && innerWidth <= 760){
          var tabsBox = x.parentElement;
          tabsBox.scrollTo({left:x.offsetLeft - tabsBox.clientWidth / 2 + x.offsetWidth / 2, behavior:'smooth'});
        }
      });
      var p = PROT[i];
      pLine.setAttribute('d', p.d);
      pDot.setAttribute('cx', p.dot[0]); pDot.setAttribute('cy', p.dot[1]);
      pY.textContent = p.y;
      pCap.textContent = p.cap;
      if (p.dash === null){ pDash.style.display = 'none'; }
      else { pDash.style.display = ''; pDash.setAttribute('y1', p.dash); pDash.setAttribute('y2', p.dash); }
      protMeasure();
    }
    function protDraw(){
      var my = ++protRun;
      var L = protMeasure();
      pDot.style.opacity = 0;
      if (reduced){ pLine.style.strokeDashoffset = 0; pDot.style.opacity = 1; return; }
      pLine.style.strokeDashoffset = L;
      var dur = 1800, t0 = null;
      function step(ts){
        if (my !== protRun) return;
        if (!t0) t0 = ts;
        var k = Math.min(1, (ts - t0) / dur);
        var p = 1 - Math.pow(1 - k, 2.1);
        pLine.style.strokeDashoffset = L * (1 - p);
        if (p * L >= protDotLength - 0.5) pDot.style.opacity = 1;
        if (k < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
    protTabs.forEach(function(t, i){
      t.addEventListener('click', function(){
        protState(i);
        protDraw();
      });
    });
    function updateProtectionScroll(){
      if (!protSection) return;
      var rect = protSection.getBoundingClientRect();
      var travel = Math.max(1, rect.height - innerHeight);
      var progress = Math.min(1, Math.max(0, -rect.top / travel));
      var raw = progress * PROT.length;
      var i = Math.min(PROT.length - 1, Math.floor(raw));
      var local = i === PROT.length - 1 && progress === 1 ? 1 : raw - i;
      /* 每一段的前 50% 就完成曲線，視覺速度約為原本兩倍。 */
      var draw = Math.min(1, Math.max(0, local * 2));
      if (i !== protActive) protState(i);
      ++protRun;
      var L = pLine.getTotalLength();
      pLine.style.strokeDasharray = L;
      pLine.style.strokeDashoffset = L * (1 - draw);
      pDot.style.opacity = draw * L >= protDotLength - .5 ? 1 : 0;
    }
    addEventListener('scroll', updateProtectionScroll, {passive:true});
    addEventListener('resize', updateProtectionScroll, {passive:true});
    protState(0);
    updateProtectionScroll();
  }

  /* 顏色切換 */
  var swB = document.getElementById('sw-black'), swS = document.getElementById('sw-silver');
  var imB = document.getElementById('img-black'), imS = document.getElementById('img-silver');
  var cname = document.getElementById('colorname');
  function color(which){
    var black = which === 'b';
    imB.classList.toggle('hide', !black);
    imS.classList.toggle('hide', black);
    swB.classList.toggle('on', black);
    swS.classList.toggle('on', !black);
    cname.textContent = black ? '石墨黑' : '極地銀';
  }
  swB.addEventListener('click', function(){ color('b'); });
  swS.addEventListener('click', function(){ color('s'); });

  /* 購買區選色與假按鈕 */
  var opts = [].slice.call(document.querySelectorAll('.opt'));
  var vidInput = document.getElementById('tsp-vid');
  opts.forEach(function(o){
    o.addEventListener('click', function(){
      opts.forEach(function(x){ x.classList.remove('on'); });
      o.classList.add('on');
      if (vidInput && o.dataset.vid) vidInput.value = o.dataset.vid;
    });
  });

  /* ═══ 視窗破壞器（hero）═══ */
  (function(){
    var hero = document.getElementById('hero');
    var cv = document.getElementById('wreck');
    if (!hero || !cv) return;
    var g = cv.getContext('2d');
    var prod = document.getElementById('heroprod');
    var pimg = document.getElementById('heroprodimg');
    if (pimg) pimg.src = (window.TSP_ASSET_BASE || '') + 'tsp-hero-titanshield-pro-black.webp';
    var dpr = Math.min(2, window.devicePixelRatio || 1);
    function fit(){
      var r = hero.getBoundingClientRect();
      cv.width = Math.round(r.width * dpr);
      cv.height = Math.round(r.height * dpr);
      cv.style.width = r.width + 'px';
      cv.style.height = r.height + 'px';
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    var fx = document.getElementById('wreckfx');
    var gx = fx.getContext('2d');
    function fitFx(){
      fx.width = cv.width; fx.height = cv.height;
      fx.style.width = cv.style.width; fx.style.height = cv.style.height;
      gx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    fit(); fitFx();
    addEventListener('resize', function(){ fit(); fitFx(); });

    /* ── 火焰粒子系統 ── */
    var parts = [], patches = [], fxOn = false, flameFiring = false;
    function spawn(x, y, vy, r){
      parts.push({ x: x, y: y, vx: (Math.random() - 0.5) * 1.4, vy: vy, r: r,
        life: 0, max: 22 + Math.random() * 20 });
    }
    function spawnSparks(x, y){
      for (var i = 0; i < 7; i++){
        parts.push({ t: 's', x: x, y: y, vx: (Math.random() - 0.5) * 7,
          vy: -1 - Math.random() * 4, r: 1, life: 0, max: 9 + Math.random() * 8 });
      }
      fxStart();
    }
    function fxLoop(){
      var W = fx.width / dpr, H = fx.height / dpr;
      gx.clearRect(0, 0, W, H);
      var now = performance.now();
      if (flameFiring){
        var q = pt();
        for (var i = 0; i < 4; i++) spawn(q.x + (Math.random() - 0.5) * 18, q.y + (Math.random() - 0.5) * 10, -(1.6 + Math.random() * 2.2), 6 + Math.random() * 8);
      }
      patches = patches.filter(function(pc){ return pc.until > now; });
      patches.forEach(function(pc){
        var k = (pc.until - now) / pc.dur;
        var n = k > 0.35 ? 3 : 1;
        for (var i = 0; i < n; i++) spawn(pc.x + (Math.random() - 0.5) * 44, pc.y + (Math.random() - 0.5) * 10, -(0.9 + Math.random() * 1.8) * (0.4 + k), (4 + Math.random() * 9) * (0.5 + k));
      });
      gx.globalCompositeOperation = 'lighter';
      parts = parts.filter(function(pp){ return pp.life < pp.max; });
      parts.forEach(function(pp){
        if (pp.t === 's'){
          var ox0 = pp.x, oy0 = pp.y;
          pp.life++; pp.vy += 0.5; pp.x += pp.vx; pp.y += pp.vy;
          var kk = 1 - pp.life / pp.max;
          gx.strokeStyle = 'rgba(255,225,140,' + (0.9 * kk) + ')';
          gx.lineWidth = 1.6;
          gx.beginPath(); gx.moveTo(ox0, oy0); gx.lineTo(pp.x, pp.y); gx.stroke();
          return;
        }
        pp.life++; pp.x += pp.vx + Math.sin((pp.life + pp.y) * 0.3) * 0.6; pp.y += pp.vy;
        var k = 1 - pp.life / pp.max;
        var r = pp.r * (0.4 + k * 0.8);
        var grad = gx.createRadialGradient(pp.x, pp.y, 0, pp.x, pp.y, r);
        if (k > 0.6){ grad.addColorStop(0, 'rgba(255,235,150,' + (0.85 * k) + ')'); grad.addColorStop(0.5, 'rgba(255,150,30,' + (0.6 * k) + ')'); }
        else { grad.addColorStop(0, 'rgba(255,120,20,' + (0.6 * k) + ')'); grad.addColorStop(0.5, 'rgba(200,50,10,' + (0.4 * k) + ')'); }
        grad.addColorStop(1, 'rgba(120,20,0,0)');
        gx.fillStyle = grad;
        gx.beginPath(); gx.arc(pp.x, pp.y, r, 0, 7); gx.fill();
      });
      gx.globalCompositeOperation = 'source-over';
      if (parts.length || patches.length || flameFiring){ requestAnimationFrame(fxLoop); }
      else { fxOn = false; gx.clearRect(0, 0, W, H); }
    }
    function fxStart(){ if (!fxOn){ fxOn = true; requestAnimationFrame(fxLoop); } }

    var WEAP = {
      gun:    { html: '<div class="akwrap"><span class="akflash"><svg viewBox="0 0 80 80"><defs><radialGradient id="akmf" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff7cc"/><stop offset=".35" stop-color="#ffd60a"/><stop offset=".75" stop-color="rgba(255,120,10,.75)"/><stop offset="1" stop-color="rgba(255,120,10,0)"/></radialGradient></defs><circle cx="40" cy="40" r="38" fill="url(#akmf)"/><polygon points="40,4 47,28 72,16 52,40 72,64 47,52 40,76 33,52 8,64 28,40 8,16 33,28" fill="#ffd60a" stroke="#e8890c" stroke-width="1.4" opacity=".95"/></svg></span><img class="akmain" aria-hidden="true" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAb0AAAETCAYAAACiONjaAAGZlElEQVR42uy9Z2zbaZbuWc5JOeccqJxJiiIlioqURFEUSYmSSIpBJEXlHKwsy7Yc5HKOVXYFV1J1pa6uzj3V0z3j6Z5p7GKx915czGAWWGMX2BlgvuwOMJhPz573pewOt3v63rsB4673AQ7+TCIl0v7/+Jz3nPO+9pqQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkNA3TffuPUh6+8lbe7vnz5s/+fTzpN+9//NPP0m6en7H/PnHH8nFuyUkJCQk9Mrq1q1bSdevvY77N15HjUz6/OHDx/8F9N56682kGlk5OlsasDg3tyfeNSEhISGhV1L379x59ubdG/A5bZibnjX/occZdNr90rwsNNTV4u69u0ninRMSEhISeqX09Y9+kHRn7xI+f+cBpBXlz/6tx7oGB8z18nJoamTo7NRPi3dPSEhISOiV0hv375rnRoZwbmEcel3n/m/e98Xnn8h//uc/feno7t+9bTa0aKBrqkODpmFfvHtCQkJCQq+Url/fM/d1dcCia0GnTvdbIOtqa0antvVluvPs4ty0zaiHRa9FY0OjgJ6QkJCQ0KulLz7/LMnY3gpDawOBrOG30pvaehVGPEMvi1Y8zsFnFgJkT1c7mpuaRXpTSEhISOjVk72v55m+qR5KuQwXLu7ydOYbD+/LywvzYDF1cxDOTk9Nd7Q0oc/QCbm0Cg/uvyFaF4SEhISEXj2tnl2W1yukqJVVQKfTPb9w4eJ0gSQH2amJKMjJRHtL835pYQFqZDLodR0wmnqfiXdNSEhISOjVdXu9RmiqK9Bcp0RmZjbioiMRERaM0KAzCA0ORnhYOGQyKRTKOty4eU+0KwgJCQkJvboytDdDW1uNKc8goqLjCHJhSExMQkpKKtLT0ykykJGWBpvdCfFuCQkJCQm9svrFL/5S3lynQHONFJMEvZjYBISEhCA6KgrR0TGIjYlBfGwMJFkZaGpsFqlNISEhIaFXV1//+Afm+upKNCmqMD/iQnxCMsJCwwh40YihYNCLo8jNTEdRYbFoVRASEhISenX1nc++Ze5sVsNvt2B3dRaJSSk8vRkVGYnIyAhERkTw66lJCdDpDM/FOyYkJCQk9Mrqvbce80kr7n4TpoasSEvL4JCLiAxHWFgoub4QBAUFITE+DiZzn1jTExISEhJ6dXXl4jlzb6cWFUUSLPgdBL1MhASHIDw8jOAXysEXHByE2OhoGE0WAT0hISEhoVdX85OjZotOi/ysNJwdcyMpKQ2nT59GSEgwd3kRB/DLzcpEr2VAQE9ISEhI6NWVx95v7ienl5ESj80pH3d6HHrk7sLDQhAZEcbBV5ifB0ufgJ6QkJCQ0CusnbWzey01UqQnxWFrdpjgVkiQC0dkeCiiIsIRHRW4XFKQhy6DSUBPSEhISOjV1cbS/H5XsxqKyhKsTAyhtKQMyQmJiGQujyIiNBhhIUHQtzWjqVkroCckJCQk9OpqcWZi39TRio6meswOO5Cflw+JJB/FxcXIy8tDYUE+KsrKIMmVQKlSC+gJCQkJCb26mh7z7RsJeu1Nasz67MjKzEJCYgqSk1P5GLKUlDSKdKSlpqO6WimgJyQkJCT06mrS797vamtCl7YRE85epKWkIDomDnHxiQS/ZCQlpSCRjqkEPYWAnpCQkJDQqyyvo38/MjwcIUFBsHW1ICsjHbFx8YhPSOLAY06PAS87OxcKhUJAT0hISEjo1ZW5U7vPms+PHT0CU5sGebkSPoosOTkNyRx4aUhPz0SeJA9SqVRAT0hISEjo1VVPV8ezUydP4PixYzC01EFaUY7MrBzu7gKRxkeT5UnyUVhY+P8Ieg/u3zef29ic3rt8Zf/qpSt73/rwI7E3n5CQkJDQ/3/y2Ptx6sQJiuPoIug11Kl49WZmZhaHHQMfS3FmZWby+O95jYsXLuwtzC9g2OvF8NAQfO4huO2D8LhcmJ2efnb7xs3pX/3N3wgACgkJCQn9fyuX1YKw4NMIp9DWK9CkqUdefiEyMjIJegG3xyo509PSeTXnf8tzv/3WW0lLC4vPR4aHOfCGnC44bHbY+gdgtfRhwGIh8LnhHfJiYXYeXrdnf3x0fH9+bm7602/ty//Q8/74pz9Pml5eN88vLO+PO2z7F5fmnt/aPIs7q/PP782M7r91fnP/0we39/76Rz8wi09YSEhISOilBvtMiAoLpghCR6MKHa1NyM6RIC094yXwkgl2DIBpaf9t0Ltwbvv5/Mw0xkb88LjdcDkcGLTZOPRsff0chA67Az0mE9wOJ8b8fgLfEHqMJrS3ajE6MjL9m8+3urEp9w4PP3OY9Fgyt+HRcD8+mhnCR7Mefnw6Nog3h2247RvE6147Xvc5cXt2DE/ObTx/98qF/f17t8z/4ZfPhKMUEhIS+qbKajYgPOQ0IsPOoLW+Bl0dWmRk5nDQJSWn8ArOFwUtDIS/+MWv/qvc04Nb1/eu757D+Y1VrCwtYmpiAszxDZGzG/Z4MT05iX5yerqWZnRpm+GwmDDicmB82AufywX3oA2ewUGM+3zPrpy/uO/3jz4b1Gtxvb8Nb9ja8a5Tj31fD741OoAPR2147O3Hw6E+PPD0457XilseK657bLg2ZMOedxBXPHZcorg+6cfTy+fxzu7O/ueP7k7/x2c/k4t/BUJCQkLfEHU21+PUiaMIDToJWWkB2pobkJKWwSs4WX8eP/LWhVSe8vzp1z/7o9B7+tabSQ9ev4I7Vy7g2u4OLmyuY+PsMlYX57E0O4OJsTHYrVY0aDTo7zHBZu5GX3cnejrb0KPTYrC3G+NDDkz7hjDjHcK4046L1i58PtSJDxzteG+wA+8O6vCWowtPnQZ87DbhsdOIh04zngz14oGrFzedFtwaGsDdYTtu+sj1eW24MezA3XEP7ox7cWvCxyF43m3Fw9UF3F9b3n/32p757//TfxBOUEhISOhPVfO+QaQlJyA6PAQqaTlaG9Tk8NJ4n15CYtIB+JIJeFnIysrBd7/7x9fJLmyu7l3dWsHN3S3cv7aL25d2cP3CNi5vb2B75SxmJiZ5utPS0wuz0QRzdzcGeswYJLdnMegIgHpYTQYs+Icx4Xbgia+Pu7p3nF1406rDe/YOfOjoxIfk9lg8selxw6LDg0EjgdCIfQ85wJF+fDRqxfsjVu7+bpMLvHvgAu8QBK/7HLjideCcy4pdAt8Neh8YHB/NjeP93e3nT3bP7339xediTVBISEjoT0V/9Zc/T9IoZBjo7oDV3AlDcx20jWqkpKbzaSzM4SUR8FIOevUyMjPx/vsf/lEQrC3MPJ/1u7G5MAUGv9uXtnHjwgYe397Dte0V7J3fwvLcLPxeHwbtdgz09aGvpwe9JiMsRgPsfb1Ym53E+twknk458L1ZBz7y9+MJc3QOAz5xdeJjl46cnwFfervxyVA3ngwacLW3A7cH9HhkN+BDAt9TtxnvuEz4yGvG+xQPnCZc7Dfgss2E6+QEr7v6ccU9wKF3lQB4c8SN22NeXCcneN4/hBWXHVdnp3Blcnz/6bUr0//5f/wbkQoVEhISehW1vLg07XO7n1eVFEKtkPKor65AW1M90ghwbE3vxboeK2hh7QuJ5Px2zl34o9Cbm/DDaTHAa7NgbtRD8JvEhdUFvL6zilF7D/wEnd21eVy7eA7LC3MYJUfHqjot5h70GLsxPTaMc2cXcNPbj69mnfj2jBvvjzvwkFwaS1++4+7GF14jvk3A23cZ8MCqx83+Llyz6HG3vxP36fqtvk7c6tfzeEjX3yIovuciOBIEb9m6cbHPgIsDRlxz9OG218bX/Lbdg1ihWPW4sOZ189jyunBhmADusmGbQHhnfeX546uX9r/9zlvCBQoJCQn9e9f9u3eT1s8uPx/zDsHZ34s6WSUaVdUEvSrUs1DKkZmVTc4u42XbAgMe69WLiYlDf5/1j57sJ4eHYDfr0avXop9cpI0uewiAXoKMWVuP0rxMSItz0dvRxN3g7tYqFqen4HE6MTzkxuVzG5iydOHzaRfeHxvEewS8xyN2PPFZ8TaB8KnXgg+9vbhD8Lo/aMSdQRNuWAlgA93YIye319uJN2xdeJPiWq8OF00deEyXPyTofeQ24n2XkVygCW+RE7w52IN7QwMEVDuuk+O7QnHROYDNwX5sOqzYclmx7RrAzpAdW0ODOEcA3PF7KMgRLi3gzfNbz773zuO9//V/+h+ECxQSEhL696Ybly8831yYxty4Hx67FWPkagZMXWjTqKBVV6O8qABZBL3MzEwOPQY7tqYXF5eA8PBISKWyPwo9e5/pmd3UiY6mOjSrFWisreYDrXvaG6Crl6MoJ52DLz0hBnVVxTBqNZj2OnB+ZREbi/OYcPbhB4sefEEOj4Hvk0kn3h+x4eMxOz7yW7E/PIB3yPG94bbgms2MC9YenB8wY7ffhKv9Rtwl+L1hNRD4DHhCcZMgeIcc37uD7HoX7pMLfGDtwht2uu404ZHDjHc8/Xjk6sU9Rw8eOnv55Tt0+SbFHl2/4OjFNXKE1/0Ocn4u7Ix4cX7MjwvjLIZxeXIE9zZXnn/84N7+f/zVX03/v/V5/e3/LGAqJCQk9N+lBzeu7p1bnCJ3V4WV2WksTE1iemwUs+OjmPT7YO8xoKRAgvS0NIpUJCclkruLIdiF49SpUzh9+jSampr/6Al9yDm4p22oRV11JWrlFfzYTteZy+tqUEBWLOGwk5dIICvKpmMuqktz4e4zYmN+GlcG2vHTJTe+P+fGdwh6X0w58eW0E59PDOLz8UF8PMocXx8eEqhYyvP2kBU3yJ1dG+yjnzXjKj3PQ7sJ7xDM3ieoPbR243Z/Fx4QAB8y6BHw7g908rQoS4PetbL7unlq9PZAFx7RdbZG+MhO8HQY8chN4KPnukbwu++x4PYwuT9HH9YcA9gg97flc+Kcz4VNjwPLtn5MW3pweXYKTy5fevbk6uXf+yXhvafvJvlcDvP21pb5zp275vv3H5jfe+9989c/+dHL6tHe7s5nk/S6rkEHRvxjcLnc++JfsZCQkNB/pc6vLmJhdAizoz5sLS9imcA3Mz6CyWEfJkd8eHz3GipKChAfG42kuGhkpiQgPTEOMVHhCAsJRmxMNCrKK57/sdf54KMP5NVVFaii55KVFaGmqhRNtXIYW+rQ11YPMzk+i66JrqvRVFMBTXUZyguysDE7iilybn+x4sbPlz34iyUPfjjjxKfjdnxF0PtqxsWPX04R+MZtPPX59qgTb/oH8Qa5sIesRWGwl7u9PYpbNhNBy8QBeIulP/v05OoIbtZO3LB0ENz0PG4T+G706fj63yVzO+7Sfe85u3GP4HfbTs9D4Hk64cD70248GrVjg5zkcq8ei2YdVixdOEevuePuwwV6/UsE4C1nP86S+1zuN2Ox14Rtnxv31pafffnOw+kLawvm6YkJc31j876yqhwTXhefTtPZ0Qm9rgvWAStmp2exsb7+fJQ+lxn6rPp7zGhraUFjfT22NjafXb58dX90dJJgeV+4QCEhIaE/JCc5uSGCwbWdDR47KwtYnZvG8vQ4Lq7OoaO5HlERYahXKaCukUNeXoqq0mLI6KiqlqO2RoGC/Hz0mM17f+y1XI7B/fSURHKOuZCWFUIpLYO+QYmVMQf85MhsJj16dK3QNdZBo5RC16TGJfodlrsb8ZN5B34458KfLbrpspMD8MfzbrptCJ+R8/uYnN+7BLz3J1x4Z8xFRzee0vO+OWzHI48VD1z9eEAQuuvqww2HBRcHTNjp7+bw2rHoccNq4FWgbM3vEQHwIcUjcoEMfJd7ddzlPbbr8eZQLx77rXg8MohvLQxjf9aD++Qwd21GnCfnuNLdilmC99muJlzva8UVYx3Odakw3FQNk6oKU1YzLNpmmBs1MDaoMUavO+0jKK7Oo6WjG1KZnBywElq6r8fYBXv/APp7+9DT04e+PhssfXaYTH1oa9MhKyMTFfRZdHZ0oKmRANisRatWB6/H/29+Fn/xM9F8LyQk9A1Vd1sTmlVyrM+MYWd5DrtrS9jdWMHljUWMOHsRfOYUzAQiW68ZfaZu6LRaqFW1qFMq0aBWo6NNC6/LjaW5+eePH77xR5u4SwoLwMBXViTh4GtSSdFYXQ5LVztGXDbYe7phaGuGtrGW3zbYw9KMHfh8zIIP/H349pQd35m04cezDvzl2SH8xVkPvr8whM8XfPhsyY+P5nx8BNm3KL4968XTcTce+h14fciGm147rrmtuGDrxQVrLy7ScavPQNDrwqUBA+4Q5N52GPGU4PeRuxsfDXXjqctA8OrEfXsXntDtn5Ob/JStKS6N4AN6rVtD/XhMTu8NAuGTkQHsGJtglZeiIT8TNfQ3zoywNo0ZuL1jGBj0cjj1mU3Qt7ejRV2LQWMzaqXFWJkaQq26EWWVMlQW56OsIAfFkiwoq8r42qef3puFyVFMjo5i2OvDkMsFr2MQrn4TfU4DmBh2Y3ZiDOOjY5ianMLdOw/Mz/7ql//F53F2bmxvjRwqGwXXbTDCZDQ/v7Z3XTTfCwkJfTPUbzKgqjgPvZ1a+Ox9WJ+dwA6B75M3rnLg6TQqTHrsmB7x0onVi2G3C4NWG8wmMwxdXdB3dsLcbeTgG/ENY9Tn33t0//4fPIlqlOQOZeXIy05DbkYyJBQJMRF0TIG8tJAAq+UncTvBztzRCm2dHB97O/GZ34gPvCa86zXjsduED4YtBMJ+cn4u/PlZL7637Mfni37sz/vxw/UJfH9lDD9ZGcX3zo7h47lhvDHuwU2fA1cJflcJfJedfdgm17Vr78G1wR7cdfTgfV8/nrp7eCHLO24zvhjvx1cE2898Zu7yHpPbe8fRjXedBtwjR/h4eAAfLY/h/eVx3BlxYKu/E9rKYtTVKGHq0sPWrYO+Xo6LKzPo7u5Da1sXausaoJRJoZLLUU/OWVGWj7TkeHQ21fC+xJLSKpQV5qOCgFmWn43q8iKU5GUhj96fOmkJL/AZdlrpsxjmn4V/yIlJvxezo17Mj3uxODWK1fkZLE1P8erXzbW155tr63tvPnpkfvaLZ0ntGgUaq/Iw0GNEfHwCUpJT0N9vFeuCQkJC3wy5Hfa9wtws6Jrq0d5Qh57OVjh7uzHj6UPQ6VOYIre3MjWMraVZbC/PY3NpAWfnZjA1PoZR/wjcThfMRjPatW0EPxPfJcFls2PE69t7eO+34be2vGjW1pNDrJHSiT0X+dnpiI0MQ0ToGX4soOtl+TkEYQm62zQEvWYYFCX41mAzvvDq8Im7E98aYm6sCzdtnXhKEPzhnB3fm3Pip2sj+PHqKAff91fH8MXyKL5cmcDnZyfw8dIYnkz58GjCiwcEv3sjTtwaduCmx4bb5NTuuvvwiOJd3wA9J2t/oOueXtx3GfHleB9+OGvDF8M9+MhjxqOBLj7p5YJZhwV6r7z0vjk1SgwQnHtam9DW3on2dj0a6jVoor8zLz0RptZaPki7pLgUuTm5iAoPR25mBkryc5GVEo+erlZUl+ZDq1EH2kGSEvgXkXpFJaQleSjLy0ZOWiLys1KRn5mCopwMcoOF6KUvHhNj45gcn8DkxAQf5TY27IPLTlD0ODHtc2HW78HMqB9epxNzM+Q4XU7o21roi8sAZDIZFAoFesw9z8T/BCEhoW+MzCbjfoOKHIBKDjWdaHWNteQskghGwdCpZZj12nFpbRF7Oxu4em4T1y6cw+7WBs7Oz2N8dBS2ARu6u7qhbWnlOyGwhnK2U8LI8AhWz67sffuLLzj87L3GZ13Nat77Jy0pQDmB78jhwzh+7Cjfuy8uKhzZqezknoKygmwMGNrhqC3FvlWNT91afOxo41NXPnB04gOC37suPd6ky297TPhi3oXvL3nxnQUvfrpKbu8sOb+FYbw/O4y3Z4bxmKDHjk9nyQ0ujOC9GR+eTAzhyegg9scd+MBvxdNhK96l4z2XBY8JfB+N9OKzsV78cmcUP1v34bsLLjz19OChw4hdix7THY1w1FVDVZSHLi250tYOtGh1kMkVyM/NIZDlEdiyIS3MQhe51siwEITRe3qM/t6k+BiCfAbSE2Pg6DNwN6dRSBEbFYHoiBB6D9JQRc8rLSHXV5jHZ6BKCYzlBEotQZZNy9HUN/D3XKfTQ6/vgsHQjW4KXWcXuroMMBm76TNV8N7HXgK0obMDCQnxyExPQ36eBOXlZZBJpaiWy6BUKtFlIOdO7n1jY32/z2J5bjGbsDQ1htnJcXrerudlJSX7sirpfn2ter+9rW2/p6dn3+lw7Xs9vv3xsYn9hfnF/dm5xT3xP0pISOjfvVqbGlBFJ1iVtIyvsyXHhCOKTtKNBMF+fSvmhl0cfLd2z+HWpfO4sr2JnbVVLM/NEdz8GHK60W/pg6nbSCdXPSw9feQqPBgm8DEn4ncOPDMQ8FoZJOg1FBXFdDKXEPQO4egRBr4jCAs6iVg64WcmxaIoNx199Lq+2hK806PEHWMtLuhqccWgwa2eZlw3N+Idays+c+uwTw7wsUOPtwhIn0058IOFIXx/0YsfLvnw5aIPb0168CYB7lvzBEJyfSy+WhnHx3T9vWkP3ht34tMJBz4Zt+Mxn8nZjzfI6f180YYfTPTg26NmfGfGih8tufD5pBU3rV3Y6WnHencrOmvkMOo60drchobGFuTk5CAyPAx5BC1ZUS4urs2iODcNuhYNzpw6ieCgM3xH+tSEOJQX5CA3LQnFOenIy0xFTWUJQs7QY06fRDJBsZSAWV6QS8cclEjoMh1r6H2rZ20fsjJkZ+eiuLgEFWXlqChnUYby0lKKMn5baUkZMtPS0NmkQm1VMbnLNMTFRCMxNgYpifFIS0lEemoyMtJSkJqShGRymLExUVBUyxAaHMTBrFNVIis9FdFRkYiPi0VKchLS6GfS05L5MS0lhW5LJpgm0v3xfFiBy+WZFv+jhISE/l3L6bDv5WdlQllVioaaKuSlx5PTC+In2K5WDQa6dfBZezDjdeDC8iyfn3l5c5U7v+3VFcxOTb1Mdzrsg7D2W8lp9PBRYvOjHrjMOujp5Mueu6ayFEo6wRflZuLU8aM4c/IYxREebONavo9faxOYK/Qri/G6To49XTU2WmVY1yqw2CTHdocK1w11eGBuwKPeZrxlbcdnXiMeu0x4w9ePD6ec+M7yML5a9uPbS358Oj+Mj+aG8dnyOL63Po2v1ibw6dIogdBHDtGH780P4YMRG94hp/fuiBVfztjxxcQAvpocwHdnbNz1feQz421XF671dWDX1AJ7Qy1c/QMwG4xoampBCgEgOOg0jh09imyCWYUkA7auZqQTxDub1ByGkRFh/DEMcmp5OcrI4WWnxPP1zeryYg7/E+QEQ4PPICc9mYCZSa43F5XFefxLSXV5Ibm+fMjLCnkqNJcgm5+Xh3xJHvIkEhQVFKCUQFjOQEiRk52NNk0NT5/mZKQhnoCXEBtNgIpGQhxdjo/lEU+XY6OjEB0ZgdCQIL6eGxpyBlX5GYiLY4+JQ1JiApITE/mRRQpBMpHgzUCYSuBLovvYWLpuo0msEQoJCf37l17Xvl9RXMBbCcoLsnH6xDHuxhqUcrQ31kHf2oCOpnpeYDLutmNnaQZ3Lu3g9Z0tXCbnt72+hqWFBb4vnp/c34jPB5/LiTG3AxNDdnj6jDC3N6GptppgWo60xBicOH4EJ09QHD+E40fJ9REwTp08ga+//hqqynJ4FcWYUJZgQVOBjWYpVhulmKmvwHxDFTa11dgl93eeAHhFX4+7PS24aWnDVaser7t78PakEx/MefDF8gh+tD6OH66N4Ttrk/iQnN4ny2O82vPTBeYIPeTiWBWoG5/OuvHZ3BC+S07xJyvD+NGyD5/PuvDI249LA924YevCU58R4zoN5kaGMeEb5mtrWRkZCDpzBocOHWKb6iIrNRFFmckoJ/DFRIaiSVGFbIJODIElPDQYJQSzZpUMVYU5SIqNQGF2Oi9eOUKu99hRAt/xY8hISUBBTgbdngcZQU5OUNTQl4bcjBSoqkoIMgduLZlFAlKT4iEhh6ltbkJNjRJKZS3k1Qpo6lTkFLOQQc4sIS6OO7342CjEUcSyIHcXGx2JGJZajQxHCEH5FH32Z06fQBXBMj6BIJdEQKNjfHw8d3QsTfoCmIHfIxnZmelIT0+DxWIR0BMSEno1ZLf17ZcX5fJikrDgU4gMPYOS/BzIK0qhrpaiQSVHs1qJdoJfv6EDZyeGcX1nHXev7uLGpQvYPbeF1aUlbK2tYJSV1g86MGi1wmmzYdTtxMywC157H5zk/CLDggkULJ13AieP0cmeTvhHjhzB0cOH8cF775GjKcRkbTEW1aVYrC/HdF0pzrdIcbG5CmsNlRyEiwS/s01SbLZWEwRrsNpeh8s9Wtwc7MLVwW68O2HH+9MOApkLX2+M4MuVEbw768ObE268Nz2EzwhyPyW4fTLtwo9W/PjJ6gi+osf8bHsCf745hu+eJTAu+nB72I4Nqxm3nEaMtCj49kbTfj82lhd4SjGKHBJzaAx4LAoyU1BdnIsscnlh5Jx05Ao1qhpERASa+vPJ6dXLyiGl95q9x+xLhrG9GXHREQghl8XWODMIZIUERwY91tRfVVpAn0EFASuSvhAUIpHcWWpiLNIIdunJBJ7EON7mkJmeyt0Xm6DDYMRcGEtnppI7YylK5vY48GIIdPR6DHYsGPjYbblZWSgqLEJefj7/+UTm7hKYq2PAiws8R1wMH1jAHGNiQiyHby4BV5KdAZ/XI9b1hISEXg09efJmUkVxPp+DKSGncuzoYe460sl1VNKJt1ZeyYsjtJpa6JoD4JvyDOLi6iJuXtzG3rl1XL+4hfNrZ7F9dgnzkxPwe7xwOZxwOxwY83kxTrBYGrXTyT4I8lIJnWzDeTqNQeM4uRzmdORlJVBWFJG7K8O9Tike6aXYaSrHRE0RzqrLcLVViq2GCg5DFpsEwssd1bjYqcI5vRpXTI24bWvHoyED3vB0402fGV9O9eGjKTsejtjwdGIQnxIMv5pz4DvzLnyxMIRP5sjlLQ3jz7fG8dcXJvDX58fw4/VRvD8zhPujLlz3DOBifxt6dVpMD3twaWMFbU0NHABnTp3gqclDh15ALxmD3W1IoL8tgZxUFb2n9l4jIgmO4WEhSCZYVBbkcKCFBZ/hjq+jUYmu9hb+ZYBXtRIsmWNkRS6Bdb0sfpmBrjw/ixxbFFISYgiOAeixYF9WkpgDiwtEHDnLmKhIREeE8ek5MdHRiIuJocsxiKHfK5rdz2FHzo9FbCDtmZ2ZTQ4uia4zN0ewi4/jl1nE8p+P5oBkoEyMjyaXGcfTsTkZybD0msVuE0JCQq+OmhvUz9jaEUu3xUSEkvM6xCM+JoKnPptqFWhj6U42MFrfBguF1diJUccAlsa8uH1xE1e21ngw+K3Mz2NqbBwjPj9vrN5YmEIFOZvo8GBeMMM2q2UFHCcJriy9d4LgUZqXjbqqIuy0luFNgxRv6qtwu70S62pyfuT+RqoLsVBXhhllCeYIggx497tVuKqrwc3uOjyyNOKBpQE36bhDANzra8EHw93YGejErsOMx/4BfDRhw0/PuvBtAt8Hk3Zygn785fY4nm0O49m6B7/Y8uGLOSc+mHHhnSknfkL3a+nvH/c4ceHsDLk3JXdbIUEneYr2OH1BYIU5J48fJShlw9SqJuCF83U7WUk+5vwuDiAGmLCQM7z3rpTuk6QnoV1djb6ORti6O9Df3YmO5kaUFkiQm5HKN/RNptdhI+CKczMo0pFO4Isnl5YcR+Aj6KRxxxeLsoIs7hQZhE/Q78HeT1YoxC5HhIXyNTsGvtjoF+AKgO7Xx8iXDjBwjOazVtlj42IPYMnW/qIC8A6jLy5R9G8kgdxnZnIsub10PHrwQDS7CwkJvToyGfRJddWVzyvJNVQWZuPM8SMIPX0M4WeOI4pcCJvF2VinQHuTmtyeBh10ZM6vpb4GLks3Li7P4PLGEq6dWyXnt4HdjXVsrqywqS24sk3uSC3nvXmsOrGCHI4kM4WfvFmwk3dcVBhBIg/18hJcbC3F424Z3iDobWiKsVRbhPMN5Zgix+eWFWC6thQjimKskdO70FKF860s1SnHxXYFrupVuNOjxi1zHZ7YmnhcH9BiydyGi3YDno5a8IPZAfx43orvTQ/gq1krPp+y4oupfnx91oEfLw9y6H2y4MaHs05ccxvg6DNjzGXFre15vi7G4MLSsseOsCrUQ9ypMojJSiQwauvJ/SRBWVkMBX2JGBowoSgvF0kJcYgID+V/Z3Yq68nLRatKClOLGi5zJ9w9erh6uujxPRigLxP1ymr6uWxkpCTxXkYGPuYEGfTio8Lpcih3lKkJUeQOz9DvcoTD9xA5TrbGGBJ8muIMb5eIIFCxgproiHAOrpiXa3kRL6+z4+8Gd4MUbCQdW5NkxS4Nmvrn3mHP/vDI8P6wf3h/fGJsf3V1VVRuCgkJvXoy6rTPmVtRVRbhBJ3II0NOU5zBZ59+gr/7u7/F4zffRI2sCip5JWqk5VBUlkFeXgLWfG436rAyNYLXd9Z4i8ONizu4snMOj25cgamtHlkpiWCTQdjPVpYUokiSjYKcdF6EwfrTCulyc60cDcoqXGmrwE2KO7pKzKkKsd5QilVye5uaUkwpi+FXFMF3EGM1xRhXlcKvKsN0PT2eF7vIcNOoxNVOBV431OIhOb9dcxMeOTrwbb8eP5k04ks6fj7chc/83fhq0oI/W7Dihws2PPaZ8MTfi8djfXh/fADN8nKcpb/r0zevor2+GuEMMOTuXqQ0WaQlxKKyiH1ZyEG9rBSttVJUl+VDzvrtCnLgHexHWmoqL/pIS01EXmYaZMV5UJYXoFlRAV29Aj1aDfp1zRRN6G3TwGFqh7uvG33GLqhr2FZPebzlQ1NdjkZFGYcfKwqKIcccGhRoeTh98jh3zgyAzK3/NvRCEUXQ5EHwYyBjbo2BODIyUGHKbntR3MLcKYNeHC94ieD3sedbWlgQgBMSEvrTUGdbC0olGXyng1xyI9Z2NcrzMnkz869+9Tf4l3/5F/wvf//38LjdyMvJRBmdiMuL83njeVeLBnZzF5bGh3Fth63xbfPG9vPL48hIisX4YA+cFjNMeh1amzSoVcihqCrj1YlVvGldwhvlmUPabSnHHb0Mq/XF5OjyMK8qwIa6EBt1BdhUF2GtjkBXXYDBCgk88kK45UXolxbBVVMKn7IUE3UVWG+WYre9GrcIepf0Stwl8N0xqfGetQnf9bXjY5cWT6zNeOpsxyfeLnw6bMAPpi24T2B8NNRN0YWZDiX89l4sjrjwxcMLfF0t+MxJntJkDo+5qtCgM6ivLuMuqCQnjUCXxwtOpOSY2VpbFV1vUsow5RuCqVMHeVUVpJX0pUEuhVJWyXeeUMvK0UKwZ9GulkHfUANzqxoDnU1wmzowRu/d8KAFZr0WDSoZ5GUFSIqP5uugoUGnudNjze3MRbKIJweYFBvJBw0w4HHoEeAiwwPHqIPLzL3x4PeTEyQHyZzsiwis90UhMT4GKUlxKCoseC7+lwgJCf3J6Oa1PXl7Y91zSXoih55T34hZtwXdBLSstHSsr6/jf//fnuOf/6//E9/96is0aepRlJ8DTY2U3FwT+rvaYTexFF0vRtyDeH1rlqfhvJYOLI55sDju5+OxRjwe2Pv76STeCW1DPeqqqw52YCjnJ/QL2kpcbC3HjDIf/uo8gl0hNmvzcV5dgHMEvzW6fZNAOF9TAAeBz1qZDzuBr6+qEH1SgqCiFAsNldhokfGU5xWC3uVOJe4bVbhHDvBpfz3e6tfgQV8D3uhvxAcEvvccbXh7sA3XB1pwd1CHp149dPISLPiduLc1BatOw0HB2i1YavPE0UCwZnQFOWNW0JKfmYzSvAzu+F4AT8r77IpRL6/AoEmPWb8LY143mjWNBL5qqFVK1JKTY86ZDwmoqaKoRCMduxpVsHW1wmfRY9RqwFBvJ6ymTnKMabwy89SpEzh8KADfI+Q8mQNlbQfM9bE1PhYMyqxohl3mTpDuP3niOG8RYY3zIcFBCA4KQlhYKHeA3OUxZxcZzmEZzgpsCH652VnPO3TtYt1OSEjoT0u/+uUvk1TKmr2UlJR9nbblmbGtGU5DG+z6FhTlZKG8rBQ/+bM/wz//8z/zeOutt6BR16KrtQEGbSP0BMjWehWa65TQa6r4CXjaacbatB87y7PYPruIjaV5zE9N8N3abeT+Osj5aWpkMOpakZOZCqdMggUC3WS1BOu1BbjeVIwLdXm41liIS/UF2FLl4XxdPlaUBVhWFZEbLIC5XAJzRT4GZXS9pgSz6jLM1Vdik4FPK8dumxT3DDW41i7Dgy45HhprsKevwXVjHa53q3GfnOAtirvk/t4Y1OJmrxotddUYYXvwnR3m1ZKsl40V3Jw4eoi7vSgChb9Ph9MEnyPk/LLTElCQnYay/Cye7mSN5dLSQgJ5EWrJ1bKm/wZyxYamOky6rZgZHoLFaCDoqfjuFY31amhUCv4lgM3gbK2Voa1ODlNrHZzdrRg0tMDe1YJ++jwY+FifHmt3YEUrhw/Ad5ji0EHald3O3n9WMcvSsmHBpxEWdAqnjh9DZGQUsrJzMDs//+zK1avmvWuvm3cv7VJcMl+4eMG8tb1lXlhYMHs8HrOl12L+4L33BfCEhIT+9LW2tChvqVc+19XK4aQTbjOdjHMyUjA5OYl/+qd/wr/+67/i//iHf0BTfR2BS446eSU5tgqo6cRdmJ3CS/GNzSqMO/twbn6MtzlcoNhcnMPKzCQmfB44+nvhtvagR98KeWUp6ioLYamSYE4hwV5DAYbKMzApzcJqDUFQSbfLczn0zmuK6DH55AiLMKUshFdOj5XmY6y6EIt1pZhUleFsYyUBsAIX22S43FqJG21VBL5KXGmX4lY3Qc+g5E7wBsHvWncd3rY3cRe43FIGa3cHPL06jA90IjEumpzRcXJ6h3l/IUtvZibFobdNjcOHD/HITInnU1eKJZl8xmigz66QXGwRFOT2lPS3qapKeZO5WlZGICzhY9emfE7Mjo2gx2hCe2srWpsbyQEqUF1RxqfYNNF73q6Soo3C1tkEj7kNA0Yd8nMykUuvl5IYG5hlSk4u5MwJhJ85iVCKIPp9eR/k4UAlJ3N6IQRBlg4NDz7Fh2CXFJO7bGp7Nj4xJaAmJCQkxPTnX/84ydZr3tfIKsj1tZC70aOB4KaqluLTTz/l4Lt65TKd5IvI2RTx4hbmVnJSA06EzfU0ahvgthgwN+zA+swIthamuPPbXJzF9Ogw+oydMJHTc5g7YWhRIzMqBKUxIbDlJyKGTuQnyVlVJkbCU5mJCVk2dgh4a+QCV8kRzisDxzlFHrm/fGzWFmGRQOhXFPPmdr+SnF9dCUGwCOdbKrBLsdZQjp3WKjwyq/DQXIvLOjku6hR4vVuFd61q9MslsJl08PS0o71OipioMJw6cRQnj7P2CoLe0SMoy03j6VsGPFY5ydYu2eQUVqDDhk6z/QNZ/yNze9UcfEWoqSzmwdYua6WlfCyZhkFNo+QTbBYnR+EetEFdq+JFQ9LyUoJmMTnHPGjkpTDRFwi3sRWG5lru+NiO9AyuBQRAtg6XmZrIq0czCMisMjYmIoTgdyLgBg8d4k6VATGK3F9MRDBFGHLJ8SmVKgwODokiFSEhIaEXWl1aNHc0aZ5btBpMDfaQy2kgV5ONvl4L/u5v/w6jfh+K8yUcfCppOd+1ISYinM/dbFRVo1VdQ6HgY8lYeu/c4iR2VxewPD2K1oZaaCmaFOTKejRYbKyAIj4UkvBTCCXQ8FJ8ipMEG1lyDHd4W+oiimKsqApxpaEYVzWFuMjW/pR5OEdAnKjOh6e6AJPKYizUBmKGwMdis4lep7UC9wzVvGjmrZ4aPDArsdFShUvackhzUmGgv9Pa2YDCnDSEhpzG8eNsXFigTYGtpxVmJgXW1A69xqHHdk9g8zfZ9klFkiyUskb04sBkFTZphq3tsQrMAPRKDlxfKYcfCwa/eoJgb0czJj02THjsfHh0XHQkOeZQlEgy0FJD97cSoLqb4SUg+/q7YTN2QKOUoaRAgrSUJD7YOis1iTeuswHSMWx9jrUcBJ8O9PKRK2Tj5gIzT4P5kPH4mGgUFxaju8v0bHZ2Xrg+ISEhIaZfPvurJI/Dut9eX4MhUzucRi1q6cSdm5GOOzdvwNrfi6riAn6CZ20IrGiCjdVie8GxSk0FAZBVe3Y218FnNWFlwoP5sSG0EfBW58dhVJTg3oAWd20d2DO3oCUrEVkhJxB94ghOE2yOHQ5E9Knj6M5LxQqBbJLgNqsgt6cqwCV1IS7XFWBXHVj7YxWfrOCF9fut1xdjTc3AV4BRevxWUzmuaqtwRVuJd3prcL2jCns6KTlHCbm4TGg1CnQ3KZAQE0nAO8od3dHDAcCxNbKMpBgOPAZjVkmZmhDNm8lZipP9zcV5AbfHptowt8eA9yLFyXZXYOBTVgWCgZClO+sIfo0Efg3Fgn8QOZlpiI5kVZkRyEpLQG1FAdpVFeisl8Oma8CE3cT3P5wlSLr7jWih9zE1OYmPDUtm8zGTEpHCh0bH815BPnCaTWChYG0MDHxs9FxMeDASosIhycpAo6YB3iHfM6fTO/306Qdy8a9eSEjoG6/x0RFznbzyuaFRBV9vJyztGpTlZfIxYmzbHFbQwaaIMCfEnEZOegqHAAOAgk769TVSAp0SAwYthsitsMrFjvpqmMqysd1Zi9sOA7b1Glw0NWGsSY7U4ONIDj6B+DPHEXv6GGJOHUX48UOQRIdisDwXnkoJpmsKMSVnRS6F2FDkYZugx9YBtwh82/V0G7m/c+QIWfvD+cYSrKhLMEaOcUxZiBmC525bFdYbS7HdkI86AlCzqgqWlhrukFihSsDRvcaPbK2STV45dFA8wgpbUuKikEXQYxNV2NDoEvp72cixClbQUlbI1/UC6c1Sgn8Aetz1HYBPJQ1EHVvvo/eDvZcui4Hvt8e2HWKFKyqCnqo8D+rKAjRVl8DcooKbvnywlhDmEA2tGqzNjqOqvBQpyQS8pCRkZmQgKzOTIoPP5sygSE9N4TM2mTNMSYzjje8s7RlJf2t0SDAy6P7GhiYYunvhdPmem81izJiQkNA3XNeuXE3qMxuetdbJMWrtxlBPB/QEssbqcnI9sUiJj+LAYBNC2GaxWWlJPO1XxQDA0nryCr7tUJtGyTeYZdP9TUXpGFEWY7SuHDumZiwQdLZ6WnGSoBN87DCCjh7CaYpTBJ+TDDjkshqyk2EqzsRAaRamFQQwcn5TrAJUnoNFeTbOEviWlXk4q8rn635+aQ42CYzL5ADHZLlYqC3EODm/KRW9LsWU8kUjOMGnNAfhoUF8zBgrCmFOjzk7tgVTFLkjdplBj92fzKGXGHB6BD22IzzbHqiSbQZbxtKbRQfpzVLueBUVJb9OdzLoMfgR9Gpl5VCz90ZRiXFHD7SNapSVFKEwPw8Fkhwo6H1qkBdz16eqKIRGXoZmZSV0DTVoUkoJ2MUIOnOKBxs8XZRfgIICFvnIz8vnm8myrYkkubnIycpENgMiOfVsiqT4eN7mwPoRWQ9gXnYmYqJj2BZCYhcFISEhIabJcf+0QdsEp7kDPW0a5JDbYYORX+PN26d59SCDA1s7YpWfZYUSyCtKeF9erayC79zOttFhqcD+0kwMSXNhI+fmoOgtycKCVoHilBhEnz6K0GOHcPzwQV/a4dd4qjON4DNQQT9TkQNvlYS7veGqXDgrstFfkolpWQ7Wa/OwpJBgnVzfLMFwS13Ar3PXV19EtxfiQlMZL3YZqsrh6cgaclqV+RkE7lO8D4/1wbHRYwxyrBWAtQC89gJ6J44hif5mNiyaTZlh6U02MJoVsrCdEmQHFZwKNp6MHF51RQB6Nb8BPtWLdT5yeioCn6a6Ek3kNtnehh5bP/rMRiirqyGrKKMvDiU8rcx2udfSY9hzVxTmopKC7d4eQuBi63jJiQnIJrAx0BVQZGdmBBxfejpSUlL5foCpqWnIIDeYnZ3D9+fLl+TylgiWUs1OT+a7NxAkBfSEhISEXmhuejKpu1P7jKXm2GDkiLDgl6O6+GgsAgbbJT0hOgwSckJVB83oSg49KR9qzW6zE/TGCVruKnJkrAWhMhfz9WV4PN6HkZZqVCaFQxIdhPQwcjEhJ5ESfAJJQSeQFnoSDVkJcBD8fAQ+R1k2LAS8Ibo8Ts7PX5XN053b5OKWFbmYrc7BCl1mENysy8caucBzmiKsEgTHlLncnTHosQrNwG4QgeHSxw7mW7K/iTV9v3bQE8eawpnTy04jp5cVWNMrZRvBluTztgX5QRELW9Or4WnN0oMgAFIoXq7vlfFULwu2U3odubhaCuYS6+TlcFpMGPM4YOzSQ1WjgLyynJ6DnF6tjI9Jq5WVcuix3dpZcznbKy/mIBikT59g1acBcL/43V/jPX1HcPrUKYSHBJODDeUFSAkEcbZfH0uD1qlUAnpCQkJCv6thl50Pjg4+c5rDITIkCIlR4YgjNxbG+8dO8dQZ2wqHDbFmjq+2uopDr5LtpSeV8LTjqCwfkwS/MZmEgEQujNzYrf5m3PX3wkBgq4gPQUVCKEUYqhLD+HVJxGlkhp1GU1YiugrSoMtLI/cngbsyB4Pl2Vioycf52nxsk+sbr8rCrqYQ2wS8DYLhFh1XayU8vPJMgnEZGhXlqMhL5ylaDrwjrwXSmwfTT9guES+gwXrg2M4H2WnJHOovoBdwegHoVVe8gBtBjaKGgqU5qw/W+NhIMv5FgEcZ39GegZC5w2oCpry8KBCl+TB3tGDUbcNgnxl1bKKLQk4uUEaX5ehorEHQ6VN8Dz82ezOY79V3lLdasE17jxwA7zA58OPHjvF118Dl4zh16iSHeSx9ZmwdMTUxHon0WfX29j4T/7qFhISEfkdD1h5yNEWBIcinjvHhyz1tDXxcV05KHO8b47sUHD2KM6dPo6y4EDI6obN0YjFBYlqay6ewDEvzMK0owDhBb4JiQyXBvDwHZ9VFeMNnwoUBLVokCVCkRKI6JQKqjFho81OhSI5EDoEvLfQM6jLiYS7JgoXcY1ZkKPrLsjBPLu9SfR72Gsnh1eRglRzfWbqNNb2zaS87agmBMg0NNZU8bViSncLXxviOCgdp1ddeC4CPbYT7Anos3cl2i2D7y+Wx9KYkEyWsZeHFVJbykpfQUxys6VW/BN6v4wX0GBBrKktepkPZlwN5RQCcvPKTgCgrK+AOb8zZh/HhIUhysvn6WxB94WBOj1XOsvVUthZ5nIDH1h1ZuplVg8bHRCE5IY7vrJ6TmYGcrAwkJyUiODgYJ0+yLYpO0OPZuLKT9HmdQgjdXqNQPB+fGBftDEJCQkIvpK2tRq+uARHBpyhOQl4sgdPYAb/VxEvx2RY8rACkpaUZDx8+xD/8wz9g1O/h61GFkiwMl2fxWZt+WR6G5flwV+TATyBcJODNynIwVy3BuYYSXNcr8LbPgBWjBsqMOKx1N2Pb2AyXkuBB7q8o8gySCLqlsWGoSY0KpCTp5F+REIHh0mSsStOxWJmO9Zpcet4scn8S7KrzcE6Vja6iZA4a1gyemxpPEDj+csTXkd9IC55ibQwEFXaZpQ7Tk+KQxyo3WZ8eOb0ylt48cHqy8hfwKuZFPAxwAZAFYFj98nJp4P6qg/QnHatZMACyI39MMXeOL0acsTSshF43LCQEoeTu2FzNQ/z3OsR3pGdAZgOo87Po98rLot+N7XCRRe93DkoLC1BRWkJRygdhs4HYuVlsHTOYpzxfTJthze1B9DylRYVi6LSQkJDQS+jVq6CWlnLoRZPbigg5jVJyPfpGFYYser6DQHF2GndFa2ur+Md//Ed89OH7fJeFwtwMDFdkY57ANq7Ix5CUFbOwdoRcTEizMV6VjSVlHtZUBCd1Pi9GuaqrxlVjA/Z6tZhqrMa8tg6rhmYYijMJfqGoiA1BZvBxxJ86gqgTh3GaHE/UyaPoyo7lsFsgp8fW986S09usY20OuWiUJPI1Pba3X2ZSLE6RYzpyONCucOR31sJeO2iaZ/MtM5LikZue8rJPr5RAzpweK2KRV/za4dX8htNjMGQAY/ezy8z1MsDVVBys+zHHJy07AF8Afi+O7PGsH7JOWoLsVHJpbDbo8WMHTpRAdfQYEmMieb8kA7CsjAG3nF6rHNLyMijkMtSr69HY2Iym5hZoNA2oqa5BVUUFKsvLkZ+bw8evMaCHBp3gvXzpqUkQ/8qFhISEDrQ0N23uaNY8T+DN0XFITU5EQnwcT2OyuZym1no+OLlRXs5nV8qrKnH+/DbvWZMWByosr9QXYoHN0iS3Z62Q8GKUIYLhYGkmhgl806wVoZoFa0fIxRrFoiwbq+pSbLcpsNqixG6PFju9bTAUpUGdGgZZXDAKwk8i9cxRxBH0wo4dQSoBuTU3Cb3F6XCXpmNJVYAFAqEqOx5VBCq2i3taQvQB9A5x6B3+PdBjERsRyp0eg4/k5SiyF9WbRQSzkl+nMwlkHHgMdAfBHGAAgAeu70U6tCrweHnlr3/+JfwqSgJFL+T02HZCbNIK39z20BEEnzrJx6Ix4LFeQd4cX1WBGpmUnquSjjLUqWrRQMBrbtFCq+1Aa2s7mpqaUV+nhrq2Fk0aDdpbm9Ct00KpkEJC7lChqMbjx2+Zf/6zvxBpTiEhIaF/S9evXpXrWlueNytl8Fo6+c4B9dJAuo6NJ6utLOajxS5qCnFBUwKHNA+mshwMlOfCXZ6NYWkuRqpyuTtbUeRgk1zZqiIbWzU52Kgm1ybNxLI8Aw+6lbhvacLNPi3uuo1Y7qpHZVwoSqLOIDvsBJKDjiGWtT+wOZoEsmCCmrEwg7dLLJHLrEyL40U2zTVlHMyBNcjX/k3oxUeF8XmXDHq56cm/A71AelN+AD7FQeHKS7f3G0B8sXbH3N/Ln6n6tcNTHBS/cGdIj6ulLw9sw1hWWMN2cGcj0thOCnnpSQQ7CX+eGlkFaqulFHLUKmr4lkbKagXqCG6ahkZyea0EvDa0tXUQ/NrQ2NDAp7L09vTA6/XB4/HDZnPAaOpFW3snOcJGdOkN8Ax5ny8tLu3fvnVHTG0REhIS+kMactr3musUcJs7MGkzwt7djpa6Gr42tdtcgfMNxVgk19VfngNdcTZMpTk8xemqyOHtDKzZfJ2gt6OSYINc3m4dQY9gt63Iwo4yC1fqJLjRXIR33Z24P6jH3SEj0kODkHLmGBIJdhGnyAkdAO/FVjx5sRGwy/LhKc+CJDEapYUSaFUVSI2P4dA7fuxQAHx/AHpJMRHISGTQS+DQYw6rOD87MHuT7bRQXsThXv2iRaGi9OU6XiAOoPcCaAepTn7fS+D9Oq0pZfeTG1XLyxAefOblOLSosCAU56bxPQ4NHa3Qt2vRoW1FR2sL2lpaoO/sRBOBrpFcHANbEzk9lt5sIfBpGfzI6VnMvXA6XOg2mMgJtqJB08wf19zcjI72DnR3dWHA0gtbP+sd7EGXrhO2AeuzyTFR5CIkJCT0e3Xtyq65Xil/rtfUYEDfyseSsQ1k1+uK+JZBs4o8uKQ5aC/OQndpNnd4YxQj5P4WFfnk9CTYqcvHpjKXwJeNbYIdg94mOb9dXpSSi3OqHFxqKcPrPRo0FWYjixweS29GnzzCp7sc+42958JPn8BMs5Tgmo0CAheboKJTV/LRX4E+Pbad0L8BPYImW6d8kd5kE1l49SbbZeFgTe+3oziQ2iwvPkhvlgSA99L9HTg9dv3A3XGHd7AGyEDKegBZXx4rMGEDANjAa319NXo6muEbHMC4141x3xCcNiv6e8wEMzPM3QYY9J18C6OWxiY0U7QQ6FiwrY0mxyfR1Wkgt9d84ASbyf21o51cYEe7Dp2dXQTDblh6CHoDA3AM2uFyDMJlt9Pz9+DK5StipwYhISGh36e3Hz9K6mxvfcZGdbEqRbb56iwB7aKmGOfYrEyCWh+5PUt5NmbludiqycOqku2Xl8e3FZpXsL31cniKc6oyA9MUO6pc3oqwqWIp0GyCYja2anPwdNaJ5S411CkRkCeEoigqiNzfKcQHnUDUqWPk/I5AmhrLZ3GWZKXwVgGbrg5Zqcm855CPIDvy2suG+9+NRHJ6bPRa1gvo5Wb+Or3JoHfQp8ecGluvkx+s5UnLi38NvINj9W+kL5nLk79IhXJIFr3cTohBr05WwtccWRHLqt+K5WErVic92Jgbw+b8FNYXZjA/OY7RIRfcdhsGB/oITibe3K7vIIi1E9BatXCTsxsfGSe46dCkaeRukIFQS/e1EfQ66LG6jk506rpg6DLAZDSjt9eC/j5ye7196Oux0LEXVosFY77h59vr63tfffmlSHsKCQkJ/a78PtezGpb6K8vHqroIt9rKsE7Q21IX8i2EfGwtjxzYUnUOXm8owog8Dz6KOWUBRquyeHjL0jEtzeKFKBfVBM66XOzU5nLHd7U+F5foeL27Fo+nBjGgKEFpbAjyo0KQGRGEFIJfYvAJxJ45jrTQ0ygi6NVKS2BrV/OJJHxNj40fO/z7gcfcIpvGkkbQY7sssI1d2f52bMB2Od9BvSDQVH7QZ/eiaCUAvcDt0pepz9Lfqs7kqUxynawQhcFO+jIK+eg2tbyUV2wqKwoxYe/G2dFBnF8YpRjH7tlpXF5fxIW1JSxPjmB+dBgT5Pw85MwG+wl+JiO6dDqMjfgxPTlFDk/PQdfJAEcwbNNqCYIEPBbk8ljodJ3c7en1XTAajDAS/IzdJphMPeiz9MHaP4BBq40Aa4fX4cDM+PizW69fF+5PSEhI6IXcQ479wB5zRdhuLsdecyk5uUJ4K3P5VBY2g3OODZGWZpOTy8O4LDCbc7CSjRjLw7qK7aieiyVyfewxC4pAM/u1egku1LIil0zsKDNxiUC421CIJz4jrgyZ0VKQidzIYGQR+HIjg5AXzSIYRalxfIizQVONmMgIvmHsi/38fh/02LpgakIMr95kQ7UlmWkcekWS7MAoMlY9WRIYOs0gx9xdVVlgXY5dlx2A70XrQqB6s/gAcoV8dmcVuTrm7FgrBQt2GwNpvaKCfr/D6KLflVXFjtmNWPANYHvGi505Py4T+Dam/diY8WNl0o+txWksTY3ytOdgnwV+jxtnF+Zgpcv6jg6etrT09BDIugl4bdC2kNNrbQukNgl4zO3pDuCnJ0gy+HV1MfdnRDeDH0HQwlyfpR/95ACtfX2wkxucHZ/A1tra/pNHj4T7ExIS+marU982nc9K6wsJUI1lWCXgjUrzYCvLwSiBz0kxWCXBEjm71+vzsUlA6y/LRn95LgboeI5NUqnNw25dPi5p6GercjBDMFyuyeOPvVwnwUVVDjYJfux4UUMOUZ6PC71ajLfXoiIpEmXxYahIjEBNWgxkCeHIjg1HSVYy3zfv0EED+m86u9+8fPzIYV7lmZGcwDeRZU6PbSTLmu1ZMQvrQWQFLZUlAVhVcZAdBAMhu37g4Ph0mhcOr7SIj2bjoCPgBZ4jH+V0LC8KPJ9SWkpO9CR622phaVMT+Jr5bu8jA3pMOnuw6LdjxmulowObMyO4sDSN88sz2F6cgc9hw8dP7mJpwgdHvwUuuw2uQQcGbTYOv24CXyeBkKVA9QQ55gSZC2SXA26wIxAdB/frGfy6ufMzM+dHsGPpzwEKBz2n3zME/5Ab68vLz89tbk5//7vfEYUvQkJC3zyd29k2JyfFIycjGTN1xZhR5GGimkEvm48hm6/Jx0BlHvyKQjxsK8HtxgJM0f2DFeT2KnIxQc7v9eYi3GkpxjU1wYxiXJYDj5RgWZaJkYpMrPMilyysyDMosjD5f7P3nk+Opdl557SZGY7hmHbV1Z2V3vtMZALpkN4ACe+99y4BpDeVrnxXT7WZHtMzIqWRyFiSPTTBWImkFEuJDC2bWinWfOIHRmzERn3VH/HsOedeZPV82IjVLkmRM3g73rhI4OImgI7CL59jnkOKsMw9f0uTuO83Iq4fg67tFp6E7XjoN2O19w66Xvs6bn3zq/jal1+WEUas6F4mwH3p5Zd+EXpffgVdd27TfgddbS0ymUDUXk8nRgl8nNvjyRIMKgYX5/kaqo1hJ8AT9TfyiyBk4E00oDekmlerAFQhOKsZRtvtN0mVzsC+Ngvnxjxcm/PwGBYRMK8i6d5GMeLEUT6Ci1oW9/eLeO+kinoujs9+8xP869/6AR7sZbFXSJMaK6FaLCCXSgn4gn4/3A4n3HYufrEL9GwWmxS68NFqscDMBS7bDD66bVZCn3ZRf/QcgqbT5YbXy6FPP8KhEBLRGNLJJLKJBPJ0rBYKn//wo2b4s7maq7l+xdakZux5T2cLQW8MRV0PdknV1ed5Ll4frvWDMjKoTND7YGsczzZGUdD2I6kdRGC8hzZblw3g2eoAni7343t0fLDEnp09yp7uQn68XXw2z3QEwHnF0owb288W6HfQ77myLuDCsYrS0hSOzWt4P2jBvlGP2fa3MXTrW2j79tfw2jd+DYt9HZgjOHZ+95t03zfQ+9qvo+e7v44WOr5763W0vnsLHS0Ev1a1SZ19OGWgbK+EOieG+25UmqL8hlXwDf9C6FIepyPDbUogqCjBhlpshD0nhnpksOzW3ASMCxrZ1hUdTEtamJd1cG/pSQUuIR8wYzfpwWEmgIudFOqZCP7mP/0Zfv7Da/zs6THuHZRx73gX5/s17O+UUMnnkYrHECJYBX3K5rCl1+MXFcdqjlWdnfN7ogCtSs7PrIRBrXSfg4DpcKp5P5cLHo8HPlKQDEBWgOFgEJFgAGG/j3N/OKjVn/3R7/9+M/zZXM3VXL/8K5lO1FtJLYU0BKPFQRzoh7DPE81n+3G1MICKlsOc/eLJebU6iqxOmbeX1A4gOtWH/blefG9lAO8R8M7me3Ay14N7BMJLfR9OZknhzfZIleeJrhvHMz0yY+9wtk8szQ4ZsnR/erJLrvkw4UN5cQqnBL33wjakSD313X4dT/JhPIva8cCzhdLyFNZ7WjHfegtrHW9jveOW5Aff+s43ZZagVHJyUQuHOzuVobKs+tgObFwFHys+jQq+F2puSPw6NQ01J/Djx1WVp6pEVnkT3BIx3INi0A4PqTsLwW57aRoG/RS2FqboOC0AtJEKDFmWkXBsIOfblrmHj4538NkPH+CjkzzeO8jieq+Ah0cV3D/ckarPs90a9nYq2MnnUMxmkUunCYIJUoBRhAIhCX96PQr8nCr8rKT+LKz+zGbp5+PbNpsDTi54kZCnB24XF714CIBeVQEGEA2HkYjFkSGFmU2kUM4XPr88O6v/xb//983wZ3M1V3P98i7djPazGVJ71Zl+7M4NYXee5+mx3RipNm0vfKTqwholx8eTEaqkAtOk9tin89EaqcD1QTwh8D0itfdwdZDO6cHVIo8mYueWXhxMd2JnqpMA2oPCVDdKtIuaTpQnOlCbaMfuZDvyo6042ZzDvnkFkelhJGfGcGrbwJOUD2d+Gz7IhvCDXFBCoN8LmrCzrIFzuBOW3hYYum9jtuU1dBH8br/+HbTeVotb2l5MUx/jcGdD9Q31Y7wBv1HO1Q2qUFPUXON+JSSq7pF+jA32YKCnHT0dLYh7rch4LUi5thC2rMBvXIRzY5agp1HhpxHV51ifgdewgIBpGT7TOp6d13FRDKMed2M/E8RJIYrTYgx3ywlc7RZwj+B3SfA73avhZE9RfzuFPIqZFNKJJFK0o+GIhCy9pODcpOi4lcFht0t+j6HHlZ8MQiXcSaqP4Mebb/OWwheCH7c+cP7PTwD00c8BBirBMRGJoVosf/bRsw+b6q+5mqu5fjlXPZ/9LDszhDJBr0Ywq7L5NMHtLqm98KQCPQ51vkcq7uOVQcn37epHUCVAPlkfkQGx5wv9ovIergxKFWdN20339eLhIqm7mW7UaeeneKJDJx17kJ/oRI5gVxxrRZ3AV5vswMGKBnvWdQS1I0jPT6JCaum+14SnCS8+3UngR8Uofpj14cSyhh2DHtH5KZiHu6An1Tff+iYmb38Xba99S+zJ2njkEFd1criTJzBwgcuAAj9uYGcAKqHPfoEetyKwTRkrOp4mz8UwPKqIRxb1dt1BX1c73UfPHexHMR5GNuhGMWRHOWRFwWdExr0BLyk/H0HOvKSoPd6urXmYOfe3tYLjfAgmvQZh2xZSBM1q3IvdpA8HmQCOcwoEOQd4tV8h+FVxWivisFLAbimHSi6DUjYjuT8ufOFCFVZ+HherPof0/3GYk6H3otLTIeFQKyk/zvvxsQFCVn3c8uD1+uGiazA0nQRKBh9Xf0aCIRzWd58f7e7V/+xf/5um+muu5mquX7JQ5/rC88LcCOr6YSlYOSKwnRL8SroBBCd6BXoXBLfvEdi+tzKEU/0QqgvDOFsaRn22Fyfz/WJCzX19j+gc3tcEvcekAq9J9XGLQ3VagV14uB2BoTakx9rhHmhFfLQdxfF2VEj51Qm2l+ZFPPYaUV/RIrcwif2tBfyIoPBRNoKPCQzXETd2rFuIbyzhHqm//PosFjrfxUL721juuI259lvofOs1tN56Qwl38rw9ru7sbhd/TgagVHkO9EjByzjtxVkNNlcWsLQwg7kZDXQaZRrD7NQk1lcWoZvWyDTzgNOJkNuJZNCLXMSLStyHPVKk1agdpYAJaeeGNNj7CX7OjTmYl7XSimHeWISLftYOdcC0PAeXYQUJtwlZUrJ5v4WgaUAt6hD4XVYSuKxlcLmbl31czmA3n0K9kMZOPot8KkmKLIJYOCwKzeVwKspOClps4tEphS/ys0OUH+f+Gg4v0vRusUkY1O5Q2h74+WyXxurR43LJkRVgJBQWyB7U6p//+Ac/aBa/NFdzNdcvxyr5HfX0/BgypPh4pl6Vt5Z79QYQnexFmvYu9+wRyJ4uD+JsnoHYh6imB2eLpPxIyV1wSHO+F++vDuLD9SG8t9wvTi0HMz14tjmC68UBXNGuT3cjRqDzEPiWOt+Be7gT0ZF2pEbbRP3xc56sjeOH3nXcM+tR0k/icGMGp9Y1PA478TjmxYOwC1cBOx4EbdizrOPcbUSSFJZpuBvbQ53Yoq1rv40WVn5vfhcdLUq+T9Rfd5vAj8cq8TZvLiMZ8qKYjmAnl0A1F0c+HkDSb6cv+7IM3n3tu9+FxWCAi+AQcLsQ8roR87uRCfuQj/pQIBBzxSYDrBAwI+MxIGpbE/CtzU3CQoDm/N9o9x2szEzCuDQDt3GF9jKi9k3EbetIOTexG3PilBThcTaAu8UIHuznJfx5vpPB9X4ZpzsF7JULSt4vnUQ8HEI4GJCqTwl5cuUm5+48vpvCF676lIZ31eFFtuQCaUvTu6IAufDF7Xar2yPXURxgAkhEo0jFYvR51FArl5vFL83VXM31T3+FVmefp+fHEZ4aRFo3iCKpvDKBLz3ZIwCsTnbhPqm5p4t9MnGhRMotQjBMTnbjlH6+YD9OVnUErft0/GBtQMB3MtuDmrYLD1YGRfUd63pwoOtGeOgO1gh6K13vYKunBUECX26iC3tTXTjVdit5xflhfOpbw9GqBqm5UQS0pEQNS7jyW3E/aMeFz4JLn3L7g5gLH0RtKG0uYH2kFwu9bdC2v4tugt4b3/q6wE+xLSP4dbYK/LjHr1HMwn1+89Njsrktga3FBvq60draCuPmlliHcY8chxKdpKh8LieCHieiXhfCLguiHhvSQRdyISdKEReKYQfizi1Y1xewRepOO9wLzUAHQW8CGwvTMK/NC/Qc9Lh7Uw8Pve6EY1NyhcWABXtJL87LMRxmg1L9eUWq7/7BDu4d1nC6u0Pwy6OSzyCfTorXpxKWDMoxJFZlflFrXglf2pQKT6n0JAiaFNUnxwYMLRZpeuftZMXnJugRTDnvx8UvDD/2/mTPT4ZtJp74/Pr8vKn+mqu5muuf5jrbLXv88xOIzowgOD2IFEEvOz2AvdlBUmZdpPT6pArzw5UBPFjsx/FsHwrTfchO9aJOILvW9+LjTQIbwe8hwY5/fnxzbi8qU93Yo/MYmPsEwVMC346mk+DXKmFO93A7XEMd8I10IDrWiSzBNKHplgG3d1fG8Mg8i1ODFtn5UUTnJlAjhcfAexr34p9V4vhJOYr34y48izlQJDBuTw5BQ1CbaL2N8TtvSzXoHVZ97yp+nb0dLeiix9hujK3LBgiCszKZYQTrei0cGwSrjXW4STGJZyb3xZFiMmxtwbhlkNvcN+eyWQmAdsSCPiTDAWSjfhRjpADDpAT9Nti3lsTJZayHlKx3C06Cm219HpbVOdjpd1hWZqTwRXKA63MCv4B5BRmfCbWEB3VueM+FcVFJ4NFBEe+dVnG1V8LlXhl3d8s42CmoYc8EMokY0vEokrEoogSokD8gptdsTC2FLzYlBKo4vVik+EWqPs1q5afVIo9zgYyLzmfF6PP6RfFx5aeoP9p8zRC3VJA6TJMCjHp9zz55v1n80lzN1Vz/xFY9m3gWJPCFCHxeUny52WEUtAMEngFUpglcBKnHSwPSf3clObw+UoF9SI53SQ/eYwLcB6vsyNInRtQMOFaBZ3N9MjV9n6C3p+3BkY6tynpwONUp+bzsWAfiI21wDLTBNtQG61C7AsHBNoRGO+AnEHpph+l2nots1sYQ1w2hSMDg5vaf5MP4OBvGp1VSRGEXKrYtJElBJTYWYdROYrj1XUx13sFiXxvG294W8HGur6fjXSxMj4tlWcut1zEzMSgFL0u6CYJMEpeHu6hVKlLaz1/4rPTYEJq3gcBnUOHHoGCoBAgGYZ8bqbAfEVKBYbcV7u0VDHS1ImpdxUHCKSou6dqUqk5ubDfqp2BYmBL4ubcW4DUuwbo2B79pFTGnQRxfCkGrVH3e383gupYk5adsbnl4eLSDa1J/x7UyqoUsdnIZZJMEQNqpRFzaE3iHSKlx3x7DjPv8LAI8kwCP4S1bQGgSH1CGouT7uPhFKj+V/j9ug+BrcC7RRXD0OJ0IkOrlfGcmFvv83vlFU/01V3M11z+ddbqT/yy6qEFyYRxR3TCKc4PYmelDjYDFFZm7pNLuLRDglhhwQzJq6GiuHyWC3+XiEJ6SuuPHeD9c5PBmL4qTnaLuDmd6xKtzl8D1YL4X5/TzPinANMEsN9GB7EQX4gRQ13AH0qT2cnQ7NtoJC8HQPMB5wHZkJrtQpmvcXx3Fo81J1PTjODbqcc0hz5gXV6SyHqcCeD/lRd25jbBhHYalJUz09WCaQ5h97QTAd9F9+w30tL5N0BuTCs83X/u25NtW5zVY1I7jt7//EB/fP8fjizOcHuyhmMtJVSMXfDAwTDwtYXtb4CCm0I0KSKeDlJ+DVBCBwO1ANuRC3G1CJeIUcO0l3aixGvVvI2ZdkapP+6oO9rUZAZ+NgGdemSXwLcC5tQg3QTBs30COYFmJOlHla6R9OGfA19K4rmdwVk4R+Ko4q5ewW0ihVshgv1qSdoccwS/H+b9IBNGG3ZldcXuRbVNbHGzKNAeBIYHcZNzGtmxlzJFFbM+UwhglD+iQylEufInS55JPZ7BTKqNcKOL48BjX1/dR2al+ns8XPzs7PX/28cc/8DT/dTVXczXXP8q1l4rUEys65Bl+rPZI6dXmBqShnKFXnFYAdjHXg2dcobnAI4cGEJroRX22X9TdOY8bmlfOuacnlUjPqWuVkUX5qV5lKC2dc0zXY+PqXVJ/MQadpheZiW4UCIDpsS4ERjpJ+XWQAuwg9deBAO0UPc59hNxWwfDbJTCHJ+i69JrfizrwhADzEYHhfdo52zacaytof+c27rz1Otpv8X4N7W99G299++vQjg7g3bffpP0GRvu7YFiZw8qsBvmgE1f1In789B4+fHiJi+MDHNSqKOXzBJCoKDsGnc1mk5J/8cKUo1mMpB1WiwAw6LYjHvAiG/GjlgphPx3APgF5J2xD0WdAgTarwCApP8vqjLi6cKP7Nh0tq7MCQpdhET5SjEHLGiIEwLTPhHzAiqN8SApfDjNBeq05nBRiOKZ9sVeSohee9HC6WxH4FdJpUn9JUX0c7vSRYmNoOayKSmX4MfC2ebQRK9nNrZtQLhtgG7aMsnnu38rKmqhdtk7bYWeX/QOUy1VkMnlEokn4/PTHgd2Fra1trK5tYHlpFfqFZbVdwvfs44++32yDaK7maq5/XGs3HfPE1ucRn5+Ad3oICd0gCqTQ9km55TTcb9eJa4LWU87d0WaXFS568Yx0ierj/r0rUoYXs91SkXk82yO5P/bgrGv7JDx6oGXXFi5+YVASWOeHCF69SBPUcpzTo6OTIGfmZnTaLtpxAmOS7vfS/Rz6ZEBy/i9Fm31BS6T8zi1L+EkhgO8XwniQi8C9PI83vvMtvHPrLbTfuUO7Ba3vvI2WW29I8/obpPK48ZwnK8xPjcG+RQBa18Nj2kAm4BTXlN/4+Ck+uH+J6+NDAuAhauWSFI74eEIC23+pZf8cGmyECG0Wi4T//G43In4fkqEAqukIqqkgdtO0Uz7sJz2k/jwoBsxS8ek1LhLk9LBvzMO6Ogfjoo6Un6oC6f+HdW0WHnqc834ptwH1mBMHdJ3DjB+7CQ8B1U/KLykQfHhUw6OTXTw43ce9k33s7ZQk7JmIRhDm4hSfMuHBQ6+PX6/xBnJGKdzhn1nt8X0MwY21NawukzoldRcOBMUtJhyKEDxd2CY1yOFPq80Jq9ojyOqRwep2OOgzcoiZ9ub6OjbWN7jZ/lnzX1lzNVdz/aNaD84OZlx67XP37ATMk4OIEvgyOm5p6CPAdWJ3uhOPCGr3aN8lqO2ymuMxRBM92JkZRHm6F9dLA7i30IOjmW6ckDpke7LqVLeESC9JqZ0uDOKArnemH0R+ul8azsP0/Oh4Fym6LhQIZkG6bSfF5xnpkCrPCIHPR9Dz0A6O0vmkCEu6fims4SZ77jk8d6zip6cVFBwm6AZ7peBkcX4e48Mj6O3uxltvvoFvfvPrGOpuw9tvvYaJ4V7otROSz3MalrG+oMXW4ixsG0ukstaQI+V3vV/C9x9d4sffe4zHl2c38GPFwwUeHB60q76Y1i8Uv1hE+VnpHLcMlc3GwsjHQijGgyjH/ShF3KglfSiF7cj5zQKzoIXgQgrPRmqPnV7Y7sy0pFO3lgA4B9fWAhLOTRQCFhSDVnq+jW5bcUDK76wYw3Uti3u7eTy7OsIH987w8OwA+5UicomoFL2w12cmGZewLXt92qXC06wCT4GfmaBn5jAuHRmS2VRalK6D4MbKb42U3yopv82NLVX5OmXskZ37BzkEygbapCTdBEo/PZ/DrLlMWipMd8rl53/5l3/ZVH3N1VzN9Y9n3b970pJyWZ97F6bg1g4jQUApENCOeYbeHCm8qQ6cs6k0wewhwY3Bxo4uSU0vUlN9yGh6SB324FjXLT6cZ+zFqe3GnrZL2h2yU8r5nDeMTfUiONmLAt23O9WFA1KUh9P0uKYLWQ0pvzFF6Xm5wZ1gx9WeDL00QTLHI5Hod6bpyL2FIe0AHhdD2JoelfL+HH25exw2DPb34dVXX72ZyN7b/i7aWm5BOz6EpRkN1vUzsG7ooSf4MQRX56axys3rC9PwGFekIf3x2R5++N49PL06FcPoo/oOCtkMkokkgoGQfNEz/CxmpViEc3+8GSicT2N4eEkBhr1upEJ+FGIEv2QIdVaApNQO0j7sRAhgvm3E7Gtwb87Bs8XKT4ctAqCRPT459Mken9Y1AuS6hEC928v08zpyAaXw5YSrPstxPDmt4eMHdwV+57slHFeytPM4qhal8KVIEErGYjLh3c2TGgTeVnntMtCWXjuHReu1GkrFMilYB0HOgEX9MgFvXSnqkYnv22r+zybN8YoNmluO7PzCRTAMvpD0/sWQz2bpj4ad55dnZ8/+8OfN3r/maq7m+key/tP//Jct/q3Vz8L0hRuZG0dyZlh8Oh8uDeHBQj9Sw3dQ13TgTNsp8OPilUPaSVJqMQJSmJRafKJL8oH1qU6p4uT+Pa7IjBOogqOdpPJ6xPfzgNTfvrYHVwTUSwLoAd1fmuySkGdstAPpcaWKk3N9boJehJ7L1aOxsW5RmO7RboGeb7wb9zNuCVHuFbM4KGdRSsfwyiuv/MKsvk4CXl+nEtrkSs61ea00j8/xYNmJETqOyv1c3LI+NwXT8iwcW8tIegksmSg+vH+G9y6OcHG4i2qpSMopJYDgkKHzRvlZBHg8Ekgaxbnfz6LMyeOKz1jAh0w0jEI8hFo6ioNcDNUEKT9Sb8WACXmvAUnnOvzGBVJ+Osn7cYWnaZlbK+al4GWT/igxLjOwF+AyLiNi2yD1ZyOA+nGSDykVn9UULus5nJYSdDuLB4cVnNZK2C/nRH1G6XUEfV5pducdoNtcqMKT2Y/29lEqlAjkdhg2jVhZWSXwbWBLcn8G9Uh70yAKkOHHRS9sfyZ9f9wzyLCX1gePOjxXUX6cbyxmMqRCK58/vr6q/8f/8B+a6q+5mqu5/vuvo0Lqs9iKDqlFDRK6IdQWhrHPlZ3TXfD0t6A8weOEunFEak48OAlwCQKSm8DkGetCiFQa+3LWCX5HBDXvSLvkCdMExDKbUZPCY1heL/ThSkKmvaiRwivS49y7J5Zlk53IjncS5DrgH2YAdkoBjIcgyMUuXlJ+3PIQne6DgUOfzm0kfXZ8+vQu3n7zNXyZ5/M1ZvO99BI63nkTQz3tGOntxPhgD2Ymh7E6M6lMXR8fvpmyzv17Mm1+eowU4Dg2CI62jUVk/A4cl1N4eFzD1WEVhzsFFFJJZJNJpOKKTyZPRecGcYuEPZVJ6DIslmDIIUUXqb9YiBu+oyimEqikoignwihFvSiH7SiFCH6k+tKuDQKfHgHars0FUXpc7WkjZbo6O4lNUoCGRa1shiIrPw6X5mnvROzS8L5LmwtpTvJhXNfSuLdfxNkO/VFQSJLaDKOSSyk9f9zyEI+J5dnHH7yP3Z0KXDYbQW0TGwQ8CX8ajaoSVHaj4IWPRsML1Scm2Fw0o9qesRLmz8TpUPoBuRfS7/HRZxBGnHYxncL50dHnP/r4+82Kz+Zqrub677uitm1PemsBlTUtMnM8cmgQWam47ISr/11SaZ1SvMJm08e6ToJUOxL82EiXTF13k7oLkFILEbRyGoLfrJLn4+dx2wIDlNXgpVR99hNAewh8XSjS+TsEvMxoG9IEvwztFMEuQtfiohb7YIcUvWz1tsI00C5Kb2W4U1SZZWUWYbMev/aVL+Nrr76Er7zyJbzy8kt4lQDYcfsNjA90SeVmZ8vbYji9SGDjqQsCPNrT6hQGHW1pYKe9ROcoym8ObuMqwo5tFKN+nFXzov4uDnaxV61ICC8ejUpYT8KeBDguemHocbWkAj+zFH1w0UuIzosGA1L0ko0EpNG9EveiEnNJsQvvgt+EmH1d5vb5TctS6cnQ421YnJafueiFG+x5unuAzuMxRwWCX9ptkOM+we9yJ4EHewU8OqrgrJKm107q76SGc4J3rZhB2OvB0wf38C9/8gmKySiiPjfsJiMsBDue7m41KaFPBXik7ri9gfa2uhXXF4s6908ZeCsQZPVrtd40w3MrhPQCcnWn2yMOMKwAU9EYKoXi84P67rPf+93fbYY/m6u5muu/z3r/wZUntqJ9XlvXIjEzhNhUn4CvTiouN96OPQLXg4UePFnqxtlct4wX4uIT12A7Qa8TKVJ0rPoyBLOz2S5cEyQvdB04IAW4z0qQzj8llXdvcRBVTSd26Jo7E20oj7dhjx4rERwjw22w99+Bm67pJWXn4LYGuh0kRbk90AbTYBuWhzoxTwptZnwQfW1v4xWC3Ne//CV8g/dXXsLXvvIK2gl6va3vYLivC29+91ui8FYIHoo7y6iovcYEdX5MUX2jcl09gW9ZN4G1OZ6lp4N5dR4ByybKMT/evzjERw8upGqSm8a5YCQRi4qdF6sbzpk5CAJS6KLagnEOUO7nZneHQ6zOwh6XanDtEwByzm8v7UclohS9pD1GgR83unNlJxe9mFdnYV5WKj7t67NqA7xG1CE3v3u29Eg4t0RFnhaj0oh/Xk7i4WEFH1wd4OnFPvaKaewWs/i3f/g7uNqroBAjEAfd9HrscNss8DiUxnTuTeRQrZ02vw/LjcvLC8cXMbqWxyw3t1nlyjBc2Yo5ttvlgY8Un9/H1mdByY825v7lMxkcHxx8/uGzD5rN783VXM31D79qqUhLeE3/PK2fRHBqEMHJPpS1yty9EoGK9xEpvUNScKczpN4IhDlSakFSeh7VYSUy3ok9Hak9OudytkN69jg8ekA/s0cnz+TjvT/VQUrvDqrjragR/HYJfNWpLoRH2hESp5YuOAY6BHwWUnx+Ap9ztBNzdN/USB+mhnrxxre/gZdJ3X39a1/FxGAv7tx6Hbde/zbuvP0GutreRSdtDn8uzmgIkgOSw/vixPRpNdQ5qxnD3NQ4QW9YoMdenXxc0Y1jbWZSCl7s63pEHUYUIx5c71fwvesTUn41nOxWUS0WEA9HCGpOBRZW1RdTxgFZFUswFQhetxt+Uj4hjwdxUn/pSBD1fAK72YjM5DvIhgR6cfsG4rZVRMzLBLQFyfNxoYtS+amh1zZKr21cyQVKSHQGPoIfP6/IRS+kIln5XVeTuFdLkfIrIh1w4ef//Ef43//8j/Bgv4CIaxv7+TiSAQ8SQZ/k/3xul4DZq8LPofYsKu/FdvNeBHY85aGhBDn8yVWhHOZVJ0I0Cl9k5h8Pv1UH30ou0O1FgBQwe4zGQ0FUcjkc7e5+9skHz5rqr7maq7n+4da//GeftqTdtufR2XGEpofgm+hFju3KprnSsh2ZCVJ9BLCr+W48oH02w0bSveKqwiFJ71AbfEOt2NV0kNprx/lMB+7OECy1HTihc1kx1qaVHGFi5A5Swy04nO4g9UcQpGtU6bEkgTNFkHMR7Hj7OLdHis9F0DPqRqAjlTZLEGPovfrKK3jnrddRinpQy0RJzY1isKdT5uW13H4L+pkpTA71QTPcj6WZCZmzNzPFI4ZGReHNTI3R7XG6PSZKb06jqEHO9y2w8psaERguqhDcWtAKAHcSfnxw7xgPj3dlVt5OLi1f3ql4VL7MOZzHNmcc4hRnF56R9wWrMCcDkGAQoHNSEQKdhD39dF0fKjE3km4jsm5SbsFt7NCO29dI/eml54+ht6QdEejxgNuteQbzJL2uOdhJGfoJftwczwAsBTjs6ZLG9+NSEn/7v/4F/uBHDyRMeklArND7qKTCqKRjKCQiyLHPJ72eZCSCSGPaAxfwSE/eF5Wf4vDC4DNuctGLQQ1/qlAUVxuLKD4bw5P+IHC6XHKUXKA00dsFrG674nrjdzsR8XpQLxafP7l379kf/8HvN4tfmqu5musfZiUsW59F5iYQmxlFUDOAlIYdVbjSsg2hoTuk9jrwcKEbV7Nd4tDCPpxcvMLz9bJ0Xni4lWDH1Z8duJjtJPh1So6vwMpwlO3JOuV6XChT1bRjZ7IDuzruC+wRwCZHO2ROn2+wDfaBNriG2uHnnB7BTkvQ02uG8DpB75WXX8Xt178rM+64CrNA4PA7LRgdGsCqfg6akQGCXq9MS+dqzhlSeMuzGqwRvPS6SSxMTyhVnaT4dBNDEvrkVge+PTcxSHsIs7KHaSuFL2xtZl2ZQ8C0hoTLhINcFA9PdvEbP/gA33t4TYqljnKhgEQ8Dq9XGQkk7iiqDyYrI4YFKygPz7kjqATpy57za3G/C0m/Eym/HTUCINubMbQqIRNts1R82tdnpMfPsqwVhWcg4G0vTkso1LWlp9sM5nlRfiFSinm/UapBHxyV8b/9u99FjmDq317CewcZqQA9r6Zl0vtpJYO9QkrCoAxxHnSbikWl6T3g9Urrg0NCtXYBFgNdpruLrZnpZtLDF0OhyrQHqzoEVx17ZFOUIOf7HGKGbZe2D97c8B4m0EZp51Mp7pn87Eff/6RZ/NJczdVcf//rsJB5Fl3WITE/jsBkP3JT3ahMEaxIlYUIahzmPKH9kEcQkeqr0mO7Ux041HWRauuAZ+AOQa6d7mvH/nQ7DrTtqE8rBS95erys6ZJ83sF0pyjA4mQ3ga9frM1So+0ID7YiQeALEvCs/a3Y7r+D0e42jA90Y35iAL/+ta/g3Vu3JDc10NmG6dEBLBHIpkeHsLY0j0lSd6zypgh8DDxWeQsELR2Bc2KoBwvaCSxqJ+V+hh2HPDnXJ/k+Pn9cgaR2XCl6kePYkJyvJzW4qpvAxtwUgWcB/+P/8Jt47+4xHpwd4fL4ACd7NdQrZWSTKYRCISnpd8iXvWJvJm4vatiQc34uyafZFbXjU8KNOXpf3ENYT9FOuFGP83y/bWQIWiHLMoFrUfr9uNfPRsDbXtIS+HWSAzSt6OAx6kn50WOrWri313BvL4e7+QCWJwdxlvOiFrbivBjGg92MGF/fq2clB/joqIrTah57pQx2sklRf4lwECECH7djMKS9MpjWKYNuG9WrUuyyrYCuMe7IqHp9mk3Wm6pPfpzHH5nVWYAyBcKmAI8rQF1qXyFfv/G7quUK9mq1Z3/we581w5/N1VzN9fe38mG/J7Y2j/jsGIGvjxRfj6i15Ggb/AS13FgrLnQMvi6ckrK7p++W8OcOqbfw8B1s9rSIvVmBIFcj+O1ou6Qnj/OB8ZF21OhaFwRJPqZHOpEZ65SWiYQovTZEBHytCNLe7HkXXXfeRn9XK2bGevHlV15Cb0crkl4HPnl8Ba/ViJZbb6G/ux3jakiTQTXDIU21anNhaoQUG0OtH2MET25tmB4dVCo6vwA3pb1BgRxvjQpDZStVn9zvp58aw6Zeh9/58TP8T5/9C/zw8QXuHdVxsb+Dq6N9HFTL2CHVx60OQQl5emQrxtBKmE/JlSluLxzu4y96DnuGCX6ZaAD5KHt8BrGb9Iu9WS3mRJ0UYCloQpinuhs550fwW5mRye7i98kOLwRD06JGVLHPsikT4f2GeSxO9KEc2JaWiYOUB6cEwotSBPdrSXz/chdPjyt4TKrwsl6QylVRftkU8hz6JPhxJWok4JdxRNzzd5P3k9l+VmXWH4NNehjNLya8q9Pet7ky1Pjivka+0KG6vch2KtPeufXBJbMA6TMhNRyj371XKX/+0x/9sFn80lzN1Vx/P+uD67sz/nnN8/DMCNyk+HwEpvR4u4AvOtKKEqm5i9kuyd1dMfy4apMU3Z62A/GxNoQIbu7BNunLY+AlSOnVNMou0HVOCXp5eqzAvpt07u50N4qkAiOk8ng2X2TwDpx9LVjvvi3QG+xuxcJEP1556UsEwDaBk356HPVMBPeOa5ieGEHr7bcIXEPSg8eN6POaMcnVcc5uhu5nVcgqkBXfSF8HJga6JHc3O8mAHBUINhTe1C9ATy2AmRiR8+bp2usLOpRiPpSjPuzE/dIkfr1XwtVumV7PLs4PdnFYrYjyK+byiITCUsbPX+xic6ZORGgMhWXDaFY97O8Zoi96Vn7poFd+Rz0VwH7ahz1Sfqd5H/I+A3Jeg7i8BET5zct0d57lxxWeq7pRUat+gl7Ws40t+nljZlTCnvycgs+IctCMWsSGfVKS5/kgrisxPD7I4+lRCQ/3c7jezeNkJ0fwy2C/lCMAppFPxJCMhBHhnJ/LLSOJXGrrhpMVbQN6pPK4v8+8/QJ6L6pbzS9aHxqOLzcjj+iaPPLI5ZFRSDa1OIjhyu43sVAQe9WqqL+f/16z9aG5mqu5/o7Xw9PjlsT26nOedO4c74NrtBs5TTcqBK4UgY1VXXaMC1jaJId3NdeBx0s9OJewJ4cz2xEdbUeMoBYl1VaaaBPo8Xgiti/jsUPliQ6UOPQ51o7CGAOvDRs9d2Dpb4Wp9w42+u6gv/OOgGpNN4KvvPoyRvs7MTncJ7k7Dkkuayewl0vguF4S+I0P9WJ5RoO5qVFVzSmhyymCHm/NSJ/s6VFWfp0Yp+vpp0cxOz6stjYM3SjAxkT2Rr+fblJpdViZm4ZlTS8N8MZFbiuYQ8JlxF46KCOCLutF3K0V8fTqLk52azLVgS3CgoGgFLs0JiLYrariUU2dlVFBVmkg97scBD8XEn6e5O5GNe6RkUblkAXViJWOZuQ8PKV9nWC2iiAB0Lk+J+DjCRNJj0ks0Jboj4WNmTGBIs/6C5iWELGuSuFL2rUp8Dug67Lye7yXxnv7aXxyUcX7pxV876yOewc7OKrkUc0mUEzGkSX4xUMhBL1ehHzKMFq3atn2QvGZ1OZ9y814I5Nso/QEmhohUAGiUvzC+T4nAc/l9koFqNViVwGpVMFyYQ1/bhz6DNAfB+lY/PPz4+P6X//VXzWLX5qruZrr72b9uz/+o5bdqO+5WzMAr2YQbvoCzUz3oE7KLE4g2+5+G6GhFoJZG05mCHqL3QS/TpwRBO+LAuzEESnA4ylSd1ru0+vA4XSX9PJlxztQnOiQHj6GYYYUZJ5g6ibgLXW9i/Veuv5oDyYHe6Xfbk03jK9++RWM9HdhdKAH44MK+NhmbI0gFLQaxZD5qFbAcH+3DJJlWI2LuuuXwpZG7m5qTAHg1IhyP8/imyAAcii0EeoUlcfgU7cUvEwo4FvXK43knC9c0o4rTeUz4zJJ3W9eIwXowUkxgfuk/q4JGu9d3sURN7mn00gQ/Lja03Xjj2lXgWF9oYZ4qK3FAq/DjhDn/DxORL0OpAIO5IPs7mIThxducN8JW5EjuGUJgElScuz2YqbXkfOZEbeuQDvYSepvDBvzDOhpqfi0qa0QDEFul8jSroRtOMp4cVUK48PTAj65quPTR8f4zWdXeHJcxXGZVV8W9UIGxVQc6WhIrNcifq8AUEKfXPjyhTFNjbl+3LjPrR03o44MRjG33ljnvYmtTaOEP7kJni3PGIKNXKDt5rZFimeMW0YYNzZhN23DTdfMxKI42dv97Dc//XFT/TVXczXX383Ke5yfOSaH4J4chGO8F8HxbpnAHhu5A1vvbfgHW1AnsJ3P9+C95V7cI+B9uNqLZ0vduJ4lGOp7cEUArEx2iL/nrhS7KG0L+QkFfqz02KElNtwG72Ab1knxrfS3SS5tntTV4mS/2I8xoHgz+BhYAsQFLYzLczAs6hB1mvH+1RFc5i20v/u2NKw3gNfI2zXClxoOeXLxC21Wk8M9bZga7oFeOyYhzekvQG+anqvTKG0P26TslnXjAr35KW57GJZQKR8XpkewRXCJ2DZRjXkkV/bJgzM8uz7FSa2MWjGHQjqFZDQKH09B5wkGLsXjkyefN6ogGRJcOekm8AUIfKL8vAQ/jx1xrx0pnw25gA3liB1lAhbDrxI0I+PZIhW6IK4tjlUtNARzrvRcn5vE5rxGJrxz4QtvC6k/boj3GRdJKS6RcjRgL2bHw1oMTw+z+PTBAX7/06f4nU8e4OlxCff3Sziv5nBUSqOUCIvDSzYWkrxfLOAX+HF+kitUOfzpJABK64ZFadpvmHbz3iRw8XgiPq6vrmN9bUMAyJ6gWxsGCZNK0QtPfXc4pQFeyQ1uCzTZPYZhyqHWWDgs7i+He3vPT4+O6n/9eVP9NVdzNdf/z7WXitf9Cxr4pwbhHO2WyehxAlV5shOR4TsIDt1BQdOFczaZnu/GRwS9D1cJgvpOPFroxBUpwTpBrzLeLq4s3Kxelib1Dqn85Fwhtz54+/lapPhoL5Li40pMbkSf6GuVnN5gdzsGaA8SzHhz0QlPUeC2hIWpMWk94CrMuMeG+yd1bCzOoa+jVW1L+ELFJgGPC1r4+qwYG6qPvTtHetuhG+uX/CCDkp+n+HdyU/sYKUuN9PhxW8PcJO8h2Zw71E0MEoiHBDLsnZlwGnBZTeP9sxqu94p4//IIj073cFwrSZN7PpMVM2iv23OT7xOVpPbIWS2KtycD0EMA9NjoaDMj4LAg5rYh7bejEHaiFnNJg3oxaKE/AGbhXJ+HjgBuXpyCa31WGtp5MwC5129zXml7UApgZuDamEPQtIic16jk+5Ju3K8n8dNHR/hXz+7i0/u7+Ph8B0+Pini8n8NlLSPwOyzRsZxDLZuUvF8qGqYdRTQUlFycx+VUwM7epVbLjdcnm1pvEvTWV9ewRnuLlB/3/m2qR6NRKX4xbSt5QSn8Ua3PrOrnw7cZqlz4wmFjdsrhPyT4D4piLv/ZowcPm+qvuZqruf6/r6fX5x7r9MjzCBe4TPTAM94p3ptcmLJPqi092oaC2nB+qe/FBYHuwXwnnq30iEXZ3dlOUnXtpPjasEM7M96K+HAL9qY7lQG2BMTcuDJvjycwrPbdkTDlQFcbelrfFoPpvk663XEHp7Uiwn437txpwfz0hGo3NiTqjUOYDKS12UnspMI42y2LC8sgKUSBnii8PjU32C9FLtOS7+sXAPKeGOrFWH8XFknRscPLvHZCiljmaPMkhFlRjYMCulkVeFIUM6FsVn0c+mRAeo0rMjqI+/DuVlJ4cFjC07t7Mhtvt1RAKZdFMhaH3+eHy+WS/FWjypOh1/DF5IGwZoKG3WQi8Fngd1gRJvDFSP0lvaT8gg7aNlKhY9BrBrE6NYTdOIHRuYGEY40UnV7AZ1qell4/tjXb5naHpWmBnmNtVqa/8447NlEimB5kAnjvuIjzUgSP9tN4QvvRbhL32PllL4/7ByUZ0Hu5v4PjagGH1RJq+YxS/ZmMS+M7N71zSNfjVBxsOKdnIIW3SeqO98aaOtpIbXrn3bi9SeqP1SA/zuFNpQHeKke5bbHchITNaiO9jYDIFnBcGZtJpp7vlMv1v/jzP2+qv+Zqrub6b1/VbKolbFx9Hl+chE+jzM9jhXc5Q/DTdqA2yaOCWhEabZdpDOdzXXhI4HtE+66uHVl6LDDQIhWgeVJ8DME6qb3j2W6czbJnZ5fM23OTklwf7JQcXm97C9rfeRMvv/QSqbwOaTD/8eNLfPjwEm2dHRju77mBlVLgorQYcGM5O6sYl2alGrFWSGKUzh3u65RKz0ZxSwN6Uyowp2+KWYYxQWBkuC1xDo/Ax/ZlW4sz4hLD53PjvFYNf0r4dGLopm1iVgWg5P246EWvRcC8JsNmz3dSuL9fxMOjHTwW5VdRRhpFItLq4PP6JOzJqkYZ97MpyogBsbW5ocDPTPCzW+Cl7bOb4LebEXJsI+nZFtCdFwLYSzil4b0WtUvlJ1ud8Vw/7uczE/yMeo0UudgJhhZSfUrBi54gvYaIfRNh2wbSdL18wCyFNJcEvwfVGJ7spvB4L4uPLvfw4cUeHh2Wcf+oikcE8rukYo8qOdTzKRRTMYJfTOzHOO/HYU+Gkkkdbru1sSGT2Lck3LkuEGwMv+X7bja9fwlrsjk2G3zzrMAvzjrk4hg17LnNgDQoRTM2Hv5LYOTQa7lQ/OzJw8dN9ddczdVc/23rT/7w91sqYffz8Nwoga8fwckeZCYVaHE+b2+6A7FRNpNuQXGqU9obuLDlTApbCHLsyELKMEvKjh1deEoDF7ScMPRI9fEMP99oF+Z6WwloXejraEHLrdfw5VdfkZ9ZtTnWF/GDRxdob29F+513pWBFilY4R8eKTQWYtpETJIXGDduPzupIh9zobmuRqQwMR61a4PKialM1p1bzegzBUQKltD7QfQw9hpl2bEDUXeM8xeNT2bPSKjEs1aMccuU2AgYwKz/Hhh4prwl1gt+DgwIBMC35Mlav5XwWRa72TCQQCSlhT86H8Zc+A4+BwPDjohAjbQt9sTss9MVu3obLaiL4mRH3OlBNBkRZ8hgibnQ/yQewEzKjHDQi61pDzLr8An480X1xSmb7cejTvrEA56YeHuMyAXBRABi1E/xcBlKObpzm/Li/E8WDWkLA995hHg/3Mnh2t4bf/OA+Hh9VcHcng1omgnIygp1MEqUUqb5wSLw+vU67KLHGhAcGFb8fBh4DTtTdOr/fDTXftyZA5M/AYDBIA/xWY+itqv5sarGLkhNVqz7VghoxByDVHKA/JIIeL6rF4vO7R4f1//z5f2yqv+Zqrub6f79SDsNnPu0wAlODCJPq85NCu7/UfwM2bmR39r2D8EirGFCzUwtXdnIolJ1dKqTq2J4sRbs+o0x4YNeW/FQPnIPt0HS2YGRAKTB5963v4mu/9lWMDytw4ybxWQLKO2+9RtB7R2ko57AkQY8fHxMIKgDUquOE2IB6cXoUSa8Fj07q2F5dQOs7b8k5Og5NapS5ezpVtTH8xNaMrznYiwW1oX2DFJvk+caVJngGnFbU5bBqaq20NvBcvwZUpbl9clhygcszEzCvzCBoXkHSuYlS0IajXBjH+RhBsILz3QqOajuolkvIpVIyqJW/uI0Gg1IBSVtRNS/aAcwq/Dx2K4JuJ2J+D+J+N/IRr/h71gl+BykvzosBlP0G5Nyk4syLiNB2b8wK+DjPx8UuDGXr6pyAj4tdeLIDh0W56IX9PfOc9wtbcFEM4aockYrP47QHn1xW8eykKCA8KURwmIuI/ydXfrLdWZEAmAwHFKNrp0MUGL9mK712rshkNWtqvC+u8FTBtykFL8pxdWUVawxDBiOHQLcU8EnFp4w9oq36fzYqP/mz4z5I/gPCT9BjizUOtUaDQSSj8Wc+j8/jpf+KpYrnZ//iZ00LtOZqrub6f14npexnbt0IAtNDMA11yqw9dmepjLfifJYnNLQjOtICH7c26Ni3s1P8O9nGjFVdkcDnYycWboAntchT1H10jdB4N6a670ilJReJtN1+A9/59W9ianRQIMRTF9puv0n3fQ3d7S2Sb2NgsWIbGejGrHYKfT1KPpCdWpRw55g0q3PF5QKdmw048OBoB6vzWvR2tkq+jkOYM18YR6RRf9/YYA+mR/sEoJwrFCNrghsXtvBzrJsrOK/l4bVuQUsg5GvNqgAVxTmmhD1140r+j9sj9JphxUNzZRY+UlVpjwmnhSgeHZTw5KSGi90yDsoFFNJJac72e7jKUzWxNisT3Ldl0oH5JsRnNm3DabVKuwMD0O+0IuS2Iua1oxz3k+rzYi/hwm7CQcptHUn7ihzD5iVSz3Myxojh5jIsSlsDw5AnPmwvTcnmvF9gW4+YbRUZt0GmwldCVlKRFpwQ+I5THjwl5Xe3GBG7s0azOyu/vXwClXQUuXgYsaAPIY9LcpNOswluel/i88m9i9zrR+9pe0sJcXJOb21lTZQuF71ILlDu31K3UgCzwbelCEZpfxD7MzpykQwrvXg0hkKePs98EZl0TnY0moTHE6DzbATTTaysrEuPYDAY+bxcrtb/7Z/+WVMNNldzNdcvrnIsVN/mdoaJfphkHl4HdnkQ7UwH3lvqwv2FThzNKP6bd+e68XihG0/03TJk9oBAyMNro6MdYkztHXkxQX2SnVgIKGz43Pb267j91usqkIbQ1/6OTF342ldfxUBPB503KeBjJbaqn0W9VJBw2HcJlJwXnFTbFhp5OM63NYykL+p5PDipCpD6O9tUd5YXoU3NqKIeJZxJv39DP60oPAKenq6xqJvEXi4q1ZlPTmvYz0dh3VpR/T9HBNSakUE5KlZnHE4dkK1Ti2G4/cFM8Is7tlCLcggxLPZgD/aLOCymUU7HESeVxLZcPnZ3cfyia4lJLeVnNShN4AxAOtoIggwW3lGPE9mQB7mgE+Woi9SfR3rzjghWuzE7sh4DUs4NhC3L0sPnMbCZ9ZSMMzLScVvdm/PjAkZ+3ENwDJhWELaukQrclCpSDnXeqyXxoJ6WUUcXOwmCIH0+9QyO6LOppSMoxUOI+XjWoANhrxMBpx1ehrTLIQC0S8GLEaYtg4R0OZS7JdWeqwr8llcFhGurDEJWgGtYoft4cysEfxYcFmZVl04mkMvmkUpmEI8l4Xb7YLc5SS1uYXFpFXr9EmZ0s5ic1GBKM4VZuj0/t4A52uwu47A5n/3Wv/qtZi6wuZqruV6sYjTosc1Pwacbhm+iG/HxDpwQ4K7nO8Wp5YPlHjxb7pW5fEcEumt9D05nu3F/vg8H2m6ZsMDTFXikkJUUI+cKdUPdUjm5OqfBbZ6bd/staRvg9oHbb3wH3/zaV2R6ukBNeu36pJ0hGfLiAVcU3j3GG699W2btDcs5fTfwYx9NBs3GPPesTcO9uSjP2cvF0N36roBUAKvm5aYEeMNYmp2SvkCuGOWCGq7qNCzNwrg0g7X5aXjN6zIl/aySxD6BcHtlASPccsEFNuMj0uDOIVBRrGrolEGsVHyOwETg84jq20Y5ZCP4BXFVTZHy28HpThZ7hTRKpPwS0YiEPbnJvVHhycBj0LM6Ykg0CkLMRgPBzySDY8MEvrjPgWzYg3LMJy4yx7kADlJu7MYd2Is7xcmFLcvY6SVsXZE+PhspQPOKjrYWBobfklZ6/jhMu72kkykPHA6NEvh4rFEl4kDebxbT7GrUId6hF+UoLkpRHGZDOC7EsJeJCAB5FxMhJPxuhFx2+Bw2UakOq0WgbdnmKe/bkr8U+KlFPaz6FNitYHmJ97Js/pmBn4iGkU6kkMnkkSTguZxe+ozM0g/IYGSVvEYAXVKfx+0T2/QZugi6nHtk70/uk+RCm4W5eawsrTz7X/7zf2kqv+ZqruZS1k8/+cDj0mufR2ZHUJ0bRIrAx1Ma2Jnlk9Ue/HSjDz9Y7cWRtksmsVenu3A204N9OvKkdTaZ9hL8zDxlYawHoz3tovSWtKP49te/ipa33xSVJE3lBAweGHuH7hvp75bw47g4tfRIoYtzfQEnpSTeJnXY9u4tDPV20jm9Uo05JW0Kg1KBuSAm0iNY1Y1Lb13Yuonv3z9G0m9H6ztvy+/Rqn1681PjWNPrsL2qV+A7MSoA46Gz3CPYaFdg9cZjj6oJLw5J2eSjXmwR/LSTY5idnpDn8vMkdMpVo2oPoUxzILW6OjeF9XkNbGtzUkCS91twnA3i0WER7x1V8Pi4jsNKHrlkHJFAQEyg2b6Me+A437extnaT++PZdwxDq4mrGBWLs6DMsXMR/BTlV4l5Jex5lAlIoQr36VVp1yJWHCSdSHP+z7oKL7u9EPRY9XHVp4nAx/Dj929anhGl6iDwcWjUY1iSIhgeaRQyr8isQL7mUdqLEwL5GSm/s1KM4Ecg3EmRAoyR+vMj4rEh4mbVZxblx/CTIbc8gV7eq1veK0OewbXK6o6Bt7iERb0eS/pFmAxbBC0n/VHgRygUhcvlF7uzleU1gePayqo8rwFJhid/Vl+0TOOqTyf3RJIC9ZH69NHRtLVFP7uf//VfNQtgmqu5mktd2Wigxb+x8LywMIbj+X4cENQy42w23Y6PSOl9j1Tf/flu7E530P1tAkX285Q92Y49Oj+r7UFI04MxdkghMM1PDOLVV17Gu7fexBiDjQtVCGAMOgaeUqmpVF2y0wqDZGVmAusz46T0voXOO7cxSuePq2qw4cKihDoHpM9uaXoUy9oxsRPjY8prxqPjMoFugpRiiyjDeW49WNAJ+LhFgYE4NtQranFuckSt6ByUYhoGGgMsaNmQGXYP97Ki/EzrS5jhvkICKKu+KbX4ZUr1/WxMh5DqT9ors9zkPo+404D9lF9U30cXu3hyvCPN4fk4TyIPyEBbj8MhBS2NQheDGhrklgf+mb/M2cWEc34eUjN+UlRRrxMJgl+elV/UI5MZuOBlN+7CYcojClDcXminCVzcwM4VnzzYlotbWP0Z9AxCrUCPC2C4KZ9HHtnXlN4/PynFmG0Nea9BFN9Jzo9He2lSsQHJ/d0thnBdS6FO7y8bdiHmtdLrsiMV9CAV9iMW8IoRN3t9cs+fy2GX3B+rMg53ri4vC/RWFum10fvjzyERTyIaS8FgsGBhYQlzs/NYXNDTuStKYcy6Uim6sbGhtkKYJP+nuL6Y1M+ObdM2sU3KktUyD7+NhkJsJ/f8eH+//id//MdN+DVXczXXl770k4+etWSsW893F0dxMNeLq+UhMZ+OjrXheqFbMajmFobZbmldKKvQ25nuxLm+D7kpUn70XFZ63JyuG+6SxnSG3khfl8COocfm0qN0m0OFjb66mx674V4Md93Bt7/5a+jteFcUHm+BpQo+jVrZyVWVPDhWJqnTkZUfm1Cvz2lwkIvJ0NXxgV6xPlud18kw2sa12OeTz10kUM6wehtRm9xHByRHuEhKdXtpRrww79EX+6ODPMoxD5bmpgnQL4DXCHvq1AIayQOqbRd6gi1fI2BaRdZrEjAx/K5rGdwtJ3G1V8FRpYD9ShGpWEzG83Cuj3vYuCBEvtRvqjy5TcAIC6sZAqTTojS6h0ld8TDbBvxqcS+qMZeEJqtRO6k0O3ZIqfGUhphtRTw+ZcIDbdv6vAyyZfBZuPhlZUamvMucPynU0cG9MYeIRTG5Lvi3USWIlgLKqCO+zX8UHGQDKIbZX9SBQoReRzKMnUwchaQy4ojHG3G7g8vGxS4mJdzJXp5bSr6P2yDYliwcDCMUjsNotECvX4Z2Wof52TkBHocwlWb4LckZct8fzwFUKkBtv+D7eeP1KX9EGKTFglU1O82EePBtMIhCKvP50/uPmmOPmqu5ftXXDz941hJanXt+ujyKmrYXCVJ7viG2GGvBsa4LV3PdeLhIQJzvIeC145Rgx83sJQLe7sIA9pdGpFVhfKgHc2M9Ar3Wd5QwJYNQwpnsmiIhSyVPp1P75LiZvOvOLbS89V382ldeoeu0i8Jr9PJNfsF5pWFbxqHOOXViOheWzEmLw5g0lW8v6nBRzSBOCmRJNyUFM1KQMjqgKsc+UoejchwXGCtQnRbwDUuf4NqsBublWWRIQZ7kw7hbiSNHqobDt1PS16eES5U2if6b3CNDnMOrPC6Jja05fxY0ryFiW0cxaMdlhY2ti/jw3gm+d3WM070qCpm0WJtxg7sUu8jsPrPihMJf4Gquj7/IG1/mXDzCxSRBF22nVTw+eZp7kV7jDkGa+/2OM37sJ5w4TNixG2Gvz21SfxvwckHLll7CnRYCHh+NCxoJgW7OTQj8GHyO9Vk6b0GUX9i8goh1BRn3plSAloNW8RCtkcLcS3hwzJ/RTlbymAflDCoEv1Q4gIjfg6DbIS0PAkBSfW66zUbe2UwGO5UKAc2I1ZV1LBLwZnUzmJd83BLWV5QiGKXZnUAp5tfbyuBbnvjAI4+47UEdemsyKRWyJvlDQRmP1Jgewc4yjaODzs8lkyjn889+62c/axa8NFdz/aqujx+ez+ysTOHJ6jDuzvfiYKZLqjqjw3dQImX3YLEPDxZ6ZF8S/PZ13ShP98Az3Ib8Aim9vg5SWF2YGekSN5butndV6PUIXLiHrxHmFGV1MxF9ELff+Da+8bWv4KtfeRUjvR2qMuy7UXwTw0pPn0CFgTmmQGxO7a0TRxW6zQ3lejaWJhVoJPg1/Dvl940px0lSZXz9IYI0v+ZRUqNsYzatqj1xaJlUClU45Mnh0KR7G4eZIE5L9GUdcol6ZLXHgNOMKq0SL6a6D6m9hooi5b1Er2trga7jMpDiS+M+7R/cP8azC8URpZpLiw8mD4BlKDRUn1WdVrCtOqJwGI9zgQxEC093IDi6uNrTbpWcWshpQyrgQiXmIxCFcJhyS0/eec6L63IIOyGTqLcAKT/X5hzsa7My2JYtztjejI883cFKCpB7/vgxI93Ptzk8yrnCnMeInHebFKAZ5YBZKkkvCiE8O6sQ0Au43i3gsJhCNRNFIR5EOuxDMuBBlADIZtzs9nK0u4tPP/k+0omkvM/VpRUpPlleXMTG6io219ZIsW2K/RmbW/Nm8Emzu2z6LBoANJqUOYA879CqTH9vDLt18OxAdQ6iTI83KF6i3AcYJiWaiERQzOY+f3j/flP9NVdz/Squ++X0s93ZPtzX9+L91V5cznVhb6oDOc7fkbJ7yJMZCH6XMpSWB8m2wTLQCtd4t1RijvV3YnqwAy+//BIGutoFeI2tjBnqxmh/t6KsbiagD2OorxPf+fVvECjfETXG1ZNjKvAaji2i9sR+bFAxnx5VWgimVYcWvj0r09eVaQq8p9XevZs5fV8YNMv5xBH6vaO9bZgY7IZmqE8xtFYtzlgJ6tQ2BQYYhwN5TBD7WDK4Yh6L5Po0AlNlGoS2EbKVXj9lcyGOlgGtGVaaydfmkPFs4ygdwPvHZXx0tYcndDwjlcRz8BIhHwIeZRadMsvPLl/aX8z7SbtDw77LaBT1xxWfLquVwOJQ5vqFPShFXKTGPARsHy6KYRym3RKeLHgNKPgMSDvWETItipcnz/djhcehT1GAKvAYgmY1DMrg8xmXVAWoR9i0JNc6SDgI5HHJ9XHBy1FeaXQ/yMdRz0ZRJPhlCH4hem1H1TJ+9uNP8PD8VIpeGHLLej3Wl5ckH7ctTe9bkpfb/kKDP4c4f7Hfj3v9XjS9MwDZ+NosE+IV+CmDcU03U+IlF2hW/pjgsUrc9B7y8uftQT6VJhjvf/bDj7/fVH/N1Vy/Kuv/+tu/aSlsLz6vT3fhWNeJR/ouPFnoxjXBr8pVnKT4Lhf6cEi379Ljx6T2EuOdMAy0iUE0Q2+4q0WUHntmTkgRiwI9ye2pAGSgNIA0Kc4sSthRgdyAUuDCLQIN4KljhRqAE+/NEUWZNSAlhS4NhTWphD0N9IU9MzHyC4Nmp9Wc3JRaxCIFNvRaWaVODCoVpY1wLE9v1wwr4U9xZ9GOS69bLerEXfpyPy0n4DSuKcCb+MUWB3l/nIscVnoGebPLjJ5UH4dgPQZudTCLguRrcbXng4MSDopJ7JBKYg/MZDRC6i8k8LNIvs8gikex/toQVxSpZDRsi0cmV3tyAUdArfhk+KUDTlQTAdytJHGU5YpPJ46TLuxGrbQtOEk5UPJuSe6P834Wnu7Aji+k+jbmaBOo12Yn1Bl/HPqckSZ4C23b8rQ0yidsqzIwd4fHJsWc2E35cF3P4iG9n2d36/jwcg/VZAj1XBJ/8LOf4i//6Ldx76CK7Y01mDbWYTUoM/fYnNthNsFpNcu2CaDMks+TXKDa4rG+tq62Mih7k0ccMfgML0KfZhPP9yPVbOacXwOCjRCo4oojxgEMSqPy+XnsdtmlbO75+clpc+htczXXr8L66MGlJz/dIxWbZ7p2GTP00XIfznUK9HimXmq8XRrXz2c6peJze6hNYDFB4Bgi6L300pdu8ncvqjeV4pJxAUm/QGuysYcVuClenEoIshE2vBkvdDNUVmlCnx5VbcfUnF8DkByaVMCoqCyGzpzq2nIzYX28YYPWJ3BrHHk6++RgFwFQyUNODPfKa51UpzswSDl3uLkwBS/Bj4tHDjMBXFTT4hXaqOZU+vqU3z010n8TOlVCsSOKzZqYa+vgNiwh7twSb8+rWgb39wsCU1ZJO+kYMrEI0rGotDs46Qu5UfGpjPfZUiYaGJVclu0LY424dJ/NrdnYOhPyIuUnENq3JVR7kPSgHrHhJO0iADpwmLCJ12dKlN+SVHHyVPc1zvGR8mPordOWgheC4dbcOFanSbnOjsO0qIGLYBnYXkLKtSVquJ7w4LQYFZeX33hyip//5CnCdgM+uD7Bf/0//w98/kc/w2U1A9vWGiIuzkk6pN8v6HaJ80uAjh5xfeE8nFmZ4G5QKlsNDb9Pdcaf/BGwqbi7bKqfx5ZAcFvyhUaDSQDIIORCGNlqu4NRnRYh11lfF+XMrSI+LrDx+1EtljgU+9knz5411V9zNdcv86qalz+/JkX3SM85vG7cI6XH4LskyPG0hcJkBwpTXShOtuNwtgfG4Q5oGUKD3ehvf0eUnii4of4XwFOPMiJouAGqASUfpu4bCI4MSohTM/YiV6Yovgb0lHPl2LiWCkyBJx3HhxvFJQMydkgz0qd6dA7JdRiwEyP9N79TyR32S35vnM4fI4BzLlKjKlDNTb8gqUm2SSO4Lk2PiNflXtyNB7UUHu7l4DGuKs33tMUcm71CVT/PRs6woVZ1ahUqN9zb1+YRsqwjbF3HTtQlrRMXOxkcFlIopaKo5lLIkfqLhUMy845Nmg03RS6K/yUrGHY2YfCJwwupJjOdY9s2wGXehtdqhNe8SeAzoxBU5vCd5nzi8nKS8aJK4KuGLaTcVhC1MPxmYCMAbojP5yQ2CHIGPs6MYVEziIXJQVKD47QnJDTq315E1LaOtNuI3YQb58UwnuwmRQGys8y/+e1P8V//9r/g5x9fIeE0wm/aEA/TaiqMUjIig27T0SAiPrf0J3qdDoEfO75Y2LmGHWy4oEfe9/YLs2u1gV1u0x8D7N4i6o/OYQBy/k/Cm6QkLerEB4af5Aa5N3JLUZLsKGPhc2jz7D+/R6n85BBorVR5fnZ0XP/TP/mTpvprrub6ZVt/+OlHnrOlIdyd7UJh/A4eLfZKiPO9xR4cTrUjM9aKBKm95GQn4hNdWB7qEL9Khl5Xyy288vLLYuXFJtKjagHLiBraZJA0qjMnVHXWAJvA5wZC/Te3GzCbHPlCj58KSbnOF6Y2SMiSf1ZDpRNqWJRhO9LXIZWe0yr4JkdfXJeVmfJ8JY/IucdxzvWNKAqVAd4AHwNLK8UxA1iYGhYVxLC6rsTFy5JVztbSrPxOBt+MOgW+oVo16jzARm6SQ58LBL+N2UlRU46NBaQ8ZpyWknj/pIqfvn8Pz873cVbNo5RJIh2P05dxQMKe3O6wLUUuWzf5ry31yGpIvswNWwQ+I5wmA9wWI4LqUFv2M+Vqzz1SmdzsfpTxYDdqk9Bn3rOBjHMdEfMSPKTkOKTJwOMKz3XdGFamFT/SFb6tGxVlyIUvnPfjnB97fXKf337cCdvKDI6LcfzNX/8p/uYv/gB3cwH4tldwnA3h8X5eZv1d1Enh0vvb5xFHiTByBD8ufmHlx83mbtv/zd6bNjeaZldioxmpW93qTd1Vmcl9J0GCBMF930AQCwEQ+74R3PedSeZeuVRW1l7d1V3qKrekUY+snimFR5rwTNhhj8ZjT7js8Cd/9dcK/4/re+7zvC/AbPujuksOPBFPvACIPaveg3PvPecovWKMGaGR+KDASnl+Qt7g1H6fTocafgHzMyUg/BglefDpYSCfyQSXtSYSrDK04hdzAPywgIMO2DW8QJEyj7ilrbV1enB176vPf/5Z1ey6uqrr/0/r5Xry68PBRklLhwn1g4kWejDaLDl8Vwx8G/1N5OlqIEdXEw11NtMwQK6rlWp/8gOJFcKJHUAkgyw9euvLRq/PLGdqxjegwce4DWzNboKfAjlDFzcojE79DaJzkThUsLd+I71BMzg1PNMjfccB6AkHe19jlwrwcH88X79VlWf7+b7WzhZ+zx1SqlTDLhZhjmBwo2By/LxTQ1aZ0ATTubuZovu7OfHM9MyNaZcYm5Y5WMvaPq0TNMqw2ON62hOuKatRL93bLdB71wf06nKXXl0d0PPLQ3rr7gndPT6UNHfV84tIaS7ILEZl2ikxt0eX+5T0wc1syS2G0QkGkKRMe67QGmzOxN8zJuVaGFxjMAWs7zC9THsJD62uLFAC056OMenjLU30Mzj3C+jNj/YJ6C0yC8QGK/RLzt80ZXxzlPPPk2d2nN7h9/5//5//QJ8/PRLPUvQPv3h2ImwQRtcf3D+S/t97fITe8nijwOxP7c1CljbzWVrLMwtMJSgdjzELZEBiMILjC3pzRq8P+j5YmyHhwanNrt0CfjC39qiyph4K8ugAXGUErmKPVNyR0ku69QCNSpBf1oG3EcomU5L5t7228fXD6+sPv/zNv66yv+qqrn/q6199+uFpvqeWQa9J5AvZ3jo65ssocV4z6J0MNYkV2XJ3M40wkIjujY/w3fzjb39LsaVuVda0aZG56u91aRDsNEENjHBAXzbYmUQE9XZXgJlmgWafzyqXjVKmoeuz63KkrafTvF7W/ClwG0fJs6tFSpmVTE+YKUqwJutT7wPvvc+i+n1DVjXkYmj+zL5dv0UkFNAAAvxKEQ892MnIVOPxWpxcc+M0ysAHezM1SKPevyrNdmkRv/pBgNfHMI5jYojCrlnRC16up0Qwj4nPz55f06cv7kuyw73TA0k9TzETASPByVuV7HSiOQDQaYCgCrRV/pg+YU9IdE/zRm9tLRmk9USADnMhZmm8mfVB33eS9dFe3EXbkUXKeacZ+IbJOz1AC6N98nkBekuTg+RgIHRMDMgAEbL+kErhmhyioGuOnp1u0v/w6w/pgkEVt8M39CyHzMCAeHz+7PEJ/eKtM3qfmbIkvcPwem+Nrg+36O7BDp3tbdHR9jrtrpdoNZOiXDLOnzkqjjXw+sTn8vBnXYKgHekOSyriyMj/c7sVgHlxPxHJe83Ed48ReIu0By19CIXCSvCuZRJKJ6gMwiEXEau4YJAivIvZHD1k9vfrv/iLKvurrur6p7wexDz0bBI2ZJAstFGpr4HO+TJCZq8Y/DbtjXQw0k6OvjYGhE4asbbTrR99j77/J98VYEBskAF4wp40uwO49GtpggEqAxXAZpQq7Rr4FMvr0ZOdZcAbugF8RihtjwawThOcDCY4UNGfG4fI3dYlej1jGMYYvLH3lkHP3mspD+HgCD2ipUV6fphGHQBIWjtN8Buzd4tLDAZeYPW1n12hh7uY0CzQTjYsAvdBm9X8PAMC7Oq9ism2VdmvgQlODtskXcK3MCnG1gf8+Ed7Rfrpk1P69MkZ/eVHT+np6Q5d7K7TTjEnYAAnlIiWOeCkrQY7jMnHJRkEgWsJJhaRjRdBXFDAJy4vqRAfw35mflHaSodkKGU3hTgiv+T6HSRcDIDLtBaap7hrgnxzwzLRiUnPhXFmegx8M8O9UvKd10AI3WR0eZH2+LmOswGJQ5qwd9EBs8hSYI62E14R0r88KdHH93bog7ub9PZxkd673KRPHp3Qu0ivuGJGyAB/sb9Je6U8bReZ9WURdxShVITfdzQkekUBP933U70/7eTiNqZel1TUkU61xxYm6PZo0btyelEWZ+gB+smnY6HM8qhXGQUodxl1xHcZDWJ4KEp7m1tf37u8/PC/+du/rQ6/VFd1/VNbJ6nQhw/G2ukeM7wNWwMdD7VQjtkfLt8da6G9wSYGvVbyD3Ywe+qhmYEe+skP/oR+/MMfqD6epUMzPVXWtFdMdJYBqjy1KeVK281+3g2WZwy+aN9OA/wGb/QBLRr0DKDtNMuqxqSmOKjovtzUQLewN0gshgRwLWafUNmgdZpaQ8MEGyVPG0q6zPxQLpXJVQO0ejtpWMsUppD0YIBfZoXubafpejtDe/mo9PjAegd06C1eb6iCYeK9iNYPpVMGjmkI3GfHKOF10F4mSI/2i9IPe3m+TT9/dknPz3boan+LTrc3ab1QVC4v8SSFVkIq1UGYn5I6eHXZzityB5WKgJ5f2OelqN9L8YCXstEA5SJ+yoe9tB5fpt2kz+z3HaQ9tJd003p4UfL6Iksq2w/sDv1NML/ZYauUO+FwE/ctUcbvoIRnmr8bBviuZgrMDtHK/AhFl6YkJgkyireP8vT8IEPvHBfo08fHDHrH4l36y3ef0CdPr+nZ+R6db63S/mqG9ktZ2l3NUikdowIGX6IqkxBSB4TdYogHbFb6f1rM7wLQMQvEpKayOFM2Zy4k3bsUM4S/J3qB0AAu6clQj0QfBVQ0lBhoL2vDcJewaJdDPS9E9QDEoA8BwWEGwM2vPv3oo6rwvbqq65/K+vVnP60PWdvo0N4gIbNIWF/rq6O8tZayvfV0xKzvYLiF5pjpyTTjoJV++CffkUQFAQsNGoYTS79R0jRLjT03JAq4bkgVhowpSwGD7hu9v0rguzH8ogFPDbN0lrf2/jRAb6BPDbcM21RZcqSvi9lHt0gu4Bdq9vesyqpM3n93h+kUY1iX2Rjw+joa+HGtpiPNYE+7hOYOowfIzHekt0OeGynwMHdG6fDRfp5eXe3QWsJvsklD5mAK8k1f0LJWEdOfc8z8Ao4pKgSXxOHlbC1Jz0426O2zbfqFlD3v0YOTAzrbR6DtukT2YBIRfS9lZaZP1hV9PyV09whLCng9DBrI9eMT98qyDL4kg8zKYn7aSQfpKBfmzxDUfpw+OmUQ3IwuMnC5KOGGwH2UXFMDMvDiGB+gxalxygRdlF9ZpJh7ir8zuOA00fRgt/QFMfgCoTuY39UabNMiEnD78nRNhoJ+xmzvly/v0Z+9fUUfPzik96736d5+ia721ulwLUt7q2nayqdoNR2XvL804o701Cd0iwBA+H76hfGpVAvXooOcCwsijFeZf0Y5VPX/IHxHjJGDb18UTaCSRqAkCrCTrd1dAIaSjwjxPIMptjFVCwkJ0h8Od3fpeHf/w3/zN39TZX/VVV3f9HWdiXx1wUzv6WQzvTsDQXoT5ax1tGFvprilntbsTTTTq4TdU3yC/s63/pDq77yh2IsuVQpwdHeaLGaggt0Z1mAAOaNnN3hjwKTbdFIRUNTAZzLDyv6bBg0TsHrLbM8or0oZUV7TELXDMQWDJJ002tfJAGWRE7PBvAYrtIZ2PRwjr2E1+nDtMhUKZxcwmH7eg9D7dbfQUI86ghGO8HOj7LnAzA/gt8/gcbmZokcHRUr4HOZU6rDZ5yt/Fimfav9RTHxC5zc/OiAWacHFKcozqBzmIvT8ZJOeHK3RB/ePRRh+73Cbdks5KqQS4vBiBtiCyciJ3KWmPt1Gnp9HwMEP9reM8icuu4UBJoM+KsRWaD0Zps1UiLbTIckQPM6vCGCd5f0y8bm6Mk8x16SAHtIwEO1UinqpFHGL5AHf1bi9i7+LHnKM9cvUZ2B+lJIeDL7Mi9E1bM6gJby3maS39nP0ycN9eu98jT68u0HvnK7Ts+MN/pwbdG9vlZlfgS52SnSwhmGXJJUyCSqm4iJ7yMvkZ1DLHpj9oUwp9mZO3f9zKOBbQITRgmJ9zpvlT3xPIocQQHSZptnL2twaE6DL2vMTkhE1RetSwzHLfmGH8VhMpA/5dIaO9w+++uXPP6uyv+qqrm/q+quP34tvMbA9n2yh92Zb6a2JZroabaIkA16ip5ECnfU02Kk8LKf7uyUoFvFAAxXTlAb42PssWipQwei0/s7ozRlxQ4OvMT8FeurvavjEYm7z+Xu7ygCle4UG0BnG1/16UMUYeBnUPT6jJ4cy5cRAj4BfX2dzuVRawRYNHd6AyQRV6baXvwcA3xADXT/szSzYzXwbH/n2YWbNY30dNGbrFIlC0DlDR/kwPdnL84m8RCn/YnlIpwLAKwFwQJdexdXG1i0ZgzC3RjDsRsJHJ6sxZki7DBSH9NmzS9H6nW+v0lYxR5lkXJIHjCBbHNU0ozH44r5RBnWJ4fOSZNP53S6KCPj5qYgcvaifNpJBKbWeFMJ0kgvQYcZL28z4SqFF0ezNjw2QcwYl2TnR+4HxYoBoQSY++8g9rfR/KvpojILM+mB0jcnP1ZCT2aNX+oBgf0/3s7wz9Jy/p1fnm/TTR0fMBtfp1eUOvTjfpvsH63TO4He4XhDmt11I03qWAZDBLx0Ni+4Pk6sBj4sCbgb8RQa5hTlanJsl5/w8LertqDgaye8oeRoWcPjREIaMIRQRwTsMrzH0AvszY+LT2F49IAM2GFoJUiIWp0IuR6t5BuqTMzrc2//wX/75r6rsr7qq65u2zpxjXx/0N9LJYCM9GW+hY3s9HQ82U8xSRwk7sxgAigWgZ5GEhc7meg0Q+iStQekGi7P1mABmANugCYDdpoBcgK6vooxpK4vJ7RX+nAMVU5r2nvJlA+yQ5Sem19YuE7Qkp087pgDshivAD+xvdshKI+j3QbJQ+fwV4GfXPUPDbg2vg+GYvvYGsWTra69nAGyUbecNEAT7A6tEUsQiAxby9x4B+I6K9PhwlXzM3kzRfZ/SBxqMubw7xCYNEgroAKV36JigPNLQUwHR3b17d4feudimnz4+o5dXh/TodI9O99DzKzDzSFIoGFRlT68e4RfHE6XvW9Lj/85F1avy8m1BnPB9y5Rg4MtEAjLxWWIA3EyGJEYJfb9DBikMv2zEPLQ4OURz40PyXeKzoow8wqCP8qcx8YlUB49MeqrtnxsWTaB/blR8StMMnqWQg474eRGUe38nIz8Q3jkF89ukT+7t0sf3mQle7dHTs2262l8X5ne2XRJHmy0Gv1ImKZq/OKzNmLl6nQvkWZwnF4Oeh8FvcXaGFmamGQBnyIEt12d0nw7DLk4zwSEeS1A0EqNYNC7WZl4RwKu+n3h86ugjMQr3ejXj8ykWzQAIiQV+eED2UMhmKM0scGtt7av3XlYjj6qrur4x653TnQ93+5up1NdIRWstXWGIhUFwna/n+1ukfyUgMdBNfwDfTQEJi1l+NKYnzYETDV6K1ZV7VkYm3VBF4rohSTDCXsuDLxUTmhWi8teBCSAE4FPHDgWURhyQWJV1i2uK8slUTG9IWJTq9aE/hynPPgay3q42s8dnPH8l01Ov06Z2V6vELfW21VGf3raOegE+OwPfcG+7Lqd2MyOyS84dyoCP9gp0hhT3zQzfNq19SrvLgzUyVNOuh2fKPyrwvSEZwjk1TKGlGXF32WXwA5N8cbpJLy936aNHZ/Tho3N6eHYguXc46UJ0jdSBYAXrc2thu9PBwOcoR/xItJHO9YPFGVhflsGvlAzTajwggvr9XIh3ULL9kNawNDsuvT331BDNj9gosjhGYb4dYOcG4Om9PIOEhyEBPO/0sAzF4DEQvMMQG0MwucAC7aQDdF6K0YPtFD3cjEnJ8+OrTfrsyRH99OGBuOI8OV4Xm7N7zP4ud9foeLMoYncZdgkw83ItMnNdpOUlB7kdCvycwvhmaWl+jlmgKnmC5S5rY2+vljmswMtTG1qHgmE5+nQZE4wuGAzJ7ThGwlFlfs0sL4y+qtzHL3o/uOZEmTFiQ/SeYha4luf3ubH95dMnb1XZX3VV1+9z/R9f/Zf6XT7xrPc1SC8v1FVLR5Aw9DbSJoPekIAepje76V/8i3/OQNIlJbqB1xhY2VuzvMs6ue6bZtO2ysnNsluK2RfUfpmD5vBKp/laRklT+Wl2mBOc6vYu83kMz08xsNZBtcYkJtgeemmYxIQX55C1XYDK2t6kQM/Yla+jAcnYwv4Afm0NAn49LTXC/OxdivEN6L7fKD/vNH930LkFFiYlFPbl2Sa9tV9gxpYSlxZJhMBzaumEeg9l9ifSCfneu0XjJ1KHuXEGjGlhfkhbeHG+I5OeHz86lzT3S2Z9h1trtFHEpGdMSnD+CpnDokM7nEivS0kdUOJDzy/IjC/GzCm24qOozytyB/T8oPXbTK3QYSFKxZBTSpxIt18YtVFgZpDurgbF4zO1PEfhpSnTwBolTrc4vgySmxkiEinABAF+kvM3PSi9v7RvXjw+j/NBOsj4JDrp8U6KXhzm6dVJkV4cF+n5YYG/vzXplz7cX6VHJ1t0ulWUsmcxGeH3vEzRgJdCy25mry7yMwgK82PQQ9nTw6C3rHucaghmWQMfypt+pefzBSWuCH1S1fPDd7MsJtcofYINJhIpSiUzzA6TfD0u12XHE7Lh+qKcYFYoHETeYFSYZJwfu7+9I7Zn/8t//p+qwvfqqq7fx7pcTZ+uMeCtMrsLd9eRu6OWjw20ZmuU0iZAY6y3g/6QQQ+j+hBgK5eVMlgNVjA8xeqsMkwyZLiwGGzOdnMac/DGkIpmjxWTlEava/A1YCxr9ywahBj8BCi7K8DToqUCqrdn08zQABMAouGWMsSPHWdmhqlM8fO0vV5W7TS9Ro1UiX4NttaOZuppq6fedlXytHU0qJInA+CgpYVGrG00ae+iuZFeZkAjFHPPS/Dss6MSPdzN025mReKJjGimYV3+rXztAavaAD+4xGBiFCwLtmZwd8HwzIvTDfr85TW9f71P7zLwPb04pPvHu8z8ilTIpMTdRSYSmb1Av7Zk+lsumdZmqvfn1qDA4MHMTwyjo0EqxkMMfCHazkYk0giZfa4JGxVX5uj5UYbulsJ0vhoWwFoNL1FCsv0Y/ByjovmDcN0zPSzbJeA3IP2/+RHYvfUz84NP6bj0DMH+NuMe2kv56KQQpLtrUXp+XKCHW/yjgQHwejNOz45X6fkpAJC/x8MSHawmKR8PUi6GIN4ApXhHfG7yuVTJE+VO9DAl4UEE6CuSXu/zlCc2Db9TWJlJsC2GWTw+AbZMJkeFQolKpQ0qra5TOpWlXLZA2Uye0ukcX8/wMSvHDB+TyZQAHYASDDK4EpIswCSzP3h+rudzdLSz/eUn775bZX/VVV2/67XpdXy9O9xByZ4GSlt59zZQoOOOAAC8Nwe72+gP/tk/ExNlg+kZ/bdKRjdcMZwi2XaveWwOaYsxe2/ZRmygssT52gnfYG1m/1DrAQ1vzkENTJXOMPbKIRQNmHZDk2dRjGpAxwtJjw8MVF8eY7CDvg8ONDYxs7aYIGk4q5gDNJZ2DaSq52ftaGG2WC89PwAfNgZdBi1NDHytIvCf5OeeHbbJRo7fHgPI4/0iPWbmssMsahYJ7jYVWGvo/OzSU2xTvT4pzyqNn4TrjtrJwQASWJyiYthF+5kAna/F6f5Ojp6ebNL794/p+cU+nWyVZOAF4JeIxZiFrJisT2XZucxJz8qpT5/O9Isy80uE/JQKB0TsDpNpTKheMhu7YgC8v5WkJ/tZesTM7P5mjM6KK5Lrh3ii1PK0TH1imAXDLShterCZ4TmZAWPyUzFBu2yUQyXeaGGM2d+cJLyvR1xinQZgvSgGRVf4YDtBb5+u0vtX28z+1unxYZGO1lJ0uJamrWyM1tIRYalhH3qWTgq4F/myRz5LOhqhOIMekuoBgoYZtYT4AhAxzLIckL3iA1uLMINLUY4BbrWwRoVckYoAQAa/1eIagxxALydAmOH7rK1tyl7lvwMok8wK8ZwIv0U5FMwvyse4SDBCdHZ4+PXbT59Ve3/VVV2/q/XW+eF41N5J6/3Q50G310h7g+hTNYvQu6+9kf75H/wzEVObSQaaaZk9OmM4pb8cvCqavP5ylFClFMEwprZXurYYk5MVsoRBPRk6YLi53Dga9+u6AZYq20+ZYst9NFsyenVwlBk02JNmk0PaaxN9QPhuImlgAAG58PSs6PFVhuf2d5dBUCzSGAS72xqprwNbsT67Zn0oe6LkOdLbLoxySvf8AgsTdLaWoHfOt+idiy1JScAAi+ERqiZJO8zJTmVkrYJsjYQHpLjDIWV5bpRWmIFlA4vS83t1d4c+fXohJc+HzPrOdtZou5SnTDJB8WhE3F28WuMnk4mmn6XX9LGUlAfp+XkZMAIUCwZk4AX+nrnoCm1morSbjdL5epKBKE0PGYzubUCXF6L9FEJt3bQWWeTtpKx/geLuKQbBaQm3BdgtjtsYBAfE99PJl3H0CDgOCFCCUcLouriyQHsJtzjIbMeW6HI1qPR/vJ8d5enFSYkut7N0uJrgHecdk35kPhagdEglUWT4PRcSUQbvIH+GgAAgPlMKcU3MhNGHQykYrAwDLZGQ6t1JuTKwwoyPH8ssLRlPMADmKJ/l75KZ3VppnbY2dmhjfZsvb9Lm5i7t7R0xK9yinZ1D2t05YIDcoCwzw2QyTVF+7nA4qnqEgZCAIZ5zf3uHDrZ3Pvz040+qpc/qqq5/7PXw9ODLxEAHFQZaqWBrYqZ3m3obb/NJu4Xa62/Tt7/1hzQ3NmCKy8vSgtcF5joXD9l2hrWYZoEG4A1W2IvZKwAQnp6vJysYo/2V4nGD9RkAdENvV1l+7C6bYNu1rAHAhDR1lDQHe7rKrilwW7GXkxYwwAMvz1EMu3S2iFuLKjNayqL27o4bDNAYfAEgWjs0+LWrvp/0/AQAmxQD7G6liX4LzQxZ+cQ/wIxoQcys721l6C7vsHvO/FxGybicMF82tJY+q61LwHpyoEf6bIg0ygYctJcO0ANmfe/fO6SfPb2kV1d7Ejp7vLVKm8WMeFyKr+eyijDymmbNigG6zQ23F5dIHkIMlInQCqUiQfH3zDPzw8DLWiJEG8kVCeK9XA2Lw8slA9/VepiPQTpnhrafWmbW5hTNXsQ5IYxOAZ5dSpxzQz3S58N16fdNod83JhOfYH5J15REI23HmNUmvbTHbBKRSYhPAssEyxVz7fW4SC72siGxXVtPhqQvWUzw+0wxGCajlI2GKM2fAbKHQjpJ+WRSJi7Rd4tHE8zgSrQGppYrUDqZFiOAoB+6wKBcRhJGsVCkEt+vmF+lNT6CCYLtod+Xx21rW/w8G7S3f0JbW/sCgKurm3yfPINflpKJDMWZQcZiSQbZhDBKTIqGGGBPDo6++tXnX1RLn9VVXf+YKxP0f7nc307+7kaabnyTrLd/SA23f0JNNW/Qd7/7bVqaHRWPSbA4IwaoUpc3XBkGa7eat5tpC6YM4eautBX7rZ6eAGOnCQBlPZvFLC8aE5yV+X7l5zFkB2rSU4AQAynC4trVsEpPh9n7k2ghBMvajbDaTvHdhANLX2eTFrZ3mQzyxnCNcblHvUd5zY4m6mmtpe6WGgG/yp7fMJif9PwsKs6HwS/pc0iA7cOdLF3yMeZVAvfJ4X6a0KG5UtbVQI73Nyh5hp1ikYZYJIjlMSziZ8DI+BboMLvC4Jel5ydrzCg36W1mlff3irS7qtINIHPAuH1Ye3uqTDsl5Fam1kvKkUQnuvu9sOTyKZbEwJdY8VHC76VkwEP58LKI6iFEPyuGGJBiwv7e2k8zMKEUGpdg262Ym5LM4MDmUOqEiwv6e7A5WxLgG5BeIIZh3Hzdy/eBvVkcpdKFEUl1LwTmKe+fpx0G0424W1Le4Ym6J76iCoDPmPVhgOigEKdtZqT7q2lmp3EGvwiVGACLvHPi9RmWkud6sSh6u831TTo7OaONtQ1hdyhJgpHB/g1TsdDmxRggFevLUjadodVCSZhfAnl9fD2bzsp19P7WmAWenV/T8fEl7e8fMwju8e1FSqfzzCLDtLyMVPggHwMqT5C/exgKpKLxD7/44osq86uu6vrHWuu59IfTPW3Ud+fH1PiD79D3vv0tqrv1E/red79DPsckzU8M0RSfgMcG+yRaB3vE3qv7eDrBXANf2YLLciPbziiHGixP2YoZBtKVFmNGmoIBKp0V5U1dctS9uj4DxHqUnMFMTb9RkmwXOzJMbeJogqGenoS0YUwDx0hFNJCRujDJ4IdEBriPQEpgvwHUFcBXAbp43u62JupovMPgV0NWBkBD29ffqQBQ3F0Y/Eb7OsT2DZOR2RUnPdzN0tPDIjPALEW881LKlAxBa6cJeqo/2WkK8fHeAX6IMsJzOVBCZaYUcU7RamiJQSBGjw8KAn4vL7bp/uEGnW6XaHe9SGsFZiqJhEwdirvLovKyhJjbELSrdAcFhjC5Dng8FPYvS5jtisdFkWUXxf0uygQ9tBpZll7l9WaSnh4w6B7m6NVpgZ7spqUvt83Alw8sUMw9Sd4Z+HvaheUBACF38PH7VoxvQFLdAXqBOQzFDFN0aVzCcDEsE0LQrXeGNvj5iqFFGaa5WA2JsP4kHxIpxBmzwP1smE5KCd4pAcHdQpI2snFazySokAAAJmm7VKK9rW06PTyms+NT2tncZiZXYPBKS/hsAlOY0ZiUOyOhCLPAlDC+fDbHrA1/i8t9cDvAMpVI8d+KwvhOT+7S7u4JbWzsUqGwRsGVCDNqL83NLtL4+DSNjk7Q0NAoTYxP0uz0LM1OKU1hksH13uVVtedXXdX1j7UuTg7G3XPTXzf+6feploHvB9/5Fv34h98j18wI+Rn4oBlDqXN6xE6TzD4EADX7G9b+meO4raK8qbwxyxZghhNJv7UsETDATETn3e2moXR5gKSrzOJ6uswSo71ST9cFUNIgaLq1dJiTmwKQkBt0td2QIQxqWzCjrIlpTgE+w2xapA4KAMcHesSXE1Zl5md5TWQur6sHaPBeYHwNcbu1vYGskDkw+IH5maVP3fcD+EmZkr9f79w4rceW6fF+lh7uZel8PSG3GeVaMwVClz9HdaK84e05ovt/E5LlZ2MQGaO4e0akAXc3EvTqcos+fXJC7947oMcnW3S0ycCXS1OO2R+GPDDWb7A8MXEG+DmV1RcATwTeAoBO7e6yRCteF4V9bor5Pcz8vFSI+mk7E5Ky4+PdDL08LtAz/jwYSrlkYNpLekWoHnEyiDGQBRjYgo4xmfbERKdiev3kBfDxxvALNpifZ8ouYAnXF0x+ov+XZPDbii8xm1yWsFw4v1zx97adXKbT1aiI4B/s5XgXxCB8Nx+jw1KaAZAZYI7BcKNE5wf7dHZwQEd7e8z8VmlzDT27TSrx5WK+KGAGlpdKpCkpUoWkMOQIM0AMqMSYFaaTSVpbLcn9D5nZnZxcMOAdUzpTomAwJmDncCzRxMQMDQ+P0+DACPX3D5DVaqO+XhvZbHYaHByi0ZFRmpmeJufCIqXjiS//8z/8pyrrq67q+sdaT996Gl9ecn45OTz4dWtTI3U119HCxCB5Z3FSGqPZkX4ZuhjD1mzPMI02WOCoZn8q8VyBxqAZCKvTDXRZ0NDemS4omoUZANhvpiIY91ePsctRlyw1a+s3NHX6cX2aDQIUrZ2tAkICfBUid9HvYYJzqJcm7D0SKDto1SVEPfhisDqwKQjQ8ZrDunT7Otj1vzb8IlOe/LqWtgbqbq2Tkmd3i2KAAL9+mFxbmqTsqSzNekWa4JkZZfDz0iUzpouNJO3nw7QwOSTf4fhAn/7++xSz1hOvRjKEEucrazPkAuL5UPZMMtDspv307LhI7zL4vbq7Tc/Ptuj+wZokHWxkU5RNRCmuE83d2s1FfCzBABeUv6WkETiVt6VYmyGNQNLclV4uyuCX0OC3n43QRSlOl2sxuiwxAG0l+BihzegSbcVctLoyRxtRJxVWFhgI5wT8wOa8U3YVcDvWL+VPDBnNDHbz7hHLM7BDgB56fyvM+kKOcUq4pyjrm6NdBrurjTgd8GfFESXXu+txBr2MfJ8oJT/YLdD5RpZO1vN0tgW/z6JEOh3vbNHx/i7vfQbAfTo/PqHToxM6PDiivZ0DWlvfolQyzZ95WUyv0RuFHAIRUClmfcfMFi/OLunhg8d0fn4l7M7nC9P8vJOmpmZpeGiM7PYhBrgB6mWg6+qykKWrmzo6uqinp5f6+vr57wMCfmOjYzQ/O8f/HuGvj/cPqsBXXdX1u1hffP7LuM/tPMVJdpkZR4BZH9xCRmWKEODXJ9sAOxgoT/B1KQUKwBkxPeW+3JBpx9Wpe3aVsUFaCN6jwMJwRjHS2l93aTEYoykgN63K2gTgjIlL4zKArhdDJxoADTH4mExGdgvYqZ5ZGWyxB4Wxqs+hANIisoKhvvKQi/QPtSG30WtUsgn1t56OZga+et61ZGmuEeZna2+QkqcMuvS0iJ8neolTg0qbh+98K+mnSwa+621mJQx+zulRSW4fH7QJ4yv7eHaarHrYSHZA3iCzPmQCQj4AZ5WEd5Y2414+8Wdl2vOj+4f0wYMTBsBtOtss8Mk/S9lknNlLSMb6EVgL1if+ldrOy7vkrvCmdGmtn5tZn0dE7omgj7KRoNibbaTCtJ3mnVqhS2ZgJwVmgbyPsj66Xg/TRcFPp4WAlCg3GAwTnimKu8altAlwmx/ule8DU5+zg1ZyjPUxkNuU48vMsLi+oB+IEmjYOSlDM4eZgPQQsY9k8CUpxtcoe97l9/CIPzvSLJ6f79G7D87o7esTeni8Q8+uL+jZg2t6cu+Krk6P6emjR/SE9+4ms75CgRlxWhxYAstqwtWHXif8OAMrahpzlxn047fo0aOndHR4RpFIggFPsbt+Bjuwuo4OC3V0Wqi5pZUaG5uovr6B6urqqb6hkVpb26itrZ0slm5hfkMMfih9zs/Of/2rL35VDbatrur6Xa2z48O4Y3qcliaHhfHBJQS5cDMjdil5YuAC5U0DEHEythsSAS0TGNIlz8HeroqyZmfFQErZCQVMr7dLAZTB2AzmV9kLtOl+ngmEALzXwM4YhjFYoAAfnluzPoMNynSnFWGy7XK0m4GzHRq0OzX4qd4fWNkQ37e7vdkstRrv0WSqxgSpZpb4PJa2JrK0otxZZ3p62sTXU4EfIo5Uz69dneyZaYddM3TObOk5s7R7WynaSSuNn13rD43UdtPnUzvU4Pseg1emTbHU6SGUPftEOwcnle2kT7IBP3t+QR/fP5Bcv2cMBpe767TF4JdLJmTi08eAZvb1dHYfNG4qi07l+Xm0BALgF4KvZyggmX4Rn4eSK15ajQUk0gg9v73MigjQnx2k6fFOgt7i/Xw/RfcZBHcTLtqILFKSmZsPwbaTdnG4AQDCyWWOQdAtmj+71gEOyECMlD3572B9ucC89PwiixOU88+LldpBOiBs8/Eueo15iTx6dbFFH9w7EAB8fLhG7z04pXceXNDpZlE8P6+O9+mS906pIGXgfCoumr9EKEiRQIDCYvi9LAAIvd/29i5dXFzT/v4Jra1tUzgUp9lZB42MTDCT66O29i5qaW2npqYWATmAXU1tHd25U0O1fKypqZWN2wGAFksP9Vr7aMA+KD84Xjx7WgW+6qqu39WKhEL1s5MjX7tnRinlc0gWnGdughYYCGdG7TLsMjGoQG/IFJOrPpPhxGLv7TJdUyp9NwUwLGW2ZoCE2bfrbr8x6WnEC9mkF6jLogwo4tHJAAamY9eidPThBqwVOYA9XZqVKVDs7WylHqRLyGBMG99X9c769PswktDVwE1HRU6eMrOeGbaSXYOzUd5UQF3hFWppN0HRANru9ibq5W1l4OtuqTV7fQYQ2jE52t1K432dcqJHqGvKN89sCRORabE1y0c8/ANDCdvF69TINdR6SuWQo/V+fIQcA+9ZcgH5OeOeOcr6HcyGQpJ08MsXl/Tn79ynjx8cS6rDMTM/xPtkEjFJckeieCgQkJKeGDcD+CB70FKHpcVyCKubd4ABEObQcbE4c1PC76ZceJmK0WVmrZi0jErm3uPtJL1g0HvK4Hee99NJzk+bMZeUKxFVFFocY0Y3RAtj/bKh90OfD643YIDYGIAB8CnPz0FhfpgCRbhtjHcp7JJ091NmmSixPmTm/Hg3LX3H+3z5KSzPTtboJQMg4o6u90p072hLDf2sZmX4ZbOQlulPJD5k41GKhVYE+CB4hwE1tHmrpS3K59colcqR3x+iublFsg8MUzeDXmtbBzU0NGmGp0CvToMeNgDvTk0N3bp1m4+1wgKbmluou5v/G2Pmh+/61ctXVVlDdVXX72r9q7/+df2K3/2Vf3GaciG3ROi4GfjgwD/DzANDLmB9cBEx8uSk1KYZSGWsjiHwNhifAUSVcgOzN9ZTTkw3tHkqbaHdPKoSZrv09gZ139Asj5rlz5ticwP04K7Sq8updp00Ic+ty60DplNK+w3vTxly6Yew3Sosqk+E7V3l567YfZXAp494ja7WBil7AuysreVBl34tdDdE7hP9yK7rFS/LKDO/02KUHuKkvZ+nbNClSsoVZt5lXWWXaWumbNg6Bdgn+MfJFLPAwDxigKZoM74sZVQEvP7iySl9wQD4yYMjenV1SI9Pd+loa532NtZol3cmmRRja+TOeU29Xxn4kGm3iGQHh4M8eujFmPhMovzJzC8b9gn728XQSz5EDzYTIj7HFObVekR0fidZv6S65/1zSufHTC6wMEq+OWVsjWgj9PkgecDlxTGbyB5w3cGXAYxgi4GFMQZ4mHcvUDHopPWoi7+/MF2UwmJ4/Yi/x1dnq/TZ4yN6drjKjHqdnp1s0tsXe/SQwf8QsodcnLZzCdrOM9MupgUEc4moMD8MAcUjUUrGUybYQY4ggyvj02S3D1NXV7eUNAFkALza2noBNmF7fLx9G8BXS7du36Y3GfRu3b7Dt9fJfVr4cb09VhoeHMJ3/PWDe/erPb7qqq7f5Srms186pkYo6pmn4NKMyBpmxwZVqZPZHvp9o6Z7SG/ZakuzvP7XxOhlFqYGUgBAfd3tN+UK1q6bJdEK1gTgwjaAUzw6e26GzgqzQ28NICe7RT2mApREkC7voa1ckuxq1ROieiJTvw5YKAAErGlUonYUKMHaDCVMM6XBUgbmvu6OskWaWWptox4G3c6WOrK01AnrA/gJ62uvM+3N7Br8MPCCaU/n5JDIHK4ZLMBWHu7lmUkxq+jt5s/edUM2MmiK/ru024xhcWahKQbs+VGb9MVCi5OU8y/Q1UaCXhyX6GcPD+mLt+/S5y/v0QdIdTjeobv7W7S/uU6r+RzFwhEzbgfA59YTntIDXHAI8CHTDuxv2eUWrV9sRSW5wycTZc8cg1+Jmd9m3Ce9RkQa7ae8dFYI0BkzvhNMZUadAnylsFOsztLLMzL1iVgjlIBndNkW5U6nSCBsIoMACILt+WZUvy+yNCnuMLmAg3b4NS43YuLu8uwoR79+7y59+nCfHjCLfribo3cvd+gjKX1uMfNbZ/Bbp5ONLB2tZSTwFgC4aeb8MfCFw+LLGY+lpJfn8QZoZmaB+vsHqddqo/bWDmpqar4Beiht3r6jwA6gB6AD6N26dUuA747+Gx7T1sr/3Vn5h8rkJHIAv/4P/+2/rwJfdVXX73Jtbayeoqy5PD9B7tkxZnuDwvZQ5kR/D1Oe44O9chQA5KPhMGK6rWibMiOuaEiHv3a1NgoYmOJ27Ylp9McqS4i/zabKvbSyc0qnyQYxxGLtajFBzJBAmG4rutQqLiuaBeI1BVjxGP26/Vozh3LhcF+ngJ5c7oWZtUXkCj3y2I4boNdfwRiN92+8F+j7OlvqxdC6p6Wy79dANhG4N4up9bDp66mYH9xY7q7FRZB+tpEi78KU+JoabBvfezmbsMKKTTM/iV7C0dYl/T4MkUBIfpj2M/it0m8+fUG/fPuaXl7s0DvM/O4dbTPrK1Epn6dcJiMDL8vi7QlDa2Oy08WMz6F0f5A/LFZq/dwSa5QKBSju91DU56JkwEUR9zxl/LAwc9FxLkhHGb9IHLaiS3zZR8dZH+0k3LTG7C/qHCf39IDS+mmwQ5IDkixE9M5AuDDaKz1BOL0oScSYyDgQhJtfcVA+uCiZgWB9zxn8Xp6syrALSsfPj4r0qxcX9Atmfz9/ckwfXO/Ts9MtenC4ThebOTosZZj1JUX6gJy/fDot5tOhYIw8Hj9/Fz4aGZ2UXh4GV6SPJ0MrDHrYfBmgV8tMDwAI8LvNoIeN8uabusSJcif6farPx8DX20ejwyP4Xr+snoWqq7p+x+ve5WncMTNJDmZ60JMtTo7QHDO+ST3YAqCTEXsGPTieqBJc2WvTXiFngNB9fKiPFmenKRZcoeam+rJUwSxNtpc9MCsjgIweWkVGnjkc89pjFegpQBPWp0XrhnuLzWBfzAQBWmCE2HIdj+lS8gezbMqsEMMvAhpa+4frY/0WAaY+DaxG+O1vg3WrOawDYMVzYtKzq7mWuppqmP3VSN8PoNfPjK9f5/ipOKM2yQiclBLfIJVCS3SPmcqj/TyfmDO0vDBpZhgO9naXJ2lNnaECeTt/hj5hvfAK7ZQhER+DRMgxJuCHnhdMnj+8f0CfPDqRMNtHx1u0V8pRjpmOKu/BqitMAb9KL8BgCxIdFh0OCbHFEdozgCCYn3tRlT0x8ZkMr1Ay6BPmB6F7fHmRiiEPbTD7KwSX6IDB77wQpMtikE7zAQZCBr6Qg1LeaYouTYjMAXl9vrkRYXiIP0K/b2aoR8qe6AFiytM7MyKgDoDEfSF0h1QCHqHQ9SkD7xhdb6fp3fN1+uR6h9nfHn3x7Iw+e+uEfvb4hL+DQ3r7fIceH27S5faqDP0crBdpo1gU0IuEY1LadLuXaXx8ikHPRi0tbdTY0KR6eAx4ADkAmYCZBj+jrwfwU4xPAWCN7vXV1oLx1Qvj6+zoJGuPlbY3dz6snoWqq7p+x2t/b7ve5Zj72jUzSivOaQE/c6gFpU0BPLWVh2T3zcgg7doyzKA4Nmijl48e0uOraxoaGKCW+juqnGiAgwk2HeZ0aKXPZr82nzZAxqZ7c71mqbFNLvfqSUqDuRm7XG5slanMnnYD+FrLoIeyaFdZ9mAMwAA4EMJrF8/ODgFBSB+k/MnABCCzGdOlxrZUAp+6zQBdvCbMrIX1QeMHcTtSHTpUgruto1Gxv84m6fshyXyaT/IY4Djgk/ezgxw92knTxXpSBo4ME3CJgNKJDn3aYNvGzBdJE+hl4j2D+UGaAV9PJ4Np3D0r7i4X6wm6YEb5S2ZAnz09pyfMeo5KzHRSccoz+K0XcnzyL4jF2YqE2XrJhTy/BQV8C3NzUvaU7XCY4vdlDX7IxoPFWYyP0WUXJZgBppgBrkU8IjpH8sJx1k8HfNyJu2mdgQ/pDtjFALNE36xYnGGoBQzPAEAj309KnqPlXp+h8fPrqc8sMv4iS8wyV2TQ5e2jAr1zUqSP7m7Sf/XijH79/gP65fML+vTxKX344ITeOtmmt+8d05PLYzre3RXxejgcJ6/HR44FF42NTlF3T69MbALs0KOrQS/vTq0GsnpqaGiUSU4ZYrlTq9idlDvvmFv9DQB4hxljI/8gbBLwmxgfp88++6w62FJd1fW7Xv/xf/yP9T6340vX7ChFPXPkmhkTSYPB9rCVWwtOvKrkZkYOafkBGN/s5KicoP/nf/+3DJg2+uH3/0T6Y72aXRmA9f+q2TPdUDCI0m6ChylPMIZeLP/f5VEDbERWwBvAh201+4AGO9RA3Fnu99kkoFb5fIrfJ/pmPeoIOcTUQI+ACp5PhdK2V7yH1te2AYrq/aHsCeCzaoG71QDAdpXrJ/6ezALB/hCVNDlgoRU+iWNSEeD37LhEx6UUzY8PqSQLzfJs+ocBANuufxTgu8NnMFLnkeawMGKjtM9BCfeMlARPimH69OkZfXC1Qz99eESPj9bpardEJxsFOtws0d7GuujaUrA4W1mRcqdjfp7mZ2fVgIsedFmYneM9T855DX4uF7M/l6QhJMXjc5nCHifFvYuUg79nys8A56f9dIC3n85WI+LriQEYWJBtx11UWJmjmBNgNsrsboCWRO7QL4xvCUA4ZiMHX5ay5/SgTHo6J5XTC0qm6eVpKgYXaCfh4ecPS7jtk70MfXS1Sb94fEifM+D/6p0r+utPntB//9c/p3/7+Xv07oNzGfSBT6fH7aPFRTfNzTlpcHCUuiw9wvTqdGkT7A7AVqsZn/T4GhpN1mewwNu3b8tGqdPYAL7auhp+TB2DXxPZbDby+XxfVc9A1VVdv6e1WSp8CLsy1/QwuadHJJpIgV6f9PdGdQlzxDSmtkgUkdLcdQgzHOjtoLNiRIDhj7/9LSktgsX1muJytfvlxKyMl1WmXle5RyalwopBFX1CNyQDtooyI7ZVypmtwuramxuos7VRJAW4DrYnrM8ocXa0/FbpExuvg7KmXQ/DiPzBLB+q/h+uY9Clr7NZsVDNEo3SZiUDNCUPGvzweh3NCvS6mm5TJ28I3Ps0+4O+zyYDLy2yUfZEiQ96PHyfmEq8u8GsLOaTfxObkdzerdip3TTlbruhTZTcQdjM8Y+VSd5zw32U5B82ayG4qnjo1WmJQeBaABDBtuh3Xe5tMPPZoq21VRl4wTi/e8kpzA6TnQC9JYdTgFAmPeH2ot1fsGF7BvPlILZniYKuRYp6nZT0u6gUQRkyRAfZMB+DUo5EmC1szg7SXiox6G1GFqgUhNxhkvxzw8zq1KQnGKBzXAHgotibAfiGTOa3PDMo919ZGJVIpELQya+3RPsMrBgYeuesRD9/fER/9cED+re/fEn/8Def0v/1v/47+ov3HtC9wy2KhyM0OzNPIyPj4qsJ9xWLxUrt7Z1qeEUmNetUL69WlTpR8mzQoFdbV2eWOgFyYHi3zD4fH++oic46Br3Gxkbq6OD/BwYH6eL8ourTWV3V9fta6WQ8PodpTmYHS5NDEnw6yeAnnp3i3qJMlIf6y0GzldFDGPvHRF5T3R369h/9oSSV2yo0eb3GkIl2OBmAM0qvzrcTkNCCcz0F2mtpMwGznNCg+4BdFSVNBp3OlkZqb6oji2Z4AJrujmaT8XWbt6u/9Wp7MwOszCGYLhVKW77eZgbaYqN8OMGgZGVgNS3YjBJsV9lNpjydCgaqWSgDcgd6fU13GPzuCAO8AXyS6qCmPeHriTw/9BaRuXdaiNBpPkz3trO0mQqKvKS/57X+nvYSHagYegEzBAOUdAcp2fYwKDCouGcl9+4oo8qB711s0LOjIr11tEb39tdE5F1IRGRoRQW4+kTa4BIrsyXt5blU1vjpIRjD+Bp6Py/fpoyt3ZRCRl5omQoRH4N3gDaTK7SbDorkAYbW0PcdM/Cd55bpILFExcAsZZaVzg/Tnh4E1jIDhtAdkgZssEAwQGF/iDiasIvhNeQRELvH3NOU9s/RFjM/gOuL4yKz2z364u1z+tfM9v63f/eX9F/+/i/p3XsnlInHaHpqhuz9A+Kogt3d3UutWpBe7ufprcXpNVqYbgBhLSQM6PFpKYO59W0Avbr6empqbiZLF/+3NDbx9d//3d9Xpzmrq7p+X+v5k8fjU6MDX8+N9lPAOUXOqRGaHlXOLWMVKQ1GXJExWo/b+mWoooVu/fhH9Md/9EcK9LS7iulnyUypqfYN+tMffJfv9311H+2ladiTwTasX/f+RGjeY3hhtlVMTJZLmgCzhtrbAngCdgxIXW2NGvTUZaPsafT6eis8PY3eXO8NjV7rzclSPYRjACGkB+O2TrmfAu2yDKOy9FkurbaYYNzVwoy0qUYkDiJzgJen9PqUxMHWrgZfMOmJNAf8CMG/R9Q1K8MuD7YhcyhQNuSRvqvZJzVCeHvLjjrSIwWoayYIofs0M3b//DgzyXkBP3hf7qd89GAryawyTz9/61TSHZBusJpYoWTIT+lYmKLBFTFr9muBuwqvdZtZfsj1w9DLIoOeQ2v9fJA7LHslzDYRXJaJz3jATUUGvrU4g1/CTztJTHZ66Tjjp6vVFTrJeGk/6WI2ymwt5JB+X2p5hsLOcfH4RGnTSHNHqdNIdTf0fbgNQndsSB3ygXnaiLmYNYeF9QHcX51v0BcvL+jzF3fpl+88pLVshpwM2sPDyky6z9YvriotrW3KgUUE6RWSBbC+GoPd1cplxQhV/8+Y6rzDTA/bkDcYri14zmYGvl5rL5IhqtOc1VVdv8/1xZ/9Wb3fs/QVDKt9jgkGvlHJiFN9vj4VRSSJDOX4IZWY3kkNd96gH33vO/SD736nbBRdISjvbm1gsPsBfe8736bvfvuP6Cc//BPqbK6XsFiI4ZGIboiz+61dFXKH8nMYMgQAiYVBDfo2DFI01dVQa0MtdfDzYUNCAAkFNgCvS0qfYIAtwvhUeVP1+SoBTwZeNDvrregJyoSmpSyaR0kUjiujfZ1m+oPN6PN1tpk6vsrHmz1GgF9znTA++Hka/T6rCNwbZNhFen3M+qDvw2QmBlTAwDdjPrpaTzJDy9C9nSwl/E75ESI/PsRUQMlH7BUgLZOoFhXVNGztlFgjpDl4pkcovDgpAvIQM6q8b4Y+enBA97dSIqO4u5GiI6QbrKZor5SnQjolwy6hYIiCK0EBPpdme0a0kTouKia4qJIdEGsUDfgZQAOUZABMMQAmGfzSQS/lGLzXo8t0mEWAbYgueJ/mfbTNoIf0dRhb7zMLLK7MM/ubEZE7BljA/jDoAp0ipjrnR6wKAJHxN6mszxBom/bNMbBPSzTSWtjJ7DIoRtooG//lu/fpz57fpe3VnHyW8bEJsvXbxVS6s8sioNeoNXrGBKdid+VtOLLUajCr1W4tNZr1obR5u6amwr1FyR0aGhpE/9ffZ6MP3/+gOtRSXdX1+165dOLLST7R+uYnaIlPjhhwkXBUMD7N9oYrgmkbam7Rj77/XfrOt/6Q6m6/UZG60C7AgjJkW2MN/eRH36cfMjBiv/Gj79Gbf/p9aufbRTA+qIZnhrQG0GaYQhspDrqUaO9Rz9naWCsC7hX3Aj04PxSwaWm4Q831d6TcaQCgDLe0qV6fwQgx6WlcV2BUlkUowFLlUIOhqenPVnMqFQACr08kCSBN3N7dWu7zdZWF9NbOCnZpgp56HTx/Z3OtTnFQR5Q61bRngyl3QK9vyKpkDo5xZjKzY3SxGqN3z9aF/V1uZSjonpPvS8qc3R03SraVfVI1qNMupVqwvhn+zp1jdlqeHiYPg0WIQWU94pZ8O/hdPjssSKr79W6RrvbWaJfBb2utRKVCkeKxuHhXmsAHGzOwPl3uhPgdtmZevs3PlxFqi4EXpDqEvEu8nfy+HWJzVoqv0G4mTAc5mFoH6DTno7urAbouhejpflpKoNtxNxWCi8z+5inuUcG2YHTG5Kcku2vgg/sLhl182tAa4vaYa4qS3lkRuSM8F3KO//TlF/TwaEt8SUdHxiQxwdLdQ+0dnQJ6xpCKYnCK3SnGpz03TWlCvbovwE/3AWWw5U6tKWKXsicDYE1trfwN1mYWSxfF4/HqUEt1Vdc3Ya2t5k7R03NODUlYKLLjJoaVlm+4YqgFk4Xo9dXdeZPeZCbXa2lVo/UVk5fo6bU38C/fn/yQge4Hcqy//ROqvfVjusOPabj9Y2YjrZIrB9CrtB6rzNMzAlnB3MA0u1ubdPhrHR1v5CkT9gvo1de8KcyvrRHsr4Hv3/RbPb4b7K+C+amBFwV2Fg2WxlYWaEoiMGzt1AkPSnM33t9FPXx/vMfXWaJxuVs/x43J0nbV5+xpU8L2Hm1r1t/VaCa4Y2PKE8wSIbmzI3180p+kgyyYS4LuMzDt5iKS5mC45AD0wCoBsn0V06Xo8RkyhwE9vTra20Gzw32iicuvLIoMYDPmYfYVkXT4Dx4c0cN9Br4dBsHjHXp4cULHB/sSwrrsXb4RW2SUPMH4cB3av2VJN/AySC6Lw0tIIo08kuyAnY4EKBcN0EYqxOAXpKPciojar9fC9OIoS493ktL/O84HaDflpa2EW0qXWbE6U+C3ZAAfenz6smtqQATumIoNOiYoDE9P9wwVQ0vi4PK//4ff0N/84j1KJ+I0Mz1DNga9Lks3tbV1SE9P9HjaVkyBmwY7s6dXJ8BnDrjoqU4FlnWa7SkN3x0NgGB8dQKeDSJcHx4eovfee7/K9qqrur4J63B/Nz4/NUaLDHwR/rWMCU+wPgy1GGxvQLu0oMRnJiv03BSaAwStbXxCuPMGM8GfUGPtLWF+0PShLIqyp/T52huFhZiaPTP9QJtIS+9PDbHgulV0ec0CNl3M6kKuBXp6echg0i5DNY01t34L+KTcacgbOlrMIZeyrk9Pd2qgk2PFkIya+mxVkoHuNuln4j2h5AkvT/TjetqbKqZS28tC9ooyqsEEDf9Q+RytYHoqwFbCa9vrhPVJqoO4uzTRMLNKWJth0AWpEf6FCYneebgNQ+sMHZZS5HHMqgGi1zxEK3MLDc9SMEEZLLKqYReABHIB48yMMBSyyuwKE57vXGzRO+e8L7Yl0ujqYJNOdzfElACJDuFgUMyssWFv5tJOLl4GvOWKDYD0wvNTD7wAAGFzlgr5Kc/At8OMbyu1QqWoh46kHBmlB9sJeryXpnubMfH4vFoL0TGzv/XIoqQzJLyKycG1BZ6diC9yai9PlEFREgXw4b9h9DPTDOpIjXjvapf+/N0HtLdWoPm5OWZ6NsnJg1wBptEAJgPwamrrfvuyOdFZb5ZAxZRa9/iUfq/O9Oi8U6OA0OjvocRp7bVSLBarsr3qqq5vykolovWzk6NfQ9YAz07n5DBNaT2fkitYzInOfjPAVacqmP6bHcJmAHYNzMLA+iwt9bI7mmqppe42A+JPqObNH1FXS52UOZWHZ5cJmgBXgC3AaWKoT1hLjwa9XgYjuJPYcJJn0Li7vUprybCwPgWwCvg6WpS0wRxuqZj07OkoMzwT7Aww1Ld16+sCVFp4L/0+PfkJdoUe3KTdIoM9Rl/T0B72vc7yKiZKlbuKBr+2egE9VfqsoZ4WJXNQUUaNYmo9hCijnjZhmPMjNjmZP2Lge7yXpwd7RVpPh2lufMSc9BzQw0KmBMSi+n0AaLx/CN2HtS+pc3xQTK3BjlD6jDNYIF0BNl+fPjqmP391Tb96dY8OmF0mfG7yOx0U8S8LY0IqObw9DUNrDLx4ze3RKe5L5JhT0geva0nKnwGPiwJuJ0WWXTLxmV5xUSbglGzCg2yIToqYYg3Sw60EPdpJ0IvDDN3fYPDLMPOLLYnHZ0y7tSCsFrIGAB6OcHIJIrXdOSH3yfgx4OIRtvd3v/qQjteLNDM1LckIMrXZ2CLlR2yD1dVq+7FyP0+BHsBLlTUbzIGWej38YtxPAaSOJNK31epSKYypB+wDdH33usr2qqu6vinr7/7+b+uXXc6vJgZtFHbNMruYpKXpUQE/OIZgD1TYkw3qIZcBLUaH2wkArknKjnf4RI6TeiODFUCLQYgZTisDIQDq1k9+aCa3VyY8DNkscpwdH1a9Mj5ZtzfXiRwAl0WjJyDYJK+F94d+Dcb2G+7cohZ+/nbd52tvUr0+6w2m11IBfuXL0qMzNuQHYIuVzK+jzAzF81ML4EfFGLpHAEX1+drKPqJmz6/VZHvGdVNs36L8O8H6LM13TH2fTUsczIlPBkKV6GCRCB/0vB4hgmcvR8elJGVCXv6R0K9+nOh/E2MaFZ+712CtDHro94H1QZc43q/KqB5YgQFAmDlFmC0dpJbpw6st+pfv3ae/fHWXHjFwbCWDlAszU0tEZOAll05LUCtKmmB+8PlEugNcXNxa9mA4vuAI8HM7Fxn8XCJ1CKP06Xcz8LlFowiZw04mKD2/y1KMwS4hvb73zwt0zazv+WHWdH1ZiyxRhoEPWseEZ1aSGqLuKQE9aPkghQgz+MHG7Ci7Qr/+6DGdbhRoanyC2to7ZHjFALzGxmazbGn06ZS3phpUUT6cCuTqtUuLum/lY+oV4OkyqSl01yJ3CNZ7enooEgp9XT3TVFd1fcNWLp38cmZ0kCKuOVpZnKKFiSEaY8Yn/T0YU1fKGXq7TfcVuIRYGeRQzgSzszDrg2RBAUWzGD2jx4bhFPTjmmpviyh+wEwaUFOJztkJsrZDm9cgwyoASoAYpACWtkZzYrOrpVHu08Z/v9hZpYNimtkkgyozyjZ+fYCe9PTaNHiZkgd1WQCwozz0Yri6GOVQKY/KsVFJJJCx19lyg3WKS0pPhxhMo+RpBNf2auZoAFxZJmH0/1oqmGCLMGTR9LXX6QlPpDio631GGbStTqY+AX7j/Z2SXlBcWaTHKHmuJ+mwEKO4z0n40WIX5qctzfR0J97vgAY+u5hjdwhjlTw/2Z0CqpGlKbEBizonaTfpo5enJfr08SHvY3p+sk7XuyU63izR4eYGbZdKlE+l+GQeliw/yfNjAESfb0mDnlObWxsyB6djgQHRQctgf+4lWuGNaU/o/JDssJ5AmG2IDhn8zpHrt5mgvZSPQTBOT3aS9HAjSheFAB1mlqkYdIgxNbR6hSCMqh2m56dEFzH7g33ZC2avMKVenJ2lPmuflDUN0GvQGXq1uoyphlpqNdsr9/nqTJanypymdq9C41f5GPNxWuTe1tpG/X199Ojhk6pgvbqq65u2SoXs6dTogAy2LE4O0bSI2PtMLd+Q7vchMaBfJzFA24aTKWQLts4mPrk3Sy/JYEnwkZRR/lYlNK9j4EMJ00hxAOjhfoO9PVImbGRQxMRoiwY9AJySJzSX+3atCpBQzkRi+fuPL2lq2K4ex+ALUbsBkjLc0tFcUd4sP4+h/1PlzRaT6SntX5O+b5P5WGN4xZjytGtfzNlhq/TNDCcXI+7INN42pRmt5QlQDbjw84SBNUqaNunx1VWAXq0JfEaQ7aClmaYHuiW5AAwIQyBHhQiDf5zC3kXx8jScXQxpQ7/F0PQp5mek0WNqFGnzQ0iJYOBbnhkh39yoRBqtR1yScPCIWeWri016cbZF7z84pWcXh3S8tU47a0XaXC0K80tEo2Js7Xa5TaE7AE+0fcz0HBJnpPw9ldfnAnmXnAx+Lgm0RZ5fLuJXsUYxv0x7bjED3M+F5T083Ekz+MXog/NVBsAE3WMAfLgTp7ulEB0xCCLpoRReFME7GJ9ryi5DMJgW/euPn9CKy0nDQ8MyuQlROvptMJwGmJkaO7NsWWuWOStdWsxd22D2+mpqyt6cdwx2KF6eNWZpFK/VY+nm78FRZXvVVV3fxIUBl8mRARrlk6d7Zkxy4uDiYpQ6RbvXqwAPJ1jHqI1mB3tEcO0c7ZFwVXtPh2npZevWYnMNNu0t9ebjcXKGDdqL60PyL87xidqivTabpWdngJ7RqwMAmT6cFSCG4NfjjQLd3d9kBsgssbGOWacqdarnUABolDzBAstDL403fD1NlxfzsgI9a4fuMWrQs2lQQ3nXLikO3ZLa3svMtu+GX6eaUq1kfdaKIRoZnhFHG5XaPtDVJADXg34fPD3boPOrVVl+Osx2oKuRBrubhflBVgG/y/tbSTouQHuX5JP8grC+Xu1wY3if2iwGWCvQwwZYA7jB/sD8YGrtXxinYtjFoBOk9ahbgl6P8iF6ec7Ad7VHz0+3JdXheLNIG4Uss74kJWNRZnw+6e+Jt+eCErQbpU6j3Dk3M6s9P+fF4cXvcVPI56EoBO5+L7M/FWibZQZYjPj4PUSl94e+3/3NpE5XT9Iv7m/SB6c5eucoIwG32wx8GT96fhPCWJPeOVoNLdJfvXtNu/kkTU0gVsgqfTaExzY3t5aNpStYWlmYXluh21PXDV2f2Qd8jRmaBtXGcwrja6BmBj6EzqaTmWoKQ3VV1zdxhfy++vGRwa+nGJAirllaWZwWBxcMuEDLN6RZGsqbmDQEO5gb66ft8DytzA3xfbq1k4jyvFSpBSo9AECiTKY7RbQOJokYnlzISyebBWrWoIWyJiQLzfU11Ka1ebitQ8qdqsdngFWP7t0hffzjp/fJPTdF9TW3ZcpT9fnU47sNltjaoNli0w1GaHh79rzW/zO8Pq0VsoTeCl9O8fXUCROQOEDcDvDr7zGMtjXoGWyvwtFF6QTV1Ch6hD0Mwn38WLA7S0tZ4C6lT13+xMbACwAQ4IcfHMszw1IS/Ohqm87XUnyij5FzZsIMyjXyDAd1aK3hPWrs4d4O6fWN9CF/sJsWJwbIMztKueAS7aQDdLaWpD0+os/3/LjEe02SzO8fbtLhepG2VwuUSyYom0KK+4pOcFeRRrisYo0WaWFuXtIdsM00d3h7avDDwEvQ46QYQm0DHhG6w+YMvT8w2sv1ON3bStAn1xv07kmB3tpNyQToCTPe/MoCxd0ztBpZojUG652Unz5/+5Lu72/waznIbh+kzk6LDLRIvFBjk5IqAKxu36E3b92i22ImfUeHyJbtxm7feU3OUKPYXSXISRSRef8ac5qzgcGyvY1/GI2M0ltPHleHWqqrur6J69/87W/qfV7XV9NDasDFMzcmjA/C5/EBqwl6fXzC3ojzSW1uQpLD8wGHiIvnx2zS7zMmH9UUYyVwtMuJF5OX0wBTW7cMiOBkDYcYOLG0MfhZ2hr48m0BP/QFDQDrqpjULINfE7U33KFC1C/9PjC8Zga+lnrl6oLHCvtrqiybloHPELVXDr2Yk56mtq/s+lKp07MZhtTd6nOB9Y0wkPRW2LapkmdHReJEuRxqCM1twvpa+f3UixQEE6vGlKekObTVKZcX0+lF2Z1N2JTODy4lCHy93kjSAX+XpURQ/m0G9L/XgOmIoyKgBrT2b0AGXTpEUykCfS10nxnqlR82nqkhkU18+uSUzgthevt0TbL83mWW/vR0h075B8vuWp5OYGyNnl82K3FGMuTiWWbw81Q4vBi9vkU97OJQvp6uJbPn53c5KeR1SbJDnMEvFfRQKR6g9WSA9vNhOivFGPxSAvRXG3F+b0laj7loLebmowK8rfgyvThZp8/feUDJaIwmJqbIau3T0oVWAT0wMTA0GEqr6KDbCvAAfrfvVEgSlBBdTKcZFN944039GKXVE83eLZW7d0unrN/Wbi3Q7oHt9XT3gAVXy5zVVV3f5JVOxL4EGC3xSQ+//pGGjRLY5FA/jTI4wbrsvBgV+6kE/ypP88kJI+N5/xzfzyapC3ARMUXcKBHyyd7S3mIOk4xhWEYcRxgU+OSf5+dIr3iomUGvs6VJwArSBGjzWmVSs06BVlujycQEvDQ7BPghmuftqxPyO2ap7vab4iaDgZfW+rKtWeXjlY9mk9nzs2pnFymJ6mlQKUdWyB9M0KuIWjKS4gEuw/y9zY/0MRsrxx1V9voMJ5qbU55llxV5bWal4uYCgbtmfSh7ChC21phAKKzPwqyvt11ik2JLk/QQoLCVocuNDG1lo7QwOaomb3tVL1Vtxchl83uXqc9OleeH9w2ZwxjKnvw5Zge7yT8zSGuhRTF6xpTnzx4d0QfXe/ThvUN6crxJz8736Hxnja5O9mmjtEqZZEqkDjLoos2tDbAz7M0M5ucA+1uY124vTnF5CTAARv1eyfRLMPjl+QfNaswvgy/rDILbaT7GlkV/uMZ7Lxuk49UobSf9tJcJ0l//9Dl99d99ScVMlmamZ0WvB7bXokucJtszTKXvMON781Y5QsjI0dMsrkZbj1WCosEMka7+Bj/2Tf23W7fv6N5grfQQ29r437Snh7LpTNWXs7qq65u8ErHIKXRm8HWMLE2Tj1nf0swYLUyM0Oz4IHn5+t3tHMX45BSVvoyHciuLFOUT7wIzPribGL6aKCkCHCAoz/gWZIQeewQyBhhTw0OyD2P1Fjpey9BIfy8/poWBSpU8W5i5iSMLWJsGP9WfU2VLo/+GjQnPmNdBJ+t5YXy1DHwNIq2oESCVxxqRRR3Nchk9PgG1dgWC3bqX2GMK2ZvMcqopcteg1VcRmSQZfpBjWBUDmx60CutT6Qkdr8Uptd0AvTKgtmi5RZOI+wFsRoafYn98bL4j22B/6PsNdDXTeB//ew1ZqRRy0jvMyq42U3S1W6DtXIwcM+MymIRSNYBPsT7V8+vVTjIyjNTZrMJ4tcZvhj/DwkivpLiD0T/Zz9Ev3jqhl6fr9OywSK8udujjByf086d36enFPp3ubdH2WomKzPpi4YiyNnO6xNZsSVIbnDrMFtl+Cvjm0fPjrQJuFxgAYXC9xAC4JJIH2JxFmAEak5/o/eV4Z1ZclIX2L+EXb9HrrSw9Y5b3Z88umJGeUzaRENDrR9KCpUfYXhvKnAx8pjuLthUTxqaZn2JvNXpro2kphd7W9+P9pgY5vvwmM0X8zdiGY0tdbb0AbGdHB40MDdPB3kG8emaprur6Bq+93Z341OggOSYGKeScosDChMgaYGc2xXtmpJ8200HKx1b41/kiBXknlhdloAAuGhj0AMPp4hOqEZ3jmBwUz0kwScniE2eWDhpFZpwNETrtkjqQ5pNaR1ODKk2C/TUrMTyGXdp0yRMAZgy6GMxPengQyjM43tvfoNjyEtXfeZMaeBtl0s7WBnNgRUqlxjSnOfCiwbRCu1dmgxU2Zp2tN5xRbDocVyY8+fPhM0FugJ6fMKmecnyRMeRi6PxezwY0ABXRR30dyroM5c7u5hr+bLdVpJEBhMz+VMkTGr8WmrJ3SULBQdpPbx+X6MXJBt3fL1EpFaKZ8SFhfWras/01i7UWHW2kchIB3hh2wY8R/PhJ+xfF9ivpmZVhl6uNJF2uJ+itw1V6/3qffvbkjN67f0qX+1u0t16i1WxG+n3RUEgPvHjMWCMlc1CDLgiyBQDOzc4yIDL7w1FY4Cy5mRl6nQvkczpU308S3dH780q2X9rvpNUw3F7CzG6Z5e7m6MXZNv306TVl4glyLDhpbHRcEhd6uq0MQF3U2tom8oWG+ibp292qSEg3GJwJhK+BnXHZYHdq6+sMhG8KGOr4IW1GDYZptfYK2GeS6Wr8UHVV1zd5nZ8enXY2N4gn5eywjZamhmncbhWwQnQQTu4pPhnuFxIU5pNR1I8Tkkuy48D6YK0Fr05o/yYGrAyUNpoe7pPnG9DlNZV9p0brh8RDsk0GLLYyUUkbaGPgw6ALRv0bmbU1190W5gaNnhpQaTDLkQJiotlrpE4GOf/8FL3/6FJS45vqa8xBF/QVDcYoU6YayIx+n6Wt8Uafr7zL9mVGibOcgGCUM1WOn0xK9irgcIz102BPm3JM0Zl9fV1tJriVpQ1lXZ+kw1tUz1BYpuHswsCHAFsE2Vp4g/UBAAF8g5Ym2SO9rZJWAP0apjzfPd8QFnS+maOoz8nA1611imXDbmvFgI3B9tDnQ9kT/b8JCPQHemQICYNM8AvFzvgcdJgL0ycPjuiXzy/p58/u0surIwG//fUiFTNpWivkGQDTFAYABlYE/BBftDAPsFOgJ8DHjG96kv+7GZ8UV5VFZoROBkAX38+3hMlP9P74vy2fm2I+F0XcDCSBJSpFvBJuuxEP0F4+Tscbq1TK5SgUDNPSkoeGhkYlccHS1S2gJ/29hiYBJsX2wOhqzGlOVdpUjO9NYXMKFAFuP+H9BoObcTS2gJ/u+dVq+QIYJQTybW38A8Nqpdmp6a9/9tHPqsBXXdX1TV1+j+tLDIdAQ2eVackeicURJsMMAGne0PYllh10xifUVGRF92LcFGfW5+D7DjHgYKAC9x3V4KcSzdteSw5okWnGfpx4ETfEoATWh9w2DLUgUR2AhRJmQ80bJuvrMEqeekjFaiQh4Agg48c8OtmmfMQvbi5gjDLk0lhnSiQgmTBAs7MixkgxwrJtmbzXilKkydg6jWw/NenZrzV9ysRaTUuiTzbDrK+v83WJw2/7eVYaXPd2lQeDLC3KwxMMr7PhFnU23hLwA+hB6qCmPJXEYagb+j6LTJYimeDpQY7ev7tDR8U4bWcj5FucYZDu5M+lhPpKa2gkt6vBlkE98KKYuEUGXfCDZGbISi4xLx+h8NK0gM71VoZ++uiYfvH0nD5/+5p+9tYFPb/YpYene3Syx+xvc4NW83lKM/vDwIsYWS8qXZ9ietgzNDc9TTMTkzQ1MSGyg5mpKZE8LEHsztvDrA9DLwHeEe8SpeS/NVxeFOeXzWySjrY3qJDOUCqRokgkRuPjUzLJiWw9A/Sgp6vHYIs2lFaTmTVmr88AvEpW94YAHQPfG9hv6l7grXJvj8Hvto4dMsTqKHFCJN/e3k79tn7yLLm/fufl21Xgq67q+maC3pJMH6IkCGaFoRNM982P2Wl+fEBYG2QO2EtTI7TDv7LzsRCflBy0ODNBYwP9Ypulyn9tMkQBmYEMsFhazXw4q56QtGmZQx9fB/BhsnB2uF9SFwA+kDdAzA77M5hbN/NlAB8y97q1fZlZgkTJk8ELpVEI2B3jg/Ty+oTZZBc11dyWkieGXDAx2mlo+hj8KkHP0q6BTwvbeyssysq+m3g9NUxjgJ+tqwJAupVWTkkF2miWAcMx1ifPZTBDEwC72sp9vkrWZyTEWxRbhJ+nTWv7pL/XUmsK2w2JQ7+AH7M+sTVTgnpk7p2VopLmcLGeln8v98K0aAshcRiU0qfqTSKtHUwcZc4h7eoCIFRShy7pW84woMqwEwMgSp9rEZdMVb5/tSvDLp89u6BfMPN7df+EHp0dMPhtS5wRBO6xSISCDH4wsZYyp+7zzTLogfExK2LWx5uPszPqNpQ/MfQC4PMB+NxL0lcO6vJ6fMVLqfAKA16S4vz8MQY8v2+FpqZmpcTZVcH00NtrNWUMtXpYpaLUeVsNuLzxRnnI5U0Btlsm+ClAvFXuBerH39F6PgBfo7Y0a+LX6WjvoD5rL42NjHydzWSqwFdd1fVNWr/5zX8dx+DDmL1XB6u2SdkPJ0D0eJbnxvmkx6A20CsWV2By6PUhTHQ1EaKFqXFamByRx/b/P+y9aXCd53UmyA3EvuMCF3ff9x3AxUYQK7GRABcQ3HeKK0iKpEhRlChSsmRJ1mLZlrw7XuMldqfTtuOkkkl1p9IdV/VUdWdmaqpmpn+kuvSn+0fPj6maqa6Zmp4z5znv+37fB1pO24mTTiX3q/rqYrkb7r14n/ec8yw6lDXJoILYm7KO7JEWn046yBqg0EzCIn8Pyy9USCX++sKR/bQwOcZVXp8krKN9CdAyDE8AnxG0m5mdtDm1zRnOIF/35rnjdOv8SQFMzPtQMSZ0FSlgx7fDfSV02zT9tEbQ0e605334nWqJmuSGgm5zlmTuFxUAx8/NrAwtT9iB4bZFnVX4tG2ZDXhRO9hWawUl/SHGwJbwa1szLWqPKlF7Xp9FneggTM98jPaMFsXP8pO3z9GDy/D0PE6XT67Tvrkp3qCUuIrPWL6eYg6e0YDNf8OQzPqUowvkGYbwMqYdYxbGSnR2dYauHF6UeR/SHCB5+OpbL9IXPvmQ3n70HD2+d4vucuV37ZmLdPXiBTpx5Ihk4M1pTR9mewC4STA8p7gK5J8J8AEMd3ElOD4hcz/M+5b3zNHq0gKtrSzTsUP76eT6IT7X6OSRdTq4ukoryyu0Z26RK71dVNCElhgDj5BZvH5tSeYIitWMTGuG5+pzgFufVd2Z7wXgJI7Ia3l4KganZ1Mqu7E3Q+UXYcBNp/j1LZY/Ory2VgO+2lE7/r4cH374wTr0cxMQqXN1Bs0eKPlxmCfz4gyiygxXewBAOHsMGMcPBjmYWO+fHefFUM3/QPCQJAVewKereVnwjTOJ06tStTpNmxMekhEGvYSAHn6GVurlU0cYoAKiyYP+DgxPMDTDVruTwS9i6/kAZAA+meWJa4tHJBNvPrxDMwzKfk+v6PqMo0ssoLP7ntYH6koypeUOGcvqLGQxQcU1JmFHFuX132YnMqjqtahnmFUGDcgCCnqWlhfjaDsR3ojhrddIg14uFXVk+IHpqRIbROagJQ5Zo+8TWzOfzvPzi/3ZeAVi9JKEsL7z/GV69dmL9PLNi8KenZ8c1WYE2m/VyBsyqjpHZQ4ArBbUe14V0k6SLxMCqMsTA3RgZoTWF3fTtWMrDKzH6dMv3aIvv/mQvvqpR/TFN16iL7z5iB4+e51uX32Gbl1+hs6dOA6TZiG7mJYn2JwAPmTjAfB2j6P1qSpAnItzc7RH25tJpt/evXT4wCqD6GE6wlXeytJeWlxAIvwSjY5BusCgl8kJixPSBQCQATyZ7UGP19e3SbqAE0Cnzl5rpmdILcp+zMvVnM7ecxhZW5q/fkNsUfFEsDVDtVkqlmh8dNdHn/3sBzVWZ+2oHX9fDuyeJ2BRxhUf5ngApK7ONvG8BJAA/KoFJTcYKShDY1QFVQbEYTlVkOyAbpuhhYa5oGqhKQE3EhdyJlrIyA90mxDgMJCJyuMoT8+gMBpv8eK8MjfNIBXgSo0BikEq4u21wA9zPgV+AanYhJEJazItUEdFhts8c/wQvXJ3g5Jc6Xn6XAKAIV+fxCMpA2y/JWR3WpdJdedIc0jH7dP8DYWkDeI5BzPTgCF+r+ZmUa740sK6TEfVa2oYnNaMT1eBGcfvjNTBOL3gtvDqhHOL0fbhRKpDWmZ+xtMTABmSluckV2dIJb93fo2++eZ9euXGeSGCnDy0l2bGq1a6BjYt0opNRqy2sxG0o+orSZBtTAXjIhuwnBFtJwgv5w7M091zh6Xl+VUGvm+/94S+/qmX6R20PJ+9SvevP0N3ROB+ls6eOkUnjx+nA/v3C/hhlrebQW8CoMeXhuwyMTYuwDc1wT/j3y0h4BYuL0uLdHBlH63u20sHVg/QkfXjDKB7qDo0SqXSAGWyeYox6IFc4gWRxRdQRBY+hbCiKzyVjO7RbUvdwsRlTw91d3fJ2dPTTb36e/y8q6uL2tvbqKmxUbR/8OS0xOua0SkaPvhzhsISfTQ2Oi5p9Tc2btbMqWtH7fj7cMDeCzM9SUHnCg5MybbWZmUOzRWTu6dTwKPCCyA0XWBrQn8HwgqqQlwOaEG0cgJRVHmx8dL+lJIKLiL2oHUaAMzx4ow5WFm3BwEmubhKP9g7Pc6VyXEGOd5pe/sl0QHPBS1MtCzDfo/y8TRm1GH/JlcWVIMAtVwsTG/cv0nzu0aor6eL3K4uYYii+os5nFxUu9QBetqtxbi2pHWlp8ylVVySaX/mdN6eqW4N6BW0OXQppdqgAD9sIESgnlKVsUmANxuBrANEMwmHTVrC6Az9wuBEazMdBuj1M6gbeYNHdH/5hMrxU/O+hFTfa3Oj9OjKUfrw0XV69txRunPxpHhijgwUJErJpDiImXVStW7xHqLlCWanGFnnlLcnzkHMb7nSX9pdpSOLk3T1qNLTvXH3Mn3+lbv0vfdfoa9+8iF97sk9evXudan87m5cpWuXLtHxo0clwgj5fRC0A/yMrk9mf9rPE9o/fA1z6z3i/DLDgLePb7tCJ06cpvPnL9OBA+s0OjohJBYYUEuobDCs8/V8Cty0dEFalgxYLa2tVF9fT3V1dVS3Ywdt376Ntm7dQlu3bCH+t5BLfL9t61aq27aFtm/bKl9v1WdHRxtXkyEb8LTDi0eH00IyEYnGJN29Wh2h0ZExWjt4uCZgrx2147/l8Y2vfWV9uloW0EJFgdYiqqDOjhYhbkT9bupgAITzCTL00IYEow+6vmFhamZEcjDgcAEBoUWE6lx5DaLtmYpbll0mAUFSCPS8TLU6FRkE7E4BGHPqiurK8YOEiCS/xy1WZvCyBMtRQEsbUZvcPUurBwAM2ZFGIMUc27uHnnDVlwj4dHqDIrngOsmI39IBpnT8kDKuDljfm4pP5fFFBJxNNWbP/8JWK9fJXDXfG7kAKrBS2gZK5+0tPV/Smd+nLdI0gSepQ30xz8vFfAJ8aQ18YmsGpmfMq/w8uTpEy3O4EBfw2z89TDdO7qc3712lG2fW6erJNVpb3sMVe0ZFKqVjSnIiXp4Jy2wAre0yqr60IvDkIXvgDRCAb3q4JFl+CLKFoPza8VX68uv36bvvvUy///VP0/c/9zq98+g5evLcLXrn1cd098YGXbt8ic6fOUOH9h/gSm5efDtVhNGsNf/DCf0bQA+2Znv4XN23Qiv7VrnSO0inTp6nffsO0tDQiFR4IR01ZCKCJAndrSowgFOPJqps0eC2jQFtBwNe3Y7tVF/H584d1LCzjhrq66ixHpc7aGedOflnDfXUzv8T7a0t1N/bK9Zlbkc6u8eR3oD2akhYnXHKM/iVCiXau7Dw0cP792tzvtpRO/5bHC8+/9x7S7uHJWkBrS3M8jrbmvmfuUuo+FF/n4BFIuTlyqhXsuJgXjw9XKbJalE8O1EhDmqz6qIWckvad1pZZ6mWZ9yi5Ockeie4KQvPbuXZQGO7pihB+frSLN04d5zikQjFo2FpaxYTIYpwxYeqDWSXQH+f9uV0Cxhacz4AYkiBW55B471XX6ITB/fx9d3CFI1yxRhxCOJN1Zi2QDD4C3FEZh6XfVrjFzMgFrJZoHE7u8/Z/gSQ7KqkuSoLWdZlznlfNul8bfhnDss0c12AH8ysi2gLo90Z9mh3F6XtU8kOXgFGWJ8B/EYY/CCtODw3TnfPrtHjjbN06+xRuv3MKXldYEKOTQ0IL9jMQK+Jqg6fCZBeSkJ8UfM/I9tAaxxdAIj194yV6cDcGJ3Zv4ceXjlJX33jAf30a59m8PsMffv91+hLbz6mtx49T48ZABFpdIqrviOH16T6E2NrzP1mdGitAN6syB+Q9rB/dZXW19Zpbe0wHV0/TuuHj9Pk5CzlciWKRlWorHFjcVZghsSCdiQAqn7nTupob6Werk5y93aTD90Dr+oehGGQzifa6jA5d7t6+HTx/4WLv+fPm58/G4k4lfI5qhQLlEokJMYIKetop5pII5Prh+8x40sl+X8kl6fRoepHn37nndqcr3bUjr/r4/Sxwz9fmBgSITPabEgqh62Xq7NdyCl+d7cAhjAvQdnnagiMSixy0yNlobKPV3K8QGYlhaGoZ3o4AXyYBVrVXwLuI7qSiakWJmZHONE+y+n2YVYv7sYmDI8tM0To/0ppevzsZZoarVIkFJAFCc8n5Omlvu4O8vDihZkfzKwBZHFpd6rnn3FEC6Fti4TyT718XwAVf7OXwR0VYUS3PEUT6BCxW3IJR1Vme3aGNrVtne1bY/9l/C9NdSvuKLoNilnpsMxTQ1JB2c/VYYZtKmOnZlBXj3jN8D5lNJlFNH7BPutEBSiAKHFGqjqsaPCDpRxSyV+/fZ7efnCNHm6cpzuXT0vlh8zFAQ12FTG21l6qqMqNHEU7vJQ14WW4mJL3CUSmlZkROrU6R7fPrdOb969x5fc8/dF3PqQff/Vd+vrbL9P7j+/Ru0+epwcbl+mle3fp9vUNunLhAoPZOu1bXhaQA9gt6Hne0vwCg+M6Hdx/EK1CAb2FhX0iTE+mshSOxITAogynvVb15YwKMuzLtrY2ITTN7sJcM0NBv4/CgQDFImFKxGKUTiYonUpSIhqlSDBIIf5dJBSSTVcqzpu4LG8KKhUaGarK7HFmCpKMaUrEE3aaA4BWqkDV8gSjNM3AV+XbIKXizp3nasBXO2rH39Xx83/1L32ri7M0xrtzABQYi3BGEaIHgwYWN3d3u1RsJR1dU+LKAy1PVFIDkjpQoIVdgzTGwIdEBbMwmsibvJZApLTll6SY6yoKgJLRIFdMKkILvs9pAXsuYbcKizIPUyJqAMOpg0t0am2VwapXTp+7l5IAbFeXgJ6Z1xmmp5nXZbQeL+Go/D7x/E06vc731dsjRBcBPu3j6ZwNphwJEArMngY5A4JBh3WaQ/uXCG+q0mwCTERABJIHaOJg06bcZ0J2i9cKsX2K5ZmIOGaAEXm+YKTmZNaHOZ9b7MwU0cWtGZ8qxw+en4MMfGPFBG9eCpJXd/3oEr14+Qg9vHaG7jxzWli0YHoq67WE6PoM4UUs2bQG0YBe2WL3JoTVO1kt0P65XQx+Y2JucO4QZA5H6d3nr9EP3n8ibc8ffPYTkpjw7Q/eoS+++xa9/PxzInKHzg9sTxBWlhcXGPTmxNcTc8BlBoxz556ho0dOMHgA9IYpk8kpAktAVXpuRxbe07FAYFuClNKwcwd1tjbx6+Tlv3OMjh5cobGRURocHKERvtw1PkETfOJyfGwXTUxM0vT0LC0t7aUVrkhXVg7Q3J4FGt81SUPVcXkemN35ubIT5xbzmB6PljMEKRZLiIh+9+4p2s/gfXPjZg34akft+Ls43nj18TpmMSVepFDlAfQg2oYdmAopjUrlVNTtyaL8LCLEiQBXRbALw8KP3f0EBOwG+BAmq8HPsAExL4sG+snHFRUqst6udqkm+7o7RUAe9vWJCwvuEwJ5zPZyCWciuQIZxdBUgInInBfvbFCRd9ye3l5JXUC1iN07ZpAgvUhoLcArbFdtSZE1eJVsAa0sBselyRF699E9GuIdvyLM9Ep7VKrFoPIFVeDpt6s/3YI1+r6UBkA7uSFkVXcZYXpGbSswAUAjhQiKCbQS7keVHpKrpZQ22jY5g05pg0pzt1+jvDPPD+8j2rrBfrE1E5KLBj7T7oTI3Xh5llJBGsxGaDQfo3EQXoZydIorvzfvXKQ7547S5eOH6PTaCs2OD/N7y++vtLHjqpWNLD+Z5cYkeUPZzsVk01Lm5wimLz4bu4eKXPmVaX58ULu7LEpSxLffeZF+5zOv0F/88e/Qv/6DH9Dvff1D+twbT+j1F+8L2/PimZN0dO2AsDVXlhZFjL5vaYlOHD9JN2/eoQsXLtPc3CIV8mVKpbNiBYY5GtqMfQ5DaeOf6fy+o71d5ngtjTuppamemhvrqau9lb715Q/omYvP0NTMvIATzKyzmbxYnBX5+8rAEI2MjjO4jQowQhAPAg2IMwBUl8slAnWXMES9ll2Zhys9tDkBygBnzPiGGSDn5hboxRdfrgFf7agdf9vHzauXfogF1jArlQ1XWFqc4wNFYRdivpETFl9cLebRkJgjIw8u5HHJvA9WYhAwo9WJmQ5anTgN6Nmp4iFxWfH0dlFPZ6ssNA0gB/DCs7Nuu5AHsPC4OtF24sU5FrDYhFndPgToKIKK0u5hlvXuqw9pec+szGFQ8QU9bqXrYzBVdmR2+gJuJ1VeUFmbKfDzSgsUrFC09m5xhRP0MbB7VEWLU3xA4QoDiURUSSQEAK3UdxsAjWNM1gqs3ZwPmN3U6nSmuIetlqFiecIRJSngJ4QWh31ZXksc1KYgZAGfFWmk30+xXwt7VYoDg17KAj84vBjwU84uA6mg2JohxmhiIEP7dg/QtSOL9Pj6KXp047y0la+cPEwTwxWxNpNZXy6lMhh1C7uks/vUpiUkzE/R+PG5eygvTj8wPDi2b4YuHdlHL109Re893KA/+M7n6F/86Cv0F3/yu/Tjr71H33iPge/BLdq4cJquXjhDF04ep/OnTtLxdQTanqAHL7xEDx8+piuXN2jPniUaGBymRDJFfgYU46vpEh9NYxatjKJdWp+HKq8N7E2u9Br5bG9uoA6u+LrbW2Suffv6JcowyOF6nR2d1MrXbW9ro87OTurmn5kT88COjnZqa2uh1uYmampsoOamRnJ1d8vjoq3p0bo+rwY/AJ8SsEclDgmCeojY333n3Rq5pXbUjr/N4+zxwx/tHiqoikEvphleOBO8gGNnHg24pfrLaamBmTNJFYMoIQalmFiFuQQ8AHxIVwDwjepA2oKWLhj7LQAFqi8AX3dHqyw2bc2N1NbCJ3+NXXdzQx011e+Qn2O2h9anYXGa9qTS4vmlshvjqqipfid18cID6cLy1DjtGRsUhidmd16uViFxiOiqT1V4/aqCC/us9HbTdp0dHaR3X75Hu4cHhSnqkcw+t5AcrLanfnw5N8kklHTCPFcTaSS2Z9GADZAaCHNW3l9QSC6GBGPE7WgXzsLVpZQSwERlZeQStg+oNgCw2J0hTbCJWAn3eH6o+mBllgj0yZnSKQ5K1+ejciIglmblFFi3KskBVmoHZ4bpyfUTEjX00tUz9PDaOSVzqBRE2A6NHxieZd0CLxpbtlTU0vkNisxBBdji8wEGMIwNzuyfp9tnD9Nz5w/T7dMH6He/9Bb9+EufpH/1oy/Rt955mT718Ba99eg+vfbCPXr84B7du3WLbm3cpBdeeJkeP36Nrl2/TQsLe6lQrFAoElOaPI8Sobu0uFyMox3C866ubgGqlpZmamzYKczNztZG6uloob6uNv4cNdPy9C6qr2+Qs7GBgYwBrauzg/qEzNIrlyC2uLW2DyG1/VbqQoArxLIYX+P54Oz3eDc7uOgKMOAPiV1aoVCg0ydP/by2KtWO2vG3dPzpn/6Jb9/sBI0zOBVTUcfiGaM0X46X81w1dVvxOjYhQ+nOcKncRuLC7AxowThmbkhqmJKkhZw1CyxovV5eMvcCAnz9ri6p6noY/DoAelz5dfPCg9025iwAQYAZMufSDsmAkxCC+RHacQC8Xr4vgCliipDdtzI5ys8vJSL03s52adUGxZnFLaBnVX8G8CJBy+UFAHnp2CF6/up5sURzdXcqOzNJe3dbsggxwg55NfDp9qdD5rBJ7B6zI41Ssc0zRlPpyTwzFbFILsWMkg6MM1CMl9MMjEEruSGrbdCccUWmZZrXVWFBe4Pi+7SWOTirPlwaQbvx9CwmGABTSuJQzUVl5gfwO7owTo+vHqe3nrtEL14/S7cvnqQDS7NWjFFFgx9mk2hzymwPl5moWM3B0swAIJxexgeyNMfgtzw5TOuLk3SFK79nTx5ggD1FP/na2/TTr75N/xNXfj//6XfpJ9/5Cv3+D75Jv/21L9OTR49oY+NZevDgEV24eFWYm4lEWtqLaCGiunILgcVrCdK7HRZjCvQ6qJVBr6lRgR4+e67OFvK5OinIn/tjK/O0uneZ0umctEzjiaTMDNHixAnReZIfMx5PSasS1meQJuDE88AlbMhENqFdWlSYrcdKbVdBtD6Z86XTGaoODdHtW7dHaqtT7agdfwvHyy88vz45qIJgbW2dFpKjdcUg5eJdryQaJGzxdSFlh5Lia+jwRvJxkTIERTLQK7/fVcnRNFco0HBZsz2dNID7isjcrVvanGgr+dw9IpVoZ/ADeQZg2KW/b+bdOJxaDEgZMggWcrTYZqt5ATwXg2cf3xZEG7QE0UpFew06xKD27gQbFfNDZ7vSuLFg7meJ3MXE2i9s07dfuksrc5Pkk6R2Be4hzQ5VuX8eq2JMPFX1GZBT9+nUAQatrxX46Upatyrx+qqUiphsMlQVleAKOiNG0NgE5DWYZR3Zf1bFp23RBDhTasaW15UhwB0VcFpn95nAWpBc8pafpwZAnegAT0+0WvftHqTzB2fplRun6YPHz9LLN87TtTPrtMQbqLIE1xqGpxKuI8EBHYCqSB60xyfipSBszyfE0Qd+rrC5g6H1oblxOr0ySy9ePkFff/sl+os/+RH9+3/7L+g//m//hv7Dv/sf6M9+9nv07uuv0cULl+jSpQ06cuSEgF44EhcHFL9fJSqAKdmnQcXM8KzkhO4eC/SaGfSUNm87f97UZ8/LwAcjgS9/+jUBI5eu5Hp7GTA7O6Xqg9xh+/btDq3fNtmgtbc08SaOP4tcFXoRPAsja53k0KctywDEbn0av84YA2upWARRp1bt1Y7a8bdxXLlw9oezI2WpIkp85pF5x2eaF8bBYpYXQR/1dLUL5d/SjYFFaVlV6SRxMSmO0DBXBHmuXhQZpVcWcyx645WsLGqi4dMyBjGlZhCArACghrkbQA9VE6q7fl50cALAUAUCDCFJyDoMoUUYriseiK1RHXa0NEjL1NvXJZUn5o2473QkKDKEND8mjK4BemZOt0nILgQZ5bsprUgtWcDM7/rZY/SZ1x+Jcw20W163YnmGLCszxQY192W3PzXwWXNAWwJhB+Oq36Ud1mx5XU1ntSRBWbrZLcSRUlqYtHh+IseIh+3KTjMrTQZgzmGOXXBU9VKZBlUyu6n6sobdiVmfXPbLJZiekDgA+PB6r0xW6fLhBXr12nEGqON058IxBX4zEzRUyqs5n7BtEwJ8qPpUEkVUgG9QMzwBfKj+EC48N1qmxfEKrU6PSFbjC1dO0hdeu09/+K3P0n/4X/81/Zf/5/+i//3f/y/0jQ/ep2uXr9KJ42dobe0ozcwuUDZbZNBTaemikYNOzxhEizZPZ+Kh2nO5qIPBq621hSu9ehGgb9++lVqb0SJvkg0UWuJ4jgC27QxoEKY3MKg1MNhBnI6WJ6zImpubxZasl+/T4+HPvs8nHp2StsBABlF6Z1ePAK4zrd2SUehZH9xbopEoZVJJurlxo1bt1Y7a8Zs+Tq0f+mhudEAMhwFEWVkIowxyARop5/ifvkt0a3Er1SAkLitlPcMpavE5LiVQFUy9TFR8IUH/Bthg4ceCh8QFCNkHi2mJtVFzqbCwOQMel1RLkUC/VGbJsJdBrkUqskB/D1dX3dKydHW1yiKprMxUuzCl5Q5lXozFOQOEBAZRMEMBmqgkURF96d3XaGqsKpUbTszOEvyYmEUCeGG3FtHSBgG/iO3FaTL8BMR5If/i26/QiQN7KeDlXbuWRwSNl+cmEPXZMz9d5SX1vM9pxWZme8Yr1IBXNhHReriYVb2JRCAV03OzmLAjkU4BSzIJutVgl9fXsQJsE7YPqGqdRqyNDP4uzDYhXpcUh4jW88mlOhUAeoXAVBGfVOgKIarP0sLYAJ1bnaUPXrxKj66eZPA7Ts9ePElL07tosJC2rO0E+DT44VTtzgQN5ePS7gTogbE6NZijg1ztnUWKx8EF2jh5gF5gUP2tT96n/+M//iX93//5P9Mf/+i7dOfGLTp04DAtLu6jpeVVGhgYoUg0Lho9I1lQczSvVFS9VgK6qvhASIFOr7mpQZxXAHqN9YrQ0t3eLJ0GZBFOjlbFcBqklV6+HSozVJP+YEhAFrpAPG4imRb2KE5IEjCr83rUfK+zs1vaqgbwTGq728z2PCqIFkCZTMQhyq9ZldWO2vGbPH7ykx+PLEyO0lglT2VekLJ6kU3xQhgJ+mRxQmsxgrYdFmNdgVRLWSEvSB6bblkaj0204MSXkas+uKSALh/RrihoMU4KbT0vDi54TCzkqOzMwm8IIaOVtFg8hb0gnvQJixOggkBZVSmoFHY8L1RW+FmQgXPbtq3CAEWr1I25TL9LQBTEidWpYbp79RzdvHxWHFsgPA/DhQWEGgYugGPQyfIEQ1SbWCe0RMG4s0AIf/7IAXr7lQfSJuxzdZO7x1SWthG2me1ZbFMNpkp+4NDxOWZ/dhUb2mRZlrcATSe3A/C0vymkISMiBlcSh6Kuwi1pwyY7NHN/0U2aQZMmj1YvgA3tTan4Iv0CfhkDhJj5JbhajgfEzBrvM0ToU9UCHZgdo/sXDtP7D6/Tp56/Ri/ffIY2zh6l2V3DDH4ZYXmi8pdTtzqH5BKgp+d8/P3cSIkmB3JyeXBuFx1bnqbje6fp2tG99Kc//BL9f//l/6X/+c//OT24c1tkCwvzyzQ1NUel8hADkO23qdIVfJo96bcE6b2a0SnszfZ2amluEjILPjt1O7ZRa1O9zJPx+e/kz+E7r9ynfKFM/aLv6xeTaaQ0mJanywUTagOgTVTP1eAO7eO5g6tEfN/R0anbm6g4bcAzMz6PI4w2EuHNTrFA3/7Wd2pMztpRO35Tx7Mb1+5gnoedONh3hgqfjKrWXpYXYfhtYuGXikDbYR1bXaJT+xelTWlSwI2jiJEWSKoAV17lFC+mEZ9UfdDBwXVllHfzyGNDxaa0ez5LtK0Wfr8QNVzd7QJ2EWlBqjZkUFugYcHM6/aoig9KUldHqxgBNzXUUT/f1tfXJbMaV0ezLMpLE0NCrhkt5ejWpdN8+zgDYzdXjx3avswlFeXmlqffsjAzhtSm4kMLFCkQH7z5hC6cOMKg2Ss2VZj5yawvoEyw05LZZ7M7VXq7w8fTYW9mrov7VqSXoDWjyycNGcVUbGpOh58rwkhCjAJGdctTbMm0cXfWkdhggmydNmrme6ma+TpKB+kTpqeZ9YmXZ0TFGRX0rM8kOZT1rG+qmufXeVAy/F6+eoLee+EavXLrIj1/5QwdO7DMG6acAJ8xKh/KqXR2kFwGsiC6RMWObYgrQLjTIIMQye1oeeJ+AaqvXj9J/+d/+oj+8t/8S/rUk0d06uRpmp2Zp5HhcWlvouIC6KHKQotTqjxDINGG05Klpxmc7Qx6QmZpqBe5DAylWxrrhNSCiq+Vq0AYLzQ3Nsl1IEVobWmidsya21r4f6SVOtr4bG/jz2CHzPvA8OzuUrIGYXi6+8TdpdeR3yczPlffL5BaVAJ7gOJ8/fNnz79XW6lqR+34DR0H9y3+EMQBSUNAxZaKW6AHr0XIENw9HdoCLCqVXoV/vjI/TS9tnBbXFkkhtyjzduK3zJ+g00LbMQWbMV7EecFEJYWqBjv6MfhxckWCFqBxJTEm1KhWutpb5DIhMzKlpTNRQGiNoTrBc8W8EcJnyB0adm4XBqjH1S4GwfW8iAU9PeIKMj1U5IU0LZUoQPTgwgydOnxQfBQxnxNdH8BZO9EoRxbtw6nlDDbD028BGeaEh/fNM/g95tcgJqJ2D4MnbhsNqnYp2sPOGZ9poSqXF7vKA8iZTUfKsh4LbbIbMw43MtdzVNoiDEfqeV7FPgE0oM3Da2cyAQ3AOR1csnE7xigT35wdqHIJIWT3ipcnqj/F8PToKlCdCLJFdQ+wkrT4qiKkHF+eolc2TtGTjTOS4bdx/gStLEzTUDFj2clJlSdhtVFpcyJeCmkb+J2A3mBOktunhvJizn14fpx+98tv0n/6y/+Rvv+F9+ncKYDeHqpWIRCvUDQWtyo9mzHpESZnn5WYrgCnq7uH2hmo2qVCa9TShe3SIgfo4bOEig+yl2QsImCE9iNYmQiIDYXB0gyRPxCw5ohoq6LaBJszmc5SPJGSxIdMJiuyBRNp1GvijUwWn449Qmafz+eXam9qcuqj2kpVO2rHb+g4emAfLyJFNftJJ3RatwI9pKCj8kHrUEBMSwzA7ExFQ0Jjhzkv5lfC7IyHLVZmPqFJEzoCBwLlIV7QhnMxIUyEZM7nE5d+sBAhXs4bM2Xd4gTwgQEn6QUaCI22T8gFXCWaViBuNzc2wNevp1beoYN918o79B07tgshJux1yaKJigKaMeTpSeXIVeQIg+GjezdpsJjn+4owSKlZnxhsa+9OAcCAFrFr8JIqUCe0m4oOur+3Ht2lS6eOWonvKuldmVgbI2sBvU0gaJNaxDjahNg6kxscptx4nyo6+cDMUg3wgRAiga85JQ4fLialbRjmv7eg30ezSTHzPzPbMw4yTg9RJaVQ1XSKQQ9+ngJ0YdXqTGt3l7zW+BV4czPEjwcJCwBrFwMgKuyji5P0+s2zAn4vbZyXed/h5TnRcYLkZNqblWxUNktmvgejcgG/cpqr9Bzt4Ypv71SV7p07RP/uz39Cv/+ND+jy2TO0Z25eHFEAepAUIFIIQa/QwPULcxPel/06M89tzfZEr9fZJW3JlmZV7UGoXrd9K7U17pRKD6CH2d7nP/WEFuYXaWRsggaGhuXxkqm0gB7mfQDPtrZ2am5uoaamJiG3KCBtoAa5353U3e3a5AjT55jt9fUZqzKl3UPFl+H7f/XJqzWXltpRO/6mx/e/+62RlZlxmeeZNiUW07S0uMIMegNiE+YMLkX1gcoCQNTX1SoJDMaXUkkZbD9Is1hbZsj89VAmKnovLJ6Y1WGhR2UyNVzU5IqotOJSAnp+XoB2yhwQ1xnmhQ9ACbCCbhACZ9WOU1q9pYkqNTdgd76Duhn0du7YRtu2bqFmAcFmGufbF1NKFB/VEUPKm1IlHlw5fYTOHl1jMApTIhpWQMSPpwg03eJDKvIGDXTOM6rPuICph1bnJumDt57QQCFLIb4NiEBBr9vB8PRqgosOrI0EhdxiEXOMlMGh6zOAqHIHbSlC3ujvtE6vkourxAOZryoSDDYIAD+0jPH3G9Zt3srmi9i5gE7DbO31qdxkQnLbWLBfJbMbT0+YWIeVxi+rExwAfIOZiOjx8D5hzohKfM9YhS4emqe37z1D3/jUS/SlT9yX5IWxkpJf4Dkikd0kteNnZV29QtqA1AbMDfdNDdPGyRX659//HP33P/ttevHmJZqdmhLdXDKVETIJ8uvgyqL0el7L9NkwJY0Xpmj2jF5PWJwNUu2B0IIWJ0APnx+A3sGFSf58hMTBpbmxURifwuSsr5OoIXQVcFuwOuHK0tnRJqGzffCF9Xik+oSezzKgZtBzyzxPnSaE1sQSoarMpTN0/MjRmnyhdtSOv+lxd+PKHQAF2kwAPZPaDdCrSC5eUlwprFBVeEZyVVHJJ0VT1dPeLJWSSRMHqWVhckzMlo3vZNZyeFFiaRFdxwOyKMYDfSIpgE4MC1sxFbZMpLPxgGjs2njhAJkGLVLQ2ZNhJQKPBNzS8lK2aaqS3MUVAzRWWKg6W7nK27ZVwj+h7cNcD24muH8816gYTOt5WzRoCe2nhsv0YOMZ/jtTFAmq5AYAIwgyXqegXVdsMZPdp0+0MqUC5PuN+vrpleeu082Lp8jHt0NsEQA0pFunYYcoPukgsAiDE2QSw+KMhS1ii1RgDp9NnBCCF7T/ZjbhzCVUqecAQHl9+TUqJkNShWV0JW1ILgbYjGjeKaOw45HCVsKESCtE4qAF7rrqU8BnpzcIySUVluqtmo8Ly3N2pET7pkfovZefpW9/8Ak6tm+OZoZLUu2N8YkWrapUExJdha+x8QFRCeA3zu87bO4uri/RN99+gX76tbfpO5/9BB1YWhQPSzAmozjB4GSQUexNn2pvAkxAarFmfKriQg6eqfagvUO1By9OxQJuELG6u6ddkiaCXo+VnN4DizHM6/r6+HSTnx8Lbc1olE+wOeXruDynOFqdiTTluRKNxOIWmQYtVlN99unqTz1P1eKEfGFwoEIffvaDGqGldtSOv8lx4cThn6MlKLIDU+mllbXV+FCJQalfnFJQwWARlnmezsrDzKiXATGnc+SwGO+Z3CU09SGubgRMYKflqPrSDm9KmY+FPFIpRrS5NMCszAuktLjSEa7YGsSE2kQPQdYAkDDzLxAbSlqvJt6OvICDdSczPQY9lXS9hTq56mtvbZSkd8wvxQrMoZ1Lm9ZsQlH64TN67dRROrA4RwGvlys1n4TLgjwDk2zMFI20Imq5sZjgWl39BVTLE3ZlE1xJf/iJBzRZrXDF1yukGeMIg7/dPBe7ulMVnjXve8rJxbYdsz02DXkoZ2KOjIkAnzJXTaivAXwlvMZccRexseC/RWKinopEcmYG2i4vEQv0jCuPmG/DFDzm161OndYuwbV88s/B8iylQnICcEeKCdo9kKG9uwfonQeXac94VVrTaGMC+CrZuNWeNTIGVOiY8Q3qn8Hibu/uIXp8/Tj9wdffpX/yxTfo4ol1GhoYFJDBTC/CoIM8PbQIvdLiVCDidiSnK9YkAKeXAayHKzNV7Yl8gas2cWiBdKGjWbSi7p5OevvxfZqenKU4A5jXb9uKufVprMUgivchQigckRgh+GvGGMASAEB+ftLmdPVas0WT74dLuU/d4hSdXyxGJ48frxFaakft+Jsc8ExEOnpJg54RjCd5MZsZG5LKJsTVSlwqEbUYW2JjXkihf1MttZDM+TAT+/wn7lDE51Etu1jISvs2i7AxXUYb0KsF46DvK6Zjv8yg0A6Dvg4LDqoR0PCRxzY7XpH5Gm6Pyg6VntIKxqWVh4UdLSkw70A337FNtTdRreJvgc8j2I3i+4kZFYBX6+VMRJDy8gwIgO0aLNKDm9f4b0sK6y4U8MtsEeQezOmC2oYsLD6cHgsAUUFKuzPgtSKNAHA3zx6lR89ellkfzLCxoZC0dw2UFiM0Gtzk5mK7uqgNA15LA5KWZVlCmU2bBIqstmdTGYUK+LKS7hAS0IOJAKo+bC6k1ezrdXiEmlaryQy038NUbDMAG2NtVMPYFGDeB9DDfYL0olqdAZE/4LKYDNBQFm3PKE1Xc3Th4BzN7xqiCd5kDYmEQVmXiX2ZbGjiipWKsFp+rmXx8QwL03NmpEjn9s/S995/TH/4zffpxY2LNDM5RZl0TlV7DH5GuhDwB4VgoiQLHqvKE2cUvnRLxeUSzR4ILWBmonVpWJxKqN5KHv7Mr+7ZRbMTu5XTiwFOVGfw3OT7wukTcbpXsveQwRePhCkaClKYP0PwcMVmCo4wRr7gnOe5jXxBp72DjIPKcWaqRmipHbXjr328/MK99QOzu4TEYcAOAIXWGdqb4wMF6mxvUR6UUQ1WvChiRoWFCSQPgBZE7Fh0S3mExqaEFdnV0aaAUsscDGECt0+Z1hj/Hho608bDz5Zmxqm/p0tacSZhAIA3z1WASA0Y+LCQA1hQ2YGUYpxJELoKhieAso7PVl6wWppUtdfb1SoMxmWuDBBqWuXTMD6TURtUTIsxKVE8Pm1K7aE7V87Twb1LFI8iWDco1RmqQZPcgDPoUQAoZBVtayanVQkq4gscab7yzqu0f36aF74+AUBcihTCcnAJWMCr7NBsgXwystnHU7UeI1ZWXyb21DxOwnkN4EXEwg3MSABHSW8wwKoFiCS48gYRR2aqVlp9yKr2jN+psUzLxBRz1mrJaru3JAAPMUawNhNmp1eSOAoJbBpUYjuszODcszBWlJw9PIZJYRfBuvbkxPtfyagYKwBeUVetAG3M+/ZNVunh5WP057/3W/T2gxv8Pi1TuTxAyWRa5noCfFxhqeRyBSKGJdmr7cDcWreHqqu7W832kJTQ0tyoEz92UGeLEqpjAxXx9vIGqiixWzAmAIjBkq6vp5srwjaR+LTzbbHxQpUIchVapLhsE/lDPfX29Fhklj5rvte/KetPgA9JDJLCwFV8Nkuvv/ZGjdBSO2rHX+fYuHjmh/umxmQOl08rmUJaMvT8/H1MqobuzjYhtKSFzh4ROQM8FeGeAV9CVIFZLXQe5kUAwmPMiqCVM9VLIuK3yCZxXbWoMyDWZnB2AdgAbOcnhml1fkokEmitwlwabL3FXYMyA1KVXVxYj1gUlWRBtfNGGfTg2lJvLVKNotFDXBGYd1jc57lSBFACTNN6wZagVR0xZEDFtCnRvjQyhdW5KXp09wY/zzjFwjqlXXSHbjGfRuWHmZ3EDyGXDzM/PedLOO43pYNdr548TO++/JxsGhBdhMBaBZReSx4R17c1Z9IRXJs0LU/ZSIQsDaVsTnSlZsAxqyts1cJV7U0138O8LyxAiBNAAslBhKs+vMZ2m9NuaaYdlWDSkSJv/Q7vM2au8DwF+EWUwwvE7Kj6cGbFzDrA4BumqcEsV5tRqXhhsI3NTikDnV6GJvn9nhkuCAN0hDdaAOucsEkD0pKtZCL82ajQieUJ+t57j+gb77xE186dovGxcXFDMcCHNqfS6nlsKzJTofV7HH6cyoRaqr32dmoTP05V7bU37aQunb4Q8vSQhz//YHjis9YAv04+QZzaIZ2GLXIbXO7YvoU3YVv4d1upjk/8HkzOPv2YynvTa0kVlA8nKkeb3ILZXjDEr20qRceOHasRWmpH7fjrHCcOrfAOu6R8NnWGHhYsVCqDxYx4VXp4MVe0ecVkhE0ZhNAVXijR7gFwGQbg6GCJRss5sfTq7+3WLUyfkDUmqmXaNVSUXXE04FPMST7R3lM6O7WgD+iqbWZsUMge/T3twp6cFUeOMZoYKggQQqw+xosiyA24LR4H1PZ+V4cwNdub6wU44eKCigxenPBOxCKKVpmZhxmfy3jYt0l4bjR1MZOyDk/LuGJDPnruOi3PTvLz91OAwQrMTLQ8DegZeYNqW6r7iBtdXnhzbBGE/595cp9OHdqrk9p7BECjulq0vDufqvIEjKyUCVtUnk3aurt0NGTpCA0xJWu5sIQFNAB+ktTAG5yCVE8KVNB+BAklFnDL5iftaHcacLPPzYnxaUtgH9KpEx5pbULgDvBD5Qdza7A/i1xhjhTiwp7FBkoJ8NWMsiRSi5SwOcH8lHkeKsFURFq0AGlpcTIork4N0bvPX6E//s7n6OHNyzQ3M0uZTF6qPABeOKxYnG5tQ6ZILCp1QSUvOGzJYELd02MxOdHm3CGdA4Bek5C3wOTcsXWLkKTQPge4bdv68edWxyWuD+9OPAZmeAZ4e/vsVHdJhdBCdVPtAax9fr+QYgYHBumb3/xmjdBSO2rHr3N8/nOfXofXZrWYpYJmbYoQmhdKABJanjB3joZ8uppQurEhBjUBGgadno5maX1m4kooPVTKcSVWlGorxLt8I2RH2/To6hIdXZqWRQ0toagIzJVBs5lTJWMBWcjhE4nv90xUpZLr42oQiyUACwCIdiPkDIWEas+hcgJjcrpalJ14G+/Iu9ubyN/XLeA4KGDYKYCK6sEYMsvcTFuL2aCnNHhxh2tK2iQhaKBClXZkZZ4ebFzi+1BzGhBd4H6CdqjM+jy9FstTubp4rMdIWI+lWokBBrmTqwv0lfff4IU8JhsDJL0DNJWmbzPwGSF72kFukXmbg9ACA25TERrvUGXvFhAwNBVcRmsfzQnAA/gBBFFV7R7gqjjhFw9UZPwZkP2FS53onnWwO82cMS8AHBA2Lhi7qP6SmuyCak+1VVULWMkuIvK+o9U5oC8xywNAV7naK+P3YHFmosLsHCunaGligB5cPEL/9o9+QK/fu0Gry8uUzRUZJOKKwRmKijemiNQ10Bkii5EOyNcAPsQOuVzU1d0tFR8cViBhQMcA0gU4/WzVaQp/nXPr1q0q7aHXgJ7Hmuf1a5mCAud+K33B3a+ILfASTSVTdHD/gTu1Vax21I5f4zh/Yv29aa7yyo7WJgAvhoWeFy+JEupstdqaJpi0yqBX5YXIxxWVhysp8aAUqUJSPDRRCWF+huomp8FlZKDEADZKL149YZE90KoLeHuVAF1XLYYtWNTJ6GAhzu8apJnRigAfNH1IWICPJnb5OWlvxWReBWbfwZlRqfDa4I7Pu3FPX5cACyrD2bEKLe+uijtJOmqbOhtAsMAo7PDZDPvtFp9py1ptUGVD9mDjIs1OjDHwhSjIwAcQQxUDWYKa9/XpsFmPBfZxfXsBQR1ii7T5PL+OX3z3Nbp+4ZTMB/2aKGO1ia3kh8AmooktZQgLmUikB1ri4LyemlkGN80CM3oOl9LuMqho8Xqh8sJriwoLie0jhZjMcJUd2lPs0OTm5HfDAs3plimqyqIYW4fEqxSMXbxGqZBH5nyoLrExwPMBwEFeYTIEpQJFgK6+L6lKNRknrytTVPgzowW6emSZ/tlX36ZvfPo1On10nQYqQxSLJRn0EuKKEkK15w9uqqJMe9NtgZ6a8SlPTlXxQZYAP03IF9Cy/PVBbovY4uH2kEIAVEUzqAksivFpQmWVTMGjmZvqdzqFweOhUJBf23Sa9i0v1wgttaN2/DrHgcWZjxBEmk/FLXcOAFws5OdKKymOKT6u2IxuT1z+NbDBKgosNtiApXQFMchgiNshPb0TbU8HCxEVICpK5Oyh7Wlo+AClrK4GnbZXI7mYZJhBj4dFGUC6d3pUqjWEyroZACU9nRfz6WpB7gsV3/r8uIAeImHwHJDGACDD4pjmSgURNXD1yOkqz8T7WO1Mqw3paHlKqkTASmc3wGMDkY8OL8/S7WdO821AcgmIiXWafx4SY2yXIrjodqcitng0oKqWZyLkt8gryORDFflbn3mDq50Ug6ZbgFPapNr1xU5tsMHPan86vjbyAwPqzkpRkVDCtu4vHraik7LxkMX8BIPS2INNlOO8GQpKyzjjaGcaTWBeB97a1V5IgM5EGaFNitvE9LwPVm+QUKAaxyYBvyuJnjDCQBaniYGMVPNCasJ7qOd4Rn5htIdof86MFGhtzxi9++AqffGNF+jWhdM0NTFJ2WyeEomUAB9YnLAGk7mexd7sdzA4bTKJzPgcuXtoR8IoGtFCW53tS5nbKTPpOpw7dtBOnBCp19WJQL0ZhJYWFTkEuzOXVHj9lhuL0eQp0FMzPOs5uhXYGUAMiHQhTsV8nj747OdqkUO1o3b8KscXP/+5daQboN1n0suz2o0D9luYvwXcPVKtmZ9jARss5WShwXwGmiUsvIbBVy3nRQoQ52pAkV/smQ/ap1gQIe5GAoFUN3zf0KllEmGHy4g6YW2Gig474wiqJEln8NAyAx8SEGD8G+OFt8ALIPLWwPbLaqkBAAULKCo9XBfAWZDF1k8rfHsYVBuzZjF1jtjsTef8LKGTz02UkqkMnUQXQ0pBRTNUTNOTO1doYqhCYa74vG7luoLNg5FlBI2Pp2VF5rPE8Zt0fvDI5Of11kv36OGd6wyWXt5g2Fl95hLXM5VqwqpQA5a5tRGQmzmg+tuC1kZF3p9oyAI+BZBBqxVq2J4lHfIq8gZ+/0fzMdHj4Xk4c/mMk455H6UalHDfsACe0gmGLZkFSELQZmKuC6cbUyVCyI52pgCdbrsKyxSBs5pxKmdaMU8H8/BvTdP8WIkuH56nR1dP0Ov3b9Dq0l6qDg1TNmeALy7icMPg7Jc2omdTvI8KdnVbszYDes4YIsXubKcWkFz4bBGbsSY5m2BGzZeNjY184utG+X1ba5vYk6FytO9fsUadMgUDwP06dWGTLVm/9uIMRyiVSNLK0t6aZq921I5f5Th78qgYTIsWSpsW55MxBqc4g1CUdg+VZCFKOWyvUmaexwtPsL+bervbrRYZgBNBsyCKoOXp5grLtNEEUIXoEhZhL2ZV8ZAissCSS4gXupI0tPhyIsDVWr3aUfNOul9HA6FqmhqpSJsLcxwwDDGjG9ZsTNGK8X3jfvt6OiXpPapJJpAr7BkfEI9Pyf6TVIKYYzYVtAygDYkFEoO4sQlzAJ9TQ2dE5RIzxNdF6sS1s8cp5FOCdphOZ6NBldzgVqkLmGWazD5T+cVN21MDYEqnNyxNjdEHb71KlXyGq2SuErjKxX3hxH3FtA9oUgOdNR91mldrQEtF1NdO1xdDPDFav7R+LYy+zxiA42u8jgDBonioxmi8lODn75ZNgzEfcDq7mBZoSVdqmMHZtnTqdzAvwOtmpBYyI44pn1VUgQXreaBiDGpxvQI9uLWUpRJVri1jpRTtnxykV26eozfub9CJtTXaNTYhHpyqzRkXw2cxoNYxQ24noaXPWIJ5rHRzBXbuTc4pEJR3dmHe1yHuLa2trWJJhmoOQNja0sKXfOJnDHaILEJILdqkSGnv7TMyCbcFssaOzHoOlkhdt1x1G9YI1eHQMj+3QLXVrHbUjl/hOHXkIANbQWnzMnHbIBo2TzrnDPo5EFTSMV2B8UIGETiIBNApgaRhzI/LOk8PdlNgdGIWZeZWElUEGyxetJCWgNkW2niSMyeOLcbTUy2UmP1kQv3U2FC3aSYCoboihvQLuILFh8dCBh78OcvaR9IYNUtGHl8XDNQQgyPmSEhYGCqkVMacZdllVyYpE+ejWacxa/5mZ+mpiipoEV2M7ZhhY6LtN8FV9MONC1TJZYTkEvT5pIWJlAIJqtVVn0gbHPFFCWelqU9Jauffw8bs1vWLDOZd1NbcKGxUZRzg1r6nm0kmlmenw/fUCqjVgGc2M5sJKCHrfXW2SI0BtXLGUXNXABIigJCegWocr2UhbWf32QkOIZm5yqwOxtawTdNxUpbJdSKiNxMBbb0WFKDD52FQqkw9F9SVY0WbEUgFqrWGaF0vjJbozpmD9MXX7tGNC2doeveUtDhhSQaxOio+CNVBaPFqP06nB6eprEz70dXrbHu6rUggYXiC6MJA1iFklw6V0sAA197RLl8LCaazS06QYgB4OKVy1NVjr9u92X8TwKcJLuqx+HT1WaQXzPpgqRYWzV6ebt28XdPs1Y7a8Vcdn37v7ZG9s+OSXF7OK7DKae9KLOAIhYWfIhiEMI42u3ZxbBGpQkRam7huWi+UA8WcalsxsEAPF9LkC7QWK7m0VFXI0uvpbLMqJVRtKT1TSsftFhuquJC7S/wzBfD4BDW8DhUfV2+YeUH0DMo4BOjQSIEtmsRz54oP+WxoswlwhZWptCRA8NeLXOmVTJq4FagatlIdbJNnNcMz7c64JrQ453+JsJ2GbiqqpAYpUzVeOb5GZ9cPMOjxIhUMcGWHOJ4A+UWW0GMxPK12pW77OmeLFkjx9y/efIYr45iYG+/csV3YtZKAIWxWPauLhz+WXWlMv43MQUDO4URjSw/sOZ11vZhNfEnqdiMqMeP0UhTP07RIEvDcAWgCftoMO6cNrwFUprUs7dB0VJOd1OPktYQko4Nz82KXpmaK0A9CsgDWZlEILSGH00xUmVPzhgzequdXp+l77z+iJ3eu08LsHFXKFa6M4mIBhmRzMCD9fpWmruzJnIxOR+qBBkGPIZToGZuSNbhEzwcQw5wOeXw9Amrd6uzpkd/36LOLq0MDdt36a2gCcSqtng18zoBbm03aq37f7xE7tWg0RuVShdbWDtc0e7WjdvxVx5WLZ9+DyHt8MC/EFFR3Gb0YhhhQkG0GP00stDlNfYfkAGA4xBVdNuqXeZmyGFPVxEAxK3MfsCtRzanqQ837ytmUpJuHPS5pORr5A8yXU7oqSzracZjTeXvaBfRUe3MLNe3YQi3126RqQ7sSoIfkha1a+wSxL9idMHcuS5pA0lrwUTUAQEZKWdozNkDDfKmqvIjFPkybxTxmtzDTjjah2JXp+Z4hsDhncGbuZ5FIwgFLUjAxUKAXuELLw8YsGhEROogb8LtECxngB4mDWLA5zKfleZvE9rBiVfq4snvl+Vv8tzdQcyOfDfVc7XVJ1ei0KbMSMbQhwKZ5pCPFwamzc1Z2NhPTztaz5oKa4KNszoLKIYXBqpxSYa+IjsLfB2AsJJ1p73rml1DVXla3TTMxp3wipOeJavYH828AWlXamBGu0COy6cpZFafaJAH4AMKo+hZ3DdHxpd305ddu05c++SKtr65QdXBI2ZAFQhIsC+ALSJq6OqXi021OO9jVbenjnIkMvSaRQQOZVG8Cfi6p/gBm4uEJoOLve58iwyhGqLp+t/4ePwe49TnmfAr0VIWnAFZXiL2K+QlSTrFQoqmpGfrZ7/+sptmrHbXjlx3HDq1+tG96lKrFjGo18aIC0DOLTZEXIhBRcqKXUvR3hMuODZYYEFPicIK5UkK30zCTA3iCQt7X3SYxRELg4PtT2W5q7gL3Fi9XJWiXosLD3C2pqxgncQS6LYh/4VxhRL8NDHqNO7dJ2xT3DVZpa3MjNXLFU1+3Q7w2JUmhsV6AESQQ2KQZsX0yqmZFE0N58XhEi3MQVW4mbqVDKKDxy/fiSIOFnH+PuWdBAm79VnpC1JGJZ831NJgYA2v5m2RGp5iKt585RUf3L0urE7M+v7uX4gGPvJ4g3jg1fZZGUMcfBfFzBjYA3ezECC3N7Ja/H2bIqJ5RNStDcDuLz9mutGaQkcAvAGBGp9SbWZ9NYglb81hjL2Z+Z/R9Od1yRNuy4tDUwRoMmjoAecEiusTktVTdg7A1R1VM0oC+v4g1Y8R953Q6hLA1k6ryw2cpo6tMeW9SCgzRPsVsF4bVAL3Xnz1D//Qrb9PFY2s0PjxM8VhCgA+AB+ADAMKhxQCeMXp2mdainrOZJIanQa9Lg1a3FpkrsbkCpb7ePqsVakgrLt0WlTmhru5cjjanS7cybXs0u7Up993ba1WE/eLOEpZZ5SAD+vlz52qavdpROz7u+MoXPj8Cmy8xmM7EdSSPAj0stFVeNOLaT7Og24BY/AYKGUlQxxyt28zsNIGjJDPBiFRoqAADVtURlJZoLhmjPC9SkBCgkgQAQfAeFaNne6GVFmLIS8WYX7wJQWBBFbd9q7Zz2r7dYkBikfdrv0vMtTDva29pFLYnQBAgAj3YMFetYsuVULMrtA7HyjmaG6vQKIN+RZIZIhoY1CxJZex5ZDGfHy3RGC/gRakklAuM8dQ0M7+0g9yS0rZfSc0IVbM21QaFmH5+fIieu3qBfxYWogvSFmBcjaoPyQ1W4oIjrSGsc/iqDNKuznZydbTR26+8IHFLIE60tjYLKBr9n5GDbLIL+1gbs4C2LgtpZ5qg5dgi5CR9mTXVYsz++8xp2pDZuJrZoeID+Ik9XCbKAJSWViSYtwWd6+ckxhhTbGOQbYAMp/kbctp5RcA1qRxxzH0oQI0IUaYgbVA4t2RpbW6UNo4u0m+9cZ8eXj1HizPTlM/ldcyPOhH4KuGyOmJIZe25tfmz0fF5LA2dcm1xW16ZdmvS3Ma9iaBizQP1zwwZxoCb0wGmV9ufufR9KgDus6QTzsrTtFsD/NzR4sTfNTM9XWtx1o7a8XHH5Qtn39szNihEDrQuMaPLaRIJPDF3wybM3SULTiEd17OxAA2W8lL1YGbT0dpkicuxwMKWDNeDYwrmbPK7sKoiyrm07OyTATffrtFqAwI0DdEiaenllCg6w5URKjYA3panRL4AALROjc2XCLjdLmF3AvgAus1N9UKCgRsL2oXI4cM8ySz+aLuiFTZeyUm1p1ptEUecT1BacbsraQp7emR2BtAFoAb5tUmGlB9nPOzVrEO7SjQVq5n/Casy6vD1FGG5nx49e4kOLs3x3+OVOZ/4l6K97O3VkgbbrBp/r49BHhsHvAb9rm7Jczt5eIUr8g7+m9tEmmGAWHl1OpicETuqyFR4xkpMmJYmd09/JnI6PijjmAVaTE/cRjoDdlZiRjM6DQgB8ODkMpBVlmGDEhgcE21fgl8zpdULWlVc3pHAkdP3Y6QWlvhdE1qUbEJdKhap/bglydpTQblzIyVamx2hr77+HH36pWfp1NoqjY+OUiqdsbLtJHJIwmW1fMFje1/2a6syt9uzyfz5FypBp8Ddck/RsgO37edpgVufDYJy/X4HY1NXkNZj8Gl8N/vxnPTzkXgkzPX4OYPBGQoiYDZFf/SHf1xrcdaO2vELrc2DKx+BwGJmPkIw0TR1MDOHufpBbIphdJpZDmZ2IBH4ehW4RHVbD1XOQEEFzUZ9vdIWVV6VilCB1iYYfoG+TiFdmIoH1ZltTmw7hAxkIgws3UJOeRrw0L7Ewg5GpjJ07rc0ayBzYOGHJKKbHwdOMpgh4vmiisJzAPgBAPC84ZWJKhGkl4phl6KyxcLJ11uYGKSo1yUuGs7ngO/7uzvEMisRUn9LRrc0DXlFEVwcwBdyavC8clu0kE+sztPjuxvSJlZBtW6u+jzCRkUlG9J/Y0hszVzyNyAmKRZQBteP721IzmBPVwd1wKXGowJpYVaNxzHPxRlLlHQmMxgtnWZYYuOCzVBRk3zS8ZBVydktzbCVqg7wclZ8OSMriCv7MujpMH+DeXUxHqSRfEy+hv4T885C0g62lddfM29zWtuXsvL6ghrQogrU8km5xGfOgGVBKsy4zHOxOUOFv29yiF66coJ+8OEb9Py1CzQ/O0OlYklAT06ukmBLJi1On1/YnPZppAweSzrgNKQ2LUhzGtA0Dioer8rAM1o7tCYBYkp47hGGphGhuw1LE7O9bkV6cYH8AhE7sva61de9+LnLRX3SPuXT1UNuPiFjgRTmzOmzNRZn7agdzuPVJ49GVucnabSSVYL0ZNSyCYvzwjs5XJYFBguurZtTRsYwgAZrTgm+e6RaSooGjxdJBg3srmEMLb/TqQB5XUGhNQhXeiMUl8fghc/28wxYlch4MSlOLzvrtv0C6MHwN6HZmCa8FXO1sN8twIeKD2J3BHz29SjLMhcDIKpP0OnTqEoldd0v4ACXE4TXwtUFCyi8RjG7xOuzOlUV4N3Oj/l0xYk5YwtXovD/xEwuKeDms2aSxl4MgBcLPUV4Me1HPqFzG+KK5fHda3Ro74JKWcDfgMBefu5evgQwhyRg1idtQpB3VIUUpV1DJbEr6+nqZNBr1fq9Xp3E7rGeT8IynLZlCqaNaRLtlcQgqmewCvQkKoqfnwnXNS4uRruJFqSJLYInp4BeMmylsyMstqITG4bzcYkRKvFnYbSQFOsxvHbCyswoqYmRN1jOPLHQJlINAA1mCgrwErpbYbdLcw4bNADknrEyPXvmEP3Btz9P7z66Q2ure6lcKlMspmKGIFKHjCHEX8OI2h8Ikg/ElkDQAkLLsUVr59Ci7HEpNxXVEvVZsT+qTaqILwKKRmun250Asj4GNvN1DzR7sDczcoe2dn4f2/nS1vy1tbbIqb5W37fz57mjrYX/F1tlntvLmzB8jsuVcg30akftcB43Lj/zw/WlGYL1WEF7bRp9XDwcoCm4sCC5POizhOLYxUPSAG/LAn8PlxS04mBVhkWwIokLcTEA7tbzPNP6LGkGZYYXXoAlqhPjX4m2Y0pH0NhZbAw+yZBkliGK5WnQa2qoV44rAa9D1K2+DuuWJ0ACbEgvyCG8EHS2NlLjzu1iQI38szgDJEDYJBjgNgBJtBVBbgGlfn58gBfQADXVb6eGuq1Ut23LJnNhgB6kEs0NdSKYx7wqodu2Sren/DXlUj9HI0VIGHkD9HyodjAv5er23PpeeuHGJYkWQh5ba1OjtGdho4YFDbNEtFXbWposYgiA4pMvPsdVs4s6O9pkYfQKIUalPGAzYKpOJ7Mzq0kuKmUiaqcz6PQFIx2QlrWEx4YdUoaQNqgOOtIWAjJnK2gZATR8SLUYAqClTMXHoKUz/DDnAxjCZgzRUWmxibNF8FltWabALmIZUEslmopaLUyZ5RlSSzKsSUSKUQwgnaoWaOPkfvqdD9+i7334Jp1Y209Dg0PS2gTIAfQQO2TATyzKgiEhu4RCYakGfQ45g6nkjF+ms6Vp5nguzdiEZEFAjQGts71dktg72tpkc9IO4Gppkcii1uYmahHHlkZJaW/kTQ3Ohvo6PlVkUb2cdRJbpL7eLobXbS0q4gitfa+7m+bmZmugVztqhzn+7M/+1HdybZUOzu+msUpeQK8oyQqqhSmShEJado6mCkjrtpaQWBjAoMGTjLyQvYjKPA+pCV6XAJvJjhMvzHxKFkGRMehsPfwcVVlWA57zFIp71MdV1E4BlqdBD4GcAIyoA1REGB5S7TxpfWogU9ZWHRLUWb9zGzUyeDXzYuHt7ZTfQXaBGZqamfVJhQgNIAAFIbOwOduxwwY947MIJqlkoiEPjRcmXA+VWUwy97zS7pQWpsgbvML2NLO5eMhr6fvSoudTQna8RhVYafEC/uTudRooFXhz0SqLYi+/HwBkM7NEMGlW69MATmhPv3DzsqQAwAWkixdBJYFQwbZmA+J01hHSiiMJXVVTEWu+l3c44+BnqOgMy1W5q8RtTaAjR88mpASkelbuLWEBOPh2DkoiAlqPCTGIBiMTwIhK0NPTKRW4MDaTNhgrMlVEg3BMWqDqd2F7FqnT4G0/0aBkPc6NlujUyix95tGz9E+/8i5dOnGYxkdGKMVAB2CLxUACKQjtP5vNUTKlMvcAcn6u9OB60i/zNC1KB6BBntDVw4DGlxCcd6jKDGcHV14drep9w+akXYMaZCVN9Tv5rJPTABlmxercJp+nOlzqr3fIqeQ627du3nSh81DPt0MgLdr5AY8idT166aUa6NWO2mGOl164f2f/3G6aHRtgoErpSi8mdHQkKgyXCwxqPql6Mg6HlLyAY5IXppi0LyFHMMJpSA8AnEW+Xj//80HbJ0QVLIJoR+VU2nV/Twf18v0CKEFqwYJc5vt9GvQQyxP19MhO1soe26piWHC6GABMe9OIzqNP6eVM6CskAmihtjY3iJwBC8dODVhoC4U8fQI8qBTQjsTt0O7s7eqQFihmdyKKl9uoS5yQUTgXIOy+e9pbNuX24Uw6TakBeCZTz1HtJbR1GBZsPAdUoOVEkK6fWaeNS+dlVgf3FX9vj6RaGDE62qppPUeDy8vdS6eFEIOFF/E3qPZwgiyE+WdCp2ZYdnK6us5aNmAhaW8aG7CUIx/PiNNN5WUMBJSeL2zZmCkyiybBwBCaX9espGWEhcwCcMNZzcdFy4dqD0CI3+eRlMHABy9VvGc5renDc0JYsGj8EhHbvcXhGgMNqcymHe34jGaS7h7IicH47bNr9PlX79Hz187RwvRuqpRKlEwkKc6gl0mlKBaJyEzV299PHq7WeuCyguoMQNam24wAsKYmqcBx4nVu4Q0PQKxRqjJVmdWbIFmpyrbJJT4zO+XU4CaAtk1Mqk3IrMniE13qli2/UmwRwBOaWJ/OvPzpT39WA73aUTvMcebo2s/3z07QcCkjXpvOmZ2wNqslaQmidWiqAfHTLOUUGYUXkg5IDnz9liVXPqPp/hGftDb9YlCtDJCNrRkWvB5dfWCRx/WRPIBde8qKvuH74xMtMNwPdrhbHbtac5p54WZiiMm9c2ThabJIqF+BnqkaTdgnwAuSCLREARqwuMKijduiNQgBPcgw7VxVQQe3fasCzbodjue1RQFoIy90uC9UiSAAIXUiGbLtxJzSBpPTl3zK1QWLtPHOhAAbAHD95EF6/1OvU293l1QMUiHwAupHKkUsYJFUAKZoFd+9cloWarTOejrbRbIR0KBnbNTM3NSQh2z3GUVQsUEstEnfB/CxtH4Ohqq5riEiZcRBBVZ1MSGVQDsH8Cvqiq6oU9nxmcCMD61OSVSAdi+u9KGwM4vDy5OfM2QImNsZiYJkBBoxu+N54nNa0qHAAEGV3xehKuKGhou0PDFEN06v0bG9szS3a5iq5SJlUwlKJ+IM+FFJ/ejpaBNrt5bGBqnKkJsHUGk0oIavdTr6Tl2R7dAJ6ZKSbqozATH7VL/bYl3v6esYoPs4UINkZ8cOfsz6BvHxxNwPri9oqUKuEAmHpRoN+Pj9jcfo+ImT65//whdqwFc7asf3v/vtkaXJcZoZqaiWZkpR00UkHlUUdKRTI7LHKWyG6LxaKdAAV2wQWHcyICU0K1OCXvnnGf4epAtYj6mUb7WgozoUq69YUPtt9ltVDYyVJeDUzPN00gEYfi1N9bLr/bhFICTZe4FNQnaTjrDpjPiFRQify/bWxl/IPwNgYbfdzIsZyC8guWBBRoI5nifAAu1OgB8cUyBVMLM8XAIAG+q2MRjVc2XYIgzRhE52ACsV4O+sPI2Y3QBy3EFusRifOs8O7UAkByyOFKgU91Njww5q4rMFl/XbuaJukzmYMq12awuzXjq9tlfsyVy6SsFzEZszzFgdInpjQGBihJwOLJvjgMJWRWWAzTjWWDFIlrA9aEVIZTXJBuBnQKuo531wTUEOHkJq8VqjzZkTF5WYyBskUQGfg6QCv1C/S1qleD2yGlCNnCFjtVXDujJUAGvijXCCJLNrIENzo0U6sjhB+2dGaaKSl9Y6kiXw2rk6uIqDxIU3L3Xbt9lgJVFBNrBt15pRs3FybqSMKfo22RypS/vrLdb30j0wCeofU83BeKC/zyXEpB7e7PS7ufLViQqJODxDk9KCxSXOTDpL+WyOCrkclQq4zFIpn4Nmj86fO19LX6gd/3iPaxfPvTc5VKQRrtrEY1NaVQp0IBAfKmZkXufhhTJnzUxUaxNSBbiwBEQO0GFXAtiZZ5MCav5eVRmZtiOATEUJRaTawjzPsBaxUBsTZFSYCYf9WC7ikwH9x83zsEBgDrepQnFG6jgADz9DywyShXYGY9OSdFZppuLDQodZGdxRUhosI3rOBxo4gMG0Os1zAWC2NdczOHYx2PVLGGo5qWZZQQZMiMwVw9VjAQ5mjWEtajekls2A7ZOWJaoinEtjBb5+D9U1baOGhi1S/WIzANYoqkq/ntn5dfIEgO/JvZvkdrnI3dcrFWJQft9ryRgSDqeYtNbv2ebOduvTAImJjLI1jCE7SDcSsCza5D3UmjoQTiSxQ5NOCtp4Gl9L/h2ug6ipRFDauaWkigvCvA+VX0GbAOD3eQZ9CePt7VKfD01wAZAaMo41e0woa7Jiyq4uMSdFAsfiroqwcRGEm+INBzYEeM9Bcmpt2imV29MV11bHe/7LKrHNn08Dltt1Z2CrtCm3bdlqgdyW/0rbEo8JT1U4FclYIZsWMX25MkjV6jBXp0kar5RpemSYRsolGilkaY5BfC//b++vlmh1tEKLg7xJ5c0Poq3u3n2uVvXVjn+cx5GVpY+mh8sq7UAz9QxwgJQCBwvM6wBMQh3X9HXx09SpCqgC0fozwmaZCWIh4wUK7UsAZlxLFSRGKK2c7yE/6IGuTy/2JrnBZLYltLekBIn6emUu8ssWBoTT4rknIgHL+9JYZymPTVV9QEIApiBmbGhv7tyxddPuWkBPnwASLGrtLU1S9UEnB+IGJBlIO4/y5dPPA6AHuzWQV9TCHeJFO0LLvLAqKzGtG+TFWoy3wTb1K20hwFSszEKKiGNMqxX706+0a3wemByS+d12qTS2WFVGE78+WLC92rZMwmm1G8ulk4dp79wU+Twe6nX1yGMJODIgynUCHpvFqYHOih6KhSw7NpVuYIypHaxN7cNpZ/ep1ztuLNjiqsUJBqxihhoJggI7sDqz2uYOcg2VfB4U5xYAHtqeuMzL9QLSokaHoZQMUsjTI3NaGFlXdAakameGLWmDqQDB3ETLFM9jfCBLs8MFmhspiuE5NiUga2HTgg2W2RCZimzLxyWeb9smwbD1O8GsbJBsPMxPwch09XRzdebmiswnVVlLcyvfz7ZNn7Wtv07Cuv58oZWaTcRo45kLtGvXpOgJY95+2jtQpPmhAdo7PkrTQ4M0PVCm5cESrTPg7RsoMPhV6Mh4lY7sHqbzR2tG1LXjH+Hx3ttv3VnaPSIaNACVpJRbXowBWTygv0NMjWHrGc0WWpvQ5+V4McbvFXklJC3RQa4O1e8CwtqM+G0PykI6wddDqrlfrMHQIhRPSQYJj87ZE8cWcQpRrTMsgiDD1Ndt+9idNRYDVApor8KD8fjKDD17/ohiCWrSTUJn3mFRRqsUoNPcsFNAT4gCTy1CzlYVTrjAoB2I9it8O/O8oILYs/WpxRDzHszW0D7FAo1onZFCgmZ4cQXQA/RQeRngE5PsgJPFacsIbOAJWM4muI89o0WZI0kq93bVUq3jS0gvIGHAJgPyEF+/0vFFAz6K+jz02Tce80LcQ26Il0GC6VdWbWG/x2JyPp2qrsggCtCcOXu2ru8pZxYTvBvx66/tSi+rWaVlbe+mgn0VYcjM74xLCwgvxrRamJ4JBfio9nC9pG6jKjF/SIKFQXaBZAF2eXltH2eTboIWs1XS1AspWpgYooWxCgNETmat0D6i+secDoQTU+GZ5PP21lYKBfyycfB5kVIeoHCIN4dRCNohZWAADoXUGQzJXC0Ri1E6kRBSDAgyYHvukHT1rb8y2G1xbMZQeeJz29HcyJVynM4cPUzDw8P8XvfTNL+uh3kDuzRYpn3Dg7S7XKCxXIbmeIO6xhXfAa70lhgY9w8P0D4GwCvHjvywtgrWjn9Ux6kjaz9fQJwOKOfishG2gCvMFQiSB7CbRisvq+2nFPDFqFJIiyA44FaCb7XgqcVvsIgw2YS4sPSIC4uJ3/FzlZeQ+4enJEgemC2JgFxnxzkBTzm++EW0jLkgdrkf196s40UETFBUXtB9oVX10s1zNDc2JC0vgF1ckyswOyww4Lq7O6RyxExm21M7702Ap9lzO7YrYgoqKFRxo8UUtTTs1DZkim0HNh5mQHAVwSJa0NozgDZmVIPZiCzUEZm3uYS0A9Dza2G++HY65mtiSwbA0C4kGalWArRv95CaA23baj3PnQA9rlD6ujpolBe2A4vTNDcxJhFQYXFhCdDJQ3tpknf6WLzBLkRLWl5/zeK0QCxmUgps6y9haEaDDjmCbT0m8gb8PhGykiuszVNUaeOycePTGXSwKxWTEuL1gkQARdTcEpmJsYAFfBkB/YAFgjkh9/DriNYwP3e0ngsibI9TPuaTz1Y+EbIcW4xswjA9Tc7eLFdAq7NjEi6Lyh9VMtiXkAyYWS/AaWddHXn73ZRJp6lSGaRyeYASySQV8kUaKFeoUi5RPpdlYEsKAaaYyVAulaYhBpyszLX5/e7rpeHBQRodHZE5XF3djl8L9LaY95lBD8QlSHS621qkDX3k0AH+fyzwBtJF0/y/fHy0TPuHSnRwuMLVXZkWSzlaLOdpnX+2ly8BfCsMektcBd45e/qjP/rxj2sWZbXjH/7x3d/+1sjy9DhND5cExIzbRVrT0hMMOsOOGCGl21K7/mI2IUQUAA1aeSFZeBRxAFKEgbzS7rmRqsAVRVyDHu43x7tTzGq8Whwe9qqQU8Xg9GvAs91BhNXJCx52t6bd+PSCAPBBMjaqJLTFkNgwyiCDGJms1p3FNYBg8cR8EAu+yB/M4rbFJhE4KzwFeFu0VkrppUBIAXDh9LtVSjwMs8Eu7etsFWsztOAgs0ClN5BWLbrRUkIbUqsT4nUwOgF+AbcCQacxtJ1uHtDBraq1h5bc0/OkrbIgbpfXeryCmKQK3b96jvbvmSKv2yUbArzmD289I604LORgJIKUYzR7Kk1ByRRkdmfCXrVDj2kXmkvzHmW0NMC0LdMOUNxcFdrEEisjz8gYYBqt53hlmb1F5L1EZQ1Qg2A/KyQXv7wGMEIfHijxZzFFfo9b2s/4XTqMyi9AiaBbXmNxgBEtn21kXdSzwtmREk1XC0LU8vH76BJj8ibZ3GzXVR7mpHjtEPsUj8UpkUhLXM/09Aw/7zhN8Gd9ZaxKB3eP07HJETrBn7lVBpvhLCqsHB0oZ2lfjit9zGO5oh7CvK06wpVgUNqhv2qV56z0UInC/KADej9+D9NgZ64flYrSy+A6xu/VxclhOsEb2tNjg3R2fIhWBou0wOC3xsC3hzezaHui3QlgvL524KPf/c63asBXO/5hHyeOHHpvfnyQRooZawZifDah24JjChYH6NbUghbVUoYw7yoz4sGIxaeHQdE2kVZi9WI6Lm1RtC+lJYhWFABJRMwMlryYYQ4I/RpmWsiXAwED1PikkSkYBiAvZCGuitBu2m6YcVuf1iTVycImLdaIV0AIVWhWz/mSOudNCA+8wKIagK7PamH9FZWe0UkZ8JOYIv45hOfiUKPbkgBtYUX2dkqiBECukoko0bXo0GI0VozbUgphbSrNINqdYS2aBwBhkbcCXHWr0YitwWYc58rk44gPqEbBFM2JFi5C47zgfvtzb0gCBoyo0c68cvKAtNdgoYbKFMJ2Ab2Ax9LXAcSMt6ohnog04aksPtU+VNW9SquIOIwLwrabjokiMu4ucWVJZjw687p1ifcLbjfYmKA1bBibSL63Ypq4gh4bGqCLZ07SpXNn6NC+vQIkyt2kRdrHkGmg7Y4NB2Z12JyN8UZApBKpqOUMs4t/NstVUSyovFbRXoctXWtjHTXVqVDirEQd8WcplaJCrkDjo+P8noRpz0CeLs+O0sbuQbq1Z4xO8gby2NQ4nZ4eo1MTw7RUKdJqJUeHS2k6O5ilVX7fpvlxR0SYH6WJ0VFKxhPU2toi0gNUfnBWwWdZOazssMzMtzvYndh8QRrRXL+Tn2c9tfHnEK3ObDJB6wcOUJarUb+nn3bz33puokrr1RKdGKnQUT5XMPMr8nNhAFzCjI8B8BD//sjoAF3ev/LRP/v+92vAVzv+ARNYDu6jhXGVqJDVQ39QtbGQoR05xv8UEX8f+XkxNro9saKCrVg+I0QAVeV0WC4rap6nPCrRYkJL0gSdYgYDWzK0PaG5gzsIANF4cUrcT0SFsSY1RR8LHXb/8Mg0rc2PG/xDNpCJqey9C+uLNFxKyZwoys8ha0gXujWHBRWsSjBKDeht+5hKzwiCneLgbQ5KOR4XO260JmN6FofHw99t/CQxyxspJkRwjfYm2px2+KzfMn4Gk9MkpGPxFb9OU+1FFfBlNRNxYdegaPW2/BJBMtqmWNgrGZWC8eL107SHq48O8Rjtp70zYwJ+aq60haubNmlfW6BnWo/ajcVKSBcWpP05MBukpFR1OoFdt8DNHBXVf8xKeQ9q27CIbmmq9qlqOTKYi1ZPsTPRUge4GdJKSidRhJFewc/x/ImjXLFepUe3b9Bz1y7TqcNrlEokGTjqpIIH6Jm4oSkGnIlKWtqfALmhfFLHDcUF8CYGsvI+4LWHg0lHcz21NuyQdvuu4UEaHRqkifEx2jO7h8aqQzTDVdtZBrbDDGxnuJq6N1ul+zNDdBfANzEiRJHFUp6WuKpa4Q3lMX7MU+UUXRrK0hH+HCwyAC/Aq5Zfj5nJSUqn0tTR3kkNcGZpbKLm5mY5m5oauRKsFwAUeYRDMgHvWVXt7ZRKFM5CqNqziTjtW5iX1mp/by/NcUV3bvcwHRpg8GVwOzZaobWRAQG/g/w9znWu9NaHB7gqrNK5fYsfffXDD2vAVzv+4R13bm3cWeR/hnHerVpCdEP1jymj6EHJZ2uVhS2vtXvSvmTAwwAdiwq0eV53j0Wxh+QBjM5KShFP7FlfyMrdQ5BnLOBm0GlTVHkYPGOe53XbouyQYisCDPJRv/xDG7uvLb9EqCsRPlhYeZFECgIeD/My0940BA1UD9CyQR/YYEBv6y+CmrPS2/Y06FnX2Sq7cSyWWKTRWsPiWkmHucpK8iKbpvFKRmZGmDMCDJ0MRwE9fRnTHqGo+lDZYsaU0nZkAMas1stNDuX5sfo3SyX08xJRPeKSwGLMJaSamhrM0R7e3KBiRzVa0HMtw0YE0QjRRHgvLJ2enucZTZ7NzoxY1V86rr1RI0Erfd0JfM7IIVPx5R1RRZAvGBC0Zm1JxeJEZQfgR9uzqG3Ektqge/dYlS4c3U+X1hbpR59/g/7wd75O7zx+QLvGRqmnp0esvfC5sW3OojTMr8Uufg8S/L6DEHPqwDydOTRP87yBWN5dlcfHZqGrtVE0j9h4LM9N0sLMFO1dXKCzp0/T/OQE3VzcTfeWpunCnik6MbebTkyN0cZ0lR7MDNLLe6r0PAPghbEKHRsq0GIuTQcKfDLIHuPHvlrN0ZVqlg7lE/Kzw/x5GOTP+fjwCOWyeUlKaG1ppXaYCPDZ1tYmZwv/PU2N9ZY1mQHAhp3bpQ0LlilmfGjxo+rLxiJ0YHmJCtkM/x0ems6l6AZXpOvVAh3nau/4cJmWGZBXB0tcieZpP29uD6LVydXfoWqZTi4tfFRbIWvHPzwCy+H9H8E4ecCRF2cWqQgvfqPlgrTX0CYUj8NUXIXJxtHazMnCiYUJGXiSyK0lBhCko7VpDKahKTKLofHzhO8hQMIlCeoeaX1i1qQILAF9qaJ44OaC/Lymv2KeZ8CnqAkrWFABQFGRAfRbMyqjH4MAGrM0AdIdWi+19b9+bn+q6tu+bYvliYiKEa2wRMhDQ7ybT4U9AnTQgcFSC0nhAD0Aci5pm3Vbhs86Vkhp9yCA71EONjqE1rwmiMWZHMzL62WILMaaCs+hq61FWZbJe6p0c3hMbDQgpnd1dcjjgMRhhNPIPwzqDYeRKjiF6JZ9l6OKs7R5mg1rrp/RpgWK1BK2PD0VQcqOKYIwHbO2ghaNmxghvDeo7NJRn4AfNhBo5+Z1PBA+E9NckSDXcWa4RGt7Jui/+9FX6JMPb9MEg140Eha5ADYMmZhfCdETitgEmUoJEoiU2vQc4srsxqlVOjAzIu1OfCYhBcDm49TaPjq4vEAHV5bpmXNnGJiG6PzCFD1e30cvHtpLTw7vpXP/f3vf/V7leWVLE71JgOrpvfejc9SQkAAhQDShRkeFIhCIjg0YjDHYwbglTpxk7jiZtHlI4mRKcmfmziSZO/d67r1/hv+Rfffa7/t+3yfHJRP/YufR9zzfc1SOjk5917v2Xnut3k4pZZ5g4LzclaUHfQV61F+iu31FmmSAG8snaB+DWz+/Fvv5PTGei9NZZnsTRQZC/gwM8/tjnDdFFX5/d1WrlM8VxJy6FkbU8PDctInq+NywYb2kJ8BwGnZmyrpsibx3lSuMOtHjQ38P7wGYvB8bOkjFbI58HhftysTo7p5uOs7M9kR7kUbLOdqVjtPufIr6eQ3Yy4xwbzZJu5mZHmTwW1ghF46/qOONJ68MY8HoLKZ0TEzQUmaKxNzvpfZCRma9fO5G6e/EzWAyA18Gbip8fZQjG+rW60FktQAWda8PYAUGEdT9Oix8BZ1vhgw1LLTNDZs16LlEGGKCYp1BpuiLtWzZOK/39lmgJ56W+n5gUQWAGHYK0AsHlJgGcncoTlESMiXTTxOwLP4UMLT7e8oySokKlslttZakDPYcQNvdmqPWVJhZXpy6iglx/kBkTgIWbFGb7Rm3FRPvgxBVKZNiAF5CcOsFDIxPJ1hqN7Pz2nVrFNtcYg/SY0ZvMzNzMMe0lBYVmCKlIMYnEjA21W5Qyeu86IvN1ZJF0nfFvB5YlAEulLnFeswMpVuCFb/Vs5PREj0GYkqilvglFtLXs1PV4xoQTQKEJXzRAbAymiAszyOOLLmYXxIaBLgjtnq1kFZm1K18WWUwn2TGd+PsCepur1IkFKTajRsY4DcyeMJMAPdbgyjfVlZcXzzUlg5RVyZERQbAnmKSovxewfOwasVyevPeZbp4cpQmxofo1uwU9XS00U5mSBcP7qZrQ4N0Z3QfA98ueu1AL93Z1UFXtlfpfHuGnjDgPdiWo7s9OTpWStIkv+bH+fUfTEZoBz/uQ+jtMeBN8nmaz338Hj3O1zldTlAv36eOcolKhYLM823SuXkAvzqdxKCAb5UMqAvrq1GG1MYKDRtD9Jmh6GyoXc/v8yidPjpGuXSaNwHNdJA3Xy/u3krHKlk6xeB3tDVL/bxJHeDP7CBADxmDOQZq/nphlVw4/qIO/jB/NNBVYoCK6Zm7gLVThwNLIRUXRlG7ca2SnuvfST4eAx76OtiBb9q4Rga0DZPDQpeFiTTvYuHQskWHySrQUyG0KQbQAJxQ1jO7cOm8Oz5h5oz/FdbhqqIi5BOCE6gijXhk0eeo2wCcST2bZcQYthpV2WQBZAA8LVtqpR+ybMkXMLvFny5okaR0vk8rNOhhwWxtbZVh332Dg1fyqYTYukHAgp5ROy84oiqMKQUk7qdRZlrzeCE1OG8ALqjLnZK2YMYVglBu5kTkoEBPCRzENm1VjQrp5QU8IXZgCjzhMgJTb/wN+q9R3pBgkV+mAR8LJUAPr4Xp5Tnn7+KmhKlfZzB+ZRxgn2p0wYy0BC2jaqdfZ8JySTFCFnt4HBuBmLYxS+rHiUqCCFnwPoCCFP1DX4uatWNw7GAQAWPdzov45KF+2t/XKeVtyZtbs0rSO3Ab6naUOhRGAQA99JRL8QBtzTETY/blZ2YN951ufm5nTxymR3OT9OTKafr+e0+owI/n/snDdOvIQboxup/ODe6k6wd30dTWMr22u4Ou9hTpVl+ZbnZn6SUGvLmONO1gQAOjmyrG6GQ+Rkf59R/nTeaJcpouVNI0y+eZUoKGkgGa4P9/ir/uCrTwZyRBBWZn8M7cVMdMrw6gpzL16jZulMeGqCGA80qn76dOaBBhyxoA3xqq37iOSukEjR06SOlknAItTbSLP5tX+zvpSCVPJ6t5GufN2QAzPQDdbmZ++/k5Heb7ubBKLhx/Mcc333xaPbizW3oZYgXmGFXAPBVmutqLWVlsUQ4z5a64Fonk+YMhc2/eJmFyJpYGAhZIxyUNPapKm+j1GSanYmAiVEhEZAGGiAQD0ZizQtaXUeYZP0oRVGB3zvcJH+ilS77IoklJywG4cQc7MYtzVFthodQFloAxDGtG79NAzyle+RQhi5nbM8bC6Kvs2L7DGvS98+ILwz3tFV5EswIwWIDBsMT/Meq3hs6jATvHzrLtEiPqJgV8bpXrp/LgvPK3+3uqEh2zRDvwL5EomSXiSwpQw2sX1yIgKGPjDBRwxUEfCL07PAcAfUuFunal9LAAehbTDuoyrO7nxXT52jBpqHtDlrWbI21dg54AXsSnFZ0KAA2QYtQlHlL9PZO9h/k/8bxk4AdDFrALeXQkkMcqtYo6V1/f5AaiXL53a4mq6bCMLaxbo0BBBeW65HbS2skmrW3M7HGSkAQTTx/YRgd6y9TDG5Xe9jKN7d1Ov/3xW6KmffviEXp+9xz9+t4M/WDuJD08fpDOD/TS1b3b6EJPmR7uqtLtrTm635OhuUqEwSxKhzIROpGP0K3ONF1lFjhTTdPJ1gyNldJ0ro2BsT1H51tTNAXgS4XoSAE9vgi1eeFB66fWQlFGGgB4CvzqdKhsrcREmXInHqeUPQ3wIUeP3wcbGfjq1q2mzfw5zPNG9cTYMKXj6KW7qJ03Aed6qzQGEUspS4eLaQa9FO3JJgQUR4oLTG/h+As65s5Pf4TGPQQsCvT0qII4lnilfCksb/1qbQJtly4lJgh+m8mILJqNW+r0YqdUfLg97NrD/HfSJ8Icm3b6ELcXZl4FXmhUaXOTtr3yiCNLWNtWqZQBVUqDvyL8MZczQ1nyBf6Gi7VNFPpAIZ0aYJ16gFpMsOG7yIswXPOxUEgm2aeVMJ2X84DQjnoR53z0VmoU2xseGr7ifK6nTp92tVdKH1dzSrzTqpmJxOpoZWRci1NMEkFUl2AxFxbUoAcQM84luG5/R0FYCe77Mt3nhJpPhs15o6JEQQ3KpotvDwYBmzYoMQSeGwSsIinARDKtX7eK3BDOeJqsjQfOKt9fE8UT0WBshC4mCcIwPYvl6SH1ZDRglcwTIftxmhKpM5bI2IMZs+ikvE4hpdjUwGrAMaJBLxawB/aRLg8TaoxqYDMjPVZ+bTF3F9fD/OgxA+AyMh7hk+8BfEh1wNnKwIMN1ra2AnWWMrSLn+PBnlbawaD03dlx+sM3rtI/vjRD/3TvHP31+SP08vh+urpvB11n4Jtl4HtjoEJ/M1im9/qzdLUSo8lynK52ZOhmFwNcW5pu8yXAbjAdpSF+Xi92FuhkMUEnC3EaY9DdGfXSQQbKQWZ+FRHhBKmjWqFgICDJCRI6yyfcdACCsDhDYsbqVSh3rhDgQ6kTG7m1AL5Vy8WoYCOCZJn1occ3feIo5TNp6dlnXU00t72dRsoZOoyxCj4PYICdWd9uvo8LK+XC8Rdx/PTHP6wO9nWKAECiVmL24gu2hjIjnDxQToOy0QkaWNhKmaSKZZGE9NXC0oxIAS4rAEwsQo2bN0h8TUCHtqKvJ4CIRdvfLInO6FdhPg1spEWPKsRCOkIHYpSoWqQwS1ejDX8XfcEALwAJQ+lY6MJaTeoUY0g/EYPKAD1+fDL3p+3HnEKVeaKVPypr2ixvGYQEssgslcf02pPX/sjA9z/+8AdXW2vpOe4PwA6gV82ocQpnBp1heqrcqQQuqsTZolWVbgECPL+IwqnR5VWTOAEABuiB6blldrBJ+pbwpGyoWyvBuwFeTAGurby4LnIMtmNhBEDgtTKuObi/ymvTP28D4RSv4LWy+rn6OTaG5Eb8YsrNMWGpdu/YRP4YZxcZZhfTaFVVcApX4kGPDbJwYQHzlZQHZTmHEjJ6lghLRYUBrytKfBiHUUnpHq3+dOmcQa9W2AYF8FD6xFA7PhPoxW5tzdLori5qYHY8s6eLHozvpr+9cZr+5ZWL9G/3z9J/v3uG3jx9mN44NUR3hgbo6u5uZnxF+uBQB3042kFPd+TobGuCThTj9KC3RHeYBT7aXqIbfDnOLGo/bzqG+D1wqpym0+UkA2SSDmfCtIvvyzj/zWGUXBNB/qz4qLVUpGg0pkBv8xYVVCvAVyfAt36dLneuXM4sb4X0+UTUgvelAN9KeX1R7kQaytTJ45TPZiVfscrP2d3BHhpvTdNoMUXj5SwdYsDvXwC9heMv5Tg8uOvZAC+Y7fmkLfCwfDbdwgJgO4ZEcfg2qpKglpvrQNgkX8JiC4PltnOKKm3iEgIElFVk7kuHuOK24emJgW0MbiNVIaiDU7FQYbGNzhOwKCDGoiQJ5Uv+NCf7pTK0u0yFtYZsBxAjvMBtQvwAMQMUbgb0nMPoS5d8eqlzyScAsEb/r9XMKDDIDNeZf/2X/1H9rOd+5PDhZ7GgX3p6yHGDhRnm9hKW1F+BnmEz8zL2fDpMlhfvznyMDvW10SqIGJbO9wlFHwugh/mysGxIMPtYJ+wHjDslps5+WeCdz9smHTSK1wGxQGJ9FvBag+ixedZjPktha3qwBgTNc52OhmyVp+M9ZhkgaOZnAZ7jhAAprj0/ZZZPhFVqbjOu1a4wykZvD2VqbGAiwogbZcgeizzy6DDXCas40zeVCCJ9e7m4cnvBBsiMSOA9U87EqaOYoR7eFO7rLlM17KFrA+10mc+XRncxyB2gbxzfS/9yZ4q+f26UvjNzhN6aHqV7o3tpZnsHXe0t0/cOddKTvjzd6crQ0UJMypd3tmbpTmeG7vHlOWZ9R5jdHSkkaJjfA9PVLJ0uKeAbzcVoL2/0jjMIjfHvdzP7jPGGp1wsUCwWoy0MeAC9+noA3xZhfnWa8SF2CKVOiFmcik4BvtUrpOeM5wSf4YkTxymXyZC3uZHaeSPw4EAvnWzL0DF+3McqeWF/C6vlwvG1Px69/JJrL7M8eA1iR5swyjq9yIKVYXAcu2sY7kY0u4vpXh4CYdPM5EqpqOymmzU7MyAFpoeeDKKC8AHDAookApHcy/8KSAkKg9AtVmnTJQuVXSZDgrcyKRYxA3+/UjwQv7ifZ7nPr6jhD/daSsCEOKZTsyWQVi2qSITAYlm3bo2UBJ1M77NAb+lngB5AExJ39BLhgvFFr8H+fYPDeJ7wHBfE8DgqbC8uYOexQE/Ynk/N5gGAoiaQVXxDW2QzgJ19jUjXlXExRCpg1yJIcTcphaYE0CqhiPLxdAnor15eYzu4MEAg6QLM2+9IWohrB5VPbo5iAbsMa14z8x76pEDFMDqnZZnJuEtrFpfUPp8pLZ7JxJSa0/wMtxXR9nEGXKP8HkEgrxnraN5SJ+8jgDtk+2D8YLgYH4nqGUecab2Rymi1KPp8CZ3ejt4dPhe5ZITamfXATGC8nKCrXVl6Y7iXbu7ppG9PDdHPr5+g3z84Sz++fIz+7fEc/fjaafrehWP0IjO+O4f66drONnqys0xv7izRLAMcypcn81F6uTtHDzrT9Epvni62p2mmPUvnGWiOMNBNVTJ0iq93jFngIf6/+5m5nmDgO8U/P5yPU5KBr8DsDEPs9fUNAn6bNehJqVOHAyuBS43EIaG3Z4bXBfTQ41u/WgNflKZOneLPdIICLY1UDbTQvcFuOtNVEuA7zufCirlwfP1Z3t7+Z7s6SrKbFacMXfYDW0OZCnX+Tt7lQnCBpGhroDikBr7B5CCDT/hVCnpAu3fgTOlBZQR+omy4SYfCCuihTIYyFspbumyKxTWkbcvg+2jSzU1qOG4T4ISFTWyYFn9xBIvYMy1bLB92FzPVVbywo6+lxgMC1pzbVl7QoGasFdBb+qk9vU9Vclpp1ipjr0aPK6yUUtoq2rl9+5+0UDx65dFwyO/5WCzZeOEtpiLiAZnQQB+3YpCMqEXFCymmpQAQowXYVADg0A+FobeMHcC7E+bSLhVTZFi2YY7oZWHo3Qy148SiCAcTiTwSsFR91oS2DHMaFyQdgbAqRcGry4feeSVkEcB8IpZI9S/98wbcjajFlHjjOlFD5gsdIGcPuHsswJXQ4vVrREyFWVGJAoIwiV+jTby4Y2QmouOZzPs0o/P6sjpENu5wxcHjN2wT0UR4nmY6MvRwR5Fub83Qs6EeevNIP93Zt5V+fu04/f7JZfrVC9P0nM9f3D5D3zk7Rg9GBuja7m66sb1C7+6u0nf2Vul8JUnTrUmabU3Qw84UfaM3Ry/3FulWD99ud0Euj/B7/VQxQVPlFB3mTck4lJ65OJ1i4DtdSdNQNkpRuCLxxgrAB9DDKAMG8S3g04xvLb8X16xaLiM0+Cys0UxPxC26zNlQt4GKGWaXx4/xZjXB75VmyjErvjawlaa6Kwugt3B8/Y/vffdbrqFdvbS9vahm8czsVFCJPqCihLISi+8mPaZgFipxpuffoSyC+TZXQ61yH9HsA4uT5PDh9njx2LB2pQSkSj6ethcTk2m+HfSYsEAjL04spVxqgTbmymEt10dPEQq+jQxMpp+3+HNGFRZppqbEHCsE9ESVCZcWrRI0C3NPOUt+XuBQBlOgt/izGZ6T5WnQs02nF8vfA/Tg4pHNZv/kiJbXnzx2VUqlj7AxyMb8wvjQv8RMomE5FpvSohIneKkQ2ybpWSGdAiIUw3TCnkYp9YkdGj/PYHfyHPDt+lu2WOnfovhcvlSAA6MeyN0LmSBZrbIUY3GZ41QCFdODtEQ3GojMaIIBPbukqZiriRQy6k7cplGGpqLG0syn2aHfAh+7bGo7BcW1+EfioaI+USfCmcS8fljs4fYDv9aETp03DDOlc/tUHqBPRhkiAMeAS0ZmpE8pmZEB8vB7aCjtp/G0jy63xWmuGqfHu8r0N5O76G/PDdI3jw3QB7Nj9PzmJP3D3bP0s+sT9N3zo/R4fDe9OrSDnuztop+NbaO/Hu6mcwx8R7IRmi3H6dXuNL3YlWEWmKWbW/M0x6xvlhnf4XSITremaLajQBOlJJ8pOs7Mb6KakXOMQTHcVC/xRHFd6gTwocxplTpra2kjXFzWrpH+LrIiUd5cp23KoOishbCFN55I4sBoEoAvn06LV2eeN6kzfR10tLJQ3lw4vubH5LHhZ0M7t0qagrC8oM9K5Qbjgly9WkiLGKCxvs5y0U+GlYgB5tJgeQiEhQoQ14/oxISEVm2iZAhQW69Lm0YBiJkuMAcxruYdOFhkUGJulAuLWWjUwu7SdlteCV3FLnXpki+ezzOgh0Ucu/56kecvFuPesMwJuhiww7KY9VXyUhLDIrC8ZqkFAPa5+I9KnUst0FuiBCx6VEFKSXwfG2rX0vDhw8/+q6/L+NjoczwX6ClBTQhfTgSmihGzAY2Qd17qeyygeq/GzzKkQRCvCQJ4UT6WlACxrFKqUlhTrdO7/7WaAUCAs36tihbyNNWLctOE7sY1+CjnGANMpl9nA5+pBCh2ZkQsAWuzZAGOg7HJ+4XZHdS8UA4nLONqr+X76iyHRoN2UG3MjM6Y/i+/ruJl6mvm91Kt9C9hHA12rHqAXp0a4bUFQ/z3eQTRRpQvZ1T3CCVFwa/eiyi55nxNNJTy0kQxTEMxF10ohelOBwNfX4beP9RGv7iwn35ycYj++f4Z+s+3btK/vj5H754ZpV/cnKD3Jw7RO0f30LNDvfTLyT30zQNb6UpHlmYqCTpXjsnw+tXOHF1gkLvWmRFrsolSgg5nIjTNgHOez0kGPrC/8VyMZroKdKmnRMcYCGNNjRSP8CaTGV9DQ6OA35b6BmrQZU/F+lS5ExUIec0Z9NZoNecGS9iyVsZYMMc3dfy4mGk3NzTw7TfQg12dC6C3cHx9j6ePX3UND2ynvT1t4qUZ14kDYFU4xSgafpqJsEo88Ln1wmMbCmeTyoEl2FIv5SRhEAG1i0cPBNdDdE7dxjWyiBrGJpZfkp3nF1cQlODAUAT0/G5hGDGdc2cWcuzikY6Q4IUMJUqjTlz0BZErYGBYzOEQg54GQAqLf1izyo28COA+boOFV8MmHR67REQyRqX52UPpyuUe5zIpbS5RrBLD4Azk1dbyR9du3PyzTHoHB/c8NwkHmK1DFmBGl98shhO0F3rV1/NY4x2GIYM1epoU40OiOsZCAHDY7YPNwfgbIIfXAHE0SCMAY4erjsowdFlzdAAuvB/AyCwzcofJtClN2qMgDl/OiG1fFtMjFsIMtXjFCFlMz89ibyGfI4HdLpWqeT/b1cW42NgCFdu0WmUNKuFL2EqdtzcMRiEKhgfD7mTYI4pOd9NmAWylEHUJaG5L+ukwg96pnJ9uM9hNZ310py1KbzDovbunSG/vb6MfMqD96uo4fXj9OP3i1gT94s5Z+vmLZ+nD25P03TMj9HhsgFlfL7030kt3+0o0056hA+kgnamk6DaD2NWuPE1X0wx0abrAv7vUkaOJckoUnTPMBC9WU3SZf36GwfF8R176fLA1S7n58xPg+x9noGpukT5fIwMgQFDADxZmtRuZ9a0TH1IAnhhTrzSpDKrUifcEEiVSkRAdGR6iRDRGHje/D5q3LIDewvH1PYb29j/bvbVClVxCCwvUztkAHkCoNZeSYV+Ux5zOGWIQHFegBpVcPTOaJvHIdFuRMrlkTPXMPE3CsrCAm3Kc9HAiyoHEjcgW2JJppxEoDKGui2imF7KG0t1iDiwp6cuX/ZdKm6sZhDCyADADUNWJobWy81rCLG3ThnXUVUgI2GL3q+b0Fv8R6M1neY65PACfxfQYZMEsGUB+8MEHw3/u63Pk6JHhLbUbVLwPMy6jSsQsnUkiMMBnPDrVvJzb6qfJXJ9+nOjrweQbZWQYANTzJTYz2IzAmgshqQjPxXWg2JT8Pn4dDECZkiOGvvPJsK18Nb6blienTkgPeixfTSteSANj1GJq9kiGk7kldJndDLxbqQ4RWxATdwhizOC+EbbEP6H+NGXMyLzkea8GdKX+FOEMSp98orQMgENvFKwz4FHm31Bybo15aTzlpnsdIbqY99KDjijNFoP0GoPe0/483drGjG98G31ztJc+mNpHf3t5XMDuNw9n6TcvX6Df3D1LT44O0sOx3XRrdwc93tNOt3qLdI5Bbo6B7PbWAjM+Br6tRTpdydK1Lnxfphe3lUXZeY5B7gJf9zozRDDBSQbGkVycDvK5LxOjggid/DJw7mpxUVNjMzU1NVNjYxOfzAA3b1KD7AJ8qs+nwK9GSp6G8QH4sFHEZmTy5DHpG8Krc2HlXDi+lsf7772jQmKrBa3C8+lengKaoCQZ+IQBgv2gP2SXkZTIBb08kYrDgYU/IEbAgkUOZU0zsO7FGAOzBzvzzMUfyLCAGlLP8Tss7KLq5IW9ub5WeiyRgHdemQ479AIvQPhAovy4+AtAb/EiBUjo66CU08iLOpgYAAtjBGClGJEwJVKoHddplZuyIVtsAZ5ieI7y5uLFFsszzvY1Dqa3esVS2VH/7ne/+7NB78Nf/rzawmCH5x/g5JOhcpfENhUF+PSCH3SWgRVrMaCiSsQtMvdoMvnwXEPkgts1GX0AObc5m7bI/zIbjVhovrdmRjv1GF9WlZ4OY2h7Bs+MtMSc4yFa/JLShtQ2M3NbDDFhsTa3JZQyPbtPG2RPau9UA3zKIcajjBO0R6ttbu1VqRRmkN4BjEYNC4GLYoItUglAqgUeL96HELkEWrZQfypAPf5Gmsp46H5biG6UAvRCW4RudsToBjO/u31ZurE1SU/3tdH3T+yk90/soudzR+hn107TD66coP/5+hz93YvT9M7kEL04tJ1u7emkNw52042eAt3pKdI3dlbo7YE2erCtRHNbS+LWMtdZpJf7KnS9uyRKzlOlJLPAJLPAtPLsZBAcYUA8xBvYg9kEdcDEPRrljWdSkthbAH5NCvyaBPg2S8Yg+nyK8a0QwAPwSamTmT9AD+pdd0OdOLecOX1S0t8XVs+F42t5nDkx/tGO9qIqa5rFJKQYHDLrAECldFzAR83deSyVnKgytVwd/Q+IQ9ADMG4nYiCNXh8vFuhHyQeHF1OTg4fFJcWghwUozDtnfLigkAto0EMPJm3YAF8fDBDD09moYpWr+cO57HPy85ygh+sBwKAM3bB6pUpO4L/DrCDGHkTWv2iRpQIFeGG0AuXaefl5ALxFzBIX63OJBjsRsCwRJSmAGAxUZqEYaLGw/L//+3+/VP5YIZsRMAMIgYX6dOKBGW3IacZnZvlsVxSP9bqKClGH0grjY1BDZp5JRDfsGt/jdcClKWsa1mY7pdjzjSYJXUqdibDl4CMMKmDbpsU/AVJyf40NnBE9OZSYYgCuGZthesbf1fx/C0j17ZrrOkubMcd8Z8TMNjpS59Vt+bSrjFvPQbo0MKp+L0qceFzY5KHf5+YNQ2/UQ3vjXuoPtdB4wkuXigG6UPDTzUqYLrWGaaYconvdKXqwPUePd7fS318bpx/PHKZ/fjhD//z4Ev3w8lH6j6dz9Pf3ztF7Z4bp7uFd9PjwDvrGvi56bXcbXWYG97SfgY+/vs/AN1HNijfnDF/e7SvTTFuGplpTYk02wSxvktneyVKCpqsZZnwxGs4n+fpp2o7NSShEpVyOgS8oLK9Rlzkb0O+DurPWWJetkXL3ei1wMYPrEAM1bVpP7vpaeQ4xwL6wei4cX7vj6sWz1YGuiohX1M7cIUAI2EwPw+jIEYMno9m5R/QMFsYUFCA18QdDCVgkDDSohAuFdEJKcGCBcPc3vb6I3tWjVwhne7COTXogHaeXQTCE6JdPuntoYQIELhBgmBLj540qiIClZqkMsYPlQbaO8iYUl3CYwcJmAHKZLldC4JLkhQ4WZ3aSgp1ODcGKAN4S21tTwK5GgZ05kXTtdbu/9ALR3dX5sfTI+PEDkJSasl4S2TFUjf5TWoaofVaaelSHy853SVHCJL+UOhvFYCCg8woNkxZbOLcCxpCvxS4VSp9NpYnbLEvPykXUvB6AIaeBT0DEb1uTWd6bIdUTNCIY44qjVKG2KtgGWt88qzsDfAZQTeK6EaIkHP0/p1epOl22yMfncoCsFgTpuKpURBlW45TcPaQ7IM8PwbvMsEshN4OJh/YnAzSWCdJ+Br8hBr4zOR9dZ9C7woB3sRii250Jutgaods9GQa+Cn14aYS+fXIv/er2SfrHl87Q7x5fpJ/dnKRfM/C9e2aM7o3uoWu7u+jbo9vp6WAXvdCTZ8Ar0OOdVbrSVaTxclrm8i53FeheXyvNdeToZDlFg6kQjeVjdLwQE3HLWWZ8StmZo8m2PA2kohT3ecWvM+DzMeCpIfZGvmyoVw4uouzEPB/MuNeukQ0iBE4Avg1S5lwlQjMAIBIZFlbQheNrd5waO/QxUtGRl5eQHLyA1WfBgoIEaphHZ3kxQ/8n7Ld33Bj+lRIXmBovEkgGR5isc4HFmILk5sWD1Lx5o5TmVC9FuXQgcUECW3lBqZNh9s2Wuwiumw3ruSyHqEaVNgPyYTRuKZ8lZFnssB5bqVMOMHgLBSdKjwArLHAo75nSpunRwb0CghGIOObP4S2xenjSt9MqzeU6L884XQjoibt9DUUi4S+9QLS3VZ6DgeP5UYKUetkoIPMPbiNwuYH6Fc91OmwrGCMOQUdcp0iY/qixgAv59Qykz63ZdIseU2myR0QMuwIgWP02JTYxzM6MLJjgV6unp0dSjIuOzN5hAFz+zj9vsF2JX+ySaJzfGzHNwOaPQdhl0ZijJzhvUH6eM4zbYnxWRFPAlIA9FuCa+5yU0QXV2/Pz5gu5fgBpYxSwNeZjhhWgg0kfHUz56Vg2SGNJD51Me+kI/+xqJUKnMl66352ku10JerAtTXe70/RKf4m+dWQHPRvbTj+aHaH/fm+SfnV3mn7FoPeL21P07PQQ3Rrqp7n+Dvr24V56tKNEr+5spae7qvRSb4kutGcZ4MI0WozTLAPe7Z4iXenM0WxngaYwugBBCwMeXF7m+Gdn+GdnMeLAwLc7HaGwyyWMLxQICttraoCqc4v092SAff162rBunQDfxvVqnhZ9PmueT7w6V1J97ZoF0Fs4vl7Hy3dfuLKjrUDd5YylqHOmWIf1oteaS0gPSNxV9I7d7JwBamIezAsEBCwolRnbMUlbSMVkkUA5Eh8eMIuw107eRtkTvZNAS70oCZVDi2IWKJVm9KyVGg52SdZdDIGxARUYK305bT/2WcGxRrWJHoUMxfMHGQAI0Fu/drV4fUKc88m/h3NFlRcXjFjUOHp1y2QkYakeS8DPdFhnzRIBuhXLaxTY6ewymPxm0l8+huXo+NhzsB1xUnE1MhhvpmZmu2B8OPFzLOooc6LHl9HD3xG96BuQMgzejKI4WZBhQCHx9HRZYyX2cLnqp2GeLx1z9vFs5abz+1jI7uUJ6Okh9LhjvtOUJ6Mhj63QdDAv0zd2pjTE9NiCcZGJ6TlLqS6I8MVrjUEYcU/U77HfS+Z9HPQ4bPQ884QvYMyYSUX+IvqdRWZKxlAbG44BZnVHUx46m/XQqSwDX5wBL+MT4NsZaqZJ/tn1aoimc166WWXm1xqi+71Zutebo9cHq/R0qJveOz5Av33xFP3HNy7Rb165SP/4aI5+efccvTU1QjcO7aB7g1vpjX2d9AqD3uOdFXple5ludeeFxQ0zq5tqZ9BDGntfie5ur9ClzjyNg+0x0zvXmqSLbRkpkaLsCVXnUWaJ/ckQhVxNAnyRUEiYHfp50QhvUNNZSqfSlIwnKBaNkc/rYybYQKt5A7hGVJ1qpGUDn1AkL6yiC8fX6jg40PdxXzVP+WRECVccA8UQDWDBk4HysHJQMSUwtXCoxUey73ix8TZtFgcW6eXpHbr4aDLLQ78JzhUoXYYdfZRUNKR6MXxdlBzxe+Mjib5SlFlmwlGai2iTY/ghIr3BRAk5w1wXfWpw7CLps0GJif+zRubPFFCBWeL/A8Q++bdo6ndkYzKkroI4l+g0anV+8mvVx1su4Z0reYFYtXKFCuxcs4qymS8/yHv27JlnAe2kgkUXCkwJ8OUNCWbvXMKSm+XxYJwDKRcwnzblRbyO0pMKeuZtXGIBk8xu97pChvF5VPqFUVGaciSEK+jd2QCnxgHM3GbakYFnDZIb8DFp92HHiAUiq7SQZd68Xsive5Q2uJkkDHO7ZiQipdmtSWSwHVq8NrhpxitnyPYyjTnLqFq9KYG0IVUqRrkdDiwSVBv2y7jH3piLjiZaaCrZQmfTLTQSa6Z90WYGPReNxd00wSzvQt5Lr3ZF6G5biO60qz7fja4U3d9RpAfM+N4Z7qFfXT1C//5klv73m9fpd29cp1/fn6EfXj1Nb0wO0+yebTS7o0q3+Xx9Tzu93FemV3eU6Q4D3fXuIp1jkJvbVpYB9lf7q3S9KydqTiQzTFdSdBEqUAa9S8wOAYTw6zyCUmg6TFH+jOVSKf5MemWer7XcxoCXpWSSQS+R5o1alnKZvFwCCD1utySuy/D6ulUywL6wii4cX5vj4pmJK70MeJ3FpPQpjPOKMQdGHw9OHkhGB6tA0Ks18xVUajh4cKZjYconIgwmSvIe8RsRAe+UYxE1v8eLB8qeZozBnEhWh9cmSnHoE8BqTEqbGH5nlicmwZqlhB1/hzk6SKlNSvqSz2F5i7TBNAASfQmAHkqbAD2kH4ihNYProkXz2SL+FhE7ZQZYWK6BGa7UJUv07ACiclnjFK3USHzLSga7VStXqt0xs8V1zCZj0S+vdOvfNTDsbVIiH4hLfKLAVKMfLQ11slD7xDGlWfqgGLQH24PAKB1Rm4tUxBaeWAzKr4yqjXm1NQ8pRuDNcuk05U5K3y7ELD6qchah1AyrSoEz/NU4qCSsYXGvFfxrQNBmVz7bri5iB8oaRuj83i6Dzk9bT4T9jrQMOxQ44cjos8ci7JEIO7rIJ9ZmppcY131GUwbGY8R9LjLYN/P7/RAD20BgC02nWuSc4HMm52bwa6KTaQ9N8Tmd9dKVop8etIfohWqQmV+YLpbDdCwToMlSlG5ty9NfHd1JH149Sr9/PEs/f2GSfvt4TtIafnDlJD0+NUQPj+2nl0Z30+XeCj1h4Ht9V4XeGGijl3rLdG97K00wsJ1lRndvW5Fe3V6ke91ZusLfI3D2KNgggxycW1DmPNWaEueW8SKUnVEKNtbz5zRG6XiSSuUKpdM5yuYKlM/lpdeHMxwMUrGAnxWUvdmmTbrHt3IB9BaOr8fxy1/+3LV7W+fHylQ6NC9BIaoXPC8zCtgPoUeEXa1k5jlVcbwDh0AFbA2Gvdj5ifu+X3ktYjFKx6OymITcjTKbZ0plZjYvzaCI30PgslEG0huEVaCEifm7lGPIGPdJGAdmpwIuSX+uEQuxRZ85rrBEX6q08OXCROtNPw+WVPxzqPPAkD5pLYbbXMH/o8zPD8yXTfL0Cgv0VBlzRU2NKmcKw3OC3Wp1Mltct3aNSMP/z3/+55dSbx47cWLY39JkJaWbE88pNiXonQJgwP6gkEUZ2XhIgm2DfcEkAB6oACtx0vE7khB8qqRpmLgzqFcAQQtPZNQgFpIxFDOr5xxKNwIVJ9szoxOmRImen5m1EzYW8sxjZ7GQx1EC1dZkut9s0tedfUALEIOm9KlVpmEdTeQAOMPqrMR2hyLVlFwNAwQA+3RepBlwRy5fydtI40k33ahiPs/DwOahSzkXXeavL2RddCrlYqbnoSPM/qbSbrqQ89LlIgQuAL4ITeSDdCofptOFML1/bCd978Qu+snMEP3767P09OR+meP7xQvT9NdzJ+i9mSP08Og+CaO9vKONnu3vojcHKvTOnio94/NFZn0ny0m62VOgRzuZQfbl6Xq7mvMD2zuSj9MYnyeQ0sCAd6Y9J16dcG4Z5p9HmuuZ0WWptbWNCvkSZbMFZnspUXGG4JsaDFBLUxOlk0lqLZUoHIqQq7lF8vgWVtOF42txnJ04+bx/a4U6iilZ/GJaNWdKi2JXxYtpeynDC2cT1dWutxYrA3y5VExKl1kRqGwQJheyhn3V7B0WqVzMLwAG2yvTR8Hv0euD9ViOF5Um/nsMR5v5MvgbhjCH5lDZmSQG9KuaNm20UhUMQC3+nFEF9O7gvoKSKC6NiAUAluLHDoHOkk9xXIEaM8OLX28ly9evkZBaXK6Qr9Up5czlKxyAt8oGPAG9tbR27Vpat24d/ehHPxr+Mq/bxNTUcMDVZI0V+AT01POEmUKUqQEyCJTFUDlSBcRMO+ITdoLki0Iar1vINnvWM2oRPcpgVJpRh+AjFrIl/SmtXhSrMQFPdWmsxZw2Ywr4gha4WYDlVFc6BDdW+rqT3enf4/1nhs+NN6exN3MqPJ09QdPPM6zQ+T+jGjhVVp/NBM11VKqDUrq6memb50vFLvF7IuKiwZibzub99FJHmG5WAnQm3Uw3Sl6aYdADCJ5Ou+h40kUnEi10POGiszkPnS/46EZbmG51xOiFriRdqsboJjOzt0d76N2x7fTDswfoNy9N0++fXqPfPrpEP7k9TT+8doqeThym+yN7JIz2an8HPdvXQe/t76C3GPRe3l6mK105Gs5FaSgfZVYXp7lKkm50ZqSvd7qckJEGiFwQTyRlTqg72/MyAjHBrLDAG8lyuZUqlTZmdEUpbwL4An6fpCzEo1EK+HizkoxTiEEPp9u1MJy+cHwNjhdv36z2d7dRL7M8LJL40ENRZ3b1sP7yMMvLaUsxzNxBwRnThr5m8SvnklI6g6gELA+lUJNqjjPNi6yUzbzNEiRr/16pMAGaKLFleQHB7yEUUDE5HgGhpMM70ikvr2YT8zLulnyBgAVgBpaGUgzcXgxbQ0kSQ7jo2UDRiRSFGnMuUUnjuO0WBo/p0X1UA2angc75NUBPgG+lDXqrAXYa6Nau05f8/bmzZ698mdduZHRkONjSJCMLAXGqUQPTYMjSN2QwK/DrhtcKzBygBxcNuKlgEW/NxKjCz5+Ao8O9xBnlY0qRcc2izEiAOLBEgpbgyQhWDIAawLNPlVbuBBIDLBaYWSzOO4+JGWcXJ4uLavVn1BFGG3X8fp4FWshvAWtEi1WsHp6lDPU4/o/XYnxKHKNELAk9voCRjlJGC7L48aJisS/po6GEh/aEmhjcPDRX8jOja6ZLeTfNMeO7lHXT7bKfphn4JpLNNMFsb4Kvd6nopwvM+F7aGqenOzJ0vydNs5UYvcYA9vL+Tga+Xvre5D76t9fn6DePZun9i8foV/cv0ntnx+nx8f10+9Aumu7roJltFXp7uI9e29tB9/rKdJ+BDwPte1Jh2p+J0tW2pGT1PdpRpllmfGCCI9konQXTa03TZDnFX+fofEdBXF0mmf1VYBNYKPNZYsZXpGwmT63lCmXTGYqGIxTw4vkIiMAlHI5SJLIwnL5wfA2O0YODH3eXsxIdhAULTA8LHKTqMrvlVs78ZV4cYf+FYXSjgjOqNjOGIOnnzOKgujTD6FHZkQfVouRrEUn9xvXKVsykbcuiGVVmvlBt1mqHFiOjb2TQizuYp/kd+lQYIneWNr9oPg/qSpQ2kZ2nRhVMX26pgCHuI6TYK2owx4cYoEUSurpiqWJ+KBMe2bONli5darE9gF6NvhTgE+HKSgY9DXhrVjPIKaBbt34DrV+/nmpra6m/f9fzL/PaHT129EoU/TVRXTZLaRZD5lDVIiNPJR0oZgVmDKVs02blselp3CKenUhkz4sAJTRPqescNjcp906gMmVCI1xR7C5gRTIZJhcP+//ISNoAjJmtS3xyns76nQKmhOkFwrbOjClYgOW1lKgx3Ts2ZcykTmQwgKmYqkePI3jmmSqYDVpUhxtHgzbwGW9OY00GRo3PCx5rJReXHi/8Ng/H3XQi46F9MRdNZr10KtnCYOeiy3xeZLCbyzEAFrx0veKn4VgLXS4HmO356CID3yX++uG2BD3sTTHbi9KN7jRd3MoguL+dno1so/cnBulfH1+k3z27Rf/+1gv0gyun6b0zI/Tk6D6a291DJ7vKdK63Su+O7KAnezro8UCVLnUW6EhrhvZm43SEGd+N9hTd7srSXEeGpiopSWcYy8UE+ODZOcNMb7KSYcaXE2eXw/zYysgNzOQE9Lq7t8llCmrORIri8STFIkhvSMiJny2sqAvHV72seQXjCUhET2vAS+ryTkR8GVuklydjCLwAACTwgTfS8Lg2BC5mEkoWzosGenWICArr2TssLogfEnYgLHC1eDkGLVWgS2zJsMDkoz7awgCH35vSJm4rxItKSKepo5RnbMcgH3cxW0MK+bIvUG0aYYoaSF8hJVE116cAb/kyNVsX4F38mpXLNOCZk/9umZq/a2HQmxzZK326GoDe8uVyab7GuULEKwx6wvLWMOitEcAT4GOWt34dg97GWiqWyh9/mdfv3Llzz3MQjoS9lgIRpcu6DRAJbdajIzr1At6QzEgwvA6BkKSe83MLlgijAKW8DFqMz8q608kJ84HJLwBkPDXFZiwetvp7aZ2TaLw24yF7g6QGvW0z6Yhxh9Fik4SOE0o6wNIac7DYn7oMWz6ZPrv/F7LT2A1YxxzvVaPYtEYUdBqFs1Qf0yMQMYdQxmJ6EG7x+9KUjtvyCQo2bmKW56bBcDMdA/jx1yNJj6QsnGUQvJBx0/F4C52MN9MVZnVnGADHEy00FG0WsDsNcUslRJdaQ3SlLUIXqhEazwfpVm+GwSfIoNdL3xzrox+cOUD/9toV+l/fukd/98pl+vW98/TjS0fo/ekhenVkF830tdHFbVV6eqCbXtlV5bONrnQXZR5vUPL2YnSjM0vXGfSudeZE7HIGyefFBANejoEvJ2kNRwpJvm6CjpeVfVkV/XYGugSDHECvUu0U1peIp9SZSFIqmaZcdiFPb+H4Ch/vvfOW69BAH23jnWAhFdWD6PaOWIaSxQnFRSXe1SJnTVmOOVVzXlFcpmJhZQ7NDAOlQVFAWgIVpe5DiQ25bOvWrhTGYVSZWGQggkiG/OJ2snH9alEhhnWmHnp7CYd6UNxBdN5bKREUmfRyM5CuQe+zWB5+v0oG0ldKmRLqSqO2XK6HyWEEjUFbA3KWsbQePAdL3dFeoko+wyxxhQa95Rr0bJZng95qWs2gt2a1Ptcw22PwW8fAhzyzH/3ox9U/9zUcOnToOfpyuVjAElpgHg/zgBhfsPP1tAiFNzFwVYFDDsB7i05MD3tdauRAZ+AZcDPjCEb5aBSedmKCHexqFKCoFiTn9cu8VtyRpcx0CEicxtKGodmApdla2P9HZceYGTTXbDDqKFeaIFkzv2fYm+lDG7CMWkPo871Ao7Dcs/xm7Rk9qDdRQo7rSCT8H2QZxpo2UV+wmfZEWuggA94BBjuUOnfz92P8/amkm06nPAyKTVLSxNjC6bSbTvJ5NOGiaWZ7k/kAXWbgmykH6RR/fzjtp6lymFlZnE6VIvTuaA+9x+cPp/bRr1+YpL+aO0n/9Po1+vDFSfrRpXH61ukD9PLQTjrb20bHmbG9PNBO93dW6VF/hV7obWVwy9HBTIyO5uMMrGm6xeB3oytP51He5O+Pw6qskub/mRbvzlEGyBG+7vEKZvlSDHz8+scTctbV1olfZyQcFXYXZbYHD89NdXULoLdwfHWPiWNjH/VVcorlMWjFHQGxYGiwmpLeRVb16gB4AByn0wUWi3wmKQIVlNgQN9K4uc7qxWFXDEsyESIE3SJuMbN3ism5pawGYIQgAOa1Yj6tWV6Q7wP6bmApQYeoBnZZOeTHMUhiQLZG0hFs0Fv8GaMKADWl2lwrtkkrxCJMiViUG8tS7dSyVNuSqVQE5aVpsvCWUTzQQhcnj1usbrnu4wnDs1ieBr1Vq23wk1LnGunprV+/gep4kRgaGn72576GXR3V560QokT9FqhAmQlLNMwDprTcPqbn71Sftlnm+nwtTcLi6zep1AQ8tzJ8nQwLcBoQM/26uBZt2GMDfkcAbMASsiS19VhCy/kTjiBYY+1lJalbhtM6oSMasEyg7dk7DX6O1PT5Kk7TF/TodAX7/lklUstcwe1gdd554wpWaoN2iYnrUq8B05jeOGDDYOUEIj8v5qd2BrwdwRbaFXJRL783uvzNdIiBb5TZ3t6Iiw7z18N8DkZbaIJZ3SQzvym+vJj30SwzvRMZL50pBGm6yMDXGqTzfDnMjPFca4SutsWYlSVogoHvO2Pb6O3D3fQ3Z/bTb16Zpb998Qx9+OAC/cOD8/SLG6foWxND9GhsN031Vmm6q0iv7euixwNt9O7+Dnqpr1WY3KFsjIazUZpjsLvZkWPml6NLHVkRtYyKojMhow2Y64OF2RgzvVPVLI3y9xW0KqIxyqUz1IxUhoYGCaHduF4Ns6Nkv7CyLhxfyeP81MlhJChsLabEE1ECYvXO2SyO6OVhRwyhA9gBJPCWik/vjsHwoMpMiuVYnbA85xgCFgtk6onvo69ZGBYEKgb0AI5ZzObxLtyUPiG2sEubmyRVXVK/vaqsiZIrLsupiPT6VtYsU4kHX9DPw89XLl8i80TNzPIACit0L0/cU3SskHhtSklziTC9pUsVwzOWYhhkR+Do6ZFB2ly3UYQqEKwA7FboMQXVzzOnAj4n4KG0uYkXC8S5VCpV+v0f/uPPGl3Yv2fg43I65gAVfp75vhnRDsJAE7q0aMJ2jbkyFJ14LlGuRmQQ5vrwOgP4MM5ghsuthIOwEaJoEAyan81XZxo1Z8Yyu1bikGjQFsjEHV6uAoBO42oruNVrl0GD3nkzdwYE54lhHH03pyWZYXFm3tTp+WmuE3f08earRT3WbeA6eN6wQcBnRtLhUcb1tzBQhGkk7qbdoRYBuV5fI+3krwfDLXQy46FDDHaHYy3Sx9vPbA9M73xOgd7lUkBKm2cZ6ODiMpnz8/dhmiyE6GgmSHe7knSPQe9ae4Iud6bp+8d30Nsj2+insyP065fO0d/cnKS/f3yF/unxHP340lF6f/owPR4ZoNn+Trq2s43ePrCVQa+TnuyqigXZ2fYs7WfQOwTga8vQC105Br8sXenKCtiNG+ArxiWgdjQXpaPFJB1rzdBwPkFtQVgFximXyZHH7aHm5mY5mzQILqyuC8dX7vjgv33XNbRnJ3XzmxjzZibM0+x0w9qKqqVxC1XyKVkEESYKgYSzXIZFDGkJstDwYgqWJ706R2kzK0Gxyq8QQ+C4jgI8Baxx3RsShwtXvQyYY85MWB3fJkqbUFOG9UweABWAB7aSY0aDUEuA3uepNq3S5pJFksCA+4BRhdVmzs4wPQ16uB0FgioDz+Tg4TpIFUfAbDoR+SgdctP08VFRaaK/t8qwvBUK7FabcQUBvFW0bs1aWg//Qlg8bdwooIcQz/qGRurbvuPPYnt7dvRSIRWxemFgdjDdXqwjjdqyEWrA6IeUg3X/Cwt+wGttLMTIu1l5dsJMAM+/sCZ+bVA2teJ5wvNZXtwBhtasXnQ+2zM5d5ZxtDYUnzcQ7nD9SVgjCLaa05xJ0+szIhnH/YjPK0X6LD9RI3QxIwjGMiwSmD8D6ExniDtm/CJBtyVyEVEX0ia0/RieI1QbkLoxyeB1PNZEZ1IuOsCgtz/SQjsDTbQz2ES7+BxlsBtNuGlfpJnGos00EuXrMtvDeb3kp5MpN51Kuxk4XXQ8ix5fgMYZ8I7lQvRCe5QedifoQU+Krncm6aX+En3nxA56Y6SXfnp5hP7H65fpexfG6K9fmKZ/eDhDH1wcp/cmDtKDQzvp/PYOutjbKsD3qL9V5vdub2PgY5AbYSAbysXoKn/9YneBZsoJmqkk6WQhLqpOgJ0Cvjgd48thvi6MrQ8yU+wKeUS1Wcjlyev1UguDXktzi1wurLALx1fuGD04+Hx7e5HaeUcHtSQWwGjAHhQWVsXgggUIhrro+WBkwFLW6esplheSsiVKkGAVKuC1xQK9HHqFYZgRu6VP5mrcZC+2vBCjlycLkIDmKhmHCGqbK4w0+NBvkoVZGSoHPAr0kCAQammk1ctrrAy8zwM98dpkIFu3ZoVI9iHIWYXe2/JlFuAB2BZrI2opdWqwEy/NZcpDEz6D2AA8fvR4uLut/NHw7l6qlHJq+JzPtWBzAnTKeWWtnGto7ZrVDJbrVAkIgFdXJw72EuPCoOdyuWlm5sJ/aWbvf/77H1xthYwoLxW4MKuO+kScg8cA1lyKBynPmwMXM1s8r8rizZ43M0CIxVyAj1/H+k0bZGHHjF4eApdoYJ6QxXhrxhzOJYoVKqNoo950CkmMoYBdIrVFJ/F5/UEbSBMGMB1qTufMnyq/OlLUjcJUe3maINh42Gf17+aZZJt8Pkf50+5/uuc5Bcl7VoMeenp4zvEcQkjlr6+l2ZKPruXdNJuG/Zhbxhb6GPQGgjgb5ft9zPAOMeAdT7TQWKSJTsSbxbHlfNYjw+yY4TvH7O9gjIEvB8AL0olimC60huhMKUinS/g6Suf4vNdfpLdGeujh/i760flD9NuXpuinV4/SP758jn5y85SwvW8z8N3Zt50u7+ykGzvb6f3hHvHrfG2XAr+5rgKNllIy0gBLsmsMfhcZ+C63pehYHiVQiGmidIK/BuMD8KE0OsJ/g0SH3qhPwmjLSGjwB8SourlpAfQWjq9gWXN7e0lig+DDaCTeznwzI22v5tPMClxSskR/z8pM0z2/XCougInyjgRKbtqoMu80kwOgCQvgxdjFCwNm78TCyqeSEaS0xQuYOL64GsSp3fSWQuIosp7S/P9Cupxp3P+x+GCAHcBlSptmVGHR58QIoUcHlxcF0CtsR5UaZRxtSpsmHUEAT3+tgl9r5HFm0ylRXL5w62oVKQbnT42Rq6mRNqxfK44VMKxep09EsWxYt1bc6Ws3rKe6jRsklXrLJga8LVuUrVNDvZSFkokkbeve/ieXOd9+843hlFbRJnUpLh32SOLDEn4sAQYxuMckmOW0MvhFW+pl82AUnUZNiV6VOLq0qMw8GFZv0RmHEZ8a/i/ywpiJBR3gpxWRxlPTqC416zMgaOzHbIDzWUITmzGa0YKAJWIxdmVJfVtGUOMsn6YcYOysVNhJCx6rLxcJ2H08M/KAMqrdm3bPixLCZcTvmgd6IVEy1wt4SyAu/32Zn5d0y2Y6w2CFWbxreRfNZt10moHtEINcn6+Ren0N1M/Atz/aQkNgfAx8x/j3ELBMMNM7DCBkADzPf3cuq2zKxlMeOsZsb7oYolnk8LVFZSTiXGuYJgoBOl+J0JN9VXp7pJveOdpPHzDw/fz6UfrXV8/SO1OH6dn0CP3VzBh969QBuntgB831b6XLfVV6c18nPR2o0P2+Ar24rUiXO3M0zmC2nRn9mUqaLlSTInK5xOepQkIcW4YZ+I4VYjTZmqIT5STtTzMY8s8hbhngxx/yeajAwBdk4MNGbmGVXTi+Msc7b7zqOrxnO22v5qktF1e7fVPy0f2OsLEbSydEvIKU8sYtdbYnod4tQ3yC2Tt8DxBBJh2YmfSJNGjlZCjaKwbRUFgijRuLbtir0qeROI0FN8lMsaFunYBrwPQD0c/bvFF6hWrBUYAXEFszlySqY+xghbiwLP6TSptrJVFhjSQ1rBbz5xrLiUUpNO3SJtScRriCE//HhM32dG294uipPcsx0Ny+cJo219VK7Ip1blBnLYMzwK6OGd5mMLxNmxTL2wJmxWdDvUS5uJqbsWP+eGDXwJ8EfMfHx65kdZpFXLxPefPgbrDcaBK8wSihNwd2xWeJn7Osr0m8OFMydG6POWAhVywaIw0NwsjB7hGhhNcLXqjldFTeEwZ0ErqEmYraaRyG9ZkE85SZrzPGz5GAI9TVY2fvGXsyA3jOwfKwLYxxgp/FDh3iFasvHbB7z0bZad67pgphhuLt3p7u9QV0MrtJnNfeoNgYoOqRNL1NzKfCxs3TSNuCzXQk6aKLmRY5J1MuKV2eZHDbwaDXw+dAqFnKnsNxlxhRY0xhnIHvUESB4MFwA10p+4XtXYGCM+Oj4QQzwHxAgmcvVSNyOc2s70pHnC63x+jJ/jaa6cjQWwx8754apJ9eO0Y/uXqcfv1olr5/+RR9+OIZemN8kO4e3EmzO7fSma0lemtfF30Lg+99RbrfW2QATdHRYoL2JsM0zcAG0LuzNSdjDdMMbGPFJB3IROloIS7AiNk+KDtPVjICfrsY+AIuF1VKZYqEwgugt3B8dY4jh/Z8tKurJLFBWXHW985r8IeNQpI/6OjlYREFENlhnH69A3ZLnp44sjBgAdAwWwdQAqhJGU3n8GGhQ9qC6tU1WaVN/E8Fim4ZU0BvDipC6Qcy0wTji/ua7RBTDXgBd6MwR4S4YoB82bI/TcCygoFrA5gkg/gWBiIBvRXLHBl6i60kdZOpt0wrN6WXx9cFyAa9HvqHX//dPFBqLaSfl+IBOnd0iIFtvZwAOjn5f9XVbpBzc22tAOPmuk0CfPVbFNtrZtBzM+D5+bZh5NterdIrD1/5wlJnb0/XcwSXCsgEVWkT7Nc87hKDcSUZEjUnNg8Rfm0yvIB3RL3y/JqFO6Wl93jecRnQQbFgfWDbiCgC8KHMWebFT5xIIFTRziv2ILpPqyftwXbbHcWe9ZMZPv27pGZ3cUdJM2WuG/Hbbi/RgDVCYfcJ7TJl3BEuawlkov5PeGn6rIy8sKPaEHMwQ1u8Ypc2Td6eiFgaNlM+FZFNA9yJYGTQE3HTjrCLesMtwubmCm6Zw5sAa4PhdJrZXaRRenwYXkdv70jSzWzOTZMMcJjtm8p4ZG4P59UKA1/ey5cK+EbTXgG686UAXWTWdzTrZzAK051tKbrYnqCLXRm63pun707upfcm99P3ZkboZ7dO0wdXT9KrRwfp21ND9PT4AXo4upeu7t5G57pL9O6hrfSdoU56vKNMD/mEehMp63BuwdfXOzN0rSMtTBDCl2EGxf6EXxgfktnP8c/G0PsrqJLnnmyCAi0tVMrl6f8Da/A9REx+aS4AAAAASUVORK5CYII=" alt=""></div>', ox: -17, oy: -15 },
      flame:  { html: '<svg width="118" height="96" viewBox="0 0 215 175"><defs><linearGradient id="ds" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5c6069"/><stop offset="1" stop-color="#17181d"/></linearGradient><linearGradient id="ls" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c9cdd6"/><stop offset="1" stop-color="#5a5e68"/></linearGradient><linearGradient id="gd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe08a"/><stop offset="1" stop-color="#a8741c"/></linearGradient><linearGradient id="wd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b5804a"/><stop offset="1" stop-color="#523313"/></linearGradient><linearGradient id="rd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d95f52"/><stop offset="1" stop-color="#6e1a10"/></linearGradient></defs><g stroke="#0b0c0f" stroke-width="1.5" stroke-linejoin="round"><path class="fcone" d="M4 8C-4 0 8-4 16 2l26 22-30 8C2 34-4 16 4 8z" fill="#ff9f0a" stroke="#c2410c"/><path class="fcone" d="M10 10c-3-4 3-7 8-3l16 14-19 4c-6 1-8-11-5-15z" fill="#ffd60a" stroke="none"/><polygon points="24,22 40,10 58,26 40,40" fill="url(#ls)"/><polygon points="40,40 58,26 110,70 88,86" fill="url(#ds)"/><polygon points="58,26 66,22 116,64 110,70" fill="url(#ls)"/><path d="M88 84 L148 112 L158 148 L104 152 L76 110 Z" fill="url(#ds)"/><rect x="140" y="70" width="30" height="82" rx="14" fill="url(#rd)" transform="rotate(-14 155 111)"/><rect x="168" y="84" width="26" height="74" rx="12" fill="url(#rd)" opacity=".88" transform="rotate(-14 181 121)"/><path d="M150 78 L192 96" stroke="#9a9da6" stroke-width="5"/><path d="M144 116 L188 134" stroke="#9a9da6" stroke-width="5"/><path d="M112 148 q-22 6 -14 26" fill="none" stroke="#3a3c42" stroke-width="6"/></g></svg>', ox: 9, oy: 9 },
      hammer: { html: '<svg width="99" height="102" viewBox="0 0 180 185"><defs><linearGradient id="ds" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5c6069"/><stop offset="1" stop-color="#17181d"/></linearGradient><linearGradient id="ls" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c9cdd6"/><stop offset="1" stop-color="#5a5e68"/></linearGradient><linearGradient id="gd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe08a"/><stop offset="1" stop-color="#a8741c"/></linearGradient><linearGradient id="wd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b5804a"/><stop offset="1" stop-color="#523313"/></linearGradient><linearGradient id="rd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d95f52"/><stop offset="1" stop-color="#6e1a10"/></linearGradient></defs><g stroke="#0b0c0f" stroke-width="1.5" stroke-linejoin="round"><path d="M8 22 L52 4 L86 18 L42 38 Z" fill="url(#ls)"/><path d="M8 22 L42 38 L46 62 L12 46 Z" fill="url(#ds)"/><path d="M42 38 L86 18 L90 40 L46 62 Z" fill="url(#ds)"/><path d="M86 18 L104 30 L108 50 L90 40 Z" fill="url(#ls)" opacity=".8"/><path d="M52 58 L74 48 L150 152 C158 164 152 176 140 180 C128 184 118 178 112 166 Z" fill="url(#wd)"/><path d="M60 62 L70 57 L92 88 L82 93 Z" fill="rgba(255,255,255,.22)" stroke="none"/></g></svg>', ox: 17, oy: 13 },
      nail:   { html: '<svg width="107" height="88" viewBox="0 0 195 160"><defs><linearGradient id="ds" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5c6069"/><stop offset="1" stop-color="#17181d"/></linearGradient><linearGradient id="ls" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c9cdd6"/><stop offset="1" stop-color="#5a5e68"/></linearGradient><linearGradient id="gd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe08a"/><stop offset="1" stop-color="#a8741c"/></linearGradient><linearGradient id="wd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b5804a"/><stop offset="1" stop-color="#523313"/></linearGradient><linearGradient id="rd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d95f52"/><stop offset="1" stop-color="#6e1a10"/></linearGradient></defs><g stroke="#0b0c0f" stroke-width="1.5" stroke-linejoin="round"><polygon points="10,26 26,14 44,28 28,40" fill="url(#ls)"/><path d="M28 40 L44 28 L112 66 L116 92 L74 96 L46 64 Z" fill="#e09a10"/><path d="M44 28 L112 66 L104 74 L38 40 Z" fill="#ffc24d" stroke="none"/><path d="M74 96 L116 92 L128 128 L92 134 Z" fill="url(#ds)"/><path d="M54 70 L110 130 L136 118 L96 74 Z" fill="url(#ls)"/><path d="M98 128 q-12 10 0 22" fill="none" stroke="#8b8f98" stroke-width="4"/></g></svg>', ox: 11, oy: 13 },
      nuke:   { html: '<svg width="61" height="82" viewBox="0 0 110 150"><defs><linearGradient id="ds" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5c6069"/><stop offset="1" stop-color="#17181d"/></linearGradient><linearGradient id="ls" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c9cdd6"/><stop offset="1" stop-color="#5a5e68"/></linearGradient><linearGradient id="gd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe08a"/><stop offset="1" stop-color="#a8741c"/></linearGradient><linearGradient id="wd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b5804a"/><stop offset="1" stop-color="#523313"/></linearGradient><linearGradient id="rd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d95f52"/><stop offset="1" stop-color="#6e1a10"/></linearGradient></defs><g stroke="#0b0c0f" stroke-width="1.5" stroke-linejoin="round"><path d="M52 4c15 0 24 15 24 38H28C28 19 37 4 52 4z" fill="url(#ls)"/><rect x="28" y="40" width="48" height="56" fill="url(#rd)"/><rect x="28" y="52" width="48" height="9" fill="#f0d24c" stroke="none"/><path d="M28 96l-16 34 20-10 20 16 20-16 20 10-16-34z" fill="url(#ds)"/></g><circle cx="52" cy="76" r="12" fill="#f0d24c" stroke="#0b0c0f" stroke-width="1.5"/><path d="M52 76l7-10.6a12.8 12.8 0 0 0-14 0zM52 76l5.7 11.4a12.8 12.8 0 0 0 7-11.4zM52 76l-12.7.3a12.8 12.8 0 0 0 7 11.1z" fill="#0b0c0f"/></svg>', ox: 30, oy: 6 }
    };
    var weapEl = document.createElement('div');
    weapEl.className = 'weap';
    hero.appendChild(weapEl);
    var aimEl = document.createElement('div');
    aimEl.className = 'aim';
    aimEl.innerHTML = '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="7" fill="none" stroke="#ff453a" stroke-width="1.8"/><path d="M12 1v6M12 17v6M1 12h6M17 12h6" stroke="#fff" stroke-width="1.6"/></svg>';
    hero.appendChild(aimEl);
    function setWeapon(w){
      weapon = w;
      weapEl.dataset.w = w;
      weapEl.innerHTML = WEAP[w].html;
    }
    function placeWeap(){
      var r = hero.getBoundingClientRect();
      var W = WEAP[weapon];
      weapEl.style.left = (curX - r.left - W.ox) + 'px';
      weapEl.style.top = (curY - r.top - W.oy) + 'px';
      aimEl.style.left = (curX - r.left - 11) + 'px';
      aimEl.style.top = (curY - r.top - 11) + 'px';
    }
    var weapon = 'gun';
    setWeapon('gun');
    var used = {};
    var dock = document.getElementById('wreckdock');
    var nukeBtn = document.getElementById('nukebtn');
    function unlockCheck(){
      if (used.gun && used.flame && used.hammer && used.nail && nukeBtn.hidden){
        nukeBtn.hidden = false;
      }
    }
    [].forEach.call(dock.querySelectorAll('button'), function(b){
      b.addEventListener('click', function(e){
        e.stopPropagation();
        if (b.dataset.w === 'reset'){ g.clearRect(0, 0, cv.width, cv.height); return; }
        setWeapon(b.dataset.w);
        [].forEach.call(dock.querySelectorAll('button'), function(x){ x.classList.remove('on'); });
        b.classList.add('on');
      });
    });

    /* ── 音效（WebAudio 合成） ── */
    var AC = null;
    function ac(){ if (!AC) AC = new (window.AudioContext || window.webkitAudioContext)(); return AC; }
    /* 真實 AK47 單發實錄（Freesound #163457，CC0） */
    var AK_B64 = 'data:audio/mpeg;base64,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';
    var akBuf = null;
    function loadAk(){
      if (akBuf !== null) return;
      akBuf = false;
      try{
        var b64 = AK_B64.split(',')[1];
        var bin = atob(b64);
        var arr = new Uint8Array(bin.length);
        for (var i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
        ac().decodeAudioData(arr.buffer,
          function(b){ akBuf = b; },
          function(){ akBuf = undefined; });
      }catch(_){ akBuf = undefined; }
    }
    function shot(){
      var a = ac(), t = a.currentTime;
      loadAk();
      if (akBuf && akBuf.duration){
        var src = a.createBufferSource(); src.buffer = akBuf;
        src.playbackRate.value = 0.94 + Math.random() * 0.12;
        var gn = a.createGain(); gn.gain.value = 0.85;
        src.connect(gn); gn.connect(a.destination); src.start(t);
        return;
      }
      /* 備援：合成槍聲 */
      var l2 = a.sampleRate * 0.12;
      var b2 = a.createBuffer(1, l2, a.sampleRate);
      var d2 = b2.getChannelData(0);
      for (var j = 0; j < l2; j++) d2[j] = (Math.random() * 2 - 1) * Math.pow(1 - j / l2, 2.8);
      var s2 = a.createBufferSource(); s2.buffer = b2;
      var f2 = a.createBiquadFilter(); f2.type = 'bandpass'; f2.frequency.value = 820; f2.Q.value = 0.6;
      var g2 = a.createGain(); g2.gain.value = 0.4;
      s2.connect(f2); f2.connect(g2); g2.connect(a.destination); s2.start(t);
      var o = a.createOscillator(), g3 = a.createGain();
      o.type = 'sine'; o.frequency.setValueAtTime(120, t);
      o.frequency.exponentialRampToValueAtTime(46, t + 0.1);
      g3.gain.setValueAtTime(0.42, t); g3.gain.exponentialRampToValueAtTime(0.001, t + 0.13);
      o.connect(g3); g3.connect(a.destination); o.start(t); o.stop(t + 0.15);
    }
    var flameNode = null;
    function flameOn(){
      if (flameNode) return;
      var a = ac();
      var len = a.sampleRate * 0.5;
      var buf = a.createBuffer(1, len, a.sampleRate);
      var d = buf.getChannelData(0);
      for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * 0.7;
      var src = a.createBufferSource(); src.buffer = buf; src.loop = true;
      var f = a.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 600;
      var gn = a.createGain(); gn.gain.value = 0.24;
      src.connect(f); f.connect(gn); gn.connect(a.destination); src.start();
      flameNode = src;
    }
    function flameOff(){ if (flameNode){ try{ flameNode.stop(); }catch(_){} flameNode = null; } }
    function thud(){
      var a = ac(), t = a.currentTime;
      var o = a.createOscillator(), gn = a.createGain();
      o.type = 'sine'; o.frequency.setValueAtTime(110, t);
      o.frequency.exponentialRampToValueAtTime(45, t + 0.22);
      gn.gain.setValueAtTime(0.5, t); gn.gain.exponentialRampToValueAtTime(0.001, t + 0.26);
      o.connect(gn); gn.connect(a.destination); o.start(t); o.stop(t + 0.3);
    }
    function clang(){
      var a = ac(), t = a.currentTime;
      [1250, 2100].forEach(function(fr, i){
        var o = a.createOscillator(), gn = a.createGain();
        o.type = 'square'; o.frequency.value = fr;
        gn.gain.setValueAtTime(0.11 - i * 0.045, t);
        gn.gain.exponentialRampToValueAtTime(0.001, t + 0.11);
        o.connect(gn); gn.connect(a.destination); o.start(t); o.stop(t + 0.13);
      });
    }
    function ding(){
      var a = ac(), t = a.currentTime;
      [2093, 3136].forEach(function(fr, i){
        var o = a.createOscillator(), gn = a.createGain();
        o.type = 'sine'; o.frequency.value = fr;
        gn.gain.setValueAtTime(0.16 - i * 0.06, t);
        gn.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
        o.connect(gn); gn.connect(a.destination); o.start(t); o.stop(t + 0.5);
      });
    }
    function boom(){
      var a = ac(), t = a.currentTime;
      var o = a.createOscillator(), gn = a.createGain();
      o.type = 'sine'; o.frequency.setValueAtTime(70, t);
      o.frequency.exponentialRampToValueAtTime(24, t + 1.2);
      gn.gain.setValueAtTime(0.7, t); gn.gain.exponentialRampToValueAtTime(0.001, t + 1.4);
      o.connect(gn); gn.connect(a.destination); o.start(t); o.stop(t + 1.5);
      var len = a.sampleRate * 1.1;
      var buf = a.createBuffer(1, len, a.sampleRate);
      var d = buf.getChannelData(0);
      for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 1.8) * 0.8;
      var src = a.createBufferSource(); src.buffer = buf;
      var f = a.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 380;
      var gn2 = a.createGain(); gn2.gain.value = 0.5;
      src.connect(f); f.connect(gn2); gn2.connect(a.destination); src.start(t);
    }

    /* ── 彈痕繪製 ── */
    function cracks(x, y, n, len, alpha){
      g.save(); g.translate(x, y);
      g.strokeStyle = 'rgba(255,255,255,' + alpha + ')'; g.lineWidth = 1;
      for (var i = 0; i < n; i++){
        var a0 = Math.random() * Math.PI * 2;
        var l = len * (0.5 + Math.random());
        g.beginPath(); g.moveTo(0, 0);
        var px2 = 0, py2 = 0;
        for (var st = 0; st < 3; st++){
          px2 += Math.cos(a0 + (Math.random() - 0.5) * 0.8) * l / 3;
          py2 += Math.sin(a0 + (Math.random() - 0.5) * 0.8) * l / 3;
          g.lineTo(px2, py2);
        }
        g.stroke();
      }
      g.restore();
    }
    function hole(x, y, r){
      cracks(x, y, 4 + (Math.random() * 3 | 0), r * 4, 0.3);
      var rg = g.createRadialGradient(x, y, r * 0.2, x, y, r * 1.9);
      rg.addColorStop(0, 'rgba(0,0,0,.95)');
      rg.addColorStop(0.45, 'rgba(45,45,50,.85)');
      rg.addColorStop(1, 'rgba(45,45,50,0)');
      g.fillStyle = rg;
      g.beginPath(); g.arc(x, y, r * 1.9, 0, 7); g.fill();
      g.fillStyle = '#000';
      g.beginPath(); g.arc(x, y, r, 0, 7); g.fill();
      g.strokeStyle = 'rgba(255,255,255,.18)'; g.lineWidth = 1.2;
      g.beginPath(); g.arc(x, y, r + 1, -2.4, 0.6); g.stroke();
    }
    function dent(x, y){
      cracks(x, y, 9, 74, 0.38);
      var rg = g.createRadialGradient(x, y, 4, x, y, 46);
      rg.addColorStop(0, 'rgba(15,15,18,.9)');
      rg.addColorStop(0.5, 'rgba(60,60,66,.5)');
      rg.addColorStop(1, 'rgba(60,60,66,0)');
      g.fillStyle = rg;
      g.beginPath(); g.arc(x, y, 46, 0, 7); g.fill();
    }
    function spike(x, y){
      cracks(x, y, 3, 26, 0.3);
      hole(x, y, 3.5);
      g.save(); g.translate(x, y); g.rotate(-0.62 + (Math.random() - 0.5) * 0.4);
      g.strokeStyle = '#c9c9cf'; g.lineWidth = 4; g.lineCap = 'round';
      g.beginPath(); g.moveTo(0, 0); g.lineTo(0, -30); g.stroke();
      g.strokeStyle = 'rgba(255,255,255,.55)'; g.lineWidth = 1.2;
      g.beginPath(); g.moveTo(-1, -4); g.lineTo(-1, -27); g.stroke();
      g.fillStyle = '#dcdce2';
      g.beginPath(); g.ellipse(0, -31, 6.5, 2.6, 0, 0, 7); g.fill();
      g.restore();
    }
    function scorch(x, y){
      for (var i = 0; i < 4; i++){
        var ox = x + (Math.random() - 0.5) * 46, oy = y + (Math.random() - 0.5) * 34;
        var rr = 20 + Math.random() * 22;
        var rg = g.createRadialGradient(ox, oy, 2, ox, oy, rr);
        rg.addColorStop(0, 'rgba(8,6,4,.9)');
        rg.addColorStop(0.55, 'rgba(30,20,10,.55)');
        rg.addColorStop(0.85, 'rgba(120,60,15,.18)');
        rg.addColorStop(1, 'rgba(120,60,15,0)');
        g.fillStyle = rg;
        g.beginPath(); g.arc(ox, oy, rr, 0, 7); g.fill();
      }
      g.strokeStyle = 'rgba(255,140,40,.25)'; g.lineWidth = 1;
      g.beginPath(); g.arc(x, y, 34 + Math.random() * 10, Math.random(), Math.random() + 3); g.stroke();
    }
    function jolt(){
      var st = hero.querySelector('.hero-stage');
      st.classList.remove('jolt'); void st.offsetWidth; st.classList.add('jolt');
    }
    /* 同一區打得夠深 → 打穿，牆後掉出折扣碼 */
    var hitMap = {}, couponShown = false;
    function deepHit(x, y, w){
      if (couponShown) return;
      var key = (x / 110 | 0) + '_' + (y / 110 | 0);
      hitMap[key] = (hitMap[key] || 0) + w;
      if (hitMap[key] >= 8) showCoupon(x, y);
    }
    function showCoupon(x, y){
      couponShown = true;
      /* 打穿的大洞 */
      var rg = g.createRadialGradient(x, y, 6, x, y, 60);
      rg.addColorStop(0, '#000'); rg.addColorStop(0.7, 'rgba(10,10,12,.9)'); rg.addColorStop(1, 'rgba(10,10,12,0)');
      g.fillStyle = rg; g.beginPath(); g.arc(x, y, 60, 0, 7); g.fill();
      cracks(x, y, 12, 120, 0.5);
      try{ boom(); }catch(_){}
      var r = hero.getBoundingClientRect();
      var c = document.createElement('div');
      c.className = 'coupon';
      c.style.left = Math.min(Math.max(x - 125, 12), r.width - 262) + 'px';
      c.style.top = Math.min(Math.max(y - 190, 12), r.height - 220) + 'px';
      c.innerHTML = '<button class="cx" type="button" aria-label="關閉">✕</button>'
        + '<b>打穿了。今天的你，火力全開。</b>'
        + '<div class="code">TITANPRO100</div>'
        + '<small>結帳輸入現折 NT$100（示意碼——正式碼上線前由 Shopify 折扣設定）</small>';
      hero.appendChild(c);
      c.querySelector('.cx').addEventListener('click', function(e){ e.stopPropagation(); c.remove(); });
    }
    function shakeProd(){
      prod.classList.remove('shake'); void prod.offsetWidth; prod.classList.add('shake');
      try{ ding(); }catch(_){}
    }
    function nukeGo(cx, cy){
      var r = hero.getBoundingClientRect();
      var flash = document.createElement('div');
      flash.className = 'nuke-flash';
      flash.style.setProperty('--nx', (cx / r.width * 100).toFixed(1) + '%');
      flash.style.setProperty('--ny', (cy / r.height * 100).toFixed(1) + '%');
      hero.appendChild(flash);
      void flash.offsetWidth; flash.classList.add('go');
      setTimeout(function(){ flash.remove(); }, 1300);
      try{ boom(); }catch(_){}
      hero.classList.remove('megashake'); void hero.offsetWidth; hero.classList.add('megashake');
      /* 全畫面焦土 */
      var R = Math.max(r.width, r.height) * 0.6;
      for (var i = 0; i < 34; i++){
        var a0 = Math.random() * Math.PI * 2, dist = Math.pow(Math.random(), 1.6) * R;
        scorch(cx + Math.cos(a0) * dist, cy + Math.sin(a0) * dist * 0.7);
      }
      cracks(cx, cy, 14, R * 0.8, 0.45);
      for (var w = 1; w <= 3; w++){
        g.strokeStyle = 'rgba(255,180,80,' + (0.3 - w * 0.07) + ')'; g.lineWidth = 2;
        g.beginPath(); g.arc(cx, cy, R * 0.3 * w, 0, 7); g.stroke();
      }
      setTimeout(function(){
        shakeProd();
        var chip = document.createElement('span');
        chip.className = 'prod-chip'; chip.textContent = '還在。';
        prod.appendChild(chip);
        void chip.offsetWidth; chip.classList.add('show');
        setTimeout(function(){ chip.classList.remove('show'); setTimeout(function(){ chip.remove(); }, 500); }, 2400);
      }, 700);
    }

    /* ── 連發控制 ── */
    var firing = null, curX = 0, curY = 0;
    hero.addEventListener('pointermove', function(e){
      curX = e.clientX; curY = e.clientY;
      var over = (e.target.closest && e.target.closest('.wreck-dock')) ? 'none' : 'block';
      weapEl.style.display = over; aimEl.style.display = over;
      placeWeap();
    });
    hero.addEventListener('pointerenter', function(){ weapEl.style.display = 'block'; aimEl.style.display = 'block'; placeWeap(); });
    hero.addEventListener('pointerleave', function(){ weapEl.style.display = 'none'; aimEl.style.display = 'none'; });
    function inProd(){
      var pr = prod.getBoundingClientRect();
      return curX >= pr.left && curX <= pr.right && curY >= pr.top && curY <= pr.bottom;
    }
    function pt(){
      var r = hero.getBoundingClientRect();
      return { x: curX - r.left, y: curY - r.top };
    }
    function stepGunFx(){
      if (inProd()){ shakeProd(); return; }
      var q = pt();
      hole(q.x + (Math.random() - 0.5) * 30, q.y + (Math.random() - 0.5) * 24, 5 + Math.random() * 2);
      spawnSparks(q.x, q.y);
      deepHit(q.x, q.y, 1);
      try{ shot(); }catch(_){} jolt();
    }
    var fireInt = 100;
    function gunCycle(){
      var wrap = weapEl.querySelector('.akwrap');
      var fl = weapEl.querySelector('.akflash');
      var still = Math.max(12, fireInt * 0.22);
      var hold = Math.max(20, fireInt * 0.34);
      var back = Math.max(30, fireInt * 0.44);
      setTimeout(function(){
        if (wrap){
          wrap.style.transition = 'transform ' + hold + 'ms ease-out';
          wrap.style.transform = 'translate(6px,9px) rotate(-2.5deg)';
        }
        if (fl) fl.style.opacity = 1;
        stepGunFx();
        setTimeout(function(){
          if (fl) fl.style.opacity = 0;
          if (wrap){
            wrap.style.transition = 'transform ' + back + 'ms cubic-bezier(.2,.6,.3,1)';
            wrap.style.transform = 'none';
          }
        }, hold);
      }, still);
    }
    var rateEl = document.getElementById('rateslider');
    if (rateEl){
      rateEl.addEventListener('input', function(){
        fireInt = 280 - (+rateEl.value);
        if (firing && weapon === 'gun'){
          clearInterval(firing);
          firing = setInterval(gunCycle, fireInt);
        }
      });
      ['pointerdown','click'].forEach(function(ev){
        rateEl.addEventListener(ev, function(e){ e.stopPropagation(); });
      });
    }
    function stepFlame(){
      if (inProd()){ shakeProd(); return; }
      var q = pt(); scorch(q.x, q.y);
      deepHit(q.x, q.y, 1);
      var dur = 1500 + Math.random() * 500;
      patches.push({ x: q.x, y: q.y, until: performance.now() + dur, dur: dur });
      fxStart();
    }
    function stepNail(){
      if (inProd()){ shakeProd(); return; }
      var q = pt(); spike(q.x + (Math.random() - 0.5) * 14, q.y + (Math.random() - 0.5) * 10);
      deepHit(q.x, q.y, 1);
      try{ clang(); }catch(_){}
    }
    function kick(){
      weapEl.classList.remove('kick'); void weapEl.offsetWidth; weapEl.classList.add('kick');
    }
    function stopFire(){
      if (firing){ clearInterval(firing); firing = null; }
      flameFiring = false;
      weapEl.classList.remove('firing');
      flameOff();
    }
    addEventListener('pointerup', stopFire);
    addEventListener('pointercancel', stopFire);
    hero.addEventListener('pointerleave', stopFire);

    hero.addEventListener('pointerdown', function(e){
      var el = e.target;
      if (el.closest && el.closest('.wreck-dock')) return;
      curX = e.clientX; curY = e.clientY;
      if (el.closest && el.closest('#heroprod')){ shakeProd(); used[weapon] = true; unlockCheck(); return; }
      if (el.closest && el.closest('a,button')) return;
      used[weapon] = true;
      try{
        if (weapon === 'gun'){ gunCycle(); stopFire(); firing = setInterval(gunCycle, fireInt); }
        else if (weapon === 'flame'){ try{ flameOn(); }catch(_){} flameFiring = true; weapEl.classList.add('firing'); fxStart(); stepFlame(); stopFire2(); }
        else if (weapon === 'nail'){ kick(); stepNail(); stopFire(); firing = setInterval(function(){ kick(); stepNail(); }, 180); }
        else if (weapon === 'hammer'){
          weapEl.classList.remove('swing'); void weapEl.offsetWidth; weapEl.classList.add('swing');
          setTimeout(function(){ var q = pt(); if (inProd()){ shakeProd(); } else { dent(q.x, q.y); deepHit(q.x, q.y, 3); thud(); jolt(); } }, 130);
        }
        else if (weapon === 'nuke'){ var q2 = pt(); nukeGo(q2.x, q2.y); }
      }catch(_){}
      unlockCheck();
      function stopFire2(){ if (firing) clearInterval(firing); firing = setInterval(stepFlame, 60); }
    });
  })();

})();

;

(function(){
  var b = document.getElementById('cmptoggle');
  if (!b) return;
  var panel = b.closest('.wrap').querySelector('.mac-panel') || document.querySelector('.mac-panel');
  b.addEventListener('click', function(){
    var open = b.getAttribute('aria-expanded') === 'true';
    b.setAttribute('aria-expanded', String(!open));
    panel.classList.toggle('open', !open);
    b.childNodes[1].textContent = open ? '展開三款比較' : '收合比較';
  });
})();

  /* hero 形象影片燈箱（YouTube 嵌入：點開才載入、關閉即停） */
  (function(){
    var chip = document.getElementById('filmchip');
    var modal = document.getElementById('filmmodal');
    var frame = document.getElementById('filmframe');
    var closeBtn = document.getElementById('filmclose');
    var label = document.getElementById('filmchip-label');
    if (!chip || !modal || !frame) return;
    function open(){
      modal.hidden = false;
      requestAnimationFrame(function(){ modal.classList.add('on'); });
      document.documentElement.style.overflow = 'hidden';
      frame.src = frame.dataset.embed + '?autoplay=1&playsinline=1&rel=0';
    }
    function close(){
      frame.src = '';
      modal.classList.remove('on');
      document.documentElement.style.overflow = '';
      setTimeout(function(){ modal.hidden = true; }, 300);
    }
    chip.addEventListener('click', open);
    [].forEach.call(document.querySelectorAll('.film-open'), function(b){ b.addEventListener('click', open); });
    closeBtn.addEventListener('click', close);
    modal.addEventListener('click', function(e){ if (e.target === modal) close(); });
    document.addEventListener('keydown', function(e){ if (e.key === 'Escape' && !modal.hidden) close(); });
  })();

  /* 介紹影片鈕：hero 釘住、按鈕原地長大到滿版 */
  (function(){
    var pin = document.getElementById('heropin');
    var hero = document.getElementById('hero');
    var chip = document.getElementById('filmchip');
    var fgm = document.getElementById('fgm');
    var vid = document.getElementById('fgm-video');
    var pill = fgm ? fgm.querySelector('.fgm-full') : null;
    if (!pin || !hero || !chip || !fgm || !vid) return;
    var loaded = false;
    function clamp(n, a, b){ return Math.max(a, Math.min(b, n)); }
    function lerp(a, b, t){ return a + (b - a) * t; }
    var ticking = false;
    function render(){
      ticking = false;
      var r = pin.getBoundingClientRect();
      var vh = window.innerHeight, vw = window.innerWidth;
      var travel = Math.max(1, r.height - hero.offsetHeight);
      var p = clamp(-r.top / travel, 0, 1);
      if (p <= .005){
        fgm.hidden = true;
        if (!vid.paused) vid.pause();
        return;
      }
      var e = p < .5 ? 2*p*p : 1 - Math.pow(-2*p + 2, 2) / 2;
      var hr = hero.getBoundingClientRect();
      var cr = chip.getBoundingClientRect();
      var x0 = cr.left - hr.left, y0 = cr.top - hr.top;
      fgm.hidden = false;
      if (!loaded){ loaded = true; vid.src = vid.dataset.src; vid.load(); }
      if (vid.paused) vid.play().catch(function(){});
      /* 往下長：上緣最後才動，先向下與兩側擴張 */
      var eTop = Math.pow(p, 2.2);
      var top = lerp(y0, -hr.top, eTop);
      var h = Math.min(lerp(cr.height, vh, e), vh - (hr.top + top));
      fgm.style.left = lerp(x0, 0, e) + 'px';
      fgm.style.top = top + 'px';
      fgm.style.width = lerp(cr.width, vw, e) + 'px';
      fgm.style.height = h + 'px';
      fgm.style.borderRadius = lerp(7, 0, e) + 'px';
      if (pill){
        /* 釘在影片本體的下緣上方：影片離場時跟著一起走，不蓋到下面的內容 */
        var base = vw <= 760 ? 58 : 30;
        /* 影片「看得見」的下緣＝本體下緣與 hero 裁切邊緣取小者 */
        var vb = Math.min(hr.top + top + h, hr.bottom);
        pill.style.bottom = (vh - Math.min(vb, vh) + base) + 'px';
        var exitFade = clamp((vb - 60) / 140, 0, 1);
        var po = clamp((p - .35) / .18, 0, 1) * exitFade;
        pill.style.opacity = po;
        pill.style.pointerEvents = po > .5 ? 'auto' : 'none';
        fgm.style.pointerEvents = 'none';
      }
    }
    function onScroll(){ if (!ticking){ ticking = true; requestAnimationFrame(render); } }
    addEventListener('scroll', onScroll, { passive:true });
    addEventListener('resize', onScroll);
    render();
  })();


  /* 評價區：一則評論都沒有時整段收起，評論進來就自動出現 */
  (function(){
    var sec = document.querySelector('.tsp-rev');
    if (!sec) return;
    function check(){
      var has = sec.querySelectorAll('.jdgm-rev').length > 0;
      sec.style.display = has ? '' : 'none';
    }
    setTimeout(check, 6000);
    setTimeout(check, 15000);
    if ('MutationObserver' in window){
      new MutationObserver(function(){ 
        if (sec.querySelectorAll('.jdgm-rev').length > 0) sec.style.display = '';
      }).observe(sec, { childList:true, subtree:true });
    }
  })();

  /* 警鈴試聽膠囊：跟產品同一個觸發 */
  (function(){
    var pill = document.getElementById('alarmtry');
    var abtn2 = document.getElementById('alarmbtn');
    if (pill && abtn2) pill.addEventListener('click', function(){ abtn2.click(); });
  })();

})();
