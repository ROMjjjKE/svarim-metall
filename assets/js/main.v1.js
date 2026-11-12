
(function(){
  'use strict';
  var burger=document.getElementById('burger'), drawer=document.getElementById('drawer'), closeBtn=document.getElementById('drawerClose');
  function openD(){ if(!drawer) return; drawer.hidden=false; drawer.setAttribute('data-open','true'); document.body.classList.add('is-locked');
    if(burger) burger.setAttribute('aria-expanded','true'); if(closeBtn) closeBtn.focus(); }
  function closeD(){ if(!drawer) return; drawer.setAttribute('data-open','false'); drawer.hidden=true; document.body.classList.remove('is-locked');
    if(burger){ burger.setAttribute('aria-expanded','false'); burger.focus(); } }
  if(burger) burger.addEventListener('click', openD);
  if(closeBtn) closeBtn.addEventListener('click', closeD);
  if(drawer){ drawer.addEventListener('click', function(e){ if(e.target===drawer) closeD(); });
    drawer.addEventListener('keydown', function(e){ if(e.key!=='Tab') return;
      var f=drawer.querySelectorAll('a[href],button'); if(!f.length) return;
      var first=f[0], last=f[f.length-1];
      if(e.shiftKey && document.activeElement===first){ e.preventDefault(); last.focus(); }
      else if(!e.shiftKey && document.activeElement===last){ e.preventDefault(); first.focus(); } }); }
  document.addEventListener('keydown', function(e){ if(e.key==='Escape' && drawer && drawer.getAttribute('data-open')==='true') closeD(); });
  window.addEventListener('resize', function(){ if(window.innerWidth>1180 && drawer && drawer.getAttribute('data-open')==='true') closeD(); });

  // камера: влезает ли деталь
  var CH=[1230,900,660];
  function fit(){
    var a=['c-l','c-w','c-h'].map(function(id){ var el=document.getElementById(id); return el?parseInt(el.value,10):NaN; });
    var out=document.getElementById('c-out'); if(!out) return;
    if(a.some(function(v){ return !v || v<1; })){ out.innerHTML='<b>—</b><p>Укажите три размера детали в миллиметрах.</p>'; return; }
    var p=a.slice().sort(function(x,y){return y-x;}), c=CH.slice().sort(function(x,y){return y-x;});
    var ok=p.every(function(v,i){ return v<=c[i]; });
    var maxDiff=Math.min.apply(null,p.map(function(v,i){ return c[i]-v; }));
    var msg;
    if(ok){ msg='<b class="ok">Влезает</b><p>Габарит по самой тесной оси проходит с запасом '+maxDiff+' мм. Камера: '+CH.join(' × ')+' мм (Д×Г×В). Привозите или присылайте фото — уточним способ обработки.</p>'; }
    else { msg='<b class="no">Не влезает в камеру</b><p>Рабочая зона '+CH.join(' × ')+' мм (Д×Г×В). Если деталь больше — напишите, обсудим варианты: разборка на части, обработка по месту или отказ без оплаты.</p>'; }
    out.innerHTML=msg;
  }
  ['c-l','c-w','c-h'].forEach(function(id){ var el=document.getElementById(id); if(el){ el.addEventListener('input', fit); } });
  if(document.getElementById('c-out')) fit();

  // что чистим
  var pd=document.getElementById('parts-data');
  if(pd){
    var data=JSON.parse(pd.textContent);
    var title=document.getElementById('p-title'), body=document.getElementById('p-body'), note=document.getElementById('p-note');
    function pick(k){
      var it=data[k]; if(!it) return;
      data.__keys.forEach(function(kk){ var b=document.querySelector('.chip[data-p="'+kk+'"]'); if(b) b.setAttribute('aria-pressed', kk===k?'true':'false'); });
      if(title) title.textContent=it.t;
      if(body) body.innerHTML=it.b;
      if(note) note.textContent=it.n;
    }
    data.__keys=data.__keys||[];
    Array.prototype.forEach.call(document.querySelectorAll('.chip[data-p]'), function(b){
      b.addEventListener('click', function(){ pick(b.getAttribute('data-p')); });
    });
    pick(data.__keys[0]);
  }

  // заявка
  var form=document.getElementById('leadForm');
  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var g=function(id){ var el=document.getElementById(id); return el?el.value.trim():''; };
      var NL=String.fromCharCode(10);
      var lines=['Заявка на дробеструйную обработку',
        'Имя: '+(g('f-name')||'—'),
        'Связь: '+(g('f-contact')||'—'),
        'Деталь: '+(g('f-part')||'—'),
        'Задача: '+(g('f-task')||'—'),
        'Комментарий: '+(g('f-note')||'—')];
      var txt=lines.join(NL);
      var out=document.getElementById('formout');
      if(out){ out.hidden=false; out.textContent=txt; }
      window.open('https://wa.me/375445427077?text='+encodeURIComponent(txt),'_blank','noopener');
    });
  }
})();
