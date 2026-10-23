"""Arma index.html a partir de fuente/ y de la marca (Marca/ en la carpeta de DRS Motors).

Uso:  python3 herramientas/build.py
La marca no está en el repositorio: el script la busca dos carpetas arriba (DRS Motors (Claude)/Marca)
o en la ruta de la variable DRS_MARCA.
"""
import re, os, sys
R=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MARCA=os.environ.get('DRS_MARCA') or os.path.join(R,'..','..','Marca')
if not os.path.isdir(MARCA): sys.exit('No encuentro la carpeta Marca/. Pon su ruta en la variable DRS_MARCA.')
F=lambda *p: open(os.path.join(*p),encoding='utf-8').read()
src=F(R,'fuente','fuente.html')
tok=F(MARCA,'drs.tokens.css').split('\n')
i0=[i for i,l in enumerate(tok) if '1 · INVARIANTES' in l][0]-1
i1=[i for i,l in enumerate(tok) if '3 · MODO DOCUMENTO' in l][0]-1
tokens='\n'.join(tok[i0:i1])
logos=F(MARCA,'drs.logos.svg'); icos=F(MARCA,'drs.iconos.svg')
lh=re.search(r'<symbol id="logo-h-oscuro".*?</symbol>',logos,re.S).group(0)
chico=re.sub(r'\s*<text[^>]*>BOGOTÁ · COLOMBIA</text>','',lh).replace('id="logo-h-oscuro" viewBox="0 0 420 150"','id="logo-h-chico" viewBox="20 14 380 96"')
assert 'logo-h-chico' in chico and 'BOGOTÁ' not in chico
ids=['ubicacion','detailing','taller','alerta','consignacion','traspaso','certificado','runt','precio','carrito','verificado','pago','flecha','enlace-externo','horario','documento','buscar','chat']
syms=[]
for k in ids:
    m=re.search(r'<symbol id="ico-'+k+r'".*?</symbol>',icos,re.S); assert m,k; syms.append(m.group(0))
sprite=('<svg xmlns="http://www.w3.org/2000/svg" style="position:absolute;width:0;height:0;overflow:hidden" aria-hidden="true">\n'
  '<!-- Copia de Marca/drs.logos.svg y Marca/drs.iconos.svg. logo-h-chico = logo-h-oscuro sin sublabel (regla: se retira bajo 160 px). -->\n'
  +lh+'\n'+chico+'\n'+'\n'.join(syms)+'\n</svg>')
modelo=F(R,'fuente','modelo.js')+'\n'+F(R,'fuente','casos.js').replace('module.exports = CASOS;','')
app=F(R,'fuente','app.js')
out=src.replace('/*TOKENS*/',tokens).replace('<!--SPRITES-->',sprite).replace('/*MODELO*/',modelo).replace('/*APP*/',app)
for ph in ['/*TOKENS*/','<!--SPRITES-->','/*MODELO*/','/*APP*/']: assert ph not in out, ph
# Versión para GitHub Pages: documento completo. El artifact de claude.ai recibe el mismo archivo.
pagina=('<!doctype html>\n<html lang="es-CO">\n<head>\n<meta charset="utf-8">\n'
  '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
  '<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>\n'
  '</head>\n<body>\n'+out+'\n</body>\n</html>\n')
open(os.path.join(R,'index.html'),'w',encoding='utf-8').write(pagina)
print('index.html:', len(pagina.encode()), 'bytes')
