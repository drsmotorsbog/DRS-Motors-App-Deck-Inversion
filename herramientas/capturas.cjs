// Prueba en Chrome sin ventana: errores de consola, desborde lateral y el tablero.
// Uso: node herramientas/capturas.cjs <ruta a puppeteer-core>
const puppeteer=require(process.argv[2]); const path=require('path');
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const url='file://'+path.join(__dirname,'..','index.html');
(async()=>{
 const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new'});
 const p=await b.newPage(); const errs=[];
 p.on('console',m=>{if(m.type()==='error')errs.push(m.text())}); p.on('pageerror',e=>errs.push(String(e)));
 for(const [w,h,n] of [[1440,900,'computador'],[390,844,'celular']]){
  await p.setViewport({width:w,height:h}); await p.goto(url,{waitUntil:'networkidle0'}); await sleep(1500);
  const H=await p.evaluate(()=>document.documentElement.scrollHeight);
  for(let y=0;y<H;y+=h*0.6){ await p.evaluate(y=>scrollTo(0,y),y); await sleep(150); }
  console.log(n, await p.evaluate(()=>({ancho:document.documentElement.scrollWidth, ventana:document.documentElement.clientWidth})));
 }
 await p.setViewport({width:1440,height:900}); await p.goto(url,{waitUntil:'networkidle0'});
 for(const c of ['pesimista','conservador','favorable']){ await p.click('[data-caso="'+c+'"]'); await sleep(700);
  console.log(c, await p.evaluate(()=>['kIng','kEb','kEq','kCap'].map(i=>document.getElementById(i).textContent).join(' · '))); }
 console.log('errores:', errs.length ? errs : 'ninguno');
 await b.close();
})();
