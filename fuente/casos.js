var BASE = {lanz:5, inflacion:.04, aux:0, nAux:2, cloudflare:false, corte:false, preFirma:15, mesesGratis:2, techUsuario:80, comercial:5e5, admin:8e5, precioDest:40000, rampa:2};
var CASOS = {
 pesimista: Object.assign({}, BASE, {pauta0:3e6,pautaCrec:.10,cpi:2.5,cpiCrec:.15,org0:150,orgCrec:.02,activacion:.40,churn:.15,pctReserva:.03,frecuencia:1.1,ticket:40000,take:.10,tarifa:0,nuevos0:5,nuevosCrec:.2,churnCom:.05,mensualidad:59000,pctPagan:.10,pctDest:.05,v2:6,v3:14,v4:26,arpuRenov:76,aperturas:4,cpm:5000,arpuFin:55,arpuMkt:30,nomina0:10e6,nominaCrec:.10}),
 conservador: Object.assign({}, BASE, {pauta0:3e6,pautaCrec:.4,cpi:1.6,cpiCrec:.10,org0:300,orgCrec:.03,activacion:.5,churn:.10,pctReserva:.06,frecuencia:3,ticket:40000,take:.12,tarifa:1000,nuevos0:12,nuevosCrec:.4,churnCom:.04,mensualidad:79000,pctPagan:.25,pctDest:.08,v2:6,v3:12,v4:24,arpuRenov:150,aperturas:8,cpm:8000,arpuFin:120,arpuMkt:80,nomina0:10e6,nominaCrec:.25}),
 favorable: Object.assign({}, BASE, {pauta0:5e6,pautaCrec:.6,cpi:1.5,cpiCrec:.10,org0:400,orgCrec:.04,activacion:.6,churn:.08,pctReserva:.08,frecuencia:3.5,ticket:45000,take:.12,tarifa:1500,nuevos0:15,nuevosCrec:.5,churnCom:.03,mensualidad:99000,pctPagan:.35,pctDest:.12,v2:6,v3:10,v4:20,arpuRenov:200,aperturas:12,cpm:10000,arpuFin:200,arpuMkt:150,nomina0:15e6,nominaCrec:.7})
};
module.exports = CASOS;
