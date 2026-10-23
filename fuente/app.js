(function(){
  'use strict';
  var T = 3300;
  var QUIETO = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function(id){ return document.getElementById(id); };
  var fmt = function(n){ return (n < 0 ? '−' : '') + '$ ' + Math.round(Math.abs(n)).toLocaleString('es-CO'); };
  var dec = function(n, d){ return n.toLocaleString('es-CO', {minimumFractionDigits:d, maximumFractionDigits:d}); };
  var ent = function(n){ return Math.round(n).toLocaleString('es-CO'); };
  function fmtM(n){
    if (Math.abs(n) < 5e4) return '$ 0';
    var a = Math.abs(n) / 1e6, s = a >= 100 ? ent(a) : a >= 10 ? dec(a, 0) : dec(a, 1);
    return (n < 0 ? '−' : '') + '$ ' + s + ' M';
  }
  var SVGNS = 'http://www.w3.org/2000/svg';
  function anim(el, frames, o){
    if (QUIETO || !el || !el.animate) return null;
    o = o || {};
    return el.animate(frames, {duration:o.d || 600, delay:o.delay || 0, easing:o.e || 'cubic-bezier(.2,.7,.1,1)', fill:o.fill || 'backwards'});
  }
  function alVer(el, fn, umbral){
    if (!el) return;
    if (!('IntersectionObserver' in window)){ fn(); return; }
    var io = new IntersectionObserver(function(es){
      es.forEach(function(e){ if (e.isIntersecting){ io.disconnect(); fn(); } });
    }, {threshold: umbral || 0.25});
    io.observe(el);
  }
  function icono(id, cls){ return '<svg class="ico' + (cls ? ' ' + cls : '') + '" aria-hidden="true"><use href="#' + id + '"/></svg>'; }
  function rotulo(t){ return '<span class="rot" aria-hidden="true">' + t + '</span>'; }
  function glifo(g){ return g.indexOf('ico-') === 0 ? icono(g) : rotulo(g); }

  /* ================= Odómetro ================= */
  function odoPreparar(el){
    var txt = el.textContent, html = '<span class="sr">' + txt + '</span><span class="odo" aria-hidden="true">';
    for (var i = 0; i < txt.length; i++){
      var c = txt[i];
      if (c >= '0' && c <= '9'){
        var tira = '';
        for (var k = 0; k < 20; k++) tira += '<i>' + (k % 10) + '</i>';
        html += '<span class="col"><span class="tira" data-d="' + c + '" style="transform:translateY(-' + (10 + +c) + 'em)">' + tira + '</span></span>';
      } else html += '<span>' + (c === ' ' ? '&nbsp;' : c) + '</span>';
    }
    el.innerHTML = html + '</span>';
  }
  function odoCorrer(el, retraso){
    [].forEach.call(el.querySelectorAll('.tira'), function(t, i){
      var d = +t.dataset.d;
      anim(t, [{transform:'translateY(0em)'}, {transform:'translateY(-' + (10 + d) + 'em)'}], {d:1100 + i * 90, delay:(retraso || 0) + i * 40, e:'cubic-bezier(.15,.75,.2,1)'});
    });
  }
  [].forEach.call(document.querySelectorAll('[data-odo]'), function(el){
    odoPreparar(el);
    alVer(el, function(){ odoCorrer(el, 0); }, 0.5);
  });

  /* ================= Portada: titular a golpes ================= */
  [].forEach.call(document.querySelectorAll('#titular .linea'), function(l, li){
    var ps = l.textContent.split(' ');
    l.innerHTML = ps.map(function(p){ return '<span class="pal">' + p + '</span>'; }).join(' ');
    [].forEach.call(l.querySelectorAll('.pal'), function(p, pi){
      anim(p, [{transform:'translateY(110%)'}, {transform:'translateY(0)'}], {d:640, delay:120 + li * 250 + pi * 125, e:'cubic-bezier(.3,1.25,.5,1)'});
    });
  });

  /* ================= Ranura de servicios ================= */
  var SERV = [
    ['Parqueadero','V1 · Lanzamiento'],['Lavado','V1 · Lanzamiento'],['Taller','V1 · Lanzamiento'],['Mi garaje','V1 · Lanzamiento'],
    ['Vehículos DRS','V1 · Lanzamiento'],['Trámites','V1 · Lanzamiento'],['SOAT','V2 · Retención'],['Tecnomecánica','V2 · Retención'],
    ['Informe vehicular','V2 · Retención'],['Puntos','V2 · Retención'],['Financiación','V3 · Financiero'],['Seguros','V3 · Financiero'],
    ['Clasificados','V4 · Plataforma'],['Repuestos','V4 · Plataforma'],['Compraventa','V4 · Plataforma']
  ];
  var carrete = $('carrete'), N = SERV.length, rIdx = N, rTimer = null, rVisible = true;
  carrete.innerHTML = [0,1,2].map(function(){ return SERV.map(function(s){ return '<span>' + s[0] + '</span>'; }).join(''); }).join('');
  var filas = carrete.children;
  function altoFila(){ return filas[0].getBoundingClientRect().height || 76; }
  function ranuraIr(i, dur, ease){
    rIdx = i;
    var y = -(i - 1) * altoFila();
    [].forEach.call(filas, function(f, j){ f.classList.toggle('activo', j === i); });
    var s = SERV[i % N];
    $('ranuraFase').textContent = s[1];
    $('ranuraN').textContent = String(i % N + 1).padStart(2, '0') + ' / ' + N;
    if (QUIETO || !dur){ carrete.style.transform = 'translateY(' + y + 'px)'; return; }
    var desde = getComputedStyle(carrete).transform;
    carrete.style.transform = 'translateY(' + y + 'px)';
    carrete.animate([{transform: desde === 'none' ? 'translateY(0)' : desde}, {transform:'translateY(' + y + 'px)'}], {duration:dur, easing:ease || 'cubic-bezier(.5,0,.2,1)'});
  }
  function ranuraPaso(){
    if (!rVisible || document.hidden) return;
    var sig = rIdx + 1;
    if (sig >= 2 * N){ ranuraIr(sig - N - 1, 0); sig = rIdx + 1; }
    ranuraIr(sig, 520);
  }
  ranuraIr(0, 0);
  if (QUIETO) ranuraIr(N, 0);
  else {
    setTimeout(function(){ ranuraIr(N, 2300, 'cubic-bezier(.12,.6,.18,1)'); }, 350);
    setTimeout(function(){ rTimer = setInterval(ranuraPaso, 2200); }, 2900);
    if ('IntersectionObserver' in window) new IntersectionObserver(function(es){ rVisible = es[0].isIntersecting; }).observe(carrete.parentNode);
  }
  window.addEventListener('resize', function(){ ranuraIr(rIdx, 0); });

  /* ================= Entradas al hacer scroll ================= */
  [].forEach.call(document.querySelectorAll('[data-cota]'), function(h){
    h.style.position = 'relative';
    var l = document.createElement('i'); l.className = 'cota-l'; l.setAttribute('aria-hidden', 'true'); h.appendChild(l);
    alVer(h, function(){
      anim(h, [{clipPath:'inset(-10% 100% -10% 0)'}, {clipPath:'inset(-10% 0 -10% 0)'}], {d:700, e:'cubic-bezier(.6,0,.2,1)'});
      anim(l, [{transform:'scaleX(0)', opacity:1}, {transform:'scaleX(1)', opacity:1, offset:.7}, {transform:'scaleX(1)', opacity:0}], {d:950, e:'cubic-bezier(.6,0,.2,1)', fill:'none'});
    }, 0.4);
  });
  var grupos = new Map();
  [].forEach.call(document.querySelectorAll('[data-sube]'), function(el){
    var p = el.parentNode; if (!grupos.has(p)) grupos.set(p, []); grupos.get(p).push(el);
  });
  grupos.forEach(function(els, p){
    alVer(p, function(){ els.forEach(function(el, i){ anim(el, [{transform:'translateY(24px)', opacity:0}, {transform:'translateY(0)', opacity:1}], {d:650, delay:i * 90}); }); }, 0.2);
  });
  [].forEach.call(document.querySelectorAll('[data-flap]'), function(f){ alVer(f, function(){ f.classList.add('abre'); }, 0.9); });

  /* Problema: tachado */
  var probs = [].slice.call(document.querySelectorAll('#problemas .prob'));
  alVer($('problemas'), function(){
    probs.forEach(function(p, i){
      setTimeout(function(){
        p.classList.add('tachado');
        anim(p.querySelector('.tacha'), [{transform:'scaleX(0)'}, {transform:'scaleX(1)'}], {d:420, e:'cubic-bezier(.7,0,.3,1)'});
      }, QUIETO ? 0 : 500 + i * 380);
    });
    setTimeout(function(){ anim($('resuelve'), [{transform:'translateY(60%)', opacity:0}, {transform:'translateY(0)', opacity:1}], {d:620, e:'cubic-bezier(.3,1.3,.5,1)'}); }, QUIETO ? 0 : 500 + probs.length * 380);
  }, 0.5);

  /* ================= Ecosistema en órbita ================= */
  var FASEN = {V1:'Lanzamiento', V2:'Retención', V3:'Financiero', V4:'Plataforma'};
  var ECO = [
    {n:'Parqueaderos', g:'ico-ubicacion', f:'V1', a:-90, hace:'Mapa de parqueaderos con precio y promoción en hora valle; reserva y pago en la app.', paga:'Usuario: el servicio. Parqueadero: mensualidad + comisión.', mas:['Servicio ancla: ≈ 15 usos al mes por usuario frecuente (supuesto).','V1: confirmación manual desde el panel; integración con talanqueras después.']},
    {n:'Lavado y detallado', g:'ico-detailing', f:'V1', a:-30, hace:'Selección de lavadero, servicio y hora; pago en la app.', paga:'Usuario: el servicio. Lavadero: mensualidad + comisión.', mas:['Promociones en horas valle.']},
    {n:'Taller y mantenimiento', g:'ico-taller', f:'V1', a:30, hace:'Cita o cotización en talleres aliados; registro de mantenimientos.', paga:'Usuario: el servicio. Taller: mensualidad + comisión.', mas:['Historial de mantenimiento en Mi garaje.']},
    {n:'Mi garaje', g:'ico-alerta', f:'V1', a:90, hace:'Registro por placa; alertas de SOAT, tecnomecánica, pico y placa, multas y cambio de aceite.', paga:'Gratis (versión básica). Motor de retención.', mas:['Desde V2, la alerta enlaza la renovación con aliados.']},
    {n:'Vehículos DRS', g:'ico-consignacion', f:'V1', a:150, hace:'Catálogo de vehículos en consignación de DRS.', paga:'DRS Motors (sociedad de hecho). Reparto con la S.A.S. por definir.', mas:['V1: solo inventario DRS. Clasificados abiertos en V4.']},
    {n:'Trámites DRS', g:'ico-traspaso', f:'V1', a:210, hace:'Cotización y solicitud de traspasos y levantamientos de prenda.', paga:'Honorarios de DRS Motors. Reparto por definir.', mas:['Solo Bogotá. La actualización en el RUNT la hace el titular.']},
    {n:'SOAT y tecnomecánica', g:'ico-certificado', f:'V2', a:-60, hace:'Renovación desde la alerta de vencimiento con agencia aliada o CDA.', paga:'Agencia de seguros o CDA: comisión por referido.', mas:['Requiere agencia habilitada y CDA firmados (H2).']},
    {n:'Informe vehicular', g:'ico-runt', f:'V2', a:60, hace:'Reporte de cualquier placa: propietarios anteriores, prendas, multas, papeles.', paga:'Usuario. Contenido digital: comisión de tiendas 15–30 %.', mas:['Sin datos personales de terceros.']},
    {n:'Puntos y fidelización', g:'PTS', f:'V2', a:180, hace:'Puntos por reserva, canjeables en comercios aliados.', paga:'Comercios financian los descuentos.', mas:['Sale en H2.']},
    {n:'Financiación', g:'FIN', f:'V3', a:-30, hace:'Solicitud de crédito vehicular con bancos aliados.', paga:'Banco: comisión por crédito desembolsado.', mas:['Primer aliado financiero: H3.']},
    {n:'Seguros', g:'SEG', f:'V3', a:90, hace:'Cotización y contratación de pólizas todo riesgo.', paga:'Aseguradora o agencia: comisión por póliza.', mas:['Vía agencia habilitada.']},
    {n:'Publicidad', g:'PUB', f:'V3', a:210, hace:'Pantalla de entrada patrocinada y anuncios de marcas del sector.', paga:'Marcas, concesionarios, comercios.', mas:['Requiere base activa (H3).']},
    {n:'Clasificados', g:'ico-precio', f:'V4', a:-120, hace:'Publicación de vehículos en venta por cualquier usuario.', paga:'Publicación básica gratis; destacados y planes pagos.', mas:['Posiciones pagas para concesionarios.']},
    {n:'Repuestos', g:'ico-carrito', f:'V4', a:15, hace:'Compra de repuestos y accesorios a vendedores aliados.', paga:'Vendedor: comisión por venta.', mas:['Entrega en el taller de la cita.']},
    {n:'Compraventa protegida', g:'ico-verificado', f:'V4', a:135, hace:'Pago en custodia, traspaso y liberación de fondos al cierre.', paga:'Tarifa por transacción + honorarios de traspaso.', mas:['Fiducia o custodia regulada.']}
  ];
  var RADIO = {V1:122, V2:184, V3:240, V4:292}, C0 = 300, orb = $('orbita'), ecoSel = 0;
  (function(){
    var h = '';
    ['V4','V3','V2','V1'].forEach(function(v){
      var r = RADIO[v];
      h += '<circle class="anillo ' + v.toLowerCase() + '" cx="300" cy="300" r="' + r + '" pathLength="1000"' + (v === 'V1' ? '' : ' stroke-dasharray="3 5"') + '/>';
    });
    h += '<g class="barrido-g"><line class="barrido" x1="300" y1="300" x2="300" y2="-6"/></g>';
    h += '<circle class="centro" cx="300" cy="300" r="64"/><text class="centro-t" x="300" y="294" text-anchor="middle">TU</text><text class="centro-t" x="300" y="322" text-anchor="middle">VEHÍCULO</text>';
    ['V1','V2','V3','V4'].forEach(function(v){
      var r = RADIO[v];
      h += '<g aria-hidden="true"><rect x="' + (300 + r - 15) + '" y="291" width="30" height="18" fill="var(--sup-1)"/><text class="rot-et" x="' + (300 + r) + '" y="304" text-anchor="middle" style="fill:var(--f' + v[1] + ')">' + v + '</text></g>';
    });
    ECO.forEach(function(s, i){
      var r = RADIO[s.f], a = s.a * Math.PI / 180, x = C0 + r * Math.cos(a), y = C0 + r * Math.sin(a);
      s.x = x; s.y = y;
      var dentro = s.g.indexOf('ico-') === 0
        ? '<svg x="' + (x - 12) + '" y="' + (y - 12) + '" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="butt" stroke-linejoin="miter"><use href="#' + s.g + '"/></svg>'
        : '<text x="' + x + '" y="' + (y + 4) + '" text-anchor="middle">' + s.g + '</text>';
      h += '<g class="nodo" data-f="' + s.f + '" data-i="' + i + '" role="button" tabindex="0" aria-pressed="false" aria-label="' + s.n + ', fase ' + s.f + '"><circle cx="' + x + '" cy="' + y + '" r="24"/>' + dentro + '</g>';
    });
    orb.innerHTML = h;
  })();
  var nodos = [].slice.call(orb.querySelectorAll('.nodo'));
  function verEco(i, animar){
    ecoSel = (i + ECO.length) % ECO.length;
    var s = ECO[ecoSel];
    nodos.forEach(function(n, j){ n.setAttribute('aria-pressed', j === ecoSel ? 'true' : 'false'); });
    var det = $('ecoDet');
    det.innerHTML = '<p class="etq" style="color:var(--f' + s.f[1] + ')">Fase ' + s.f + ' · ' + FASEN[s.f] + '</p><p class="nombre">' + s.n + '</p>' +
      '<dl><dt class="etq suave">Qué hace el usuario</dt><dd>' + s.hace + '</dd><dt class="etq suave">Quién paga</dt><dd>' + s.paga + '</dd></dl>' +
      '<ul>' + s.mas.map(function(m){ return '<li>' + m + '</li>'; }).join('') + '</ul>' +
      '<div class="eco-nav"><button type="button" id="ecoAnt">Anterior</button><button type="button" id="ecoSig">Siguiente</button><span class="etq suave" style="align-self:center;margin-left:auto">' + String(ecoSel + 1).padStart(2, '0') + ' / ' + ECO.length + '</span></div>';
    $('ecoAnt').onclick = function(){ verEco(ecoSel - 1, true); };
    $('ecoSig').onclick = function(){ verEco(ecoSel + 1, true); };
    if (animar) anim(det, [{opacity:0, transform:'translateX(15px)'}, {opacity:1, transform:'translateX(0)'}], {d:320});
  }
  nodos.forEach(function(n){
    var i = +n.dataset.i;
    n.addEventListener('click', function(){ verEco(i, true); });
    n.addEventListener('keydown', function(e){ if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); verEco(i, true); } });
  });
  verEco(0, false);
  (function(){
    var g = orb.querySelector('.barrido-g');
    g.style.transformOrigin = '300px 300px'; g.style.transformBox = 'view-box';
    if (!QUIETO && g.animate) g.animate([{transform:'rotate(0deg)'}, {transform:'rotate(360deg)'}], {duration:16000, iterations:Infinity});
    alVer(orb, function(){
      [].forEach.call(orb.querySelectorAll('.anillo'), function(c, i){
        anim(c, [{strokeDashoffset:1000, strokeDasharray:'1000 1000'}, {strokeDashoffset:0, strokeDasharray:'1000 1000'}], {d:1100, delay:(3 - i) * 160, e:'cubic-bezier(.5,0,.2,1)', fill:'none'});
      });
      nodos.forEach(function(n, j){
        var c = n.querySelector('circle');
        n.style.transformOrigin = ECO[j].x + 'px ' + ECO[j].y + 'px'; n.style.transformBox = 'view-box';
        anim(n, [{transform:'scale(0)', opacity:0}, {transform:'scale(1)', opacity:1}], {d:520, delay:300 + ['V1','V2','V3','V4'].indexOf(ECO[j].f) * 220 + j * 30, e:'cubic-bezier(.3,1.4,.5,1)'});
      });
    }, 0.3);
  })();

  /* ================= Mercado: anillo ================= */
  (function(){
    var svg = $('anilloM'), r = 80, C = 2 * Math.PI * r, segs = [[63, 'var(--ser-2)'], [36, 'var(--ser-4)'], [1, 'var(--n-3)']], acc = 0, h = '';
    h += '<circle cx="100" cy="100" r="' + r + '" fill="none" stroke="var(--sup-3)" stroke-width="18"/>';
    segs.forEach(function(s){
      var len = C * s[0] / 100 - 2;
      h += '<circle class="seg-m" cx="100" cy="100" r="' + r + '" fill="none" stroke="' + s[1] + '" stroke-width="18" stroke-dasharray="' + len + ' ' + (C - len) + '" stroke-dashoffset="' + (-C * acc / 100) + '" transform="rotate(-90 100 100)" data-len="' + len + '"/>';
      acc += s[0];
    });
    svg.innerHTML = h;
    alVer(svg, function(){
      [].forEach.call(svg.querySelectorAll('.seg-m'), function(c, i){
        var len = +c.dataset.len;
        anim(c, [{strokeDasharray:'0 ' + C}, {strokeDasharray:len + ' ' + (C - len)}], {d:900, delay:i * 650, e:'cubic-bezier(.5,0,.2,1)'});
      });
    }, 0.4);
  })();


  /* ================= Mercado potencial ================= */
  var GEO = [
    {g:1, n:'F1 · Zonas iniciales de Bogotá', car:240e3, moto:43e3},
    {g:2, n:'F2 · Bogotá', car:860e3, moto:525e3},
    {g:3, n:'F3 · Áreas metropolitanas', car:2.4e6, moto:3.4e6},
    {g:4, n:'F4 · Colombia', car:4.1e6, moto:5.0e6}
  ];
  /* Líneas de servicio: gasto o valor transado por dueño y año en Bogotá (carro, moto), factor fuera de Bogotá,
     tarifa de la plataforma y parte del gasto de un usuario activo que pasa por la app (arriba-abajo). Todo (E) salvo fuente. */
  var SV = [
    {gr:'Servicios al vehículo', c:'var(--ser-1)', l:[
      {n:'Parqueaderos', f:'V1', car:1200000, moto:240000, fu:.5, t:.08, cap:.30, b:'Carro $ 1,2 M · moto $ 240 mil al año (E). Tope 2026: $ 230/min carro, $ 161/min moto'},
      {n:'Lavado', f:'V1', car:300000, moto:60000, t:.10, cap:.30, b:'Carro $ 300 mil · moto $ 60 mil al año (E)'},
      {n:'Talleres y mantenimiento', f:'V1', car:1500000, moto:500000, t:.10, cap:.15, b:'Carro $ 1,5 M · moto $ 500 mil al año (E). Posventa total: $ 26,3 billones (Asopartes)'},
      {n:'Revisión técnico-mecánica', f:'V2', car:250000, moto:130000, t:.05, cap:.30, b:'Tarifa 2026: carro $ 317–368 mil, moto $ 218–247 mil; 56 % de evasión. Cargo fijo ≈ $ 15.000 por cita'},
      {n:'Peritajes', f:'V2', car:17700, moto:8820, t:.18, cap:.30, b:'30 % de los traspasos (E) × $ 250 mil carro, $ 180 mil moto'}]},
    {gr:'Seguros y crédito', c:'var(--pos)', l:[
      {n:'SOAT', f:'V2', car:700000, moto:150000, t:.03, cap:.30, b:'Primas 2025: $ 4,13 billones (Fasecolda); parte de dueños personas naturales (E)'},
      {n:'Seguro todo riesgo', f:'V3', car:1100000, moto:20000, t:.08, cap:.10, b:'70 % de $ 6,59 billones del ramo automóviles (E). Comisión del ramo: 15,6 %'},
      {n:'Crédito vehicular', f:'V3', car:2384000, moto:345000, t:.01, cap:.05, b:'Desembolsos ≈ $ 11,5 billones al año (E); enero 2026: $ 1,19 billones'}]},
    {gr:'Compraventa', c:'var(--warn)', l:[
      {n:'Venta de vehículos', f:'V4', car:11830000, moto:980400, t:.01, cap:.10, b:'≈ 970 mil carros × $ 50 M y 817 mil motos × $ 6 M al año (E). Compraventa protegida'},
      {n:'Publicación en marketplace', f:'V4', car:31900, moto:9800, t:.20, cap:.30, b:'1,5 avisos por traspaso × $ 90 mil carro, $ 40 mil moto; 20 % paga destacado (E)'}]},
    {gr:'Publicidad', c:'var(--ser-3)', l:[
      {n:'Publicidad in-app', f:'V3', car:26700, moto:26700, t:.08, cap:1, b:'8 % de $ 3,04 billones de publicidad digital (IAB 2025) (E). Inventario: 15 aperturas al mes × CPM $ 12.000'}]}
  ];
  var BOG = GEO[1];
  function svTam(z, x){
    var cb = Math.min(z.car, BOG.car), mb = Math.min(z.moto, BOG.moto), fu = x.fu || 1;
    return x.car * (cb + (z.car - cb) * fu) + x.moto * (mb + (z.moto - mb) * fu);
  }
  GEO.forEach(function(z){
    z.tam = 0; z.sam = 0;
    SV.forEach(function(g){ g.l.forEach(function(x){ var v = svTam(z, x); z.tam += v; z.sam += v * x.t; }); });
  });
  var ARPU_A = {car:0, moto:0};
  SV.forEach(function(g){ g.l.forEach(function(x){ ARPU_A.car += x.car * x.t * x.cap; ARPU_A.moto += x.moto * x.t * x.cap; }); });
  var fmtMM = function(v){ var m = v / 1e9; return '$ ' + (m >= 100 ? ent(m) : dec(m, 1)) + ' mil M'; };
  var fmtB = function(v){ return v >= 1e12 ? '$ ' + dec(v / 1e12, v >= 1e13 ? 0 : 1) + ' billones' : fmtMM(v); };
  [].forEach.call(document.querySelectorAll('.pot-t tbody tr'), function(tr, i){ tr.querySelector('.gt').textContent = fmtB(GEO[i].tam); tr.querySelector('.gs').textContent = fmtMM(GEO[i].sam); });
  (function(){
    var geo = 3, visto = QUIETO;
    function pintar(){
      var z = GEO[geo], maxS = 0, h = '<thead><tr><th>Servicio</th><th class="n">TAM / año</th><th class="n">Tarifa</th><th class="n">SAM / año</th></tr></thead><tbody>';
      SV.forEach(function(g){ g.l.forEach(function(x){ maxS = Math.max(maxS, svTam(z, x) * x.t); }); });
      SV.forEach(function(g){
        h += '<tr class="sec" style="--c:' + g.c + '"><th colspan="4">' + g.gr + '</th></tr>';
        g.l.forEach(function(x){
          var tam = svTam(z, x), sam = tam * x.t;
          h += '<tr class="sub" style="--c:' + g.c + '"><th>' + x.n + '<span class="chip ' + x.f + '">' + x.f + '</span><small>' + x.b + '</small></th><td class="n">' + fmtB(tam) + '</td><td class="n p">' + dec(x.t * 100, 0) + ' %</td><td class="n">' + fmtMM(sam) + '<i class="bar" style="width:' + Math.max(2, sam / maxS * 100) + '%;transform:scaleX(' + (visto ? 1 : 0) + ')"></i></td></tr>';
        });
      });
      h += '</tbody><tfoot><tr><th>Total</th><td class="n">' + fmtB(z.tam) + '</td><td class="n p">' + dec(z.sam / z.tam * 100, 1) + ' %</td><td class="n">' + fmtMM(z.sam) + '</td></tr></tfoot>';
      $('svT').innerHTML = h;
      $('svTam').textContent = fmtB(z.tam);
      $('svSam').textContent = fmtMM(z.sam);
      $('svGeo').textContent = z.n + ' · ' + ent(z.car) + ' dueños de carro · ' + ent(z.moto) + ' de moto';
    }
    [].forEach.call(document.querySelectorAll('#svFase button'), function(btn){
      btn.addEventListener('click', function(){
        geo = +btn.dataset.g - 1;
        [].forEach.call(document.querySelectorAll('#svFase button'), function(o){ o.setAttribute('aria-pressed', o === btn ? 'true' : 'false'); });
        pintar();
      });
    });
    pintar();
    alVer($('svT'), function(){
      visto = true;
      [].forEach.call($('svT').querySelectorAll('.bar'), function(b, i){ b.style.transform = 'scaleX(1)'; anim(b, [{transform:'scaleX(0)'}, {transform:'scaleX(1)'}], {d:700, delay:i * 60}); });
    }, 0.2);
  })();
  (function(){
    var svg = $('cuadros'), h = '', max = GEO[3].car + GEO[3].moto;
    GEO.slice().reverse().forEach(function(z){
      var lado = 380 * Math.sqrt((z.car + z.moto) / max);
      h += '<rect class="cq" x="10" y="' + (390 - lado) + '" width="' + lado + '" height="' + lado + '" fill="var(--f' + z.g + ')" opacity="' + (z.g === 4 ? .35 : z.g === 3 ? .5 : z.g === 2 ? .75 : 1) + '"/>';
      h += '<text x="' + (10 + lado - 7.5) + '" y="' + (390 - lado + 20) + '" text-anchor="end" fill="var(--sup-1)" font-family="Bebas Neue, Impact, sans-serif" font-size="' + (z.g === 1 ? 13 : 20) + '">F' + z.g + '</text>';
    });
    svg.innerHTML = h;
    alVer(svg, function(){
      [].forEach.call(svg.querySelectorAll('.cq'), function(r, i){ r.style.transformOrigin = '10px 390px'; r.style.transformBox = 'view-box'; anim(r, [{transform:'scale(0)'}, {transform:'scale(1)'}], {d:800, delay:i * 220, e:'cubic-bezier(.3,1.2,.5,1)'}); });
    }, 0.4);
  })();
  var ARPU = {P:1200, C:3650, F:5500};
  function mxLeer(){
    var f = +document.querySelector('input[name="mxf"]:checked').value, m = document.querySelector('input[name="mxm"]:checked').value;
    return {f:f, m:m, pen:+$('mxPen').value, motos:$('mxMotos').checked};
  }
  function mxIngreso(z, o){
    var uc = z.car * o.pen, um = o.motos ? z.moto * o.pen : 0;
    var ing = o.m === 'arriba' ? uc * ARPU_A.car + um * ARPU_A.moto : (uc + um) * ARPU[o.m] * 12;
    return {ing:ing, us:uc + um};
  }
  function mxPintar(){
    var o = mxLeer(), z = GEO[o.f - 1], r = mxIngreso(z, o);
    $('mxPenO').textContent = pct0(o.pen);
    $('mxTotal').textContent = fmtMM(r.ing);
    $('mxTxt').textContent = 'Ingreso anual · ' + z.n + ' · ' + pct0(o.pen) + ' de penetración' + (o.motos ? '' : ' · solo carros');
    $('mxUs').textContent = ent(r.us);
    $('mxSam').textContent = dec(r.ing / z.sam * 100, 1) + ' %';
    var W = 640, H = 230, ml = 230, mr = 90, h = '', vals = GEO.map(function(g){ return mxIngreso(g, o).ing; }), mx = Math.max.apply(null, vals), bh = 34;
    GEO.forEach(function(g, i){
      var y = 15 + i * 52, w = (W - ml - mr) * vals[i] / mx;
      h += '<text x="' + (ml - 15) + '" y="' + (y + 22) + '" text-anchor="end" fill="' + (g.g === o.f ? 'var(--txt-1)' : 'var(--txt-3)') + '" font-family="Montserrat, sans-serif" font-size="11" font-weight="600" letter-spacing="1.2">' + g.n.toUpperCase() + '</text>';
      h += '<rect class="mxb" x="' + ml + '" y="' + y + '" width="' + Math.max(2, w) + '" height="' + bh + '" fill="var(--f' + g.g + ')"' + (g.g === o.f ? '' : ' opacity=".45"') + '/>';
      h += '<text x="' + (ml + w + 7.5) + '" y="' + (y + 22) + '" fill="var(--txt-1)" font-family="Montserrat, sans-serif" font-size="11" font-weight="600">' + dec(vals[i] / 1e9, vals[i] >= 1e11 ? 0 : 1) + '</text>';
    });
    $('mxGraf').innerHTML = h;
  }
  $('mxArribaTxt').textContent = 'Arriba-abajo · $ ' + ent(Math.round(ARPU_A.car / 12 / 50) * 50) + ' carro / $ ' + ent(Math.round(ARPU_A.moto / 12 / 50) * 50) + ' moto al mes';
  (function(){
    var o = {pen:.3, motos:true}, z = GEO[3];
    var bajo = mxIngreso(z, Object.assign({m:'C'}, o)).ing, alto = Math.max(mxIngreso(z, Object.assign({m:'arriba'}, o)).ing, mxIngreso(z, Object.assign({m:'F'}, o)).ing);
    $('mxTecho').textContent = 'Techo con 30 % de penetración en Colombia: ' + fmtMM(bajo).replace(' mil M', '') + '–' + fmtMM(alto).replace('$ ', '') + ' al año (abajo-arriba conservador a ' + (alto === mxIngreso(z, Object.assign({m:'F'}, o)).ing ? 'favorable' : 'arriba-abajo') + ').';
  })();
  [].forEach.call(document.querySelectorAll('input[name="mxf"],input[name="mxm"],#mxMotos'), function(el){ el.addEventListener('change', mxPintar); });
  $('mxPen').addEventListener('input', mxPintar);
  mxPintar();
  alVer($('mxGraf'), function(){ [].forEach.call($('mxGraf').querySelectorAll('.mxb'), function(r, i){ r.style.transformOrigin = '230px 0'; r.style.transformBox = 'view-box'; anim(r, [{transform:'scaleX(0)'}, {transform:'scaleX(1)'}], {d:700, delay:i * 120}); }); }, 0.4);

  /* ================= Costos operativos ================= */
  /* [concepto, detalle, hasta 1.000 activos, ~10.000 activos] en COP al mes */
  var COSTOS = [
    {g:'Software', c:'var(--ser-1)', l:[
      ['Claude Max 5x', 'Desarrollo continuo', 330000, 330000],
      ['Supabase', 'Base de datos, autenticación, archivos', 82500, 247500],
      ['Expo EAS', 'Compilación y actualizaciones', 0, 178000],
      ['Apple Developer', 'App Store, prorrateado', 27200, 27200],
      ['Google Maps', 'Mapa, lugares, rutas (E)', 0, 247500],
      ['Correo y monitoreo', 'Comprobantes y alertas', 0, 152000],
      ['Dominio', 'Prorrateado', 11000, 11000],
      ['Panel web, notificaciones, GitHub, DIAN', 'Planes gratis', 0, 0]]},
    {g:'Adquisición', c:'var(--ser-3)', l:[
      ['Pauta', 'Meta y TikTok', 3000000, 3000000],
      ['Firma de comercios', 'Transporte, material y soporte', 500000, 500000]]},
    {g:'Equipo', c:'var(--warn)', n:true, l:[
      ['Nómina', 'Supuesto del tablero', 10000000, 10000000]]},
    {g:'Administración', c:'var(--pos)', l:[
      ['Contabilidad y legal', 'Desde el mes 9', 800000, 800000]]},
    {g:'Variables (E)', c:'var(--neg)', l:[
      ['Pasarela de pagos', '2,65 % + $ 700 + IVA por pago', 382700, 3826700],
      ['ICA', '9,66 por mil de los ingresos', 10100, 100800]]}
  ];
  (function(){
    var esc = 0, visto = QUIETO, $t = $('cosT'), $b = $('cosBarra');
    var suma = function(l, e){ return l.reduce(function(x, r){ return x + r[2 + e]; }, 0); };
    $b.innerHTML = COSTOS.map(function(g){ return '<i style="background:' + g.c + ';flex-grow:0"></i>'; }).join('');
    $('cosLey').innerHTML = COSTOS.map(function(g){ return '<span><i style="background:' + g.c + '"></i>' + g.g + '</span>'; }).join('');
    function pintar(){
      var tot = COSTOS.reduce(function(x, g){ return x + suma(g.l, esc); }, 0);
      var nom = COSTOS.filter(function(g){ return g.n; }).reduce(function(x, g){ return x + suma(g.l, esc); }, 0);
      var k = function(v){ return dec(v / 1000, v % 1000 ? 1 : 0); };
      var pc = function(v){ return v ? dec(v / tot * 100, 1) + ' %' : '—'; };
      var h = '<thead><tr><th>Miles de COP</th><th class="n">Mensual</th><th class="n">Anual</th><th class="n">% del total</th></tr></thead><tbody>';
      COSTOS.forEach(function(g){
        var st = suma(g.l, esc);
        h += '<tr class="sec" style="--c:' + g.c + '"><th colspan="4">' + g.g + '</th></tr>';
        g.l.forEach(function(r){ h += '<tr class="sub"><th>' + r[0] + '<small>' + r[1] + '</small></th><td class="n">' + k(r[2 + esc]) + '</td><td class="n">' + k(r[2 + esc] * 12) + '</td><td class="n p">' + pc(r[2 + esc]) + '</td></tr>'; });
        if (g.l.length > 1) h += '<tr class="tot" style="--c:' + g.c + '"><th>Subtotal ' + g.g.replace(' (E)', '').toLowerCase() + '</th><td class="n">' + k(st) + '</td><td class="n">' + k(st * 12) + '</td><td class="n">' + pc(st) + '</td></tr>';
      });
      h += '</tbody><tfoot><tr><th>Total</th><td class="n">' + k(tot) + '</td><td class="n">' + k(tot * 12) + '</td><td class="n">100 %</td></tr>';
      h += '<tr><th>Total sin nómina</th><td class="n">' + k(tot - nom) + '</td><td class="n">' + k((tot - nom) * 12) + '</td><td class="n">' + pc(tot - nom) + '</td></tr></tfoot>';
      $t.innerHTML = h;
      $('cosMes').textContent = '$ ' + dec(tot / 1e6, 1) + ' M';
      $('cosAnio').textContent = '$ ' + dec(tot * 12 / 1e6, 1) + ' M';
      $('cosSinN').textContent = '$ ' + dec((tot - nom) * 12 / 1e6, 1) + ' M';
      if (visto) [].forEach.call($b.children, function(i, k){ i.style.flexGrow = suma(COSTOS[k].l, esc) / tot; });
    }
    [].forEach.call(document.querySelectorAll('#cosEsc button'), function(btn){
      btn.addEventListener('click', function(){
        esc = +btn.dataset.e;
        [].forEach.call(document.querySelectorAll('#cosEsc button'), function(o){ o.setAttribute('aria-pressed', o === btn ? 'true' : 'false'); });
        pintar();
      });
    });
    pintar();
    alVer($b, function(){ visto = true; pintar(); }, 0.5);
  })();

  /* ================= Fuentes de ingreso ================= */
  var ING = [
    {n:'Comisión por reserva', p:'comercio', pl:'Comercios', f:'V1', d:'% de cada reserva de parqueadero, lavado o taller. Fuente principal.'},
    {n:'Mensualidad del comercio', p:'comercio', pl:'Comercios', f:'V1', d:'Presencia en el mapa y panel de gestión. Primeros 30: 2 meses sin mensualidad.'},
    {n:'Tarifa de servicio', p:'usuario', pl:'Usuarios', f:'V1', d:'Cargo fijo por reserva para cubrir la pasarela.', ev:'En evaluación'},
    {n:'Vehículos y trámites DRS', p:'usuario', pl:'Clientes DRS', f:'V1', d:'Consignación y trámites de DRS Motors (sociedad de hecho). Reparto con la S.A.S. por definir.', ev:'Por definir'},
    {n:'Referido SOAT y tecnomecánica', p:'financiero', pl:'Agencia y CDA', f:'V2', d:'Comisión por renovación referida desde la alerta.'},
    {n:'Informe vehicular', p:'usuario', pl:'Usuarios', f:'V2', d:'Reporte pagado por placa. Comisión de tiendas 15–30 %.'},
    {n:'Plan premium Mi garaje', p:'usuario', pl:'Usuarios', f:'V2', d:'Varios vehículos, documentos y alertas avanzadas.', ev:'En evaluación'},
    {n:'Destacados en la zona', p:'comercio', pl:'Comercios', f:'V3', d:'Primera posición en la zona. Horas valle incluidas en la mensualidad.'},
    {n:'Pantalla patrocinada', p:'marcas', pl:'Marcas', f:'V3', d:'Anuncio al abrir la app.'},
    {n:'Pauta de concesionarios', p:'marcas', pl:'Concesionarios', f:'V3', d:'Lanzamientos en pantalla de entrada y Mi garaje; destacados en clasificados desde V4.'},
    {n:'Referido de crédito', p:'financiero', pl:'Bancos', f:'V3', d:'Comisión por crédito desembolsado.'},
    {n:'Referido de seguros', p:'financiero', pl:'Aseguradoras', f:'V3', d:'Comisión por póliza todo riesgo, vía agencia habilitada.'},
    {n:'Clasificados', p:'vendedor', pl:'Vendedores', f:'V4', d:'Publicación gratis; destacados y planes para profesionales.'},
    {n:'Repuestos', p:'vendedor', pl:'Vendedores', f:'V4', d:'Comisión por venta.'},
    {n:'Compraventa protegida', p:'usuario', pl:'Comprador y vendedor', f:'V4', d:'Tarifa por custodia y traspaso.'},
    {n:'Datos del mercado', p:'marcas', pl:'Empresas del sector', f:'V4', d:'Precios y tendencias anonimizados.'}
  ];
  var filtro = {pagador:'todos', fase:'todas'};
  function pintarIng(animar){
    var l = ING.filter(function(x){ return (filtro.pagador === 'todos' || x.p === filtro.pagador) && (filtro.fase === 'todas' || x.f === filtro.fase); });
    var cont = $('ingresos');
    cont.innerHTML = l.length ? l.map(function(x){
      return '<article class="ing"><h3>' + x.n + '</h3><p>' + x.d + '</p><div class="meta"><span class="chip ' + x.f + '">' + x.f + ' · ' + FASEN[x.f] + '</span><span class="chip">Paga: ' + x.pl + '</span>' + (x.ev ? '<span class="chip pend">' + x.ev + '</span>' : '') + '</div></article>';
    }).join('') : '<p class="vacio">No hay fuentes de ingreso con esos dos filtros. Cambia uno de los dos.</p>';
    $('conteo').textContent = l.length + ' de ' + ING.length + ' fuentes de ingreso.';
    if (animar) [].forEach.call(cont.children, function(c, i){ anim(c, [{opacity:0, transform:'translateY(15px)'}, {opacity:1, transform:'translateY(0)'}], {d:380, delay:i * 40}); });
  }
  [].forEach.call(document.querySelectorAll('.filtro'), function(b){
    b.addEventListener('click', function(){
      var f = b.dataset.f; filtro[f] = b.dataset.v;
      [].forEach.call(document.querySelectorAll('.filtro[data-f="' + f + '"]'), function(o){ o.setAttribute('aria-pressed', o === b ? 'true' : 'false'); });
      pintarIng(true);
    });
  });
  pintarIng(false);

  /* ================= Calendario de frecuencia ================= */
  (function(){
    var on = {parq:function(d){ return d % 2 === 1; }, lav:function(d){ return d === 12; }, tal:function(){ return false; }};
    var celdas = [];
    [].forEach.call(document.querySelectorAll('[data-dias]'), function(f){
      var k = f.dataset.dias, h = '';
      for (var d = 1; d <= 30; d++) h += '<i' + (on[k](d) ? ' class="on"' : '') + '></i>';
      f.innerHTML = h;
      [].forEach.call(f.children, function(c, i){ if (c.classList.contains('on')) celdas.push([c, i]); });
    });
    alVer($('cal'), function(){
      celdas.forEach(function(x){ anim(x[0], [{transform:'scaleY(0)'}, {transform:'scaleY(1)'}], {d:300, delay:x[1] * 45, e:'cubic-bezier(.3,1.4,.5,1)'}); });
    }, 0.5);
  })();

  /* ================= Horas valle ================= */
  (function(){
    var svg = $('valle'), base = [35,70,86,72,46,36,30,28,33,44,62,84,88,70,50,38], promo = [0,0,0,0,20,28,32,34,26,12,0,0,0,0,0,0];
    var W = 640, H = 230, ml = 44, mr = 4, mt = 24, mb = 30, n = base.length, bw = (W - ml - mr) / n;
    var y = function(v){ return mt + (H - mt - mb) * (1 - v / 100); }, h = '';
    [0, 50, 100].forEach(function(v){
      h += '<line x1="' + ml + '" x2="' + (W - mr) + '" y1="' + y(v) + '" y2="' + y(v) + '" stroke="var(--linea)"/><text x="' + (ml - 7.5) + '" y="' + (y(v) + 4) + '" text-anchor="end" fill="var(--txt-3)" font-family="Montserrat, sans-serif" font-size="11">' + v + ' %</text>';
    });
    var x0 = ml + bw * 4, x1 = ml + bw * 10;
    h += '<line x1="' + x0 + '" x2="' + x1 + '" y1="7.5" y2="7.5" stroke="var(--txt-2)"/><line x1="' + x0 + '" x2="' + x0 + '" y1="7.5" y2="15" stroke="var(--txt-2)"/><line x1="' + x1 + '" x2="' + x1 + '" y1="7.5" y2="15" stroke="var(--txt-2)"/>';
    h += '<rect x="' + ((x0 + x1) / 2 - 52) + '" y="0" width="104" height="15" fill="var(--sup-1)"/><text x="' + ((x0 + x1) / 2) + '" y="11" text-anchor="middle" fill="var(--txt-1)" font-family="Montserrat, sans-serif" font-size="11" font-weight="600" letter-spacing="1.76">HORAS VALLE</text>';
    base.forEach(function(v, i){
      var bx = ml + bw * i + bw * 0.18, w = bw * 0.64;
      h += '<rect class="vb" x="' + bx + '" y="' + y(v) + '" width="' + w + '" height="' + (y(0) - y(v)) + '" fill="var(--ser-4)"/>';
      if (promo[i]) h += '<rect class="vp" x="' + bx + '" y="' + y(v + promo[i]) + '" width="' + w + '" height="' + (y(v) - y(v + promo[i])) + '" fill="var(--ser-1)"/>';
      if (i % 3 === 0){
        var hr = 6 + i, et = hr < 12 ? hr + ' a. m.' : hr === 12 ? '12 m.' : (hr - 12) + ' p. m.';
        h += '<text x="' + (bx + w / 2) + '" y="' + (H - 9) + '" text-anchor="middle" fill="var(--txt-3)" font-family="Montserrat, sans-serif" font-size="11">' + et + '</text>';
      }
    });
    svg.innerHTML = h;
    alVer(svg, function(){
      [].forEach.call(svg.querySelectorAll('.vb'), function(r, i){ r.style.transformOrigin = 'center ' + y(0) + 'px'; r.style.transformBox = 'view-box'; anim(r, [{transform:'scaleY(0)'}, {transform:'scaleY(1)'}], {d:600, delay:i * 35}); });
      [].forEach.call(svg.querySelectorAll('.vp'), function(r, i){ r.style.transformOrigin = 'center ' + (+r.getAttribute('y') + +r.getAttribute('height')) + 'px'; r.style.transformBox = 'view-box'; anim(r, [{transform:'scaleY(0)'}, {transform:'scaleY(1)'}], {d:520, delay:1000 + i * 110, e:'cubic-bezier(.3,1.4,.5,1)'}); });
    }, 0.4);
  })();

  /* ================= Hoja de ruta ================= */
  var FASES = [
    {v:'V1', n:'Lanzamiento', c:'Fin del desarrollo (H0)',
     s:[['ico-ubicacion','Reservas de parqueadero','con horas valle y pago en la app'],['ico-detailing','Reservas de lavado',''],['ico-taller','Reservas de taller','y recordatorio de cambio de aceite'],['ico-alerta','Mi garaje','SOAT, tecnomecánica, pico y placa y multas'],['ico-consignacion','Vehículos DRS','solo el inventario propio'],['ico-traspaso','Trámites DRS','solo en Bogotá'],['ico-documento','Panel web del comercio','agenda, reservas, servicios, promociones, reseñas y pagos']],
     p:'Alta frecuencia, retención y operación que DRS ya conoce. Nada que dependa de aliados sin firmar.'},
    {v:'V2', n:'Retención', c:'Reservas recurrentes + agencia de seguros y CDA firmados (H2)',
     s:[['PTS','Puntos y fidelización','financiados por los comercios'],['ico-certificado','Renovación de SOAT y tecnomecánica','desde la alerta de vencimiento'],['ico-runt','Informe vehicular','de cualquier placa'],['ico-horario','Horas valle con IA','sugerencias de descuento por zona'],['ico-chat','Asistente de trámites','responde a cualquier hora']],
     p:'Uso semanal del usuario y resultados medibles para el comercio.'},
    {v:'V3', n:'Financiero', c:'Primer banco o aseguradora, o base activa para marcas (H3)',
     s:[['FIN','Crédito para vehículo','con bancos y financieras aliados'],['SEG','Seguro todo riesgo','con una agencia habilitada'],['PUB','Pantalla de entrada patrocinada','y pauta de marcas y concesionarios'],['DST','Destacados en la zona','para comercios aliados']],
     p:'Base activa monetizable para bancos, aseguradoras y marcas.'},
    {v:'V4', n:'Plataforma', c:'Base suficiente + custodia contratada (H4)',
     s:[['ico-precio','Clasificados de vehículos','abiertos a cualquier vendedor'],['ico-carrito','Tienda de repuestos','conectada con los talleres'],['ico-verificado','Compraventa protegida','pago en custodia y traspaso incluido'],['DAT','Datos del mercado','precios y tendencias anonimizados'],['2.ª','Segunda ciudad','el mismo modelo de comercios aliados']],
     p:'Transacciones entre usuarios y expansión geográfica.'}
  ];
  var rutaSvg = $('rutaSvg'), PX = [125, 375, 625, 875], PY = [90, 70, 50, 30], via, viaLen, viaPos = [], faseSel = 0;
  (function(){
    var d = 'M20 90 H300 L320 70 H550 L570 50 H800 L820 30 H980', h = '<path class="via-base" d="' + d + '"/><path class="via" id="via" d="' + d + '"/>';
    PX.forEach(function(x, i){ h += '<rect class="parada" data-i="' + i + '" x="' + (x - 7.5) + '" y="' + (PY[i] - 7.5) + '" width="15" height="15"/><text x="' + x + '" y="' + (PY[i] - 15) + '" text-anchor="middle" fill="var(--txt-3)" font-family="Montserrat, sans-serif" font-weight="600" font-size="11" letter-spacing="1.76">' + FASES[i].v + '</text>'; });
    h += '<rect class="marcador" id="marcador" x="-5" y="-5" width="10" height="10"/>';
    rutaSvg.innerHTML = h;
    via = $('via'); viaLen = via.getTotalLength();
    PX.forEach(function(x){ var lo = 0, hi = viaLen; for (var k = 0; k < 30; k++){ var m = (lo + hi) / 2; if (via.getPointAtLength(m).x < x) lo = m; else hi = m; } viaPos.push(hi); });
    via.style.strokeDasharray = viaLen + ' ' + viaLen;
  })();
  var marcLen = 0;
  function moverMarcador(i, dur){
    var desde = marcLen, hasta = viaPos[i], m = $('marcador'), t0 = null;
    function paso(ts){
      if (!t0) t0 = ts;
      var k = Math.min(1, (ts - t0) / dur), e = 1 - Math.pow(1 - k, 3), L = desde + (hasta - desde) * e, p = via.getPointAtLength(L);
      m.setAttribute('transform', 'translate(' + p.x + ' ' + p.y + ')');
      via.style.strokeDashoffset = viaLen - L;
      if (k < 1) requestAnimationFrame(paso); else marcLen = hasta;
    }
    if (QUIETO || !dur){ var p = via.getPointAtLength(hasta); m.setAttribute('transform', 'translate(' + p.x + ' ' + p.y + ')'); via.style.strokeDashoffset = viaLen - hasta; marcLen = hasta; }
    else requestAnimationFrame(paso);
    [].forEach.call(rutaSvg.querySelectorAll('.parada'), function(r, j){ r.classList.toggle('on', j <= i); });
  }
  var fasesEl = $('fases');
  FASES.forEach(function(f, i){
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'fase'; b.id = 'fase-' + f.v; b.dataset.f = f.v;
    b.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
    b.innerHTML = '<span class="vn">' + f.v + '</span><h3>' + f.n + '</h3><small>' + f.c + '</small>';
    b.addEventListener('click', function(){ verFase(i, true); });
    fasesEl.appendChild(b);
  });
  function verFase(i, animar){
    faseSel = i;
    var f = FASES[i];
    [].forEach.call(fasesEl.children, function(b, j){ b.setAttribute('aria-pressed', j === i ? 'true' : 'false'); });
    $('faseDet').innerHTML = '<ul class="lista-serv">' + f.s.map(function(s){ return '<li>' + glifo(s[0]) + '<span><b>' + s[1] + '</b>' + (s[2] ? '<br>' + s[2] : '') + '</span></li>'; }).join('') + '</ul><div class="bloque"><h3 style="color:var(--txt-3)">Criterio</h3><p>' + f.p + '</p></div>';
    if (animar) [].forEach.call($('faseDet').querySelectorAll('li'), function(li, j){ anim(li, [{opacity:0, transform:'translateX(-15px)'}, {opacity:1, transform:'translateX(0)'}], {d:360, delay:j * 50}); });
    moverMarcador(i, animar ? 700 : 0);
  }
  verFase(0, false);
  alVer(rutaSvg, function(){ marcLen = 0; moverMarcador(faseSel, 0); var j = faseSel; marcLen = 0; via.style.strokeDashoffset = viaLen; setTimeout(function(){ moverMarcador(3, 1600); setTimeout(function(){ moverMarcador(j, 600); }, 1900); }, 200); }, 0.6);

  /* ================= Tablero de proyecciones ================= */
  var M = MODELO, CASOSN = {pesimista:'Pesimista', conservador:'Conservador', favorable:'Favorable'};
  var CASOTXT = {
    pesimista:'Pesimista: CPI US$2,5 · abandono 15 % · 3 % reserva 1,1 veces al mes. Las 5 métricas de corte en replantear; con corte, la operación se detiene en el mes 8.',
    conservador:'Conservador: CPI US$1,6 · abandono 10 % · 6 % reserva 3 veces al mes · nómina +25 % anual.',
    favorable:'Favorable: CPI US$1,5 · abandono 8 % · 8 % reserva 3,5 veces al mes · más pauta y equipo. No es la base.'
  };
  var P = [
    {k:'pauta0', g:'Usuarios', n:'Pauta mensual al lanzar', min:1e6, max:15e6, st:5e5, f:function(v){ return fmtM(v); }},
    {k:'pautaCrec', g:'Usuarios', n:'Crecimiento anual de la pauta', min:0, max:1, st:.05, f:pct0},
    {k:'cpi', g:'Usuarios', n:'Costo por instalación', min:.5, max:4, st:.1, f:function(v){ return 'US$' + dec(v, 1); }, corte:'cpi'},
    {k:'activacion', g:'Usuarios', n:'Instalaciones que registran un vehículo', min:.2, max:.8, st:.05, f:pct0, corte:'activacion'},
    {k:'churn', g:'Usuarios', n:'Usuarios que dejan la app cada mes', min:.03, max:.25, st:.01, f:pct0, corte:'churn'},
    {k:'pctReserva', g:'Reservas', n:'Usuarios activos que reservan en el mes', min:.01, max:.2, st:.005, f:pct1, corte:'pctReserva'},
    {k:'frecuencia', g:'Reservas', n:'Reservas al mes de quien reserva', min:1, max:15, st:.5, f:function(v){ return dec(v, 1); }},
    {k:'ticket', g:'Reservas', n:'Valor promedio de la reserva', min:1e4, max:1e5, st:5e3, f:function(v){ return fmt(v); }},
    {k:'take', g:'Reservas', n:'Comisión por reserva', min:.05, max:.2, st:.01, f:pct0},
    {k:'tarifa', g:'Reservas', n:'Tarifa de servicio al usuario', min:0, max:3000, st:250, f:function(v){ return fmt(v); }},
    {k:'nuevos0', g:'Comercios', n:'Comercios nuevos al mes', min:1, max:50, st:1, f:ent},
    {k:'mensualidad', g:'Comercios', n:'Mensualidad del comercio', min:0, max:25e4, st:1e4, f:function(v){ return fmt(v); }},
    {k:'pctPagan', g:'Comercios', n:'Comercios que pagan la mensualidad', min:.05, max:.8, st:.05, f:pct0, corte:'pctPagan'},
    {k:'nomina0', g:'Equipo', n:'Nómina mensual desde el mes 9', min:0, max:4e7, st:1e6, f:function(v){ return fmtM(v); }},
    {k:'nominaCrec', g:'Equipo', n:'Crecimiento anual de la nómina', min:0, max:1, st:.05, f:pct0},
    {k:'org0', g:'Más', n:'Instalaciones orgánicas al mes al lanzar', min:0, max:2000, st:50, f:ent},
    {k:'orgCrec', g:'Más', n:'Crecimiento mensual de lo orgánico', min:0, max:.08, st:.005, f:pct1},
    {k:'cpiCrec', g:'Más', n:'Encarecimiento anual de la instalación', min:0, max:.3, st:.01, f:pct0},
    {k:'rampa', g:'Más', n:'Mejora de la tasa de reserva en 24 meses', min:1, max:3, st:.1, f:function(v){ return '×' + dec(v, 1); }},
    {k:'nuevosCrec', g:'Más', n:'Crecimiento anual de comercios nuevos', min:0, max:1, st:.05, f:pct0},
    {k:'churnCom', g:'Más', n:'Comercios que se van cada mes', min:0, max:.15, st:.01, f:pct0},
    {k:'pctDest', g:'Más', n:'Comercios que compran destacados (V3)', min:0, max:.4, st:.01, f:pct0},
    {k:'precioDest', g:'Más', n:'Precio mensual del destacado', min:0, max:2e5, st:1e4, f:function(v){ return fmt(v); }},
    {k:'arpuRenov', g:'Más', n:'SOAT, tecnomecánica e informe (V2), por activo al mes', min:0, max:600, st:10, f:function(v){ return fmt(v); }},
    {k:'aperturas', g:'Más', n:'Aperturas de la app al mes por activo (publicidad, V3)', min:0, max:30, st:1, f:ent},
    {k:'cpm', g:'Más', n:'Precio por mil impresiones (CPM)', min:0, max:3e4, st:1e3, f:function(v){ return fmt(v); }},
    {k:'arpuFin', g:'Más', n:'Crédito y seguros (V3), por activo al mes', min:0, max:600, st:10, f:function(v){ return fmt(v); }},
    {k:'arpuMkt', g:'Más', n:'Clasificados, repuestos y compraventa (V4), por activo al mes', min:0, max:600, st:10, f:function(v){ return fmt(v); }},
    {k:'v2', g:'Más', n:'V2 sale en el mes en el mercado', min:3, max:24, st:1, f:ent},
    {k:'v3', g:'Más', n:'V3 sale en el mes en el mercado', min:6, max:36, st:1, f:ent},
    {k:'v4', g:'Más', n:'V4 sale en el mes en el mercado', min:12, max:48, st:1, f:ent},
    {k:'techUsuario', g:'Más', n:'Infraestructura por usuario activo al mes', min:0, max:400, st:10, f:function(v){ return fmt(v); }},
    {k:'comercial', g:'Más', n:'Salidas a firmar comercios al mes, desde el mes 9', min:0, max:5e6, st:1e5, f:function(v){ return fmt(v); }},
    {k:'admin', g:'Más', n:'Contabilidad y legal al mes, desde el mes 9', min:0, max:5e6, st:1e5, f:function(v){ return fmt(v); }},
    {k:'aux', g:'Más', n:'Auxilio por ingeniero en los meses 1 a 8', min:0, max:5e6, st:25e4, f:function(v){ return fmt(v); }},
    {k:'nAux', g:'Más', n:'Ingenieros con auxilio', min:2, max:3, st:1, f:ent},
    {k:'inflacion', g:'Más', n:'Inflación anual de precios', min:0, max:.12, st:.01, f:pct0}
  ];
  function pct0(v){ return Math.round(v * 100) + ' %'; }
  function pct1(v){ return dec(v * 100, 1) + ' %'; }
  var caso = 'pesimista', par = Object.assign({}, CASOS.pesimista), personal = false;
  var CORTO = {cpi:'Instalación', activacion:'Registro', pctReserva:'Reservan', churn:'Abandono', pctPagan:'Pagan mensualidad'};
  var ZONA = {replantear:'var(--neg)', ajustar:'var(--warn)', escalar:'var(--pos)'};
  var ZONAN = {replantear:'Se replantea', ajustar:'Se ajusta', escalar:'Se escala'};
  (function(){
    var pal = $('palancas'), grupos = {}, orden = ['Usuarios', 'Reservas', 'Comercios', 'Equipo'];
    orden.forEach(function(g){ var d = document.createElement('div'); d.className = 'grupo'; d.innerHTML = '<p class="etq">' + g + '</p>'; pal.appendChild(d); grupos[g] = d; });
    var det = document.createElement('details'); det.className = 'avanz'; det.innerHTML = '<summary>Más supuestos</summary>';
    var gm = document.createElement('div'); gm.className = 'grupo'; det.appendChild(gm); grupos['Más'] = gm;
    var cf = document.createElement('label'); cf.className = 'check'; cf.setAttribute('for', 'pCloud');
    cf.innerHTML = '<input type="checkbox" id="pCloud"> Panel del comercio en Cloudflare Pages (sin Vercel Pro)';
    gm.appendChild(cf);
    pal.appendChild(det);
    P.forEach(function(p){
      var d = document.createElement('div'); d.className = 'pal';
      d.innerHTML = '<div class="top"><label for="p-' + p.k + '">' + p.n + '</label><output id="o-' + p.k + '" for="p-' + p.k + '"></output></div><input type="range" id="p-' + p.k + '" min="' + p.min + '" max="' + p.max + '" step="' + p.st + '">';
      grupos[p.g].appendChild(d);
      var inp = d.querySelector('input');
      inp.addEventListener('input', function(){ par[p.k] = +inp.value; personal = true; recalcular(); });
    });
    $('pCloud').addEventListener('change', function(){ par.cloudflare = this.checked; personal = true; recalcular(); });
    $('corteOn').addEventListener('change', function(){ par.corte = this.checked; recalcular(); });
  })();
  function sincronizar(){
    P.forEach(function(p){ $('p-' + p.k).value = par[p.k]; });
    $('pCloud').checked = !!par.cloudflare;
  }
  function salidas(){
    var sem = M.semaforo(par), z = {};
    sem.lista.forEach(function(x){ z[x.k] = x.e; });
    P.forEach(function(p){
      var o = $('o-' + p.k);
      o.innerHTML = p.f(par[p.k]) + (p.corte ? '<i class="pt" style="background:' + ZONA[z[p.corte]] + '" title="' + ZONAN[z[p.corte]] + '"></i>' : '');
    });
    return sem;
  }
  function elegirCaso(c){
    caso = c; var corte = $('corteOn').checked;
    par = Object.assign({}, CASOS[c], {corte:corte}); personal = false;
    [].forEach.call(document.querySelectorAll('#casos button'), function(b){ b.setAttribute('aria-pressed', b.dataset.caso === c ? 'true' : 'false'); });
    sincronizar(); recalcular();
  }
  [].forEach.call(document.querySelectorAll('#casos button'), function(b){ b.addEventListener('click', function(){ elegirCaso(b.dataset.caso); }); });
  $('restablecer').addEventListener('click', function(){ elegirCaso(caso); });

  /* --- metas --- */
  var METAS = [{h:'H1', k:3, reg:1000, act:400, com:30}, {h:'H2', k:6, reg:2500, act:900, com:50}, {h:'H3', k:12, reg:6000, act:2000, com:100}, {h:'H4', k:24, reg:20000, act:6000, com:300}];
  function cumpleMetas(rs, p){
    return METAS.map(function(m){ var r = rs[p.lanz + m.k - 2]; return r && r.registrados >= m.reg && r.activos >= m.act && r.aliados >= m.com; });
  }

  /* --- KPIs con conteo --- */
  var kpiPrev = {};
  function contar(id, valor, f, cls){
    var el = $(id), prev = kpiPrev[id], desde = typeof prev === 'number' ? prev : (typeof valor === 'number' ? 0 : valor);
    kpiPrev[id] = valor;
    el.className = 'cifra-d num' + (cls ? ' ' + cls : '');
    if (QUIETO || typeof valor !== 'number'){ el.textContent = typeof valor === 'number' ? f(valor) : valor; return; }
    var t0 = null, tok = (el._tok = (el._tok || 0) + 1);
    function paso(ts){
      if (tok !== el._tok) return;
      if (t0 === null) t0 = ts;
      var k = Math.min(1, (ts - t0) / 550), e = 1 - Math.pow(1 - k, 3);
      el.textContent = f(desde + (valor - desde) * e);
      if (k < 1) requestAnimationFrame(paso);
    }
    el.textContent = f(desde);
    requestAnimationFrame(paso);
  }

  /* --- gráficas del tablero --- */
  var vista = 'pyg', datosAct = null, datosObj = null, tween = null;
  var G = {W:760, H:360, ml:64, mr:16, mt:28, mb:34};
  var VISTAS = {
    pyg:{t:'Ingresos, costos y EBITDA mensuales · M COP', ley:[['var(--acc-2)','Ingresos'],['var(--warn)','Costos'],['var(--pos)','EBITDA positivo'],['var(--neg)','EBITDA negativo']]},
    ing:{t:'Ingresos mensuales por fuente · M COP', ley:[['var(--ser-1)','Reservas'],['var(--ser-3)','Comercios'],['var(--pos)','SOAT, tecnomecánica e informe'],['var(--warn)','Publicidad'],['var(--txt-1)','Crédito, seguros y clasificados']]},
    cos:{t:'Costos mensuales por rubro · M COP', ley:[['var(--ser-2)','Equipo'],['var(--ser-4)','Pauta'],['var(--warn)','Variables: pasarela, infraestructura, ICA'],['var(--neg)','Software, comercial, contabilidad, únicos']]},
    caja:{t:'Caja acumulada · M COP · el mínimo es el capital necesario', ley:[['var(--txt-1)','Caja acumulada'],['var(--neg)','Por debajo de cero'],['var(--pos)','Por encima de cero']]},
    us:{t:'Usuarios activos y comercios aliados vs. metas H1–H4', ley:[['var(--acc-2)','Usuarios activos'],['var(--pos)','Comercios aliados'],['var(--txt-1)','Meta']]}
  };
  function series(rs){
    var g = function(f){ return rs.map(f); };
    return {
      ing:g(function(r){ return r.ingT; }), cos:g(function(r){ return r.cosT; }), eb:g(function(r){ return r.ebitda; }), caja:g(function(r){ return r.caja; }),
      i1:g(function(r){ return r.ing.comision + r.ing.tarifa; }), i2:g(function(r){ return r.ing.mensualidad + r.ing.destacados; }), i3:g(function(r){ return r.ing.renov; }), i4:g(function(r){ return r.ing.publicidad; }), i5:g(function(r){ return r.ing.financiero + r.ing.mercado; }),
      c1:g(function(r){ return r.cos.equipo; }), c2:g(function(r){ return r.cos.pauta; }), c3:g(function(r){ return r.var; }), c4:g(function(r){ return r.cos.tech + r.cos.comercial + r.cos.admin + r.cos.unicos; }),
      act:g(function(r){ return r.activos; }), com:g(function(r){ return r.aliados; })
    };
  }
  function cero(s){ var o = {}; for (var k in s) o[k] = s[k].map(function(){ return 0; }); return o; }
  function mezclar(a, b, t){ var o = {}; for (var k in b) o[k] = b[k].map(function(v, i){ return a[k][i] + (v - a[k][i]) * t; }); return o; }
  function escala(min, max, n){
    if (max - min < 1) max = min + 1;
    var bruto = (max - min) / (n || 5), mag = Math.pow(10, Math.floor(Math.log10(bruto))), r = bruto / mag;
    var paso = (r <= 1 ? 1 : r <= 2 ? 2 : r <= 2.5 ? 2.5 : r <= 5 ? 5 : 10) * mag;
    var lo = Math.floor(min / paso) * paso, hi = Math.ceil(max / paso) * paso, ts = [];
    for (var v = lo; v <= hi + paso / 2; v += paso) ts.push(v);
    return {lo:lo, hi:hi, ts:ts};
  }
  function etqM(v){ var a = Math.abs(v) / 1e6; return (v < 0 ? '−' : '') + (a >= 10 || a === 0 ? ent(a) : dec(a, 1)); }
  var TXT = 'font-family="Montserrat, sans-serif" font-size="11"';
  function dibujar(d){
    var W = G.W, H = G.H, ml = G.ml, mr = G.mr, mt = G.mt, mb = G.mb, n = d.ing.length;
    var X = function(i){ return ml + (W - ml - mr) * i / (n - 1); }, h = '', res = ultimo.s, L = par.lanz;
    function marco(sc, Y, fmtEje, y0, y1){
      sc.ts.forEach(function(v){ h += '<line x1="' + ml + '" x2="' + (W - mr) + '" y1="' + Y(v) + '" y2="' + Y(v) + '" stroke="var(--linea)"/><text x="' + (ml - 7.5) + '" y="' + (Y(v) + 4) + '" text-anchor="end" fill="var(--txt-3)" ' + TXT + '>' + fmtEje(v) + '</text>'; });
      for (var a = 0; a < 5; a++){
        var xa = X(a * 12), xc = X(a * 12 + 5.5);
        if (a) h += '<line x1="' + xa + '" x2="' + xa + '" y1="' + y0 + '" y2="' + y1 + '" stroke="var(--linea)"/>';
        h += '<text x="' + xc + '" y="' + (H - 10) + '" text-anchor="middle" fill="var(--txt-3)" ' + TXT + ' font-weight="600" letter-spacing="1.76">AÑO ' + (a + 1) + '</text>';
      }
      var xl = X(L - 1);
      h += '<line x1="' + xl + '" x2="' + xl + '" y1="' + y0 + '" y2="' + y1 + '" stroke="var(--txt-3)" stroke-dasharray="3 3"/><text x="' + (xl + 4) + '" y="' + (mt - 10) + '" fill="var(--txt-2)" ' + TXT + ' font-weight="600" letter-spacing="1.76">LANZAMIENTO</text>';
      if (par.corte && ultimo.rs[n - 1].cortado){ var xc2 = X(L + 3); h += '<line x1="' + xc2 + '" x2="' + xc2 + '" y1="' + y0 + '" y2="' + y1 + '" stroke="var(--neg)" stroke-dasharray="3 3"/><text x="' + (xc2 + 4) + '" y="' + (mt + 6) + '" fill="var(--neg)" ' + TXT + ' font-weight="600" letter-spacing="1.76">CORTE</text>'; }
    }
    function linea(arr, Y, color, ancho, extra){ return '<polyline fill="none" stroke="' + color + '" stroke-width="' + ancho + '" stroke-linejoin="miter" ' + (extra || '') + ' points="' + arr.map(function(v, i){ return X(i).toFixed(1) + ',' + Y(v).toFixed(1); }).join(' ') + '"/>'; }
    if (vista === 'pyg'){
      var mx = Math.max.apply(null, d.ing.concat(d.cos)), mn = Math.min.apply(null, d.eb.concat([0]));
      var sc = escala(mn, mx, 5), Y = function(v){ return mt + (H - mt - mb) * (sc.hi - v) / (sc.hi - sc.lo); };
      marco(sc, Y, etqM, mt, H - mb);
      var bw = (W - ml - mr) / n * 0.6;
      d.eb.forEach(function(v, i){ if (!v) return; var y1 = Y(Math.max(v, 0)), y2 = Y(Math.min(v, 0)); h += '<rect x="' + (X(i) - bw / 2).toFixed(1) + '" y="' + y1.toFixed(1) + '" width="' + bw.toFixed(1) + '" height="' + Math.max(0, y2 - y1).toFixed(1) + '" fill="' + (v > 0 ? 'var(--pos)' : 'var(--neg)') + '" opacity=".75"/>'; });
      h += '<line x1="' + ml + '" x2="' + (W - mr) + '" y1="' + Y(0) + '" y2="' + Y(0) + '" stroke="var(--txt-3)"/>';
      h += linea(d.cos, Y, 'var(--warn)', 2) + linea(d.ing, Y, 'var(--acc-2)', 2.5);
      if (res.equilibrio){ var xe = X(res.equilibrio - 1); h += '<line x1="' + xe + '" x2="' + xe + '" y1="' + mt + '" y2="' + (H - mb) + '" stroke="var(--txt-1)"/><rect x="' + (xe + 4) + '" y="' + (mt + 2) + '" width="150" height="17" fill="var(--sup-1)"/><text x="' + (xe + 7.5) + '" y="' + (mt + 14) + '" fill="var(--txt-1)" ' + TXT + ' font-weight="600" letter-spacing="1.76">EQUILIBRIO · MES ' + res.equilibrio + '</text>'; }
    } else if (vista === 'ing' || vista === 'cos'){
      var ks = vista === 'ing' ? ['i1','i2','i3','i4','i5'] : ['c1','c2','c3','c4'];
      var cols = VISTAS[vista].ley.map(function(x){ return x[0]; });
      var tot = d.ing.map(function(_, i){ return ks.reduce(function(a, k){ return a + d[k][i]; }, 0); });
      var sc2 = escala(0, Math.max.apply(null, tot), 5), Y2 = function(v){ return mt + (H - mt - mb) * (sc2.hi - v) / (sc2.hi - sc2.lo); };
      marco(sc2, Y2, etqM, mt, H - mb);
      var base = d.ing.map(function(){ return 0; });
      ks.forEach(function(k, j){
        var arriba = base.map(function(b, i){ return b + d[k][i]; });
        var pts = arriba.map(function(v, i){ return X(i).toFixed(1) + ',' + Y2(v).toFixed(1); }).concat(base.slice().reverse().map(function(v, i){ return X(n - 1 - i).toFixed(1) + ',' + Y2(v).toFixed(1); }));
        h += '<polygon points="' + pts.join(' ') + '" fill="' + cols[j] + '"/>';
        base = arriba;
      });
      h += linea(tot, Y2, 'var(--txt-1)', 1);
    } else if (vista === 'caja'){
      var sc3 = escala(Math.min.apply(null, d.caja.concat([0])), Math.max.apply(null, d.caja.concat([0])), 5), Y3 = function(v){ return mt + (H - mt - mb) * (sc3.hi - v) / (sc3.hi - sc3.lo); };
      marco(sc3, Y3, etqM, mt, H - mb);
      var y0 = Y3(0), area = d.caja.map(function(v, i){ return X(i).toFixed(1) + ',' + Y3(v).toFixed(1); }).concat([X(n - 1) + ',' + y0, X(0) + ',' + y0]).join(' ');
      h += '<defs><clipPath id="cAba"><rect x="0" y="' + y0 + '" width="' + W + '" height="' + H + '"/></clipPath><clipPath id="cArr"><rect x="0" y="0" width="' + W + '" height="' + y0 + '"/></clipPath></defs>';
      h += '<polygon points="' + area + '" fill="var(--neg)" opacity=".22" clip-path="url(#cAba)"/><polygon points="' + area + '" fill="var(--pos)" opacity=".22" clip-path="url(#cArr)"/>';
      h += '<line x1="' + ml + '" x2="' + (W - mr) + '" y1="' + y0 + '" y2="' + y0 + '" stroke="var(--txt-3)"/>' + linea(d.caja, Y3, 'var(--txt-1)', 2);
      var im = 0; d.caja.forEach(function(v, i){ if (v < d.caja[im]) im = i; });
      if (d.caja[im] < 0){
        var xm = X(im), ym = Y3(d.caja[im]), izq = xm > W * 0.6;
        h += '<rect x="' + (xm - 5) + '" y="' + (ym - 5) + '" width="10" height="10" fill="var(--txt-1)"/>';
        h += '<rect x="' + (izq ? xm - 250 : xm + 9) + '" y="' + (ym + 9) + '" width="241" height="17" fill="var(--sup-1)"/><text x="' + (izq ? xm - 12 : xm + 12) + '" y="' + (ym + 21) + '" text-anchor="' + (izq ? 'end' : 'start') + '" fill="var(--txt-1)" ' + TXT + ' font-weight="600" letter-spacing="1.2">CAPITAL NECESARIO ' + fmtM(-d.caja[im]).toUpperCase() + ' · MES ' + (im + 1) + '</text>';
      }
    } else if (vista === 'us'){
      var mid = (H - mt - mb) / 2, paneles = [['act', 'var(--acc-2)', 'act', mt, mt + mid - 15, 'USUARIOS ACTIVOS'], ['com', 'var(--pos)', 'com', mt + mid + 15, H - mb, 'COMERCIOS ALIADOS']];
      var ancla = {act:'act', com:'com'};
      paneles.forEach(function(pn, pi){
        var arr = d[pn[0]], metasV = METAS.map(function(m){ return m[pn[2]]; });
        var mxv = Math.max.apply(null, arr.concat(metasV)), sc4 = escala(0, mxv, 3), top = pn[3], bot = pn[4];
        var Y4 = function(v){ return top + (bot - top) * (sc4.hi - v) / (sc4.hi - sc4.lo); };
        sc4.ts.forEach(function(v){ h += '<line x1="' + ml + '" x2="' + (W - mr) + '" y1="' + Y4(v) + '" y2="' + Y4(v) + '" stroke="var(--linea)"/><text x="' + (ml - 7.5) + '" y="' + (Y4(v) + 4) + '" text-anchor="end" fill="var(--txt-3)" ' + TXT + '>' + (v >= 1000 ? dec(v / 1000, v % 1000 ? 1 : 0) + ' mil' : ent(v)) + '</text>'; });
        h += '<text x="' + (ml + 4) + '" y="' + (top - 7.5) + '" fill="var(--txt-2)" ' + TXT + ' font-weight="600" letter-spacing="1.76">' + pn[5] + '</text>';
        for (var a = 1; a < 5; a++){ var xa = X(a * 12); h += '<line x1="' + xa + '" x2="' + xa + '" y1="' + top + '" y2="' + bot + '" stroke="var(--linea)"/>'; }
        var xl = X(L - 1); h += '<line x1="' + xl + '" x2="' + xl + '" y1="' + top + '" y2="' + bot + '" stroke="var(--txt-3)" stroke-dasharray="3 3"/>';
        h += linea(arr, Y4, pn[1], 2.5);
        METAS.forEach(function(m){
          var xm = X(L + m.k - 2), ym = Y4(m[pn[2]]);
          h += '<rect x="' + (xm - 4) + '" y="' + (ym - 4) + '" width="8" height="8" fill="none" stroke="var(--txt-1)" stroke-width="1.5"/><text x="' + xm + '" y="' + (ym - 9) + '" text-anchor="middle" fill="var(--txt-1)" ' + TXT + ' font-weight="600">' + m.h + '</text>';
        });
      });
      for (var a2 = 0; a2 < 5; a2++) h += '<text x="' + X(a2 * 12 + 5.5) + '" y="' + (H - 10) + '" text-anchor="middle" fill="var(--txt-3)" ' + TXT + ' font-weight="600" letter-spacing="1.76">AÑO ' + (a2 + 1) + '</text>';
    }
    h += '<line id="cruz" x1="0" x2="0" y1="' + mt + '" y2="' + (H - mb) + '" stroke="var(--txt-2)" stroke-width="1" visibility="hidden"/>';
    h += '<rect id="captura" x="' + ml + '" y="' + mt + '" width="' + (W - ml - mr) + '" height="' + (H - mt - mb) + '" fill="transparent"/>';
    $('graf').innerHTML = h;
    enganchar();
  }
  function animarA(nuevos, desdeCero){
    datosObj = nuevos;
    var desde = desdeCero || !datosAct ? cero(nuevos) : datosAct;
    if (tween) cancelAnimationFrame(tween);
    if (QUIETO){ datosAct = nuevos; dibujar(nuevos); return; }
    var t0 = null, dur = desdeCero ? 900 : 480;
    function paso(ts){
      if (t0 === null) t0 = ts;
      var k = Math.min(1, (ts - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      datosAct = mezclar(desde, nuevos, e); dibujar(datosAct);
      if (k < 1) tween = requestAnimationFrame(paso);
    }
    tween = requestAnimationFrame(paso);
  }
  function enganchar(){
    var cap = $('captura'), svg = $('graf'), lec = $('lectura'), cruz = $('cruz');
    function mover(ev){
      var r = svg.getBoundingClientRect(), sx = (ev.clientX - r.left) * G.W / r.width;
      var i = Math.max(0, Math.min(59, Math.round((sx - G.ml) / (G.W - G.ml - G.mr) * 59)));
      var x = G.ml + (G.W - G.ml - G.mr) * i / 59, rr = ultimo.rs[i];
      cruz.setAttribute('x1', x); cruz.setAttribute('x2', x); cruz.setAttribute('visibility', 'visible');
      var filas = vista === 'us'
        ? [['Usuarios activos', ent(rr.activos)], ['Registrados', ent(rr.registrados)], ['Comercios', ent(rr.aliados)], ['Reservas', ent(rr.reservas)]]
        : vista === 'caja' ? [['Caja acumulada', fmtM(rr.caja)], ['EBITDA del mes', fmtM(rr.ebitda)]]
        : vista === 'ing' ? [['Reservas', fmtM(rr.ing.comision + rr.ing.tarifa)], ['Comercios', fmtM(rr.ing.mensualidad + rr.ing.destacados)], ['SOAT, tecno e informe', fmtM(rr.ing.renov)], ['Publicidad', fmtM(rr.ing.publicidad)], ['Crédito, seguros, clasif.', fmtM(rr.ing.financiero + rr.ing.mercado)], ['Total', fmtM(rr.ingT)]]
        : vista === 'cos' ? [['Equipo', fmtM(rr.cos.equipo)], ['Pauta', fmtM(rr.cos.pauta)], ['Variables', fmtM(rr.var)], ['Software y otros', fmtM(rr.cos.tech + rr.cos.comercial + rr.cos.admin + rr.cos.unicos)], ['Total', fmtM(rr.cosT)]]
        : [['Ingresos', fmtM(rr.ingT)], ['Costos', fmtM(rr.cosT)], ['EBITDA', fmtM(rr.ebitda)]];
      lec.innerHTML = '<b>Mes ' + rr.m + (rr.k >= 1 ? ' · ' + rr.k + ' en el mercado' : ' · desarrollo') + '</b>' + filas.map(function(f){ return '<div class="fila"><span>' + f[0] + '</span><b>' + f[1] + '</b></div>'; }).join('');
      lec.style.display = 'block';
      var px = x / G.W * r.width, w = lec.offsetWidth;
      lec.style.left = (px > r.width / 2 ? px - w - 15 : px + 15) + 'px';
    }
    function salir(){ lec.style.display = 'none'; cruz.setAttribute('visibility', 'hidden'); }
    cap.addEventListener('pointermove', mover); cap.addEventListener('pointerdown', mover); cap.addEventListener('pointerleave', salir);
  }
  [].forEach.call(document.querySelectorAll('#pestanas button'), function(b){
    b.addEventListener('click', function(){
      vista = b.dataset.v;
      [].forEach.call(document.querySelectorAll('#pestanas button'), function(o){ o.setAttribute('aria-selected', o === b ? 'true' : 'false'); });
      pintarVista(); animarA(series(ultimo.rs), true);
    });
  });
  function pintarVista(){
    $('vistaTit').textContent = VISTAS[vista].t;
    $('leyTab').innerHTML = VISTAS[vista].ley.map(function(x){ return '<span><i style="background:' + x[0] + '"></i>' + x[1] + '</span>'; }).join('');
  }

  /* --- estado de resultados --- */
  function pintarPyG(s, rs){
    var A = s.anios, cols = '<th class="n">Año 1</th><th class="n">Año 2</th><th class="n">Año 3</th><th class="n">Año 4</th><th class="n">Año 5</th>';
    var m = function(v){ var t = dec(Math.abs(v) / 1e6, 1); return v < -0.05e6 ? '<span class="menos">−' + t + '</span>' : t; };
    var fila = function(cls, n, f){ return '<tr class="' + cls + '"><th>' + n + '</th>' + A.map(function(a){ return '<td class="n">' + f(a) + '</td>'; }).join('') + '</tr>'; };
    var sec = function(n){ return '<tr class="sec"><th colspan="6">' + n + '</th></tr>'; };
    var h = '<thead><tr><th>Millones de COP</th>' + cols + '</tr></thead><tbody>';
    h += sec('Ingresos');
    M.FUENTES.forEach(function(f){ h += fila('sub', f.n + ' <span class="chip">' + f.f + '</span>', function(a){ return m(a.ing[f.k]); }); });
    h += fila('tot', 'Total ingresos', function(a){ return m(a.ingT); });
    h += sec('Costos variables');
    M.RUBROS.filter(function(r){ return r.v; }).forEach(function(r){ h += fila('sub', r.n, function(a){ return m(a.cos[r.k]); }); });
    h += fila('tot', 'Margen bruto', function(a){ return m(a.ingT - a.var); });
    h += fila('sub', 'Margen bruto sobre ingresos', function(a){ return a.ingT > 0 ? Math.round((a.ingT - a.var) / a.ingT * 100) + ' %' : '—'; });
    h += sec('Costos fijos');
    M.RUBROS.filter(function(r){ return !r.v; }).forEach(function(r){ h += fila('sub', r.n, function(a){ return m(a.cos[r.k]); }); });
    h += fila('tot', 'Total costos fijos', function(a){ return m(a.cosT - a.var); });
    h += fila('tot', 'EBITDA', function(a){ return '<span class="' + (a.ebitda >= 0 ? 'mas' : 'menos') + '">' + (a.ebitda < 0 ? '−' : '') + dec(Math.abs(a.ebitda) / 1e6, 1) + '</span>'; });
    h += fila('sub', 'Margen EBITDA', function(a){ var g = a.ingT > 0 ? a.ebitda / a.ingT : null; return g === null ? '—' : g < -1 ? 'menor de −100 %' : Math.round(g * 100).toLocaleString('es-CO') + ' %'; });
    h += fila('tot', 'Caja acumulada al cierre', function(a){ return m(a.caja); });
    h += sec('Operación al cierre del año');
    h += fila('sub', 'Usuarios activos', function(a){ return ent(a.activos); });
    h += fila('sub', 'Usuarios registrados', function(a){ return ent(a.registrados); });
    h += fila('sub', 'Comercios aliados', function(a){ return ent(a.aliados); });
    h += fila('sub', 'Reservas en el año', function(a){ return ent(a.reservas); });
    h += fila('sub', 'Valor de las reservas (M COP)', function(a){ return dec(a.gmv / 1e6, 1); });
    $('pyg').innerHTML = h + '</tbody>';
    /* economía por usuario, año 3 */
    var a3 = rs.slice(24, 36), actProm = a3.reduce(function(x, r){ return x + r.activos; }, 0) / 12;
    var ing3 = a3.reduce(function(x, r){ return x + r.ingT; }, 0), var3 = a3.reduce(function(x, r){ return x + r.var; }, 0);
    var arpu = actProm > 0 ? ing3 / 12 / actProm : 0, mb = actProm > 0 ? (ing3 - var3) / 12 / actProm : 0;
    var cac = par.cpi * T / par.activacion, ltv = mb / par.churn;
    $('unidad').innerHTML = [
      ['Costo de un usuario activo', fmt(cac), 'pauta por instalación ÷ instalaciones que registran un vehículo'],
      ['Ingreso por activo al mes', fmt(arpu), 'promedio del año 3'],
      ['Margen bruto por activo al mes', fmt(mb), 'después de pasarela, infraestructura e ICA, año 3'],
      ['Valor de un usuario ÷ su costo', dec(cac > 0 ? ltv / cac : 0, 1) + '×', 'margen bruto mensual ÷ abandono mensual, sobre el costo de adquirirlo']
    ].map(function(u){ return '<div class="dato"><span class="etq suave">' + u[0] + '</span><b class="cifra-d num">' + u[1] + '</b><span class="fuente">' + u[2] + '</span></div>'; }).join('');
  }

  /* --- comparación y supuestos --- */
  var RES_CASOS = {};
  function calcularCasos(){
    var corte = $('corteOn').checked;
    for (var c in CASOS){ var p = Object.assign({}, CASOS[c], {corte:corte}), rs = M.correr(p); RES_CASOS[c] = {p:p, rs:rs, s:M.resumen(rs), sem:M.semaforo(p), metas:cumpleMetas(rs, p)}; }
  }
  function textoEq(s, rs){ return rs[rs.length - 1].cortado ? 'Se detiene en el mes 8' : s.equilibrio ? 'Mes ' + s.equilibrio : 'No llega en 60 meses'; }
  function pintarComparar(){
    var cs = ['pesimista', 'conservador', 'favorable'];
    var h = '<thead><tr><th></th>' + cs.map(function(c){ return '<th class="n"' + (c === caso && !personal ? ' style="color:var(--txt-1);box-shadow:inset 0 -2px 0 var(--acc-2)"' : '') + '>' + CASOSN[c] + '</th>'; }).join('') + '</tr></thead><tbody>';
    var fila = function(n, f){ return '<tr><th>' + n + '</th>' + cs.map(function(c){ return '<td class="n">' + f(RES_CASOS[c]) + '</td>'; }).join('') + '</tr>'; };
    h += fila('Ingresos año 5', function(r){ return fmtM(r.s.anios[4].ingT); });
    h += fila('EBITDA año 5', function(r){ return fmtM(r.s.anios[4].ebitda); });
    h += fila('Equilibrio', function(r){ return textoEq(r.s, r.rs); });
    h += fila('Capital necesario', function(r){ return fmtM(r.s.capital); });
    h += fila('Usuarios activos, mes 60', function(r){ return ent(r.rs[59].activos); });
    h += fila('Comercios aliados, mes 60', function(r){ return ent(r.rs[59].aliados); });
    h += fila('Metas H1 a H4 cumplidas', function(r){ return r.metas.filter(Boolean).length + ' de 4'; });
    h += fila('Métricas de corte en zona de replantear', function(r){ return r.sem.replantear + ' de 5'; });
    $('comparar').innerHTML = h + '</tbody>';
    $('comparar').querySelectorAll('thead th')[0].textContent = '';
  }
  (function(){
    var cs = ['pesimista', 'conservador', 'favorable'];
    var h = '<thead><tr><th>Supuesto</th>' + cs.map(function(c){ return '<th class="n">' + CASOSN[c] + '</th>'; }).join('') + '</tr></thead><tbody>';
    P.forEach(function(p){ h += '<tr><th>' + p.n + '</th>' + cs.map(function(c){ return '<td class="n">' + p.f(CASOS[c][p.k]) + '</td>'; }).join('') + '</tr>'; });
    $('supuestos').innerHTML = h + '<tr><th>Comercios firmados antes del lanzamiento</th>' + cs.map(function(c){ return '<td class="n">' + CASOS[c].preFirma + '</td>'; }).join('') + '</tr><tr><th>Meses sin mensualidad</th>' + cs.map(function(c){ return '<td class="n">' + CASOS[c].mesesGratis + '</td>'; }).join('') + '</tr></tbody>';
  })();

  /* --- semáforo de corte (sección Metas) --- */
  var DOM_C = {cpi:[.5, 4, 1.2, 2.5, true, function(v){ return 'US$' + dec(v, 1); }], activacion:[.2, .8, .40, .65, false, pct0], pctReserva:[0, .2, .03, .08, false, pct0], churn:[.03, .25, .08, .15, true, pct0], pctPagan:[.05, .8, .10, .30, false, pct0]};
  var DESC_C = {
    cpi:'Replantear ≥ US$2,5 (≈ $ 8.250) · escalar ≤ US$1,2 (≈ $ 3.960)',
    activacion:'Replantear ≤ 40 % · escalar ≥ 65 %',
    pctReserva:'Replantear ≤ 3 % · escalar ≥ 8 %',
    churn:'Replantear ≥ 15 % · escalar ≤ 8 %',
    pctPagan:'Replantear ≤ 10 % · escalar ≥ 30 %'
  };
  function marcas(k, pos){
    var xs = ['pesimista', 'conservador', 'favorable'].map(function(cs){ return {c:cs, x:Math.max(0, Math.min(100, pos(CASOS[cs][k])))}; });
    var et = xs.slice().sort(function(a, b){ return a.x - b.x; }), gap = 4.2;
    et.forEach(function(o, i){ o.l = o.x; if (i && o.l - et[i - 1].l < gap) o.l = et[i - 1].l + gap; });
    var exceso = et[et.length - 1].l - 98; if (exceso > 0) et.forEach(function(o){ o.l -= exceso; });
    return xs.map(function(o){ return '<i class="vas" style="left:' + o.x + '%"></i><i class="mk" title="' + CASOSN[o.c] + '" style="left:' + o.l + '%">' + o.c[0].toUpperCase() + '</i>'; }).join('');
  }
  (function(){
    var h = '';
    M.CORTE.forEach(function(c){
      var d = DOM_C[c.k], pos = function(v){ return (v - d[0]) / (d[1] - d[0]) * 100; }, a = pos(d[2]), b = pos(d[3]);
      var zonas = d[4] ? '<i class="z-esc" style="width:' + a + '%"></i><i class="z-aju" style="width:' + (b - a) + '%"></i><i class="z-rep" style="flex:1"></i>' : '<i class="z-rep" style="width:' + a + '%"></i><i class="z-aju" style="width:' + (b - a) + '%"></i><i class="z-esc" style="flex:1"></i>';
      h += '<div class="c-fila"><div class="bloque"><h3>' + c.n + '</h3><p class="fuente" style="font-size:16px;color:var(--txt-2)">' + DESC_C[c.k] + '</p></div><div class="pista" data-k="' + c.k + '"><div class="zonas">' + zonas + '</div>' +
        '<span class="umbral" style="left:' + a + '%">' + d[5](d[2]) + '</span><span class="umbral" style="left:' + b + '%">' + d[5](d[3]) + '</span>' +
        marcas(c.k, pos) + '</div></div>';
    });
    $('corte').innerHTML = h;
  })();
  function pintarCorte(){
    var cs = ['pesimista', 'conservador', 'favorable'];
    METAS.forEach(function(m, i){
      var cel = document.querySelector('.mm-cum[data-h="' + m.h + '"]');
      if (cel) cel.innerHTML = cs.map(function(c){ var ok = RES_CASOS[c].metas[i]; return '<span class="cu ' + (ok ? 'si' : 'no') + '" title="' + CASOSN[c] + (ok ? ' cumple' : ' no cumple') + '">' + c[0].toUpperCase() + '</span>'; }).join('');
    });
  }

  /* --- recálculo --- */
  var ultimo = null;
  function recalcular(){
    var rs = M.correr(par), s = M.resumen(rs), sem = salidas();
    ultimo = {rs:rs, s:s};
    $('chipPers').hidden = !personal;
    $('casoTxt').textContent = personal ? 'Personalizado sobre el caso ' + CASOSN[caso].toLowerCase() + '.' : CASOTXT[caso];
    var a5 = s.anios[4], cort = rs[59].cortado;
    contar('kIng', a5.ingT, fmtM);
    contar('kEb', a5.ebitda, fmtM, a5.ebitda < 0 ? 'neg' : 'pos');
    var mg = a5.ingT > 0 ? a5.ebitda / a5.ingT : null;
    $('kEbTxt').textContent = mg === null ? 'sin ingresos en el año 5' : mg < -1 ? 'margen menor de −100 %' : 'margen ' + Math.round(mg * 100).toLocaleString('es-CO') + ' %';
    contar('kEq', cort ? 'Corte' : s.equilibrio ? s.equilibrio : 'No llega', function(v){ return 'Mes ' + Math.round(v); });
    $('kEqTxt').textContent = cort ? 'operación detenida en el mes 8' : s.equilibrio ? 'año ' + Math.ceil(s.equilibrio / 12) + ' · 3 meses seguidos con EBITDA positivo' : 'sin 3 meses seguidos en positivo';
    contar('kCap', s.capital, fmtM);
    $('kCapTxt').textContent = 'caja mínima · mes ' + s.mesMin;
    contar('kAct', rs[59].activos, ent);
    contar('kCom', rs[59].aliados, ent);
    $('semaforo').innerHTML = '<span class="etq suave" style="align-self:center">Métricas de corte</span>' + sem.lista.map(function(x){ return '<span class="chip" title="' + x.n + '"><i style="background:' + ZONA[x.e] + '"></i>' + CORTO[x.k] + ' · ' + x.v + '</span>'; }).join('');
    pintarPyG(s, rs);
    calcularCasos(); pintarComparar(); pintarCorte();
    animarA(series(rs), false);
  }
  pintarVista();
  sincronizar();
  recalcular();
  alVer($('graf'), function(){ animarA(series(ultimo.rs), true); }, 0.3);

  /* ================= Inversión ================= */
  var SERIES = [
    {k:'claude', n:'Claude', c:'var(--ser-4)'},
    {k:'infra', n:'Software y tiendas', c:'var(--ser-1)'},
    {k:'legal', n:'S.A.S. y marca', c:'var(--n-2)'},
    {k:'comercios', n:'Salidas a firmar comercios', c:'var(--warn)'},
    {k:'pauta', n:'Pauta', c:'var(--ser-2)'},
    {k:'auxilio', n:'Auxilio de ingenieros', c:'var(--n-1)'}
  ];
  function leerAux(){ var v = +($('auxilio').value.replace(/\D/g, '')) || 0; return Math.min(10000000, Math.max(0, v)); }
  $('auxilio').addEventListener('blur', function(){ this.value = fmt(leerAux()); });
  $('auxilio').addEventListener('focus', function(){ var v = leerAux(); this.value = v ? String(v) : ''; });
  function leer(){
    return {d:$('meses3').checked ? 3 : 4, pauta:+$('pauta').value, aux:leerAux(), n:$('ing3').checked ? 3 : 2, cf:$('cloudflare').checked};
  }
  function plan(o){
    var meses = [], L = o.d + 1, total = o.d + 4;
    for (var m = 1; m <= total; m++){
      var x = {m:m, claude:0, infra:0, legal:0, comercios:0, pauta:0, auxilio:0, det:[]}, lanz = m >= L;
      x.claude = (lanz ? 100 : 300) * T; x.det.push(lanz ? 'Claude Max 5x' : 'Claude Max 20x + 5x');
      if (!o.cf){ x.infra += 20 * T; x.det.push('Vercel Pro'); }
      if (m >= o.d){ x.infra += 25 * T; x.det.push('Supabase Pro'); }
      if (lanz){ x.infra += 19 * T; x.det.push('Expo EAS Starter'); }
      if (m === 1){ x.infra += 164 * T; x.legal += 1700000; x.det.push('Apple, Google, dominio, S.A.S. y marca'); }
      if (m >= o.d - 1 && m <= o.d + 2){ x.comercios += 500000; x.det.push('salidas a firmar comercios'); }
      if (lanz){ x.pauta += o.pauta; x.det.push('pauta'); }
      if (o.aux > 0){ x.auxilio += o.aux * o.n; x.det.push('auxilio de ' + o.n + ' ingenieros'); }
      x.tot = x.claude + x.infra + x.legal + x.comercios + x.pauta + x.auxilio; x.lanz = lanz;
      meses.push(x);
    }
    return meses;
  }
  var gInv = $('grafica'), tip = $('tip'), invVisto = false;
  function pintarInv(animar){
    var o = leer(), ms = plan(o), total = ms.reduce(function(a, x){ return a + x.tot; }, 0);
    var t1 = ms.filter(function(x){ return !x.lanz; }).reduce(function(a, x){ return a + x.tot; }, 0);
    $('total').textContent = fmt(total); $('cierreTotal').textContent = fmt(total); $('cierreMeses').textContent = o.d + 4;
    $('totalTxt').textContent = o.d + ' meses de desarrollo + 4 de lanzamiento' + (o.aux > 0 ? ' · auxilio de ' + o.n + ' ingenieros' : ' · sin auxilio');
    $('t1').textContent = fmt(t1); $('t2').textContent = fmt(total - t1);
    $('t1Txt').textContent = 'Meses 1–' + o.d + ': desarrollo, tiendas, S.A.S., marca, comercial.';
    $('t2Txt').textContent = 'Meses ' + (o.d + 1) + '–' + (o.d + 4) + ': pauta, software, comercial.';
    $('leyenda').innerHTML = SERIES.filter(function(s){ return s.k !== 'auxilio' || o.aux > 0; }).map(function(s){ return '<span><i style="background:' + s.c + '"></i>' + s.n + '</span>'; }).join('') + '<span><i style="background:var(--acc-2);height:2px;vertical-align:3px"></i>Acumulado</span>';
    var W = 640, H = 300, ml = 52, mr = 60, mt = 30, mb = 34;
    var max = Math.max.apply(null, ms.map(function(x){ return x.tot; }));
    var paso = max > 20e6 ? 5e6 : max > 8e6 ? 2e6 : 1e6, tope = Math.ceil(max * 1.12 / paso) * paso;
    var y = function(v){ return mt + (H - mt - mb) * (1 - v / tope); };
    var sc = escala(0, total, 4), yA = function(v){ return mt + (H - mt - mb) * (1 - v / sc.hi); };
    var bw = (W - ml - mr) / ms.length, g = '';
    for (var v = 0; v <= tope; v += paso) g += '<line x1="' + ml + '" x2="' + (W - mr) + '" y1="' + y(v) + '" y2="' + y(v) + '" stroke="var(--linea)"/><text x="' + (ml - 7.5) + '" y="' + (y(v) + 4) + '" text-anchor="end" fill="var(--txt-3)" ' + TXT + '>' + (v === 0 ? '0' : dec(v / 1e6, 0)) + '</text>';
    sc.ts.forEach(function(v){ g += '<text x="' + (W - mr + 7.5) + '" y="' + (yA(v) + 4) + '" fill="var(--acc-2)" ' + TXT + '>' + (v === 0 ? '0' : dec(v / 1e6, 0)) + '</text>'; });
    g += '<text x="' + (W - mr + 7.5) + '" y="' + (mt - 15) + '" fill="var(--acc-2)" ' + TXT + ' font-weight="600" letter-spacing="1.76">ACUM.</text>';
    var L = o.d + 1, xL = ml + bw * (L - 1);
    g += '<line x1="' + xL + '" x2="' + xL + '" y1="' + (mt - 15) + '" y2="' + (H - mb) + '" stroke="var(--txt-3)" stroke-dasharray="3 3"/><text x="' + (xL + 6) + '" y="' + (mt - 15) + '" fill="var(--txt-2)" ' + TXT + ' font-weight="600" letter-spacing="1.76">LANZAMIENTO</text>';
    var acum = 0, pasos = [];
    ms.forEach(function(x, i){
      var x0 = ml + bw * i + bw * 0.2, w = bw * 0.6, a = 0;
      g += '<g class="mes" data-i="' + i + '" tabindex="0" role="button" aria-label="Mes ' + x.m + ': ' + fmt(x.tot) + '"><rect x="' + (ml + bw * i) + '" y="' + mt + '" width="' + bw + '" height="' + (H - mt - mb) + '" fill="transparent"/><g class="pila">';
      SERIES.forEach(function(s){ var v = x[s.k]; if (!v) return; var y1 = y(a + v), y0 = y(a); g += '<rect x="' + x0 + '" y="' + y1 + '" width="' + w + '" height="' + Math.max(0, y0 - y1) + '" fill="' + s.c + '"/>'; a += v; });
      g += '</g><text x="' + (x0 + w / 2) + '" y="' + (H - mb + 18) + '" text-anchor="middle" fill="var(--txt-3)" ' + TXT + ' font-weight="600" letter-spacing="1.76">MES ' + x.m + '</text>';
      g += '<text class="vt" x="' + (x0 + w / 2) + '" y="' + (y(x.tot) - 7.5) + '" text-anchor="middle" fill="var(--txt-2)" ' + TXT + '>' + dec(x.tot / 1e6, 2) + '</text></g>';
      var xa0 = ml + bw * i, xa1 = ml + bw * (i + 1);
      pasos.push([xa0, yA(acum)]); acum += x.tot; pasos.push([xa0, yA(acum)]); pasos.push([xa1, yA(acum)]);
    });
    g += '<polyline id="escal" fill="none" stroke="var(--acc-2)" stroke-width="2" points="' + pasos.map(function(p){ return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' ') + '"/>';
    g += '<rect id="lector" x="-5" y="-5" width="10" height="10" fill="var(--acc-2)" transform="translate(' + (W - mr) + ' ' + yA(total) + ')"/>';
    gInv.innerHTML = g;
    var cum = []; acum = 0; ms.forEach(function(x){ acum += x.tot; cum.push(acum); });
    [].forEach.call(gInv.querySelectorAll('.mes'), function(el){
      var i = +el.dataset.i, x = ms[i];
      var ver = function(){
        tip.textContent = 'Mes ' + x.m + (x.lanz ? ' · lanzamiento' : ' · desarrollo') + ': ' + fmt(x.tot) + '. Acumulado: ' + fmt(cum[i]) + '. Incluye ' + x.det.join(', ') + '.';
        $('lector').setAttribute('transform', 'translate(' + (ml + bw * (i + 1)) + ' ' + yA(cum[i]) + ')');
      };
      el.addEventListener('mouseenter', ver); el.addEventListener('focus', ver); el.addEventListener('click', ver);
    });
    if (animar && !QUIETO){
      [].forEach.call(gInv.querySelectorAll('.pila'), function(p, i){ p.style.transformOrigin = 'center ' + y(0) + 'px'; p.style.transformBox = 'view-box'; anim(p, [{transform:'scaleY(0)'}, {transform:'scaleY(1)'}], {d:620, delay:i * 70, e:'cubic-bezier(.3,1.25,.5,1)'}); });
      [].forEach.call(gInv.querySelectorAll('.vt'), function(t, i){ anim(t, [{opacity:0}, {opacity:1}], {d:300, delay:500 + i * 70}); });
      var es = $('escal'), len = es.getTotalLength ? es.getTotalLength() : 2000;
      anim(es, [{strokeDasharray:len + ' ' + len, strokeDashoffset:len}, {strokeDasharray:len + ' ' + len, strokeDashoffset:0}], {d:1400, delay:300, e:'cubic-bezier(.5,0,.3,1)'});
    }
    var dev = o.d, filas = [
      ['Claude', 'Max 20x + Max 5x × ' + dev + ' meses; luego Max 5x × 4 meses', (300 * dev + 100 * 4) * T],
      ['Vercel', o.cf ? 'Reemplazado por Cloudflare Pages (gratis)' : 'Pro, 1 puesto × ' + (dev + 4) + ' meses', o.cf ? 0 : 20 * (dev + 4) * T],
      ['Supabase', 'Gratis hasta el mes ' + (dev - 1) + '; Pro × 5 meses', 25 * 5 * T],
      ['Expo EAS', 'Gratis en el desarrollo; Starter × 4 meses', 19 * 4 * T],
      ['Apple, Google y dominio', 'US$99 + US$25 + ~US$40', 164 * T],
      ['Constitución de la S.A.S.', 'Socios jóvenes (Ley 1780 de 2016; exige más de la mitad de las acciones en socios de hasta 35 años)', 500000],
      ['Registro de marca', 'Una marca, dos clases (estimado)', 1200000],
      ['Pauta en Meta y TikTok', fmt(o.pauta) + ' × 4 meses', o.pauta * 4],
      ['Salidas a firmar comercios', 'Transporte y material, 4 meses (estimado)', 2000000]
    ];
    if (o.aux > 0) filas.push(['Auxilio de ingenieros', fmt(o.aux) + ' × ' + o.n + ' × ' + (dev + 4) + ' meses', o.aux * o.n * (dev + 4)]);
    document.querySelector('#desglose tbody').innerHTML = filas.map(function(f){ return '<tr><th>' + f[0] + '</th><td>' + f[1] + '</td><td class="n">' + fmt(f[2]) + '</td></tr>'; }).join('');
    $('desgloseTotal').textContent = fmt(filas.reduce(function(a, f){ return a + f[2]; }, 0));
    $('desgloseTit').textContent = 'Total por rubro · ' + (dev + 4) + ' meses · COP';
  }
  ['meses3', 'meses4', 'pauta', 'auxilio', 'ing2', 'ing3', 'cloudflare'].forEach(function(id){
    var el = $(id); el.addEventListener('change', function(){ pintarInv(true); });
    if (id === 'auxilio') el.addEventListener('input', function(){ pintarInv(false); });
  });
  pintarInv(false);
  alVer(gInv, function(){ pintarInv(true); }, 0.35);

  /* ================= Tacómetro del cierre ================= */
  (function(){
    var svg = $('taco'), cx = 160, cy = 170, R = 130, n = 24, a0 = -210, a1 = 30, h = '';
    for (var i = 0; i < n; i++){
      var a = (a0 + (a1 - a0) * i / (n - 1)) * Math.PI / 180, alta = i >= n - 4;
      var x = cx + R * Math.cos(a), y = cy + R * Math.sin(a);
      h += '<rect class="led' + (alta ? ' alta' : '') + (i === n - 1 ? ' tope' : '') + '" x="-4" y="-11" width="8" height="22" transform="translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ') rotate(' + ((a0 + (a1 - a0) * i / (n - 1)) + 90) + ')"/>';
    }
    ['V1', 'V2', 'V3', 'V4'].forEach(function(v, j){
      var a = (a0 + (a1 - a0) * [2, 8, 14, 19][j] / (n - 1)) * Math.PI / 180;
      h += '<text class="eje-t" x="' + (cx + (R - 30) * Math.cos(a)).toFixed(1) + '" y="' + (cy + (R - 30) * Math.sin(a) + 4).toFixed(1) + '" text-anchor="middle">' + v + '</text>';
    });
    h += '<g id="aguja"><line class="aguja" x1="' + cx + '" y1="' + cy + '" x2="' + (cx + R - 24) + '" y2="' + cy + '"/></g><rect x="' + (cx - 7.5) + '" y="' + (cy - 7.5) + '" width="15" height="15" fill="var(--txt-1)"/>';
    svg.innerHTML = h;
    var leds = [].slice.call(svg.querySelectorAll('.led')), ag = $('aguja');
    ag.style.transformOrigin = cx + 'px ' + cy + 'px'; ag.style.transformBox = 'view-box';
    function final(){ leds.forEach(function(l){ l.classList.add('on'); }); ag.style.transform = 'rotate(' + a1 + 'deg)'; }
    if (QUIETO){ final(); return; }
    ag.style.transform = 'rotate(' + a0 + 'deg)';
    alVer(svg, function(){
      leds.forEach(function(l, i){ setTimeout(function(){ l.classList.add('on'); }, 200 + i * 55); });
      ag.style.transform = 'rotate(' + a1 + 'deg)';
      ag.animate([{transform:'rotate(' + a0 + 'deg)'}, {transform:'rotate(' + (a1 + 6) + 'deg)', offset:.82}, {transform:'rotate(' + a1 + 'deg)'}], {duration:1700, delay:200, easing:'cubic-bezier(.4,0,.2,1)', fill:'backwards'});
    }, 0.5);
  })();

  /* ================= Navegación activa y progreso ================= */
  var enlaces = [].slice.call(document.querySelectorAll('.barra nav a'));
  var mapa = {comercios:'modelo', potencial:'potencial', ia:'modelo', funcionamiento:'inversion', ronda:'equipo', fuentes:'equipo'};
  if ('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(es){
      es.forEach(function(e){
        if (!e.isIntersecting) return;
        var id = mapa[e.target.id] || e.target.id;
        enlaces.forEach(function(a){
          var on = a.getAttribute('href') === '#' + id;
          a.setAttribute('aria-current', on ? 'true' : 'false');
          if (on && a.scrollIntoView && window.innerWidth < 960){ var nav = a.closest('nav'); nav.scrollTo({left:a.offsetLeft - 24, behavior:'smooth'}); }
        });
      });
    }, {rootMargin:'-40% 0px -55% 0px'});
    [].forEach.call(document.querySelectorAll('main section[id]'), function(s){ io.observe(s); });
  }
  var prog = $('progreso'), pend = false;
  function progreso(){ pend = false; var h = document.documentElement.scrollHeight - innerHeight; prog.style.transform = 'scaleX(' + (h > 0 ? Math.min(1, scrollY / h) : 0) + ')'; }
  addEventListener('scroll', function(){ if (!pend){ pend = true; requestAnimationFrame(progreso); } }, {passive:true});
  progreso();
})();
