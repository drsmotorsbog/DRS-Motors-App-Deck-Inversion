var M = require('../fuente/modelo.js'), C = require('../fuente/casos.js');
var f = n => (n/1e6).toFixed(1);
for (var c in C){
  var rs = M.correr(C[c]), s = M.resumen(rs);
  var c8 = rs.slice(0,8).reduce((a,r)=>a+r.cosT,0);
  console.log('\n==', c, '| costo 8 meses', Math.round(c8), '| capital', f(s.capital), 'M mes', s.mesMin, '| equilibrio', s.equilibrio);
  [3,6,12,24].forEach(k=>{var r=rs[C[c].lanz-1+k-1]; console.log('  H k='+k, 'activos', Math.round(r.activos), 'registrados', Math.round(r.registrados), 'comercios', Math.round(r.aliados), 'reservas', Math.round(r.reservas));});
  s.anios.forEach((a,i)=>console.log(' A'+(i+1), 'act', Math.round(a.activos), 'com', Math.round(a.aliados), 'ing', f(a.ingT), 'cos', f(a.cosT), 'ebitda', f(a.ebitda), 'caja', f(a.caja), '| ARPU/act/mes', Math.round(a.ingT/12/Math.max(1,a.activos))));
}
