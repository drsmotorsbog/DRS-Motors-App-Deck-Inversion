/* Motor de proyecciones de la DRS Motors App. Mismo código en el deck y en las pruebas con node. */
var MODELO = (function(){
  var T = 3300;
  var FUENTES = [
    {k:'comision', n:'Comisión por reserva', f:'V1'},
    {k:'tarifa', n:'Tarifa de servicio', f:'V1'},
    {k:'mensualidad', n:'Mensualidad de comercios', f:'V1'},
    {k:'destacados', n:'Destacados en la zona', f:'V3'},
    {k:'renov', n:'SOAT, tecnomecánica e informe', f:'V2'},
    {k:'publicidad', n:'Publicidad', f:'V3'},
    {k:'financiero', n:'Crédito y seguros', f:'V3'},
    {k:'mercado', n:'Clasificados, repuestos y compraventa', f:'V4'}
  ];
  var RUBROS = [
    {k:'pasarela', n:'Pasarela de pagos', v:true},
    {k:'techVar', n:'Tecnología por usuario', v:true},
    {k:'ica', n:'ICA', v:true},
    {k:'pauta', n:'Pauta'},
    {k:'equipo', n:'Equipo'},
    {k:'tech', n:'Software fijo'},
    {k:'comercial', n:'Firma de comercios'},
    {k:'admin', n:'Contabilidad y legal'},
    {k:'unicos', n:'S.A.S., marca y tiendas'}
  ];
  function correr(p, meses){
    meses = meses || 60;
    var L = p.lanz, corte = p.corte && semaforo(p).replantear >= 3, out = [], activos = 0, aliados = 0, registrados = 0, caja = 0;
    for (var m = 1; m <= meses; m++){
      var k = m - L + 1;               /* mes en el mercado: 1 = mes del lanzamiento */
      var lanz = k >= 1, ak = lanz ? Math.floor((k - 1) / 12) : 0;
      var inf = Math.pow(1 + p.inflacion, Math.floor((m - 1) / 12));
      var r = {m:m, k:k, lanz:lanz, ing:{}, cos:{}};
      /* usuarios */
      var pauta = lanz ? p.pauta0 * Math.pow(1 + p.pautaCrec, ak) : 0;
      var cpi = p.cpi * T * Math.pow(1 + p.cpiCrec, ak);
      var inst = lanz ? pauta / cpi + p.org0 * Math.pow(1 + p.orgCrec, k - 1) : 0;
      registrados += inst * p.activacion;
      activos = activos * (1 - p.churn) + inst * p.activacion;
      var res = lanz ? p.pctReserva * (1 + (p.rampa - 1) * Math.min((k - 1) / 24, 1)) * p.frecuencia : 0;
      var reservas = activos * res;
      var gmv = reservas * p.ticket * inf;
      /* comercios */
      if (k === -1 || k === 0) aliados += p.preFirma / 2;
      else if (lanz) aliados = aliados * (1 - p.churnCom) + p.nuevos0 * Math.pow(1 + p.nuevosCrec, ak);
      /* ingresos */
      var I = r.ing;
      I.comision = gmv * p.take;
      I.tarifa = reservas * p.tarifa * inf;
      I.mensualidad = (lanz && k > p.mesesGratis) ? aliados * p.pctPagan * p.mensualidad * inf : 0;
      I.destacados = (lanz && k > p.v3) ? aliados * p.pctDest * p.precioDest * inf : 0;
      I.renov = (lanz && k > p.v2) ? activos * p.arpuRenov * inf : 0;
      I.publicidad = (lanz && k > p.v3) ? activos * p.aperturas * p.cpm / 1000 * inf : 0;
      I.financiero = (lanz && k > p.v3) ? activos * p.arpuFin * inf : 0;
      I.mercado = (lanz && k > p.v4) ? activos * p.arpuMkt * inf : 0;
      var ing = 0; for (var a in I) ing += I[a];
      /* costos */
      var C = r.cos;
      C.pasarela = (gmv + I.tarifa) * 0.0265 * 1.19 + reservas * 700 * 1.19;
      C.techVar = activos * p.techUsuario * inf;
      C.ica = ing * 0.00966;
      C.pauta = pauta;
      C.equipo = p.aux * p.nAux * (k <= 4 ? 1 : 0) + (k > 4 ? p.nomina0 * Math.pow(1 + p.nominaCrec, Math.floor((k - 5) / 12)) : 0);
      var usd = lanz ? 100 + (p.cloudflare ? 0 : 20) + 25 + 19 : 300 + (p.cloudflare ? 0 : 20) + (m >= L - 1 ? 25 : 0);
      C.tech = usd * T * (lanz ? Math.pow(1.10, ak) : 1);
      C.comercial = (k >= -1 && k <= 2) ? 500000 : (k > 4 ? p.comercial * inf : 0);
      C.admin = k > 4 ? p.admin * inf : 0;
      C.unicos = m === 1 ? 164 * T + 1700000 : ((m - 1) % 12 === 0 ? 139 * T : 0);
      if (corte && k > 4){ for (var z in I) I[z] = 0; for (var w in C) C[w] = 0; ing = 0; activos = 0; aliados = 0; reservas = 0; gmv = 0; inst = 0; pauta = 0; }
      var cos = 0; for (var b in C) cos += C[b];
      var vari = C.pasarela + C.techVar + C.ica;
      caja += ing - cos;
      r.ingT = ing; r.cosT = cos; r.var = vari; r.ebitda = ing - cos; r.caja = caja; r.cortado = corte && k > 4;
      r.activos = activos; r.registrados = registrados; r.aliados = aliados; r.reservas = reservas; r.gmv = gmv; r.inst = inst; r.pautaM = pauta; r.cpiCOP = cpi;
      out.push(r);
    }
    return out;
  }
  /* Métricas de corte del deck: valor en el umbral o peor = replantear; en el umbral de escalar o mejor = escalar. */
  var CORTE = [
    {k:'cpi', n:'Costo por instalación', rep:function(p){return p.cpi >= 2.5;}, esc:function(p){return p.cpi <= 1.2;}, v:function(p){return 'US$' + p.cpi.toLocaleString('es-CO');}},
    {k:'activacion', n:'Instalaciones que registran un vehículo', rep:function(p){return p.activacion <= .40;}, esc:function(p){return p.activacion >= .65;}, v:function(p){return Math.round(p.activacion*100) + ' %';}},
    {k:'pctReserva', n:'Usuarios activos que reservan en el mes', rep:function(p){return p.pctReserva <= .03;}, esc:function(p){return p.pctReserva >= .08;}, v:function(p){return (p.pctReserva*100).toLocaleString('es-CO',{maximumFractionDigits:1}) + ' %';}},
    {k:'churn', n:'Usuarios que dejan la app cada mes', rep:function(p){return p.churn >= .15;}, esc:function(p){return p.churn <= .08;}, v:function(p){return Math.round(p.churn*100) + ' %';}},
    {k:'pctPagan', n:'Comercios que pagan después de los meses gratis', rep:function(p){return p.pctPagan <= .10;}, esc:function(p){return p.pctPagan >= .30;}, v:function(p){return Math.round(p.pctPagan*100) + ' %';}}
  ];
  function semaforo(p){
    var n = {replantear:0, ajustar:0, escalar:0, lista:[]};
    CORTE.forEach(function(c){ var e = c.rep(p) ? 'replantear' : c.esc(p) ? 'escalar' : 'ajustar'; n[e]++; n.lista.push({k:c.k, n:c.n, v:c.v(p), e:e}); });
    return n;
  }
  function resumen(rs){
    var min = 0, mesMin = 0, eq = null, racha = 0;
    rs.forEach(function(r){
      if (r.caja < min){ min = r.caja; mesMin = r.m; }
      if (r.lanz && r.ebitda > 0){ racha++; if (racha === 3 && eq === null) eq = r.m - 2; } else racha = 0;
    });
    var anios = [];
    for (var y = 0; y < Math.ceil(rs.length / 12); y++){
      var sl = rs.slice(y * 12, y * 12 + 12), a = {ing:{}, cos:{}, ingT:0, cosT:0, var:0, ebitda:0};
      sl.forEach(function(r){
        for (var i in r.ing) a.ing[i] = (a.ing[i] || 0) + r.ing[i];
        for (var c in r.cos) a.cos[c] = (a.cos[c] || 0) + r.cos[c];
        a.ingT += r.ingT; a.cosT += r.cosT; a.var += r.var; a.ebitda += r.ebitda;
      });
      var u = sl[sl.length - 1];
      a.activos = u.activos; a.aliados = u.aliados; a.caja = u.caja; a.registrados = u.registrados;
      a.reservas = sl.reduce(function(s, r){ return s + r.reservas; }, 0);
      a.gmv = sl.reduce(function(s, r){ return s + r.gmv; }, 0);
      anios.push(a);
    }
    return {capital: -min, mesMin: mesMin, equilibrio: eq, anios: anios};
  }
  return {T:T, FUENTES:FUENTES, RUBROS:RUBROS, CORTE:CORTE, semaforo:semaforo, correr:correr, resumen:resumen};
})();
if (typeof module !== 'undefined') module.exports = MODELO;
